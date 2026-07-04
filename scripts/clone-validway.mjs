// Lädt die veröffentlichte Webflow-Seite validway.webflow.io komplett lokal herunter
// (HTML, CSS, JS, Bilder, Videos, Fonts) und schreibt alle URLs auf lokale /landing-Pfade um.
// Grund: strenge CSP im Projekt erlaubt nur 'self' -> alle Assets müssen selbst gehostet werden.

import { readFile, writeFile, mkdir } from "node:fs/promises"
import path from "node:path"

const ROOT = "/Users/agelianas/wingman-fix"
const OUT = path.join(ROOT, "public/landing")
const ASSETS = path.join(OUT, "assets")
const RAW = path.join(ROOT, "scripts/_validway_raw.html")
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

const SITE_ID = "6976f85a7d22cd5346b3eccb"
const SITE_BASE = `https://cdn.prod.website-files.com/${SITE_ID}/`

// Hosts, von denen wir Assets lokal spiegeln
const ASSET_HOSTS = new Set([
  "cdn.prod.website-files.com",
  "d3e54v103j8qbb.cloudfront.net",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "unpkg.com",
])
const ASSET_EXT = /\.(css|js|mjs|svg|png|jpe?g|avif|webp|gif|ico|woff2?|ttf|otf|eot|mp4|webm|m4v)(\?|$)/i

// remoteURL -> { local, file, kind }
const map = new Map()

function sanitizeBase(name) {
  return decodeURIComponent(name).replace(/[^a-zA-Z0-9._-]/g, "-")
}

// Lokaler Pfad relativ zu public/landing/assets/
function localRelFor(u) {
  const url = new URL(u)
  if (u.startsWith(SITE_BASE)) {
    const rest = u.slice(SITE_BASE.length).split("?")[0]
    const parts = rest.split("/")
    const base = sanitizeBase(parts.pop())
    return [...parts, base].join("/")
  }
  // Google Fonts CSS-Endpunkt (keine Endung) -> fester Name
  if (url.hostname === "fonts.googleapis.com") {
    return "fonts/google-fonts.css"
  }
  const host = url.hostname.replace(/[^a-z0-9.]/gi, "-")
  const p = url.pathname.replace(/^\//, "").split("?")[0]
  const parts = p.split("/")
  const base = sanitizeBase(parts.pop() || "index")
  return path.join("vendor", host, ...parts, base)
}

function shouldDownload(u) {
  let url
  try {
    url = new URL(u)
  } catch {
    return false
  }
  if (url.hostname === "fonts.googleapis.com") return true // CSS-Endpunkt
  if (!ASSET_HOSTS.has(url.hostname)) return false
  return ASSET_EXT.test(url.pathname) || ASSET_EXT.test(url.href)
}

function register(u) {
  const clean = u.trim()
  if (map.has(clean)) return map.get(clean)
  const rel = localRelFor(clean)
  const entry = {
    local: "/landing/assets/" + rel.split(path.sep).join("/"),
    file: path.join(ASSETS, rel),
    kind: /\.css($|\?)/i.test(clean) || new URL(clean).hostname === "fonts.googleapis.com"
      ? "css"
      : /\.(js|mjs)($|\?)/i.test(clean)
      ? "js"
      : "bin",
  }
  map.set(clean, entry)
  return entry
}

async function fetchBuf(u) {
  const res = await fetch(u, { headers: { "User-Agent": UA } })
  if (!res.ok) throw new Error(`${res.status} ${u}`)
  return Buffer.from(await res.arrayBuffer())
}

function extractUrlsFromCss(css, baseUrl) {
  const urls = new Set()
  const re = /url\(\s*['"]?([^'")]+)['"]?\s*\)|@import\s+['"]([^'"]+)['"]/g
  let m
  while ((m = re.exec(css))) {
    const raw = (m[1] || m[2] || "").trim()
    if (!raw || raw.startsWith("data:")) continue
    try {
      urls.add(new URL(raw, baseUrl).href)
    } catch {}
  }
  return [...urls]
}

async function main() {
  await mkdir(ASSETS, { recursive: true })
  let html = await readFile(RAW, "utf8")

  // 1) Seed-URLs aus dem HTML ziehen (Komma ausschließen: Video-URLs sind mp4,webm-Listen)
  const httpUrls = new Set()
  for (const m of html.matchAll(/https?:\/\/[^"'()\s\\,]+/g)) {
    const u = m[0].replace(/&amp;/g, "&")
    if (shouldDownload(u)) httpUrls.add(u)
  }
  // Inter Tight lokal selbst hosten (Original lädt es per WebFont-Loader, den wir entfernen)
  const GFONT =
    "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700&display=swap"
  httpUrls.add(GFONT)
  // Lenis (Smooth Scroll): src im HTML hat ein Leerzeichen (lenis@ 1.3.17) -> sauber laden
  const LENIS = "https://unpkg.com/lenis@1.3.17/dist/lenis.min.js"
  httpUrls.add(LENIS)

  // 2) Queue abarbeiten (CSS entdeckt weitere Assets)
  const queue = [...httpUrls]
  const cssTexts = new Map() // url -> text
  const jsTexts = new Map()
  const seen = new Set()

  while (queue.length) {
    const batch = queue.splice(0, 8).filter((u) => !seen.has(u))
    await Promise.all(
      batch.map(async (u) => {
        seen.add(u)
        const entry = register(u)
        try {
          const buf = await fetchBuf(u)
          if (entry.kind === "css") {
            const text = buf.toString("utf8")
            cssTexts.set(u, text)
            for (const nested of extractUrlsFromCss(text, u)) {
              if (shouldDownload(nested) && !seen.has(nested)) queue.push(nested)
            }
          } else if (entry.kind === "js") {
            jsTexts.set(u, buf.toString("utf8"))
          } else {
            await mkdir(path.dirname(entry.file), { recursive: true })
            await writeFile(entry.file, buf)
          }
          console.log("OK  ", u, "->", entry.local)
        } catch (e) {
          console.warn("FAIL", u, String(e.message || e))
        }
      })
    )
  }

  // 3) CSS umschreiben (nested url() -> lokal) und speichern
  for (const [u, text] of cssTexts) {
    let out = text
    for (const nested of extractUrlsFromCss(text, u)) {
      const e = map.get(nested)
      if (e) out = out.split(nested).join(e.local)
    }
    const entry = map.get(u)
    await mkdir(path.dirname(entry.file), { recursive: true })
    await writeFile(entry.file, out, "utf8")
  }

  // 4) JS speichern + CDN-Basis auf lokal patchen (webpack publicPath / Chunk-Loading)
  for (const [u, text] of jsTexts) {
    let out = text.split(SITE_BASE).join("/landing/assets/")
    const entry = map.get(u)
    await mkdir(path.dirname(entry.file), { recursive: true })
    await writeFile(entry.file, out, "utf8")
  }

  // 5) HTML umschreiben
  // 5a) interne Links auf Root-relativ
  html = html.split("https://validway.webflow.io").join("")
  // 5b) alle gemappten Asset-URLs -> lokal (auch &amp;-Varianten)
  for (const [u, e] of map) {
    html = html.split(u).join(e.local)
    html = html.split(u.replace(/&/g, "&amp;")).join(e.local)
  }
  // 5b1) Lenis-Script mit Leerzeichen-URL gezielt auf lokal umschreiben
  const lenis = map.get(LENIS)
  if (lenis) {
    html = html.replace(
      /https:\/\/unpkg\.com\/lenis@[^"']*?lenis\.min\.js/g,
      lenis.local
    )
  }
  // 5b2) Inter Tight lokal einbinden (ersetzt den entfernten Google-Loader)
  const gf = map.get(GFONT)
  if (gf) {
    html = html.replace(
      /<\/head>/i,
      `<link rel="stylesheet" href="${gf.local}"></head>`
    )
  }
  // 5b3) SRI-Integrity + crossorigin entfernen: Inhalte wurden umgeschrieben,
  // die Original-Hashes passen nicht mehr -> Browser würde CSS/JS sonst verwerfen
  html = html.replace(/\s+integrity="[^"]*"/g, "")
  html = html.replace(/\s+crossorigin(="[^"]*")?/g, "")
  // 5c) Google WebFont-Loader entfernen (Fonts kommen lokal via @font-face)
  html = html.replace(
    /<script[^>]*ajax\.googleapis\.com\/ajax\/libs\/webfont[^>]*><\/script>/gi,
    ""
  )
  html = html.replace(
    /<script[^>]*>\s*WebFont\.load\([\s\S]*?\);?\s*<\/script>/gi,
    ""
  )
  // 5d) Webflow-Badge ausblenden (lädt externes Bild, wäre durch CSP blockiert)
  html = html.replace(
    /<\/head>/i,
    '<style>.w-webflow-badge{display:none !important;}</style></head>'
  )

  await writeFile(path.join(OUT, "index.html"), html, "utf8")

  console.log("\n=== FERTIG ===")
  console.log("Assets gemappt:", map.size)
  console.log("CSS:", cssTexts.size, "JS:", jsTexts.size, "Binär:", map.size - cssTexts.size - jsTexts.size)
  console.log("HTML:", path.join(OUT, "index.html"))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
