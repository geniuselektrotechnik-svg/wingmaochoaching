"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { QuestionCard } from "@/components/assessment/question-card"
import { ProgressBar } from "@/components/assessment/progress-bar"
import { assessmentQuestions } from "@/lib/questions"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function QuestionsPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: number | string }>({})
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)

  // Calculate average score for a category
  const getCategoryScore = (category: string): number => {
    const categoryQuestions = assessmentQuestions.filter(
      q => q.category === category && q.type === "scale"
    )
    const answeredQuestions = categoryQuestions.filter(q => answers[q.id] !== undefined)
    
    if (answeredQuestions.length === 0) return 0
    
    const sum = answeredQuestions.reduce((acc, q) => acc + (answers[q.id] as number), 0)
    return sum / answeredQuestions.length
  }

  // Get the appropriate question variant based on score
  const getQuestionVariant = (question: typeof assessmentQuestions[0]) => {
    if (question.type !== "freetext" || !question.variants) {
      return question
    }

    const categoryScore = getCategoryScore(question.category)
    
    // If score is low (< 6), use low variant, otherwise high variant
    if (categoryScore > 0 && categoryScore < 6 && question.variants.low) {
      return {
        ...question,
        text: question.variants.low.text,
        placeholder: question.variants.low.placeholder || question.placeholder
      }
    } else if (categoryScore >= 6 && question.variants.high) {
      return {
        ...question,
        text: question.variants.high.text,
        placeholder: question.variants.high.placeholder || question.placeholder
      }
    }
    
    return question
  }

  const currentQuestion = getQuestionVariant(assessmentQuestions[currentIndex])
  const isLastQuestion = currentIndex === assessmentQuestions.length - 1
  const canGoNext = answers[assessmentQuestions[currentIndex].id] !== undefined && 
    (currentQuestion.type !== "freetext" || (answers[assessmentQuestions[currentIndex].id] as string).trim().length > 0)

  const handleAnswer = (value: number | string) => {
    // Use original question ID to store answers
    const originalQuestionId = assessmentQuestions[currentIndex].id
    setAnswers((prev) => ({
      ...prev,
      [originalQuestionId]: value,
    }))
  }

  const handleNext = async () => {
    if (isLastQuestion) {
      setAnalyzing(true)
      setProgress(0)
      sessionStorage.setItem("assessmentAnswers", JSON.stringify(answers))

      // Progress animation - gleichmäßig über ca. 20 Sekunden verteilt
      let currentProgress = 0
      const progressInterval = setInterval(() => {
        currentProgress += 1
        setProgress(currentProgress)
        if (currentProgress >= 95) {
          clearInterval(progressInterval)
        }
      }, 200) // 200ms * 95 = 19 Sekunden bis 95%

      try {
        // Get assessmentId from sessionStorage
        const assessmentId = sessionStorage.getItem("assessmentId")

        // Call AI analysis API
        const industry = sessionStorage.getItem("userIndustry") || ""
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, assessmentId, industry }),
        })

        if (response.ok) {
          const aiAnalysis = await response.json()
          sessionStorage.setItem("aiAnalysis", JSON.stringify(aiAnalysis))
          // Complete progress
          clearInterval(progressInterval)
          setProgress(100)
          // Wait a bit before redirect
          setTimeout(() => {
            router.push("/results")
          }, 500)
        } else {
          // API Fehler - zeige Fehlermeldung
          clearInterval(progressInterval)
          console.error("API error:", response.status)
          alert("Es gab einen Fehler bei der Analyse. Bitte versuchen Sie es erneut.")
          setAnalyzing(false)
          setProgress(0)
        }
      } catch (error) {
        clearInterval(progressInterval)
        console.error("AI analysis error:", error)
        alert("Es gab einen Fehler bei der Analyse. Bitte versuchen Sie es erneut.")
        setAnalyzing(false)
        setProgress(0)
      }
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  // Debug: Auto-fill alle Fragen mit 10 bzw. passenden guten Antworten
  const handleQuickFill = () => {
    const autoAnswers: { [key: string]: number | string } = {}
    
    // Realistische gute Antworten für Freitext-Fragen basierend auf Frage-ID
    const smartAnswers: { [key: string]: string } = {
      "ud-text-1": "Wir haben eine klare 3-Jahres-Vision mit messbaren Meilensteinen. Innovation ist fest in unseren Prozessen verankert durch regelmäßige Strategiesessions.",
      "ud-text-2": "Digitalisierung der Kernprozesse, Entwicklung eines skalierbaren Geschäftsmodells und Aufbau strategischer Partnerschaften.",
      "lf-text-1": "Wöchentliche 1:1 Gespräche, klare Feedbackkultur und individuelle Entwicklungspläne für jeden Mitarbeiter.",
      "lf-text-2": "Transparente Kommunikation, schnelle Entscheidungswege und starker Teamzusammenhalt durch regelmäßige Teamevents.",
      "lf-text-3": "Aufbau einer zweiten Führungsebene, damit ich mich stärker auf Strategie konzentrieren kann statt im operativen Geschäft.",
      "vw-text-1": "Strukturierter Sales-Funnel mit CRM-System, regelmäßiges Tracking von Conversion-Rates und systematisches Follow-up.",
      "vw-text-2": "Premium-Positionierung als Experte in unserer Nische, fokussiert auf mittelständische Unternehmen mit hohem Qualitätsanspruch.",
      "vw-text-3": "Organisches Wachstum durch Kundenzufriedenheit und Empfehlungen, strategische Partnerschaften und gezielte Content-Marketing-Kampagnen.",
      "sr-text-1": "Fokus auf die drei wichtigsten Unternehmensziele, klare Prioritäten und konsequentes Nein zu Ablenkungen.",
      "sr-text-2": "Sport drei Mal pro Woche, feste Familien-Zeit am Wochenende und monatliche Auszeiten zur Reflexion.",
      "sr-text-3": "Erhöhung der Umsatzziele um 30%, Launch eines neuen Produkts und Ausbau des Teams um zwei Schlüsselpositionen.",
      "fc-text-1": "Keine akuten Sorgen - wir haben 6 Monate Liquiditätsreserve und ein funktionierendes Controlling-System.",
      "fc-text-2": "Customer Lifetime Value und Kosten pro Lead könnten wir besser tracken für noch präzisere Marketing-Entscheidungen.",
      "fc-text-3": "Wöchentlich die wichtigsten KPIs im Dashboard, monatlich detaillierte Auswertungen mit dem Steuerberater.",
      "mm-text-1": "Wir sind die Experten für nachhaltige Lösungen in unserer Branche mit nachweislich 40% höherer Kundenzufriedenheit als der Wettbewerb.",
      "mm-text-2": "Content-Marketing und SEO funktioniert am besten - organische Reichweite durch Expertise-Positionierung bringt hochqualifizierte Leads.",
      "mm-text-3": "Nichts hindert uns - wir investieren strategisch und messen den ROI systematisch. Marketing ist bei uns Chefsache.",
    }
    
    assessmentQuestions.forEach((q) => {
      if (q.type === "scale") {
        autoAnswers[q.id] = 10
      } else if (q.type === "freetext") {
        autoAnswers[q.id] = smartAnswers[q.id] || "Wir haben hier bereits gute Strukturen etabliert und arbeiten kontinuierlich an der Optimierung."
      }
    })
    
    setAnswers(autoAnswers)
    // Gehe zur letzten Frage
    setCurrentIndex(assessmentQuestions.length - 1)
  }

  if (analyzing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-lg w-full">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-yellow-500/30 border-b-transparent rounded-full animate-spin" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Wir analysieren Ihre Antworten...</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Wir erstellen gerade eine personalisierte Analyse für Ihr Unternehmen
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
              {progress}% abgeschlossen
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Logo Header */}
      <div className="flex justify-between items-center pt-6 md:pt-8 pb-4 container mx-auto px-4 max-w-4xl">
        <div className="flex-1" />
        <img
          src="/images/wingman-logo.png"
          alt="Wingman Coaching"
          className="h-12 md:h-16 w-auto"
        />
        <div className="flex-1 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickFill}
            className="text-xs bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20"
          >
            Quick Test
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
        <div className="space-y-6 md:space-y-8">
          {/* Progress */}
          <ProgressBar current={currentIndex + 1} total={assessmentQuestions.length} />

          {/* Question */}
          <QuestionCard question={currentQuestion} value={answers[currentQuestion.id]} onAnswer={handleAnswer} />

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="gap-2 bg-transparent order-2 sm:order-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canGoNext || analyzing}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 order-1 sm:order-2"
            >
              {isLastQuestion ? "Analyse starten" : "Weiter"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
