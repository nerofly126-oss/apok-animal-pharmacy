import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env;
const adminSchema = new mongoose.Schema({ email: { type: String, unique: true, required: true }, passwordHash: { type: String, required: true } }, { timestamps: true });
const bookingSchema = new mongoose.Schema({
  owner_name: { type: String, required: true, trim: true, maxlength: 120 },
  animal_name: { type: String, required: true, trim: true, maxlength: 120 },
  phone: { type: String, required: true, trim: true, maxlength: 40 },
  service: { type: String, required: true, trim: true, maxlength: 120 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

let connection;
async function connectDatabase() {
  if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) throw new Error('The server environment is not configured.');
  if (!connection) connection = mongoose.connect(MONGODB_URI);
  await connection;
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await Admin.findOneAndUpdate({ email }, { $setOnInsert: { email, passwordHash } }, { upsert: true });
}

function getToken(request) {
  const headerToken = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  const cookieToken = request.headers.cookie?.split('; ').find((value) => value.startsWith('apok_admin_token='))?.split('=').slice(1).join('');
  return headerToken || cookieToken;
}
function requireAdmin(request) {
  try { return jwt.verify(getToken(request), JWT_SECRET); }
  catch { return null; }
}
function clearCookie(response) {
  response.setHeader('Set-Cookie', 'apok_admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure');
}
function setCookie(response, token) {
  response.setHeader('Set-Cookie', `apok_admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800; Secure`);
}

export default async function handler(request, response) {
  try {
    await connectDatabase();
    const path = Array.isArray(request.query.path) ? request.query.path.join('/') : request.query.path || '';
    const method = request.method;
    const body = request.body || {};

    if (method === 'POST' && path === 'auth/login') {
      const email = String(body.email || '').trim().toLowerCase();
      const admin = await Admin.findOne({ email });
      if (!admin || !(await bcrypt.compare(String(body.password || ''), admin.passwordHash))) return response.status(401).json({ message: 'Invalid email or password.' });
      const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
      setCookie(response, token);
      return response.status(200).json({ admin: { email: admin.email } });
    }
    if (method === 'POST' && path === 'auth/logout') { clearCookie(response); return response.status(204).end(); }

    const admin = requireAdmin(request);
    if (method === 'GET' && path === 'auth/session') return admin ? response.status(200).json({ admin: { email: admin.email } }) : response.status(401).json({ message: 'Please sign in to continue.' });
    if (method === 'POST' && path === 'auth/change-password') {
      if (!admin) return response.status(401).json({ message: 'Please sign in to continue.' });
      const newPassword = String(body.newPassword || '');
      if (newPassword.length < 10) return response.status(400).json({ message: 'Your new password must be at least 10 characters.' });
      const account = await Admin.findById(admin.id);
      if (!account || !(await bcrypt.compare(String(body.currentPassword || ''), account.passwordHash))) return response.status(401).json({ message: 'Your current password is incorrect.' });
      account.passwordHash = await bcrypt.hash(newPassword, 12); await account.save();
      return response.status(204).end();
    }
    if (method === 'POST' && path === 'bookings') {
      const { owner_name, animal_name, phone, service } = body;
      if (![owner_name, animal_name, phone, service].every((value) => typeof value === 'string' && value.trim())) return response.status(400).json({ message: 'Please complete every booking field.' });
      return response.status(201).json(await Booking.create({ owner_name, animal_name, phone, service }));
    }
    if (method === 'GET' && path === 'bookings') {
      if (!admin) return response.status(401).json({ message: 'Please sign in to continue.' });
      return response.status(200).json(await Booking.find().sort({ created_at: -1 }).lean());
    }
    const bookingMatch = path.match(/^bookings\/([^/]+)$/);
    if (method === 'PATCH' && bookingMatch) {
      if (!admin) return response.status(401).json({ message: 'Please sign in to continue.' });
      if (!['pending', 'confirmed', 'cancelled'].includes(body.status)) return response.status(400).json({ message: 'Invalid booking status.' });
      const booking = await Booking.findByIdAndUpdate(bookingMatch[1], { status: body.status }, { new: true });
      return booking ? response.status(200).json(booking) : response.status(404).json({ message: 'Booking not found.' });
    }
    return response.status(404).json({ message: 'Not found.' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}
