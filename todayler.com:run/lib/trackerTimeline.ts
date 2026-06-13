import type { TrackerLog } from "@/contexts/BabyContext";
type AppLanguage = "en" | "el";

const KNOWN_FOOD_LABELS_EL: Record<string, string> = {
  banana: "Μπανάνα",
  apple: "Μήλο",
  pear: "Αχλάδι",
  avocado: "Αβοκάντο",
  peach: "Ροδάκινο",
  mango: "Μάνγκο",
  berries: "Μούρα",
  "sweet potato": "Γλυκοπατάτα",
  carrot: "Καρότο",
  peas: "Αρακάς",
  broccoli: "Μπρόκολο",
  squash: "Κολοκύθα",
  potato: "Πατάτα",
  spinach: "Σπανάκι",
  "baby oatmeal": "Βρεφική βρώμη",
  rice: "Ρύζι",
  pasta: "Ζυμαρικά",
  toast: "Τοστ",
  bread: "Ψωμί",
  cereal: "Δημητριακά",
  egg: "Αυγό",
  chicken: "Κοτόπουλο",
  turkey: "Γαλοπούλα",
  beef: "Μοσχάρι",
  lentils: "Φακές",
  beans: "Φασόλια",
  tofu: "Τόφου",
  fish: "Ψάρι",
  yogurt: "Γιαούρτι",
  cheese: "Τυρί",
  "milk (12m+)": "Γάλα (12μ+)",
  puffs: "Σνακ puff",
  "teething biscuit": "Μπισκότο οδοντοφυΐας",
  crackers: "Κράκερ",
};

export function formatTrackerClock(iso: string, language: AppLanguage = "en"): string {
  const date = new Date(iso);
  return date.toLocaleTimeString(language === "el" ? "el-GR" : undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: language === "el" ? false : undefined,
  });
}

function formatDuration(startIso: string, endIso: string, language: AppLanguage = "en"): string {
  const startMs = Date.parse(startIso);
  const endMs = Date.parse(endIso);
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return language === "el" ? "0λ" : "0m";
  const totalMinutes = Math.max(1, Math.round((endMs - startMs) / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) return language === "el" ? `${hours}ω ${minutes}λ` : `${hours}h ${minutes}m`;
  if (hours > 0) return language === "el" ? `${hours}ω` : `${hours}h`;
  return language === "el" ? `${minutes}λ` : `${minutes}m`;
}

function formatDurationMinutes(startIso: string, endIso: string, language: AppLanguage = "en"): string {
  const startMs = Date.parse(startIso);
  const endMs = Date.parse(endIso);
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return language === "el" ? "0λ" : "0m";
  const totalMinutes = Math.max(1, Math.round((endMs - startMs) / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours > 0 && mins > 0) return language === "el" ? `${hours}ω ${mins}λ` : `${hours}h ${mins}m`;
  if (hours > 0) return language === "el" ? `${hours}ω` : `${hours}h`;
  return language === "el" ? `${mins}λ` : `${mins}m`;
}

export function formatTrackerTimelinePrimary(log: TrackerLog, language: AppLanguage = "en"): string {
  if (log.type === "feed") {
    if (!log.ended_at) {
      return language === "el"
        ? `Έναρξη ${formatTrackerClock(log.started_at, language)}`
        : `Started ${formatTrackerClock(log.started_at, language)}`;
    }
    return `${formatTrackerClock(log.started_at, language)} - ${formatTrackerClock(log.ended_at, language)}`;
  }

  if (log.type === "sleep") {
    if ((log.subtype ?? "start") === "start" && !log.ended_at) {
      return language === "el"
        ? `Έναρξη ${formatTrackerClock(log.started_at, language)}`
        : `Started ${formatTrackerClock(log.started_at, language)}`;
    }
    if (log.ended_at) {
      return `${formatTrackerClock(log.started_at, language)} - ${formatTrackerClock(log.ended_at, language)}`;
    }
  }
  return formatTrackerClock(log.started_at, language);
}

export function formatTrackerTimelineSecondary(log: TrackerLog, language: AppLanguage = "en"): string {
  if (log.type === "feed") {
    const side =
      log.subtype === "left" || log.subtype === "right"
        ? ` · ${language === "el" ? breastSideLabel(log.subtype) : toTitle(log.subtype)}`
        : "";
    if (!log.ended_at) {
      return language === "el" ? `Θηλασμός${side} · Σε εξέλιξη` : `Breast${side} · In progress`;
    }
    const duration = ` · ${formatDurationMinutes(log.started_at, log.ended_at, language)}`;
    if (log.subtype === "left" || log.subtype === "right") {
      return language === "el"
        ? `Θηλασμός · ${breastSideLabel(log.subtype)}${duration}`
        : `Breast · ${toTitle(log.subtype)}${duration}`;
    }
    return language === "el" ? `Θηλασμός${duration}` : `Breast${duration}`;
  }
  if (log.type === "bottle") return `${language === "el" ? "Μπιμπερό" : "Bottle"}${typeof log.value === "number" ? ` · ${log.value} ml` : ""}`;
  if (log.type === "water") return `${language === "el" ? "Νερό" : "Water"}${typeof log.value === "number" ? ` · ${log.value} ml` : ""}`;
  if (log.type === "solids") {
    const detail = translateKnownFood(log.subtype || log.note, language);
    return `${language === "el" ? "Στερεά" : "Solids"}${detail ? ` · ${detail}` : ""}`;
  }
  if (log.type === "pumping") return `${language === "el" ? "Άντληση" : "Pumping"}${typeof log.value === "number" ? ` · ${log.value} ${language === "el" ? "λ" : "min"}` : ""}`;

  if (log.type === "sleep") {
    if ((log.subtype ?? "start") === "start" && !log.ended_at) return language === "el" ? "Ύπνος σε εξέλιξη" : "Sleep in progress";
    if (log.ended_at) return `${language === "el" ? "Ύπνος" : "Sleep"} · ${formatDuration(log.started_at, log.ended_at, language)}`;
    return language === "el" ? "Ύπνος" : "Sleep";
  }

  if (log.type === "diaper") {
    const subtype = translateDiaperSubtype(log.subtype, language);
    return `${language === "el" ? "Πάνα" : "Diaper"}${subtype ? ` · ${subtype}` : ""}`;
  }
  if (log.type === "bath") return language === "el" ? "Μπάνιο" : "Bath";
  if (log.type === "stroll") return `${language === "el" ? "Βόλτα" : "Stroll"}${typeof log.value === "number" ? ` · ${log.value}${language === "el" ? "λ" : "m"}` : ""}`;

  if (log.type === "mood") return `${language === "el" ? "Διάθεση" : "Mood"}${log.subtype ? ` · ${toTitle(log.subtype)}` : ""}`;

  if (log.type === "temperature") return `${language === "el" ? "Θερμοκρασία" : "Temperature"}${typeof log.value === "number" ? ` · ${log.value.toFixed(1)}°C` : ""}`;
  if (log.type === "medication") return `${language === "el" ? "Φαρμακευτική αγωγή" : "Medication"}${log.note ? ` · ${log.note}` : ""}`;
  if (log.type === "doctor_visit") return language === "el" ? "Επίσκεψη γιατρού" : "Doctor visit";
  if (log.type === "vaccination") return language === "el" ? "Εμβολιασμός" : "Vaccination";

  if (log.type === "weight") return `${language === "el" ? "Βάρος" : "Weight"}${typeof log.value === "number" ? ` · ${log.value} kg` : ""}`;
  if (log.type === "length") return `${language === "el" ? "Ύψος" : "Length"}${typeof log.value === "number" ? ` · ${log.value} cm` : ""}`;
  if (log.type === "head_circumference") {
    return `${language === "el" ? "Περίμετρος κεφαλιού" : "Head circumference"}${typeof log.value === "number" ? ` · ${log.value} cm` : ""}`;
  }

  if (log.type === "important_event") return `${milestoneLabel(log.subtype, language)}${log.note ? ` · ${log.note}` : ""}`;
  if (log.type === "note") return `${language === "el" ? "Σημείωση" : "Note"}${log.note ? ` · ${log.note}` : ""}`;

  return language === "el" ? "Καταχώριση" : "Entry";
}

export function formatTrackerRelativeAnchor(log: TrackerLog): string {
  if (log.type === "feed" && log.ended_at) return log.ended_at;
  if (log.type === "sleep" && log.ended_at) return log.ended_at;
  return log.started_at;
}

function toTitle(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function breastSideLabel(value: string): string {
  if (value === "left") return "Αριστερά";
  if (value === "right") return "Δεξιά";
  return value;
}

function milestoneLabel(subtype?: string | null, language: AppLanguage = "en"): string {
  if (subtype === "first_tooth") return language === "el" ? "Πρώτο δοντάκι" : "First tooth";
  if (subtype === "first_walk") return language === "el" ? "Πρώτα βήματα" : "First walk";
  if (subtype === "first_word") return language === "el" ? "Πρώτη λέξη" : "First word";
  return language === "el" ? "Σημαντικό γεγονός" : "Important event";
}

function translateDiaperSubtype(value?: string | null, language: AppLanguage = "en"): string {
  if (!value) return "";
  if (language !== "el") return toTitle(value);
  if (value === "wet") return "Ούρα";
  if (value === "dirty") return "Κακά";
  if (value === "both") return "Ούρα + Κακά";
  return value;
}

function translateKnownFood(value?: string | null, language: AppLanguage = "en"): string {
  if (!value || language !== "el") return value ?? "";
  return KNOWN_FOOD_LABELS_EL[value.trim().toLowerCase()] ?? value;
}
