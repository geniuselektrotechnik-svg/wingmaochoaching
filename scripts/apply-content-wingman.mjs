// Schreibt die komplette Landing inhaltlich von "Anwaltskanzlei" (Validway-Vorlage)
// auf Wingman 360°-Unternehmensanalyse um. Sektionsweise, damit doppelte Sätze
// kontextgerecht unterschiedlich werden. Team/Fallstudien/Blog werden ausgeblendet
// (können später mit echten Wingman-Inhalten gefüllt werden).
import { readFile, writeFile } from "node:fs/promises"

const FILE = "/Users/agelianas/wingman-fix/public/landing/index.html"
let html = await readFile(FILE, "utf8")
let hits = 0
const rep = (a, b) => {
  const before = html
  html = html.split(a).join(b)
  if (html !== before) hits++
  else console.warn("KEIN TREFFER (global):", a.slice(0, 55))
}
function repInSection(cls, pairs) {
  const key = `class="section ${cls}"`
  const k = html.indexOf(key)
  if (k === -1) return console.warn("Sektion fehlt:", cls)
  const s = html.lastIndexOf("<section", k)
  const e = html.indexOf("</section>", k) + "</section>".length
  let block = html.slice(s, e)
  for (const [a, b] of pairs) {
    if (block.includes(a)) { block = block.split(a).join(b); hits++ }
    else console.warn(`KEIN TREFFER (${cls}):`, a.slice(0, 50))
  }
  html = html.slice(0, s) + block + html.slice(e)
}

/* ---------- HERO + Stats (global, eindeutige Strings) ---------- */
rep("Trusted Legal Insight When Decisions Carry Weight", "Wo steht Ihr Unternehmen wirklich?")
rep("Built on clarity, rigorous analysis, and trusted legal counsel.", "Die 360°-Analyse zeigt Ihnen in rund 15 Minuten, wo Ihre Stärken liegen und wo der nächste Hebel für Wachstum sitzt.")
rep("We advise individuals and organizations on complex legal matters, applying experience, discretion, and practical legal reasoning to every engagement.", "Ehrliche Standortbestimmung für Unternehmer: 78 Fragen, KI-gestützte Auswertung und ein konkreter 90-Tage-Plan. Danach wissen Sie genau, wo Sie stehen.")
rep("Client satisfaction rate", "Weiterempfehlung")
rep("Matters successfully handled", "Durchgeführte Analysen")
rep("Continuous legal practice", "Minuten bis zum Ergebnis")

/* ---------- SERVICES (our-expertise) ---------- */
repInSection("our-expertise", [
  ["Focused Legal Services", "Was die Analyse aufdeckt"],
  ["Founded to deliver deliberate legal counsel—prioritizing precision, outcomes, and clear judgment through close client partnership.", "Die Analyse durchleuchtet Ihr Unternehmen in mehreren Kernbereichen. Präzise, ehrlich und mit Ergebnissen, auf die Sie aufbauen können."],
  ["Litigation · Compliance", "Strategie & Vision"],
  ["Corporate · Regulatory", "Finanzen & Kennzahlen"],
  ["Employment · Compliance", "Führung & Team"],
  ["Regulatory · Compliance", "Vertrieb & Markt"],
  ["Representing clients in disputes with a focus on strategy, evidence, and outcome.", "Wie klar ist Ihr Kurs? Wir prüfen Ziele, Positionierung und die Qualität Ihrer Entscheidungen."],
  ["Advising businesses across formation, operations, and commercial decision-making.", "Kennen Sie Ihre Zahlen wirklich? Wir schauen auf Rentabilität, Liquidität und Steuerung."],
  ["Civil and commercial litigation", "Vision und langfristige Ziele"],
  ["Alternative dispute resolution", "Positionierung im Markt"],
  ["Pre-litigation advisory and case assessment", "Klarheit bei Entscheidungen"],
  ["Contract drafting and review", "Rentabilität und Marge"],
  ["Corporate structuring and governance", "Liquidität und Planung"],
  ["Commercial negotiations and transactions", "Steuerung über Kennzahlen"],
  ["Employment contracts and policies", "Rollen und Verantwortung"],
  ["Workplace disputes and terminations", "Zusammenarbeit im Team"],
  ["Regulatory and labor compliance", "Führung und Delegation"],
  ["Industry-specific compliance guidance", "Kunden und Zielgruppe"],
  ["Risk assessments and legal audits", "Vertrieb und Abschluss"],
  ["Regulatory engagement and advisory", "Wachstum und Skalierung"],
])

/* ---------- PROZESS (our-work) ---------- */
repInSection("our-work", [
  ["How we work", "Ablauf"],
  ["A Structured Legal Process You Can Rely On", "So läuft Ihre Analyse ab"],
  ["Initial Assessment", "Fragebogen ausfüllen"],
  ["We review your situation, risks, and objectives before offering direction.", "Sie beantworten 78 Fragen in rund 15 Minuten, ehrlich und in Ruhe."],
  ["Strategic Planning", "KI-Auswertung"],
  ["A clear legal pathway is defined, aligned with your priorities.", "Ihre Antworten werden tiefenanalysiert und zu einem klaren Unternehmensprofil verdichtet."],
  ["Execution &amp; Representation", "Ihr Report"],
  ["We act decisively while keeping you informed at every milestone.", "Sie erhalten einen ausführlichen PDF-Report mit allen Ergebnissen und Statistiken."],
  ["Resolution &amp; Review", "90-Tage-Plan"],
  ["Outcomes are delivered with clarity, documentation, and next steps.", "Konkrete Handlungsschritte für die nächsten 90 Tage, direkt umsetzbar."],
])

/* ---------- VORTEILE (client-choose) ---------- */
repInSection("client-choose", [
  ["WHY CLIENTS CHOOSE US", "WARUM WINGMAN"],
  ["Experience, Precision, and Accountability", "Präzise. Ehrlich. Umsetzbar."],
  ["Clear communication", "Klare Sprache"],
  ["Plain guidance that removes uncertainty and confusion", "Verständliche Ergebnisse ohne Fachchinesisch, die Sie sofort einordnen."],
  ["Risk-aware advice", "Ehrlicher Blick"],
  ["A clear legal pathway is defined, aligned with your priorities.", "Wir benennen Schwächen klar statt schönzureden. Nur so entsteht echter Fortschritt."],
  ["Proven experience", "Fundierte Methode"],
  ["Demonstrated capability across demanding legal matters", "Entwickelt aus Unternehmerpraxis und geprüften Bewertungskriterien."],
])

/* ---------- TESTIMONIALS (tesimonial) ---------- */
repInSection("tesimonial", [
  ["CLIENT FEEDBACK", "STIMMEN"],
  ["Trusted by Clients Who Value Clarity", "Was Teilnehmer sagen"],
  ["Managing Director", "Geschäftsführer"],
  ["Founder &amp; CEO", "Gründerin"],
  ["Head of Legal", "Inhaber"],
  ["“Clear advice, realistic expectations, and consistent communication throughout.”", "„Endlich eine ehrliche Standortbestimmung. Ich weiß jetzt genau, wo ich stehe.“"],
  ["“A legal partner who understands both risk and business reality.”", "„In 15 Minuten mehr Klarheit über mein Unternehmen als in Monaten davor.“"],
  ["“Professional, discreet, and outcome-focused.”", "„Der 90-Tage-Plan war sofort umsetzbar. Genau das habe ich gebraucht.“"],
])

/* ---------- FAQ ---------- */
repInSection("faq", [
  ["Common Client Questions", "Häufige Fragen"],
  ["What types of clients do you work with?", "Für wen ist die Analyse gedacht?"],
  ["We advise individuals, startups, SMEs, and established organizations across a range of legal and regulatory matters.", "Für Unternehmer und Selbstständige, ob in Gründung, Wachstum oder etabliert. Die Auswertung passt sich Ihrem Profil an."],
  ["How do I request a consultation?", "Wie starte ich die Analyse?"],
  ["You can request a consultation by contacting us through our website form, email, or phone to schedule a convenient time.", "Sie starten direkt online, füllen den Fragebogen in rund 15 Minuten aus und erhalten Ihre Auswertung als PDF-Report."],
  ["Do you offer initial consultations?", "Wie lange dauert die Analyse?"],
  ["Yes, we offer initial consultations to discuss your situation, understand your needs, and explain how we can assist you.", "Der Fragebogen dauert rund 15 bis 20 Minuten. Den fertigen Report bekommen Sie direkt im Anschluss."],
  ["How are your legal fees structured?", "Was kostet die Analyse?"],
  ["Our legal fees are transparent and structured based on case complexity, service type, and time involved, discussed clearly upfront.", "Die 360°-Analyse kostet einmalig 599 Euro. Enthalten sind Auswertung, PDF-Report und Ihr persönlicher 90-Tage-Plan."],
  ["Will my information remain confidential?", "Sind meine Daten sicher?"],
  ["Absolutely. All client information is kept strictly confidential and handled according to professional ethics and legal privacy standards.", "Ja. Ihre Angaben werden vertraulich behandelt und ausschließlich für Ihre persönliche Auswertung genutzt."],
])

/* ---------- CTA ---------- */
repInSection("cta", [
  ["GET IN TOUCH", "JETZT STARTEN"],
  ["Discuss Your Legal Matter with Confidence", "Bereit für echte Klarheit?"],
])

/* ---------- FOOTER (regex, Text ist variabel/abgeschnitten) ---------- */
html = html.replace(/Providing legal counsel grounded in experience, clarity, and professional[^<]*/g,
  "Die 360°-Analyse für Unternehmer. Ehrliche Standortbestimmung und ein klarer Plan für die nächsten 90 Tage.")
html = html.replace(/©\s*Copyright[^<]*/g, "© Wingman Coaching. Alle Rechte vorbehalten.")

/* ---------- Team / Fallstudien / Blog ausblenden ---------- */
html = html.replace(/<\/head>/i,
  "<style>.section.team,.section.highlight,.section.blogs{display:none!important}</style></head>")

await writeFile(FILE, html, "utf8")
console.log("Content umgeschrieben. Ersetzungen erfolgreich:", hits)
console.log("Verbleibende Legal-Begriffe (Kontrolle):",
  (html.match(/\b(Legal|legal|Litigation|Compliance|consultation|attorney|law firm)\b/g) || []).length)
