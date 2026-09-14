import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const required = ['MONGODB_URI', 'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'JWT_SECRET'];
for (const name of required) {
  if (!process.env[name]) throw new Error(`${name} must be set before starting the server.`);
}

const app = express();
const port = Number(process.env.PORT || 3000);
const jwtSecret = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === 'production';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const adminSchema = new mongoose.Schema({ email: { type: String, unique: true, required: true }, passwordHash: { type: String, required: true } }, { timestamps: true });
const bookingSchema = new mongoose.Schema({
  owner_name: { type: String, required: true, trim: true, maxlength: 120 },
  animal_name: { type: String, required: true, trim: true, maxlength: 120 },
  phone: { type: String, required: true, trim: true, maxlength: 40 },
  service: { type: String, required: true, trim: true, maxlength: 120 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
const Admin = mongoose.model('Admin', adminSchema);
const Booking = mongoose.model('Booking', bookingSchema);

const cookieOptions = { httpOnly: true, sameSite: 'lax', secure: isProduction, maxAge: 1000 * 60 * 60 * 8, path: '/' };
const getToken = (request) => request.headers.authorization?.replace(/^Bearer\s+/i, '') || request.headers.cookie?.split('; ').find((value) => value.startsWith('apok_admin_token='))?.split('=').slice(1).join('');
const requireAdmin = async (request, response, next) => {
  try {
    request.admin = jwt.verify(getToken(request), jwtSecret);
    next();
  } catch {
    response.status(401).json({ message: 'Please sign in to continue.' });
  }
};

app.use(express.json());

app.post('/api/auth/login', async (request, response) => {
  const email = String(request.body.email || '').trim().toLowerCase();
  const password = String(request.body.password || '');
  const admin = await Admin.findOne({ email });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) return response.status(401).json({ message: 'Invalid email or password.' });
  const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, jwtSecret, { expiresIn: '8h' });
  response.cookie('apok_admin_token', token, cookieOptions).json({ admin: { email: admin.email } });
});

app.post('/api/auth/logout', (_request, response) => response.clearCookie('apok_admin_token', { httpOnly: true, sameSite: 'lax', secure: isProduction, path: '/' }).status(204).end());
app.get('/api/auth/session', requireAdmin, (request, response) => response.json({ admin: { email: request.admin.email } }));
app.post('/api/auth/change-password', requireAdmin, async (request, response) => {
  const currentPassword = String(request.body.currentPassword || '');
  const newPassword = String(request.body.newPassword || '');
  if (newPassword.length < 10) return response.status(400).json({ message: 'Your new password must be at least 10 characters.' });
  const admin = await Admin.findById(request.admin.id);
  if (!admin || !(await bcrypt.compare(currentPassword, admin.passwordHash))) return response.status(401).json({ message: 'Your current password is incorrect.' });
  admin.passwordHash = await bcrypt.hash(newPassword, 12);
  await admin.save();
  response.status(204).end();
});

app.post('/api/bookings', async (request, response) => {
  const { owner_name, animal_name, phone, service } = request.body;
  if (![owner_name, animal_name, phone, service].every((value) => typeof value === 'string' && value.trim())) return response.status(400).json({ message: 'Please complete every booking field.' });
  const booking = await Booking.create({ owner_name, animal_name, phone, service });
  response.status(201).json(booking);
});
app.get('/api/bookings', requireAdmin, async (_request, response) => response.json(await Booking.find().sort({ created_at: -1 }).lean()));
app.patch('/api/bookings/:id', requireAdmin, async (request, response) => {
  const { status } = request.body;
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) return response.status(400).json({ message: 'Invalid booking status.' });
  const booking = await Booking.findByIdAndUpdate(request.params.id, { status }, { new: true });
  if (!booking) return response.status(404).json({ message: 'Booking not found.' });
  response.json(booking);
});

app.use((error, _request, response, _next) => {
  if (error instanceof mongoose.Error.ValidationError) return response.status(400).json({ message: 'Invalid request.' });
  console.error(error);
  response.status(500).json({ message: 'Something went wrong. Please try again.' });
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/{*splat}', (_request, response) => response.sendFile(path.join(__dirname, 'dist', 'index.html')));

await mongoose.connect(process.env.MONGODB_URI);
const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
await Admin.findOneAndUpdate({ email }, { $setOnInsert: { email, passwordHash } }, { upsert: true, new: true });
console.log(`MongoDB connected; admin account ready for ${email}.`);
app.listen(port, () => console.log(`APOK server listening on port ${port}.`));
