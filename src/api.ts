export type Booking = {
  _id: string;
  id: string;
  owner_name: string;
  animal_name: string;
  phone: string;
  service: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...init.headers }, credentials: 'same-origin' });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || 'Request failed.');
  }
  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

export const api = {
  login: (email: string, password: string) => request<{ admin: { email: string } }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request<void>('/api/auth/logout', { method: 'POST' }),
  session: () => request<{ admin: { email: string } }>('/api/auth/session'),
  changePassword: (currentPassword: string, newPassword: string) => request<void>('/api/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) }),
  createBooking: (booking: Omit<Booking, '_id' | 'id' | 'status' | 'created_at'>) => request<Booking>('/api/bookings', { method: 'POST', body: JSON.stringify(booking) }),
  bookings: () => request<Booking[]>('/api/bookings'),
  updateBooking: (id: string, status: Booking['status']) => request<Booking>(`/api/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};
