import puppeteer from "puppeteer"

interface AnalysisResult {
  overallScore: number
  entrepreneurType: string
  categoryScores: {
    [key: string]: number
  }
  aiAnalysis?: any
  firstName?: string
  lastName?: string
  companyName?: string
  wingmanIndex?: number
  indexSubtitle?: string
}

function getPolarAxesHTML(categoryScores: { [key: string]: number }): string {
  // Polare Achsen Konfiguration
  const polarAxesConfig: { [key: string]: { label: string; left: string; right: string }[] } = {
    "Unternehmerisches Denken": [
      { label: "Vision", left: "Komfortzone / Prokrastination", right: "Vision & Wachstum" },
      { label: "Kennzahlen", left: "Wenig Klarheit", right: "Kennzahlenprofi" },
      { label: "Agilität", left: "Reaktion", right: "Gestaltung" }
    ],
    "Leadership & Führung + Emotionen": [
      { label: "Arbeitsweise", left: "Im Unternehmen", right: "Am Unternehmen" },
      { label: "Führungsstil", left: "Improvisierte Führung", right: "Generalisierte Führung" },
      { label: "Vertrauen", left: "Kontrolle", right: "Verantwortung & Vertrauen" }
    ],
    "Vertrieb & Wachstum": [
      { label: "Systematik", left: "Intuitiver Vertrieb", right: "Systematisierter Vertrieb" },
      { label: "Prozess", left: "Einzelabschlüsse", right: "Planbarer Sales-Prozess" },
      { label: "Skalierung", left: "Sales heute", right: "Next-Level Sales" }
    ],
    "Selbstmanagement & Resilienz": [
      { label: "Bewusstsein", left: "Autopilot", right: "Bewusstes Handeln" },
      { label: "Team-Gefühl", left: "Isolation", right: "Wir-Gefühl / Kohäsion" },
      { label: "Mindset", left: "Unsicherheit / Risiko", right: "Sicherheit / Chance" }
    ],
    "Finanzen & Controlling": [
      { label: "Transparenz", left: "Bauchgefühl", right: "Zahlenklarheit" },
      { label: "Fokus", left: "Liquidität sichern", right: "Wert & Wachstum steuern" },
      { label: "Strategie", left: "Kurzfristig", right: "Langfristige Finanzstrategie" }
    ],
    "Marketing & Marke": [
      { label: "Entscheidungsbasis", left: "Intuition", right: "Datenbasiert" },
      { label: "Strategie", left: "Einzelmaßnahmen", right: "Integrierte Strategie" },
      { label: "Zeithorizont", left: "Kurzfristig", right: "Markenaufbau" }
    ]
  }

  return Object.entries(categoryScores)
    .map(([category, score]) => {
      const axes = polarAxesConfig[category] || []
      if (axes.length === 0) return ""

      return `
        <div style="margin-bottom: 35px; page-break-inside: avoid;">
          <div style="background: rgba(251, 191, 36, 0.1); border-left: 4px solid #eab308; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <div style="font-size: 16px; font-weight: bold; color: #eab308; margin-bottom: 5px;">${category}</div>
            <div style="font-size: 13px; color: #94a3b8;">Gesamtbewertung: ${score}%</div>
          </div>
          
          ${axes.map((axis) => `
            <div style="margin-bottom: 20px;">
              <div style="font-size: 12px; color: #94a3b8; margin-bottom: 8px; font-weight: 600;">${axis.label}</div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="flex: 1; text-align: right; font-size: 11px; color: #cbd5e1;">${axis.left}</div>
                <div style="flex: 0 0 300px; height: 8px; background: linear-gradient(to right, #ef4444, #eab308, #22c55e); border-radius: 4px; position: relative;">
                  <div style="position: absolute; top: -3px; left: ${score}%; transform: translateX(-50%); width: 14px; height: 14px; background: white; border: 3px solid #eab308; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
                </div>
                <div style="flex: 1; text-align: left; font-size: 11px; color: #cbd5e1;">${axis.right}</div>
              </div>
            </div>
          `).join("")}
        </div>
      `
    })
    .join("")
}

export async function generatePDFWithPuppeteer(
  result: AnalysisResult
): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  const page = await browser.newPage()

  const htmlContent = generateHTMLTemplate(result)

  await page.setContent(htmlContent, { waitUntil: "load" })

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      right: "15mm",
      bottom: "20mm",
      left: "15mm",
    },
  })

  await browser.close()

  return Buffer.from(pdfBuffer)
}

// Wingman Logo: Nur gelber Text "WINGMAN COACHING" auf transparentem Hintergrund
const WINGMAN_LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="280" height="70">
  <!-- Text WINGMAN in Gelb -->
  <text x="200" y="45" fontFamily="Arial, sans-serif" fontSize="42" fontWeight="bold" fill="#fbbf24" letterSpacing="4" textAnchor="middle">WINGMAN</text>
  <!-- Text COACHING in Gelb darunter -->
  <text x="200" y="75" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="normal" fill="#fbbf24" letterSpacing="2" textAnchor="middle">COACHING</text>
</svg>
`

function generateHTMLTemplate(result: AnalysisResult): string {
  const { overallScore, entrepreneurType, categoryScores, aiAnalysis, firstName, lastName, companyName, wingmanIndex, indexSubtitle } = result
  const fullName = `${firstName || ''} ${lastName || ''}`.trim()
  const company = companyName || ''
  
  // SVG als Data URI
  const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(WINGMAN_LOGO_SVG).toString('base64')}`

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wingman Coaching - 360° Unternehmensanalyse</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #000000;
      color: #e2e8f0;
      line-height: 1.6;
    }
    
    .page {
      page-break-after: always;
      padding: 40px;
      min-height: 297mm;
    }
    
    .cover-page {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: #000000;
      position: relative;
      overflow: hidden;
    }
    
    .cover-page::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%);
    }
    
    .logo {
      width: 300px;
      margin-bottom: 60px;
      z-index: 1;
    }
    
    .cover-title {
      font-size: 48px;
      font-weight: 800;
      color: #fbbf24;
      margin-bottom: 20px;
      z-index: 1;
      text-shadow: 0 4px 20px rgba(251, 191, 36, 0.3);
    }
    
    .cover-subtitle {
      font-size: 32px;
      color: #e2e8f0;
      margin-bottom: 60px;
      z-index: 1;
    }
    
    .cover-score {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 1;
    }
    
    .cover-score-circle {
      width: 280px;
      height: 280px;
      border-radius: 50%;
      background: #fbbf24;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 30px rgba(251, 191, 36, 0.4);
      margin-bottom: 40px;
    }
    
    .cover-score-label {
      font-size: 16px;
      color: #1e293b;
      margin-bottom: 5px;
      font-weight: 600;
    }
    
    .cover-score-value {
      font-size: 80px;
      font-weight: 900;
      color: #1e293b;
      line-height: 1;
    }
    
    .cover-score-max {
      font-size: 28px;
      color: #1e293b;
      opacity: 0.7;
    }
    
    .cover-type {
      font-size: 32px;
      color: #fbbf24;
      font-weight: 700;
      text-align: center;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #fbbf24;
    }
    
    .header-logo {
      height: 40px;
    }
    
    .header-title {
      font-size: 24px;
      color: #fbbf24;
      font-weight: 700;
    }
    
    h1 {
      font-size: 36px;
      color: #fbbf24;
      margin-bottom: 30px;
      font-weight: 800;
    }
    
    h2 {
      font-size: 28px;
      color: #fbbf24;
      margin-top: 40px;
      margin-bottom: 20px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    h2::before {
      content: '';
      width: 6px;
      height: 32px;
      background: #fbbf24;
      border-radius: 3px;
    }
    
    h3 {
      font-size: 22px;
      color: #e2e8f0;
      margin-top: 30px;
      margin-bottom: 15px;
      font-weight: 600;
    }
    
    p {
      margin-bottom: 15px;
      color: #cbd5e1;
      font-size: 14px;
    }
    
    .score-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin: 30px 0;
    }
    
    .score-card {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border: 2px solid #475569;
      border-radius: 12px;
      padding: 25px;
      transition: all 0.3s;
    }
    
    .score-card-title {
      font-size: 16px;
      color: #94a3b8;
      margin-bottom: 15px;
      font-weight: 600;
    }
    
    .score-bar-container {
      background: #0f172a;
      height: 12px;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 10px;
    }
    
    .score-bar {
      height: 100%;
      background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
      border-radius: 6px;
      transition: width 0.5s ease;
      box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
    }
    
    .score-value {
      font-size: 24px;
      font-weight: 700;
      color: #fbbf24;
    }
    
    .insight-box {
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%);
      border-left: 4px solid #fbbf24;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .strength-item, .development-item {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border-left: 4px solid #fbbf24;
      border-radius: 8px;
      padding: 20px;
      margin: 15px 0;
    }
    
    .development-item {
      border-left-color: #f59e0b;
    }
    
    .item-title {
      font-size: 18px;
      font-weight: 700;
      color: #fbbf24;
      margin-bottom: 10px;
    }
    
    .item-description {
      color: #cbd5e1;
      font-size: 14px;
      line-height: 1.8;
    }
    
    .first-steps {
      color: #10b981 !important;
      font-weight: 600 !important;
      background-color: rgba(16, 185, 129, 0.15) !important;
      padding: 12px 16px !important;
      border-radius: 8px !important;
      border-left: 4px solid #10b981 !important;
      margin-top: 12px !important;
    }
    
    .first-steps strong {
      color: #10b981 !important;
    }
    
    .action-steps {
      counter-reset: step-counter;
    }
    
    .action-step {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border: 2px solid #475569;
      border-radius: 12px;
      padding: 25px;
      margin: 20px 0;
      position: relative;
      padding-left: 80px;
    }
    
    .action-step::before {
      counter-increment: step-counter;
      content: counter(step-counter);
      position: absolute;
      left: 25px;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      background: #fbbf24;
      color: #0f172a;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 800;
    }
    
    .cta-box {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: #0f172a;
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      margin: 40px 0;
      box-shadow: 0 10px 40px rgba(251, 191, 36, 0.3);
    }
    
    .cta-title {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 20px;
    }
    
    .cta-description {
      font-size: 16px;
      margin-bottom: 25px;
      color: #0f172a;
    }
    
    .cta-button {
      display: inline-block;
      background: #0f172a;
      color: #fbbf24;
      padding: 15px 40px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.3s;
    }
    
    .footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #334155;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }
    
    .recommendations-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    
    .recommendation-card {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border: 2px solid #475569;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    
    .recommendation-icon {
      font-size: 32px;
      margin-bottom: 10px;
    }
    
    .recommendation-title {
      font-size: 14px;
      font-weight: 600;
      color: #fbbf24;
      margin-bottom: 5px;
    }
    
    .recommendation-text {
      font-size: 12px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  
  <!-- COVER PAGE -->
  <div class="page cover-page">
    <div class="logo" style="margin-bottom: 30px;">
      <img src="${logoDataUri}" alt="Wingman Coaching Logo" style="width: 280px; height: auto;" />
    </div>
    
    <h1 class="cover-title">Premium Analyse</h1>
    <p class="cover-subtitle">${fullName}${company ? ` | ${company}` : ''}</p>
    
    <div class="cover-score">
      <div style="text-align: center; margin-bottom: 15px;">
        <p style="font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; font-weight: 600;">Wingman Mittelstandsindex</p>
      </div>
      <div class="cover-score-circle">
        <div class="cover-score-value">${wingmanIndex || overallScore}<span class="cover-score-max">/100</span></div>
      </div>
      <p style="text-align: center; font-size: 15px; color: #e2e8f0; margin-top: 15px; font-weight: 600;">${indexSubtitle || ''}</p>
      <div class="cover-type" style="margin-top: 20px;">${entrepreneurType}</div>
    </div>
  </div>
  
  <!-- EXECUTIVE SUMMARY -->
  <div class="page">
    <div class="header">
      <img src="${logoDataUri}" alt="Wingman Logo" class="header-logo" />
      <div class="header-title">Vertraulich</div>
    </div>
    
    <h1>Executive Summary</h1>
    
    <div class="insight-box" style="background: linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(234, 179, 8, 0.05) 100%); border-left: 4px solid #eab308; padding: 20px; margin-bottom: 30px;">
      <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
        <div style="font-size: 48px; font-weight: bold; color: #eab308;">${wingmanIndex || overallScore}</div>
        <div>
          <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px;">Wingman Mittelstandsindex</div>
          <div style="font-size: 14px; color: #e2e8f0; font-weight: 600;">${indexSubtitle || ''}</div>
        </div>
      </div>
      ${aiAnalysis?.executiveSummary ? `<p style="margin: 0; line-height: 1.6;">${aiAnalysis.executiveSummary}</p>` : ""}
    </div>
    
    <h2>Die 3 Wingman-Perspektiven</h2>
    <p style="color: #94a3b8; margin-bottom: 25px;">Ihre Analyse basiert auf drei professionellen Perspektiven, die zusammen ein ganzheitliches Bild Ihres unternehmerischen Erfolgs ergeben:</p>
    
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px;">
      <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%); border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px;">
        <div style="font-size: 16px; font-weight: bold; color: #3b82f6; margin-bottom: 10px;">Unternehmer-Perspektive</div>
        <div style="font-size: 13px; color: #cbd5e1; line-height: 1.5;">Zahlen, Struktur, Steuerung und wirtschaftliche Realität</div>
      </div>
      
      <div style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%); border-left: 4px solid #a855f7; padding: 20px; border-radius: 8px;">
        <div style="font-size: 16px; font-weight: bold; color: #a855f7; margin-bottom: 10px;">Coach-Perspektive</div>
        <div style="font-size: 13px; color: #cbd5e1; line-height: 1.5;">Haltung, Bewusstsein, Führung und innere Stabilität</div>
      </div>
      
      <div style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%); border-left: 4px solid #22c55e; padding: 20px; border-radius: 8px;">
        <div style="font-size: 16px; font-weight: bold; color: #22c55e; margin-bottom: 10px;">Sales-Perspektive</div>
        <div style="font-size: 13px; color: #cbd5e1; line-height: 1.5;">Markt, Wachstum, Umsetzung und Wirkung nach außen</div>
      </div>
    </div>
    
    <h2>Ihre Kompetenzbereiche im Detail</h2>
    
    <div class="score-grid">
      ${Object.entries(categoryScores)
        .map(
          ([category, score]) => `
        <div class="score-card">
          <div class="score-card-title">${category}</div>
          <div class="score-bar-container">
            <div class="score-bar" style="width: ${score}%"></div>
          </div>
          <div class="score-value">${score}%</div>
        </div>
      `
        )
        .join("")}
    </div>
  </div>
  
  <!-- POLARE ACHSEN -->
  <div class="page">
    <div class="header">
      <img src="${logoDataUri}" alt="Wingman Logo" class="header-logo" />
      <div class="header-title">Vertraulich</div>
    </div>
    
    <h1>Kompetenz-Dimensionen</h1>
    <p style="color: #94a3b8; margin-bottom: 25px;">Ihre Position auf den polaren Achsen zeigt, wo Sie aktuell stehen und welche Entwicklungsrichtung optimal ist:</p>
    
    ${getPolarAxesHTML(categoryScores)}
  </div>
  
  <!-- STRENGTHS -->
  <div class="page">
    <div class="header">
      <img src="${logoDataUri}" alt="Wingman Logo" class="header-logo" />
      <div class="header-title">Vertraulich</div>
    </div>
    
    <h1>Ihre Stärken</h1>
    
    ${
      aiAnalysis?.strengths
        ?.map(
          (strength: any) => `
      <div class="strength-item">
        <div class="item-title">${strength.title}</div>
        <div class="item-description">
          <p><strong>Beschreibung:</strong> ${strength.description}</p>
          <p><strong>Business-Impact:</strong> ${strength.businessImpact}</p>
          <p><strong>Entwicklungstipp:</strong> ${strength.developmentTip}</p>
        </div>
      </div>
    `
        )
        .join("") || ""
    }
  </div>
  
  <!-- DEVELOPMENT AREAS -->
  <div class="page">
    <div class="header">
      <img src="${logoDataUri}" alt="Wingman Logo" class="header-logo" />
      <div class="header-title">Vertraulich</div>
    </div>
    
    <h1>Entwicklungsbereiche</h1>
    
    ${
      aiAnalysis?.developmentAreas
        ?.map(
          (area: any) => `
      <div class="development-item">
        <div class="item-title">${area.title}</div>
        <div class="item-description">
          <p><strong>Analyse:</strong> ${area.analysis}</p>
          <p><strong>Risiken:</strong> ${area.risks}</p>
          <p><strong>ROI bei Verbesserung:</strong> ${area.roi}</p>
          <p class="first-steps"><strong>Erste Schritte:</strong> ${area.firstSteps}</p>
        </div>
      </div>
    `
        )
        .join("") || ""
    }
  </div>
  
  <!-- ACTION PLAN -->
  <div class="page">
    <div class="header">
      <img src="${logoDataUri}" alt="Wingman Logo" class="header-logo" />
      <div class="header-title">Vertraulich</div>
    </div>
    
    <h1>Strategischer Entwicklungsplan</h1>
    
    <div class="action-steps">
      ${
        aiAnalysis?.actionPlan?.shortTerm
          ?.map(
            (step: string) => `
        <div class="action-step">
          <strong>Kurzfristig (0-30 Tage):</strong> ${step}
        </div>
      `
          )
          .join("") || ""
      }
      
      ${
        aiAnalysis?.actionPlan?.mediumTerm
          ?.map(
            (step: string) => `
        <div class="action-step">
          <strong>Mittelfristig (1-3 Monate):</strong> ${step}
        </div>
      `
          )
          .join("") || ""
      }
      
      ${
        aiAnalysis?.actionPlan?.longTerm
          ?.map(
            (step: string) => `
        <div class="action-step">
          <strong>Langfristig (3-12 Monate):</strong> ${step}
        </div>
      `
          )
          .join("") || ""
      }
    </div>
  </div>
  
  <!-- RECOMMENDATIONS & CTA -->
  <div class="page">
    <div class="header">
      <img src="${logoDataUri}" alt="Wingman Logo" class="header-logo" />
      <div class="header-title">Vertraulich</div>
    </div>
    
    <h1>Ihre nächsten Schritte</h1>
    
    ${
      aiAnalysis?.recommendations?.wingmanProgram
        ? `
    <div class="cta-box">
      <div class="cta-title">Perfekt für Sie: ${aiAnalysis.recommendations.wingmanProgram.primary}</div>
      <div class="cta-description">${aiAnalysis.recommendations.wingmanProgram.reason}</div>
      <div class="cta-description"><strong>Erwartetes Ergebnis:</strong> ${aiAnalysis.recommendations.wingmanProgram.expectedOutcome}</div>
      <a href="https://www.wingmancoaching-test.de/termin-buchen" class="cta-button">Jetzt Beratungsgespräch buchen</a>
    </div>
    `
        : ""
    }
    
    <h2>Empfohlene Ressourcen</h2>
    
    <div class="recommendations-grid">
      ${
        aiAnalysis?.recommendations?.books
          ?.map(
            (book: string) => `
        <div class="recommendation-card">
          <div class="recommendation-icon">📚</div>
          <div class="recommendation-title">Buch</div>
          <div class="recommendation-text">${book}</div>
        </div>
      `
          )
          .join("") || ""
      }
    </div>
    
    <div class="footer">
      <p>Wingman Coaching © ${new Date().getFullYear()} - Vertraulich</p>
      <p>kontakt@wingmancoaching.de | www.wingmancoaching.de</p>
    </div>
  </div>
  
</body>
</html>
  `
}
