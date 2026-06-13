import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Animated,
  Easing,
  Platform,
  Keyboard,
  AppState,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
  PixelRatio,
  InteractionManager,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useBaby } from "@/contexts/BabyContext";
import { useAuth } from "@/contexts/AuthContext";
import Colors from "@/constants/colors";
import { getDaysInMonth } from "@/lib/date";
import { DOB_CENTER_PAD, DOB_ITEM_HEIGHT, DOB_PICKER_HEIGHT } from "@/lib/dobPicker";
import OnboardingPartyLights from "@/components/OnboardingPartyLights";
import {
  MILESTONE_BANDS,
  type MilestoneCategory,
  getMilestoneTopWeeklyNote,
  resolveDisplayBandKey,
} from "@/data/milestoneBands";
import { getChapterRecordForWeek, getNextChapterPreview } from "@/data/chapters";
import {
  getOnboardingLang,
  setOnboardingLang,
  type OnboardingPaywallLanguage,
} from "@/lib/onboardingLanguage";
import { tOnbPw } from "@/lib/onboardingPaywallI18n";
import { greekBabyNameObjectPhrase, greekBabyNamePossessivePhrase, greekNameNeutralArticle } from "@/lib/greekGrammar";

const ONBOARDING_FONT_SCALE = PixelRatio.getFontScale();
const ONBOARDING_FOOTER_EXTRA_SPACE = Math.max(0, Math.round((ONBOARDING_FONT_SCALE - 1) * 64));
const ONBOARDING_FOOTER_BOTTOM_OFFSET = 32 + Math.round(ONBOARDING_FOOTER_EXTRA_SPACE * 0.35);
const ONBOARDING_CONTINUE_VERTICAL_PADDING = 18 + Math.round(ONBOARDING_FOOTER_EXTRA_SPACE * 0.12);

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_EL = [
  "Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος",
  "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: Math.max(1, currentYear - 2024 + 1) }, (_, i) => currentYear - i);
const WEEKS_EARLY_OPTIONS = Array.from({ length: 18 }, (_, i) => i + 1);
const PREEMIE_PICKER_HEIGHT = DOB_ITEM_HEIGHT * 3;
const PREEMIE_CENTER_PAD = (PREEMIE_PICKER_HEIGHT - DOB_ITEM_HEIGHT) / 2;

function formatHour(h: number): string {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 5); // 5am–10pm
const REVIEW_CARD_WIDTH = 220;
const REVIEW_CARD_GAP = 10;
const GOOGLE_LOGO_URI = "https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png";

function triggerAnswerHaptic() {
  if (Platform.OS !== "ios") return;
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

function triggerWheelSettleHaptic() {
  if (Platform.OS !== "ios") return;
  void Haptics.selectionAsync().catch(() => {});
}

function triggerTypingHaptic() {
  if (Platform.OS !== "ios") return;
  void Haptics.selectionAsync().catch(() => {});
}

function triggerContinueHaptic() {
  if (Platform.OS !== "ios") return;
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}


// ── OptionCard ───────────────────────────────────────────────────────────────

function OptionCard({
  label,
  selected,
  onPress,
  delay = 0,
  stackEmoji = false,
  large = false,
  minHeight,
  compactText = false,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  delay?: number;
  stackEmoji?: boolean;
  large?: boolean;
  minHeight?: number;
  compactText?: boolean;
}) {
  const enterAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const displayLabel =
    label === "Mom"
      ? "👩 Mom"
      : label === "Dad"
      ? "👨 Dad"
      : label === "Grandparent"
      ? "👵 Grandparent"
      : label === "Loving it"
      ? "😌 Loving it"
      : label === "A bit anxious"
      ? "😰 A bit anxious"
      : label === "Exhausted"
      ? "😴 Exhausted"
      : label === "Just surviving"
      ? "😵 Just surviving"
      : label === "Not enough time"
      ? "⏱️ Not enough time"
      : label === "Overlooking something"
      ? "😟 Overlooking something"
      : label === "Just need it to be easy"
      ? "🪄 Just need it to be easy"
      : label;
  const stackedParts = (() => {
    if (label === "Mom") return { emoji: "👩", text: "Mom" };
    if (label === "Dad") return { emoji: "👨", text: "Dad" };
    if (label === "Grandparent") return { emoji: "👵", text: "Grandparent" };
    if (label === "Other") return { emoji: "", text: "Other" };
    if (label === "Loving it") return { emoji: "😌", text: "Loving it" };
    if (label === "A bit anxious") return { emoji: "😰", text: "A bit anxious" };
    if (label === "Exhausted") return { emoji: "😴", text: "Exhausted" };
    if (label === "Just surviving") return { emoji: "😵", text: "Just surviving" };
    if (label === "Not enough time") return { emoji: "⏱️", text: "Not enough time" };
    if (label === "Overlooking something") return { emoji: "😟", text: "Overlooking something" };
    if (label === "Just need it to be easy") return { emoji: "🪄", text: "Just need it to be easy" };
    if (label.startsWith("🤷‍♀️ ")) return { emoji: "🤷‍♀️", text: label.replace("🤷‍♀️ ", "") };
    if (label.startsWith("🤷 ")) return { emoji: "🤷", text: label.replace("🤷 ", "") };
    const spacedParts = label.trim().split(/\s+/);
    if (spacedParts.length > 1) {
      const first = spacedParts[0];
      const rest = spacedParts.slice(1).join(" ");
      if (/[^a-z0-9\u0370-\u03ff\u1f00-\u1fff]/i.test(first)) {
        return { emoji: first, text: rest };
      }
    }
    return { emoji: "", text: displayLabel };
  })();

  useEffect(() => {
    Animated.timing(enterAnim, {
      toValue: 1,
      duration: 280,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: enterAnim,
        transform: [
          { translateY: enterAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) },
          { scale: scaleAnim },
        ],
      }}
    >
      <Pressable
        style={[
          styles.optionCard,
          large && styles.optionCardLarge,
          typeof minHeight === "number" ? { minHeight } : null,
          selected && styles.optionCardSelected,
        ]}
        onPress={onPress}
        onPressIn={() =>
          Animated.spring(scaleAnim, { toValue: 1.04, useNativeDriver: true, speed: 40, bounciness: 0 }).start()
        }
        onPressOut={() =>
          Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 0 }).start()
        }
      >
        {stackEmoji ? (
          <View style={styles.optionEmojiStack}>
            <Text style={styles.optionEmojiTop}>{stackedParts.emoji || " "}</Text>
            <Text
              style={[
                styles.optionText,
                styles.optionTextCentered,
                styles.optionTextLarge,
                compactText && styles.optionTextLargeCompact,
                selected && styles.optionTextSelected,
              ]}
            >
              {stackedParts.text}
            </Text>
          </View>
        ) : (
          <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{displayLabel}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

// ── Sub-screens ───────────────────────────────────────────────────────────────

const HOOK_IMAGE_URIS = [
  "https://images.pexels.com/photos/3820059/pexels-photo-3820059.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=2000",
  "https://images.pexels.com/photos/11369189/pexels-photo-11369189.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=2000",
  "https://images.pexels.com/photos/3995921/pexels-photo-3995921.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=2000",
  "https://images.pexels.com/photos/7282316/pexels-photo-7282316.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=2000",
  "https://images.pexels.com/photos/19773885/pexels-photo-19773885.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=2000",
];
const HOOK_TITLE_COLORS = ["#D97745", "#F29B5D", "#CF7340", "#E68952", "#C86533"];
function HookScreen({
  onNext,
  lang,
  onLangChange,
}: {
  onNext: () => void;
  lang: OnboardingPaywallLanguage;
  onLangChange: (lang: OnboardingPaywallLanguage) => void;
}) {
  const BG_FADE_DURATION_MS = 1000;
  const BG_CYCLE_MS = 5715;
  const anim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(1)).current;
  const [imageIndex, setImageIndex] = useState(0);
  const [isBrandTransitioning, setIsBrandTransitioning] = useState(false);
  const imageIndexRef = useRef(0);

  useEffect(() => {
    imageIndexRef.current = imageIndex;
  }, [imageIndex]);

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBrandTransitioning(true);
      Animated.timing(bgAnim, {
        toValue: 0,
        duration: BG_FADE_DURATION_MS,
        useNativeDriver: true,
      }).start(() => {
        const next = (imageIndexRef.current + 1) % HOOK_IMAGE_URIS.length;
        // Switch Todayler back to its color as soon as the new background starts
        // fading in, so text/color timing matches the visual transition.
        setIsBrandTransitioning(false);
        setImageIndex(next);
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: BG_FADE_DURATION_MS,
          useNativeDriver: true,
        }).start();
      });
    }, BG_CYCLE_MS);

    return () => clearInterval(interval);
  }, [BG_CYCLE_MS, BG_FADE_DURATION_MS]);

  return (
    <View style={styles.hookContainer}>
      {/* Background photo */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: bgAnim }]}>
        <Image
          source={{ uri: HOOK_IMAGE_URIS[imageIndex] }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
      </Animated.View>
      {/* Blur layer */}
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      {/* Dark tint so text pops */}
      <View style={[StyleSheet.absoluteFill, styles.hookDimmer]} />

      <Text
        style={[
          styles.hookBrand,
          { color: isBrandTransitioning ? Colors.white : HOOK_TITLE_COLORS[imageIndex] ?? Colors.play },
        ]}
      >
        Todayler
      </Text>

      <View style={styles.hookLangToggleWrap}>
        <Pressable
          style={[styles.hookLangPill, lang === "en" && styles.hookLangPillActive]}
          onPress={() => onLangChange("en")}
        >
          <Text style={[styles.hookLangText, lang === "en" && styles.hookLangTextActive]}>
            {tOnbPw(lang, "lang.en")}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.hookLangPill, lang === "el" && styles.hookLangPillActive]}
          onPress={() => onLangChange("el")}
        >
          <Text style={[styles.hookLangText, lang === "el" && styles.hookLangTextActive]}>
            {tOnbPw(lang, "lang.el")}
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <Animated.View style={[styles.hookContent, { opacity: anim }]}>
        <Text style={styles.hookTitle}>{tOnbPw(lang, "hook.title")}</Text>
        <Text style={styles.hookSub}>
          {tOnbPw(lang, "hook.subtitle")}
        </Text>
        <Pressable style={styles.hookButton} onPress={() => { triggerContinueHaptic(); onNext(); }}>
          <Text style={styles.hookButtonText}>{tOnbPw(lang, "hook.buildPlan")}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function QuestionScreen({
  title,
  options,
  value,
  onSelect,
  onNext,
  optionLabels,
  autoAdvance = false,
  twoColumn = false,
  stickOptionsToBottom = false,
  stackRoleEmoji = false,
  largeOptions = false,
  disableFooterReserve = false,
  bottomInset = 0,
  centerTitle = false,
  equalizeTwoColumnRows = false,
  compactChoiceText = false,
  continueLabel = "Continue",
}: {
  title: string;
  options: string[];
  value: string;
  onSelect: (v: string) => void;
  onNext: (selected?: string) => void;
  optionLabels?: Record<string, string>;
  autoAdvance?: boolean;
  twoColumn?: boolean;
  stickOptionsToBottom?: boolean;
  stackRoleEmoji?: boolean;
  largeOptions?: boolean;
  disableFooterReserve?: boolean;
  bottomInset?: number;
  centerTitle?: boolean;
  equalizeTwoColumnRows?: boolean;
  compactChoiceText?: boolean;
  continueLabel?: string;
}) {
  const { width: windowWidth } = useWindowDimensions();
  const [twoColumnRowHeights, setTwoColumnRowHeights] = useState<Record<number, number>>({});
  const shouldEqualizeRows = twoColumn && equalizeTwoColumnRows && windowWidth >= 360;

  useEffect(() => {
    setTwoColumnRowHeights({});
  }, [options, shouldEqualizeRows, windowWidth]);

  const setRowHeight = useCallback((rowIndex: number, measuredHeight: number) => {
    if (!shouldEqualizeRows) return;
    setTwoColumnRowHeights((prev) => {
      const current = prev[rowIndex] ?? 0;
      if (measuredHeight <= current) return prev;
      return { ...prev, [rowIndex]: measuredHeight };
    });
  }, [shouldEqualizeRows]);

  return (
    <View style={styles.questionScreenWrap}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.questionContainer,
          styles.questionContainerPlain,
          !disableFooterReserve && styles.questionContainerWithFooter,
        ]}
      >
        <Text style={[styles.questionTitle, centerTitle && styles.questionTitleCentered]}>{title}</Text>
        <View
          style={[
            styles.optionsGap,
            twoColumn && styles.optionsGrid,
            stickOptionsToBottom && styles.optionsBottomAnchor,
            stickOptionsToBottom && { marginBottom: Platform.OS === "ios" ? Math.max(-12, bottomInset - 16) : 0 },
          ]}
        >
          {options.map((opt, i) => (
            <View
              key={opt}
              style={twoColumn ? styles.optionGridCell : undefined}
              onLayout={(e) => setRowHeight(Math.floor(i / 2), e.nativeEvent.layout.height)}
            >
              <OptionCard
                label={optionLabels?.[opt] ?? opt}
                selected={value === opt}
                stackEmoji={stackRoleEmoji}
                large={largeOptions}
                compactText={compactChoiceText}
                minHeight={shouldEqualizeRows ? twoColumnRowHeights[Math.floor(i / 2)] : undefined}
                onPress={() => {
                  triggerAnswerHaptic();
                  onSelect(opt);
                  if (autoAdvance) {
                    onNext(opt);
                  }
                }}
                delay={i * 80}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      {!autoAdvance && value !== "" && (
        <View style={styles.continueFooterAbsolute}>
          <Pressable style={styles.continueButton} onPress={() => { triggerContinueHaptic(); onNext(value); }}>
            <Text style={styles.continueButtonText}>{continueLabel}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function MultiQuestionScreen({
  title,
  options,
  values,
  onToggle,
  onNext,
}: {
  title: string;
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <View style={styles.questionScreenWrap}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.questionContainer, styles.questionContainerPlain, styles.questionContainerWithFooter]}
      >
        <Text style={styles.questionTitle}>{title}</Text>
        <View style={styles.optionsGap}>
          {options.map((opt, i) => (
            <OptionCard
              key={opt}
              label={opt}
              selected={values.includes(opt)}
              onPress={() => onToggle(opt)}
              delay={i * 80}
            />
          ))}
        </View>
      </ScrollView>
      {values.length > 0 && (
        <View style={styles.continueFooterAbsolute}>
          <Pressable style={styles.continueButton} onPress={() => { triggerContinueHaptic(); onNext(); }}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function NameScreen({
  value,
  gender,
  lang,
  onChange,
  onGenderChange,
  onNext,
}: {
  value: string;
  gender: "boy" | "girl" | "unspecified" | "";
  lang: OnboardingPaywallLanguage;
  onChange: (v: string) => void;
  onGenderChange: (v: "boy" | "girl" | "unspecified") => void;
  onNext: () => void;
}) {
  const inputRef = useRef<TextInput | null>(null);
  const lastTypingHapticAtRef = useRef(0);
  const canContinue =
    value.trim().length > 0 &&
    (gender === "boy" || gender === "girl" || gender === "unspecified");

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    const task = InteractionManager.runAfterInteractions(() => {
      inputRef.current?.focus();
    });
    return () => task.cancel();
  }, []);

  return (
    <View style={[styles.questionScreenWrap, styles.questionContainerPlain]}>
      <Text style={styles.questionTitle}>{tOnbPw(lang, "question.babyName")}</Text>
      <Text style={styles.questionSub}>{lang === "el" ? "Το χρειάζεται η εφαρμογή για πλήρη προσωποποίηση." : "This is required so we can personalize the app for your baby."}</Text>
      <TextInput
        ref={inputRef}
        style={styles.nameInput}
        placeholder={lang === "el" ? "Όνομα μωρού" : "Baby's name"}
        placeholderTextColor={Colors.muted}
        value={value}
        onChangeText={(text) => {
          const now = Date.now();
          if (now - lastTypingHapticAtRef.current > 45) {
            triggerTypingHaptic();
            lastTypingHapticAtRef.current = now;
          }
          onChange(text);
        }}
        autoFocus={Platform.OS === "ios"}
        autoCapitalize="words"
        autoCorrect={false}
        maxLength={30}
        returnKeyType="done"
        onSubmitEditing={() => {
          if (canContinue) onNext();
        }}
      />
      <Text style={styles.genderLabel}>{tOnbPw(lang, "question.babyGender")}</Text>
      <View style={styles.genderRow}>
        <Pressable
          style={[styles.genderChip, gender === "boy" && styles.genderChipSelected]}
          onPress={() => {
            triggerAnswerHaptic();
            onGenderChange("boy");
          }}
        >
          <Text style={[styles.genderChipText, gender === "boy" && styles.genderChipTextSelected]}>
            {lang === "el" ? "👶 Αγόρι" : "👶 Boy"}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.genderChip, gender === "girl" && styles.genderChipSelected]}
          onPress={() => {
            triggerAnswerHaptic();
            onGenderChange("girl");
          }}
        >
          <Text style={[styles.genderChipText, gender === "girl" && styles.genderChipTextSelected]}>
            {lang === "el" ? "👧 Κορίτσι" : "👧 Girl"}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.genderChip, gender === "unspecified" && styles.genderChipSelected]}
          onPress={() => {
            triggerAnswerHaptic();
            onGenderChange("unspecified");
          }}
        >
          <Text
            style={[
              styles.genderChipText,
              gender === "unspecified" && styles.genderChipTextSelected,
            ]}
          >
            {lang === "el" ? "Δεν ορίζεται" : "Unspecified"}
          </Text>
        </Pressable>
      </View>
      <View style={styles.nameContinueFooterInline}>
        <Pressable
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={() => { triggerContinueHaptic(); onNext(); }}
          disabled={!canContinue}
        >
          <Text style={styles.continueButtonText}>{tOnbPw(lang, "common.continue")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const EMOTIONAL_CONTENT: Record<string, { title: string; subtitle: string; imageUri: string }> = {
  "A bit anxious": {
    title: "You're not alone.",
    subtitle: "That's more common than you think. Todayler is designed to remove guessing from your day, one small thing at a time.",
    imageUri:
      "https://images.pexels.com/photos/6849563/pexels-photo-6849563.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1400",
  },
  Exhausted: {
    title: "One day at a time.",
    subtitle: "You're doing more than you realize. We'll keep your baby's plan simple enough for your hardest days.",
    imageUri:
      "https://images.pexels.com/photos/6849487/pexels-photo-6849487.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1400",
  },
  "Just surviving": {
    title: "That's real. And it matters.",
    subtitle: "That's honest and that takes courage to say. We've got you. Your baby's plan will work even on your worst days.",
    imageUri:
      "https://images.pexels.com/photos/30654964/pexels-photo-30654964.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1400",
  },
};

function CharByCharText({ text, style, charAnims }: { text: string; style: any; charAnims: Animated.Value[] }) {
  return (
    <Text style={style}>
      {text.split("").map((char, i) => (
        <Animated.Text key={i} style={{ opacity: charAnims[i] }}>
          {char}
        </Animated.Text>
      ))}
    </Text>
  );
}

function EmotionalResponseScreen({
  emotionalState,
  lang,
  onNext,
}: {
  emotionalState: string;
  lang: OnboardingPaywallLanguage;
  onNext: () => void;
}) {
  const content = EMOTIONAL_CONTENT[emotionalState];
  const subtitleText = content?.subtitle ?? "";
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(10)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageY = useRef(new Animated.Value(10)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleY = useRef(new Animated.Value(10)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    titleOpacity.setValue(0);
    titleY.setValue(10);
    imageOpacity.setValue(0);
    imageY.setValue(10);
    subtitleOpacity.setValue(0);
    subtitleY.setValue(10);
    buttonAnim.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(titleY, { toValue: 0, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(imageOpacity, { toValue: 1, duration: 180, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(imageY, { toValue: 0, duration: 180, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(subtitleOpacity, { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(subtitleY, { toValue: 0, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(buttonAnim, { toValue: 1, duration: 180, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, [buttonAnim, imageOpacity, imageY, subtitleOpacity, subtitleY, titleOpacity, titleY]);

  const localizedContent = useMemo(() => {
    if (lang !== "el") return content;
    if (emotionalState === "A bit anxious") {
      return {
        ...content,
        title: "Δεν είσαι μόνος σε αυτό.",
        subtitle: "Είναι πιο συχνό απ’ όσο νομίζεις. Το Todayler μειώνει την αβεβαιότητα με μικρά καθημερινά βήματα.",
      };
    }
    if (emotionalState === "Exhausted") {
      return {
        ...content,
        title: "Μέρα με τη μέρα.",
        subtitle: "Κάνεις περισσότερα απ’ όσα νομίζεις. Θα κρατήσουμε το πλάνο απλό, ειδικά στις δύσκολες μέρες.",
      };
    }
    return {
      ...content,
      title: "Είναι αληθινό. Και μετράει.",
      subtitle: "Το να το λες θέλει δύναμη. Σε έχουμε. Το πλάνο θα δουλεύει ακόμα και στις πιο βαριές μέρες.",
    };
  }, [content, emotionalState, lang]);

  if (!localizedContent) return null;

  return (
    <View style={[styles.emotionalContainer, styles.encouragementContent, styles.questionContainerWithFooter]}>
      <Animated.Text style={[styles.emotionalTitle, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}>
        {localizedContent.title}
      </Animated.Text>
      <Animated.View style={{ opacity: imageOpacity, transform: [{ translateY: imageY }] }}>
        <Image source={{ uri: localizedContent.imageUri }} style={styles.emotionalImage} contentFit="cover" />
      </Animated.View>
      <Animated.Text style={[styles.emotionalSubtitle, { opacity: subtitleOpacity, transform: [{ translateY: subtitleY }] }]}>
        {localizedContent.subtitle}
      </Animated.Text>
      <Animated.View style={[styles.continueFooterAbsolute, { opacity: buttonAnim }]}>
        <Pressable style={styles.continueButton} onPress={() => { triggerContinueHaptic(); onNext(); }}>
          <Text style={styles.continueButtonText}>{tOnbPw(lang, "common.continue")}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function LuckyScreen({
  name,
  gender,
  lang,
  onNext,
}: {
  name: string;
  gender: "boy" | "girl" | "unspecified" | "";
  lang: OnboardingPaywallLanguage;
  onNext: () => void;
}) {
  const subtitleText = lang === "el"
    ? `Το Todayler είναι εδώ για να βοηθήσει εσένα και ${greekBabyNameObjectPhrase(name, gender)} να μεγαλώνετε μαζί, με αγάπη κάθε μέρα.`
    : `Todayler is here to help you and ${name} grow together, one loving moment at a time.`;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const charAnims = useRef(subtitleText.split("").map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const OUTER_FADE = 180;
    const BUFFER = 60;
    const TITLE_DUR = 560;
    const SUBTITLE_START = OUTER_FADE + BUFFER + TITLE_DUR + 80;
    const CHAR_STAGGER = 18;
    const CHAR_DUR = 60;
    const BUTTON_START = SUBTITLE_START + charAnims.length * CHAR_STAGGER + CHAR_DUR + 80;

    const t1 = setTimeout(() => {
      Animated.timing(titleAnim, { toValue: 1, duration: TITLE_DUR, useNativeDriver: true }).start();
    }, OUTER_FADE + BUFFER);

    const t2 = setTimeout(() => {
      Animated.stagger(CHAR_STAGGER, charAnims.map(anim =>
        Animated.timing(anim, { toValue: 1, duration: CHAR_DUR, useNativeDriver: true })
      )).start();
    }, SUBTITLE_START);

    const t3 = setTimeout(() => {
      Animated.timing(buttonAnim, { toValue: 1, duration: 260, useNativeDriver: true }).start();
    }, BUTTON_START);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <View style={[styles.emotionalContainer, styles.encouragementContent, styles.questionContainerWithFooter]}>
      <Animated.Text style={[styles.luckyText, { opacity: titleAnim }]}>
        {lang === "el" ? `${name} είναι τυχερό\nπου σε έχει.` : `${name} is lucky\nto have you.`}
      </Animated.Text>
      <CharByCharText text={subtitleText} style={styles.luckySubtext} charAnims={charAnims} />
      <Animated.View style={[styles.continueFooterAbsolute, { opacity: buttonAnim }]}>
        <Pressable style={styles.continueButton} onPress={() => { triggerContinueHaptic(); onNext(); }}>
          <Text style={styles.continueButtonText}>{tOnbPw(lang, "common.continue")}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function BirthdayScreen({
  name,
  gender,
  lang,
  day,
  month,
  year,
  isEarly,
  weeksEarly,
  onDayChange,
  onMonthChange,
  onYearChange,
  onSelectEarly,
  onWeeksChange,
  onNext,
}: {
  name: string;
  gender: "boy" | "girl" | "unspecified" | "";
  lang: OnboardingPaywallLanguage;
  day: number | null;
  month: number;
  year: number;
  isEarly: "yes" | "no";
  weeksEarly: number;
  onDayChange: (d: number) => void;
  onMonthChange: (m: number) => void;
  onYearChange: (y: number) => void;
  onSelectEarly: (v: "yes" | "no") => void;
  onWeeksChange: (weeks: number) => void;
  onNext: () => void;
}) {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();
  const availableYears = useMemo(
    () => YEARS.filter((y) => y <= todayYear),
    [todayYear]
  );
  const availableMonthOptions = useMemo(
    () =>
      (lang === "el" ? MONTHS_EL : MONTHS).map((label, index) => ({ label, index })).filter(({ index }) =>
        year === todayYear ? index <= todayMonth : true
      ),
    [lang, year, todayYear, todayMonth]
  );
  const availableDays = useMemo(() => {
    const monthMax = getDaysInMonth(year, month);
    const allowedMax = year === todayYear && month === todayMonth ? Math.min(monthMax, todayDay) : monthMax;
    return Array.from({ length: allowedMax }, (_, i) => i + 1);
  }, [year, month, todayYear, todayMonth, todayDay]);
  const dayScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);
  const weeksScrollRef = useRef<ScrollView>(null);
  type WheelKey = "day" | "month" | "year" | "weeks";
  const settleTokenRef = useRef<Record<WheelKey, number>>({
    day: 0,
    month: 0,
    year: 0,
    weeks: 0,
  });
  const isDraggingRef = useRef<Record<WheelKey, boolean>>({
    day: false,
    month: false,
    year: false,
    weeks: false,
  });
  const isMomentumActiveRef = useRef<Record<WheelKey, boolean>>({
    day: false,
    month: false,
    year: false,
    weeks: false,
  });
  const isSettlingRef = useRef<Record<WheelKey, boolean>>({
    day: false,
    month: false,
    year: false,
    weeks: false,
  });
  const pendingTargetIndexRef = useRef<Record<WheelKey, number | null>>({
    day: null,
    month: null,
    year: null,
    weeks: null,
  });
  const canContinue = day !== null && (isEarly === "no" || (isEarly === "yes" && weeksEarly > 0));

  useEffect(() => {
    const dayIndex = day ? Math.max(0, availableDays.indexOf(day)) : 0;
    const monthIndex = Math.max(0, availableMonthOptions.findIndex((entry) => entry.index === month));
    const yearIndex = Math.max(0, availableYears.indexOf(year));
    const weeksIndex = Math.max(0, WEEKS_EARLY_OPTIONS.indexOf(weeksEarly));
    if (!isDraggingRef.current.day && !isMomentumActiveRef.current.day && !isSettlingRef.current.day && pendingTargetIndexRef.current.day !== dayIndex) {
      dayScrollRef.current?.scrollTo({ y: dayIndex * DOB_ITEM_HEIGHT, animated: false });
      pendingTargetIndexRef.current.day = dayIndex;
    }
    if (!isDraggingRef.current.month && !isMomentumActiveRef.current.month && !isSettlingRef.current.month && pendingTargetIndexRef.current.month !== monthIndex) {
      monthScrollRef.current?.scrollTo({ y: monthIndex * DOB_ITEM_HEIGHT, animated: false });
      pendingTargetIndexRef.current.month = monthIndex;
    }
    if (!isDraggingRef.current.year && !isMomentumActiveRef.current.year && !isSettlingRef.current.year && pendingTargetIndexRef.current.year !== yearIndex) {
      yearScrollRef.current?.scrollTo({ y: yearIndex * DOB_ITEM_HEIGHT, animated: false });
      pendingTargetIndexRef.current.year = yearIndex;
    }
    if (isEarly === "yes") {
      if (!isDraggingRef.current.weeks && !isMomentumActiveRef.current.weeks && !isSettlingRef.current.weeks && pendingTargetIndexRef.current.weeks !== weeksIndex) {
        weeksScrollRef.current?.scrollTo({ y: weeksIndex * DOB_ITEM_HEIGHT, animated: false });
        pendingTargetIndexRef.current.weeks = weeksIndex;
      }
    }
  }, [day, month, year, availableDays, availableMonthOptions, availableYears, isEarly, weeksEarly]);

  useEffect(() => {
    if (day === null) return;
    if (availableDays.includes(day)) return;
    const clampedDay = availableDays[availableDays.length - 1];
    if (typeof clampedDay === "number") {
      onDayChange(clampedDay);
    }
  }, [availableDays, day, onDayChange]);

  function getSnappedIndex(offsetY: number, length: number) {
    if (length <= 0) return 0;
    const maxOffset = (length - 1) * DOB_ITEM_HEIGHT;
    const clampedOffset = Math.max(0, Math.min(maxOffset, Number.isFinite(offsetY) ? offsetY : 0));
    const raw = clampedOffset / DOB_ITEM_HEIGHT;
    const lower = Math.floor(raw);
    const fraction = raw - lower;
    // Tie-break near midpoint to prevent flip-flopping between adjacent values.
    const EPSILON = 0.0001;
    const biased = fraction >= 0.5 - EPSILON ? lower + 1 : lower;
    return Math.max(0, Math.min(length - 1, biased));
  }

  function finalizeWheel<T>({
    wheel,
    token,
    offsetY,
    options,
    currentValue,
    scrollRef,
    onChange,
  }: {
    wheel: WheelKey;
    token: number;
    offsetY: number;
    options: T[];
    currentValue: T;
    scrollRef: React.RefObject<ScrollView | null>;
    onChange: (value: T) => void;
  }) {
    if (options.length === 0) return;
    if (token !== settleTokenRef.current[wheel]) return;
    isSettlingRef.current[wheel] = true;
    const index = getSnappedIndex(offsetY, options.length);
    const snappedValue = options[index];
    const targetY = index * DOB_ITEM_HEIGHT;
    pendingTargetIndexRef.current[wheel] = index;
    scrollRef.current?.scrollTo({ y: targetY, animated: false });
    if (snappedValue !== currentValue) {
      triggerWheelSettleHaptic();
      onChange(snappedValue);
    }
    isSettlingRef.current[wheel] = false;
  }

  function beginWheelDrag(wheel: WheelKey) {
    settleTokenRef.current[wheel] += 1;
    isDraggingRef.current[wheel] = true;
    isMomentumActiveRef.current[wheel] = false;
  }

  function beginWheelMomentum(wheel: WheelKey) {
    isMomentumActiveRef.current[wheel] = true;
  }

  function snapDay(offsetY: number, token: number) {
    if (day === null) return;
    finalizeWheel({
      wheel: "day",
      token,
      offsetY,
      options: availableDays,
      currentValue: day,
      scrollRef: dayScrollRef,
      onChange: onDayChange,
    });
  }

  function previewDay(offsetY: number) {
    if (day === null || availableDays.length === 0) return;
    const index = getSnappedIndex(offsetY, availableDays.length);
    const next = availableDays[index];
    if (next !== day) onDayChange(next);
  }

  function snapMonth(offsetY: number, token: number) {
    const monthIndexes = availableMonthOptions.map((entry) => entry.index);
    finalizeWheel({
      wheel: "month",
      token,
      offsetY,
      options: monthIndexes,
      currentValue: month,
      scrollRef: monthScrollRef,
      onChange: onMonthChange,
    });
  }

  function previewMonth(offsetY: number) {
    const monthIndexes = availableMonthOptions.map((entry) => entry.index);
    if (monthIndexes.length === 0) return;
    const index = getSnappedIndex(offsetY, monthIndexes.length);
    const next = monthIndexes[index];
    if (next !== month) onMonthChange(next);
  }

  function snapYear(offsetY: number, token: number) {
    finalizeWheel({
      wheel: "year",
      token,
      offsetY,
      options: availableYears,
      currentValue: year,
      scrollRef: yearScrollRef,
      onChange: onYearChange,
    });
  }

  function previewYear(offsetY: number) {
    if (availableYears.length === 0) return;
    const index = getSnappedIndex(offsetY, availableYears.length);
    const next = availableYears[index];
    if (next !== year) onYearChange(next);
  }

  function snapWeeks(offsetY: number, token: number) {
    finalizeWheel({
      wheel: "weeks",
      token,
      offsetY,
      options: WEEKS_EARLY_OPTIONS,
      currentValue: weeksEarly,
      scrollRef: weeksScrollRef,
      onChange: onWeeksChange,
    });
  }

  function previewWeeks(offsetY: number) {
    if (WEEKS_EARLY_OPTIONS.length === 0) return;
    const index = getSnappedIndex(offsetY, WEEKS_EARLY_OPTIONS.length);
    const next = WEEKS_EARLY_OPTIONS[index];
    if (next !== weeksEarly) onWeeksChange(next);
  }

  function shouldHandleDragFinalize(velocityY?: number) {
    if (typeof velocityY !== "number" || !Number.isFinite(velocityY)) return true;
    return Math.abs(velocityY) < 0.05;
  }

  return (
    <View style={styles.questionScreenWrap}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.questionContainer, styles.questionContainerPlain, styles.questionContainerWithFooter, styles.birthdayScrollContent]}
      >
      <Text style={styles.questionTitle}>
        {lang === "el"
          ? gender === "unspecified"
            ? `Πότε γεννήθηκε το μωρό σου, ${name};`
            : `Πότε γεννήθηκε ${gender === "boy" ? "ο" : "η"} ${name};`
          : tOnbPw(lang, "question.whenBorn", { name })}
      </Text>
      <Text style={styles.questionSub}>{lang === "el" ? "Η ημέρα, μήνας και χρονιά μας βοηθούν να ταιριάξουμε με ακρίβεια τις δραστηριότητες." : "Day, month, and year helps us personalize activities precisely."}</Text>
      <View style={styles.pickerRow}>
          <View style={[styles.pickerColumn, { flex: 1 }]}>
            <Text style={styles.pickerLabel}>{lang === "el" ? "Ημέρα" : "Day"}</Text>
            <View style={styles.pickerBox}>
              <ScrollView
                ref={dayScrollRef}
                style={styles.pickerScroll}
                contentContainerStyle={styles.pickerContent}
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={DOB_ITEM_HEIGHT}
                snapToAlignment="start"
                bounces={false}
                alwaysBounceVertical={false}
                overScrollMode="never"
                disableIntervalMomentum
                scrollEventThrottle={16}
                onScrollBeginDrag={() => beginWheelDrag("day")}
                onScroll={(e) => previewDay(e.nativeEvent.contentOffset.y)}
                onMomentumScrollBegin={() => beginWheelMomentum("day")}
                onScrollEndDrag={(e) => {
                  isDraggingRef.current.day = false;
                  if (!shouldHandleDragFinalize(e.nativeEvent.velocity?.y)) return;
                  snapDay(e.nativeEvent.contentOffset.y, settleTokenRef.current.day);
                }}
                onMomentumScrollEnd={(e) => {
                  isMomentumActiveRef.current.day = false;
                  isDraggingRef.current.day = false;
                  snapDay(e.nativeEvent.contentOffset.y, settleTokenRef.current.day);
                }}
              >
                {availableDays.map((d) => (
                  <Pressable
                    key={d}
                    style={[styles.pickerItem, day === d && styles.pickerItemSelected]}
                    onPress={() => {
                      triggerAnswerHaptic();
                      onDayChange(d);
                    }}
                  >
                    <Text style={[styles.pickerText, day === d && styles.pickerTextSelected]}>{d}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <View pointerEvents="none" style={styles.pickerCenterHighlight} />
              <BlurView pointerEvents="none" intensity={4} tint="light" style={[styles.pickerEdgeBlur, styles.pickerEdgeBlurTop]} />
              <BlurView pointerEvents="none" intensity={4} tint="light" style={[styles.pickerEdgeBlur, styles.pickerEdgeBlurBottom]} />
            </View>
          </View>
          <View style={[styles.pickerColumn, { flex: 2 }]}>
            <Text style={styles.pickerLabel}>{lang === "el" ? "Μήνας" : "Month"}</Text>
            <View style={styles.pickerBox}>
              <ScrollView
                ref={monthScrollRef}
                style={styles.pickerScroll}
                contentContainerStyle={styles.pickerContent}
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={DOB_ITEM_HEIGHT}
                snapToAlignment="start"
                bounces={false}
                alwaysBounceVertical={false}
                overScrollMode="never"
                disableIntervalMomentum
                scrollEventThrottle={16}
                onScrollBeginDrag={() => beginWheelDrag("month")}
                onScroll={(e) => previewMonth(e.nativeEvent.contentOffset.y)}
                onMomentumScrollBegin={() => beginWheelMomentum("month")}
                onScrollEndDrag={(e) => {
                  isDraggingRef.current.month = false;
                  if (!shouldHandleDragFinalize(e.nativeEvent.velocity?.y)) return;
                  snapMonth(e.nativeEvent.contentOffset.y, settleTokenRef.current.month);
                }}
                onMomentumScrollEnd={(e) => {
                  isMomentumActiveRef.current.month = false;
                  isDraggingRef.current.month = false;
                  snapMonth(e.nativeEvent.contentOffset.y, settleTokenRef.current.month);
                }}
              >
                {availableMonthOptions.map(({ label, index }) => (
                  <Pressable
                    key={label}
                    style={[styles.pickerItem, month === index && styles.pickerItemSelected]}
                    onPress={() => {
                      triggerAnswerHaptic();
                      onMonthChange(index);
                    }}
                  >
                    <Text style={[styles.pickerText, month === index && styles.pickerTextSelected]}>{label}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <View pointerEvents="none" style={styles.pickerCenterHighlight} />
              <BlurView pointerEvents="none" intensity={4} tint="light" style={[styles.pickerEdgeBlur, styles.pickerEdgeBlurTop]} />
              <BlurView pointerEvents="none" intensity={4} tint="light" style={[styles.pickerEdgeBlur, styles.pickerEdgeBlurBottom]} />
            </View>
          </View>
          <View style={[styles.pickerColumn, { flex: 1 }]}>
            <Text style={styles.pickerLabel}>{lang === "el" ? "Έτος" : "Year"}</Text>
            <View style={styles.pickerBox}>
              <ScrollView
                ref={yearScrollRef}
                style={styles.pickerScroll}
                contentContainerStyle={styles.pickerContent}
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={DOB_ITEM_HEIGHT}
                snapToAlignment="start"
                bounces={false}
                alwaysBounceVertical={false}
                overScrollMode="never"
                disableIntervalMomentum
                scrollEventThrottle={16}
                onScrollBeginDrag={() => beginWheelDrag("year")}
                onScroll={(e) => previewYear(e.nativeEvent.contentOffset.y)}
                onMomentumScrollBegin={() => beginWheelMomentum("year")}
                onScrollEndDrag={(e) => {
                  isDraggingRef.current.year = false;
                  if (!shouldHandleDragFinalize(e.nativeEvent.velocity?.y)) return;
                  snapYear(e.nativeEvent.contentOffset.y, settleTokenRef.current.year);
                }}
                onMomentumScrollEnd={(e) => {
                  isMomentumActiveRef.current.year = false;
                  isDraggingRef.current.year = false;
                  snapYear(e.nativeEvent.contentOffset.y, settleTokenRef.current.year);
                }}
              >
                {availableYears.map((y) => (
                  <Pressable
                    key={y}
                    style={[styles.pickerItem, year === y && styles.pickerItemSelected]}
                    onPress={() => {
                      triggerAnswerHaptic();
                      onYearChange(y);
                    }}
                  >
                    <Text style={[styles.pickerText, year === y && styles.pickerTextSelected]}>{y}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <View pointerEvents="none" style={styles.pickerCenterHighlight} />
              <BlurView pointerEvents="none" intensity={4} tint="light" style={[styles.pickerEdgeBlur, styles.pickerEdgeBlurTop]} />
              <BlurView pointerEvents="none" intensity={4} tint="light" style={[styles.pickerEdgeBlur, styles.pickerEdgeBlurBottom]} />
            </View>
          </View>
        </View>

      <View style={styles.preemieToggleRow}>
        <Text style={styles.preemieInlineLabel}>{lang === "el" ? "Πρόωρο" : "Premature"}</Text>
        <Switch
          value={isEarly === "yes"}
          onValueChange={(value) => {
            triggerAnswerHaptic();
            onSelectEarly(value ? "yes" : "no");
          }}
          trackColor={{ false: "#D7DDE5", true: Colors.charcoal }}
          thumbColor={Colors.white}
          ios_backgroundColor="#D7DDE5"
        />
      </View>

      {isEarly === "yes" && (
        <>
          <Text style={styles.pickerLabel}>{lang === "el" ? "Πόσες εβδομάδες νωρίτερα;" : "How many weeks early?"}</Text>
          <View style={styles.pickerBox}>
            <ScrollView
              ref={weeksScrollRef}
              style={[styles.pickerScroll, { height: PREEMIE_PICKER_HEIGHT }]}
              contentContainerStyle={[
                styles.pickerContent,
                { paddingTop: PREEMIE_CENTER_PAD, paddingBottom: PREEMIE_CENTER_PAD },
              ]}
              showsVerticalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={DOB_ITEM_HEIGHT}
              snapToAlignment="start"
              bounces={false}
              alwaysBounceVertical={false}
              overScrollMode="never"
              disableIntervalMomentum
              nestedScrollEnabled
              scrollEventThrottle={16}
              onScrollBeginDrag={() => beginWheelDrag("weeks")}
              onScroll={(e) => previewWeeks(e.nativeEvent.contentOffset.y)}
              onMomentumScrollBegin={() => beginWheelMomentum("weeks")}
              onScrollEndDrag={(e) => {
                isDraggingRef.current.weeks = false;
                if (!shouldHandleDragFinalize(e.nativeEvent.velocity?.y)) return;
                snapWeeks(e.nativeEvent.contentOffset.y, settleTokenRef.current.weeks);
              }}
              onMomentumScrollEnd={(e) => {
                isMomentumActiveRef.current.weeks = false;
                isDraggingRef.current.weeks = false;
                snapWeeks(e.nativeEvent.contentOffset.y, settleTokenRef.current.weeks);
              }}
            >
              {WEEKS_EARLY_OPTIONS.map((w) => (
                <Pressable
                  key={w}
                  style={[styles.pickerItem, weeksEarly === w && styles.pickerItemSelected]}
                  onPress={() => {
                    triggerAnswerHaptic();
                    onWeeksChange(w);
                  }}
                >
                  <Text style={[styles.pickerText, weeksEarly === w && styles.pickerTextSelected]}>
                    {lang === "el" ? `${w} εβδομάδ${w > 1 ? "ες" : "α"}` : `${w} week${w > 1 ? "s" : ""}`}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <View
              pointerEvents="none"
              style={[styles.pickerCenterHighlight, { top: PREEMIE_CENTER_PAD }]}
            />
            <BlurView pointerEvents="none" intensity={4} tint="light" style={[styles.pickerEdgeBlur, styles.pickerEdgeBlurTop]} />
            <BlurView pointerEvents="none" intensity={4} tint="light" style={[styles.pickerEdgeBlur, styles.pickerEdgeBlurBottom]} />
          </View>
          <Text style={styles.preemieNote}>{lang === "el" ? "Θα το υπολογίσουμε όταν επιλέγουμε δραστηριότητες." : "We'll factor this in when choosing activities."}</Text>
        </>
      )}
      </ScrollView>

      <View style={styles.continueFooterAbsolute}>
        <Pressable
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={() => { triggerContinueHaptic(); onNext(); }}
          disabled={!canContinue}
        >
          <Text style={styles.continueButtonText}>{tOnbPw(lang, "common.continue")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ReminderScreen({
  hour,
  onHourChange,
  onNext,
}: {
  hour: number;
  onHourChange: (h: number) => void;
  onNext: () => void;
}) {
  return (
    <View style={styles.questionScreenWrap}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.questionContainer, styles.questionContainerPlain, styles.questionContainerWithFooter]}
      >
        <Text style={styles.questionTitle}>When should we remind you?</Text>
        <Text style={styles.questionSub}>You can always change this later.</Text>
        <View style={styles.timeGrid}>
          {HOURS.map((h) => (
            <Pressable
              key={h}
              style={[styles.timeChip, hour === h && styles.timeChipSelected]}
              onPress={() => onHourChange(h)}
            >
              <Text style={[styles.timeChipText, hour === h && styles.timeChipTextSelected]}>
                {formatHour(h)}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <View style={styles.continueFooterAbsolute}>
        <Pressable style={styles.continueButton} onPress={() => { triggerContinueHaptic(); onNext(); }}>
          <Text style={styles.continueButtonText}>All done</Text>
        </Pressable>
      </View>
    </View>
  );
}

function getAgeSummary(
  birthDay: number | null,
  birthMonth: number,
  birthYear: number,
  preemieOption: "yes" | "no",
  weeksEarly: number
) {
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const birthMidnight = new Date(birthYear, birthMonth, birthDay ?? 1);
  const totalDays = Math.round((todayMidnight.getTime() - birthMidnight.getTime()) / 86400000);
  const preemieDays = preemieOption === "yes" ? weeksEarly * 7 : 0;
  const adjustedDays = Math.max(0, totalDays - preemieDays);
  const months = Math.floor(adjustedDays / 30.44);
  const remainingDays = adjustedDays - Math.floor(months * 30.44);
  const remainingWeeks = Math.floor(remainingDays / 7);
  const totalWeeks = Math.max(1, Math.floor(adjustedDays / 7));
  const ageText =
    adjustedDays < 7
      ? `${Math.max(1, adjustedDays)} day${Math.max(1, adjustedDays) === 1 ? "" : "s"}`
      : months > 0 && remainingWeeks > 0
      ? `${months} month${months > 1 ? "s" : ""}, ${remainingWeeks} week${remainingWeeks > 1 ? "s" : ""}`
      : months > 0
      ? `${months} month${months > 1 ? "s" : ""}`
      : `${totalWeeks} week${totalWeeks !== 1 ? "s" : ""}`;

  return { adjustedDays, months, totalWeeks, ageText };
}

function getLocalizedAgeText(
  summary: { adjustedDays: number; months: number; totalWeeks: number; ageText: string },
  lang: OnboardingPaywallLanguage
): string {
  if (lang !== "el") return summary.ageText;
  if (summary.adjustedDays < 7) return `${Math.max(1, summary.adjustedDays)} ημέρ${Math.max(1, summary.adjustedDays) === 1 ? "α" : "ες"}`;
  if (summary.months > 0) return `${summary.months} μην${summary.months > 1 ? "ών" : "ός"}`;
  return `${summary.totalWeeks} εβδομάδ${summary.totalWeeks > 1 ? "ες" : "α"}`;
}

type ThisWeekPlanCategory = "Move" | "Bond" | "Explore";

type ThisWeekPlanItem = {
  category: ThisWeekPlanCategory;
  text: string;
};

type InsightPoint = {
  category: MilestoneCategory;
  short: string;
  long: string;
};

function normalizeInsightGrayText(input: string): string {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const CONCISE_INSIGHT_COPY: Partial<Record<string, string>> = {
  "0-1-month:movement": "Early movements are quick and active.",
  "0-1-month:social": "Your baby reacts to familiar voices.",
  "0-1-month:explorement": "They briefly track nearby faces or objects.",
  "1-2-month:movement": "Head control and hand opening are improving.",
  "1-2-month:social": "Smiles and coos are starting to appear.",
  "1-2-month:explorement": "Attention to faces and toys lasts longer.",
  "2-3-month:movement": "Head lifting and hand control are growing.",
  "2-3-month:social": "Social smiles and coos feel more responsive.",
  "2-3-month:explorement": "Visual tracking is becoming more focused.",
  "3-4-month:movement": "Neck strength and tummy push-ups are improving.",
  "3-4-month:social": "Your baby responds more in back-and-forth moments.",
  "3-4-month:explorement": "Reaching and visual focus are becoming clearer.",
  "4-5-month:movement": "Posture and upper-body control are getting stronger.",
  "4-5-month:social": "Playful sounds and social engagement are increasing.",
  "4-5-month:explorement": "Reaching and mouthing are more intentional.",
};

function getConciseMilestoneCopy(
  bandKey: string | null,
  category: MilestoneCategory,
  title: string,
  subtitle: string
): string {
  const compactFallback = title.trim() || subtitle;
  if (!bandKey) return compactFallback;
  const mapped = CONCISE_INSIGHT_COPY[`${bandKey}:${category}`];
  return mapped?.trim() || compactFallback;
}

const THIS_WEEK_PLAN_BANDS: Array<{ maxWeek: number; items: ThisWeekPlanItem[] }> = [
  {
    maxWeek: 8,
    items: [
      { category: "Move", text: "Lay your baby on your chest and slowly lean back. Let them try to lift their head to find your face." },
      { category: "Bond", text: "Hold your baby close and speak softly, then pause. Give them space to respond in their own way." },
      { category: "Explore", text: "Move your face slowly side to side while they watch. Let their eyes follow you at their own pace." },
    ],
  },
  {
    maxWeek: 16,
    items: [
      { category: "Move", text: "Place your baby on their tummy and get down at their level. Encourage them to lift their head to see you." },
      { category: "Bond", text: "Smile at your baby and wait. Let them take their time to smile back or react." },
      { category: "Explore", text: "Hold a simple object near them and slowly move it across their view. Let them track it." },
    ],
  },
  {
    maxWeek: 24,
    items: [
      { category: "Move", text: "Gently roll your baby from back to side, then pause. Let them try to complete the movement." },
      { category: "Bond", text: "Make a sound, then wait. Let your baby try to copy or answer you." },
      { category: "Explore", text: "Place a toy just out of reach and let them try to get closer to it." },
    ],
  },
  {
    maxWeek: 32,
    items: [
      { category: "Move", text: "Support your baby in a seated position and slowly reduce support. Let them adjust their balance." },
      { category: "Bond", text: "Play peekaboo slowly. Let them anticipate the moment you reappear." },
      { category: "Explore", text: "Place different safe objects around them and let them choose what to reach for." },
    ],
  },
  {
    maxWeek: 40,
    items: [
      { category: "Move", text: "Encourage your baby to move toward you by placing yourself just out of reach." },
      { category: "Bond", text: "Call their name gently and wait. Let them turn or respond in their own time." },
      { category: "Explore", text: "Give them a container and an object. Let them figure out how they fit together." },
    ],
  },
  {
    maxWeek: 48,
    items: [
      { category: "Move", text: "Hold both hands and let them take small steps toward you." },
      { category: "Bond", text: "Clap your hands and pause. Let them try to join in." },
      { category: "Explore", text: "Hide a toy under a cloth and let them discover where it went." },
    ],
  },
  {
    maxWeek: 56,
    items: [
      { category: "Move", text: "Encourage walking between two points - you and an object - slowly increasing distance." },
      { category: "Bond", text: "Point at something and name it. Let them look and react." },
      { category: "Explore", text: "Give them two objects and let them test what each one does." },
    ],
  },
  {
    maxWeek: 64,
    items: [
      { category: "Move", text: "Let them push a stable object while walking to build confidence." },
      { category: "Bond", text: "Ask a simple question like \"Where's the ball?\" and wait." },
      { category: "Explore", text: "Stack simple items and let them knock them down and rebuild." },
    ],
  },
  {
    maxWeek: 72,
    items: [
      { category: "Move", text: "Encourage climbing onto low safe surfaces with supervision." },
      { category: "Bond", text: "Use simple words and pause, giving them space to try saying something back." },
      { category: "Explore", text: "Let them open and close containers to see what happens." },
    ],
  },
  {
    maxWeek: 80,
    items: [
      { category: "Move", text: "Encourage them to carry objects while walking to challenge balance." },
      { category: "Bond", text: "Give simple choices (\"this or this?\") and let them respond." },
      { category: "Explore", text: "Let them imitate simple actions like stirring, tapping, or pouring." },
    ],
  },
  {
    maxWeek: 88,
    items: [
      { category: "Move", text: "Encourage small jumps or stepping over objects." },
      { category: "Bond", text: "Expand on what they say by repeating it and adding one word." },
      { category: "Explore", text: "Let them group similar objects together in their own way." },
    ],
  },
  {
    maxWeek: 104,
    items: [
      { category: "Move", text: "Encourage running in short bursts and stopping safely." },
      { category: "Bond", text: "Have short back-and-forth \"conversations\" with simple words." },
      { category: "Explore", text: "Let them pretend with everyday objects (cup, spoon, etc.)." },
    ],
  },
];

function localizeActivityTextGreek(category: ThisWeekPlanCategory): string {
  if (category === "Move") return "Δώσε χώρο για ήπια κίνηση και άφησε το μωρό να προσπαθήσει με τον δικό του ρυθμό.";
  if (category === "Bond") return "Κράτησε επαφή, μίλα απαλά και κάνε μικρές παύσεις για να απαντήσει.";
  return "Πρόσφερε ασφαλές αντικείμενο για εξερεύνηση και παρατήρησε πώς το ανακαλύπτει.";
}

function getThisWeekPlanItems(ageInWeeks: number, lang: OnboardingPaywallLanguage): ThisWeekPlanItem[] {
  const band = THIS_WEEK_PLAN_BANDS.find((entry) => ageInWeeks <= entry.maxWeek);
  const items = (band ?? THIS_WEEK_PLAN_BANDS[THIS_WEEK_PLAN_BANDS.length - 1]).items;
  if (lang !== "el") return items;
  return items.map((item) => ({ ...item, text: localizeActivityTextGreek(item.category) }));
}

function getFirstSentence(text: string): string {
  const normalized = text.trim();
  const firstPeriodIndex = normalized.indexOf(".");
  if (firstPeriodIndex === -1) return normalized;
  return normalized.slice(0, firstPeriodIndex + 1).trim();
}

function getInsightCopy(totalWeeks: number) {
  const fallback = {
    points: [
      {
        category: "movement" as MilestoneCategory,
        short: "Growing steadier through movement each week",
        long: "Steady daily movement builds body control and confidence over time.",
      },
      {
        category: "social" as MilestoneCategory,
        short: "Showing more connection in everyday moments",
        long: "Small back-and-forth moments strengthen connection and communication.",
      },
      {
        category: "explorement" as MilestoneCategory,
        short: "Exploring people and objects with more focus",
        long: "Exploration helps your baby learn how the world works right now.",
      },
    ],
    weeklyNoteLine: "More confident two-way communication.",
  };
  const bandKey = resolveDisplayBandKey(totalWeeks);
  if (!bandKey) return fallback;

  const activeBand = MILESTONE_BANDS[bandKey];
  const movement = activeBand.milestones.find((item) => item.category === "movement");
  const social = activeBand.milestones.find((item) => item.category === "social");
  const explorement = activeBand.milestones.find((item) => item.category === "explorement");
  const points: InsightPoint[] = [movement, social, explorement]
    .filter((value): value is NonNullable<typeof value> => Boolean(value))
    .map((value) => ({
      category: value.category,
      short: getConciseMilestoneCopy(bandKey, value.category, value.title, value.subtitle),
      long: value.expandedDetail,
    }))
    .filter((value) => value.short.trim().length > 0 && value.long.trim().length > 0);

  return {
    points: points.length === 3 ? points : fallback.points,
    weeklyNoteLine: fallback.weeklyNoteLine,
  };
}

function getMiaSleepResponse(
  ageInWeeks: number,
  babyGender: "girl" | "boy" | "unspecified",
  lang: OnboardingPaywallLanguage
): string {
  if (lang === "el" && ageInWeeks <= 8) {
    if (babyGender === "girl") {
      return "Αυτό είναι πολύ συνηθισμένο σε αυτή την ηλικία. Το μυαλό της σιγά σιγά καταλαβαίνει τα πράγματα. Προσπάθησε να την κρατήσεις κοντά σου και να κρατήσεις το δωμάτιο σκοτεινό και ήσυχο, η παρουσία σου είναι που την βοηθάει περισσότερο να ηρεμήσει.";
    }
    if (babyGender === "boy") {
      return "Αυτό είναι πολύ συνηθισμένο σε αυτή την ηλικία. Το μυαλό του σιγά σιγά καταλαβαίνει τα πράγματα. Προσπάθησε να τον κρατήσεις κοντά σου και να κρατήσεις το δωμάτιο σκοτεινό και ήσυχο, η παρουσία σου είναι που τον βοηθάει περισσότερο να ηρεμήσει.";
    }
    return "Αυτό είναι πολύ συνηθισμένο σε αυτή την ηλικία. Το μυαλό του μωρού σου σιγά σιγά καταλαβαίνει τα πράγματα. Προσπάθησε να το κρατήσεις κοντά σου και να κρατήσεις το δωμάτιο σκοτεινό και ήσυχο, η παρουσία σου είναι που το βοηθάει περισσότερο να ηρεμήσει.";
  }

  const pronouns =
    babyGender === "girl"
      ? { subj: "she", obj: "her", poss: "her", beContraction: "she's" }
      : babyGender === "boy"
      ? { subj: "he", obj: "him", poss: "his", beContraction: "he's" }
      : { subj: "they", obj: "them", poss: "their", beContraction: "they're" };

  if (ageInWeeks <= 8) {
    return `That's really common at this age. ${pronouns.poss[0].toUpperCase() + pronouns.poss.slice(1)} mind is slowly figuring things out. Try holding ${pronouns.obj} close and keeping the room dim and quite, your presence is what helps ${pronouns.obj} settle most.`;
  }
  if (ageInWeeks <= 16) {
    return `Sleep can feel unpredictable around now. Try a simple pattern, feed, hold, then lay ${pronouns.obj} down when ${pronouns.beContraction} calm but still a little awake.`;
  }
  if (ageInWeeks <= 24) {
    return `At this age, ${pronouns.beContraction} starting to notice more, which can make sleep harder. Keep the room calm and repeat the same short routine each night, it helps ${pronouns.obj} recognise it’s time to rest.`;
  }
  if (ageInWeeks <= 32) {
    return `This is a busy stage, so it’s normal for sleep to get disrupted. Give ${pronouns.obj} a moment to settle, then offer gentle comfort without fully waking ${pronouns.obj} up again.`;
  }
  if (ageInWeeks <= 40) {
    return `${pronouns.beContraction[0].toUpperCase() + pronouns.beContraction.slice(1)} becoming more aware of you now, which can make it harder to fall asleep alone. Stay nearby, keep your voice soft, and help ${pronouns.obj} feel safe without turning it into playtime.`;
  }
  if (ageInWeeks <= 48) {
    return `Sleep can get a bit inconsistent around now. Stick to the same calm routine each night, ${pronouns.beContraction} starting to rely on those patterns more than you think.`;
  }
  if (ageInWeeks <= 56) {
    return `At this age, it’s common for ${pronouns.obj} to resist sleep even when tired. Keep things simple and consistent, and try not to change the routine too much night to night.`;
  }
  if (ageInWeeks <= 64) {
    return `${pronouns.beContraction[0].toUpperCase() + pronouns.beContraction.slice(1)} more independent now, which can make bedtime a bit of a push-and-pull. Stay calm, keep your response predictable, and let ${pronouns.obj} know you’re there without restarting everything.`;
  }
  if (ageInWeeks <= 72) {
    return `It’s common for ${pronouns.obj} to test boundaries around sleep at this stage. Keep the routine steady and gentle, sleep settles better when things feel the same each night.`;
  }
  if (ageInWeeks <= 80) {
    return `${pronouns.poss[0].toUpperCase() + pronouns.poss.slice(1)} imagination is starting to grow, which can make winding down harder. Keep the environment calm and familiar, and give ${pronouns.obj} a simple, reassuring bedtime pattern.`;
  }
  if (ageInWeeks <= 88) {
    return `${pronouns.beContraction[0].toUpperCase() + pronouns.beContraction.slice(1)} much more aware now, so small changes can affect sleep. Stay consistent, keep your tone calm, and guide ${pronouns.obj} back to rest without adding too much stimulation.`;
  }
  return `At this age, ${pronouns.subj} may resist sleep even when ${pronouns.beContraction} tired. Keep things predictable and low-energy, the calmer you stay, the easier it is for ${pronouns.obj} to settle.`;
}

function OnboardingSignupStep({
  name,
  lang,
  onSuccess,
  onSkip,
}: {
  name: string;
  lang: OnboardingPaywallLanguage;
  onSuccess: () => void;
  onSkip: () => void;
}) {
  const { signInWithApple, signInWithGoogle, getSafeSession, refreshSubscription } = useAuth();
  const { syncFromCloud, setLocalSignInState } = useBaby();
  const [appleLoading, setAppleLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function waitForSessionReady(timeoutMs = 7000, intervalMs = 250) {
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeoutMs) {
      const activeSession = await getSafeSession();
      if (activeSession) return activeSession;
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    return null;
  }

  async function finalizeSignup(opts?: { onboardingCompleteFromAuth?: boolean; isNewUserFromAuth?: boolean }) {
    const activeSession = await waitForSessionReady();
    if (!activeSession) return false;
    const onboardingComplete = opts?.onboardingCompleteFromAuth === true;
    const isNewUser = opts?.isNewUserFromAuth === true;
    await syncFromCloud();
    await setLocalSignInState({ isSignedIn: true, onboardingComplete });
    const hasAccess = await refreshSubscription();
    if (!hasAccess && !isNewUser) {
      router.replace("/claim");
      return true;
    }
    onSuccess();
    return true;
  }

  async function handleAppleSignup() {
    setAppleLoading(true);
    setError(null);
    try {
      const result = await signInWithApple("signup");
      if (result.error) {
        setError(result.error);
        return;
      }
      const finished = await finalizeSignup({
        onboardingCompleteFromAuth: result.onboardingComplete !== false,
        isNewUserFromAuth: result.isNewUser === true,
      });
      if (!finished) {
        setError("Apple sign in finished but session was not ready. Please try again.");
      }
    } finally {
      setAppleLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setGoogleLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle("signup");
      if (result.error) {
        setError(result.error);
        return;
      }
      const finished = await finalizeSignup({
        onboardingCompleteFromAuth: result.onboardingComplete !== false,
        isNewUserFromAuth: result.isNewUser === true,
      });
      if (!finished) {
        setError("Google sign in finished but session was not ready. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <View style={[styles.questionScreenWrap, styles.questionContainerPlain, styles.questionContainerWithFooter]}>
      <Text style={styles.questionTitle}>{tOnbPw(lang, "question.oneLastStep")}</Text>
      <Text style={styles.questionSub}>{tOnbPw(lang, "signup.createSub")} &quot;{name}&quot;</Text>

      <View style={styles.signupSocialWrap}>
        <Pressable
          style={({ pressed }) => [styles.signupAppleButton, { opacity: pressed ? 0.88 : 1 }]}
          onPress={handleAppleSignup}
          disabled={appleLoading || googleLoading}
        >
          {appleLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Ionicons name="logo-apple" size={20} color={Colors.white} />
              <Text style={styles.signupAppleButtonText}>{tOnbPw(lang, "signup.apple")}</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.signupGoogleButton, { opacity: pressed ? 0.88 : 1 }]}
          onPress={handleGoogleSignup}
          disabled={appleLoading || googleLoading}
        >
          {googleLoading ? (
            <ActivityIndicator color={Colors.charcoal} />
          ) : (
            <>
              <Image source={{ uri: GOOGLE_LOGO_URI }} style={styles.signupGoogleLogo} contentFit="contain" />
              <Text style={styles.signupGoogleButtonText}>{tOnbPw(lang, "signup.google")}</Text>
            </>
          )}
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [styles.signupSkipButton, { opacity: pressed ? 0.82 : 1 }]}
        onPress={onSkip}
        disabled={appleLoading || googleLoading}
      >
        <Text style={styles.signupSkipButtonText}>{tOnbPw(lang, "common.continue")}</Text>
      </Pressable>

      {error ? <Text style={styles.signupErrorText}>{error}</Text> : null}

    </View>
  );
}

function ProcessingBridgeScreen({
  babyName,
  ageText,
  emotionalState,
  painPoint,
  babyGender,
  lang,
  onDone,
}: {
  babyName: string;
  ageText: string;
  emotionalState: string;
  painPoint: string;
  babyGender: "boy" | "girl" | "unspecified" | "";
  lang: OnboardingPaywallLanguage;
  onDone: () => void;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const finishedRef = useRef(false);
  const rowAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const activePulse = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const painPointDynamicLine =
    painPoint === "Not enough time"
      ? (lang === "el" ? "Να χωρέσει στην ημέρα σου" : "Fitting this into your day")
      : painPoint === "Don't know what to do"
      ? (lang === "el" ? "Επιλογή επόμενων βημάτων" : "Choosing your next steps")
      : painPoint === "Overlooking something"
      ? (lang === "el" ? "Ανάδειξη όσων μετράνε περισσότερο" : "Highlighting what matters most")
      : (lang === "el" ? "Λιγότερη υπερανάλυση" : "Removing the extra thinking");
  const emotionalDynamicLine =
    emotionalState === "Loving it"
      ? (lang === "el" ? `Χτίζουμε milestones για μωρό ${ageText}` : `Building ${ageText} old baby milestones`)
      : emotionalState === "A bit anxious"
      ? (lang === "el" ? "Προσθέτουμε ήπια επιβεβαίωση" : "Adding gentle reassurance")
      : emotionalState === "Exhausted"
      ? (lang === "el" ? "Το κάνουμε πιο εύκολο να ακολουθηθεί" : "Making this easier to follow")
      : (lang === "el" ? "Κρατάμε τη στήριξη κοντά" : "Keeping support close");
  const checklistLines = useMemo(
    () => [
      lang === "el" ? "Ανάγνωση απαντήσεων" : "Reading your answers",
      lang === "el" ? `Ταίριασμα δραστηριοτήτων στην ηλικία ${greekBabyNamePossessivePhrase(babyName, babyGender)}` : `Matching activities to ${babyName}’s age`,
      painPointDynamicLine,
      emotionalDynamicLine,
      lang === "el" ? "Ρύθμιση tracking και Mία" : "Setting up tracking and Mia",
    ],
    [babyName, emotionalDynamicLine, lang, painPointDynamicLine]
  );

  const completeOnce = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsComplete(true);
    const holdTimer = setTimeout(() => {
      onDone();
    }, 420);
    timersRef.current.push(holdTimer);
  }, [onDone]);

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(activePulse, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.timing(activePulse, { toValue: 0, duration: 320, useNativeDriver: true }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [activePulse]);

  useEffect(() => {
    rowAnims.forEach((anim) => anim.setValue(0));
    progressAnim.setValue(0);
    setVisibleCount(0);
    setActiveIndex(null);
    setCompletedCount(0);
    setIsComplete(false);
    finishedRef.current = false;
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];

    const ITEM_DURATION_MS = 1120;
    const GAP_MS = 400;
    const ITEM_TOTAL_MS = ITEM_DURATION_MS + GAP_MS;

    checklistLines.forEach((_, index) => {
      const startDelay = index * ITEM_TOTAL_MS;
      const showTimer = setTimeout(() => {
        setVisibleCount((prev) => Math.max(prev, index + 1));
        setActiveIndex(index);
        Animated.timing(progressAnim, {
          toValue: (index + 0.5) / checklistLines.length,
          duration: 220,
          useNativeDriver: false,
        }).start();
        Animated.timing(rowAnims[index], {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }, startDelay);
      timersRef.current.push(showTimer);

      const completeTimer = setTimeout(() => {
        setCompletedCount((prev) => Math.max(prev, index + 1));
        setActiveIndex((prev) => (prev === index ? null : prev));
        Animated.timing(progressAnim, {
          toValue: (index + 1) / checklistLines.length,
          duration: 220,
          useNativeDriver: false,
        }).start();
      }, startDelay + ITEM_DURATION_MS);
      timersRef.current.push(completeTimer);
    });

    const finalTimer = setTimeout(() => {
      completeOnce();
    }, checklistLines.length * ITEM_TOTAL_MS);
    timersRef.current.push(finalTimer);

    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
    };
  }, [checklistLines, completeOnce, progressAnim, rowAnims]);

  const activeScale = activePulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] });
  const activeOpacity = activePulse.interpolate({ inputRange: [0, 1], outputRange: [0.58, 1] });

  return (
    <View style={[styles.questionScreenWrap, styles.processingScreenWrap]}>
      <View style={styles.processingCentered}>
        <Text style={styles.processingEyebrow}>
          {isComplete
            ? (lang === "el" ? `Το πλάνο ${greekBabyNamePossessivePhrase(babyName, babyGender)} είναι έτοιμο` : `${babyName}’s plan is ready`)
            : (lang === "el" ? `Χτίζουμε το πλάνο ${greekBabyNamePossessivePhrase(babyName, babyGender)}` : `Building ${babyName}’s plan`)}
        </Text>
        <Text style={styles.processingSub}>
          {isComplete
            ? (lang === "el" ? "Πάμε να δούμε τι έχει σημασία τώρα." : "Let’s show you what matters right now.")
            : (lang === "el" ? "Ταιριάζουμε μερικά πράγματα στο στάδιο του μωρού σου." : "A few things are being matched to your baby’s stage.")}
        </Text>
        <View style={styles.processingMainCard}>
          {checklistLines.map((line, index) => {
            if (index >= visibleCount) return null;
            const isDone = index < completedCount;
            const isActive = index === activeIndex;
            return (
              <Animated.View
                key={line}
                style={[
                  styles.processingRow,
                  isActive && styles.processingRowActive,
                  {
                    opacity: rowAnims[index],
                    transform: [
                      {
                        translateY: rowAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [7, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {isDone ? (
                  <View style={styles.processingCheckDone}>
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  </View>
                ) : isActive ? (
                  <Animated.View
                    style={[
                      styles.processingDotActive,
                      { transform: [{ scale: activeScale }], opacity: activeOpacity },
                    ]}
                  />
                ) : (
                  <View style={styles.processingDotPending} />
                )}
                <Text style={[styles.processingRowLiveText, isActive && styles.processingRowLiveTextActive]}>
                  {line}
                </Text>
              </Animated.View>
            );
          })}
        </View>
        <View style={styles.processingProgressTrack}>
          <Animated.View
            style={[
              styles.processingProgressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.processingFootnote}>{lang === "el" ? "Παίρνει μόνο μια στιγμή." : "This only takes a moment."}</Text>
      </View>
    </View>
  );
}

const INSIGHT_CARD_GRADIENTS: [string, string, string][] = [
  ["#FFFFFF", "#F7FBFF", "#EDF5FF"],
  ["#FFFFFF", "#F9FFF9", "#EEF8F0"],
  ["#FFFFFF", "#FFFBF6", "#FBEFE4"],
];
const CHAPTER_WEEK_IMAGE_BY_INDEX: Record<number, string> = {
  1: "https://images.pexels.com/photos/789786/pexels-photo-789786.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=900",
  2: "https://images.pexels.com/photos/30654894/pexels-photo-30654894.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=900",
  3: "https://images.pexels.com/photos/6849553/pexels-photo-6849553.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=900",
  4: "https://images.pexels.com/photos/33716557/pexels-photo-33716557.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=900",
  5: "https://images.pexels.com/photos/4964483/pexels-photo-4964483.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=900",
  6: "https://images.pexels.com/photos/6393125/pexels-photo-6393125.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=900",
  7: "https://images.pexels.com/photos/4934173/pexels-photo-4934173.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=900",
  8: "https://images.pexels.com/photos/7296425/pexels-photo-7296425.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=900",
  9: "https://images.pexels.com/photos/28951637/pexels-photo-28951637.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=900",
  10: "https://images.pexels.com/photos/33304244/pexels-photo-33304244.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=900",
  11: "https://images.pexels.com/photos/6275002/pexels-photo-6275002.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=900",
  12: "https://images.pexels.com/photos/4669020/pexels-photo-4669020.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=900",
};
const CHAPTER_NAME_EL_BY_INDEX: Record<number, string> = {
  1: "Στάδιο Θαύματος",
  2: "Αφύπνιση",
  3: "Παράθυρο Περιέργειας",
  4: "Μικρός Εξερευνητής",
  5: "Επικοινωνία",
  6: "Μικρός Περιπετειώδης",
  7: "Πρώτα Βήματα",
  8: "Μίμηση",
  9: "Αποφασιστικότητα",
  10: "Αναρρίχηση",
  11: "Μικρός Ομιλητής",
  12: "Μικρό Πρόσωπο",
};

function InsightScreen({
  name,
  ageText,
  totalWeeks,
  points,
  weeklyNoteLine,
  babyGender,
  lang,
  onNext,
}: {
  name: string;
  ageText: string;
  totalWeeks: number;
  points: InsightPoint[];
  weeklyNoteLine: string;
  babyGender: "boy" | "girl" | "unspecified" | "";
  lang: OnboardingPaywallLanguage;
  onNext: () => void;
}) {
  const { width: windowWidth } = useWindowDimensions();
  const [showContinue, setShowContinue] = useState(false);
  const [showNextChapter, setShowNextChapter] = useState(false);
  const normalizedIntroText = useMemo(
    () => normalizeInsightGrayText(lang === "el" ? `${name} είναι ${ageText}.` : `${name} is ${ageText} old.`),
    [ageText, lang, name]
  );
  const normalizedWeeklyNoteLine = useMemo(
    () => normalizeInsightGrayText(weeklyNoteLine),
    [weeklyNoteLine]
  );
  const weeklyNoteCharAnims = useMemo(
    () => normalizedWeeklyNoteLine.split("").map(() => new Animated.Value(0)),
    [normalizedWeeklyNoteLine]
  );
  const chapterRecord = useMemo(
    () => getChapterRecordForWeek(totalWeeks, name || (lang === "el" ? "Το μωρό σου" : "Your baby"), "unspecified", lang),
    [lang, name, totalWeeks]
  );
  const nextChapterPreview = useMemo(() => getNextChapterPreview(totalWeeks, lang), [lang, totalWeeks]);
  const nextChapterRecord = useMemo(
    () =>
      nextChapterPreview
        ? getChapterRecordForWeek(
            Math.min(96, (nextChapterPreview.chapterIndex - 1) * 8 + 1),
            name || (lang === "el" ? "Το μωρό σου" : "Your baby"),
            "unspecified",
            lang
          )
        : null,
    [lang, name, nextChapterPreview]
  );
  const activeChapterRecord = showNextChapter && nextChapterRecord ? nextChapterRecord : chapterRecord;
  const activeChapterOneLiner = useMemo(() => {
    if (lang === "el") {
      return normalizeInsightGrayText("Αυτό το στάδιο φέρνει νέες μικρές αλλαγές στην κίνηση, τη σύνδεση και την εξερεύνηση του μωρού σου.");
    }
    return normalizeInsightGrayText(activeChapterRecord.chapterOneLiner);
  }, [activeChapterRecord.chapterOneLiner, lang]);
  const chapterOneLinerCharAnims = useMemo(
    () => activeChapterOneLiner.split("").map(() => new Animated.Value(0)),
    [activeChapterOneLiner]
  );
  const chapterWeekImage = useMemo(
    () => CHAPTER_WEEK_IMAGE_BY_INDEX[activeChapterRecord.chapterIndex] ?? CHAPTER_WEEK_IMAGE_BY_INDEX[1],
    [activeChapterRecord.chapterIndex]
  );
  const overallChapterProgress = useMemo(
    () => Math.max(0, Math.min(1, totalWeeks / 96)),
    [totalWeeks]
  );
  const chapterIntroScale = useRef(new Animated.Value(0.98)).current;
  const chapterUnfoldAnim = useRef(new Animated.Value(0)).current;
  const chapterProgressAnim = useRef(new Animated.Value(0)).current;
  const chapterBeamAnim = useRef(new Animated.Value(0)).current;
  const continueOpacity = useRef(new Animated.Value(0)).current;
  const useCompactReadableLayout = windowWidth < 370 || ONBOARDING_FONT_SCALE >= 1.2;
  const canShowNextChapter = Boolean(nextChapterRecord);

  useEffect(() => {
    setShowNextChapter(false);
  }, [totalWeeks]);

  useEffect(() => {
    chapterOneLinerCharAnims.forEach((anim) => anim.setValue(0));
    continueOpacity.setValue(0);
    setShowContinue(false);
    Animated.stagger(
      14,
      chapterOneLinerCharAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 36,
          useNativeDriver: true,
        })
      )
    ).start(() => {
      setShowContinue(true);
      Animated.timing(continueOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    });
  }, [chapterOneLinerCharAnims, continueOpacity, activeChapterRecord.chapterIndex, showNextChapter]);

  useEffect(() => {
    chapterIntroScale.setValue(0.98);
    chapterUnfoldAnim.setValue(0);
    chapterProgressAnim.setValue(0);
    chapterBeamAnim.setValue(0);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(chapterUnfoldAnim, {
          toValue: 1,
          duration: 720,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(chapterIntroScale, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(chapterProgressAnim, {
          toValue: overallChapterProgress,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
      Animated.timing(chapterBeamAnim, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [chapterBeamAnim, chapterIntroScale, chapterProgressAnim, chapterUnfoldAnim, overallChapterProgress]);

  return (
    <View style={styles.questionScreenWrap}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.questionContainer, styles.questionContainerPlain, styles.questionContainerWithFooter]}
      >
        <Text style={styles.questionTitle}>
          {lang === "el" ? `Να τι συμβαίνει με ${greekBabyNameObjectPhrase(name, babyGender)} τώρα` : `Here’s what’s happening with ${name} right now`}
        </Text>
        <Text style={[styles.insightIntroSub, useCompactReadableLayout && styles.insightIntroSubCompact]}>
          {normalizedIntroText}
        </Text>
        <Animated.View
          style={[
            styles.insightChapterFeatureBox,
            {
              opacity: chapterUnfoldAnim.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] }),
              transform: [
                { perspective: 900 },
                {
                  rotateX: chapterUnfoldAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["-12deg", "0deg"],
                  }),
                },
                {
                  translateY: chapterUnfoldAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 0],
                  }),
                },
                {
                  scaleY: chapterUnfoldAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.84, 1],
                  }),
                },
                { scale: chapterIntroScale },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={showNextChapter ? ["#EAF3FF", "#D7E9FF", "#C5DEFF"] : ["#FFF6E4", "#FCE8C4", "#F8DDAA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.insightChapterFeatureGradient}
          >
            {canShowNextChapter ? (
              <Pressable
                onPress={() => {
                  triggerAnswerHaptic();
                  setShowNextChapter((prev) => !prev);
                }}
                style={styles.insightChapterArrowBtn}
              >
                <Ionicons
                  name={showNextChapter ? "chevron-back" : "chevron-forward"}
                  size={18}
                  color={Colors.charcoal}
                />
              </Pressable>
            ) : null}
            <View style={[styles.insightChapterRow, useCompactReadableLayout && styles.insightChapterRowCompact]}>
              <View style={styles.insightChapterPanelLeft}>
              <View style={styles.insightChapterHeadingRow}>
                <Text style={styles.insightChapterLabel}>
                  {showNextChapter ? (lang === "el" ? "Επόμενο Κεφάλαιο" : "Next Chapter") : (lang === "el" ? "Τρέχον Κεφάλαιο" : "Current Chapter")}
                </Text>
              </View>
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.insightChapterBeam,
                  {
                    opacity: chapterBeamAnim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 0.38, 0] }),
                    transform: [
                      {
                        translateX: chapterBeamAnim.interpolate({ inputRange: [0, 1], outputRange: [-120, 120] }),
                      },
                    ],
                  },
                ]}
              />
              <Text style={styles.insightChapterTitle}>
                {lang === "el"
                  ? `Κεφάλαιο ${activeChapterRecord.chapterIndex} από 12 · ${CHAPTER_NAME_EL_BY_INDEX[activeChapterRecord.chapterIndex] ?? activeChapterRecord.chapterName}`
                  : `Chapter ${activeChapterRecord.chapterIndex} of 12 · ${activeChapterRecord.chapterName}`}
              </Text>
              <View style={styles.insightChapterTrack}>
                <Animated.View
                  style={[
                    styles.insightChapterFill,
                    showNextChapter && styles.insightChapterFillNext,
                    {
                      width: chapterProgressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
              <Text style={styles.insightChapterMeta}>
                {showNextChapter
                  ? activeChapterRecord.chapterRangeLabel
                  : lang === "el"
                    ? `${Math.max(1, Math.min(96, totalWeeks))} εβδομάδες · ${Math.round(overallChapterProgress * 100)}% πρόοδος κεφαλαίων`
                    : `${Math.max(1, Math.min(96, totalWeeks))} weeks in · ${Math.round(overallChapterProgress * 100)}% through chapters`}
              </Text>
              <CharByCharText
                text={activeChapterOneLiner}
                style={styles.insightChapterOneLiner}
                charAnims={chapterOneLinerCharAnims}
              />
              </View>
              <View style={[styles.insightChapterWeekImageWrap, styles.insightChapterWeekImageHalf]}>
                <Image
                  source={{ uri: chapterWeekImage }}
                  style={styles.insightChapterWeekImageBackdrop}
                  contentFit="cover"
                  blurRadius={16}
                />
                <Image source={{ uri: chapterWeekImage }} style={styles.insightChapterWeekImageReflectTop} contentFit="cover" />
                <Image source={{ uri: chapterWeekImage }} style={styles.insightChapterWeekImageReflectBottom} contentFit="cover" />
                <Image source={{ uri: chapterWeekImage }} style={styles.insightChapterWeekImage} contentFit="cover" />
                <LinearGradient
                  colors={["rgba(255,255,255,0.08)", "rgba(23,14,8,0.28)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
      <Animated.View
        pointerEvents={showContinue ? "auto" : "none"}
        style={[styles.continueFooterAbsolute, { opacity: continueOpacity }]}
      >
        <Pressable style={styles.continueButton} onPress={() => { triggerContinueHaptic(); onNext(); }}>
          <Text style={styles.continueButtonText}>{tOnbPw(lang, "common.continue")}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function ThisWeekPlanScreen({
  items,
  lang,
  onNext,
}: {
  items: ThisWeekPlanItem[];
  lang: OnboardingPaywallLanguage;
  onNext: () => void;
}) {
  const { width: windowWidth } = useWindowDimensions();
  const [showContinue, setShowContinue] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedByKey, setExpandedByKey] = useState<Record<string, boolean>>({});
  const positionAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(1),
    new Animated.Value(-1),
  ]).current;
  const footerText = lang === "el" ? "Δεν θα χρειάζεται να μαντεύεις τι έχει σημασία τώρα." : "You won’t have to guess what matters right now.";
  const footerCharAnims = useMemo(
    () => footerText.split("").map(() => new Animated.Value(0)),
    [footerText]
  );
  const continueOpacity = useRef(new Animated.Value(0)).current;
  const useCompactReadableLayout = windowWidth < 370 || ONBOARDING_FONT_SCALE >= 1.2;
  const railItems = useMemo(() => items.slice(0, 3), [items]);
  const itemCount = railItems.length;
  const blurViewProps = useMemo(
    () =>
      Platform.OS === "android"
        ? ({ experimentalBlurMethod: "dimezisBlurView" } as const)
        : ({} as const),
    []
  );
  const prevActiveRef = useRef(0);

  useEffect(() => {
    setActiveIndex(0);
    setExpandedByKey({});
  }, [railItems]);

  useEffect(() => {
    if (itemCount < 3) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % itemCount);
    }, 4000);
    return () => clearInterval(interval);
  }, [itemCount]);

  useEffect(() => {
    const previous = prevActiveRef.current;
    prevActiveRef.current = activeIndex;
    if (itemCount < 3 || previous === activeIndex) return;

    const targets = [0, 1, 2].map((itemIndex) => {
      if (itemIndex === activeIndex) return 0;
      if (itemIndex === (activeIndex + 1) % itemCount) return 1;
      return -1;
    });

    const animation = Animated.parallel(
      targets.map((target, itemIndex) =>
        Animated.timing(positionAnims[itemIndex], {
          toValue: target,
          duration: 620,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        })
      )
    );
    animation.start();
    return () => animation.stop();
  }, [activeIndex, itemCount, positionAnims]);

  useEffect(() => {
    footerCharAnims.forEach((anim) => anim.setValue(0));
    continueOpacity.setValue(0);
    setShowContinue(false);
    const timeout = setTimeout(() => {
      Animated.stagger(
        16,
        footerCharAnims.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 44,
            useNativeDriver: true,
          })
        )
      ).start(() => {
        setShowContinue(true);
        Animated.timing(continueOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }).start();
      });
    }, 860);
    return () => clearTimeout(timeout);
  }, [footerCharAnims, items, continueOpacity]);

  return (
    <View style={styles.questionScreenWrap}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.questionContainer, styles.questionContainerPlain, styles.questionContainerWithFooter]}
      >
        <Text style={styles.questionTitle}>{lang === "el" ? "Πώς να υποστηρίξεις αυτό το στάδιο" : "How to support this stage"}</Text>
        {itemCount >= 3 ? (
          <View style={styles.weekPlanRailWrap}>
            {railItems.map((item, itemIndex) => {
              const key = `${itemIndex}-${item.category}`;
              const isCenter = itemIndex === activeIndex;
              const positionAnim = positionAnims[itemIndex];
              const blurOpacity = positionAnim.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [1, 0, 1],
              });
              const animatedStyle = {
                opacity: positionAnim.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0.58, 1, 0.58],
                }),
                transform: [
                  {
                    translateY: positionAnim.interpolate({
                      inputRange: [-1, 0, 1],
                      outputRange: [-112, 0, 112],
                    }),
                  },
                  {
                    scale: positionAnim.interpolate({
                      inputRange: [-1, 0, 1],
                      outputRange: [0.9, 1, 0.9],
                    }),
                  },
                ] as const,
                zIndex: isCenter ? 3 : 2,
              };

              return (
                <Animated.View
                  key={key}
                  style={[
                    styles.weekPlanRailSlotAbsolute,
                    animatedStyle,
                  ]}
                >
                  <View
                    style={[
                      styles.weekPlanCard,
                      isCenter && styles.weekPlanCardCenter,
                      useCompactReadableLayout && styles.weekPlanCardCompact,
                    ]}
                  >
                    <LinearGradient
                      colors={INSIGHT_CARD_GRADIENTS[itemIndex % INSIGHT_CARD_GRADIENTS.length]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[
                        styles.weekPlanCardGradient,
                        isCenter && styles.weekPlanCardGradientCenter,
                        useCompactReadableLayout && styles.weekPlanCardGradientCompact,
                      ]}
                    >
                      <View pointerEvents="none" style={styles.weekPlanCardGloss} />
                      {!isCenter ? (
                        <Animated.View style={[styles.weekPlanBlurOverlay, { opacity: blurOpacity }]}>
                          <BlurView
                            tint="light"
                            intensity={100}
                            {...blurViewProps}
                            style={StyleSheet.absoluteFillObject}
                          />
                          <View style={styles.weekPlanBlurVeil} />
                        </Animated.View>
                      ) : null}
                      <Pressable
                        disabled={!isCenter}
                        style={styles.expandableCardPressable}
                        onPress={() =>
                          setExpandedByKey((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                      >
                        <View style={styles.expandableHeaderRow}>
                          <Text
                            style={[
                              styles.weekPlanCategory,
                              isCenter && styles.weekPlanCategoryCenter,
                              !isCenter && styles.weekPlanCategoryBlurred,
                            ]}
                          >
                            {item.category === "Move"
                              ? (lang === "el" ? "🏃 Κίνηση" : "🏃 Move")
                              : item.category === "Bond"
                              ? (lang === "el" ? "❤️ Σύνδεση" : "❤️ Bond")
                              : (lang === "el" ? "🧠 Εξερεύνηση" : "🧠 Explore")}
                          </Text>
                          {isCenter ? (
                            <Ionicons
                              name={expandedByKey[key] ? "chevron-up" : "chevron-down"}
                              size={20}
                              color={Colors.muted}
                            />
                          ) : null}
                        </View>
                        <Text
                          style={[
                            styles.weekPlanDescription,
                            isCenter && styles.weekPlanDescriptionCenter,
                            !isCenter && styles.weekPlanDescriptionBlurred,
                            useCompactReadableLayout && styles.weekPlanDescriptionCompact,
                          ]}
                        >
                          {isCenter && expandedByKey[key] ? item.text : getFirstSentence(item.text)}
                        </Text>
                      </Pressable>
                    </LinearGradient>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        ) : (
          <View style={[styles.weekPlanCardsWrap, useCompactReadableLayout && styles.weekPlanCardsWrapCompact]}>
            {railItems.map((item, index) => (
              <View key={`${index}-${item.category}`} style={[styles.weekPlanCard, useCompactReadableLayout && styles.weekPlanCardCompact]}>
                <LinearGradient
                  colors={INSIGHT_CARD_GRADIENTS[index % INSIGHT_CARD_GRADIENTS.length]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.weekPlanCardGradient, useCompactReadableLayout && styles.weekPlanCardGradientCompact]}
                >
                  <View pointerEvents="none" style={styles.weekPlanCardGloss} />
                  <View style={styles.expandableHeaderRow}>
                    <Text style={styles.weekPlanCategory}>
                      {item.category === "Move"
                        ? (lang === "el" ? "🏃 Κίνηση" : "🏃 Move")
                        : item.category === "Bond"
                        ? (lang === "el" ? "❤️ Σύνδεση" : "❤️ Bond")
                        : (lang === "el" ? "🧠 Εξερεύνηση" : "🧠 Explore")}
                    </Text>
                  </View>
                  <Text style={[styles.weekPlanDescription, useCompactReadableLayout && styles.weekPlanDescriptionCompact]}>
                    {getFirstSentence(item.text)}
                  </Text>
                </LinearGradient>
              </View>
            ))}
          </View>
        )}
        <CharByCharText
          text={footerText}
          style={[styles.weekPlanBottomLineText, useCompactReadableLayout && styles.weekPlanBottomLineTextCompact]}
          charAnims={footerCharAnims}
        />
      </ScrollView>
      <Animated.View
        pointerEvents={showContinue ? "auto" : "none"}
        style={[styles.continueFooterAbsolute, { opacity: continueOpacity }]}
      >
        <Pressable style={styles.continueButton} onPress={() => { triggerContinueHaptic(); onNext(); }}>
          <Text style={styles.continueButtonText}>{tOnbPw(lang, "common.continue")}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function UnderstoodYouScreen({
  emotionalState,
  painPoint,
  ageText,
  parentType,
  lang,
  onNext,
}: {
  emotionalState: string;
  painPoint: string;
  ageText: string;
  parentType: string;
  lang: OnboardingPaywallLanguage;
  onNext: () => void;
}) {
  const { width: windowWidth } = useWindowDimensions();
  const [showContinue, setShowContinue] = useState(false);
  const [focusedCardKey, setFocusedCardKey] = useState<string | null>(null);
  const rowFadeAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const rowTranslateYAnims = useRef([
    new Animated.Value(8),
    new Animated.Value(8),
    new Animated.Value(8),
    new Animated.Value(8),
  ]).current;
  const rowUnfoldAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const bottomLine = lang === "el" ? "Έτσι φτιάξαμε ένα πλάνο που ταιριάζει στη μέρα σου." : "So we built a plan that fits your day effortlessly.";
  const bottomLineAnims = useMemo(
    () => bottomLine.split("").map(() => new Animated.Value(0)),
    [bottomLine]
  );
  const continueOpacity = useRef(new Animated.Value(0)).current;
  const focusedCardAnim = useRef(new Animated.Value(0)).current;

  function getYourDayProfile(
    currentEmotionalState: string,
    currentPainPoint: string,
    currentParentType: string
  ): { main: string; emoji: string; tone: string } {
    const isDad = currentParentType === "Dad";

    if (currentEmotionalState === "Loving it") {
      if (currentPainPoint === "Not enough time") return { main: "Busy but steady", emoji: "⚡", tone: "#7B8898" };
      if (currentPainPoint === "Don't know what to do") return { main: "Needs clarity", emoji: "🧭", tone: "#7B8898" };
      if (currentPainPoint === "Overlooking something") return { main: "High standards", emoji: "🎯", tone: "#7B8898" };
      if (currentPainPoint === "Just need it to be easy") return { main: "Wants simplicity", emoji: isDad ? "🧘‍♂️" : "🧘‍♀️", tone: "#7B8898" };
    }

    if (currentEmotionalState === "A bit anxious") {
      if (currentPainPoint === "Not enough time") return { main: "Under pressure", emoji: "⏱️", tone: "#7B8898" };
      if (currentPainPoint === "Don't know what to do") return { main: "Needs guidance", emoji: "🧭", tone: "#7B8898" };
      if (currentPainPoint === "Overlooking something") return { main: "Reassurance needed", emoji: "🛟", tone: "#7B8898" };
      if (currentPainPoint === "Just need it to be easy") return { main: "Needs simplicity", emoji: "🌿", tone: "#7B8898" };
    }

    if (currentEmotionalState === "Exhausted") {
      if (currentPainPoint === "Not enough time") return { main: "Overloaded", emoji: "🫠", tone: "#7B8898" };
      if (currentPainPoint === "Don't know what to do") return { main: "Mentally drained", emoji: "😮‍💨", tone: "#7B8898" };
      if (currentPainPoint === "Overlooking something") return { main: "Running on empty", emoji: "🔋", tone: "#7B8898" };
      if (currentPainPoint === "Just need it to be easy") return { main: "Low-energy mode", emoji: "🛌", tone: "#7B8898" };
    }

    if (currentEmotionalState === "Just surviving") {
      if (currentPainPoint === "Not enough time") return { main: "Survival mode", emoji: "🆘", tone: "#7B8898" };
      if (currentPainPoint === "Don't know what to do") return { main: "Needs clear next step", emoji: "🧩", tone: "#7B8898" };
      if (currentPainPoint === "Overlooking something") return { main: "Holding it together", emoji: "🤍", tone: "#7B8898" };
      if (currentPainPoint === "Just need it to be easy") return { main: "Bare-minimum mode", emoji: "🧺", tone: "#7B8898" };
    }

    return { main: "Needs support", emoji: "🤝", tone: "#7B8898" };
  }

  const yourDayProfile = getYourDayProfile(emotionalState, painPoint, parentType);

  function getUnderstoodCardTheme(top: string, emoji: string): { border: string; bg: string; gradient: [string, string] } {
    if (top === "RIGHT NOW" || top === "ΤΩΡΑ") {
      if (emoji === "😌") return { border: "rgba(112,192,152,0.95)", bg: "#D8F5E6", gradient: ["#FFFFFF", "#C8F0DD"] };
      if (emoji === "😰") return { border: "rgba(90,153,224,0.95)", bg: "#D4E8FF", gradient: ["#FFFFFF", "#BEDBFF"] };
      if (emoji === "😴") return { border: "rgba(155,136,216,0.95)", bg: "#E4DCFF", gradient: ["#FFFFFF", "#D4C8FF"] };
      return { border: "rgba(218,149,98,0.95)", bg: "#FCE1CD", gradient: ["#FFFFFF", "#F5CFAF"] };
    }
    if (top === "YOUR BABY" || top === "ΤΟ ΜΩΡΟ ΣΟΥ") {
      return { border: "rgba(157,166,180,0.95)", bg: "#E7EBF2", gradient: ["#FFFFFF", "#D4DBE6"] };
    }
    if (top === "BIGGEST CHALLENGE" || top === "ΜΕΓΑΛΥΤΕΡΗ ΠΡΟΚΛΗΣΗ") {
      if (emoji === "🪄") return { border: "rgba(156,118,84,0.95)", bg: "#EBD9C8", gradient: ["#FFFFFF", "#CFAB84"] };
      if (emoji === "😟") return { border: "rgba(212,139,116,0.95)", bg: "#F9DFD6", gradient: ["#FFFFFF", "#F0C3B6"] };
      if (emoji === "⏳") return { border: "rgba(220,164,106,0.95)", bg: "#FAE6D1", gradient: ["#FFFFFF", "#F4D2AF"] };
      return { border: "rgba(186,144,109,0.95)", bg: "#F3E0CD", gradient: ["#FFFFFF", "#E4C3A2"] };
    }
    if (top === "YOUR DAY" || top === "Η ΜΕΡΑ ΣΟΥ") {
      if (emoji === "⚡" || emoji === "⏱️") return { border: "rgba(234,192,98,0.95)", bg: "#FEE7B8", gradient: ["#FFFFFF", "#FBDDA0"] };
      if (emoji === "🧭" || emoji === "🛟") return { border: "rgba(111,170,232,0.95)", bg: "#D5E9FF", gradient: ["#FFFFFF", "#C0DEFF"] };
      if (emoji === "🫠" || emoji === "😮‍💨" || emoji === "🔋" || emoji === "🛌") return { border: "rgba(164,136,214,0.95)", bg: "#E2D8FF", gradient: ["#FFFFFF", "#CFBEFF"] };
      if (emoji === "🆘" || emoji === "🧩" || emoji === "🤍" || emoji === "🧺") return { border: "rgba(188,146,216,0.95)", bg: "#ECD8FF", gradient: ["#FFFFFF", "#DDC0FF"] };
      return { border: "rgba(121,182,226,0.95)", bg: "#D9ECFF", gradient: ["#FFFFFF", "#C7E1FF"] };
    }
    return { border: "rgba(210,218,230,0.95)", bg: "#FFFFFF", gradient: ["#FFFFFF", "#F7FAFF"] };
  }

  const rows = useMemo(
    () => [
      {
        top: lang === "el" ? "ΤΩΡΑ" : "RIGHT NOW",
        emoji:
          emotionalState === "Loving it"
            ? "😌"
            : emotionalState === "A bit anxious"
            ? "😰"
            : emotionalState === "Exhausted"
            ? "😴"
            : "😵",
        tone: "#7A8899",
        main:
          lang === "el"
            ? emotionalState === "Loving it"
              ? "Το απολαμβάνω"
              : emotionalState === "A bit anxious"
                ? "Λίγο αγχωμένη διάθεση"
                : emotionalState === "Exhausted"
                  ? "Νιώθω εξάντληση"
                  : "Απλώς επιβιώνω"
            : (emotionalState || "Loving it"),
        ...getUnderstoodCardTheme(
          "RIGHT NOW",
          emotionalState === "Loving it"
            ? "😌"
            : emotionalState === "A bit anxious"
            ? "😰"
            : emotionalState === "Exhausted"
            ? "😴"
            : "😵"
        ),
      },
      {
        top: lang === "el" ? "ΤΟ ΜΩΡΟ ΣΟΥ" : "YOUR BABY",
        emoji: "👶",
        tone: "#7A8F7A",
        main: lang === "el" ? `${ageText}` : `${ageText} old`,
        ...getUnderstoodCardTheme("YOUR BABY", "👶"),
      },
      {
        top: lang === "el" ? "ΜΕΓΑΛΥΤΕΡΗ ΠΡΟΚΛΗΣΗ" : "BIGGEST CHALLENGE",
        emoji:
          painPoint === "Not enough time"
            ? "⏳"
            : painPoint === "Don't know what to do"
            ? parentType === "Dad"
              ? "🤷"
              : "🤷‍♀️"
            : painPoint === "Overlooking something"
            ? "😟"
            : "🪄",
        tone: "#8D7C65",
        main:
          lang === "el"
            ? painPoint === "Not enough time"
              ? "Δεν έχω αρκετό χρόνο"
              : painPoint === "Don't know what to do"
                  ? "Δεν ξέρω τι να κάνω"
                  : painPoint === "Overlooking something"
                  ? "Ξεχνάω εύκολα"
                  : "Θέλω να είναι πιο απλό"
            : (painPoint || "Just need it to be easy"),
        ...getUnderstoodCardTheme(
          "BIGGEST CHALLENGE",
          painPoint === "Not enough time"
            ? "⏳"
            : painPoint === "Don't know what to do"
            ? parentType === "Dad"
              ? "🤷"
              : "🤷‍♀️"
            : painPoint === "Overlooking something"
            ? "😟"
            : "🪄"
        ),
      },
      {
        top: lang === "el" ? "Η ΜΕΡΑ ΣΟΥ" : "YOUR DAY",
        emoji: yourDayProfile.emoji,
        tone: yourDayProfile.tone,
        main:
          lang === "el"
            ? "Προσαρμόζουμε το πλάνο σου"
            : yourDayProfile.main,
        ...getUnderstoodCardTheme("YOUR DAY", yourDayProfile.emoji),
      },
    ],
    [ageText, emotionalState, lang, painPoint, parentType, yourDayProfile.emoji, yourDayProfile.main, yourDayProfile.tone]
  );
  const isNarrowLayout = windowWidth < 360 || ONBOARDING_FONT_SCALE >= 1.2;
  const rowPairs = useMemo(() => [[rows[0], rows[1]], [rows[2], rows[3]]], [rows]);
  const flatRows = useMemo(() => rowPairs.flat(), [rowPairs]);
  const focusedRow = useMemo(
    () => flatRows.find((row) => `${row.top}-${row.main}` === focusedCardKey) ?? null,
    [flatRows, focusedCardKey]
  );

  useEffect(() => {
    rowFadeAnims.forEach((anim) => anim.setValue(0));
    rowTranslateYAnims.forEach((anim) => anim.setValue(8));
    rowUnfoldAnims.forEach((anim) => anim.setValue(0));
    const fadeInDelays = [120, 280, 440, 600];
    const animation = Animated.parallel(
      rowFadeAnims.map((anim, index) =>
        Animated.parallel([
          Animated.timing(anim, {
            toValue: 1,
            duration: 320,
            delay: fadeInDelays[index] ?? 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(rowTranslateYAnims[index], {
            toValue: 0,
            duration: 320,
            delay: fadeInDelays[index] ?? 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(rowUnfoldAnims[index], {
            toValue: 1,
            duration: 340,
            delay: fadeInDelays[index] ?? 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ])
      )
    );
    animation.start();
    return () => animation.stop();
  }, [rowFadeAnims, rowTranslateYAnims, rowUnfoldAnims]);

  useEffect(() => {
    bottomLineAnims.forEach((anim) => anim.setValue(0));
    continueOpacity.setValue(0);
    setShowContinue(false);
    const timeout = setTimeout(() => {
      Animated.stagger(
        14,
        bottomLineAnims.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 42,
            useNativeDriver: true,
          })
        )
      ).start(() => {
        setShowContinue(true);
        Animated.timing(continueOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }).start();
      });
    }, 880);
    return () => clearTimeout(timeout);
  }, [bottomLineAnims, continueOpacity, rows]);

  useEffect(() => {
    if (!focusedCardKey) {
      focusedCardAnim.setValue(0);
      return;
    }
    focusedCardAnim.setValue(0);
    Animated.timing(focusedCardAnim, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [focusedCardAnim, focusedCardKey]);

  return (
    <View style={styles.questionScreenWrap}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.questionContainer, styles.questionContainerPlain, styles.questionContainerWithFooter]}
      >
        <Text style={styles.questionTitle}>{lang === "el" ? "Να τι καταλάβαμε για εσένα" : "Here’s what we understood about you"}</Text>
        <View style={styles.understoodGridWrap}>
          {rowPairs.map((pair, rowIndex) => (
            <View
              key={`pair-${rowIndex}`}
              style={isNarrowLayout ? styles.understoodGridRowStack : styles.understoodGridRow}
            >
              {pair.map((row, colIndex) => {
                const index = rowIndex * 2 + colIndex;
                return (
                  <Animated.View
                    key={`${row.top}-${row.main}`}
                    style={[
                      styles.understoodRowCard,
                      isNarrowLayout ? styles.understoodRowCardFull : styles.understoodRowCardHalf,
                      !isNarrowLayout && colIndex === 0 ? styles.understoodRowCardLeft : styles.understoodRowCardRight,
                      { borderColor: row.border, backgroundColor: row.bg },
                      {
                        opacity: rowFadeAnims[index] ?? 1,
                        transform: [
                          { perspective: 900 },
                          {
                            rotateX: rowUnfoldAnims[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: ["-12deg", "0deg"],
                            }),
                          },
                          {
                            scaleY: rowUnfoldAnims[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.84, 1],
                            }),
                          },
                          { translateY: rowTranslateYAnims[index] ?? 0 },
                        ],
                      },
                    ]}
                  >
                    <Pressable onPress={() => { triggerAnswerHaptic(); setFocusedCardKey(`${row.top}-${row.main}`); }}>
                      <LinearGradient
                        colors={row.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.understoodRowContent}
                      >
                        <Text style={[styles.understoodRowTopLabel, { color: row.tone }]}>{row.top}</Text>
                        <View style={styles.understoodMainRow}>
                          <Text style={styles.understoodRowEmoji}>{row.emoji}</Text>
                          <Text style={styles.understoodRowText}>{row.main}</Text>
                        </View>
                      </LinearGradient>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </View>
          ))}
        </View>
        <CharByCharText text={bottomLine} style={styles.comingSoonText} charAnims={bottomLineAnims} />
      </ScrollView>
      {focusedRow ? (
        <View pointerEvents="box-none" style={styles.understoodFocusLayer}>
          <BlurView tint="light" intensity={36} style={StyleSheet.absoluteFillObject} />
          <Pressable style={styles.understoodFocusDismissZone} onPress={() => { triggerAnswerHaptic(); setFocusedCardKey(null); }}>
            <View />
          </Pressable>
          <Animated.View
            style={[
              styles.understoodFocusedCardWrap,
              {
                opacity: focusedCardAnim,
                transform: [
                  {
                    scale: focusedCardAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.96, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.understoodRowCard,
                styles.understoodFocusedCard,
                { borderColor: focusedRow.border, backgroundColor: focusedRow.bg },
              ]}
            >
              <LinearGradient
                colors={focusedRow.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.understoodFocusedCardContent}
              >
                <Text style={[styles.understoodRowTopLabel, { color: focusedRow.tone }]}>{focusedRow.top}</Text>
                <View style={styles.understoodMainRow}>
                  <Text style={styles.understoodFocusedEmoji}>{focusedRow.emoji}</Text>
                  <Text style={styles.understoodFocusedText}>{focusedRow.main}</Text>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>
        </View>
      ) : null}
      <Animated.View
        pointerEvents={showContinue ? "auto" : "none"}
        style={[styles.continueFooterAbsolute, styles.continueFooterAboveOverlay, { opacity: continueOpacity }]}
      >
        <Pressable style={styles.continueButton} onPress={() => { triggerContinueHaptic(); onNext(); }}>
          <Text style={styles.continueButtonText}>{tOnbPw(lang, "common.continue")}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function ThisStageMattersScreen({ lang, onNext }: { lang: OnboardingPaywallLanguage; onNext: () => void }) {
  const { width: windowWidth } = useWindowDimensions();
  const [showContinue, setShowContinue] = useState(false);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const compareOpacity = useRef(new Animated.Value(0)).current;
  const compareY = useRef(new Animated.Value(10)).current;
  const bottomLine = lang === "el" ? "Δεν χρειάζεσαι περισσότερη προσπάθεια. Χρειάζεσαι σωστό timing." : "You don’t need more effort. You need the right timing.";
  const bottomLineAnims = useMemo(
    () => bottomLine.split("").map(() => new Animated.Value(0)),
    [bottomLine]
  );
  const continueOpacity = useRef(new Animated.Value(0)).current;
  const shouldStackCompare = windowWidth < 370 || ONBOARDING_FONT_SCALE >= 1.2;

  useEffect(() => {
    headerOpacity.setValue(0);
    compareOpacity.setValue(0);
    compareY.setValue(10);
    Animated.sequence([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(compareOpacity, {
          toValue: 1,
          duration: 360,
          useNativeDriver: true,
        }),
        Animated.timing(compareY, {
          toValue: 0,
          duration: 360,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [compareOpacity, compareY, headerOpacity]);

  useEffect(() => {
    bottomLineAnims.forEach((anim) => anim.setValue(0));
    continueOpacity.setValue(0);
    setShowContinue(false);
    const timeout = setTimeout(() => {
      Animated.stagger(
        14,
        bottomLineAnims.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 42,
            useNativeDriver: true,
          })
        )
      ).start(() => {
        setShowContinue(true);
        Animated.timing(continueOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }).start();
      });
    }, 980);
    return () => clearTimeout(timeout);
  }, [bottomLineAnims, continueOpacity]);

  return (
    <View style={styles.questionScreenWrap}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.questionContainer, styles.questionContainerPlain, styles.questionContainerWithFooter]}
      >
        <Animated.View style={{ opacity: headerOpacity }}>
          <Text style={styles.questionTitle}>{lang === "el" ? "Οι πρώτοι μήνες διαμορφώνουν τα πάντα" : "The first months shape everything"}</Text>
          <Text style={[styles.questionSub, styles.stageCompareSubCentered]}>{lang === "el" ? "Μικρές καθημερινές πράξεις → μακροπρόθεσμη ανάπτυξη" : "Small daily actions → long-term development"}</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.stageCompareWrap,
            shouldStackCompare && styles.stageCompareWrapStack,
            { opacity: compareOpacity, transform: [{ translateY: compareY }] },
          ]}
        >
          <View style={[styles.stageCompareColumn, styles.stageCompareLeftColumn, shouldStackCompare && styles.stageCompareColumnFull]}>
            <Text style={styles.stageCompareTitle}>{lang === "el" ? "Χωρίς δομή" : "Without structure"}</Text>
            <Text style={styles.stageCompareBullet}>{lang === "el" ? "❌ Πληρωμές για κλήσεις με παιδίατρο" : "❌ Paying for pediatrician calls"}</Text>
            <Text style={styles.stageCompareBullet}>{lang === "el" ? "❌ Δυσκολίες στον ύπνο" : "❌ Having trouble sleeping"}</Text>
            <Text style={styles.stageCompareBullet}>{lang === "el" ? "❌ Συνεχές μάντεμα" : "❌ Constant guessing"}</Text>
          </View>
          <LinearGradient
            colors={["#FFF6ED", "#FDEEDC", "#FCE5CD"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.stageCompareColumn, shouldStackCompare && styles.stageCompareColumnFull]}
          >
            <Text style={styles.stageCompareTitle}>{lang === "el" ? "Με Todayler" : "With Todayler"}</Text>
            <Text style={styles.stageCompareBullet}>{lang === "el" ? "✅ Καθημερινό tracking" : "✅ Daily tracking"}</Text>
            <Text style={styles.stageCompareBullet}>{lang === "el" ? "✅ 24/7 βοηθός γονεϊκότητας" : "✅ 24/7 parenting assistant"}</Text>
            <Text style={styles.stageCompareBullet}>{lang === "el" ? "✅ Δημιουργία ιστοριών" : "✅ Story generator"}</Text>
          </LinearGradient>
        </Animated.View>

        <CharByCharText
          text={bottomLine}
          style={[styles.stageBottomLineText, shouldStackCompare && styles.stageBottomLineTextCompact]}
          charAnims={bottomLineAnims}
        />
      </ScrollView>
      <Animated.View
        pointerEvents={showContinue ? "auto" : "none"}
        style={[styles.continueFooterAbsolute, { opacity: continueOpacity }]}
      >
        <Pressable style={styles.continueButton} onPress={() => { triggerContinueHaptic(); onNext(); }}>
          <Text style={styles.continueButtonText}>{tOnbPw(lang, "common.continue")}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function MiaPreviewScreen({
  name,
  ageInWeeks,
  babyGender,
  lang,
  onNext,
}: {
  name: string;
  ageInWeeks: number;
  babyGender: "girl" | "boy" | "unspecified";
  lang: OnboardingPaywallLanguage;
  onNext: () => void;
}) {
  const [phase, setPhase] = useState<"user" | "typing" | "reply">("user");
  const [showComplete, setShowComplete] = useState(false);
  const userBubbleOpacity = useRef(new Animated.Value(0)).current;
  const userBubbleY = useRef(new Animated.Value(10)).current;
  const typingOpacity = useRef(new Animated.Value(0)).current;
  const responseOpacity = useRef(new Animated.Value(0)).current;
  const responseX = useRef(new Animated.Value(-16)).current;
  const completeOpacity = useRef(new Animated.Value(0)).current;
  const dotAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const typingLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const responseText = useMemo(
    () => getMiaSleepResponse(ageInWeeks, babyGender, lang),
    [ageInWeeks, babyGender, lang]
  );
  const parentMessage = lang === "el" ? `${name} δεν μπορεί να κοιμηθεί, τι να κάνω;` : `${name} cant fall asleep what do i do`;

  const clearPhaseTimer = () => {
    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
  };

  const stopTypingLoop = () => {
    typingLoopRef.current?.stop();
    typingLoopRef.current = null;
    dotAnims.forEach((anim) => anim.setValue(0));
  };

  useEffect(() => {
    clearPhaseTimer();
    stopTypingLoop();
    userBubbleOpacity.setValue(0);
    userBubbleY.setValue(10);
    typingOpacity.setValue(0);
    responseOpacity.setValue(0);
    responseX.setValue(-16);
    completeOpacity.setValue(0);
    setShowComplete(false);
    setPhase("user");

    return () => {
      clearPhaseTimer();
      stopTypingLoop();
    };
  }, [ageInWeeks, name, babyGender, completeOpacity]);

  useEffect(() => {
    clearPhaseTimer();
    if (phase === "user") {
      Animated.parallel([
        Animated.timing(userBubbleOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(userBubbleY, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
      phaseTimerRef.current = setTimeout(() => setPhase("typing"), 260);
      return;
    }

    if (phase === "typing") {
      Animated.timing(typingOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
      typingLoopRef.current = Animated.loop(
        Animated.stagger(
          120,
          dotAnims.map((dot) =>
            Animated.sequence([
              Animated.timing(dot, { toValue: -4, duration: 180, useNativeDriver: true }),
              Animated.timing(dot, { toValue: 0, duration: 180, useNativeDriver: true }),
            ])
          )
        )
      );
      typingLoopRef.current.start();
      phaseTimerRef.current = setTimeout(() => setPhase("reply"), 1000);
      return () => {
        stopTypingLoop();
      };
    }

    stopTypingLoop();
    Animated.parallel([
      Animated.timing(typingOpacity, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(responseOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.timing(responseX, { toValue: 0, duration: 260, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (!finished) return;
      setShowComplete(true);
      Animated.timing(completeOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    });
  }, [phase, completeOpacity]);


  return (
    <View style={styles.questionScreenWrap}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.questionContainer, styles.questionContainerPlain, styles.questionContainerWithFooter]}
      >
        <Text style={styles.questionTitle}>{lang === "el" ? "Ένας 24/7 βοηθός γονεϊκότητας δίπλα σου" : "A 24/7 parenting companion by your side"}</Text>
        <Animated.View
          style={[
            styles.miaBubbleUser,
            { opacity: userBubbleOpacity, transform: [{ translateY: userBubbleY }] },
          ]}
        >
          <Text style={styles.miaBubbleUserText}>{parentMessage}</Text>
        </Animated.View>
        {phase === "typing" ? (
          <Animated.View style={[styles.miaTypingWrap, { opacity: typingOpacity }]}>
            <View style={styles.miaTypingBubble}>
              {dotAnims.map((dot, index) => (
                <Animated.View
                  key={index}
                  style={[styles.miaTypingDot, { transform: [{ translateY: dot }] }]}
                />
              ))}
            </View>
          </Animated.View>
        ) : null}
        <Animated.View
          style={[
            styles.miaResponseWrap,
            { opacity: responseOpacity, transform: [{ translateX: responseX }] },
          ]}
        >
          <Text style={styles.miaStamp}>{lang === "el" ? "Mία" : "Mia"}</Text>
          <View style={styles.miaBubbleAssistant}>
            <Text style={styles.miaBubbleAssistantText}>{responseText}</Text>
          </View>
        </Animated.View>
      </ScrollView>
      <Animated.View
        pointerEvents={showComplete ? "auto" : "none"}
        style={[styles.continueFooterAbsolute, { opacity: completeOpacity }]}
      >
        <Pressable style={styles.continueButton} onPress={() => { triggerContinueHaptic(); onNext(); }}>
          <Text style={styles.continueButtonText}>{lang === "el" ? "Ολοκλήρωση" : "Complete"}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function OnboardingFlow() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ authNotice?: string; mode?: string; screen?: string }>();
  const { saveBaby, resetOnboardingProfile } = useBaby();
  const { user } = useAuth();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [screen, setScreen] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Questionnaire answers
  const [parentType, setParentType] = useState("");
  const [emotionalState, setEmotionalState] = useState("");
  const [painPoint, setPainPoint] = useState("");
  const [babyName, setBabyName] = useState("");
  const [babyGender, setBabyGender] = useState<"boy" | "girl" | "unspecified" | "">("");
  const [showLuckyAfterName, setShowLuckyAfterName] = useState(false);

  // Baby details
  const deviceToday = useMemo(() => new Date(), []);
  const [birthDay, setBirthDay] = useState<number | null>(deviceToday.getDate());
  const [birthMonth, setBirthMonth] = useState(deviceToday.getMonth());
  const [birthYear, setBirthYear] = useState(deviceToday.getFullYear());
  const [preemieOption, setPreemieOption] = useState<"yes" | "no">("no");
  const [weeksEarly, setWeeksEarly] = useState(4);
  const [lang, setLang] = useState<OnboardingPaywallLanguage>("en");
  const displayNameCap = babyName.trim() || "Your little one";

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

  const handleLangChange = useCallback(
    (nextLang: OnboardingPaywallLanguage) => {
      setLang(nextLang);
      void setOnboardingLang(user?.id ?? null, nextLang);
    },
    [user?.id]
  );

  useEffect(() => {
    if (params.authNotice !== "no_account") return;
    Alert.alert(
      "You don't have an account yet",
      "Press the button below to start."
    );
  }, [params.authNotice]);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (params.mode !== "paywallRedo" || params.screen !== "1") return;
    setParentType("");
    setEmotionalState("");
    setPainPoint("");
    setBabyName("");
    setBabyGender("");
    setShowLuckyAfterName(false);
    setBirthDay(deviceToday.getDate());
    setBirthMonth(deviceToday.getMonth());
    setBirthYear(deviceToday.getFullYear());
    setPreemieOption("no");
    setWeeksEarly(4);
    fadeAnim.setValue(1);
    setScreen(1);
  }, [deviceToday, fadeAnim, params.mode, params.screen]);

  useEffect(() => {
    if (params.mode === "paywallBackReturn") {
      setScreen(13);
      return;
    }
    const requestedScreen = Number(params.screen);
    if (!Number.isFinite(requestedScreen)) return;
    if (params.mode === "paywallRedo" && requestedScreen === 1) return;
    const boundedScreen = Math.max(0, Math.min(13, Math.floor(requestedScreen)));
    setScreen(boundedScreen);
  }, [params.mode, params.screen]);

  useEffect(() => {
    if (birthDay === null) return;
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    const selected = new Date(birthYear, birthMonth, birthDay);
    const todayMidnight = new Date(todayYear, todayMonth, todayDay);

    if (selected.getTime() > todayMidnight.getTime()) {
      setBirthYear(todayYear);
      setBirthMonth(todayMonth);
      setBirthDay(todayDay);
      return;
    }

    const maxDayInMonth = getDaysInMonth(birthYear, birthMonth);
    const maxAllowedDay =
      birthYear === todayYear && birthMonth === todayMonth
        ? Math.min(maxDayInMonth, todayDay)
        : maxDayInMonth;

    if (birthDay > maxAllowedDay) {
      setBirthDay(maxAllowedDay);
    }
  }, [birthDay, birthMonth, birthYear]);

  function goBack() {
    fadeAnim.setValue(1);
    setScreen((s) => {
      if (s === 4) return emotionalState === "Loving it" ? 2 : 3;
      if (s === 3) return 2;
      // Checks screen is forward-only: on back, always skip it.
      if (s === 8 || s === 7) return 6;
      return s - 1;
    });
  }

  function resetLocalOnboardingState() {
    setParentType("");
    setEmotionalState("");
    setPainPoint("");
    setBabyName("");
    setBabyGender("");
    setShowLuckyAfterName(false);
    const today = new Date();
    setBirthDay(today.getDate());
    setBirthMonth(today.getMonth());
    setBirthYear(today.getFullYear());
    setPreemieOption("no");
    setWeeksEarly(4);
    fadeAnim.setValue(1);
    setScreen(0);
  }

  async function runRestartOnboarding() {
    const { error } = await resetOnboardingProfile();
    if (error) {
      Alert.alert("Couldn't restart", error);
      return;
    }
    resetLocalOnboardingState();
    router.replace("/onboarding/step1");
  }

  function confirmRestartOnboarding() {
    const title = "Start over?";
    const message =
      "This will reset your baby’s profile and your personalised plan. This can’t be undone.";

    if (Platform.OS === "web") {
      const confirmed =
        typeof globalThis.confirm === "function"
          ? globalThis.confirm(`${title}\n\n${message}`)
          : false;
      if (!confirmed) return;
      void runRestartOnboarding();
      return;
    }

    Alert.alert(
      title,
      message,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start over",
          style: "destructive",
          onPress: () => {
            void runRestartOnboarding();
          },
        },
      ]
    );
  }

  function transitionTo(next: number) {
    const isEncouragementTransition = next === 3 || screen === 3;
    if (isEncouragementTransition) {
      fadeAnim.setValue(0);
      setScreen(next);
      requestAnimationFrame(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }).start();
      });
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setScreen(next);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  }


  async function finishOnboarding() {
    const isPreemie = preemieOption === "yes";
    const adjustedWeeksEarly = isPreemie ? weeksEarly : 0;

    try {
      if (user) {
        await saveBaby({
          parentType,
          emotionalState,
          categoryPreference: "all",
          painPoint,
          name: babyName.trim(),
          gender: babyGender || "unspecified",
          birthDay: birthDay ?? 1,
          birthMonth,
          birthYear,
          isPreemie,
          weeksEarly: adjustedWeeksEarly,
          reminderTime: "09:00",
          notificationsEnabled: true,
          onboardingComplete: false,
          isSignedIn: true,
          isPremium: false,
        });
        transitionTo(7);
        return;
      }

      await saveBaby({
        parentType,
        emotionalState,
        categoryPreference: "all",
        painPoint,
        name: babyName.trim(),
        gender: babyGender || "unspecified",
        birthDay: birthDay ?? 1,
        birthMonth,
        birthYear,
        isPreemie,
        weeksEarly: adjustedWeeksEarly,
        reminderTime: "09:00",
        notificationsEnabled: true,
        onboardingComplete: false, // set to true after paywall
      });
      transitionTo(7);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please choose a valid birth date.";
      Alert.alert("Couldn't continue", message);
    }
  }

  // Internal screen indices include non-counted bridge/encouragement screens.
  // This map is the single source of truth for visible onboarding step numbering (1..11).
  const visibleStepByScreen: Record<number, number> = {
    1: 1,
    2: 2,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 6,
    8: 6,
    9: 7,
    10: 8,
    11: 9,
    12: 10,
    13: 11,
  };
  const totalOnboardingPages = 11;
  const currentVisibleStep = visibleStepByScreen[screen] ?? 0;
  const progress = currentVisibleStep / totalOnboardingPages;
  const isProcessingBridgeScreen = screen === 7;
  const showProgress = screen >= 1 && screen <= 13 && !isProcessingBridgeScreen;
  const showStepCounter = screen >= 1 && screen <= 13 && !isProcessingBridgeScreen;
  const showBack = ((screen >= 1 && screen <= 8) || (screen >= 10 && screen <= 13)) && !isProcessingBridgeScreen;
  const showRedo = screen === 9;
  const stepCounterText = tOnbPw(lang, "step.counter", {
    current: currentVisibleStep,
    total: totalOnboardingPages,
  });

  const showEncouragementGradient = screen === 3;
  const ageSummary = useMemo(
    () => getAgeSummary(birthDay, birthMonth, birthYear, preemieOption, weeksEarly),
    [birthDay, birthMonth, birthYear, preemieOption, weeksEarly]
  );
  const insightCopy = useMemo(
    () => getInsightCopy(ageSummary.totalWeeks),
    [ageSummary.totalWeeks]
  );
  const weeklyTopNoteLine = useMemo(() => {
    const gender = (babyGender || "unspecified") as "girl" | "boy" | "unspecified";
    const note = getMilestoneTopWeeklyNote(ageSummary.totalWeeks, gender);
    return (note?.body || insightCopy.weeklyNoteLine).trim();
  }, [ageSummary.totalWeeks, babyGender, insightCopy.weeklyNoteLine]);
  const thisWeekItems = useMemo(
    () => getThisWeekPlanItems(ageSummary.totalWeeks, lang),
    [ageSummary.totalWeeks, lang]
  );
  const localizedAgeText = useMemo(
    () => getLocalizedAgeText(ageSummary, lang),
    [ageSummary, lang]
  );
  const previewName = displayNameCap;

  function renderScreen() {
    switch (screen) {
      case 0:
        return <HookScreen onNext={() => transitionTo(1)} lang={lang} onLangChange={handleLangChange} />;
      case 1:
        return (
          <QuestionScreen
            title={tOnbPw(lang, "question.whoAreYou")}
            options={["Mom", "Dad", "Grandparent", "Other"]}
            optionLabels={lang === "el" ? {
              Mom: "👩 Μαμά",
              Dad: "👨 Μπαμπάς",
              Grandparent: "👵 Παππούς ή Γιαγιά",
              Other: "Άλλο",
            } : undefined}
            value={parentType}
            onSelect={setParentType}
            onNext={() => transitionTo(2)}
            twoColumn
            stickOptionsToBottom
            stackRoleEmoji
            largeOptions
            equalizeTwoColumnRows
            disableFooterReserve
            bottomInset={botPad}
            centerTitle
            compactChoiceText
            autoAdvance
            continueLabel={tOnbPw(lang, "common.continue")}
          />
        );
      case 2:
        return (
          <QuestionScreen
            title={tOnbPw(lang, "question.feelingNow")}
            options={["Just surviving", "Exhausted", "A bit anxious", "Loving it"]}
            optionLabels={lang === "el" ? {
              "Just surviving": "😵 Απλώς επιβιώνω",
              Exhausted: "😴 Νιώθω εξάντληση",
              "A bit anxious": "😰 Λίγο αγχωμένη διάθεση",
              "Loving it": "😌 Το απολαμβάνω",
            } : undefined}
            value={emotionalState}
            onSelect={setEmotionalState}
            onNext={(selected) => (selected ?? emotionalState) === "Loving it" ? transitionTo(4) : transitionTo(3)}
            twoColumn
            stickOptionsToBottom
            stackRoleEmoji
            largeOptions
            equalizeTwoColumnRows
            disableFooterReserve
            bottomInset={botPad}
            centerTitle
            compactChoiceText
            autoAdvance
            continueLabel={tOnbPw(lang, "common.continue")}
          />
        );
      case 3:
        return <EmotionalResponseScreen emotionalState={emotionalState} lang={lang} onNext={() => transitionTo(4)} />;
      case 4:
        return (
          <QuestionScreen
            title={tOnbPw(lang, "question.biggestChallenge")}
            options={[
              "Not enough time",
              "Don't know what to do",
              "Overlooking something",
              "Just need it to be easy",
            ]}
            optionLabels={{
                  ...(lang === "el"
                ? {
                    "Not enough time": "⏱️ Δεν έχω αρκετό χρόνο",
                    "Overlooking something": "😟 Ξεχνάω εύκολα",
                    "Just need it to be easy": "🪄 Θέλω να είναι πιο απλό",
                  }
                : {}),
              "Don't know what to do": lang === "el"
                ? (parentType === "Dad" ? "🤷 Δεν ξέρω τι να κάνω" : "🤷‍♀️ Δεν ξέρω τι να κάνω")
                : (parentType === "Dad" ? "🤷 Don't know what to do" : "🤷‍♀️ Don't know what to do"),
            }}
            value={painPoint}
            onSelect={setPainPoint}
            onNext={() => transitionTo(5)}
            twoColumn
            stickOptionsToBottom
            stackRoleEmoji
            largeOptions
            disableFooterReserve
            bottomInset={botPad}
            centerTitle
            compactChoiceText
            autoAdvance
            continueLabel={tOnbPw(lang, "common.continue")}
          />
        );
      case 5:
        return (
          <NameScreen
            value={babyName}
            gender={babyGender}
            lang={lang}
            onChange={setBabyName}
            onGenderChange={setBabyGender}
            onNext={() => transitionTo(6)}
          />
        );
      case 6:
        return (
          <BirthdayScreen
            name={displayNameCap}
            lang={lang}
            gender={babyGender}
            day={birthDay}
            month={birthMonth}
            year={birthYear}
            isEarly={preemieOption}
            weeksEarly={weeksEarly}
            onDayChange={setBirthDay}
            onMonthChange={setBirthMonth}
            onYearChange={setBirthYear}
            onSelectEarly={setPreemieOption}
            onWeeksChange={setWeeksEarly}
            onNext={finishOnboarding}
          />
        );
      case 7:
        return (
          <ProcessingBridgeScreen
            babyName={previewName}
            ageText={localizedAgeText}
            emotionalState={emotionalState}
            painPoint={painPoint}
            babyGender={babyGender}
            lang={lang}
            onDone={() => transitionTo(user ? 9 : 8)}
          />
        );
      case 8:
        return (
          <OnboardingSignupStep
            name={previewName}
            lang={lang}
            onSuccess={() => transitionTo(9)}
            onSkip={() => transitionTo(9)}
          />
        );
      case 9:
        return (
          <InsightScreen
            name={previewName}
            ageText={localizedAgeText}
            totalWeeks={ageSummary.totalWeeks}
            points={insightCopy.points}
            weeklyNoteLine={weeklyTopNoteLine}
            babyGender={babyGender}
            lang={lang}
            onNext={() => transitionTo(10)}
          />
        );
      case 10:
        return <ThisWeekPlanScreen items={thisWeekItems} lang={lang} onNext={() => transitionTo(11)} />;
      case 11:
        return (
          <UnderstoodYouScreen
            emotionalState={emotionalState}
            painPoint={painPoint}
            ageText={localizedAgeText}
            parentType={parentType}
            lang={lang}
            onNext={() => transitionTo(12)}
          />
        );
      case 12:
        return <ThisStageMattersScreen lang={lang} onNext={() => transitionTo(13)} />;
      case 13:
        return (
          <MiaPreviewScreen
            name={previewName}
            ageInWeeks={ageSummary.totalWeeks}
            babyGender={(babyGender || "unspecified") as "girl" | "boy" | "unspecified"}
            lang={lang}
            onNext={() => router.replace("/claim")}
          />
        );
      default:
        return null;
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.root, { paddingTop: screen === 0 ? 0 : topPad }]}>
        {!showEncouragementGradient ? <OnboardingPartyLights /> : null}
        {showEncouragementGradient && (
          <LinearGradient
            colors={["#F5E6DC", "#E7B49A", "#D48A6B"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        )}
        {showStepCounter && !showEncouragementGradient ? (
          <Text style={styles.stepCounterTopText}>{stepCounterText}</Text>
        ) : null}
        {showProgress && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        )}
        {showBack && (
          <>
            <Pressable
              style={styles.backBtn}
              onPress={goBack}
              hitSlop={12}
            >
              <Ionicons name="chevron-back" size={24} color={Colors.charcoal} />
            </Pressable>
          </>
        )}
        {showRedo && (
          <>
            <Pressable
              style={styles.redoBtn}
              onPress={confirmRestartOnboarding}
              hitSlop={12}
            >
              <Ionicons name="refresh-outline" size={22} color={Colors.charcoal} />
            </Pressable>
          </>
        )}
        <View
          style={[
            styles.screenStage,
            {
              paddingBottom: screen === 0 ? 0 : (screen === 5 && isKeyboardVisible ? 6 : botPad + 24),
              paddingHorizontal: screen === 0 ? 0 : 24,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.screenWrap,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            {renderScreen()}
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  screenStage: {
    flex: 1,
    position: "relative",
  },
  questionLogoBackdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
  },
  questionLogoBackdropImage: {
    width: 190,
    height: 190,
    opacity: 0.11,
  },
  progressBar: {
    height: 3,
    backgroundColor: Colors.divider,
    marginHorizontal: 24,
    marginTop: 12,
    borderRadius: 2,
  },
  progressFill: {
    height: 3,
    backgroundColor: Colors.charcoal,
    borderRadius: 2,
  },
  backBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  redoBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  stepCounterTopText: {
    marginTop: 2,
    marginBottom: 6,
    textAlign: "center",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    color: Colors.muted,
  },
  screenWrap: {
    flex: 1,
  },
  // Hook / Lucky
  hookContainer: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 40,
    overflow: "hidden",
    backgroundColor: "#2A170E",
  },
  hookDimmer: {
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  hookContent: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  hookBrand: {
    position: "absolute",
    top: 68,
    left: 0,
    right: 0,
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 34,
    letterSpacing: 0.4,
    textAlign: "center",
    opacity: 0.82,
    zIndex: 2,
  },
  hookLangToggleWrap: {
    position: "absolute",
    top: 118,
    left: undefined,
    right: undefined,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
    zIndex: 3,
    backgroundColor: "rgba(30,22,18,0.48)",
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  hookLangPill: {
    minWidth: 38,
    height: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  hookLangPillActive: {
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  hookLangText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  hookLangTextActive: {
    color: Colors.charcoal,
  },
  hookTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 28,
    color: Colors.white,
    lineHeight: 36,
    marginBottom: 16,
    textAlign: "center",
    alignSelf: "center",
    maxWidth: 560,
  },
  hookSub: {
    fontFamily: "Nunito_400Regular",
    fontSize: 17,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 26,
    marginBottom: 48,
    textAlign: "center",
    alignSelf: "center",
    maxWidth: 620,
  },
  hookButton: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    alignSelf: "stretch",
    width: "100%",
  },
  hookButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 17,
    color: Colors.charcoal,
  },
  luckyText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 36,
    color: Colors.charcoal,
    lineHeight: 48,
    textAlign: "center",
  },
  luckySubtext: {
    marginTop: 14,
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    color: Colors.muted,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  // Questions
  questionScreenWrap: {
    flex: 1,
    backgroundColor: "transparent",
  },
  questionContainer: {
    flexGrow: 1,
    paddingTop: 12,
    paddingBottom: 8,
  },
  questionContainerPlain: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  questionContainerWithFooter: {
    paddingBottom: 132 + ONBOARDING_FOOTER_EXTRA_SPACE,
  },
  birthdayScrollContent: {
    paddingBottom: 168 + ONBOARDING_FOOTER_EXTRA_SPACE,
  },
  questionContainerOnImage: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  questionTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 28,
    color: Colors.charcoal,
    lineHeight: 36,
    marginBottom: 8,
    textAlign: "center",
  },
  questionTitleCentered: {
    textAlign: "center",
  },
  questionTitleSmall: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: Colors.charcoal,
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 10,
    textAlign: "center",
  },
  preemieToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 4,
    marginBottom: 12,
  },
  preemieInlineLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: Colors.charcoal,
    lineHeight: 24,
  },
  preemieToggleBtn: {
    minWidth: 88,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  preemieToggleBtnSelected: {
    backgroundColor: Colors.charcoal,
    borderColor: Colors.charcoal,
  },
  preemieToggleText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: Colors.charcoal,
  },
  preemieToggleTextSelected: {
    color: Colors.white,
  },
  questionSub: {
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    color: Colors.muted,
    lineHeight: 22,
    marginBottom: 20,
  },
  signupSocialWrap: {
    gap: 12,
    marginTop: 4,
  },
  signupAppleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.charcoal,
    borderRadius: 14,
    paddingVertical: 16,
  },
  signupAppleButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: Colors.white,
  },
  signupGoogleButton: {
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
  signupGoogleLogo: {
    width: 20,
    height: 20,
  },
  signupGoogleButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: Colors.charcoal,
  },
  signupErrorText: {
    marginTop: 12,
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: Colors.error,
    textAlign: "center",
  },
  signupSkipButton: {
    marginTop: 150,
    alignSelf: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "transparent",
    minWidth: 18,
    minHeight: 18,
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  signupSkipButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 9,
    lineHeight: 10,
    color: "transparent",
  },
  optionsGap: {
    gap: 10,
    marginTop: 12,
    marginBottom: 20,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    columnGap: 0,
  },
  optionsBottomAnchor: {
    marginTop: "auto",
    marginBottom: 8,
  },
  optionGridCell: {
    width: "48%",
  },
  optionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: Colors.divider,
  },
  optionCardLarge: {
    minHeight: 122,
    justifyContent: "center",
    paddingVertical: 18,
  },
  optionCardSelected: {
    backgroundColor: Colors.charcoal,
    borderColor: Colors.charcoal,
  },
  optionEmojiStack: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  optionEmojiTop: {
    fontSize: 36,
    lineHeight: 38,
  },
  optionText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    color: Colors.charcoal,
  },
  optionTextLarge: {
    fontSize: 17,
  },
  optionTextLargeCompact: {
    fontSize: 15,
  },
  optionTextCentered: {
    textAlign: "center",
  },
  optionTextSelected: {
    color: Colors.white,
  },
  genderLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: Colors.charcoal,
    marginBottom: 10,
  },
  genderRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  genderChip: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.divider,
    paddingVertical: 14,
    alignItems: "center",
  },
  genderChipSelected: {
    backgroundColor: Colors.charcoal,
    borderColor: Colors.charcoal,
  },
  genderChipText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: Colors.charcoal,
  },
  genderChipTextSelected: {
    color: Colors.white,
  },
  continueButton: {
    backgroundColor: Colors.charcoal,
    borderRadius: 16,
    minHeight: 54,
    paddingVertical: ONBOARDING_CONTINUE_VERTICAL_PADDING,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  continueFooterAbsolute: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: ONBOARDING_FOOTER_BOTTOM_OFFSET,
  },
  nameContinueFooterInline: {
    marginTop: "auto",
    paddingTop: 8,
  },
  continueButtonDisabled: {
    opacity: 0.45,
  },
  continueButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 17,
    textAlign: "center",
    color: Colors.white,
  },
  skipButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  skipText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    color: Colors.muted,
    textDecorationLine: "underline",
  },
  // Name input
  nameInput: {
    fontFamily: "Nunito_400Regular",
    fontSize: 18,
    color: Colors.charcoal,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.divider,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  // Birthday pickers
  pickerRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 8,
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerLabel: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    color: Colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  pickerScroll: {
    height: DOB_PICKER_HEIGHT,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 10,
    backgroundColor: Colors.white,
    overflow: "hidden",
  },
  pickerBox: {
    position: "relative",
  },
  pickerContent: {
    paddingTop: DOB_CENTER_PAD,
    paddingBottom: DOB_CENTER_PAD,
  },
  pickerItem: {
    minHeight: DOB_ITEM_HEIGHT,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerItemSelected: {
    backgroundColor: "#EFE7DC",
  },
  pickerText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 13,
    color: Colors.muted,
    opacity: 0.9,
  },
  pickerTextSelected: {
    fontSize: 15,
    color: Colors.charcoal,
    opacity: 1,
  },
  pickerCenterHighlight: {
    position: "absolute",
    left: 4,
    right: 4,
    top: DOB_CENTER_PAD,
    height: DOB_ITEM_HEIGHT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
    backgroundColor: "rgba(44, 28, 12, 0.03)",
  },
  pickerEdgeBlur: {
    position: "absolute",
    left: 1,
    right: 1,
    height: 7,
  },
  pickerEdgeBlurTop: {
    top: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  pickerEdgeBlurBottom: {
    bottom: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: "hidden",
  },
  // Preemie note
  preemieNote: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: Colors.play,
    marginBottom: 16,
    marginTop: 4,
  },
  // Time grid
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
    marginBottom: 20,
  },
  timeChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.divider,
  },
  timeChipSelected: {
    backgroundColor: Colors.charcoal,
    borderColor: Colors.charcoal,
  },
  timeChipText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    color: Colors.charcoal,
  },
  timeChipTextSelected: {
    color: Colors.white,
  },
  // Loading screen
  loadingContainer: {
    paddingTop: 34,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  loadingTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 28,
    color: Colors.charcoal,
    lineHeight: 38,
    marginBottom: 12,
  },
  loadingItems: {
    marginTop: 32,
    gap: 22,
  },
  loadingItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  loadingItemText: {
    flex: 1,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    lineHeight: 22,
    color: Colors.charcoal,
  },
  processingScreenWrap: {
    justifyContent: "center",
  },
  processingCentered: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  processingEyebrow: {
    textAlign: "center",
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 28,
    lineHeight: 36,
    color: Colors.charcoal,
    marginBottom: 8,
  },
  processingSub: {
    textAlign: "center",
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: Colors.muted,
    marginBottom: 16,
  },
  processingMainCard: {
    backgroundColor: "#FFFDF9",
    borderWidth: 1,
    borderColor: "rgba(228, 213, 198, 0.9)",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: "#8B6B52",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  processingRow: {
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  processingRowActive: {
    backgroundColor: "rgba(229, 157, 112, 0.12)",
    shadowColor: "#D48A6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  processingDotPending: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: "#E6D8CB",
    backgroundColor: "#F7EFE7",
  },
  processingDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E59D70",
  },
  processingCheckDone: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E59D70",
    alignItems: "center",
    justifyContent: "center",
  },
  processingRowLiveText: {
    flex: 1,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
    lineHeight: 21,
    color: "#8A8A8A",
  },
  processingRowLiveTextActive: {
    color: Colors.charcoal,
  },
  processingFootnote: {
    marginTop: 12,
    textAlign: "center",
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
    color: Colors.muted,
  },
  processingProgressTrack: {
    marginTop: 12,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(229, 157, 112, 0.22)",
    overflow: "hidden",
  },
  processingProgressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#E59D70",
  },
  bouncingDotsRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-start",
    marginTop: 16,
    marginBottom: 8,
  },
  bouncingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.muted,
  },
  // Graph screen
  graphSourceLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 24,
    color: Colors.charcoal,
    lineHeight: 32,
    marginBottom: 14,
    marginTop: 4,
  },
  graphSourceLabelHighlight: {
    color: Colors.play,
  },
  graphStat: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: Colors.muted,
    lineHeight: 20,
    marginBottom: 28,
  },
  graphWrapper: {
    marginBottom: 16,
  },
  graphYLabel: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 11,
    color: Colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  graphArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 140,
  },
  graphColumn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 1,
  },
  graphBarWithout: {
    flex: 1,
    backgroundColor: "#D9D0C7",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  graphBarWith: {
    flex: 1,
    backgroundColor: Colors.play,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    opacity: 0.9,
  },
  graphXAxis: {
    height: 1.5,
    backgroundColor: Colors.divider,
    marginTop: 4,
  },
  graphXLabel: {
    fontFamily: "Nunito_400Regular",
    fontSize: 11,
    color: Colors.muted,
    textAlign: "center",
    marginTop: 6,
  },
  graphLegend: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendSwatch: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: Colors.muted,
  },
  // Emotional response screen
  emotionalContainer: {
    flex: 1,
    justifyContent: "center",
  },
  encouragementContent: {
    paddingTop: 24,
    paddingBottom: 32,
    backgroundColor: "transparent",
  },
  emotionalTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 34,
    color: Colors.charcoal,
    lineHeight: 44,
    marginBottom: 14,
    textAlign: "center",
  },
  emotionalImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  emotionalSubtitle: {
    fontFamily: "Nunito_400Regular",
    fontSize: 17,
    color: Colors.muted,
    lineHeight: 28,
  },
  hookSecondaryRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    alignSelf: "center",
    width: "100%",
    paddingRight: 40,
  },
  hookSecondaryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  hookSecondaryText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    textDecorationLine: "underline",
  },
  // Loading question section
  loadingQuestionSection: {
    marginTop: 32,
  },
  loadingQuestionImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
  },
  loadingQuestionTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 22,
    color: Colors.charcoal,
    marginBottom: 8,
  },
  loadingQuestionText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    color: Colors.muted,
    lineHeight: 24,
    marginBottom: 20,
  },
  loadingAnswerButtons: {
    gap: 10,
  },
  loadingYesBtn: {
    backgroundColor: Colors.charcoal,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  loadingYesBtnText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: Colors.white,
  },
  loadingNoBtn: {
    paddingVertical: 10,
    alignItems: "center",
  },
  loadingNoBtnText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    color: Colors.muted,
  },
  insightCardsWrap: {
    gap: 12,
    marginTop: 8,
  },
  insightCardsWrapCompact: {
    gap: 14,
  },
  insightCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(210,218,230,0.95)",
    overflow: "hidden",
    shadowColor: "#92A3BA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 3,
  },
  insightCardCompact: {
    borderRadius: 20,
  },
  insightCardGradient: {
    borderRadius: 17,
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: "relative",
  },
  insightCardGradientCompact: {
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  insightCardGloss: {
    position: "absolute",
    left: 8,
    right: 8,
    top: 6,
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  insightCardText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 17,
    color: Colors.charcoal,
    lineHeight: 25,
    flex: 1,
  },
  insightCardTextCompact: {
    fontSize: 16,
    lineHeight: 24,
  },
  weekPlanCardsWrap: {
    gap: 14,
    marginTop: 10,
  },
  weekPlanCardsWrapCompact: {
    gap: 16,
  },
  weekPlanRailWrap: {
    marginTop: 18,
    minHeight: 364,
    justifyContent: "center",
    alignItems: "stretch",
    position: "relative",
  },
  weekPlanRailSlotAbsolute: {
    width: "100%",
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    marginTop: -66,
  },
  weekPlanCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(207,217,232,0.95)",
    overflow: "hidden",
    shadowColor: "#8EA2BD",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 11,
    elevation: 4,
  },
  weekPlanCardCenter: {
    shadowOpacity: 0.2,
    shadowRadius: 13,
    elevation: 5,
  },
  weekPlanCardCompact: {
    borderRadius: 22,
  },
  weekPlanCardGradient: {
    borderRadius: 19,
    paddingHorizontal: 17,
    paddingVertical: 16,
    position: "relative",
    minHeight: 128,
    justifyContent: "center",
  },
  weekPlanCardGradientCenter: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    minHeight: 144,
  },
  weekPlanCardGradientCompact: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  weekPlanBlurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  weekPlanBlurVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  weekPlanCardGloss: {
    position: "absolute",
    left: 8,
    right: 8,
    top: 6,
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.56)",
  },
  weekPlanDescription: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 17,
    lineHeight: 26,
    color: Colors.charcoal,
  },
  weekPlanDescriptionCenter: {
    fontSize: 18,
    lineHeight: 28,
  },
  weekPlanDescriptionBlurred: {
    color: "#6C7484",
    opacity: 0.42,
  },
  weekPlanDescriptionCompact: {
    fontSize: 16,
    lineHeight: 25,
  },
  expandableCardPressable: {
    width: "100%",
  },
  expandableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  expandableDetailText: {
    marginTop: 8,
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#5B677A",
  },
  expandableDetailTextCompact: {
    fontSize: 15,
    lineHeight: 22,
  },
  weekPlanCategory: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: "#5B677A",
    marginBottom: 8,
    paddingTop: 1,
  },
  weekPlanCategoryCenter: {
    fontSize: 13,
    lineHeight: 19,
  },
  weekPlanCategoryBlurred: {
    opacity: 0.46,
  },
  comingSoonText: {
    marginTop: 14,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
    color: Colors.muted,
    lineHeight: 22,
    width: "100%",
    textAlign: "center",
    alignSelf: "stretch",
  },
  insightIntroSub: {
    fontFamily: "Nunito_500Medium",
    fontSize: 16,
    color: Colors.muted,
    lineHeight: 23,
    marginBottom: 4,
  },
  insightIntroSubCompact: {
    fontSize: 15,
    lineHeight: 22,
  },
  insightChapterRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: 10,
  },
  insightChapterRowCompact: {
    flexDirection: "column",
    gap: 0,
  },
  insightChapterFeatureBox: {
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 28,
    overflow: "visible",
    borderWidth: 1,
    borderColor: "rgba(220,176,98,0.82)",
    shadowColor: "#C18745",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  insightChapterFeatureGradient: {
    position: "relative",
    overflow: "visible",
    borderRadius: 28,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  insightChapterPanelLeft: {
    flex: 1,
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "rgba(255,250,241,0.58)",
    overflow: "hidden",
  },
  insightChapterCard: {
    marginBottom: 12,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(228,196,158,0.65)",
    shadowColor: "#C58D53",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  insightChapterCardHalf: {
    flex: 1,
    marginBottom: 0,
  },
  insightChapterGradient: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: "relative",
    overflow: "hidden",
  },
  insightChapterBeam: {
    position: "absolute",
    top: -14,
    bottom: -14,
    width: 86,
    borderRadius: 80,
    backgroundColor: "rgba(255,226,176,0.78)",
  },
  insightChapterLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    letterSpacing: 0.45,
    textTransform: "uppercase",
    color: "#8A5A35",
    marginBottom: 4,
  },
  insightChapterHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 2,
  },
  insightChapterArrowBtn: {
    position: "absolute",
    right: -20,
    top: "50%",
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(72,89,119,0.28)",
    backgroundColor: "rgba(255,255,255,0.72)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
    elevation: 12,
    transform: [{ translateY: -14 }],
  },
  insightChapterTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 21,
    lineHeight: 28,
    color: Colors.charcoal,
  },
  insightChapterTrack: {
    marginTop: 10,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(222,161,104,0.34)",
    overflow: "hidden",
  },
  insightChapterFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#E4862F",
  },
  insightChapterFillNext: {
    backgroundColor: "#4B8DE8",
  },
  insightChapterMeta: {
    marginTop: 8,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(73,52,33,0.78)",
  },
  insightChapterOneLiner: {
    marginTop: 8,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    lineHeight: 23,
    color: "rgba(53,44,34,0.86)",
  },
  insightChapterWeekImageWrap: {
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(214,220,232,0.8)",
    minHeight: 150,
    shadowColor: "#8EA0BA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 11,
    elevation: 3,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  insightChapterWeekImageHalf: {
    flex: 1,
    marginTop: 0,
    minHeight: 0,
  },
  insightChapterWeekImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    alignSelf: "stretch",
    zIndex: 2,
    transform: [{ scale: 1.06 }],
  },
  insightChapterWeekImageBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    opacity: 0.82,
    transform: [{ scale: 1.08 }],
  },
  insightChapterWeekImageReflectTop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    height: "42%",
    opacity: 0.32,
    transform: [{ scaleY: -1 }, { scale: 1.06 }],
  },
  insightChapterWeekImageReflectBottom: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    top: "58%",
    opacity: 0.28,
    transform: [{ scale: 1.06 }],
  },
  insightBottomLineText: {
    marginTop: 14,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
    color: Colors.muted,
    lineHeight: 22,
    textAlign: "center",
    alignSelf: "center",
  },
  insightBottomLineTextCompact: {
    fontSize: 16,
    lineHeight: 24,
  },
  weekPlanBottomLineText: {
    marginTop: 8,
    marginBottom: 10,
    alignSelf: "center",
    textAlign: "center",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
    color: Colors.muted,
    lineHeight: 22,
  },
  weekPlanBottomLineTextCompact: {
    fontSize: 16,
    lineHeight: 23,
  },
  understoodGridWrap: {
    flexDirection: "column",
    alignItems: "stretch",
    marginTop: 8,
  },
  understoodGridRow: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  understoodGridRowStack: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  understoodRowCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(210,218,230,0.95)",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#92A3BA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 9,
    elevation: 2,
  },
  understoodRowCardHalf: {
    flex: 1,
  },
  understoodRowCardFull: {
    width: "100%",
    marginBottom: 10,
  },
  understoodRowCardLeft: {
    marginRight: 6,
  },
  understoodRowCardRight: {
    marginLeft: 6,
  },
  understoodRowContent: {
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  understoodRowTopLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.6,
    color: "#7B8898",
    marginBottom: 7,
  },
  understoodRowText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: Colors.charcoal,
    lineHeight: 24,
    flexShrink: 1,
  },
  understoodMainRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },
  understoodRowEmoji: {
    fontSize: 16,
    lineHeight: 20,
  },
  understoodFocusLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 110 + ONBOARDING_FOOTER_EXTRA_SPACE,
  },
  understoodFocusDismissZone: {
    ...StyleSheet.absoluteFillObject,
  },
  understoodFocusedCardWrap: {
    width: "100%",
    maxWidth: 360,
  },
  understoodFocusedCard: {
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  understoodFocusedCardContent: {
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  understoodFocusedEmoji: {
    fontSize: 22,
    lineHeight: 28,
  },
  understoodFocusedText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 22,
    color: Colors.charcoal,
    lineHeight: 30,
    flexShrink: 1,
  },
  continueFooterAboveOverlay: {
    zIndex: 20,
  },
  stageCompareWrap: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: 0,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(207,217,232,0.95)",
    overflow: "hidden",
    shadowColor: "#8EA2BD",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 3,
  },
  stageCompareWrapStack: {
    flexDirection: "column",
  },
  stageCompareColumn: {
    width: "50%",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  stageCompareLeftColumn: {
    width: "50%",
    backgroundColor: "#FFFFFF",
  },
  stageCompareColumnFull: {
    width: "100%",
  },
  stageCompareTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: Colors.charcoal,
    marginBottom: 10,
  },
  stageCompareSubCentered: {
    textAlign: "center",
  },
  stageCompareBullet: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
    lineHeight: 23,
    color: "#3F2A16",
    marginBottom: 6,
  },
  stageBottomLineText: {
    marginTop: 16,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
    color: Colors.muted,
    lineHeight: 22,
    textAlign: "center",
  },
  stageBottomLineTextCompact: {
    fontSize: 16,
    lineHeight: 24,
  },
  miaBubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: "#D8FAD2",
    borderRadius: 16,
    borderBottomRightRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "92%",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#BFE8B8",
  },
  miaBubbleUserText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    color: "#1F2D1D",
    lineHeight: 20,
  },
  miaTypingWrap: {
    alignSelf: "flex-start",
    marginTop: 10,
  },
  miaTypingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F4F6F8",
    borderWidth: 1,
    borderColor: "#E1E6EB",
    borderRadius: 14,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  miaTypingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#9AA6B2",
  },
  miaResponseWrap: {
    alignSelf: "flex-start",
    marginTop: 10,
    maxWidth: "94%",
  },
  miaStamp: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: "#607080",
    marginLeft: 2,
    marginBottom: 5,
    letterSpacing: 0.2,
  },
  miaBubbleAssistant: {
    alignSelf: "flex-start",
    backgroundColor: "#F4F6F8",
    borderWidth: 1,
    borderColor: "#E1E6EB",
    borderRadius: 16,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    maxWidth: "94%",
  },
  miaBubbleAssistantText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    color: Colors.charcoal,
    lineHeight: 21,
  },
  storyTeaserWrap: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  storyTeaserImage: {
    width: "100%",
    maxWidth: 360,
    aspectRatio: 1.2,
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: "#27313B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 5,
  },
  storyTeaserTop: {
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: Colors.charcoal,
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 14,
  },
  storyTeaserSnippet: {
    fontFamily: "Nunito_400Regular",
    fontSize: 20,
    color: Colors.muted,
    textAlign: "center",
    lineHeight: 31,
  },
  // Social proof screen
  socialRoot: {
    flex: 1,
    backgroundColor: "transparent",
  },
  socialContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  ratingCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 28,
    alignSelf: "center",
  },
  ratingTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  ratingNumber: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 36,
    color: Colors.charcoal,
    lineHeight: 44,
  },
  socialStarsRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 6,
  },
  appStoreLabel: {
    fontFamily: "Nunito_400Regular",
    fontSize: 11,
    color: Colors.muted,
  },
  socialHeading: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 28,
    color: Colors.charcoal,
    lineHeight: 36,
    marginBottom: 10,
  },
  socialSubtext: {
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    color: "rgba(44,28,12,0.65)",
    lineHeight: 23,
    marginBottom: 20,
  },
  joinText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 13,
    color: "rgba(44,28,12,0.55)",
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  joinAvatarStack: {
    height: 42,
    marginBottom: 8,
    alignSelf: "flex-start",
    width: 94,
    position: "relative",
  },
  joinAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.cream,
    position: "absolute",
    top: 0,
  },
  joinAvatarBack: {
    left: 0,
    zIndex: 1,
  },
  joinAvatarMiddle: {
    left: 27,
    zIndex: 2,
  },
  joinAvatarFront: {
    left: 54,
    zIndex: 3,
  },
  carouselWrapper: {
    marginHorizontal: -24,
    overflow: "hidden",
    marginBottom: 28,
  },
  carouselTrack: {
    flexDirection: "row",
    gap: REVIEW_CARD_GAP,
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
  reviewCardSmall: {
    width: REVIEW_CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
  },
  reviewName: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: Colors.charcoal,
  },
  reviewHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  reviewHeaderMeta: {
    flex: 1,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.divider,
  },
  reviewStarsRow: {
    flexDirection: "row",
    gap: 2,
    marginTop: 2,
  },
  reviewText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
    color: Colors.muted,
    lineHeight: 18,
  },
  socialButton: {
    backgroundColor: Colors.charcoal,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 4,
  },
  socialButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 17,
    color: Colors.white,
  },
});
