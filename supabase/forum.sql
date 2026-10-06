-- Forum schema. Run once in the Supabase SQL editor.
-- Rules: anyone can read; logged-in users create threads/posts as themselves;
-- authors edit/delete their own; GMs (app_metadata.role = 'gm') moderate and manage topics.

-- ---------- Tables ----------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  created_at timestamptz not null default now()
);

create table public.topics (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 1 and 100),
  description text,
  created_at timestamptz not null default now()
);

create table public.threads (
  id bigint generated always as identity primary key,
  topic_id bigint not null references public.topics (id) on delete cascade,
  author_id uuid not null default auth.uid() references public.profiles (id),
  title text not null check (char_length(title) between 1 and 200),
  created_at timestamptz not null default now()
);

create table public.posts (
  id bigint generated always as identity primary key,
  thread_id bigint not null references public.threads (id) on delete cascade,
  author_id uuid not null default auth.uid() references public.profiles (id),
  body text not null check (char_length(body) between 1 and 10000),
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create index threads_topic_id_idx on public.threads (topic_id, created_at desc);
create index posts_thread_id_idx on public.posts (thread_id, created_at);

-- ---------- GM check (same rule as your todos delete policy) ----------

create function public.is_gm()
returns boolean
language sql
stable
as $$
  select coalesce((select auth.jwt() -> 'app_metadata' ->> 'role') = 'gm', false)
$$;

-- ---------- Profiles: one per user, created automatically on sign up ----------
-- Default display name is NOT derived from the email, so emails are never exposed.

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, 'user_' || substr(new.id::text, 1, 8));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill users that already exist (e.g. your test accounts)
insert into public.profiles (id, display_name)
select id, 'user_' || substr(id::text, 1, 8) from auth.users
on conflict (id) do nothing;

-- ---------- Create a thread and its first post atomically ----------
-- security invoker (default): the caller's RLS policies still apply.

create function public.create_thread(p_topic_id bigint, p_title text, p_body text)
returns bigint
language plpgsql
as $$
declare
  new_thread_id bigint;
begin
  insert into public.threads (topic_id, title) values (p_topic_id, p_title)
  returning id into new_thread_id;

  insert into public.posts (thread_id, body) values (new_thread_id, p_body);

  return new_thread_id;
end;
$$;

-- ---------- Row level security ----------

alter table public.profiles enable row level security;
alter table public.topics   enable row level security;
alter table public.threads  enable row level security;
alter table public.posts    enable row level security;

-- profiles
create policy "profiles are public" on public.profiles
  for select to anon, authenticated using (true);
create policy "users edit own profile" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- topics
create policy "topics are public" on public.topics
  for select to anon, authenticated using (true);
create policy "gm manages topics" on public.topics
  for all to authenticated using (public.is_gm()) with check (public.is_gm());

-- threads
create policy "threads are public" on public.threads
  for select to anon, authenticated using (true);
create policy "users create own threads" on public.threads
  for insert to authenticated with check (author_id = (select auth.uid()));
create policy "authors edit own threads" on public.threads
  for update to authenticated
  using (author_id = (select auth.uid())) with check (author_id = (select auth.uid()));
create policy "authors or gm delete threads" on public.threads
  for delete to authenticated
  using (author_id = (select auth.uid()) or public.is_gm());

-- posts
create policy "posts are public" on public.posts
  for select to anon, authenticated using (true);
create policy "users create own posts" on public.posts
  for insert to authenticated with check (author_id = (select auth.uid()));
create policy "authors edit own posts" on public.posts
  for update to authenticated
  using (author_id = (select auth.uid())) with check (author_id = (select auth.uid()));
create policy "authors or gm delete posts" on public.posts
  for delete to authenticated
  using (author_id = (select auth.uid()) or public.is_gm());

-- ---------- Table privileges (RLS above decides which rows) ----------

grant select on public.profiles, public.topics, public.threads, public.posts to anon, authenticated;
grant update on public.profiles to authenticated;
grant insert, update, delete on public.topics, public.threads, public.posts to authenticated;
grant execute on function public.create_thread(bigint, text, text) to authenticated;

-- ---------- Starter topics (change or delete freely) ----------

insert into public.topics (title, description) values
  ('General', 'Anything about the campaign and the world.'),
  ('Rules Questions', 'Questions about the Servant rules.');
