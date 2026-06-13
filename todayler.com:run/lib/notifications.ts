import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";

const DAILY_REMINDER_ID = "todayler-daily-reminder";
const DEFAULT_REMINDER_TIME = "09:00";
const PAYWALL_COMPLETED_AT_KEY_PREFIX = "@todayler_notifications_paywall_completed_at_user_";
const DEFAULT_PAYWALL_COOLDOWN_MS = 24 * 60 * 60 * 1000;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function parseReminderTime(reminderTime?: string | null) {
  const raw = typeof reminderTime === "string" ? reminderTime : DEFAULT_REMINDER_TIME;
  const match = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return { hour: 9, minute: 0 };

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return { hour: 9, minute: 0 };
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return { hour: 9, minute: 0 };
  return { hour, minute };
}

function formatReminderTime(reminderTime?: string | null) {
  const { hour, minute } = parseReminderTime(reminderTime);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function getTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function getExpoProjectId() {
  return (
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId ??
    null
  );
}

async function ensureNotificationPermission() {
  if (Platform.OS === "web") return false;

  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted || existing.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });

  return (
    requested.granted ||
    requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

async function hasNotificationPermission() {
  if (Platform.OS === "web") return false;
  const existing = await Notifications.getPermissionsAsync();
  return (
    existing.granted ||
    existing.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

function getPaywallCompletedAtKey(userId: string) {
  return `${PAYWALL_COMPLETED_AT_KEY_PREFIX}${userId}`;
}

export async function requestNotificationPermissionFromPrompt() {
  return ensureNotificationPermission();
}

export async function isNotificationPermissionGranted() {
  return hasNotificationPermission();
}

export async function markNotificationsPaywallCompletedAt(userId: string | null) {
  if (!userId) return;
  await AsyncStorage.setItem(getPaywallCompletedAtKey(userId), new Date().toISOString());
}

export async function wasNotificationsPaywallCompletedRecently(
  userId: string | null,
  cooldownMs = DEFAULT_PAYWALL_COOLDOWN_MS
) {
  if (!userId) return false;
  const raw = await AsyncStorage.getItem(getPaywallCompletedAtKey(userId));
  if (!raw) return false;
  const ts = Date.parse(raw);
  if (!Number.isFinite(ts)) return false;
  return Date.now() - ts < cooldownMs;
}

export async function cancelDailyReminderNotification() {
  if (Platform.OS === "web") return;

  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
  } catch {
    // Already absent or unavailable in this runtime.
  }

  try {
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) return;

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: getExpoProjectId() ?? undefined,
    });

    await supabase
      .from("push_tokens")
      .delete()
      .eq("user_id", userId)
      .eq("expo_push_token", token.data);
  } catch {
    // Push token deletion is best-effort; never block sign-out/reset.
  }
}

export async function syncDailyReminderNotification({
  enabled,
  reminderTime,
  babyName,
}: {
  enabled: boolean;
  reminderTime?: string | null;
  babyName?: string | null;
}) {
  if (Platform.OS === "web") return;

  // Remove any local notification left over from older builds. Daily reminders
  // are remote push notifications now, sent by Supabase Edge Functions.
  await cancelDailyReminderNotification();
  if (!enabled) return;

  try {
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) return;

    const granted = await hasNotificationPermission();
    if (!granted) return;

    const projectId = getExpoProjectId();
    if (!projectId) {
      if (__DEV__) {
        console.debug("[notifications] Missing EAS project id; cannot register push token");
      }
      return;
    }

    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    const name = babyName?.trim();

    await supabase.from("push_tokens").upsert(
      {
        user_id: userId,
        expo_push_token: token.data,
        platform: Platform.OS,
        enabled: true,
        reminder_time: formatReminderTime(reminderTime),
        timezone: getTimezone(),
        baby_name: name && name.length > 0 ? name : null,
        last_app_open_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "expo_push_token" }
    );
  } catch (error) {
    if (__DEV__) {
      console.debug("[notifications] Failed to sync push registration", error);
    }
  }
}

export async function markPushLastAppOpen() {
  if (Platform.OS === "web") return;

  try {
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) return;

    await supabase
      .from("push_tokens")
      .update({
        last_app_open_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("enabled", true);
  } catch (error) {
    if (__DEV__) {
      console.debug("[notifications] Failed to mark last app open", error);
    }
  }
}
