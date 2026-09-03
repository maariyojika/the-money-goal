import { access, copyFile, mkdir, readFile, rm } from "node:fs/promises";

const pages = [
  "index.html",
  "learn.html",
  "mutual-funds.html",
  "financial-freedom.html",
  "money-mistakes.html",
  "financial-health.html",
  "knowledge-hub.html",
  "alice-blue-partner.html",
  "account.html"
];
const assets = ["assets/site.css", "assets/config.js", "assets/site.js", "assets/auth.js", "assets/moneygoal-logo.png"];
const requiredInteractions = {
  "index.html": ["monthly-slider", "display-monthly-amount"],
  "learn.html": ["curriculumSearch", "quizFeedback", "handleQuiz"],
  "mutual-funds.html": ["sip-range", "filterPills"],
  "financial-freedom.html": ["expense-reduction-slider", "sim-progress-bar"]
  ,"money-mistakes.html": ["mistake-checklist", "mistake-progress"]
  ,"financial-health.html": ["health-assessment", "health-score"]
  ,"knowledge-hub.html": ["knowledge-search", "knowledge-grid"]
  ,"alice-blue-partner.html": ["partner-signup", "sub-broker-disclosure"]
  ,"account.html": ["signup-form", "login-form", "forgot-password"]
};

await rm("dist", { recursive: true, force: true });
await mkdir("dist/assets", { recursive: true });

for (const file of [...pages, ...assets]) {
  await access(file);
  const source = await readFile(file, "utf8");
  if (!source.trim()) throw new Error(`${file} is empty`);
  if (file.endsWith(".html") && !source.includes("</html>")) {
    throw new Error(`${file} is not a complete HTML document`);
  }
  if (file.endsWith(".html")) {
    for (const marker of requiredInteractions[file]) {
      if (!source.includes(marker)) throw new Error(`${file} is missing ${marker}`);
    }
    const scripts = [...source.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
    for (const [, script] of scripts) new Function(script);
  }
  await copyFile(file, `dist/${file}`);
}

console.log(`Built ${pages.length} responsive pages into dist/.`);
