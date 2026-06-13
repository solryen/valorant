import type {
  TrackerDiaperKind,
  TrackerLogPayload,
  TrackerLogType,
  TrackerMoodState,
} from "@/contexts/BabyContext";
import type { AppLanguage } from "@/lib/appLanguage";

export type ParsedTrackerSuggestion = {
  id: string;
  type: TrackerLogType;
  timestamp: string;
  payload: TrackerLogPayload;
  endedAt?: string;
  valueText?: string;
  detailText?: string;
  startText?: string;
  endText?: string;
};

export type ParseTrackerUtteranceResult = {
  suggestions: ParsedTrackerSuggestion[];
  clarification: string | null;
};

const MAX_SUGGESTIONS = 10;
const OZ_TO_ML = 29.5735;

const FOOD_CANONICAL: Record<string, string> = {
  banana: "banana",
  bananas: "banana",
  "μπανανα": "banana",
  "μπανάνα": "banana",
  apple: "apple",
  "μηλο": "apple",
  "μήλο": "apple",
  pear: "pear",
  "αχλαδι": "pear",
  "αχλάδι": "pear",
  avocado: "avocado",
  "αβοκαντο": "avocado",
  "αβοκάντο": "avocado",
  peach: "peach",
  "ροδακινο": "peach",
  "ροδάκινο": "peach",
  mango: "mango",
  "μανγκο": "mango",
  "μάνγκο": "mango",
  berries: "berries",
  "μουρα": "berries",
  "μούρα": "berries",
  yogurt: "yogurt",
  "γιαουρτι": "yogurt",
  "γιαούρτι": "yogurt",
  egg: "egg",
  "αυγο": "egg",
  "αυγό": "egg",
  chicken: "chicken",
  "κοτοπουλο": "chicken",
  "κοτόπουλο": "chicken",
};

function mkId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeGreek(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ς/g, "σ");
}

function normalizeText(input: string): string {
  return normalizeGreek(input)
    .replace(/[^a-z0-9\u0370-\u03ff\u1f00-\u1fff:.\-\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasNearToken(haystack: string, candidates: string[]): boolean {
  for (const c of candidates) {
    const nc = normalizeText(c);
    if (!nc) continue;
    if (haystack.includes(nc)) return true;
    const noLast = nc.length > 4 ? nc.slice(0, -1) : nc;
    if (noLast.length > 3 && haystack.includes(noLast)) return true;
  }
  return false;
}

function splitChunks(input: string): string[] {
  return input
    .split(/(?:\band\b|\bthen\b|\bκαι\b|\bμετα\b|\bκαι μετα\b|\.|;|\n|\+|\&)+/i)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseNumericValue(text: string): number | undefined {
  const m = text.match(/(\d+(?:[.,]\d+)?)/);
  if (!m) return undefined;
  const v = Number(m[1].replace(",", "."));
  return Number.isFinite(v) ? v : undefined;
}

function parseDurationMinutes(text: string): number | null {
  const h = text.match(/(\d+(?:[.,]\d+)?)\s*(?:hours?|hrs?|hr|h|ωρ(?:α|ες)?|ω)/i);
  if (h) {
    const v = Number(h[1].replace(",", "."));
    if (Number.isFinite(v) && v > 0) return Math.max(1, Math.round(v * 60));
  }
  const m = text.match(/(\d+(?:[.,]\d+)?)\s*(?:minutes?|mins?|min|m|λεπτ(?:ο|α|ά|ό)?|λ)/i);
  if (m) {
    const v = Number(m[1].replace(",", "."));
    if (Number.isFinite(v) && v > 0) return Math.max(1, Math.round(v));
  }
  return null;
}

function parseClockToken(raw: string, now: Date): Date | null {
  const t = raw.trim();
  const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!m) return null;
  let hour = Number(m[1]);
  const minute = Number(m[2] ?? "0");
  const period = (m[3] ?? "").toLowerCase();
  if (!Number.isFinite(hour) || !Number.isFinite(minute) || minute > 59) return null;
  if (period === "pm" && hour < 12) hour += 12;
  if (period === "am" && hour === 12) hour = 0;
  if (!period && hour === 24) hour = 0;
  if (hour > 23) return null;
  const d = new Date(now);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function applyDayPartAnchor(date: Date, chunk: string): Date {
  const normalized = normalizeText(chunk);
  const d = new Date(date);
  if (hasNearToken(normalized, ["morning", "πρωι", "πρωιν" ])) {
    d.setHours(9, 0, 0, 0);
    return d;
  }
  if (hasNearToken(normalized, ["afternoon", "μεσημερι", "απογευμα"])) {
    d.setHours(15, 0, 0, 0);
    return d;
  }
  if (hasNearToken(normalized, ["evening", "night", "βραδυ", "βράδυ", "αποψε"])) {
    d.setHours(20, 0, 0, 0);
    return d;
  }
  return d;
}

function parseTimestamp(chunk: string, now: Date): string {
  const at = chunk.match(/(?:at|στις)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (at) {
    const d = parseClockToken(at[1], now);
    if (d) return d.toISOString();
  }
  return applyDayPartAnchor(new Date(now), chunk).toISOString();
}

function formatClock(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function parseSleepRange(chunk: string, now: Date): { start: Date; end: Date } | null {
  const range = chunk.match(/(?:from|απο)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s+(?:to|μεχρι|ως|εως|-)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if (range) {
    const start = parseClockToken(range[1], now);
    const end = parseClockToken(range[2], now);
    if (start && end) {
      if (end.getTime() <= start.getTime()) end.setDate(end.getDate() + 1);
      return { start, end };
    }
  }
  const duration = parseDurationMinutes(chunk);
  if (duration) {
    const end = new Date(now);
    const start = new Date(end.getTime() - duration * 60_000);
    return { start, end };
  }
  return null;
}

function extractFoodSubtype(chunk: string): string | null {
  const normalized = normalizeText(chunk);
  for (const [k, v] of Object.entries(FOOD_CANONICAL)) {
    if (normalized.includes(normalizeText(k))) return v;
  }
  const food = normalized.match(/(?:ate|food|solids?|εφαγε|φαγητο|στερεα)\s+([a-z0-9\u0370-\u03ff\u1f00-\u1fff]+)/i);
  return food?.[1] ? food[1].slice(0, 80) : null;
}

function hasLogIntent(chunk: string) {
  return hasNearToken(chunk, ["log", "track", "record", "καταγραφ", "σημειω", "προσθεσε"]);
}

function parseVolumeEntries(chunkRaw: string): Array<{ valueMl: number; token: string }> {
  const results: Array<{ valueMl: number; token: string }> = [];
  const regex = /(\d+(?:[.,]\d+)?)\s*(ml|oz)\b/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(chunkRaw)) !== null) {
    const rawVal = Number(m[1].replace(",", "."));
    if (!Number.isFinite(rawVal) || rawVal <= 0) continue;
    const unit = m[2].toLowerCase();
    const valueMl = unit === "oz" ? Math.max(1, Math.round(rawVal * OZ_TO_ML)) : Math.round(rawVal);
    results.push({ valueMl, token: m[0] });
  }
  return results;
}

export function parseTrackerUtterance(input: string, language: AppLanguage): ParseTrackerUtteranceResult {
  const raw = input.trim();
  if (!raw) return { suggestions: [], clarification: null };
  const now = new Date();
  const chunks = splitChunks(raw);
  const suggestions: ParsedTrackerSuggestion[] = [];
  let clarification: string | null = null;
  let skippedDueToCap = 0;
  let previousWasBottleIntent = false;

  const pushSuggestion = (suggestion: ParsedTrackerSuggestion) => {
    if (suggestions.length >= MAX_SUGGESTIONS) {
      skippedDueToCap += 1;
      return;
    }
    suggestions.push(suggestion);
  };

  for (const c of chunks) {
    const chunk = normalizeText(c);
    if (!chunk) continue;
    if (hasNearToken(chunk, ["μην", "ignore", "dont log", "don't log"])) continue;

    const numeric = parseNumericValue(chunk);
    const timestamp = parseTimestamp(chunk, now);

    const hasBreastSignal = hasNearToken(chunk, ["breast", "nursing", "θηλασ", "στήθος", "μαστο"]);
    const hasFeedSignal = hasNearToken(chunk, ["feed", "feeding", "drank", "milk", "γαλα", "ήπιε", "επιε", "ταϊσ", "ταισ"]);
    const hasBottleSignal = hasNearToken(chunk, ["bottle", "formula", "μπιμπερο"]);

    const volumeEntries = parseVolumeEntries(c);
    if (volumeEntries.length > 0 && (hasBottleSignal || (hasFeedSignal && !hasBreastSignal) || previousWasBottleIntent)) {
      for (const entry of volumeEntries) {
        if (__DEV__) console.log("[tracker-parser] unit_converted", { from: entry.token, toMl: entry.valueMl });
        pushSuggestion({
          id: mkId(),
          type: "bottle",
          timestamp,
          payload: { value: entry.valueMl },
          valueText: String(entry.valueMl),
        });
      }
      previousWasBottleIntent = true;
      continue;
    }

    if (hasBreastSignal || (hasNearToken(chunk, ["feed", "feeding", "θηλασ"]) && !hasBottleSignal && !volumeEntries.length)) {
      const hasSide = hasNearToken(chunk, ["left", "right", "αριστερ", "δεξι"]);
      const hasAction = hasNearToken(chunk, ["start", "end", "stop", "begin", "ξεκινα", "τελος", "σταματα", "λήξη", "έναρξη"]);
      if (!hasSide || !hasAction) {
        clarification = language === "el"
          ? "Για θηλασμό χρειάζομαι πλευρά (αριστερά/δεξιά) και έναρξη ή λήξη."
          : "For breastfeeding, include side (left/right) and start or end.";
        previousWasBottleIntent = false;
        continue;
      }
      const side = hasNearToken(chunk, ["right", "δεξι"]) ? "right" : "left";
      const isEnd = hasNearToken(chunk, ["end", "stop", "τελος", "σταματα", "ληξη"]);
      pushSuggestion({
        id: mkId(),
        type: "feed",
        timestamp,
        payload: isEnd ? { action: "end", subtype: side } : { action: "start", subtype: side },
        detailText: `${side} ${isEnd ? "end" : "start"}`,
      });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasFeedSignal && !hasBreastSignal && !hasBottleSignal) {
      const value = volumeEntries[0]?.valueMl ?? numeric;
      pushSuggestion({
        id: mkId(),
        type: "bottle",
        timestamp,
        payload: { value },
        valueText: value != null ? String(value) : "",
      });
      previousWasBottleIntent = true;
      continue;
    }

    if (hasNearToken(chunk, ["sleep", "nap", "υπνο", "κοιμη"])) {
      const range = parseSleepRange(chunk, now);
      if (!range) {
        clarification = language === "el" ? "Δεν κατάλαβα ώρα/διάρκεια ύπνου. Πες π.χ. «Ύπνος από 9 έως 10»." : "I couldn’t parse sleep timing. Try: nap from 9 to 10.";
        previousWasBottleIntent = false;
        continue;
      }
      if (__DEV__) console.log("[tracker-parser] time_inferred", { kind: "sleep", start: range.start.toISOString(), end: range.end.toISOString() });
      pushSuggestion({
        id: mkId(),
        type: "sleep",
        timestamp: range.start.toISOString(),
        endedAt: range.end.toISOString(),
        payload: { action: "end", endedAt: range.end.toISOString() },
        startText: formatClock(range.start),
        endText: formatClock(range.end),
      });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasNearToken(chunk, ["solids", "food", "ate", "στερε", "φαγη", "εφαγε", "apple", "banana", "μπανανα", "μηλο"])) {
      const subtype = extractFoodSubtype(c) ?? c.trim().slice(0, 80);
      pushSuggestion({ id: mkId(), type: "solids", timestamp, payload: { subtype }, detailText: subtype });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasNearToken(chunk, ["diaper", "nappy", "πανα", "shit", "poop", "dirty", "wet", "pee", "κακα", "ουρα"])) {
      let kind: TrackerDiaperKind = "wet";
      if (hasNearToken(chunk, ["both", "και τα δυο"])) kind = "both";
      else if (hasNearToken(chunk, ["dirty", "poop", "shit", "κακα"])) kind = "dirty";
      pushSuggestion({ id: mkId(), type: "diaper", timestamp, payload: { kind }, detailText: kind });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasNearToken(chunk, ["mood", "happy", "calm", "sleepy", "fussy", "upset", "διαθεση", "χαρ", "ηρεμ", "νυστ", "γκριν"])) {
      let mood: TrackerMoodState = "calm";
      if (hasNearToken(chunk, ["happy", "χαρ"])) mood = "happy";
      else if (hasNearToken(chunk, ["sleepy", "νυστ"])) mood = "sleepy";
      else if (hasNearToken(chunk, ["fussy", "γκριν"])) mood = "fussy";
      else if (hasNearToken(chunk, ["upset", "αναστ"])) mood = "upset";
      pushSuggestion({ id: mkId(), type: "mood", timestamp, payload: { mood }, detailText: mood });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasNearToken(chunk, ["water", "νερο", "sips"])) {
      pushSuggestion({ id: mkId(), type: "water", timestamp, payload: { value: numeric }, valueText: numeric != null ? String(numeric) : "" });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasNearToken(chunk, ["pump", "pumping", "αντλησ", "αντληση"])) {
      pushSuggestion({ id: mkId(), type: "pumping", timestamp, payload: { value: numeric }, valueText: numeric != null ? String(numeric) : "" });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasNearToken(chunk, ["bath", "μπανιο"])) {
      pushSuggestion({ id: mkId(), type: "bath", timestamp, payload: {} });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasNearToken(chunk, ["stroll", "walk", "βολτα"])) {
      pushSuggestion({ id: mkId(), type: "stroll", timestamp, payload: { value: numeric }, valueText: numeric != null ? String(numeric) : "" });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasNearToken(chunk, ["temperature", "temp", "fever", "θερμοκρασ", "πυρετ"])) {
      pushSuggestion({ id: mkId(), type: "temperature", timestamp, payload: { value: numeric }, valueText: numeric != null ? String(numeric) : "" });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasNearToken(chunk, ["medication", "medicine", "dose", "φαρμακ", "δοση", "σιροπι"])) {
      pushSuggestion({ id: mkId(), type: "medication", timestamp, payload: { note: c.trim() }, detailText: c.trim() });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasNearToken(chunk, ["weight", "weigh", "βαρος", "κιλα", "kg"])) {
      pushSuggestion({ id: mkId(), type: "weight", timestamp, payload: { value: numeric }, valueText: numeric != null ? String(numeric) : "" });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasNearToken(chunk, ["length", "height", "υψος", "μηκος", "cm"])) {
      pushSuggestion({ id: mkId(), type: "length", timestamp, payload: { value: numeric }, valueText: numeric != null ? String(numeric) : "" });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasNearToken(chunk, ["head", "circumference", "περιμετρο", "κεφαλι"])) {
      pushSuggestion({ id: mkId(), type: "head_circumference", timestamp, payload: { value: numeric }, valueText: numeric != null ? String(numeric) : "" });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasNearToken(chunk, ["doctor", "appointment", "pediatric", "γιατρ", "ραντεβου"])) {
      pushSuggestion({ id: mkId(), type: "doctor_visit", timestamp, payload: { note: c.trim() }, detailText: c.trim() });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasNearToken(chunk, ["vaccine", "vaccination", "shot", "εμβολ"])) {
      pushSuggestion({ id: mkId(), type: "vaccination", timestamp, payload: { note: c.trim() }, detailText: c.trim() });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasNearToken(chunk, ["milestone", "important", "event", "οροσημο", "σημαντικο"])) {
      pushSuggestion({ id: mkId(), type: "important_event", timestamp, payload: { note: c.trim() }, detailText: c.trim() });
      previousWasBottleIntent = false;
      continue;
    }

    if (hasNearToken(chunk, ["note", "remember", "σημειωση", "θυμησ"]) && hasLogIntent(chunk)) {
      pushSuggestion({ id: mkId(), type: "note", timestamp, payload: { note: c.trim() }, detailText: c.trim() });
      previousWasBottleIntent = false;
      continue;
    }

    previousWasBottleIntent = false;
  }

  if (skippedDueToCap > 0) {
    clarification = language === "el"
      ? "Μπορώ να προετοιμάσω έως 10 καταγραφές κάθε φορά. Οι επιπλέον παραλείφθηκαν."
      : "I can draft up to 10 logs at a time. Extra items were skipped.";
    if (__DEV__) console.log("[tracker-parser] cap_applied", { kept: suggestions.length, skipped: skippedDueToCap });
  }

  if (suggestions.length === 0 && !clarification && hasLogIntent(normalizeText(raw))) {
    clarification = language === "el"
      ? "Δεν βρήκα καθαρή καταγραφή. Πες το σαν: μπιμπερό, ύπνος, πάνα, διάθεση, στερεά κτλ."
      : "I couldn't detect a clear log. Try saying bottle, sleep, diaper, mood, solids, etc.";
  }

  return { suggestions, clarification };
}
