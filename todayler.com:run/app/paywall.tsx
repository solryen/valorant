import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  Animated,
  Dimensions,
  Easing,
  AppState,
  Alert,
  Linking,
  BackHandler,
  PixelRatio,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useBaby } from "@/contexts/BabyContext";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/constants/colors";
import {
  getRevenueCatPaywallPackages,
  purchaseRevenueCatPackage,
  restoreRevenueCatPurchases,
  RC_MONTHLY_PRODUCT_ID,
  RC_PRIMARY_PRODUCT_ID,
  type RevenueCatPaywallPackage,
} from "@/lib/revenuecat";
import { markNotificationsPaywallCompletedAt } from "@/lib/notifications";
import { hapticSelection } from "@/lib/haptics";
import { getOnboardingLang, type OnboardingPaywallLanguage } from "@/lib/onboardingLanguage";
import { tOnbPw } from "@/lib/onboardingPaywallI18n";
import { greekBabyNameObjectPhrase, greekBabyNamePossessivePhrase } from "@/lib/greekGrammar";

const SCREEN_H = Dimensions.get("window").height;
const DISCOUNT_SHOWN_KEY_PREFIX = "@todayler_discount_offer_shown_";
const PAYWALL_FONT_SCALE = PixelRatio.getFontScale();
const PAYWALL_TEXT_SCALE_EXTRA = Math.max(0, PAYWALL_FONT_SCALE - 1);
const PRIVACY_URL = "https://www.todayler.com/privacy";
const TERMS_URL = "https://www.todayler.com/terms";
const DISCOUNT_CONFETTI = [
  { left: "10%", size: 7, color: "#F97316", distance: 240, rotateStart: "-18deg", rotateEnd: "30deg" },
  { left: "18%", size: 6, color: "#22C55E", distance: 215, rotateStart: "12deg", rotateEnd: "-22deg" },
  { left: "29%", size: 8, color: "#3B82F6", distance: 260, rotateStart: "-8deg", rotateEnd: "24deg" },
  { left: "41%", size: 6, color: "#EAB308", distance: 235, rotateStart: "6deg", rotateEnd: "-18deg" },
  { left: "53%", size: 7, color: "#FB7185", distance: 255, rotateStart: "-20deg", rotateEnd: "20deg" },
  { left: "66%", size: 6, color: "#06B6D4", distance: 225, rotateStart: "16deg", rotateEnd: "-20deg" },
  { left: "77%", size: 8, color: "#A855F7", distance: 250, rotateStart: "-10deg", rotateEnd: "28deg" },
  { left: "88%", size: 6, color: "#F59E0B", distance: 220, rotateStart: "20deg", rotateEnd: "-14deg" },
] as const;

function getTrialDaysFromPackage(pkg: RevenueCatPaywallPackage | null): number | null {
  if (!pkg) return null;
  const product = pkg.package?.product ?? pkg.storeProduct ?? null;
  if (!product) return null;

  const toDays = (input: {
    periodUnit?: string | null;
    periodNumberOfUnits?: number | null;
    cycles?: number | null;
    period?: string | null;
  }): number | null => {
    const cycles = Math.max(1, Number(input.cycles || 1));
    const units = Math.max(1, Number(input.periodNumberOfUnits || 1));
    const unit = String(input.periodUnit || "").toUpperCase();
    const totalUnits = cycles * units;

    if (unit === "DAY") return totalUnits;
    if (unit === "WEEK") return totalUnits * 7;
    if (unit === "MONTH") return totalUnits * 30;
    if (unit === "YEAR") return totalUnits * 365;

    const iso = String(input.period || "").trim();
    const dayMatch = iso.match(/^P(\d+)D$/i);
    if (dayMatch) return Math.max(1, Number(dayMatch[1]) * cycles);
    const weekMatch = iso.match(/^P(\d+)W$/i);
    if (weekMatch) return Math.max(1, Number(weekMatch[1]) * 7 * cycles);

    return null;
  };

  const intro = product.introPrice ?? null;
  const introDays = intro ? toDays(intro) : null;
  if (introDays) return introDays;

  // Some store setups expose trial periods through discounts instead of introPrice.
  const discounts = product.discounts ?? [];
  const freeTrialDiscount = discounts.find((discount) => Number(discount.price ?? 0) === 0);
  const discountDays = freeTrialDiscount ? toDays(freeTrialDiscount) : null;
  if (discountDays) return discountDays;

  return null;
}

function getDiscountShownStorageKey(userId?: string | null) {
  return `${DISCOUNT_SHOWN_KEY_PREFIX}${userId ?? "guest"}`;
}

type BillingUnit = "DAY" | "WEEK" | "MONTH" | "YEAR" | "UNKNOWN";
type PriceRole = "monthly" | "annual" | "discount";
type NormalizedPrice = {
  amount: number | null;
  currencyCode: string | null;
  priceLabel: string;
  billingUnit: BillingUnit;
  roleCompatible: boolean;
  productId: string | null;
  source: "offering" | "direct" | "unknown";
};

function parseBillingUnit(period: string | null | undefined): BillingUnit {
  const value = String(period ?? "").trim().toUpperCase();
  if (!value) return "UNKNOWN";
  if (value.endsWith("D")) return "DAY";
  if (value.endsWith("W")) return "WEEK";
  if (value.endsWith("M")) return "MONTH";
  if (value.endsWith("Y")) return "YEAR";
  return "UNKNOWN";
}

function normalizePackagePrice(
  pkg: RevenueCatPaywallPackage | null,
  role: PriceRole
): NormalizedPrice {
  if (!pkg) {
    return {
      amount: null,
      currencyCode: null,
      priceLabel: "",
      billingUnit: "UNKNOWN",
      roleCompatible: false,
      productId: null,
      source: "unknown",
    };
  }

  const product = pkg.package?.product ?? pkg.storeProduct ?? null;
  const amount = Number.isFinite(Number(product?.price ?? NaN))
    ? Number(product?.price)
    : null;
  const currencyCode =
    typeof product?.currencyCode === "string" && product.currencyCode.trim()
      ? product.currencyCode
      : null;
  const periodIso = (product as any)?.subscriptionPeriod ?? (product as any)?.introPrice?.period;
  const billingUnit = parseBillingUnit(periodIso);
  const packageType = pkg.package?.packageType ?? null;
  const productId = pkg.productIdentifier ?? null;
  const fromPackageRole =
    role === "monthly"
      ? packageType === "MONTHLY"
      : role === "annual"
        ? packageType === "ANNUAL"
        : true;
  const fromBillingUnit =
    role === "monthly"
      ? billingUnit === "MONTH"
      : role === "annual"
        ? billingUnit === "YEAR"
        : true;
  const fromProductId =
    role === "monthly"
      ? productId === RC_MONTHLY_PRODUCT_ID
      : role === "annual"
        ? productId === RC_PRIMARY_PRODUCT_ID
        : true;
  const roleCompatible = fromPackageRole || fromBillingUnit || fromProductId;

  return {
    amount,
    currencyCode,
    priceLabel: pkg.priceLabel ?? "",
    billingUnit,
    roleCompatible,
    productId,
    source: pkg.source ?? "unknown",
  };
}

function formatCurrency(amount: number, currencyCode: string): string | null {
  if (!Number.isFinite(amount) || !currencyCode) return null;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch {
    return null;
  }
}

async function openExternal(url: string) {
  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    Alert.alert("Cannot open link", url);
    return;
  }
  await Linking.openURL(url);
}

function logDiscountFlow(step: string, payload?: Record<string, unknown>) {
  try {
    if (payload) {
      console.log(`[paywall_discount] ${step}`, payload);
      return;
    }
    console.log(`[paywall_discount] ${step}`);
  } catch {
    // no-op
  }
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const { baby, markPaywallSeen, saveBaby } = useBaby();
  const { user, isSubscribed, isLoading, setSubscribedStatus } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (isSubscribed) {
      markPaywallSeen().then(() => router.replace("/claim"));
    }
  }, [isLoading, isSubscribed]);
  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [showTrialOfferCard, setShowTrialOfferCard] = useState(false);
  const [showDiscountUnavailableState, setShowDiscountUnavailableState] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [packagesUnavailable, setPackagesUnavailable] = useState(false);
  const [primaryPackage, setPrimaryPackage] = useState<RevenueCatPaywallPackage | null>(null);
  const [monthlyPackage, setMonthlyPackage] = useState<RevenueCatPaywallPackage | null>(null);
  const [discountPackage, setDiscountPackage] = useState<RevenueCatPaywallPackage | null>(null);
  const [discountOfferCount, setDiscountOfferCount] = useState(0);
  const [didLoadDiscountShownFlag, setDidLoadDiscountShownFlag] = useState(false);
  const [pendingBackPress, setPendingBackPress] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"annual" | "monthly">("annual");
  const [lang, setLang] = useState<OnboardingPaywallLanguage>("en");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const saved = await getOnboardingLang(user?.id ?? null);
      if (mounted) setLang(saved);
    })();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const purchaseInFlightRef = useRef(false);
  // Animate the whole screen swap
  const mainOpacity = useRef(new Animated.Value(1)).current;
  const baseImageX = useRef(new Animated.Value(48)).current;
  const baseImageY = useRef(new Animated.Value(96)).current;
  const baseImageOpacity = useRef(new Animated.Value(0)).current;
  const overlayImageX = useRef(new Animated.Value(-52)).current;
  const overlayImageY = useRef(new Animated.Value(120)).current;
  const overlayImageOpacity = useRef(new Animated.Value(0)).current;
  const babyName = baby?.name?.trim() || "you";
  const babyGender = (baby?.gender ?? "unspecified") as "boy" | "girl" | "unspecified";
  const subheadlineOpacity = useRef(new Animated.Value(0)).current;
  const includesTitleOpacity = useRef(new Animated.Value(0)).current;
  const featureOpacities = useRef(Array.from({ length: 6 }, () => new Animated.Value(0))).current;
  const trialOverlayOpacity = useRef(new Animated.Value(0)).current;
  const trialCardTranslateY = useRef(new Animated.Value(72)).current;
  const giftMotion = useRef(new Animated.Value(0)).current;
  const confettiFall = useRef(new Animated.Value(0)).current;
  const giftMotionLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const confettiLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const giftStopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confettiStopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const discountShownStorageKey = getDiscountShownStorageKey(user?.id ?? null);
  const backIntentTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subtitleTypeStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subtitleTypeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [typedSubheadline, setTypedSubheadline] = useState("");

  const babyAgeText = useMemo(() => {
    if (!baby?.birthYear || baby.birthMonth === undefined || !baby.birthDay) return "your baby's age";
    const birthDate = new Date(baby.birthYear, baby.birthMonth, baby.birthDay);
    if (Number.isNaN(birthDate.getTime())) return "your baby's age";
    const now = new Date();
    const diffMs = now.getTime() - birthDate.getTime();
    if (diffMs <= 0) return "newborn";
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.max(1, Math.floor(days / 7));
    if (weeks < 8) return `${weeks} week${weeks === 1 ? "" : "s"}`;
    const months = Math.max(1, Math.floor(days / 30.4375));
    return `${months} month${months === 1 ? "" : "s"}`;
  }, [baby?.birthDay, baby?.birthMonth, baby?.birthYear]);
  const subheadlineFullText = useMemo(
    () => tOnbPw(lang, "paywall.dynamicSubheader", { ageText: babyAgeText }),
    [babyAgeText, lang]
  );

  const resetToPrimaryPaywall = useCallback(() => {
    setShowTrialOfferCard(false);
    setShowDiscountUnavailableState(false);
    mainOpacity.setValue(1);
    trialOverlayOpacity.setValue(0);
    trialCardTranslateY.setValue(72);
  }, [mainOpacity, trialOverlayOpacity, trialCardTranslateY]);

  useEffect(() => {
    if (!showTrialOfferCard) {
      giftMotionLoopRef.current?.stop();
      confettiLoopRef.current?.stop();
      if (giftStopTimeoutRef.current) {
        clearTimeout(giftStopTimeoutRef.current);
        giftStopTimeoutRef.current = null;
      }
      if (confettiStopTimeoutRef.current) {
        clearTimeout(confettiStopTimeoutRef.current);
        confettiStopTimeoutRef.current = null;
      }
      giftMotion.setValue(0);
      confettiFall.setValue(0);
      return;
    }

    giftMotion.setValue(0);
    confettiFall.setValue(0);

    const giftLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(giftMotion, {
          toValue: 1,
          duration: 760,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(giftMotion, {
          toValue: 0,
          duration: 760,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    const confettiLoop = Animated.loop(
      Animated.timing(confettiFall, {
        toValue: 1,
        duration: 1850,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    giftMotionLoopRef.current = giftLoop;
    confettiLoopRef.current = confettiLoop;
    giftLoop.start();
    confettiLoop.start();
    confettiStopTimeoutRef.current = setTimeout(() => {
      confettiLoopRef.current?.stop();
      Animated.timing(confettiFall, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
      confettiStopTimeoutRef.current = null;
    }, 2000);
    giftStopTimeoutRef.current = setTimeout(() => {
      giftMotionLoopRef.current?.stop();
      Animated.timing(giftMotion, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
      giftStopTimeoutRef.current = null;
    }, 3000);

    return () => {
      giftMotionLoopRef.current?.stop();
      confettiLoopRef.current?.stop();
      if (giftStopTimeoutRef.current) {
        clearTimeout(giftStopTimeoutRef.current);
        giftStopTimeoutRef.current = null;
      }
      if (confettiStopTimeoutRef.current) {
        clearTimeout(confettiStopTimeoutRef.current);
        confettiStopTimeoutRef.current = null;
      }
      giftMotion.setValue(0);
      confettiFall.setValue(0);
    };
  }, [confettiFall, giftMotion, showTrialOfferCard]);

  const loadPaywallPackages = useCallback(async () => {
    setIsLoadingPackages(true);
    setPackagesUnavailable(false);
    try {
      const result = await getRevenueCatPaywallPackages();
      if (result.status === "ready") {
        if (__DEV__) {
          const resolvedTrialDays = getTrialDaysFromPackage(result.primary);
          console.log("[paywall_rc] packages_ready", {
            offeringIdentifier: result.offeringIdentifier,
            primaryProductId: result.primary.productIdentifier,
            primaryPackageId: result.primary.packageIdentifier,
            monthlyProductId: result.monthly?.productIdentifier ?? null,
            discountProductId: result.discount?.productIdentifier ?? null,
            resolvedTrialDays,
            primaryPriceLabel: result.primary.priceLabel,
          });
        }
        setPrimaryPackage(result.primary);
        setMonthlyPackage(result.monthly);
        setDiscountPackage(result.discount);
        setPackagesUnavailable(false);
        if (__DEV__) {
          console.log("[paywall_rc] package_sources", {
            offeringIdentifier: result.offeringIdentifier,
            primary: {
              productId: result.primary.productIdentifier,
              source: result.primary.source,
            },
            monthly: result.monthly
              ? {
                  productId: result.monthly.productIdentifier,
                  source: result.monthly.source,
                }
              : null,
            discount: result.discount
              ? {
                  productId: result.discount.productIdentifier,
                  source: result.discount.source,
                }
              : null,
          });
        }
        return;
      }
      if (__DEV__) {
        console.log("[paywall_rc] packages_not_ready", { status: result.status });
      }
      setPrimaryPackage(null);
      setMonthlyPackage(null);
      setDiscountPackage(null);
      setPackagesUnavailable(true);
    } catch {
      if (__DEV__) {
        console.log("[paywall_rc] packages_failed");
      }
      setPrimaryPackage(null);
      setMonthlyPackage(null);
      setDiscountPackage(null);
      setPackagesUnavailable(true);
    } finally {
      setIsLoadingPackages(false);
    }
  }, []);

  const persistDiscountShown = useCallback(async (nextCount: number) => {
    try {
      await AsyncStorage.setItem(discountShownStorageKey, String(nextCount));
    } catch {
      // best effort only
    }
  }, [discountShownStorageKey]);

  const activateDiscountOffer = useCallback(async () => {
    if (!discountPackage) return;
    const nextCount = discountOfferCount + 1;
    setDiscountOfferCount(nextCount);
    await persistDiscountShown(nextCount);
    openTrialOfferCard();
  }, [discountPackage, discountOfferCount, persistDiscountShown]);

  const logBackBreadcrumb = useCallback((step: string, payload?: Record<string, unknown>) => {
    if (!__DEV__) return;
    if (payload) {
      console.log(`[paywall_back] ${step}`, payload);
      return;
    }
    console.log(`[paywall_back] ${step}`);
  }, []);

  useFocusEffect(
    useCallback(() => {
      resetToPrimaryPaywall();
      setPendingBackPress(false);
      if (backIntentTimeoutRef.current) {
        clearTimeout(backIntentTimeoutRef.current);
        backIntentTimeoutRef.current = null;
      }
      void loadPaywallPackages();
    }, [loadPaywallPackages, resetToPrimaryPaywall])
  );

  useEffect(() => {
    let active = true;
    setDidLoadDiscountShownFlag(false);
    (async () => {
      try {
        const savedShown = await AsyncStorage.getItem(discountShownStorageKey);
        if (active) {
          const parsedCount = Math.max(0, Number.parseInt(savedShown ?? "0", 10) || 0);
          setDiscountOfferCount(parsedCount);
          setDidLoadDiscountShownFlag(true);
        }
      } catch {
        if (active) {
          setDiscountOfferCount(0);
          setDidLoadDiscountShownFlag(true);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [discountShownStorageKey]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        resetToPrimaryPaywall();
        setPendingBackPress(false);
        if (backIntentTimeoutRef.current) {
          clearTimeout(backIntentTimeoutRef.current);
          backIntentTimeoutRef.current = null;
        }
        void loadPaywallPackages();
      }
    });
    return () => sub.remove();
  }, [resetToPrimaryPaywall, loadPaywallPackages]);

  useEffect(() => {
    baseImageX.setValue(48);
    baseImageY.setValue(96);
    baseImageOpacity.setValue(0);
    overlayImageX.setValue(-52);
    overlayImageY.setValue(120);
    overlayImageOpacity.setValue(0);
    subheadlineOpacity.setValue(0);
    includesTitleOpacity.setValue(0);
    featureOpacities.forEach((value) => value.setValue(0));
    setTypedSubheadline("");
    if (subtitleTypeStartTimeoutRef.current) {
      clearTimeout(subtitleTypeStartTimeoutRef.current);
      subtitleTypeStartTimeoutRef.current = null;
    }
    if (subtitleTypeIntervalRef.current) {
      clearInterval(subtitleTypeIntervalRef.current);
      subtitleTypeIntervalRef.current = null;
    }

    Animated.parallel([
      Animated.spring(baseImageX, {
        toValue: 0,
        useNativeDriver: true,
        speed: 4.6,
        bounciness: 4.5,
      }),
      Animated.spring(baseImageY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 4.6,
        bounciness: 4.5,
      }),
      Animated.timing(baseImageOpacity, {
        toValue: 1,
        duration: 460,
        useNativeDriver: true,
      }),
      Animated.spring(overlayImageX, {
        toValue: 0,
        useNativeDriver: true,
        speed: 3.3,
        bounciness: 3.8,
      }),
      Animated.spring(overlayImageY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 3.3,
        bounciness: 3.8,
      }),
      Animated.timing(overlayImageOpacity, {
        toValue: 1,
        duration: 620,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const featureAnimations = featureOpacities.map((opacity) =>
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      })
    );

    Animated.timing(subheadlineOpacity, {
      toValue: 1,
      duration: 260,
      delay: 120,
      useNativeDriver: true,
    }).start();

    subtitleTypeStartTimeoutRef.current = setTimeout(() => {
      let cursor = 0;
      subtitleTypeIntervalRef.current = setInterval(() => {
        cursor += 1;
        setTypedSubheadline(subheadlineFullText.slice(0, cursor));
        if (cursor >= subheadlineFullText.length) {
          if (subtitleTypeIntervalRef.current) {
            clearInterval(subtitleTypeIntervalRef.current);
            subtitleTypeIntervalRef.current = null;
          }
          Animated.sequence([
            Animated.timing(includesTitleOpacity, {
              toValue: 1,
              duration: 240,
              useNativeDriver: true,
            }),
            ...featureAnimations,
          ]).start();
        }
      }, 18);
    }, 180);

    return () => {
      if (subtitleTypeStartTimeoutRef.current) {
        clearTimeout(subtitleTypeStartTimeoutRef.current);
        subtitleTypeStartTimeoutRef.current = null;
      }
      if (subtitleTypeIntervalRef.current) {
        clearInterval(subtitleTypeIntervalRef.current);
        subtitleTypeIntervalRef.current = null;
      }
    };
  }, [
    baseImageOpacity,
    baseImageX,
    baseImageY,
    featureOpacities,
    includesTitleOpacity,
    overlayImageOpacity,
    overlayImageX,
    overlayImageY,
    subheadlineFullText,
    subheadlineOpacity,
  ]);

  function openTrialOfferCard(mode: "discount" | "unavailable" = "discount") {
    logDiscountFlow("overlay_open", { mode, hasDiscountPackage: Boolean(discountPackage) });
    setShowDiscountUnavailableState(mode === "unavailable");
    setShowTrialOfferCard(true);
    trialOverlayOpacity.setValue(0);
    trialCardTranslateY.setValue(SCREEN_H);
    Animated.parallel([
      Animated.timing(trialOverlayOpacity, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(trialCardTranslateY, {
        toValue: 0,
        duration: 2000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }

  async function completePurchase() {
    await setSubscribedStatus(true);
    await saveBaby({ onboardingComplete: true, isSignedIn: true, isPremium: true });
    await markPaywallSeen();
    await markNotificationsPaywallCompletedAt(user?.id ?? null);
    router.replace("/claim");
  }

  function showPurchasesUnavailable() {
    Alert.alert(
      "Purchases temporarily unavailable",
      "We couldn't load the App Store purchase options right now. Please try again in a moment."
    );
  }

  async function handleComplete() {
    if (purchaseInFlightRef.current) return;
    if (!primaryPackage) {
      showPurchasesUnavailable();
      return;
    }
    purchaseInFlightRef.current = true;
    setIsPurchasing(true);
    try {
      const result = await purchaseRevenueCatPackage(primaryPackage);
      if (result.status === "purchased") {
        await completePurchase();
        return;
      }

      if (result.status === "no_offering" || result.status === "unavailable") {
        showPurchasesUnavailable();
        return;
      }
      if (result.status === "cancelled") {
        logDiscountFlow("purchase_cancel_detected", { source: "annual" });
        if (discountPackage) {
          const nextCount = discountOfferCount + 1;
          setDiscountOfferCount(nextCount);
          void persistDiscountShown(nextCount);
          openTrialOfferCard("discount");
        } else {
          openTrialOfferCard("unavailable");
        }
        return;
      }
      Alert.alert("Couldn't complete purchase", "Please try again when you're ready.");
    } catch (error) {
      if (__DEV__) {
        console.warn("[revenuecat] purchase failed", error);
      }
      Alert.alert("Couldn't complete purchase", "Please try again when you're ready.");
    } finally {
      purchaseInFlightRef.current = false;
      setIsPurchasing(false);
    }
  }

  async function handleStartTrialFromOffer() {
    if (purchaseInFlightRef.current) return;
    if (!discountPackage) {
      logDiscountFlow("discount_cta_blocked_missing_package");
      openTrialOfferCard("unavailable");
      return;
    }
    logDiscountFlow("discount_cta_submit", {
      productId: discountPackage.productIdentifier,
      source: discountPackage.source,
    });
    purchaseInFlightRef.current = true;
    setIsPurchasing(true);
    try {
      const result = await purchaseRevenueCatPackage(discountPackage);
      if (result.status === "purchased") {
        await completePurchase();
        return;
      }

      if (result.status === "no_offering" || result.status === "unavailable") {
        logDiscountFlow("discount_purchase_unavailable");
        showPurchasesUnavailable();
        return;
      }

      Alert.alert("Couldn't complete purchase", "Please try again when you're ready.");
    } catch (error) {
      if (__DEV__) {
        console.warn("[revenuecat] discount purchase failed", error);
      }
      Alert.alert("Couldn't complete purchase", "Please try again when you're ready.");
    } finally {
      purchaseInFlightRef.current = false;
      setIsPurchasing(false);
    }
  }

  async function handleMonthly() {
    if (purchaseInFlightRef.current) return;
    if (!monthlyPackage) {
      showPurchasesUnavailable();
      return;
    }
    purchaseInFlightRef.current = true;
    setIsPurchasing(true);
    try {
      const result = await purchaseRevenueCatPackage(monthlyPackage);
      if (result.status === "purchased") {
        await completePurchase();
        return;
      }
      if (result.status === "no_offering" || result.status === "unavailable") {
        showPurchasesUnavailable();
        return;
      }
      if (result.status === "cancelled") {
        logDiscountFlow("purchase_cancel_detected", { source: "monthly" });
        if (discountPackage) {
          const nextCount = discountOfferCount + 1;
          setDiscountOfferCount(nextCount);
          void persistDiscountShown(nextCount);
          openTrialOfferCard("discount");
        } else {
          openTrialOfferCard("unavailable");
        }
        return;
      }
      Alert.alert("Couldn't complete purchase", "Please try again when you're ready.");
    } catch (error) {
      if (__DEV__) {
        console.warn("[revenuecat] monthly purchase failed", error);
      }
      Alert.alert("Couldn't complete purchase", "Please try again when you're ready.");
    } finally {
      purchaseInFlightRef.current = false;
      setIsPurchasing(false);
    }
  }

  async function handleRestorePurchases() {
    if (isRestoring) return;
    setIsRestoring(true);
    try {
      const result = await restoreRevenueCatPurchases();
      if (result.status === "restored") {
        await completePurchase();
        return;
      }
      if (result.status === "no_active_entitlement") {
        Alert.alert("No purchases to restore", "We couldn't find an active Todayler subscription on this Apple ID.");
        return;
      }
      Alert.alert("Restore unavailable", "We couldn't restore purchases right now. Please try again shortly.");
    } catch {
      Alert.alert("Restore unavailable", "We couldn't restore purchases right now. Please try again shortly.");
    } finally {
      setIsRestoring(false);
    }
  }

  function handleDiscountDebugOpen() {
    if (isPurchasing || isRestoring || purchaseInFlightRef.current) return;
    openTrialOfferCard(discountPackage ? "discount" : "unavailable");
  }

  async function handleRetryDiscountLookup() {
    if (isPurchasing || isRestoring || purchaseInFlightRef.current) return;
    logDiscountFlow("retry_lookup_start");
    const refreshed = await getRevenueCatPaywallPackages();
    if (refreshed.status === "ready") {
      setPrimaryPackage(refreshed.primary);
      setMonthlyPackage(refreshed.monthly);
      setDiscountPackage(refreshed.discount);
      setPackagesUnavailable(false);
    } else {
      setPrimaryPackage(null);
      setMonthlyPackage(null);
      setDiscountPackage(null);
      setPackagesUnavailable(true);
    }
    if (refreshed.status === "ready" && refreshed.discount) {
      logDiscountFlow("retry_lookup_result", {
        status: "found",
        productId: refreshed.discount.productIdentifier,
        source: refreshed.discount.source,
      });
      openTrialOfferCard("discount");
      return;
    }
    logDiscountFlow("retry_lookup_result", { status: "not_found" });
    Alert.alert(tOnbPw(lang, "paywall.retryAlertTitle"), tOnbPw(lang, "paywall.retryAlertBody"));
  }

  const resolveBackAction = useCallback(() => {
    if (showTrialOfferCard) {
      logBackBreadcrumb("close_discount");
      resetToPrimaryPaywall();
      return;
    }
    if (purchaseInFlightRef.current || isPurchasing || isRestoring) {
      logBackBreadcrumb("blocked_purchase_inflight");
      return;
    }
    if (isLoadingPackages || !didLoadDiscountShownFlag) {
      logBackBreadcrumb("queued_waiting_packages", {
        isLoadingPackages,
        didLoadDiscountShownFlag,
      });
      setPendingBackPress(true);
      if (!backIntentTimeoutRef.current) {
        backIntentTimeoutRef.current = setTimeout(() => {
          setPendingBackPress(false);
          backIntentTimeoutRef.current = null;
          logBackBreadcrumb("queue_timeout_cleared");
        }, 2500);
      }
      return;
    }
    if (backIntentTimeoutRef.current) {
      clearTimeout(backIntentTimeoutRef.current);
      backIntentTimeoutRef.current = null;
    }
    if (discountPackage) {
      logBackBreadcrumb("open_discount");
      void activateDiscountOffer();
      return;
    }
    logBackBreadcrumb("go_step12");
    router.replace({
      pathname: "/onboarding/step1",
      params: { screen: "13", mode: "paywallBackReturn" },
    });
  }, [
    activateDiscountOffer,
    didLoadDiscountShownFlag,
    discountOfferCount,
    discountPackage,
    isLoadingPackages,
    isPurchasing,
    isRestoring,
    logBackBreadcrumb,
    resetToPrimaryPaywall,
    showTrialOfferCard,
  ]);

  useEffect(() => {
    if (!pendingBackPress) return;
    if (isLoadingPackages || !didLoadDiscountShownFlag) return;
    setPendingBackPress(false);
    if (backIntentTimeoutRef.current) {
      clearTimeout(backIntentTimeoutRef.current);
      backIntentTimeoutRef.current = null;
    }
    resolveBackAction();
  }, [didLoadDiscountShownFlag, isLoadingPackages, pendingBackPress, resolveBackAction]);

  useEffect(() => {
    if (Platform.OS === "web") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      // Paywall is intentionally non-dismissable via device back.
      return true;
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    return () => {
      if (backIntentTimeoutRef.current) {
        clearTimeout(backIntentTimeoutRef.current);
        backIntentTimeoutRef.current = null;
      }
    };
  }, []);

  const primaryPrice = primaryPackage?.priceLabel ?? "";
  const monthlyPrice = monthlyPackage?.priceLabel ?? "";
  const discountPrice = discountPackage?.priceLabel ?? "";
  const trialOfferPrice = discountPrice;
  const annualTrialDays = 7;
  const discountTrialDays = getTrialDaysFromPackage(discountPackage) ?? annualTrialDays;
  const primaryCtaText = tOnbPw(lang, "paywall.startTrial", { days: annualTrialDays });
  const canPurchasePrimary = Boolean(primaryPackage) && !packagesUnavailable && !isLoadingPackages;
  const canPurchaseMonthly = Boolean(monthlyPackage) && !packagesUnavailable && !isLoadingPackages;
  const canPurchaseSelected = selectedPlan === "annual" ? canPurchasePrimary : canPurchaseMonthly;
  const selectedCtaText = selectedPlan === "annual" ? primaryCtaText : tOnbPw(lang, "paywall.continue");
  const normalizedMonthly = normalizePackagePrice(monthlyPackage, "monthly");
  const normalizedAnnual = normalizePackagePrice(primaryPackage, "annual");
  const monthlyValue =
    normalizedMonthly.amount !== null && normalizedMonthly.roleCompatible
      ? normalizedMonthly.amount
      : null;
  const annualValue =
    normalizedAnnual.amount !== null && normalizedAnnual.roleCompatible
      ? normalizedAnnual.amount
      : null;
  const sameCurrency =
    normalizedMonthly.currencyCode &&
    normalizedAnnual.currencyCode &&
    normalizedMonthly.currencyCode === normalizedAnnual.currencyCode;
  const monthlyAnnualCost = monthlyValue !== null ? monthlyValue * 12 : null;
  const annualMonthlyEquivalent = annualValue !== null ? annualValue / 12 : null;
  const savingsAmount =
    monthlyAnnualCost !== null && annualValue !== null && sameCurrency
      ? Math.max(0, monthlyAnnualCost - annualValue)
      : null;
  const savingsPct =
    monthlyAnnualCost && annualValue !== null && monthlyAnnualCost > 0 && sameCurrency
      ? Math.round(((monthlyAnnualCost - annualValue) / monthlyAnnualCost) * 100)
      : null;
  const monthlyDisplayMain =
    (monthlyValue !== null &&
      normalizedMonthly.currencyCode &&
      formatCurrency(monthlyValue, normalizedMonthly.currencyCode)) ||
    monthlyPrice;
  const monthlyDisplayYear =
    (monthlyAnnualCost !== null &&
      normalizedMonthly.currencyCode &&
      formatCurrency(monthlyAnnualCost, normalizedMonthly.currencyCode)) ||
    null;
  const annualDisplayMonth =
    (annualMonthlyEquivalent !== null &&
      normalizedAnnual.currencyCode &&
      formatCurrency(annualMonthlyEquivalent, normalizedAnnual.currencyCode)) ||
    null;
  const annualDisplayYear =
    (annualValue !== null &&
      normalizedAnnual.currencyCode &&
      formatCurrency(annualValue, normalizedAnnual.currencyCode)) ||
    primaryPrice;

  useEffect(() => {
    logDiscountFlow("paywall_price_diagnostics", {
      monthly: normalizedMonthly,
      annual: normalizedAnnual,
      monthlyAnnualCost,
      annualMonthlyEquivalent,
      savingsPct,
      sameCurrency,
    });
    if (monthlyValue === null || annualValue === null) {
      logDiscountFlow("paywall_price_warning", {
        reason: "invalid_numeric_or_period",
        monthlyRoleCompatible: normalizedMonthly.roleCompatible,
        annualRoleCompatible: normalizedAnnual.roleCompatible,
      });
    }
  }, [
    annualMonthlyEquivalent,
    annualValue,
    monthlyAnnualCost,
    monthlyValue,
    normalizedAnnual,
    normalizedMonthly,
    sameCurrency,
    savingsPct,
  ]);

  return (
    <View style={styles.container}>
      {/* ── MAIN PAYWALL ── */}
      <Animated.View style={[styles.fill, { opacity: mainOpacity }]}>
        <LinearGradient colors={["#FFF7EE", "#FFDDBB", "#FFFFFF"]} style={StyleSheet.absoluteFillObject} />
        <ScrollView
          style={styles.fill}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.paywallScrollContent, { paddingTop: topPad + 14, paddingBottom: botPad + 160 }]}
        >
          <View style={styles.textBlock}>
            <Animated.Text style={[styles.headline, { opacity: subheadlineOpacity }]}>
              {lang === "el" ? `Το πλάνο ${greekBabyNamePossessivePhrase(babyName, babyGender)} είναι έτοιμο` : `${babyName}'s plan is ready`}
            </Animated.Text>
            <Text style={styles.subheadline}>{typedSubheadline}</Text>
          </View>

          <Animated.View style={[styles.planSummaryCard, { opacity: includesTitleOpacity }]}>
            <View style={styles.planSummaryHeaderRow}>
              <View>
                <Image source={require("@/assets/images/2paywallphoto.png")} style={styles.planSummaryAvatar} contentFit="cover" />
              </View>
              <View style={styles.planSummaryHeaderTextWrap}>
                <Text style={styles.planSummaryTitle}>{tOnbPw(lang, "paywall.included")}</Text>
                <Text style={styles.planSummaryAge}>{tOnbPw(lang, "paywall.ageOld", { ageText: babyAgeText })}</Text>
              </View>
            </View>
            <View style={styles.planSummaryBodyRow}>
              <View style={styles.featurePillsWrap}>
                {[
                  { label: lang === "el" ? "Καθημερινές δραστηριότητες" : "Daily activities", emoji: "🗓️" },
                  { label: lang === "el" ? "Καταγραφή μωρού" : "Baby tracker", emoji: "📊" },
                  { label: lang === "el" ? "Ορόσημα ανάπτυξης" : "Milestones", emoji: "🌟" },
                  { label: lang === "el" ? "Ιστορίες για ύπνο" : "Bedtime stories", emoji: "📖" },
                  { label: lang === "el" ? "Υποστήριξη Mία" : "Mia support", emoji: "💬" },
                  { label: lang === "el" ? "Και πολλά ακόμη" : "And much more", emoji: "✨" },
                ].map((pill, idx) => {
                  const pillTone = idx % 3 === 0 ? styles.featurePillToneA : idx % 3 === 1 ? styles.featurePillToneB : styles.featurePillToneC;
                  return (
                  <Animated.View key={pill.label} style={[styles.featurePill, pillTone, { opacity: featureOpacities[idx] }]}>
                    <Text style={styles.featurePillText}>{`${pill.emoji} ${pill.label}`}</Text>
                  </Animated.View>
                )})}
              </View>
              <View style={styles.planSummarySideImageWrap}>
                <Image source={require("@/assets/images/1paywallphoto.png")} style={styles.planSummarySideImage} contentFit="contain" />
              </View>
            </View>
          </Animated.View>

          <View style={styles.pricingRow}>
            <Pressable
              style={({ pressed }) => [
                styles.pricingCard,
                styles.pricingCardMonthly,
                selectedPlan === "monthly" && styles.pricingCardSelected,
                { opacity: isPurchasing || !canPurchaseMonthly ? 0.74 : pressed ? 0.9 : 1 },
              ]}
              onPress={() => {
                void hapticSelection();
                setSelectedPlan("monthly");
              }}
              disabled={isPurchasing}
            >
              <Text style={styles.pricingTitle}>{tOnbPw(lang, "paywall.monthly")}</Text>
              <Text style={styles.pricingValue}>{monthlyDisplayMain || monthlyPrice}</Text>
              <Text style={styles.pricingUnit}>{tOnbPw(lang, "paywall.monthUnit")}</Text>
              <Text style={styles.pricingFadedLine}>
                {monthlyDisplayYear ? `${monthlyDisplayYear}${lang === "el" ? "/έτος" : "/year"}` : monthlyPrice ? "" : "—"}
              </Text>
              <View style={[styles.planDotInCard, selectedPlan === "monthly" ? styles.planDotActive : styles.planDotInactive]} />
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.pricingCard,
                styles.pricingCardAnnual,
                selectedPlan === "annual" && styles.pricingCardSelected,
                { opacity: isPurchasing || !canPurchasePrimary ? 0.74 : pressed ? 0.9 : 1 },
              ]}
              onPress={() => {
                void hapticSelection();
                setSelectedPlan("annual");
              }}
              disabled={isPurchasing}
            >
              <View style={styles.saveStamp}>
                <Text style={styles.saveStampText}>{lang === "el" ? `Κέρδος ${savingsPct ?? 78}%` : `Save ${savingsPct ?? 78}%`}</Text>
              </View>
              <Text style={styles.pricingTitle}>{tOnbPw(lang, "paywall.annual")}</Text>
              <Text style={styles.pricingValue}>
                {annualDisplayMonth || primaryPrice}
              </Text>
              <Text style={styles.pricingUnit}>{tOnbPw(lang, "paywall.monthUnit")}</Text>
              <Text style={styles.pricingBilledLine}>
                {annualDisplayYear
                  ? tOnbPw(lang, "paywall.billedYearly", { price: annualDisplayYear })
                  : tOnbPw(lang, "paywall.billedYearly", { price: "" })}
              </Text>
              <View style={[styles.planDotInCard, selectedPlan === "annual" ? styles.planDotActive : styles.planDotInactive]} />
            </Pressable>
          </View>

          <Pressable
            onLongPress={handleDiscountDebugOpen}
            delayLongPress={700}
            hitSlop={8}
            style={styles.socialProofPressable}
          >
            <Text style={styles.socialProofLine}>{tOnbPw(lang, "paywall.social")}</Text>
          </Pressable>

          <View style={styles.legalLinksRow}>
            <Pressable
              style={({ pressed }) => [styles.legalLinkBtn, { opacity: isRestoring ? 0.72 : pressed ? 0.72 : 1 }]}
              onPress={() => {
                void hapticSelection();
                handleRestorePurchases();
              }}
              disabled={isRestoring}
            >
              <Text style={styles.legalLinkText}>{isRestoring ? tOnbPw(lang, "paywall.restoring") : tOnbPw(lang, "paywall.restore")}</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.legalLinkBtn, { opacity: pressed ? 0.72 : 1 }]} onPress={() => { void hapticSelection(); void openExternal(PRIVACY_URL); }}>
              <View style={styles.externalLinkRow}>
                <Text style={styles.legalLinkText}>{tOnbPw(lang, "paywall.privacy")}</Text>
                <Ionicons name="open-outline" size={13} color={Colors.muted} />
              </View>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.legalLinkBtn, { opacity: pressed ? 0.72 : 1 }]} onPress={() => { void hapticSelection(); void openExternal(TERMS_URL); }}>
              <View style={styles.externalLinkRow}>
                <Text style={styles.legalLinkText}>{tOnbPw(lang, "paywall.terms")}</Text>
                <Ionicons name="open-outline" size={13} color={Colors.muted} />
              </View>
            </Pressable>
          </View>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewBody}>
              {lang === "el"
                ? "«Σταμάτησα να ψάχνω στο Google για το καθετί και να αναρωτιέμαι αν κάνω αρκετά. Το Todayler μου έδωσε απλές καθημερινές δραστηριότητες που πραγματικά ταιριάζουν στην ηλικία του μωρού μου και για πρώτη φορά μετά από μήνες, η γονεϊκότητα ένιωθε πιο ήρεμη.»"
                : "“I stopped Googling every little thing and wondering if I was doing enough. Todayler gave me simple daily activities that actually fit my baby’s age and for the first time in months, parenting felt calmer.”"}
            </Text>
            <View style={styles.reviewAuthorRow}>
              <Image
                source={{ uri: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200" }}
                style={styles.reviewAvatar}
                contentFit="cover"
              />
              <View style={styles.reviewAuthorTextWrap}>
                <Text style={styles.reviewAuthor}>— Emma81</Text>
                <Text style={styles.reviewMeta}>
                  {lang === "el" ? "Μαμά μωρού 5 μηνών • Μέλος Todayler από το 2026" : "Mum of a 5-month-old • Todayler member since 2026"}
                </Text>
              </View>
            </View>
          </View>
          {packagesUnavailable ? (
            <Text style={styles.purchaseWarningText}>
              {tOnbPw(lang, "paywall.unavailable")}
            </Text>
          ) : null}
        </ScrollView>

        <View style={[styles.stickyActionBar, { paddingBottom: Math.max(8, botPad + 2) }]}>
          <Pressable
            style={({ pressed }) => [
              styles.completeButton,
              styles.completeButtonMain,
              { opacity: isPurchasing || !canPurchaseSelected ? 0.72 : pressed ? 0.88 : 1 },
            ]}
            onPress={() => {
              void hapticSelection();
              void (selectedPlan === "annual" ? handleComplete() : handleMonthly());
            }}
            disabled={isPurchasing || !canPurchaseSelected}
          >
            <Text style={styles.completeText}>{selectedCtaText}</Text>
          </Pressable>
            <Text style={styles.completeSubtext}>
              {selectedPlan === "annual"
              ? tOnbPw(lang, "paywall.annualSub", { days: annualTrialDays, price: annualDisplayYear || primaryPrice })
              : tOnbPw(lang, "paywall.monthlySub", { price: monthlyDisplayMain || monthlyPrice })}
            </Text>
        </View>
      </Animated.View>

      {showTrialOfferCard ? (
        <Animated.View
          pointerEvents="auto"
          style={[
            styles.trialOverlay,
            {
              opacity: trialOverlayOpacity,
            },
          ]}
        >
          <View style={styles.trialOverlayDim} />
          <Animated.View
            style={[
              styles.trialOfferCard,
              {
                transform: [{ translateY: trialCardTranslateY }],
              },
            ]}
          >
            <LinearGradient
              colors={["#FFF1E4", "#FBD8B8", "#FFF6EE"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.trialOfferGradient}
            >
              <View pointerEvents="none" style={styles.confettiLayer}>
                {DISCOUNT_CONFETTI.map((piece, idx) => (
                  <Animated.View
                    key={`confetti-${piece.left}-${idx}`}
                    style={[
                      styles.confettiPiece,
                      {
                        left: piece.left,
                        width: piece.size,
                        height: piece.size * 1.9,
                        backgroundColor: piece.color,
                        opacity: confettiFall.interpolate({
                          inputRange: [0, 0.08, 0.85, 1],
                          outputRange: [0, 0.95, 0.9, 0],
                        }),
                        transform: [
                          {
                            translateY: confettiFall.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-32 - idx * 6, piece.distance],
                            }),
                          },
                          {
                            rotate: confettiFall.interpolate({
                              inputRange: [0, 1],
                              outputRange: [piece.rotateStart, piece.rotateEnd],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                ))}
              </View>
              <Pressable
                onPress={() => {
                  void hapticSelection();
                  resetToPrimaryPaywall();
                }}
                style={({ pressed }) => [
                  styles.trialOfferCloseButton,
                  { opacity: pressed ? 0.72 : 1 },
                ]}
                accessibilityRole="button"
                accessibilityLabel={tOnbPw(lang, "paywall.closeDiscountA11y")}
              >
                <Ionicons name="close" size={20} color={Colors.charcoal} />
              </Pressable>
              <View style={styles.trialOfferContent}>
                <Text style={styles.trialOfferHeadline}>
                  {showDiscountUnavailableState ? (
                    <>
                      {tOnbPw(lang, "paywall.offerUnavailableTitle")}
                    </>
                  ) : (
                    <>
                      {tOnbPw(lang, "paywall.offerTitle")}
                    </>
                  )}
                </Text>
                <Animated.Text
                  style={[
                    styles.trialOfferGiftEmoji,
                    {
                      transform: [
                        {
                          translateY: giftMotion.interpolate({
                            inputRange: [0, 1],
                            outputRange: [2, -6],
                          }),
                        },
                        {
                          rotate: giftMotion.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: ["-6deg", "6deg", "-6deg"],
                          }),
                        },
                      ],
                    },
                  ]}
                  accessibilityElementsHidden
                >
                  🎁
                </Animated.Text>
                <Text style={styles.trialOfferBody}>
                  {showDiscountUnavailableState
                    ? tOnbPw(lang, "paywall.offerUnavailableBody")
                    : lang === "el"
                      ? `Πάρε τις καθημερινές δραστηριότητες, την καταγραφή και τα ορόσημα του Todayler προσαρμοσμένα για ${greekBabyNameObjectPhrase(babyName, babyGender)}.`
                      : tOnbPw(lang, "paywall.offerBody", { babyName }, babyGender)}
                </Text>
              </View>
              <View style={styles.trialOfferFooter}>
                <Pressable
                  style={({ pressed }) => [
                    styles.trialOfferButton,
                    { opacity: isPurchasing ? 0.72 : pressed ? 0.88 : 1 },
                  ]}
                  onPress={() => {
                    void hapticSelection();
                    void (showDiscountUnavailableState ? handleRetryDiscountLookup() : handleStartTrialFromOffer());
                  }}
                  disabled={isPurchasing}
                >
                  <View style={styles.trialOfferPriceStack}>
                    <Text style={styles.trialOfferNewPrice}>
                      {showDiscountUnavailableState
                        ? tOnbPw(lang, "paywall.offerRetry")
                        : tOnbPw(lang, "paywall.offerStart", { price: trialOfferPrice })}
                    </Text>
                    {!showDiscountUnavailableState && discountPackage && primaryPrice ? (
                      <Text style={styles.trialOfferOldPrice}>{tOnbPw(lang, "paywall.offerUsually", { price: primaryPrice })}</Text>
                    ) : null}
                    {isPurchasing ? <Text style={styles.trialOfferCtaText}>{tOnbPw(lang, "paywall.processing")}</Text> : null}
                  </View>
                </Pressable>
                <Text style={styles.trialOfferSubtleNote}>
                  {showDiscountUnavailableState
                    ? tOnbPw(lang, "paywall.offerUnavailableNote")
                    : tOnbPw(lang, "paywall.offerNote", { days: discountTrialDays, price: trialOfferPrice })}
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      ) : null}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0EBE0",
  },
  fill: {
    flex: 1,
  },
  paywallScrollContent: {
    paddingHorizontal: 18,
    gap: 10,
  },
  planSummaryCard: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(214,196,170,0.78)",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 8,
    shadowColor: "#9B8366",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
    position: "relative",
  },
  planSummaryHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planSummaryBodyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    overflow: "visible",
    position: "relative",
    paddingRight: 78,
  },
  planSummarySideImageWrap: {
    width: 72,
    position: "absolute",
    right: 8,
    top: -8,
    bottom: -8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  planSummaryAvatar: {
    width: 42,
    height: 42,
    borderRadius: 10,
  },
  planSummaryHeaderTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  planSummarySideImage: {
    width: 120,
    height: 168,
    borderRadius: 18,
    marginHorizontal: -24,
  },
  planSummaryTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 31 - 13,
    lineHeight: 22,
    color: Colors.charcoal,
  },
  planSummaryAge: {
    marginTop: 2,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    lineHeight: 19,
    color: Colors.muted,
  },
  featurePillsWrap: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    justifyContent: "flex-start",
  },
  featurePill: {
    width: "48%",
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  featurePillToneA: {
    backgroundColor: "#E8F3E2",
    borderColor: "#CADFBC",
  },
  featurePillToneB: {
    backgroundColor: "#E9EDF8",
    borderColor: "#C9D2EA",
  },
  featurePillToneC: {
    backgroundColor: "#F6ECE2",
    borderColor: "#E6D5C1",
  },
  featurePillText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 10.5,
    lineHeight: 13,
    color: Colors.charcoal,
    textAlign: "center",
  },
  pricingRow: {
    marginTop: 2,
    flexDirection: "row",
    gap: 10,
  },
  pricingCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 9,
    alignItems: "center",
    minHeight: 176,
    backgroundColor: "rgba(255,255,255,0.92)",
    overflow: "visible",
  },
  pricingCardMonthly: {
    borderColor: "rgba(198,185,164,0.8)",
  },
  pricingCardAnnual: {
    borderColor: "#E4862F",
    borderWidth: 2,
    overflow: "visible",
  },
  pricingCardSelected: {
    shadowColor: "#E4862F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3,
  },
  pricingTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 17,
    lineHeight: 22,
    color: Colors.charcoal,
  },
  pricingValue: {
    marginTop: 4,
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 31,
    lineHeight: 36,
    color: Colors.charcoal,
  },
  pricingUnit: {
    marginTop: 1,
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    lineHeight: 20,
    color: "#5F5144",
  },
  pricingFadedLine: {
    marginTop: 10,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    lineHeight: 16,
    color: "rgba(92,80,68,0.5)",
    textDecorationLine: "line-through",
  },
  saveStamp: {
    position: "absolute",
    alignSelf: "center",
    top: -18,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#E4862F",
    borderWidth: 1,
    borderColor: "rgba(187,98,24,0.9)",
    shadowColor: "#E4862F",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveStampText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    lineHeight: 16,
    color: "#FFFFFF",
  },
  pricingBilledLine: {
    marginTop: 7,
    textAlign: "center",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 11,
    lineHeight: 15,
    color: Colors.muted,
  },
  socialProofLine: {
    marginTop: 2,
    marginBottom: 0,
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    lineHeight: 21,
    color: "#B06A2F",
  },
  socialProofPressable: {
    alignSelf: "center",
  },
  planDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  planDotInCard: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
  },
  planDotActive: {
    backgroundColor: "#E4862F",
  },
  planDotInactive: {
    backgroundColor: "rgba(149,130,108,0.36)",
  },
  completeButtonMain: {
    marginTop: 0,
    borderRadius: 32,
    minHeight: 68,
    backgroundColor: "#E4862F",
    shadowColor: "#E4862F",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
    elevation: 4,
  },
  paywallBackButton: {
    position: "absolute",
    left: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 247, 238, 0.08)",
    zIndex: 30,
  },
  headline: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 30,
    color: Colors.charcoal,
    lineHeight: 38,
    marginBottom: 6,
    textAlign: "center",
  },
  subheadline: {
    fontFamily: "Nunito_400Regular",
    fontSize: 17,
    color: Colors.muted,
    lineHeight: 24,
    marginBottom: 0,
    textAlign: "center",
  },
  subheadlineBrand: {
    fontFamily: "Nunito_700Bold",
    color: "#C88E5C",
  },
  subheadlineAge: {
    fontFamily: "Nunito_400Regular",
    color: Colors.muted,
  },
  heroImageStack: {
    width: "104%",
    height: SCREEN_H * 0.5,
    alignSelf: "center",
    marginTop: -38,
    alignItems: "center",
    justifyContent: "center",
  },
  heroImageBase: {
    width: "100%",
    height: "100%",
  },
  heroImageBaseWrap: {
    width: "100%",
    height: "100%",
  },
  heroImageOverlayWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  heroImageOverlay: {
    width: "100%",
    height: "100%",
  },
  textBlock: {
    paddingHorizontal: 4,
    paddingTop: 2,
    paddingBottom: 2,
    marginTop: 0,
    marginBottom: 4,
    alignItems: "center",
  },
  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingTop: 10,
    backgroundColor: Colors.cream,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: 2,
  },
  planCardPrimary: {
    borderRadius: 14,
    borderWidth: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 4,
  },
  bestValueBadge: {
    alignSelf: "flex-start",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D8C4AE",
    backgroundColor: "#FDEAD8",
    paddingHorizontal: 8,
    paddingVertical: 2,
    transform: [{ rotate: "0deg" }],
    marginBottom: -10,
    zIndex: 6,
  },
  bestValueBadgeText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11,
    color: "#8F7D6D",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  planPricePrimary: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 30,
    lineHeight: 34,
    color: Colors.charcoal,
  },
  planCardSecondary: {
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 2,
    alignSelf: "center",
    width: "88%",
  },
  planOrText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: Colors.muted,
    textAlign: "center",
    marginVertical: -3,
  },
  planPriceSecondary: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    lineHeight: 22,
    color: Colors.charcoal,
  },
  secondaryPlanButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.charcoal,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 9 + Math.round(PAYWALL_TEXT_SCALE_EXTRA * 4),
    paddingHorizontal: 8,
  },
  secondaryPlanButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 17,
    color: Colors.charcoal,
    textAlign: "center",
    flexShrink: 1,
  },
  completeButton: {
    backgroundColor: Colors.charcoal,
    borderRadius: 12,
    minHeight: 50,
    paddingVertical: 11 + Math.round(PAYWALL_TEXT_SCALE_EXTRA * 4),
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  completeText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 23,
    color: Colors.white,
    textAlign: "center",
    flexShrink: 1,
  },
  completeSubtext: {
    fontFamily: "Nunito_400Regular",
    fontSize: 11,
    lineHeight: 14,
    color: Colors.muted,
    textAlign: "center",
    width: "88%",
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 0,
  },
  stickyActionBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    backgroundColor: "rgba(255,246,236,0.98)",
    borderTopWidth: 1,
    borderTopColor: "rgba(230,187,140,0.72)",
  },
  purchaseWarningText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
    lineHeight: 16,
    color: Colors.error,
    textAlign: "center",
    marginTop: 2,
  },
  legalLinksRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  reviewCard: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(218,199,172,0.9)",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  reviewBody: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 13,
    lineHeight: 19,
    color: Colors.charcoal,
  },
  reviewAuthor: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    lineHeight: 18,
    color: Colors.charcoal,
  },
  reviewAuthorRow: {
    marginTop: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  reviewAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "rgba(218,199,172,0.9)",
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  reviewAuthorTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  reviewMeta: {
    marginTop: 1,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    lineHeight: 17,
    color: Colors.muted,
  },
  legalLinkBtn: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  legalLinkText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    color: Colors.muted,
  },
  externalLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trialOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "stretch",
    zIndex: 20,
  },
  trialOverlayDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20, 10, 4, 0.9)",
  },
  trialOfferCard: {
    width: "100%",
    height: "92%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  trialOfferGradient: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(245, 180, 132, 0.55)",
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 0,
    justifyContent: "flex-start",
  },
  confettiLayer: {
    ...StyleSheet.absoluteFillObject,
    top: 52,
    height: 300,
    overflow: "hidden",
  },
  confettiPiece: {
    position: "absolute",
    top: 0,
    borderRadius: 3,
  },
  trialOfferCloseButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(44, 28, 12, 0.18)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  trialOfferContent: {
    gap: 16,
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 10,
  },
  trialOfferBody: {
    fontFamily: "Nunito_400Regular",
    fontSize: 18,
    lineHeight: 28,
    color: Colors.muted,
    textAlign: "center",
  },
  trialOfferGiftEmoji: {
    fontSize: 70,
    lineHeight: 74,
    textAlign: "center",
    marginTop: 2,
    marginBottom: -2,
  },
  trialOfferFooter: {
    position: "absolute",
    left: 24,
    right: 24,
    top: "47%",
    transform: [{ translateY: -44 }],
    alignItems: "center",
    justifyContent: "center",
  },
  trialOfferHeadline: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 38,
    lineHeight: 46,
    color: Colors.charcoal,
    textAlign: "center",
  },
  trialOfferHeadlineAccent: {
    color: Colors.charcoal,
  },
  trialOfferButton: {
    backgroundColor: Colors.charcoal,
    borderRadius: 20,
    minHeight: 74 + Math.round(PAYWALL_TEXT_SCALE_EXTRA * 12),
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: Math.round(PAYWALL_TEXT_SCALE_EXTRA * 4),
  },
  trialOfferPriceStack: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  trialOfferOldPrice: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "rgba(255,255,255,0.7)",
    textDecorationLine: "line-through",
  },
  trialOfferNewPrice: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 26,
    color: Colors.play,
    textAlign: "center",
  },
  trialOfferSubtleNote: {
    marginTop: 8,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 10.5,
    lineHeight: 13,
    color: "rgba(44, 33, 20, 0.55)",
    textAlign: "center",
    width: "100%",
  },
  trialOfferCtaText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: Colors.white,
  },
});
