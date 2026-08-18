# Future plan: roll Archivo + Space Mono out site-wide

**Status:** not started. Written alongside the "One Sea" home page rebuild
(see `C:\Users\karam\.claude\plans\you-are-an-expert-giggly-globe.md`) at the
user's request, to work from later — the user asked to see the home-page-only
version first, with this kept ready as the next step.

## What's already true today

`app/layout.tsx` loads two new variable Google Fonts purely so their CSS
variables exist on `<body>`:

```ts
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo" })
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" })
```

`tailwind.config.ts` exposes them as `font-display` / `font-data` utilities,
deliberately **not** named `font-sans` / `font-mono` so they don't collide
with Tailwind's default stacks or the 5 existing `font-mono` usages elsewhere
in the app. Only `components/home/*` currently uses `font-display` / `font-data`.
Inter (`app/layout.tsx`'s `inter.className` on `<body>`) and Dancing Script
(the `.font-script` utility in `app/globals.css`) are untouched and still
serve every other page.

## What site-wide would mean

1. **Promote Archivo to the base body font**, replacing Inter's `inter.className`
   on `<body>` in `app/layout.tsx` — or keep Inter for body copy and use Archivo
   only for headings site-wide (closer to the current home-page split of
   display vs. body face). Decide which before touching anything; it changes
   the metrics of every page.
2. **Audit every place that currently assumes Inter's metrics or uses
   `.font-script`:**
   - `app/team/page.tsx:46,59,75` — Dancing Script headings ("The **Team**", etc.)
   - `app/medtimes/page.tsx:90,165` — Dancing Script mastheads
   - Every other page's `<h1>`/`<h2>` currently inherits Inter by default —
     these would visually shift the moment Archivo becomes the base face.
3. **Decide Dancing Script's fate.** It's a weak display face (see the
   original home-page rebuild rationale) — worth asking whether Team and
   MEDTimes should also move to Archivo, or keep the script accent as a
   deliberate one-off flourish now that the home page no longer uses it.
4. **Introduce a proper token layer** instead of hardcoding font stacks in
   two places:
   ```css
   :root {
     --font-display: var(--font-archivo), ui-sans-serif, sans-serif;
     --font-body: var(--font-inter), ui-sans-serif, sans-serif; /* needs inter given a --variable too */
     --font-data: var(--font-space-mono), ui-monospace, monospace;
   }
   ```
   This requires re-declaring Inter with `variable: "--font-inter"` in
   `app/layout.tsx` (it currently has no CSS variable, only `.className`) —
   a one-line change, but it's the reason this wasn't done in the home-page-only
   pass: it touches the root font declaration every page depends on.
5. **Re-check every page after the swap:** `/about/*` (5 pages), `/team`,
   `/awards`, `/medtimes` + `/medtimes/[slug]`, `/medlove`, `/mednature`,
   `/medculture`. None of these were redesigned in the home-page pass, so a
   base-font change will re-flow headings, and any place a heading's line count
   was tuned to Inter's line-height may wrap differently in Archivo.
6. **Dashboard/admin surfaces** (`app/dashboard/*`) were intentionally out of
   scope for the home-page pass too — decide whether they inherit the new
   type system or deliberately stay on Inter as an "internal tool" register.

## Suggested order of operations, when this is picked up

1. Add `variable: "--font-inter"` to the existing Inter call; introduce the
   `--font-display/--font-body/--font-data` CSS variable layer.
2. Swap `app/layout.tsx`'s `<body>` class to the new `--font-body` var (no
   visible change yet if `--font-body` still points at Inter).
3. Flip `--font-body` to Archivo (or split heading vs. body as decided in
   step 1 above) and go page-by-page through the audit list, screenshotting
   before/after.
4. Decide Dancing Script last, once every page's headings have been reviewed
   under the new base face.
