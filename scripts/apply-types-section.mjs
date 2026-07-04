// Ersetzt die Validway-"Who We Work With"-Sektion (4-Karten-Stapel) durch ein
// 6er-Grid der Wingman-Unternehmenstypen mit lucide-Icons. Passt zum hellen
// Creme-Design der Sektion (#F8F8F4, dunkler Text, gelber Akzent #FAE608).
import { readFile, writeFile } from "node:fs/promises"

const FILE = "/Users/agelianas/wingman-fix/public/landing/index.html"

// lucide-Icons (24x24, stroke=currentColor)
const icons = {
  lightbulb:
    '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  trending:
    '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  shield:
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  handshake:
    '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
  sprout:
    '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
  scale:
    '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
}

const svg = (p) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`

// Beschreibungen aus lib/scoring.ts (typeDescriptions)
const types = [
  ["Der Visionär", "lightbulb", "Sie denken langfristig und erkennen Möglichkeiten, bevor andere sie sehen. Ihr Blick geht über das Tagesgeschäft hinaus."],
  ["Der Growth-Leader", "trending", "Sie sind wachstumsorientiert, entscheidungsstark und marktgetrieben. Sie treiben Ihr Unternehmen aktiv nach vorne."],
  ["Der Strategische Umsetzer", "shield", "Sie verbinden Planung mit konsequenter Umsetzung. Sie sorgen dafür, dass Ideen Realität werden und Prozesse greifen."],
  ["Der Sales-Entrepreneur", "handshake", "Sie sind stark im Vertrieb und im direkten Kundenkontakt. Sie überzeugen durch Persönlichkeit und Abschlussstärke."],
  ["Der Entwickler", "sprout", "Sie sind in einer Phase des Aufbaus oder der Neuorientierung. Ihr Unternehmen hat Potenzial und braucht Klarheit und Struktur."],
  ["Der Ausgewogene Unternehmer", "scale", "Sie haben ein solides, stabiles Unternehmerprofil. Ihr Unternehmen ist ausgewogen aufgestellt und funktioniert zuverlässig."],
]

const cards = types
  .map(([name, icon, desc], i) => {
    const num = String(i + 1).padStart(2, "0")
    return `<div class="wm-type-card"><div class="wm-type-top"><span class="wm-type-num">/ ${num} /</span><span class="wm-type-icon">${svg(icons[icon])}</span></div><h3 class="wm-type-name">${name}</h3><p class="wm-type-desc">${desc}</p></div>`
  })
  .join("")

const style = `<style>
.wm-types-head{max-width:760px;margin-bottom:56px}
.wm-types-intro{color:rgba(18,18,18,.6);font-size:18px;line-height:1.5;margin:16px 0 0;max-width:640px}
.wm-types-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.wm-type-card{background:#fff;border:1px solid rgba(18,18,18,.1);border-radius:18px;padding:30px;display:flex;flex-direction:column;gap:14px;transition:transform .3s ease,border-color .3s ease,box-shadow .3s ease}
.wm-type-card:hover{transform:translateY(-6px);border-color:#fae608;box-shadow:0 18px 40px rgba(18,18,18,.08)}
.wm-type-top{display:flex;align-items:center;justify-content:space-between}
.wm-type-num{color:rgba(18,18,18,.42);font-size:13px;letter-spacing:.05em;font-weight:600}
.wm-type-icon{width:54px;height:54px;border-radius:14px;background:#fae608;color:#121212;display:flex;align-items:center;justify-content:center;flex:none;transition:transform .3s ease}
.wm-type-card:hover .wm-type-icon{transform:scale(1.06)}
.wm-type-icon svg{width:26px;height:26px}
.wm-type-name{font-family:"Inter Tight",sans-serif;font-size:21px;font-weight:600;color:#121212;margin:0;line-height:1.25}
.wm-type-desc{color:rgba(18,18,18,.62);font-size:15px;line-height:1.55;margin:0}
@media(max-width:991px){.wm-types-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:767px){.wm-types-grid{grid-template-columns:1fr}.wm-types-head{margin-bottom:36px}}
</style>`

const newSection = `<section class="section our-client">${style}<div class="container"><div class="wm-types-head"><div class="tag-wrap"><div class="tag-text">/ Unternehmenstypen /</div></div><h2 class="section-title">Welcher Unternehmertyp sind Sie?</h2><p class="wm-types-intro">Die 360°-Analyse ordnet Sie einem von sechs Profilen zu. So wissen Sie genau, wo Ihre Stärken liegen und wo der nächste Hebel sitzt.</p></div><div class="wm-types-grid">${cards}</div></div></section>`

let html = await readFile(FILE, "utf8")
const START = '<section class="section our-client">'
const s = html.indexOf(START)
if (s === -1) throw new Error("Sektion 'our-client' nicht gefunden")
const e = html.indexOf("</section>", s)
if (e === -1) throw new Error("Sektion-Ende nicht gefunden")
const before = html.slice(0, s)
const after = html.slice(e + "</section>".length)
await writeFile(FILE, before + newSection + after, "utf8")
console.log("Sektion ersetzt. Alte Länge:", e + 10 - s, "Neue Länge:", newSection.length)
