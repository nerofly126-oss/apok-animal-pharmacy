create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  animal_name text not null,
  phone text not null,
  service text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

create policy "Anyone can create a booking"
on public.bookings for insert to anon with check (true);

create policy "Authenticated admins can read bookings"
on public.bookings for select to authenticated using (true);

create policy "Authenticated admins can update bookings"
on public.bookings for update to authenticated using (true) with check (true);
