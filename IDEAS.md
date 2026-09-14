# Ideas parked, not yet built

Raised while children were actually testing DewLab. Nothing here is
started. When Erin says "let's go through all the ideas", this is the
list.

---

## 1. The activities feel repetitive — drag and puzzle instead of only tapping — TRIAL ON COMPOST 2026-09-14 (drag + catch; add slugs to TRY_NEW in play.js to spread)

**Who said it:** the client, watching a child play.

Every lesson has three generic activities (sort, order, match, pick)
and one to three hand-built ones. The generic four are all the same
gesture with different words, so three-quarters of every lesson feels
the same. The ones that held attention were the hand-built ones — the
thermometer, the twelve-weeks slider, the Texas Year calendar.

**Caution worth keeping:** dragging is *harder* than tapping for a
five-year-old — it needs sustained motor control, and a dropped drag
reads as failure. Build drag where it earns its place, keep tap
working underneath.

Forms that would break the sameness:
- Jigsaw — drag pieces to build a plant, the soil layers, a food chain
- Tap-the-picture — a labelled diagram where every part responds.
  The plant lesson already has this in Meet Sunny; nothing else does.
- Catch or feed — things fall, catch the right ones
- Trace — draw the cycle with a finger

---

## 2. Bigger pictures for the youngest children — DONE 2026-09-13 (bigger tiles for everyone)

**Who said it:** the client.

Little ones cannot read the words. They are engaging with the image
and tapping that, so the image matters more than the label — but the
tiles currently lead with text and treat the picture as decoration.

**The idea worth keeping:** we already know each child's grade, it is
on their profile. So the interface can size itself. Kindergarten gets
big pictures and almost no text; fourth grade gets what is there now.
No setting for a parent to find.

Open question: automatic by grade, or a toggle the child can press?

---

## 3. Greyed-out pills look like buttons and are not — DONE 2026-09-13

**Who said it:** Erin, watching a child.

The little pills in each stage — "45 minutes", "6 picture questions",
"Almost no reading", the session date — are labels. A child read them
as buttons and kept tapping them, and nothing happened.

They are grey and rounded, which is exactly what a disabled button
looks like. Either they should stop looking pressable, or they should
do something.

---

## 4. Collapse the stages, open them one at a time — DONE 2026-09-13

**Who said it:** a parent.

Everything is on screen at once, so a child sees the video before the
before-check is done and does not know where to start.

Instead: only the stage they are on is open. Finish the before-check
and the live session opens. Watch it and the at-home build opens. Each
one uncollapses the next.

Worth thinking about alongside this: the rail at the top already shows
the five stages and where they are — this would make the page match
what the rail is already saying.

---

## 5. Dewey gives the directions, not the robot voice — CLIPS + GAME FACES BUILT 2026-09-13 (robot voice still on until Dewey's voice is cloned)

**Who said it:** Erin.

The read-aloud voice sounds bad. Instead, a short animated Dewey clip
(made in HeyGen) for each part of a lesson, saying how to use it —
"Tap the picture you think is right," "Now watch the video," and so on.

Same words in every lesson, so each clip is made once and reused
everywhere. Kids who can't read still know what to do next.

Script (one HeyGen clip each, square or portrait framing, Dewey centered):

- dewey-0-intro — "Hi! I'm Dewey. I'll help you in every lesson. When you're not sure what to do, tap me and I'll tell you!" (first time per child only, plays right before the before-check line)
- dewey-1-before-check — "Hi, friend! Let's see what you already know. Tap the picture you think is right."
- dewey-2-video — "Now let's watch the video together. Tap the big play button."
- dewey-3-games — "Time to play! Pick a game and tap the pictures to play." (revisit once the drag/puzzle games exist)
- dewey-4-make-at-home — "Let's make something at home. Ask a grown-up to help you."
- dewey-5-after-check — "You did so much today! Let's see what you learned. Tap the picture you think is right."

Layout (mocked up 2026-09-13): Dewey waits as a round button in the
bottom-right corner with a speaker badge. Tap him and a card opens with
the clip, the words, Again and Got it. First time only: screen dims and
a "Meet Dewey!" card plays the intro.

The robot voice goes away entirely (Erin, 2026-09-13). It currently
reads every quiz question and game prompt aloud, so keep it until both
pieces exist, then swap in one go:
1. the six HeyGen clips, and
2. a cloned Dewey voice for the words that change per lesson (quiz
   questions, tile words like "Banana peel") — pre-made sound files.
Confirm rights to Dewey's voice before cloning.
