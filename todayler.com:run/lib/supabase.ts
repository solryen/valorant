import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function isSupabaseEnvConfigured(): boolean {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const isValidSupabaseUrl = /^https:\/\/.+/i.test(supabaseUrl);
  const isValidSupabaseKey = supabaseAnonKey.trim().length > 0;
  return isValidSupabaseUrl && isValidSupabaseKey;
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";
const hasValidSupabaseEnv = isSupabaseEnvConfigured();

const fallbackSupabaseUrl = "https://invalid.supabase.co";
const fallbackSupabaseAnonKey = "invalid-anon-key";
const resolvedSupabaseUrl = hasValidSupabaseEnv ? supabaseUrl : fallbackSupabaseUrl;
const resolvedSupabaseAnonKey = hasValidSupabaseEnv
  ? supabaseAnonKey
  : fallbackSupabaseAnonKey;

if (!hasValidSupabaseEnv && __DEV__) {
  console.warn(
    "[supabase] Missing/invalid env detected. Using safe fallback client to avoid startup crash."
  );
}

export const supabase = createClient(resolvedSupabaseUrl, resolvedSupabaseAnonKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Legacy boolean export kept for compatibility with existing call sites.
export const isSupabaseEnvConfiguredStatic = hasValidSupabaseEnv;
export const supabasePublicUrl = resolvedSupabaseUrl;
export const supabasePublicAnonKey = resolvedSupabaseAnonKey;

export function getSupabaseFunctionUrl(functionName: string): string {
  return `${resolvedSupabaseUrl.replace(/\/$/, "")}/functions/v1/${functionName}`;
}

export function getSupabaseFunctionHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    apikey: resolvedSupabaseAnonKey,
    Authorization: `Bearer ${resolvedSupabaseAnonKey}`,
  };
}

export function isMissingBabyDataColumnError(error: unknown): boolean {
  const code = (error as { code?: unknown } | null)?.code;
  const message = String(
    (error as { message?: unknown; details?: unknown } | null)?.message ??
      (error as { details?: unknown } | null)?.details ??
      ""
  ).toLowerCase();

  return (
    code === "42703" ||
    message.includes("baby_data") ||
    message.includes("profiles.baby_data")
  );
}

export type Profile = {
  id: string;
  trial_start_date: string | null;
  is_subscribed: boolean;
  baby_data: Record<string, any> | null;
};
