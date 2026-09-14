import { useEffect, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { api } from '../api';
import type { Booking } from '../api';
import '../admin.css';
import '../admin-functional.css';
import '../admin-dashboard.css';

function PasswordForm(): ReactElement {
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const changePassword = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const newPassword = String(values.get('newPassword') || '');
    if (newPassword !== String(values.get('confirmPassword') || '')) { setMessage('New passwords do not match.'); return; }
    setSaving(true); setMessage('');
    try { await api.changePassword(String(values.get('currentPassword') || ''), newPassword); form.reset(); setMessage('Password changed successfully.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to change password.'); }
    finally { setSaving(false); }
  };
  return <section className="admin-security"><div><p className="eyebrow">Account security</p><h2>Change password</h2><p>Use at least 10 characters and keep it private.</p></div><form onSubmit={changePassword}><input name="currentPassword" type="password" placeholder="Current password" autoComplete="current-password" required /><input name="newPassword" type="password" placeholder="New password" autoComplete="new-password" minLength={10} required /><input name="confirmPassword" type="password" placeholder="Confirm new password" autoComplete="new-password" minLength={10} required /><button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Update password'}</button>{message && <small role="status">{message}</small>}</form></section>;
}

function AdminPanel(): ReactElement {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const loadBookings = async (): Promise<void> => {
    try { setBookings(await api.bookings()); } catch { setBookings([]); }
  };

  useEffect(() => {
    void loadBookings();
    const refreshTimer = window.setInterval(() => void loadBookings(), 15_000);
    return () => window.clearInterval(refreshTimer);
  }, []);

  const updateStatus = async (id: string, status: Booking['status']): Promise<void> => {
    await api.updateBooking(id, status);
    await loadBookings();
  };

  const pending = bookings.filter((booking) => booking.status === 'pending').length;
  const confirmed = bookings.filter((booking) => booking.status === 'confirmed').length;

  const activity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (6 - index));
    const nextDay = new Date(date); nextDay.setDate(date.getDate() + 1);
    return { label: date.toLocaleDateString(undefined, { weekday: 'short' }), count: bookings.filter((booking) => { const created = new Date(booking.created_at); return created >= date && created < nextDay; }).length };
  });
  const highestActivity = Math.max(...activity.map((day) => day.count), 1);
  return <div className="admin"><aside className="admin-side"><a href="#home" className="admin-logo">APOK<br/>DESK.</a><nav><a className="active" href="#admin">Appointments <b>{bookings.length}</b></a></nav><div className="side-user"><span>AO</span><p>Apok Admin<br/><small>Clinic Manager</small></p></div></aside><section className="admin-main"><header><div><p className="eyebrow">Booking management</p><h1>Appointments</h1></div><a href="#home">← View website</a></header><div className="metrics"><article><small>All booking requests</small><b>{bookings.length}</b><em>From your website</em></article><article><small>Pending requests</small><b>{pending}</b><em>Needs your review</em></article><article><small>Confirmed bookings</small><b>{confirmed}</b><em>Ready for the clinic</em></article></div><section className="booking-chart"><div><p className="eyebrow">Live activity</p><h2>Bookings in the last 7 days</h2><small>Refreshes automatically every 15 seconds.</small></div><div className="chart-bars">{activity.map((day) => <div key={day.label}><span title={`${day.count} bookings`} style={{ height: `${Math.max(day.count / highestActivity * 100, day.count ? 12 : 2)}%` }}></span><b>{day.count}</b><small>{day.label}</small></div>)}</div></section><section className="appointments appointments-wide"><div className="panel-title"><div><p className="eyebrow">Live queue</p><h2>Booking requests</h2></div><button type="button" onClick={() => void loadBookings()}>Refresh</button></div><div className="booking-list">{bookings.length === 0 ? <p className="empty-bookings">No bookings yet. New booking requests will appear here.</p> : bookings.map((booking) => <article key={booking.id}><time>{new Date(booking.created_at).toLocaleDateString()}</time><div><b>{booking.animal_name}</b><small>{booking.owner_name} · {booking.phone}</small></div><span>{booking.service}</span><select value={booking.status} onChange={(event) => void updateStatus(booking.id, event.target.value as Booking['status'])} aria-label={`Status for ${booking.animal_name}`}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select></article>)}</div></section><PasswordForm /></section></div>;
}

export default function AdminAccess(): ReactElement {
  const [signedIn, setSignedIn] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const checkAccess = async (): Promise<void> => {
    try {
      await api.session(); setSignedIn(true); setAuthorized(true);
    } catch {
      setSignedIn(false); setAuthorized(false);
    } finally { setChecking(false); }
  };

  useEffect(() => {
    void checkAccess();
    return undefined;
  }, []);

  const signIn = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get('password');
    try {
      await api.login(email, String(password || ''));
      setSignedIn(true); setAuthorized(true); setMessage('');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to sign in.'); }
  };

  if (checking) return <main className="admin-login"><p>Checking secure access…</p></main>;
  if (signedIn && authorized) return <AdminPanel />;
  if (signedIn) return <main className="admin-login"><section><p className="eyebrow">Access restricted</p><h1>Not authorized</h1><p>This account cannot access the APOK admin area.</p><a href="#home">← Back to website</a></section></main>;
  return <main className="admin-login"><form onSubmit={signIn}><p className="eyebrow">Apok Animal Pharmacy</p><h1>Admin sign in</h1><p>Sign in with your approved clinic account.</p><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label><label>Password<span className="password-input"><input name="password" type={showPassword ? 'text' : 'password'} required autoComplete="current-password" /><button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button></span></label><button type="submit">Sign in</button>{message && <small>{message}</small>}<a href="#home">← Back to website</a></form></main>;
}
