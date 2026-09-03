import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const routes = {
  "/": "index.html",
  "/home": "index.html",
  "/learn": "learn.html",
  "/mutual-funds": "mutual-funds.html",
  "/financial-freedom": "financial-freedom.html"
  ,"/money-mistakes": "money-mistakes.html"
  ,"/financial-health": "financial-health.html"
  ,"/knowledge-hub": "knowledge-hub.html"
  ,"/alice-blue-partner": "alice-blue-partner.html"
  ,"/partner-program": "alice-blue-partner.html"
  ,"/account": "account.html"
  ,"/login": "account.html"
  ,"/signup": "account.html"
};
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp"
};

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    const requested = routes[pathname] || pathname.replace(/^\/+/, "");
    const file = normalize(join(root, requested));
    if (!file.startsWith(root)) throw new Error("Invalid path");
    const info = await stat(file);
    if (!info.isFile()) throw new Error("Not a file");
    response.writeHead(200, {
      "content-type": types[extname(file)] || "application/octet-stream",
      "cache-control": "no-store"
    });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`The MoneyGoal is running at http://127.0.0.1:${port}`);
});
