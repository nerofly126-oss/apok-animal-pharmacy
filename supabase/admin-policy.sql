create policy "Authenticated admins can update bookings"
on public.bookings for update to authenticated using (true) with check (true);
