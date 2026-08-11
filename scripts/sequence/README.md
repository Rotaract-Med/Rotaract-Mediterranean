# Scroll-scrub image sequence

The **entire home page is one frame-by-frame image sequence.** A fixed,
full-viewport `<canvas>` plays 300 pre-rendered frames, and document scroll
position drives the playhead — Apple-style scrubbing, where the page *is* the
animation. Content chapters float over it.

- Player: [`components/home/sequence-canvas.tsx`](../../components/home/sequence-canvas.tsx)
- Chapters: [`components/home/chapter.tsx`](../../components/home/chapter.tsx)
- Frame count / paths: [`lib/sequence-manifest.ts`](../../lib/sequence-manifest.ts)
- Output: `public/sequence/journey/0001.jpg …`

**Nothing on the page pins.** The canvas is `position: fixed` and content
scrolls over it, so scroll length is just the document height and there is no
pin-spacing for ScrollTriggers to collide with.

## Why frames are rendered, not generated one-per-frame

Scroll-scrubbing only reads as video when consecutive frames differ by a few
pixels. Text-to-image models cannot hold that coherence across 300 frames —
reference-chaining drifts and you get a flickering slideshow.

So every visual is a pure function of journey progress `p` (0→1), rendered
deterministically in headless Chromium. Beats:

| p | beat |
|---|---|
| 0.00 | dawn above the sea, sun and glitter path |
| 0.10 | breaking the surface |
| 0.20 | blue descent, god rays, caustics |
| 0.34 | the abyss + submerged Greco-Roman columns |
| 0.53 / 0.62 / 0.71 | medLOVE / medNATURE / medCULTURE currents |
| 0.80 | the awards, in gold |
| 0.90 → 1.00 | ascent, bubbles, breach into daylight |

## Render

```bash
node scripts/sequence/render-journey.js
# FRAMES=300 W=1440 H=810 Q=66 node scripts/sequence/render-journey.js
```

Current settings: 300 frames, ~15 KB each, **4.3 MB total**. The player loads
progressively (stride 10 → 5 → 2 → 1), so scrubbing is usable after a few
hundred KB and any missing frame falls back to its nearest decoded neighbour.

**If you change `FRAMES`, update `frameCount` in `lib/sequence-manifest.ts`.**
Setting it to `0` disables the canvas; the page still renders all its content.

## (Optional) AI plates

Plates are cross-dissolved *underneath* the procedural lighting layers, one per
story beat, consumed in filename order.

```bash
node scripts/sequence/gen-plates.js       # -> scripts/sequence/plates/
node scripts/sequence/render-journey.js   # picks them up automatically
```

Needs `AI33_API_KEY` in the environment, or the local `future-plan/api.md`
(gitignored — it contains a live key; rotate it).

> **Heads up:** as of this writing the ai33 provider queue was effectively
> down — 7 plate jobs plus 4 probes all sat in `doing` and **none** returned in
> ~90 minutes (`/v1/health-check` reported `gemini: overloaded`). The account
> also caps at 10 concurrent tasks. Check health first, and clear stuck jobs
> with `POST /v1/task/delete` (it refunds credits). The shipped sequence is
> fully procedural for this reason.
