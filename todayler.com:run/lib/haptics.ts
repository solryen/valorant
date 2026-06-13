import { Platform } from "react-native";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

const isIos = Platform.OS === "ios";
const HAPTICS_ENABLED_KEY = "@todayler_haptics_enabled";
let lastTapAtMs = 0;
let lastTypingPulseAtMs = 0;
const TAP_DEDUPE_MS = 45;
const TYPING_PULSE_MIN_INTERVAL_MS = 42;
let hapticsEnabled = true;
let hapticsLoaded = false;
let loadPromise: Promise<void> | null = null;

async function ensureHapticsPrefLoaded() {
  if (hapticsLoaded) return;
  if (!loadPromise) {
    loadPromise = (async () => {
      try {
        const raw = await AsyncStorage.getItem(HAPTICS_ENABLED_KEY);
        if (raw === "0") hapticsEnabled = false;
        if (raw === "1") hapticsEnabled = true;
      } catch {
        // keep default ON
      } finally {
        hapticsLoaded = true;
      }
    })();
  }
  await loadPromise;
}

async function runHaptic(action: () => Promise<void>) {
  if (!isIos) return;
  await ensureHapticsPrefLoaded();
  if (!hapticsEnabled) return;
  try {
    await action();
  } catch {
    // Ignore haptics errors so UI flow is never blocked.
  }
}

export async function hapticSelection() {
  const now = Date.now();
  if (now - lastTapAtMs < TAP_DEDUPE_MS) return;
  lastTapAtMs = now;
  await runHaptic(() => Haptics.selectionAsync());
}

export async function hapticDone() {
  await runHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

export async function hapticSuccess() {
  await runHaptic(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  );
}

export async function hapticReplyStart() {
  await runHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

export async function hapticOpen() {
  await hapticSelection();
}

export async function hapticClose() {
  await hapticSelection();
}

export async function hapticConfirm() {
  await hapticDone();
}

export async function hapticWarning() {
  await runHaptic(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
  );
}

export function triggerTypingHaptic() {
  if (!isIos) return;
  if (!hapticsEnabled) return;
  const now = Date.now();
  if (now - lastTypingPulseAtMs < TYPING_PULSE_MIN_INTERVAL_MS) return;
  lastTypingPulseAtMs = now;
  void runHaptic(() => Haptics.selectionAsync());
}

export async function getHapticsEnabled(): Promise<boolean> {
  await ensureHapticsPrefLoaded();
  return hapticsEnabled;
}

export async function setHapticsEnabled(enabled: boolean): Promise<void> {
  hapticsEnabled = enabled;
  hapticsLoaded = true;
  try {
    await AsyncStorage.setItem(HAPTICS_ENABLED_KEY, enabled ? "1" : "0");
  } catch {
    // best effort
  }
}
