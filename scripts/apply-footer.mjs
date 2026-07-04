// Ersetzt die alte Validway-Footer-Sektion durch einen eigenen, sauberen Wingman-Footer
// (dunkel, mit eigenen Zahlungs-Logos, Rechtslinks auf bestehende Seiten).
import { readFile, writeFile } from "node:fs/promises"
const FILE = "/Users/agelianas/wingman-fix/public/landing/index.html"

const style = `<style>
.section.footer{background-color:#0d0d0d!important;background-image:none!important;padding:84px 0 40px;color:#e8e8e8}
.wm-foot{display:flex;flex-direction:column;gap:56px}
.wm-foot-top{display:flex;gap:64px;flex-wrap:wrap;justify-content:space-between}
.wm-foot-brand{max-width:360px}
.wm-foot-brand img{height:38px;width:auto;margin-bottom:22px}
.wm-foot-tag{color:rgba(255,255,255,.6);font-size:16px;line-height:1.6;margin:0}
.wm-foot-cols{display:flex;gap:56px;flex-wrap:wrap}
.wm-foot-col h4{font-family:"Inter Tight",sans-serif;font-size:14px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.45);margin:0 0 18px}
.wm-foot-col a{display:block;color:#e8e8e8;text-decoration:none;font-size:15px;margin-bottom:12px;transition:color .2s ease}
.wm-foot-col a:hover{color:#fae608}
.wm-foot-btn{display:inline-block;background:#fae608;color:#121212!important;font-weight:700;padding:13px 26px;border-radius:10px;text-decoration:none;transition:transform .2s ease}
.wm-foot-btn:hover{transform:translateY(-2px);color:#121212!important}
.wm-foot-bottom{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,.1);padding-top:28px}
.wm-foot-pay{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.wm-foot-pay span{color:rgba(255,255,255,.5);font-size:14px;margin-right:4px}
.wm-pay-chip{background:#fff;border-radius:6px;height:34px;padding:6px 10px;display:flex;align-items:center}
.wm-pay-chip img{height:20px;width:auto;object-fit:contain}
.wm-foot-copy{color:rgba(255,255,255,.45);font-size:14px;margin:0}
@media(max-width:767px){.wm-foot-top{gap:40px}.wm-foot-cols{gap:36px}.wm-foot-bottom{flex-direction:column;align-items:flex-start}}
</style>`

const content = `<div class="container wm-foot">
<div class="wm-foot-top">
<div class="wm-foot-brand"><img src="/images/wingman-logo.png" alt="Wingman Coaching"/><p class="wm-foot-tag">Die 360°-Analyse für Unternehmer. Ehrliche Standortbestimmung und ein klarer Plan für die nächsten 90 Tage.</p></div>
<div class="wm-foot-cols">
<div class="wm-foot-col"><h4>Navigation</h4><a href="/">Startseite</a><a href="/payment">Zur Analyse</a><a href="/#faq">Häufige Fragen</a></div>
<div class="wm-foot-col"><h4>Rechtliches</h4><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a><a href="/agb">AGB</a><a href="/widerrufsrecht">Widerrufsrecht</a></div>
<div class="wm-foot-col"><h4>Bereit für Klarheit?</h4><a href="/payment" class="wm-foot-btn">Analyse starten</a></div>
</div>
</div>
<div class="wm-foot-bottom">
<div class="wm-foot-pay"><span>Sichere Zahlung mit</span><span class="wm-pay-chip"><img src="/images/paypal-logo.png" alt="PayPal"/></span><span class="wm-pay-chip"><img src="/images/klarna-logo.svg" alt="Klarna"/></span><span class="wm-pay-chip"><img src="/images/card-logo.svg" alt="Kreditkarte"/></span><span class="wm-pay-chip"><img src="/images/sepa-lastschrift-logo.png" alt="SEPA-Lastschrift"/></span></div>
<p class="wm-foot-copy">© Wingman Coaching. Alle Rechte vorbehalten.</p>
</div>
</div>`

let html = await readFile(FILE, "utf8")
const key = 'class="section footer"'
const k = html.indexOf(key)
if (k === -1) throw new Error("Footer-Sektion nicht gefunden")
const s = html.lastIndexOf("<section", k)
const e = html.indexOf("</section>", k) + "</section>".length
const newFooter = `<section class="section footer">${style}${content}</section>`
html = html.slice(0, s) + newFooter + html.slice(e)
await writeFile(FILE, html, "utf8")
console.log("Footer neu gebaut. Alte Länge:", e - s, "Neu:", newFooter.length)
