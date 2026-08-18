const { createImage, pollTask, extractUrls, download } = require("./ai33");

const OUT = __dirname + "/plates";
const STYLE =
  " Photoreal cinematic underwater photography, anamorphic lens, deep royal blue (#193fa6) colour grade, " +
  "high dynamic range, fine suspended particles, volumetric light. " +
  "No people, no divers, no text, no words, no letters, no logos, no watermarks, no borders.";

const PLATES = [
  ["00-dawn", "Looking across open Mediterranean water at first light, low golden sun on the horizon, calm glitter path across the surface, seabirds absent, wide and serene."],
  ["01-surface", "Looking up at the underside of the Mediterranean sea surface from a few metres down, brilliant sun disc refracting through rippling water, intense god rays fanning down, bright turquoise near the surface."],
  ["02-justunder", "Just beneath the Mediterranean surface, shafts of sunlight cutting through clear blue water, gentle swell overhead, bright and airy, shallow depth."],
  ["03-descent", "Mid-water descent in the open Mediterranean, surface light fading far above, deepening blue, drifting motes of plankton, empty blue void."],
  ["04-abyss-ruins", "Ancient submerged Greco-Roman marble ruins on the Mediterranean seabed, broken columns and amphorae half buried in pale sand, near-total darkness above with only a faint distant glow, mysterious deep-navy abyss, archaeological."],
  ["05-medlove-current", "A warm current of rose-magenta light moving through the deep blue water like a ribbon, as if bioluminescent, tinted toward #e91e63, otherwise the same dark Mediterranean depth — no hearts, no icons, no text, just tinted light and water."],
  ["06-mednature-current", "A current of emerald-green light moving through the deep blue water, tinted toward #10B981, drifting particles catching the green glow, same dark Mediterranean depth, no icons or text."],
  ["07-medculture-current", "A current of pale sky-blue light moving through the deep water, tinted toward #38bdf8, distinct from the surrounding royal blue, same depth and particle atmosphere, no icons or text."],
  ["08-awards-gold", "Warm golden light (#D4AF37) breaking through the deep blue water in wide shafts, as if sunlight refracted through something ceremonial above the surface, warm and celebratory but still underwater, no trophies, no text, no logos."],
  ["09-ascent-breach", "Ascending from the deep Mediterranean toward the light, dark below and brightening blue above, rising bubble trails, growing god rays, transitioning into breaking through the sea surface into golden sunrise light, split level half underwater half above, warm gold sky meeting deep blue water, spray and bubbles."],
];

const MODEL = process.env.MODEL || "gpt-image-2";

// Plates are generated in parallel (one task per beat, all launched at once)
// so the whole batch finishes in one generation round instead of ten.
(async () => {
  console.log(`generating ${PLATES.length} plates with ${MODEL} (parallel)`);
  const results = await Promise.all(
    PLATES.map(async ([name, body]) => {
      const t0 = Date.now();
      try {
        const id = await createImage({
          prompt: body + STYLE,
          model_id: MODEL,
          params: { aspect_ratio: "16:9", resolution: "2K" },
        });
        console.log(`  queued ${name} -> ${id}`);
        const task = await pollTask(id, { timeoutMs: 1500000, intervalMs: 8000 });
        const urls = extractUrls(task);
        if (!urls[0]) { console.log(`  NOURL ${name}: ${JSON.stringify(task.metadata).slice(0, 250)}`); return null; }
        await download(urls[0], `${OUT}/${name}.jpg`);
        console.log(`  OK ${name} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
        return name;
      } catch (e) {
        console.log(`  FAIL ${name}: ${e.message.slice(0, 160)}`);
        return null;
      }
    })
  );
  console.log("plates done:", results.filter(Boolean).length, "/", PLATES.length);
})();
