-- Pinned threads + user timeouts. Run once in the Supabase SQL editor (after forum.sql).
-- Pinning and timeouts are changed ONLY through GM-checked functions, so a normal user
-- can never pin their own thread or clear their own timeout.

-- ---------- New columns ----------

alter table public.threads  add column pinned boolean not null default false;
alter table public.profiles add column timeout_until timestamptz;

create index threads_topic_pinned_idx on public.threads (topic_id, pinned desc, created_at desc);

-- ---------- Lock down which columns regular users can write ----------
-- (Table-level insert/update is replaced with column-level, so "pinned",
--  "timeout_until" and "created_at" can't be set from the browser.)

revoke insert, update on public.threads  from authenticated;
revoke insert, update on public.posts    from authenticated;
revoke update         on public.profiles from authenticated;

grant insert (topic_id, author_id, title) on public.threads to authenticated;
grant update (title)                      on public.threads to authenticated;
grant insert (thread_id, author_id, body) on public.posts   to authenticated;
grant update (body, edited_at)            on public.posts   to authenticated;
grant update (display_name)               on public.profiles to authenticated;

-- ---------- Timeout check, enforced on creating threads and posts ----------

create function public.is_timed_out()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and timeout_until > now()
  )
$$;

drop policy "users create own threads" on public.threads;
create policy "users create own threads" on public.threads
  for insert to authenticated
  with check (author_id = (select auth.uid()) and not public.is_timed_out());

drop policy "users create own posts" on public.posts;
create policy "users create own posts" on public.posts
  for insert to authenticated
  with check (author_id = (select auth.uid()) and not public.is_timed_out());

-- ---------- GM-only functions ----------

create function public.set_thread_pinned(p_thread_id bigint, p_pinned boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_gm() then
    raise exception 'Only GMs can pin threads';
  end if;
  update public.threads set pinned = p_pinned where id = p_thread_id;
end;
$$;

create function public.timeout_user(p_user_id uuid, p_until timestamptz)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_role text;
begin
  if not public.is_gm() then
    raise exception 'Only GMs can timeout users';
  end if;

  select raw_app_meta_data ->> 'role' into target_role
  from auth.users where id = p_user_id;
  if not found then
    raise exception 'User not found';
  end if;
  if target_role = 'gm' then
    raise exception 'GMs cannot be timed out';
  end if;
  if p_until is not null and p_until <= now() then
    raise exception 'The timeout must end in the future';
  end if;

  update public.profiles set timeout_until = p_until where id = p_user_id;
end;
$$;

-- Lists every user with their GM status (the role lives in auth.users, which the browser can't read)
create function public.list_users_for_gm()
returns table (id uuid, display_name text, is_gm boolean, timeout_until timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_gm() then
    raise exception 'Only GMs can list users';
  end if;

  return query
    select p.id, p.display_name,
           coalesce(u.raw_app_meta_data ->> 'role' = 'gm', false),
           p.timeout_until
    from public.profiles p
    join auth.users u on u.id = p.id
    order by p.display_name;
end;
$$;

revoke execute on function public.set_thread_pinned(bigint, boolean) from public, anon;
revoke execute on function public.timeout_user(uuid, timestamptz)    from public, anon;
revoke execute on function public.list_users_for_gm()                from public, anon;
grant  execute on function public.set_thread_pinned(bigint, boolean) to authenticated;
grant  execute on function public.timeout_user(uuid, timestamptz)    to authenticated;
grant  execute on function public.list_users_for_gm()                to authenticated;
