import type { Question } from "./questions"

export interface AssessmentAnswers {
  [questionId: string]: number | string
}

export interface CategoryScore {
  category: string
  score: number
  percentage: number
}

export interface AssessmentResult {
  categoryScores: CategoryScore[]
  overallScore: number
  wingmanIndex: number
  indexSubtitle: string
  entrepreneurType: string
  strengths: string[]
  developmentAreas: string[]
  typeProfile: {
    charakter: string
    staerken: string
    risiken: string
    entwicklung: string
  }
  statesAndActions: {
    [category: string]: {
      state: string
      handlung: string
    }
  }
}

export function calculateResults(answers: AssessmentAnswers, questions: Question[]): AssessmentResult {
  const categoryGroups: { [key: string]: number[] } = {}

  // Nur Scale-Fragen (type !== "freetext") fuer Scoring verwenden
  questions.forEach((question) => {
    // Freitext-Fragen ignorieren - nur numerische Antworten zaehlen
    if (question.type === "freetext") return
    
    const answer = answers[question.id]
    // Nur numerische Antworten verarbeiten
    if (answer !== undefined && typeof answer === "number") {
      if (!categoryGroups[question.category]) {
        categoryGroups[question.category] = []
      }
      categoryGroups[question.category].push(answer)
    }
  })

  const categoryScores: CategoryScore[] = Object.entries(categoryGroups).map(([category, scores]) => {
    const sum = scores.reduce((acc, val) => acc + val, 0)
    const max = scores.length * 10
    const score = sum / scores.length
    const percentage = (sum / max) * 100

    return {
      category,
      score: Math.round(score * 10) / 10,
      percentage: Math.round(percentage),
    }
  })

  const totalScore = categoryScores.reduce((acc, cat) => acc + cat.percentage, 0)
  const overallScore = Math.round(totalScore / categoryScores.length)

  const entrepreneurType = determineType(categoryScores, overallScore)

  const sorted = [...categoryScores].sort((a, b) => b.percentage - a.percentage)

  const topCategories = sorted.slice(0, 2)
  const bottomCategories = sorted.slice(-2)

  const strengths = topCategories.map((cat) => getStrengthDescription(cat.category))
  const developmentAreas = bottomCategories.map((cat) => getDevelopmentDescription(cat.category))

  const typeProfile = typeProfiles[entrepreneurType]
  const statesAndActions = typeStatesAndActions[entrepreneurType]
  
  const wingmanIndex = overallScore
  const indexSubtitle = getWingmanIndexSubtitle(overallScore)

  return {
    categoryScores,
    overallScore,
    wingmanIndex,
    indexSubtitle,
    entrepreneurType,
    strengths,
    developmentAreas,
    typeProfile,
    statesAndActions,
  }
}

function getWingmanIndexSubtitle(score: number): string {
  if (score >= 85) {
    return "Exzellenz – Sie gehören zur Oberklasse"
  } else if (score >= 75) {
    return "Starke Basis – auf dem Weg zur Spitze"
  } else if (score >= 65) {
    return "Solide Basis – klares Potenzial zur Oberklasse"
  } else if (score >= 55) {
    return "Entwicklungsfähig – wichtige Hebel erkennbar"
  } else if (score >= 45) {
    return "Grundlagen vorhanden – erhebliches Wachstumspotenzial"
  } else {
    return "Startphase – große Chancen durch systematische Entwicklung"
  }
}

function determineType(scores: CategoryScore[], overall: number): string {
  const utScore = scores.find((s) => s.category === "Unternehmerisches Denken")?.percentage || 0
  const lfScore = scores.find((s) => s.category === "Leadership & Führung + Emotionen")?.percentage || 0
  const vwScore = scores.find((s) => s.category === "Vertrieb & Wachstum")?.percentage || 0
  const srScore = scores.find((s) => s.category === "Selbstmanagement & Resilienz")?.percentage || 0

  if (overall >= 80) {
    return "Der Visionär"
  } else if (utScore > 70 && vwScore > 70) {
    return "Der Growth-Leader"
  } else if (lfScore > 70 && srScore > 70) {
    return "Der Strategische Umsetzer"
  } else if (vwScore > 70) {
    return "Der Sales-Entrepreneur"
  } else if (overall < 50) {
    return "Der Entwickler"
  } else {
    return "Der Ausgewogene Unternehmer"
  }
}

function getStrengthDescription(category: string): string {
  const descriptions: { [key: string]: string } = {
    "Unternehmerisches Denken": "Strategisches Denken und Innovationskraft",
    "Leadership & Führung + Emotionen": "Führungskompetenz, emotionale Intelligenz und Teamdevelopment",
    "Vertrieb & Wachstum": "Vertriebsstärke und Wachstumsorientierung",
    "Selbstmanagement & Resilienz": "Selbstorganisation und mentale Stärke",
    "Finanzen & Controlling": "Finanzielle Steuerung und Kennzahlenorientierung",
    "Marketing & Marke": "Markenführung und Marketingexzellenz",
  }
  return descriptions[category] || category
}

function getDevelopmentDescription(category: string): string {
  const descriptions: { [key: string]: string } = {
    "Unternehmerisches Denken": "Strategische Planung und Innovationsdenken schärfen",
    "Leadership & Führung + Emotionen": "Führungsqualitäten, emotionale Selbstregulation und Delegationsverhalten optimieren",
    "Vertrieb & Wachstum": "Vertriebsaktivitäten und Marktbearbeitung intensivieren",
    "Selbstmanagement & Resilienz": "Work-Life-Balance und Stressmanagement verbessern",
    "Finanzen & Controlling": "Finanzcontrolling und Liquiditätsmanagement ausbauen",
    "Marketing & Marke": "Marketingstrategie und Markenpositionierung stärken",
  }
  return descriptions[category] || category
}

export const typeDescriptions: { [key: string]: string } = {
  "Der Visionär":
    "Sie denken langfristig und erkennen Möglichkeiten, bevor andere sie sehen. Ihr Blick geht über das Tagesgeschäft hinaus. Sie haben ein klares Bild davon, wohin sich Ihr Unternehmen entwickeln soll.",
  "Der Growth-Leader":
    "Sie sind wachstumsorientiert, entscheidungsstark und marktgetrieben. Sie nutzen Chancen konsequent und treiben Ihr Unternehmen aktiv nach vorne.",
  "Der Strategische Umsetzer":
    "Sie verbinden Planung mit konsequenter Umsetzung. Sie sorgen dafür, dass Ideen Realität werden und Prozesse greifen.",
  "Der Sales-Entrepreneur":
    "Sie sind stark im Vertrieb und im direkten Kundenkontakt. Sie überzeugen durch Persönlichkeit, Abschlussstärke und Marktgespür.",
  "Der Entwickler":
    "Sie befinden sich in einer Phase des Aufbaus oder der Neuorientierung. Ihr Unternehmen hat Potenzial, benötigt jedoch Klarheit und Struktur.",
  "Der Ausgewogene Unternehmer":
    "Sie verfügen über ein solides und stabiles Unternehmerprofil. Ihr Unternehmen ist ausgewogen aufgestellt und funktioniert zuverlässig.",
}

export const typeProfiles: {
  [key: string]: {
    charakter: string
    staerken: string
    risiken: string
    entwicklung: string
  }
} = {
  "Der Visionär": {
    charakter:
      "Sie denken langfristig und erkennen Möglichkeiten, bevor andere sie sehen. Ihr Blick geht über das Tagesgeschäft hinaus. Sie haben ein klares Bild davon, wohin sich Ihr Unternehmen entwickeln soll.",
    staerken: "Strategische Weitsicht, Innovationskraft, Mut zu großen Entscheidungen.",
    risiken: "Gefahr der Überforderung des Teams oder fehlende operative Struktur.",
    entwicklung: "Vision in klare Schritte, Verantwortlichkeiten und Prozesse übersetzen.",
  },
  "Der Growth-Leader": {
    charakter:
      "Sie sind wachstumsorientiert, entscheidungsstark und marktgetrieben. Sie nutzen Chancen konsequent und treiben Ihr Unternehmen aktiv nach vorne.",
    staerken: "Marktdurchdringung, Umsatzsteigerung, unternehmerische Energie.",
    risiken: "Strukturen und Führung wachsen langsamer als der Umsatz.",
    entwicklung: "Stabile Organisation und Führungssysteme aufbauen.",
  },
  "Der Strategische Umsetzer": {
    charakter:
      "Sie verbinden Planung mit konsequenter Umsetzung. Sie sorgen dafür, dass Ideen Realität werden und Prozesse greifen.",
    staerken: "Verlässlichkeit, Struktur, operative Exzellenz.",
    risiken: "Zu wenig Raum für Innovation oder Wachstumssprünge.",
    entwicklung: "Mehr strategische Weitsicht und Marktimpulse integrieren.",
  },
  "Der Sales-Entrepreneur": {
    charakter:
      "Sie sind stark im Vertrieb und im direkten Kundenkontakt. Sie überzeugen durch Persönlichkeit, Abschlussstärke und Marktgespür.",
    staerken: "Abschlussstärke, Kundenbeziehungen, Umsatzorientierung.",
    risiken: "Abhängigkeit von der eigenen Person im Vertrieb.",
    entwicklung: "Vertriebssysteme und Skalierbarkeit aufbauen.",
  },
  "Der Entwickler": {
    charakter:
      "Sie befinden sich in einer Phase des Aufbaus oder der Neuorientierung. Ihr Unternehmen hat Potenzial, benötigt jedoch Klarheit und Struktur.",
    staerken: "Lernbereitschaft, Offenheit, Entwicklungspotenzial.",
    risiken: "Fehlende Prioritäten und Unsicherheit in Entscheidungen.",
    entwicklung: "Grundlagen schaffen: Fokus, Struktur und klare Ziele.",
  },
  "Der Ausgewogene Unternehmer": {
    charakter:
      "Sie verfügen über ein solides und stabiles Unternehmerprofil. Ihr Unternehmen ist ausgewogen aufgestellt und funktioniert zuverlässig.",
    staerken: "Balance, Stabilität, Übersicht.",
    risiken: "Gefahr von Stillstand oder Komfortzone.",
    entwicklung: "Gezielte Schärfung einzelner Wachstumstreiber.",
  },
}

export const typeStatesAndActions: {
  [key: string]: {
    [category: string]: {
      state: string
      handlung: string
    }
  }
} = {
  "Der Visionär": {
    "Unternehmerisches Denken": {
      state: "Viele Ideen gleichzeitig, innerer Druck, alles vorantreiben zu wollen.",
      handlung:
        "Reduzieren Sie Ihre Vision auf wenige umsetzbare Ziele. Externe Struktur hilft, Gedanken zu ordnen und Fokus zu schaffen.",
    },
    "Leadership & Führung + Emotionen": {
      state: "Frust, wenn Ideen im Team nicht wie gewünscht umgesetzt werden.",
      handlung:
        "Formulieren Sie Erwartungen klarer und verbindlicher. Führen Sie wöchentliche 1:1 Gespräche ein, in denen Sie gezielt nachfragen und Feedback geben. Arbeiten Sie an Ihrer emotionalen Selbstregulation - nehmen Sie sich bewusst Zeit, um zwischen Idee und Umsetzungserwartung zu reflektieren. Nutzen Sie ein Führungs-Journal, um Muster in Ihrer Kommunikation zu erkennen. Wingman Coaching hilft Ihnen, blinde Flecken zu identifizieren und Ihre Wirkung auf das Team zu verstehen.",
    },
    "Vertrieb & Wachstum": {
      state: "Begeisterung für Neues, aber fehlender Fokus auf Ertrag.",
      handlung: "Prüfen Sie, welche Ideen wirklich Umsatz bringen. Ein nüchterner Blick von außen schafft Klarheit.",
    },
    "Selbstmanagement & Resilienz": {
      state: "Ständige geistige Aktivität, wenig Erholung.",
      handlung: "Planen Sie feste Denk- und Ruhezeiten. Bewusste Selbstführung bringt innere Ruhe.",
    },
    "Finanzen & Controlling": {
      state: "Zahlen sind interessant, aber nicht Ihr Fokus.",
      handlung: "Implementieren Sie einfache Controlling-Routinen. Externe Kontrolle schafft finanzielle Sicherheit.",
    },
    "Marketing & Marke": {
      state: "Viele Marketing-Ideen, aber unklarer ROI.",
      handlung: "Fokussieren Sie sich auf messbare Kanäle. Strukturiertes Marketing bringt Klarheit über Wirkung.",
    },
  },
  "Der Growth-Leader": {
    "Unternehmerisches Denken": {
      state: "Hoher Entscheidungsdruck, wenig Pause.",
      handlung: "Stabilisieren Sie Wachstum durch klare Prioritäten. Struktur verwandelt Druck in Klarheit.",
    },
    "Leadership & Führung + Emotionen": {
      state: "Alles läuft über Sie, Loslassen fällt schwer.",
      handlung: "Identifizieren Sie 3-5 Entscheidungen, die Sie delegieren können. Definieren Sie klare Verantwortungsbereiche mit Entscheidungsbefugnissen. Etablieren Sie ein wöchentliches Delegations-Meeting. Arbeiten Sie aktiv an Ihrer Verlustangst - nutzen Sie Reflexionsübungen, um zu verstehen, warum Loslassen schwerfällt. Führen Sie ein Emotionstagebuch, um Kontrolldrang bewusst zu machen. Im Wingman Einzelcoaching decken wir unbewusste Führungsmuster auf und trainieren neue Verhaltensweisen.",
    },
    "Vertrieb & Wachstum": {
      state: "Wachstum ist stark, aber anstrengend.",
      handlung: "Fokussieren Sie sich auf die profitabelsten Kunden. Objektive Zahlenanalyse bringt Ruhe.",
    },
    "Selbstmanagement & Resilienz": {
      state: "Daueranspannung, wenig Erholung.",
      handlung: "Planen Sie bewusste Erholungsphasen. Gezielte Selbstführung schafft neue Energie.",
    },
    "Finanzen & Controlling": {
      state: "Wachstum ohne durchgängiges Controlling.",
      handlung: "Bauen Sie solides Finanz-Controlling auf. Klare Zahlen sichern profitables Wachstum.",
    },
    "Marketing & Marke": {
      state: "Marketingbudget wächst, aber ohne klare Strategie.",
      handlung: "Entwickeln Sie eine ROI-orientierte Marketingstrategie. Messbares Marketing multipliziert Wachstum.",
    },
  },
  "Der Strategische Umsetzer": {
    "Unternehmerisches Denken": {
      state: "Stabilität, aber wenig Impulse.",
      handlung: "Hinterfragen Sie Prozesse auf Zukunftsfähigkeit. Neue Perspektiven verhindern Stillstand.",
    },
    "Leadership & Führung + Emotionen": {
      state: "Team funktioniert, entwickelt sich aber wenig.",
      handlung: "Führen Sie Entwicklungsgespräche mit konkreten Wachstumszielen ein. Definieren Sie für jeden Mitarbeiter eine Stretch-Aufgabe. Implementieren Sie ein Feedback-System mit regelmäßigen Performance-Reviews. Arbeiten Sie bewusst an Ihrer Konfliktbereitschaft - lernen Sie, unbequeme Gespräche zu führen. Reflektieren Sie Ihre Komfortzone in der Führung: Wo halten Sie das Team zurück, weil es Ihnen emotional leichter fällt? Im Wingman Leadership-Coaching trainieren wir mutigere Führungsentscheidungen.",
    },
    "Vertrieb & Wachstum": {
      state: "Solider Umsatz, wenig Dynamik.",
      handlung: "Setzen Sie sich ambitioniertere Ziele. Strukturiertes Sparring eröffnet Chancen.",
    },
    "Selbstmanagement & Resilienz": {
      state: "Fokus auf Tagesgeschäft, wenig Weitblick.",
      handlung: "Schaffen Sie Zeit für Strategie. Klare Denkstrukturen helfen bei Entscheidungen.",
    },
    "Finanzen & Controlling": {
      state: "Gutes Controlling, aber wenig ambitionierte Ziele.",
      handlung: "Nutzen Sie Ihre Zahlen für Wachstumsszenarien. Finanzplanung treibt Wachstum.",
    },
    "Marketing & Marke": {
      state: "Solides Marketing, wenig Innovation.",
      handlung: "Testen Sie neue Marketing-Kanäle. Experimentieren bringt neue Impulse.",
    },
  },
  "Der Sales-Entrepreneur": {
    "Unternehmerisches Denken": {
      state: "Abhängigkeit von der eigenen Vertriebsleistung.",
      handlung: "Bauen Sie Systeme statt Abhängigkeiten. Systematik schafft Freiheit.",
    },
    "Leadership & Führung + Emotionen": {
      state: "Mitarbeiter verlassen sich auf Sie.",
      handlung: "Erstellen Sie ein strukturiertes Onboarding- und Trainings-Programm für Ihr Team. Definieren Sie klare Eskalationsstufen - wann dürfen Mitarbeiter selbst entscheiden? Führen Sie wöchentliche Lern-Sessions ein, in denen Sie Verkaufsgespräche gemeinsam analysieren. Reflektieren Sie Ihre Helfersyndrom-Tendenzen: Wo springen Sie zu schnell ein, weil es Ihnen ein gutes Gefühl gibt? Arbeiten Sie an Ihrer Frustrationstoleranz, wenn Mitarbeiter Fehler machen. Im Wingman Coaching finden wir die Balance zwischen Unterstützung und Überbehütung.",
    },
    "Vertrieb & Wachstum": {
      state: "Umsatz hängt stark an Ihnen.",
      handlung: "Dokumentieren Sie Ihren Verkaufsprozess. Struktur ermöglicht Skalierung.",
    },
    "Selbstmanagement & Resilienz": {
      state: "Hohe Belastung durch ständigen Kundenkontakt.",
      handlung: "Setzen Sie klare Grenzen. Balance steigert Leistungsfähigkeit.",
    },
    "Finanzen & Controlling": {
      state: "Fokus auf Umsatz, weniger auf Marge.",
      handlung: "Analysieren Sie Ihre Profitabilität pro Kunde. Margenoptimierung steigert Ertrag.",
    },
    "Marketing & Marke": {
      state: "Persönliches Netzwerk dominiert, wenig Systematik.",
      handlung: "Bauen Sie systematische Lead-Generierung auf. Skalierbare Akquise reduziert Abhängigkeit.",
    },
  },
  "Der Entwickler": {
    "Unternehmerisches Denken": {
      state: "Unsicherheit, viele offene Baustellen.",
      handlung: "Fokussieren Sie sich auf wenige Prioritäten. Klare Orientierung schafft Sicherheit.",
    },
    "Leadership & Führung + Emotionen": {
      state: "Zurückhaltung in klarer Führung.",
      handlung: "Beginnen Sie mit schriftlichen Erwartungen - formulieren Sie für jeden Mitarbeiter klare Ziele und Verantwortlichkeiten. Üben Sie direkte Kommunikation in kleinen Schritten: erst schriftlich, dann persönlich. Etablieren Sie eine feste Meeting-Struktur mit Agenda. Arbeiten Sie aktiv an Ihrem Selbstwert - erkennen Sie, dass klare Führung Respekt schafft, nicht Ablehnung. Nutzen Sie Wingman Coaching, um schwierige Gespräche zu üben. Reflektieren Sie Vermeidungsverhalten: Welche Ängste halten Sie davon ab, klar zu führen?",
    },
    "Vertrieb & Wachstum": {
      state: "Unklar, was wirklich funktioniert.",
      handlung: "Prüfen Sie Nachfrage und Ertrag. Struktur reduziert Unsicherheit.",
    },
    "Selbstmanagement & Resilienz": {
      state: "Zweifel an eigenen Entscheidungen.",
      handlung: "Arbeiten Sie an Selbstvertrauen. Unterstützung bringt schnelle Klarheit.",
    },
    "Finanzen & Controlling": {
      state: "Wenig Überblick über die Zahlen.",
      handlung: "Etablieren Sie einfache Finanzroutinen. Transparenz schafft Kontrolle.",
    },
    "Marketing & Marke": {
      state: "Marketing ist unklar oder zufällig.",
      handlung: "Definieren Sie Ihre Zielgruppe klar. Fokussiertes Marketing bringt erste Erfolge.",
    },
  },
  "Der Ausgewogene Unternehmer": {
    "Unternehmerisches Denken": {
      state: "Stabilität, aber wenig neue Impulse.",
      handlung: "Entscheiden Sie sich für einen nächsten Wachstumsschritt. Gezielte Impulse öffnen neue Perspektiven.",
    },
    "Leadership & Führung + Emotionen": {
      state: "Gutes Team, wenig Entwicklung.",
      handlung: "Fördern Sie gezielt Schlüsselpersonen. Reflektierte Führung steigert Leistung.",
    },
    "Vertrieb & Wachstum": {
      state: "Solide Position, wenig Differenzierung.",
      handlung: "Schärfen Sie Ihr Angebot und Ihre Positionierung. Klarheit bringt Stärke und Differenzierung.",
    },
    "Selbstmanagement & Resilienz": {
      state: "Hohe Stabilität, wenig Herausforderung.",
      handlung: "Nutzen Sie Ihre Ruhe für langfristige Planung. Strukturierte Planung schafft Freiheit.",
    },
    "Finanzen & Controlling": {
      state: "Solide Finanzen, wenig ambitionierte Ziele.",
      handlung: "Setzen Sie sich finanzielle Wachstumsziele. Ambition treibt Entwicklung.",
    },
    "Marketing & Marke": {
      state: "Gutes Marketing, aber Potenzial ungenutzt.",
      handlung: "Schärfen Sie Ihre Markenpositionierung. Klarheit multipliziert Wirkung.",
    },
  },
}
