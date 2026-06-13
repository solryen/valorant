import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import {
  isMissingBabyDataColumnError,
  isSupabaseEnvConfigured,
  getSupabaseFunctionUrl,
  supabasePublicAnonKey,
  supabase,
  type Profile,
} from "@/lib/supabase";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import { hasActiveRevenueCatEntitlement } from "@/lib/revenuecat";
import { normalizeProfile } from "@/lib/authProfile";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthBootstrapping: boolean;
  authReady: boolean;
  profileReady: boolean;
  subscriptionReady: boolean;
  isSubscribed: boolean;
  trialStartDate: string | null;
  isTrialExpired: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithApple: (mode?: "signup" | "signin") => Promise<{
    error: string | null;
    isNewUser?: boolean;
    onboardingComplete?: boolean;
  }>;
  completeWebOAuthCallback: () => Promise<{
    error: string | null;
    isNewUser?: boolean;
    onboardingComplete?: boolean;
  }>;
  signInWithGoogle: (mode?: "signup" | "signin") => Promise<{
    error: string | null;
    isNewUser?: boolean;
    onboardingComplete?: boolean;
  }>;
  signOut: () => Promise<void>;
  deleteCurrentAccount: () => Promise<{ error: string | null }>;
  startTrial: () => Promise<void>;
  refreshSubscription: () => Promise<boolean>;
  setSubscribedStatus: (isSubscribed: boolean) => Promise<void>;
  getSafeSession: () => Promise<Session | null>;
  getSafeUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const ACCOUNT_NOT_FOUND_MESSAGE =
  "You don't have an account yet. Press the button below to start.";

function authStartupLog(step: string, payload?: unknown) {
  try {
    if (payload !== undefined) {
      console.log(`[startup][auth] ${step}`, payload);
      return;
    }
    console.log(`[startup][auth] ${step}`);
  } catch {
    // no-op
  }
}

function daysSince(dateStr: string): number {
  const ms = Date.now() - new Date(dateStr).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function extractCodeAndTokens(urlStr: string): {
  code: string | null;
  accessToken: string | null;
  refreshToken: string | null;
} {
  try {
    const callbackUrl = new URL(urlStr);
    const code = callbackUrl.searchParams.get("code");
    const queryAccess = callbackUrl.searchParams.get("access_token");
    const queryRefresh = callbackUrl.searchParams.get("refresh_token");
    const fragment = callbackUrl.hash.slice(1);
    const fragmentParams = new URLSearchParams(fragment);
    const accessToken = queryAccess ?? fragmentParams.get("access_token");
    const refreshToken = queryRefresh ?? fragmentParams.get("refresh_token");
    return { code, accessToken, refreshToken };
  } catch {
    return { code: null, accessToken: null, refreshToken: null };
  }
}

function formatAppleFullName(name?: { givenName?: string | null; familyName?: string | null } | null) {
  const given = name?.givenName?.trim() ?? "";
  const family = name?.familyName?.trim() ?? "";
  const full = `${given} ${family}`.trim();
  return full.length > 0 ? full : null;
}

function isInvalidRefreshTokenError(error: unknown): boolean {
  const message = String((error as any)?.message ?? "").toLowerCase();
  const code = String((error as any)?.code ?? "").toLowerCase();
  return (
    message.includes("invalid refresh token") ||
    message.includes("refresh_token_not_found") ||
    message.includes("invalid_grant") ||
    message.includes("refresh token not found") ||
    message.includes("token not found") ||
    message.includes("jwt expired") ||
    code === "refresh_token_not_found"
  );
}

function normalizeAuthErrorMessage(error: unknown, fallback: string): string {
  if (isInvalidRefreshTokenError(error)) {
    return "Session expired. Please sign in again.";
  }
  return String((error as any)?.message ?? fallback);
}

async function safeDismissAuthUi() {
  try {
    await WebBrowser.dismissAuthSession();
  } catch {
    // no-op
  }
  try {
    WebBrowser.dismissBrowser();
  } catch {
    // no-op
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [subscriptionReady, setSubscriptionReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscribedOverrideUserId, setSubscribedOverrideUserId] = useState<string | null>(null);
  const invalidTokenCleanupInFlight = useRef(false);
  const invalidTokenStoragePurgedRef = useRef(false);
  const isAuthBootstrapping = !(authReady && profileReady && subscriptionReady);

  function clearLocalAuthState() {
    setUser(null);
    setSession(null);
    setProfile(null);
  }

  useEffect(() => {
    setIsLoading(isAuthBootstrapping);
  }, [isAuthBootstrapping]);

  function getSupabaseProjectRef(): string | null {
    const rawUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
    if (!rawUrl) return null;
    try {
      const host = new URL(rawUrl).hostname;
      const ref = host.split(".")[0]?.trim();
      return ref || null;
    } catch {
      return null;
    }
  }

  async function purgeSupabaseAuthStorageKeys(): Promise<void> {
    if (invalidTokenStoragePurgedRef.current) return;
    invalidTokenStoragePurgedRef.current = true;
    try {
      const projectRef = getSupabaseProjectRef();
      const allKeys = await AsyncStorage.getAllKeys();

      const staticCandidates = new Set<string>([
        "supabase.auth.token",
        "supabase.auth.refreshToken",
      ]);
      if (projectRef) {
        staticCandidates.add(`sb-${projectRef}-auth-token`);
        staticCandidates.add(`sb-${projectRef}-auth-token-code-verifier`);
      }

      const dynamicCandidates = allKeys.filter((key) => {
        if (staticCandidates.has(key)) return true;
        if (projectRef && key.includes(`sb-${projectRef}`) && key.includes("auth-token")) return true;
        if (/^sb-[a-z0-9]+-auth-token/i.test(key)) return true;
        if (/^sb-[a-z0-9]+-auth-token-code-verifier/i.test(key)) return true;
        return false;
      });

      if (dynamicCandidates.length > 0) {
        await AsyncStorage.multiRemove(dynamicCandidates);
      }
    } catch {
      // no-op
    }
  }

  async function cleanupInvalidRefreshToken(): Promise<void> {
    if (invalidTokenCleanupInFlight.current) return;
    invalidTokenCleanupInFlight.current = true;
    try {
      clearLocalAuthState();
      await supabase.auth.signOut({ scope: "local" });
      await purgeSupabaseAuthStorageKeys();
    } catch {
      try {
        await supabase.auth.signOut();
      } catch {
        // no-op
      } finally {
        await purgeSupabaseAuthStorageKeys();
      }
    } finally {
      invalidTokenCleanupInFlight.current = false;
    }
  }

  async function getSafeSession(): Promise<Session | null> {
    if (!isSupabaseEnvConfigured()) return null;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        if (isInvalidRefreshTokenError(error)) {
          if (__DEV__) console.log("[auth] invalid refresh token detected in getSession");
          await cleanupInvalidRefreshToken();
          return null;
        }
        throw error;
      }
      return data.session ?? null;
    } catch (e) {
      if (isInvalidRefreshTokenError(e)) {
        if (__DEV__) console.log("[auth] invalid refresh token detected in getSession catch");
        await cleanupInvalidRefreshToken();
        return null;
      }
      if (__DEV__) console.log("[auth] getSession failed", e);
      return null;
    }
  }

  async function getSafeUser(): Promise<User | null> {
    if (!isSupabaseEnvConfigured()) return null;
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        if (isInvalidRefreshTokenError(error)) {
          if (__DEV__) console.log("[auth] invalid refresh token detected in getUser");
          await cleanupInvalidRefreshToken();
          return null;
        }
        throw error;
      }
      return data?.user ?? null;
    } catch (e) {
      if (isInvalidRefreshTokenError(e)) {
        if (__DEV__) console.log("[auth] invalid refresh token detected in getUser catch");
        await cleanupInvalidRefreshToken();
        return null;
      }
      if (__DEV__) console.log("[auth] getUser failed", e);
      return null;
    }
  }

  useEffect(() => {
    authStartupLog("bootstrap_start");
    // Fail-safe: avoid infinite loading if auth network calls stall.
    const loadingTimeout = setTimeout(() => {
      setAuthReady(true);
      setProfileReady(true);
      setSubscriptionReady(true);
      authStartupLog("bootstrap_timeout");
    }, 7000);

    if (!isSupabaseEnvConfigured()) {
      // Supabase not set up yet — proceed with no user
      authStartupLog("bootstrap_supabase_unconfigured");
      setAuthReady(true);
      setProfileReady(true);
      setSubscriptionReady(true);
      clearTimeout(loadingTimeout);
      return;
    }

    const resolveSessionState = async (nextSession: Session | null) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setAuthReady(true);

      if (!nextSession?.user) {
        setProfile(null);
        setProfileReady(true);
        setSubscriptionReady(true);
        return;
      }

      setProfileReady(false);
      setSubscriptionReady(false);
      await loadProfile(nextSession.user.id);
      setProfileReady(true);
      await refreshSubscription();
      setSubscriptionReady(true);
    };

    // onAuthStateChange handles auth changes AFTER the initial load.
    // INITIAL_SESSION is skipped here — getSession() below is the authoritative
    // bootstrap because it awaits Supabase's initializePromise, which means it
    // only resolves after AsyncStorage has been fully read (and the token
    // refreshed if needed). Relying on INITIAL_SESSION alone can fire too early
    // with a null session, causing a false logout.
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return;
      authStartupLog("auth_state_change", { event, hasSession: Boolean(session) });
      void resolveSessionState(session);
    });

    // Bootstrap: getSession() waits for AsyncStorage + token refresh before
    // resolving, so this is guaranteed to give us the real persisted session.
    (async () => {
      const bootstrapSession = await getSafeSession();
      authStartupLog("bootstrap_session_loaded", { hasSession: Boolean(bootstrapSession) });
      await resolveSessionState(bootstrapSession);
    })().catch(() => {
      setAuthReady(true);
      setProfileReady(true);
      setSubscriptionReady(true);
    });

    return () => {
      clearTimeout(loadingTimeout);
      listener.subscription.unsubscribe();
    };
  }, []);

  async function loadProfile(userId: string): Promise<Profile | null> {
    try {
      authStartupLog("profile_load_start", { userId });
      const { data, error } = await supabase
        .from("profiles")
        .select("id, trial_start_date, is_subscribed, baby_data")
        .eq("id", userId)
        .single();

      if (error && isMissingBabyDataColumnError(error)) {
        authStartupLog("profile_load_baby_data_missing");
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("profiles")
          .select("id, trial_start_date, is_subscribed")
          .eq("id", userId)
          .single();
        if (fallbackError) throw fallbackError;
        const nextProfile = fallbackData ? { ...fallbackData, baby_data: null } : null;
        const normalized = normalizeProfile(nextProfile);
        if (normalized?.wasRepaired) {
          authStartupLog("profile_repaired_in_memory", { userId, reason: "missing_or_invalid_baby_data" });
          try {
            await supabase.from("profiles").upsert({ id: userId, baby_data: normalized.baby_data });
          } catch {
            // best effort only
          }
        }
        setProfile(
          normalized
            ? {
                id: normalized.id,
                trial_start_date: normalized.trial_start_date,
                is_subscribed: normalized.is_subscribed,
                baby_data: normalized.baby_data,
              }
            : null
        );
        authStartupLog("profile_load_done", { found: Boolean(fallbackData) });
        return normalized
          ? {
              id: normalized.id,
              trial_start_date: normalized.trial_start_date,
              is_subscribed: normalized.is_subscribed,
              baby_data: normalized.baby_data,
            }
          : null;
      }

      if (error) throw error;
      const normalized = normalizeProfile(data ?? null);
      if (normalized?.wasRepaired) {
        authStartupLog("profile_repaired_in_memory", { userId, reason: "missing_or_invalid_baby_data" });
        try {
          await supabase.from("profiles").upsert({ id: userId, baby_data: normalized.baby_data });
        } catch {
          // best effort only
        }
      }
      setProfile(
        normalized
          ? {
              id: normalized.id,
              trial_start_date: normalized.trial_start_date,
              is_subscribed: normalized.is_subscribed,
              baby_data: normalized.baby_data,
            }
          : null
      );
      authStartupLog("profile_load_done", { found: Boolean(data) });
      return normalized
        ? {
            id: normalized.id,
            trial_start_date: normalized.trial_start_date,
            is_subscribed: normalized.is_subscribed,
            baby_data: normalized.baby_data,
          }
        : null;
    } catch {
      // Supabase not configured or network error — proceed without profile
      authStartupLog("profile_load_failed");
      return null;
    }
  }

  async function upsertProfile(userId: string, updates: Partial<Profile>) {
    try {
      const { error } = await supabase.from("profiles").upsert({ id: userId, ...updates });
      if (error && isMissingBabyDataColumnError(error) && "baby_data" in updates) {
        const { baby_data, ...fallbackUpdates } = updates;
        const { error: fallbackError } = await supabase
          .from("profiles")
          .upsert({ id: userId, ...fallbackUpdates });
        if (fallbackError) return;
      } else if (error) {
        return;
      }
      setProfile((prev) => {
        const merged = prev
          ? { ...prev, ...updates, baby_data: updates.baby_data ?? prev.baby_data }
          : {
              id: userId,
              trial_start_date: null,
              is_subscribed: false,
              ...updates,
              baby_data: updates.baby_data ?? null,
            };
        const normalized = normalizeProfile(merged as Profile);
        if (!normalized) return null;
        return {
          id: normalized.id,
          trial_start_date: normalized.trial_start_date,
          is_subscribed: normalized.is_subscribed,
          baby_data: normalized.baby_data,
        };
      });
    } catch {
      // Fail silently — offline or Supabase not configured
    }
  }

  async function startTrial() {
    // Get the latest user directly from Supabase (avoids React state timing issues)
    try {
      const currentUser = await getSafeUser();
      if (!currentUser) return;
      if (profile?.trial_start_date) return;
      const trial_start_date = new Date().toISOString();
      await upsertProfile(currentUser.id, { trial_start_date });
    } catch {
      // Supabase not configured
    }
  }

  async function refreshSubscription(): Promise<boolean> {
    try {
      if (!isSupabaseEnvConfigured()) return false;
      const currentUser = await getSafeUser();
      if (!currentUser) return false;

      const loadedProfile =
        profile && profile.id === currentUser.id ? profile : await loadProfile(currentUser.id);

      const hasEntitlement = await hasActiveRevenueCatEntitlement();
      if (hasEntitlement) {
        setSubscribedOverrideUserId(currentUser.id);
        await upsertProfile(currentUser.id, { is_subscribed: true });
        return true;
      }

      return Boolean(loadedProfile?.is_subscribed);
    } catch {
      // Supabase not configured
      return false;
    }
  }

  async function setSubscribedStatus(isSubscribed: boolean) {
    try {
      if (!isSupabaseEnvConfigured()) return;
      const currentUser = await getSafeUser();
      if (!currentUser) return;
      if (isSubscribed) {
        setSubscribedOverrideUserId(currentUser.id);
      } else {
        setSubscribedOverrideUserId((prev) => (prev === currentUser.id ? null : prev));
      }
      await upsertProfile(currentUser.id, { is_subscribed: isSubscribed });
    } catch {
      // Supabase not configured
    }
  }

  async function signUpWithEmail(
    email: string,
    password: string
  ): Promise<{ error: string | null }> {
    if (!isSupabaseEnvConfigured()) {
      return { error: "Sign up is temporarily unavailable. Please try again later." };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.EXPO_PUBLIC_SUPABASE_REDIRECT_URL ?? "todayler://auth",
        },
      });
      if (error) return { error: normalizeAuthErrorMessage(error, "Sign up failed.") };
      if (data.user) {
        const trial_start_date = new Date().toISOString();
        await upsertProfile(data.user.id, {
          trial_start_date,
          is_subscribed: false,
          baby_data: { onboardingComplete: false },
        });
      }
      return { error: null };
    } catch (e: any) {
      return { error: normalizeAuthErrorMessage(e, "Sign up failed.") };
    }
  }

  async function signInWithEmail(
    email: string,
    password: string
  ): Promise<{ error: string | null }> {
    if (!isSupabaseEnvConfigured()) {
      return { error: "Sign in is temporarily unavailable. Please try again later." };
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: normalizeAuthErrorMessage(error, "Sign in failed.") };
      return { error: null };
    } catch (e: any) {
      return { error: normalizeAuthErrorMessage(e, "Sign in failed.") };
    }
  }

  async function signInWithApple(mode: "signup" | "signin" = "signup"): Promise<{
    error: string | null;
    isNewUser?: boolean;
    onboardingComplete?: boolean;
  }> {
    if (__DEV__) console.log("[auth][apple] Apple login start");
    if (!isSupabaseEnvConfigured()) {
      return { error: "Apple Sign In is temporarily unavailable. Please try again later." };
    }
    if (Platform.OS !== "ios") {
      return { error: "Apple Sign In is only available on iOS." };
    }
    try {
      const AppleAuthenticationModule = await import("expo-apple-authentication");
      const AppleAuthentication: any =
        (AppleAuthenticationModule as any)?.default ?? AppleAuthenticationModule;
      if (typeof AppleAuthentication?.isAvailableAsync !== "function") {
        if (__DEV__) {
          console.log(
            "[auth][apple] Missing isAvailableAsync on module shape:",
            Object.keys(AppleAuthenticationModule as Record<string, unknown>)
          );
        }
        return {
          error:
            "Apple Sign In is unavailable in this runtime. Please use an iOS development or production build.",
        };
      }
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (__DEV__) console.log("[auth][apple] isAvailable:", isAvailable);
      if (!isAvailable) {
        return {
          error:
            "Apple Sign In is unavailable on this device/build. Please use an iOS development or production build.",
        };
      }
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const appleFullName = formatAppleFullName(credential.fullName);

      if (!credential.identityToken) {
        if (__DEV__) console.log("[auth][apple] Missing identity token");
        authStartupLog("apple_signin_missing_identity_token");
        return { error: "Apple Sign In failed. Missing identity token." };
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });
      if (error) {
        authStartupLog("apple_signin_supabase_error", error);
        if (__DEV__) console.log("[auth][apple] Supabase signInWithIdToken error:", error);
        return { error: normalizeAuthErrorMessage(error, "Apple Sign In failed.") };
      }
      if (__DEV__) console.log("[auth][apple] Supabase id token sign-in succeeded");
      return await resolvePostOAuthState(mode, appleFullName);
    } catch (e: any) {
      if (__DEV__) console.log("[auth][apple] Apple error:", e);
      if (e?.code === "ERR_REQUEST_CANCELED") {
        authStartupLog("apple_signin_cancelled");
        return { error: "Sign in was cancelled." };
      }
      authStartupLog("apple_signin_failed", e);
      return { error: normalizeAuthErrorMessage(e, "Apple Sign In failed.") };
    } finally {
      await safeDismissAuthUi();
    }
  }

  async function resolvePostOAuthState(
    mode: "signup" | "signin",
    appleFullName?: string | null
  ): Promise<{
    error: string | null;
    isNewUser?: boolean;
    onboardingComplete?: boolean;
  }> {
    if (__DEV__) authStartupLog("post_oauth_state_resolve_start", { mode });
    const currentUser = await getSafeUser();
    if (!currentUser) return { error: "Sign in failed." };

    let babyDataColumnAvailable = true;
    let existingProfile: Pick<Profile, "id" | "trial_start_date" | "is_subscribed" | "baby_data"> | null = null;
    const { data: profileWithBabyData, error: profileError } = await supabase
      .from("profiles")
      .select("id, trial_start_date, is_subscribed, baby_data")
      .eq("id", currentUser.id)
      .maybeSingle();
    if (profileError) {
      if (isMissingBabyDataColumnError(profileError)) {
        babyDataColumnAvailable = false;
        const { data: fallbackProfile, error: fallbackProfileError } = await supabase
          .from("profiles")
          .select("id, trial_start_date")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (fallbackProfileError) {
          return { error: normalizeAuthErrorMessage(fallbackProfileError, "Couldn't load your profile right now.") };
        }

        existingProfile = fallbackProfile
          ? {
              id: fallbackProfile.id,
              trial_start_date: fallbackProfile.trial_start_date,
              is_subscribed: false,
              baby_data: null,
            }
          : null;
      } else {
        return { error: normalizeAuthErrorMessage(profileError, "Couldn't load your profile right now.") };
      }
    } else {
      existingProfile = profileWithBabyData
        ? {
            id: profileWithBabyData.id,
            trial_start_date: profileWithBabyData.trial_start_date,
            is_subscribed: profileWithBabyData.is_subscribed,
            baby_data: profileWithBabyData.baby_data,
          }
        : null;
    }

    const isNewUser = !existingProfile;

    if (mode === "signin" && isNewUser) {
      await supabase.auth.signOut();
      clearLocalAuthState();
      return { error: ACCOUNT_NOT_FOUND_MESSAGE, isNewUser: true };
    }

    const existingBabyData = (existingProfile?.baby_data as Record<string, any> | null) ?? null;
    const mergedBabyData =
      appleFullName
        ? {
            ...(existingBabyData ?? {}),
            appleFullName,
            parentName: existingBabyData?.parentName ?? appleFullName,
          }
        : existingBabyData;

    if (isNewUser) {
      const trial_start_date = new Date().toISOString();
      const profileInsert = babyDataColumnAvailable
        ? {
            id: currentUser.id,
            trial_start_date,
            is_subscribed: false,
            baby_data: mergedBabyData,
          }
        : {
            id: currentUser.id,
            trial_start_date,
            is_subscribed: false,
          };
      const { error: insertError } = await supabase
        .from("profiles")
        .upsert(profileInsert as any);
      if (insertError) {
        if (isMissingBabyDataColumnError(insertError)) {
          const { error: fallbackInsertError } = await supabase
            .from("profiles")
            .upsert({ id: currentUser.id, trial_start_date, is_subscribed: false });
          if (!fallbackInsertError) {
            return { error: null, isNewUser, onboardingComplete: false };
          }
          return { error: normalizeAuthErrorMessage(fallbackInsertError, "Couldn't finish sign in right now.") };
        }
        return { error: normalizeAuthErrorMessage(insertError, "Couldn't finish sign in right now.") };
      }
    } else if (appleFullName && babyDataColumnAvailable) {
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({ id: currentUser.id, baby_data: mergedBabyData });
      if (updateError) {
        if (isMissingBabyDataColumnError(updateError)) {
          return { error: null, isNewUser, onboardingComplete: false };
        }
        return { error: normalizeAuthErrorMessage(updateError, "Couldn't update your profile right now.") };
      }
    }

    const onboardingComplete = Boolean((mergedBabyData ?? existingBabyData)?.onboardingComplete);
    if (__DEV__) {
      authStartupLog("post_oauth_state_resolve_done", {
        mode,
        userId: currentUser.id,
        isNewUser,
        onboardingComplete,
      });
    }
    return { error: null, isNewUser, onboardingComplete };
  }

  async function completeWebOAuthCallback(): Promise<{
    error: string | null;
    isNewUser?: boolean;
    onboardingComplete?: boolean;
  }> {
    if (Platform.OS !== "web") return { error: "Web callback is only available on web." };
    try {
      const callbackUrl = new URL(window.location.href);
      const code = callbackUrl.searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) return { error: normalizeAuthErrorMessage(error, "Sign in failed.") };
      } else {
        const fragment = callbackUrl.hash.slice(1);
        const fragmentParams = new URLSearchParams(fragment);
        const accessToken = fragmentParams.get("access_token");
        const refreshToken = fragmentParams.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) return { error: normalizeAuthErrorMessage(error, "Sign in failed.") };
        }
      }

      const modeParam = callbackUrl.searchParams.get("mode");
      const mode: "signup" | "signin" = modeParam === "signup" ? "signup" : "signin";
      return await resolvePostOAuthState(mode);
    } catch (e: any) {
      return { error: normalizeAuthErrorMessage(e, "Sign in failed.") };
    }
  }

  async function signInWithGoogle(mode: "signup" | "signin" = "signup"): Promise<{
    error: string | null;
    isNewUser?: boolean;
    onboardingComplete?: boolean;
  }> {
    if (!isSupabaseEnvConfigured()) {
      return { error: "Google Sign In is temporarily unavailable. Please try again later." };
    }
    try {
      const redirectTo =
        Platform.OS === "web"
          ? process.env.EXPO_PUBLIC_SUPABASE_REDIRECT_URL_WEB ??
            `${window.location.origin}/auth/callback`
          : process.env.EXPO_PUBLIC_SUPABASE_REDIRECT_URL ??
            "todayler://auth";
      const redirectWithMode =
        Platform.OS === "web"
          ? `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}mode=${mode}`
          : redirectTo;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          skipBrowserRedirect: true,
          redirectTo: redirectWithMode,
        },
      });
      if (error) return { error: normalizeAuthErrorMessage(error, "Google Sign In failed.") };
      if (!data.url) return { error: "No OAuth URL returned." };

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (result.type !== "success") {
        authStartupLog("google_signin_cancelled_or_dismissed", { type: result.type });
        return { error: "Sign in was cancelled." };
      }

      const sessionUrl = result.url ?? "";

      const { code, accessToken, refreshToken } = extractCodeAndTokens(sessionUrl);
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          authStartupLog("google_signin_exchange_failed", exchangeError);
          return { error: normalizeAuthErrorMessage(exchangeError, "Google Sign In failed.") };
        }
      } else if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionError) {
          authStartupLog("google_signin_setsession_failed", sessionError);
          return { error: normalizeAuthErrorMessage(sessionError, "Google Sign In failed.") };
        }
      } else {
        authStartupLog("google_signin_missing_callback_tokens");
        return { error: "We couldn’t complete sign in. Please try again." };
      }

      const activeSession = await getSafeSession();
      if (!activeSession) {
        authStartupLog("google_signin_no_session_after_exchange");
        return { error: "We couldn’t complete sign in. Please try again." };
      }

      const resolved = await resolvePostOAuthState(mode);
      if (resolved.error) return { error: resolved.error, isNewUser: resolved.isNewUser };
      return {
        error: null,
        isNewUser: resolved.isNewUser,
        onboardingComplete: resolved.onboardingComplete,
      };
    } catch (e: any) {
      if (e?.code === "ERR_REQUEST_CANCELED") {
        authStartupLog("google_signin_cancelled");
        return { error: "Sign in was cancelled." };
      }
      authStartupLog("google_signin_failed", e);
      return { error: normalizeAuthErrorMessage(e, "Google Sign In failed.") };
    } finally {
      await safeDismissAuthUi();
    }
  }

  async function signOut() {
    clearLocalAuthState();
    setSubscribedOverrideUserId(null);
    try {
      await safeDismissAuthUi();
    } catch {
      // no-op
    }
    try {
      // Clear local device session first so logout is immediate even offline.
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      // no-op
    }
    try {
      // Best-effort remote revoke; should not block logout completion.
      await supabase.auth.signOut();
    } catch {
      // no-op
    }
    try {
      // Force-remove any persisted auth keys to prevent silent re-hydration.
      await purgeSupabaseAuthStorageKeys();
    } catch {
      // no-op
    }
  }

  async function deleteCurrentAccount(): Promise<{ error: string | null }> {
    try {
      const activeSession = session ?? (await getSafeSession());
      const accessToken = activeSession?.access_token;
      if (!accessToken) {
        return { error: "No active session found for account deletion." };
      }

      const response = await fetch(getSupabaseFunctionUrl("delete-account"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabasePublicAnonKey,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        return { error: payload?.error ?? "Could not delete account right now." };
      }

      return { error: null };
    } catch (e) {
      return { error: normalizeAuthErrorMessage(e, "Could not delete account right now.") };
    }
  }

  const trialStartDate = profile?.trial_start_date ?? null;
  const hasSubscribedOverride =
    !!user?.id && subscribedOverrideUserId === user.id;
  const isSubscribed = hasSubscribedOverride || (profile?.is_subscribed ?? false);
  const isTrialExpired =
    !!trialStartDate && !isSubscribed && daysSince(trialStartDate) >= 3;

  const value = useMemo(
    () => ({
      user,
      session,
      isLoading,
      isAuthBootstrapping,
      authReady,
      profileReady,
      subscriptionReady,
      isSubscribed,
      trialStartDate,
      isTrialExpired,
      signUpWithEmail,
      signInWithEmail,
      signInWithApple,
      completeWebOAuthCallback,
      signInWithGoogle,
      signOut,
      deleteCurrentAccount,
      startTrial,
      refreshSubscription,
      setSubscribedStatus,
      getSafeSession,
      getSafeUser,
    }),
    [
      user,
      session,
      isLoading,
      isAuthBootstrapping,
      authReady,
      profileReady,
      subscriptionReady,
      profile,
      subscribedOverrideUserId,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
