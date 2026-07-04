// Ersetzt die "our-client"-Sektion durch ein 3D-Scroll-Karten-Deck (GSAP ScrollTrigger)
// mit den 6 Wingman-Unternehmenstypen und lucide-Icons. GSAP/ScrollTrigger sind
// auf der Seite bereits geladen. Nur diese eine Sektion wird angefasst.
import { readFile, writeFile } from "node:fs/promises"

const FILE = "/Users/agelianas/wingman-fix/public/landing/index.html"

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
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`

const types = [
  ["Der Visionär", "lightbulb", "Sie denken langfristig und erkennen Möglichkeiten, bevor andere sie sehen. Ihr Blick geht über das Tagesgeschäft hinaus."],
  ["Der Growth-Leader", "trending", "Sie sind wachstumsorientiert, entscheidungsstark und marktgetrieben. Sie treiben Ihr Unternehmen aktiv nach vorne."],
  ["Der Strategische Umsetzer", "shield", "Sie verbinden Planung mit konsequenter Umsetzung. Sie sorgen dafür, dass Ideen Realität werden und Prozesse greifen."],
  ["Der Sales-Entrepreneur", "handshake", "Sie sind stark im Vertrieb und im direkten Kundenkontakt. Sie überzeugen durch Persönlichkeit und Abschlussstärke."],
  ["Der Entwickler", "sprout", "Sie sind in einer Phase des Aufbaus oder der Neuorientierung. Ihr Unternehmen hat Potenzial und braucht Klarheit und Struktur."],
  ["Der Ausgewogene Unternehmer", "scale", "Sie haben ein solides, stabiles Unternehmerprofil. Ihr Unternehmen funktioniert zuverlässig und ist ausgewogen aufgestellt."],
]

const cards = types
  .map(([name, ic, desc], i) => {
    const num = String(i + 1).padStart(2, "0")
    return `<article class="wm3d-card"><div class="wm3d-visual"><span class="wm3d-icon">${svg(icons[ic])}</span></div><div class="wm3d-text"><span class="wm3d-num">/ ${num} /</span><h3 class="wm3d-name">${name}</h3><p class="wm3d-desc">${desc}</p></div></article>`
  })
  .join("")

const style = `<style>
.wm3d-track{position:relative;min-height:640vh}
.wm3d-sticky{position:sticky;top:0;height:100vh;display:flex;align-items:center}
.wm3d-inner{display:flex;gap:56px;width:100%;align-items:center}
.wm3d-head{width:32%;flex:none}
.wm3d-head .section-title{margin:14px 0 0}
.wm3d-intro{color:rgba(18,18,18,.6);font-size:17px;line-height:1.55;margin:18px 0 0}
.wm3d-count{margin-top:34px;font-family:"Inter Tight",sans-serif;font-size:15px;font-weight:600;color:rgba(18,18,18,.5);letter-spacing:.04em}
.wm3d-count b{color:#121212;font-size:40px;font-weight:600;margin-right:6px}
.wm3d-stage{flex:1;perspective:2000px;position:relative;height:430px}
.wm3d-deck{position:absolute;inset:0;transform-style:preserve-3d}
.wm3d-card{position:absolute;inset:0;background:#fff;border:1px solid rgba(18,18,18,.06);border-radius:16px;box-shadow:0 34px 70px rgba(18,18,18,.14);display:flex;overflow:hidden;will-change:transform,opacity;backface-visibility:hidden}
.wm3d-visual{width:42%;flex:none;background:#fae608;display:flex;align-items:center;justify-content:center}
.wm3d-icon{color:#121212}
.wm3d-icon svg{width:92px;height:92px}
.wm3d-text{flex:1;padding:40px 42px;display:flex;flex-direction:column}
.wm3d-num{color:rgba(18,18,18,.42);font-size:14px;font-weight:600;letter-spacing:.05em}
.wm3d-name{font-family:"Inter Tight",sans-serif;font-size:30px;font-weight:600;color:#121212;line-height:1.15;margin:14px 0 0}
.wm3d-desc{color:rgba(18,18,18,.62);font-size:16px;line-height:1.55;margin:auto 0 0}
@media(max-width:991px){
.wm3d-track{min-height:auto}
.wm3d-sticky{position:static;height:auto;display:block}
.wm3d-inner{flex-direction:column;gap:32px;align-items:stretch}
.wm3d-head{width:auto}
.wm3d-count{display:none}
.wm3d-stage{height:auto;perspective:none}
.wm3d-deck{position:static;transform:none!important}
.wm3d-card{position:relative;inset:auto;transform:none!important;opacity:1!important;margin-bottom:18px;min-height:220px}
}
@media(max-width:600px){.wm3d-visual{width:34%}.wm3d-icon svg{width:60px;height:60px}.wm3d-name{font-size:24px}.wm3d-text{padding:28px}}
</style>`

const newSection = `<section class="section our-client">${style}<div class="wm3d-track"><div class="wm3d-sticky"><div class="container"><div class="wm3d-inner"><div class="wm3d-head"><div class="tag-wrap"><div class="tag-text">/ Unternehmenstypen /</div></div><h2 class="section-title">Welcher Unternehmertyp sind Sie?</h2><p class="wm3d-intro">Die 360°-Analyse ordnet Sie einem von sechs Profilen zu. So wissen Sie genau, wo Ihre Stärken liegen und wo der nächste Hebel sitzt.</p><div class="wm3d-count"><b class="wm3d-cur">01</b>/ 06</div></div><div class="wm3d-stage"><div class="wm3d-deck">${cards}</div></div></div></div></div></div></section>`

const script = `<script>
(function(){
  function init(){
    if(!window.gsap||!window.ScrollTrigger){return setTimeout(init,120);}
    var gsap=window.gsap; gsap.registerPlugin(window.ScrollTrigger);
    var cards=gsap.utils.toArray('.wm3d-card'); if(!cards.length)return;
    var N=cards.length, cur=document.querySelector('.wm3d-cur');
    function layout(p){
      var active=p*(N-1);
      cards.forEach(function(card,i){
        var d=i-active, ad=Math.abs(d), z,y,rx,sc,op,zi;
        if(d>=0){ z=-d*260; y=d*16; rx=-d*4; sc=Math.max(0.7,1-d*0.085); op=d>2.4?0:(d>1?1-(d-1)*0.5:1); zi=200-Math.round(d*20); }
        else { z=d*30; y=d*100; rx=-d*11; sc=1+(-d)*0.015; op=(-d)>1.2?0:1-(-d)*0.85; zi=120+Math.round(d*10); }
        gsap.set(card,{z:z,yPercent:y,rotateX:rx,scale:sc,opacity:op,zIndex:zi});
      });
      if(cur)cur.textContent=String(Math.min(N,Math.round(active)+1)).padStart(2,'0');
    }
    var st=null, mm=window.matchMedia('(min-width:992px)');
    function enable(){ layout(0); st=window.ScrollTrigger.create({trigger:'.wm3d-track',start:'top top',end:'bottom bottom',scrub:0.4,onUpdate:function(s){layout(s.progress);}}); }
    function disable(){ if(st){st.kill();st=null;} cards.forEach(function(c){gsap.set(c,{clearProps:'all'});}); }
    if(mm.matches)enable();
    mm.addEventListener('change',function(e){e.matches?enable():disable(); if(window.ScrollTrigger)window.ScrollTrigger.refresh();});
  }
  if(document.readyState!=='loading')init(); else document.addEventListener('DOMContentLoaded',init);
})();
</script>`

let html = await readFile(FILE, "utf8")
const START = '<section class="section our-client">'
const s = html.indexOf(START)
if (s === -1) throw new Error("our-client Sektion nicht gefunden")
const e = html.indexOf("</section>", s) + "</section>".length
html = html.slice(0, s) + newSection + html.slice(e)
html = html.replace(/<\/body>/i, script + "</body>")
await writeFile(FILE, html, "utf8")
console.log("3D-Typen-Sektion + GSAP-Script eingebaut. Karten:", types.length)
