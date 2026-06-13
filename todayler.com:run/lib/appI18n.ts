import type { AppLanguage } from "@/lib/appLanguage";
import type { BabyGender } from "@/lib/greekGrammar";
import { resolveGreekGenderAlternatives } from "@/lib/greekGrammar";

type Dict = Record<string, string>;

const en: Dict = {
  "tab.home": "Home",
  "tab.track": "Track",
  "tab.chapters": "Chapters",
  "tab.explore": "Explore",
  "settings.language": "Language",
  "settings.language_en": "English",
  "settings.language_el": "Greek",
  "settings.saved": "Saved!",
  "paywall.review.body":
    "I stopped Googling every little thing and wondering if I was doing enough. Todayler gave me simple daily activities that actually fit my baby's age and for the first time in months, parenting felt calmer.",
  "paywall.review.meta": "Mum of a 5-month-old • Todayler member since 2026",
  "common.all": "All",
  "cat.think": "Think",
  "cat.move": "Move",
  "cat.bond": "Bond",
  "explore.title": "Explore",
  "explore.newborn": "Newborn",
  "explore.young_infant": "Young Infant",
  "explore.older_infant": "Older Infant",
  "explore.late_infant": "Late Infant",
  "explore.young_toddler": "Young Toddler",
  "explore.toddler": "Toddler",
  "explore.no_image": "No image mapped yet",
  "explore.voice_memo": "Voice memo",
  "explore.library_title": "Activity library",
  "explore.library_subtitle": "Browse deeper activities for when you have more time. Sort by age and activity type.",
  "explore.count_suffix": "activities",
  "explore.age_filters": "Age filters",
  "explore.all_ages": "All ages",
  "explore.baby_age_tag": "Baby age",
  "chapters.badge_title": "Chapter {index}",
  "chapters.progress_in": "{weeks} weeks and {days} days in",
  "chapters.this_page": "This page",
  "chapters.next_week_page": "Next Week's page",
  "chapters.cover_title": "The chapters of {littleWord} {name}",
  "chapters.tap_me": "tap me",
  "chapters.emoji_exit": "Tap anywhere to exit",
  "track.title": "Tracker",
  "track.quick_log": "Quick Log",
  "track.ask_mia": "Need help?",
  "track.ask_mia_cta": "Ask Mia",
  "track.today_memory": "Today's memory",
  "track.today": "Today",
  "track.all_logs": "All logs",
  "track.cancel": "Cancel",
  "track.save": "Save",
  "track.feeding": "Feeding",
  "track.sleep": "Sleep",
  "track.diaper": "Diaper",
  "track.mood": "Mood",
  "track.select": "Select",
  "mia.subtitle": "Your private parenting companion",
  "mia.greeting":
    "Hi {babyName} {roleLabel}! I'm Mia. Ask me anything about {babyName} or how you're doing — I'm here whenever you need me.",
  "mia.thinking": "Thinking...",
  "mia.hide_suggestions": "Hide suggestions",
  "mia.input_placeholder": "Ask Mia anything...",
  "mia.welcome_title": "A quiet space for your worries",
  "mia.welcome_subtext":
    "Mia is here whenever you need to let things out and get warm, practical support for you and your baby. Powered by AI.",
  "mia.welcome_cta": "Got it",
  "mia.limit_reached": "You have reached the limit of Mia usage for today. Come back tomorrow, I will be here! 🌙",
  "mia.network_error": "I can’t reach Mia right now. Please try again in a moment.",
  "mia.generic_error": "I hit a problem replying right now. Please try again.",
  "mia.default_home_prompt": "I need help with today’s activities",
  "mia.suggestion_food_label": "What can {babyName} eat right now?",
  "mia.suggestion_food_message":
    "{babyName} is {ageInMonths} months old. What solid foods or meals are safe and good to introduce right now?",
  "mia.suggestion_crying_label": "Baby won’t stop crying, help",
  "mia.suggestion_crying_message":
    "{babyName} won’t stop crying and I’ve tried everything. What should I do right now?",
  "mia.suggestion_sleep_label": "How do I get more sleep tonight?",
  "mia.suggestion_sleep_message":
    "I haven’t slept properly in days. How do I get {babyName} to sleep longer stretches tonight?",
  "mia.close_panel": "Close Mia panel",
  "mia.voice_unavailable_title": "Voice unavailable",
  "mia.voice_unavailable_message": "Voice-to-text is not available on this device right now.",
  "mia.voice_permission_title": "Microphone access needed",
  "mia.voice_permission_message": "Please allow microphone access to dictate your message to Mia.",
  "mia.voice_error_title": "Voice input error",
  "mia.voice_error_message": "I couldn't capture your speech. Please try again.",
};

const el: Dict = {
  "tab.home": "Αρχική",
  "tab.track": "Καταγραφή",
  "tab.chapters": "Κεφάλαια",
  "tab.explore": "Εξερεύνηση",
  "settings.language": "Γλώσσα",
  "settings.language_en": "Αγγλικά",
  "settings.language_el": "Ελληνικά",
  "settings.saved": "Αποθηκεύτηκε!",
  "paywall.review.body":
    "Σταμάτησα να ψάχνω στο Google για το καθετί και να αναρωτιέμαι αν κάνω αρκετά. Το Todayler μου έδωσε απλές καθημερινές δραστηριότητες που πραγματικά ταιριάζουν στην ηλικία του μωρού μου και για πρώτη φορά μετά από μήνες, η γονεϊκότητα ένιωθε πιο ήρεμη.",
  "paywall.review.meta": "Μαμά μωρού 5 μηνών • Μέλος Todayler από το 2026",
  "common.all": "Όλα",
  "cat.think": "Σκέψη",
  "cat.move": "Κίνηση",
  "cat.bond": "Σύνδεση",
  "explore.title": "Εξερεύνηση",
  "explore.newborn": "Νεογέννητο",
  "explore.young_infant": "Μικρό βρέφος",
  "explore.older_infant": "Μεγαλύτερο βρέφος",
  "explore.late_infant": "Τελικό βρεφικό",
  "explore.young_toddler": "Μικρό νήπιο",
  "explore.toddler": "Νήπιο",
  "explore.no_image": "Δεν υπάρχει εικόνα",
  "explore.voice_memo": "Ηχητικό σημείωμα",
  "explore.library_title": "Βιβλιοθήκη δραστηριοτήτων",
  "explore.library_subtitle": "Δες πιο αναλυτικές δραστηριότητες όταν έχεις περισσότερο χρόνο. Φίλτραρε ανά ηλικία και τύπο δραστηριότητας.",
  "explore.count_suffix": "δραστηριότητες",
  "explore.age_filters": "Φίλτρα ηλικίας",
  "explore.all_ages": "Όλες οι ηλικίες",
  "explore.baby_age_tag": "Ηλικία μωρού",
  "chapters.badge_title": "Κεφάλαιο {index}",
  "chapters.progress_in": "{weeks} εβδομάδες και {days} ημέρες μέσα",
  "chapters.this_page": "Αυτή η σελίδα",
  "chapters.next_week_page": "Σελίδα επόμενης εβδομάδας",
  "chapters.cover_title": "Τα κεφάλαια του {littleWord} {name}",
  "chapters.tap_me": "άνοιξέ με",
  "chapters.emoji_exit": "Πάτησε οπουδήποτε για έξοδο",
  "track.title": "Καταγραφή",
  "track.quick_log": "Γρήγορη καταγραφή",
  "track.ask_mia": "Χρειάζεσαι βοήθεια;",
  "track.ask_mia_cta": "Ρώτα τη Mία",
  "track.today_memory": "Η σημερινή ανάμνηση",
  "track.today": "Σήμερα",
  "track.all_logs": "Όλες οι καταγραφές",
  "track.cancel": "Ακύρωση",
  "track.save": "Αποθήκευση",
  "track.feeding": "Σίτιση",
  "track.sleep": "Ύπνος",
  "track.diaper": "Πάνα",
  "track.mood": "Διάθεση",
  "track.select": "Επιλογή",
  "mia.subtitle": "Ο ιδιωτικός βοηθός γονεϊκότητας σου",
  "mia.greeting":
    "Γεια σου {roleWithBaby}! Είμαι η Mία. Ρώτα με ό,τι θέλεις για {babyNameObject} ή για το πώς νιώθεις — είμαι εδώ όποτε με χρειαστείς.",
  "mia.thinking": "Σκέφτομαι...",
  "mia.hide_suggestions": "Απόκρυψη προτάσεων",
  "mia.input_placeholder": "Ρώτα τη Mία ό,τι θέλεις...",
  "mia.welcome_title": "Ένας ήρεμος χώρος για όσα σε απασχολούν",
  "mia.welcome_subtext":
    "Η Mία είναι εδώ όποτε χρειάζεσαι να μιλήσεις και να πάρεις ζεστή, πρακτική στήριξη για εσένα και το μωρό σου. Με υποστήριξη AI.",
  "mia.welcome_cta": "Το κατάλαβα",
  "mia.limit_reached": "Έφτασες το σημερινό όριο χρήσης της Mία. Έλα ξανά αύριο, θα είμαι εδώ! 🌙",
  "mia.network_error": "Δεν μπορώ να συνδεθώ με τη Mία τώρα. Δοκίμασε ξανά σε λίγο.",
  "mia.generic_error": "Παρουσιάστηκε πρόβλημα στην απάντηση. Δοκίμασε ξανά.",
  "mia.default_home_prompt": "Χρειάζομαι βοήθεια με τις σημερινές δραστηριότητες",
  "mia.suggestion_food_label": "{babyNameSubject}: τι μπορεί να φάει τώρα;",
  "mia.suggestion_food_message":
    "{babyNameSubject} είναι {ageInMonths} μηνών. Ποιες στερεές τροφές ή γεύματα είναι ασφαλή και κατάλληλα να ξεκινήσουμε τώρα;",
  "mia.suggestion_crying_label": "Το μωρό δεν σταματάει να κλαίει, βοήθεια",
  "mia.suggestion_crying_message":
    "{babyNameSubject} δεν σταματάει να κλαίει και έχω δοκιμάσει τα πάντα. Τι να κάνω τώρα;",
  "mia.suggestion_sleep_label": "Πώς να κοιμηθώ περισσότερο απόψε;",
  "mia.suggestion_sleep_message":
    "Δεν έχω κοιμηθεί σωστά εδώ και μέρες. Πώς να βοηθήσω {babyNameObject} να κοιμηθεί μεγαλύτερα διαστήματα απόψε;",
  "mia.close_panel": "Κλείσιμο πάνελ Mία",
  "mia.voice_unavailable_title": "Η φωνή δεν είναι διαθέσιμη",
  "mia.voice_unavailable_message": "Η μετατροπή φωνής σε κείμενο δεν είναι διαθέσιμη αυτή τη στιγμή στη συσκευή σου.",
  "mia.voice_permission_title": "Χρειάζεται πρόσβαση στο μικρόφωνο",
  "mia.voice_permission_message": "Επέτρεψε πρόσβαση στο μικρόφωνο για να υπαγορεύσεις μήνυμα στη Mία.",
  "mia.voice_error_title": "Σφάλμα φωνητικής εισαγωγής",
  "mia.voice_error_message": "Δεν μπόρεσα να καταγράψω τη φωνή σου. Δοκίμασε ξανά.",
};

const dictByLang: Record<AppLanguage, Dict> = { en, el };
const GREEK_FALLBACK_TEXT = "«Κείμενο διαθέσιμο σύντομα»";
const ALLOW_LATIN_BRANDS = ["Todayler", "Mia"];
const GREEK_DUAL_FORM_PATTERN = /\b(?:[Α-Ωα-ωΆ-Ώά-ώ]+\/[Α-Ωα-ωΆ-Ώά-ώ]+)\b/;

function hasForbiddenLatin(input: string): boolean {
  if (!input) return false;
  const stripped = ALLOW_LATIN_BRANDS.reduce(
    (acc, brand) => acc.replaceAll(brand, ""),
    input
  );
  return /[A-Za-z]/.test(stripped);
}

export function tApp(
  lang: AppLanguage,
  key: string,
  vars?: Record<string, string | number>,
  gender?: BabyGender
) {
  const fromLang = dictByLang[lang]?.[key];
  const fromEn = en[key];
  let base = fromLang ?? fromEn ?? key;
  if (lang === "el" && !fromLang) {
    if (__DEV__) {
      console.warn(`[i18n][el-missing] ${key}`);
    }
    base = GREEK_FALLBACK_TEXT;
  }
  const interpolated = !vars
    ? base
    : Object.keys(vars).reduce((acc, k) => acc.replaceAll(`{${k}}`, String(vars[k])), base);
  if (lang !== "el") return interpolated;
  const resolved = resolveGreekGenderAlternatives(interpolated, gender);
  if (__DEV__ && GREEK_DUAL_FORM_PATTERN.test(resolved)) {
    console.warn(`[i18n][el-unresolved-dual] ${key}: ${resolved}`);
  }
  return resolved;
}

export function strictLocalizedText(
  lang: AppLanguage,
  text: string | { en: string; el: string } | null | undefined,
  debugKey?: string
): string {
  const resolvedInput =
    text && typeof text === "object"
      ? lang === "el"
        ? text.el
        : text.en
      : text;
  const value = String(resolvedInput ?? "").trim();
  if (!value) return lang === "el" ? GREEK_FALLBACK_TEXT : "";
  if (lang !== "el") return value;
  if (hasForbiddenLatin(value)) {
    if (__DEV__) {
      console.warn(`[i18n][el-latin-blocked] ${debugKey ?? "text"}`);
    }
    return GREEK_FALLBACK_TEXT;
  }
  if (__DEV__ && GREEK_DUAL_FORM_PATTERN.test(value)) {
    console.warn(`[i18n][el-unresolved-dual-localized] ${debugKey ?? "text"}: ${value}`);
  }
  return value;
}
