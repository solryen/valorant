export type Category = "spark" | "move" | "play";

export interface Activity {
  id: string;
  category: Category;
  ageRangeStart: number;
  ageRangeEnd: number;
  title: string;
  instruction: string;
  why: string;
}

const activities: Activity[] = [
  // ── 0–2 weeks ──────────────────────────────────────────────────────────────
  { id: "s-0-1", category: "spark", ageRangeStart: 0, ageRangeEnd: 2, title: "Face to face", instruction: "Hold your baby about 8–10 inches from your face and look at her quietly for 30 seconds. Blink slowly and let her study your features.", why: "Newborns can only focus at 8–12 inches, your face is the perfect distance and the most interesting thing in her world." },
  { id: "s-0-2", category: "spark", ageRangeStart: 0, ageRangeEnd: 2, title: "Black and white contrast", instruction: "Hold a high-contrast black-and-white image or patterned cloth 10 inches in front of her eyes. Keep it still for 20 seconds.", why: "Her retinas are still developing, high contrast is the clearest signal her brain can process right now." },
  { id: "s-0-3", category: "spark", ageRangeStart: 0, ageRangeEnd: 2, title: "Soft voice, still face", instruction: "Say her name very gently three times, pausing between each. Watch for a tiny stillness or eye widening as she recognizes your voice.", why: "She's been hearing your voice for months. Hearing it now activates the neural pathways she built in the womb." },
  { id: "s-0-4", category: "spark", ageRangeStart: 0, ageRangeEnd: 2, title: "Gentle tracking start", instruction: "Move a small soft toy very slowly from left to right, about 10 inches away from her eyes. Stop halfway if she loses it.", why: "Early tracking builds the visual-motor connections that support reading and coordination later." },
  { id: "s-0-5", category: "spark", ageRangeStart: 0, ageRangeEnd: 2, title: "Sing one note", instruction: "Hum a single low note gently while holding her close. Change the pitch slightly and watch her expression shift.", why: "Tone recognition and pitch discrimination begin forming in the first two weeks through repetition and response." },
  { id: "m-0-1", category: "move", ageRangeStart: 0, ageRangeEnd: 2, title: "Tummy time, just 1 minute", instruction: "Place her on your chest or a firm flat surface on her tummy. Keep one hand on her back. Time one full minute, then flip her back.", why: "Even 60 seconds of tummy time per day starts building the neck and back muscles she'll need to lift her head." },
  { id: "m-0-2", category: "move", ageRangeStart: 0, ageRangeEnd: 2, title: "Gentle leg bicycle", instruction: "While she's lying on her back, hold her ankles gently and slowly pedal her legs three full circles. Move at a pace that feels like you're in slow motion.", why: "Gentle passive movement stimulates nerve pathways and helps relieve any gas discomfort." },
  { id: "m-0-3", category: "move", ageRangeStart: 0, ageRangeEnd: 2, title: "Head support awareness", instruction: "Hold her upright against your chest and gently reduce support slightly for two seconds, then restore it. Stay close and safe.", why: "Tiny fluctuations in support prompt her neck muscles to recruit and engage instinctively." },
  { id: "m-0-4", category: "move", ageRangeStart: 0, ageRangeEnd: 2, title: "Palm grasp hold", instruction: "Place your finger across her palm and let her grip. Hold it for 20 seconds, then gently try to release. She'll usually grip tighter.", why: "The palmar grasp reflex is neurologically wired, practicing it strengthens grip and begins training her nervous system." },
  { id: "m-0-5", category: "move", ageRangeStart: 0, ageRangeEnd: 2, title: "Stretch and curl", instruction: "Slowly extend her arms up above her head, then gently bring them back in across her chest. Repeat three times, unhurried.", why: "Gentle full-range movement prevents the natural newborn curl from stiffening and keeps joints supple." },
  { id: "p-0-1", category: "play", ageRangeStart: 0, ageRangeEnd: 2, title: "Skin to skin, 10 minutes", instruction: "Lie back comfortably, place her bare against your chest, and cover you both with a light blanket. Just breathe together.", why: "Skin-to-skin contact releases oxytocin in both of you, stabilizes her heart rate and temperature, and deepens the attachment bond." },
  { id: "p-0-2", category: "play", ageRangeStart: 0, ageRangeEnd: 2, title: "Heartbeat hold", instruction: "Hold her on your left side, close to your chest. Let her hear your heartbeat for 5 minutes while you sit or walk slowly.", why: "She spent nine months listening to your heartbeat. This sound is more calming than anything else in her sensory world." },
  { id: "p-0-3", category: "play", ageRangeStart: 0, ageRangeEnd: 2, title: "Name her feelings", instruction: "Whenever she makes a sound or expression, name it aloud in a warm voice: 'That looks like you're cozy' or 'I think you're hungry.'", why: "Even this young, hearing her internal states reflected back builds the emotional vocabulary she'll use for the rest of her life." },
  { id: "p-0-4", category: "play", ageRangeStart: 0, ageRangeEnd: 2, title: "Scent recognition", instruction: "Hold a piece of your worn clothing near her face (not touching) for 30 seconds. Watch for settling or stillness.", why: "Your scent is one of the first things she learns to recognize and find comfort in, it's her first experience of you as 'safe.'" },
  { id: "p-0-5", category: "play", ageRangeStart: 0, ageRangeEnd: 2, title: "The talking pause", instruction: "Talk to her for 10 seconds, then stop and wait in silence for 10 seconds. Repeat three times, giving her space to respond.", why: "Even in week one, babies can show proto-conversation, pausing teaches her that her responses matter." },

  // ── 2–4 weeks ──────────────────────────────────────────────────────────────
  { id: "s-2-1", category: "spark", ageRangeStart: 2, ageRangeEnd: 4, title: "Slow tracking practice", instruction: "Hold a red or black soft toy 10 inches from her face. Move it very slowly left, pause, then right. Follow her eyes. Stop if she looks away.", why: "At 2–4 weeks, tracking ability is just emerging. Short, slow sessions build the visual-motor circuit without overwhelming her." },
  { id: "s-2-2", category: "spark", ageRangeStart: 2, ageRangeEnd: 4, title: "Mirror moment", instruction: "Hold her in front of a mirror 10 inches away. Let her look at the reflection for 30 seconds. She won't know it's her, and that's fine.", why: "Faces activate more neural firing than any other visual stimulus, her reflection is like a whole new face to study." },
  { id: "s-2-3", category: "spark", ageRangeStart: 2, ageRangeEnd: 4, title: "Sound direction game", instruction: "While she's relaxed and awake, make a soft sound (gentle shaking of a soft rattle) to her right. Wait. Then try from the left.", why: "Sound localization, knowing where sound comes from, is a foundational cognitive skill that begins developing around week 3." },
  { id: "s-2-4", category: "spark", ageRangeStart: 2, ageRangeEnd: 4, title: "Cause and effect touch", instruction: "Stroke her cheek gently and watch for a head-turn rooting reflex. Name it when it happens: 'There she goes, she's looking for that!'", why: "Noticing and naming her reflexes helps her brain connect sensation to movement, an early form of cause-and-effect learning." },
  { id: "s-2-5", category: "spark", ageRangeStart: 2, ageRangeEnd: 4, title: "Contrast book time", instruction: "Hold a black-and-white board book about 10 inches away. Turn one page at a time, holding each for 20 seconds.", why: "Pages with strong contrast give her visual cortex something it can actually process, building attention and focus." },
  { id: "m-2-1", category: "move", ageRangeStart: 2, ageRangeEnd: 4, title: "Tummy time on a rolled towel", instruction: "Roll a small towel and place it under her chest during tummy time. This slight incline makes lifting easier. Try 2 minutes.", why: "A slight incline reduces the effort needed to lift the head, making tummy time more successful and less frustrating." },
  { id: "m-2-2", category: "move", ageRangeStart: 2, ageRangeEnd: 4, title: "Foot tickle kick", instruction: "Tickle the sole of her foot very gently. Watch for a pull-back or push-out response. Alternate feet three times.", why: "The plantar reflex links tactile stimulation to leg movement, one of the earliest body-awareness connections." },
  { id: "m-2-3", category: "move", ageRangeStart: 2, ageRangeEnd: 4, title: "Supported tummy on your legs", instruction: "Sit with your legs flat and lay her face-down across your thighs. Your leg provides more surface contact than a mat and calms her.", why: "Body warmth and contact help her tolerate tummy time longer, getting more neck-strengthening time in." },
  { id: "m-2-4", category: "move", ageRangeStart: 2, ageRangeEnd: 4, title: "Arm reach prompt", instruction: "Dangle a soft toy about 6 inches above her chest while she's on her back. Don't help, just wait and watch for any arm movement toward it.", why: "Visually directed reach attempts start appearing around week 3–4. Giving her space to try builds the circuit." },
  { id: "m-2-5", category: "move", ageRangeStart: 2, ageRangeEnd: 4, title: "Supported sitting peek", instruction: "Prop her in a sitting position with both hands supporting her back and head. Hold for 20 seconds. Let her experience being upright.", why: "Even brief upright posture recruits core and neck muscles and gives her a completely new visual perspective." },
  { id: "p-2-1", category: "play", ageRangeStart: 2, ageRangeEnd: 4, title: "The smile vigil", instruction: "During a quiet alert period, get face-to-face and smile at her very slowly. Wait. The social smile often appears around week 3–4. Keep waiting.", why: "The social smile is one of the most significant early milestones, she's beginning to understand that her face can communicate." },
  { id: "p-2-2", category: "play", ageRangeStart: 2, ageRangeEnd: 4, title: "Lullaby repetition", instruction: "Sing the exact same short song you sang yesterday, using the same words and melody. Her response may become more attentive with repetition.", why: "Memory for sound begins forming very early. Repetition is how she starts to recognize, and anticipate, patterns." },
  { id: "p-2-3", category: "play", ageRangeStart: 2, ageRangeEnd: 4, title: "Texture introduction", instruction: "Let her hand rest on three different textures, soft blanket, smooth plastic, terry cloth, for 30 seconds each. Watch her fingers.", why: "Tactile exploration sends rich sensory information to her developing brain and builds awareness of her own hands." },
  { id: "p-2-4", category: "play", ageRangeStart: 2, ageRangeEnd: 4, title: "Dance together", instruction: "Hold her secure against your chest and sway slowly in a figure-eight pattern for 3 minutes. Keep it gentle and rhythmic.", why: "Rhythmic movement activates the vestibular system, builds balance awareness, and reinforces felt safety with you." },
  { id: "p-2-5", category: "play", ageRangeStart: 2, ageRangeEnd: 4, title: "The look-away game", instruction: "Make eye contact, then slowly look away to the side. Wait 5 seconds, then return your gaze. Notice if she was waiting for you.", why: "Turn-taking in gaze, even this early, is the foundation of all future conversation and social rhythm." },

  // ── 4–6 weeks ──────────────────────────────────────────────────────────────
  { id: "s-4-1", category: "spark", ageRangeStart: 4, ageRangeEnd: 6, title: "Follow the face", instruction: "Make direct eye contact, then very slowly move your face to the left while keeping her gaze. See if her eyes and head follow you.", why: "Head-turning to track a face shows that visual attention is linking with motor control, a big cognitive step." },
  { id: "s-4-2", category: "spark", ageRangeStart: 4, ageRangeEnd: 6, title: "New object inspection", instruction: "Show her something she hasn't seen, a wooden spoon, your glasses, a striped sock. Hold it still at eye level for 30 seconds.", why: "Novel objects generate sustained attention as her brain works to categorize something unfamiliar, building working memory." },
  { id: "s-4-3", category: "spark", ageRangeStart: 4, ageRangeEnd: 6, title: "Animal sound introduction", instruction: "Say a single animal sound slowly and warmly, 'moo' or 'baa', then wait silently for 5 seconds. Repeat twice.", why: "Sound categories form early; separating sounds from visual cues builds abstract sound discrimination." },
  { id: "s-4-4", category: "spark", ageRangeStart: 4, ageRangeEnd: 6, title: "Tell her what you're doing", instruction: "Do one normal task, make tea, fold a cloth, and narrate it in simple sentences directly to her. Keep going for 2 minutes.", why: "Language density in the first months predicts vocabulary size at age three. Every word counts, even now." },
  { id: "s-4-5", category: "spark", ageRangeStart: 4, ageRangeEnd: 6, title: "Two-texture contrast", instruction: "Place her hand on a rough texture, then immediately on a smooth one. Say the word: 'rough' then 'smooth.' Repeat three times.", why: "Pairing tactile sensation with words creates multi-modal memory pathways, stronger and more lasting than either alone." },
  { id: "m-4-1", category: "move", ageRangeStart: 4, ageRangeEnd: 6, title: "Head lift encouragement", instruction: "During tummy time, position yourself in front of her and talk gently to encourage her to lift her head toward your voice. Try 3 minutes.", why: "By 4–6 weeks, many babies can briefly lift their head. Motivation from your voice is more effective than a toy." },
  { id: "m-4-2", category: "move", ageRangeStart: 4, ageRangeEnd: 6, title: "Seated roll side to side", instruction: "Support her seated in your lap and very gently tilt her slightly left and right, about 10 degrees each way, three times.", why: "Vestibular input from side-to-side movement trains the balance system and prompts core muscle recruitment." },
  { id: "m-4-3", category: "move", ageRangeStart: 4, ageRangeEnd: 6, title: "Pull-to-sit slow motion", instruction: "Grasp her hands while she's lying down and very slowly, gently pull her toward sitting. Stop halfway. Lower her back. Repeat twice.", why: "The brief tension on her neck muscles prompts head righting, the beginning of independent head control." },
  { id: "m-4-4", category: "move", ageRangeStart: 4, ageRangeEnd: 6, title: "Arm wave assist", instruction: "While she's on her back, hold one wrist gently and slowly wave her arm in a wide arc. Let go and see if she continues.", why: "Motor patterns sometimes persist briefly after assistance, this gives her brain a template for intentional arm movement." },
  { id: "m-4-5", category: "move", ageRangeStart: 4, ageRangeEnd: 6, title: "Tummy on your chest", instruction: "Lean back in a reclined position and place her tummy-down on your chest. Talk to her and let her try to lift toward your face.", why: "Your warmth and voice are the best motivation for neck lifting, and this position is safe and comfortable for both of you." },
  { id: "p-4-1", category: "play", ageRangeStart: 4, ageRangeEnd: 6, title: "First real conversation", instruction: "When she vocalizes, any sound, pause, look at her, then make the same sound back. Wait. See if she responds. Keep going for 2 minutes.", why: "Proto-conversation, the back-and-forth of sounds, is the direct precursor to language. She's learning that sounds communicate." },
  { id: "p-4-2", category: "play", ageRangeStart: 4, ageRangeEnd: 6, title: "The big smile game", instruction: "Smile at her as warmly and expressively as you can, then let your face go neutral for 5 seconds, then smile again. Watch her react.", why: "The still-face experiment showed babies are exquisitely sensitive to facial expression, practicing contrast builds her emotional reading." },
  { id: "p-4-3", category: "play", ageRangeStart: 4, ageRangeEnd: 6, title: "Outdoor air", instruction: "Take her outside for 5 minutes in a gentle hold. Let her face (with sun protection) feel different air and light.", why: "New sensory environments, wind, natural light, different sounds, activate novelty processing in her developing brain." },
  { id: "p-4-4", category: "play", ageRangeStart: 4, ageRangeEnd: 6, title: "Story telling", instruction: "Hold her and tell her one short story, it doesn't have to be a real book. Use character voices, pauses, and expressions.", why: "Narrative prosody, the rise and fall of storytelling voice, teaches sentence structure long before she understands words." },
  { id: "p-4-5", category: "play", ageRangeStart: 4, ageRangeEnd: 6, title: "Gentle bath play", instruction: "During bath time, pour warm water slowly over her tummy and describe what you're doing warmly. Let her hands feel the water.", why: "Water temperature and tactile richness during a trusted, calm routine build multi-sensory memory and felt safety." },

  // ── 6–8 weeks ──────────────────────────────────────────────────────────────
  { id: "s-6-1", category: "spark", ageRangeStart: 6, ageRangeEnd: 8, title: "Color introduction", instruction: "Show her a single brightly-colored object, a red cup, a yellow cloth, at 10 inches. Hold it still for 30 seconds, then swap for a different color.", why: "Color differentiation improves rapidly at 6–8 weeks as cone cells in the retina mature, new colors are genuinely exciting to her visual system." },
  { id: "s-6-2", category: "spark", ageRangeStart: 6, ageRangeEnd: 8, title: "Two-sound comparison", instruction: "Let her hear a soft bell, then a rattle. Pause between each. Watch her head turn or eyes widen for the new sound.", why: "Comparing two distinct sounds builds auditory discrimination, the ability to tell sounds apart that underlies all language learning." },
  { id: "s-6-3", category: "spark", ageRangeStart: 6, ageRangeEnd: 8, title: "Imitation game", instruction: "Stick your tongue out slowly at her. Wait 10 seconds. Babies at this age sometimes imitate, it might take several tries.", why: "Imitation is one of the most sophisticated early cognitive acts, it requires perception, comparison, and motor planning." },
  { id: "s-6-4", category: "spark", ageRangeStart: 6, ageRangeEnd: 8, title: "Object permanence tease", instruction: "Show her a soft toy, let her look at it for 10 seconds, then slowly hide it behind your back. Watch her expression, does she look for it?", why: "Object permanence is months away, but early disappearance games begin building the cognitive question: where did it go?" },
  { id: "s-6-5", category: "spark", ageRangeStart: 6, ageRangeEnd: 8, title: "Read her a real book", instruction: "Open a simple board book and read one page per minute in a warm, clear voice. Point to images as you name them.", why: "Joint attention, looking at the same thing together, is one of the earliest and most important cognitive social skills." },
  { id: "m-6-1", category: "move", ageRangeStart: 6, ageRangeEnd: 8, title: "3-minute tummy time goal", instruction: "Set a gentle timer and aim for three uninterrupted minutes of tummy time. Encourage with your voice in front of her. This is the target.", why: "Three consecutive minutes of neck lifting builds the posterior neck chain that supports all future head control and sitting." },
  { id: "m-6-2", category: "move", ageRangeStart: 6, ageRangeEnd: 8, title: "Airplane hold", instruction: "Support her face-down on your forearm with her head at your elbow and her legs straddling your forearm. Hold for 30 seconds. This is the 'Superman hold.'", why: "This position uses gravity to challenge the entire back extensor chain, building spinal strength essential for sitting." },
  { id: "m-6-3", category: "move", ageRangeStart: 6, ageRangeEnd: 8, title: "Toy kick target", instruction: "Hold a soft crinkle toy just above her feet while she's on her back. Let her feet find it and kick it. Give her 2 minutes.", why: "Kicking a target is the first intentional lower-body motor act, connecting visual input to leg movement through cause and effect." },
  { id: "m-6-4", category: "move", ageRangeStart: 6, ageRangeEnd: 8, title: "Batting attempt", instruction: "Hang a lightweight soft toy about 8 inches above her chest while she's on her back. Wait and watch for arm swipes, don't guide her hands.", why: "Visually-directed batting, hitting what she sees, is the first coordinated arm-eye-intent action she'll make." },
  { id: "m-6-5", category: "move", ageRangeStart: 6, ageRangeEnd: 8, title: "Head lag check", instruction: "Slowly pull her to sitting from lying, then gently lower her back. Notice how much her head lags behind, it should be improving each week.", why: "Tracking the head lag reduction week by week gives you a real sense of neck strengthening progress." },
  { id: "p-6-1", category: "play", ageRangeStart: 6, ageRangeEnd: 8, title: "Coo response chain", instruction: "Wait until she coos, then respond with a gentle coo back. Wait for her response. Try to keep the exchange going for 1 minute.", why: "Cooing back-and-forth is full conversational turn-taking, she's learning that communication is mutual and that her voice matters." },
  { id: "p-6-2", category: "play", ageRangeStart: 6, ageRangeEnd: 8, title: "Routine narration", instruction: "Pick one daily routine, changing, feeding, waking up, and say the same three sentences every time, in the same order.", why: "Predictable language routines build implicit memory and create the earliest sense of 'I know what's coming next.'" },
  { id: "p-6-3", category: "play", ageRangeStart: 6, ageRangeEnd: 8, title: "Peek-a-boo introduction", instruction: "Cover your face with your hands, pause for 3 seconds, then reveal with 'Peek-a-boo!' Keep your expression warm and a bit dramatic. Repeat five times.", why: "The anticipation phase, the pause before the reveal, is where the cognitive and emotional magic happens." },
  { id: "p-6-4", category: "play", ageRangeStart: 6, ageRangeEnd: 8, title: "Sharing a view", instruction: "Hold her facing outward and describe what you both see together. 'We're looking at the window. There's a curtain. It's moving.'", why: "Joint attention, sharing a visual experience and having it named, is the foundation of shared understanding and empathy." },
  { id: "p-6-5", category: "play", ageRangeStart: 6, ageRangeEnd: 8, title: "Massage with commentary", instruction: "Give her a gentle 3-minute massage, legs, arms, back, narrating each part: 'Now your left arm, now your right foot.' Slow and warm.", why: "Touch combined with language links body awareness to vocabulary, building body schema and felt self-knowledge." },

  // ── 8–10 weeks ─────────────────────────────────────────────────────────────
  { id: "s-8-1", category: "spark", ageRangeStart: 8, ageRangeEnd: 10, title: "Vertical tracking", instruction: "Hold a soft toy 10 inches from her face and move it slowly up, then down. See if her eyes track the vertical path.", why: "Vertical tracking uses different neural pathways than horizontal, building a more complete visual map." },
  { id: "s-8-2", category: "spark", ageRangeStart: 8, ageRangeEnd: 10, title: "Word repetition, one at a time", instruction: "Say one simple word, 'dog,' 'milk,' 'blue', clearly and warmly, then pause for 5 seconds. Say it again. Repeat 5 times.", why: "Spaced repetition of individual words starts building phonetic templates, the sounds that will eventually become her words." },
  { id: "s-8-3", category: "spark", ageRangeStart: 8, ageRangeEnd: 10, title: "Cause and effect toy", instruction: "Let her hand rest near a toy that makes a sound when pressed. Guide her finger to press it once, then step back and wait.", why: "Understanding that she caused something, I touched it and it made a sound, is a landmark cognitive realization." },
  { id: "s-8-4", category: "spark", ageRangeStart: 8, ageRangeEnd: 10, title: "Describe your day to her", instruction: "In a relaxed voice, tell her what you did today: 'We went to the shop. I bought some bread. It was cold outside.' One sentence at a time.", why: "She can't understand the words yet, but sentence rhythm, variety, and your voice train her language processors continuously." },
  { id: "s-8-5", category: "spark", ageRangeStart: 8, ageRangeEnd: 10, title: "Sound source movement", instruction: "Shake a rattle behind her head on the right side. Wait. Then try the left. Does she turn her head toward the sound?", why: "Sound localization, orienting toward a sound source, is linking hearing to motor response for the first time." },
  { id: "m-8-1", category: "move", ageRangeStart: 8, ageRangeEnd: 10, title: "Tummy time, 5 minutes", instruction: "Aim for a solid 5-minute session. Use a small pillow under her chest if needed. Get on the floor in front of her to keep her motivated.", why: "Five minutes of sustained tummy time is enough to produce measurable neck and shoulder strength gains over a week." },
  { id: "m-8-2", category: "move", ageRangeStart: 8, ageRangeEnd: 10, title: "Supported standing press", instruction: "Hold her upright with feet touching a firm surface. Let her push down with her legs for 10 seconds. She may straighten and bounce slightly.", why: "The push-response is a precursor to standing, her legs are already learning to bear weight and respond to ground contact." },
  { id: "m-8-3", category: "move", ageRangeStart: 8, ageRangeEnd: 10, title: "Midline reach", instruction: "Hold a soft toy directly above her navel while she's on her back. Watch for both hands moving toward the center to grab it.", why: "Midline hand meeting, both hands connecting at the center of the body, is a key developmental milestone around 8–12 weeks." },
  { id: "m-8-4", category: "move", ageRangeStart: 8, ageRangeEnd: 10, title: "Rolling assistance", instruction: "With her on her back, gently guide one bent knee across her body to initiate a half-roll to her side. Hold her there for 10 seconds, then ease back.", why: "Experiencing the rotation of rolling, even assisted, teaches her brain the movement pattern that independent rolling requires." },
  { id: "m-8-5", category: "move", ageRangeStart: 8, ageRangeEnd: 10, title: "Floor time, free move", instruction: "Lay her safely on a clean blanket on the floor for 5 minutes with no toys. Let her move without any guidance or help.", why: "Unstructured movement time lets her explore her own body's capabilities at her own pace, self-directed motor learning." },
  { id: "p-8-1", category: "play", ageRangeStart: 8, ageRangeEnd: 10, title: "Silly face exchange", instruction: "Make a very exaggerated face, wide eyes, open mouth, and hold it for 3 seconds. Then reset. Watch for her reaction and imitate back.", why: "Reading and responding to facial expression is the foundation of all future empathy, social cognition, and connection." },
  { id: "p-8-2", category: "play", ageRangeStart: 8, ageRangeEnd: 10, title: "Say goodnight to things", instruction: "At bedtime, walk her around and say goodnight to five things in the room. Warm voice, slow pace. 'Goodnight window. Goodnight lamp.'", why: "End-of-day rituals at this age build the first sense of predictable time patterns, a foundational sleep and security anchor." },
  { id: "p-8-3", category: "play", ageRangeStart: 8, ageRangeEnd: 10, title: "Water sounds", instruction: "Let her listen to the sound of water, from a tap, a fountain video, or gentle rain, for 3 minutes while holding her close.", why: "Novel auditory environments stimulate attention and calm the nervous system in ways that are distinct from speech sounds." },
  { id: "p-8-4", category: "play", ageRangeStart: 8, ageRangeEnd: 10, title: "Your laugh", instruction: "Let her hear you genuinely laugh, not performed. If something's funny today, laugh it out near her. Watch her expression.", why: "Authentic emotional expression is richer and more varied in pitch than performed laughter, far more informative for her brain." },
  { id: "p-8-5", category: "play", ageRangeStart: 8, ageRangeEnd: 10, title: "High contrast mobile time", instruction: "If you have a mobile above her mat, let her watch it independently for 5 minutes. Sit nearby but don't interact, let her self-entertain.", why: "Self-directed visual engagement teaches her to sustain her own attention, a skill she'll need for all future learning." },

  // ── 10–12 weeks ────────────────────────────────────────────────────────────
  { id: "s-10-1", category: "spark", ageRangeStart: 10, ageRangeEnd: 12, title: "Name association game", instruction: "Say 'Where's your hand?' then touch her hand. 'Where's your nose?' then touch it. Three body parts. Three touches. Repeat tomorrow.", why: "Body part naming begins the map her brain builds between words and physical reality, one of the earliest semantic connections." },
  { id: "s-10-2", category: "spark", ageRangeStart: 10, ageRangeEnd: 12, title: "Anticipation tickle", instruction: "Say 'I'm going to get you!' very slowly and make a dramatic approach, then gently tickle her tummy. Repeat, letting her anticipate.", why: "Anticipation, the cognitive state of expecting what comes next, is one of the most important building blocks of learning." },
  { id: "s-10-3", category: "spark", ageRangeStart: 10, ageRangeEnd: 12, title: "Object comparison", instruction: "Show her two objects side by side, a big block and a small one, or a rough cloth and a smooth one. Hold both at eye level.", why: "Comparing two things simultaneously is an early step toward categorization, understanding that things have properties." },
  { id: "s-10-4", category: "spark", ageRangeStart: 10, ageRangeEnd: 12, title: "Gentle music exploration", instruction: "Play three short music clips, classical, gentle pop, nature sounds, 30 seconds each. Watch how her expression and movement change.", why: "Musical variety builds auditory cortex flexibility and emotional association with sound." },
  { id: "s-10-5", category: "spark", ageRangeStart: 10, ageRangeEnd: 12, title: "Morning window narration", instruction: "Hold her at a window in the morning and describe what you see outdoors: trees, clouds, birds, people. Take two full minutes.", why: "Connecting visual scenes to words builds the declarative memory framework that language understanding depends on." },
  { id: "m-10-1", category: "move", ageRangeStart: 10, ageRangeEnd: 12, title: "Tummy time, 10 minutes", instruction: "Build toward 10 minutes of tummy time today. Break into two sessions if needed. Use a favorite toy in front to keep her going.", why: "Ten minutes daily of tummy time leads to significantly earlier rolling and sitting milestones." },
  { id: "m-10-2", category: "move", ageRangeStart: 10, ageRangeEnd: 12, title: "Grasp and hold", instruction: "Offer her a soft ring toy and see if she can grasp it in her hand. Hold her hand around it gently, then release to see if she keeps it.", why: "Voluntary grasp, holding something intentionally rather than reflexively, usually appears between 10–14 weeks." },
  { id: "m-10-3", category: "move", ageRangeStart: 10, ageRangeEnd: 12, title: "Body roll prep", instruction: "Place her on her side with a rolled towel supporting her back. Let her feel this position for 2 minutes, it's the halfway point of rolling.", why: "Side-lying is an intermediate posture that prepares the muscles and spatial sense for independent rolling." },
  { id: "m-10-4", category: "move", ageRangeStart: 10, ageRangeEnd: 12, title: "Bounce rhythm", instruction: "Sit her on your knee supported fully, and do very gentle, small bounces in rhythm: one per second for 30 seconds. Pause, repeat twice.", why: "Rhythmic vestibular input at this frequency builds core postural tone and spatial awareness simultaneously." },
  { id: "m-10-5", category: "move", ageRangeStart: 10, ageRangeEnd: 12, title: "Floor reach exploration", instruction: "Place three different small safe objects within arm's reach on a mat. Let her attempt to reach them freely for 5 minutes. Don't assist.", why: "Self-initiated reaching, even unsuccessful, builds the arm-eye coordination pathway faster than assisted reaching." },
  { id: "p-10-1", category: "play", ageRangeStart: 10, ageRangeEnd: 12, title: "Delight in delight", instruction: "Notice one thing she seems to like today, a sound, a texture, a face you make. Do it three more times, really slowly, watching her response.", why: "Following her interest and amplifying it teaches her that her preferences shape her world, foundational for sense of self." },
  { id: "p-10-2", category: "play", ageRangeStart: 10, ageRangeEnd: 12, title: "Silly sound trade", instruction: "Make a silly sound, a pop, a click, a raspberry, and wait. If she makes any sound back, treat it like a perfect response. Go again.", why: "Sound play that has no referent (not a real word) is purely about the joy of making noise together, it teaches that play is safe." },
  { id: "p-10-3", category: "play", ageRangeStart: 10, ageRangeEnd: 12, title: "Family photo viewing", instruction: "Show her photos of close family members on your phone. Name each person warmly. Watch for any recognition in her expression.", why: "Face recognition memory is building rapidly, repeated exposure to familiar faces deepens the neural templates she's creating." },
  { id: "p-10-4", category: "play", ageRangeStart: 10, ageRangeEnd: 12, title: "The quiet together", instruction: "Find 3 minutes where you're both just present, no activities, no stimulation. Hold her or let her lie near you. Just be.", why: "Rest time between stimulation is not wasted, it's when her brain consolidates and integrates what she's been learning." },
  { id: "p-10-5", category: "play", ageRangeStart: 10, ageRangeEnd: 12, title: "Object hide-and-show", instruction: "Put a small toy in a cup and tip it out. Let her see the toy appear. Repeat 4 times. Then pause and see if she looks at the cup.", why: "The beginning of object permanence expectation, looking for where something went, is one of the biggest leaps of infancy." },

  // ── 3 months (12–14 weeks) ─────────────────────────────────────────────────
  { id: "s-12-1", category: "spark", ageRangeStart: 12, ageRangeEnd: 16, title: "Color naming game", instruction: "Point to five colored things in the room and name the color clearly each time: 'That's red. That's blue.' Hold her so she can look.", why: "Color words are among the earliest abstract categories, naming them now plants seeds that bloom as language develops." },
  { id: "s-12-2", category: "spark", ageRangeStart: 12, ageRangeEnd: 16, title: "Question and answer", instruction: "Ask her a question, 'Are you hungry?', and then wait 5 full seconds for any response. Then answer yourself warmly.", why: "Questions with pauses teach the structure of dialogue, statement, wait, response, long before she can actually answer." },
  { id: "s-12-3", category: "spark", ageRangeStart: 12, ageRangeEnd: 16, title: "Textured book exploration", instruction: "Run her fingers over a touch-and-feel book, naming each texture: 'Soft feather. Bumpy scales. Smooth glass.'", why: "Multi-sensory language experiences, feeling while hearing the word, build stronger neural word-concept connections." },
  { id: "s-12-4", category: "spark", ageRangeStart: 12, ageRangeEnd: 16, title: "Outside sounds identification", instruction: "Take her outside and point to the source of each sound you hear: traffic, birds, wind, voices. Name each one.", why: "Connecting abstract sounds to visible sources is a complex cognitive synthesis, sound + visual + language all at once." },
  { id: "s-12-5", category: "spark", ageRangeStart: 12, ageRangeEnd: 16, title: "Your emotions, named", instruction: "Name your own emotions today. 'I feel happy right now.' 'That was a bit frustrating.' Keep it simple and genuine.", why: "She's learning emotion recognition from watching you, naming what you feel teaches her that emotions have names and are real." },
  { id: "m-12-1", category: "move", ageRangeStart: 12, ageRangeEnd: 16, title: "Full tummy time session", instruction: "Three 5-minute tummy time sessions spaced through the day. Each time, have a toy she likes in front at eye level.", why: "By 3 months, 15 minutes total daily tummy time is the target, spread across sessions makes it achievable without frustration." },
  { id: "m-12-2", category: "move", ageRangeStart: 12, ageRangeEnd: 16, title: "Supported sitting, free hands", instruction: "Sit her supported in a pillow ring or Boppy so her hands are free. Let her play for 5 minutes with her arms completely free.", why: "Free-hand play in a supported sit builds the shoulder stability and midline arm control that will be needed for self-feeding." },
  { id: "m-12-3", category: "move", ageRangeStart: 12, ageRangeEnd: 16, title: "Active leg push", instruction: "Place your palms flat against her feet while she's on her back. Let her push against your hands, don't push back. Just resist.", why: "Leg pushing against resistance is the movement pattern underlying crawling, standing, and walking, it begins right now." },
  { id: "m-12-4", category: "move", ageRangeStart: 12, ageRangeEnd: 16, title: "Arm swing toy reach", instruction: "Hang a safe lightweight toy 8 inches above her chest. Let her swipe at it freely. Count how many times she makes contact.", why: "Batting success rate is a direct measure of improving arm-eye coordination that you can actually track week by week." },
  { id: "m-12-5", category: "move", ageRangeStart: 12, ageRangeEnd: 16, title: "First rolling attempts", instruction: "Place her on her side, gently supported, and see if she can rock toward tummy or back. Don't push, just support the position.", why: "Rolling prep at 3 months means many babies roll tummy-to-back for the first time between 3–5 months." },
  { id: "p-12-1", category: "play", ageRangeStart: 12, ageRangeEnd: 16, title: "Excited greeting", instruction: "When you enter the room, give her a genuinely warm, energetic greeting, 'Hi! There you are!' Watch her face and body respond.", why: "Her response to your greeting, arms waving, face lighting up, is evidence of attachment and social memory forming." },
  { id: "p-12-2", category: "play", ageRangeStart: 12, ageRangeEnd: 16, title: "Bath pouring game", instruction: "Pour water slowly over her tummy using a small cup during bath time. Name what you're doing: 'Warm water on your tummy!'", why: "Sensory play in water during a familiar routine builds sensory tolerance and the experience that new sensations can be safe." },
  { id: "p-12-3", category: "play", ageRangeStart: 12, ageRangeEnd: 16, title: "Sharing delight", instruction: "If she reacts positively to something, a toy, a sound, share her delight genuinely. Say 'Yes! That IS exciting!'", why: "Having your emotional reaction mirrored and amplified by a caregiver teaches her that emotions are shareable and valid." },
  { id: "p-12-4", category: "play", ageRangeStart: 12, ageRangeEnd: 16, title: "Sensory bin exploration", instruction: "Create a small container with dried rice or soft fabric scraps. Let her hands explore it while you describe the textures.", why: "Tactile exploration continues to be one of the richest learning experiences available to her at 3 months." },
  { id: "p-12-5", category: "play", ageRangeStart: 12, ageRangeEnd: 16, title: "Parent break, together", instruction: "Put on music you love and let her sit with you while you do something enjoyable, reading, stretching, tea. She benefits from your calm state.", why: "Your regulated nervous system is the most powerful influence on her regulation. Your peace is her development." },

  // ── 4 months (16–20 weeks) ─────────────────────────────────────────────────
  { id: "s-16-1", category: "spark", ageRangeStart: 16, ageRangeEnd: 20, title: "Object exploration basket", instruction: "Put three safe household objects in a small basket, a wooden spoon, a soft sock, a metal cup. Let her examine each for 2 minutes.", why: "Varied object properties (weight, texture, sound) give her brain rich comparative data that builds category understanding." },
  { id: "s-16-2", category: "spark", ageRangeStart: 16, ageRangeEnd: 20, title: "Babble response", instruction: "When she babbles, respond with different babbles. Try 'bah-bah' and 'mah-mah' slowly. Wait and watch. Try to match her sounds.", why: "Phoneme variety in back-and-forth babble builds the sound inventory she'll draw on when real words form at 8–12 months." },
  { id: "s-16-3", category: "spark", ageRangeStart: 16, ageRangeEnd: 20, title: "Two-option choice", instruction: "Hold two toys, one in each hand, and let her reach for one. Name the one she chose: 'You picked the red one!' Repeat three times.", why: "Making choices, even non-verbal ones, builds the neural pathways for decision-making and intention." },
  { id: "s-16-4", category: "spark", ageRangeStart: 16, ageRangeEnd: 20, title: "Disappearing act", instruction: "Show her a toy, cover it with a cloth in front of her. See if she reaches toward it. Uncover after 5 seconds.", why: "Reaching toward a hidden object shows the beginning of object permanence, she knows it's still there even when hidden." },
  { id: "s-16-5", category: "spark", ageRangeStart: 16, ageRangeEnd: 20, title: "Yes and no introduction", instruction: "Say 'yes' with a warm nod when she does something positive. Say 'no' calmly and gently for something to avoid. Consistency matters.", why: "The words yes and no are among the first abstract concepts she'll learn, social feedback that shapes her understanding of the world." },
  { id: "m-16-1", category: "move", ageRangeStart: 16, ageRangeEnd: 20, title: "Rolling encouragement", instruction: "Place her on her back. Use a toy to entice her to reach across her body, this helps initiate the rotation needed for rolling.", why: "Many babies roll back-to-side or tummy-to-back between 4–5 months. Motivated reaching triggers the rotation pattern." },
  { id: "m-16-2", category: "move", ageRangeStart: 16, ageRangeEnd: 20, title: "Supported sitting, longer", instruction: "Sit her propped in a corner of the sofa (supervised) or in a Boppy for 10 minutes. Offer toys to reach for.", why: "Sitting with support for longer periods builds trunk endurance and the spinal stability needed for independent sitting." },
  { id: "m-16-3", category: "move", ageRangeStart: 16, ageRangeEnd: 20, title: "Bilateral hand play", instruction: "Give her a large toy that requires both hands, a ring stacker base, a large soft block, and let her explore it with both hands.", why: "Two-handed manipulation at the midline is a major motor milestone that supports later writing, eating, and dressing." },
  { id: "m-16-4", category: "move", ageRangeStart: 16, ageRangeEnd: 20, title: "Water play, larger splash", instruction: "During bath, let her kick freely and splash. Don't stop the splashing. Let her discover what her legs can do to the water.", why: "Discovering cause-and-effect through her own body, I kicked and the water splashed, is deeply rewarding motor learning." },
  { id: "m-16-5", category: "move", ageRangeStart: 16, ageRangeEnd: 20, title: "Elevated tummy on arms", instruction: "During tummy time, place a rolled blanket under her upper chest so her arms are free. See if she pushes up on forearms.", why: "The push-up-on-forearms position is the gateway to the mini-push-up that precedes crawling by several months." },
  { id: "p-16-1", category: "play", ageRangeStart: 16, ageRangeEnd: 20, title: "Laugh together", instruction: "Find what makes her laugh today, it could be a sound, a face, a motion. Do it, let her respond, do it again. Chase the laughter.", why: "Shared laughter activates reward circuits in both of you and is one of the most powerful bonding experiences available." },
  { id: "p-16-2", category: "play", ageRangeStart: 16, ageRangeEnd: 20, title: "Singing your day", instruction: "Make up a simple song about your daily routine. 'Now we're eating breakfast, breakfast, breakfast.' Repeat it tomorrow.", why: "Songs with routine-specific words build both musical memory and contextual vocabulary at the same time." },
  { id: "p-16-3", category: "play", ageRangeStart: 16, ageRangeEnd: 20, title: "Stranger observation", instruction: "Let her observe a friendly stranger from your arms, don't hand her over, just let her watch at a safe distance.", why: "Social observation from a secure base builds stranger recognition and the early understanding that there are many people in the world." },
  { id: "p-16-4", category: "play", ageRangeStart: 16, ageRangeEnd: 20, title: "Animal meeting (real or video)", instruction: "If safe, let her see a calm animal, a dog at a distance, a bird, a gentle cat. Name it and describe what it does.", why: "Encountering real living things expands her world model in ways that no object or toy can replicate." },
  { id: "p-16-5", category: "play", ageRangeStart: 16, ageRangeEnd: 20, title: "Free mat time", instruction: "30 minutes of floor time on a safe mat with three toys and no screens. You can be nearby but let her lead. Observe her interests.", why: "Unstructured play with a present-but-not-directing caregiver builds independence, self-soothing, and intrinsic motivation." },

  // ── 5 months (20–24 weeks) ─────────────────────────────────────────────────
  { id: "s-20-1", category: "spark", ageRangeStart: 20, ageRangeEnd: 24, title: "First word repetition", instruction: "Choose one word she hears often, your pet's name, her name, and say it clearly, then point to what it refers to. Three times in a row.", why: "Consistent word-to-referent pairing is how first word comprehension forms, long before first word production." },
  { id: "s-20-2", category: "spark", ageRangeStart: 20, ageRangeEnd: 24, title: "Two-step instruction", instruction: "Give her a two-part verbal prompt, 'Look at the bird, can you grab the toy?', and see what she responds to first.", why: "Attending to sequences of language, understanding that one thing follows another, is an early executive function skill." },
  { id: "s-20-3", category: "spark", ageRangeStart: 20, ageRangeEnd: 24, title: "Sorting by size", instruction: "Place a big cloth and a small cloth side by side. Pick up each one and say 'big' and 'small' slowly. Let her touch both.", why: "Size concepts are foundational mathematical thinking, and it starts with hands-on comparison, not worksheets." },
  { id: "s-20-4", category: "spark", ageRangeStart: 20, ageRangeEnd: 24, title: "Action words", instruction: "Do an action, wave, clap, point, and name it as you do it: 'I'm waving!' 'I'm clapping!' Do four different actions.", why: "Action words (verbs) are harder to acquire than nouns, early exposure through live demonstration builds verb comprehension." },
  { id: "s-20-5", category: "spark", ageRangeStart: 20, ageRangeEnd: 24, title: "Social referencing practice", instruction: "When showing her something new, look at it, then look at her, then back at the object, modeling that you can check in with others.", why: "Social referencing, looking to another person's face to gauge a situation, is a key 9–12 month milestone that starts building now." },
  { id: "m-20-1", category: "move", ageRangeStart: 20, ageRangeEnd: 24, title: "Independent sitting practice", instruction: "Sit her on the floor with light support behind her, not holding. Place hands nearby but don't touch. See how long she holds herself.", why: "Brief independent sitting practice at 5 months builds the core and hip stability needed for full independent sitting at 6–7 months." },
  { id: "m-20-2", category: "move", ageRangeStart: 20, ageRangeEnd: 24, title: "Rolling, both directions", instruction: "Encourage a tummy-to-back roll with a toy. Then try motivating a back-to-tummy roll from the other direction. Give each 3 minutes.", why: "Mastering rolling in both directions gives her the ability to change her own position, a major step in physical independence." },
  { id: "m-20-3", category: "move", ageRangeStart: 20, ageRangeEnd: 24, title: "Transfer object hand to hand", instruction: "Place a small ring in her right hand. Wait. See if she transfers it to her left hand. Don't assist, just give her time.", why: "Hands-to-hands transfer at 5 months shows that the two sides of her brain are beginning to coordinate, a major developmental event." },
  { id: "m-20-4", category: "move", ageRangeStart: 20, ageRangeEnd: 24, title: "Mini push-up on mat", instruction: "During tummy time, place your hands flat below her forearms. Gently press her chest up, she may push her arms straight. Hold 10 seconds.", why: "The full-arm extension in the mini-push-up position is the precursor to the crawling movement pattern." },
  { id: "m-20-5", category: "move", ageRangeStart: 20, ageRangeEnd: 24, title: "Bouncing on your knee", instruction: "Sit her supported on one knee and bounce gently in a walking rhythm, heel and toe, for 2 minutes while holding her hands.", why: "Rhythmic weight shift mimics the alternating pattern of walking and builds the balance response that will eventually support standing." },
  { id: "p-20-1", category: "play", ageRangeStart: 20, ageRangeEnd: 24, title: "Name game", instruction: "Say her name, then wait for her to look at you. When she does, smile warmly and say 'Yes! That's you!' Repeat five times across the day.", why: "Consistent name recognition is a milestone typically achieved between 5–7 months, practice accelerates it significantly." },
  { id: "p-20-2", category: "play", ageRangeStart: 20, ageRangeEnd: 24, title: "Your genuine interest", instruction: "Tell her about something you genuinely find interesting today, a book, a news item, a memory. Your authentic enthusiasm is the point.", why: "Authentic interest is more emotionally engaging to her than performed entertainment, she reads your genuine engagement." },
  { id: "p-20-3", category: "play", ageRangeStart: 20, ageRangeEnd: 24, title: "Clapping together", instruction: "Hold her hands and clap them together three times, slowly. Then do it with your own hands, slowly. See if she watches and tries.", why: "Hand clapping is a 9-month milestone she's beginning to prepare for, imitation of repetitive hand movements starts now." },
  { id: "p-20-4", category: "play", ageRangeStart: 20, ageRangeEnd: 24, title: "Texture walk", instruction: "Carry her around and let her touch three different textures on walls, surfaces, plants, whatever is safe. Name each one.", why: "Expanding her tactile world through safe exploration teaches her the concept of exploring rather than just receiving input." },
  { id: "p-20-5", category: "play", ageRangeStart: 20, ageRangeEnd: 24, title: "Your happy moment", instruction: "Find one thing today that brings you genuine pleasure and share it with her. Show it, name it, enjoy it in front of her.", why: "Witnessing authentic positive emotion in a caregiver is one of the most powerful emotional-regulatory experiences for a baby." },

  // ── 6 months (24–28 weeks) ─────────────────────────────────────────────────
  { id: "s-24-1", category: "spark", ageRangeStart: 24, ageRangeEnd: 28, title: "Name for familiar things", instruction: "Go through your home and name five objects you pass by every day: the sofa, the door, the light. Touch each and say the word clearly.", why: "Comprehension vocabulary, words understood before they're spoken, is built through repetition of words for familiar objects." },
  { id: "s-24-2", category: "spark", ageRangeStart: 24, ageRangeEnd: 28, title: "Simple categories", instruction: "Show her three fruits and name each one: 'apple,' 'banana,' 'pear.' Then say 'These are all fruit.' One session, no need to quiz.", why: "Category membership, knowing that different things share a group name, is an early abstract concept that supports all future classification." },
  { id: "s-24-3", category: "spark", ageRangeStart: 24, ageRangeEnd: 28, title: "Cause-effect toy exploration", instruction: "Give her a toy that does something when touched, presses a button, makes a sound. Let her explore for 5 minutes without showing her how.", why: "Self-discovered cause and effect produces stronger learning than demonstrated cause and effect, let her figure it out." },
  { id: "s-24-4", category: "spark", ageRangeStart: 24, ageRangeEnd: 28, title: "Ball drop game", instruction: "Hold a ball over a bowl and drop it in. Her eyes may follow it. Do this 5 times. She may reach for the bowl after a few rounds.", why: "Tracking a falling object and predicting its destination is a genuine physics insight, one of her first." },
  { id: "s-24-5", category: "spark", ageRangeStart: 24, ageRangeEnd: 28, title: "People vs things", instruction: "Look at a book with pictures. Point to a person and say 'person.' Point to a chair and say 'chair.' Alternate 5 times.", why: "Distinguishing living from non-living is a categorical foundation of all later biology, empathy, and social understanding." },
  { id: "m-24-1", category: "move", ageRangeStart: 24, ageRangeEnd: 28, title: "Independent sitting, 30 seconds", instruction: "Sit her on the floor on a soft surface with you directly in front. No hands on her. Aim for 30 unassisted seconds.", why: "Independent sitting typically emerges between 6–8 months. Daily practice shortens the path to full independent sitting." },
  { id: "m-24-2", category: "move", ageRangeStart: 24, ageRangeEnd: 28, title: "Crawling position introduction", instruction: "With her on hands and knees, gently hold her hips for 30 seconds. Let her feel the weight on her arms and knees. Don't push her forward.", why: "Experiencing the crawling posture builds the shoulder, arm, and hip strength that crawling requires before it happens." },
  { id: "m-24-3", category: "move", ageRangeStart: 24, ageRangeEnd: 28, title: "Belly pivot practice", instruction: "On tummy time, place a toy just out of reach at her side. Watch her attempt to pivot her body to reach it.", why: "Belly pivoting, rotating in a circle while prone, builds the hip and core rotation that crawling requires." },
  { id: "m-24-4", category: "move", ageRangeStart: 24, ageRangeEnd: 28, title: "Finger food exploration", instruction: "If she's started solids, offer a soft piece she can hold. Let her explore it in her hands before it reaches her mouth.", why: "Handling food before eating it builds fine motor skills and sensory tolerance, both critical for feeding independence." },
  { id: "m-24-5", category: "move", ageRangeStart: 24, ageRangeEnd: 28, title: "Standing hold, longer", instruction: "Hold her upright with feet on your thighs for 1 full minute. Let her bear weight through her legs and sway slightly.", why: "Sustained weight-bearing through the legs accelerates bone density and leg muscle development that supports walking." },
  { id: "p-24-1", category: "play", ageRangeStart: 24, ageRangeEnd: 28, title: "Back-and-forth roll a ball", instruction: "Sit facing her and slowly roll a soft ball toward her. Wait. She may bat it back. If not, guide her hands and try again.", why: "Turn-taking with a physical object is one of the earliest games, it teaches reciprocity, patience, and shared attention." },
  { id: "p-24-2", category: "play", ageRangeStart: 24, ageRangeEnd: 28, title: "Name emotions in books", instruction: "Page through a picture book and name the emotions on each face: 'That character looks sad. That one looks surprised.'", why: "Emotion labeling in a safe, fictional context builds the emotional vocabulary she'll begin using herself in the coming months." },
  { id: "p-24-3", category: "play", ageRangeStart: 24, ageRangeEnd: 28, title: "Hello and goodbye ritual", instruction: "When someone leaves or arrives, do the same greeting every time, a wave, a word, a gesture. Keep it simple and consistent.", why: "Greeting rituals build social script understanding, the pattern of how people acknowledge each other." },
  { id: "p-24-4", category: "play", ageRangeStart: 24, ageRangeEnd: 28, title: "Favorite toy conversation", instruction: "Hold her favorite toy and talk about it together: 'This is your bear. His name is Bear. He's soft. He's yours.'", why: "Narrating a beloved object helps her form the concept of ownership, identity, and relational objects, the start of comfort-object attachment." },
  { id: "p-24-5", category: "play", ageRangeStart: 24, ageRangeEnd: 28, title: "Outdoor sitting", instruction: "Sit outside together on a blanket for 10 minutes. Let her feel the air, hear different sounds, watch movement. You don't need to do anything.", why: "Natural environments provide sensory complexity, varied sounds, light, temperature, movement, that no indoor setting replicates." },

  // ── 7–8 months (28–36 weeks) ───────────────────────────────────────────────
  { id: "s-28-1", category: "spark", ageRangeStart: 28, ageRangeEnd: 36, title: "Simple instruction response", instruction: "Give her one simple instruction, 'Give it to me' or 'Put it down', and wait. Don't gesture, just use words. Give 10 seconds.", why: "Receptive language, understanding instructions before being able to follow them, typically emerges at 7–9 months with consistent practice." },
  { id: "s-28-2", category: "spark", ageRangeStart: 28, ageRangeEnd: 36, title: "Object permanence full version", instruction: "Show her a toy, then hide it under a cloth in front of her. See if she lifts the cloth to find it. This is a huge milestone.", why: "Active searching for a hidden object is the clearest evidence of object permanence, she knows it exists even when she can't see it." },
  { id: "s-28-3", category: "spark", ageRangeStart: 28, ageRangeEnd: 36, title: "Container play", instruction: "Give her a container and some safe objects to put in and take out. Sit back and let her figure it out. Don't demonstrate first.", why: "In-and-out play builds spatial reasoning, fine motor precision, and understanding of inside/outside as a concept." },
  { id: "s-28-4", category: "spark", ageRangeStart: 28, ageRangeEnd: 36, title: "Point and name practice", instruction: "Point to something and name it clearly. Pause 5 seconds. Repeat. Alternate between familiar and less familiar things.", why: "Joint attention to a point is a milestone that typically emerges at 9–12 months, you're building the foundation now." },
  { id: "s-28-5", category: "spark", ageRangeStart: 28, ageRangeEnd: 36, title: "Gesture imitation", instruction: "Wave, clap, or raise your arms and see if she imitates. If not, guide her hands through the motion once, then try again.", why: "Gesture imitation is the bridge between motor learning and communication, many early words start as gestures." },
  { id: "m-28-1", category: "move", ageRangeStart: 28, ageRangeEnd: 36, title: "Crawling motivation course", instruction: "Place her favorite toy just out of reach. Move it a little further each time she gets close. Give her 5 minutes of chasing.", why: "Motivation-driven crawling practice builds strength and coordination faster than any passive positioning exercise." },
  { id: "m-28-2", category: "move", ageRangeStart: 28, ageRangeEnd: 36, title: "Pulling to stand attempt", instruction: "Position her next to a low, stable surface. Let her reach up and grip the edge. Give minimal support from behind, let her try.", why: "Pulling to stand is a 9–12 month milestone that often begins with attempts at 7–8 months when given the opportunity." },
  { id: "m-28-3", category: "move", ageRangeStart: 28, ageRangeEnd: 36, title: "Pincer grasp play", instruction: "Put small, safe cereal puffs or raisins on a tray. Watch her pick them up. Don't help, just watch the grip evolve.", why: "The pincer grasp, thumb and index finger, is a fine motor milestone that appears between 7–10 months with practice." },
  { id: "m-28-4", category: "move", ageRangeStart: 28, ageRangeEnd: 36, title: "Sitting and reaching far", instruction: "Sit her independently and place a toy at the edge of her comfortable reach. Watch how she adjusts her balance to reach farther.", why: "Reaching beyond her base of support while sitting builds the dynamic balance response that keeps her upright without thinking." },
  { id: "m-28-5", category: "move", ageRangeStart: 28, ageRangeEnd: 36, title: "Stair bottom exploration", instruction: "If you have stairs, place her at the bottom step and let her explore the edge, feeling the height difference with her hands and feet.", why: "Spatial exploration of environmental features builds depth perception and safe movement awareness." },
  { id: "p-28-1", category: "play", ageRangeStart: 28, ageRangeEnd: 36, title: "Stranger anxiety acknowledgment", instruction: "If she shows anxiety with strangers, name it warmly: 'That's a new person. It's okay to feel cautious.' Hold her close.", why: "Stranger anxiety at 7–9 months is a sign of healthy attachment, she knows who is safe and who is new. It's a milestone." },
  { id: "p-28-2", category: "play", ageRangeStart: 28, ageRangeEnd: 36, title: "Transition warning", instruction: "Before any transition, nap, bath, leaving, give a 2-minute verbal warning: 'In a little while, we're going to…'", why: "Warnings before transitions reduce emotional disruption and begin building her understanding of time as sequential." },
  { id: "p-28-3", category: "play", ageRangeStart: 28, ageRangeEnd: 36, title: "Copying your expressions", instruction: "Make a surprised face. Wait 5 seconds. Make a 'thinking' face. Watch for any imitation. Don't push it, observe what comes naturally.", why: "Facial expression imitation at 7–8 months shows sophisticated social mirroring that builds empathy." },
  { id: "p-28-4", category: "play", ageRangeStart: 28, ageRangeEnd: 36, title: "Story with her as character", instruction: "Make up a 2-minute story starring her: 'One day, [name] woke up and found a magical garden…' Use her name throughout.", why: "Being the protagonist of a story builds narrative self-concept, understanding that she is someone who things happen to and for." },
  { id: "p-28-5", category: "play", ageRangeStart: 28, ageRangeEnd: 36, title: "Cause-and-effect game", instruction: "Knock a tower of soft blocks down dramatically. Say 'Uh oh! It fell!' Build it again. Let her knock it down. Celebrate her action.", why: "Social cause-and-effect, she does something, you respond dramatically, teaches her the power of her own actions." },

  // ── 9–10 months (36–44 weeks) ──────────────────────────────────────────────
  { id: "s-36-1", category: "spark", ageRangeStart: 36, ageRangeEnd: 44, title: "Point to named objects", instruction: "Say 'Where is the cup?' and wait for her to look at or point to the cup. Do 3–5 objects she knows. Don't point yourself first.", why: "Responding to verbal object references shows comprehension vocabulary is consolidating into retrievable knowledge." },
  { id: "s-36-2", category: "spark", ageRangeStart: 36, ageRangeEnd: 44, title: "Imitate sequences", instruction: "Do two actions in sequence: bang the table, then clap. Repeat twice. See if she imitates the sequence, in order.", why: "Imitating a sequence (not just a single action) requires holding two things in working memory simultaneously, a big cognitive step." },
  { id: "s-36-3", category: "spark", ageRangeStart: 36, ageRangeEnd: 44, title: "Pretend play intro", instruction: "Pretend to drink from a toy cup. Offer it to her. See if she imitates. If not, try again tomorrow. This skill arrives gradually.", why: "Pretend play is the first evidence that she understands that one thing can represent another, a foundational symbolic thought." },
  { id: "s-36-4", category: "spark", ageRangeStart: 36, ageRangeEnd: 44, title: "Book point-and-name", instruction: "Open a picture book and ask 'Where is the dog?' or 'Show me the ball.' Wait for her to point or look. Do 5 images.", why: "Pointing to images in response to verbal cues shows that words have become reliably linked to visual representations in her memory." },
  { id: "s-36-5", category: "spark", ageRangeStart: 36, ageRangeEnd: 44, title: "Waving 'bye' with words", instruction: "When anyone leaves, say 'Bye bye!' and wave. Prompt her hand but don't force it. After a week, most babies wave spontaneously.", why: "Social gestures linked to language (bye-bye with waving) are among the first integrated gesture-word combinations." },
  { id: "m-36-1", category: "move", ageRangeStart: 36, ageRangeEnd: 44, title: "Cruising along furniture", instruction: "Stand her at the sofa edge and place a toy a few feet along the sofa. Wait and see if she edges toward it while holding on.", why: "Cruising, stepping sideways while holding furniture, is the direct precursor to independent walking and typically appears at 9–12 months." },
  { id: "m-36-2", category: "move", ageRangeStart: 36, ageRangeEnd: 44, title: "Stairs safe climbing", instruction: "Let her climb the first 2–3 stairs with you directly behind, hands hovering. Let her choose to go up at her own pace.", why: "Safe stair climbing builds leg strength, spatial judgment, and motor confidence faster than any flat-surface exercise." },
  { id: "m-36-3", category: "move", ageRangeStart: 36, ageRangeEnd: 44, title: "Stacking rings first attempt", instruction: "Offer stacking rings and just watch what she does with them for 5 minutes. Don't show her how to stack, observe her exploration.", why: "Exploring before being shown teaches the brain to problem-solve, showing too early shifts her to imitation, not discovery." },
  { id: "m-36-4", category: "move", ageRangeStart: 36, ageRangeEnd: 44, title: "First steps support", instruction: "Hold both her hands from behind and let her take steps forward at her own pace. Match her rhythm, follow her, don't lead her.", why: "Supported walking builds the alternating leg pattern, balance, and courage that independent first steps require." },
  { id: "m-36-5", category: "move", ageRangeStart: 36, ageRangeEnd: 44, title: "Ball kick practice", instruction: "Hold her standing and position a large ball in front of her foot. Let her kick it naturally, don't guide the foot.", why: "Deliberate kicking requires balance on one leg and intentional foot movement, complex motor planning that prepares for walking." },
  { id: "p-36-1", category: "play", ageRangeStart: 36, ageRangeEnd: 44, title: "Social referencing games", instruction: "React with mock surprise or delight to a toy: 'Oh wow! Look at that!' Wait to see if she looks at the toy and then back at you.", why: "Social referencing, checking your face before deciding how to respond, is a major 9-month milestone she's building right now." },
  { id: "p-36-2", category: "play", ageRangeStart: 36, ageRangeEnd: 44, title: "Phone call pretend", instruction: "Hold a play phone and pretend to talk into it. Then hand it to her. See what she does. Most 9-month-olds have seen this enough to imitate.", why: "Object-function knowledge, knowing that a phone goes to your ear, shows she's storing and retrieving complex functional memory." },
  { id: "p-36-3", category: "play", ageRangeStart: 36, ageRangeEnd: 44, title: "First discipline response", instruction: "If she reaches for something unsafe, say 'No' calmly one time, redirect to something safe, and move on. No extended lectures.", why: "One-word, calm redirection at this age works. Repeated 'no' or emotional escalation teaches her to ignore the word, not respect it." },
  { id: "p-36-4", category: "play", ageRangeStart: 36, ageRangeEnd: 44, title: "Self-feeding attempt", instruction: "Let her attempt to feed herself a piece of soft food with her hands, even if it's messy. Resist the urge to help or clean during.", why: "Self-feeding mastery requires many messy attempts. Each one teaches hand-mouth coordination, grip precision, and independence." },
  { id: "p-36-5", category: "play", ageRangeStart: 36, ageRangeEnd: 44, title: "Reading her cues", instruction: "Pay attention to one thing she communicates today, a reach, a look, a sound, and respond to it as if it were a full sentence.", why: "Responding to pre-verbal communication consistently is what teaches her that communication works, and that she has a voice." },

  // ── 10–12 months (44–52 weeks) ─────────────────────────────────────────────
  { id: "s-44-1", category: "spark", ageRangeStart: 44, ageRangeEnd: 52, title: "First words encouragement", instruction: "When she says anything that resembles a word, 'ba' for bottle, 'da' for dad, respond as if it's the real word. Reflect it back warmly.", why: "Treating approximations as real words is exactly what accelerates word production. She'll refine the pronunciation with your feedback." },
  { id: "s-44-2", category: "spark", ageRangeStart: 44, ageRangeEnd: 52, title: "Two-word exposure", instruction: "Start using two-word phrases for things she does: 'More milk.' 'Big fall!' 'Ball rolling.' Say them at the moment, consistently.", why: "Two-word phrases are the next language milestone after single words, she needs to hear the pattern before she can produce it." },
  { id: "s-44-3", category: "spark", ageRangeStart: 44, ageRangeEnd: 52, title: "Simple puzzle introduction", instruction: "Give her a chunky puzzle with one or two pieces. Show her a piece and the hole. Then let her try. Don't solve it for her.", why: "Spatial reasoning through puzzle play builds shape recognition, problem persistence, and fine motor control simultaneously." },
  { id: "s-44-4", category: "spark", ageRangeStart: 44, ageRangeEnd: 52, title: "Action + object sentences", instruction: "Narrate what she's doing with action-object sentences: 'You're holding the cup.' 'You dropped the spoon.' Be the sportscaster of her life.", why: "Action-object sentence exposure maps directly onto the grammar she'll use when she begins constructing sentences at 18–24 months." },
  { id: "s-44-5", category: "spark", ageRangeStart: 44, ageRangeEnd: 52, title: "Music and movement together", instruction: "Put on a song and move together, wave arms, bounce, sway. Follow her movements as much as you lead.", why: "Synchronizing movement to music builds auditory-motor integration, rhythm sense, and the experience of shared joyful activity." },
  { id: "m-44-1", category: "move", ageRangeStart: 44, ageRangeEnd: 52, title: "Independent first steps", instruction: "Stand 2 feet from her while she holds onto something. Hold out your hands and wait. Don't call her to you, just be a destination.", why: "The moment she lets go and takes steps toward you is one of the most significant motor milestones of the first year." },
  { id: "m-44-2", category: "move", ageRangeStart: 44, ageRangeEnd: 52, title: "Throwing practice", instruction: "Give her a soft ball and see if she throws it, even just a drop-and-release counts. Cheer any release. Try for 5 minutes.", why: "Throwing requires planning, grip release timing, and arm projection, three motor skills coordinated simultaneously." },
  { id: "m-44-3", category: "move", ageRangeStart: 44, ageRangeEnd: 52, title: "Cup drinking attempt", instruction: "Offer a small open cup with just a sip of water. Let her try. Expect spills. Repeat tomorrow. Skill builds with daily practice.", why: "Open cup drinking before sippy cups builds better oral motor control and more natural drinking posture." },
  { id: "m-44-4", category: "move", ageRangeStart: 44, ageRangeEnd: 52, title: "Climbing over soft obstacles", instruction: "Create a low obstacle with a rolled blanket or firm pillow. Let her climb over it in both directions.", why: "Obstacle navigation builds proprioception, spatial judgment, and the full-body coordination that underpins athletic development." },
  { id: "m-44-5", category: "move", ageRangeStart: 44, ageRangeEnd: 52, title: "Spoon transfer play", instruction: "Give her a spoon and a small bowl with soft pieces. Let her scoop and transfer at her own pace. Messy is success.", why: "Spoon use requires grip orientation, wrist rotation, and load awareness, all foundational for self-feeding independence." },
  { id: "p-44-1", category: "play", ageRangeStart: 44, ageRangeEnd: 52, title: "Celebrate her first birthday", instruction: "Describe to her what the day means: 'One year ago you were born. You were tiny. Now you're here, doing this, and that.'", why: "Even at one year, hearing language about time and personal history begins building narrative self-understanding." },
  { id: "p-44-2", category: "play", ageRangeStart: 44, ageRangeEnd: 52, title: "Follow her play", instruction: "For 15 minutes, follow exactly what she chooses to do, her toys, her pace, her interest. You are her assistant, not her director.", why: "Child-led play builds the deepest intrinsic motivation and autonomy, and she learns that her choices matter and are respected." },
  { id: "p-44-3", category: "play", ageRangeStart: 44, ageRangeEnd: 52, title: "Simple game with rules", instruction: "Introduce one rule to a simple game: the ball must stay in the box, or you take turns stacking. Keep it light and playful.", why: "Simple rules are her first exposure to the concept that activities have structures, foundational for all group play and schooling." },
  { id: "p-44-4", category: "play", ageRangeStart: 44, ageRangeEnd: 52, title: "Acknowledge frustration", instruction: "When she's frustrated, at a toy, a closed door, not being understood, name it: 'That's frustrating. I see it.' Then help.", why: "Having frustration acknowledged before it's fixed teaches emotional regulation, that feelings can be felt, named, and survived." },
  { id: "p-44-5", category: "play", ageRangeStart: 44, ageRangeEnd: 52, title: "Look back together", instruction: "Find one photo from her first week. Show it to her. Say: 'This is you when you were very new. Look how far you've come.'", why: "Though she can't understand the full meaning yet, the ritual of looking back is how families build shared history and identity." },
];

export function getActivitiesForAge(ageInWeeks: number): Activity[] {
  return activities.filter(
    (a) => ageInWeeks >= a.ageRangeStart && ageInWeeks < a.ageRangeEnd
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
    if (pool.length === 0) {
      const all = getActivitiesByCategory(ageInWeeks, cat);
      if (all.length > 0) {
        const idx = (seed + all.length) % all.length;
        selected.push(all[idx]);
      }
    } else {
      const idx = (seed + pool.length) % pool.length;
      selected.push(pool[idx]);
    }
  }

  return selected;
}

export const reassuranceLines: Record<string, string[]> = {
  "0-2": [
    "Every time you respond to her cry, you're literally building her brain. You're doing the most important work there is.",
    "The fourth trimester is the hardest stretch of new parenthood, you don't have to enjoy every moment to be doing a great job.",
    "She can't smile yet, but she already knows your voice. She's been listening to you for months.",
    "If everything feels harder than you expected, that's because it is harder than anyone told you. That's not failure, that's honesty.",
    "You've already kept a tiny person alive through every single night this week. That counts enormously.",
    "Newborns sleep 14–17 hours a day but not in long stretches. This is normal, not a sign anything is wrong.",
    "You are not supposed to feel confident yet. Confidence comes from doing this again and again. You're in the doing phase.",
    "Holding her all day is not spoiling her. It's responding to a biological need she genuinely has.",
    "You don't need a plan for today. Feeding, holding, and resting is a complete and valid plan.",
    "Every baby cries this much. Every parent feels this stretched. You are deeply, completely normal.",
  ],
  "2-4": [
    "If she cries more in the evenings, this is peak fussy time for almost all babies. It tends to ease significantly by 8 weeks.",
    "You're 2–4 weeks in. The survival mode you're in right now is the hardest phase. Most parents agree, it gets genuinely easier.",
    "She may not smile yet, but she is learning your face with extraordinary intensity. She knows exactly who you are.",
    "Sleep deprivation at this level affects judgment and mood significantly. What you're feeling is a physiological response to hard conditions.",
    "A 3-week-old's only job is to eat, sleep, and grow. Your only job is to help with that. There's nothing else on the list.",
    "She doesn't need enrichment activities right now. She needs you, warmth, milk, and repetition of your presence.",
    "If you're touched out, overwhelmed, or quietly dreaming of a full night's sleep, you are exactly like every other parent in this moment.",
    "There is no parent who has this figured out at 3 weeks. You're exactly where you're supposed to be.",
    "The crying peaks at 6–8 weeks for most babies and then decreases. If you're in the peak right now, the easing is coming.",
    "You're allowed to put her down safely for 5 minutes and walk away to breathe. That's not abandonment. That's regulation.",
  ],
  "4-8": [
    "It's completely normal if your baby cries more in the evenings right now, this peaks around 6–8 weeks and is already starting to ease.",
    "She is building her visual system at an extraordinary pace this month. Every face she looks at, especially yours, is a gift to her developing brain.",
    "The social smile is one of the most rewarding moments of the first year. If it hasn't appeared yet, it's coming. It always comes.",
    "Sleep is still fragmented at this age for most babies. There is nothing wrong with her, and nothing wrong with you.",
    "If she seems fussier some days than others, this is completely normal. Her nervous system is still calibrating.",
    "You've now been doing this for over a month. Whether or not it feels like it, you know this baby better than anyone.",
    "A 6-week-old's brain is processing more information per hour than at any other point in her life. Rest days are learning days.",
    "If breastfeeding, bottle feeding, or anything else feels hard, you're not alone and it does get easier with time.",
    "Your voice is the most complex and comforting sound she knows. Talking to her, about anything, is developing her brain.",
    "You are keeping a small human alive and growing. That alone, repeated every single day, is extraordinary.",
  ],
  "8-12": [
    "Two to three months in, you know this baby. You've learned her cues, her sounds, her rhythms. That knowledge is irreplaceable.",
    "The social smile is here or very close. When it appears, it's her first clear signal back that she sees you and loves what she sees.",
    "Sleep regression can begin around this time for some babies. If nights are suddenly harder, this is a normal developmental phase.",
    "Her brain is making 700 new neural connections per second right now. Every interaction you have with her is doing its work.",
    "Growth spurts at 6, 8, and 12 weeks mean she may feed more and sleep more, or less. Both are normal.",
    "You don't have to be endlessly stimulating. Your calm, present face is already the most developmental thing in her environment.",
    "If the fourth trimester is ending and you still feel overwhelmed, this is not unusual. Every family's adjustment takes its own time.",
    "She's starting to stay awake for longer stretches. Enjoy the alert windows, they're getting more interactive every week.",
    "Whatever you're questioning about yourself as a parent right now, the fact that you're asking means you're paying attention. That's the whole job.",
    "She's been in the world 2–3 months. You've been her parent 2–3 months. You're both still brand new, and you're both doing beautifully.",
  ],
  "12-20": [
    "Three months in, most parents notice a shift, she's more interactive, less fragile-feeling, and you're a little more confident. This is real.",
    "She's getting heavier, more expressive, and more interested in the world. That change happened because of what you've been doing.",
    "Sleep at 3–5 months varies enormously between babies. If hers doesn't match a schedule you read about, that schedule wasn't written about her.",
    "Her laugh, if it's appeared, is one of the best sounds on earth. It's also proof that her emotional brain is developing exactly as it should.",
    "Rolling is coming. Some babies do it early, some at 5–6 months. The range is wide and within it, no one is behind.",
    "You're past the darkest stretch. The fog of those first 6–8 weeks, you came through it.",
    "She's watching how you handle things, frustration, joy, difficulty. You are her first and most important emotional model.",
    "If she's in a phase where everything goes in her mouth, this is entirely developmentally appropriate. Her mouth is her primary sense organ right now.",
    "You know her better today than anyone has ever known her. That's not nothing, that's everything.",
    "Four months in, you can probably predict her hunger cues, her tired signs, her boredom. That attunement took weeks to build. It's remarkable.",
  ],
  "20-28": [
    "Teething typically begins between 4–7 months. If she's drooling, gnawing, and fussier than usual, that's probably what's happening.",
    "She's starting to understand her own name. Every time you use it with warmth, you're solidifying her sense of self.",
    "Solid food introduction, if you're there, is supposed to be messy and slow. She's not eating for nutrition yet. She's learning.",
    "Separation anxiety may begin appearing. This is healthy, it means she knows exactly who you are and that you matter enormously to her.",
    "Five months of doing this. You have built a relationship, a routine, and a child who knows she is safe. That's five months of extraordinary work.",
    "She is on the verge of sitting, rolling freely, and reaching for everything. The next few months are full of big physical moments.",
    "If she wakes more at night right now, developmental leaps can cause temporary sleep disruption. It tends to settle.",
    "Whatever comparison you made today, about milestones, weight, development, put it down. Her timeline is hers alone.",
    "You might be her favorite person on earth right now. The way she looks at you is evidence of that.",
    "Six months marks the halfway point of her first year. You've brought her here. Everything ahead builds on what you've already given her.",
  ],
  "28-44": [
    "Stranger anxiety, if she's showing it, is a sign of healthy, secure attachment. She knows who is safe. That's your doing.",
    "Crawling comes in many forms: traditional, bottom-shuffling, commando-crawl, skipping it entirely. All are normal paths to walking.",
    "She's starting to understand the permanence of objects and people. This is why peek-a-boo suddenly becomes genuinely thrilling.",
    "Separation anxiety can peak at 8–10 months. Short, predictable separations handled warmly are the best way through it.",
    "Every parent has days where they feel like they're getting it wrong. Those days are part of parenting, not evidence against you.",
    "She may be cruising along furniture now. First steps are close. This phase, watching her discover her own legs, is one of the best.",
    "Sleep regressions at 8–10 months are nearly universal. If nights have gotten harder, this is developmental, not permanent.",
    "She's beginning to understand 'no', not always responding to it, but processing it. Calm consistency is the entire strategy at this age.",
    "The babbling is becoming more complex. 'Mama' and 'dada' may sound more intentional now. The first real words are forming.",
    "Nine months of parenting. You've survived every hard night, every hard day, every moment you weren't sure. You're still here.",
  ],
  "44-52": [
    "First words are forming. Every word you've said to her in the last 10 months contributed to this. The science is clear on this.",
    "First birthday is approaching. The baby you're caring for now is barely recognizable compared to the one who came home from the hospital.",
    "She may be taking her first independent steps. These moments happen without warning. Try to put your phone down at the times you're with her.",
    "Toddlerhood is right around the corner, and with it, a whole new phase of development and connection. The foundation you've built is solid.",
    "If things are hard right now, and they often are at this transition point, you've handled every hard phase before this. You'll handle this one too.",
    "One year of parenting. That's 365 days of showing up, of learning her, of keeping her safe. That's not small. That's everything.",
    "She knows your voice, your face, your smell, your rhythms. You are her secure base. The whole first year built that.",
    "Whatever you wish you'd done differently this year, she doesn't hold that account. She knows only what you gave, and you gave everything you had.",
    "The research is consistent: babies who are responded to become children who are more resilient. You've been responding. It matters.",
    "You made it through her first year. So did she. You did this together, and you did it well.",
  ],
};

export const reassuranceLinesEl: Record<string, string[]> = {
  "0-2": [
    "Κάθε φορά που ανταποκρίνεσαι στο κλάμα του μωρού σου, χτίζεις κυριολεκτικά τον εγκέφαλό του.",
    "Το πρώτο αυτό διάστημα είναι δύσκολο για όλους τους γονείς. Δεν χρειάζεται να είναι όλα τέλεια για να κάνεις εξαιρετική δουλειά.",
    "Το μωρό σου μπορεί να μη χαμογελά ακόμη, αλλά ήδη αναγνωρίζει τη φωνή σου.",
    "Το να αισθάνεσαι κουρασμένη ή κουρασμένος τώρα είναι απολύτως φυσιολογικό.",
  ],
  "2-4": [
    "Αν το βράδυ είναι πιο δύσκολο, είναι κάτι πολύ συνηθισμένο σε αυτή τη φάση και συνήθως βελτιώνεται ως τις 8 εβδομάδες.",
    "Είσαι στις 2–4 εβδομάδες, δηλαδή στην πιο απαιτητική φάση προσαρμογής.",
    "Η έλλειψη ύπνου επηρεάζει έντονα διάθεση και αντοχές. Δεν φταις εσύ.",
    "Μπορείς να αφήσεις το μωρό με ασφάλεια για λίγα λεπτά και να πάρεις ανάσα. Αυτό είναι φροντίδα, όχι αποτυχία.",
  ],
  "4-8": [
    "Σε αυτή τη φάση το νευρικό σύστημα του μωρού ακόμη ρυθμίζεται, οπότε οι διακυμάνσεις μέσα στη μέρα είναι φυσιολογικές.",
    "Ο τρόπος που του μιλάς και το κοιτάς είναι ήδη ισχυρό αναπτυξιακό ερέθισμα.",
    "Ακόμη κι αν ο ύπνος είναι κομμένος, αυτό παραμένει φυσιολογικό σε αυτή την ηλικία.",
    "Ήδη γνωρίζεις το μωρό σου πολύ καλύτερα απ’ όσο νομίζεις.",
  ],
  "8-12": [
    "Στους 2–3 μήνες αρχίζεις να αναγνωρίζεις καλύτερα τα σημάδια και τους ρυθμούς του μωρού σου.",
    "Αν οι νύχτες δυσκολέψουν ξανά, μπορεί να είναι φυσιολογικό αναπτυξιακό πέρασμα.",
    "Δεν χρειάζεται συνεχής διέγερση. Η ήρεμη παρουσία σου αρκεί και είναι πολύτιμη.",
    "Το ότι αναρωτιέσαι αν τα κάνεις καλά σημαίνει ότι προσέχεις. Αυτό έχει μεγάλη αξία.",
  ],
  "12-20": [
    "Σε αυτό το στάδιο πολλά μωρά γίνονται πιο εκφραστικά και πιο κοινωνικά.",
    "Οι συγκρίσεις με άλλα μωρά σπάνια βοηθούν. Κάθε παιδί έχει τον δικό του ρυθμό.",
    "Η σύνδεση που έχεις χτίσει με το μωρό σου είναι ήδη πολύ δυνατή.",
    "Έχεις περάσει το πιο δύσκολο πρώτο κομμάτι και αυτό είναι σημαντικό.",
  ],
  "20-28": [
    "Γύρω στους 5–6 μήνες η ανάπτυξη γίνεται πιο έντονη και πιο δραστήρια.",
    "Αν ο ύπνος δυσκολέψει προσωρινά, συχνά σχετίζεται με άλματα ανάπτυξης και συνήθως εξομαλύνεται.",
    "Η επανάληψη στις καθημερινές ρουτίνες δίνει ασφάλεια και βοηθά πολύ το μωρό.",
    "Έχεις ήδη χτίσει μια πολύ σταθερή βάση φροντίδας και εμπιστοσύνης.",
  ],
  "28-44": [
    "Σε αυτή τη φάση η εξερεύνηση αυξάνεται πολύ και η ανάγκη για σταθερά όρια γίνεται πιο σημαντική.",
    "Το άγχος αποχωρισμού είναι συχνά φυσιολογικό και δείχνει υγιή δεσμό.",
    "Αν οι νύχτες δυσκολέψουν, είναι συχνό σε αυτό το αναπτυξιακό στάδιο.",
    "Η συνέπεια, η ηρεμία και η ζεστασιά σου είναι το καλύτερο πλαίσιο για το μωρό σου.",
  ],
  "44-52": [
    "Πλησιάζοντας στον πρώτο χρόνο, το μωρό σου έχει ήδη κάνει τεράστια βήματα ανάπτυξης.",
    "Ό,τι έχεις χτίσει μέχρι τώρα γίνεται η βάση για την επόμενη φάση.",
    "Οι πρώτες λέξεις και τα πρώτα βήματα έρχονται με τον δικό τους ρυθμό.",
    "Έχεις σταθεί δίπλα στο παιδί σου κάθε μέρα. Αυτό έχει τεράστια σημασία.",
  ],
};

export function getReassuranceLine(ageInWeeks: number, seed: number): string {
  let bracket: string;
  if (ageInWeeks < 2) bracket = "0-2";
  else if (ageInWeeks < 4) bracket = "2-4";
  else if (ageInWeeks < 8) bracket = "4-8";
  else if (ageInWeeks < 12) bracket = "8-12";
  else if (ageInWeeks < 20) bracket = "12-20";
  else if (ageInWeeks < 28) bracket = "20-28";
  else if (ageInWeeks < 44) bracket = "28-44";
  else bracket = "44-52";

  const lines = reassuranceLines[bracket];
  return lines[seed % lines.length];
}

type GreetingFn = (name: string, weeks: number, role: string) => string;
type GreekGreetingRoleMode = "feminine" | "masculine" | "neutral";
type GreekGreetingRoleMeta = { label: string; mode: GreekGreetingRoleMode };

function r(role: string): string {
  const s = (role || "").toLowerCase().trim();
  if (s === "mum" || s === "mom") return "Mom";
  if (s === "dad") return "Dad";
  if (s === "grandparent") return "Grandparent";
  return "";
}

function rEl(role: string): string {
  return getGreekGreetingRoleMeta(role).label;
}

function getGreekGreetingRoleMeta(role: string): GreekGreetingRoleMeta {
  const s = (role || "").toLowerCase().trim();
  if (s === "mum" || s === "mom") return { label: "Μαμά", mode: "feminine" };
  if (s === "dad") return { label: "Μπαμπά", mode: "masculine" };
  return { label: "", mode: "neutral" };
}

function getGreekReadyWord(role: string): string {
  const mode = getGreekGreetingRoleMeta(role).mode;
  return mode === "masculine" ? "έτοιμος" : "έτοιμη";
}

function getGreekAwakeWord(role: string): string {
  const mode = getGreekGreetingRoleMeta(role).mode;
  return mode === "masculine" ? "Ξύπνιος" : "Ξύπνια";
}

// Each message has two versions: one using the role (Mom/Dad/Grandparent),
// one neutral fallback for when no role is known. Name is used separately.
export const greetings: Record<string, GreetingFn[]> = {
  early: [
    (n, _, ro) => r(ro) ? `Good morning, ${r(ro)}. I know it's early. You got this.` : `Good morning. I know it's early. You've got this with ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `Early start, ${r(ro)}. Your three activities are ready.` : `Early start. Your three activities with ${n || "your little one"} are ready.`,
    (n, _, ro) => r(ro) ? `Morning, ${r(ro)}. Here's a calm plan for right now.` : `Morning. Here's a calm plan for ${n || "your little one"} right now.`,
    (n, _, ro) => r(ro) ? `You're up early, ${r(ro)}. Let's keep today simple.` : `You're up early. Let's keep today simple with ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `Morning check-in, ${r(ro)}. Everything is set for today.` : `Morning check-in. Everything is set for today with ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `Good morning, ${r(ro)}. Small steps today are more than enough.` : `Good morning. Small steps with ${n || "your little one"} are more than enough.`,
    (n, w) => w < 8 ? `Morning. These early weeks are intense, so today's activities are short and simple.` : `Morning. Here's what fits ${n || "your little one"} right now.`,
  ],

  morning: [
    (n, _, ro) => r(ro) ? `Good morning, ${r(ro)}. Nice to check in with you.` : `Good morning. Nice to check in. Here's what fits ${n || "your little one"} now.`,
    (n, _, ro) => r(ro) ? `Morning, ${r(ro)}. Your three activities are ready to go.` : `Morning. Your three activities with ${n || "your little one"} are ready to go.`,
    (n, _, ro) => r(ro) ? `Good morning, ${r(ro)}. Today's plan is clear and simple.` : `Good morning. Today's plan for ${n || "your little one"} is clear and simple.`,
    (n, _, ro) => r(ro) ? `Morning, ${r(ro)}. You're doing great today.` : `Morning. You're doing great today with ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `Good morning, ${r(ro)}. I picked three activities for this moment.` : `Good morning. I picked three activities for this moment with ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `Morning, ${r(ro)}. Let's make this part of the day feel lighter.` : `Morning. Let's make this part of the day feel lighter with ${n || "your little one"}.`,
    (_, w) => w < 8 ? `Morning. The early weeks are hard, so today's activities stay short and gentle.` : `Morning. Three activities built for right now.`,
  ],

  midday: [
    (n, _, ro) => r(ro) ? `Hey ${r(ro)}, quick midday check-in.` : `Hey, quick midday check-in. Here's what works for ${n || "your little one"} now.`,
    (n, _, ro) => r(ro) ? `Afternoon, ${r(ro)}. There's still time for today's plan.` : `Afternoon. There's still time for today's plan with ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `Midday, ${r(ro)}. Your three activities are here when you're ready.` : `Midday. Your three activities with ${n || "your little one"} are here when you're ready.`,
    (n, _, ro) => r(ro) ? `Hey ${r(ro)}, no rush. You're still on track.` : `Hey, no rush. You're still on track with ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `Afternoon, ${r(ro)}. Here's your simple next step.` : `Afternoon. Here's your simple next step with ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `Hey ${r(ro)}, how's your day feeling so far?` : `Hey, how's your day feeling so far with ${n || "your little one"}?`,
    (n, _, ro) => r(ro) ? `Good afternoon, ${r(ro)}. Today's activities are still waiting for you.` : `Good afternoon. Today's activities for ${n || "your little one"} are still waiting.`,
  ],

  afternoon: [
    (n, _, ro) => r(ro) ? `Good afternoon, ${r(ro)}. Your activities are ready when you are.` : `Good afternoon. Your activities with ${n || "your little one"} are ready when you are.`,
    (n, _, ro) => r(ro) ? `Hey ${r(ro)}, this is a great window for one activity.` : `Hey, this is a great window for one activity with ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `Good afternoon, ${r(ro)}. You still have time in the day.` : `Good afternoon. You still have time in the day with ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `Afternoon check-in, ${r(ro)}. Your three are right here.` : `Afternoon check-in. Your three activities for ${n || "your little one"} are right here.`,
    (n, _, ro) => r(ro) ? `Afternoon, ${r(ro)}. Here's what matters most right now.` : `Afternoon. Here's what matters most right now for ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `Good afternoon, ${r(ro)}. A gentle moment to continue your plan.` : `Good afternoon. A gentle moment to continue your plan with ${n || "your little one"}.`,
    (_, w) => w < 12 ? `Afternoon. In the early weeks, every small activity counts.` : `Afternoon. Three activities ready for the rest of today.`,
  ],

  evening: [
    (n, _, ro) => r(ro) ? `Evening, ${r(ro)}. If today got busy, I've still got you.` : `Evening. If today got busy with ${n || "your little one"}, I've still got you.`,
    (n, _, ro) => r(ro) ? `Good evening, ${r(ro)}. No pressure, your three are still here.` : `Good evening. No pressure, your three for ${n || "your little one"} are still here.`,
    (n, _, ro) => r(ro) ? `Evening, ${r(ro)}. You can still do a quick one now.` : `Evening. You can still do a quick one with ${n || "your little one"} now.`,
    (n, _, ro) => r(ro) ? `Good evening, ${r(ro)}. A calm way to close the day.` : `Good evening. A calm way to close the day with ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `Evening, ${r(ro)}. Even one small activity still matters.` : `Evening. Even one small activity with ${n || "your little one"} still matters.`,
    (n, _, ro) => r(ro) ? `Good evening, ${r(ro)}. Here's your gentle end-of-day check-in.` : `Good evening. Here's your gentle end-of-day check-in for ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `Evening, ${r(ro)}. Take a breath. You're doing enough.` : `Evening. Take a breath. You're doing enough for ${n || "your little one"}.`,
  ],

  night: [
    (n, _, ro) => r(ro) ? `Up late, ${r(ro)}? I'm here with today's activities.` : `Up late? I'm here with today's activities for ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `Still awake, ${r(ro)}? You can do a gentle one now.` : `Still awake? You can do a gentle one now with ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `It's late, ${r(ro)}. Go easy on yourself tonight.` : `It's late. Go easy on yourself tonight with ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `Late night check-in, ${r(ro)}. Your three are still here.` : `Late night check-in. Your three for ${n || "your little one"} are still here.`,
    (n, _, ro) => r(ro) ? `Night mode, ${r(ro)}. No pressure on timing.` : `Night mode. No pressure on timing with ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `You're up late, ${r(ro)}. I hope you're okay.` : `You're up late. I hope you're okay with ${n || "your little one"}.`,
    (n, _, ro) => r(ro) ? `Late night, ${r(ro)}. I'm still right here when you need me.` : `Late night. I'm still right here when you need me and ${n || "your little one"}.`,
  ],
};

export const greetingsEl: Record<string, GreetingFn[]> = {
  early: [
    (n, _, ro) => rEl(ro) ? `Καλημέρα, ${rEl(ro)}. Ξύπνησες νωρίς, τα πας καλά.` : `Καλημέρα. Ξύπνησες νωρίς, τα πας καλά με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Πρωινό ξεκίνημα, ${rEl(ro)}. Οι τρεις δραστηριότητες είναι έτοιμες.` : `Πρωινό ξεκίνημα. Οι τρεις δραστηριότητες για ${n || "το μωράκι σου"} είναι έτοιμες.`,
    (n, _, ro) => rEl(ro) ? `Καλημέρα, ${rEl(ro)}. Έχω ένα ήρεμο πλάνο για τώρα.` : `Καλημέρα. Έχω ένα ήρεμο πλάνο για σένα και ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Ξεκίνησες νωρίς, ${rEl(ro)}. Πάμε απλά σήμερα.` : `Ξεκίνησες νωρίς. Πάμε απλά σήμερα με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Πρωινό check-in, ${rEl(ro)}. Όλα είναι έτοιμα για σήμερα.` : `Πρωινό check-in. Όλα είναι έτοιμα για σήμερα με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Καλημέρα, ${rEl(ro)}. Μικρά βήματα σήμερα αρκούν.` : `Καλημέρα. Μικρά βήματα με ${n || "το μωράκι σου"} αρκούν.`,
    (n, w) => w < 8 ? `Καλημέρα. Οι πρώτες εβδομάδες είναι απαιτητικές, γι’ αυτό οι δραστηριότητες σήμερα είναι σύντομες και απλές.` : `Καλημέρα. Δες τι ταιριάζει σήμερα σε ${n || "το μωράκι σου"}.`,
  ],
  morning: [
    (n, _, ro) => rEl(ro) ? `Καλημέρα, ${rEl(ro)}. Χαίρομαι που σε βρίσκω.` : `Καλημέρα. Χαίρομαι που σε βρίσκω. Πάμε με ό,τι ταιριάζει στο ${n || "μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Καλημέρα, ${rEl(ro)}. Οι τρεις δραστηριότητες είναι έτοιμες.` : `Καλημέρα. Οι τρεις δραστηριότητες για ${n || "το μωράκι σου"} είναι έτοιμες.`,
    (n, _, ro) => rEl(ro) ? `Καλημέρα, ${rEl(ro)}. Το σημερινό πλάνο είναι ξεκάθαρο και απλό.` : `Καλημέρα. Το σημερινό πλάνο για ${n || "το μωράκι σου"} είναι ξεκάθαρο και απλό.`,
    (n, _, ro) => rEl(ro) ? `Καλημέρα, ${rEl(ro)}. Τα πας πολύ καλά σήμερα.` : `Καλημέρα. Τα πας πολύ καλά σήμερα με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Καλημέρα, ${rEl(ro)}. Διάλεξα τρεις δραστηριότητες για αυτή τη στιγμή.` : `Καλημέρα. Διάλεξα τρεις δραστηριότητες για αυτή τη στιγμή με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Καλημέρα, ${rEl(ro)}. Πάμε να κάνουμε αυτό το κομμάτι της μέρας πιο ανάλαφρο.` : `Καλημέρα. Πάμε να κάνουμε αυτό το κομμάτι της μέρας πιο ανάλαφρο με ${n || "το μωράκι σου"}.`,
    (_, w) => w < 8 ? `Καλημέρα. Οι πρώτες εβδομάδες είναι δύσκολες, οπότε οι δραστηριότητες σήμερα μένουν ήπιες και σύντομες.` : `Καλημέρα. Τρεις δραστηριότητες φτιαγμένες για το τώρα.`,
  ],
  midday: [
    (n, _, ro) => rEl(ro) ? `Καλό μεσημέρι, ${rEl(ro)}. Ένα γρήγορο check-in.` : `Καλό μεσημέρι. Ένα γρήγορο check-in. Δες τι ταιριάζει τώρα στο ${n || "μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Καλό μεσημέρι, ${rEl(ro)}. Έχεις ακόμα χρόνο για το σημερινό πλάνο.` : `Καλό μεσημέρι. Έχεις ακόμα χρόνο για το σημερινό πλάνο με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Μεσημέρι, ${rEl(ro)}. Οι τρεις δραστηριότητες είναι εδώ όταν είσαι ${getGreekReadyWord(ro)}.` : `Μεσημέρι. Οι τρεις δραστηριότητες για ${n || "το μωράκι σου"} είναι εδώ όταν θελήσεις.`,
    (n, _, ro) => rEl(ro) ? `Γεια σου, ${rEl(ro)}. Χωρίς βιασύνη, είσαι ακόμα μέσα στη μέρα.` : `Γεια σου. Χωρίς βιασύνη, είσαι ακόμα μέσα στη μέρα με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Καλό μεσημέρι, ${rEl(ro)}. Δες το επόμενο απλό βήμα.` : `Καλό μεσημέρι. Δες το επόμενο απλό βήμα με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Καλό μεσημέρι, ${rEl(ro)}. Πώς νιώθεις μέχρι τώρα;` : `Καλό μεσημέρι. Πώς νιώθεις μέχρι τώρα με ${n || "το μωράκι σου"};`,
    (n, _, ro) => rEl(ro) ? `Καλό μεσημέρι, ${rEl(ro)}. Οι δραστηριότητες σε περιμένουν ακόμη.` : `Καλό μεσημέρι. Οι δραστηριότητες για ${n || "το μωράκι σου"} σε περιμένουν ακόμη.`,
  ],
  afternoon: [
    (n, _, ro) => rEl(ro) ? `Καλό απόγευμα, ${rEl(ro)}. Οι δραστηριότητες είναι έτοιμες όποτε είσαι ${getGreekReadyWord(ro)}.` : `Καλό απόγευμα. Οι δραστηριότητες για ${n || "το μωράκι σου"} είναι έτοιμες όποτε θελήσεις.`,
    (n, _, ro) => rEl(ro) ? `Γεια σου, ${rEl(ro)}. Αυτό είναι καλό παράθυρο για μία δραστηριότητα.` : `Γεια σου. Αυτό είναι καλό παράθυρο για μία δραστηριότητα με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Καλό απόγευμα, ${rEl(ro)}. Έχεις ακόμη χρόνο μέσα στη μέρα.` : `Καλό απόγευμα. Έχεις ακόμη χρόνο μέσα στη μέρα με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Απογευματινό check-in, ${rEl(ro)}. Οι τρεις δραστηριότητες είναι εδώ.` : `Απογευματινό check-in. Οι τρεις δραστηριότητες για ${n || "το μωράκι σου"} είναι εδώ.`,
    (n, _, ro) => rEl(ro) ? `Απόγευμα, ${rEl(ro)}. Δες τι έχει μεγαλύτερη αξία τώρα.` : `Απόγευμα. Δες τι έχει μεγαλύτερη αξία τώρα για ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Καλό απόγευμα, ${rEl(ro)}. Μια ήρεμη στιγμή για να συνεχίσεις το πλάνο.` : `Καλό απόγευμα. Μια ήρεμη στιγμή για να συνεχίσεις το πλάνο με ${n || "το μωράκι σου"}.`,
    (_, w) => w < 12 ? `Απόγευμα. Στις πρώτες εβδομάδες, κάθε μικρή δραστηριότητα μετράει.` : `Απόγευμα. Τρεις δραστηριότητες έτοιμες για το υπόλοιπο της μέρας.`,
  ],
  evening: [
    (n, _, ro) => rEl(ro) ? `Καλησπέρα, ${rEl(ro)}. Αν η μέρα έτρεξε, είμαι ακόμα εδώ για σένα.` : `Καλησπέρα. Αν η μέρα έτρεξε με ${n || "το μωράκι σου"}, είμαι ακόμα εδώ για σένα.`,
    (n, _, ro) => rEl(ro) ? `Καλησπέρα, ${rEl(ro)}. Χωρίς πίεση, οι σημερινές δραστηριότητες είναι ακόμη εδώ.` : `Καλησπέρα. Χωρίς πίεση, οι σημερινές δραστηριότητες για ${n || "το μωράκι σου"} είναι ακόμη εδώ.`,
    (n, _, ro) => rEl(ro) ? `Βράδυ, ${rEl(ro)}. Προλαβαίνεις ακόμα μία μικρή δραστηριότητα.` : `Βράδυ. Προλαβαίνεις ακόμα μία μικρή δραστηριότητα με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Καλησπέρα, ${rEl(ro)}. Ένας ήρεμος τρόπος να κλείσει η μέρα.` : `Καλησπέρα. Ένας ήρεμος τρόπος να κλείσει η μέρα με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Βραδάκι, ${rEl(ro)}. Ακόμα και μία μικρή δραστηριότητα μετράει.` : `Βραδάκι. Ακόμα και μία μικρή δραστηριότητα με ${n || "το μωράκι σου"} μετράει.`,
    (n, _, ro) => rEl(ro) ? `Καλησπέρα, ${rEl(ro)}. Ένα απαλό τέλος ημέρας σε περιμένει.` : `Καλησπέρα. Ένα απαλό τέλος ημέρας σε περιμένει με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Βράδυ, ${rEl(ro)}. Πάρε μια ανάσα. Τα πας καλά.` : `Βράδυ. Πάρε μια ανάσα. Τα πας καλά με ${n || "το μωράκι σου"}.`,
  ],
  night: [
    (n, _, ro) => rEl(ro) ? `${getGreekAwakeWord(ro)} τόσο αργά, ${rEl(ro)}; Είμαι εδώ με τις σημερινές δραστηριότητες.` : `Τέτοια ώρα ακόμη ξύπνια; Είμαι εδώ με τις σημερινές δραστηριότητες για ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Ακόμα ${getGreekAwakeWord(ro).toLowerCase()}, ${rEl(ro)}; Μπορείς να κάνεις μία ήπια δραστηριότητα τώρα.` : `Ακόμα ξύπνια; Μπορείς να κάνεις μία ήπια δραστηριότητα τώρα με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Είναι αργά, ${rEl(ro)}. Να είσαι επιεικής με τον εαυτό σου απόψε.` : `Είναι αργά. Να είσαι επιεικής με τον εαυτό σου απόψε με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Νυχτερινό check-in, ${rEl(ro)}. Οι τρεις δραστηριότητες είναι ακόμη εδώ.` : `Νυχτερινό check-in. Οι τρεις δραστηριότητες για ${n || "το μωράκι σου"} είναι ακόμη εδώ.`,
    (n, _, ro) => rEl(ro) ? `Λειτουργία νύχτας, ${rEl(ro)}. Χωρίς πίεση χρόνου.` : `Λειτουργία νύχτας. Χωρίς πίεση χρόνου με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Ξενυχτάς, ${rEl(ro)}. Ελπίζω να είσαι καλά.` : `Ξενυχτάς. Ελπίζω να είσαι καλά με ${n || "το μωράκι σου"}.`,
    (n, _, ro) => rEl(ro) ? `Αργά το βράδυ, ${rEl(ro)}. Είμαι ακόμα εδώ όποτε με χρειαστείς.` : `Αργά το βράδυ. Είμαι ακόμα εδώ όποτε με χρειαστείς με ${n || "το μωράκι σου"}.`,
  ],
};

export const weeklyMessages: ((name: string, category: string, spark: number, move: number, play: number, ageInMonths: number) => string)[] = [
  // 0 — bond-heavy, all ages
  (name, _c, _s, _m, play) =>
    play >= 3
      ? `You've been really consistent with bonding this week — ${play} Bond ${play === 1 ? "activity" : "activities"} with ${name || "your baby"}. That kind of closeness is what teaches them the world is a safe place to be.`
      : play > 0
        ? `You got some good bonding time in with ${name || "your baby"} this week. Every one of those moments is building the trust between you.`
        : `Try fitting in a Bond activity with ${name || "your baby"} before the week resets. Even 5 minutes of skin-to-skin or singing together counts.`,

  // 1 — spark-heavy, cognitive angle
  (name, _c, spark, _m, _p, age) =>
    spark >= 3
      ? `${name || "Your baby"} is getting a lot of brain stimulation this week — ${spark} Think ${spark === 1 ? "activity" : "activities"} already. At ${age} months, this is exactly when that kind of engagement shapes how they process the world.`
      : spark > 0
        ? `You've kept ${name || "your baby"}'s mind active this week. Those Think activities are quietly building connections that show up months from now.`
        : `No Think activities yet this week. Even narrating what you're doing out loud while ${name || "your baby"} is nearby counts as one.`,

  // 2 — move-heavy, physical development
  (name, _c, _s, move, _p, age) =>
    move >= 3
      ? `${name || "Your baby"} has been moving a lot this week — ${move} Move ${move === 1 ? "activity" : "activities"}. At ${age} months those sessions are directly building their neck strength, coordination, and body awareness.`
      : move > 0
        ? `Good movement week with ${name || "your baby"}. Their muscles and motor control are developing every time you do one of those sessions.`
        : `Haven't logged any Move activities yet. Even a minute of tummy time or gentle leg stretches before the week resets would be great.`,

  // 3 — all three categories hit
  (name, _c, spark, move, play) =>
    spark > 0 && move > 0 && play > 0
      ? `Think, Move, Bond — you covered all three with ${name || "your baby"} this week. That's a complete week of development. Really well done.`
      : `You've touched ${[spark > 0 ? "Think" : "", move > 0 ? "Move" : "", play > 0 ? "Bond" : ""].filter(Boolean).join(" and ")} this week. Try adding one more category before the reset for a full week.`,

  // 4 — early age (0–3 months), spark
  (name, _c, spark, _m, _p, age) =>
    age <= 3
      ? spark > 0
        ? `In the first few months, every Think activity you do with ${name || "your baby"} is genuinely shaping how their brain develops. You did ${spark} this week — that's a real investment.`
        : `${name || "Your baby"} is at one of the most important stages for brain development. A Think activity this week — even just talking to them slowly — would go a long way.`
      : spark > 0
        ? `You did ${spark} Think ${spark === 1 ? "activity" : "activities"} with ${name || "your baby"} this week. Keep it up — the work you're putting in now compounds over time.`
        : `A Think activity with ${name || "your baby"} before the week resets would be a great addition. Even reading one page aloud counts.`,

  // 5 — total count, mid range
  (name, _c, spark, move, play) => {
    const total = spark + move + play;
    return total >= 5
      ? `${total} activities with ${name || "your baby"} this week. You're making this a real habit, and habits like this are what make a difference long term.`
      : total >= 2
        ? `${total} activities checked off with ${name || "your baby"} this week. You're building consistency — that's the most important thing.`
        : `${total === 1 ? "One activity" : "A few activities"} with ${name || "your baby"} so far this week. Every little bit counts — no need to overthink it.`;
  },

  // 6 — bond-heavy, attachment angle
  (name, _c, _s, _m, play, age) =>
    play >= 2
      ? `The bonding you're doing with ${name || "your baby"} this week is building something that lasts. At ${age} months, feeling safe and connected is the foundation everything else grows from.`
      : play === 1
        ? `You got a Bond activity in with ${name || "your baby"} this week. That kind of intentional closeness is never wasted.`
        : `Bonding activities are the ones that build ${name || "your baby"}'s sense of safety. Try squeezing one in before the week resets.`,

  // 7 — spark, language/communication angle
  (name, _c, spark, _m, _p, age) =>
    spark >= 2
      ? `You've done ${spark} Think activities with ${name || "your baby"} this week. All that talking, looking, and responding is quietly teaching them how communication works — way before their first word.`
      : spark === 1
        ? `One Think activity with ${name || "your baby"} this week. Those small sessions are planting seeds for language and curiosity that will show up later.`
        : age <= 6
          ? `At ${age} months, ${name || "your baby"}'s brain is absorbing everything. A Think activity this week would be perfectly timed.`
          : `Try a Think activity with ${name || "your baby"} before the week resets. Talking to them during a routine counts.`,

  // 8 — move, strength building
  (name, _c, _s, move, _p, age) =>
    move >= 2
      ? `${move} Move activities with ${name || "your baby"} this week. Every one of those sessions is building the muscle strength they'll need to sit, crawl, and eventually stand.`
      : move === 1
        ? `You got a Move activity in with ${name || "your baby"} this week. Even one tummy time session or stretch goes a long way for their physical development.`
        : `Movement is how ${name || "your baby"} builds body strength at ${age} months. A quick stretch or tummy time before the week resets would be worth it.`,

  // 9 — balanced week celebration
  (name, _c, spark, move, play) => {
    const total = spark + move + play;
    if (spark === move && move === play && spark > 0)
      return `Perfectly balanced week — ${spark} Think, ${move} Move, ${play} Bond with ${name || "your baby"}. That's the whole picture of what healthy early development looks like.`;
    return `Think: ${spark}, Move: ${move}, Bond: ${play} with ${name || "your baby"} this week. ${total >= 4 ? "A solid week." : "Good start — every category touched is a win."}`;
  },

  // 10 — high total, encouragement
  (name, _c, spark, move, play) => {
    const total = spark + move + play;
    return total >= 7
      ? `${total} activities with ${name || "your baby"} this week — that's genuinely impressive. The consistency you're building here is exactly what makes a difference.`
      : total >= 4
        ? `${total} activities in the books with ${name || "your baby"} this week. That's a strong week.`
        : `${total} activities with ${name || "your baby"} this week. You're showing up — that's what matters most.`;
  },

  // 11 — bond-led, emotional regulation angle
  (name, _c, _s, _m, play, age) =>
    play >= 3
      ? `You've been putting a lot into bonding with ${name || "your baby"} this week — ${play} Bond ${play === 1 ? "activity" : "activities"}. At ${age} months, that closeness is teaching them how to feel calm and secure, which carries into everything else.`
      : play > 0
        ? `The bonding sessions you've done with ${name || "your baby"} this week are building emotional security. That foundation shows up in how they handle everything — sleep, feeding, new environments.`
        : `Try a Bond activity with ${name || "your baby"} before this week resets. A song, a slow cuddle, eye contact — any of it counts.`,

  // 12 — spark, curiosity angle
  (name, _c, spark) =>
    spark >= 3
      ? `${name || "Your baby"} is getting a lot of stimulation for their curiosity this week — ${spark} Think ${spark === 1 ? "activity" : "activities"}. Kids who are consistently engaged like this tend to stay curious as they grow up.`
      : spark > 0
        ? `Good Think work this week with ${name || "your baby"}. You're feeding their curiosity and they're absolutely taking it in.`
        : `A Think activity before the week resets would be a nice one to add. Even a few minutes of looking at high-contrast images or listening to your voice counts.`,

  // 13 — move, motor milestones
  (name, _c, _s, move, _p, age) =>
    move >= 3
      ? `${name || "Your baby"} has had ${move} Move activities this week. At ${age} months, this level of physical engagement is building the motor pathways they'll rely on for years.`
      : move > 0
        ? `You've kept ${name || "your baby"} moving this week. Their nervous system is mapping their body a little more every time you do one of those sessions.`
        : `No Move activities this week yet. Even holding ${name || "your baby"} in different positions counts — it all builds physical awareness.`,

  // 14 — spark-heavy at older age
  (name, _c, spark, _m, _p, age) =>
    age >= 4 && spark >= 2
      ? `At ${age} months, ${name || "your baby"}'s brain is developing fast — and the ${spark} Think ${spark === 1 ? "activity" : "activities"} you've done this week are giving that development exactly what it needs.`
      : age >= 4 && spark === 1
        ? `${name || "Your baby"} is at a great age for cognitive play. You got one Think activity in — try for one more before the week resets.`
        : spark > 0
          ? `${spark} Think ${spark === 1 ? "activity" : "activities"} with ${name || "your baby"} this week. Keep going — this is the kind of thing that adds up quietly.`
          : `No Think activities yet this week with ${name || "your baby"}. Even narrating what you see out loud to them counts.`,

  // 15 — bond, relationship angle
  (name, _c, _s, _m, play) =>
    play >= 2
      ? `You've done ${play} Bond ${play === 1 ? "activity" : "activities"} with ${name || "your baby"} this week. The relationship you're building through those moments is the most important one in their life right now.`
      : play === 1
        ? `One Bond activity with ${name || "your baby"} this week. Every connection you make matters — they're paying attention to all of it.`
        : `Bonding activities are where the relationship gets built. Try squeezing one in with ${name || "your baby"} before the week resets.`,

  // 16 — total + dominant category callout
  (name, _c, spark, move, play) => {
    const total = spark + move + play;
    const best =
      spark >= move && spark >= play ? `Think (${spark})`
      : move >= spark && move >= play ? `Move (${move})`
      : `Bond (${play})`;
    return `${total} activities with ${name || "your baby"} this week, with ${best} leading the way. A great week.`;
  },

  // 17 — early months, any activity
  (name, _c, spark, move, play, age) => {
    const total = spark + move + play;
    return age <= 3
      ? `${name || "Your baby"} is only ${age} months old and you've already done ${total} ${total === 1 ? "activity" : "activities"} together this week. These early weeks matter more than most people realize — you're doing the right things.`
      : `${total} activities with ${name || "your baby"} this week. At ${age} months they're absorbing more than they can show you — keep it up.`;
  },

  // 18 — move, balance/coordination angle
  (name, _c, _s, move, _p, age) =>
    move >= 2
      ? `${move} Move activities with ${name || "your baby"} this week. All that physical engagement is teaching their body balance and coordination — things that develop best through consistent gentle practice exactly like this.`
      : move === 1
        ? `You did a Move activity with ${name || "your baby"} this week. Their sense of balance and body awareness grows a little every time.`
        : `${name || "Your baby"} would benefit from a Move activity before the week resets. Even gentle leg stretches for two minutes is enough at ${age} months.`,

  // 19 — spark, language development angle
  (name, _c, spark, _m, _p, age) =>
    spark >= 2
      ? `The Think activities you've done with ${name || "your baby"} this week are laying the groundwork for language. At ${age} months, hearing your voice and tracking your face is exactly how those pathways get built.`
      : spark === 1
        ? `One Think activity in with ${name || "your baby"} this week. Even that one session is contributing to how they'll eventually communicate.`
        : `Try a Think activity with ${name || "your baby"} before the week resets. Talking slowly, pointing at things, making eye contact — all of it counts.`,

  // 20 — bond, trust angle
  (name, _c, _s, _m, play, age) =>
    play >= 3
      ? `${play} Bond activities with ${name || "your baby"} this week. You're consistently teaching them that the world is safe and that you're someone they can count on — at ${age} months that's literally the most important thing.`
      : play > 0
        ? `Good bonding week with ${name || "your baby"}. The trust and safety you're building through those moments is a gift that keeps giving.`
        : `A Bond activity with ${name || "your baby"} before the week resets would be great. Closeness and touch are everything at this stage.`,

  // 21 — total count, any age
  (name, _c, spark, move, play) => {
    const total = spark + move + play;
    return total >= 6
      ? `${total} activities with ${name || "your baby"} this week. That's a really full week — well done.`
      : total >= 3
        ? `${total} activities with ${name || "your baby"} this week. You're building a real routine here.`
        : `${total} ${total === 1 ? "activity" : "activities"} with ${name || "your baby"} so far. Even this is worth celebrating — you showed up.`;
  },

  // 22 — spark at 5+ months, cognitive leap
  (name, _c, spark, _m, _p, age) =>
    age >= 5 && spark >= 2
      ? `At ${age} months, ${name || "your baby"}'s cognitive abilities are really starting to develop — and the ${spark} Think ${spark === 1 ? "activity" : "activities"} you've done this week are giving that growth fuel.`
      : age >= 5 && spark === 1
        ? `${name || "Your baby"} is at an age where cognitive activities make a real visible difference. You got one in this week — try to add another before the reset.`
        : spark > 0
          ? `${spark} Think ${spark === 1 ? "activity" : "activities"} with ${name || "your baby"} this week. That's a good investment.`
          : `Think activities are where the cognitive development happens. Try fitting one in with ${name || "your baby"} this week.`,

  // 23 — move, early months
  (name, _c, _s, move, _p, age) =>
    age <= 3 && move >= 2
      ? `${move} Move activities in the first few months — you're giving ${name || "your baby"}'s muscles exactly the input they need to start developing strength and control.`
      : age <= 3 && move === 1
        ? `One Move activity with ${name || "your baby"} this week. In these early months, even one tummy time session is a meaningful step.`
        : move >= 2
          ? `${move} Move activities with ${name || "your baby"} this week. All that movement is building real physical strength.`
          : `Try fitting in a Move activity with ${name || "your baby"} this week. Even a short stretch or tummy time session goes a long way.`,

  // 24 — bond, consistency angle
  (name, _c, _s, _m, play) => {
    return play >= 4
      ? `You've been really consistent with bonding this week — ${play} Bond ${play === 1 ? "activity" : "activities"} with ${name || "your baby"}. Consistency like that is what builds deep, lasting attachment.`
      : play >= 2
        ? `${play} Bond activities with ${name || "your baby"} this week. That regularity is what makes the difference — they start to feel the pattern.`
        : play === 1
          ? `One Bond activity with ${name || "your baby"} this week. It's a start — try to add one more before the week resets.`
          : `No Bond activities yet this week. Even just holding ${name || "your baby"} and making eye contact for a few minutes counts.`;
  },

  // 25 — high spark, brain structure angle
  (name, _c, spark, _m, _p, age) =>
    spark >= 3
      ? `All the Think activities you've done with ${name || "your baby"} this week — ${spark} of them — are directly supporting their brain development at ${age} months. This is a great time to be doing this.`
      : spark >= 2
        ? `${spark} Think activities with ${name || "your baby"} this week. The exposure, the conversation, the eye contact — it all adds up to something real.`
        : spark === 1
          ? `One Think activity with ${name || "your baby"} this week. Their brain is taking it in — keep going.`
          : `No Think activities yet this week. A short session with ${name || "your baby"} — even just talking through what you're doing — counts.`,

  // 26 — all three, older baby
  (name, _c, spark, move, play, age) =>
    spark > 0 && move > 0 && play > 0
      ? `Think, Move, Bond — you hit all three with ${name || "your baby"} this week at ${age} months. That's a well-rounded week of development across the board.`
      : `You've covered ${[spark > 0 ? "Think" : "", move > 0 ? "Move" : "", play > 0 ? "Bond" : ""].filter(Boolean).join(" and ")} with ${name || "your baby"} this week. One more category and you've got the full picture.`,

  // 27 — move-led, growing baby
  (name, _c, _s, move, _p, age) =>
    move >= 3
      ? `${name || "Your baby"} has had a very active week — ${move} Move ${move === 1 ? "activity" : "activities"}. At ${age} months, that kind of consistent physical engagement is building the strength and coordination they'll need for the next stage.`
      : move > 0
        ? `You've got some solid movement sessions in with ${name || "your baby"} this week. Their body is getting stronger in ways you'll start to notice soon.`
        : `Try a Move activity with ${name || "your baby"} before the week resets. It doesn't need to be long — even a gentle stretch or bounce session counts.`,

  // 28 — spark + move combination
  (name, _c, spark, move) =>
    spark >= 2 && move >= 2
      ? `Strong week on Think (${spark}) and Move (${move}) with ${name || "your baby"}. Their brain and body are both getting great input right now.`
      : spark >= 1 && move >= 1
        ? `You've got Think and Move covered with ${name || "your baby"} this week — a good combination for balanced development.`
        : `Getting both Think and Move activities in with ${name || "your baby"} this week would round things out nicely.`,

  // 29 — spark + bond combination
  (name, _c, spark, _m, play) =>
    spark >= 2 && play >= 2
      ? `Great combination this week — ${spark} Think and ${play} Bond activities with ${name || "your baby"}. Their mind is being stimulated and their emotional security is being built at the same time.`
      : spark >= 1 && play >= 1
        ? `Think and Bond both covered with ${name || "your baby"} this week. That's cognitive development and attachment both in the same week — a solid combination.`
        : `Think and Bond activities together make a really complementary pair. See if you can get both in with ${name || "your baby"} this week.`,

  // 30 — move + bond combination
  (name, _c, _s, move, play) =>
    move >= 2 && play >= 2
      ? `${move} Move and ${play} Bond activities with ${name || "your baby"} this week. Their body is developing and your connection is deepening — both at the same time.`
      : move >= 1 && play >= 1
        ? `Move and Bond both done with ${name || "your baby"} this week. Physical development and emotional closeness — great combination.`
        : `A Move and Bond activity together this week with ${name || "your baby"} would cover both the physical and emotional side of development.`,

  // 31 — total, any age, simple
  (name, _c, spark, move, play, age) => {
    const total = spark + move + play;
    return `${name || "Your baby"} is ${age} months old and you've done ${total} ${total === 1 ? "activity" : "activities"} together this week. You're on the right track.`;
  },

  // 32 — bond-heavy, closeness angle
  (name, _c, _s, _m, play) =>
    play >= 4
      ? `${play} Bond activities with ${name || "your baby"} this week. That's a lot of intentional closeness — and it shows. This is exactly how a secure, confident child is raised.`
      : play >= 2
        ? `You've been putting real effort into bonding with ${name || "your baby"} this week. That time together is building something that will show up in how they handle the world.`
        : play === 1
          ? `One Bond activity in the books with ${name || "your baby"} this week. Small and steady is perfectly fine — keep going.`
          : `A Bond activity with ${name || "your baby"} would be a nice way to close out the week. Even a quiet song or a slow cuddle counts.`,

  // 33 — spark, curiosity + learning angle
  (name, _c, spark, _m, _p, age) =>
    spark >= 3
      ? `You've done ${spark} Think activities with ${name || "your baby"} this week. At ${age} months, that kind of consistent engagement keeps their curiosity alive and their brain actively making new connections.`
      : spark >= 1
        ? `Good cognitive week with ${name || "your baby"}. The Think activities you've done are building attention, curiosity, and early communication skills one session at a time.`
        : `No Think activities this week yet. Even talking out loud to ${name || "your baby"} while doing something counts — they're listening to every word.`,

  // 34 — move, body awareness
  (name, _c, _s, move) =>
    move >= 3
      ? `${move} Move activities with ${name || "your baby"} this week. They're starting to understand their own body — what it can do, how it moves — and sessions like these are what teach them that.`
      : move >= 1
        ? `You got ${move} Move ${move === 1 ? "activity" : "activities"} in with ${name || "your baby"} this week. Their body awareness grows every time you do one of those.`
        : `A Move activity before the week resets would be great. ${name || "Your baby"} is learning what their body can do — every session helps.`,

  // 35 — high total, milestone angle
  (name, _c, spark, move, play, age) => {
    const total = spark + move + play;
    return total >= 6
      ? `${total} activities with ${name || "your baby"} this week. At ${age} months, you're giving them a really rich developmental environment. That's going to show.`
      : `${total} activities with ${name || "your baby"} this week. Each one is part of the foundation you're building for them.`;
  },

  // 36 — bond, older baby
  (name, _c, _s, _m, play, age) =>
    age >= 4 && play >= 2
      ? `${play} Bond activities with ${name || "your baby"} at ${age} months. The relationship you're building right now is what gives them the confidence to explore and grow.`
      : age >= 4 && play === 1
        ? `One Bond activity with ${name || "your baby"} this week. At ${age} months, that kind of intentional connection time really stands out to them.`
        : play > 0
          ? `Good bonding work this week with ${name || "your baby"}. They feel it — even when they can't show it yet.`
          : `Try a Bond activity with ${name || "your baby"} before this week resets. Closeness at this age builds confidence later.`,

  // 37 — spark, older baby + brain growth
  (name, _c, spark, _m, _p, age) =>
    age >= 6 && spark >= 2
      ? `At ${age} months, ${name || "your baby"}'s brain is in a rapid growth phase — and the ${spark} Think ${spark === 1 ? "activity" : "activities"} you've done this week are feeding that growth directly.`
      : age >= 6 && spark === 1
        ? `${name || "Your baby"} is at an age where Think activities have a real visible impact. You got one in — try to add another this week.`
        : spark > 0
          ? `${spark} Think ${spark === 1 ? "activity" : "activities"} with ${name || "your baby"} this week. A great habit to keep.`
          : `Think activities are where the cognitive development happens. Try one with ${name || "your baby"} before the week resets.`,

  // 38 — move, older baby + milestone
  (name, _c, _s, move, _p, age) =>
    age >= 4 && move >= 2
      ? `${move} Move activities with ${name || "your baby"} at ${age} months. Everything you're doing physically right now is preparing the muscles and coordination they'll need for crawling and sitting.`
      : age >= 4 && move === 1
        ? `One Move activity with ${name || "your baby"} this week. At ${age} months, every bit of physical engagement is building toward their next big milestone.`
        : move > 0
          ? `Good movement work this week. Keep going — it's making a real difference.`
          : `A quick Move activity with ${name || "your baby"} before the week resets would help. Even tummy time counts.`,

  // 39 — consistent across weeks (gentle reminder of progress)
  (name, _c, spark, move, play) => {
    const total = spark + move + play;
    return total >= 4
      ? `${total} activities with ${name || "your baby"} this week. Every week you come back and do this is a week of development that compounds. You're doing this right.`
      : `${total} activities with ${name || "your baby"} so far this week. Showing up week after week is what this is really about — and you're doing it.`;
  },

  // 40 — bond + spark together
  (name, _c, spark, _m, play, age) =>
    spark >= 2 && play >= 2
      ? `${spark} Think and ${play} Bond activities with ${name || "your baby"} at ${age} months. You're feeding their brain and their heart at the same time — that combination is hard to beat.`
      : spark + play >= 2
        ? `Think and Bond activities both covered with ${name || "your baby"} this week. A great pairing for this stage of development.`
        : `Getting a Think and a Bond activity in together with ${name || "your baby"} this week would be a really solid combination.`,

  // 41 — any total, gentle encouragement
  (name, _c, spark, move, play) => {
    const total = spark + move + play;
    return `${total} ${total === 1 ? "activity" : "activities"} with ${name || "your baby"} this week. Every one you log is a moment you chose to show up — and that matters.`;
  },

  // 42 — spark-led, early language angle
  (name, _c, spark, _m, _p, age) =>
    spark >= 2
      ? `${spark} Think activities with ${name || "your baby"} this week. All the talking, the responding, the face-to-face time — at ${age} months, that's how language starts to take shape.`
      : spark === 1
        ? `One Think activity with ${name || "your baby"} this week. Even one session of attentive engagement at this age is planting early language foundations.`
        : `Try fitting a Think activity in with ${name || "your baby"} this week. Even slow, clear talking during daily routines counts.`,

  // 43 — move-led, independence angle
  (name, _c, _s, move) =>
    move >= 2
      ? `${move} Move activities with ${name || "your baby"} this week. You're giving their body the practice it needs to eventually move independently — tummy time today becomes crawling later.`
      : move === 1
        ? `One Move activity with ${name || "your baby"} this week. Their body is getting stronger — every session builds on the last.`
        : `A Move activity with ${name || "your baby"} before the week resets would be a great one to add. Their muscles and coordination develop through exactly this kind of activity.`,

  // 44 — bond, simple and warm
  (name, _c, _s, _m, play) =>
    play >= 3
      ? `${play} Bond activities with ${name || "your baby"} this week. You're giving them a really solid emotional base — and that's the kind of thing that shapes who they become.`
      : play >= 1
        ? `Good bonding this week with ${name || "your baby"}. You're building the most important relationship in their life right now.`
        : `No Bond activities yet this week. Even 5 quiet minutes of closeness with ${name || "your baby"} counts — and they'll feel it.`,

  // 45 — spark, any age, simple
  (name, _c, spark) =>
    spark >= 3
      ? `${spark} Think activities with ${name || "your baby"} this week. You're keeping their mind active and engaged — that's a big deal.`
      : spark >= 1
        ? `You've kept the Think activities going with ${name || "your baby"} this week. Their brain is taking in more than you can see right now.`
        : `Try a Think activity with ${name || "your baby"} this week. Even a minute of making faces or tracking a toy slowly counts.`,

  // 46 — move, any age, simple
  (name, _c, _s, move) =>
    move >= 3
      ? `${move} Move activities with ${name || "your baby"} this week. Their muscles are building and their body is learning what it can do.`
      : move >= 1
        ? `You got some movement in with ${name || "your baby"} this week. Keep it going — it adds up.`
        : `A Move activity with ${name || "your baby"} before the week resets would round things out. Tummy time, stretches — anything counts.`,

  // 47 — total + categories, summary style
  (name, _c, spark, move, play) => {
    const total = spark + move + play;
    const parts = [`Think: ${spark}`, `Move: ${move}`, `Bond: ${play}`].join(", ");
    return `${name || "Your baby"}'s week so far — ${parts}. ${total >= 5 ? "A great week." : total >= 3 ? "Solid progress." : "Every activity counts."}`;
  },

  // 48 — bond, security + confidence angle
  (name, _c, _s, _m, play, age) =>
    play >= 2
      ? `You've done ${play} Bond activities with ${name || "your baby"} this week. At ${age} months, that feeling of security you're giving them is what allows them to eventually explore the world with confidence.`
      : play === 1
        ? `One Bond activity with ${name || "your baby"} this week. Small moments of intentional closeness add up to a secure, confident child.`
        : `Try a Bond activity with ${name || "your baby"} before the week resets. It's the simplest investment with the biggest return.`,

  // 49 — any total, week wrap
  (name, _c, spark, move, play, age) => {
    const total = spark + move + play;
    return `${total} ${total === 1 ? "activity" : "activities"} with ${name || "your baby"} this week at ${age} months. You're using this app the way it's meant to be used — keep going.`;
  },
];
