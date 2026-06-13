export type Category = 'spark' | 'move' | 'play';

export interface ExtendedDailyActivity {
  id: string;
  category: Category;
  ageRangeStart: number;
  ageRangeEnd: number;
  title: string;
  instruction: string;
  why: string;
  imageDescription: string;
}

type Block = {
  rangeStart: number;
  rangeEnd: number;
  text: string;
};

const CATEGORY_MAP: Record<string, Category> = {
  Think: 'spark',
  Move: 'move',
  Bond: 'play',
};

const CATEGORY_PREFIX: Record<Category, string> = {
  spark: 's',
  move: 'm',
  play: 'p',
};

function normalizeLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function defaultImageDescription(title: string, category: Category): string {
  const scene =
    category === 'spark'
      ? 'parent and toddler focused on a simple learning moment'
      : category === 'move'
      ? 'parent and toddler doing gentle movement together indoors'
      : 'parent and toddler sharing a warm face to face bonding moment';
  return `${scene}, activity: ${normalizeLabel(title)}, soft natural home light.`;
}

function parseBlock(block: Block): ExtendedDailyActivity[] {
  const perCategoryCounter: Record<Category, number> = {
    spark: 0,
    move: 0,
    play: 0,
  };

  const matches = [...block.text.matchAll(/^(Think|Move|Bond),\s*(.+)\n([^\n]+)\n([^\n]+)$/gm)];

  return matches.map((m) => {
    const category = CATEGORY_MAP[m[1]];
    perCategoryCounter[category] += 1;
    const idx = perCategoryCounter[category];

    const title = m[2].trim();
    const instruction = m[3].trim();
    const why = m[4].trim();

    return {
      id: `${CATEGORY_PREFIX[category]}-${block.rangeStart}-${idx}`,
      category,
      ageRangeStart: block.rangeStart,
      ageRangeEnd: block.rangeEnd,
      title,
      instruction,
      why,
      imageDescription: defaultImageDescription(title, category),
    };
  });
}

const BLOCKS: Block[] = [
  {
    rangeStart: 48,
    rangeEnd: 52,
    text: `Think, Name and Wait
Hold a spoon where your baby can see it and say, "Spoon." Stay still for a moment and wait for them to look, reach, or brighten before you say it again.
Hearing one simple word paired with one real object helps your baby start linking language to what they see.
Think, Where Did It Go?
Lay a small towel flat on the floor. Place your hand under it slowly while your baby watches, then pause and wait. Lift the towel and say, "There it is."
Simple hide-and-reveal teaches your baby that things exist even when they can't be seen.
Think, Point and Name
Point to your nose and say, "Nose." Pause. Then point to your baby's nose and say it again. Do the same with eyes, then mouth, moving slowly each time.
Pairing a word with a clear gesture helps your baby connect body parts to their names.
Think, What's in the Cup?
Hold an empty cup with both hands, peer into it with exaggerated curiosity, and say, "What's in here?" Then tip it toward your baby so they can look inside too.
Shared attention on a simple object builds early curiosity and the habit of looking where you look.
Think, Drop and Listen
Hold a spoon over a hard floor and let it drop. Say, "Down." Pick it up and do it again, pausing between each drop so your baby can track the sound and movement.
Cause-and-effect play with sound and motion is one of the first ways babies begin building early reasoning.
Think, Come and Get It
Place a bowl on the floor just out of your baby's reach. Pat the bowl and say, "Come here." Wait for them to move toward it, then slide it slightly further and say it again.
A simple reach-and-move challenge builds early problem-solving and responding to a word with action.
Think, Say It Back
When your baby makes a sound—any sound—pause, look at them, and repeat it back in the same tone. Then wait quietly to see if they make another sound.
Taking turns with sounds teaches your baby the basic back-and-forth rhythm that underlies all future language.
Think, Big and Small
Hold your hands wide apart and say, "Big," then bring them close together and say, "Small." Do this slowly two or three times so your baby can track both the movement and the word.
Pairing opposite words with clear hand gestures introduces early contrast concepts in a very concrete way.
Think, Tap Once
Tap a bowl on the floor once with your hand and say, "One." Then look at your baby and wait. If they tap it too, pause and say, "One" again.
Watching and imitating a single action is one of the earliest forms of intentional learning at this age.
Think, Open Closed
Hold your hand flat open in front of your baby's face and say, "Open." Then slowly close your fist and say, "Closed." Pause, then do it again, waiting each time.
Watching a clear action matched to a word helps your baby begin building vocabulary for basic concepts.
Think, Book and Point
Open a simple book to any page. Point to one image and say its name clearly. Pause. Point again and wait to see if your baby reaches toward it or makes a sound.
Even before they can speak, your baby is storing words, and one-word naming with a pause invites them to respond.
Think, Where's the Spoon?
Place a spoon on the floor in plain sight, then loosely cover it with the edge of a blanket. Say, "Where's the spoon?" and wait, watching to see if your baby reaches or looks.
Partial hiding with a familiar word helps your baby practice object permanence and respond to a question cue.
Think, Up and Down Voice
Say "up" in a rising voice while slowly raising your hands, then say "down" in a falling voice while lowering them. Repeat two or three times, letting your baby watch your face and hands.
Matching tone of voice to movement gives your baby two ways to absorb a new word at the same time.
Think, Ball Watch
Hold a ball still in front of your baby, then slowly roll it a short distance along the floor. Say, "Go." Wait for them to track it with their eyes before rolling it again.
Following a moving object with focused attention builds visual tracking and the early concept of movement.
Think, Knock It Over
Stack one cup on top of another and point at it. Then nudge the top cup off slowly with one finger and say, "Down." Wait, then rebuild and offer your baby a turn.
Watching something fall and then be rebuilt teaches cause-and-effect and introduces the idea that actions can be repeated.
Think, Clap and Name
Clap your hands together once and say, "Clap." Wait and watch your baby's face. If they don't respond, clap once more and wait again before doing it a third time.
Pairing a body action with its word gives your baby an early action-label that they can soon begin to imitate.
Think, Hello to the Face
Hold your baby facing you and point gently to your eye, saying, "Eye." Then point to your own and say the same word. Pause between each and wait for any response.
Naming face parts with slow, clear pointing is one of the most reliable early vocabulary-building patterns.
Think, Cup on Cup
Place one cup upside down on the floor. Hold a second cup above it, pause, then set it on top. Say, "On." Take it off and say, "Off." Pause and let your baby reach for it.
Watching a simple stacking and unstacking action gives your baby an early feel for spatial relationships.
Move, Stand and Sway
Hold both of your baby's hands while they stand. Gently sway left and right in a slow rhythm, keeping your grip steady. Let them feel the weight shift through their feet.
Controlled side-to-side movement helps your baby develop balance and learn how to adjust their body weight.
Move, Step Together
Stand your baby facing you, holding both hands. Take one small step backward and give the gentlest pull forward so they step to follow. Pause, then take one step more.
Supported forward stepping builds confidence and muscle memory for the early walking pattern.
Move, Floor Sit to Stand
Sit your baby on the floor with your knee or a pillow beside them. Hold their hands and let them push up to standing using their own effort, helping only as much as needed.
Practicing the sit-to-stand movement strengthens the leg and core muscles needed for walking.
Move, Crawl Chase
Get on the floor across from your baby and slowly crawl toward them, saying their name. Stop just before you reach them, wait, then back up and see if they follow.
Chase-and-retreat on the floor builds whole-body coordination and encourages purposeful movement toward a goal.
Move, Reach Up High
Hold a ball or your open hand just above your baby's reach while they stand and say, "Up high." Wait for them to stretch before bringing it down.
Reaching upward while standing challenges balance and builds core stability in early walkers.
Move, Belly Roll
Lay your baby on their back on a firm blanket on the floor. Gently tuck one of their knees toward the opposite side so their body begins to roll. Support them and let them finish it.
Rolling from back to belly strengthens trunk rotation, which supports the body control needed for walking and balance.
Move, Step Over
Lay a rolled-up towel flat on the floor. Hold your baby's hands and help them step over it slowly, one foot at a time. Turn around and try it in the other direction.
Stepping over a low object builds leg lift, balance, and the early coordination pattern that toddlers use on uneven ground.
Move, Sit and Reach
Seat your baby on the floor and place a cup just outside their reach to one side. Let them lean and reach for it without tipping. Offer your hand only if they start to fall.
Reaching past their base while seated builds lateral balance and the core control that early walkers need.
Move, Tummy Lift
Lay your baby face down on a firm surface. Hold a cup or your hand just above their eye level and wait for them to push up to see it. Let them hold the position briefly.
Pushing up from tummy strengthens the shoulder and arm muscles that support crawling and early floor mobility.
Move, Walk to Me
Crouch down a few feet from your standing baby, open your arms, and call their name. Let them take the steps to you at their own pace without rushing them forward.
Walking toward a welcoming face is one of the most natural motivators for a baby's first independent steps.
Move, Side Step
Stand your baby beside your leg for support. Hold one hand and take a small sideways step, encouraging them to step sideways with you slowly along the surface.
Sideways stepping trains the hips, inner thighs, and balance in a different direction than forward walking.
Move, Soft Landing
Sit on the floor with your legs slightly apart and seat your baby between them facing out. Let them push up to standing, wobble, and sit back down with minimal help from you.
Repeated stand-and-sit practice builds the lower body strength and balance control that early walkers rely on.
Move, Towel Glide
Lay your baby on their back on a smooth towel or blanket on a flat floor. Take two corners and gently glide them a short distance. Stop, pause, then do it once more.
Riding a gliding blanket engages your baby's core as they naturally brace and adjust to the gentle movement.
Move, Push the Pillow
Place a firm pillow on the floor in front of your standing baby. Guide their hands to the pillow and let them push forward with their arms while stepping behind it.
Pushing a surface forward while walking builds upright posture, arm strength, and early supported walking confidence.
Move, Lean and Come Back
Hold your baby in a standing position and gently tilt them a few degrees to one side, then wait while they right themselves. Do the same to the other side.
Practicing small off-balance corrections builds the automatic balance response that walkers use constantly.
Move, Roll the Ball
Sit on the floor facing your baby and roll a ball slowly toward them. Wait for them to stop it, grab it, or bat it. Then open your hands and wait to see if they push it back.
Back-and-forth rolling builds gross motor coordination and the early idea of a shared activity.
Move, Down to Floor
From a standing position with your support, guide your baby slowly down to sitting without plopping. Help them bend their knees and lower themselves with control.
Learning to lower to the floor intentionally builds joint control and the reverse muscle pattern used in standing up.
Move, March in Place
Hold your baby upright by both hands while they stand and gently lift one of their knees with your finger, then the other. Keep a slow, even rhythm, one step at a time.
Assisted marching builds hip flexor strength and the alternating leg pattern that all walking relies on.
Bond, Morning Inventory
First thing in the morning, hold your baby and do a loving check. "Are your hands warm? Is your nose okay? How's that little tummy?" like you're really checking in.
This ritual communicates that your baby is fully seen and that their body matters to you, building felt security.
Bond, Copy My Face
Sit facing your baby at close range. Make one slow, clear expression—mouth wide open, eyebrows raised—and hold it for a few seconds. Wait and watch their face.
Inviting imitation of a clear facial expression is one of the earliest ways babies learn emotional recognition.
Bond, Your Turn, My Turn
Tap your chest and say, "My turn." Do a simple action—tap your knee once. Then point to your baby and say, "Your turn." Wait, watching for any response at all.
Taking turns with a simple action introduces the shared-attention rhythm that underlies all social interaction.
Bond, Hand Holder
Sit with your baby in your lap facing out. Hold both their hands in yours and stay still for a few quiet moments. No talking needed—just steady, warm contact.
Quiet physical closeness with no task attached tells your baby that being near you is safe and comfortable.
Bond, Say My Name
Look directly at your baby's face, pause, and say their name clearly. Wait. Then say it again, slightly softer. Watch for any eye contact, smile, or small response.
Hearing their own name said with warmth and direct eye contact is one of the earliest anchors of identity and connection.
Bond, I See You
While your baby plays on the floor, catch their eye and say, "I see you," with a warm smile. Don't redirect them. Let them return to what they were doing.
A moment of acknowledged presence without interruption tells your baby that they are noticed even when they are not demanding attention.
Bond, Silly Voice
Use an exaggerated, playful voice to narrate exactly what your baby is doing—"Oh, you're looking at that cup. Now you're grabbing it!"—keeping your tone light and watching their face.
Hearing their actions described in a playful voice builds social engagement and teaches your baby that what they do matters.
Bond, Forehead to Forehead
Hold your baby close, rest your forehead gently against theirs, and stay still for a moment. Breathe slowly. Let the contact do the work.
This simple physical closeness activates your baby's sense of belonging and physical safety in a very direct way.
Bond, Wave Together
Take your baby's hand gently and wave it toward another person or toward your own face. Say, "Hi" or "Bye-bye" each time in a warm, consistent voice.
Practicing a social gesture together gives your baby an early shared action they can begin to use on their own.
Bond, Peekaboo Face
Hold both hands in front of your face, pause, then slowly pull them away and say, "Boo!" with wide eyes and a smile. Wait for their reaction before doing it again.
This classic interaction builds anticipation, social joy, and the back-and-forth rhythm of early play.
Bond, Hold the Book Together
Sit your baby in your lap and hold a book open so you are both looking at the same page. Point to one image without saying anything. Wait to see where their eyes go.
Sharing attention on the same object without pressure is how early joint attention and communication grow.
Bond, Pat-a-Back
While holding your baby upright against your chest, gently and rhythmically pat their back with an open palm. Keep the rhythm slow and even without talking.
A slow, steady pat communicates calm and attunement, and the rhythm itself is deeply regulating for young children.
Bond, Mirror Moment
Hold your baby facing you at arm's length. Make a slow, exaggerated mouth movement—lips pressed together, then apart. Wait and watch to see if their mouth moves at all.
Watching a face and trying to copy it is an early social skill that builds the groundwork for communication.
Bond, Nose Touch
Lean slowly toward your baby's face and touch your nose to theirs very gently, saying, "Noses!" Then pull back, pause, and wait to see if they lean toward you.
A gentle, predictable physical contact game builds trust, anticipation, and early playful connection.
Bond, Comfort Hold
When your baby seems fussy or overwhelmed, sit down, hold them against your chest, and breathe slowly and audibly. Don't try to distract—just hold and breathe.
A calm, breathing body is genuinely regulating for a baby, teaching them that they can return to calm through contact.
Bond, Rock and Hum
Sit on the floor holding your baby and rock slowly forward and back while humming a single, low, steady note. No song needed—just rhythm and sound together.
The combination of gentle movement and a calm sound is one of the most reliable ways to create shared calm.
Bond, Follow the Gaze
Watch where your baby is looking and then slowly look there yourself. Say, "Oh, I see it," in a quiet voice. Then look back at their face and wait.
Following your baby's gaze teaches them that their focus matters and that you are truly paying attention.
Bond, Good Night Check
At the end of the day, hold your baby close and do a slow, quiet check—saying each body part softly as you touch it gently. Hands, feet, nose, ears, tummy.
Ending the day with calm, named touch helps your baby feel fully accounted for and settles them into rest.`
  },
  {
    rangeStart: 52,
    rangeEnd: 56,
    text: `Think, Name the Bowl
Hold a bowl in front of your baby and say, "Bowl." Set it down, pause, then pick it up again and say it once more. Wait each time for any look, sound, or reach.
Repeating one word with one real object in a slow rhythm helps your baby build a reliable link between the word and the thing.
Think, Where Is It?
Place a spoon on the floor in front of your baby, then cover it completely with a small towel. Say, "Where's the spoon?" and wait. Let them reach for or lift the towel on their own.
Finding a fully hidden object is a small but meaningful step in object permanence and early problem-solving.
Think, Tap and Copy
Tap the floor twice with your open hand and wait. Watch to see if your baby taps back. If they don't, tap twice more, pause, and wait again without helping them.
Imitating a simple repeated action is more reliable now, and waiting for the copy builds early turn-taking and attention.
Think, Book Finger Point
Open a book and point slowly to one image. Say its name once clearly, then move your finger away and wait. Watch to see if their finger or hand moves toward the picture.
Following a point and looking where someone points is an important joint-attention skill developing strongly at this age.
Think, Up Goes the Cup
Hold a cup low, then raise it slowly above your head saying, "Up, up, up." Lower it back down and say, "Down." Pause, then do it again while your baby tracks it.
Tracking a familiar object through space while hearing directional words builds spatial vocabulary and sustained visual attention.
Think, Hand In, Hand Out
Hold a bowl in your lap and slowly put your hand inside it, then take it out. Say, "In" and "Out" each time. Then tip the bowl toward your baby and wait to see what they do.
In-and-out concepts are just beginning to click at this age, and a clear demonstration with one word each time helps the idea land.
Think, Say Something
Look at your baby from across the mat, make eye contact, and wait in silence. If they make any sound, nod warmly and wait again. If they are quiet, hum one note and pause.
Leaving open space for your baby to initiate a sound teaches them that their voice causes a response, which motivates more communication.
Think, Ball and Name
Hold a ball in both hands at your baby's eye level and say, "Ball." Roll it one step away. Say, "Ball" again. Then open your hands toward your baby and wait to see if they push it back.
Naming an object as it moves helps your baby connect the word to the thing in motion, not just as a still object.
Think, Stack and Wait
Place one cup on top of another in front of your baby, then take the top one off and hold it out. Wait to see if they try to put it back. Offer only a gentle hand if they seem stuck.
Attempting to replace a stacked object is an emerging problem-solving step that requires both memory of what happened and the coordination to repeat it.
Think, Loud and Soft
Say your baby's name loudly once, then say it again in a near-whisper, leaning in. Watch their face for a reaction to each. Pause between the two and let them register the difference.
Responding to different volumes of the same word builds auditory attention and lays early groundwork for understanding emphasis and tone.
Think, Under the Blanket
Lay a blanket flat and slowly slide your hand underneath it while your baby watches. Wiggle your fingers under the blanket and say, "Find it." Wait for them to reach or pull the blanket.
The addition of a verbal cue with a partially hidden moving target is slightly more demanding than standard hide-reveal, fitting the growing attention span at this age.
Think, Fill the Bowl
Put a spoon in a bowl in front of your baby. Take the spoon out, hold it over the bowl, and drop it in. Say, "In." Wait, then tip it out and do it again, leaving a pause for them to reach.
Watching an object go in and come out of a container repeatedly helps your baby build the cause-and-effect logic of containment.
Think, What Sound Is That?
Make a clear, simple sound—one tap on the floor, one clap—while your baby is looking away. Then wait to see if they turn to find the source before doing it again.
Turning toward and locating a sound source is an early listening and attention skill that also strengthens basic auditory-spatial awareness.
Think, Point to You
Point clearly to your baby's hand and say, "Hand." Then point to your own hand and say, "Hand" again. Pause, then do the same with foot. Move slowly and wait between each pair.
Matching the same word to two different instances—on them and on you—helps your baby begin to generalize words rather than attach them to one fixed object.
Think, One More Time
Do a simple action—tap your knee once—then stop completely and wait with an expectant face. If your baby watches you, pause even longer before doing it again. Let the wait build.
A deliberately extended pause teaches your baby to hold their attention and anticipate, which is the foundation of early working memory.
Think, Book and Hum
Open a book and hum quietly to yourself while slowly turning one page. Stop on an image and tap it gently. Don't name it yet—just tap, wait, and watch where your baby's eyes go.
Pausing before naming gives your baby a moment to process the image independently, which builds more active looking rather than passive listening.
Think, Yes and No
Hold a cup toward your baby and nod your head slowly, saying, "Yes." Then pull it back slightly and shake your head, saying, "No." Repeat this once more with a clear pause between each.
Pairing a clear gesture with a simple word gives your baby one of their first anchors for understanding agreement and refusal.
Think, Look Over There
Without pointing, turn your head clearly and look at a spot on the wall. Hold that gaze for a few seconds, then slowly turn back to your baby. Do it once more and watch if they follow.
Following a head-turn without a finger point is a slightly more advanced form of joint attention that begins to emerge around this age.
Move, Come to Me
Stand a short step away with your arms open and wait. If your baby starts toward you, take one small step back and let them keep coming.
This gives early walking practice a clear goal and helps your baby adjust balance while moving toward you.
Move, Carry and Walk
Hand your baby a lightweight empty cup and let them hold it while they walk. Walk alongside them slowly without holding their hand unless they wobble significantly.
Carrying an object while walking shifts the body's balance slightly, which challenges and strengthens overall walking coordination.
Move, Crouch and Rise
Stand facing your baby, then slowly crouch low to the floor while saying, "Down." Pause, then rise back up saying, "Up." Wait to see if they try to squat and stand with you.
Squatting and rising with control builds the hip and knee strength that toddlers use constantly as they explore the floor and stand back up.
Move, Slow Walk Together
Hold one of your baby's hands and walk together very slowly across the floor. Match their pace exactly rather than pulling them forward. Let them set the speed.
Walking at your baby's natural pace with only one hand for support builds their confidence and lets them practice balance without being rushed.
Move, Kick the Ball
Place a ball on the floor just in front of your baby's foot while they stand. Point to it and wait. If they don't kick, gently tap their foot toward it and then back away.
Kicking a ball while standing requires shifting weight onto one foot briefly, which is a significant balance milestone for this age.
Move, Sit Down Slowly
Hold your baby's hands while they stand and guide them into a slow, controlled sit rather than a plop. Lower them gradually and say, "Down" as they go.
Controlled lowering to the floor strengthens quadriceps and builds the body awareness that makes movement safer and more coordinated.
Move, Around the Pillow
Place a pillow on the floor and walk slowly around it with your baby, holding one hand. Make a full circle, pause, and walk around it again in the other direction.
Changing direction while walking challenges balance and spatial coordination in a simple, low-risk way.
Move, Stop and Go
Walk alongside your baby and say, "Go." After a few steps, say, "Stop" in a clear, calm voice and pause your own feet. Repeat a few times, watching for any response to the word.
Starting to respond to a stop signal while walking begins to connect verbal direction with body control, an important safety and coordination skill.
Move, Lower the Ball
Stand facing your child and hold a ball together at shoulder height, your hands loosely over theirs. Say, "Down slow," and guide it all the way to the floor, bending your knees together as you go.
Lowering a held object from high to floor level while the whole body bends builds the coordinated chain of movement from shoulders to hips to knees that growing walkers are actively developing.
Move, Floor and Up
Sit your baby down on the floor from standing, then immediately encourage them to push back up with your hands lightly available. Let them do most of the work themselves.
Repeating the down-and-up sequence builds lower body endurance and the functional strength that active toddlers use dozens of times a day.
Move, Throw and Watch
Help your baby grip a ball and guide a gentle forward toss, letting go just as their arm swings forward. Say, "Throw." Then retrieve it and wait to see if they reach out for it again.
Releasing an object intentionally with a forward swing is an emerging gross motor skill that builds arm coordination and the concept of sending something away on purpose.
Move, Belly to Stand
Help your baby get into a hands-and-knees position on the floor, then guide them through pushing up to standing by placing your hands loosely near their hips without lifting.
Getting from the floor to standing through their own effort strengthens the whole movement chain from core to legs and builds independent mobility.
Move, Walk and Carry a Blanket
Drape a small blanket over your baby's outstretched arms and let them walk while holding it. Stay close but don't hold their hand unless they lose balance.
Holding an armful of something light while walking demands more core engagement and postural control than walking with free arms.
Move, Side to Side
Stand your baby facing you and hold both hands. Gently rock them side to side in a slow rhythm, letting their feet stay on the floor and their weight shift with each sway.
Controlled weight shift from one foot to the other while standing is the same movement pattern underlying every step in walking.
Move, Turn Around
Hold your baby's hand and slowly guide them through a full body turn until they are facing the other direction. Pause, then guide the turn back the other way.
Pivoting on one foot builds the hip rotation and ankle control that growing walkers need to change direction without falling.
Move, Roll and Chase
Sit on the floor, roll a ball slowly away from both of you, and then wait. Let your baby decide to crawl or walk after it. Don't prompt—just watch and let them initiate the chase.
Self-motivated movement toward a target builds purposeful locomotion and the physical confidence to go after something without being directed.
Move, Pull Up at the Wall
Guide your baby to a flat wall and let them press both palms against it. Gently guide them from sitting to standing by letting them push into the wall with their arms for support.
Using a flat surface to pull or push to standing builds arm and shoulder strength while giving a stable, safe reference point for balance.
Move, March and Pause
Hold your baby's hands while they stand and gently lift their knees in a slow march. After three or four lifts, stop completely and wait before starting again.
The pause in the middle of a rhythm builds anticipation and body awareness, adding a small cognitive layer on top of the physical movement.
Bond, Morning Inventory
First thing in the morning, hold your baby and do a loving check. "Are your hands warm? Is your nose okay? How's that little tummy?" like you're really checking in.
This ritual tells your baby they are fully seen and that their body matters to you, building felt safety from the start of the day.
Bond, Forehead Press
Hold your baby close and rest your forehead gently against theirs. Stay still. Breathe slowly and let the quiet contact do the work.
Still, warm physical closeness with no agenda communicates safety and belonging without any words needed.
Bond, Big Smile Wait
Look directly at your baby's face and break into a slow, wide smile. Hold it and wait. Don't speak—just let your face be the whole message and see what comes back.
A warm, held expression invites your baby to respond socially and builds the habit of reading faces for emotional information.
Bond, Clap Together
Take both of your baby's hands in yours and bring them together in a slow, gentle clap. Say, "Clap." Pause, then let go and wait to see if they clap on their own.
Guiding a social gesture and then releasing it gives your baby a model they can start to perform independently, which builds social confidence.
Bond, You First
Sit across from your baby on the floor and wait in open silence. Let them make the first sound, movement, or gesture. Then respond warmly to exactly what they did, no more.
Letting your baby lead the interaction teaches them that their initiations matter and that you are genuinely paying attention to them.
Bond, Lap Sit and Look
Sit your baby in your lap facing away from you and look out at the room together. Say quietly, "What do you see?" and wait. Point to nothing—just share the view.
Sharing a perspective without a task builds companionable closeness and lets your baby feel secure while exploring the room with their eyes.
Bond, Song Pause
Start humming a short familiar tune—any few notes you repeat regularly—and then stop abruptly in the middle. Hold your face in a waiting expression and see how your baby reacts.
Stopping mid-pattern builds anticipation and shows your baby that they are actively listening, which reinforces the value of shared musical moments.
Bond, Hand in Hand
Sit beside your baby and simply hold their hand in yours with no movement, no talking, no task. Just sit together for a quiet moment and let the stillness be enough.
Undemanding physical contact without any goal teaches your baby that closeness doesn't always require doing something, which deepens felt security.
Bond, I'll Copy You
Watch your baby do any movement—any at all—and then copy it exactly. Do it once, pause, and watch their face to see if they notice you are doing what they did.
Imitation in reverse is deeply connecting. It tells your baby that their actions are interesting and worth repeating.
Bond, Gentle Pat Game
Pat your own knee with a slow, even rhythm. Then pat your baby's knee in the same rhythm. Stop, look at them, and wait to see if they pat back anywhere on their body.
A rhythmic touch exchange builds body awareness, attunement, and the back-and-forth structure of simple interaction.
Bond, Rock and Name
Hold your baby in your arms and rock slowly while saying their name softly in rhythm with the sway—one name, one sway. Keep it slow, quiet, and steady.
Hearing their own name carried on a rocking rhythm deepens the sense of being held and known at the same time.
Bond, Look Where I Look
Make eye contact with your baby, then slowly and deliberately turn to look at something across the room. After a few seconds, turn back and smile warmly at them.
Checking whether your baby follows your gaze—and returning to connect—reinforces joint attention, one of the most important building blocks of communication.
Bond, Belly Laugh Invitation
Blow a gentle puff of air onto your baby's tummy or neck and wait with an open, delighted expression. Don't tickle—just the air. Pause and watch what comes back.
Light, predictable physical play with a clear pause builds joyful anticipation and tells your baby that play is something you share together.
Bond, The Long Look
Hold your baby facing you and just look at their face slowly—eyes, nose, mouth—while staying soft and quiet. Let them look back however they want to.
Sustained, unhurried eye contact in a calm moment builds deep attunement and tells your baby that you find them genuinely interesting.
Bond, Wave Back
When your baby lifts their hand for any reason, treat it as a wave. Wave back warmly and say, "Hi!" with a soft smile. Do this consistently every time it happens.
Responding to an accidental gesture as if it were intentional encourages your baby to make it intentional, building early social communication.
Bond, Hum Together
Start humming a single low, steady note and see if your baby joins in at all—any sound counts. If they make a sound, shift your note slightly to match theirs.
Matching your voice to your baby's sound is a powerful act of attunement that tells them their voice shapes what happens.
Bond, Goodbye to the Room
Before leaving any room together, pause at the door and say, "Bye-bye, room" with a small wave. Keep it simple and do the same wave each time.
Tiny departure rituals build predictability and give your baby early language for transition, which eases the discomfort of change.
Bond, Quiet End
At the close of the day, sit with your baby in low light and do nothing but hold them. No phone, no talking, no stimulation—just the end of the day together.
A daily moment of complete stillness and closeness anchors your baby's sense of security and helps the nervous system wind down.`
  },
  {
    rangeStart: 56,
    rangeEnd: 60,
    text: `Think, Point and Wait
Point clearly to a cup on the floor and wait without saying anything. Watch to see if your child looks where you pointed. After a moment, say, "Cup," and nod toward it again.
Following a point without a word first is a more demanding version of joint attention and shows how well your child is reading your gestures.
Think, What Is It?
Hold a spoon behind your back, then slowly bring it into view, stopping when only part of it is visible. Say, "What is it?" and wait before revealing the rest.
Identifying a partially visible familiar object is an early recognition skill that builds visual memory and the habit of looking carefully.
Think, Give It to Me
Hold your open hand out toward your child and say, "Give it to me," with a warm, expectant look. Wait without reaching for whatever they are holding. Repeat once if needed.
Responding to a simple one-step verbal request is a key milestone at this age, and the pause gives your child time to process and act.
Think, Which Hand?
Hide a spoon in one fist and hold both closed hands out toward your child. Say, "Which hand?" and wait. Open the correct hand after they tap or touch one.
Choosing between two options and acting on that choice is an early problem-solving pattern that builds decision-making and focused attention.
Think, Turn the Page
Open a book in front of your child and place their hand on the edge of the page. Say, "Turn it," and wait to see if they push the page over. Help only at the very end if needed.
Turning a page on request combines listening comprehension, hand coordination, and a simple understanding of how books work.
Think, Spoon in the Bowl
Place an empty bowl on the floor and hand your child a spoon. Say, "Put it in," and wait. Don't guide their hand—just watch and give them the full moment to figure it out.
Placing an object inside a container on a verbal cue is a clear one-step direction that sits squarely at the 15-month milestone range.
Think, Shake It
Loosely cup your hands around an imaginary object and shake them side to side. Say, "Shake, shake, shake," and watch to see if your child imitates the action or sound.
Copying a novel action with accompanying words builds imitation and the connection between sound patterns and physical movement.
Think, Roll to Me
Sit on the floor facing your child with your legs apart and say, "Roll it to me," while tapping the floor in front of you. Wait, keeping your hands still, until they push the ball forward.
Responding to a directional verbal cue with a purposeful action is exactly the kind of one-step comprehension that blossoms around 14 to 15 months.
Think, Say Ball
Hold a ball in both hands at your child's eye level and wait in silence. If they reach for it, pull back slightly and say, "Say ball," gently. Wait a beat before handing it over whether or not they speak.
Pausing before giving a named object creates a natural reason for your child to attempt the word, without pressure or withholding.
Think, On the Floor
Hold a cup up and say, "Put it on the floor." Lower your hands and wait. Let your child take the cup and decide where to place it without guiding them to the right spot.
Following a two-word location phrase is an emerging skill at this age, and letting the choice be fully theirs keeps the moment pressure-free.
Think, Same Sound
Make a clear animal sound—a simple moo, a woof—and then pause and wait. If your child makes any sound back, mirror it. If they are quiet, make the sound once more and wait longer.
Imitating and extending a sound game builds early vocal flexibility and the expectation that sounds get a warm response.
Think, Book Look
Hold a book open and point slowly to different images one at a time without naming them. After each point, look from the picture to your child's face and wait for any reaction.
Watching where you point and registering something about it is a quieter and more advanced version of joint attention than always having a word attached.
Think, Flip and Fill
Place a bowl upside down on the floor and tap it once. Say, "Flip it," and wait for your child to turn it right side up on their own. Once they do, hold out a spoon and wait to see what they do next.
Recognizing that a flipped bowl needs to be righted before it can be used is a small but genuine problem-solving step that connects observation to intentional action.
Think, Find Your Foot
Sit facing your child and say, "Where's your foot?" with an open, waiting expression. Give them a long pause before gently tapping your own foot to offer a hint.
Locating a named body part on themselves is a clear 15-month milestone and a reliable way to check verbal comprehension is growing.
Think, Do What I Do
Tap your head once with an open hand and say, "Do this." Hold still and wait. If they tap any part of their body, smile and repeat the action rather than correcting where they tapped.
Imitating a demonstrated action on their own body builds motor planning, self-awareness, and the foundational skill of learning by watching.
Think, Cup Upside Down
Place a cup right side up, then flip it upside down slowly. Say, "Upside down." Flip it right side up again and say, "Right side up." Do it twice and then hand it to them.
Watching an object be deliberately reoriented and hearing a matching phrase builds spatial awareness and early positional vocabulary.
Think, Look, It's Gone
Hold a spoon in front of your child, then move it slowly behind your back and say, "Gone." Pause, bring it back, and say, "There it is." Wait for any expression of surprise or expectation.
Combining a disappearance word with the physical experience strengthens object permanence and the early vocabulary for presence and absence.
Think, Book or Bowl?
Place a book and a bowl side by side on the floor. Say, "Give me the book," and wait with your hand open. Offer no other hints. If they hand you the bowl, accept it warmly and try once more.
Selecting a named object from two choices is a language comprehension task appropriate for this age that doesn't require any pressure to perform.
Move, Walk and Stop
Walk slowly alongside your child, then say, "Stop," and plant your own feet. Wait to see if they slow or pause before walking again. Keep it light and repeat three or four times.
Building a connection between a spoken word and a full-body stop is an important coordination and early self-regulation milestone.
Move, Squat and Pick Up
Place a ball on the floor and walk past it slowly with your child. Pause near it and squat down to pick it up yourself. Set it back down and wait to see if they try to squat and reach for it too.
Squatting to retrieve an object from the floor and standing back up is a functional movement toddlers practice constantly and need to build strength for.
Move, Walk the Line
Lay a towel flat in a straight line on the floor. Hold your child's hand and walk slowly along the length of it, stepping on it with each foot. Turn at the end and walk back.
Following a visible path on the floor adds a spatial goal to walking and very gently challenges attention and direction at the same time.
Move, Bend and Touch
Stand with your child and say, "Touch the floor," while bending forward slowly and touching the floor yourself. Stand up and wait to see if they try it too.
Bending from standing to reach the floor builds hamstring and lower back flexibility and teaches basic body control in an upright position.
Move, Walk Backward
Hold both of your child's hands, face them, and take a slow step backward, gently drawing them forward. Take two or three steps this way, pause, then guide them a step backward too.
Walking backward is a balance challenge that requires your child to trust their footing without visual confirmation of where they are stepping.
Move, Sit and Scoot
Sit on the floor beside your child and show them how to scoot forward on your bottom by shifting weight from side to side. Pat the floor ahead of you and see if they join in.
Bottom-shuffling engages core muscles and builds rhythmic alternating movement in children who are still developing confidence on their feet.
Move, Toss Up
Hold your child's hands and help them lift a small ball slightly overhead and release it so it drops in front of them. Say, "Up and drop." Wait for the ball to land, then offer it back.
Releasing an object in an upward direction requires a different arm pattern than forward throwing and builds shoulder mobility and release timing.
Move, Follow the Hand
Crouch at your child's level and slowly move your open hand in a low arc across the floor in front of them. Wait to see if they follow it by crawling, stepping, or reaching.
Following a moving target through space builds visual tracking and motivated whole-body movement at the same time.
Move, Lower to Tummy
From standing with light support, slowly guide your child down onto their tummy on the floor, letting them lower themselves one step at a time. Help only enough to prevent a sudden drop.
Controlled lowering from standing to tummy develops body awareness, joint stability, and the understanding that getting to the floor can be intentional and safe.
Move, Push and Follow
Place a firm pillow against the wall and guide your child to push it along the wall with both hands while walking beside it. Stay close and let them set the pace.
Pushing a surface while walking upright builds shoulder engagement, upright posture, and forward walking confidence in a supported way.
Move, One Hand Walk
Hold one of your child's hands loosely—just fingertips—and walk beside them slowly. Loosen your grip gradually over a few steps to give them as much independence as possible.
Reducing hand support incrementally gives your child a chance to find their own balance without a sudden loss of security.
Move, Throw Down
Hold your child's hand at shoulder height while they hold a ball and guide a downward toss onto the floor. Say, "Down." Retrieve it and wait to see if they reach for another turn.
A controlled downward release builds wrist and arm coordination in a different plane than a forward throw and is easier to manage for most toddlers.
Move, Walk to the Wall
Stand your child a few steps from the wall and pat the wall with your hand. Say, "Come touch it," then step back. Let them walk to the wall and press their hands against it.
Walking with a clear destination in mind gives your child a purposeful goal that motivates steadier, more intentional steps.
Move, Step and Reach
Stand your child at the edge of a blanket on the floor. Place a cup just past the far edge. Let them step off the blanket onto the floor and reach for the cup without help.
Stepping onto a different surface texture and reaching forward at the same time challenges balance and spatial confidence in a low-risk way.
Move, Carry and Deliver
Hand your child a bowl and point to a spot a few steps away on the floor. Say, "Take it there," and walk alongside them without holding their hand.
Carrying an object to a specific destination builds walking purpose, balance with a held load, and early direction-following all at once.
Move, Tip and Catch
Sit on the floor facing your child and slowly tip to one side, catching yourself with your hand before falling. Sit up and wait to see if they lean to copy the movement.
Controlled lateral tipping and self-catching builds the lateral balance response that toddlers rely on when they stumble and need to catch themselves.
Move, Floor to Kneel
Help your child move from sitting on the floor to a tall kneeling position by guiding their hands forward until they are upright on both knees. Hold for a moment, then let them sit back down.
Tall kneeling builds hip stability and the trunk upright strength that bridges the gap between floor play and standing movement.
Move, Stomp Once
Stand beside your child and lift one foot in an exaggerated stomp. Say, "Stomp." Wait and watch before doing it again. If they lift a foot at all, respond with the same warmth as a full stomp.
Deliberate stomping builds single-leg balance for a brief moment and introduces controlled, forceful movement that toddlers find satisfying.
Bond, Call and Smile
Say your child's name in a warm voice and wait for them to turn toward you. When they look, answer with a big smile like you were hoping to find each other.
This strengthens name response and makes social connection feel rewarding and safe.
Bond, Face Check
Sit close and look at your child's face with genuine softness for a quiet moment. Say, "I see your eyes. I see your nose." Touch each one gently as you name it.
Slow, named attention on your child's face builds body awareness and communicates that every part of them is worth noticing.
Bond, The Waiting Game
Look at your child from across the mat with a calm, open expression and say nothing. Wait as long as it takes for them to make any move toward you—a crawl, a step, a sound.
Holding space without calling or prompting teaches your child that they are free to come to you, and that you will always be there when they do.
Bond, Catch and Hug
Crouch with your arms open and wait for your child to walk or toddle into them. When they arrive, close your arms around them warmly and say, "Got you."
A predictable, welcoming physical landing builds walking confidence and tells your child that coming to you always feels good.
Bond, Side by Side
Sit beside your child on the floor, not facing them, and simply watch what they are doing. Breathe quietly, stay close, and let them lead whatever comes next.
Parallel presence without direction tells your child they are interesting to be near, which builds a relaxed and secure sense of connection.
Bond, Silly Mouth
Press your lips together, puff your cheeks, and then pop them with a sound. Look at your child with wide eyes and wait. Try it once more if they seem unsure what happened.
Unexpected, gentle silliness invites joy and builds the shared sense of humor that is a genuine part of early emotional connection.
Bond, This Is Your Hand
Take your child's hand in both of yours and look at it together. Say, "This is your hand," quietly. Turn it gently, touch each finger, and end by pressing it softly between your palms.
Unhurried, attentive physical contact paired with simple naming builds body awareness and communicates deep, specific attention.
Bond, Nod and Wait
Ask your child a simple yes-or-no question in a warm tone—"Do you want the ball?"—and then nod your head slowly in an inviting way. Wait for any head movement or gesture back.
Learning that a head nod communicates something is an important pre-verbal milestone, and practicing it in a low-stakes way makes it feel natural.
Bond, End It Together
Whenever you finish an activity together, say, "All done," and spread your hands open. Pause and watch to see if your child mirrors the gesture or the sound at all.
A consistent closing phrase and gesture gives your child a reliable signal that transitions are coming, which reduces surprise and builds trust in routine.
Bond, Name the Feeling
When your child makes a clear expression—frustrated, excited, surprised—pause and name it quietly. "You look excited," or "That was surprising," said warmly without judgment.
Hearing a calm, accurate word placed on a feeling in real time is how your child begins to build an inner vocabulary for their emotional life.
Bond, Chest to Chest
Hold your child facing you with their chest against yours and rock very slightly. No song, no words—just the closeness and the gentle movement together.
Direct physical contact without any additional input is one of the most calming and connecting experiences available to a toddler at any point in the day.
Bond, Your Laugh, My Laugh
When your child laughs at something, pause and laugh back in the same tone and length. Don't add to it or redirect—just match their laugh as accurately as you can.
Mirroring a laugh back tells your child that their joy is contagious and worth sharing, deepening the emotional resonance of the moment.
Bond, Tap My Shoulder
Sit beside your child and gently tap your own shoulder once. Say, "Tap." Then offer your shoulder toward them and wait to see if they tap it too. Accept any touch as a complete response.
A shared touch game builds reciprocal interaction and body awareness while keeping physical connection completely on the child's terms.
Bond, I'm Watching
Tell your child quietly, "I'm watching you," and then simply observe them for a full minute without directing, correcting, or narrating. Let your presence be the whole message.
Sustained, non-directive attention communicates genuine interest and builds your child's sense that they are worth watching just as they are.
Bond, Pass It Back
Sit across from your child and hand them a cup. Wait. If they hand it back, take it warmly and pass it over again. If they hold onto it, open your hand and wait without asking.
Object exchange without words is a pure social turn-taking game that builds interaction rhythm and the pleasure of shared back-and-forth.
Bond, Low Voice Close
Lean close to your child's ear and say something simple in a very low, gentle voice—"I've got you," or just their name. Pull back slowly and watch their face.
A quiet voice close to the ear creates a private, intimate moment that signals deep safety and strengthens your child's sense of being especially known.
Bond, What Do You Think?
Show your child something ordinary—a cup, a blanket—and ask, "What do you think about this?" in a genuinely curious tone. Wait through whatever response comes.
Treating your child's reaction to anything as a valid opinion builds their sense that their responses matter and that conversation is worth having.
Bond, Still and Close
At any moment of the day, stop whatever you are doing, sit down close to your child, and just be still beside them for one quiet minute. No phone, no task, no agenda.
A complete pause next to your child—unplanned and unstructured—is one of the clearest ways to show them that they are more interesting than anything else.`
  },
  {
    rangeStart: 60,
    rangeEnd: 64,
    text: `Think, Show Me the Ball
Hold the ball where your child can see it and ask, "Where's the ball?" Pause before moving it or saying anything else and let them search with their eyes first.
This builds word understanding and helps your child connect a spoken label to a familiar object.
Think, Hand Me the Spoon
Place a spoon and a cup on the floor in front of your child. Hold out your open hand and say, "Hand me the spoon." Wait with your hand open and your face calm and expectant.
Selecting and delivering one named object from two choices is a clear one-step comprehension task that sits right at the heart of 15-month language development.
Think, Where's Your Tummy?
Sit facing your child and ask, "Where's your tummy?" in a warm, curious voice. Wait a full few seconds before touching your own tummy as a gentle hint.
Locating named body parts on themselves without a visual model first shows that your child is holding word meanings in memory.
Think, What's Missing?
Place a ball and a spoon on the floor in front of your child. Let them look for a moment, then slide one behind your back while they watch. Say, "What's missing?" and wait.
Noticing that something that was there is now gone requires your child to hold a small mental picture of the original scene, which is a meaningful cognitive step.
Think, Say It First
Hold a cup just out of your child's reach and wait with a warm, open expression. Don't hand it over immediately—give a quiet beat for any sound or word attempt before offering it.
A brief, pressure-free pause before receiving a wanted object is one of the most natural ways to invite early word use without turning it into a demand.
Think, Knock and Listen
Tap the side of an empty bowl slowly with one finger and then pause. Look at your child and tap again. After the third tap, slide the bowl toward them and wait.
Listening carefully to a repeated sound and watching for a pattern builds auditory attention and the beginning of anticipation-based learning.
Think, Two Things, One Name
Hold a spoon in one hand and a cup in the other. Say, "Spoon," and wait to see if your child looks at or reaches toward the correct one. Then switch hands and try the other word.
Recognizing a named object when it appears in a different position or hand shows that your child's word knowledge is becoming flexible and reliable.
Think, Look Then Find
Hold a ball in front of your child and let them look at it for a moment. Put it behind your back and say, "Find it." Wait before giving any hint about which hand it's behind.
Holding an object in mind after it disappears and actively searching for it is a more confident version of object permanence than earlier peek-a-boo style games.
Think, Book, Point, Name
Open a book to any page and wait without pointing first. Watch to see if your child points to anything on their own. Then name whatever they point at, clearly and once.
Allowing your child to lead the pointing before you name anything gives language a real communicative purpose rather than a performance.
Think, Copy the Sound
Make a simple two-syllable sound—"ba-ba" or "ma-ma"—and wait. If your child copies it, shift the sound slightly and wait again. Keep turns short and responses warm.
Matching and adjusting a vocal back-and-forth at this age shows growing phonological awareness and confirms that imitation is becoming reliable.
Think, Fill and Empty
Put three spoons into a bowl one at a time, saying "in" each time. Then tip the bowl and say "out" as they spill. Hand the bowl to your child and wait to see what they do with it.
Watching a sequence of fills followed by a full empty gives your child a small cause-and-effect narrative to process and potentially repeat on their own.
Think, Big Clap, Small Clap
Clap your hands together loudly once, pause, then clap them very softly once. Say, "Big," and "Small," matching the word to each clap. Do it twice more and watch your child's hands.
Contrasting two intensities of the same action with a paired word helps your child begin to understand that one action can happen in different degrees.
Think, Slow Reveal
Lay a small towel over a cup completely. Say, "Cup's hiding," and wait. Lift just one edge of the towel to show the very rim of the cup. Pause and watch before lifting the rest.
A partial reveal at this age is more demanding than a full hide-and-find because your child must use the partial clue to form a complete guess.
Think, Where Does It Go?
Hold a spoon above a bowl and pause. Say, "Where does it go?" with a genuinely curious face. Wait to see if your child gestures toward the bowl or makes any guiding motion.
Pausing before an obvious action and asking your child to direct it gives them an early experience of being the one who knows what comes next.
Think, Tap the Picture
Open a book and point to one picture without naming it. Tap it twice and say, "What's this?" then hold still. Whether or not a word comes, name it warmly and tap once more.
The expectant pause before naming pulls your child into active word-retrieval rather than passive listening, which builds stronger vocabulary roots.
Think, One Word, Wait
Say one clear familiar word—"up," "down," "ball"—and then go completely quiet with a warm face. Give your child ten full seconds of silence to respond in any way they choose.
Extended silence after a single word is one of the most underused language tools at this age, and it teaches your child that their response is genuinely expected.
Think, Hand In or Out?
Hold your open hand out toward your child, palm up. Say, "In," and mime placing something in it. Then flip your hand and say, "Out." Do it twice and offer your hand again.
Mapping two opposite words to two physical positions builds the kind of concrete paired contrast that helps vocabulary stick quickly.
Think, Echo Back
When your child makes any word-like sound or says a recognizable word, repeat it back to them in the same tone at a slight delay, as if confirming what you heard.
Echoing a child's own word back to them is a powerful way to confirm that communication worked, which makes your child far more likely to keep trying.
Move, Walk Around Me
Stand still and hold your arms slightly out. Tell your child to walk all the way around you, making a circle. Point to where to start and let them find their own path.
Navigating a circular path around an obstacle requires your child to plan direction, adjust speed, and use balance in a continuous, self-directed way.
Move, Turn and Find It
Roll a ball a short distance away, then stand still and say, "Go get it." Let your child walk to it, pick it up if they want, and bring it back or leave it. No pressure either way.
Walking to a destination, pausing at it, and potentially turning back is a more complex movement sequence than a straight-line walking practice.
Move, Fast and Slow
Walk beside your child and say, "Fast," while picking up your own pace slightly. After a few steps, say, "Slow," and drop back to a near-crawl pace. Let them watch and match you.
Changing walking speed on a verbal cue builds body control and begins linking a word to a physical shift in effort and timing.
Move, Wide Arms
Walk beside your child with your arms stretched out wide to the sides. Point to your arms and invite them to do the same as you walk slowly together.
Walking with arms extended out shifts balance demands onto the core and legs and builds postural awareness in a way that normal arm-at-side walking doesn't.
Move, Back Against the Wall
Guide your child to stand with their back flat against the wall, then step away. Say, "Stay there," and count to three before walking back to them.
Standing independently against a flat surface with no forward lean builds upright posture and gives your child a clear physical reference for what straight standing feels like.
Move, Drag the Towel
Lay a towel flat on the floor and show your child how to grab one end and drag it across the floor while walking backward a few steps. Let them try pulling it on their own.
Walking backward while pulling a light load builds awareness of the space behind them and trains the reverse balance pattern in a purposeful, satisfying way.
Move, Tiptoe Steps
Hold one of your child's hands and rise up on your own toes as you walk slowly forward. Say, "Tiptoes," and see if they try to lift their heels too, even briefly.
Rising onto the balls of the feet while moving builds calf strength, ankle stability, and the balance control that more advanced movement patterns rely on.
Move, Step Over the Line
Lay a towel flat and step over it with an exaggerated high step, saying, "Over." Then stand back and wait for your child to try stepping over it on their own.
Stepping over a visible mark with a high-knee lift builds the hip flexor strength and single-leg balance that toddlers find satisfying.
Move, Kick and Chase
Set a ball on the floor a step in front of your child's foot. Point to it and say, "Kick it." After the kick, walk alongside them as they go after wherever the ball lands.
Kicking and then immediately chasing the ball combines a single-leg weight shift with purposeful walking toward an unpredictable target.
Move, Throw and Turn
Help your child hold a ball and give a forward roll-throw along the floor. The moment it leaves their hands, say, "Turn," and wait to see if they pivot to watch where it went.
Releasing an object and then immediately orienting toward its path builds spatial tracking and the foundational awareness that actions have consequences in space.
Move, Kneel and Reach Forward
Guide your child into a tall-kneeling position on the floor. Place a cup just past their arm's length and wait for them to lean forward to reach it without sitting back down.
Reaching forward from a kneeling position without toppling requires core stability and hip control that is still actively developing at this age.
Move, Spin Slow
Stand beside your child and slowly turn in a full circle on the spot while saying, "Spin." Return to where you started and wait to see if they attempt any version of a turn.
A slow self-rotation challenges the vestibular system and spatial orientation in a way that straight-line walking and stopping do not.
Move, Up on Toes, Then Down
Stand facing your child and slowly rise onto your toes, then lower your heels back to the floor. Do it three times, saying, "Up, down," each time, and watch their feet.
Rising and lowering on the toes in a controlled rhythm strengthens the ankle muscles and builds the kind of fine foot control that confident walking requires.
Move, Carry It High
Hand your child an empty cup and mime carrying it above your head, then bring it back down. Say, "Carry it high," and walk a few steps alongside them as they hold it up.
Holding something overhead while walking changes the center of gravity and challenges core and postural balance in a new and useful way.
Move, Jump Try
Stand facing your child, take both their hands, and say, "Jump." Bend your knees in an exaggerated way and spring up slightly. Let them feel the upward energy through your hands.
First jump attempts are emerging at this age and are mostly a crouch-and-rise rather than a true lift, so a supported, playful try with no height involved is exactly the right introduction.
Move, Push Off the Wall
Place your child's palms flat against the wall. Say, "Push," and let them press hard against the surface. After a moment, say, "Walk away," and let them step backward.
Pushing hard against a stable surface and then releasing builds arm strength, body tension awareness, and an early feel for force and its results.
Move, Stand and Look Down
Stand your child on a firm flat surface—the floor—and say, "Look at your feet." Wait while they tilt their chin down and look. Hold their hand if they wobble looking down.
Looking down at their own feet while standing challenges balance because the head shift moves the center of gravity, making the body work harder to stay upright.
Move, One Foot Up
Hold both of your child's hands and say, "One foot up." Lift one of their feet gently by raising their knee. Hold for two seconds and lower it. Try the other side.
Briefly holding all weight on one leg builds the single-leg stance control that underlies every step of walking and is actively maturing at this age.
Bond, Hello Eyes
First thing in the morning or after a nap, crouch to your child's level and wait for them to meet your eyes before you say anything at all. Let the eye contact come first.
Starting an interaction with silent eye contact before words tells your child that being seen comes before being talked to, which is a deeply settling experience.
Bond, Your Choice
Hold out two allowed objects—a spoon and a cup, for example—and say, "Which one?" with genuine openness. Accept whichever one they choose without redirecting.
Honoring a small, clear choice builds your child's sense of agency and communicates that their preferences are real and worth respecting.
Bond, Proud Clap
When your child does anything with effort—walks across the room, picks something up, makes a sound—pause, look right at them, and clap slowly two or three times.
A deliberate, directed response to effort rather than outcome builds your child's sense that trying something is what earns your warm attention.
Bond, High Five
Hold your open palm up at your child's level and wait. If they don't reach for it, tap their hand gently first as a model and then offer yours again.
A high five is a small social ritual that builds shared celebration and gives your child an early gesture for positive social exchange.
Bond, Tell Me More
When your child makes any sound, word, or babble that sounds like a story, lean in slightly with a soft look and say, "Tell me more." Wait through whatever comes next.
Responding to babble as if it is real and interesting communication teaches your child that their voice matters and that they are worth listening to at length.
Bond, Cheek to Cheek
Draw your child close and press your cheek gently against theirs. Stay still for a moment without talking. Let the quiet contact be the whole thing.
Cheek-to-cheek stillness is a simple, direct form of physical closeness that communicates warmth and safety without any words or tasks attached.
Bond, Thank You Exchange
Hand your child a cup and say, "Thank you," with a warm nod as if they gave it to you. Then hold it out and wait. If they take it, receive it again with the same warmth.
Modeling a thank-you exchange in a repeated, natural rhythm gives your child a lived experience of reciprocal politeness before they can produce the words themselves.
Bond, Look at That
Pick up any ordinary object nearby—a spoon, a bowl—and hold it with exaggerated curiosity, turning it over as if seeing it for the first time. Look at your child and then back at it.
Sharing genuine-seeming wonder at an ordinary thing invites your child into a moment of joint discovery, building the habit of noticing the world together.
Bond, Find My Hands
Put both hands behind your back and say, "Where are my hands?" with wide eyes. Wait. Then slowly bring them out and spread them open toward your child.
A simple disappearance-and-reveal with your own hands builds anticipation and gives your child a turn to watch, guess, and be delighted at a familiar age.
Bond, Slow Hug
Hold your arms open and wait for your child to walk in. When they do, close your arms slowly and deliberately rather than quickly, and hold the hug for a full quiet breath.
A slow, intentional hug communicates that you are choosing to be here, fully, which gives your child a physically felt version of being valued.
Bond, Copy My Walk
Walk across the floor in a deliberately slow, bouncy, or exaggerated way. Stop, look at your child with a grin, and then start again. Invite them to walk like you are walking.
Playful movement imitation is a social game that builds connection through shared silliness and shows your child that their body and yours can be in conversation.
Bond, Belly Breath Together
Sit across from your child and take one slow, visible breath in through your nose and out through your mouth. Do it twice more. Keep your face soft and your pace very slow.
Breathing visibly and slowly in front of your child is one of the most accessible ways to introduce co-regulation and give your child a model for calming their own body.
Bond, Name and Nod
Say your child's name once. When they look at you, nod slowly and smile without saying anything else. Let the moment be only that—seen and acknowledged.
A name followed by a nod rather than a request or a task teaches your child that being called is not always the beginning of a demand, which builds trusting name response.
Bond, I'm Here
When your child is playing alone and seems absorbed, sit nearby and say very quietly, "I'm here," without interrupting what they are doing. Then go back to watching.
A quiet verbal confirmation of presence without interruption tells your child that your closeness is a gift with no strings attached.
Bond, Close Eyes Together
Sit facing your child, make soft eye contact, and then slowly close your eyes for three seconds. Open them and look at your child with a warm, settled expression.
Closing your eyes in front of your child and opening them to find them still there is a small, gentle trust exercise that deepens mutual attunement.
Bond, The Good Spot
When your child climbs into your lap or leans against you, say softly, "That's your good spot," and put a gentle hand on their back. Stay still and let them settle.
Naming a physical place of belonging gives your child early language for comfort-seeking and tells them that coming to you for closeness is always welcome.
Bond, What Happened?
After your child has any experience—a small tumble, a surprise sound, a new thing—crouch to their level and say, "What happened?" in a calm, curious voice and wait.
Inviting your child to process an experience with you rather than dismissing it or rushing past it builds emotional processing and tells them their inner world is worth exploring.
Bond, End of Day Hold
At the close of the day, sit down and hold your child with no purpose other than the hold itself. No phone, no talking, no next thing. Let this be the last thing before the night begins.
A daily moment of complete, undistracted physical closeness at the day's end gives your child a consistent anchor of safety to carry into sleep.`
  },
  {
    rangeStart: 64,
    rangeEnd: 68,
    text: `Think, Two Words, One Action
Hold a cup up and say, "Cup down," then place it on the floor slowly. Pick it up again and say, "Cup up." Do it twice more and then hand the cup to your child and wait.
Pairing two words to a single clear action helps your child begin absorbing short word combinations as meaningful units, not just individual labels.
Think, My Turn Your Turn
Hold a spoon out to your child. When they take it, open your hand and say, "My turn." Wait for them to pass it back. Take it, pause, and offer it again with the same warmth.
A clean, wordless object exchange that follows a verbal cue builds turn-taking rhythm and the early social understanding that things go back and forth.
Think, Listen and Point
Make a sound with your hand—a single tap on the floor—while your child's back is turned or they are looking away. Wait to see if they turn and look toward where the sound came from.
Locating a sound source without seeing the action requires active listening and spatial awareness that is developing steadily at this age.
Think, Name then Fetch
Place a ball and a bowl apart on the floor. Step back and say, "Get the bowl," with a calm, clear voice. Give your child plenty of time before offering any gesture hint.
Fetching one named object from a visible pair on a single verbal cue is a reliable one-step comprehension check grounded in 15 to 18 month milestone guidance.
Think, Do It Slower
Tap the floor three times at a normal pace. Then do it again very slowly, with a long pause between each tap. Watch to see if your child tracks the rhythm change.
Noticing a change in pace requires sustained attention and the early ability to hold an expectation and register when something shifts.
Think, Book Then Blanket
Lay a book flat and then set a blanket over it. Say, "Book is under there," and wait. Let your child pull the blanket off on their own without any further prompting.
Finding a flat hidden object without a clear bump or shape hint is more cognitively demanding than a visible-bump hide, pushing object permanence further.
Think, Show Me Two
Hold up two fingers and say, "Two taps," then tap the floor twice. Hold your fingers up again and wait to see if your child attempts to tap twice too.
Connecting a visual number cue to a repeated action is an early pre-counting experience that builds pattern recognition and attention to quantity.
Think, Nod or Shake
Ask your child a very simple question—"Is this a cup?"—while holding up a cup clearly. Then wait to see if they nod, shake their head, or offer any gestural response at all.
Responding to a yes-or-no question with a gesture rather than a word is an important communication milestone that blossoms between 15 and 18 months.
Think, Get Your Foot
Sit across from your child and say, "Get your foot," without touching your own foot as a hint. Wait through a long pause before offering any model.
Finding a named body part without a simultaneous visual model requires the word to exist independently in memory, which is a stronger test than imitation-based naming.
Think, Loud Then Quiet
Say your child's name in a normal voice, then lean in and say it again in a near-whisper. Pause between the two and watch their face register the shift.
Noticing and responding to a deliberate change in vocal volume builds auditory discrimination and the early awareness that the same word can carry different qualities.
Think, Same or Different
Hold two cups together and say, "Same." Then hold up a spoon and a cup and tap those together, saying, "Different." Pause and look at your child's face.
Introducing the concept of sameness and difference with two familiar objects is an accessible starting point for early classification thinking.
Think, Which Is Bigger?
Hold a large bowl in one hand and a cup in the other at your child's eye level. Say, "Which one is bigger?" and wait. Accept any look, reach, or gesture toward either one as a real answer.
Comparing sizes out loud and inviting a response—even without expecting a correct answer—plants the early vocabulary and habit of comparative thinking.
Think, Put It Behind
Hold a cup out and say, "Put it behind you," making no gesture. Wait while your child processes the instruction. Give them a full pause before gently helping if truly stuck.
Following a spatial direction—behind—without a pointing cue asks your child to hold a positional word in memory and translate it into body movement.
Think, Watch Then Go
Sit still and do nothing for ten full seconds while your child watches you. Then tap the floor once, suddenly. Watch their face. Wait, then do it again after another pause.
Sustained anticipation followed by a sudden clear action builds attentional holding and the ability to stay focused while waiting for something to happen.
Think, Spoon Book Ball
Place a spoon, a book, and a ball on the floor. Point to each one and name it slowly. Then look away, rearrange one of them slightly, and ask, "Where's the spoon?"
Tracking the location of a named object after a small scene change builds early spatial memory and more confident object-word linking.
Think, Inside Voice Outside Voice
Say a single familiar word—"bowl"—in a regular voice, then repeat it in an exaggerated whisper. Look at your child and raise your eyebrows. Do it once more with a different word.
Playing with vocal register around familiar words builds phonological awareness and shows your child that how something is said is as meaningful as what is said.
Think, One More
Roll a ball to your child once and wait. Then hold up one finger and say, "One more," before rolling it again. Pause after the second roll and hold your hands open to see what they do.
Anticipating and requesting a repeated action using a simple phrase builds early counting concepts and gives your child a functional reason to understand "more" and "one."
Think, Copy Then Change
Tap your knee twice. Let your child copy. Then tap your knee three times and wait to see if they notice the change and adjust their copy at all.
Detecting and matching a change in a repeated pattern is a step up from straight imitation and builds early sequential attention and working memory.
Move, Stop Then Go
Walk with your child for a few steps, then stop your body and wait. After a short pause, start again and let them feel the change with you.
This helps your child practice movement control and notice simple shifts in rhythm.
Move, Walk and Pause at the Wall
Walk toward the wall with your child and say, "Stop," just before you reach it. Let them walk up to the wall, place their hands on it, and pause before turning back.
Stopping near a surface and using it as a physical landmark builds spatial awareness and voluntary movement control at the same time.
Move, Carry and Put Down
Hand your child an empty bowl and walk with them to a spot on the floor a few steps away. Say, "Put it down," and wait for them to lower it with control rather than drop it.
Carrying a light object and setting it down deliberately builds arm control, posture, and the intention behind an action that goes beyond simply releasing something.
Move, Turn and Walk Back
Walk four or five steps with your child in one direction, then say, "Turn around," and pivot yourself to face the other way. Walk back the same distance and see if they follow the full sequence.
Reversing direction on a verbal cue after a few steps of forward walking adds a planning element to basic locomotion and trains awareness of the space just traveled.
Move, Crouch and Look Under
Crouch low to the floor yourself and look under a surface—an edge of a blanket or between the floor and the wall's baseboard. Say, "Look under here," and wait for your child to crouch too.
Lowering the whole body to look at something from a new angle builds functional squatting and the spatial curiosity needed to explore environments actively.
Move, Jump Feet Together
Hold both of your child's hands firmly as they stand, say, "Jump," and support a small two-foot spring off the floor. Lower the support gradually over multiple tries.
A fully supported two-foot takeoff and landing is the safest introduction to true jumping and builds the explosive hip and leg extension that independent jumping will require.
Move, Roll Down
Lay your child on the floor and guide a log roll across a flat surface by tucking their arms in and giving one gentle push at the shoulder. Let them roll one full rotation.
Whole-body rolling builds vestibular awareness, trunk rotation, and the full-body coordination that supports more complex movement sequences later.
Move, Walk and Look Up
Walk beside your child and say, "Look up," while tipping your own face upward as you walk slowly. Let them try walking while looking toward the ceiling for a few steps.
Walking while deliberately shifting head position away from the ground challenges balance and postural adjustment in a demanding but safe way.
Move, Reach and Step
Hold a cup just to one side of your child's body at waist height while they stand. Wait for them to step toward it and reach, rather than just leaning and grabbing.
Taking a deliberate step to reach something slightly outside the body's range builds intentional weight transfer and the early planning of foot placement.
Move, Back It Up
Stand facing your child and take three slow, deliberate steps backward while saying, "Back, back, back." Stop and wait. Hold your hands out in case they try to follow you.
Independent backward stepping is an emerging skill at this age that requires proprioception and trust in the space the body can't see.
Move, Throw Up High
Help your child hold a ball and guide an upward toss so it goes slightly above their own head height. Say, "Up high," and watch where it lands together before doing it again.
An upward release is a different motor pattern from a forward throw and builds shoulder rotation and the spatial tracking of an object moving in a vertical arc.
Move, Stomp a Rhythm
Stomp your own foot in a slow two-beat rhythm and wait. After a few moments, stomp again and see if your child tries to match the beat with any foot movement.
Matching a rhythmic stomp builds timing, single-leg loading, and the very beginning of beat coordination which is connected to broader motor development.
Move, Lean to the Side
Stand beside your child and slowly lean your whole body to one side like a tree in the wind, then right yourself. Say, "Lean," and do it once more on the other side.
Voluntary lateral leaning and recovery trains the balance-correction response and builds the hip and ankle strength needed to recover from off-balance moments while walking.
Move, Follow My Feet
Walk slowly across the floor and say, "Step where I step." Point down to your own feet and take one deliberate step, pausing and waiting for your child to place their foot nearby before you take the next one.
Following a leader's foot placement one step at a time builds spatial attention and intentional foot control, adding a new layer of purpose on top of basic forward walking.
Move, Ball Against Wall
Help your child stand near a wall, place a ball against it, and push it into the wall with both hands. Let the ball bounce back and wait for them to push again.
Pushing a ball against a firm surface and feeling the resistance builds arm strength and gives an immediate physical cause-and-effect feedback loop.
Move, Rock Side to Side Standing
Stand beside your child and rock slowly from one foot to the other in a wide, deliberate sway. Say, "Rock," and do it at a pace slow enough for them to see each weight shift.
Deliberate side-to-side weight transfer while standing builds the balance and hip-stabilizer strength that underlie confident, steady walking.
Move, Lift the Blanket
Lay a small blanket over your child's feet while they stand. Say, "Kick it off," and wait for them to shake or kick their feet free without holding their hand.
Lifting the feet while standing to free them from a cover requires single-leg balance and deliberate foot control in a low-stakes, playful context.
Move, Walk to the Sound
Move to a different part of the room, tap the wall once, and call your child's name. Wait for them to walk toward the sound without visual guidance.
Walking toward an auditory cue in a known space builds directional movement, purposeful navigation, and confidence in moving toward something out of reach.
Bond, Both Hands Held
Sit across from your child, reach out both hands with palms up, and wait for them to place their hands in yours. Hold them quietly for a moment, doing nothing else.
Being held still by an attentive person who asks nothing in return gives your child a grounded, safe physical experience of unconditional presence.
Bond, Say It Again
When your child says any word or word-like sound, repeat it back warmly and then wait. If they say it again, repeat it again with a slight smile. Let the loop run as long as they want.
Echoing a child's own word back without expanding or redirecting it tells them that what they said was complete, good, and worth repeating.
Bond, Where Did You Go?
Cover your own face with both hands and say nothing. Wait a few seconds, then lower your hands and say their name with a surprised, delighted expression. Do it once more.
A simple face-disappear-and-return game builds anticipation and social joy and reinforces that your face is a source of warmth and playful surprise.
Bond, Your Worry, My Arms
When your child seems frustrated or unsettled, lower yourself to their level, open your arms, and wait without talking. If they come in, hold them without commenting on what was wrong.
Offering physical comfort without words first teaches your child that their body can always come to yours, and that calm is something you hold together.
Bond, Watch and Nod
While your child plays, watch them for one full minute with a relaxed, interested face. Every so often, nod quietly. Say nothing and redirect nothing.
Sustained, non-directive watching with a warm face communicates genuine interest and tells your child that simply being themselves is enough to hold your full attention.
Bond, Hand Over Hand
Hold a spoon with your child's hand wrapped loosely over yours. Move it together in a slow stir. Then still your hand and wait to see if they keep moving it alone.
Shared movement followed by a handover teaches your child that your hands and their hands can work together and that taking over is always welcome.
Bond, High and Low Five
Hold your hand high and say, "High five," then drop it low and say, "Low five." Let your child slap your hand at whatever height they can comfortably reach each time.
A two-part social game with a clear sequence and reliable payoff builds shared ritual, joyful turn-taking, and the fun of a predictable interaction.
Bond, Slow Spin Together
Hold both of your child's hands and slowly turn together in a small circle on the spot. Keep it very slow—just a gentle shared rotation—and stop after one full turn.
Turning together with connected hands is a form of shared physical play that builds trust in being moved and the warm experience of doing something as a pair.
Bond, Tell Me with Your Face
Hold up a cup and make an exaggerated curious expression—eyebrows up, head tilted—as if asking a question without words. Wait for your child's face to respond in any way.
Reading and producing facial expressions is a social-emotional skill in active development at this age, and an invitation through your own face is the gentlest form of practice.
Bond, Here Comes a Hug
From across the room, spread your arms wide and walk very slowly toward your child, saying their name softly. Keep going until they either step toward you or you reach them.
A slow, named approach gives your child the chance to initiate the meeting, which makes the hug feel like their idea as much as yours.
Bond, The Quiet Sit
Sit down somewhere in the room with no agenda and no device. When your child notices and comes to you, receive them with complete attention, however they arrive.
Making yourself available without calling your child over teaches them that you are approachable by choice, which is the foundation of secure attachment behavior.
Bond, Copy My Silly Walk
Take three slow steps in a deliberately funny way—knees very high, arms very stiff, whatever comes naturally—then stop and look at your child with a grin.
Offering yourself as a model of playful silliness invites your child into a joyful social moment and builds the shared sense of humor that deepens connection.
Bond, You Lead
Follow your child around the room at a close distance for two or three minutes, going wherever they go and stopping when they stop. Say nothing unless they look back at you.
Following your child's movement sends a clear message that you find their choices genuinely interesting and that they are capable of leading an interaction.
Bond, One Good Thing
At any quiet moment in the day, look at your child and say one specific, true thing you noticed about them—"You worked really hard on that"—and then let it rest without adding more.
A single, specific, observed statement lands more deeply than general praise and teaches your child that you are paying real attention to who they are.
Bond, Blow and Watch
Blow a slow, gentle puff of air toward your child's face or hand. Pause and watch their reaction. If they smile or reach for more, do it once again after a full pause.
A breath of air is one of the smallest possible physical interactions, but its surprise and gentleness reliably produce connection, anticipation, and shared delight.
Bond, Sit Together, Say Nothing
Sit side by side against a wall or on the floor and simply be near each other for a minute or two. No activity, no words, no direction—just companionable closeness.
A moment of easy, shared stillness with no task builds the experience of being comfortable together, which is one of the quieter but most lasting forms of connection.
Bond, What's Next?
At a natural pause in your day together, lean toward your child and say quietly, "What should we do?" Wait through their sounds or gestures and respond as though the answer was real.
Treating your child as someone whose input shapes what happens next builds their sense of agency within the relationship and opens the door for real dialogue.
Bond, Night Landing
At the end of the day, hold your child and say slowly, "We're done for today." Rock once, breathe out, and hold them a moment longer before putting them down.
A brief, consistent closing phrase and physical settling gives your child a daily felt signal that the day ended safely and that you were with them all the way through it.`
  },
  {
    rangeStart: 68,
    rangeEnd: 72,
    text: `Think, Hide and Find
Let your child watch you cover a spoon with a towel, then pause and wait before helping. Keep it obvious and give them time to notice where it went.
This supports early memory and simple problem solving with a clear, visible change.
Think, Whose Voice?
Turn away from your child and say their name in your normal voice. Then wait. Say it again slightly softer and let them locate you and come without any visual cue.
Locating a familiar voice without seeing its source builds auditory attention and the early confidence to move toward something they cannot yet see.
Think, Fill It Up
Place an empty bowl on the floor and hand your child a spoon. Say, "Fill it up," then step back and watch without guiding. Let them figure out what filling means on their own terms.
Interpreting a short familiar phrase and inventing a response for it builds both language comprehension and early creative problem solving.
Think, Find the Sound
Tap underneath a blanket with one finger so the sound comes out muffled. Say, "Where's that coming from?" and wait for your child to lift the blanket or reach toward it to find the source.
Searching for a muffled sound rather than a visible object is a more abstract listening task than standard hide-and-find, and it builds the link between a sound and its hidden location.
Think, Show Me a Book Page
Open a book, hold it toward your child, and say, "Show me something." Wait in silence with an open expression and let them point to, tap, or look at any image they choose.
Choosing something to show without being directed to a specific image builds intentional joint attention and the confidence to make an independent communicative act.
Think, Two Taps or Three?
Tap the floor twice, pause, then tap three times. Say, "Two," then "Three," matching each count to the taps. Do it once more and hold your hand still in the middle, watching their face.
Hearing two small numbers paired with two different rhythms plants the earliest concrete sense that quantities can be distinguished and named.
Think, What Does It Do?
Hold a spoon out to your child and say, "What does it do?" with genuine curiosity in your voice. Wait through whatever response comes before miming a stirring motion yourself.
Asking about function rather than name pushes your child one step beyond labeling, inviting them to think about what objects are for.
Think, Find It Under There
Place a spoon on the floor and cover it with a cup turned upside down. Set a second empty upside-down cup right beside it. Say, "Where's the spoon?" and wait for your child to lift one of the cups to check.
Searching under one of two identical covers requires your child to hold a memory of where the spoon went and act on it, which is a more demanding working-memory step than a single obvious hide-and-find.
Think, Tell Me No
Hold up a cup and ask, "Is this a ball?" with a slightly exaggerated questioning face. Wait to see if your child shakes their head, says no, or offers any correcting response.
Recognizing and expressing that something is wrong—not just naming what is right—is an important cognitive and communicative step that grows reliably around 17 to 18 months.
Think, Point to the Biggest
Hold a bowl and a cup side by side and say, "Point to the big one." Hold still and let your child reach, look, or gesture toward either one. Accept any response as a real attempt.
Comparing size and making a choice between two objects using a size word is an early classification skill that begins emerging in the second half of the second year.
Think, Say Then Do
Say, "Sit down," clearly and wait. If your child sits, say, "Stand up," and wait again. Keep a warm, unhurried tone and pause fully between each instruction.
Following two sequential single-step directions one after the other—not simultaneously—is a skill consolidating around 18 months and builds listening comprehension and body awareness.
Think, Same Shape
Hold two cups together and say, "Same." Then hold a cup next to a bowl and say, "Different." Turn to your child with an open expression and put the two cups in front of them together.
Laying the foundation for sorting by introducing the idea that two things can be matched is one of the earliest classification concepts to support at this age.
Think, Slow Clap Count
Clap once very slowly and say, "One." Pause. Clap again and say, "Two." Stop and watch your child's face. Hold your hands apart and see if they make any clapping motion.
Slow, deliberate one-to-one counting with a physical action gives your child a first concrete experience of number as a sequence with a beat.
Think, Move It There
Place a cup on one side of the floor. Point to a spot on the other side and say, "Move it there." Step back and let your child carry or push the cup to wherever they interpret "there" to be.
Interpreting a spatial word—there—and acting on it with an object in hand combines language comprehension, spatial reasoning, and purposeful physical action.
Think, Who's That?
Look in no particular direction, call out a familiar person's name from your household—"Where's Daddy?"—and wait with an open expression to see how your child responds or searches.
Searching for a named absent person shows that your child holds a mental image of someone not in the room, which reflects growing symbolic representation.
Think, Book Word Repeat
Point to an image in a book and name it clearly. Close the book, wait five seconds, then reopen to the same page and point again. See if your child says or signs the word before you do.
Brief delayed recall of a named image—just a few seconds of gap—builds early word retention and shows how quickly vocabulary is beginning to stick.
Think, Try to Open It
Fold a small towel and tuck one end under itself so it holds together. Hand it to your child and say, "Open it." Watch how they approach the task and give them a full, unhurried pause before you offer any help at all.
Encountering something that takes real effort to undo and deciding whether to keep trying or signal for help is a practical problem-solving experience with genuine real-world value at this age.
Think, This Then That
Put a spoon in a bowl, then take it out. Say, "In, then out." Put it in again and stop midway with the spoon hovering over the bowl. Look at your child and wait.
Pausing mid-sequence and waiting for your child to anticipate the next step builds sequential thinking and shows that they are tracking a small cause-and-effect pattern.
Move, Walk the Towel Path
Fold a towel into a long strip and lay it flat on the floor. Walk along it slowly yourself, placing each foot on the towel. Then stand at one end and wait for your child to try.
Following a visible linear path with deliberate foot placement builds visual-motor coordination and early spatial awareness of walking within a defined route.
Move, Sit and Spin
Sit your child on the floor with their legs out and gently help them turn a quarter rotation on their bottom by guiding their shoulders. Pause, then try a quarter turn the other way.
Rotating the whole body while seated builds core trunk rotation and the vestibular awareness needed to orient confidently in space.
Move, Throw Then Chase
Help your child throw a ball forward with both hands, then immediately say, "Chase it," and walk after it alongside them without racing ahead.
Running after something that just left their hands builds the coordination between an intentional release and the whole-body pursuit that follows.
Move, Hands and Knees
Get down on your own hands and knees on the floor and crawl slowly forward. Look back at your child and wait to see if they join in and crawl alongside you.
Returning to floor-level crawling strengthens arm, shoulder, and core muscles that toddlers continue to need even after walking is established.
Move, Pull the Blanket to Me
Lay a blanket flat and sit at one end. Say, "Pull it to me," and hold your hands out. Let your child grab the other end and drag it across the floor toward you.
Pulling a blanket across the floor with two hands and walking or stepping backward at the same time builds grip strength, core engagement, and reverse balance.
Move, Balance on One Foot
Hold your child's hand lightly and say, "One foot up." Lift your own foot slightly and hold it for two seconds. Lower it, switch, and try the other. Let your child attempt it with your support.
Holding single-leg stance with light hand support is more demanding than earlier one-foot-up exercises and reflects the growing balance maturity of this age.
Move, Step Sideways Four
Hold your child's hand and take four slow sideways steps, counting each one quietly. Stop and take four sideways steps back the other way. Count each one in the same tone.
Lateral stepping builds the hip abductor strength and balance that are distinct from forward and backward walking and that underpin agility and fall prevention.
Move, Twist and Reach
Stand your child facing you and place a cup slightly behind and to one side of their body. Say, "Get it," and wait while they turn their trunk and reach for it without stepping.
Rotating the upper body to reach something behind them while keeping their feet still builds trunk rotation and multi-directional body awareness.
Move, Walk the Plank
Lay a towel folded lengthwise into a narrow strip. Hold your child's hand and walk with them along its length, keeping both feet landing on the strip as much as possible.
Walking along a narrow visible track encourages deliberate foot placement and the focus needed to control where each step lands.
Move, Jump From Here
Hold both your child's hands firmly as they stand, say, "Jump," and support a small two-foot spring off the floor. Lower the support gradually over multiple tries.
A fully supported two-foot takeoff and landing is the safest introduction to true jumping and builds the explosive hip and leg extension that independent jumping will require.
Move, Push and Ride
Lay your child on their tummy on a firm blanket on a flat floor. Take two corners and give one long, slow pull forward. Stop, let them settle, and wait to see if they look for more.
Prone gliding at this age continues to strengthen neck, shoulder, and core muscles while adding a vestibular challenge as the body glides through space.
Move, Around and Back
Walk with your child in a slow, large arc around the room's open floor space and return to where you started. Say, "We're back," when you arrive and look down at your starting spot together.
Completing a circular walking route and recognizing a return to the start builds spatial orientation and the early understanding of route and place.
Move, Step Then Stop
Walk with your child and tap your foot on the floor once as a signal to stop. When they stop, tap twice as a signal to walk again. Build the pattern over a few repetitions.
Using a physical cue—rather than a word—to start and stop walking introduces body-based signal response and adds a non-verbal layer to movement control.
Move, Tummy to Sitting
Lay your child on their tummy, place a cup in front of them just out of reach, and wait for them to push up to sitting to reach it. Only guide lightly at the hips if needed.
Moving from prone to sitting under their own motivation builds full-body coordination and the functional floor mobility that toddlers rely on throughout daily play.
Move, Throw Sideways
Stand to the side of your child and hold a ball at waist height. Guide their arm in a sideways swing and release. Say, "Sideways throw," and retrieve the ball for another turn.
A lateral throw uses the rotational muscles of the trunk differently than a forward throw and builds the full-body coordination needed for a wider range of movement.
Move, March Around the Room
Walk beside your child while exaggerating your own knee lift into a slow march. Go around the perimeter of the floor space and return to your starting point.
Sustained high-knee marching builds hip flexor endurance, rhythmic bilateral coordination, and the stamina to walk longer distances without losing form.
Move, Bend and Roll
Place a ball on the floor in front of your child. Show them how to bend forward from the hips, pick the ball up, and stand back up tall. Let them do it on their own for several rounds.
Hinging at the hips to pick something up and returning to full standing is a foundational movement pattern that builds lower back control and safe lifting habits.
Move, Tiptoe to Me
Stand across the small room and say, "Tiptoe to me," while rising on your own toes visibly. Let your child walk to you however they can and receive them warmly when they arrive.
Attempting tiptoe walking—even briefly—builds calf and ankle strength and challenges balance in a different plane than flat-footed walking.
Bond, This Is New
Pick up any everyday object and look at it with fresh, exaggerated curiosity—turning it over, tilting your head. Glance at your child as if to say, "Have you seen this before?"
Pretending to discover something familiar models curiosity and invites your child into a small shared moment of noticing, which builds joint attention and playful connection.
Bond, My Nose, Your Nose
Touch your own nose and say, "My nose." Then very gently touch your child's nose and say, "Your nose." Pause and look at their face before doing it once more with a different feature.
A gentle, named touch on matching body parts builds self-other distinction and communicates that you are as interested in their body as you are in your own.
Bond, Good Morning Hold
Before anything else happens in the morning, sit with your child on the floor or in your lap and do nothing for one full quiet minute. No talking, no phone, no task.
Beginning the day with unstructured physical closeness sets a baseline of safety and connection that shapes how your child approaches the hours ahead.
Bond, I Heard That
When your child makes any sound—a word, a hum, a noise—pause what you are doing, look at them, and say, "I heard that," with a warm, amused expression.
Consistently acknowledging sounds before they become real words teaches your child that their voice produces attention, which is the most powerful motivator for more communication.
Bond, Race to the Wall
Stand beside your child and say, "Ready? Go," then walk briskly together toward the nearest wall. Touch it when you get there and say, "We made it," with a big smile.
A shared, self-contained goal accomplished together—even something as simple as touching a wall—creates a small moment of teamwork and mutual celebration.
Bond, Bounce on My Knee
Sit your child on your knee facing out and give a gentle, rhythmic bounce—not fast, not high. Say their name on every third bounce and hold their hands loosely.
Lap bouncing with a consistent rhythm and name is a simple, whole-body bonding activity that builds predictability, physical trust, and joyful shared energy.
Bond, Say It Soft
Say a short familiar phrase—"I've got you"—in your normal voice once, and then lean close and say it again in the softest possible whisper right near their ear. Pause after each.
Varying the tone and volume of a familiar phrase makes the words feel deliberate and personal, turning a simple statement into a felt experience of closeness.
Bond, You Did That
Right after your child does anything independently—walks across the room, picks something up—stop and say their name and then, "You did that," with calm certainty.
Acknowledging an independent action specifically and calmly builds your child's sense of competence without turning every effort into a performance for approval.
Bond, Nose Wrinkle
Wrinkle your nose slowly while looking directly at your child. Hold the expression for a moment, then relax your face and wait. Do it again if they seem to be tracking it.
A slow, deliberate facial expression with a waiting pause invites your child to read your face carefully and attempt imitation, building both social attunement and expressiveness.
Bond, Come Find Me
Move quietly to a different part of the room without calling your child and sit down. Wait to see how long it takes them to notice and come toward you on their own.
Seeking out a quietly present caregiver without being called is a natural attachment behavior, and receiving them warmly when they arrive tells your child that finding you is always worth the effort.
Bond, Walk Away, Come Back
Walk a short distance away from your child slowly, pause with your back to them for a moment, then turn around and walk back. Crouch and open your arms when you return.
A gentle, predictable departure and warm return is one of the most direct ways to practice attachment security and teach your child that you always come back.
Bond, Just Laughing
Let yourself laugh at something—anything genuinely funny or slightly absurd—and let your child see and hear you fully laugh. Don't explain it. Just let the laugh be real.
Seeing a real, unperformed laugh from a trusted adult is deeply connective and gives your child a lived experience of joy as something shared rather than performed.
Bond, Whisper a Secret
Cup your hands around your mouth and lean toward your child as if to whisper something. Say their name or one warm word very quietly into the space near their ear.
The physical posture of sharing a secret communicates specialness and intimacy, and the quiet voice creates a private moment that belongs only to the two of you.
Bond, Stay Close
When your child is playing on the floor, sit down within arm's reach and stay there. Do not direct, comment, or help unless asked. Just be close enough to touch.
Physical proximity without direction is a form of presence your child can feel and rely on, and it anchors their play in the safety of knowing you are right there.
Bond, I Like Your Sound
When your child sings, hums, babbles, or produces any sustained sound, listen with your full face—eyes soft, expression open—and say afterward, "I like your sound."
Treating any self-generated sound as music worth listening to builds your child's trust in their own voice and teaches them that expression is something to be enjoyed, not corrected.
Bond, The Same Spot
Sit in the same place you often sit with your child—a corner of the room, against the wall—and simply be there. When they notice and come to you, receive them without prompting what's next.
Returning consistently to a familiar physical spot teaches your child that connection has a reliable location, which deepens their felt sense of security in the environment.
Bond, Hand Squeeze
Hold your child's hand in yours and give one slow, gentle squeeze. Wait. If they squeeze back in any way, squeeze again with the same pressure. Let it become a quiet back-and-forth.
A hand squeeze is one of the smallest and most intimate forms of turn-taking, and its quietness makes it a form of connection that works anywhere and anytime.
Bond, Big Breath Out
At the end of a busy or difficult moment, sit beside your child and take one audible breath in and one slow breath out. Do it twice more and let your body settle visibly.
Breathing out slowly and audibly in front of your child after a hard moment models emotional regulation and gives them a real-time example of how a body can return to calm.`
  },
];

export const dailyActivities12to18: ExtendedDailyActivity[] = BLOCKS.flatMap(parseBlock);
