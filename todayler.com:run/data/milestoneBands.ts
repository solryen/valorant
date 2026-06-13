// Shared milestone source of truth for onboarding + milestones screen.

export type MilestoneCategory = "movement" | "social" | "explorement";
export const MILESTONE_BAND_ORDER = [
  "0-1-month",
  "1-2-month",
  "2-3-month",
  "3-4-month",
  "4-5-month",
  "5-6-month",
  "6-7-month",
  "7-8-month",
  "8-9-month",
  "9-10-month",
  "10-11-month",
  "11-12-month",
  "12-13-month",
  "13-14-month",
  "14-15-month",
  "15-16-month",
  "16-17-month",
  "17-18-month",
  "18-19-month",
  "19-20-month",
  "20-21-month",
  "21-22-month",
  "22-23-month",
  "23-24-month",
] as const;
export type MilestoneBandKey = (typeof MILESTONE_BAND_ORDER)[number];
export type MilestoneItem = {
  category: MilestoneCategory;
  title: string;
  subtitle: string;
  expandedDetail: string;
  exploreCategory: "move" | "play" | "spark";
};


const ZERO_TO_ONE_MILESTONES: MilestoneItem[] = [
  {
    category: "movement",
    title: "Moves arms and legs actively",
    subtitle: "Quick, jerky movements are very common in the first weeks.",
    expandedDetail:
      "You might notice sudden kicks, stretches, or little full-body wiggles, especially during nappy changes or when your baby is awake and alert.",
    exploreCategory: "move",
  },
  {
    category: "movement",
    title: "Turns head to one side on tummy",
    subtitle: "On their tummy, they may briefly turn or lift their head.",
    expandedDetail:
      "At this stage, even a small head turn counts. It usually looks brief and effortful, not smooth or steady yet.",
    exploreCategory: "move",
  },
  {
    category: "social",
    title: "Calms or reacts to a familiar voice",
    subtitle: "Your baby may pause, settle, or shift when they hear a voice nearby.",
    expandedDetail:
      "This can be very subtle — a still moment, a change in breathing, or a softer expression when they hear someone familiar close to them.",
    exploreCategory: "play",
  },
  {
    category: "social",
    title: "Looks at your face up close",
    subtitle: "Faces are especially interesting in the early weeks, especially when you're close.",
    expandedDetail:
      "You may catch short moments where your baby seems to study your face during feeding, holding, or quiet cuddles. Babies are drawn to faces very early on.",
    exploreCategory: "play",
  },
  {
    category: "explorement",
    title: "Follows a face or object briefly",
    subtitle: "They may watch a slow-moving face, light, or object for a moment.",
    expandedDetail:
      "At this age it is usually very brief. Their eyes may follow something slowly for a second or two before drifting away again.",
    exploreCategory: "spark",
  },
  {
    category: "explorement",
    title: "Brings hands near mouth or eyes",
    subtitle: "Their hands may drift into view or toward their mouth as they begin noticing their body.",
    expandedDetail:
      "You might see their hands rise near their face or brush near their mouth without much control yet. This is part of those very early body discoveries.",
    exploreCategory: "spark",
  },
];

const ONE_TO_TWO_MILESTONES: MilestoneItem[] = [
  {
    category: "movement",
    title: "Holds head up on tummy",
    subtitle: "During tummy time, they may lift their head a little higher and for a little longer.",
    expandedDetail:
      "At this stage it still looks effortful. Even a short lift counts — what matters is that you're starting to see more neck strength than in the first few weeks.",
    exploreCategory: "move",
  },
  {
    category: "movement",
    title: "Opens hands more often",
    subtitle: "Their hands may look less tightly closed, and they may briefly bring them together.",
    expandedDetail:
      "You might notice their fingers opening more at rest, or their hands drifting together near the middle of their body for a moment before moving away again.",
    exploreCategory: "move",
  },
  {
    category: "social",
    title: "Smiles when you smile or talk",
    subtitle: "Around this stage, smiles start to feel more clearly directed back at you.",
    expandedDetail:
      "This is less like a sleepy reflex smile and more like a real response. It may happen during feeding, when you lean in, or when your face and voice are close together.",
    exploreCategory: "play",
  },
  {
    category: "social",
    title: "Makes cooing sounds",
    subtitle: "You may start hearing soft vowel-like sounds, not just crying.",
    expandedDetail:
      "These are the early “ooh,” “aah,” or gentle gurgly sounds that often happen in calm, alert moments. Sometimes they seem to come right after you speak, which is how early back-and-forth begins.",
    exploreCategory: "play",
  },
  {
    category: "explorement",
    title: "Watches you as you move",
    subtitle: "They may keep their eyes on you for a little longer as you move nearby.",
    expandedDetail:
      "This often looks like quiet attention rather than excitement. Your baby may track your face or body for a short stretch before looking away for a break.",
    exploreCategory: "spark",
  },
  {
    category: "explorement",
    title: "Looks at a toy or face for several seconds",
    subtitle: "Their attention is still brief, but it's starting to hold a little longer.",
    expandedDetail:
      "A high-contrast toy, a bright object, or your face may keep their attention for a few seconds now. When they look away, that usually just means they've had enough for the moment.",
    exploreCategory: "spark",
  },
];

const TWO_TO_THREE_MILESTONES: MilestoneItem[] = [
  {
    category: "movement",
    title: "Holds head up longer on tummy",
    subtitle: "During tummy time, they may lift their head a little higher and keep it there a bit longer.",
    expandedDetail:
      "At this age, head lifting may still look effortful, but it usually lasts a little longer than before. You may notice more neck control and a steadier look around.",
    exploreCategory: "move",
  },
  {
    category: "movement",
    title: "Brings hands toward mouth",
    subtitle: "Their hands are becoming more active and may come up toward their mouth more often.",
    expandedDetail:
      "You might see their hands drift up while they're awake, especially when they're excited or settling. At this stage, hands and mouth are starting to connect more often.",
    exploreCategory: "move",
  },
  {
    category: "social",
    title: "Smiles back at you",
    subtitle: "Smiles are starting to feel more clearly directed toward faces and voices they enjoy.",
    expandedDetail:
      "This is the stage where smiles often begin to feel more social and less random. You may notice them when you lean in, talk gently, or smile first.",
    exploreCategory: "play",
  },
  {
    category: "social",
    title: "Makes cooing sounds",
    subtitle: "You may hear soft vowel-like sounds during calm, alert moments.",
    expandedDetail:
      "These are often gentle little \"ooh\" or \"aah\" sounds, not crying. Sometimes they come after you speak, which is how early conversation starts to take shape.",
    exploreCategory: "play",
  },
  {
    category: "explorement",
    title: "Follows moving faces or objects",
    subtitle: "Their eyes may stay with a person or object for longer as it moves slowly nearby.",
    expandedDetail:
      "This usually looks calm and focused rather than excited. They may watch your face, a toy, or a light move across their view before needing a break.",
    exploreCategory: "spark",
  },
  {
    category: "explorement",
    title: "Watches faces with more focus",
    subtitle: "Faces may hold their attention for longer now, especially when you're close and talking.",
    expandedDetail:
      "You may notice a stronger, more settled gaze during feeding, cuddling, or quiet chat. It can feel like they're really studying you now.",
    exploreCategory: "spark",
  },
];

const THREE_TO_FOUR_MILESTONES: MilestoneItem[] = [
  {
    category: "movement",
    title: "Holds head steady when held",
    subtitle: "Their head may feel more stable now when you carry or sit them upright.",
    expandedDetail:
      "You may notice less wobbling and a little more control when they're upright against your chest or in your arms. It does not need to look perfect yet-just steadier than before.",
    exploreCategory: "move",
  },
  {
    category: "movement",
    title: "Pushes up on forearms during tummy time",
    subtitle: "On their tummy, they may lift their chest and lean on their arms a little more.",
    expandedDetail:
      "At this age, tummy time often starts to look more active. Your baby may push up through their forearms, hold their head higher, and look around for a little longer.",
    exploreCategory: "move",
  },
  {
    category: "social",
    title: "Smiles to get your attention",
    subtitle: "Smiles may start to feel more purposeful and clearly directed toward you.",
    expandedDetail:
      "This can look like a smile when you come close, talk, or make eye contact. It often feels less random now and more like your baby is trying to stay connected with you.",
    exploreCategory: "play",
  },
  {
    category: "social",
    title: "Makes sounds back when you talk",
    subtitle: "You may start hearing little coos or sounds in response to your voice.",
    expandedDetail:
      "This is the beginning of real back-and-forth. Your baby may answer your voice with an \"ooh,\" \"aah,\" or another soft sound, especially in calm, alert moments.",
    exploreCategory: "play",
  },
  {
    category: "explorement",
    title: "Reaches toward a toy",
    subtitle: "Their hands are becoming more intentional, and they may start reaching for what interests them.",
    expandedDetail:
      "At first, this may look a little clumsy or slow. Reaching can start as a bat, a stretch, or an almost-touch before it becomes more accurate.",
    exploreCategory: "spark",
  },
  {
    category: "explorement",
    title: "Watches a toy or face with more focus",
    subtitle: "Their attention may stay on a face or object longer than it used to.",
    expandedDetail:
      "You may notice a more settled, curious gaze now. Your baby might watch a toy, a face, or moving hands for several seconds before looking away for a break.",
    exploreCategory: "spark",
  },
];

const FOUR_TO_FIVE_MILESTONES: MilestoneItem[] = [
  {
    category: "movement",
    title: "Holds head steady without support",
    subtitle: "Their head may feel much more stable now when you hold them upright.",
    expandedDetail:
      "You may notice less wobbling and more control when they're in your arms or sitting with support. It does not need to look perfect yet-just steadier than before.",
    exploreCategory: "move",
  },
  {
    category: "movement",
    title: "Pushes up on straight or straighter arms during tummy time",
    subtitle: "On their tummy, they may press up higher through their arms and chest.",
    expandedDetail:
      "This stage often looks more active than before. Your baby may push up, lift their chest more clearly, and spend a little longer looking around from that position.",
    exploreCategory: "move",
  },
  {
    category: "social",
    title: "Smiles or makes sounds to keep your attention",
    subtitle: "Your baby may start doing more to draw you back in once you're interacting.",
    expandedDetail:
      "This can look like smiling when you lean close, making a sound after you speak, or getting more animated when you respond. It starts to feel more like a real exchange now.",
    exploreCategory: "play",
  },
  {
    category: "social",
    title: "Laughs or shows more playful sounds",
    subtitle: "You may start hearing chuckles, squeals, or other more playful sounds.",
    expandedDetail:
      "Not every baby laughs the same way right away. At first it may be a little chuckle, a squeal, or a delighted sound during play or when you do something familiar and fun.",
    exploreCategory: "play",
  },
  {
    category: "explorement",
    title: "Reaches toward a toy with more purpose",
    subtitle: "Their hands may start moving more clearly toward things they want to touch.",
    expandedDetail:
      "This can begin as a stretch, a bat, or an almost-grab before it becomes more accurate. What matters is that their reaching is starting to look more intentional.",
    exploreCategory: "spark",
  },
  {
    category: "explorement",
    title: "Brings objects or hands to mouth",
    subtitle: "Mouthing is a major way babies explore at this age.",
    expandedDetail:
      "If something reaches their hand, it often heads straight for the mouth. This is not random-mouth, hands, and curiosity are all working together right now.",
    exploreCategory: "spark",
  },
];

const MILESTONE_ACCENT: Record<MilestoneCategory, string> = {
  movement: "#F3F3F3",
  social: "#9E9E9E",
  explorement: "#202020",
};

const MILESTONE_ICON_COLOR: Record<MilestoneCategory, string> = {
  movement: "#6B9B73",
  social: "#BF7A55",
  explorement: "#6A9CBC",
};

export type MilestoneWeeklyTopNote = {
  title: string;
  bodyTemplate: string;
};

export type MilestoneBandConfig = {
  weekRange: { start: number; end: number };
  milestones: MilestoneItem[];
  weeklyTopNotes: Record<number, MilestoneWeeklyTopNote>;
  monthlyBottomNote: { en: string; el: string };
};

const MILESTONE_BOTTOM_NOTES_EL: Record<MilestoneBandKey, string> = {
  "0-1-month":
    "Τον πρώτο μήνα, η εγγύτητα μετράει περισσότερο από την τελειότητα. Το μωρό σου μαθαίνει από τη φωνή σου, το άγγιγμά σου και την καθημερινή παρουσία σου.",
  "1-2-month":
    "Τον δεύτερο μήνα, η πρόοδος φαίνεται κυρίως μέσα από την επανάληψη και όχι από μεγάλα άλματα.\nΤο να σε κοιτάζει, να ακούει τη φωνή σου και να μοιράζεστε τις ίδιες μικρές ρουτίνες ξανά και ξανά είναι ήδη σημαντική ανάπτυξη.",
  "2-3-month":
    "Τον τρίτο μήνα, η ανάπτυξη μοιάζει πιο διαδραστική παρά εντυπωσιακή.\nΧαμόγελα, ήχοι, βλεμματική επαφή και μικρές εναλλαγές μαζί σου κάνουν περισσότερα απ’ όσα φαίνονται.",
  "3-4-month":
    "Τον τέταρτο μήνα, η ανάπτυξη αρχίζει συχνά να φαίνεται πιο καθαρά.\nΧαμόγελα, ήχοι, προσπάθειες να πιάσει πράγματα και πιο σταθερές κινήσεις δείχνουν ότι το μωρό σου γίνεται πιο ενεργό στον κόσμο.",
  "4-5-month":
    "Τον πέμπτο μήνα, η ανάπτυξη φαίνεται συχνά ως περισσότερο ενδιαφέρον και περισσότερη πρόθεση. Το άπλωμα χεριών, η στήριξη, οι παιχνιδιάρικοι ήχοι και η μεγαλύτερη προσοχή δείχνουν ότι το μωρό σου συμμετέχει όλο και πιο ενεργά.",
  "5-6-month":
    "Τον έκτο μήνα, η ανάπτυξη φαίνεται πιο ενεργή και πιο στοχευμένη. Το να πιάνει πράγματα, να τα εξερευνά με το στόμα, οι ήχοι και ο καλύτερος έλεγχος του σώματος δείχνουν ότι το μωρό σου γίνεται πιο ικανό και πιο παρόν.",
  "6-7-month":
    "Τον έβδομο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη πρόθεση και μεγαλύτερη προσπάθεια. Γύρισμα, άπλωμα χεριών, μπαμπάλισμα και η προσπάθεια να πλησιάσει ανθρώπους ή αντικείμενα δείχνουν ξεκάθαρα πρόοδο.",
  "7-8-month":
    "Τον όγδοο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη επιμονή και σαφέστερη πρόθεση. Πιο σταθερό κάθισμα, δυνατότερο μπαμπάλισμα και πιο αποφασιστικές προσπάθειες για κίνηση είναι σημάδια ουσιαστικής εξέλιξης.",
  "8-9-month":
    "Τον ένατο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη στόχευση και επιμονή. Πιο σταθερό κάθισμα, δυνατότερο μπαμπάλισμα, αναζήτηση πραγμάτων και προσπάθεια να φτάσει εκεί που θέλει δείχνουν ότι το μωρό σου δρα όλο και πιο συνειδητά.",
  "9-10-month":
    "Τον δέκατο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη επιμονή και περισσότερους πειραματισμούς. Το τράβηγμα για να σηκωθεί, το πιο έντονο μπαμπάλισμα, η αναζήτηση αντικειμένων και οι δοκιμές με πράγματα με διαφορετικούς τρόπους είναι μέρος αυτής της φάσης.",
  "10-11-month":
    "Τον ενδέκατο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη αυτοπεποίθηση και εξερεύνηση. Η κίνηση πιασμένο σε έπιπλα, το πιο έντονο μπαμπάλισμα, η κατανόηση οικείων λέξεων και η πιο ακριβής χρήση των χεριών δείχνουν ότι το μωρό σου οργανώνει όλο και καλύτερα τον κόσμο του.",
  "11-12-month":
    "Τον δωδέκατο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη αυτοπεποίθηση και περισσότερη σύνδεση. Στάση, κίνηση πιασμένο, απλές χειρονομίες, κατανόηση οικείων λέξεων και πιο στοχευμένες πράξεις δείχνουν ένα μωρό που επικοινωνεί όλο και πιο ξεκάθαρα.",
  "12-13-month":
    "Τον δέκατο τρίτο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη αυτοπεποίθηση και επικοινωνία. Βήματα, δείξιμο, πρώιμες λέξεις και εξερεύνηση του πώς λειτουργούν τα πράγματα δείχνουν ότι το παιδί σου γίνεται όλο και πιο ενεργός συμμετέχων.",
  "13-14-month":
    "Τον δέκατο τέταρτο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη αυτοπεποίθηση και επικοινωνία. Βήματα, δείξιμο, απλές λέξεις και εξερεύνηση του πώς ταιριάζουν, κινούνται και λειτουργούν τα πράγματα συνεχίζουν να δυναμώνουν.",
  "14-15-month":
    "Τον δέκατο πέμπτο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη αυτοπεποίθηση και επικοινωνία. Βήματα, δείξιμο, απλές λέξεις και πρακτική διερεύνηση του περιβάλλοντος είναι κεντρικά στοιχεία αυτής της φάσης.",
  "15-16-month":
    "Τον δέκατο έκτο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη αυτοπεποίθηση και επικοινωνία. Πιο σταθερό περπάτημα, δείξιμο, προσπάθειες για λέξεις και μίμηση όσων βλέπει το παιδί σου δείχνουν σταθερή ωρίμανση.",
  "16-17-month":
    "Τον δέκατο έβδομο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη αυτοπεποίθηση και πρόθεση. Πιο σταθερό περπάτημα, κατανόηση απλών οδηγιών, περισσότερες προσπάθειες για λέξεις και πιο λειτουργική χρήση αντικειμένων δείχνουν σημαντική πρόοδο.",
  "17-18-month":
    "Τον δέκατο όγδοο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη αυτοπεποίθηση και πρόθεση. Περπάτημα με μεγαλύτερη σταθερότητα, κατανόηση απλών οδηγιών, δοκιμές νέων λέξεων και στοχευμένη χρήση αντικειμένων χτίζουν καθημερινή ανεξαρτησία.",
  "18-19-month":
    "Τον δέκατο ένατο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη αυτοπεποίθηση και πρόθεση. Πιο σταθερό περπάτημα, κατανόηση απλών οδηγιών, περισσότερες λέξεις και λειτουργική χρήση αντικειμένων δείχνουν ότι το παιδί σου οργανώνει πιο σύνθετα τη σκέψη του.",
  "19-20-month":
    "Τον εικοστό μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη αυτοπεποίθηση και πρόθεση. Πιο σταθερό περπάτημα, κατανόηση απλών οδηγιών, περισσότερες λέξεις και πρακτική χρήση αντικειμένων συνεχίζουν να ενισχύονται.",
  "20-21-month":
    "Τον εικοστό πρώτο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη αυτοπεποίθηση και πρόθεση. Πιο σταθερό περπάτημα, κατανόηση απλών οδηγιών, περισσότερες λέξεις και λειτουργική χρήση αντικειμένων είναι βασικά σημεία αυτής της περιόδου.",
  "21-22-month":
    "Τον εικοστό δεύτερο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη αυτοπεποίθηση και πρόθεση. Πιο σταθερό περπάτημα, καλύτερη ανταπόκριση σε απλές οδηγίες, περισσότερες λέξεις και ενεργή εξερεύνηση αντικειμένων.",
  "22-23-month":
    "Τον εικοστό τρίτο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη αυτοπεποίθηση και σύνδεση. Πιο δυνατή κίνηση, κατανόηση απλών οδηγιών, περισσότερες λέξεις και αρχές συμβολικού παιχνιδιού δείχνουν μεγάλη ωρίμανση.",
  "23-24-month":
    "Τον εικοστό τέταρτο μήνα, η ανάπτυξη φαίνεται μέσα από περισσότερη αυτοπεποίθηση και σύνδεση. Πιο δυναμικό τρέξιμο, ακολούθηση απλών οδηγιών, μικρές φράσεις και πιο πλούσιο φανταστικό παιχνίδι δείχνουν ένα παιδί που εκφράζεται όλο και πιο ολοκληρωμένα.",
};

function makeMonthlyBottomNote(key: MilestoneBandKey, en: string): { en: string; el: string } {
  return { en, el: MILESTONE_BOTTOM_NOTES_EL[key] ?? en };
}

export const MILESTONE_BANDS: Record<MilestoneBandKey, MilestoneBandConfig> = {
  "0-1-month": {
    weekRange: { start: 0, end: 4 },
    milestones: ZERO_TO_ONE_MILESTONES,
    weeklyTopNotes: {
      1: {
        title: "Week 1",
        bodyTemplate:
          "Everything is new right now.\n\nEven small reactions to touch, sound, or your voice are part of your baby settling into the world.",
      },
      2: {
        title: "Week 2",
        bodyTemplate:
          "You may start noticing tiny patterns, how your baby moves, reacts, or calms. These small signals are already telling you a lot about {obj}.",
      },
      3: {
        title: "Week 3",
        bodyTemplate:
          "Some moments may feel brief, but they matter.\n\nA pause, a look, or a small movement is your baby beginning to respond more to what's around {obj}.",
      },
      4: {
        title: "Week 4",
        bodyTemplate:
          "Things may still feel quiet, but your baby is taking in more each day.\n\nFaces, voices, and simple moments together are already shaping {poss} mind.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("0-1-month", "In the first month, being close matters more than doing things perfectly. Your baby is learning through your voice, your touch, and the way you show up each day."),
  },
  "1-2-month": {
    weekRange: { start: 5, end: 8 },
    milestones: ONE_TO_TWO_MILESTONES,
    weeklyTopNotes: {
      5: {
        title: "Week 5",
        bodyTemplate:
          "Around now, your baby's world is still small, but it's becoming more social.\n\nA pause, a look, or a tiny sound back is already part of the conversation.",
      },
      6: {
        title: "Week 6",
        bodyTemplate:
          "This is often the stage where your baby starts feeling a little less like a mystery.\n\nYou may begin to notice small patterns in how they look at you, settle, and respond.",
      },
      7: {
        title: "Week 7",
        bodyTemplate:
          "Some of the most meaningful changes now are easy to miss.\n\nA longer look, a softer sound, or a brief smile can be a real sign that connection is growing.",
      },
      8: {
        title: "Week 8",
        bodyTemplate:
          "By the end of this month, many babies feel a little more present with you.\n\nThey're still tiny, but they're beginning to take part in the world more clearly.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("1-2-month", "In the second month, progress often shows up through repetition more than big moments.\nLooking at you, hearing your voice, and sharing the same simple routines again and again is already meaningful development."),
  },
  "2-3-month": {
    weekRange: { start: 9, end: 12 },
    milestones: TWO_TO_THREE_MILESTONES,
    weeklyTopNotes: {
      9: {
        title: "Week 9",
        bodyTemplate:
          "Your baby is becoming more responsive now.\nSmall sounds, longer looks, and warmer reactions are starting to feel more like a real exchange.",
      },
      10: {
        title: "Week 10",
        bodyTemplate:
          "Around this stage, your baby may seem a little more present with you.\nThe quiet back-and-forth between you is becoming easier to notice.",
      },
      11: {
        title: "Week 11",
        bodyTemplate:
          "What matters most right now is not doing more, but noticing more.\nA coo, a smile, or a focused look can already tell you a lot.",
      },
      12: {
        title: "Week 12",
        bodyTemplate:
          "By the end of this stage, many babies feel more socially awake.\nThey are still little, but they're beginning to respond to the world in clearer ways.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("2-3-month", "In the third month, development often looks more interactive than dramatic.\nSmiles, sounds, eye contact, and simple back-and-forth moments are doing more than they seem."),
  },
  "3-4-month": {
    weekRange: { start: 13, end: 16 },
    milestones: THREE_TO_FOUR_MILESTONES,
    weeklyTopNotes: {
      13: {
        title: "Week 13",
        bodyTemplate:
          "Your baby is becoming more expressive now.\nSmiles, sounds, and longer looks are starting to feel more clearly like a response to you.",
      },
      14: {
        title: "Week 14",
        bodyTemplate:
          "This stage often feels more interactive.\nYour baby may be watching you more closely, making more sounds, and showing more interest in what's around them.",
      },
      15: {
        title: "Week 15",
        bodyTemplate:
          "A lot of growth right now shows up through attention and movement.\nReaching, looking, cooing, and small attempts to join in are all part of something important taking shape.",
      },
      16: {
        title: "Week 16",
        bodyTemplate:
          "By the end of this stage, many babies feel more socially awake and physically steady.\nThey are still little, but they're beginning to take part more clearly in the world around them.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("3-4-month", "In the fourth month, development often starts to feel more visible.\nSmiles, sounds, reaching, and steadier movement may be small on their own, but together they show your baby becoming more engaged with people and the world around them."),
  },
  "4-5-month": {
    weekRange: { start: 17, end: 20 },
    milestones: FOUR_TO_FIVE_MILESTONES,
    weeklyTopNotes: {
      17: {
        title: "Week 17",
        bodyTemplate:
          "Your baby is becoming more active with both body and attention now.\nReaching, looking, and responding may start to feel more intentional this week.",
      },
      18: {
        title: "Week 18",
        bodyTemplate:
          "This stage often feels more hands-on.\nYour baby may want to grab, mouth, and explore whatever catches their interest.",
      },
      19: {
        title: "Week 19",
        bodyTemplate:
          "A lot is changing quietly right now.\nStronger tummy-time pushes, more playful sounds, and more obvious interest in people are all part of this stage.",
      },
      20: {
        title: "Week 20",
        bodyTemplate:
          "By the end of this month, many babies feel more engaged with both people and objects.\nThe world is becoming something they want to reach for, look at, and respond to.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("4-5-month", "In the fifth month, development often shows up through more interest and more intention. Reaching, pushing up, playful sounds, and longer attention are all signs that your baby is becoming more active in how they connect with the world."),
  },
  "5-6-month": {
    weekRange: { start: 21, end: 24 },
    milestones: [
      {
        category: "movement",
        title: "Holds themselves up with their hands when sitting",
        subtitle: "When sitting with support, they may start using their hands to help steady themselves.",
        expandedDetail:
          "This can look a bit wobbly at first. What matters is that your baby is beginning to use their body more actively to stay upright instead of just being held there.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Pushes up high during tummy time",
        subtitle: "On their tummy, they may press up more strongly through their arms and chest.",
        expandedDetail:
          "You may notice a higher push, a steadier look around, and more time spent comfortably on the tummy than before. This stage often looks much more active than earlier tummy time.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Laughs during play",
        subtitle: "You may hear more clear laughs during familiar, playful moments.",
        expandedDetail:
          "Not every laugh sounds the same at first. It may start as a chuckle, squeal, or burst of delight when you repeat something they enjoy.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Takes turns making sounds with you",
        subtitle: "Your baby may answer your voice with sounds of their own.",
        expandedDetail:
          "This is early conversation. You make a sound, they make one back, and the rhythm begins to feel more mutual than before.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Reaches to grab a toy they want",
        subtitle: "Their reaching may look more direct now when something catches their interest.",
        expandedDetail:
          "This often shifts from batting at objects to more purposeful grabbing. You may notice them clearly stretching toward one thing they want and trying to get hold of it.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Puts things in their mouth to explore",
        subtitle: "Mouthing is still one of the main ways babies learn about objects at this age.",
        expandedDetail:
          "If your baby gets hold of something, it often goes straight to the mouth. That is part of normal exploration - hands, mouth, and attention are all working together.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      21: {
        title: "Week 21",
        bodyTemplate:
          "Your baby is becoming more purposeful now. Reaching, grabbing, and responding may start to feel less accidental and more clearly directed.",
      },
      22: {
        title: "Week 22",
        bodyTemplate:
          "This stage often feels more playful. You may notice more squeals, more curiosity, and more obvious interest in both people and objects.",
      },
      23: {
        title: "Week 23",
        bodyTemplate:
          "A lot is happening through the hands and mouth right now. Touching, grabbing, and mouthing are all part of how your baby learns at this age.",
      },
      24: {
        title: "Week 24",
        bodyTemplate:
          "By the end of this stage, many babies feel more engaged, more expressive, and a little sturdier in their bodies. The world is becoming something they want to join in with.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("5-6-month", "In the sixth month, development often looks more active and more intentional. Reaching, mouthing, playful sounds, and stronger body control are all signs that your baby is becoming more involved in the world around them."),
  },
  "6-7-month": {
    weekRange: { start: 25, end: 28 },
    milestones: [
      {
        category: "movement",
        title: "Rolls both ways",
        subtitle: "Your baby may roll from tummy to back and back to tummy more easily now.",
        expandedDetail:
          "This often starts to look less accidental and more deliberate. You may notice your baby rolling to get comfortable, reach something, or change position on purpose.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Sits with less support",
        subtitle: "Sitting may look steadier now, even if your baby still needs help getting into position.",
        expandedDetail:
          "At first this can still be wobbly. What matters is that your baby is using their body more actively to stay upright and can often sit for longer before tipping or folding forward.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Responds to their name",
        subtitle: "Your baby may start turning, pausing, or brightening when they hear their name.",
        expandedDetail:
          "Sometimes it looks like a quick head turn. Other times it is a pause, a look toward you, or a shift in attention when their name is said in a familiar voice.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Babbles with repeated sounds",
        subtitle: "You may hear more strings of sounds like \"ba,\" \"da,\" or \"ma\" now.",
        expandedDetail:
          "This is more than random noise. Babbling starts to sound more patterned at this stage, especially in playful or social moments when your baby is trying to stay in the exchange.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Passes a toy from one hand to the other",
        subtitle: "Their hand use may start to look more coordinated and deliberate now.",
        expandedDetail:
          "You may notice your baby holding a toy, shifting it across, then bringing it back or straight to the mouth. This is a big step in how they explore objects.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Explores toys with hands and mouth",
        subtitle: "Your baby may want to grab, turn, bang, and mouth almost everything they can reach.",
        expandedDetail:
          "This is how a lot of learning happens right now. Your baby is finding out what objects feel like, how they move, and what happens when they squeeze, drop, or chew them.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      25: {
        title: "Week 25",
        bodyTemplate:
          "Your baby is becoming more determined now. Reaching, rolling, and making sounds may start to feel more purposeful than they did a few weeks ago.",
      },
      26: {
        title: "Week 26",
        bodyTemplate:
          "This stage often feels more active on the floor. Your baby may want to grab, turn, pivot, and get closer to whatever catches their attention.",
      },
      27: {
        title: "Week 27",
        bodyTemplate:
          "A lot is happening through movement and communication right now. More babbling, more reaching, and more frustration with things they cannot quite do yet are all part of this stage.",
      },
      28: {
        title: "Week 28",
        bodyTemplate:
          "By the end of this month, many babies feel more expressive and more physically driven. They are not just noticing the world now - they are trying to get to it.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("6-7-month", "In the seventh month, development often shows up through more intention and more effort. Rolling, reaching, babbling, and trying to get closer to people or objects are all signs that your baby is becoming more active in how they explore and communicate."),
  },
  "7-8-month": {
    weekRange: { start: 29, end: 32 },
    milestones: [
      {
        category: "movement",
        title: "Sits more steadily on their own",
        subtitle: "Sitting may look more stable now, even if your baby still topples sometimes.",
        expandedDetail:
          "You may notice your baby staying upright longer, catching themselves with their hands, or leaning to reach something before coming back up again.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Moves to get closer to something",
        subtitle:
          "Your baby may roll, pivot, shuffle, or begin early crawling-style movements to reach what interests them.",
        expandedDetail:
          "This does not have to look like classic crawling yet. What matters is the growing effort to get somewhere on purpose rather than just staying where they were placed.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Responds to their name",
        subtitle: "Your baby may turn, pause, or brighten when they hear their name in a familiar voice.",
        expandedDetail:
          "Sometimes it is a quick look. Sometimes it is a pause in what they are doing, followed by a turn toward you when you say their name.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Babbles with repeated sounds",
        subtitle: "You may hear more strings of sounds like \"ba,\" \"da,\" or \"ma\" now.",
        expandedDetail:
          "Babbling starts to sound more patterned at this stage, especially in playful moments when your baby is trying to stay in the exchange with you.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Passes a toy from one hand to the other",
        subtitle: "Their hand use may look more coordinated and more deliberate now.",
        expandedDetail:
          "You may notice your baby holding something, shifting it across, turning it, and then bringing it right back to inspect or mouth again.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Looks for a partly hidden object",
        subtitle: "If part of a toy is still visible, your baby may try to find the rest of it.",
        expandedDetail:
          "This can look like batting away a cloth, lifting a hand, or reaching toward the hidden part once they realise the object is still there.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      29: {
        title: "Week 29",
        bodyTemplate:
          "Your baby is becoming more driven now. Rolling, reaching, and making sounds may start to feel more deliberate and less accidental.",
      },
      30: {
        title: "Week 30",
        bodyTemplate:
          "This stage often feels busier on the floor. Your baby may want to get closer to people, toys, and anything that catches their attention.",
      },
      31: {
        title: "Week 31",
        bodyTemplate:
          "A lot is happening through movement and communication right now. More babbling, more reaching, and more effort to explore are all part of this stage.",
      },
      32: {
        title: "Week 32",
        bodyTemplate:
          "By the end of this stage, many babies feel more expressive and more physically determined. They are not just noticing the world now - they are trying to move through it and respond to it.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("7-8-month", "In the eighth month, development often shows up through more effort and more intention. Steadier sitting, stronger babbling, and more determined reaching or moving are all signs that your baby is becoming more active in how they explore and communicate."),
  },
  "8-9-month": {
    weekRange: { start: 33, end: 36 },
    milestones: [
      {
        category: "movement",
        title: "Sits up without support",
        subtitle: "Sitting may look much steadier now, even if your baby still topples sometimes.",
        expandedDetail:
          "You may notice your baby staying upright longer, catching themselves with their hands, or leaning to reach something and coming back up again.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Moves to get where they want to go",
        subtitle: "Your baby may roll, pivot, shuffle, scoot, or crawl to get closer to something that interests them.",
        expandedDetail:
          "This does not have to look like classic crawling. What matters is the growing effort to move on purpose toward a person, toy, or place they want.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Looks when you call their name",
        subtitle: "Your baby may pause, turn, or brighten when they hear their name in a familiar voice.",
        expandedDetail:
          "Sometimes it is a quick glance. Sometimes it is a clearer turn toward you or a pause in what they were doing when they hear their name.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Babbles with repeated sounds",
        subtitle: "You may hear more strings of sounds like \"mamamama\" or \"babababa\" now.",
        expandedDetail:
          "Babbling often starts to sound more patterned and more social at this age, especially in playful moments when your baby is trying to stay in the exchange with you.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Passes a toy from one hand to the other",
        subtitle: "Their hand use may look more coordinated and more deliberate now.",
        expandedDetail:
          "You may notice your baby holding something, shifting it across, turning it, and then bringing it right back to inspect or mouth again.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Looks for a partly hidden object",
        subtitle: "If part of a toy is still visible, your baby may try to find the rest of it.",
        expandedDetail:
          "This can look like lifting a cloth, batting something aside, or reaching toward the hidden part once they realise the object is still there.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      33: {
        title: "Week 33",
        bodyTemplate:
          "Your baby is becoming more intentional now. Getting to people, reaching for objects, and making sounds may start to feel more clearly purposeful.",
      },
      34: {
        title: "Week 34",
        bodyTemplate:
          "This stage often feels more active and more determined. Your baby may want to move closer, hold on longer, and stay involved in whatever catches their attention.",
      },
      35: {
        title: "Week 35",
        bodyTemplate:
          "A lot is happening through movement and communication right now. More babbling, more reaching, and more interest in how things work are all part of this stage.",
      },
      36: {
        title: "Week 36",
        bodyTemplate:
          "By the end of this stage, many babies feel more expressive and more physically driven. They are not just noticing the world now - they are trying to move through it, test it, and respond to it.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("8-9-month", "In the ninth month, development often shows up through more purpose and more persistence. Steadier sitting, stronger babbling, searching for things, and trying to get where they want to go are all signs that your baby is becoming more active in how they explore and communicate."),
  },
  "9-10-month": {
    weekRange: { start: 37, end: 40 },
    milestones: [
      {
        category: "movement",
        title: "Pulls up to stand",
        subtitle: "Your baby may start pulling themselves up using furniture or your hands.",
        expandedDetail:
          "At first this can look shaky and effortful. What matters is the growing drive to get upright and stay there for a few moments once they do.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Moves along furniture or changes position on purpose",
        subtitle:
          "Your baby may shift along a sofa, lower themselves down, or move between sitting and floor positions more deliberately.",
        expandedDetail:
          "This does not have to look smooth yet. It often shows up as side-steps while holding on, careful lowering, or repeated attempts to get where they want to go.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Understands simple familiar words or routines",
        subtitle:
          "Your baby may react to words like their name, \"no,\" or familiar routine words such as \"bye-bye.\"",
        expandedDetail:
          "Sometimes this looks like a pause, a turn, a look toward you, or a small change in what they are doing when they hear something they recognise.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Babbles in longer strings",
        subtitle: "You may hear more repeated sound patterns that feel closer to conversation now.",
        expandedDetail:
          "Babbling often starts to sound more varied and more social at this age, especially during playful back-and-forth moments when your baby is trying to stay engaged with you.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Looks for a fully hidden object",
        subtitle: "If a toy disappears under a cloth, your baby may try to find it.",
        expandedDetail:
          "This can look like lifting the cloth, pulling something aside, or reaching straight to where they think the object still is. It shows stronger memory and problem-solving than before.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Tests objects by banging, dropping, or turning them",
        subtitle: "Your baby may repeat the same actions with an object to see what happens.",
        expandedDetail:
          "This often looks messy or repetitive, but it is real learning. Your baby is finding out how things sound, move, fall, and feel by trying them again and again.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      37: {
        title: "Week 37",
        bodyTemplate:
          "Your baby is becoming more determined now. Getting to things, testing how they work, and staying in interaction with you may feel more purposeful this week.",
      },
      38: {
        title: "Week 38",
        bodyTemplate:
          "This stage often feels more active and more curious. Your baby may want to move closer, hold on longer, and explore the same object again and again.",
      },
      39: {
        title: "Week 39",
        bodyTemplate:
          "A lot is happening through movement, sound, and repetition right now. Babbling, pulling up, banging, dropping, and searching are all part of how your baby learns at this age.",
      },
      40: {
        title: "Week 40",
        bodyTemplate:
          "By the end of this stage, many babies feel more expressive and more physically driven. They are not just noticing the world now - they are trying to reach it, test it, and join in with it.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("9-10-month", "In the tenth month, development often shows up through more persistence and more experimentation. Pulling up, stronger babbling, searching for things, and testing objects in different ways are all signs that your baby is becoming more active in how they explore and communicate."),
  },
  "10-11-month": {
    weekRange: { start: 41, end: 44 },
    milestones: [
      {
        category: "movement",
        title: "Pulls up and stays standing",
        subtitle: "Your baby may pull up using furniture and stay there for a little longer now.",
        expandedDetail:
          "At first it can still look shaky. What matters is the growing drive to get upright and remain there long enough to look around, reach, or plan the next move.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Cruises along furniture",
        subtitle: "While holding on, your baby may start stepping sideways along furniture.",
        expandedDetail:
          "This often begins with one or two cautious side-steps. It does not need to look smooth yet-just more clearly like movement with a destination.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Understands familiar words and simple routines",
        subtitle:
          "Your baby may react more clearly to words like their name, \"no,\" \"bye-bye,\" or familiar routine words.",
        expandedDetail:
          "Sometimes this looks like a pause, a look toward you, or a change in what they are doing when they hear something they recognise. Understanding often becomes more obvious before first real words arrive.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Babbles in longer, more varied strings",
        subtitle: "You may hear more repeated sound patterns that feel closer to conversation now.",
        expandedDetail:
          "Babbling may sound more layered and social at this age, especially during playful back-and-forth moments when your baby is trying to stay engaged with you.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Picks up small things with thumb and finger",
        subtitle: "Your baby's hand control may look more precise now, especially with tiny objects.",
        expandedDetail:
          "This can start as a clumsy pinch and become more accurate over time. It is a big shift from grabbing with the whole hand to using fingers on purpose.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Tests objects in different ways",
        subtitle:
          "Your baby may drop, bang, turn, or inspect the same object again and again to see what happens.",
        expandedDetail:
          "This can look repetitive, but it is real learning. Your baby is working out how things sound, move, and respond through repeated little experiments.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      41: {
        title: "Week 41",
        bodyTemplate:
          "Your baby is becoming more purposeful now. Standing, cruising, and getting to what they want may feel much more deliberate this week.",
      },
      42: {
        title: "Week 42",
        bodyTemplate:
          "This stage often feels more curious and more hands-on. Your baby may want to test everything by dropping it, turning it, banging it, or trying to get closer to it.",
      },
      43: {
        title: "Week 43",
        bodyTemplate:
          "A lot is happening through movement, sound, and understanding right now. Longer babbling, stronger reactions to familiar words, and more determined movement are all part of this stage.",
      },
      44: {
        title: "Week 44",
        bodyTemplate:
          "By the end of this stage, many babies feel more expressive and more physically confident. They are not just exploring the world now - they are trying to move through it and influence what happens around them.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("10-11-month", "In the eleventh month, development often shows up through more confidence and more experimentation. Cruising, stronger babbling, understanding familiar words, and using hands more precisely are all signs that your baby is becoming more active in how they explore and communicate."),
  },
  "11-12-month": {
    weekRange: { start: 45, end: 48 },
    milestones: [
      {
        category: "movement",
        title: "Stands while holding on",
        subtitle: "Your baby may stand more steadily now while holding furniture or your hands.",
        expandedDetail:
          "At first it can still look wobbly, but you may notice more control, longer standing, and less urgency to drop back down straight away.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Takes a few steps with support - or begins first independent steps",
        subtitle: "Your baby may cruise confidently, walk with hands held, or even try a few steps on their own.",
        expandedDetail:
          "This stage varies a lot. For some babies it looks like confident cruising; for others it includes one or two quick independent steps before dropping down again.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Waves or uses simple gestures",
        subtitle: "Your baby may wave, reach up to be picked up, or use other small gestures to communicate.",
        expandedDetail:
          "These gestures often appear before many clear words do. They show that your baby is starting to communicate on purpose, not just react.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Understands familiar words like \"no\" or \"bye-bye\"",
        subtitle:
          "Your baby may pause, stop briefly, or react when they hear familiar words in a familiar voice.",
        expandedDetail:
          "Sometimes this looks like a pause in movement, a look toward you, or a clear reaction to a routine word they have heard many times before.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Puts an object into a container",
        subtitle: "Your baby may enjoy dropping a block, spoon, or toy into a cup, bowl, or box.",
        expandedDetail:
          "This can look simple, but it is a real thinking skill. Your baby is learning about space, cause and effect, and what happens when objects go in, out, or disappear.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Looks for something you hide",
        subtitle: "If you hide a toy under a cloth or blanket, your baby may try to find it.",
        expandedDetail:
          "This often looks more confident now than it did a month ago. Your baby may pull the cloth away directly or reach straight to the place where they expect the toy to be.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      45: {
        title: "Week 45",
        bodyTemplate:
          "Your baby is becoming more confident now. Standing, cruising, and getting to what they want may feel more steady and more deliberate this week.",
      },
      46: {
        title: "Week 46",
        bodyTemplate:
          "This stage often feels more social and more interactive. Your baby may want to show you things, copy simple actions, and stay closely involved in what you're doing.",
      },
      47: {
        title: "Week 47",
        bodyTemplate:
          "A lot is happening through movement, understanding, and imitation right now. Gestures, clearer reactions to familiar words, and more purposeful play are all part of this stage.",
      },
      48: {
        title: "Week 48",
        bodyTemplate:
          "By the end of this stage, many babies feel more expressive and more physically capable. They are not just exploring the world now - they are trying to join in with it, communicate with it, and move through it more independently.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("11-12-month", "In the twelfth month, development often shows up through more confidence and more connection. Standing, cruising, simple gestures, understanding familiar words, and more purposeful play are all signs that your baby is becoming more active in how they explore and communicate."),
  },
  "12-13-month": {
    weekRange: { start: 49, end: 52 },
    milestones: [
      {
        category: "movement",
        title: "Walks on their own or takes several independent steps",
        subtitle: "Your child may now walk short distances without needing to hold on.",
        expandedDetail:
          "Some children are already walking across a room, while others are taking a few steady steps at a time. What matters here is growing confidence moving independently, not how polished it looks.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Stoops to pick something up, then stands again",
        subtitle:
          "While standing or walking, your child may squat or bend down to grab something and come back up again.",
        expandedDetail:
          "This shows better balance and body control than earlier months. At first it may still look slow or careful, but it is a big shift in how independently they can move through the room.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Points to ask for something or to show interest",
        subtitle: "Your child may point to get help, ask for something, or draw your attention to what they notice.",
        expandedDetail:
          "This is one of the clearest early communication signs at this age. It often looks like pointing toward an object, a person, or a place, then looking back to you to make sure you're part of it too.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Tries one or two words besides \"mama\" or \"dada\"",
        subtitle: "You may hear a simple word or word-like attempt used with intention now.",
        expandedDetail:
          "It does not need to sound perfect to count. A short, repeated attempt used for the same person, object, or routine is already meaningful communication.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Puts objects in and takes them out",
        subtitle: "Your child may enjoy dropping things into a cup, bowl, or box and taking them back out again.",
        expandedDetail:
          "This can look repetitive, but it is real learning. Your child is exploring space, cause and effect, and what happens when objects go in, out, disappear, and return.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Copies simple actions with objects",
        subtitle:
          "Your child may begin to imitate what you do, like brushing, stirring, pressing, or putting something where it belongs.",
        expandedDetail:
          "Imitation becomes a major learning tool around this age. When your child copies a simple action, they are showing attention, memory, and early problem-solving all at once.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      49: {
        title: "Week 49",
        bodyTemplate:
          "Your child is becoming more intentional now. Walking, pointing, and trying to make themselves understood may feel more clearly purposeful this week.",
      },
      50: {
        title: "Week 50",
        bodyTemplate:
          "This stage often feels more interactive and more hands-on. Your child may want to carry things, copy what you do, and show you what they're interested in.",
      },
      51: {
        title: "Week 51",
        bodyTemplate:
          "A lot is happening through movement, gestures, and understanding right now. Early words, clearer pointing, and more confident movement are all part of this stage.",
      },
      52: {
        title: "Week 52",
        bodyTemplate:
          "By the end of this stage, many children feel more expressive and more physically confident. They are not just exploring the world now - they are trying to communicate with it, move through it, and influence what happens next.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("12-13-month", "In the thirteenth month, development often shows up through more confidence and more communication. Walking, pointing, trying early words, and exploring how things fit, move, and work are all signs that your child is becoming more active in how they connect with the world around them."),
  },
  "13-14-month": {
    weekRange: { start: 53, end: 56 },
    milestones: [
      {
        category: "movement",
        title: "Walks more steadily on their own",
        subtitle: "Your child may now walk more often without needing to hold on.",
        expandedDetail:
          "Some children are still a little wobbly, while others are already crossing rooms with purpose. What matters here is growing confidence moving independently, not perfect balance.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Stoops to pick something up and keeps moving",
        subtitle: "While standing or walking, your child may bend down for a toy and come back up again.",
        expandedDetail:
          "This shows better balance and body control than earlier months. At first it may still look careful or slow, but it is a big shift in how independently they move through space.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Points to ask for something or show you something",
        subtitle: "Your child may point more clearly now to get help, ask, or share interest.",
        expandedDetail:
          "This often looks like pointing at an object and then checking back with you. It is one of the clearest signs that communication is becoming more intentional.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Tries a few simple words",
        subtitle: "You may hear one or two words, or word-like attempts, used on purpose.",
        expandedDetail:
          "It does not need to sound perfect to count. A short, repeated attempt used for the same person, object, or routine is already meaningful communication.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Puts objects in and takes them out on purpose",
        subtitle: "Your child may enjoy dropping things into a cup, box, or bowl and taking them back out again.",
        expandedDetail:
          "This can look repetitive, but it is real learning. Your child is exploring space, cause and effect, and what happens when objects go in, out, disappear, and return.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Copies simple actions with objects",
        subtitle:
          "Your child may begin to imitate what you do, like stirring, brushing, pressing, or putting something where it belongs.",
        expandedDetail:
          "Imitation becomes a major learning tool around this age. When your child copies a simple action, they are showing attention, memory, and early problem-solving all at once.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      53: {
        title: "Week 53",
        bodyTemplate:
          "Your child is becoming more purposeful now. Walking, carrying, and trying to make themselves understood may feel more clearly directed this week.",
      },
      54: {
        title: "Week 54",
        bodyTemplate:
          "This stage often feels more hands-on and more social. Your child may want to bring you things, copy what you do, and stay close while they explore.",
      },
      55: {
        title: "Week 55",
        bodyTemplate:
          "A lot is happening through movement, gestures, and understanding right now. Pointing, trying simple words, and moving more confidently are all part of this stage.",
      },
      56: {
        title: "Week 56",
        bodyTemplate:
          "By the end of this stage, many children feel more expressive and more physically sure of themselves. They are not just exploring the world now - they are trying to communicate with it and take part in it.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("13-14-month", "In the fourteenth month, development often shows up through more confidence and more communication. Walking, pointing, trying simple words, and exploring how things fit, move, and work are all signs that your child is becoming more active in how they connect with the world around them."),
  },
  "14-15-month": {
    weekRange: { start: 57, end: 60 },
    milestones: [
      {
        category: "movement",
        title: "Walks on their own more confidently",
        subtitle: "Your child may now walk more often without needing to hold on.",
        expandedDetail:
          "Some children still look a little wobbly, while others already move across rooms with purpose. What matters here is growing confidence moving independently, not perfect balance.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Stoops to pick something up and stands again",
        subtitle: "While standing or walking, your child may bend down for a toy and come back up again.",
        expandedDetail:
          "This shows better balance and body control than earlier months. At first it may still look careful or slow, but it is a big shift in how independently they move through space.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Points to ask for something or show you something",
        subtitle: "Your child may point more clearly now to get help, ask, or share interest.",
        expandedDetail:
          "This often looks like pointing at an object and then checking back with you. It is one of the clearest signs that communication is becoming more intentional.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Tries a few simple words",
        subtitle: "You may hear one or two words, or word-like attempts, used on purpose.",
        expandedDetail:
          "It does not need to sound perfect to count. A short, repeated attempt used for the same person, object, or routine is already meaningful communication.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Puts objects in and takes them out on purpose",
        subtitle: "Your child may enjoy dropping things into a cup, box, or bowl and taking them back out again.",
        expandedDetail:
          "This can look repetitive, but it is real learning. Your child is exploring space, cause and effect, and what happens when objects go in, out, disappear, and return.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Copies simple actions with objects",
        subtitle:
          "Your child may begin to imitate what you do, like stirring, brushing, pressing, or putting something where it belongs.",
        expandedDetail:
          "Imitation becomes a major learning tool around this age. When your child copies a simple action, they are showing attention, memory, and early problem-solving all at once.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      57: {
        title: "Week 57",
        bodyTemplate:
          "Your child is becoming more confident now. Walking, carrying, and trying to make themselves understood may feel more clearly directed this week.",
      },
      58: {
        title: "Week 58",
        bodyTemplate:
          "This stage often feels more active and more social. Your child may want to bring you things, copy what you do, and stay close while they explore.",
      },
      59: {
        title: "Week 59",
        bodyTemplate:
          "A lot is happening through movement, imitation, and understanding right now. Pointing, trying simple words, and testing how things work are all part of this stage.",
      },
      60: {
        title: "Week 60",
        bodyTemplate:
          "By the end of this stage, many children feel more expressive and more physically sure of themselves. They are not just exploring the world now - they are trying to communicate with it and take part in it.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("14-15-month", "In the fifteenth month, development often shows up through more confidence and more communication. Walking, pointing, trying simple words, and exploring how things fit, move, and work are all signs that your child is becoming more active in how they connect with the world around them."),
  },
  "15-16-month": {
    weekRange: { start: 61, end: 64 },
    milestones: [
      {
        category: "movement",
        title: "Walks more steadily on their own",
        subtitle: "Your child may now move around more confidently without needing to hold on.",
        expandedDetail:
          "Some children still look a little wobbly, while others are already walking across rooms with purpose. What matters here is growing confidence moving independently, not perfect balance.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Stoops to pick something up and keeps going",
        subtitle: "While walking, your child may bend down for a toy and come back up again without much help.",
        expandedDetail:
          "This shows better balance and body control than earlier months. At first it may still look careful or slow, but it is a big shift in how independently they move through space.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Points to ask, show, or get help",
        subtitle: "Your child may point more clearly now to ask for something or draw your attention to it.",
        expandedDetail:
          "This often looks like pointing at an object and then checking back with you. It is one of the clearest signs that communication is becoming more intentional.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Tries a few simple words",
        subtitle: "You may hear one or two words, or word-like attempts, used on purpose.",
        expandedDetail:
          "It does not need to sound perfect to count. A short, repeated attempt used for the same person, object, or routine is already meaningful communication.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Puts objects in and takes them out on purpose",
        subtitle: "Your child may enjoy dropping things into a cup, box, or bowl and taking them back out again.",
        expandedDetail:
          "This can look repetitive, but it is real learning. Your child is exploring space, cause and effect, and what happens when objects go in, out, disappear, and return.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Copies simple actions with objects",
        subtitle:
          "Your child may begin to imitate what you do, like stirring, brushing, pressing, or putting something where it belongs.",
        expandedDetail:
          "Imitation becomes a major learning tool around this age. When your child copies a simple action, they are showing attention, memory, and early problem-solving all at once.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      61: {
        title: "Week 61",
        bodyTemplate:
          "Your child is becoming more sure of themselves now. Walking, carrying, and trying to make themselves understood may feel more clearly directed this week.",
      },
      62: {
        title: "Week 62",
        bodyTemplate:
          "This stage often feels more hands-on and more social. Your child may want to bring you things, copy what you do, and stay close while they explore.",
      },
      63: {
        title: "Week 63",
        bodyTemplate:
          "A lot is happening through movement, imitation, and understanding right now. Pointing, trying simple words, and testing how things work are all part of this stage.",
      },
      64: {
        title: "Week 64",
        bodyTemplate:
          "By the end of this stage, many children feel more expressive and more physically steady. They are not just exploring the world now - they are trying to communicate with it and take part in it.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("15-16-month", "In the sixteenth month, development often shows up through more confidence and more communication. Walking more steadily, pointing, trying simple words, and copying what they see are all signs that your child is becoming more active in how they connect with the world around them."),
  },
  "16-17-month": {
    weekRange: { start: 65, end: 68 },
    milestones: [
      {
        category: "movement",
        title: "Walks steadily on their own",
        subtitle: "Your child may now move around more confidently without needing to hold on.",
        expandedDetail:
          "Some children still look a little uneven, while others already walk across rooms with real purpose. What matters here is growing confidence moving independently, not perfect balance.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Climbs on and off low furniture with help or tries to",
        subtitle: "Your child may want to get onto a sofa, chair, or step and work out how to get back down.",
        expandedDetail:
          "This often looks determined rather than smooth. It shows growing balance, planning, and body confidence as your child starts testing what their body can do.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Understands simple directions without gestures",
        subtitle: "Your child may follow a simple request like \"give it to me\" or \"come here\" without you having to point.",
        expandedDetail:
          "Sometimes this looks small - a pause, a look, then the action. Understanding often becomes clearer before speech fully catches up.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Tries several clear words",
        subtitle: "You may hear more words or clearer word-like attempts used for familiar people, objects, or routines.",
        expandedDetail:
          "It does not need to sound perfect to count. A repeated sound or word used in the same meaningful way is already real communication.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Scribbles or makes marks",
        subtitle: "Your child may enjoy making marks with a crayon, pencil, or similar tool.",
        expandedDetail:
          "At first it may be brief and messy. What matters is that your child is starting to connect hand movement with a visible result, which is a real shift in exploration and control.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Uses objects in simple purposeful ways",
        subtitle: "Your child may start using toys or everyday objects in more obvious, practical ways.",
        expandedDetail:
          "This can look like pushing a toy car, putting something into a container, or trying a spoon with purpose. It shows stronger imitation, problem-solving, and understanding of how things work.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      65: {
        title: "Week 65",
        bodyTemplate:
          "Your child is becoming more capable now. Walking, carrying, and getting what they want may feel more deliberate and more confident this week.",
      },
      66: {
        title: "Week 66",
        bodyTemplate:
          "This stage often feels more busy and more social. Your child may want to bring you things, copy what you do, and stay close while they explore.",
      },
      67: {
        title: "Week 67",
        bodyTemplate:
          "A lot is happening through movement, understanding, and repetition right now. Simple words, clearer pointing, and trying the same action again and again are all part of this stage.",
      },
      68: {
        title: "Week 68",
        bodyTemplate:
          "By the end of this stage, many children feel more expressive and more physically steady. They are not just exploring the world now - they are trying to influence it, communicate with it, and move through it with more confidence.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("16-17-month", "In the seventeenth month, development often shows up through more confidence and more intention. Walking more steadily, understanding simple directions, trying more words, and using objects in more purposeful ways are all signs that your child is becoming more active in how they connect with the world around them."),
  },
  "17-18-month": {
    weekRange: { start: 69, end: 72 },
    milestones: [
      {
        category: "movement",
        title: "Walks steadily on their own",
        subtitle: "Your child may now move around more confidently without needing to hold on.",
        expandedDetail:
          "Some children still look a little uneven, while others already walk across rooms with real purpose. What matters here is growing confidence moving independently, not perfect balance.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Climbs on and off low furniture",
        subtitle: "Your child may want to get onto a sofa, chair, or low step and work out how to get back down.",
        expandedDetail:
          "This often looks determined rather than smooth. It shows growing balance, planning, and body confidence as your child starts testing what their body can do.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Follows a simple direction without you pointing",
        subtitle: "Your child may follow a simple request like \"give it to me\" or \"come here\" without needing a gesture.",
        expandedDetail:
          "Sometimes this looks small - a pause, a look, then the action. Understanding often becomes clearer before speech fully catches up.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Tries three or more words besides \"mama\" or \"dada\"",
        subtitle:
          "You may hear more clear words or word-like attempts used for familiar people, objects, or routines.",
        expandedDetail:
          "It does not need to sound perfect to count. A repeated sound or word used in the same meaningful way is already real communication.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Scribbles or makes marks",
        subtitle: "Your child may enjoy making marks with a crayon, pencil, or similar tool.",
        expandedDetail:
          "At first it may be brief and messy. What matters is that your child is starting to connect hand movement with a visible result, which is a real shift in exploration and control.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Uses objects in simple purposeful ways",
        subtitle: "Your child may start using toys or everyday objects in more obvious, practical ways.",
        expandedDetail:
          "This can look like pushing a toy car, trying a spoon, putting something into a container, or repeating an action to see what happens. It shows stronger imitation, problem-solving, and understanding of how things work.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      69: {
        title: "Week 69",
        bodyTemplate:
          "Your child is becoming more capable now. Walking, climbing, and getting what they want may feel more deliberate and more confident this week.",
      },
      70: {
        title: "Week 70",
        bodyTemplate:
          "This stage often feels busier and more social. Your child may want to bring you things, copy what you do, and stay close while they explore.",
      },
      71: {
        title: "Week 71",
        bodyTemplate:
          "A lot is happening through movement, understanding, and repetition right now. Simple words, clearer pointing, and trying the same action again and again are all part of this stage.",
      },
      72: {
        title: "Week 72",
        bodyTemplate:
          "By the end of this stage, many children feel more expressive and more physically steady. They are not just exploring the world now - they are trying to influence it, communicate with it, and move through it with more confidence.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("17-18-month", "In the eighteenth month, development often shows up through more confidence and more intention. Walking more steadily, understanding simple directions, trying more words, and using objects in more purposeful ways are all signs that your child is becoming more active in how they connect with the world around them."),
  },
  "18-19-month": {
    weekRange: { start: 73, end: 76 },
    milestones: [
      {
        category: "movement",
        title: "Walks steadily on their own",
        subtitle: "Your child may now move around with more confidence and fewer falls.",
        expandedDetail:
          "Some children still look a little uneven, but many now walk with clear purpose from place to place. What matters here is steadier independent movement, not perfect balance.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Climbs on and off low furniture",
        subtitle: "Your child may want to get onto a sofa, chair, or low step and work out how to get back down.",
        expandedDetail:
          "This often looks determined rather than graceful. It shows growing balance, planning, and body confidence as your child tests what their body can do.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Follows a simple direction without you pointing",
        subtitle: "Your child may follow a request like \"give it to me\" or \"come here\" without needing a gesture.",
        expandedDetail:
          "Sometimes this looks small - a pause, a look, then the action. Understanding often becomes clearer before speech fully catches up.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Tries several clear words",
        subtitle: "You may hear more words or clearer word-like attempts used for familiar people, objects, or routines.",
        expandedDetail:
          "It does not need to sound perfect to count. A repeated sound or word used in the same meaningful way is already real communication.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Scribbles or makes marks",
        subtitle: "Your child may enjoy making marks with a crayon, pencil, or similar tool.",
        expandedDetail:
          "At first it may be brief and messy. What matters is that your child is starting to connect hand movement with a visible result, which is a real shift in exploration and control.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Uses objects in simple purposeful ways",
        subtitle: "Your child may use toys or everyday objects in more obvious, practical ways now.",
        expandedDetail:
          "This can look like pushing a toy car, trying a spoon, putting something into a container, or repeating an action to see what happens. It shows stronger imitation, problem-solving, and understanding of how things work.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      73: {
        title: "Week 73",
        bodyTemplate:
          "Your child is becoming more sure of themselves now. Walking, climbing, and getting what they want may feel more steady and more intentional this week.",
      },
      74: {
        title: "Week 74",
        bodyTemplate:
          "This stage often feels busier and more social. Your child may want to bring you things, copy what you do, and stay close while they explore.",
      },
      75: {
        title: "Week 75",
        bodyTemplate:
          "A lot is happening through movement, understanding, and repetition right now. Simple words, clearer pointing, and trying the same action again and again are all part of this stage.",
      },
      76: {
        title: "Week 76",
        bodyTemplate:
          "By the end of this stage, many children feel more expressive and more physically steady. They are not just exploring the world now - they are trying to influence it, communicate with it, and move through it with more confidence.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("18-19-month", "In the nineteenth month, development often shows up through more confidence and more intention. Steadier walking, understanding simple directions, trying more words, and using objects in more purposeful ways are all signs that your child is becoming more active in how they connect with the world around them."),
  },
  "19-20-month": {
    weekRange: { start: 77, end: 80 },
    milestones: [
      {
        category: "movement",
        title: "Walks steadily and changes direction easily",
        subtitle: "Your child may now move around with more balance and more confidence.",
        expandedDetail:
          "You may notice fewer sudden tumbles, easier turning, and more purpose in how they move from one place to another. What matters is growing control, not perfectly smooth walking.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Climbs onto low furniture and tries bigger movements",
        subtitle: "Your child may want to climb, step up, or test what their body can do.",
        expandedDetail:
          "This often looks determined rather than graceful. It shows growing balance, planning, and confidence as your child experiments with getting up, down, and over things.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Follows simple directions more reliably",
        subtitle:
          "Your child may respond to simple requests like \"bring it here\" or \"give it to me\" without needing a gesture.",
        expandedDetail:
          "Sometimes this looks small - a pause, a look, then the action. Understanding often grows faster than spoken language at this stage, so following familiar directions is a strong sign of progress.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Uses more clear words with purpose",
        subtitle:
          "You may hear more words or clearer word attempts used for familiar people, objects, or routines.",
        expandedDetail:
          "It does not need to sound perfect to count. A repeated word or sound used in the same meaningful way is already real communication, and many children become noticeably more verbal through this stretch.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Scribbles and enjoys making marks",
        subtitle: "Your child may enjoy using a crayon or similar tool to make visible marks.",
        expandedDetail:
          "At first it may be quick and messy. What matters is that your child is linking hand movement with a result they can see, which is a real shift in control and experimentation.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Uses everyday objects in simple purposeful ways",
        subtitle: "Your child may use toys and household objects in more obvious, practical ways now.",
        expandedDetail:
          "This can look like pushing a toy car, trying a spoon, putting objects into containers, or repeating an action to see what happens. It shows stronger imitation, problem-solving, and understanding of how things work.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      77: {
        title: "Week 77",
        bodyTemplate:
          "Your child is becoming more capable now. Walking, climbing, and getting what they want may feel more steady and more intentional this week.",
      },
      78: {
        title: "Week 78",
        bodyTemplate:
          "This stage often feels busier and more expressive. Your child may want to bring you things, copy what you do, and let you know more clearly what they want.",
      },
      79: {
        title: "Week 79",
        bodyTemplate:
          "A lot is happening through movement, understanding, and repetition right now. Simple words, clearer reactions to familiar directions, and trying the same action again and again are all part of this stage.",
      },
      80: {
        title: "Week 80",
        bodyTemplate:
          "By the end of this stage, many children feel more confident in both body and communication. They are not just exploring the world now - they are trying to influence it, respond to it, and move through it with more purpose.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("19-20-month", "In the twentieth month, development often shows up through more confidence and more intention. Steadier walking, understanding simple directions, trying more words, and using objects in more purposeful ways are all signs that your child is becoming more active in how they connect with the world around them."),
  },
  "20-21-month": {
    weekRange: { start: 81, end: 84 },
    milestones: [
      {
        category: "movement",
        title: "Walks steadily and changes direction easily",
        subtitle: "Your child may now move around with more balance and more confidence.",
        expandedDetail:
          "You may notice fewer sudden tumbles, easier turning, and more purpose in how they move from one place to another. What matters is growing control, not perfectly smooth walking.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Climbs onto low furniture and tries bigger movements",
        subtitle: "Your child may want to climb, step up, or test what their body can do.",
        expandedDetail:
          "This often looks determined rather than graceful. It shows growing balance, planning, and confidence as your child experiments with getting up, down, and over things.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Follows simple directions more reliably",
        subtitle:
          "Your child may respond to simple requests like \"bring it here\" or \"give it to me\" without needing a gesture.",
        expandedDetail:
          "Sometimes this looks small - a pause, a look, then the action. Understanding often grows faster than spoken language at this stage, so following familiar directions is a strong sign of progress.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Uses more clear words with purpose",
        subtitle:
          "You may hear more words or clearer word attempts used for familiar people, objects, or routines.",
        expandedDetail:
          "It does not need to sound perfect to count. A repeated word or sound used in the same meaningful way is already real communication, and many children become noticeably more verbal through this stretch.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Scribbles and enjoys making marks",
        subtitle: "Your child may enjoy using a crayon or similar tool to make visible marks.",
        expandedDetail:
          "At first it may be quick and messy. What matters is that your child is linking hand movement with a result they can see, which is a real shift in control and experimentation.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Uses everyday objects in simple purposeful ways",
        subtitle: "Your child may use toys and household objects in more obvious, practical ways now.",
        expandedDetail:
          "This can look like pushing a toy car, trying a spoon, putting objects into containers, or repeating an action to see what happens. It shows stronger imitation, problem-solving, and understanding of how things work.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      81: {
        title: "Week 81",
        bodyTemplate:
          "Your child is becoming more capable now. Walking, climbing, and getting what they want may feel more steady and more intentional this week.",
      },
      82: {
        title: "Week 82",
        bodyTemplate:
          "This stage often feels busier and more expressive. Your child may want to bring you things, copy what you do, and let you know more clearly what they want.",
      },
      83: {
        title: "Week 83",
        bodyTemplate:
          "A lot is happening through movement, understanding, and repetition right now. Simple words, clearer reactions to familiar directions, and trying the same action again and again are all part of this stage.",
      },
      84: {
        title: "Week 84",
        bodyTemplate:
          "By the end of this stage, many children feel more confident in both body and communication. They are not just exploring the world now - they are trying to influence it, respond to it, and move through it with more purpose.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("20-21-month", "In the twenty-first month, development often shows up through more confidence and more intention. Steadier walking, understanding simple directions, trying more words, and using objects in more purposeful ways are all signs that your child is becoming more active in how they connect with the world around them."),
  },
  "21-22-month": {
    weekRange: { start: 85, end: 88 },
    milestones: [
      {
        category: "movement",
        title: "Walks steadily and starts to move faster",
        subtitle: "Your child may now move around with more balance, more confidence, and bursts of speed.",
        expandedDetail:
          "You may notice easier turning, fewer falls, and short moments that look almost like running. What matters is growing control and confidence, not perfectly smooth movement.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Climbs onto low furniture and manages bigger movements",
        subtitle: "Your child may want to climb, step up, and test what their body can do in new ways.",
        expandedDetail:
          "This often looks determined rather than graceful. It shows stronger balance, planning, and confidence as your child experiments with getting up, down, and over things.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Follows simple directions more reliably",
        subtitle:
          "Your child may respond to familiar requests like \"bring it here\" or \"give it to me\" without needing a gesture.",
        expandedDetail:
          "Sometimes this looks small - a pause, a look, then the action. Understanding often becomes clearer before speech fully catches up, so this is a strong sign of progress.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Uses more words with purpose",
        subtitle:
          "You may hear more clear words or word-like attempts used for familiar people, objects, and routines.",
        expandedDetail:
          "It does not need to sound perfect to count. A repeated word used in the same meaningful way is already real communication, and many toddlers become noticeably more verbal through this stretch.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Scribbles and enjoys making marks",
        subtitle: "Your child may enjoy using a crayon or similar tool to make visible marks.",
        expandedDetail:
          "At first it may still be quick and messy. What matters is that your child is linking hand movement with a result they can see, which is a real shift in control, experimentation, and intention.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Uses everyday objects in more purposeful ways",
        subtitle: "Your child may use toys and household objects in more obvious, practical, or pretend-like ways now.",
        expandedDetail:
          "This can look like pushing a toy car, using a spoon with purpose, putting objects into containers, or copying simple real-life actions. It shows stronger imitation, problem-solving, and understanding of how things work.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      85: {
        title: "Week 85",
        bodyTemplate:
          "Your child is becoming more capable now. Walking, climbing, and getting what they want may feel more steady and more intentional this week.",
      },
      86: {
        title: "Week 86",
        bodyTemplate:
          "This stage often feels busier and more expressive. Your child may want to bring you things, copy what you do, and make their wishes clearer than before.",
      },
      87: {
        title: "Week 87",
        bodyTemplate:
          "A lot is happening through movement, understanding, and repetition right now. More words, stronger reactions to familiar directions, and doing the same action again and again are all part of this stage.",
      },
      88: {
        title: "Week 88",
        bodyTemplate:
          "By the end of this stage, many children feel more confident in both body and communication. They are not just exploring the world now - they are trying to influence it, respond to it, and move through it with more purpose.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("21-22-month", "In the twenty-second month, development often shows up through more confidence and more intention. Steadier walking, following simple directions, using more words, and exploring objects in more purposeful ways are all signs that your child is becoming more active in how they connect with the world around them."),
  },
  "22-23-month": {
    weekRange: { start: 89, end: 92 },
    milestones: [
      {
        category: "movement",
        title: "Runs or moves with more speed and control",
        subtitle: "Your child may now move faster, turn more easily, and recover balance more smoothly.",
        expandedDetail:
          "This does not need to look athletic. What matters is that walking is starting to shift into quicker, more confident movement with fewer sudden tumbles.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Kicks a ball or tries with clear intention",
        subtitle: "Your child may start swinging a foot toward a ball instead of only walking into it.",
        expandedDetail:
          "At first it may look awkward or more like a push than a true kick. What matters is the growing coordination to balance, aim, and try the movement on purpose.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Follows two-step familiar directions",
        subtitle: "Your child may now handle simple directions with two parts, especially in familiar routines.",
        expandedDetail:
          "This can look like \"go get your shoes and bring them here\" or \"pick it up and give it to me.\" Understanding often becomes more obvious in everyday routines before speech fully catches up.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Uses two words together",
        subtitle: "You may hear short combinations like \"more milk,\" \"mummy come,\" or \"bye dog.\"",
        expandedDetail:
          "It does not need to be frequent or perfectly clear to count. What matters is that your child is beginning to join words together to express one fuller idea.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Begins simple pretend play",
        subtitle: "Your child may start pretending with toys or everyday objects in more imaginative ways.",
        expandedDetail:
          "This can look like feeding a doll, talking on a toy phone, or stirring an empty bowl as if making something. It shows growing imagination, memory, and understanding of everyday life.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Sorts or matches simple shapes, colours, or objects",
        subtitle: "Your child may begin grouping similar things or noticing how objects fit together.",
        expandedDetail:
          "This can look like putting similar items together, matching basic pieces, or trying shape-sorter openings with more intention than before. It reflects stronger problem-solving and attention to patterns.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      89: {
        title: "Week 89",
        bodyTemplate:
          "Your child is becoming more expressive now. Movement, words, and little acts of independence may feel more clearly intentional this week.",
      },
      90: {
        title: "Week 90",
        bodyTemplate:
          "This stage often feels busier and more interactive. Your child may want to copy what you do, show you things, and let you know more clearly what they want.",
      },
      91: {
        title: "Week 91",
        bodyTemplate:
          "A lot is happening through understanding, repetition, and pretend play right now. Following familiar directions, using more words, and repeating favourite actions are all part of this stage.",
      },
      92: {
        title: "Week 92",
        bodyTemplate:
          "By the end of this stage, many children feel more confident in both body and communication. They are not just exploring the world now - they are trying to participate in it, influence it, and make sense of it.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("22-23-month", "In the twenty-third month, development often shows up through more confidence and more connection. Stronger walking, following simple directions, using more words, and starting more imaginative play are all signs that your child is becoming more active in how they understand and engage with the world around them."),
  },
  "23-24-month": {
    weekRange: { start: 93, end: 96 },
    milestones: [
      {
        category: "movement",
        title: "Runs with more speed and control",
        subtitle: "Your child may now move faster, turn more easily, and recover balance more smoothly.",
        expandedDetail:
          "This does not need to look athletic. What matters is that walking has shifted into quicker, more confident movement with fewer sudden tumbles.",
        exploreCategory: "move",
      },
      {
        category: "movement",
        title: "Kicks a ball with clear intention",
        subtitle: "Your child may now swing a foot toward a ball instead of only walking into it.",
        expandedDetail:
          "At first it may still look awkward or more like a push than a true kick. What matters is the growing coordination to balance, aim, and try the movement on purpose.",
        exploreCategory: "move",
      },
      {
        category: "social",
        title: "Follows two-step familiar directions",
        subtitle: "Your child may now manage simple directions with two parts, especially in everyday routines.",
        expandedDetail:
          "This can look like \"go get your shoes and bring them here\" or \"pick it up and give it to me.\" Understanding often becomes most obvious in familiar moments before speech fully catches up.",
        exploreCategory: "play",
      },
      {
        category: "social",
        title: "Uses two words together",
        subtitle: "You may hear short combinations like \"more juice,\" \"mummy come,\" or \"bye dog.\"",
        expandedDetail:
          "It does not need to be frequent or perfectly clear to count. What matters is that your child is beginning to join words together to express one fuller idea.",
        exploreCategory: "play",
      },
      {
        category: "explorement",
        title: "Begins simple pretend play",
        subtitle: "Your child may start pretending with toys or everyday objects in more imaginative ways.",
        expandedDetail:
          "This can look like feeding a doll, talking on a toy phone, stirring an empty bowl, or putting a toy to bed. It shows growing imagination, memory, and understanding of everyday life.",
        exploreCategory: "spark",
      },
      {
        category: "explorement",
        title: "Sorts or matches simple shapes, colours, or objects",
        subtitle: "Your child may begin grouping similar things or noticing how objects fit together.",
        expandedDetail:
          "This can look like putting similar items together, matching simple pieces, or trying shape-sorter openings with more intention than before. It reflects stronger problem-solving and attention to patterns.",
        exploreCategory: "spark",
      },
    ],
    weeklyTopNotes: {
      93: {
        title: "Week 93",
        bodyTemplate:
          "Your child is becoming more expressive now. Movement, words, and little acts of independence may feel more clearly intentional this week.",
      },
      94: {
        title: "Week 94",
        bodyTemplate:
          "This stage often feels busier and more interactive. Your child may want to copy what you do, show you things, and let you know more clearly what they want.",
      },
      95: {
        title: "Week 95",
        bodyTemplate:
          "A lot is happening through understanding, repetition, and pretend play right now. Following familiar directions, using more words, and repeating favourite actions are all part of this stage.",
      },
      96: {
        title: "Week 96",
        bodyTemplate:
          "By the end of this stage, many children feel more confident in both body and communication. They are not just exploring the world now - they are trying to participate in it, influence it, and make sense of it.",
      },
    },
    monthlyBottomNote:
      makeMonthlyBottomNote("23-24-month", "In the twenty-fourth month, development often shows up through more confidence and more connection. Stronger running, following simple directions, using short phrases, and more imaginative play are all signs that your child is becoming more active in how they understand and engage with the world around them."),
  },
};

export function getMilestoneBandKey(ageInWeeks: number): MilestoneBandKey | null {
  for (const key of MILESTONE_BAND_ORDER) {
    const range = MILESTONE_BANDS[key].weekRange;
    if (ageInWeeks >= range.start && ageInWeeks <= range.end) return key;
  }
  return null;
}

export function resolveDisplayBandKey(ageInWeeks: number): MilestoneBandKey | null {
  const directBand = getMilestoneBandKey(ageInWeeks);
  if (directBand) return directBand;
  if (ageInWeeks > 96) return "23-24-month";
  return null;
}

function getMilestoneTopPronouns(gender: "girl" | "boy" | "unspecified") {
  if (gender === "boy") return { obj: "him", poss: "his" };
  if (gender === "girl") return { obj: "her", poss: "her" };
  return { obj: "them", poss: "their" };
}

export function getMilestoneTopWeekLabel(bandKey: MilestoneBandKey, ageInWeeks: number): number {
  if (bandKey === "0-1-month") {
    if (ageInWeeks <= 0) return 1;
    if (ageInWeeks === 1) return 2;
    if (ageInWeeks === 2) return 3;
    return 4;
  }
  const range = MILESTONE_BANDS[bandKey].weekRange;
  return Math.min(range.end, Math.max(range.start, ageInWeeks));
}

export function getNearestMilestoneTopNote(
  bandKey: MilestoneBandKey,
  requestedWeek: number
): MilestoneWeeklyTopNote | null {
  const weeklyTopNotes = MILESTONE_BANDS[bandKey].weeklyTopNotes;
  const candidateWeeks = Object.keys(weeklyTopNotes)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  if (candidateWeeks.length === 0) return null;
  if (weeklyTopNotes[requestedWeek]) return weeklyTopNotes[requestedWeek];

  const nearestWeek = candidateWeeks.reduce((closest, current) => {
    if (Math.abs(current - requestedWeek) < Math.abs(closest - requestedWeek)) {
      return current;
    }
    return closest;
  }, candidateWeeks[0]);

  return weeklyTopNotes[nearestWeek] ?? null;
}

export function getMilestoneTopWeeklyNote(
  ageInWeeks: number,
  gender: "girl" | "boy" | "unspecified"
): { title: string; body: string } | null {
  const bandKey = resolveDisplayBandKey(ageInWeeks);
  if (!bandKey) return null;
  const week = getMilestoneTopWeekLabel(bandKey, ageInWeeks);
  const note = getNearestMilestoneTopNote(bandKey, week);
  if (!note) return null;
  const pronouns = getMilestoneTopPronouns(gender);
  const body = note.bodyTemplate
    .replace(/\{obj\}/g, pronouns.obj)
    .replace(/\{poss\}/g, pronouns.poss);
  return { title: note.title, body };
}
