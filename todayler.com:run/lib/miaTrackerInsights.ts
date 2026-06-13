import type { TrackerLog, TrackerLogType } from "@/contexts/BabyContext";
import type { AppLanguage } from "@/lib/appLanguage";
import { formatTrackerTimelinePrimary, formatTrackerTimelineSecondary } from "@/lib/trackerTimeline";

type LatestEvent = {
  startedAt: string;
  endedAt?: string | null;
  subtype?: string | null;
  value?: number | null;
};

type PatternTrend = "up" | "down" | "steady" | "insufficient";

export type MiaTrackerSnapshot = {
  generatedAt: string;
  windowDays: number;
  latest: Partial<Record<TrackerLogType, LatestEvent>>;
  todayCounts: Partial<Record<TrackerLogType, number>>;
  last7dCounts: Partial<Record<TrackerLogType, number>>;
  recentTimeline: string[];
};

export type MiaTrackerPatterns = {
  generatedAt: string;
  windowDays: number;
  insufficientData: boolean;
  sleep: {
    todayMinutes: number;
    avgDailyMinutes7d: number;
    recentDailyMinutes: number[];
    napCountTrend: PatternTrend;
    confidence: number;
    insufficientData: boolean;
  };
  feeding: {
    todayCount: number;
    avgDailyCount7d: number;
    avgSpacingMinutes7d: number | null;
    recentDailyCount: number[];
    countTrend: PatternTrend;
    confidence: number;
    insufficientData: boolean;
  };
  diaper: {
    todayCount: number;
    avgDailyCount7d: number;
    recentDailyCount: number[];
    countTrend: PatternTrend;
    confidence: number;
    insufficientData: boolean;
  };
  mood: {
    todayTopMood: string | null;
    distribution7d: Record<string, number>;
    confidence: number;
    insufficientData: boolean;
  };
  solids: {
    todayCount: number;
    avgDailyCount7d: number;
    uniqueFoods7d: number;
    recentFoods: string[];
    frequencyTrend: PatternTrend;
    confidence: number;
    insufficientData: boolean;
  };
};

export type MiaTrackerInsights = {
  trackerContext: {
    lastFeedAt?: string;
    sleepSummary?: string;
    moodPattern?: string;
    recentLogs?: string[];
  };
  trackerSnapshot: MiaTrackerSnapshot;
  trackerPatterns: MiaTrackerPatterns;
  signature: string;
};

function toLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function trendFromSeries(values: number[]): PatternTrend {
  if (values.length < 4) return "insufficient";
  const split = Math.floor(values.length / 2);
  const first = values.slice(0, split);
  const second = values.slice(split);
  const avg = (arr: number[]) => (arr.length ? arr.reduce((sum, n) => sum + n, 0) / arr.length : 0);
  const diff = avg(second) - avg(first);
  if (Math.abs(diff) < 0.15) return "steady";
  return diff > 0 ? "up" : "down";
}

function sleepDurationMinutes(log: TrackerLog): number {
  if (log.type !== "sleep" || !log.ended_at) return 0;
  const start = Date.parse(log.started_at);
  const end = Date.parse(log.ended_at);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.max(1, Math.round((end - start) / 60000));
}

function dayKeys(windowDays: number, today = new Date()): string[] {
  const out: string[] = [];
  for (let i = windowDays - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    out.push(toLocalDateKey(d));
  }
  return out;
}

function topMood(distribution: Record<string, number>): string | null {
  const entries = Object.entries(distribution);
  if (!entries.length) return null;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0]?.[0] ?? null;
}

function normalizeFood(value?: string | null): string | null {
  const cleaned = (value ?? "").trim();
  return cleaned.length ? cleaned.toLowerCase() : null;
}

export function buildMiaTrackerInsights(
  logs: TrackerLog[],
  language: AppLanguage,
  windowDays = 7,
  now = new Date()
): MiaTrackerInsights {
  const nowIso = now.toISOString();
  const days = dayKeys(windowDays, now);
  const daySet = new Set(days);
  const todayKey = days[days.length - 1];
  const inWindow = logs.filter((log) => daySet.has(toLocalDateKey(new Date(log.started_at))));
  const sortedRecent = [...logs].sort((a, b) => Date.parse(b.started_at) - Date.parse(a.started_at));

  const todayCounts: Partial<Record<TrackerLogType, number>> = {};
  const last7dCounts: Partial<Record<TrackerLogType, number>> = {};
  const latest: Partial<Record<TrackerLogType, LatestEvent>> = {};

  for (const log of logs) {
    const day = toLocalDateKey(new Date(log.started_at));
    if (day === todayKey) {
      todayCounts[log.type] = (todayCounts[log.type] ?? 0) + 1;
    }
    if (daySet.has(day)) {
      last7dCounts[log.type] = (last7dCounts[log.type] ?? 0) + 1;
    }
    if (!latest[log.type] || Date.parse(log.started_at) > Date.parse(latest[log.type]!.startedAt)) {
      latest[log.type] = {
        startedAt: log.started_at,
        endedAt: log.ended_at,
        subtype: log.subtype,
        value: log.value,
      };
    }
  }

  const recentTimeline = sortedRecent
    .slice(0, 8)
    .map((log) => `${formatTrackerTimelinePrimary(log, language)} — ${formatTrackerTimelineSecondary(log, language)}`);

  const dailySleepMinutes = new Map<string, number>();
  const dailyNapCount = new Map<string, number>();
  const dailyFeedCount = new Map<string, number>();
  const dailyDiaperCount = new Map<string, number>();
  const dailySolidsCount = new Map<string, number>();
  const moodDistribution7d: Record<string, number> = {};
  const moodDistributionToday: Record<string, number> = {};
  const solidsFoods: string[] = [];

  const feedLike = inWindow
    .filter((log) => log.type === "feed" || log.type === "bottle")
    .sort((a, b) => Date.parse(a.started_at) - Date.parse(b.started_at));

  const feedSpacingsMinutes: number[] = [];
  for (let i = 1; i < feedLike.length; i += 1) {
    const prev = Date.parse(feedLike[i - 1].started_at);
    const next = Date.parse(feedLike[i].started_at);
    if (Number.isFinite(prev) && Number.isFinite(next) && next > prev) {
      feedSpacingsMinutes.push(Math.round((next - prev) / 60000));
    }
  }

  for (const log of inWindow) {
    const key = toLocalDateKey(new Date(log.started_at));
    if (log.type === "sleep" && log.ended_at) {
      dailySleepMinutes.set(key, (dailySleepMinutes.get(key) ?? 0) + sleepDurationMinutes(log));
      dailyNapCount.set(key, (dailyNapCount.get(key) ?? 0) + 1);
    }
    if (log.type === "feed" || log.type === "bottle") {
      dailyFeedCount.set(key, (dailyFeedCount.get(key) ?? 0) + 1);
    }
    if (log.type === "diaper") {
      dailyDiaperCount.set(key, (dailyDiaperCount.get(key) ?? 0) + 1);
    }
    if (log.type === "mood") {
      const mood = (log.subtype ?? "unknown").toLowerCase();
      moodDistribution7d[mood] = (moodDistribution7d[mood] ?? 0) + 1;
      if (key === todayKey) {
        moodDistributionToday[mood] = (moodDistributionToday[mood] ?? 0) + 1;
      }
    }
    if (log.type === "solids") {
      dailySolidsCount.set(key, (dailySolidsCount.get(key) ?? 0) + 1);
      const food = normalizeFood(log.subtype ?? log.note);
      if (food) solidsFoods.push(food);
    }
  }

  const seriesFromMap = (map: Map<string, number>) => days.map((d) => map.get(d) ?? 0);
  const sleepSeries = seriesFromMap(dailySleepMinutes);
  const napSeries = seriesFromMap(dailyNapCount);
  const feedSeries = seriesFromMap(dailyFeedCount);
  const diaperSeries = seriesFromMap(dailyDiaperCount);
  const solidsSeries = seriesFromMap(dailySolidsCount);

  const avg = (vals: number[]) => (vals.length ? Number((vals.reduce((s, n) => s + n, 0) / vals.length).toFixed(1)) : 0);
  const confidenceFromCount = (count: number) => {
    if (count >= 14) return 0.95;
    if (count >= 8) return 0.82;
    if (count >= 4) return 0.68;
    if (count >= 2) return 0.55;
    return 0.35;
  };

  const uniqueFoods = Array.from(new Set(solidsFoods));
  const lastFeedAt = latest.bottle?.startedAt ?? latest.feed?.startedAt;
  const napsToday = napSeries[napSeries.length - 1] ?? 0;
  const moodTop = topMood(moodDistribution7d);

  const trackerContext = {
    lastFeedAt,
    sleepSummary:
      napsToday > 0
        ? language === "el"
          ? `${napsToday} υπνάκοι ολοκληρώθηκαν σήμερα`
          : `${napsToday} naps ended today`
        : language === "el"
          ? "Δεν έχει καταγραφεί ολοκληρωμένος ύπνος σήμερα"
          : "No completed naps logged today",
    moodPattern:
      moodTop
        ? language === "el"
          ? `Κυρίαρχη διάθεση 7 ημερών: ${moodTop}`
          : `Top mood over 7 days: ${moodTop}`
        : language === "el"
          ? "Δεν υπάρχουν ακόμα αρκετές καταγραφές διάθεσης"
          : "Not enough mood logs yet",
    recentLogs: recentTimeline,
  };

  const trackerSnapshot: MiaTrackerSnapshot = {
    generatedAt: nowIso,
    windowDays,
    latest,
    todayCounts,
    last7dCounts,
    recentTimeline,
  };

  const trackerPatterns: MiaTrackerPatterns = {
    generatedAt: nowIso,
    windowDays,
    insufficientData: inWindow.length < 4,
    sleep: {
      todayMinutes: sleepSeries[sleepSeries.length - 1] ?? 0,
      avgDailyMinutes7d: avg(sleepSeries),
      recentDailyMinutes: sleepSeries,
      napCountTrend: trendFromSeries(napSeries),
      confidence: confidenceFromCount(inWindow.filter((l) => l.type === "sleep").length),
      insufficientData: inWindow.filter((l) => l.type === "sleep").length < 2,
    },
    feeding: {
      todayCount: feedSeries[feedSeries.length - 1] ?? 0,
      avgDailyCount7d: avg(feedSeries),
      avgSpacingMinutes7d: feedSpacingsMinutes.length ? avg(feedSpacingsMinutes) : null,
      recentDailyCount: feedSeries,
      countTrend: trendFromSeries(feedSeries),
      confidence: confidenceFromCount(inWindow.filter((l) => l.type === "feed" || l.type === "bottle").length),
      insufficientData: inWindow.filter((l) => l.type === "feed" || l.type === "bottle").length < 2,
    },
    diaper: {
      todayCount: diaperSeries[diaperSeries.length - 1] ?? 0,
      avgDailyCount7d: avg(diaperSeries),
      recentDailyCount: diaperSeries,
      countTrend: trendFromSeries(diaperSeries),
      confidence: confidenceFromCount(inWindow.filter((l) => l.type === "diaper").length),
      insufficientData: inWindow.filter((l) => l.type === "diaper").length < 2,
    },
    mood: {
      todayTopMood: topMood(moodDistributionToday),
      distribution7d: moodDistribution7d,
      confidence: confidenceFromCount(inWindow.filter((l) => l.type === "mood").length),
      insufficientData: inWindow.filter((l) => l.type === "mood").length < 2,
    },
    solids: {
      todayCount: solidsSeries[solidsSeries.length - 1] ?? 0,
      avgDailyCount7d: avg(solidsSeries),
      uniqueFoods7d: uniqueFoods.length,
      recentFoods: uniqueFoods.slice(-6),
      frequencyTrend: trendFromSeries(solidsSeries),
      confidence: confidenceFromCount(inWindow.filter((l) => l.type === "solids").length),
      insufficientData: inWindow.filter((l) => l.type === "solids").length < 2,
    },
  };

  const signature = `${logs.length}:${sortedRecent[0]?.updated_at ?? sortedRecent[0]?.started_at ?? "none"}:${windowDays}`;

  return {
    trackerContext,
    trackerSnapshot,
    trackerPatterns,
    signature,
  };
}
