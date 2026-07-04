"use client"

import { Card } from "@/components/ui/card"
import type { CategoryScore } from "@/lib/scoring"

interface PolarAxis {
  from: string
  to: string
}

interface PerspectiveData {
  name: string
  icon: string
  color: string
  description: string
}

const perspectives: PerspectiveData[] = [
  {
    name: "Unternehmer",
    icon: "📊",
    color: "from-blue-500/20 to-blue-600/10",
    description: "Zahlen, Struktur, Steuerung, Realität"
  },
  {
    name: "Coach",
    icon: "🧭",
    color: "from-green-500/20 to-green-600/10",
    description: "Haltung, Bewusstsein, Führung, innere Stabilität"
  },
  {
    name: "Sales",
    icon: "📈",
    color: "from-purple-500/20 to-purple-600/10",
    description: "Markt, Wachstum, Umsetzung, Wirkung nach außen"
  }
]

const categoryAxes: { [key: string]: PolarAxis[] } = {
  "Unternehmerisches Denken": [
    { from: "Komfortzone / Prokrastination", to: "Vision & Wachstum" },
    { from: "Wenig Klarheit", to: "Kennzahlenprofi" },
    { from: "Reaktion", to: "Gestaltung" }
  ],
  "Leadership & Führung + Emotionen": [
    { from: "Im Unternehmen", to: "Am Unternehmen" },
    { from: "Improvisierte Führung", to: "Generalisierte Führung" },
    { from: "Kontrolle", to: "Verantwortung & Vertrauen" }
  ],
  "Vertrieb & Wachstum": [
    { from: "Intuitiver Vertrieb", to: "Systematisierter Vertrieb" },
    { from: "Einzelabschlüsse", to: "Planbarer Sales-Prozess" },
    { from: "Sales heute", to: "Next-Level Sales" }
  ],
  "Selbstmanagement & Resilienz": [
    { from: "Autopilot", to: "Bewusstes Handeln" },
    { from: "Isolation", to: "Wir-Gefühl / Kohäsion" },
    { from: "Unsicherheit / Risiko", to: "Sicherheit / Chance" }
  ],
  "Finanzen & Controlling": [
    { from: "Bauchgefühl", to: "Zahlenklarheit" },
    { from: "Liquidität sichern", to: "Wert & Wachstum steuern" },
    { from: "Kurzfristig", to: "Langfristige Finanzstrategie" }
  ],
  "Marketing & Marke": [
    { from: "Intuition", to: "Datenbasiert" },
    { from: "Einzelmaßnahmen", to: "Integrierte Strategie" },
    { from: "Kurzfristig", to: "Markenaufbau" }
  ]
}

interface PolarAxesProps {
  categoryScores: CategoryScore[]
}

// Mapping: Welche Fragen gehören zu welcher Achse (in Reihenfolge)
const categoryQuestionMapping: { [key: string]: string[][] } = {
  "Unternehmerisches Denken": [
    ["ut-1", "ut-2", "ut-3"], // Achse 1: Vision & Wachstum
    ["ut-4", "ut-6", "ut-7"], // Achse 2: Kennzahlenprofi
    ["ut-8", "ut-9", "ut-10"] // Achse 3: Gestaltung
  ],
  "Leadership & Führung + Emotionen": [
    ["lf-1", "lf-2", "lf-3"], // Achse 1: Am Unternehmen
    ["lf-4", "lf-5", "lf-6"], // Achse 2: Generalisierte Führung
    ["lf-7", "lf-8", "lf-9", "lf-10"] // Achse 3: Verantwortung & Vertrauen
  ],
  "Vertrieb & Wachstum": [
    ["vw-1", "vw-2", "vw-3"], // Achse 1: Systematisierter Vertrieb
    ["vw-4", "vw-5", "vw-6"], // Achse 2: Planbarer Sales-Prozess
    ["vw-7", "vw-8", "vw-9", "vw-10"] // Achse 3: Next-Level Sales
  ],
  "Selbstmanagement & Resilienz": [
    ["sr-1", "sr-2", "sr-3"], // Achse 1: Bewusstes Handeln
    ["sr-4", "sr-5", "sr-6"], // Achse 2: Wir-Gefühl / Kohäsion
    ["sr-7", "sr-8", "sr-9", "sr-10"] // Achse 3: Sicherheit / Chance
  ],
  "Finanzen & Controlling": [
    ["fc-1", "fc-2", "fc-3"], // Achse 1: Zahlenklarheit
    ["fc-4", "fc-5", "fc-6"], // Achse 2: Wert & Wachstum steuern
    ["fc-7", "fc-8", "fc-9", "fc-10"] // Achse 3: Langfristige Finanzstrategie
  ],
  "Marketing & Marke": [
    ["mm-1", "mm-2", "mm-3"], // Achse 1: Datenbasiert
    ["mm-4", "mm-5", "mm-6"], // Achse 2: Integrierte Strategie
    ["mm-7", "mm-8", "mm-9", "mm-10"] // Achse 3: Markenaufbau
  ]
}

export function PolarAxes({ categoryScores }: PolarAxesProps) {
  // Hole die ursprünglichen Antworten aus dem sessionStorage
  const answersStr = typeof window !== 'undefined' ? sessionStorage.getItem("assessmentAnswers") : null
  const answers: { [key: string]: number } = answersStr ? JSON.parse(answersStr) : {}

  // Berechne für jede Achse den durchschnittlichen Score basierend auf den zugehörigen Fragen
  const getAxisScore = (category: string, axisIndex: number): number => {
    const questionIds = categoryQuestionMapping[category]?.[axisIndex]
    if (!questionIds) return 0

    const scores = questionIds
      .map(id => answers[id])
      .filter(score => typeof score === 'number') as number[]

    if (scores.length === 0) return 0

    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length
    return Math.round((avg / 10) * 100) // Konvertiere zu Prozent
  }

  return (
    <div className="space-y-8">
      {/* 3 Perspektiven Header */}
      <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-card/50 border-yellow-500/30">
        <h3 className="text-xl font-bold text-foreground mb-4">Die 3 Wingman-Perspektiven</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Ihre Auswertung betrachtet Sie aus drei professionellen Blickwinkeln - jeder mit eigener Sprache und Fokus
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {perspectives.map((perspective) => (
            <div
              key={perspective.name}
              className={`p-4 rounded-lg bg-gradient-to-br ${perspective.color} border border-border/30`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{perspective.icon}</span>
                <h4 className="font-bold text-foreground">{perspective.name}-Perspektive</h4>
              </div>
              <p className="text-xs text-muted-foreground">{perspective.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Polare Achsen für jeden Kompetenzbereich */}
      {categoryScores.map((category) => {
        const axes = categoryAxes[category.category]
        if (!axes) return null

        return (
          <Card key={category.category} className="p-6 bg-card/50 border-border/30">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">{category.category}</h3>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-yellow-500">{category.percentage}%</div>
                <div className="text-sm text-muted-foreground">Gesamtbewertung</div>
              </div>
            </div>

            <div className="space-y-6">
              {axes.map((axis, index) => {
                // Jede Achse bekommt jetzt ihren eigenen Score!
                const position = getAxisScore(category.category, index)

                return (
                  <div key={index} className="space-y-2">
                    {/* Achsen-Titel */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">{axis.from}</span>
                      <span className="text-muted-foreground font-medium">{axis.to}</span>
                    </div>

                    {/* Slider mit Marker */}
                    <div className="relative h-3 bg-gradient-to-r from-red-500/30 via-yellow-500/30 to-green-500/30 rounded-full">
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-500 border-4 border-background rounded-full shadow-lg transition-all flex items-center justify-center"
                        style={{ left: `${position}%` }}
                      >
                        <span className="text-[8px] font-bold text-background">{position}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
