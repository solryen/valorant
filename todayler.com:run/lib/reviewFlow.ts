import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

type ReviewEventName =
  | "review_preprompt_shown"
  | "review_positive_selected"
  | "review_negative_selected"
  | "review_prompt_requested"
  | "feedback_redirect_opened";

type TriggerType = "primary" | "fallback";

type CompletedActivityLike = {
  date?: string;
};

type ReviewFlowState = {
  sessionCount: number;
  milestonePageViews: number;
  lastSessionAt: string | null;
  lastPrePromptDismissedAt: string | null;
  prePromptShownVersion: string | null;
  hasRatedOrReviewed: boolean;
  lastReviewPromptRequestedAt: string | null;
};

type EligibilityInput = {
  installDate: string | null | undefined;
  completedActivities: CompletedActivityLike[] | null | undefined;
  isOnboarding: boolean;
  isPaywall: boolean;
  isTaskInProgress: boolean;
};

type EligibilityResult = {
  shouldShow: boolean;
  trigger: TriggerType | null;
  reason: string;
};

const REVIEW_FLOW_STATE_KEY = "@todayler_review_flow_state_v1";
const REVIEW_FLOW_EVENTS_KEY = "@todayler_review_flow_events_v1";
const SESSION_GAP_MS = 20 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const VERSION = Constants.expoConfig?.version ?? "dev";

const defaultState: ReviewFlowState = {
  sessionCount: 0,
  milestonePageViews: 0,
  lastSessionAt: null,
  lastPrePromptDismissedAt: null,
  prePromptShownVersion: null,
  hasRatedOrReviewed: false,
  lastReviewPromptRequestedAt: null,
};

function safeParseState(raw: string | null): ReviewFlowState {
  if (!raw) return defaultState;
  try {
    const parsed = JSON.parse(raw) as Partial<ReviewFlowState>;
    return {
      sessionCount: Number.isFinite(Number(parsed.sessionCount)) ? Number(parsed.sessionCount) : 0,
      milestonePageViews: Number.isFinite(Number(parsed.milestonePageViews)) ? Number(parsed.milestonePageViews) : 0,
      lastSessionAt: typeof parsed.lastSessionAt === "string" ? parsed.lastSessionAt : null,
      lastPrePromptDismissedAt: typeof parsed.lastPrePromptDismissedAt === "string" ? parsed.lastPrePromptDismissedAt : null,
      prePromptShownVersion: typeof parsed.prePromptShownVersion === "string" ? parsed.prePromptShownVersion : null,
      hasRatedOrReviewed: Boolean(parsed.hasRatedOrReviewed),
      lastReviewPromptRequestedAt:
        typeof parsed.lastReviewPromptRequestedAt === "string" ? parsed.lastReviewPromptRequestedAt : null,
    };
  } catch {
    return defaultState;
  }
}

async function getState(): Promise<ReviewFlowState> {
  const raw = await AsyncStorage.getItem(REVIEW_FLOW_STATE_KEY);
  return safeParseState(raw);
}

async function saveState(next: ReviewFlowState): Promise<void> {
  await AsyncStorage.setItem(REVIEW_FLOW_STATE_KEY, JSON.stringify(next));
}

function parseTs(value: string | null | undefined): number {
  if (!value) return Number.NaN;
  const ts = Date.parse(value);
  return Number.isFinite(ts) ? ts : Number.NaN;
}

function countDaysMeetingThreshold(completed: CompletedActivityLike[] | null | undefined, threshold: number): number {
  if (!Array.isArray(completed) || completed.length === 0) return 0;
  const counts = new Map<string, number>();
  for (const item of completed) {
    const dateKey = typeof item?.date === "string" ? item.date : "";
    if (!dateKey) continue;
    counts.set(dateKey, (counts.get(dateKey) ?? 0) + 1);
  }
  let qualified = 0;
  counts.forEach((count) => {
    if (count >= threshold) qualified += 1;
  });
  return qualified;
}

export async function logReviewEvent(event: ReviewEventName, payload?: Record<string, unknown>): Promise<void> {
  try {
    const nowIso = new Date().toISOString();
    const line = { event, at: nowIso, appVersion: VERSION, ...payload };
    console.log("[review-flow]", line);
    const raw = await AsyncStorage.getItem(REVIEW_FLOW_EVENTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const next = Array.isArray(parsed) ? [...parsed, line].slice(-200) : [line];
    await AsyncStorage.setItem(REVIEW_FLOW_EVENTS_KEY, JSON.stringify(next));
  } catch {
    // no-op
  }
}

export async function recordAppSessionStart(): Promise<void> {
  const current = await getState();
  const now = Date.now();
  const lastSessionTs = parseTs(current.lastSessionAt);
  const shouldCount = !Number.isFinite(lastSessionTs) || now - lastSessionTs >= SESSION_GAP_MS;
  if (!shouldCount) return;
  await saveState({
    ...current,
    sessionCount: current.sessionCount + 1,
    lastSessionAt: new Date(now).toISOString(),
  });
}

export async function recordMilestonePageView(): Promise<void> {
  const current = await getState();
  await saveState({
    ...current,
    milestonePageViews: current.milestonePageViews + 1,
  });
}

export async function evaluateReviewPrePromptEligibility(input: EligibilityInput): Promise<EligibilityResult> {
  const state = await getState();

  if (input.isOnboarding) return { shouldShow: false, trigger: null, reason: "onboarding" };
  if (input.isPaywall) return { shouldShow: false, trigger: null, reason: "paywall" };
  if (input.isTaskInProgress) return { shouldShow: false, trigger: null, reason: "task_in_progress" };

  if (state.prePromptShownVersion === VERSION) {
    return { shouldShow: false, trigger: null, reason: "already_shown_this_version" };
  }

  if (state.hasRatedOrReviewed) {
    return { shouldShow: false, trigger: null, reason: "already_marked_rated" };
  }

  const now = Date.now();
  const lastAttemptTs = parseTs(state.lastReviewPromptRequestedAt);
  if (Number.isFinite(lastAttemptTs) && now - lastAttemptTs < 120 * DAY_MS) {
    return { shouldShow: false, trigger: null, reason: "recent_prompt_attempt" };
  }

  const lastDismissTs = parseTs(state.lastPrePromptDismissedAt);
  if (Number.isFinite(lastDismissTs) && now - lastDismissTs < 30 * DAY_MS) {
    return { shouldShow: false, trigger: null, reason: "dismissed_recently" };
  }

  const installTs = parseTs(input.installDate ?? null);
  const installAgeMs = Number.isFinite(installTs) ? now - installTs : 0;
  const totalCompleted = Array.isArray(input.completedActivities) ? input.completedActivities.length : 0;
  const daysWithTwoDone = countDaysMeetingThreshold(input.completedActivities, 2);

  const primary =
    daysWithTwoDone >= 2 &&
    state.sessionCount >= 2 &&
    installAgeMs >= DAY_MS;
  if (primary) {
    return { shouldShow: true, trigger: "primary", reason: "primary_eligible" };
  }

  const fallback =
    installAgeMs >= 7 * DAY_MS &&
    state.sessionCount >= 5 &&
    totalCompleted >= 1 &&
    state.milestonePageViews >= 1;
  if (fallback) {
    return { shouldShow: true, trigger: "fallback", reason: "fallback_eligible" };
  }

  return { shouldShow: false, trigger: null, reason: "criteria_not_met" };
}

export async function markReviewPrePromptShown(): Promise<void> {
  const state = await getState();
  await saveState({
    ...state,
    prePromptShownVersion: VERSION,
  });
}

export async function markReviewPrePromptDismissed(): Promise<void> {
  const state = await getState();
  await saveState({
    ...state,
    lastPrePromptDismissedAt: new Date().toISOString(),
  });
}

export async function markReviewPositiveSelected(): Promise<void> {
  const state = await getState();
  await saveState({
    ...state,
    hasRatedOrReviewed: true,
    lastReviewPromptRequestedAt: new Date().toISOString(),
  });
}
