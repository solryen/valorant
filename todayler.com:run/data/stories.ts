// Bedtime stories with BABY_NAME and BABY_AGE as placeholders.
// BABY_AGE should be a phrase like "8 weeks" or "4 months".
// Usage: pick a random entry, then call fillStory(story, name, age).
import type { AppLanguage } from "@/lib/appLanguage";
import { RAW_STORIES_EL } from "@/data/storiesEl";

export const RAW_STORIES: string[] = [
  // Story 1 — The Sleepy Garden
  `Somewhere between the last light of day and the first star of evening, BABY_NAME wandered into the most magical garden anyone had ever seen. The flowers were soft as clouds, and they nodded their petals like they were already half asleep. At only BABY_AGE old, BABY_NAME had the kindest eyes, and every flower wanted to be seen by them.

There was just one little problem. A tiny rosebud in the corner hadn't opened yet. She was shy, and the day had been so busy that she missed her chance to bloom. BABY_NAME sat beside her, very still and very quiet, and simply waited.

And that is all it took. No pushing, no rushing. Just gentle presence. The rosebud opened slowly, slowly, like a yawn at the end of a long good day.

The flowers swayed. The stars blinked on one by one. The garden sighed its warmest sigh.

BABY_NAME smiled that soft little smile that meant all was right with the world. Then, wrapped in the sweet smell of roses and evening air, BABY_NAME let their eyes grow heavy, and drifted into the most peaceful sleep, while the whole garden kept gentle watch through the night.`,

  // Story 2 — The Little Cloud
  `High above the rooftops where the air was cool and quiet, a small cloud floated all alone. It was round and white and perfectly soft, just like BABY_NAME. And at only BABY_AGE old, BABY_NAME could already see things that others missed — like the fact that this cloud looked a little lost.

BABY_NAME reached up with one small hand, and somehow, the cloud came closer. It nuzzled in like a sleepy lamb, and BABY_NAME laughed the quietest laugh, gentle as a breeze.

The cloud had been drifting since morning, not sure where it belonged. But here, in the warmth of BABY_NAME's gaze, it found its answer. It settled just above, soft and still.

That night, the cloud made itself into the perfect shape — round and cozy — and floated just outside the window as the stars came out. It would guard this window all night long. Nothing loud, nothing cold, nothing sharp could get past a cloud as devoted as this one.

BABY_NAME felt that softness all around, and their little breaths grew slower, and softer, and sleepier still, until there was nothing left to do but sleep, held gently by the quietest, kindest night.`,

  // Story 3 — The Firefly's Gift
  `On a warm and gentle evening, when the grass was still and the air smelled of something sweet, a single firefly blinked on outside the window. BABY_NAME watched it from inside, wide and wondering.

The firefly had been flying all day, lighting up this leaf and that flower, sharing its small glow with anyone who needed a little brightness. But now the day was done, and the firefly was tired.

At only BABY_AGE old, BABY_NAME already knew something important — that kindness comes back to you. All day, BABY_NAME had smiled, and cooed, and let their small warmth fill the room. And so the firefly chose this window. This light called to that light.

The firefly blinked three times. Once for hello. Once for you are loved. Once for goodnight.

Then it floated down into the tall grass and tucked itself in among the blades, just as BABY_NAME's eyes began to close.

Outside, one small light glowed softly in the dark. Inside, BABY_NAME breathed in, breathed out, and let the whole beautiful evening carry them away into sleep — warm, loved, and surrounded by tiny things that shine.`,

  // Story 4 — The Path Through the Pines
  `There was once a forest made entirely of the softest pines, where the ground was covered in needles so thick it felt like walking on a bed. BABY_NAME found the path at the edge of the trees just as the sun was getting low and golden.

The path twisted a little here and curved a little there. At only BABY_AGE old, BABY_NAME was not worried. They had learned something very wise already — that when you don't know where you're going, you can still trust the path beneath your feet.

An owl perched on a low branch and gave a gentle hoot. A deer paused between the trees and looked up, soft-eyed and still. A mouse scurried past carrying one small acorn, as if the most important job in the world was to bring that acorn home.

BABY_NAME followed the path slowly, slowly, until the trees opened into a clearing and the sky above was the most perfect shade of blue turning purple turning deep.

There in the clearing was a bed of moss, soft and green, waiting just for them. BABY_NAME lay down and looked up at the first star. One breath. Two breaths. Three. And then nothing but sleep, gentle and complete.`,

  // Story 5 — The Bear Who Needed a Song
  `Deep in a cozy forest hollow, a small bear was trying to fall asleep. He had tried counting acorns. He had tried listening to the river. He had tried thinking about honey, which usually worked. But tonight, nothing was working.

BABY_NAME heard about the bear's problem in the way that babies hear about things — through some quiet magic that connects small hearts to one another.

At only BABY_AGE old, BABY_NAME didn't have many words yet. But BABY_NAME had something better — a sound. A soft, small hum, low and warm, the kind that makes the air around it feel thicker and gentler.

BABY_NAME hummed into the evening, and the hum traveled through the window, down the street, through the meadow, and into the bear's little hollow.

The bear's ears went still. His paws uncurled. His breathing slowed. He had never heard anything that felt so much like being held.

BABY_NAME hummed one last note and let it go, floating up toward the stars.

And in the hollow, the bear was finally, peacefully asleep. And right beside the window, so was BABY_NAME — both of them carried off together on the same warm wave of sound.`,

  // Story 6 — The Golden Leaf
  `On the first cool evening of autumn, a single leaf let go of its branch and began to float. It was golden, perfectly golden, and it seemed to know exactly what it was doing.

BABY_NAME watched it from the window, one small hand pressed against the glass.

The leaf did not rush. It did not try to catch the wind or race the other leaves. It simply drifted, slow and easy, as if it had all the time in the world. At only BABY_AGE old, BABY_NAME already understood this feeling. Some of the best moments are the ones you let come to you.

The leaf spun once, lazily, then landed right outside on the sill, as if it had chosen this exact spot.

BABY_NAME smiled. The leaf had traveled a long way to say goodnight.

The evening deepened around them. The window fogged softly with warm breath. Stars began arriving one at a time, quietly, the way the best guests always do.

BABY_NAME watched until the last one appeared, and then let their eyes close, slow and soft, the way the leaf had floated — with no hurry, no worry, just the simple trust that where they were landing was exactly where they were meant to be.`,

  // Story 7 — The Rabbit and the Moon
  `A small white rabbit lived at the edge of a wide meadow, and every night she had one wish — to touch the moon. Not to take it or keep it. Just to feel it for a moment, the way you feel something very beautiful that you know belongs to everyone.

At only BABY_AGE old, BABY_NAME heard the rabbit's wish on the wind, and knew immediately how to help. Because BABY_NAME knew something the rabbit did not — the moon is always closer than it looks.

BABY_NAME reached up in that small, miraculous way that babies do, fingers spread wide, and for just a moment the moonlight pooled in those tiny hands like warm milk.

The rabbit looked up from the meadow and saw it — saw the moon being held. She closed her eyes and felt the light on her fur, and that was enough. More than enough.

The meadow grew still. The rabbit curled into the soft grass. The moon hung steady and full, watching over everything.

BABY_NAME brought both hands together softly, as if carrying something precious, and then let their eyes close. Whatever they were holding, it was theirs to keep in dreams — all that light, all that quiet wonder, through the whole long, lovely night.`,

  // Story 8 — The Boat on the Slow River
  `Once there was a tiny wooden boat that floated down the slowest, gentlest river in the world. The river went nowhere in particular. It just wound through meadows and under willow trees and past sleeping ducks and into the evening.

BABY_NAME was in the boat. Not sailing, not rowing — just being there, which is the most important thing anyone can do.

At only BABY_AGE old, BABY_NAME had already become very good at simply being. At existing softly in a place and making it feel warmer just by being present in it.

The willows trailed their fingers in the water. The ducks tucked their bills into their wings. A frog on a lily pad looked up, decided everything was fine, and went back to his own quiet thoughts.

The boat moved slowly, slowly, barely moving at all. The river was in no hurry. Neither was BABY_NAME.

Stars appeared one by one, reflected in the still water so that BABY_NAME was surrounded by them — above and below — a whole universe of soft light.

The river hummed a low, wordless song. The boat rocked, gentle as breathing. BABY_NAME closed their eyes, and the slow river carried them the rest of the way home through the sweetest sleep.`,

  // Story 9 — The Elephant's Thank You
  `A very small elephant lived near a wide, flat plain where the grass grew tall enough to whisper. She was a good elephant — gentle and careful and slow — but one afternoon she had lost something. Her favorite smooth stone, the one she rolled between her toes when she needed to feel calm.

BABY_NAME heard about this in the way that loving people hear about sadness — not with ears exactly, but with the heart.

At only BABY_AGE old, BABY_NAME reached out one small hand and found, somehow, just the right stone. Smooth and round and warm from the sun.

The elephant found it at the edge of the grass, exactly where she needed it. She rolled it slowly under one great foot and let out a long, low breath.

Then she raised her trunk toward the sky in the direction of BABY_NAME, a thank you sent on the evening air.

BABY_NAME felt it arrive — warm, enormous, gentle — the gratitude of a creature ten times their size, carried across the plain like pollen.

That night, BABY_NAME fell asleep with the feeling of having done one small, true good thing. The elephant slept too. The stone sat between them somewhere in the dark, smooth and still and perfectly enough.`,

  // Story 10 — The Star Who Blinked
  `Every star in the sky had its job. Some lit the sea for sailors. Some guided birds on long journeys. Some simply looked beautiful, which is also an important job that not everyone appreciates.

But one star, a small one near the edge of the sky, kept blinking. Not because something was wrong — only because BABY_NAME was still awake.

The star had made a quiet agreement, the way stars do, that it would keep its light steady only once BABY_NAME was asleep. It didn't mind. It had plenty of light to spare. At only BABY_AGE old, BABY_NAME was worth waiting for.

BABY_NAME looked up through the window and noticed the blinking, and felt, in the wordless way babies feel things, that something out there was paying attention. Was watching. Was patient.

This was a comfort so deep it could not be named.

BABY_NAME looked at the blinking star. The star looked back. A whole conversation passed between them with no words at all.

Then BABY_NAME's eyes began to close, slowly and finally, and far away, a small star near the edge of the sky went still — steady and bright and perfectly content — shining through the rest of the night over a baby who was safe, and warm, and completely, beautifully asleep.`,

  // Story 11 — The Turtle's Lesson
  `An old turtle lived at the edge of a quiet pond, and she had one rule she never broke: she never hurried.

Not in the rain, not in the sun, not even when there was something wonderful just around the bend that she very much wanted to see. She trusted that she would get there, and she always did.

BABY_NAME met the turtle one soft evening, and they walked together — one very slowly, one even more slowly — along the path beside the pond.

At only BABY_AGE old, BABY_NAME understood the turtle perfectly. There is so much wisdom in taking one thing at a time. In not rushing toward tomorrow when today still has warmth left in it.

The pond reflected the pink of the sky. A heron stood at the water's edge, perfectly still, as if taking notes.

The turtle stopped. BABY_NAME stopped. They looked out at the water together.

The turtle nodded her ancient head, as if to say: yes, this is enough. This moment, right here. This is enough.

BABY_NAME felt that truth settle somewhere warm inside. Then the evening wrapped around them both, soft as a blanket, and BABY_NAME let their eyes fall closed — unhurried, unworried — drifting into sleep as gently as the turtle moved, and just as surely arriving.`,

  // Story 12 — The Lamb in the Clover
  `There was a meadow so full of clover that every step released a sweetness into the air. A small lamb had wandered into the center of it and was standing very still, not because she was lost, but because she didn't know which way the sweetest clover was — and every direction smelled wonderful.

BABY_NAME found her there, at only BABY_AGE old, and understood immediately. Sometimes the problem is not that there is nothing good. Sometimes the problem is that there is too much good and you don't know where to begin.

BABY_NAME sat down right in the middle of the meadow. And the lamb, relieved, sat down too.

They decided together — without words, the way the best decisions are made — that they were already exactly where they should be. That the choosing could wait. That sitting in the middle of something beautiful is its own answer.

The clover was cool and soft. The sky grew slow and pink. Bees made their last rounds of the day with a hum so gentle it felt like a lullaby composed just for this moment.

BABY_NAME lay back in the clover and looked up. The lamb curled beside them. And there in the sweet center of the meadow, both of them fell into the softest sleep, surrounded on all sides by good things.`,

  // Story 13 — The Moon's Errand
  `One night, the moon decided to do something she had never done before. Instead of staying up in the sky where everyone expected her to be, she slipped down just a little — just enough to peek through the window and say a proper goodnight.

She had been meaning to do this for a long time. There was someone particular she had been watching over, and she wanted them to know she saw them.

BABY_NAME was still awake, looking up at the ceiling with those wide, wondering eyes that babies have — the ones that seem to see everything and nothing at once.

At only BABY_AGE old, BABY_NAME had already been through so many nights. Each one the moon had been there. Each one BABY_NAME had drifted off in safety, and the moon had stayed, steadfast and round, until morning.

Tonight the moon pressed her cool silver light through the curtains and let it fall across BABY_NAME like a blanket.

BABY_NAME felt it. Felt seen. Felt held by something vast and calm and completely reliable.

The moon stayed a long while. She didn't need to go anywhere. This was the errand. This right here.

BABY_NAME's eyes closed, one breath at a time, until they were asleep — and the moon, satisfied, floated gently back to her place in the sky.`,

  // Story 14 — The Hedgehog's Quilt
  `In a little house under a hawthorn hedge, a hedgehog named Pip was making a quilt. It was slow work — one square at a time, each one cut from something soft — and Pip had been at it for many evenings.

At only BABY_AGE old, BABY_NAME would watch from just outside the hedge as Pip worked, and Pip liked having an audience.

Each square meant something. A piece of pale blue for a quiet morning. A square of warm gold for afternoon light. A tiny bit of deep green for the smell of grass after rain.

BABY_NAME couldn't say which was their favorite, but Pip could tell — BABY_NAME's eyes went softest when Pip held up the piece of deep purple, the color of the sky just before the first star appeared.

So Pip made that square the center.

The night Pip finished, the quilt was spread out in the last of the evening light, and it was perfect. Every good thing that had ever happened in a day, stitched together and made into warmth.

Pip gave it a long satisfied look, then curled into the smallest ball and fell asleep.

BABY_NAME pulled their own blanket close, and that deep purple square lived in their mind as they drifted away into warm, quilted dreams.`,

  // Story 15 — The Song the Wind Knew
  `The wind had been traveling all day. It had come from the mountains, carrying the coolness of snowmelt. It had crossed the fields and gathered the smell of wheat and wildflowers. It had passed through a little town and picked up the sound of a bakery and church bells.

By the time it reached BABY_NAME's window, it was very full — full of all the good things it had gathered — and it wanted to share them.

At only BABY_AGE old, BABY_NAME could feel all of this. Not in words, but in the soft rush of air that moved the curtains and brought the whole world gently into the room.

The wind hummed between the curtain folds. Snowmelt and wheat and bells, all braided into one long sound that was not quite music but very nearly.

BABY_NAME breathed it in. And out. And in.

The world is so big and so full, the wind was saying. And you are in the middle of it, safe and warm, and all of this — all of it — is for you.

BABY_NAME believed it entirely. How could they not? They had just breathed the mountains and the fields and the bells all at once.

The curtain went still. The wind moved on. BABY_NAME slept.`,

  // Story 16 — The Library of Quiet Things
  `There is a library that no one knows about — tucked inside the sound of rain on a roof, somewhere between sleeping and waking. It has no door and no stairs. You arrive simply by closing your eyes.

BABY_NAME found it one evening just as the rain began, at only BABY_AGE old.

Inside, the shelves held things that couldn't be written down but could be felt. The warmth of a familiar voice. The smell of a clean blanket. The exact weight of being held in arms you trust completely.

BABY_NAME wandered the soft aisles slowly, trailing small fingers along the shelves. There were no books here — only feelings, neatly stored, waiting to be found.

A kindly thing that smelled of chamomile smiled and said nothing. Silence is the language of this library.

BABY_NAME found a whole shelf full of today. All of it — the morning light, the soft sounds, the faces that looked down with such love — all kept safe and waiting to be revisited whenever BABY_NAME wished.

BABY_NAME hugged one good memory close and carried it into sleep. The rain continued on the roof. The library waited, as it always does, just on the other side of closed eyes, full of everything that matters.`,

  // Story 17 — The Dog Named Thistle
  `A small dog named Thistle had spent her whole day looking for the perfect spot to rest. She tried beneath the apple tree. Too bright. She tried on the kitchen mat. Too crinkly. She tried the garden wall. Too cold.

BABY_NAME watched all of this very patiently.

At only BABY_AGE old, BABY_NAME had not yet learned to worry, which meant BABY_NAME also hadn't learned to rush. BABY_NAME simply waited, eyes soft and open, while Thistle kept trying.

Finally, Thistle came over and sat right beside BABY_NAME. She put her chin on BABY_NAME's foot and let out a long, slow breath.

BABY_NAME looked down at her. Thistle looked up.

They both understood. The perfect spot had been here all along. It just took looking everywhere else first.

That is a lesson that takes most people a very long time to learn, but Thistle and BABY_NAME had it figured out before nightfall, which is no small thing.

The apple tree shook its leaves gently. The kitchen was quiet. The garden wall held the last of the warmth.

Thistle closed her eyes. BABY_NAME closed theirs. They breathed together, slow and even, and the whole good day slipped away into the softest sleep.`,

  // Story 18 — The Island of One Tree
  `Far out in a sea so calm it looked like sky, there was a small island with exactly one tree on it. The tree had round leaves that caught the light and held it like a bowl holds water.

BABY_NAME arrived there on a boat made of clouds — the way you arrive at the best places — and sat beneath the tree.

At only BABY_AGE old, BABY_NAME needed nothing else. The tree was enough. The island was enough. The sea going out in every direction, full of quiet, was more than enough.

A small bird landed on the highest branch and arranged itself carefully, as birds do, and looked out at the same sea BABY_NAME was looking at. They were both looking at the same thing and finding it equally good. That is a kind of friendship.

The sun took a long time to set there. It seemed reluctant. BABY_NAME didn't mind — patience comes naturally when everything around you is beautiful.

When the first star appeared above the tree, BABY_NAME looked up through the round leaves and watched the light flicker between them, soft as breathing.

The boat of clouds drifted back in. BABY_NAME climbed aboard and the sea carried them gently home, through warm dark water, all the way to sleep.`,

  // Story 19 — The Very Small Mountain
  `There was a mountain that was smaller than most mountains — barely bigger than a hill, really — but it had the best view of anyone's day. Everything that happened in the valley below, the mountain could see.

BABY_NAME climbed it one evening, one careful step at a time. At only BABY_AGE old, this was quite an achievement, and the mountain was clearly proud.

From the top, BABY_NAME could see it all. The river that twisted through the meadow. The village with its warm windows. The fields going golden in the last of the light. And above everything, the sky, going from blue to purple to the deep velvet of night.

It was a lot to take in.

BABY_NAME sat at the very top of the very small mountain and breathed it all in slowly. All the good things that had happened today were down there somewhere in that valley. And all the good things that would happen tomorrow were already waiting, patient and ready.

The mountain held perfectly still beneath BABY_NAME, steady and safe.

One star appeared. Then two. Then the whole sky filled slowly from edge to edge.

BABY_NAME lay back against the cool grass at the summit and let the stars be the ceiling. And there on the very small mountain, under the very large sky, BABY_NAME fell into a sleep as deep and still as the mountain itself.`,

  // Story 20 — The Hummingbird and the Honey
  `The hummingbird had been moving all day — darting from flower to flower, wings a blur, never stopping, always forward, always more. She was very good at being busy.

But at only BABY_AGE old, BABY_NAME watched her from the garden and saw something the hummingbird couldn't see about herself: she was tired. Not in her wings. In her heart.

BABY_NAME held out one small hand, very still and very open. The hummingbird, who had never held still in her life, hovered in front of it and looked at this small, patient creature who was not chasing her or startling her or wanting anything from her at all.

And for the first time all day, the hummingbird stopped. She landed on one small finger. Her wings folded. Her breathing slowed.

It lasted only a moment before she was up and away again. But that moment was enough. Even the busiest heart needs one still moment to remember what it is flying toward.

BABY_NAME smiled after her as she disappeared into the roses.

That evening, something from the hummingbird stayed in the air — the faintest sweetness, like honey and flowers — and BABY_NAME breathed it in as they closed their eyes and settled into sleep, soft and still as only the most content creatures can be.`,

  // Story 21 — The Fox Who Forgot
  `A small fox with a very fluffy tail had been wandering since morning, trying to remember something. She was certain she had something important to do, something she had planned carefully before the day began.

But the morning had been so beautiful she had stopped to look at the light on the river. And then there had been interesting mushrooms. And then she had followed a promising smell into a meadow and spent a lovely hour doing nothing in particular.

Now it was evening, and the important thing was still forgotten.

BABY_NAME met the fox at the edge of the forest, at only BABY_AGE old, and watched her pace and think.

Then BABY_NAME laughed — the small, certain laugh of someone who already knows the answer.

The fox stopped pacing. She looked at BABY_NAME. She thought very hard.

Oh. The important thing had been to enjoy the day. She had done it beautifully.

The fox sat down and smiled her narrow fox smile, embarrassed and relieved. BABY_NAME laughed again.

The forest went dark gently, the way evenings do when you have spent the day exactly right. The fox curled her fluffy tail around herself. BABY_NAME pulled their blanket close. Both of them slept deeply and well, with nothing left undone.`,

  // Story 22 — The Dream Keeper's Collection
  `Somewhere between the top of the tallest cloud and the softest moment before sleep, there lives a Dream Keeper. Her job is to sort through all the beautiful things that happened in a day and choose which ones to send back as dreams.

She is very good at her job.

At only BABY_AGE old, BABY_NAME sent so many good things her way each day that the Dream Keeper always had more than enough to work with. A warm look. A gentle sound. A feeling of being completely held. These were the finest materials she worked with.

Tonight she chose carefully. She picked the warmth. She picked the familiar voice. She picked the soft light that came through the curtain in the afternoon in that particular golden way.

She folded them gently, the way you fold something delicate and precious, and sent them back down toward the sleeping world.

BABY_NAME breathed in. The dream arrived slowly, softly, settling into place like a warm hand on a small back.

The Dream Keeper looked at her work and was satisfied. She moved on to the next dreamer, and the next, all through the long quiet night.

But she came back to check on BABY_NAME twice. Some dreamers are worth the extra visit. And BABY_NAME was always worth it.`,

  // Story 23 — The Cathedral of Trees
  `Deep in the oldest forest, where the trees had been growing for a hundred years and their branches had grown together at the top, there was a place that felt like a cathedral — tall and cool and full of a silence that was not lonely but full.

BABY_NAME walked into it one evening at only BABY_AGE old, one small being in this enormous, ancient quiet.

But here is the thing about old forests: they are not indifferent. They remember everything that has ever grown in them, and they know growing when they see it.

The trees bent just slightly inward. Not to crowd — only to shelter. BABY_NAME walked through a tunnel of gentle wood, and the filtered light fell in long slants, and the moss underfoot was every shade of green.

A single bird called once, high and clear. Then silence returned.

BABY_NAME sat down at the base of the oldest tree and leaned back against bark that was rough and warm from a day of sun.

The forest breathed. BABY_NAME breathed with it. In. Out. Deep and slow.

There is nothing to be afraid of when something ancient and quiet has decided to shelter you.

BABY_NAME closed their eyes, surrounded by a hundred years of green growing patience, and slipped into a sleep as deep and old as the forest itself.`,

  // Story 24 — The Night Market
  `Once every seven days, just after sunset, a market appeared in the meadow that was invisible in the daytime. The stalls sold things you couldn't find anywhere else: jars of moonlight, bottles of river sound, small wrapped packages of the smell of bread baking.

BABY_NAME found it one evening, wandering in the blue hour between day and dark.

At only BABY_AGE old, BABY_NAME had no coins and nothing to trade. But at this particular market, that was fine. The vendors took something different as payment: they traded for smiles. For wonder. For the simple willingness of a person to walk through and appreciate what they saw.

BABY_NAME was very rich in all three.

BABY_NAME went from stall to stall, wide-eyed and generous, smiling at each vendor, marveling at each strange and beautiful thing. The vendors smiled back, glowing.

At the last stall, an old woman with kind eyes pressed a small bundle into BABY_NAME's hands. It was warm and it smelled like everything good.

"Sleep," she said. "Pure, untroubled sleep. It's already yours. It always has been."

BABY_NAME held it close on the walk home through the meadow. By the time the bed appeared, the bundle had dissolved into warmth, and BABY_NAME was already almost there.`,

  // Story 25 — The Frog's Philosophy
  `A frog who lived on a large flat lily pad had given the matter a lot of thought and had reached a conclusion.

The conclusion was this: a lily pad is enough.

Not a bigger lily pad. Not a lily pad near better flies or with a better view. Just this one, in this pond, with this light on the water. This is enough.

BABY_NAME passed by the pond at only BABY_AGE old and the frog told them this, in the way frogs tell things — with a long look and a single slow blink.

BABY_NAME understood immediately.

They sat at the edge of the pond and looked out at the water with the frog. The afternoon moved over them. Dragonflies made their quick, light passes. A ripple crossed the water from nowhere and went nowhere.

The frog blinked again. This is it, the blink said. This is the whole thing.

BABY_NAME felt full — not of food, but of something better. Of enough-ness. Of the particular peace that comes from needing nothing that isn't already here.

Evening moved in gently. The frog settled lower into the lily pad. BABY_NAME went home and lay very still and felt the pond somewhere inside, calm and flat and full of quiet wisdom.`,

  // Story 26 — The Cartographer's Gift
  `There was once a mapmaker who had mapped every river, every mountain, every city, and every road. She had one map left to make, and it was the most important one.

She was making a map of home.

At only BABY_AGE old, BABY_NAME helped her. Not by knowing where the mountains were. But by knowing where the warm things were. The exact spot on the rug where the afternoon sun fell softest. The angle of the lamp that made everything golden. The drawer that smelled of lavender when you opened it.

BABY_NAME pointed — a small hand in each direction — and the mapmaker drew.

She drew warmth as a color she had never used before, something between amber and rose. She drew love as lines that curved, never straight, always turning back toward the center.

When the map was finished, she held it up and looked at it for a long time. It was the most detailed map she had ever made. And the most useful.

BABY_NAME looked at it and recognized everything. Every warm thing, exactly placed.

Then BABY_NAME closed their eyes and carried the map inside, all the way into sleep, where every room was exactly as warm as it should be.`,

  // Story 27 — The Goose Who Went South
  `Every autumn, the geese gathered above the marsh, calling to each other in their long, wild voices, and then flew south in a great V across the sky.

This autumn, one small goose was nervous. She had never done it before. South was very far, and the sky was very big.

BABY_NAME looked up from the garden at only BABY_AGE old and watched the nervous little goose at the back of the V, and understood the feeling. New things are big. New things can feel like the whole sky standing between you and where you need to go.

But then BABY_NAME noticed something.

She wasn't alone. Ahead of her was the whole V — all those birds cutting the wind so she didn't have to. All that company moving the same direction.

The nervous goose flapped once, twice, and then she was in it — really in it — and her wings found the rhythm and south was just a direction after all.

BABY_NAME watched until they were gone, just a V and then a line and then nothing, and smiled.

New things are still big. But nothing big has to be done alone.

BABY_NAME kept that thought all the way to bedtime and tucked it in alongside them, and slept with the comfortable knowledge that the sky is full of company.`,

  // Story 28 — The Lamp at the End of the Road
  `At the end of the long road, past the stone wall and the bent willow tree, there was always a lamp. Not electric — oil, and very warm, with a flame that moved with the gentlest breath and kept moving like it was alive.

BABY_NAME knew this lamp.

At only BABY_AGE old, BABY_NAME had already come to understand something profound: that the world keeps a light on for you. That no matter how far things feel from home, the lamp at the end of the road is always burning.

Some evenings BABY_NAME would just look at it from the window. It was enough to know it was there. The flame bent left, bent right, never went out. It had been there on every evening BABY_NAME had ever known, and it would be there on all the evenings to come.

This is the promise the lamp made without words: I am here. You are not lost. Come when you are ready.

BABY_NAME felt this all the way through tonight. The window grew dark as the sky outside deepened. The lamp glowed on. BABY_NAME pulled the blanket close and looked at it one last time before closing their eyes.

The lamp stayed burning through every hour of the night, faithful and warm, exactly where it had always been.`,

  // Story 29 — The Tortoise and the Afternoon
  `The tortoise was in no rush, as tortoises never are. She was walking from the old oak to the stream, which was not a very long walk for most creatures, but for a tortoise it was the project of an afternoon.

BABY_NAME walked beside her.

At only BABY_AGE old, BABY_NAME had no schedule and no hurry either, and so they were perfectly matched. Two creatures with all the time in the world, taking it.

They noticed things together. A beetle who had climbed to the very top of a tall grass blade for no apparent reason but seemed very pleased about it. A stone that had turned slightly orange from a long summer of sun. A puddle that showed the sky in it, upside down.

The tortoise stopped at each one. BABY_NAME stopped too.

This is how you walk with a tortoise: you let the walk decide how long it is. You don't arrive anywhere in a hurry because arriving in a hurry means the walk is over, and the walk was the point.

They reached the stream just as the light went gold and the water turned to mirrors.

The tortoise drank slowly. BABY_NAME watched the upside-down sky in the water. Then the long walk home carried BABY_NAME all the way into night, and into sleep, and into dreams full of beetles and orange stones and sky in puddles.`,

  // Story 30 — The House That Hummed
  `Every house has a sound if you listen for it. Old houses creak and tick. Houses by the sea breathe in and out with the tide. Houses in the city hum with electricity and life moving through the walls.

BABY_NAME's house had a hum.

At only BABY_AGE old, BABY_NAME was one of the few people who could really hear it — that low, warm, constant sound that meant: everyone here is safe.

Tonight BABY_NAME lay very still and listened.

The hum came from the walls and the floors and the ceiling and the blanket. It came from the particular way the heat moved through the air. It came from the sounds of people nearby, doing quiet evening things — water running, a drawer closing, a voice saying something soft.

All of it woven together into one sound: home.

BABY_NAME breathed in time with the hum. In and out, the house breathed. In and out, BABY_NAME breathed. There was no difference between the two tonight — they were the same breath, the same warmth, the same steady hum of safety keeping vigil.

The night deepened. The hum went on. BABY_NAME's eyes closed, heavy with the best kind of tiredness — the tiredness of a body that has been well loved all day — and slept in the warm center of a house that never stopped singing.`,

  // Story 31 — The Valley of Soft Rain
  `In a valley between two gentle mountains, it rained differently than anywhere else. The rain there came in drops so fine they were almost mist, and they fell so slowly that you could watch each one find its place on the ground.

BABY_NAME wandered into this valley one gray and beautiful afternoon, at only BABY_AGE old.

The soft rain fell on BABY_NAME's face and arms and hands, and it was exactly the right temperature — not cold, not warm, just present. Just there.

BABY_NAME stood still and let it fall.

This is a kind of patience that very few creatures practice: standing still in rain that is beautiful, and just being rained on, without trying to get somewhere dryer or make the rain stop.

The mountains on either side were dark green. The valley floor was the brightest green that exists — the green that only comes after rain. A stream ran through the middle, swollen and silver.

BABY_NAME sat down on a mossy rock in the soft rain. A duck appeared on the stream and looked at BABY_NAME with great approval, as if to say: you understand, don't you.

BABY_NAME understood.

That evening, warm and dried and tucked into bed, BABY_NAME carried the soft rain inside and let it fall behind closed eyes all night, quiet and fine and endlessly patient.`,

  // Story 32 — The Old Man and the Apples
  `An old man with white hair and an unhurried walk had an apple tree so old that no one remembered planting it. Every autumn it gave more apples than any tree had a right to, and every autumn the old man gave them all away.

BABY_NAME watched from the garden fence at only BABY_AGE old.

The old man noticed. He came over and handed one apple — small and red and perfect — across the fence.

BABY_NAME held it. It was heavier than it looked. Warm from the sun.

The old man didn't say anything, but his eyes said what he meant: everything good is meant to be shared. The tree gives the apples. I give the apples. You'll give something too, someday, in your own way. That's how it works.

BABY_NAME looked at the apple and understood this in the wordless, total way that small children understand deep things.

The old man walked back to his tree. He picked an apple, rubbed it on his sleeve, and ate it leaning against the bark, looking up at the branches.

BABY_NAME held the apple all the way home and set it on the windowsill where the evening light turned it to something almost like a small lantern. Then BABY_NAME went to sleep with a full heart, already thinking about what they might one day give away.`,

  // Story 33 — The Otter's Evening
  `An otter had spent the day doing what otters do — diving and floating and splashing and being excellent at water. By evening, she was ready for the best part.

The floating.

She lay on her back in the slow part of the river, arms spread wide, nose pointing at the sky, and she just floated. The current was so gentle it barely moved her. The sky went pink above. The first bat came out and made its quick darting passes overhead.

BABY_NAME watched from the bank, at only BABY_AGE old, and felt something wonderful just looking at the otter's face.

She was completely content. Not excited — content. There is a difference. Excitement burns bright and fast. Contentment is warm and slow and stays.

The otter floated past without opening her eyes. She held one smooth stone on her belly, rolling it from paw to paw. The stone was just to have something, not for any particular reason.

BABY_NAME followed along the bank until the bend, watching.

Then the otter rounded the curve and was gone, floating into the evening river, perfectly content, carrying her stone.

BABY_NAME walked home and lay down in bed and tried the otter's expression — that face of pure, unhurried contentment — and found that it worked just as well on land.`,

  // Story 34 — The Baker's First Hour
  `Before anyone else was awake, before even the birds, the baker was at work. The ovens were already warm and the dough was already rising and the kitchen smelled of things that haven't been invented yet but should be.

BABY_NAME slipped in at only BABY_AGE old, too small to have woken anyone, and sat on a flour sack in the corner and watched.

The baker moved slowly and surely. She had done this so many times that her hands knew what to do while her mind was somewhere else — somewhere warm and internal, the place bakers go when bread is in the world.

She looked up and saw BABY_NAME and smiled. She didn't stop working, but the smile said: I am glad you are here. This early hour is a gift, and gifts are better shared.

BABY_NAME watched the dough being shaped. Watched the loaves go in. Sat in the warm kitchen as the smell grew richer and deeper and more completely good.

There are not many things in this life more comforting than being in a warm kitchen before the world is awake, watching someone who is a master of their quiet art.

BABY_NAME fell asleep on the flour sack to the sound of the oven and the smell of bread coming. The baker put a small cloth over BABY_NAME's shoulders and went on working, and the whole dark morning was full of warmth.`,

  // Story 35 — The River's Secret
  `The river knew a secret that the mountains didn't know and the sea had forgotten. The secret was simple, as all true secrets are: the journey is the water.

Not the source, not the delta, not the wide place or the narrow place. The journey itself is what the river is.

At only BABY_AGE old, BABY_NAME met the river one evening and sat on its bank and listened to it talk in its fast, many-voiced language. BABY_NAME couldn't understand the words, but the meaning was clear as sky.

Everything you are carrying will eventually find its place, the river said. Everything that seems stuck will eventually move. This is not a promise — it is the nature of water, and you are mostly water, and so it is the nature of you.

BABY_NAME looked at their hands. They were mostly water, weren't they.

The river ran on. It didn't stop to wonder whether it was going the right way or moving fast enough. It just went, because that was what rivers do, and the going was the point.

BABY_NAME walked home along the bank as the stars came out above the water and doubled in the current, so that the river ran through a sky of its own.

BABY_NAME slept like water — moving softly, finding the low places, going where they were meant to go.`,

  // Story 36 — The Smallest Bird
  `Among all the birds of the forest, one was so small that she barely showed up at all — just a brown flicker between branches, a movement you caught from the corner of your eye and then lost again.

But she had the biggest voice.

Every morning, before any other bird, she sang. One long clear note that seemed to say: I am here, and the day can start now.

At only BABY_AGE old, BABY_NAME heard this and felt something important settle in place. You don't have to be big to matter. You don't have to be seen to have a voice. You only have to show up and give the note that is yours.

The small brown bird didn't worry about the bigger birds or the louder songs. She had her note and she gave it faithfully every single morning. That was enough. More than enough.

BABY_NAME listened until the other birds joined in and the forest was full of sound layered upon sound. But under all of it, steady and clear, was still that first note from the smallest bird.

BABY_NAME went to sleep that night humming something small and certain — not a whole song, just a note — their note, the one that was theirs alone.

And it filled the whole room.`,

  // Story 37 — The Moon's Garden
  `Nobody talks about the moon's garden, but it has one. It is planted entirely in silver and it grows on the dark side, where it is always night and things bloom slowly.

The flowers there are shaped like open hands. Each one holds a small pool of light.

BABY_NAME found the garden one night at only BABY_AGE old, in that floating way you find places in the softest part of sleep.

The moon walked through her garden and tended each flower with patient hands. She moved light from one pool to another. She checked the blooms that were not yet open and spoke to them quietly in her language, which is mostly just silence and glow.

BABY_NAME followed behind, helping in the small way that babies help — by caring, by paying attention, by bringing warmth into a place that was full of light but could use a little warmth.

The moon noticed.

Before BABY_NAME left, the moon pressed one single silver petal into their small hand. It was cool and smooth and it smelled like everything you have ever lost and then found again.

BABY_NAME held it close all night long, and slept deeply in the moon's garden, where nothing is ever truly dark.`,

  // Story 38 — The Long Afternoon
  `There are some afternoons that go on forever in the best possible way. The light stays golden just a little too long. The air doesn't cool. The day seems to decide it is not ready to be evening yet and holds its breath, and everything holds with it.

BABY_NAME had one of those afternoons at only BABY_AGE old.

Everything that happened was small and slow. Something warm to drink. A patch of sunlight on the floor that moved only imperceptibly. The soft noise of being somewhere familiar, surrounded by people who love you and are doing their ordinary things.

BABY_NAME sat in the middle of all of it and just existed.

This is rarer than it sounds. Most people spend even their most beautiful moments at least a little bit elsewhere. But BABY_NAME was entirely there — in the sunlit room, in the warm day, in the long afternoon — with no part of them anyplace else.

The day deepened slowly into evening, reluctant, and then the evening deepened into the first cool dark.

BABY_NAME had been awake a long time by then — a long, good, golden time. The body remembered all of it and was satisfied. The mind was quiet.

BABY_NAME closed their eyes and the long afternoon went on a while longer inside, warm and complete, and then finally, quietly, let go.`,

  // Story 39 — The Patchwork Sky
  `On the evening when the clouds caught the sunset in exactly the right way, the sky became a patchwork — pieces of gold and rose and the faintest green, separated by seams of light.

BABY_NAME looked up from the garden at only BABY_AGE old and felt that the sky had been made for this exact moment, to be seen by exactly these eyes.

A patchwork is made from different pieces, the sky seemed to say. Things that don't start out together can become something whole and beautiful. Every color I have I borrowed from somewhere. The gold from the sun. The rose from the day ending. None of them mine. All of them becoming something new together.

BABY_NAME looked at their hands, then at the sky, then back. Small and large. Near and far. But the same principle — things working together make something more than any one part could be alone.

The colors faded slowly, the patchwork unstitching itself as night moved in, until it was deep blue, then purple, then a dark so soft it felt like velvet.

The stars came through the velvet like gold thread.

BABY_NAME went inside carrying a color in each eye, and fell asleep in a room that still glowed a little with the particular pink of a sky that had given everything.`,

  // Story 40 — The Giant's Small Kindness
  `The giant was very large and very gentle and very often misunderstood, because people saw the large part first and forgot about the gentle part entirely.

BABY_NAME did not make this mistake.

At only BABY_AGE old, BABY_NAME saw the giant from across the meadow and felt the gentleness from that distance — the way he moved slowly around things smaller than him, the way he sat down rather than stand over, the way his voice came out carefully, like something he handled with both hands.

The giant had a problem only a baby could solve. He had dropped something — a small thing, a seed — between two rocks where his large fingers couldn't reach.

BABY_NAME went to the rocks and found the seed and held it up. The giant took it in two fingers with enormous delicacy and planted it back where it had come from, and pressed the earth around it with the very tip of one finger, so gently.

Then he and BABY_NAME sat together in the meadow as the sun went low and golden, one very large and one very small, both equally glad of the company.

Some things don't need words. BABY_NAME understood this, and so did the giant.

BABY_NAME walked home that evening with the feeling of having mattered to something much bigger than themselves, which is one of the very best feelings there is. And that night, tucked in tight, BABY_NAME fell into a deep and satisfied sleep.`,
];

export function fillStory(template: string, babyName: string, ageDisplay: string): string {
  return template
    .replace(/BABY_NAME/g, babyName)
    .replace(/BABY_AGE/g, ageDisplay);
}

function ensureStoryContainsBabyName(
  storyTemplate: string,
  babyName: string,
  language: AppLanguage
): string {
  if (storyTemplate.includes("BABY_NAME")) return storyTemplate;
  if (language === "el") {
    return `Απόψε είναι μια ιστορία για το ${babyName}.\n\n${storyTemplate}`;
  }
  return `Tonight this is a story about ${babyName}.\n\n${storyTemplate}`;
}

function sanitizeResolvedStory(story: string, language: AppLanguage): string {
  const fallbackToken = "«Κείμενο διαθέσιμο σύντομα»";
  const safeLine =
    language === "el"
      ? "Απόψε όλα είναι ήρεμα και όμορφα."
      : "Tonight everything is calm and beautiful.";
  const cleaned = story
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => (p.includes(fallbackToken) ? safeLine : p));
  if (cleaned.length === 0) return safeLine;
  return cleaned.join("\n\n");
}

function stripAgeMentions(story: string): string {
  return story
    .split(/\n\s*\n/g)
    .map((paragraph) =>
      paragraph
        .replace(/\bAt only [^,.!?]+ old,\s*/g, "")
        .replace(/,\s*at only [^,.!?]+ old,\s*/g, ", ")
        .replace(/[ \t]{2,}/g, " ")
        .replace(/ \./g, ".")
        .replace(/ ,/g, ",")
        .trim()
    )
    .filter(Boolean)
    .join("\n\n");
}

function stripAgeMentionsEl(story: string): string {
  return story
    .split(/\n\s*\n/g)
    .map((paragraph) =>
      paragraph
        .replace(/(?:Σε ηλικία μόλις|Μόλις)\s+[^,.!?]+,\s*/g, "")
        .replace(/[ \t]{2,}/g, " ")
        .replace(/ \./g, ".")
        .replace(/ ,/g, ",")
        .trim()
    )
    .filter(Boolean)
    .join("\n\n");
}

function buildGenderWrappers(
  gender: "girl" | "boy" | "unspecified" | undefined,
  babyName: string,
  language: AppLanguage = "en"
): { opening: string; closing: string } | null {
  if (language === "el") {
    if (gender === "girl") {
      return {
        opening: `Απόψε, αυτή η ιστορία είναι για ένα μικρό κορίτσι που το λένε ${babyName}.`,
        closing: `Είναι ασφαλής, είναι αγαπημένη, και αυτή η νύχτα είναι δική της.`,
      };
    }
    if (gender === "boy") {
      return {
        opening: `Απόψε, αυτή η ιστορία είναι για ένα μικρό αγόρι που το λένε ${babyName}.`,
        closing: `Είναι ασφαλής, είναι αγαπημένος, και αυτή η νύχτα είναι δική του.`,
      };
    }
    return null;
  }
  if (gender === "girl") {
    return {
      opening: `Tonight, this story is about a little girl named ${babyName}.`,
      closing: `She is safe, she is loved, and this night is hers.`,
    };
  }
  if (gender === "boy") {
    return {
      opening: `Tonight, this story is about a little boy named ${babyName}.`,
      closing: `He is safe, he is loved, and this night is his.`,
    };
  }
  return null;
}

function applyGenderWrappers(
  story: string,
  babyName: string,
  gender?: "girl" | "boy" | "unspecified",
  language: AppLanguage = "en"
): string {
  const wrappers = buildGenderWrappers(gender, babyName, language);
  if (!wrappers) return story;
  return `${wrappers.opening}\n\n${story}\n\n${wrappers.closing}`;
}

const AGE_OPTIONAL_STORY_INDEXES = new Set<number>([
  1, 2, 5, 7, 10, 12, 14, 16, 18, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39,
]);

export function splitStoryParagraphs(story: string): string[] {
  return story
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function pickRandomStory(
  babyName: string,
  ageDisplay: string,
  excludeIndex?: number,
  gender?: "girl" | "boy" | "unspecified",
  language: AppLanguage = "en"
): { story: string; index: number } {
  const sourceStories = language === "el" ? RAW_STORIES_EL : RAW_STORIES;
  const safeBabyName = babyName.trim() || (language === "el" ? "το μωράκι σου" : "your little one");
  let index: number;
  do {
    index = Math.floor(Math.random() * sourceStories.length);
  } while (sourceStories.length > 1 && index === excludeIndex);
  const templateWithName = ensureStoryContainsBabyName(sourceStories[index], safeBabyName, language);
  let story = fillStory(templateWithName, safeBabyName, ageDisplay);
  if (AGE_OPTIONAL_STORY_INDEXES.has(index)) {
    story = language === "el" ? stripAgeMentionsEl(story) : stripAgeMentions(story);
  }
  story = applyGenderWrappers(story, safeBabyName, gender, language);
  return { story: sanitizeResolvedStory(story, language), index };
}
