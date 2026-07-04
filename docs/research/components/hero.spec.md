# Hero-Section – Klon von olioxy.webflow.io/home

## Quelle
- Original: https://olioxy.webflow.io/home (Webflow-Template „Olioxy – Business Consulting Coaching")
- Geklont: **nur die Hero-Section**, angepasst auf Wingman-Marke/-Inhalt.
- Die Wurzel-URL olioxy.webflow.io ist nur die Template-Verkaufsseite; der echte Hero liegt unter `/home`.

## Ziel-Integration
- Datei: `public/landing/index.html` (statischer Webflow-Export, via Rewrite unter `/`).
- Ersetzt wurde der komplette Block `<section class="section home-hero wm-hero">…</section>`.
- CSS ist inline im `<style>` und komplett unter `.wm-hero…` gescoped → keine Kollision mit dem Validway-CSS.

## Design-Tokens (aus getComputedStyle des Originals)
- Font: **Inter Tight** (bereits lokal selbst-gehostet unter `assets/vendor/fonts.gstatic.com/…`, CSP-konform).
- Gelb: Original `#FFF62A`, hier `#fae608` (Wingman-Marke, praktisch identisch).
- Hintergrund: `#050505`. Text weiß, Sekundärtext `rgba(255,255,255,.6–.78)`.
- Headline: weight 500, `text-transform:uppercase`, `line-height:.9`, `letter-spacing:-.055em`.
  - Größe einzeilig ohne Overflow: `font-size:min(calc((100vw - 90px) * .104),134px)`.
  - Zweifarbig: erstes Wort gelb (`.y`), Rest weiß.

## Struktur
1. `.wm-hero-title` – „WINGMAN COACHING" (WINGMAN gelb, COACHING weiß).
2. `.wm-hero-meta` – Info-Zeile: Link „Analyse starten" | „360° Unternehmensanalyse" | „Ihre Zeit → <Live-Uhr>".
3. `.wm-hero-divider` – 1px Trennlinie.
4. `.wm-hero-grid` (2 Spalten): links Text + 2 Buttons (primär gelb → `/payment`, sekundär → `#unternehmenstypen`) + Trust (3 Avatare, 5 Sterne, „Von Unternehmern empfohlen"); rechts Foto.

## Assets (alle lokal wegen CSP)
- Hero-Foto: `assets/hero/coaching.webp` (640×448, aus Olioxy geladen).
- Avatare: vorhandene Wingman-Testimonial-Bilder (`…Testimonial-Image-One/Two/Three.avif`).

## Verhalten
- **Live-Uhr**: Inline-Script, `Europe/Berlin`, 24h, aktualisiert jede Sekunde (`#wm-clock`).
- **Hover**: Primär-Button hebt sich (translateY + Shadow), Sekundär-Button hellt auf, Meta-Link wird gelb.
- **Responsive**: ≤900px → 1 Spalte, Bild zuerst, Headline zweizeilig, Meta-Center ausgeblendet; ≤560px → Buttons volle Breite.

## Offen / nicht Teil dieser Aufgabe
- Header-Navbar: Logo überlappt am Desktop die ersten Navi-Punkte („Start"/„Analyse") – bestehender Validway-Bug, unabhängig vom Hero.
