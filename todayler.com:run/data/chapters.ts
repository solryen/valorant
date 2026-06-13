export type ChapterThemeKey = "a" | "b" | "c";

type AppLanguage = "en" | "el";

type LocalizedText = {
  en: string;
  el: string;
};

export type ChapterRecord = {
  chapterIndex: number;
  chapterName: string;
  chapterRangeLabel: string;
  chapterOneLiner: string;
  headerTheme: ChapterThemeKey;
  weeklyTextTemplate: string;
};

type ChapterSeed = {
  chapterName: LocalizedText;
  chapterRangeLabel: LocalizedText;
  chapterOneLiner: LocalizedText;
  headerTheme: ChapterThemeKey;
  weeklyLines: { en: string[]; el: string[] };
};

const CHAPTER_SEEDS: ChapterSeed[] = [
  {
    chapterName: { en: "The Wonder Stage", el: "Το Στάδιο του Θαύματος" },
    chapterRangeLabel: { en: "Weeks 1-8", el: "Εβδομάδες 1-8" },
    chapterOneLiner: {
      en: "Everything is new. Even the tiniest reactions are your baby beginning to understand the world.",
      el: "Όλα είναι καινούρια. Ακόμα και οι πιο μικρές αντιδράσεις δείχνουν ότι το μωρό σου αρχίζει να καταλαβαίνει τον κόσμο.",
    },
    headerTheme: "a",
    weeklyLines: {
      en: [
        "{name} is just beginning to notice the world exists. Your face, your voice, and your warmth are literally everything right now.",
        "Tiny patterns are starting. The way {subj} moves, reacts, or calms is already telling you something about who {subj} is.",
        "A pause, a look, or a small movement is {name} beginning to respond to what's around {obj}. These moments are easy to miss and worth noticing.",
        "Faces and voices are shaping {poss} mind more than anything else right now. Yours most of all.",
        "{name}'s world is still very small, but it's becoming more social. A pause or a tiny sound back is already part of a real conversation.",
        "You may start to feel like you understand {obj} a little more this week. Small patterns in how {subj} looks at you and settles are beginning to emerge.",
        "A longer look, a softer sound, or a brief smile can be a real sign that connection is growing. Don't brush these off.",
        "{name} is becoming more present with you. Still tiny, but beginning to take part in the world more clearly.",
      ],
      el: [
        "{name} αρχίζει τώρα να καταλαβαίνει ότι ο κόσμος υπάρχει. Το πρόσωπό σου, η φωνή σου και η ζεστασιά σου είναι τα πάντα αυτή την περίοδο.",
        "Στην 2η εβδομάδα εμφανίζονται μικρά μοτίβα. Ο τρόπος που {name} κινείται και ηρεμεί σου δείχνει ήδη την προσωπικότητά της.",
        "Στην 3η εβδομάδα μια παύση ή ένα βλέμμα {name} είναι ουσιαστική απάντηση σε ό,τι συμβαίνει γύρω της.",
        "Στην 4η εβδομάδα οι φωνές και τα πρόσωπα διαμορφώνουν έντονα το μυαλό {name}, και κυρίως το δικό σου.",
        "Στην 5η εβδομάδα ο κόσμος {name} παραμένει μικρός, αλλά γίνεται πιο κοινωνικός και ζωντανός.",
        "Στην 6η εβδομάδα θα νιώσεις ότι διαβάζεις καλύτερα τ{name}, καθώς οι καθημερινές αντιδράσεις της γίνονται πιο σταθερές.",
        "Στην 7η εβδομάδα ένα πιο μεγάλο βλέμμα ή ένα μικρό χαμόγελο {name} δείχνει ότι ο δεσμός σας δυναμώνει.",
        "Στην 8η εβδομάδα {name} είναι πιο παρούσα μαζί σου και συμμετέχει πιο καθαρά στην καθημερινή αλληλεπίδραση.",
      ],
    },
  },
  {
    chapterName: { en: "The Awakening", el: "Η Αφύπνιση" },
    chapterRangeLabel: { en: "Weeks 9-16", el: "Εβδομάδες 9-16" },
    chapterOneLiner: {
      en: "Your baby is discovering they can make things happen - and you're their favourite thing to make react.",
      el: "Το μωρό σου ανακαλύπτει ότι μπορεί να προκαλεί αντιδράσεις, και εσύ είσαι το αγαπημένο του πρόσωπο για αυτό.",
    },
    headerTheme: "b",
    weeklyLines: {
      en: [
        "{name} is becoming more responsive. Small sounds and longer looks are starting to feel like a real exchange rather than coincidence.",
        "The quiet back-and-forth between you is becoming easier to notice. {subj} is starting to play {poss} part in it.",
        "A coo, a smile, or a focused look is already telling you a lot about what {subj} finds interesting.",
        "{name} is more socially awake now. {subj} is beginning to respond to the world in ways that are clearly meant for you.",
        "Smiles, sounds, and longer looks are starting to feel more like responses to you specifically - not just reactions to the room.",
        "{subj} may be watching you more closely, making more sounds, and showing more interest in what's around {obj}.",
        "Reaching, looking, and cooing are all part of something important taking shape. {subj} is learning that actions have consequences.",
        "{name} is more physically steady and more socially engaged. {subj} is beginning to take part more clearly in the world around {obj}.",
      ],
      el: [
        "Στην 9η εβδομάδα {name} ανταποκρίνεται πιο καθαρά και οι μικροί ήχοι μοιάζουν με αληθινό διάλογο.",
        "Στη 10η εβδομάδα το ήρεμο πάρε-δώσε με τ{name} γίνεται πιο εύκολο να το παρατηρήσεις.",
        "Στην 11η εβδομάδα ένα χαμόγελο ή ένα βλέμμα {name} δείχνει πιο καθαρά τι της τραβά το ενδιαφέρον.",
        "Στη 12η εβδομάδα {name} είναι κοινωνικά πιο ξύπνια και οι αντιδράσεις της κατευθύνονται πιο συχνά σε εσένα.",
        "Στη 13η εβδομάδα οι ήχοι και τα βλέμματα {name} μοιάζουν ολοένα και περισσότερο με προσωπικές απαντήσεις.",
        "Στη 14η εβδομάδα {name} σε παρακολουθεί πιο προσεκτικά και δείχνει μεγαλύτερη περιέργεια για όσα συμβαίνουν γύρω της.",
        "Στη 15η εβδομάδα {name} μαθαίνει ότι οι πράξεις της έχουν αποτέλεσμα, μέσα από βλέμματα, ήχους και κίνηση.",
        "Στη 16η εβδομάδα {name} είναι πιο σταθερή σωματικά και πιο ενεργή κοινωνικά στην καθημερινότητά σας.",
      ],
    },
  },
  {
    chapterName: { en: "The Curiosity Window", el: "Το Παράθυρο Περιέργειας" },
    chapterRangeLabel: { en: "Weeks 17-24", el: "Εβδομάδες 17-24" },
    chapterOneLiner: {
      en: "Reaching, grabbing, and tasting everything in sight. Your baby is figuring out how the world works.",
      el: "Άπλωμα, πιάσιμο και εξερεύνηση παντού. Το μωρό σου καταλαβαίνει πώς λειτουργεί ο κόσμος.",
    },
    headerTheme: "c",
    weeklyLines: {
      en: [
        "Reaching and responding may start to feel more intentional this week. Less accidental, more deliberate.",
        "{name} wants to grab, mouth, and explore whatever catches {poss} interest. {poss} hands are becoming a main research tool.",
        "Stronger tummy-time pushes, more playful sounds, and more obvious interest in people are all happening quietly this week.",
        "{name} is more engaged with both people and objects. The world is becoming something {subj} wants to reach for and respond to.",
        "Reaching and grabbing may start to feel less accidental and more clearly directed. {subj} knows what {subj} wants and is trying to get it.",
        "More squeals, more curiosity, more obvious interest in both people and objects. {name} is becoming genuinely playful.",
        "Touching, grabbing, and mouthing are all part of how {name} learns at this age.",
        "{name} is more engaged, more expressive, and a little sturdier in {poss} body. The world is becoming something {subj} wants to join in with.",
      ],
      el: [
        "Στην 17η εβδομάδα οι κινήσεις {name} φαίνονται πιο σκόπιμες και λιγότερο τυχαίες.",
        "Στη 18η εβδομάδα {name} θέλει να πιάνει και να εξερευνά οτιδήποτε της τραβά την προσοχή.",
        "Στην 19η εβδομάδα θα δεις περισσότερη δύναμη στο tummy time και πιο παιχνιδιάρικους ήχους από τ{name}.",
        "Στη 20η εβδομάδα {name} συμμετέχει πιο έντονα με ανθρώπους και αντικείμενα γύρω της.",
        "Στην 21η εβδομάδα το άπλωμα και το πιάσιμο {name} γίνεται πιο στοχευμένο.",
        "Στη 22η εβδομάδα {name} είναι πιο εκφραστική και εμφανώς πιο περίεργη για όσα συμβαίνουν γύρω της.",
        "Στην 23η εβδομάδα {name} μαθαίνει μέσα από άγγιγμα, πιάσιμο και εξερεύνηση με όλες τις αισθήσεις.",
        "Στην 24η εβδομάδα {name} είναι πιο σταθερή στο σώμα και πιο παρούσα στις αλληλεπιδράσεις.",
      ],
    },
  },
  {
    chapterName: { en: "The Explorer", el: "Η Μικρή Εξερευνήτρια" },
    chapterRangeLabel: { en: "Weeks 25-32", el: "Εβδομάδες 25-32" },
    chapterOneLiner: {
      en: "Movement is becoming everything. Your baby isn't just noticing the world - they're trying to get to it.",
      el: "Η κίνηση γίνεται κεντρική. Το μωρό σου δεν παρατηρεί απλώς τον κόσμο, προσπαθεί να τον φτάσει.",
    },
    headerTheme: "a",
    weeklyLines: {
      en: [
        "Reaching, rolling, and making sounds may start to feel more purposeful than they did a few weeks ago.",
        "{name} may want to grab, turn, pivot, and get closer to whatever catches {poss} attention.",
        "More babbling, more reaching, and more frustration with things {subj} cannot quite do yet are all part of this stage.",
        "{name} is more expressive and more physically driven. {subj} is not just noticing the world - {subj} is trying to get to it.",
        "Rolling, reaching, and making sounds may start to feel more deliberate.",
        "{name} wants to get closer to people, toys, and anything that catches {poss} attention.",
        "More babbling, more reaching, more effort to explore. {name} is on a mission this week.",
        "{name} is more expressive and more physically determined. {subj} is trying to move through the world and respond to it.",
      ],
      el: [
        "Στην 25η εβδομάδα οι κινήσεις {name} δείχνουν περισσότερο σκοπό και επιμονή.",
        "Στη 26η εβδομάδα {name} προσπαθεί να πλησιάσει οτιδήποτε την ενδιαφέρει.",
        "Στην 27η εβδομάδα περισσότερη προσπάθεια σημαίνει και περισσότερη μικρή απογοήτευση για τ{name}, κάτι απολύτως φυσιολογικό.",
        "Στη 28η εβδομάδα {name} είναι πιο εκφραστική και πιο κινητική στην καθημερινότητά της.",
        "Στην 29η εβδομάδα το ρολάρισμα και το άπλωμα {name} φαίνονται πιο μεθοδικά.",
        "Στη 30η εβδομάδα {name} θέλει να φτάνει ανθρώπους και αντικείμενα που την ελκύουν.",
        "Στην 31η εβδομάδα {name} δοκιμάζει συνεχώς νέους τρόπους εξερεύνησης.",
        "Στην 32η εβδομάδα {name} κινείται με περισσότερη αποφασιστικότητα και συμμετέχει πιο ενεργά στον χώρο.",
      ],
    },
  },
  {
    chapterName: { en: "The Communicator", el: "Η Επικοινωνία Ξεκινά" },
    chapterRangeLabel: { en: "Weeks 33-40", el: "Εβδομάδες 33-40" },
    chapterOneLiner: {
      en: "Sounds, gestures, and expressions are becoming intentional. Your baby has things to say.",
      el: "Ήχοι, χειρονομίες και εκφράσεις γίνονται πιο σκόπιμα. Το μωρό σου έχει πολλά να εκφράσει.",
    },
    headerTheme: "b",
    weeklyLines: {
      en: [
        "Getting to people, reaching for objects, and making sounds may start to feel more clearly purposeful this week.",
        "{name} may want to move closer, hold on longer, and stay involved in whatever catches {poss} attention.",
        "More babbling, more reaching, and more interest in how things work. {subj} is investigating.",
        "{name} is more expressive and more physically driven. {subj} is moving through the world, testing it, and responding to it.",
        "Getting to things, testing how they work, and staying in interaction with you may feel more purposeful this week.",
        "{name} may want to move closer, hold on longer, and explore the same object again and again.",
        "Babbling, pulling up, banging, dropping, and searching are all part of how {name} learns at this age.",
        "{name} is expressive and physically driven. {subj} is trying to reach the world, test it, and join in with it.",
      ],
      el: [
        "Στην 33η εβδομάδα {name} επικοινωνεί πιο σκόπιμα με ήχους και κινήσεις.",
        "Στη 34η εβδομάδα {name} θέλει να μένει περισσότερο σε ό,τι την ενδιαφέρει.",
        "Στην 35η εβδομάδα {name} ερευνά πώς λειτουργούν πράγματα με μεγαλύτερη επιμονή.",
        "Στη 36η εβδομάδα {name} εκφράζεται πιο έντονα και κινείται πιο αποφασιστικά.",
        "Στην 37η εβδομάδα {name} δοκιμάζει, επαναλαμβάνει και αναζητά περισσότερη αλληλεπίδραση.",
        "Στη 38η εβδομάδα {name} επιστρέφει ξανά και ξανά στο ίδιο αντικείμενο για να μάθει καλύτερα.",
        "Στην 39η εβδομάδα {name} μαθαίνει μέσα από ήχους, πιασίματα και συνεχείς δοκιμές.",
        "Στην 40η εβδομάδα {name} συμμετέχει πιο ενεργά και επικοινωνεί με μεγαλύτερη σαφήνεια.",
      ],
    },
  },
  {
    chapterName: { en: "The Adventurer", el: "Η Μικρή Περιπετειώδης" },
    chapterRangeLabel: { en: "Weeks 41-48", el: "Εβδομάδες 41-48" },
    chapterOneLiner: {
      en: "Standing, cruising, and getting to what they want. Your baby is becoming someone with places to go.",
      el: "Όρθια στάση, μετακίνηση και στόχος. Το μωρό σου γίνεται όλο και πιο ανεξάρτητο.",
    },
    headerTheme: "c",
    weeklyLines: {
      en: [
        "Standing, cruising, and getting to what {subj} wants may feel much more deliberate this week.",
        "{name} may want to test everything by dropping it, turning it, banging it, or trying to get closer to it.",
        "Longer babbling, stronger reactions to familiar words, and more determined movement are all part of this stage.",
        "{name} is more expressive and more physically confident. {subj} is trying to influence what happens in the world around {obj}.",
        "Standing, cruising, and getting to what {subj} wants may feel more steady and deliberate.",
        "{name} may want to show you things, copy simple actions, and stay closely involved in what you're doing.",
        "Gestures, clearer reactions to familiar words, and more purposeful play are all part of this stage.",
        "{name} is more expressive and more physically capable. {subj} is joining in with the world and moving through it more independently.",
      ],
      el: [
        "Στην 41η εβδομάδα {name} στέκεται και μετακινείται με μεγαλύτερη πρόθεση.",
        "Στη 42η εβδομάδα {name} δοκιμάζει τα πάντα για να δει τι συμβαίνει.",
        "Στην 43η εβδομάδα {name} αντιδρά πιο έντονα σε γνώριμες λέξεις και καταστάσεις.",
        "Στη 44η εβδομάδα {name} έχει μεγαλύτερη αυτοπεποίθηση στο σώμα και στην έκφραση.",
        "Στην 45η εβδομάδα οι κινήσεις {name} γίνονται πιο σταθερές.",
        "Στη 46η εβδομάδα {name} θέλει να μοιράζεται μαζί σου όσα ανακαλύπτει.",
        "Στην 47η εβδομάδα οι χειρονομίες {name} γίνονται πιο καθαρές και χρήσιμες στην επικοινωνία.",
        "Στην 48η εβδομάδα {name} κινείται πιο ανεξάρτητα και συμμετέχει πιο ενεργά στην καθημερινότητα.",
      ],
    },
  },
  {
    chapterName: { en: "The First Steps", el: "Τα Πρώτα Βήματα" },
    chapterRangeLabel: { en: "Weeks 49-56", el: "Εβδομάδες 49-56" },
    chapterOneLiner: {
      en: "Walking, pointing, and trying to be understood. A full little person is emerging.",
      el: "Περπάτημα, δείξιμο και προσπάθεια για κατανόηση. Ένας μικρός χαρακτήρας αναδύεται καθαρά.",
    },
    headerTheme: "a",
    weeklyLines: {
      en: [
        "Walking, pointing, and trying to be understood may feel more clearly purposeful this week.",
        "{name} may want to carry things, copy what you do, and show you what {subj} is interested in.",
        "Early words, clearer pointing, and more confident movement are all part of this stage.",
        "{name} is more expressive and physically confident. {subj} is communicating with the world and trying to influence what happens next.",
        "Walking, carrying, and trying to be understood may feel more clearly directed this week.",
        "{name} may want to bring you things, copy what you do, and stay close while {subj} explores.",
        "Pointing, trying simple words, and moving more confidently are all part of this stage.",
        "{name} is expressive and physically sure of {obj}. {subj} is taking part in the world.",
      ],
      el: [
        "Στην 49η εβδομάδα {name} προσπαθεί να γίνει πιο κατανοητή μέσα από κίνηση και χειρονομίες.",
        "Στη 50η εβδομάδα {name} μεταφέρει πράγματα και σε καλεί να μοιραστείτε την εμπειρία.",
        "Στην 51η εβδομάδα εμφανίζονται πιο καθαρές λέξεις και μεγαλύτερη σιγουριά στο περπάτημα {name}.",
        "Στη 52η εβδομάδα {name} δείχνει πιο ξεκάθαρα τι θέλει και τι την ενδιαφέρει.",
        "Στην 53η εβδομάδα {name} κινείται πιο συνειδητά προς συγκεκριμένους στόχους.",
        "Στη 54η εβδομάδα {name} σε θέλει κοντά της καθώς εξερευνά.",
        "Στην 55η εβδομάδα {name} επικοινωνεί περισσότερο με δείξιμο και μικρές λέξεις.",
        "Στην 56η εβδομάδα {name} μοιάζει πιο σίγουρη και παρούσα σε όλα όσα κάνει.",
      ],
    },
  },
  {
    chapterName: { en: "The Imitator", el: "Η Μικρή Μίμος" },
    chapterRangeLabel: { en: "Weeks 57-64", el: "Εβδομάδες 57-64" },
    chapterOneLiner: {
      en: "Copying, pointing, and testing everything. Your baby is learning by watching you.",
      el: "Αντιγραφή, δείξιμο και δοκιμή. Το μωρό σου μαθαίνει κυρίως παρατηρώντας εσένα.",
    },
    headerTheme: "b",
    weeklyLines: {
      en: [
        "Walking, carrying, and trying to be understood may feel more clearly directed. {subj} is getting good at this.",
        "{name} may want to bring you things, copy what you do, and stay close while exploring.",
        "Pointing, trying simple words, and testing how things work are all part of this stage.",
        "{name} is expressive and physically sure of {obj}. {subj} is taking part in the world on {poss} own terms.",
        "Walking, carrying, and trying to be understood may feel more clearly directed this week.",
        "{name} may want to bring you things, copy what you do, and stay close while exploring.",
        "Pointing, trying simple words, and testing how things work are all part of this stage.",
        "{name} is expressive and physically steady. {subj} is communicating with the world and taking part in it.",
      ],
      el: [
        "Στην 57η εβδομάδα {name} δείχνει πιο ξεκάθαρα ότι αντιγράφει όσα βλέπει.",
        "Στη 58η εβδομάδα {name} φέρνει αντικείμενα και σε καλεί να συμμετέχεις.",
        "Στην 59η εβδομάδα {name} δοκιμάζει τι λειτουργεί μέσα από επανάληψη.",
        "Στη 60η εβδομάδα {name} εκφράζεται πιο σταθερά και με μεγαλύτερη αυτονομία.",
        "Στην 61η εβδομάδα {name} κατευθύνει πιο συνειδητά τις κινήσεις και τα αιτήματά της.",
        "Στη 62η εβδομάδα {name} σε παρακολουθεί προσεκτικά και αντιγράφει τις καθημερινές σου κινήσεις.",
        "Στην 63η εβδομάδα {name} δοκιμάζει ξανά και ξανά για να επιβεβαιώσει πώς λειτουργεί κάτι.",
        "Στην 64η εβδομάδα {name} επικοινωνεί και συμμετέχει με μεγάλη ζωντάνια.",
      ],
    },
  },
  {
    chapterName: { en: "The Determinator", el: "Η Αποφασισμένη" },
    chapterRangeLabel: { en: "Weeks 65-72", el: "Εβδομάδες 65-72" },
    chapterOneLiner: {
      en: "Your baby knows what they want and is going to get it. Independence and frustration arrive together.",
      el: "Το μωρό σου ξέρει τι θέλει και το διεκδικεί. Αυτονομία και ένταση εμφανίζονται μαζί.",
    },
    headerTheme: "c",
    weeklyLines: {
      en: [
        "Walking, carrying, and getting what {subj} wants may feel more deliberate and confident this week.",
        "{name} may want to bring you things, copy what you do, and stay close while exploring.",
        "Simple words, clearer pointing, and trying the same action again and again are all part of this stage.",
        "{name} is expressive and physically steady. {subj} is trying to influence the world and move through it with confidence.",
        "Walking, climbing, and getting what {subj} wants may feel more deliberate and confident.",
        "{name} may want to bring you things, copy what you do, and stay close while exploring.",
        "Simple words, clearer pointing, and trying the same action again and again. {subj} is thorough.",
        "{name} is trying to influence the world, respond to it, and move through it with growing confidence.",
      ],
      el: [
        "Στην 65η εβδομάδα {name} δείχνει πιο αποφασισμένη στο να πετυχαίνει ό,τι θέλει.",
        "Στη 66η εβδομάδα {name} συνδυάζει κοινωνικότητα και επιμονή.",
        "Στην 67η εβδομάδα {name} επαναλαμβάνει κινήσεις γιατί θέλει να τις κατακτήσει.",
        "Στη 68η εβδομάδα {name} επηρεάζει όλο και πιο έντονα το περιβάλλον της.",
        "Στην 69η εβδομάδα {name} κινείται με σαφή στόχο και μεγαλύτερη αυτοπεποίθηση.",
        "Στη 70η εβδομάδα {name} σε θέλει δίπλα της, ενώ ταυτόχρονα δοκιμάζει τα όριά της.",
        "Στην 71η εβδομάδα {name} γίνεται πιο επίμονη και πιο ξεκάθαρη στην επικοινωνία.",
        "Στην 72η εβδομάδα {name} συνδυάζει ανεξαρτησία και ουσιαστική σύνδεση μαζί σου.",
      ],
    },
  },
  {
    chapterName: { en: "The Climber", el: "Η Αναρριχήτρια" },
    chapterRangeLabel: { en: "Weeks 73-80", el: "Εβδομάδες 73-80" },
    chapterOneLiner: {
      en: "Everything is climbable and testable. Your baby is physically fearless and endlessly curious.",
      el: "Όλα είναι για σκαρφάλωμα και δοκιμή. Το μωρό σου δείχνει θάρρος και ατελείωτη περιέργεια.",
    },
    headerTheme: "a",
    weeklyLines: {
      en: [
        "Walking, climbing, and getting what {subj} wants may feel more steady and intentional this week.",
        "{name} may want to bring you things, copy what you do, and stay close while exploring.",
        "Simple words, clearer pointing, and trying the same action again and again.",
        "{name} is trying to influence the world, communicate with it, and move through it with more confidence every week.",
        "Walking, climbing, and getting what {subj} wants may feel more steady and intentional this week.",
        "{name} may want to bring you things, copy what you do, and let you know more clearly what {subj} wants.",
        "Simple words, clearer reactions to familiar directions, and trying the same action again and again are all part of this stage.",
        "{name} is more confident in both body and communication. {subj} is trying to participate in the world and make sense of it.",
      ],
      el: [
        "Στην 73η εβδομάδα {name} σκαρφαλώνει και δοκιμάζει τα όριά της με μεγαλύτερη σιγουριά.",
        "Στη 74η εβδομάδα {name} εναλλάσσει κοινωνική επαφή και έντονη κινητική εξερεύνηση.",
        "Στην 75η εβδομάδα {name} χτίζει δεξιότητες με επανάληψη.",
        "Στη 76η εβδομάδα {name} κινείται και επικοινωνεί με ολοένα μεγαλύτερη αυτοπεποίθηση.",
        "Στην 77η εβδομάδα {name} δείχνει σταθερότητα και πρόθεση στις κινήσεις της.",
        "Στη 78η εβδομάδα {name} εκφράζει πιο ξεκάθαρα τι θέλει.",
        "Στην 79η εβδομάδα {name} ανταποκρίνεται καλύτερα σε γνώριμες οδηγίες.",
        "Στην 80η εβδομάδα {name} συνδυάζει σωματική και επικοινωνιακή πρόοδο με εντυπωσιακό τρόπο.",
      ],
    },
  },
  {
    chapterName: { en: "The Talker", el: "Η Μικρή Ομιλήτρια" },
    chapterRangeLabel: { en: "Weeks 81-88", el: "Εβδομάδες 81-88" },
    chapterOneLiner: {
      en: "Words are arriving. Not always clearly, not always correctly - but they are arriving and meant for you.",
      el: "Οι λέξεις εμφανίζονται. Ίσως όχι πάντα καθαρές, αλλά έρχονται και απευθύνονται σε εσένα.",
    },
    headerTheme: "b",
    weeklyLines: {
      en: [
        "Walking, climbing, and getting what {subj} wants may feel more steady and intentional this week.",
        "{name} may want to bring you things, copy what you do, and let you know more clearly what {subj} wants.",
        "Simple words, clearer reactions to familiar directions, and doing the same thing again and again are all part of this stage.",
        "{name} is more confident in both body and communication. {subj} is influencing the world and moving through it with purpose.",
        "Walking, climbing, and getting what {subj} wants may feel more steady and intentional.",
        "{name} may want to bring you things, copy what you do, and make {poss} wishes clearer than before.",
        "More words, stronger reactions to familiar directions, and doing the same action again and again are all part of this stage.",
        "{name} is more confident in both body and communication. {subj} is trying to influence and respond to the world with real purpose.",
      ],
      el: [
        "Στην 81η εβδομάδα {name} χρησιμοποιεί περισσότερες λέξεις και εκφράζεται με πρόθεση.",
        "Στη 82η εβδομάδα {name} συνδυάζει κινήσεις, δείξιμο και ήχους για να γίνει κατανοητή.",
        "Στην 83η εβδομάδα {name} ακολουθεί πιο καθαρά γνώριμες οδηγίες.",
        "Στη 84η εβδομάδα {name} επικοινωνεί με μεγαλύτερη αυτοπεποίθηση και σταθερότητα.",
        "Στην 85η εβδομάδα {name} δείχνει πιο ξεκάθαρα προτιμήσεις και επιθυμίες.",
        "Στη 86η εβδομάδα {name} φέρνει πράγματα και ζητά συμμετοχή με πιο άμεσο τρόπο.",
        "Στην 87η εβδομάδα οι λέξεις {name} αυξάνονται και η κατανόησή της δυναμώνει.",
        "Στην 88η εβδομάδα {name} συνδυάζει λόγο και δράση με ωριμότητα για την ηλικία της.",
      ],
    },
  },
  {
    chapterName: { en: "The Little Person", el: "Η Μικρή Προσωπικότητα" },
    chapterRangeLabel: { en: "Weeks 89-96", el: "Εβδομάδες 89-96" },
    chapterOneLiner: {
      en: "Not just a baby anymore. Opinions, preferences, humour, and a lot to say about everything.",
      el: "Δεν είναι πια μόνο ένα μωρό. Έχει άποψη, προτιμήσεις, χιούμορ και δικό της τρόπο έκφρασης.",
    },
    headerTheme: "c",
    weeklyLines: {
      en: [
        "Movement, words, and little acts of independence may feel more clearly intentional this week.",
        "{name} may want to copy what you do, show you things, and let you know more clearly what {subj} wants.",
        "Following familiar directions, using more words, and repeating favourite actions are all part of this stage.",
        "{name} is trying to participate in the world, influence it, and make sense of it.",
        "Movement, words, and little acts of independence may feel more clearly intentional this week.",
        "{name} may want to copy what you do, show you things, and let you know more clearly what {subj} wants.",
        "Following familiar directions, using more words, and repeating favourite actions are all part of this stage.",
        "{name} is confident in both body and communication. {subj} is participating in the world and making sense of it.",
      ],
      el: [
        "Στην 89η εβδομάδα {name} δείχνει πιο καθαρή πρόθεση σε κίνηση και λόγο.",
        "Στη 90η εβδομάδα {name} αντιγράφει, δείχνει και επικοινωνεί πιο άμεσα τι χρειάζεται.",
        "Στην 91η εβδομάδα {name} ακολουθεί γνώριμες οδηγίες και χρησιμοποιεί περισσότερες λέξεις.",
        "Στη 92η εβδομάδα {name} συμμετέχει ενεργά και επηρεάζει περισσότερο την καθημερινή ροή.",
        "Στην 93η εβδομάδα {name} εκφράζει πιο σταθερές προτιμήσεις.",
        "Στη 94η εβδομάδα {name} δείχνει πιο καθαρά χιούμορ και προσωπικό στυλ.",
        "Στην 95η εβδομάδα {name} ενισχύει την επικοινωνία μέσα από λέξεις και επαναλαμβανόμενες δράσεις.",
        "Στην 96η εβδομάδα {name} είναι σίγουρη στο σώμα και στην έκφρασή της, με παρουσία που ξεχωρίζει.",
      ],
    },
  },
];

function validateChapterLocalization() {
  for (const [index, chapter] of CHAPTER_SEEDS.entries()) {
    const chapterNo = index + 1;
    const requiredLines = 8;
    if (!chapter.chapterName.el.trim() || !chapter.chapterOneLiner.el.trim() || !chapter.chapterRangeLabel.el.trim()) {
      throw new Error(`[chapters] Missing Greek header copy in chapter ${chapterNo}`);
    }
    if (chapter.weeklyLines.en.length !== requiredLines || chapter.weeklyLines.el.length !== requiredLines) {
      throw new Error(`[chapters] Chapter ${chapterNo} must have exactly ${requiredLines} weekly lines per language`);
    }
    chapter.weeklyLines.el.forEach((line, weekIdx) => {
      if (!line.trim()) {
        throw new Error(`[chapters] Empty Greek weekly line in chapter ${chapterNo}, week offset ${weekIdx}`);
      }
    });
  }
}

if (__DEV__) {
  validateChapterLocalization();
}

function interpolate(template: string, name: string, gender: "girl" | "boy" | "unspecified") {
  const pronouns =
    gender === "boy"
      ? { subj: "he", obj: "him", poss: "his" }
      : gender === "girl"
      ? { subj: "she", obj: "her", poss: "her" }
      : { subj: "they", obj: "them", poss: "their" };
  return template
    .replace(/\{name\}/g, name)
    .replace(/\{subj\}/g, pronouns.subj)
    .replace(/\{obj\}/g, pronouns.obj)
    .replace(/\{poss\}/g, pronouns.poss);
}

export function getChapterRecordForWeek(
  week: number,
  babyName: string,
  gender: "girl" | "boy" | "unspecified",
  language: AppLanguage = "en"
): ChapterRecord {
  const normalizedWeek = Math.max(1, Math.min(96, Math.floor(week || 1)));
  const chapterIndex = Math.ceil(normalizedWeek / 8);
  const chapter = CHAPTER_SEEDS[chapterIndex - 1] ?? CHAPTER_SEEDS[0];
  const weekOffset = (normalizedWeek - 1) % 8;
  const lines = chapter.weeklyLines[language] ?? chapter.weeklyLines.en;
  const chapterName =
    language === "el" && chapterIndex === 9
      ? gender === "boy"
        ? "Ο Αποφασισμένος"
        : "Η Αποφασισμένη"
      : chapter.chapterName[language] ?? chapter.chapterName.en;

  return {
    chapterIndex,
    chapterName,
    chapterRangeLabel: chapter.chapterRangeLabel[language] ?? chapter.chapterRangeLabel.en,
    chapterOneLiner: chapter.chapterOneLiner[language] ?? chapter.chapterOneLiner.en,
    headerTheme: chapter.headerTheme,
    weeklyTextTemplate: interpolate(lines[weekOffset] ?? lines[0], babyName, gender),
  };
}

export function getNextChapterPreview(
  week: number,
  language: AppLanguage = "en"
): Pick<ChapterRecord, "chapterIndex" | "chapterName" | "chapterRangeLabel" | "chapterOneLiner"> | null {
  const normalizedWeek = Math.max(1, Math.min(96, Math.floor(week || 1)));
  const chapterIndex = Math.ceil(normalizedWeek / 8);
  const nextIndex = chapterIndex + 1;
  if (nextIndex > 12) return null;
  const next = CHAPTER_SEEDS[nextIndex - 1];
  if (!next) return null;
  return {
    chapterIndex: nextIndex,
    chapterName: next.chapterName[language] ?? next.chapterName.en,
    chapterRangeLabel: next.chapterRangeLabel[language] ?? next.chapterRangeLabel.en,
    chapterOneLiner: next.chapterOneLiner[language] ?? next.chapterOneLiner.en,
  };
}
