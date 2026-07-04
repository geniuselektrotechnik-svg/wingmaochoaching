// Aufräum-Pass: Play-Buttons weg, FAQ-Bild raus + zentriert, Nav zentriert,
// CTA-Video + Pfeile weg, Service-Fotos durch eigene Icon-Panels ersetzt.
import { readFile, writeFile } from "node:fs/promises"
const FILE = "/Users/agelianas/wingman-fix/public/landing/index.html"
let html = await readFile(FILE, "utf8")

const svg = (p) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`
const servIcons = [
  '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>', // Strategie
  '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>', // Finanzen
  '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', // Führung
  '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>', // Vertrieb
]

// Service-Fotos (img.expertise-image) der Reihe nach durch Icon-Panels ersetzen
let sIdx = 0
html = html.replace(/<img[^>]*class="expertise-image"[^>]*\/>/g, () => {
  const ic = servIcons[sIdx % servIcons.length]
  sIdx++
  return `<div class="wm-expertise-icon">${svg(ic)}</div>`
})

const style = `<style>
/* Play/Pause-Buttons auf allen Hintergrundvideos entfernen */
.w-backgroundvideo-backgroundvideoplaypausebtn,.client-video-play,.pause-state,.play-state{display:none!important}
/* FAQ: Bild raus, Inhalt zentriert */
.faq-image-wrap{display:none!important}
.faq-layout{display:flex!important;flex-direction:column!important;align-items:center!important;gap:44px}
.faq-text-image-wrap{width:100%;max-width:820px;align-items:center!important;text-align:center}
.faq-typography-wrap{align-items:center!important;text-align:center;margin:0 auto}
.section-title.faq{text-align:center}
.faq-layout>div:last-child{width:100%;max-width:820px;margin:0 auto}
/* Nav-Menü zentriert (Desktop) */
.nav-wrap{position:relative}
@media(min-width:992px){.nav-menu.w-nav-menu{position:absolute!important;top:50%!important;left:50%!important;transform:translate(-50%,-50%)!important;margin:0!important}}
/* CTA: Video weg, dunkler Hintergrund, Pfeil-Icons weg */
.section.cta video,.section.cta .w-background-video,.section.cta .button-arrow-box{display:none!important}
.section.cta{background-color:#0d0d0d!important}
/* Eigene Service-Icon-Panels statt Fotos */
.wm-expertise-icon{width:100%;height:100%;min-height:230px;background:#fae608;color:#121212;display:flex;align-items:center;justify-content:center;border-radius:16px}
.wm-expertise-icon svg{width:88px;height:88px}
.expertise-image-wrap{overflow:hidden;border-radius:16px}
</style>`
html = html.replace(/<\/head>/i, style + "</head>")

await writeFile(FILE, html, "utf8")
console.log("Cleanup ok. Service-Bilder ersetzt:", sIdx)
