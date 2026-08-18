# One Sea — AI plate generation prompt (ai33.pro)

This replaces an earlier prompt written for a different project (VESPER, a lake
cabin) that used the `scroll-world` skill and Higgsfield video generation to
build a scroll-scrubbed video flythrough hero. **None of that applies here.**
MDIOMed's home page already has its own working scroll-scrub engine — this
prompt only covers generating the *optional AI photo layer* that engine can
cross-dissolve underneath its procedural rendering.

## What already exists (read this first)

- The whole home page is a 300-frame procedural scroll-scrub, played by a
  fixed full-viewport `<canvas>` in
  [`components/home/sequence-canvas.tsx`](../components/home/sequence-canvas.tsx),
  driven by document scroll via GSAP ScrollTrigger + Lenis
  ([`components/home/scroll-provider.tsx`](../components/home/scroll-provider.tsx)).
  Content floats over it in `<Chapter>` blocks
  ([`lib/story.ts`](../lib/story.ts),
  [`components/home-page-client.tsx`](../components/home-page-client.tsx)).
- Frames are rendered deterministically as a pure function of scroll progress
  `p` (0→1) in
  [`scripts/sequence/journey-scene.js`](../scripts/sequence/journey-scene.js),
  run headless via
  [`scripts/sequence/render-journey.js`](../scripts/sequence/render-journey.js) —
  not generated one-per-frame, because (per
  [`scripts/sequence/README.md`](../scripts/sequence/README.md))
  "text-to-image models cannot hold [pixel-level] coherence across 300 frames."
- `journey-scene.js` already supports an **optional plates layer**: still
  photos, one per story beat, cross-dissolved *underneath* the procedural
  lighting. `render-journey.js` picks them up automatically from
  `scripts/sequence/plates/` if present.
- This prompt is about regenerating/expanding that plates set — nothing else.
  Do **not** touch the canvas engine, `ScrollProvider`, `Chapter`, or any hero
  copy. Do **not** install `scroll-world`, and do **not** use `ffmpeg` — there
  is no video here.

## API — ai33.pro, not Higgsfield

Full reference: [`future-plan/api.md`](api.md). Existing minimal client:
[`scripts/sequence/ai33.js`](../scripts/sequence/ai33.js).

- **Generate**: `POST https://api.ai33.pro/v1i/task/generate-image` (multipart
  FormData): `prompt`, `model_id`, `generations_count`, `model_parameters`
  (JSON string, e.g. `{"aspect_ratio":"16:9","resolution":"2K"}`), optional
  reference `assets` files referenced in the prompt as `@img1`, `@img2`, etc.
  Auth header: `xi-api-key: $AI33_API_KEY`.
- **Poll**: `GET /v1/task/{task_id}` until `status:"done"`; the image URL is in
  `metadata`.
- **Model**: default `bytedance-seedream-4.5` (same as the existing script) —
  no need to change it.
- **Before a batch run**: check `GET /v1/health-check` (the provider's Gemini
  backend has gone down before — jobs stick in `doing` forever) and
  `GET /v1/credits`. The account caps at **10 concurrent tasks**; if jobs get
  stuck, `POST /v1/task/delete` refunds credits.
- There is **no video-generation endpoint** on this API. No clips, no
  `--start-image`/`--end-image` video chaining, no encoding, no posters. Drop
  that entire mechanic — see "Continuity" below for the still-image
  equivalent.

## The reimagined beats (replacing the cabin's 7 rooms)

The README's beat table is the source of truth for what belongs at each
scroll position. The current `PLATES` array in
[`scripts/sequence/gen-plates.js`](../scripts/sequence/gen-plates.js) only
covers 7 generic underwater beats and is missing the three initiative
"currents" and the awards beat — this fills those gaps with the site's real
brand colors from [`lib/story.ts`](../lib/story.ts): medLOVE `#e91e63`,
medNATURE `#10B981`, medCULTURE `#38bdf8`, primary blue `#193fa6`, gold accent
`#D4AF37`.

Shared style suffix (keep this on every plate, unchanged from the existing
script — it's what keeps the grade consistent and the content filter happy):

> Photoreal cinematic underwater photography, anamorphic lens, deep royal blue
> (#193fa6) colour grade, high dynamic range, fine suspended particles,
> volumetric light. No people, no divers, no text, no words, no letters, no
> logos, no watermarks, no borders.

| # | name | p≈ | prompt body |
|---|---|---|---|
| 1 | `00-dawn` | 0.00 | Looking across open Mediterranean water at first light, low golden sun on the horizon, calm glitter path across the surface, seabirds absent, wide and serene. |
| 2 | `01-surface` | 0.10 | Looking up at the underside of the Mediterranean sea surface from a few metres down, brilliant sun disc refracting through rippling water, intense god rays fanning down, bright turquoise near the surface. |
| 3 | `02-justunder` | 0.10 | Just beneath the Mediterranean surface, shafts of sunlight cutting through clear blue water, gentle swell overhead, bright and airy, shallow depth. |
| 4 | `03-descent` | 0.20 | Mid-water descent in the open Mediterranean, surface light fading far above, deepening blue, drifting motes of plankton, empty blue void. |
| 5 | `04-abyss-ruins` | 0.34 | Ancient submerged Greco-Roman marble ruins on the Mediterranean seabed, broken columns and amphorae half buried in pale sand, near-total darkness above with only a faint distant glow, mysterious deep-navy abyss, archaeological. |
| 6 | `05-medlove-current` | 0.53 | A warm current of rose-magenta light moving through the deep blue water like a ribbon, as if bioluminescent, tinted toward #e91e63, otherwise the same dark Mediterranean depth — no hearts, no icons, no text, just tinted light and water. |
| 7 | `06-mednature-current` | 0.62 | A current of emerald-green light moving through the deep blue water, tinted toward #10B981, drifting particles catching the green glow, same dark Mediterranean depth, no icons or text. |
| 8 | `07-medculture-current` | 0.71 | A current of pale sky-blue light moving through the deep water, tinted toward #38bdf8, distinct from the surrounding royal blue, same depth and particle atmosphere, no icons or text. |
| 9 | `08-awards-gold` | 0.80 | Warm golden light (#D4AF37) breaking through the deep blue water in wide shafts, as if sunlight refracted through something ceremonial above the surface, warm and celebratory but still underwater, no trophies, no text, no logos. |
| 10 | `09-ascent-breach` | 0.90–1.00 | Ascending from the deep Mediterranean toward the light, dark below and brightening blue above, rising bubble trails, growing god rays, transitioning into breaking through the sea surface into golden sunrise light, split level half underwater half above, warm gold sky meeting deep blue water, spray and bubbles. |

Notes:
- `01-surface` and `02-justunder` stay as two separate plates (same as
  today) since they sit at the same beat but read as a short pair on the way
  down.
- `04-abyss-ruins` merges the old `04-deep` and `05-ruins` plates into one,
  matching the README's single "abyss + ruins" row instead of two separate
  plates for one beat.
- `09-ascent-breach` merges the old `06-ascent` and `07-breach` similarly, for
  the same reason.
- Net result: 10 plates instead of 7, with 3 entirely new ones (the
  currents) and 1 new one (awards-gold).

## Continuity — the still-image equivalent of the "seam law"

Higgsfield's video chaining pulled the literal last frame of one clip as the
first frame of the next. ai33.pro has no video and no frame extraction, but it
does support **reference images**: pass the previous plate as an `assets` file
and reference it in the prompt as `@img1` (e.g. "@img1 shows the previous
depth and color grade — continue that palette, deepen it slightly"). Do this
for every plate after the first so the sequence drifts smoothly beat-to-beat
instead of every plate being generated independently with no relationship to
its neighbors.

This does not need to be pixel-perfect — the README's own reasoning still
holds: these stills cross-dissolve *underneath* continuous procedural motion,
they are not the motion source themselves, so beat-to-beat drift is fine as
long as the palette and mood progress logically (blue → colored currents →
gold → bright breach).

## Wiring — nothing new to build

1. `node scripts/sequence/gen-plates.js` generates the (now 10) plates into
   `scripts/sequence/plates/`.
2. `node scripts/sequence/render-journey.js` picks them up automatically and
   bakes them into the 300 procedural frames.
3. Update `frameCount`/paths in
   [`lib/sequence-manifest.ts`](../lib/sequence-manifest.ts) only if the total
   frame count or dimensions change — otherwise nothing else needs touching.

No `@layer` CSS overrides, no `overflow-x` fixes, no route rail, no separate
hero fade-in/out choreography — `ScrollProvider`, `SequenceCanvas`, and
`Chapter` already own all scroll/pin/fade behavior for the whole page.

## QA before generating for real

- `GET /v1/health-check` and `GET /v1/credits` first; don't start a 10-plate
  batch against a degraded queue.
- After generation, eyeball each plate next to its neighbors for color
  continuity (no jarring jump into or out of a current beat).
- Confirm the three current plates are visually distinct from each other and
  from the base blue grade — the point is that scrolling through medLOVE →
  medNATURE → medCULTURE should feel like three different currents, not one
  repeated with a tint applied after the fact.
- Confirm no people, divers, text, logos, or watermarks slipped through
  (Seedream's filter and the shared style suffix should catch most of this;
  budget 2–3 re-rolls per plate same as the existing script).
- Re-run `render-journey.js` and scrub the real page to confirm the plates
  read correctly under the procedural lighting at their intended scroll
  position.

## Explicitly out of scope for this document

This is a prompt only — it does not modify `gen-plates.js`'s `PLATES` array,
does not call the API, and does not spend credits. Implementing the above
(updating the array, running the batch) is a separate next step once this is
approved. The live API key currently embedded in `future-plan/api.md` is
unrelated to this change and not addressed here.
