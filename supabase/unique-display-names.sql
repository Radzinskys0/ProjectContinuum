-- Optional but recommended: make display names unique (case-insensitive),
-- so nobody can impersonate another forum user. Run once in the SQL editor.
-- If it fails, two existing users already share a name (case aside); rename one and rerun.

create unique index profiles_display_name_unique
  on public.profiles (lower(display_name));
