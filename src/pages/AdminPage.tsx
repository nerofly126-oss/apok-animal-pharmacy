import { useEffect, useState } from 'react';
import type { FormEvent, MouseEvent, ReactElement } from 'react';
import { api } from '../api';
import type { Booking } from '../api';
import '../admin.css';
import '../admin-functional.css';
import '../admin-dashboard.css';
import '../admin-email.css';
import '../admin-mobile-nav.css';
import '../admin-polish.css';
import '../admin-reference.css';
import '../admin-mobile-fix.css';
import '../admin-pages.css';
import '../admin-icons.css';

function NavIcon({ name }: { name: 'overview' | 'bookings' | 'activity' | 'settings' }): ReactElement {
  const paths = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    bookings: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18M8 14h3M8 17h6"/></>,
    activity: <><path d="M3 18h18M5 15l4-5 4 3 6-8"/><circle cx="5" cy="15" r="1"/><circle cx="9" cy="10" r="1"/><circle cx="13" cy="13" r="1"/><circle cx="19" cy="5" r="1"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.1 2.1-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-3v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-2.1-2.1.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H5v-3h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.1-2.1.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h3v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.1 2.1-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v3h-.2a1.7 1.7 0 0 0-1.6 1Z"/></>,
  };
  return <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

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
  return <section className="admin-security" id="settings"><div><p className="eyebrow">Account security</p><h2>Change password</h2><p>Use at least 10 characters and keep it private.</p></div><form onSubmit={changePassword}><input name="currentPassword" type="password" placeholder="Current password" autoComplete="current-password" required /><input name="newPassword" type="password" placeholder="New password" autoComplete="new-password" minLength={10} required /><input name="confirmPassword" type="password" placeholder="Confirm new password" autoComplete="new-password" minLength={10} required /><button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Update password'}</button>{message && <small role="status">{message}</small>}</form></section>;
}

function AdminPanel(): ReactElement {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const goToSection = (event: MouseEvent<HTMLAnchorElement>, section: string): void => {
    event.preventDefault();
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadBookings = async (): Promise<void> => {
    try { setBookings(await api.bookings()); } catch { setBookings([]); }
  };

  useEffect(() => {
    void loadBookings();
    void api.notificationStatus().then((status) => setEmailEnabled(status.emailEnabled)).catch(() => setEmailEnabled(false));
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
  return <div className={`admin admin-page-${activeSection}`}><aside className="admin-side"><a href="#admin" className="admin-logo" onClick={(event) => goToSection(event, 'overview')}>APOK<br/>DESK.</a><p className="side-caption">CLINIC CONSOLE</p><nav aria-label="Admin navigation"><a className={activeSection === 'overview' ? 'active' : ''} href="#admin" onClick={(event) => goToSection(event, 'overview')}><NavIcon name="overview"/>Overview</a><a className={activeSection === 'bookings' ? 'active' : ''} href="#admin" onClick={(event) => goToSection(event, 'bookings')}><NavIcon name="bookings"/>Bookings <b>{bookings.length}</b></a><a className={activeSection === 'activity' ? 'active' : ''} href="#admin" onClick={(event) => goToSection(event, 'activity')}><NavIcon name="activity"/>Activity</a><a className={activeSection === 'settings' ? 'active' : ''} href="#admin" onClick={(event) => goToSection(event, 'settings')}><NavIcon name="settings"/>Settings</a></nav><div className="side-help"><small>QUICK STATUS</small><p><i></i> System online</p></div><div className="side-user"><span>AO</span><p>Apok Admin<br/><small>Clinic Manager</small></p></div></aside><section className="admin-main"><header className="dashboard-header" id="overview"><div><p className="eyebrow">Apok operations centre</p><h1>Good day, Admin.</h1><p className="dashboard-subtitle">Here’s what is happening with your appointments.</p></div><div className="dashboard-actions"><span className="live-indicator"><i></i> Live updates</span><a href="#home">View website ↗</a></div></header><div className="metrics"><article className="metric-card total"><small>Total requests</small><b>{bookings.length}</b><em>All time bookings</em></article><article className="metric-card pending"><small>Awaiting review</small><b>{pending}</b><em>Needs your attention</em></article><article className="metric-card confirmed"><small>Confirmed visits</small><b>{confirmed}</b><em>Ready for the clinic</em></article></div><section className={`email-alert ${emailEnabled ? 'enabled' : ''}`}><div><span className="email-icon">✉</span><div><p className="eyebrow">Booking notifications</p><h2>Email alerts {emailEnabled ? 'are active' : 'need setup'}</h2><p>{emailEnabled ? 'You will receive an email whenever a visitor sends a new booking request.' : 'Add the Resend email settings in Vercel to receive automatic booking alerts.'}</p></div></div><b>{emailEnabled ? 'Active' : 'Setup needed'}</b></section><section className="booking-chart" id="activity"><div><p className="eyebrow">Live activity</p><h2>Bookings in the last 7 days</h2><small>Refreshes automatically every 15 seconds.</small></div><div className="chart-bars">{activity.map((day) => <div key={day.label}><span title={`${day.count} bookings`} style={{ height: `${Math.max(day.count / highestActivity * 100, day.count ? 12 : 2)}%` }}></span><b>{day.count}</b><small>{day.label}</small></div>)}</div></section><section className="appointments appointments-wide" id="bookings"><div className="panel-title"><div><p className="eyebrow">Live queue</p><h2>Booking requests</h2></div><button type="button" onClick={() => void loadBookings()}>Refresh</button></div><div className="booking-list">{bookings.length === 0 ? <p className="empty-bookings">No bookings yet. New booking requests will appear here.</p> : bookings.map((booking) => <article key={booking.id}><time>{new Date(booking.created_at).toLocaleDateString()}</time><div><b>{booking.animal_name}</b><small>{booking.owner_name} · {booking.phone}</small></div><span>{booking.service}</span><select value={booking.status} onChange={(event) => void updateStatus(booking.id, event.target.value as Booking['status'])} aria-label={`Status for ${booking.animal_name}`}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select></article>)}</div></section><PasswordForm /></section></div>;
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
