/**
 * BVS FASHIONS — FRONTEND SUPABASE CLIENT
 * Safe client-side Supabase integration using public anon key only.
 * Never exposes service-role keys.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isClientSupabaseConfigured = Boolean(
  supabaseUrl &&
  typeof supabaseUrl === 'string' &&
  !supabaseUrl.includes('placeholder') &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey &&
  typeof supabaseAnonKey === 'string' &&
  !supabaseAnonKey.includes('placeholder') &&
  supabaseAnonKey.length > 20
);

export const supabase: SupabaseClient | null = isClientSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
