import AsyncStorage from "@react-native-async-storage/async-storage";

export type AppLanguage = "en" | "el";
export type AppLanguageSource = "auto" | "manual";
export type AppLanguagePreference = {
  language: AppLanguage;
  source: AppLanguageSource;
};

const LANG_KEY_PREFIX = "@todayler_app_lang_user_";
const GUEST_KEY = "@todayler_app_lang_guest";
const MANUAL_OVERRIDE_KEY_PREFIX = "@todayler_app_lang_manual_user_";
const GUEST_MANUAL_OVERRIDE_KEY = "@todayler_app_lang_manual_guest";

function normalizeLang(value: unknown): AppLanguage {
  return value === "el" ? "el" : "en";
}

function normalizeSource(value: unknown): AppLanguageSource {
  return value === "auto" ? "auto" : "manual";
}

export function getAppLanguageKey(userId?: string | null): string {
  return userId ? `${LANG_KEY_PREFIX}${userId}` : GUEST_KEY;
}

function getManualOverrideKey(userId?: string | null): string {
  return userId ? `${MANUAL_OVERRIDE_KEY_PREFIX}${userId}` : GUEST_MANUAL_OVERRIDE_KEY;
}

function normalizePreference(value: unknown): AppLanguagePreference | null {
  if (!value) return null;
  if (typeof value === "string") {
    // Legacy values were just plain "en" | "el". Treat as explicit user choice.
    return { language: normalizeLang(value), source: "manual" };
  }
  if (typeof value !== "object") return null;
  const lang = normalizeLang((value as { language?: unknown }).language);
  const source = normalizeSource((value as { source?: unknown }).source);
  return { language: lang, source };
}

export async function getAppLanguagePreference(userId?: string | null): Promise<AppLanguagePreference | null> {
  try {
    // Hard-priority manual override for this account/guest profile.
    const manualOverride = await AsyncStorage.getItem(getManualOverrideKey(userId));
    if (manualOverride) {
      const normalizedManual = normalizeLang(manualOverride);
      return { language: normalizedManual, source: "manual" };
    }

    const value = await AsyncStorage.getItem(getAppLanguageKey(userId));
    if (!value) return null;
    try {
      const parsed = JSON.parse(value);
      return normalizePreference(parsed);
    } catch {
      return normalizePreference(value);
    }
  } catch {
    return null;
  }
}

export async function getAppLanguage(userId?: string | null): Promise<AppLanguage> {
  const pref = await getAppLanguagePreference(userId);
  return pref?.language ?? "en";
}

export async function setAppLanguagePreference(
  userId: string | null | undefined,
  preference: AppLanguagePreference
): Promise<void> {
  try {
    const normalized: AppLanguagePreference = {
      language: normalizeLang(preference.language),
      source: normalizeSource(preference.source),
    };
    await AsyncStorage.setItem(getAppLanguageKey(userId), JSON.stringify(normalized));
    if (normalized.source === "manual") {
      await AsyncStorage.setItem(getManualOverrideKey(userId), normalized.language);
    } else {
      await AsyncStorage.removeItem(getManualOverrideKey(userId));
    }
  } catch {
    // no-op
  }
}

export async function setAppLanguage(
  userId: string | null | undefined,
  lang: AppLanguage,
  source: AppLanguageSource = "manual"
): Promise<void> {
  await setAppLanguagePreference(userId, { language: lang, source });
}

export async function mergeGuestLanguageToUser(userId: string): Promise<void> {
  try {
    const guestPref = await getAppLanguagePreference(null);
    if (!guestPref) return;

    const userPref = await getAppLanguagePreference(userId);
    if (userPref?.source === "manual") return;

    await setAppLanguagePreference(userId, guestPref);
  } catch {
    // no-op
  }
}
