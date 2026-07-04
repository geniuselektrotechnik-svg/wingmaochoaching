// Ersetzt die Hero-Sektion durch einen eigenen, bildlosen, zentrierten Wingman-Hero
// (moderner Coaching-Look: Badge, großer Titel, zwei Pill-Buttons, Trust-Punkte).
import { readFile, writeFile } from "node:fs/promises"
const FILE = "/Users/agelianas/wingman-fix/public/landing/index.html"
let html = await readFile(FILE, "utf8")

const check = '<svg viewBox="0 0 24 24" fill="none" stroke="#fae608" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><polyline points="20 6 9 17 4 12"/></svg>'

const style = `<style>
.wm-hero{position:relative;background:#0a0a0a;color:#fff;min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:150px 24px 100px;box-sizing:border-box;overflow:hidden}
.wm-hero::before{content:"";position:absolute;top:-20%;left:50%;transform:translateX(-50%);width:900px;height:900px;background:radial-gradient(circle,rgba(250,230,8,.10),transparent 60%);pointer-events:none}
.wm-hero-inner{position:relative;z-index:1;max-width:960px}
.wm-hero-badge{display:inline-flex;align-items:center;gap:9px;padding:8px 17px;border:1px solid rgba(255,255,255,.15);border-radius:999px;font-size:13px;font-weight:600;letter-spacing:.03em;text-transform:uppercase;color:rgba(255,255,255,.82);background:rgba(255,255,255,.04);margin-bottom:34px}
.wm-hero-badge .dot{width:8px;height:8px;border-radius:50%;background:#fae608;box-shadow:0 0 12px #fae608}
.wm-hero-h1{font-family:"Inter Tight",sans-serif;font-weight:600;font-size:clamp(44px,7vw,86px);line-height:1.03;letter-spacing:-.02em;margin:0 auto;max-width:16ch}
.wm-hero-h1 span{color:#fae608}
.wm-hero-sub{color:rgba(255,255,255,.62);font-size:clamp(16px,1.35vw,20px);line-height:1.6;max-width:660px;margin:30px auto 0}
.wm-hero-cta{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-top:42px}
.wm-btn-primary{background:#fae608;color:#0a0a0a;font-weight:700;padding:16px 36px;border-radius:999px;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease;box-shadow:0 10px 34px rgba(250,230,8,.28)}
.wm-btn-primary:hover{transform:translateY(-2px);box-shadow:0 14px 44px rgba(250,230,8,.4);color:#0a0a0a}
.wm-btn-secondary{border:1px solid rgba(255,255,255,.22);color:#fff;font-weight:600;padding:16px 32px;border-radius:999px;text-decoration:none;transition:background .2s ease}
.wm-btn-secondary:hover{background:rgba(255,255,255,.08);color:#fff}
.wm-hero-trust{display:flex;gap:28px;flex-wrap:wrap;justify-content:center;margin-top:46px;color:rgba(255,255,255,.55);font-size:14px}
.wm-hero-trust span{display:inline-flex;align-items:center;gap:8px}
@media(max-width:600px){.wm-hero{padding:118px 20px 66px;min-height:auto}.wm-hero-cta{flex-direction:column;width:100%;max-width:320px;margin-left:auto;margin-right:auto}.wm-btn-primary,.wm-btn-secondary{width:100%;text-align:center;box-sizing:border-box}}
</style>`

const hero = `<section class="section home-hero wm-hero">${style}<div class="wm-hero-inner"><div class="wm-hero-badge"><span class="dot"></span>360°-Unternehmensanalyse</div><h1 class="wm-hero-h1">Wo steht Ihr Unternehmen <span>wirklich?</span></h1><p class="wm-hero-sub">Ehrliche Standortbestimmung für Unternehmer. 78 Fragen, KI-gestützte Auswertung und ein konkreter 90-Tage-Plan. In rund 15 Minuten wissen Sie, wo Sie stehen.</p><div class="wm-hero-cta"><a href="/payment" class="wm-btn-primary">Analyse starten</a><a href="#unternehmenstypen" class="wm-btn-secondary">Mehr erfahren</a></div><div class="wm-hero-trust"><span>${check} 15–20 Minuten</span><span>${check} Sofort starten</span><span>${check} Vertraulich</span></div></div></section>`

const s = html.indexOf('<section class="section home-hero">')
if (s === -1) throw new Error("Hero nicht gefunden")
const e = html.indexOf("</section>", s) + "</section>".length
html = html.slice(0, s) + hero + html.slice(e)
await writeFile(FILE, html, "utf8")
console.log("Neuer Hero eingebaut.")
