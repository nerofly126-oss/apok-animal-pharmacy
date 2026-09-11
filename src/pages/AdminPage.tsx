import { useEffect, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { supabase } from '../supabase';
import type { Booking } from '../supabase';
import '../admin.css';
import '../admin-functional.css';

function AdminPanel(): ReactElement {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const loadBookings = async (): Promise<void> => {
    if (!supabase) return;
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    setBookings((data as Booking[] | null) ?? []);
  };

  useEffect(() => { void loadBookings(); }, []);

  const updateStatus = async (id: string, status: Booking['status']): Promise<void> => {
    if (!supabase) return;
    await supabase.from('bookings').update({ status }).eq('id', id);
    await loadBookings();
  };

  const pending = bookings.filter((booking) => booking.status === 'pending').length;
  const confirmed = bookings.filter((booking) => booking.status === 'confirmed').length;

  return <div className="admin"><aside className="admin-side"><a href="#home" className="admin-logo">APOK<br/>DESK.</a><nav><a className="active" href="#admin">Appointments <b>{bookings.length}</b></a></nav><div className="side-user"><span>AO</span><p>Apok Admin<br/><small>Clinic Manager</small></p></div></aside><section className="admin-main"><header><div><p className="eyebrow">Booking management</p><h1>Appointments</h1></div><a href="#home">← View website</a></header><div className="metrics"><article><small>All booking requests</small><b>{bookings.length}</b><em>From your website</em></article><article><small>Pending requests</small><b>{pending}</b><em>Needs your review</em></article><article><small>Confirmed bookings</small><b>{confirmed}</b><em>Ready for the clinic</em></article></div><section className="appointments appointments-wide"><div className="panel-title"><div><p className="eyebrow">Live queue</p><h2>Booking requests</h2></div><button type="button" onClick={() => void loadBookings()}>Refresh</button></div><div className="booking-list">{bookings.length === 0 ? <p className="empty-bookings">No bookings yet. New booking requests will appear here.</p> : bookings.map((booking) => <article key={booking.id}><time>{new Date(booking.created_at).toLocaleDateString()}</time><div><b>{booking.animal_name}</b><small>{booking.owner_name} · {booking.phone}</small></div><span>{booking.service}</span><select value={booking.status} onChange={(event) => void updateStatus(booking.id, event.target.value as Booking['status'])} aria-label={`Status for ${booking.animal_name}`}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select></article>)}</div></section></section></div>;
}

export default function AdminAccess(): ReactElement {
  const [signedIn, setSignedIn] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const checkAccess = async (): Promise<void> => {
    if (!supabase) { setChecking(false); return; }
    const { data: { session } } = await supabase.auth.getSession();
    setSignedIn(Boolean(session));
    if (!session) { setAuthorized(false); setChecking(false); return; }
    const { data } = await supabase.rpc('is_admin');
    setAuthorized(data === true);
    setChecking(false);
  };

  useEffect(() => {
    void checkAccess();
    if (!supabase) return;
    const { data: listener } = supabase.auth.onAuthStateChange(() => { setChecking(true); void checkAccess(); });
    return () => listener.subscription.unsubscribe();
  }, []);

  const sendLink = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!supabase) { setMessage('Supabase configuration is missing.'); return; }
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/#admin` } });
    setMessage(error ? error.message : 'Check your email for the secure sign-in link.');
  };

  if (checking) return <main className="admin-login"><p>Checking secure access…</p></main>;
  if (signedIn && authorized) return <AdminPanel />;
  if (signedIn) return <main className="admin-login"><section><p className="eyebrow">Access restricted</p><h1>Not authorized</h1><p>This email has not been added to the APOK admin list.</p><a href="#home">← Back to website</a></section></main>;
  return <main className="admin-login"><form onSubmit={sendLink}><p className="eyebrow">Apok Animal Pharmacy</p><h1>Admin sign in</h1><p>Use an approved clinic email to receive a secure access link.</p><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><button type="submit">Send sign-in link</button>{message && <small>{message}</small>}<a href="#home">← Back to website</a></form></main>;
}
