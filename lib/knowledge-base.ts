/**
 * Wingman Wissensdatenbank für KI-Analyse
 * 
 * Strukturierte Antworten basierend auf:
 * - Unternehmertyp (6 Typen)
 * - Kategorie (6 Bereiche)
 * - Perspektive (3: Befund, Hebel, Impact)
 */

export const KNOWLEDGE_BASE = {
  "Der Visionär": {
    "Unternehmerisches Denken": {
      befund: "Sie denken in großen Zusammenhängen, sehen Möglichkeiten früher als andere und haben klare Vorstellungen davon, wohin sich Ihr Unternehmen entwickeln soll. Ihre Stärke liegt darin, langfristig zu planen und Innovationen voranzutreiben.",
      hebel: "Der zentrale Hebel liegt darin, Ihre Vision in konkrete, umsetzbare Schritte zu übersetzen. Damit aus strategischen Ideen tatsächlich Struktur wird, braucht es klare Prioritäten, messbare Zwischenziele und ein Team, das Ihre Richtung nachvollziehen kann. Eine starke operative Ebene verwandelt Vision in Wachstum.",
      impact: "Wenn Vision und Struktur zusammenkommen, entsteht Skalierbarkeit. Ihr Unternehmen wächst nicht mehr durch Ihre persönliche Anwesenheit, sondern durch funktionierende Systeme. Das schafft unternehmerische Freiheit und messbare Profitabilität."
    },
    "Leadership & Führung + Emotionen": {
      befund: "Sie haben eine klare Vorstellung davon, wie Führung aussehen sollte, und erwarten von Ihrem Team, dass es Ihre Vision versteht und umsetzt. Gleichzeitig kann es frustrierend sein, wenn Ihre Erwartungen nicht erfüllt werden oder die Umsetzung langsamer läuft als gedacht.",
      hebel: "Der Hebel liegt in klarerer, verbindlicherer Kommunikation und emotionaler Selbstregulation. Wenn Sie Ihre Erwartungen präziser formulieren, regelmäßig nachfragen und Ihre eigenen emotionalen Reaktionen reflektieren, wird Führung effizienter und weniger anstrengend. Führungssysteme wie 1:1-Gespräche und klare Verantwortlichkeiten helfen dabei, dass Ihr Team eigenständiger agiert.",
      impact: "Gezielte Führungsarbeit reduziert operative Abhängigkeit von Ihnen. Ihr Team wird handlungsfähiger, Sie gewinnen Zeit für strategische Themen, und die Unternehmenskultur wird stabiler und vorhersehbarer."
    },
    "Vertrieb & Wachstum": {
      befund: "Sie sind offen für neue Wachstumschancen und haben viele Ideen, wie Ihr Unternehmen wachsen könnte. Gleichzeitig fehlt oft die Klarheit darüber, welche dieser Chancen tatsächlich profitabel sind und welche nur Aufwand ohne messbaren Ertrag bedeuten.",
      hebel: "Der Hebel liegt in der Fokussierung auf die profitabelsten Vertriebskanäle und Kundengruppen. Wenn Sie klar analysieren, wo der höchste Return on Investment liegt, können Sie Ihre Energie gezielt einsetzen. Ein strukturierter Vertriebsprozess mit messbaren KPIs sorgt dafür, dass Wachstum planbar wird.",
      impact: "Fokussiertes Wachstum steigert die Profitabilität und reduziert Ressourcenverschwendung. Ihr Vertrieb wird skalierbar, und Sie können Umsatzziele verlässlich erreichen."
    },
    "Selbstmanagement & Resilienz": {
      befund: "Ihr Kopf ist ständig aktiv, Sie denken in vielen Richtungen gleichzeitig, und es fällt Ihnen schwer, wirklich abzuschalten. Diese geistige Dauerspannung kann auf Dauer ermüdend sein und Ihre Entscheidungsqualität beeinträchtigen.",
      hebel: "Der Hebel liegt in bewusster Selbstführung: feste Denkzeiten für strategische Themen, klare Ruhezeiten ohne Arbeitsthemen und eine Struktur, die verhindert, dass Ihr Kopf ständig zwischen Themen springt. Reflexion und externe Sparringspartner helfen dabei, Klarheit zu schaffen.",
      impact: "Mehr mentale Klarheit führt zu besseren Entscheidungen, höherer Energie und langfristiger Leistungsfähigkeit. Sie bleiben strategisch handlungsfähig, ohne auszubrennen."
    },
    "Finanzen & Controlling": {
      befund: "Zahlen interessieren Sie, sind aber nicht Ihr primärer Fokus. Sie verlassen sich oft auf Ihr Gefühl oder auf andere Personen, die Ihnen die Zahlen erklären. Das kann dazu führen, dass finanzielle Risiken zu spät erkannt werden.",
      hebel: "Der Hebel liegt in einfachen, regelmäßigen Controlling-Routinen, die Ihnen schnell zeigen, ob Ihr Unternehmen profitabel läuft. Externe Unterstützung oder klare Dashboards machen Finanzthemen greifbar, ohne dass Sie sich in Details verlieren müssen.",
      impact: "Finanzielle Transparenz schafft Sicherheit und verhindert kostspielige Überraschungen. Sie können strategische Entscheidungen auf solider Datenbasis treffen."
    },
    "Marketing & Marke": {
      befund: "Sie haben viele Marketing-Ideen und probieren gerne Neues aus. Allerdings ist oft unklar, welche Maßnahmen tatsächlich Kunden bringen und welche nur Aufwand ohne messbaren Rücklauf bedeuten.",
      hebel: "Der Hebel liegt in messbarem, fokussiertem Marketing. Wenn Sie sich auf die Kanäle konzentrieren, die nachweislich Ergebnisse bringen, und klare KPIs definieren, wird Marketing kalkulierbar. Eine klare Markenpositionierung verstärkt die Wirkung jeder Maßnahme.",
      impact: "Strukturiertes Marketing steigert die Lead-Qualität und reduziert Streuverluste. Ihre Marke wird sichtbarer und Ihre Akquise planbarer."
    }
  },
  "Der Growth-Leader": {
    "Unternehmerisches Denken": {
      befund: "Sie sind stark wachstumsorientiert, treffen schnelle Entscheidungen und nutzen Chancen konsequent. Ihr Unternehmen wächst dynamisch, aber manchmal fehlt die Zeit, um strategisch zu reflektieren.",
      hebel: "Der Hebel liegt darin, Wachstum durch klare Prioritäten zu stabilisieren. Wenn Sie bewusst entscheiden, welche Chancen Sie verfolgen und welche Sie lassen, wird Wachstum nachhaltiger. Strategische Planung schafft Orientierung und verhindert Überforderung.",
      impact: "Stabilisiertes Wachstum erhöht die Profitabilität und reduziert operative Überlastung. Ihr Unternehmen wird robuster und weniger von Ihrer persönlichen Präsenz abhängig."
    },
    "Leadership & Führung + Emotionen": {
      befund: "Sie führen stark und entscheiden viel selbst. Ihr Team verlässt sich auf Sie, und es fällt Ihnen schwer, Verantwortung wirklich abzugeben. Das kann zu Engpässen führen, wenn Ihr Unternehmen weiter wächst.",
      hebel: "Der Hebel liegt in gezielter Delegation und klaren Entscheidungsbefugnissen. Wenn Sie 3-5 Entscheidungen identifizieren, die andere treffen können, und diese systematisch übergeben, entlasten Sie sich spürbar. Wöchentliche Delegations-Meetings und klare Verantwortungsbereiche helfen dabei, Kontrolle loszulassen, ohne die Übersicht zu verlieren.",
      impact: "Delegation schafft Skalierbarkeit. Ihr Unternehmen kann wachsen, ohne dass Sie zum Flaschenhals werden. Sie gewinnen Zeit für strategische Themen und Ihr Team entwickelt sich weiter."
    },
    "Vertrieb & Wachstum": {
      befund: "Ihr Vertrieb läuft gut und generiert Umsatz. Allerdings ist er anstrengend, weil er stark von Ihnen abhängt. Wenn Sie nicht aktiv akquirieren, sinkt die Pipeline.",
      hebel: "Der Hebel liegt in der Fokussierung auf die profitabelsten Kundengruppen und einem systematischen Vertriebsprozess. Wenn Sie Ihre besten Kunden analysieren und gezielt mehr von dieser Art gewinnen, steigt die Profitabilität bei gleichem Aufwand.",
      impact: "Fokussierter Vertrieb steigert Marge und Planbarkeit. Sie verkaufen profitabler und können Ihr Wachstum besser steuern."
    },
    "Selbstmanagement & Resilienz": {
      befund: "Sie sind dauerhaft angespannt, arbeiten viel und haben wenig Zeit für Erholung. Diese Dauerbelastung kann langfristig Ihre Entscheidungsqualität und Gesundheit beeinträchtigen.",
      hebel: "Der Hebel liegt in bewussten Erholungsphasen und klarer Selbstführung. Feste Ruhezeiten, strategische Denkpausen und körperliche Erholung sind keine Zeitverschwendung, sondern steigern Ihre Leistungsfähigkeit nachhaltig.",
      impact: "Mehr Balance führt zu besseren Entscheidungen, höherer Energie und langfristiger Belastbarkeit. Sie bleiben strategisch handlungsfähig und vermeiden Erschöpfung."
    },
    "Finanzen & Controlling": {
      befund: "Ihr Unternehmen wächst, aber das Controlling wächst nicht im gleichen Tempo mit. Das kann zu finanziellen Überraschungen führen, wenn Umsatz nicht gleichbedeutend mit Profitabilität ist.",
      hebel: "Der Hebel liegt im Aufbau eines soliden Finanz-Controllings mit regelmäßigen Reviews. Klare Dashboards zeigen Ihnen, ob Wachstum profitabel ist oder nur Aufwand bedeutet.",
      impact: "Finanzielle Transparenz sichert profitables Wachstum. Sie erkennen frühzeitig, wenn Umsatz nicht in Gewinn umschlägt, und können gegensteuern."
    },
    "Marketing & Marke": {
      befund: "Ihr Marketing-Budget wächst, aber oft fehlt eine klare Strategie dahinter. Sie investieren in verschiedene Kanäle, ohne genau zu wissen, welche davon wirklich funktionieren.",
      hebel: "Der Hebel liegt in ROI-orientiertem Marketing. Wenn Sie messen, welche Kanäle tatsächlich Kunden bringen, können Sie Ihr Budget gezielt einsetzen. Eine klare Markenstrategie verstärkt die Wirkung jeder Maßnahme.",
      impact: "Messbares Marketing multipliziert Wachstum. Sie generieren mehr Leads bei gleichem Budget und können Ihre Akquise skalieren."
    }
  },
  "Der Strategische Umsetzer": {
    "Unternehmerisches Denken": {
      befund: "Sie planen strukturiert und setzen Vorhaben konsequent um. Ihr Unternehmen läuft stabil, aber es fehlen manchmal neue Impulse oder größere Entwicklungsschritte.",
      hebel: "Der Hebel liegt darin, bestehende Prozesse kritisch zu hinterfragen und sich bewusst neue Perspektiven zu holen. Externe Impulse verhindern Stillstand und öffnen neue Wachstumschancen.",
      impact: "Gezielte Innovation hält Ihr Unternehmen zukunftsfähig. Sie vermeiden Komfortzone und schaffen nachhaltiges Wachstum."
    },
    "Leadership & Führung + Emotionen": {
      befund: "Ihr Team funktioniert gut und ist zuverlässig. Allerdings entwickelt es sich wenig weiter, weil klare Entwicklungsziele und Herausforderungen fehlen.",
      hebel: "Der Hebel liegt in gezielten Entwicklungsgesprächen und Stretch-Aufgaben. Wenn Sie jedem Mitarbeiter ein konkretes Wachstumsziel geben und regelmäßig Feedback einfordern, steigt die Leistung spürbar. Mutigere Führungsentscheidungen fördern Eigenverantwortung.",
      impact: "Gezielte Teamentwicklung steigert Leistung und Motivation. Ihr Unternehmen wird dynamischer und Ihr Team übernimmt mehr Verantwortung."
    },
    "Vertrieb & Wachstum": {
      befund: "Ihr Vertrieb läuft solide und generiert verlässlichen Umsatz. Allerdings fehlt die Dynamik, um wirklich zu wachsen. Sie verkaufen, was kommt, statt aktiv neue Märkte zu erschließen.",
      hebel: "Der Hebel liegt in ambitionierteren Zielen und strukturiertem Sparring. Wenn Sie sich bewusst höhere Umsatzziele setzen und diese systematisch verfolgen, entsteht neue Dynamik.",
      impact: "Ambitionierter Vertrieb eröffnet neue Chancen. Sie erschließen neue Märkte und steigern Ihren Umsatz nachhaltig."
    },
    "Selbstmanagement & Resilienz": {
      befund: "Sie arbeiten fokussiert und strukturiert, aber oft zu sehr im Tagesgeschäft. Strategische Reflexion kommt zu kurz, weil Sie in operativen Themen gebunden sind.",
      hebel: "Der Hebel liegt darin, bewusst Zeit für strategische Planung zu blocken. Feste Denkzeiten außerhalb des Tagesgeschäfts schaffen Klarheit für langfristige Entscheidungen.",
      impact: "Mehr strategische Klarheit führt zu besseren Entscheidungen. Sie arbeiten nicht nur härter, sondern auch klüger."
    },
    "Finanzen & Controlling": {
      befund: "Ihr Controlling ist solide, aber Sie nutzen Ihre Zahlen nicht proaktiv für Wachstumsplanung. Die Zahlen zeigen Ihnen, wo Sie stehen, aber nicht, wo Sie hinwollen.",
      hebel: "Der Hebel liegt darin, Ihre Zahlen für Wachstumsszenarien zu nutzen. Wenn Sie Ihre finanziellen Ziele ambitionierter setzen und daraus konkrete Maßnahmen ableiten, wird Controlling zum Wachstumstreiber.",
      impact: "Ambitionierte Finanzplanung treibt Wachstum. Sie steuern Ihr Unternehmen nicht nur reaktiv, sondern proaktiv."
    },
    "Marketing & Marke": {
      befund: "Ihr Marketing läuft solide, aber es fehlen neue Impulse. Sie machen, was funktioniert, testen aber wenig Neues.",
      hebel: "Der Hebel liegt im gezielten Experimentieren mit neuen Marketing-Kanälen. Kleine Tests bringen neue Erkenntnisse und können Ihre Reichweite deutlich steigern.",
      impact: "Innovation im Marketing öffnet neue Kundenquellen. Sie diversifizieren Ihre Akquise und werden unabhängiger von einzelnen Kanälen."
    }
  },
  "Der Sales-Entrepreneur": {
    "Unternehmerisches Denken": {
      befund: "Sie sind stark im Verkauf und überzeugen durch Ihre Persönlichkeit. Allerdings hängt Ihr Unternehmen stark an Ihnen. Wenn Sie nicht verkaufen, sinkt der Umsatz.",
      hebel: "Der Hebel liegt im Aufbau von Systemen statt Abhängigkeiten. Wenn Sie Ihren Verkaufsprozess dokumentieren und anderen beibringen, wird Ihr Unternehmen skalierbarer.",
      impact: "Systematisierter Vertrieb schafft Unabhängigkeit. Ihr Umsatz wird stabiler und weniger von Ihrer persönlichen Anwesenheit abhängig."
    },
    "Leadership & Führung + Emotionen": {
      befund: "Ihr Team verlässt sich auf Sie, und Sie springen schnell ein, wenn es schwierig wird. Das verhindert, dass Ihr Team selbstständiger wird.",
      hebel: "Der Hebel liegt in strukturiertem Onboarding und klaren Eskalationsstufen. Wenn Sie definieren, wann Mitarbeiter selbst entscheiden dürfen, und regelmäßig Verkaufsgespräche analysieren, entwickelt Ihr Team sich schneller. Reflexion über Ihre Helfersyndrom-Tendenzen hilft dabei, nicht zu schnell einzuspringen.",
      impact: "Mehr Eigenverantwortung im Team reduziert Ihre operative Last. Sie gewinnen Zeit für strategische Themen und Ihr Team wird leistungsfähiger."
    },
    "Vertrieb & Wachstum": {
      befund: "Ihr Vertrieb läuft gut, solange Sie selbst verkaufen. Aber er ist schwer skalierbar, weil er stark an Ihrer Person hängt.",
      hebel: "Der Hebel liegt in der Dokumentation Ihres Verkaufsprozesses. Wenn Sie genau festhalten, wie Sie verkaufen, können andere es lernen und replizieren.",
      impact: "Skalierbarer Vertrieb multipliziert Umsatz. Ihr Unternehmen kann wachsen, ohne dass Sie jedes Gespräch selbst führen müssen."
    },
    "Selbstmanagement & Resilienz": {
      befund: "Sie sind viel im Kundenkontakt und tragen eine hohe emotionale Last. Das kann auf Dauer anstrengend sein.",
      hebel: "Der Hebel liegt in klaren Grenzen und bewussten Erholungsphasen. Wenn Sie feste Zeiten ohne Kundenkontakt einplanen, steigt Ihre langfristige Leistungsfähigkeit.",
      impact: "Mehr Balance führt zu höherer Energie und besserer Verkaufsleistung. Sie bleiben langfristig motiviert und vermeiden Erschöpfung."
    },
    "Finanzen & Controlling": {
      befund: "Sie fokussieren sich auf Umsatz, weniger auf Marge. Das kann dazu führen, dass Sie viel verkaufen, aber wenig verdienen.",
      hebel: "Der Hebel liegt in der Analyse Ihrer Profitabilität pro Kunde. Wenn Sie erkennen, welche Kunden tatsächlich Gewinn bringen, können Sie gezielt mehr von dieser Art gewinnen.",
      impact: "Margenoptimierung steigert Ertrag. Sie verdienen mehr, ohne mehr verkaufen zu müssen."
    },
    "Marketing & Marke": {
      befund: "Sie akquirieren stark über persönliche Netzwerke, aber es fehlt eine systematische Lead-Generierung. Das macht Sie abhängig von Ihrem persönlichen Kontaktnetzwerk.",
      hebel: "Der Hebel liegt im Aufbau systematischer Lead-Generierung. Wenn Sie zusätzlich zu Ihrem Netzwerk automatisierte Kanäle nutzen, wird Ihr Vertrieb planbarer.",
      impact: "Skalierbare Akquise reduziert Abhängigkeit. Ihr Vertrieb wird stabiler und Sie können Ihr Wachstum besser steuern."
    }
  },
  "Der Entwickler": {
    "Unternehmerisches Denken": {
      befund: "Sie befinden sich in einer Phase des Aufbaus oder der Neuorientierung. Viele Themen sind noch offen, und es fehlt Klarheit darüber, welche Prioritäten wirklich wichtig sind.",
      hebel: "Der Hebel liegt in klarer Fokussierung auf wenige Prioritäten. Wenn Sie sich auf 2-3 zentrale Themen konzentrieren und diese konsequent vorantreiben, entsteht schnell Orientierung.",
      impact: "Klarheit schafft Handlungsfähigkeit. Sie gewinnen Sicherheit und können gezielter agieren."
    },
    "Leadership & Führung + Emotionen": {
      befund: "Sie führen zurückhaltend und haben Schwierigkeiten, klare Erwartungen zu formulieren. Das kann dazu führen, dass Ihr Team unsicher ist, was von ihm erwartet wird.",
      hebel: "Der Hebel liegt in schriftlichen Erwartungen und einer festen Meeting-Struktur. Wenn Sie beginnen, Ziele und Verantwortlichkeiten schriftlich zu formulieren, wird Führung klarer. Üben Sie direkte Kommunikation in kleinen Schritten und reflektieren Sie Ihr Vermeidungsverhalten.",
      impact: "Klare Führung schafft Respekt und Orientierung. Ihr Team wird leistungsfähiger und Sie gewinnen Selbstsicherheit."
    },
    "Vertrieb & Wachstum": {
      befund: "Sie sind unsicher, welche Vertriebsmaßnahmen wirklich funktionieren. Vieles wird ausprobiert, aber es fehlt eine klare Struktur.",
      hebel: "Der Hebel liegt in der systematischen Analyse: Welche Kundengruppen bringen Umsatz? Welche Kanäle funktionieren? Struktur reduziert Unsicherheit und macht Vertrieb planbarer.",
      impact: "Strukturierter Vertrieb bringt erste Erfolge. Sie gewinnen Klarheit und können gezielter akquirieren."
    },
    "Selbstmanagement & Resilienz": {
      befund: "Sie zweifeln oft an Ihren Entscheidungen und haben Schwierigkeiten, Prioritäten zu setzen. Das führt zu Unsicherheit und Stress.",
      hebel: "Der Hebel liegt im Aufbau von Selbstvertrauen durch klare Entscheidungsstrukturen. Externe Unterstützung hilft dabei, schneller Klarheit zu gewinnen und sicherer zu agieren.",
      impact: "Mehr Selbstvertrauen führt zu besseren Entscheidungen. Sie agieren klarer und reduzieren innere Anspannung."
    },
    "Finanzen & Controlling": {
      befund: "Sie haben wenig Überblick über Ihre Zahlen und wissen nicht genau, ob Ihr Unternehmen profitabel läuft.",
      hebel: "Der Hebel liegt in einfachen Finanzroutinen. Wenn Sie monatlich Ihre wichtigsten Kennzahlen prüfen, gewinnen Sie Kontrolle und können frühzeitig gegensteuern.",
      impact: "Finanzielle Transparenz schafft Sicherheit. Sie erkennen Risiken früher und können gezielter steuern."
    },
    "Marketing & Marke": {
      befund: "Ihr Marketing ist unklar oder zufällig. Sie wissen nicht genau, wer Ihre Zielgruppe ist und wie Sie sie erreichen.",
      hebel: "Der Hebel liegt in klarer Zielgruppendefinition. Wenn Sie genau wissen, wen Sie ansprechen, wird Marketing fokussierter und effektiver.",
      impact: "Fokussiertes Marketing bringt erste Erfolge. Sie gewinnen Kunden gezielter und verschwenden weniger Ressourcen."
    }
  },
  "Der Ausgewogene Unternehmer": {
    "Unternehmerisches Denken": {
      befund: "Sie haben ein stabiles Unternehmerprofil und agieren ausgewogen in allen Bereichen. Allerdings fehlen manchmal neue Impulse für den nächsten Wachstumsschritt.",
      hebel: "Der Hebel liegt darin, sich bewusst für einen nächsten Entwicklungsschritt zu entscheiden. Gezielte Impulse von außen öffnen neue Perspektiven und verhindern Stillstand.",
      impact: "Gezielte Weiterentwicklung sichert langfristiges Wachstum. Sie bleiben zukunftsfähig und vermeiden Komfortzone."
    },
    "Leadership & Führung + Emotionen": {
      befund: "Sie führen gut und haben ein funktionierendes Team. Allerdings könnte gezielte Förderung einzelner Schlüsselpersonen noch mehr Potenzial freisetzen.",
      hebel: "Der Hebel liegt in reflektierter Führung: Welche Mitarbeiter könnten mehr Verantwortung übernehmen? Wo könnten Sie bewusst herausfordern? Gezielte Entwicklung steigert Leistung und Motivation.",
      impact: "Gezielte Teamentwicklung erhöht Leistung. Ihr Unternehmen wird dynamischer und Ihr Team wächst mit."
    },
    "Vertrieb & Wachstum": {
      befund: "Ihr Vertrieb läuft solide, aber es fehlt eine klare Differenzierung am Markt. Sie verkaufen gut, aber nicht herausragend.",
      hebel: "Der Hebel liegt in klarer Positionierung und Angebotsschärfung. Wenn Sie genau wissen, wofür Sie stehen und was Sie besonders gut können, wird Ihr Vertrieb stärker.",
      impact: "Klare Positionierung steigert Abschlussquote. Sie verkaufen profitabler und gewinnen die richtigen Kunden."
    },
    "Selbstmanagement & Resilienz": {
      befund: "Sie sind stabil und ausgeglichen, aber manchmal fehlt die Herausforderung. Ihre Ruhe könnte auch Komfortzone bedeuten.",
      hebel: "Der Hebel liegt darin, Ihre Stabilität für langfristige Planung zu nutzen. Strukturierte Strategie-Sessions helfen dabei, neue Ziele zu setzen und gezielt zu wachsen.",
      impact: "Ambitionierte Ziele bringen neue Dynamik. Sie nutzen Ihre Ruhe für strategisches Wachstum."
    },
    "Finanzen & Controlling": {
      befund: "Ihr Controlling läuft gut, aber Sie könnten ambitioniertere finanzielle Ziele setzen. Ihre Zahlen sind stabil, aber nicht herausfordernd.",
      hebel: "Der Hebel liegt in finanziellen Wachstumszielen. Wenn Sie sich bewusst höhere Ziele setzen, entsteht neue Dynamik und Ihr Unternehmen wächst profitabler.",
      impact: "Ambitionierte Finanzplanung treibt Wachstum. Sie steuern Ihr Unternehmen gezielter und erreichen mehr."
    },
    "Marketing & Marke": {
      befund: "Ihr Marketing läuft gut, aber es gibt ungenutztes Potenzial. Sie könnten mit klarer Markenpositionierung noch mehr erreichen.",
      hebel: "Der Hebel liegt in geschärfter Markenpositionierung. Wenn Sie klar kommunizieren, wofür Sie stehen, verstärkt das die Wirkung jeder Marketing-Maßnahme.",
      impact: "Klare Marke multipliziert Wirkung. Sie werden sichtbarer und gewinnen die richtigen Kunden gezielter."
    }
  }
}

/**
 * Wording-Optimierungen aus Revi-Dokument
 * Verwende diese Begriffe statt der alten
 */
/**
 * Ermittelt den Unternehmertyp basierend auf den Assessment-Scores
 */
export function determineEntrepreneurType(categoryScores: Array<{ category: string; percentage: number }>): keyof typeof KNOWLEDGE_BASE {
  // Erstelle Score-Map
  const scoreMap = Object.fromEntries(
    categoryScores.map(cat => [cat.category, cat.percentage])
  )
  
  const ut = scoreMap["Unternehmerisches Denken"] || 0
  const lf = scoreMap["Leadership & Führung + Emotionen"] || 0
  const vw = scoreMap["Vertrieb & Wachstum"] || 0
  const sr = scoreMap["Selbstmanagement & Resilienz"] || 0
  const fc = scoreMap["Finanzen & Controlling"] || 0
  const mm = scoreMap["Marketing & Marke"] || 0
  
  // Typ-Erkennungslogik
  if (ut >= 80 && lf >= 75) return "Der Visionär"
  if (vw >= 80 && mm >= 70) return "Der Sales-Entrepreneur"
  if (fc >= 80 && ut >= 70) return "Der Strategische Umsetzer"
  if (lf >= 80 && sr >= 75) return "Der Growth-Leader"
  if (sr >= 80 && lf >= 70) return "Der Entwickler"

  // Default: Ausgewogener Unternehmer
  return "Der Ausgewogene Unternehmer"
}

export const WORDING_GUIDE = {
  // Statt "Test" → "Analyse / Standortbestimmung / Executive Analyse"
  // Statt "Coaching" → "Beratung / Sparring / Begleitung"
  // Statt "Entwicklung" → "Skalierung / Weiterentwicklung / Professionalisierung"
  // Statt "Potenzial" → "Hebel / Wirkungspotenzial / Wachstumshebel"
  // Statt "verbessern" → "professionalisieren / optimieren"
  // Statt "bewusst werden" → "klar erkennen"
  // Statt "reflektieren" → "analysieren"
  
  replacements: {
    "können Sie sich noch verbessern": "liegt aktuell der größte unternehmerische Hebel",
    "Dieser Bereich bietet noch Entwicklungspotenzial": "Dieser Bereich limitiert aktuell Ihre Skalierbarkeit",
    "Sie haben gute Ansätze": "vorhanden, jedoch noch nicht systematisiert",
    "Arbeiten Sie an Ihrer Motivation": "Schaffen Sie klare Entscheidungsstrukturen und Prioritäten",
    "Bauen Sie mehr Selbstvertrauen auf": "Treffen Sie Entscheidungen schneller und datenbasiert",
    "Probieren Sie neue Wege aus": "Testen Sie neue Maßnahmen strukturiert und messbar"
  }
}
