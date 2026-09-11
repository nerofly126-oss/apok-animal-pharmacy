import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;

export type Booking = {
  id: string;
  owner_name: string;
  animal_name: string;
  phone: string;
  service: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
};
