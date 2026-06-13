import { dailyActivities, exploreActivities } from "./docActivities";
import { greetings, greetingsEl, reassuranceLines, reassuranceLinesEl, weeklyMessages } from "./activities";
import type { AppLanguage } from "@/lib/appLanguage";
import { resolveGreekGenderAlternatives } from "@/lib/greekGrammar";

export type Category = "spark" | "move" | "play";
export type BabyGender = "girl" | "boy" | "unspecified";
export type Activity = (typeof dailyActivities)[number];

export { greetings, weeklyMessages };
export const activities = exploreActivities;
export { dailyActivities };
const DEFAULT_REASSURANCE_KEY = "0-2";
type ReassuranceBracket = { key: string; start: number; end: number };
const reassuranceBrackets: ReassuranceBracket[] = Object.keys(reassuranceLines)
  .map((key): ReassuranceBracket | null => {
    const match = key.match(/^(\d+)-(\d+)$/);
    if (!match) return null;
    const start = Number.parseInt(match[1], 10);
    const end = Number.parseInt(match[2], 10);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
    return { key, start, end };
  })
  .filter((entry): entry is ReassuranceBracket => entry !== null)
  .sort((a, b) => a.start - b.start);
const GLOBAL_MAX_AGE_RANGE_END = dailyActivities.reduce(
  (max, activity) => Math.max(max, activity.ageRangeEnd),
  0
);

function replaceWithCase(source: string, lower: string): string {
  if (source.toUpperCase() === source) return lower.toUpperCase();
  if (source[0] === source[0]?.toUpperCase()) {
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
  return lower;
}

function replaceWord(text: string, pattern: RegExp, toWord: string): string {
  return text.replace(pattern, (match) => replaceWithCase(match, toWord));
}

function replaceGenderedPronouns(text: string, gender: BabyGender = "unspecified"): string {
  let output = text;

  if (gender === "boy") {
    output = replaceWord(output, /\bthey're\b/gi, "he's");
    output = replaceWord(output, /\bthey\b/gi, "he");
    output = replaceWord(output, /\btheir\b/gi, "his");
    output = replaceWord(output, /\bthem\b/gi, "him");
    output = replaceWord(output, /\btheirs\b/gi, "his");
    output = replaceWord(output, /\bthemself\b/gi, "himself");
    output = replaceWord(output, /\bthemselves\b/gi, "himself");
    output = replaceWord(output, /\bshe's\b/gi, "he's");
    output = replaceWord(output, /\bshe\b/gi, "he");
    output = replaceWord(output, /\bher\b(?=\s+[a-z])/gi, "his");
    output = replaceWord(output, /\bher\b/gi, "him");
    output = replaceWord(output, /\bhers\b/gi, "his");
    output = replaceWord(output, /\bherself\b/gi, "himself");
    return output;
  }

  if (gender === "girl") {
    output = replaceWord(output, /\bthey're\b/gi, "she's");
    output = replaceWord(output, /\bthey\b/gi, "she");
    output = replaceWord(output, /\btheir\b/gi, "her");
    output = replaceWord(output, /\bthem\b/gi, "her");
    output = replaceWord(output, /\btheirs\b/gi, "hers");
    output = replaceWord(output, /\bthemself\b/gi, "herself");
    output = replaceWord(output, /\bthemselves\b/gi, "herself");
    output = replaceWord(output, /\bhe's\b/gi, "she's");
    output = replaceWord(output, /\bhe\b/gi, "she");
    output = replaceWord(output, /\bhis\b/gi, "her");
    output = replaceWord(output, /\bhim\b/gi, "her");
    output = replaceWord(output, /\bhimself\b/gi, "herself");
    return output;
  }

  output = replaceWord(output, /\bshe's\b/gi, "they're");
  output = replaceWord(output, /\bhe's\b/gi, "they're");
  output = replaceWord(output, /\bshe\b/gi, "they");
  output = replaceWord(output, /\bhe\b/gi, "they");
  output = replaceWord(output, /\bher\b(?=\s+[a-z])/gi, "their");
  output = replaceWord(output, /\bhis\b/gi, "their");
  output = replaceWord(output, /\bher\b/gi, "them");
  output = replaceWord(output, /\bhim\b/gi, "them");
  output = replaceWord(output, /\bhers\b/gi, "theirs");
  output = replaceWord(output, /\bhimself\b/gi, "themself");
  output = replaceWord(output, /\bherself\b/gi, "themself");
  return output;
}

export function getActivitiesForAge(ageInWeeks: number): Activity[] {
  return dailyActivities.filter(
    (a) =>
      (ageInWeeks >= a.ageRangeStart && ageInWeeks < a.ageRangeEnd) ||
      (ageInWeeks === GLOBAL_MAX_AGE_RANGE_END && a.ageRangeEnd === GLOBAL_MAX_AGE_RANGE_END)
  );
}

export function getActivitiesByCategory(
  ageInWeeks: number,
  category: Category
): Activity[] {
  return getActivitiesForAge(ageInWeeks).filter((a) => a.category === category);
}

export function selectDailyActivities(
  ageInWeeks: number,
  excludedIds: string[],
  seed: number
): Activity[] {
  const categories: Category[] = ["spark", "move", "play"];
  const selected: Activity[] = [];

  for (const cat of categories) {
    const pool = getActivitiesByCategory(ageInWeeks, cat).filter(
      (a) => !excludedIds.includes(a.id)
    );
    const source = pool.length > 0 ? pool : getActivitiesByCategory(ageInWeeks, cat);
    if (source.length === 0) continue;
    const idx = Math.abs(seed) % source.length;
    selected.push(source[idx]);
  }

  return selected;
}

export function getGreeting(
  index: number,
  name: string,
  weeks: number,
  gender: BabyGender = "unspecified",
  hour: number = 9,
  role: string = "",
  language: AppLanguage = "en",
): string {
  const bucket =
    hour >= 5 && hour < 9 ? "early"
    : hour >= 9 && hour < 12 ? "morning"
    : hour >= 12 && hour < 15 ? "midday"
    : hour >= 15 && hour < 19 ? "afternoon"
    : hour >= 19 && hour < 22 ? "evening"
    : "night";
  const pool = (language === "el" ? greetingsEl : greetings)[bucket] ?? greetings[bucket];
  const safeIndex = Math.abs(index) % pool.length;
  const raw = pool[safeIndex](name, weeks, role);
  if (language === "el") {
    return resolveGreekGenderAlternatives(raw, gender);
  }
  return raw;
}

export function getWeeklyMessage(
  index: number,
  name: string,
  category: string,
  gender: BabyGender = "unspecified",
  spark = 0,
  move = 0,
  play = 0,
  ageInMonths = 0,
): string {
  const safeIndex = Math.abs(index) % weeklyMessages.length;
  const raw = weeklyMessages[safeIndex](name, category, spark, move, play, ageInMonths);
  return replaceGenderedPronouns(raw, gender);
}

// ── Date helpers (mirrors BabyContext private helpers) ──────────────────────

function _toLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function _getDaysDiff(from: string, to: string): number {
  return Math.round(
    (new Date(to).getTime() - new Date(from).getTime()) / 86_400_000
  );
}

// ── Journey insight — milestone-only messaging ───────────────────────────────

export function getJourneyInsight({
  streakDays,
  lastActiveDate,
  totalActivitiesAllTime,
  weeklyActivities,
  dominantCategory,
  name,
  gender,
}: {
  streakDays: number;
  lastActiveDate: string;
  totalActivitiesAllTime: number;
  weeklyActivities: { spark: number; move: number; play: number };
  dominantCategory: "spark" | "move" | "play";
  name: string;
  gender: BabyGender;
}): string | null {
  const n = name || "your baby";
  const today = _toLocalDateKey(new Date());
  const daysSinceLast = lastActiveDate ? _getDaysDiff(lastActiveDate, today) : 99;

  // 1. Comeback — 2+ days missed and user has previous activity history
  if (daysSinceLast >= 2 && totalActivitiesAllTime > 0) {
    const msgs = [
      `${n} missed those Todayler moments — it's not too late to pick it back up today.`,
      `A couple of days away. ${n} is ready to go whenever you are.`,
    ];
    const raw = msgs[Math.abs(daysSinceLast) % msgs.length];
    return replaceGenderedPronouns(raw, gender);
  }

  // 2. Streak milestones — only at exactly 3, 7, 15, 30
  if (streakDays === 3) {
    const raw =
      dominantCategory === "spark"
        ? `These 3 days of thinking together are already shaping how ${n}'s brain makes connections.`
        : dominantCategory === "move"
          ? `3 days of movement. ${n}'s body is building the strength they'll carry for years.`
          : `3 days of bonding. The trust you're building with ${n} right now lasts a lifetime.`;
    return replaceGenderedPronouns(raw, gender);
  }
  if (streakDays === 7) {
    return replaceGenderedPronouns(
      `3 days straight. A focused stretch of showing up for ${n} — that's what this is about.`,
      gender
    );
  }
  if (streakDays === 15) {
    return replaceGenderedPronouns(
      `15 days. At this point you're not just doing activities — you're reshaping how ${n} develops.`,
      gender
    );
  }
  if (streakDays === 30) {
    return replaceGenderedPronouns(
      `30 days. What you've built with ${n} this month is something most parents never give their child.`,
      gender
    );
  }

  // 3. Weekly activity milestones — every 2 activities, nothing below 2
  const weekTotal = weeklyActivities.spark + weeklyActivities.move + weeklyActivities.play;
  if (weekTotal >= 2) {
    const tiers = [
      `${n} got 2 activities this week — you're off to a great start.`,
      `4 activities with ${n} this week. That's a real rhythm.`,
      `6 this week with ${n}. Plenty of the right things happening.`,
      `${weekTotal} activities this week. Exceptional consistency.`,
    ];
    const tierIndex = Math.min(Math.floor((weekTotal - 2) / 2), tiers.length - 1);
    return replaceGenderedPronouns(tiers[tierIndex], gender);
  }

  return null;
}

export function getReassuranceLine(
  ageInWeeks: number,
  seed: number,
  gender: BabyGender = "unspecified",
  language: AppLanguage = "en"
): string {
  let key = DEFAULT_REASSURANCE_KEY;
  if (reassuranceBrackets.length > 0) {
    const direct = reassuranceBrackets.find(
      (b) => ageInWeeks >= b.start && ageInWeeks < b.end
    );
    if (direct) {
      key = direct.key;
    } else {
      const highest = reassuranceBrackets[reassuranceBrackets.length - 1];
      if (ageInWeeks >= highest.end) {
        key = highest.key;
      } else {
        const nearestLower = [...reassuranceBrackets]
          .reverse()
          .find((b) => ageInWeeks >= b.start);
        key = nearestLower?.key ?? reassuranceBrackets[0].key;
      }
    }
  }

  const source = language === "el" ? reassuranceLinesEl : reassuranceLines;
  const lines =
    source[key] ||
    source[DEFAULT_REASSURANCE_KEY] ||
    source[Object.keys(source)[0]] ||
    [];
  if (lines.length === 0) return "";
  const raw = lines[Math.abs(seed) % lines.length];
  return replaceGenderedPronouns(raw, gender);
}
