import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  ReactNode,
} from "react";
import { Alert, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";
import {
  cancelDailyReminderNotification,
  isNotificationPermissionGranted,
  markPushLastAppOpen,
  requestNotificationPermissionFromPrompt,
  syncDailyReminderNotification,
  wasNotificationsPaywallCompletedRecently,
} from "@/lib/notifications";

export interface CompletedActivity {
  activityId: string;
  date: string;
  category: "spark" | "move" | "play";
  completedAt?: string;
}

export interface WeekData {
  weekStart: string;
  spark: number;
  move: number;
  play: number;
}

export type TrackerLogType =
  | "feed"
  | "sleep"
  | "diaper"
  | "mood"
  | "bottle"
  | "water"
  | "solids"
  | "pumping"
  | "bath"
  | "stroll"
  | "temperature"
  | "medication"
  | "weight"
  | "length"
  | "head_circumference"
  | "doctor_visit"
  | "vaccination"
  | "important_event"
  | "note";
export type TrackerMoodState = "calm" | "happy" | "sleepy" | "fussy" | "upset";
export type TrackerDiaperKind = "wet" | "dirty" | "both";
export type TrackerLogPayload = {
  action?: "start" | "end" | "manual";
  kind?: TrackerDiaperKind;
  mood?: TrackerMoodState;
  note?: string;
  value?: number;
  subtype?: string;
  endedAt?: string;
};
export type PendingTrackerIntent = "feed" | "sleep";

export interface TrackerLog {
  local_id: string;
  id: string;
  user_id: string;
  baby_id: string;
  type: TrackerLogType;
  subtype: string | null;
  value: number | null;
  note: string | null;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
  synced: boolean;
}

export interface BabyData {
  name: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  gender: "girl" | "boy" | "unspecified";
  isPreemie: boolean;
  weeksEarly: number;
  reminderTime: string;
  notificationsEnabled: boolean;
  parentEmail: string;
  isSignedIn: boolean;
  partnerInviteCode: string;
  installDate: string;
  isPremium: boolean;
  trialStartDate: string;
  onboardingComplete: boolean;
  completedActivities: CompletedActivity[];
  swappedActivityIds: string[];
  swappedDate: string;
  streakDays: number;
  lastActiveDate: string;
  weeklyData: WeekData[];
  trackerLogs: TrackerLog[];
  pinnedOptionalLogs: TrackerLogType[];
  optionalLogsExpanded: boolean;
  quickLogDefaultsBand?: "under_6m" | "six_to_twelve_m" | "twelve_plus_m";
  quickLogSelectionSource?: "system" | "custom";
  liquidUnitPreference?: "ml" | "oz";
  trackerAvatarPath?: string;
  trackerAvatarUpdatedAt?: string;
  // Onboarding questionnaire answers
  parentType: string;
  emotionalState: string;
  categoryPreference: "think" | "move" | "bond" | "all";
  painPoint: string;
  // Device-local only — never synced to Supabase
  caregiverRole: "mom" | "dad" | "caregiver" | "grandparent" | "";
  profileUpdatedAt?: string;
  pendingProfileSyncAt?: string | null;
  reviewPromptedAfterTwoDone?: boolean;
}

interface BabyContextValue {
  baby: BabyData | null;
  isLoading: boolean;
  hasDeviceRole: boolean;
  saveBaby: (data: Partial<BabyData>) => Promise<void>;
  saveBabyProfileFromSettings: (data: Partial<BabyData>) => Promise<{ syncedToCloud: boolean }>;
  preserveBabyForSignOut: () => Promise<void>;
  clearBaby: () => Promise<void>;
  resetOnboardingProfile: () => Promise<{ error: string | null }>;
  completeActivity: (activityId: string, category: "spark" | "move" | "play") => Promise<void>;
  swapActivity: (activityId: string) => Promise<void>;
  getAgeInWeeks: () => number;
  getAgeDisplay: () => string;
  getDaysSinceInstall: () => number;
  getDailySeed: () => number;
  markPaywallSeen: () => Promise<void>;
  paywallSeen: boolean;
  getTodayCompletedIds: () => string[];
  getWeeklyData: () => WeekData[];
  isStreakAtRisk: () => boolean;
  syncFromCloud: () => Promise<void>;
  setLocalSignInState: (data: { isSignedIn: boolean; onboardingComplete?: boolean; isPremium?: boolean }) => Promise<void>;
  getTrackerLogs: () => TrackerLog[];
  getTodayTrackerLogs: () => TrackerLog[];
  addTrackerLog: (
    type: TrackerLogType,
    payload: TrackerLogPayload,
    timestamp?: string
  ) => Promise<TrackerLog>;
  updateTrackerLog: (
    id: string,
    updates: Partial<Pick<TrackerLog, "subtype" | "value" | "note" | "started_at" | "ended_at">>
  ) => Promise<void>;
  deleteTrackerLog: (id: string) => Promise<void>;
  setPendingTrackerIntent: (intent: PendingTrackerIntent | null) => void;
  consumePendingTrackerIntent: () => PendingTrackerIntent | null;
}

const BabyContext = createContext<BabyContextValue | null>(null);

const LEGACY_STORAGE_KEY = "@todayler_baby";
const GUEST_STORAGE_KEY = "@todayler_baby_guest";
const USER_STORAGE_KEY_PREFIX = "@todayler_baby_user_";
const PAYWALL_KEY = "@todayler_paywall_seen";
const LEGACY_CAREGIVER_KEY = "@todayler_caregiver_role";
const GUEST_CAREGIVER_KEY = "@todayler_caregiver_role_guest";
const USER_CAREGIVER_KEY_PREFIX = "@todayler_caregiver_role_user_";
const USER_PENDING_PROFILE_SYNC_KEY_PREFIX = "@todayler_pending_profile_sync_user_";
const USER_PENDING_PROFILE_PAYLOAD_KEY_PREFIX = "@todayler_pending_profile_payload_user_";
const USER_NOTIFICATION_PROMPT_STATE_KEY_PREFIX = "@todayler_notifications_soft_prompt_state_user_";
const TRACKER_LOGS_KEY_PREFIX = "@todayler_tracker_logs_user_";
const TRACKER_LOGS_GUEST_KEY = "@todayler_tracker_logs_guest";
const TRACKER_DELETES_KEY_PREFIX = "@todayler_tracker_deletes_user_";
const NOTIFICATION_PROMPT_RESHOW_DAYS = 10;
const NOTIFICATION_PROMPT_MAX_SHOWS = 4;
const TRACKER_ACTIVE_AUTO_END_MS = 5 * 60 * 60 * 1000;

function babyStartupLog(step: string, payload?: unknown) {
  try {
    if (payload !== undefined) {
      console.log(`[startup][baby] ${step}`, payload);
      return;
    }
    console.log(`[startup][baby] ${step}`);
  } catch {
    // no-op
  }
}

function safeParseJson<T>(raw: string | null, context: string): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    babyStartupLog(`json_parse_failed_${context}`, error);
    return null;
  }
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
    code === "refresh_token_not_found"
  );
}

function inferCaregiverRole(
  parentType?: string | null
): BabyData["caregiverRole"] {
  const normalized = (parentType ?? "").trim().toLowerCase();
  if (normalized === "mum" || normalized === "mom") return "mom";
  if (normalized === "dad") return "dad";
  return "caregiver";
}

function hasHydratedProfileIdentity(data: BabyData): boolean {
  const hasName = data.name.trim().length > 0;
  const hasValidBirthYear = Number.isFinite(data.birthYear) && data.birthYear >= 1900;
  const hasValidBirthMonth = Number.isFinite(data.birthMonth) && data.birthMonth >= 0 && data.birthMonth <= 11;
  const hasValidBirthDay = Number.isFinite(data.birthDay) && data.birthDay >= 1 && data.birthDay <= 31;
  return hasName && hasValidBirthYear && hasValidBirthMonth && hasValidBirthDay;
}

function getBabyStorageKeyForUser(userId: string | null): string {
  return userId ? `${USER_STORAGE_KEY_PREFIX}${userId}` : GUEST_STORAGE_KEY;
}

function getCaregiverStorageKeyForUser(userId: string | null): string {
  return userId ? `${USER_CAREGIVER_KEY_PREFIX}${userId}` : GUEST_CAREGIVER_KEY;
}

function getPendingProfileSyncKeyForUser(userId: string | null): string | null {
  if (!userId) return null;
  return `${USER_PENDING_PROFILE_SYNC_KEY_PREFIX}${userId}`;
}

function getPendingProfilePayloadKeyForUser(userId: string | null): string | null {
  if (!userId) return null;
  return `${USER_PENDING_PROFILE_PAYLOAD_KEY_PREFIX}${userId}`;
}

function getNotificationPromptStateKeyForUser(userId: string): string {
  return `${USER_NOTIFICATION_PROMPT_STATE_KEY_PREFIX}${userId}`;
}

function getTrackerLogsKeyForUser(userId: string | null): string {
  return userId ? `${TRACKER_LOGS_KEY_PREFIX}${userId}` : TRACKER_LOGS_GUEST_KEY;
}

function getTrackerDeletesKeyForUser(userId: string | null): string | null {
  return userId ? `${TRACKER_DELETES_KEY_PREFIX}${userId}` : null;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function validateBirthDateNotInFuture(year: number, month: number, day: number) {
  const selected = new Date(year, month, day, 12, 0, 0, 0);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);
  if (selected.getTime() > today.getTime()) {
    throw new Error("Birth date can't be later than today.");
  }
}

function getDeviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

const defaultBaby: BabyData = {
  name: "",
  birthYear: new Date().getFullYear(),
  birthMonth: new Date().getMonth(),
  birthDay: new Date().getDate(),
  gender: "unspecified",
  isPreemie: false,
  weeksEarly: 0,
  reminderTime: "09:00",
  notificationsEnabled: true,
  parentEmail: "",
  isSignedIn: false,
  partnerInviteCode: "",
  installDate: new Date().toISOString(),
  isPremium: false,
  trialStartDate: new Date().toISOString(),
  onboardingComplete: false,
  completedActivities: [],
  swappedActivityIds: [],
  swappedDate: "",
  streakDays: 0,
  lastActiveDate: "",
  weeklyData: [],
  trackerLogs: [],
  pinnedOptionalLogs: [],
  optionalLogsExpanded: false,
  quickLogDefaultsBand: "under_6m",
  quickLogSelectionSource: "system",
  liquidUnitPreference: "ml",
  parentType: "",
  emotionalState: "",
  categoryPreference: "all",
  painPoint: "",
  caregiverRole: "",
  reviewPromptedAfterTwoDone: false,
};

const PROFILE_FIELD_KEYS: Array<keyof BabyData> = [
  "name",
  "birthYear",
  "birthMonth",
  "birthDay",
  "gender",
  "isPreemie",
  "weeksEarly",
  "parentType",
  "emotionalState",
  "categoryPreference",
  "painPoint",
  "pinnedOptionalLogs",
  "optionalLogsExpanded",
  "quickLogDefaultsBand",
  "quickLogSelectionSource",
  "liquidUnitPreference",
  "trackerAvatarPath",
  "trackerAvatarUpdatedAt",
];

const LOCAL_ONLY_PATCH_KEYS: Array<keyof BabyData> = [
  "isSignedIn",
  "onboardingComplete",
  "isPremium",
  "parentEmail",
  "partnerInviteCode",
  "caregiverRole",
];

export function BabyProvider({ children }: { children: ReactNode }) {
  const [baby, setBaby] = useState<BabyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paywallSeen, setPaywallSeen] = useState(false);
  const [hasDeviceRole, setHasDeviceRole] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const babyRef = useRef<BabyData | null>(null);
  const lastKnownUserIdRef = useRef<string | null>(null);
  const notificationPromptVisibleRef = useRef(false);
  const trackerWriteQueueRef = useRef<Promise<void>>(Promise.resolve());
  const syncLogsInFlightRef = useRef(false);
  const pendingTrackerIntentRef = useRef<PendingTrackerIntent | null>(null);

  // Keep ref in sync so AppState handler always has the latest local data
  useEffect(() => {
    babyRef.current = baby;
  }, [baby]);

  useEffect(() => {
    loadBaby();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void (async () => {
          const userId = await getUserId();
          await markPushLastAppOpen();
          await retryPendingProfileSync(userId);
          await syncFromCloud();
          await enforceTrackerAutoCutoffs();
          await syncLogs();
          await markOpenForStreak();
        })();
      }
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    void markOpenForStreak();
  }, [isLoading, baby?.lastActiveDate]);

  useEffect(() => {
    if (!activeUserId) return;
    const timer = setInterval(() => {
      void enforceTrackerAutoCutoffs();
      void syncLogs();
    }, 3 * 60 * 1000);
    return () => clearInterval(timer);
  }, [activeUserId]);

  useEffect(() => {
    if (!activeUserId) return;

    const channel = supabase
      .channel(`profile-baby-data-${activeUserId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${activeUserId}`,
        },
        async (payload) => {
          const nextBabyData = (payload.new as { baby_data?: Record<string, any> })?.baby_data;
          if (!nextBabyData) return;
          const userId = await getUserId();
          const storageKey = getBabyStorageKeyForUser(userId);
          const caregiverKey = getCaregiverStorageKeyForUser(userId);
          const [savedRole, stored] = await Promise.all([
            AsyncStorage.getItem(caregiverKey),
            AsyncStorage.getItem(storageKey),
          ]);
          const parsedStored = safeParseJson<Partial<BabyData>>(stored, "realtime_storage");
          if (stored && !parsedStored) {
            await AsyncStorage.removeItem(storageKey);
          }
          const localForUser = parsedStored
            ? ({ ...defaultBaby, ...parsedStored } as BabyData)
            : babyRef.current;
          const merged = mergeBabyData(localForUser, nextBabyData);
          if (savedRole && savedRole.trim().length > 0) {
            merged.caregiverRole = savedRole as BabyData["caregiverRole"];
          }
          setBaby(merged);
          babyRef.current = merged;
          syncNotificationsForBaby(merged);
          await AsyncStorage.setItem(storageKey, JSON.stringify(merged));
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [activeUserId]);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  async function getUserId(): Promise<string | null> {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        if (isInvalidRefreshTokenError(sessionError)) {
          try {
            await supabase.auth.signOut({ scope: "local" });
          } catch {
            // no-op
          }
          lastKnownUserIdRef.current = null;
          setActiveUserId(null);
          return null;
        }
      } else if (sessionData.session?.user?.id) {
        const sessionUserId = sessionData.session.user.id;
        lastKnownUserIdRef.current = sessionUserId;
        setActiveUserId(sessionUserId);
        return sessionUserId;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        if (isInvalidRefreshTokenError(userError)) {
          try {
            await supabase.auth.signOut({ scope: "local" });
          } catch {
            // no-op
          }
          lastKnownUserIdRef.current = null;
          setActiveUserId(null);
          return null;
        }
        return lastKnownUserIdRef.current;
      }

      const userId = userData?.user?.id ?? lastKnownUserIdRef.current;
      if (userId) {
        lastKnownUserIdRef.current = userId;
        setActiveUserId(userId);
      }
      return userId;
    } catch {
      return lastKnownUserIdRef.current;
    }
  }

  /** Push baby data to Supabase, stripping device-local-only and tracker fields. */
  async function pushToSupabase(userId: string, babyData: BabyData): Promise<boolean> {
    try {
      if (babyData.onboardingComplete && !hasHydratedProfileIdentity(babyData)) {
        if (__DEV__) {
          babyStartupLog("push_blocked_unhydrated_profile", {
            userId,
            hasName: babyData.name.trim().length > 0,
            birthYear: babyData.birthYear,
            birthMonth: babyData.birthMonth,
            birthDay: babyData.birthDay,
          });
        }
        return false;
      }
      const { caregiverRole, trackerLogs, ...dataToSync } = babyData;
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, baby_data: dataToSync }, { onConflict: "id" });
      return !error;
    } catch {
      return false;
    }
  }

  function parseTimestamp(value: unknown): number {
    if (typeof value !== "string" || !value) return 0;
    const ts = Date.parse(value);
    return Number.isFinite(ts) ? ts : 0;
  }

  function createUuid(): string {
    const withCrypto = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
    if (withCrypto?.randomUUID) return withCrypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function normalizeTrackerLog(raw: Partial<TrackerLog>): TrackerLog | null {
    if (!raw || typeof raw !== "object") return null;
    const id = typeof raw.id === "string" && raw.id.trim() ? raw.id : createUuid();
    const startedAt = typeof raw.started_at === "string" && raw.started_at ? raw.started_at : null;
    if (!startedAt) return null;

    const type = raw.type;
    if (
      type !== "feed" &&
      type !== "sleep" &&
      type !== "diaper" &&
      type !== "mood" &&
      type !== "bottle" &&
      type !== "water" &&
      type !== "solids" &&
      type !== "pumping" &&
      type !== "bath" &&
      type !== "stroll" &&
      type !== "temperature" &&
      type !== "medication" &&
      type !== "weight" &&
      type !== "length" &&
      type !== "head_circumference" &&
      type !== "doctor_visit" &&
      type !== "vaccination" &&
      type !== "important_event" &&
      type !== "note"
    ) {
      return null;
    }

    return {
      local_id:
        typeof raw.local_id === "string" && raw.local_id.trim() ? raw.local_id : id,
      id,
      user_id: typeof raw.user_id === "string" ? raw.user_id : "",
      baby_id: typeof raw.baby_id === "string" ? raw.baby_id : "",
      type,
      subtype: typeof raw.subtype === "string" ? raw.subtype : null,
      value: typeof raw.value === "number" && Number.isFinite(raw.value) ? raw.value : null,
      note: typeof raw.note === "string" ? raw.note : null,
      started_at: startedAt,
      ended_at: typeof raw.ended_at === "string" ? raw.ended_at : null,
      created_at: typeof raw.created_at === "string" && raw.created_at ? raw.created_at : startedAt,
      updated_at: typeof raw.updated_at === "string" && raw.updated_at ? raw.updated_at : startedAt,
      synced: raw.synced === true,
    };
  }

  async function getLocalLogs(userId: string | null): Promise<TrackerLog[]> {
    await trackerWriteQueueRef.current;
    const key = getTrackerLogsKeyForUser(userId);
    const raw = await AsyncStorage.getItem(key);
    const parsed = safeParseJson<Partial<TrackerLog>[]>(raw, "tracker_local_logs");
    if (!parsed || !Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => normalizeTrackerLog(entry))
      .filter((entry): entry is TrackerLog => Boolean(entry))
      .sort((a, b) => parseTimestamp(b.started_at) - parseTimestamp(a.started_at));
  }

  async function writeLocalLogs(userId: string | null, logs: TrackerLog[]): Promise<void> {
    trackerWriteQueueRef.current = trackerWriteQueueRef.current
      .catch(() => {})
      .then(async () => {
        const key = getTrackerLogsKeyForUser(userId);
        await AsyncStorage.setItem(key, JSON.stringify(logs));
      });
    await trackerWriteQueueRef.current;
  }

  async function addLocalLog(userId: string | null, log: TrackerLog): Promise<TrackerLog[]> {
    const current = await getLocalLogs(userId);
    const next = [log, ...current];
    await writeLocalLogs(userId, next);
    return next;
  }

  async function updateLocalLog(userId: string | null, log: TrackerLog): Promise<TrackerLog[]> {
    const current = await getLocalLogs(userId);
    const next = current.map((entry) => (entry.id === log.id ? log : entry));
    await writeLocalLogs(userId, next);
    return next;
  }

  async function queueDeletedLog(userId: string | null, id: string): Promise<void> {
    const deleteKey = getTrackerDeletesKeyForUser(userId);
    if (!deleteKey) return;
    const raw = await AsyncStorage.getItem(deleteKey);
    const parsed = safeParseJson<string[]>(raw, "tracker_delete_queue") ?? [];
    if (parsed.includes(id)) return;
    await AsyncStorage.setItem(deleteKey, JSON.stringify([...parsed, id]));
  }

  async function deleteLocalLog(userId: string | null, id: string): Promise<TrackerLog[]> {
    const current = await getLocalLogs(userId);
    const next = current.filter((entry) => entry.id !== id);
    await writeLocalLogs(userId, next);
    await queueDeletedLog(userId, id);
    return next;
  }

  async function popDeleteQueue(userId: string): Promise<string[]> {
    const deleteKey = getTrackerDeletesKeyForUser(userId);
    if (!deleteKey) return [];
    const raw = await AsyncStorage.getItem(deleteKey);
    const parsed = safeParseJson<string[]>(raw, "tracker_delete_queue_read");
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string" && id.length > 0) : [];
  }

  async function writeDeleteQueue(userId: string, ids: string[]): Promise<void> {
    trackerWriteQueueRef.current = trackerWriteQueueRef.current
      .catch(() => {})
      .then(async () => {
        const deleteKey = getTrackerDeletesKeyForUser(userId);
        if (!deleteKey) return;
        if (ids.length === 0) {
          await AsyncStorage.removeItem(deleteKey);
          return;
        }
        await AsyncStorage.setItem(deleteKey, JSON.stringify(ids));
      });
    await trackerWriteQueueRef.current;
  }

  function setTrackerState(nextLogs: TrackerLog[]) {
    setBaby((prev) => {
      const base = prev ?? defaultBaby;
      const updated: BabyData = { ...base, trackerLogs: nextLogs };
      babyRef.current = updated;
      return updated;
    });
  }

  function mergeTrackerLogs(
    localLogs: TrackerLog[] | undefined,
    remoteLogs: TrackerLog[] | undefined
  ): TrackerLog[] {
    const map = new Map<string, TrackerLog>();
    const combined = [...(localLogs ?? []), ...(remoteLogs ?? [])];

    for (const entry of combined) {
      if (!entry?.id) continue;
      const existing = map.get(entry.id);
      if (!existing) {
        map.set(entry.id, entry);
        continue;
      }
      const existingTs = parseTimestamp(existing.updated_at);
      const nextTs = parseTimestamp(entry.updated_at);
      if (nextTs >= existingTs) {
        map.set(entry.id, entry);
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      const aTs = parseTimestamp(a.started_at);
      const bTs = parseTimestamp(b.started_at);
      return bTs - aTs;
    });
  }

  function isProfilePatch(data: Partial<BabyData>): boolean {
    return PROFILE_FIELD_KEYS.some((key) => key in data);
  }

  function isLocalOnlyPatch(data: Partial<BabyData>): boolean {
    const keys = Object.keys(data) as Array<keyof BabyData>;
    if (keys.length === 0) return false;
    return keys.every((key) => LOCAL_ONLY_PATCH_KEYS.includes(key));
  }

  async function setPendingProfileSync(userId: string | null, payload: BabyData | null): Promise<void> {
    const pendingKey = getPendingProfileSyncKeyForUser(userId);
    const payloadKey = getPendingProfilePayloadKeyForUser(userId);
    if (!pendingKey || !payloadKey || !payload) return;
    await AsyncStorage.multiSet([
      [pendingKey, "true"],
      [payloadKey, JSON.stringify(payload)],
    ]);
  }

  async function clearPendingProfileSync(userId: string | null): Promise<void> {
    const pendingKey = getPendingProfileSyncKeyForUser(userId);
    const payloadKey = getPendingProfilePayloadKeyForUser(userId);
    if (!pendingKey || !payloadKey) return;
    await AsyncStorage.multiRemove([pendingKey, payloadKey]);
  }

  async function retryPendingProfileSync(userId: string | null): Promise<void> {
    const pendingKey = getPendingProfileSyncKeyForUser(userId);
    const payloadKey = getPendingProfilePayloadKeyForUser(userId);
    if (!userId || !pendingKey || !payloadKey) return;

    const [pendingFlag, payloadRaw] = await Promise.all([
      AsyncStorage.getItem(pendingKey),
      AsyncStorage.getItem(payloadKey),
    ]);
    if (pendingFlag !== "true" || !payloadRaw) return;

    const parsedPayload = safeParseJson<Partial<BabyData>>(payloadRaw, "pending_profile_payload");
    if (!parsedPayload) {
      await clearPendingProfileSync(userId);
      return;
    }

    const payload = { ...defaultBaby, ...parsedPayload } as BabyData;
    const pushed = await pushToSupabase(userId, payload);
    if (pushed) {
      await clearPendingProfileSync(userId);
    }
  }

  async function syncLogs(): Promise<void> {
    if (syncLogsInFlightRef.current) return;
    syncLogsInFlightRef.current = true;
    try {
      const userId = await getUserId();
      if (!userId) return;

      const localLogs = await getLocalLogs(userId);
      const unsynced = localLogs.filter((log) => !log.synced && log.user_id === userId);

      if (unsynced.length > 0) {
        const payload = unsynced.map((log) => ({
          id: log.id,
          user_id: log.user_id,
          baby_id: log.baby_id,
          type: log.type,
          subtype: log.subtype,
          value: log.value,
          note: log.note,
          started_at: log.started_at,
          ended_at: log.ended_at,
          created_at: log.created_at,
          updated_at: log.updated_at,
        }));

        const { error } = await supabase.from("tracker_logs").upsert(payload, { onConflict: "id" });
        if (!error) {
          const syncedIds = new Set(unsynced.map((log) => log.id));
          const nextLocal = localLogs.map((log) =>
            syncedIds.has(log.id) ? { ...log, synced: true } : log
          );
          await writeLocalLogs(userId, nextLocal);
          setTrackerState(nextLocal);
        }
      }

      const deleteQueue = await popDeleteQueue(userId);
      if (deleteQueue.length > 0) {
        const { error } = await supabase.from("tracker_logs").delete().in("id", deleteQueue);
        if (!error) {
          await writeDeleteQueue(userId, []);
        }
      }
    } catch {
      // Offline or Supabase failure: keep unsynced and retry later.
    } finally {
      syncLogsInFlightRef.current = false;
    }
  }

  async function enforceTrackerAutoCutoffs(): Promise<void> {
    const current = babyRef.current;
    if (!current) return;

    const logs = current.trackerLogs ?? [];
    if (logs.length === 0) return;

    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();
    let didUpdate = false;

    const nextLogs = logs.map((log) => {
      if (log.ended_at) return log;

      const startedMs = parseTimestamp(log.started_at);
      if (!startedMs) return log;
      if (nowMs - startedMs < TRACKER_ACTIVE_AUTO_END_MS) return log;

      const cutoffIso = new Date(startedMs + TRACKER_ACTIVE_AUTO_END_MS).toISOString();

      if (log.type === "sleep" && (log.subtype ?? "start") === "start") {
        didUpdate = true;
        return {
          ...log,
          subtype: "end",
          ended_at: cutoffIso,
          updated_at: nowIso,
          synced: false,
        };
      }

      if (log.type === "feed") {
        didUpdate = true;
        return {
          ...log,
          ended_at: cutoffIso,
          updated_at: nowIso,
          synced: false,
        };
      }

      return log;
    });

    if (!didUpdate) return;

    setTrackerState(nextLogs);
    const userId = activeUserId ?? lastKnownUserIdRef.current ?? await getUserId();
    await writeLocalLogs(userId, nextLogs);
    const storageKey = getBabyStorageKeyForUser(userId);
    void AsyncStorage.setItem(storageKey, JSON.stringify({ ...current, trackerLogs: nextLogs }));
  }

  function syncNotificationsForBaby(nextBaby: BabyData | null) {
    if (!nextBaby || !nextBaby.onboardingComplete) {
      void cancelDailyReminderNotification();
      return;
    }

    void syncDailyReminderNotification({
      enabled: nextBaby.notificationsEnabled,
      reminderTime: nextBaby.reminderTime,
      babyName: nextBaby.name,
    });
  }

  async function maybePromptForNotificationPermission(nextBaby: BabyData): Promise<void> {
    if (notificationPromptVisibleRef.current) return;
    if (!nextBaby.onboardingComplete) return;

    const userId = await getUserId();
    if (!userId) return;

    const permissionGranted = await isNotificationPermissionGranted();
    if (permissionGranted) return;

    const completedPaywallRecently = await wasNotificationsPaywallCompletedRecently(userId);
    if (completedPaywallRecently) return;

    const promptStateKey = getNotificationPromptStateKeyForUser(userId);
    const promptStateRaw = await AsyncStorage.getItem(promptStateKey);
    const promptState = safeParseJson<{ shownCount?: number; lastPromptedAt?: string | null }>(
      promptStateRaw,
      "notification_soft_prompt_state"
    );

    const shownCount = Math.max(0, Number(promptState?.shownCount ?? 0));
    if (shownCount >= NOTIFICATION_PROMPT_MAX_SHOWS) return;

    const lastPromptedAt = typeof promptState?.lastPromptedAt === "string"
      ? promptState.lastPromptedAt
      : null;
    const lastPromptedTs = lastPromptedAt ? Date.parse(lastPromptedAt) : Number.NaN;
    const minElapsedMs = NOTIFICATION_PROMPT_RESHOW_DAYS * 24 * 60 * 60 * 1000;
    if (Number.isFinite(lastPromptedTs) && Date.now() - lastPromptedTs < minElapsedMs) {
      return;
    }

    await AsyncStorage.setItem(
      promptStateKey,
      JSON.stringify({
        shownCount: shownCount + 1,
        lastPromptedAt: new Date().toISOString(),
      })
    );

    notificationPromptVisibleRef.current = true;

    const babyName = nextBaby.name?.trim() || "your baby";
    const title = `Stay in sync with ${babyName}`;
    const body =
      "We'll gently remind you when today's activities are ready and what matters most at this stage.";

    const closePrompt = () => {
      notificationPromptVisibleRef.current = false;
    };

    const handleEnableReminders = () => {
      void (async () => {
        try {
          const granted = await requestNotificationPermissionFromPrompt();
          if (!granted) return;

          await syncDailyReminderNotification({
            enabled: nextBaby.notificationsEnabled,
            reminderTime: nextBaby.reminderTime,
            babyName: nextBaby.name,
          });
        } finally {
          closePrompt();
        }
      })();
    };

    Alert.alert(
      title,
      body,
      [
        { text: "Not now", style: "cancel", onPress: closePrompt },
        { text: "Turn on reminders", onPress: handleEnableReminders },
      ],
      { cancelable: true, onDismiss: closePrompt }
    );
  }

  /**
   * Merge local and remote baby data.
   * - completedActivities: union (never lose a completion)
   * - weeklyData: max per category per week
   * - streak: most-recently-active device wins
   * - caregiverRole: always comes from local (device-specific)
   */
  function mergeBabyData(local: BabyData | null, remote: Record<string, any>): BabyData {
    const base = local ?? defaultBaby;

    // Union completed activities by (activityId, date), preferring records with newer completedAt.
    const localActs: CompletedActivity[] = base.completedActivities ?? [];
    const remoteActs: CompletedActivity[] = remote.completedActivities ?? [];
    const actMap = new Map<string, CompletedActivity>();
    for (const a of [...localActs, ...remoteActs]) {
      const key = `${a.activityId}|${a.date}`;
      const existing = actMap.get(key);
      if (!existing) {
        actMap.set(key, a);
        continue;
      }

      const existingTs = existing.completedAt ? Date.parse(existing.completedAt) : Number.NaN;
      const nextTs = a.completedAt ? Date.parse(a.completedAt) : Number.NaN;

      if (Number.isFinite(nextTs) && Number.isFinite(existingTs)) {
        if (nextTs >= existingTs) actMap.set(key, a);
      } else if (Number.isFinite(nextTs) && !Number.isFinite(existingTs)) {
        actMap.set(key, a);
      } else if (!Number.isFinite(nextTs) && !Number.isFinite(existingTs)) {
        // Preserve last seen record when no timestamps exist.
        actMap.set(key, a);
      }
    }

    // Merge weekly data — max per category per week
    const localWeeks: WeekData[] = base.weeklyData ?? [];
    const remoteWeeks: WeekData[] = remote.weeklyData ?? [];
    const weekMap = new Map<string, WeekData>();
    for (const w of [...localWeeks, ...remoteWeeks]) {
      const ex = weekMap.get(w.weekStart);
      if (ex) {
        weekMap.set(w.weekStart, {
          weekStart: w.weekStart,
          spark: Math.max(ex.spark, w.spark),
          move: Math.max(ex.move, w.move),
          play: Math.max(ex.play, w.play),
        });
      } else {
        weekMap.set(w.weekStart, { ...w });
      }
    }

    // Streak: device with most-recent lastActiveDate wins
    const remoteLastActive: string = remote.lastActiveDate ?? "";
    const remoteStreak: number = remote.streakDays ?? 0;
    const streakDays =
      remoteLastActive > base.lastActiveDate
        ? remoteStreak
        : remoteLastActive === base.lastActiveDate
          ? Math.max(base.streakDays, remoteStreak)
          : base.streakDays;
    const lastActiveDate =
      remoteLastActive > base.lastActiveDate ? remoteLastActive : base.lastActiveDate;

    const merged: BabyData = {
      ...defaultBaby,
      ...base,
      ...(remote as Partial<BabyData>),
      completedActivities: Array.from(actMap.values()),
      weeklyData: Array.from(weekMap.values()),
      trackerLogs: mergeTrackerLogs(base.trackerLogs, remote.trackerLogs),
      streakDays,
      lastActiveDate,
      caregiverRole: base.caregiverRole, // always preserve local role
    };

    const localProfileTs = parseTimestamp(base.profileUpdatedAt);
    const remoteProfileTs = parseTimestamp((remote as any)?.profileUpdatedAt);
    const preferRemoteProfile =
      local === null || remoteProfileTs > localProfileTs || (remoteProfileTs === localProfileTs && remoteProfileTs > 0);
    for (const key of PROFILE_FIELD_KEYS) {
      const localValue = base[key];
      const remoteValue = (remote as Partial<BabyData>)[key];
      (merged as any)[key] = preferRemoteProfile
        ? (remoteValue ?? localValue)
        : (localValue ?? remoteValue);
    }
    merged.profileUpdatedAt = preferRemoteProfile
      ? ((remote as any)?.profileUpdatedAt ?? base.profileUpdatedAt ?? undefined)
      : (base.profileUpdatedAt ?? (remote as any)?.profileUpdatedAt ?? undefined);

    // Apply daily swap reset to merged result
    const today = toLocalDateKey(new Date());
    if (merged.swappedDate !== today) {
      merged.swappedActivityIds = [];
      merged.swappedDate = today;
    }

    return merged;
  }

  // ── Load (startup) ───────────────────────────────────────────────────────────

  async function loadBaby() {
    try {
      babyStartupLog("load_start");
      const userId = await getUserId();
      babyStartupLog("load_user_resolved", { userId });
      setActiveUserId(userId);
      if (userId) {
        void markPushLastAppOpen();
      }
      const storageKey = getBabyStorageKeyForUser(userId);
      const caregiverKey = getCaregiverStorageKeyForUser(userId);
      const localTrackerLogs = await getLocalLogs(userId);
      const [stored, legacyStored, pw, savedRole, legacySavedRole] = await Promise.all([
        AsyncStorage.getItem(storageKey),
        userId ? null : AsyncStorage.getItem(LEGACY_STORAGE_KEY),
        AsyncStorage.getItem(PAYWALL_KEY),
        AsyncStorage.getItem(caregiverKey),
        userId ? null : AsyncStorage.getItem(LEGACY_CAREGIVER_KEY),
      ]);

      const resolvedStored = stored ?? legacyStored;
      const normalizedSavedRole = savedRole ?? legacySavedRole ?? "";
      setPaywallSeen(pw === "true");
      const roleExists = normalizedSavedRole.trim().length > 0;
      setHasDeviceRole(roleExists);

      let localBaby: BabyData | null = null;
      if (resolvedStored) {
        const parsed = safeParseJson<Partial<BabyData>>(resolvedStored, "load_storage");
        if (parsed) {
          const today = toLocalDateKey(new Date());
          if (parsed.swappedDate !== today) {
            parsed.swappedActivityIds = [];
            parsed.swappedDate = today;
          }
          localBaby = {
            ...defaultBaby,
            ...parsed,
            trackerLogs:
              localTrackerLogs.length > 0
                ? localTrackerLogs
                : mergeTrackerLogs(parsed.trackerLogs as TrackerLog[] | undefined, []),
          };
          // Restore device-local role over whatever was stored
          if (roleExists && localBaby) {
            localBaby.caregiverRole = normalizedSavedRole as BabyData["caregiverRole"];
          }
        } else {
          await AsyncStorage.removeItem(storageKey);
          if (!stored && legacyStored) {
            await AsyncStorage.removeItem(LEGACY_STORAGE_KEY);
          }
        }
      }

      if (userId) {
        await retryPendingProfileSync(userId);
        const { data: profile } = await supabase
          .from("profiles")
          .select("baby_data")
          .eq("id", userId)
          .single();

        if (profile?.baby_data) {
          babyStartupLog("load_cloud_profile_found");
          const merged = mergeBabyData(localBaby, profile.baby_data);
          // Restore device-local caregiverRole after merge
          if (roleExists) {
            merged.caregiverRole = normalizedSavedRole as BabyData["caregiverRole"];
          } else {
            const fallback = inferCaregiverRole(merged.parentType);
            merged.caregiverRole = fallback;
            await AsyncStorage.setItem(caregiverKey, fallback);
            setHasDeviceRole(true);
          }
          if (localTrackerLogs.length > 0) {
            merged.trackerLogs = mergeTrackerLogs(localTrackerLogs, merged.trackerLogs);
          }
          setBaby(merged);
          babyRef.current = merged;
          syncNotificationsForBaby(merged);
          await AsyncStorage.setItem(storageKey, JSON.stringify(merged));
        } else if (localBaby) {
          babyStartupLog("load_local_profile_found");
          if (!roleExists) {
            if (localBaby) {
              const fallback = inferCaregiverRole(localBaby.parentType);
              localBaby.caregiverRole = fallback;
              await AsyncStorage.setItem(caregiverKey, fallback);
              setHasDeviceRole(true);
            }
          }
          setBaby(localBaby);
          babyRef.current = localBaby;
          syncNotificationsForBaby(localBaby);
          await AsyncStorage.setItem(storageKey, JSON.stringify(localBaby));
        } else {
          babyStartupLog("load_no_profile_data");
          setBaby(null);
          syncNotificationsForBaby(null);
        }
        void syncLogs();
      } else {
        babyStartupLog("load_guest_mode");
        if (localBaby && !roleExists) {
          const fallback = inferCaregiverRole(localBaby.parentType);
          localBaby.caregiverRole = fallback;
          await AsyncStorage.setItem(caregiverKey, fallback);
          setHasDeviceRole(true);
        }
        setBaby(localBaby);
        babyRef.current = localBaby;
        syncNotificationsForBaby(localBaby);
        if (localBaby) {
          await AsyncStorage.setItem(storageKey, JSON.stringify(localBaby));
        }
      }
    } catch (e) {
      console.error("Failed to load baby data", e);
      babyStartupLog("load_failed", e);
    } finally {
      babyStartupLog("load_done");
      setIsLoading(false);
    }
  }

  // ── Foreground sync ──────────────────────────────────────────────────────────

  async function syncFromCloud(): Promise<void> {
    try {
      const userId = await getUserId();
      if (!userId) return;
      setActiveUserId(userId);
      await retryPendingProfileSync(userId);
      const storageKey = getBabyStorageKeyForUser(userId);
      const caregiverKey = getCaregiverStorageKeyForUser(userId);

      const { data: profile } = await supabase
        .from("profiles")
        .select("baby_data")
        .eq("id", userId)
        .single();

      if (!profile?.baby_data) return;

      const [savedRole, stored] = await Promise.all([
        AsyncStorage.getItem(caregiverKey),
        AsyncStorage.getItem(storageKey),
      ]);
      const parsedStored = safeParseJson<Partial<BabyData>>(stored, "sync_storage");
      if (stored && !parsedStored) {
        await AsyncStorage.removeItem(storageKey);
      }
      const localForUser = parsedStored ? ({ ...defaultBaby, ...parsedStored } as BabyData) : null;
      const roleExists = !!savedRole && savedRole.trim().length > 0;
      const merged = mergeBabyData(localForUser, profile.baby_data);
      if (roleExists) {
        merged.caregiverRole = savedRole as BabyData["caregiverRole"];
      } else {
        const fallback = inferCaregiverRole(merged.parentType);
        merged.caregiverRole = fallback;
        await AsyncStorage.setItem(caregiverKey, fallback);
        setHasDeviceRole(true);
      }

      setBaby(merged);
      babyRef.current = merged;
      syncNotificationsForBaby(merged);
      await AsyncStorage.setItem(storageKey, JSON.stringify(merged));
    } catch {
      // Silently fail — we have local data
    }
  }

  // ── Save ─────────────────────────────────────────────────────────────────────

  async function saveBaby(data: Partial<BabyData>) {
    const nowIso = new Date().toISOString();
    const shouldStampProfile = isProfilePatch(data);
    const updated: BabyData = {
      ...(baby ?? defaultBaby),
      ...data,
      ...(shouldStampProfile ? { profileUpdatedAt: nowIso } : {}),
      pendingProfileSyncAt: null,
    };

    const maxDay = getDaysInMonth(updated.birthYear, updated.birthMonth);
    if (updated.birthDay < 1 || updated.birthDay > maxDay) {
      throw new Error("Please choose a valid date of birth.");
    }
    validateBirthDateNotInFuture(updated.birthYear, updated.birthMonth, updated.birthDay);

    setBaby(updated);
    babyRef.current = updated;
    syncNotificationsForBaby(updated);
    const userId = await getUserId();
    setActiveUserId(userId);
    const storageKey = getBabyStorageKeyForUser(userId);
    const caregiverKey = getCaregiverStorageKeyForUser(userId);
    await AsyncStorage.setItem(storageKey, JSON.stringify(updated));

    // Keep caregiverRole in its own device-local key
    if ("caregiverRole" in data) {
      const role = data.caregiverRole ?? "";
      await AsyncStorage.setItem(caregiverKey, role);
      setHasDeviceRole(true);
    }

    const shouldPushCloud = userId && updated.onboardingComplete && !isLocalOnlyPatch(data);
    if (shouldPushCloud) {
      if (__DEV__) {
        babyStartupLog("save_push_to_cloud", {
          userId,
          keys: Object.keys(data),
          shouldStampProfile,
        });
      }
      const pushed = await pushToSupabase(userId, updated);
      if (pushed) {
        await clearPendingProfileSync(userId);
      } else {
        const pending = {
          ...updated,
          pendingProfileSyncAt: nowIso,
        };
        setBaby(pending);
        babyRef.current = pending;
        await AsyncStorage.setItem(storageKey, JSON.stringify(pending));
        await setPendingProfileSync(userId, pending);
      }
    }
  }

  async function setLocalSignInState(data: { isSignedIn: boolean; onboardingComplete?: boolean; isPremium?: boolean }) {
    const current = babyRef.current ?? defaultBaby;
    const updated: BabyData = {
      ...current,
      isSignedIn: data.isSignedIn,
      onboardingComplete: data.onboardingComplete ?? current.onboardingComplete,
      isPremium: data.isPremium ?? current.isPremium,
    };
    setBaby(updated);
    babyRef.current = updated;
    syncNotificationsForBaby(updated);
    const userId = await getUserId();
    setActiveUserId(userId);
    const storageKey = getBabyStorageKeyForUser(userId);
    await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
    if (__DEV__) {
      babyStartupLog("local_signin_state_updated", {
        userId,
        isSignedIn: updated.isSignedIn,
        onboardingComplete: updated.onboardingComplete,
        isPremium: updated.isPremium,
      });
    }
  }

  async function saveBabyProfileFromSettings(data: Partial<BabyData>): Promise<{ syncedToCloud: boolean }> {
    const current = baby ?? defaultBaby;
    const nowIso = new Date().toISOString();
    const updated: BabyData = {
      ...current,
      ...data,
      name: typeof data.name === "string" ? data.name.trim() : current.name,
      birthDay: typeof data.birthDay === "number" ? data.birthDay : current.birthDay,
      birthMonth: typeof data.birthMonth === "number" ? data.birthMonth : current.birthMonth,
      birthYear: typeof data.birthYear === "number" ? data.birthYear : current.birthYear,
      profileUpdatedAt: nowIso,
      pendingProfileSyncAt: null,
    };

    const requiresName = current.name.trim().length > 0 || typeof data.name === "string";
    if (requiresName && !updated.name.trim()) {
      throw new Error("Baby name can't be empty.");
    }

    const maxDay = getDaysInMonth(updated.birthYear, updated.birthMonth);
    if (updated.birthDay < 1 || updated.birthDay > maxDay) {
      throw new Error("Please choose a valid date of birth.");
    }
    validateBirthDateNotInFuture(updated.birthYear, updated.birthMonth, updated.birthDay);

    setBaby(updated);
    babyRef.current = updated;
    syncNotificationsForBaby(updated);
    const userId = await getUserId();
    setActiveUserId(userId);
    const storageKey = getBabyStorageKeyForUser(userId);
    const caregiverKey = getCaregiverStorageKeyForUser(userId);
    await AsyncStorage.setItem(storageKey, JSON.stringify(updated));

    if ("caregiverRole" in data) {
      const role = data.caregiverRole ?? "";
      await AsyncStorage.setItem(caregiverKey, role);
      setHasDeviceRole(true);
    }

    if (userId) {
      const pushed = await pushToSupabase(userId, updated);
      if (!pushed) {
        const pending = {
          ...updated,
          pendingProfileSyncAt: nowIso,
        };
        setBaby(pending);
        babyRef.current = pending;
        await AsyncStorage.setItem(storageKey, JSON.stringify(pending));
        await setPendingProfileSync(userId, pending);
        return { syncedToCloud: false };
      }
      await clearPendingProfileSync(userId);
      return { syncedToCloud: true };
    }
    return { syncedToCloud: false };
  }

  async function preserveBabyForSignOut() {
    const userId = await getUserId();
    const storageKey = getBabyStorageKeyForUser(userId);
    const caregiverKey = getCaregiverStorageKeyForUser(userId);
    const [stored, savedRole] = await Promise.all([
      AsyncStorage.getItem(storageKey),
      AsyncStorage.getItem(caregiverKey),
    ]);
    const parsedStored = safeParseJson<Partial<BabyData>>(stored, "signout_storage");
    const source = babyRef.current ?? (parsedStored ? ({ ...defaultBaby, ...parsedStored } as BabyData) : null);

    setActiveUserId(null);
    lastKnownUserIdRef.current = null;
    setPaywallSeen(false);
    await AsyncStorage.removeItem(PAYWALL_KEY);

    if (!source) {
      setBaby(null);
      babyRef.current = null;
      syncNotificationsForBaby(null);
      setHasDeviceRole(false);
      await AsyncStorage.multiRemove([GUEST_STORAGE_KEY, GUEST_CAREGIVER_KEY]);
      return;
    }

    const guestRole = (savedRole && savedRole.trim().length > 0)
      ? savedRole
      : source.caregiverRole || inferCaregiverRole(source.parentType);
    const guestBaby: BabyData = {
      ...defaultBaby,
      ...source,
      parentEmail: "",
      partnerInviteCode: "",
      isSignedIn: false,
      isPremium: false,
      onboardingComplete: false,
      caregiverRole: guestRole as BabyData["caregiverRole"],
      pendingProfileSyncAt: null,
    };

    setBaby(guestBaby);
    babyRef.current = guestBaby;
    syncNotificationsForBaby(guestBaby);
    setHasDeviceRole(guestRole.trim().length > 0);
    await AsyncStorage.multiSet([
      [GUEST_STORAGE_KEY, JSON.stringify(guestBaby)],
      [GUEST_CAREGIVER_KEY, guestRole],
      [getTrackerLogsKeyForUser(null), JSON.stringify(guestBaby.trackerLogs ?? [])],
    ]);
  }

  async function clearBaby() {
    const userId = await getUserId();
    const storageKey = getBabyStorageKeyForUser(userId);
    const caregiverKey = getCaregiverStorageKeyForUser(userId);
    const pendingKey = getPendingProfileSyncKeyForUser(userId);
    const pendingPayloadKey = getPendingProfilePayloadKeyForUser(userId);
    setBaby(null);
    babyRef.current = null;
    syncNotificationsForBaby(null);
    setActiveUserId(null);
    lastKnownUserIdRef.current = null;
    setHasDeviceRole(false);
    const keys = [
      storageKey,
      caregiverKey,
      GUEST_STORAGE_KEY,
      GUEST_CAREGIVER_KEY,
      getTrackerLogsKeyForUser(userId),
      getTrackerLogsKeyForUser(null),
    ];
    const trackerDeletesKey = getTrackerDeletesKeyForUser(userId);
    if (trackerDeletesKey) keys.push(trackerDeletesKey);
    if (pendingKey) keys.push(pendingKey);
    if (pendingPayloadKey) keys.push(pendingPayloadKey);
    await AsyncStorage.multiRemove(keys);
  }

  async function resetOnboardingProfile(): Promise<{ error: string | null }> {
    const userId = await getUserId();
    const storageKey = getBabyStorageKeyForUser(userId);
    const caregiverKey = getCaregiverStorageKeyForUser(userId);
    const pendingKey = getPendingProfileSyncKeyForUser(userId);
    const pendingPayloadKey = getPendingProfilePayloadKeyForUser(userId);

    const keys = [storageKey, caregiverKey, GUEST_STORAGE_KEY, GUEST_CAREGIVER_KEY];
    keys.push(getTrackerLogsKeyForUser(userId));
    keys.push(getTrackerLogsKeyForUser(null));
    const trackerDeletesKey = getTrackerDeletesKeyForUser(userId);
    if (trackerDeletesKey) keys.push(trackerDeletesKey);
    if (pendingKey) keys.push(pendingKey);
    if (pendingPayloadKey) keys.push(pendingPayloadKey);

    try {
      if (userId) {
        const { error } = await supabase
          .from("profiles")
          .upsert({ id: userId, baby_data: null }, { onConflict: "id" });
        if (error) {
          return { error: "Couldn't reset your profile right now. Please try again." };
        }
      }

      setBaby(null);
      babyRef.current = null;
      syncNotificationsForBaby(null);
      setHasDeviceRole(false);
      await AsyncStorage.multiRemove(keys);
      return { error: null };
    } catch {
      return { error: "Couldn't reset your profile right now. Please try again." };
    }
  }

  // ── Activity helpers ─────────────────────────────────────────────────────────

  async function markOpenForStreak() {
    const current = babyRef.current;
    if (!current) return;

    const today = toLocalDateKey(new Date());
    if (current.lastActiveDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = toLocalDateKey(yesterday);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const twoDaysAgoStr = toLocalDateKey(twoDaysAgo);

    let newStreak = current.streakDays;
    if (current.lastActiveDate === yesterdayStr || current.lastActiveDate === twoDaysAgoStr) {
      newStreak = Math.max(1, current.streakDays) + 1;
    } else {
      newStreak = 1;
    }

    const updated: BabyData = {
      ...current,
      streakDays: newStreak,
      lastActiveDate: today,
    };

    setBaby(updated);
    babyRef.current = updated;

    const userId = await getUserId();
    const storageKey = getBabyStorageKeyForUser(userId);
    await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
    if (userId && updated.onboardingComplete) {
      await pushToSupabase(userId, updated);
    }
  }

  async function completeActivity(activityId: string, category: "spark" | "move" | "play") {
    if (!baby) return;
    const today = toLocalDateKey(new Date());
    const alreadyDone = baby.completedActivities.some(
      (a) => a.activityId === activityId && a.date === today
    );
    if (alreadyDone) return;

    const newActivity: CompletedActivity = {
      activityId,
      date: today,
      category,
      completedAt: new Date().toISOString(),
    };
    const updatedActivities = [...baby.completedActivities, newActivity];
    const todayCompletedCount = updatedActivities.filter((a) => a.date === today).length;

    const weekStart = getWeekStart(today);
    const existingWeek = baby.weeklyData.find((w) => w.weekStart === weekStart);
    let updatedWeeklyData: WeekData[];
    if (existingWeek) {
      updatedWeeklyData = baby.weeklyData.map((w) =>
        w.weekStart === weekStart ? { ...w, [category]: w[category] + 1 } : w
      );
    } else {
      const newWeek: WeekData = { weekStart, spark: 0, move: 0, play: 0, [category]: 1 };
      updatedWeeklyData = [...baby.weeklyData, newWeek];
    }

    const nextBabySnapshot: BabyData = {
      ...baby,
      completedActivities: updatedActivities,
      weeklyData: updatedWeeklyData,
    };

    await saveBaby({
      completedActivities: updatedActivities,
      weeklyData: updatedWeeklyData,
    });

    if (todayCompletedCount === 3) {
      const timezone = getDeviceTimezone();
      void supabase.functions.invoke("notify-completion", {
        body: {
          localDate: today,
          timezone,
          completedCount: todayCompletedCount,
        },
      });
    }

    await maybePromptForNotificationPermission(nextBabySnapshot);
  }

  async function swapActivity(activityId: string) {
    if (!baby) return;
    const today = toLocalDateKey(new Date());
    const base = baby.swappedDate === today ? baby.swappedActivityIds : [];
    const updated = base.includes(activityId) ? base : [...base, activityId];
    await saveBaby({ swappedActivityIds: updated, swappedDate: today });
  }

  function getTrackerLogs(): TrackerLog[] {
    const logs = baby?.trackerLogs ?? [];
    return [...logs].sort((a, b) => parseTimestamp(b.started_at) - parseTimestamp(a.started_at));
  }

  function getTodayTrackerLogs(): TrackerLog[] {
    const today = toLocalDateKey(new Date());
    return getTrackerLogs().filter((log) => toLocalDateKey(new Date(log.started_at)) === today);
  }

  async function addTrackerLog(
    type: TrackerLogType,
    payload: TrackerLogPayload,
    timestamp?: string
  ): Promise<TrackerLog> {
    const current = babyRef.current ?? defaultBaby;
    const now = new Date().toISOString();
    let userId = activeUserId ?? lastKnownUserIdRef.current;
    if (!userId) {
      userId = await getUserId();
    }
    if (!userId) {
      throw new Error("Tracker logging requires an authenticated user.");
    }
    const id = createUuid();
    let endedAt: string | null = null;
    let subtype: string | null = null;

    if (type === "sleep") {
      const action = payload.action === "end" ? "end" : (payload.action === "manual" ? "end" : "start");
      subtype = action;
      endedAt = action === "end" ? (payload.endedAt ?? now) : null;
    } else if (type === "diaper") {
      subtype = payload.kind ?? "wet";
    } else if (type === "mood") {
      subtype = payload.mood ?? "calm";
    } else if (typeof payload.subtype === "string" && payload.subtype.trim()) {
      subtype = payload.subtype.trim();
    }

    const entry: TrackerLog = {
      local_id: id,
      id,
      user_id: userId,
      baby_id: userId,
      type,
      subtype,
      value: typeof payload.value === "number" ? payload.value : null,
      note: payload.note?.trim() || null,
      started_at: timestamp ?? now,
      ended_at: endedAt,
      created_at: now,
      updated_at: now,
      synced: false,
    };

    const logs = [entry, ...(current.trackerLogs ?? [])];
    setTrackerState(logs);
    void addLocalLog(userId, entry);
    const storageKey = getBabyStorageKeyForUser(userId);
    void AsyncStorage.setItem(storageKey, JSON.stringify({ ...current, trackerLogs: logs }));
    void syncLogs();
    return entry;
  }

  async function updateTrackerLog(
    id: string,
    updates: Partial<Pick<TrackerLog, "subtype" | "value" | "note" | "started_at" | "ended_at">>
  ): Promise<void> {
    const current = babyRef.current;
    if (!current) return;
    const now = new Date().toISOString();
    const nextLogs = (current.trackerLogs ?? []).map((log) => {
      if (log.id !== id) return log;
      return {
        ...log,
        subtype: updates.subtype ?? log.subtype,
        value: updates.value ?? log.value,
        note: updates.note ?? log.note,
        started_at: updates.started_at ?? log.started_at,
        ended_at: updates.ended_at ?? log.ended_at,
        updated_at: now,
        synced: false,
      };
    });
    setTrackerState(nextLogs);
    const updatedLog = nextLogs.find((log) => log.id === id);
    const userId = activeUserId ?? lastKnownUserIdRef.current ?? null;
    if (updatedLog) {
      void updateLocalLog(userId, updatedLog);
    }
    const storageKey = getBabyStorageKeyForUser(userId);
    void AsyncStorage.setItem(storageKey, JSON.stringify({ ...current, trackerLogs: nextLogs }));
    if (userId) {
      void syncLogs();
    }
  }

  async function deleteTrackerLog(id: string): Promise<void> {
    const current = babyRef.current;
    if (!current) return;
    const userId = activeUserId ?? lastKnownUserIdRef.current ?? null;
    const nextLogs = (current.trackerLogs ?? []).filter((log) => log.id !== id);
    setTrackerState(nextLogs);
    void deleteLocalLog(userId, id);
    const storageKey = getBabyStorageKeyForUser(userId);
    void AsyncStorage.setItem(storageKey, JSON.stringify({ ...current, trackerLogs: nextLogs }));
    if (userId) {
      void syncLogs();
    }
  }

  function setPendingTrackerIntent(intent: PendingTrackerIntent | null): void {
    pendingTrackerIntentRef.current = intent;
  }

  function consumePendingTrackerIntent(): PendingTrackerIntent | null {
    const intent = pendingTrackerIntentRef.current;
    pendingTrackerIntentRef.current = null;
    return intent;
  }

  // ── Computed helpers ─────────────────────────────────────────────────────────

  function getCorrectedAgeInDays(): number {
    if (!baby) return 0;
    const birthDate = new Date(baby.birthYear, baby.birthMonth, baby.birthDay);
    const now = new Date();
    const diffMs = now.getTime() - birthDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays - baby.weeksEarly * 7);
  }

  function getAgeInWeeks(): number {
    const correctedDays = getCorrectedAgeInDays();
    return Math.floor(correctedDays / 7);
  }

  function getAgeDisplay(): string {
    const correctedDays = getCorrectedAgeInDays();
    const weeks = getAgeInWeeks();
    if (weeks <= 12) {
      const remainingDays = correctedDays - weeks * 7;
      if (remainingDays <= 0) {
        return `${weeks} week${weeks !== 1 ? "s" : ""} old`;
      }
      return `${weeks} week${weeks !== 1 ? "s" : ""}, ${remainingDays} day${remainingDays !== 1 ? "s" : ""} old`;
    }
    const months = Math.floor(weeks / 4.33);
    const remainingWeeks = weeks - Math.round(months * 4.33);
    if (remainingWeeks <= 0) return `${months} month${months !== 1 ? "s" : ""} old`;
    return `${months} month${months !== 1 ? "s" : ""}, ${remainingWeeks} week${remainingWeeks !== 1 ? "s" : ""} old`;
  }

  function getDaysSinceInstall(): number {
    if (!baby) return 0;
    const install = new Date(baby.installDate);
    const now = new Date();
    return Math.floor((now.getTime() - install.getTime()) / (1000 * 60 * 60 * 24));
  }

  function getDailySeed(): number {
    const today = new Date();
    return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  }

  function getTodayCompletedIds(): string[] {
    if (!baby) return [];
    const today = toLocalDateKey(new Date());
    return baby.completedActivities
      .filter((a) => a.date === today)
      .map((a) => a.activityId);
  }

  function getWeeklyData(): WeekData[] {
    return baby?.weeklyData ?? [];
  }

  function isStreakAtRisk(): boolean {
    if (!baby || baby.streakDays === 0) return false;
    const today = toLocalDateKey(new Date());
    if (baby.lastActiveDate === today) return false;
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return baby.lastActiveDate === toLocalDateKey(twoDaysAgo);
  }

  async function markPaywallSeen() {
    setPaywallSeen(true);
    await AsyncStorage.setItem(PAYWALL_KEY, "true");
  }

  const value = useMemo(
    () => ({
      baby,
      isLoading,
      hasDeviceRole,
      saveBaby,
      saveBabyProfileFromSettings,
      preserveBabyForSignOut,
      clearBaby,
      resetOnboardingProfile,
      completeActivity,
      swapActivity,
      getAgeInWeeks,
      getAgeDisplay,
      getDaysSinceInstall,
      getDailySeed,
      markPaywallSeen,
      paywallSeen,
      getTodayCompletedIds,
      getWeeklyData,
      isStreakAtRisk,
      syncFromCloud,
      setLocalSignInState,
      getTrackerLogs,
      getTodayTrackerLogs,
      addTrackerLog,
      updateTrackerLog,
      deleteTrackerLog,
      setPendingTrackerIntent,
      consumePendingTrackerIntent,
    }),
    [baby, isLoading, paywallSeen, hasDeviceRole]
  );

  return <BabyContext.Provider value={value}>{children}</BabyContext.Provider>;
}

export function useBaby() {
  const ctx = useContext(BabyContext);
  if (!ctx) throw new Error("useBaby must be used within BabyProvider");
  return ctx;
}

function toLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getWeekStart(dateStr: string): string {
  const d = parseLocalDateKey(dateStr);
  const day = d.getDay();
  const mondayOffset = (day + 6) % 7; // Monday -> 0, Sunday -> 6
  d.setDate(d.getDate() - mondayOffset);
  return toLocalDateKey(d);
}

function parseLocalDateKey(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return new Date(dateStr);
  return new Date(y, m - 1, d);
}
