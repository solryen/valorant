import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  BackHandler,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { useBaby } from "@/contexts/BabyContext";
import Colors from "@/constants/colors";
import OnboardingPartyLights from "@/components/OnboardingPartyLights";
import { getPostAuthRoute } from "@/lib/authRouting";
import { usePostHog } from "posthog-react-native";
import { getOnboardingLang, type OnboardingPaywallLanguage } from "@/lib/onboardingLanguage";
import { tOnbPw } from "@/lib/onboardingPaywallI18n";

const GOOGLE_LOGO_URI = "https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png";

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const posthog = usePostHog();
  const {
    user,
    signUpWithEmail,
    signInWithEmail,
    signInWithApple,
    signInWithGoogle,
    getSafeSession,
    refreshSubscription,
  } = useAuth();
  const { setLocalSignInState, syncFromCloud } = useBaby();
  const params = useLocalSearchParams<{ mode?: string; context?: string; authNotice?: string }>();

  const authMode = params.mode === "signup" ? "signup" : "signin";
  const context = params.context;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<OnboardingPaywallLanguage>("en");

  useEffect(() => {
    let active = true;
    (async () => {
      const saved = await getOnboardingLang(user?.id ?? null);
      if (!active) return;
      setLang(saved);
    })();
    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (params.authNotice === "no_account") {
      setError(lang === "el" ? "Δεν έχεις λογαριασμό ακόμα. Πάτησε το κουμπί παρακάτω για να ξεκινήσεις." : "You don't have an account yet. Press the button below to start.");
    }
  }, [lang, params.authNotice]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  async function waitForSessionReady(timeoutMs = 7000, intervalMs = 250) {
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeoutMs) {
      const activeSession = await getSafeSession();
      if (activeSession) return activeSession;
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    return null;
  }

  async function finalizeSignedInRoute(onboardingComplete = true) {
    await syncFromCloud();
    await setLocalSignInState({ isSignedIn: true, onboardingComplete });
    const hasAccess = await refreshSubscription();
    const activeSession = await getSafeSession();
    const route = getPostAuthRoute({
      user: activeSession?.user ?? null,
      isSubscribed: hasAccess,
      onboardingComplete,
    });
    router.replace(route);
  }

  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => false);
      return () => sub.remove();
    }, [])
  );

  async function onSuccess() {
    // Verify a real session was established — catches cancelled Google OAuth
    // and email signups awaiting confirmation (both return no error but no session).
    const activeSession = await getSafeSession();
    if (!activeSession) return;
    await finalizeSignedInRoute(authMode === "signin");
  }

  async function handleEmail() {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedPassword) {
      setError(lang === "el" ? "Συμπλήρωσε email και κωδικό." : "Please enter your email and password.");
      return;
    }
    if (trimmedPassword.length < 6) {
      setError(lang === "el" ? "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες." : "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    const response =
      authMode === "signup"
        ? await signUpWithEmail(trimmedEmail, trimmedPassword)
        : await signInWithEmail(trimmedEmail, trimmedPassword);
    setLoading(false);
    if (response.error) {
      const normalized = response.error.toLowerCase();
      if (authMode === "signup" && normalized.includes("already")) {
        setError(lang === "el" ? "Έχεις ήδη λογαριασμό. Κάνε σύνδεση." : "You already have an account. Sign in instead.");
        return;
      }
      if (authMode === "signin" && normalized.includes("invalid login credentials")) {
        setError(lang === "el" ? "Δεν βρέθηκε λογαριασμός. Δημιούργησε πρώτα έναν." : "No account found. Create one first.");
        return;
      }
      setError(response.error);
      return;
    }
    if (authMode === "signup") {
      const activeSession = await waitForSessionReady();
      if (!activeSession) {
        setError(lang === "el" ? "Δεν ολοκληρώθηκε η σύνδεση. Προσπάθησε ξανά." : "We couldn’t complete sign in. Please try again.");
        return;
      }
      posthog.identify(activeSession.user.id, { $set: { email: trimmedEmail } });
      posthog.capture("user_signed_up", { method: "email" });
      await finalizeSignedInRoute(false);
      return;
    }
    const activeSignInSession = await getSafeSession();
    if (activeSignInSession) {
      posthog.identify(activeSignInSession.user.id, { $set: { email: trimmedEmail } });
      posthog.capture("user_signed_in", { method: "email" });
    }
    await onSuccess();
  }

  async function handleApple() {
    setAppleLoading(true);
    setError(null);
    try {
      const result = await signInWithApple("signin");
      if (result.error) {
        setError(result.error);
        return;
      }
      const activeSession = await waitForSessionReady();
      if (!activeSession) {
        setError(lang === "el" ? "Δεν ολοκληρώθηκε η σύνδεση. Προσπάθησε ξανά." : "We couldn’t complete sign in. Please try again.");
        return;
      }
      posthog.identify(activeSession.user.id, { $set: { email: activeSession.user.email ?? "" } });
      posthog.capture(result.isNewUser ? "user_signed_up" : "user_signed_in", { method: "apple" });
      await finalizeSignedInRoute(result.onboardingComplete !== false);
    } finally {
      setAppleLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle("signin");
      if (result.error) {
        setError(result.error);
        return;
      }
      const activeSession = await waitForSessionReady();
      if (!activeSession) {
        setError(lang === "el" ? "Δεν ολοκληρώθηκε η σύνδεση. Προσπάθησε ξανά." : "We couldn’t complete sign in. Please try again.");
        return;
      }
      posthog.identify(activeSession.user.id, { $set: { email: activeSession.user.email ?? "" } });
      posthog.capture(result.isNewUser ? "user_signed_up" : "user_signed_in", { method: "google" });
      await finalizeSignedInRoute(result.onboardingComplete !== false);
    } finally {
      setGoogleLoading(false);
    }
  }

  function handleBackPress() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/onboarding/step1");
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <OnboardingPartyLights />
      <Pressable
        style={[styles.backBtn, { top: topPad + 8 }]}
        onPress={handleBackPress}
        hitSlop={16}
      >
        <Ionicons name="chevron-back" size={24} color={Colors.charcoal} />
      </Pressable>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 56, paddingBottom: botPad + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.dotsRow}>
            <View style={[styles.dot, { backgroundColor: Colors.spark }]} />
            <View style={[styles.dot, { backgroundColor: Colors.move }]} />
            <View style={[styles.dot, { backgroundColor: Colors.play }]} />
          </View>
          <Text style={styles.title}>
            {context === "partner"
              ? tOnbPw(lang, "signup.partnerWaiting")
              : context === "login"
              ? tOnbPw(lang, "signup.welcomeBack")
              : authMode === "signup"
              ? tOnbPw(lang, "signup.createAccount")
              : tOnbPw(lang, "signup.welcomeBack")}
          </Text>
          <Text style={styles.subtitle}>
            {context === "partner"
              ? tOnbPw(lang, "signup.partnerSub")
              : context === "login"
              ? tOnbPw(lang, "signup.welcomeSub")
              : authMode === "signup"
              ? tOnbPw(lang, "signup.createSub")
              : tOnbPw(lang, "signup.welcomeSub")}
          </Text>
        </View>

        <View style={styles.form}>
          <>
            <Pressable
              style={({ pressed }) => [styles.appleButton, { opacity: pressed ? 0.88 : 1 }]}
              onPress={handleApple}
              disabled={appleLoading}
            >
              {appleLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Ionicons name="logo-apple" size={20} color={Colors.white} />
                  <Text style={styles.appleButtonText}>{tOnbPw(lang, "signup.apple")}</Text>
                </>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.googleButton, { opacity: pressed ? 0.88 : 1 }]}
              onPress={handleGoogle}
              disabled={googleLoading}
            >
                {googleLoading ? (
                  <ActivityIndicator color={Colors.charcoal} />
                ) : (
                  <>
                    <Image source={{ uri: GOOGLE_LOGO_URI }} style={styles.googleLogo} />
                    <Text style={styles.googleButtonText}>{tOnbPw(lang, "signup.google")}</Text>
                  </>
                )}
              </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{tOnbPw(lang, "signup.or")}</Text>
              <View style={styles.dividerLine} />
            </View>
          </>

          <TextInput
            style={styles.input}
            placeholder={tOnbPw(lang, "signup.email")}
            placeholderTextColor={Colors.muted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder={tOnbPw(lang, "signup.password")}
            placeholderTextColor={Colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [styles.emailButton, { opacity: pressed ? 0.88 : 1 }]}
            onPress={handleEmail}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.emailButtonText}>
                {authMode === "signup" ? tOnbPw(lang, "signup.create") : tOnbPw(lang, "signup.signin")}
              </Text>
            )}
          </Pressable>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backBtn: {
    position: "absolute",
    left: 18,
    zIndex: 10,
    elevation: 10,
    padding: 8,
  },
  content: {
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 36,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 32,
    marginBottom: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  title: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 28,
    color: Colors.charcoal,
    lineHeight: 36,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    color: Colors.muted,
    lineHeight: 22,
  },
  form: {
    gap: 12,
  },
  appleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.charcoal,
    borderRadius: 14,
    paddingVertical: 16,
  },
  appleButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: Colors.white,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: Colors.divider,
  },
  googleLogo: {
    width: 20,
    height: 20,
  },
  googleButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: Colors.charcoal,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  dividerText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: Colors.muted,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.divider,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    color: Colors.charcoal,
  },
  errorText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: Colors.error,
    textAlign: "center",
  },
  emailButton: {
    backgroundColor: Colors.charcoal,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 4,
  },
  emailButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 17,
    color: Colors.white,
  },
});
