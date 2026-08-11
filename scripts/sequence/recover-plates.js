// Recovers plates from tasks that were already queued/paid for but whose
// original poll loop gave up before the job finished server-side. Polls each
// known task_id with a much longer timeout, downloads on completion, then
// submits any plate that never got queued (e.g. hit active_task_limit) once
// a slot is free.
const { createImage, pollTask, extractUrls, download } = require("./ai33");

const OUT = __dirname + "/plates";
const STYLE =
  " Photoreal cinematic underwater photography, anamorphic lens, deep royal blue (#193fa6) colour grade, " +
  "high dynamic range, fine suspended particles, volumetric light. " +
  "No people, no divers, no text, no words, no letters, no logos, no watermarks, no borders.";

const KNOWN = {
  "00-dawn": "b35ec43e-651f-4797-aca8-e7b9e8ffc5c3",
  "01-surface": "cdce8d3e-484b-4a15-ab35-42bc903c97fc",
  "02-justunder": "42361faa-ea5c-4a5a-9e50-18b2d05c6de4",
  "03-descent": "0c237698-335c-4de7-87dc-60143d2dccc0",
  "04-abyss-ruins": "abd46e20-8a2f-4cd2-981f-b356efcee39a",
  "05-medlove-current": "4cff2613-fbaf-46ce-ada4-9f34fe1e8fd8",
  "06-mednature-current": "085753f5-2e51-4e44-81df-9343a45b97f6",
  "07-medculture-current": "3fbb92d9-7f7f-4ffa-85c8-59081efc303a",
  "08-awards-gold": "11642d2e-f1d3-4b04-a4dd-9ce8b06d5043",
};

const MISSING = {
  "09-ascent-breach": "Ascending from the deep Mediterranean toward the light, dark below and brightening blue above, rising bubble trails, growing god rays, transitioning into breaking through the sea surface into golden sunrise light, split level half underwater half above, warm gold sky meeting deep blue water, spray and bubbles.",
};

const MODEL = process.env.MODEL || "gpt-image-2";

async function recoverOne(name, taskId) {
  const t0 = Date.now();
  try {
    const task = await pollTask(taskId, { timeoutMs: 3600000, intervalMs: 10000 });
    const urls = extractUrls(task);
    if (!urls[0]) { console.log(`  NOURL ${name}: ${JSON.stringify(task.metadata).slice(0, 250)}`); return null; }
    await download(urls[0], `${OUT}/${name}.jpg`);
    console.log(`  OK ${name} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    return name;
  } catch (e) {
    console.log(`  FAIL ${name}: ${e.message.slice(0, 160)}`);
    return null;
  }
}

async function submitMissing(name, body) {
  try {
    const id = await createImage({
      prompt: body + STYLE,
      model_id: MODEL,
      params: { aspect_ratio: "16:9", resolution: "2K" },
    });
    console.log(`  queued ${name} -> ${id}`);
    return recoverOne(name, id);
  } catch (e) {
    console.log(`  FAIL-QUEUE ${name}: ${e.message.slice(0, 160)}`);
    return null;
  }
}

(async () => {
  console.log(`recovering ${Object.keys(KNOWN).length} in-flight plates, then submitting ${Object.keys(MISSING).length} missing`);
  const recovered = await Promise.all(Object.entries(KNOWN).map(([name, id]) => recoverOne(name, id)));

  // Retry submitting missing plates until the concurrent-task slot frees up.
  const missingResults = [];
  for (const [name, body] of Object.entries(MISSING)) {
    let result = null;
    for (let attempt = 0; attempt < 30 && !result; attempt++) {
      result = await submitMissing(name, body);
      if (!result) await new Promise((r) => setTimeout(r, 30000));
    }
    missingResults.push(result);
  }

  const all = [...recovered, ...missingResults].filter(Boolean);
  console.log("recovered/generated:", all.length, "/", Object.keys(KNOWN).length + Object.keys(MISSING).length);
})();
