import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL?.trim() ??
  import.meta.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ??
  '';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ??
  import.meta.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ??
  '';
const supabaseAdminEmail =
  import.meta.env.VITE_SUPABASE_ADMIN_EMAIL?.trim().toLowerCase() ??
  import.meta.env.EXPO_PUBLIC_SUPABASE_ADMIN_EMAIL?.trim().toLowerCase() ??
  import.meta.env.ARTICLE_ADMIN_EMAIL?.trim().toLowerCase() ??
  '';
const hasSupabaseConfig = /^https?:\/\//i.test(supabaseUrl) && supabaseAnonKey.length > 0;

export const isSupabaseConfigured = hasSupabaseConfig;
export const exploreSupabaseUrl = supabaseUrl;
export const exploreSupabaseAnonKey = supabaseAnonKey;
export const exploreSupabaseAdminEmail = supabaseAdminEmail;

export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;
