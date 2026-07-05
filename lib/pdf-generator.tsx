import type { AssessmentResult } from "./scoring"
import { typeProfiles, typeStatesAndActions } from "./scoring"
import { assessmentQuestions } from "./questions"
import { WINGMAN_LOGO_PNG } from "./logo-data"

// Interface fuer Freitext-Antworten
interface FreetextAnswers {
  [questionId: string]: string
}

export async function generatePDF(
  result: AssessmentResult, 
  isPremium = false, 
  aiInsights?: string,
  freetextAnswers?: FreetextAnswers
): Promise<Blob> {
  const { jsPDF } = await import("jspdf")
  const doc = new jsPDF()
  
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let yPosition = 20

  // Helper functions
  const addText = (text: string, size: number, isBold = false, color: [number, number, number] = [255, 255, 255]) => {
    doc.setFontSize(size)
    doc.setTextColor(color[0], color[1], color[2])
    if (isBold) doc.setFont("helvetica", "bold")
    else doc.setFont("helvetica", "normal")

    const lines = doc.splitTextToSize(text, pageWidth - margin * 2)
    doc.text(lines, margin, yPosition)
    yPosition += lines.length * (size * 0.5) + 5
  }

  let pageNumber = 1

  const addFooter = () => {
    const currentPage = (doc.internal as any).getCurrentPageInfo().pageNumber
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text(`Wingman Coaching © 2026 - Vertraulich | Alle Rechte vorbehalten`, margin, pageHeight - 10)
    doc.text(`Seite ${currentPage}`, pageWidth - margin - 15, pageHeight - 10)
  }

  const addPageBreak = () => {
    addFooter()
    pageNumber++
    doc.addPage()
    // Schwarzer Hintergrund für jede neue Seite
    doc.setFillColor(0, 0, 0)
    doc.rect(0, 0, pageWidth, pageHeight, "F")
    yPosition = 20
  }

  const checkPageBreak = (neededSpace = 20) => {
    if (yPosition + neededSpace > pageHeight - 20) {
      addPageBreak()
    }
  }

  // ==================== PAGE 1: COVER ====================
  // Komplett schwarzer Hintergrund
  doc.setFillColor(0, 0, 0) // Black
  doc.rect(0, 0, pageWidth, pageHeight, "F")

  // Echtes Wingman-Logo oben auf dem Cover (632x146 px, Seitenverhältnis ~4.33)
  const logoY = 30
  try {
    const logoWidth = 64
    const logoHeight = logoWidth * (146 / 632)
    doc.addImage(WINGMAN_LOGO_PNG, "PNG", (pageWidth - logoWidth) / 2, logoY - 10, logoWidth, logoHeight)
  } catch {
    // Fallback: Text-Logo, falls das Bild nicht geladen werden kann
    doc.setTextColor(250, 230, 8)
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("WINGMAN", pageWidth / 2, logoY, { align: "center" })
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("COACHING", pageWidth / 2, logoY + 8, { align: "center" })
  }

  // "Wingman Mittelstandsindex" Label - ganz oben
  doc.setTextColor(180, 180, 180)
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text("/ WINGMAN MITTELSTANDSINDEX /", pageWidth / 2, 60, { align: "center" })

  doc.setTextColor(250, 230, 8) // Bright yellow
  doc.setFontSize(32)
  doc.setFont("helvetica", "bold")
  doc.text("360° UNTERNEHMENSANALYSE", pageWidth / 2, 75, { align: "center" })

  doc.setTextColor(203, 213, 225) // Light gray
  doc.setFontSize(14)
  doc.text(isPremium ? "PREMIUM ANALYSE" : "STANDARD ANALYSE", pageWidth / 2, 95, {
    align: "center",
  })

  // Name und Unternehmen unter "PREMIUM ANALYSE"
  const firstName = (result as any).firstName || ''
  const lastName = (result as any).lastName || ''
  const companyName = (result as any).companyName || ''
  const fullName = `${firstName} ${lastName}`.trim()
  
  if (fullName || companyName) {
    doc.setTextColor(255, 255, 255) // White
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    const nameText = fullName + (companyName ? ` | ${companyName}` : '')
    doc.text(nameText, pageWidth / 2, 85, { align: "center" })
  }
  
  // Score als grosse Landing-Typografie mit duennen gelben Linien
  const indexScore = (result as any).wingmanIndex || result.overallScore
  doc.setDrawColor(250, 230, 8)
  doc.setLineWidth(0.6)
  doc.line(margin + 20, 108, pageWidth - margin - 20, 108)
  doc.setTextColor(250, 230, 8)
  doc.setFontSize(88)
  doc.setFont("helvetica", "bold")
  doc.text(indexScore.toString(), pageWidth / 2 - 8, 148, { align: "center" })
  doc.setTextColor(140, 140, 140)
  doc.setFontSize(20)
  doc.setFont("helvetica", "normal")
  doc.text("/100", pageWidth / 2 + 24, 148)
  doc.line(margin + 20, 160, pageWidth - margin - 20, 160)

  // Index Subtitle
  const indexSubtitle = (result as any).indexSubtitle || ""
  if (indexSubtitle) {
    doc.setTextColor(220, 220, 220)
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(indexSubtitle, pageWidth / 2, 182, { align: "center", maxWidth: 160 })
  }

  // Unternehmertyp Text darunter
  doc.setTextColor(250, 230, 8)
  doc.setFontSize(15)
  doc.setFont("helvetica", "bold")
  doc.text(result.entrepreneurType, pageWidth / 2, 200, { align: "center" })

  doc.setTextColor(200, 200, 200)
  doc.setFontSize(10)
  const today = new Date().toLocaleDateString("de-DE")
  doc.text(`Erstellt am: ${today}`, pageWidth / 2, 260, { align: "center" })

  // ==================== PAGE 2: EXECUTIVE SUMMARY ====================
  addPageBreak()
  pageNumber++

  yPosition = 30

  // Modern header bar
  doc.setTextColor(250, 230, 8)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("/ EXECUTIVE SUMMARY /", margin, yPosition)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.text("Executive Summary", margin, yPosition + 12)
  doc.setDrawColor(250, 230, 8)
  doc.setLineWidth(0.6)
  doc.line(margin, yPosition + 17, pageWidth - margin, yPosition + 17)
  yPosition += 20

  doc.setTextColor(200, 200, 200)
  doc.setFontSize(14)
  doc.setFont("helvetica", "normal")
  doc.text("Ihr Unternehmer-Profil auf einen Blick", margin, yPosition)
  yPosition += 12

  // Unternehmertyp anzeigen
  doc.setTextColor(250, 230, 8)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text(result.entrepreneurType, margin, yPosition)
  yPosition += 15

  const profile = typeProfiles[result.entrepreneurType]
  if (profile) {
    addText("Was Ihr Ergebnis bedeutet:", 12, true)
    addText(profile.charakter, 11)
    yPosition += 10

    // Strength Box with accent border - DYNAMISCHE HOEHE
    const strengthBoxY = yPosition
    doc.setFontSize(11)
    const strengthLines = doc.splitTextToSize(profile.staerken, pageWidth - margin * 2 - 20)
    const strengthBoxHeight = 22 + strengthLines.length * 5
    
    doc.setFillColor(250, 230, 8)
    doc.rect(margin, strengthBoxY, 4, strengthBoxHeight, "F")
    doc.setFillColor(40, 35, 20)
    doc.roundedRect(margin + 4, strengthBoxY, pageWidth - margin * 2 - 4, strengthBoxHeight, 0, 0, "F")
    
    doc.setTextColor(250, 230, 8)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Ihre Top-Stärken:", margin + 10, strengthBoxY + 12)
    
    doc.setTextColor(220, 220, 220)
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(strengthLines, margin + 10, strengthBoxY + 20)
    yPosition = strengthBoxY + strengthBoxHeight + 5

    // Risk Box with accent border - DYNAMISCHE HOEHE
    const riskBoxY = yPosition
    doc.setFontSize(11)
    const riskLines = doc.splitTextToSize(profile.risiken, pageWidth - margin * 2 - 20)
    const riskBoxHeight = 22 + riskLines.length * 5
    
    doc.setFillColor(250, 230, 8)
    doc.rect(margin, riskBoxY, 4, riskBoxHeight, "F")
    doc.setFillColor(40, 35, 20)
    doc.roundedRect(margin + 4, riskBoxY, pageWidth - margin * 2 - 4, riskBoxHeight, 0, 0, "F")
    
    doc.setTextColor(250, 230, 8)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Typische Risiken:", margin + 10, riskBoxY + 12)
    
    doc.setTextColor(220, 220, 220)
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(riskLines, margin + 10, riskBoxY + 20)
    yPosition = riskBoxY + riskBoxHeight + 5

    // Development Box with accent border - DYNAMISCHE HOEHE
    const devBoxY = yPosition
    doc.setFontSize(11)
    const devLines = doc.splitTextToSize(profile.entwicklung, pageWidth - margin * 2 - 20)
    const devBoxHeight = 22 + devLines.length * 5
    
    doc.setFillColor(250, 230, 8)
    doc.rect(margin, devBoxY, 4, devBoxHeight, "F")
    doc.setFillColor(40, 35, 20)
    doc.roundedRect(margin + 4, devBoxY, pageWidth - margin * 2 - 4, devBoxHeight, 0, 0, "F")
    
    doc.setTextColor(250, 230, 8)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Strategischer Entwicklungsfokus:", margin + 10, devBoxY + 12)
    
    doc.setTextColor(220, 220, 220)
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(devLines, margin + 10, devBoxY + 20)
    yPosition = devBoxY + devBoxHeight + 5
  }

  // ==================== PAGE 3: SCORING OVERVIEW ====================
  addPageBreak()
  pageNumber++

  addText("Ihre 360° Kompetenz-Übersicht als Unternehmer", 22, true, [250, 230, 8])
  yPosition += 10

  // Einleitungstext
  doc.setTextColor(203, 213, 225)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const introText = "Der Wingman Mittelstandsindex verbindet drei essenzielle Perspektiven für nachhaltigen unternehmerischen Erfolg: die klare Sicht auf Zahlen und Struktur, die bewusste Führung von Menschen und die wirkungsvolle Positionierung am Markt."
  const introLines = doc.splitTextToSize(introText, pageWidth - margin * 2)
  doc.text(introLines, margin, yPosition)
  yPosition += introLines.length * 5 + 8

  // Wingman Mittelstandsindex Box
  const score = (result as any).wingmanIndex || result.overallScore
  const subtitle = (result as any).indexSubtitle || ""
  
  doc.setFillColor(250, 230, 8)
  doc.rect(margin, yPosition, 4, 35, "F")
  doc.setFillColor(40, 35, 20)
  doc.roundedRect(margin + 4, yPosition, pageWidth - margin * 2 - 4, 35, 0, 0, "F")
  
  doc.setTextColor(148, 163, 184)
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text("/ WINGMAN MITTELSTANDSINDEX /", margin + 10, yPosition + 10)
  
  doc.setTextColor(250, 230, 8)
  doc.setFontSize(28)
  doc.setFont("helvetica", "bold")
  doc.text(score.toString(), margin + 10, yPosition + 25)
  
  doc.setTextColor(220, 220, 220)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  if (subtitle) {
    doc.text(subtitle, margin + 50, yPosition + 25, { maxWidth: pageWidth - margin * 2 - 60 })
  }
  
  yPosition += 45

  // Die 3 Wingman-Perspektiven
  addText("Die 3 Wingman-Perspektiven", 16, true, [250, 230, 8])
  yPosition += 5
  
  doc.setTextColor(148, 163, 184)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(
    "Ihre Analyse basiert auf drei professionellen Perspektiven, die zusammen ein ganzheitliches Bild ergeben:",
    margin,
    yPosition,
    { maxWidth: pageWidth - margin * 2 }
  )
  yPosition += 15

  // Perspektive 1: Unternehmer
  doc.setFillColor(59, 130, 246)
  doc.rect(margin, yPosition, 3, 25, "F")
  doc.setFillColor(20, 30, 50)
  doc.roundedRect(margin + 3, yPosition, (pageWidth - margin * 2 - 6) / 3 - 2, 25, 0, 0, "F")
  doc.setTextColor(59, 130, 246)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Unternehmer-Perspektive", margin + 8, yPosition + 8)
  doc.setTextColor(203, 213, 225)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text("Zahlen, Struktur, Steuerung,", margin + 8, yPosition + 14)
  doc.text("wirtschaftliche Realität", margin + 8, yPosition + 19)

  // Perspektive 2: Coach
  const col2X = margin + (pageWidth - margin * 2) / 3
  doc.setFillColor(168, 85, 247)
  doc.rect(col2X, yPosition, 3, 25, "F")
  doc.setFillColor(20, 30, 50)
  doc.roundedRect(col2X + 3, yPosition, (pageWidth - margin * 2 - 6) / 3 - 2, 25, 0, 0, "F")
  doc.setTextColor(168, 85, 247)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Coach-Perspektive", col2X + 8, yPosition + 8)
  doc.setTextColor(203, 213, 225)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text("Haltung, Bewusstsein,", col2X + 8, yPosition + 14)
  doc.text("Führung, innere Stabilität", col2X + 8, yPosition + 19)

  // Perspektive 3: Sales
  const col3X = margin + ((pageWidth - margin * 2) / 3) * 2
  doc.setFillColor(34, 197, 94)
  doc.rect(col3X, yPosition, 3, 25, "F")
  doc.setFillColor(20, 30, 50)
  doc.roundedRect(col3X + 3, yPosition, (pageWidth - margin * 2 - 6) / 3 - 2, 25, 0, 0, "F")
  doc.setTextColor(34, 197, 94)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Sales-Perspektive", col3X + 8, yPosition + 8)
  doc.setTextColor(203, 213, 225)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text("Markt, Wachstum, Umsetzung,", col3X + 8, yPosition + 14)
  doc.text("Wirkung nach außen", col3X + 8, yPosition + 19)

  yPosition += 35

  // NEUE SEITE NUR FÜR BALKEN
  addPageBreak()
  pageNumber++

  addText(
    "Diese Analyse bewertet sechs zentrale Kompetenzbereiche, die für nachhaltigen unternehmerischen Erfolg entscheidend sind.",
    11,
  )
  yPosition += 10

  result.categoryScores.forEach((cat) => {
    // Kein checkPageBreak - alle Balken bleiben auf einer Seite

    addText(`${cat.category}`, 11, true)

    // Bar chart - kompakter
    doc.setFillColor(220, 220, 220)
    doc.roundedRect(margin, yPosition, pageWidth - margin * 2 - 30, 6, 0, 0, "F")

    const barWidth = ((pageWidth - margin * 2 - 30) * cat.percentage) / 100

    // Score-basierte Farben: Grün (>80), Gelb/Orange (60-80), Rot (<60)
    if (cat.percentage >= 80) {
      doc.setFillColor(34, 197, 94) // Grün
    } else if (cat.percentage >= 60) {
      doc.setFillColor(245, 158, 11) // Orange/Gelb
    } else {
      doc.setFillColor(239, 68, 68) // Rot
    }

    doc.roundedRect(margin, yPosition, barWidth, 6, 0, 0, "F")

    // Score text
    doc.setTextColor(250, 230, 8)
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text(`${cat.percentage}%`, pageWidth - margin - 20, yPosition + 5)

    yPosition += 12
  })

  // ==================== PAGE 4-7: DETAILED CATEGORY ANALYSIS ====================
  result.categoryScores.forEach((cat, index) => {
    addPageBreak()
    pageNumber++

    addText(`Kompetenzbereich ${index + 1}: ${cat.category}`, 18, true, [250, 230, 8])
    yPosition += 5

    // Score circle
    const circleX = pageWidth - margin - 30
    const circleY = yPosition + 15

    if (cat.percentage >= 70) {
      doc.setFillColor(34, 197, 94)
    } else if (cat.percentage >= 50) {
      doc.setFillColor(255, 215, 0)
    } else {
      doc.setFillColor(239, 68, 68)
    }

    doc.circle(circleX, circleY, 20, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text(`${cat.percentage}`, circleX, circleY + 2, { align: "center" })
    doc.setFontSize(10)
    doc.text("%", circleX, circleY + 10, { align: "center" })

    yPosition += 40

    // Detailed interpretation
    checkPageBreak(50)
    addText("Spiegel (was zeigen Ihre Antworten):", 12, true)

    if (cat.percentage >= 80) {
      addText(
        `Sie zeigen außergewöhnliche Stärke in diesem Bereich. Sie verfügen über ein hohes Maß an Kompetenz und sind in der Lage, in diesem Bereich eine Vorbildfunktion einzunehmen.`,
        11,
      )
    } else if (cat.percentage >= 70) {
      addText(
        `Sie sind in diesem Bereich stark aufgestellt. Ihre Kompetenzen sind überdurchschnittlich und tragen wesentlich zu Ihrem unternehmerischen Erfolg bei.`,
        11,
      )
    } else if (cat.percentage >= 50) {
      addText(
        `Sie verfügen über solide Grundlagen in diesem Bereich. Es gibt erkennbares Potenzial für gezielte Weiterentwicklung und Optimierung.`,
        11,
      )
    } else {
      addText(
        `Dieser Bereich bietet signifikantes Entwicklungspotenzial. Gezielte Maßnahmen können hier spürbare Verbesserungen für Ihr Unternehmen bringen.`,
        11,
      )
    }

    yPosition += 10

    // Category-specific insights
    checkPageBreak(60)
    addText("Einordnung (warum ist das relevant?):", 12, true, [250, 230, 8])

    const categoryInsights: { [key: string]: { high: string; medium: string; low: string } } = {
      "Unternehmerisches Denken": {
        high: "Sie denken strategisch, erkennen Chancen früh und treffen klare unternehmerische Entscheidungen. Ihre Vision gibt Orientierung und Sie nutzen Marktveränderungen proaktiv zu Ihrem Vorteil. Sie haben eine klare Zukunftsvision für Ihr Unternehmen und können Ihre Strategie präzise kommunizieren.",
        medium:
          "Sie haben ein grundlegendes strategisches Verständnis und können kurzfristige Entscheidungen gut treffen. Mit mehr Klarheit in Vision und Prioritäten können Sie noch gezielter führen. Die Entwicklung einer langfristigen Strategie und das konsequente Verfolgen von Innovationen würden Ihr Wachstum beschleunigen.",
        low: "Strategische Klarheit und langfristige Planung sind aktuell Herausforderungen. Sie reagieren oft auf Ereignisse statt sie aktiv zu gestalten. Hier liegt großes Potenzial für Wachstum durch strukturierte Strategieentwicklung und klarere Priorisierung.",
      },
      "Leadership & Führung + Emotionen": {
        high: "Sie führen klar, delegieren wirksam und entwickeln Ihr Team gezielt. Ihre Führung schafft Orientierung und Leistung. Sie haben eine ausgeprägte Feedback-Kultur etabliert und fördern aktiv die Eigenverantwortung Ihrer Mitarbeiter. Ihre emotionale Intelligenz und Führungskompetenz sind strategische Wettbewerbsvorteile.",
        medium:
          "Sie übernehmen Führung und haben ein funktionierendes Team aufgebaut, könnten aber noch klarer delegieren und Verantwortung übertragen. Mehr Struktur in Führungsprozessen bringt Entlastung. Die Entwicklung Ihrer emotionalen Selbstregulation und der Aufbau einer stärkeren Vertrauenskultur würden Ihre Skalierung ermöglichen.",
        low: "Führung und Delegation sind noch entwicklungsbedürftig. Sie tendieren dazu, viele Aufgaben selbst zu übernehmen. Gezielte Arbeit an Ihrem Führungsstil, emotionaler Selbstreflexion und strukturierte Delegation bringen schnelle Verbesserungen und schaffen Ihnen mehr Freiraum.",
      },
      "Vertrieb & Wachstum": {
        high: "Sie sind vertriebsstark, kundenorientiert und schaffen systematisch Umsatz. Ihr Unternehmen wächst durch aktive Marktbearbeitung und Sie haben einen funktionierenden Sales-Prozess etabliert. Sie verstehen Ihre Zielgruppe genau, haben klare Verkaufsargumente und können Einwände souverän behandeln. Ihre Abschlussquote liegt über dem Branchendurchschnitt und Sie generieren regelmäßig qualifizierte Leads. Sie haben erkannt, dass Vertrieb planbar sein muss und handeln entsprechend.",
        medium:
          "Sie generieren Umsatz und haben grundlegende Vertriebsstrukturen, könnten aber noch systematischer und fokussierter agieren. Ihr Verkaufsprozess ist nicht vollständig dokumentiert und die Conversion-Raten schwanken. Sie verlassen sich noch zu oft auf Empfehlungen und Bestandskunden statt aktiv neue Märkte zu erschließen. Ein strukturierter Sales-Funnel mit klaren KPIs und regelmäßigem Pipeline-Review würde Ihr Wachstum deutlich beschleunigen.",
        low: "Vertrieb und Kundenakquise sind aktuell deutliche Schwachstellen, die Ihr Wachstum limitieren. Sie haben keinen systematischen Verkaufsprozess und reagieren eher auf Anfragen als aktiv zu akquirieren. Die Abhängigkeit von wenigen Großkunden oder Empfehlungen ist riskant. Hier liegt der größte Hebel für Ihr Unternehmen: Ein professioneller Vertriebsaufbau kann Ihren Umsatz innerhalb von 12 Monaten verdoppeln.",
      },
      "Selbstmanagement & Resilienz": {
        high: "Sie managen sich selbst effektiv, bleiben auch unter Druck handlungsfähig und achten bewusst auf Ihre Energie. Das schafft Nachhaltigkeit. Sie haben klare Routinen etabliert, priorisieren konsequent und schaffen Balance zwischen Arbeit und Erholung. Ihre emotionale Stabilität ist eine Stärke.",
        medium:
          "Sie bewältigen den Alltag und haben grundlegende Strukturen, spüren aber zunehmend Belastung. Besseres Selbstmanagement durch klare Prioritäten, bewusste Pausen und emotionale Reflexion schafft mehr Freiraum und Energie. Der Aufbau von Resilienz-Routinen würde Ihre Leistungsfähigkeit nachhaltig steigern.",
        low: "Hohe Belastung, fehlende Struktur und reaktives Handeln kosten Sie massiv Energie. Sie agieren oft im Autopilot-Modus. Gezielte Arbeit an Selbstführung, Priorisierung und emotionaler Regulation bringt schnelle Entlastung und gibt Ihnen die Kontrolle zurück.",
      },
      "Finanzen & Controlling": {
        high: "Sie steuern Ihr Unternehmen über Zahlen, haben Liquidität im Griff und treffen datenbasierte Entscheidungen. Sie kennen Ihre Deckungsbeiträge pro Produkt/Dienstleistung, haben eine 13-Wochen-Liquiditätsplanung und arbeiten mit klaren KPIs. Ihr Finanzcontrolling gibt Ihnen Sicherheit und ermöglicht strategische Investitionen zum richtigen Zeitpunkt. Sie wissen genau, welche Kunden und Projekte profitabel sind.",
        medium:
          "Sie haben grundlegendes Finanzcontrolling und Ihre Buchhaltung ist aktuell, aber Sie könnten systematischer mit Kennzahlen arbeiten. Ihnen fehlt oft der schnelle Überblick über Liquidität und Profitabilität. Entscheidungen treffen Sie manchmal aus dem Bauch heraus statt zahlenbasiert. Ein monatliches Controlling-Dashboard mit den 5 wichtigsten KPIs würde Ihre Entscheidungsqualität deutlich verbessern.",
        low: "Finanzcontrolling und Liquiditätsmanagement sind deutliche Schwachstellen. Sie wissen oft nicht genau, wie es finanziell um Ihr Unternehmen steht. Entscheidungen treffen Sie ohne solide Zahlenbasis, was zu teuren Fehlern führen kann. Hier liegt ein kritischer Hebel: Ohne Finanztransparenz fliegen Sie blind und riskieren die Existenz Ihres Unternehmens.",
      },
      "Marketing & Marke": {
        high: "Sie haben eine starke, differenzierte Marke und systematisches Marketing mit messbarer Lead-Generierung. Sie wissen genau, welche Kanäle funktionieren und investieren dort gezielt. Ihre Positionierung ist klar, Ihre Botschaften treffen den Nerv Ihrer Zielgruppe. Sie generieren regelmäßig qualifizierte Leads und können den ROI Ihrer Marketing-Investitionen beziffern. Ihre Marke ist ein echtes Asset.",
        medium:
          "Sie machen Marketing und sind sichtbar, aber Ihre Aktivitäten könnten strategischer und messbarer sein. Ihnen fehlt eine klare Content-Strategie und Sie verteilen Ihre Ressourcen auf zu viele Kanäle gleichzeitig. Die Positionierung Ihrer Marke ist nicht scharf genug, um sich deutlich vom Wettbewerb abzuheben. Eine Fokussierung auf 2-3 Kernkanäle mit klaren KPIs würde Ihre Marketing-Effizienz verdoppeln.",
        low: "Marketing und Markenführung sind aktuell große Baustellen. Sie sind kaum sichtbar, haben keine klare Positionierung und generieren keine systematischen Leads. Ihr Unternehmen ist austauschbar und konkurriert primär über den Preis. Hier liegt enormes ungenutztes Potenzial: Eine klare Marke und systematisches Marketing können Ihre Anfragen vervielfachen.",
      },
    }

    // Safely access category insights with fallback
    const categoryData = categoryInsights[cat.category]
    let insight = ""
    
    if (categoryData) {
      insight =
        cat.percentage >= 70
          ? categoryData.high
          : cat.percentage >= 50
            ? categoryData.medium
            : categoryData.low
    } else {
      // Fallback text if category not found in insights
      insight = cat.percentage >= 70
        ? `Sie zeigen in diesem Bereich eine starke Leistung. Nutzen Sie diese Stärke als Fundament für weiteres Wachstum.`
        : cat.percentage >= 50
          ? `Sie haben hier eine solide Basis, aber es gibt noch Potenzial für Verbesserungen und gezielte Entwicklung.`
          : `Dieser Bereich bietet signifikantes Entwicklungspotenzial. Gezielte Maßnahmen können hier spürbare Verbesserungen bringen.`
    }

    addText(insight, 11)
    yPosition += 10

    // Specific recommendations
    checkPageBreak(40)
    addText("Konkrete Ansatzpunkte:", 12, true, [59, 130, 246])

    const states = typeStatesAndActions[result.entrepreneurType]
    if (states && states[cat.category]) {
      addText(`Typischer Zustand: ${states[cat.category].state}`, 11)
      yPosition += 5
      addText(`Empfohlene Handlung: ${states[cat.category].handlung}`, 11, false, [34, 197, 94])
    }
  })

  // ==================== PAGE 8: AI INSIGHTS (Premium only) ====================
  if (isPremium && aiInsights) {
    addPageBreak()
    pageNumber++

    doc.setFillColor(59, 130, 246)
    doc.rect(margin - 5, yPosition - 5, pageWidth - margin * 2 + 10, 25, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("Wingman KI-Gestützte Analyse", margin, yPosition + 10)

    yPosition += 30

    doc.setTextColor(0, 0, 0)
    addText(
      "Basierend auf Ihren individuellen Antworten und Ihrem spezifischen Antwortmuster haben wir eine personalisierte Analyse erstellt:",
      10,
      false,
      [100, 100, 100],
    )
    yPosition += 5

    // AI Insights - Parse JSON und formatiere schön
    try {
      const aiData = JSON.parse(aiInsights)
      
      // Helper function to add section header
      const addSectionHeader = (title: string) => {
        checkPageBreak(40)
        doc.setFillColor(40, 40, 40)
        doc.roundedRect(margin, yPosition, pageWidth - margin * 2, 12, 0, 0, "F")
        doc.setTextColor(250, 230, 8)
        doc.setFontSize(13)
        doc.setFont("helvetica", "bold")
        doc.text(title, margin + 5, yPosition + 8)
        yPosition += 20
      }
      
      // Helper function to add paragraph text
      const addParagraph = (text: string) => {
        checkPageBreak(30)
        doc.setTextColor(220, 220, 220)
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        const wrappedLines = doc.splitTextToSize(text, pageWidth - margin * 2)
        doc.text(wrappedLines, margin, yPosition)
        yPosition += wrappedLines.length * 5 + 8
      }
      
      // Helper function to add bullet point
      const addBullet = (text: string, indent = 0) => {
        checkPageBreak(20)
        doc.setTextColor(200, 200, 200)
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        const wrappedLines = doc.splitTextToSize(text, pageWidth - margin * 2 - 15 - indent)
        doc.text("•", margin + indent, yPosition)
        doc.text(wrappedLines, margin + 8 + indent, yPosition)
        yPosition += wrappedLines.length * 5 + 4
      }
      
      // 1. Executive Summary
      if (aiData.executiveSummary) {
        addSectionHeader("Executive Summary")
        addParagraph(aiData.executiveSummary)
        yPosition += 5
      }
      
      // 2. Stärken
      if (aiData.strengths && aiData.strengths.length > 0) {
        addSectionHeader("Ihre Top-Stärken")
        aiData.strengths.forEach((s: { title: string; description: string; businessImpact?: string; developmentTip?: string }, i: number) => {
          checkPageBreak(50)
          doc.setTextColor(34, 197, 94)
          doc.setFontSize(11)
          doc.setFont("helvetica", "bold")
          doc.text(`${i + 1}. ${s.title}`, margin, yPosition)
          yPosition += 8
          
          if (s.description) addParagraph(s.description)
          if (s.developmentTip) {
            doc.setTextColor(34, 197, 94)
            doc.setFontSize(9)
            doc.setFont("helvetica", "bold")
            doc.text("Nutzen Sie diese Stärke:", margin, yPosition)
            yPosition += 5
            addBullet(s.developmentTip, 5)
          }
          yPosition += 5
        })
      }
      
      // 3. Entwicklungsbereiche
      if (aiData.developmentAreas && aiData.developmentAreas.length > 0) {
        checkPageBreak(30)
        addSectionHeader("Entwicklungsbereiche")
        aiData.developmentAreas.forEach((d: { title: string; analysis: string; risks?: string; roi?: string; firstSteps?: string }, i: number) => {
          checkPageBreak(25)
          doc.setTextColor(239, 68, 68)
          doc.setFontSize(11)
          doc.setFont("helvetica", "bold")
          doc.text(`${i + 1}. ${d.title}`, margin, yPosition)
          yPosition += 8
          
          if (d.analysis) addParagraph(d.analysis)
          if (d.risks) addBullet(`Risiko: ${d.risks}`, 5)
          if (d.roi) addBullet(`${d.roi}`, 5)
          if (d.firstSteps) addBullet(`Erste Schritte: ${d.firstSteps}`, 5)
          yPosition += 5
        })
      }
      
  // 4. Pattern Insights
  if (aiData.patternInsights && aiData.patternInsights.length > 0) {
  checkPageBreak(20)
  addSectionHeader("Erkannte Muster")
  aiData.patternInsights.forEach((insight: string) => {
  addBullet(insight)
  })
  yPosition += 5
  }
  
  // 5. Action Plan
  if (aiData.actionPlan) {
  addPageBreak()
  pageNumber++
  addSectionHeader("90-Tage Aktionsplan")
        
        if (aiData.actionPlan.shortTerm && aiData.actionPlan.shortTerm.length > 0) {
          doc.setTextColor(34, 197, 94)
          doc.setFontSize(11)
          doc.setFont("helvetica", "bold")
          doc.text("Kurzfristig (0-30 Tage):", margin, yPosition)
          yPosition += 8
          aiData.actionPlan.shortTerm.forEach((action: string) => addBullet(action, 5))
          yPosition += 5
        }
        
        if (aiData.actionPlan.mediumTerm && aiData.actionPlan.mediumTerm.length > 0) {
          checkPageBreak(40)
          doc.setTextColor(250, 230, 8)
          doc.setFontSize(11)
          doc.setFont("helvetica", "bold")
          doc.text("Mittelfristig (30-60 Tage):", margin, yPosition)
          yPosition += 8
          aiData.actionPlan.mediumTerm.forEach((action: string) => addBullet(action, 5))
          yPosition += 5
        }
        
        if (aiData.actionPlan.longTerm && aiData.actionPlan.longTerm.length > 0) {
          checkPageBreak(40)
          doc.setTextColor(100, 149, 237)
          doc.setFontSize(11)
          doc.setFont("helvetica", "bold")
          doc.text("Langfristig (60-90 Tage):", margin, yPosition)
          yPosition += 8
          aiData.actionPlan.longTerm.forEach((action: string) => addBullet(action, 5))
        }
      }
      
  // 7. Wingman Empfehlung
  if (aiData.recommendations?.wingmanProgram) {
  checkPageBreak(40)
  addSectionHeader("Empfohlenes Wingman Programm")
        const wp = aiData.recommendations.wingmanProgram
        doc.setTextColor(250, 230, 8)
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text(wp.primary || "MASTERCLASS CONSULTING", margin, yPosition)
        yPosition += 10
        if (wp.reason) addParagraph(wp.reason)
        if (wp.expectedOutcome) {
          doc.setTextColor(34, 197, 94)
          doc.setFontSize(10)
          doc.setFont("helvetica", "bold")
          doc.text("Erwartetes Ergebnis:", margin, yPosition)
          yPosition += 6
          addParagraph(wp.expectedOutcome)
        }
      }
      
    } catch {
      // Fallback: If JSON parsing fails, show as plain text
      doc.setTextColor(220, 220, 220)
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const cleanText = aiInsights.replace(/[{}"]/g, "").replace(/,/g, "\n")
      const wrappedLines = doc.splitTextToSize(cleanText, pageWidth - margin * 2)
      wrappedLines.forEach((line: string) => {
        checkPageBreak(15)
        doc.text(line, margin, yPosition)
        yPosition += 6
      })
    }
  }

  // ==================== PAGE 9: STRENGTHS & DEVELOPMENT AREAS ====================
  addPageBreak()
  pageNumber++

  addText("Ihre Stärken & Entwicklungsbereiche", 22, true, [250, 230, 8])
  yPosition += 10

  // Strengths
  doc.setFillColor(34, 197, 94)
  doc.roundedRect(margin, yPosition, pageWidth - margin * 2, 8, 0, 0, "F")
  yPosition += 6
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Ihre ausgeprägten Stärken", margin + 5, yPosition)
  yPosition += 15

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  
  const strengthsIntro = `Ihre Stärken sind die tragenden Säulen Ihres unternehmerischen Erfolgs. Sie zeigen, wo Sie bereits Exzellenz erreicht haben und worauf Sie aufbauen können. Diese Bereiche geben Ihnen Sicherheit und Wettbewerbsvorteile – nutzen Sie sie bewusst als Fundament für weiteres Wachstum.`
  
  const strengthsIntroLines = doc.splitTextToSize(strengthsIntro, pageWidth - margin * 2 - 4)
  doc.text(strengthsIntroLines, margin + 2, yPosition)
  yPosition += strengthsIntroLines.length * 4 + 12
  
  // Spezifische Beschreibungen für jede Stärke
  const strengthDescriptions: { [key: string]: string } = {
    "Strategisches Denken und Innovationskraft": "Sie erkennen Marktchancen früher als andere und können komplexe Zusammenhänge schnell erfassen. Nutzen Sie diese Fähigkeit, um Ihrer Konkurrenz 2-3 Schritte voraus zu sein. Konkret: Reservieren Sie wöchentlich 2 Stunden für strategische Marktanalyse.",
    "Führungskompetenz, emotionale Intelligenz und Teamdevelopment": "Sie schaffen es, Mitarbeiter zu motivieren und zu entwickeln. Teams unter Ihrer Führung erreichen überdurchschnittliche Ergebnisse. Konkret: Bauen Sie ein Mentoring-Programm auf, in dem Sie Ihre Führungsqualitäten multiplizieren.",
    "Vertriebsstärke und Wachstumsorientierung": "Sie verstehen Kundenbedürfnisse intuitiv und können Abschlüsse erzielen. Diese Fähigkeit ist der direkte Weg zu planbarem Wachstum. Wer Vertrieb beherrscht, kontrolliert sein Schicksal. Wer Vertrieb vernachlässigt, ist abhängig vom Zufall.",
    "Selbstorganisation und mentale Stärke": "Sie bleiben auch unter Druck fokussiert und leistungsfähig. Diese Resilienz ist in Krisenzeiten Gold wert. Konkret: Teilen Sie Ihre Routinen und Methoden mit Ihrem Führungsteam.",
    "Finanzielle Steuerung und Kennzahlenorientierung": "Sie treffen Entscheidungen auf Basis von Fakten und Zahlen. Das minimiert Risiken und maximiert Rendite. Konkret: Etablieren Sie ein monatliches Kennzahlen-Review mit Ihrem Team.",
    "Markenführung und Marketingexzellenz": "Sie verstehen, wie man eine Marke aufbaut und positioniert. Das schafft langfristige Kundenbindung. Konkret: Entwickeln Sie eine Content-Strategie, die Ihre Expertise sichtbar macht."
  }
  
  result.strengths.forEach((strength, index) => {
    checkPageBreak()
    addText(`${index + 1}. ${strength}`, 12, true, [34, 197, 94])
    const description = strengthDescriptions[strength] || "Diese Stärke ist ein wichtiger Erfolgsfaktor für Ihr Unternehmen. Entwickeln Sie sie systematisch weiter und machen Sie sie zu Ihrem Wettbewerbsvorteil."
    addText(description, 11)
    yPosition += 8
  })

  yPosition += 10

  // Development Areas
  doc.setFillColor(239, 68, 68)
  doc.roundedRect(margin, yPosition, pageWidth - margin * 2, 8, 0, 0, "F")
  yPosition += 6
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Ihre Entwicklungsbereiche", margin + 5, yPosition)
  yPosition += 15

  doc.setTextColor(0, 0, 0)
  result.developmentAreas.forEach((area, index) => {
    checkPageBreak()
    addText(`${index + 1}. ${area}`, 12, true, [239, 68, 68])
    addText(
      "Hier liegt signifikantes Potenzial. Gezielte Maßnahmen in diesem Bereich können spürbare Verbesserungen für Ihr Unternehmen bringen.",
      11,
    )
    yPosition += 8
  })

  yPosition += 15

  // ==================== PAGE 10: ACTION PLAN ====================
  addPageBreak()
  pageNumber++

  addText("Ihr strategischer Entwicklungsplan", 22, true, [250, 230, 8])
  yPosition += 10

  addText("Basierend auf Ihrer Analyse empfehlen wir folgende priorisierte Vorgehensweise:", 11)
  yPosition += 10

  // Priority 1
  const circleX1 = margin + 8
  const circleY1 = yPosition + 8
  doc.setFillColor(255, 215, 0)
  doc.circle(circleX1, circleY1, 8, "F")
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("1", circleX1, circleY1 + 0.5, { align: "center", baseline: "middle" })

  doc.setFontSize(11)
  doc.setTextColor(203, 213, 225)
  doc.text("Priorität 1: Fundament stabilisieren", margin + 25, circleY1 + 1)
  yPosition += 22

  addText(
    `Fokussieren Sie sich zunächst auf Ihre größte Entwicklungsbaustelle: ${result.developmentAreas[0]}. Eine starke Basis in allen vier Bereichen ist Voraussetzung für nachhaltiges Wachstum.`,
    11,
  )
  yPosition += 12

  // Priority 2
  const circleX2 = margin + 8
  const circleY2 = yPosition + 8
  doc.setFillColor(200, 200, 200)
  doc.circle(circleX2, circleY2, 8, "F")
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("2", circleX2, circleY2 + 0.5, { align: "center", baseline: "middle" })

  doc.setFontSize(11)
  doc.setTextColor(203, 213, 225)
  doc.text("Priorität 2: Stärken ausbauen", margin + 25, circleY2 + 1)
  yPosition += 22

  addText(
    `Bauen Sie parallel Ihre Stärken weiter aus: ${result.strengths[0]}. Exzellenz in Ihren Stärkenbereichen schafft Wettbewerbsvorteile.`,
    11,
  )
  yPosition += 12

  // Priority 3
  const circleX3 = margin + 8
  const circleY3 = yPosition + 8
  doc.setFillColor(200, 200, 200)
  doc.circle(circleX3, circleY3, 8, "F")
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("3", circleX3, circleY3 + 0.5, { align: "center", baseline: "middle" })

  doc.setFontSize(11)
  doc.setTextColor(203, 213, 225)
  doc.text("Priorität 3: Gesamtsystem optimieren", margin + 25, circleY3 + 1)
  yPosition += 22

  addText(
    "Sobald die Basis steht und Ihre Stärken geschärft sind, arbeiten Sie an der Optimierung des Gesamtsystems. Hier liegt der Hebel für Skalierung.",
    11,
  )
  yPosition += 15

  // Action Plan Box - DYNAMISCHE HOEHE
  const actionBoxY = yPosition
  const actionSteps = [
    "1. Reflektieren Sie diese Analyse mit einem externen Sparringspartner",
    "2. Definieren Sie konkrete Maßnahmen für Ihre Top-Priorität",
    "3. Planen Sie einen Review-Termin in 90 Tagen"
  ]
  const actionBoxHeight = 18 + actionSteps.length * 7
  
  doc.setFillColor(30, 30, 30)
  doc.roundedRect(margin, actionBoxY, pageWidth - margin * 2, actionBoxHeight, 0, 0, "F")
  
  doc.setTextColor(59, 130, 246)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Empfohlene nächste Schritte:", margin + 5, actionBoxY + 12)
  
  doc.setTextColor(220, 220, 220)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  actionSteps.forEach((step, i) => {
    doc.text(step, margin + 5, actionBoxY + 20 + i * 7)
  })
  yPosition = actionBoxY + actionBoxHeight + 5

  // ==================== PAGES 11-14: DETAILLED STATES & HANDLUNGEN PER PERSPECTIVE ====================
  const statesData = typeStatesAndActions[result.entrepreneurType]
  if (statesData) {
    result.categoryScores.forEach((cat) => {
      addPageBreak()
      pageNumber++

      // Header with category
      doc.setTextColor(250, 230, 8)
      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text("/ KOMPETENZBEREICH /", margin, yPosition)
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.text(`${cat.category}`, margin, yPosition + 12)
      doc.setDrawColor(250, 230, 8)
      doc.setLineWidth(0.6)
      doc.line(margin, yPosition + 17, pageWidth - margin, yPosition + 17)
      yPosition += 30

      doc.setTextColor(100, 116, 139)
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text("Detaillierte Analyse für:", margin, yPosition)
      yPosition += 6
      doc.text(result.entrepreneurType, margin, yPosition)
      yPosition += 12

      const categoryState = statesData[cat.category]
      if (categoryState) {
        // Typischer State Box - DYNAMISCHE HÖHE
        const stateBoxStartY = yPosition
        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)
        const stateLines = doc.splitTextToSize(categoryState.state, pageWidth - margin * 2 - 20)
        const stateBoxHeight = 20 + stateLines.length * 6
        
        doc.setFillColor(250, 230, 8)
        doc.rect(margin, stateBoxStartY, 4, stateBoxHeight, "F")
        doc.setFillColor(30, 28, 20)
        doc.roundedRect(margin + 4, stateBoxStartY, pageWidth - margin * 2 - 4, stateBoxHeight, 0, 0, "F")
        
        doc.setTextColor(250, 230, 8)
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text("Ihr typischer emotionaler Zustand:", margin + 10, stateBoxStartY + 10)
        
        doc.setTextColor(220, 220, 220)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)
        doc.text(stateLines, margin + 10, stateBoxStartY + 18)
        yPosition = stateBoxStartY + stateBoxHeight + 10

        // Handlung Box - DYNAMISCHE HÖHE (perfekt angepasst)
        const handlungBoxStartY = yPosition
        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)
        const handlungLines = doc.splitTextToSize(categoryState.handlung, pageWidth - margin * 2 - 20)
        const handlungBoxHeight = 20 + handlungLines.length * 6
        
        doc.setFillColor(250, 230, 8)
        doc.rect(margin, handlungBoxStartY, 4, handlungBoxHeight, "F")
        doc.setFillColor(40, 35, 20)
        doc.roundedRect(margin + 4, handlungBoxStartY, pageWidth - margin * 2 - 4, handlungBoxHeight, 0, 0, "F")
        
        doc.setTextColor(250, 230, 8)
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text("Empfohlene konkrete Handlung:", margin + 10, handlungBoxStartY + 10)
        
        doc.setTextColor(220, 220, 220)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)
        doc.text(handlungLines, margin + 10, handlungBoxStartY + 18)
        yPosition = handlungBoxStartY + handlungBoxHeight + 15

        // Warum das wichtig ist
        doc.setTextColor(250, 230, 8)
        doc.setFontSize(13)
        doc.setFont("helvetica", "bold")
        doc.text("Warum das für Sie entscheidend ist:", margin, yPosition)
        yPosition += 10

        doc.setTextColor(220, 220, 220)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)
        
        let whyImportant = ""
        if (cat.category === "Unternehmerisches Denken") {
          whyImportant = "Klares unternehmerisches Denken ist das Fundament für alle strategischen Entscheidungen. Ohne Klarheit in der Vision bleiben Sie im Reaktionsmodus statt im Gestaltungsmodus. Wer seine Richtung kennt, trifft schnellere und bessere Entscheidungen."
        } else if (cat.category === "Leadership & Führung + Emotionen") {
          whyImportant = "Ihr Team ist Ihr wichtigster Hebel für Wachstum. Gute Führung entlastet Sie und schafft Raum für strategische Arbeit. Schlechte Führung bindet Ihre Zeit und limitiert Skalierung. Die Qualität Ihrer Führung und Ihre emotionale Intelligenz bestimmen die Qualität Ihres Unternehmens."
        } else if (cat.category === "Vertrieb & Wachstum") {
          whyImportant = "Ohne Vertrieb kein Umsatz, ohne Umsatz kein Unternehmen. Vertriebliche Exzellenz ist der direkteste Weg zu planbarem Wachstum. Wer Vertrieb beherrscht, kontrolliert sein Schicksal. Wer Vertrieb vernachlässigt, ist abhängig vom Zufall."
        } else {
          whyImportant = "Ihre persönliche Energie und mentale Klarheit sind Ihr wertvollstes Kapital. Ohne Selbstmanagement folgen Burnout, Überlastung und schlechte Entscheidungen. Resilienz ermöglicht langfristige Leistungsfähigkeit und nachhaltigen unternehmerischen Erfolg. Wer sich um sich selbst kümmert, kann langfristig für andere da sein."
        }

        const whyLines = doc.splitTextToSize(whyImportant, pageWidth - margin * 2)
        doc.text(whyLines, margin, yPosition)
        yPosition += whyLines.length * 6 + 15

        // Quick Win für diesen Bereich
        doc.setTextColor(250, 230, 8)
        doc.setFontSize(13)
        doc.setFont("helvetica", "bold")
        doc.text("Ihr Quick Win für die nächsten 7 Tage:", margin, yPosition)
        yPosition += 10

        doc.setTextColor(220, 220, 220)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)

        let quickWin = ""
        if (cat.category === "Unternehmerisches Denken") {
          quickWin = "Blocken Sie 60 Minuten in Ihrem Kalender für reine Strategiearbeit. Ohne E-Mails, ohne Team, ohne Ablenkung. Fragen Sie sich: Was würde ich tun, wenn ich 3x so viel Kapital hätte? Was ist mein größter Engpass? Diese 60 Minuten sind oft wertvoller als eine ganze Arbeitswoche im Hamsterrad."
        } else if (cat.category === "Leadership & Führung + Emotionen") {
          quickWin = "Wählen Sie eine Aufgabe, die Sie normalerweise selbst machen, und delegieren Sie sie vollständig an ein Teammitglied. Geben Sie klare Erwartungen, setzen Sie einen Review-Termin und lassen Sie dann los. Beobachten Sie dabei Ihre Emotionen: Wo entsteht Unruhe, Kontrollverlust? Diese Selbstbeobachtung ist der erste Schritt zur emotionalen Führungskompetenz."
        } else if (cat.category === "Vertrieb & Wachstum") {
          quickWin = "Rufen Sie 5 Ihrer besten Kunden an und fragen Sie: 'Was schätzen Sie am meisten an der Zusammenarbeit mit uns?' Notieren Sie die Antworten wörtlich. Das sind Ihre echten Verkaufsargumente - nicht das, was Sie denken, sondern das, was Kunden wirklich überzeugt."
        } else {
          quickWin = "Starten Sie jeden Morgen mit 10 Minuten ohne Smartphone. Keine E-Mails, keine Nachrichten, nur Sie und Ihr Notizbuch. Schreiben Sie: Was ist heute wirklich wichtig? Was kann warten? Diese 10 Minuten geben Ihnen die Kontrolle über Ihren Tag zurück."
        }

        const quickWinLines = doc.splitTextToSize(quickWin, pageWidth - margin * 2)
        doc.text(quickWinLines, margin, yPosition)
      }
    })
  }

  // ==================== PAGE 15: METHODOLOGY ====================
  addPageBreak()

  addText("Über diese Analyse", 22, true, [250, 230, 8])
  yPosition += 10

  addText("Wissenschaftlicher Hintergrund", 14, true)
  addText(
    "Die Wingman 360° Unternehmensanalyse basiert auf bewährten Erkenntnissen aus der Unternehmensberatung, dem Executive Coaching sowie auf langjähriger praktischer Erfahrung in der Arbeit mit Unternehmern und Führungspersönlichkeiten.",
    11,
  )
  yPosition += 10

  addText("Sechs-Perspektiven-Modell", 14, true)
  addText(
    "Die Analyse bewertet sechs zentrale Kompetenzbereiche, die für nachhaltigen unternehmerischen Erfolg entscheidend sind:",
    11,
  )
  yPosition += 5

  const perspectives = [
    "Unternehmerisches Denken: Vision, Strategie, Innovationskraft",
    "Leadership & Führung + Emotionen: Teamführung, Delegation, emotionale Intelligenz",
    "Vertrieb & Wachstum: Kundenakquise, Marktbearbeitung, Skalierung",
    "Selbstmanagement & Resilienz: Selbstführung, Belastbarkeit, Balance",
  ]

  perspectives.forEach((p) => {
    addText(`• ${p}`, 11)
  })

  yPosition += 10

  addText("Scoring-Methodik", 14, true)
  addText(
    "Jeder Kompetenzbereich wird durch spezifische Fragen auf einer Skala von 1-10 bewertet. Die Gesamtauswertung erfolgt regelbasiert und identifiziert Ihr dominantes Unternehmerprofil.",
    11,
  )
  yPosition += 10

  // Fakthinweis - kleingeschrieben
  doc.setFillColor(230, 245, 250)
  doc.setDrawColor(59, 130, 246)
  doc.roundedRect(margin, yPosition, pageWidth - margin * 2, 0.5, 0, 0, "S")
  yPosition += 8

  doc.setTextColor(59, 130, 246)
  doc.setFontSize(9)
  doc.setFont("helvetica", "italic")
  const methodologyText = "Die Methodik des Wingman Mittelstandsindex vereint reale Unternehmererfahrung mit strukturierten Analyseansätzen aus Führung, Markt und persönlicher Entscheidungsfähigkeit. Ergänzt wird sie durch wissenschaftlich fundierte Erkenntnisse aus der Führungs-, Verhaltens- und Entscheidungsforschung."
  const methodologyLines = doc.splitTextToSize(methodologyText, pageWidth - margin * 2 - 4)
  doc.text(methodologyLines, margin + 2, yPosition)
  yPosition += methodologyLines.length * 4 + 8

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")

  yPosition += 5

  if (isPremium) {
    addText("Premium-Analyse mit KI-Unterstützung", 14, true, [59, 130, 246])
    addText(
      "Ihre Premium-Analyse nutzt zusätzlich künstliche Intelligenz, um personalisierte Insights basierend auf Ihren individuellen Antwortmustern zu generieren. Dies ermöglicht eine tiefere und spezifischere Interpretation Ihrer Ergebnisse.",
      11,
    )
  }

  // ==================== NEXT STEPS & CTA ====================
  addPageBreak()

  addText("Wie geht es jetzt weiter?", 22, true, [250, 230, 8])
  yPosition += 10

  addText(
    "Diese Analyse ist Ihr Startpunkt. Sie kennen jetzt Ihre Stärken, Entwicklungsbereiche und Ihr Unternehmerprofil. Der entscheidende Schritt ist die Umsetzung.",
    11,
  )
  yPosition += 10

  // Personalisierte Kurs-Empfehlungen basierend auf Unternehmertyp
  const courseRecommendations: { [key: string]: { primary: string; secondary: string; description: string } } = {
    "Der Visionär": {
      primary: "MASTERCLASS CONSULTING",
      secondary: "EINZELCOACHING für Umsetzungsstärke",
      description: "Als Visionär brauchen Sie Struktur für Ihre Ideen und Unterstützung bei der Umsetzung. Die Masterclass bringt Ihre Vision in konkrete Systeme."
    },
    "Der Stratege": {
      primary: "SALES MASTERY",
      secondary: "MASTERCLASS CONSULTING",
      description: "Ihre Strategie ist stark - jetzt brauchen Sie vertriebliche Exzellenz. Sales Mastery macht aus Ihrer Strategie messbaren Umsatz."
    },
    "Der Umsetzer": {
      primary: "EINZELCOACHING für strategisches Denken",
      secondary: "MASTERCLASS CONSULTING",
      description: "Sie setzen stark um - jetzt brauchen Sie strategische Klarheit. Coaching hilft Ihnen, aus dem Hamsterrad in die Führungsrolle zu kommen."
    },
    "Der Netzwerker": {
      primary: "SALES MASTERY",
      secondary: "EINZELCOACHING für Struktur",
      description: "Ihre Beziehungen sind wertvoll - jetzt brauchen Sie Vertriebssysteme. Sales Mastery macht aus Ihrem Netzwerk planbaren Umsatz."
    }
  }

  const recommendation = courseRecommendations[result.entrepreneurType] || {
    primary: "MASTERCLASS CONSULTING",
    secondary: "EINZELCOACHING",
    description: "Basierend auf Ihrem Profil empfehlen wir eine umfassende Beratung für strukturiertes Wachstum."
  }

  // Recommendations Box - DYNAMISCHE HOEHE BERECHNUNG
  const recBoxY = yPosition
  doc.setFontSize(10)
  const descLines = doc.splitTextToSize(recommendation.description, pageWidth - margin * 2 - 15)
  
  // Berechne Gesamthoehe: Titel(14) + Emp1(8) + Desc(lines*5) + Emp2(10) + Weitere(7) + 3 Programme(18) + Padding(20)
  const recBoxHeight = 14 + 8 + descLines.length * 5 + 5 + 10 + 10 + 7 + 18 + 15
  
  doc.setFillColor(40, 35, 20)
  doc.roundedRect(margin, recBoxY, pageWidth - margin * 2, recBoxHeight, 0, 0, "F")
  
  let recY = recBoxY + 12
  doc.setTextColor(250, 230, 8)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  // Remove "Der" from entrepreneurType if present
  const entrepreneurTypeName = result.entrepreneurType.replace(/^Der\s+/, "")
  doc.text(`Perfekt für Sie als ${entrepreneurTypeName}:`, margin + 5, recY)
  recY += 10

  doc.setTextColor(220, 220, 220)
  doc.setFontSize(12)
  doc.text(`Empfehlung #1: ${recommendation.primary}`, margin + 5, recY)
  // Link für Empfehlung #1
  const rec1Url = recommendation.primary.includes("MASTERCLASS") 
    ? "https://www.wingmancoaching.de/kopie-von-gruppencoaching"
    : "https://www.wingmancoaching.de/kopie-von-start"
  doc.link(margin + 5, recY - 3, 100, 6, { url: rec1Url })
  recY += 8

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(descLines, margin + 10, recY)
  recY += descLines.length * 5 + 5

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text(`Empfehlung #2: ${recommendation.secondary}`, margin + 5, recY)
  // Link für Empfehlung #2
  const rec2Url = recommendation.secondary.includes("MASTERCLASS")
    ? "https://www.wingmancoaching.de/kopie-von-gruppencoaching"
    : "https://www.wingmancoaching.de/kopie-von-einzelcoaching"
  doc.link(margin + 5, recY - 3, 100, 6, { url: rec2Url })
  recY += 10

  doc.text("Weitere Programme:", margin + 5, recY)
  recY += 7

  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  doc.setTextColor(100, 149, 237) // Blau für Links

  const link1Y = recY
  doc.text("Strategische Begleitung über 90 Tage", margin + 10, recY)
  doc.link(margin + 10, link1Y - 3, 100, 6, { url: "https://www.wingmancoaching.de/kopie-von-start" })
  recY += 8

  const link2Y = recY
  doc.text("Wingman Masterclass für systematisches Wachstum", margin + 10, recY)
  doc.link(margin + 10, link2Y - 3, 120, 6, { url: "https://www.wingmancoaching.de/kopie-von-gruppencoaching" })
  recY += 8

  const link3Y = recY
  doc.text("Sales Mastery für Vertriebsoptimierung (2 Module)", margin + 10, recY)
  doc.link(margin + 10, link3Y - 3, 120, 6, { url: "https://www.wingmancoaching.de/kopie-von-einzelcoaching" })
  
  doc.setTextColor(220, 220, 220) // Zurück zu normal
  
  yPosition = recBoxY + recBoxHeight + 5

  // Termin buchen Button direkt unter der Box
  yPosition += 10
  const buttonY = yPosition
  const buttonWidth = 80
  const buttonHeight = 14
  const buttonX = (pageWidth - buttonWidth) / 2

  // Button Background (Gelb)
  doc.setFillColor(250, 230, 8)
  doc.roundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 0, 0, "F")

  // Button Text (Schwarz)
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Termin buchen", pageWidth / 2, buttonY + 9, { align: "center" })

  // Clickable Link
  doc.link(buttonX, buttonY, buttonWidth, buttonHeight, { url: "https://www.wingmancoaching-test.de/termin-buchen" })

  yPosition += buttonHeight + 15

  addText(
    "Kontaktieren Sie uns für ein unverbindliches Erstgespräch und finden Sie heraus, welcher nächste Schritt für Sie der richtige ist.",
    11,
  )
  yPosition += 10

  const contactBoxY = yPosition
  doc.setFillColor(0, 0, 0)
  doc.roundedRect(margin, contactBoxY, pageWidth - margin * 2, 50, 0, 0, "F")
  
  doc.setTextColor(255, 215, 0)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("Wingman Coaching", margin + 10, contactBoxY + 15)

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text("E-Mail: kontakt@wingmancoaching.de", margin + 10, contactBoxY + 27)
  doc.text("Web: www.wingmancoaching.de", margin + 10, contactBoxY + 37)

  yPosition = contactBoxY + 60

  // Call-to-Action Button
  doc.setFillColor(255, 215, 0)
  doc.roundedRect(margin + 10, yPosition, pageWidth - margin * 2 - 20, 20, 0, 0, "F")
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Jetzt Beratung buchen", pageWidth / 2, yPosition + 13, { align: "center" })
  
  // Add clickable link
  doc.link(margin + 10, yPosition, pageWidth - margin * 2 - 20, 20, {
    url: "https://www.wingmancoaching-test.de/termin-buchen"
  })

  yPosition += 25

  doc.setTextColor(200, 200, 200)
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text("👆 Klicken Sie hier, um direkt einen Termin zu vereinbaren", pageWidth / 2, yPosition, { align: "center" })

  addFooter()

  return doc.output("blob")
}
