// Branding der Landing: Validway -> Wingman.
// Logos, CTA-Buttons -> /payment (Analyse-Tool), Footer-Rechtslinks -> bestehende Seiten.
import { readFile, writeFile } from "node:fs/promises"

const FILE = "/Users/agelianas/wingman-fix/public/landing/index.html"
let html = await readFile(FILE, "utf8")

// 1) Logos -> Wingman-Logo
const logos = [
  "/landing/assets/69772ffc0ac515053a650553_bad7936b73e99e4e7452de5b45639b80_Clearway-Logo.svg",
  "/landing/assets/6978bf6a471a66e58f71e3ea_3fda25873f570c1082b3fa3845d983be_Footer-Logo.svg",
  "/landing/assets/6981ffd3ae4e44be03cab4ad_Logo-Icon-Nav.svg",
]
for (const l of logos) html = html.split(l).join("/images/wingman-logo.png")
html = html.split('alt="Log Icon"').join('alt="Wingman Coaching"')
html = html.split('alt="Logo Icon"').join('alt="Wingman Coaching"')
html = html.split('alt="Footer Logo"').join('alt="Wingman Coaching"')

// 2) Alle CTA-Buttons (button-wrap) -> /payment
html = html.replace(/<a\b[^>]*\bclass="[^"]*button-wrap[^"]*"[^>]*>/g, (tag) =>
  /href="/.test(tag)
    ? tag.replace(/href="[^"]*"/, 'href="/payment"').replace(/\starget="_blank"/, "")
    : tag
)

// 3) CTA-Texte -> Deutsch
const ctaText = {
  "Get Template": "Zur Analyse",
  "All Templates": "Mehr erfahren",
  "Request A Consultation": "Analyse starten",
  "Request a Consultation": "Analyse starten",
  "Start A Conversation": "Analyse starten",
  "More About Us": "Mehr erfahren",
  "All Blogs": "Zur Analyse",
}
for (const [en, de] of Object.entries(ctaText)) html = html.split(`>${en}<`).join(`>${de}<`)

// 4) Seitentitel + Marke
html = html.replace(
  /<title>[^<]*<\/title>/i,
  "<title>Wingman Coaching – 360° Unternehmensanalyse</title>"
)
html = html.split("Validway").join("Wingman Coaching")

// 5) Footer: Links auf bestehende Seiten mappen (nur im Footer-Bereich)
const fi = html.indexOf("<footer")
if (fi !== -1) {
  let head = html.slice(0, fi)
  let footer = html.slice(fi)
  const linkMap = [
    ["/template-pages/about", "About", "/payment", "Zur Analyse"],
    ["/template-pages/service", "Services", "/", "Startseite"],
    ["/template-pages/blogs", "Blog", "/payment", "Analyse starten"],
    ["/template-pages/contact-us", "Contact Us", "/impressum", "Kontakt"],
    ["/utility-pages/license", "License", "/impressum", "Impressum"],
    ["/utility-pages/changelog", "Change Log", "/datenschutz", "Datenschutz"],
    ["/utility-pages/style-guide", "Style Guide", "/agb", "AGB"],
    ["/404", "404", "/widerrufsrecht", "Widerrufsrecht"],
    ["/401", "Password Protection", "/payment", "Zur Analyse"],
  ]
  for (const [oh, ot, nh, nt] of linkMap) {
    footer = footer.split(`href="${oh}"`).join(`href="${nh}"`)
    footer = footer.split(`>${ot}<`).join(`>${nt}<`)
  }
  // Kontakt-Mail entschärfen -> Impressum
  footer = footer
    .split('href="mailto:validway@mail.com"')
    .join('href="/impressum"')
    .split(">validway@mail.com<")
    .join(">Kontakt aufnehmen<")
  html = head + footer
}

await writeFile(FILE, html, "utf8")
console.log("Branding angewendet.")
console.log("Wingman-Logos:", (html.match(/\/images\/wingman-logo\.png/g) || []).length)
console.log("CTA -> /payment:", (html.match(/href="\/payment"/g) || []).length)
console.log("Verbleibende 'Validway':", (html.match(/Validway/g) || []).length)
