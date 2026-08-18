// Minimal ai33.pro Imagen client: create task -> poll -> return image URLs.
const fs = require("fs");
const path = require("path");

// Prefer an env var; fall back to the (gitignored) local api.md so the scripts
// keep working on this machine without exporting anything.
const KEY =
  process.env.AI33_API_KEY ||
  (() => {
    const local = path.join(__dirname, "../../future-plan/api.md");
    if (!fs.existsSync(local)) return null;
    return (fs.readFileSync(local, "utf8").match(/sk_[A-Za-z0-9]+/) || [])[0];
  })();
if (!KEY) throw new Error("Set AI33_API_KEY (or keep future-plan/api.md in place)");

const BASE = "https://api.ai33.pro";

async function createImage({ prompt, model_id = "bytedance-seedream-4.5", params = {}, assets = [] }) {
  const fd = new FormData();
  fd.append("prompt", prompt);
  fd.append("model_id", model_id);
  fd.append("generations_count", "1");
  fd.append("model_parameters", JSON.stringify(params));
  for (const a of assets) {
    const buf = fs.readFileSync(a);
    fd.append("assets", new Blob([buf]), path.basename(a));
  }
  const r = await fetch(`${BASE}/v1i/task/generate-image`, { method: "POST", headers: { "xi-api-key": KEY }, body: fd });
  const j = await r.json();
  if (!j.success) throw new Error("create failed: " + JSON.stringify(j).slice(0, 400));
  return j.task_id;
}

async function pollTask(taskId, { timeoutMs = 300000, intervalMs = 4000 } = {}) {
  const start = Date.now();
  for (;;) {
    const r = await fetch(`${BASE}/v1/task/${taskId}`, { headers: { "xi-api-key": KEY } });
    if (r.status === 429) {
      const wait = Number(r.headers.get("retry-after") || 5);
      await new Promise((s) => setTimeout(s, wait * 1000));
      continue;
    }
    const j = await r.json();
    if (j.status === "done") return j;
    if (j.status === "error" || j.error_message) throw new Error("task error: " + (j.error_message || JSON.stringify(j).slice(0, 300)));
    if (Date.now() - start > timeoutMs) throw new Error("poll timeout for " + taskId);
    await new Promise((s) => setTimeout(s, intervalMs));
  }
}

function extractUrls(task) {
  const m = task.metadata || {};
  const out = [];
  const walk = (v) => {
    if (!v) return;
    if (typeof v === "string" && /^https?:\/\//.test(v) && /\.(png|jpe?g|webp)(\?|$)/i.test(v)) out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(m);
  return [...new Set(out)];
}

async function download(url, dest) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("download failed " + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return dest;
}

module.exports = { createImage, pollTask, extractUrls, download, KEY, BASE };
