import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load root .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const isLiveSupabaseConfigured = Boolean(
  supabaseUrl &&
  !supabaseUrl.includes('placeholder') &&
  supabaseServiceRoleKey &&
  !supabaseServiceRoleKey.includes('placeholder')
);

if (isLiveSupabaseConfigured) {
  console.log('✓ Connected to live Supabase project:', supabaseUrl);
} else {
  console.log('ℹ Supabase credentials not set or using placeholders.');
  console.log('  Running with safe local persistence. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env to connect cloud database.');
}

// Service role client for secure server-side operations (bypasses RLS safely on backend)
export const supabaseAdmin = isLiveSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Public anon client for public operations and auth verification
export const supabaseAnon = isLiveSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
