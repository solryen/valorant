import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname, router } from "expo-router";
import { BlurView } from "expo-blur";
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useBaby } from "@/contexts/BabyContext";
import { useAppLanguage } from "@/contexts/AppLanguageContext";
import Colors from "@/constants/colors";
import { hapticClose, hapticSelection, hapticSuccess } from "@/lib/haptics";
import type { AppLanguage } from "@/lib/appLanguage";

const TUTORIAL_SEEN_KEY_PREFIX = "@todayler_tutorial_seen_v1_user_";

type TutorialRoute =
  | "/(tabs)"
  | "/(tabs)/track"
  | "/(tabs)/mia"
  | "/(tabs)/moments"
  | "/(tabs)/explore"
  | "/(tabs)/explore-more";
type TutorialTargetId =
  | "tab-home"
  | "tab-track"
  | "tab-mia"
  | "tab-chapters"
  | "home-activities"
  | "home-explore-more"
  | "ask-mia"
  | "tonights-story"
  | "track-calendar"
  | "track-quick-log"
  | "track-voice-capture"
  | "track-timeline"
  | "mia-chat"
  | "chapters-hero"
  | "chapters-milestones"
  | "todayler-card"
  | "explore-activities";

type TargetRect = { x: number; y: number; width: number; height: number };

type TutorialStep = {
  id: string;
  route: TutorialRoute;
  targetId: TutorialTargetId;
  text: { en: string; el: string };
};

type TargetRegistration = {
  measure: () => Promise<TargetRect | null>;
  ensureVisible?: () => Promise<void> | void;
};

type AppTutorialContextValue = {
  isTutorialActive: boolean;
  currentStepIndex: number;
  startTutorial: (force?: boolean) => Promise<void>;
  replayTutorial: () => Promise<void>;
  nextStep: () => void;
  skipTutorial: () => void;
  registerTarget: (id: TutorialTargetId, registration: TargetRegistration) => void;
  unregisterTarget: (id: TutorialTargetId) => void;
  refreshCurrentStep: () => void;
  currentTargetId: TutorialTargetId | null;
};

const AppTutorialContext = createContext<AppTutorialContextValue | null>(null);

const STEPS: TutorialStep[] = [
  {
    id: "home-today",
    route: "/(tabs)",
    targetId: "home-activities",
    text: {
      en: "✨ TODAY'S THREE: daily ideas tailored to your baby's age.",
      el: "✨ ΟΙ ΤΡΕΙΣ ΤΗΣ ΗΜΕΡΑΣ: καθημερινές ιδέες προσαρμοσμένες στην ηλικία του μωρού σου.",
    },
  },
  {
    id: "home-explore-more",
    route: "/(tabs)",
    targetId: "home-explore-more",
    text: {
      en: "🔎 Explore More Ideas: longer activities for days when you have extra time.",
      el: "🔎 Εξερεύνησε περισσότερες ιδέες: δραστηριότητες μεγαλύτερης διάρκειας για όταν έχεις περισσότερο χρόνο.",
    },
  },
  {
    id: "home-story",
    route: "/(tabs)",
    targetId: "tonights-story",
    text: {
      en: "🌙 Night story time: your baby is the HERO every day.",
      el: "🌙 Ώρα για βραδινό παραμύθι: το μωρό σου είναι ο ΗΡΩΑΣ κάθε μέρα.",
    },
  },
  {
    id: "track-calendar",
    route: "/(tabs)/track",
    targetId: "track-calendar",
    text: {
      en: "📅 Calendar opens your day/week journey view.",
      el: "📅 Το ημερολόγιο ανοίγει την προβολή της ημέρας και της εβδομάδας σου.",
    },
  },
  {
    id: "track-quick",
    route: "/(tabs)/track",
    targetId: "track-quick-log",
    text: {
      en: "⚡ Quick Log saves moments fast. Tap + for more options.",
      el: "⚡ Η Γρήγορη καταγραφή αποθηκεύει στιγμές άμεσα. Πάτησε το + για περισσότερες επιλογές.",
    },
  },
  {
    id: "track-voice",
    route: "/(tabs)/track",
    targetId: "track-voice-capture",
    text: {
      en: "🎤 Speak naturally, review suggested logs, then save when ready.",
      el: "🎤 Μίλα φυσικά, έλεγξε τις προτεινόμενες καταγραφές και αποθήκευσε όταν είσαι έτοιμη.",
    },
  },
  {
    id: "track-timeline",
    route: "/(tabs)/track",
    targetId: "track-timeline",
    text: {
      en: "🧾 Timeline shows all logs in one clear place.",
      el: "🧾 Το χρονολόγιο δείχνει όλες τις καταγραφές σου σε ένα καθαρό σημείο.",
    },
  },
  {
    id: "mia-intro",
    route: "/(tabs)/mia",
    targetId: "mia-chat",
    text: {
      en: "💬 This is Mία. Ask any question and get clear support for right now.",
      el: "💬 Αυτή είναι η Mία. Ρώτησέ τη ό,τι θέλεις και πάρε ξεκάθαρη βοήθεια για τώρα.",
    },
  },
  {
    id: "chapters-hero",
    route: "/(tabs)/moments",
    targetId: "chapters-hero",
    text: {
      en: "📖 Chapters show your baby's stage. Milestones update every 2 weeks.",
      el: "📖 Τα Κεφάλαια δείχνουν το στάδιο του μωρού σου. Τα ορόσημα ενημερώνονται κάθε 2 εβδομάδες.",
    },
  },
  {
    id: "chapters-milestones",
    route: "/(tabs)/moments",
    targetId: "chapters-milestones",
    text: {
      en: "🧩 This stage milestones: scroll here to see what to support right now.",
      el: "🧩 Ορόσημα αυτού του σταδίου: κύλησε εδώ για να δεις τι να υποστηρίξεις τώρα.",
    },
  },
  {
    id: "chapters-card",
    route: "/(tabs)/moments",
    targetId: "todayler-card",
    text: {
      en: "🎉 Create a Todayler Card from today's progress.",
      el: "🎉 Δημιούργησε μια Κάρτα Todayler από τη σημερινή πρόοδο.",
    },
  },
];

const HOME_PATHS = new Set(["/(tabs)", "/(tabs)/index"]);

function routesMatch(pathname: string, route: TutorialRoute): boolean {
  if (route === "/(tabs)") return HOME_PATHS.has(pathname);
  return pathname === route;
}

function tutorialDebug(step: string, payload?: Record<string, unknown>) {
  if (!__DEV__) return;
  try {
    if (payload) {
      console.log(`[tutorial] ${step}`, payload);
      return;
    }
    console.log(`[tutorial] ${step}`);
  } catch {
    // no-op
  }
}

function tabTargetForRoute(route: TutorialRoute): TutorialTargetId | null {
  if (route === "/(tabs)") return "tab-home";
  if (route === "/(tabs)/track") return "tab-track";
  if (route === "/(tabs)/mia") return "tab-mia";
  if (route === "/(tabs)/moments" || route === "/(tabs)/explore" || route === "/(tabs)/explore-more") {
    return "tab-chapters";
  }
  return null;
}

export function AppTutorialProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { baby } = useBaby();
  const { user } = useAuth();
  const { language } = useAppLanguage();
  const rawRole = (baby?.caregiverRole || baby?.parentType || "").toLowerCase().trim();
  const roleMode: "feminine" | "masculine" | "neutral" =
    rawRole === "mom" || rawRole === "mum"
      ? "feminine"
      : rawRole === "dad"
        ? "masculine"
        : "neutral";
  const [hasSeenTutorial, setHasSeenTutorial] = useState<boolean | null>(null);
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [measureNonce, setMeasureNonce] = useState(0);
  const registrationsRef = useRef<Partial<Record<TutorialTargetId, TargetRegistration>>>({});
  const tutorialSeenKey = useMemo(
    () => (user?.id ? `${TUTORIAL_SEEN_KEY_PREFIX}${user.id}` : null),
    [user?.id]
  );

  useEffect(() => {
    let active = true;
    (async () => {
      if (!tutorialSeenKey) {
        if (active) setHasSeenTutorial(true);
        return;
      }
      const seen = await AsyncStorage.getItem(tutorialSeenKey);
      if (!active) return;
      setHasSeenTutorial(seen === "1");
    })();
    return () => {
      active = false;
    };
  }, [tutorialSeenKey]);

  const currentStep = STEPS[currentStepIndex] ?? null;
  const currentTargetId = currentStep?.targetId ?? null;

  const navigateToStepRoute = useCallback(async (step: TutorialStep) => {
    if (!routesMatch(pathname, step.route)) {
      router.replace(step.route);
      tutorialDebug("step_route_ready", { stepId: step.id, route: step.route, changed: true });
      await new Promise((resolve) => setTimeout(resolve, 320));
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
      return;
    }
    tutorialDebug("step_route_ready", { stepId: step.id, route: step.route, changed: false });
  }, [pathname]);

  const ensureAndRefreshStep = useCallback(async (stepIndex: number) => {
    const step = STEPS[stepIndex];
    if (!step || !isTutorialActive) return;

    const viewportHeight = Dimensions.get("window").height;
    const visibleBottom = Math.max(120, viewportHeight - 120);
    const isRectVisible = (rect: TargetRect | null) => {
      if (!rect) return false;
      const rectTop = rect.y;
      const rectBottom = rect.y + rect.height;
      return rectTop >= 8 && rectBottom <= visibleBottom;
    };

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const registration = registrationsRef.current[step.targetId];
      if (!registration) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        continue;
      }
      if (registration.ensureVisible) {
        tutorialDebug("ensure_visible_run", { stepId: step.id, attempt });
        await Promise.resolve(registration.ensureVisible());
        await new Promise((resolve) => setTimeout(resolve, 220));
      }
      const rect = await registration.measure();
      tutorialDebug("target_measured", {
        stepId: step.id,
        attempt,
        hasRect: Boolean(rect),
        rect: rect ?? null,
      });
      if (isRectVisible(rect) || !registration.ensureVisible) {
        void hapticSelection();
        break;
      }
    }

    setMeasureNonce((v) => v + 1);
  }, [isTutorialActive]);

  const finishTutorial = useCallback(async () => {
    setIsTutorialActive(false);
    setCurrentStepIndex(0);
    setHasSeenTutorial(true);
    void hapticSuccess();
    if (tutorialSeenKey) {
      await AsyncStorage.setItem(tutorialSeenKey, "1");
    }
    router.replace("/(tabs)?tutorialTop=1" as any);
  }, [tutorialSeenKey]);

  const startTutorial = useCallback(async (force = false) => {
    if (!force && hasSeenTutorial) return;
    setCurrentStepIndex(0);
    setIsTutorialActive(true);
    const first = STEPS[0];
    await navigateToStepRoute(first);
    await ensureAndRefreshStep(0);
  }, [ensureAndRefreshStep, hasSeenTutorial, navigateToStepRoute]);

  const replayTutorial = useCallback(async () => {
    if (!tutorialSeenKey) return;
    await AsyncStorage.removeItem(tutorialSeenKey);
    setHasSeenTutorial(false);
    setCurrentStepIndex(0);
    setIsTutorialActive(false);
    router.replace("/(tabs)");
    await new Promise((resolve) => setTimeout(resolve, 40));
    await startTutorial(true);
  }, [startTutorial, tutorialSeenKey]);

  const nextStep = useCallback(() => {
    void (async () => {
      if (!isTutorialActive) return;
      const nextIndex = currentStepIndex + 1;
      if (nextIndex >= STEPS.length) {
        await finishTutorial();
        return;
      }
      setCurrentStepIndex(nextIndex);
      const step = STEPS[nextIndex];
      await navigateToStepRoute(step);
      await ensureAndRefreshStep(nextIndex);
    })();
  }, [currentStepIndex, ensureAndRefreshStep, finishTutorial, isTutorialActive, navigateToStepRoute]);

  const skipTutorial = useCallback(() => {
    void hapticClose();
    void finishTutorial();
  }, [finishTutorial]);

  const registerTarget = useCallback((id: TutorialTargetId, registration: TargetRegistration) => {
    registrationsRef.current[id] = registration;
    setMeasureNonce((v) => v + 1);
  }, []);

  const unregisterTarget = useCallback((id: TutorialTargetId) => {
    delete registrationsRef.current[id];
  }, []);

  const refreshCurrentStep = useCallback(() => {
    setMeasureNonce((v) => v + 1);
  }, []);

  useEffect(() => {
    if (hasSeenTutorial === null || hasSeenTutorial) return;
    if (!user || !baby?.onboardingComplete || isTutorialActive) return;
    if (!pathname.startsWith("/(tabs)")) return;
    void startTutorial(false);
  }, [baby?.onboardingComplete, hasSeenTutorial, isTutorialActive, pathname, startTutorial, user]);

  useEffect(() => {
    if (!isTutorialActive) return;
    setMeasureNonce((v) => v + 1);
  }, [isTutorialActive, pathname]);

  const value = useMemo<AppTutorialContextValue>(
    () => ({
      isTutorialActive,
      currentStepIndex,
      startTutorial,
      replayTutorial,
      nextStep,
      skipTutorial,
      registerTarget,
      unregisterTarget,
      refreshCurrentStep,
      currentTargetId,
    }),
    [
      isTutorialActive,
      currentStepIndex,
      startTutorial,
      replayTutorial,
      nextStep,
      skipTutorial,
      registerTarget,
      unregisterTarget,
      refreshCurrentStep,
      currentTargetId,
    ]
  );

  return (
    <AppTutorialContext.Provider value={value}>
      {children}
      <TutorialCoachmarkOverlay
        isActive={isTutorialActive}
        step={currentStep}
        stepIndex={currentStepIndex}
        totalSteps={STEPS.length}
        language={language}
        roleMode={roleMode}
        measureNonce={measureNonce}
        registrationsRef={registrationsRef}
        onContinue={nextStep}
        onSkip={skipTutorial}
      />
    </AppTutorialContext.Provider>
  );
}

function TutorialCoachmarkOverlay({
  isActive,
  step,
  stepIndex,
  totalSteps,
  language,
  roleMode,
  measureNonce,
  registrationsRef,
  onContinue,
  onSkip,
}: {
  isActive: boolean;
  step: TutorialStep | null;
  stepIndex: number;
  totalSteps: number;
  language: AppLanguage;
  roleMode: "feminine" | "masculine" | "neutral";
  measureNonce: number;
  registrationsRef: React.MutableRefObject<Partial<Record<TutorialTargetId, TargetRegistration>>>;
  onContinue: () => void;
  onSkip: () => void;
}) {
  const [rect, setRect] = useState<TargetRect | null>(null);
  const [tabRect, setTabRect] = useState<TargetRect | null>(null);
  const insets = useSafeAreaInsets();
  const clearBottomHeight = 74 + Math.max(insets.bottom, 10);
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const isLastStep = stepIndex >= totalSteps - 1;
  const stepSignature = `${step?.id ?? "none"}:${rect?.x ?? -1}:${rect?.y ?? -1}:${rect?.width ?? -1}:${rect?.height ?? -1}`;
  const stepText = useMemo(() => {
    if (!step) return "";
    let text = step.text[language];
    if (language === "el") {
      if (roleMode === "masculine") {
        text = text.replace("όταν είσαι έτοιμη", "όταν είσαι έτοιμος");
      } else if (roleMode === "neutral") {
        text = text.replace("όταν είσαι έτοιμη", "όταν θελήσεις");
      }
    }
    return text;
  }, [language, roleMode, step]);
  const skipLabel = language === "el" ? "Παράλειψη οδηγού" : "Skip tutorial";
  const continueLabel = language === "el" ? "Συνέχεια" : "Continue";
  const startLabel = language === "el" ? "Έναρξη" : "Start";

  useEffect(() => {
    let active = true;
    setRect(null);
    setTabRect(null);
    if (!isActive || !step) {
      setRect(null);
      return;
    }
    const registration = registrationsRef.current[step.targetId];
    if (!registration) return;
    (async () => {
      let measured: TargetRect | null = null;
      for (let i = 0; i < 12; i += 1) {
        measured = await registration.measure();
        if (measured) break;
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
      if (!active) return;
      setRect(measured);
      tutorialDebug("spotlight_rendered", {
        stepId: step.id,
        targetId: step.targetId,
        hasRect: Boolean(measured),
      });
    })();
    return () => {
      active = false;
    };
  }, [isActive, step, registrationsRef, measureNonce]);

  useEffect(() => {
    let active = true;
    if (!isActive || !step) {
      setTabRect(null);
      return;
    }
    const tabTargetId = tabTargetForRoute(step.route);
    if (!tabTargetId) {
      setTabRect(null);
      return;
    }
    const registration = registrationsRef.current[tabTargetId];
    if (!registration) {
      setTabRect(null);
      return;
    }
    (async () => {
      let measured: TargetRect | null = null;
      for (let i = 0; i < 16; i += 1) {
        measured = await registration.measure();
        if (measured) break;
        await new Promise((resolve) => setTimeout(resolve, 70));
      }
      if (!active) return;
      setTabRect(measured);
      tutorialDebug("target_measured", {
        stepId: step.id,
        targetId: tabTargetId,
        hasRect: Boolean(measured),
        rect: measured ?? null,
      });
    })();
    return () => {
      active = false;
    };
  }, [isActive, measureNonce, registrationsRef, step]);

  useEffect(() => {
    if (!isActive) return;
    overlayOpacity.setValue(0);
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [isActive, overlayOpacity, stepSignature]);

  if (!isActive || !step) return null;

  if (!rect) {
    return (
      <Animated.View pointerEvents="auto" style={[overlayStyles.root, { opacity: overlayOpacity }]}>
        <BlurView intensity={16} tint="dark" style={[StyleSheet.absoluteFillObject, { bottom: clearBottomHeight }]} />
        <View style={[overlayStyles.dim, { top: 0, left: 0, right: 0, bottom: clearBottomHeight }]} />
        <View style={[overlayStyles.bubble, { top: 120 }]}>
          <Text style={overlayStyles.bubbleText}>{stepText}</Text>
          <View style={overlayStyles.actionsRow}>
            <Pressable style={overlayStyles.skipBtn} onPress={onSkip}>
              <Text style={overlayStyles.skipText}>{skipLabel}</Text>
            </Pressable>
            <Pressable style={overlayStyles.continueBtn} onPress={() => {
              void hapticSelection();
              onContinue();
            }}>
              <Text style={overlayStyles.continueText}>{isLastStep ? startLabel : continueLabel}</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    );
  }

  const margin = 10;
  const top = Math.max(0, rect.y - margin);
  const left = Math.max(0, rect.x - margin);
  const width = rect.width + margin * 2;
  const height = rect.height + margin * 2;
  const bubbleTop = top + height + 14;
  const bubbleHeight = 166;
  const bubbleMinTop = Math.max(12, insets.top + 6);
  const bubbleMaxTop = Math.max(
    bubbleMinTop + 4,
    screenHeight - clearBottomHeight - bubbleHeight - 10
  );
  const bubbleFitsBelow = bubbleTop + bubbleHeight < screenHeight - clearBottomHeight - 6;
  const desiredTop = bubbleFitsBelow ? bubbleTop : top - bubbleHeight - 10;
  const bubbleStyle = { top: Math.max(bubbleMinTop, Math.min(bubbleMaxTop, desiredTop)) };
  const tabMargin = 6;
  const tabHighlight =
    tabRect && tabRect.width > 0 && tabRect.height > 0
      ? {
          left: Math.max(4, Math.min(screenWidth - 4, tabRect.x - tabMargin)),
          width: Math.max(20, Math.min(screenWidth - 8, tabRect.width + tabMargin * 2)),
          height: Math.max(16, tabRect.height + tabMargin * 2),
          top: Math.max(0, tabRect.y - tabMargin),
        }
      : null;

  return (
    <Animated.View pointerEvents="auto" style={[overlayStyles.root, { opacity: overlayOpacity }]}>
      <BlurView intensity={16} tint="dark" style={[overlayStyles.blurSlice, { top: 0, left: 0, right: 0, height: top }]} />
      <BlurView
        intensity={16}
        tint="dark"
        style={[overlayStyles.blurSlice, { top: top + height, left: 0, right: 0, bottom: clearBottomHeight }]}
      />
      <BlurView intensity={16} tint="dark" style={[overlayStyles.blurSlice, { top, left: 0, width: left, height }]} />
      <BlurView
        intensity={16}
        tint="dark"
        style={[overlayStyles.blurSlice, { top, left: left + width, right: 0, height }]}
      />
      <View style={[overlayStyles.dim, { top: 0, left: 0, right: 0, height: top }]} />
      <View style={[overlayStyles.dim, { top: top + height, left: 0, right: 0, bottom: clearBottomHeight }]} />
      <View style={[overlayStyles.dim, { top, left: 0, width: left, height }]} />
      <View style={[overlayStyles.dim, { top, left: left + width, right: 0, height }]} />
      <View
        style={[
          overlayStyles.highlight,
          { top, left, width, height },
        ]}
      />
      {tabHighlight ? (
        <View
          pointerEvents="none"
          style={[
            overlayStyles.tabFocusOutline,
            {
              left: tabHighlight.left,
              width: tabHighlight.width,
              height: tabHighlight.height,
              top: tabHighlight.top,
              borderRadius: 14,
            },
          ]}
        />
      ) : null}
      <View style={[overlayStyles.bubble, bubbleStyle]}>
        <Text style={overlayStyles.bubbleText}>{stepText}</Text>
        <View style={overlayStyles.actionsRow}>
          <Pressable style={overlayStyles.skipBtn} onPress={onSkip}>
            <Text style={overlayStyles.skipText}>{skipLabel}</Text>
          </Pressable>
          <Pressable style={overlayStyles.continueBtn} onPress={() => {
            void hapticSelection();
            onContinue();
          }}>
            <Text style={overlayStyles.continueText}>{isLastStep ? startLabel : continueLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const overlayStyles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  dim: {
    position: "absolute",
    backgroundColor: "rgba(14,10,8,0.26)",
  },
  blurSlice: {
    position: "absolute",
  },
  highlight: {
    position: "absolute",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#FFD19A",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  bubble: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,214,168,0.58)",
    backgroundColor: "rgba(42,29,20,0.94)",
    padding: 14,
    gap: 12,
  },
  bubbleText: {
    color: "#FFF6EC",
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    lineHeight: 20,
  },
  tabFocusOutline: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#EA7A20",
    backgroundColor: "rgba(234,122,32,0.08)",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  skipBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.32)",
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtn: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: Colors.playDark,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    color: "#FCEDE0",
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
  },
  continueText: {
    color: "#FFF",
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13.5,
  },
});

export function useAppTutorial() {
  const ctx = useContext(AppTutorialContext);
  if (!ctx) throw new Error("useAppTutorial must be used within AppTutorialProvider");
  return ctx;
}

export function useTutorialTarget(
  id: TutorialTargetId,
  ensureVisible?: () => Promise<void> | void
) {
  const { registerTarget, unregisterTarget, refreshCurrentStep, currentTargetId } = useAppTutorial();
  const ref = useRef<View>(null);

  useEffect(() => {
    registerTarget(id, {
      ensureVisible,
      measure: () =>
        new Promise((resolve) => {
          const node: any = ref.current;
          if (!node?.measureInWindow) {
            resolve(null);
            return;
          }
          node.measureInWindow((x: number, y: number, width: number, height: number) => {
            if (!width || !height) {
              resolve(null);
              return;
            }
            resolve({ x, y, width, height });
          });
        }),
    });
    return () => unregisterTarget(id);
  }, [ensureVisible, id, registerTarget, unregisterTarget]);

  const onLayout = useCallback(() => {
    if (currentTargetId === id) {
      refreshCurrentStep();
    }
  }, [currentTargetId, id, refreshCurrentStep]);

  return { ref, onLayout };
}
