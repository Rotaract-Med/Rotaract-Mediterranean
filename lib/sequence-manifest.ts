// Describes the pre-rendered scroll-scrub image sequence in public/sequence/.
// Regenerate with: node scripts/sequence/render-journey.js
// (see scripts/sequence/README.md)
//
// The whole home page scrubs this one sequence frame-by-frame as you scroll.
// Setting frameCount to 0 disables the canvas entirely and the page still
// renders all of its content — the build never depends on the binary frames.

export interface SequenceManifest {
  /** Directory under /public, e.g. "journey" -> /sequence/journey/0001.jpg */
  slug: string
  frameCount: number
  width: number
  height: number
}

export const journeySequence: SequenceManifest = {
  slug: "journey",
  frameCount: 300,
  width: 1440,
  height: 810,
}

export const journeyFrameUrl = (i: number) =>
  `/sequence/${journeySequence.slug}/${String(i).padStart(4, "0")}.jpg`
