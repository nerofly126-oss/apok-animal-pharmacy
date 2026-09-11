-- Replace the example addresses below with the one or two clinic emails you approve.
create table if not exists public.admin_allowlist (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.admin_allowlist enable row level security;
revoke all on table public.admin_allowlist from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_allowlist
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant execute on function public.is_admin() to authenticated;

drop policy if exists "Authenticated admins can read bookings" on public.bookings;
drop policy if exists "Authenticated admins can update bookings" on public.bookings;

create policy "Only allowlisted admins can read bookings"
on public.bookings for select to authenticated using (public.is_admin());

create policy "Only allowlisted admins can update bookings"
on public.bookings for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Approved APOK admin emails.
insert into public.admin_allowlist (email) values
  ('rudeusty@gmail.com'),
  ('nerofly126@gmail.com')
on conflict (email) do nothing;
