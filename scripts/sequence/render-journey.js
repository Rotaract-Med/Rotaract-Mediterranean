// Renders the whole-page journey as a JPEG image sequence.
// The home page scrubs this frame-by-frame as you scroll.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const SCENE = require("./journey-scene");

const PLATE_DIR = path.join(__dirname, "plates");
const OUT_DIR = path.join(__dirname, "../../public/sequence/journey");
const FRAMES = Number(process.env.FRAMES || 300);
const W = Number(process.env.W || 1440);
const H = Number(process.env.H || 810);
const Q = Number(process.env.Q || 66);

(async () => {
  const plates = fs.existsSync(PLATE_DIR)
    ? fs.readdirSync(PLATE_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()
    : [];
  console.log(`plates: ${plates.length || "none (pure procedural)"} | ${FRAMES} frames @ ${W}x${H} q${Q}`);

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const html =
    `<!doctype html><html><head><style>html,body{margin:0;background:#08163d;overflow:hidden}canvas{display:block}</style></head>` +
    `<body><canvas id="c" width="${W}" height="${H}"></canvas><script>${SCENE}</` + `script></body></html>`;
  const htmlPath = path.join(__dirname, "_journey.html");
  fs.writeFileSync(htmlPath, html);

  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  page.on("pageerror", (e) => console.error("PAGE ERROR:", e.message));
  await page.goto("file://" + htmlPath.replace(/\\/g, "/"));

  if (plates.length) {
    const srcs = plates.map((f) => "file://" + path.join(PLATE_DIR, f).replace(/\\/g, "/"));
    await page.evaluate(
      (list) => Promise.all(list.map((s) => new Promise((res) => {
        const i = new Image();
        i.onload = () => { window.__plates.push(i); res(); };
        i.onerror = () => res();
        i.src = s;
      }))),
      srcs
    );
    console.log("plates loaded:", await page.evaluate(() => window.__plates.length));
  }

  const canvas = page.locator("#c");
  for (let f = 0; f < FRAMES; f++) {
    await page.evaluate((p) => window.__renderFrame(p), f / (FRAMES - 1));
    await canvas.screenshot({
      path: path.join(OUT_DIR, String(f + 1).padStart(4, "0") + ".jpg"),
      type: "jpeg",
      quality: Q,
    });
    if (f % 50 === 0) process.stdout.write(`  ${f + 1}/${FRAMES}\n`);
  }
  await browser.close();

  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith(".jpg"));
  const bytes = files.reduce((a, f) => a + fs.statSync(path.join(OUT_DIR, f)).size, 0);
  console.log(`DONE ${files.length} frames | ${(bytes / 1048576).toFixed(1)} MB | avg ${(bytes / files.length / 1024).toFixed(0)} KB`);
})();
