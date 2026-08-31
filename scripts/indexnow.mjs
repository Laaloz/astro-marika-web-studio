// Lähettää sivuston URL:t IndexNow-rajapintaan (Bing, Yandex ym.) buildin jälkeen.
// Ajetaan vain Netlifyn tuotantobuildissa (CONTEXT === "production"),
// jotta paikalliset ja preview-buildit eivät pingaa hakukoneita.
// Virheet eivät kaada buildia.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const HOST = "studiomaura.fi";
const KEY = "671036fa3034fe96c06ef14a21f22992";
const DIST = new URL("../dist/", import.meta.url);

if (process.env.CONTEXT !== "production") {
  console.log("[indexnow] Ei tuotantobuildi (CONTEXT=%s), ohitetaan.", process.env.CONTEXT ?? "");
  process.exit(0);
}

async function readDistFile(name) {
  return readFile(fileURLToPath(new URL(name, DIST)), "utf8");
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

try {
  const index = await readDistFile("sitemap-index.xml");
  const sitemapFiles = extractLocs(index).map((url) => new URL(url).pathname.replace(/^\//, ""));

  const urlList = [];
  for (const file of sitemapFiles) {
    urlList.push(...extractLocs(await readDistFile(file)));
  }

  if (urlList.length === 0) {
    console.log("[indexnow] Sitemapista ei löytynyt URL:eja, ohitetaan.");
    process.exit(0);
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList,
    }),
  });

  // 200 = OK, 202 = vastaanotettu (avain validoidaan myöhemmin)
  console.log("[indexnow] Lähetetty %d URL:ia, vastaus: %d %s", urlList.length, res.status, res.statusText);
} catch (err) {
  console.warn("[indexnow] Lähetys epäonnistui (build jatkuu):", err.message);
}
