"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { AssessmentResult } from "@/lib/scoring"
import { ScoreChart } from "@/components/results/score-chart"
import { TypeDescription } from "@/components/results/type-description"
import { PolarAxes } from "@/components/results/polar-axes"
import { generatePDF } from "@/lib/pdf-generator"
import { Mail, Download, TrendingUp, Target, Zap, Lightbulb, Brain, Handshake, Shield, Sprout, Scale } from "lucide-react"

// Icon-Mapping für jeden Unternehmenstyp
const typeIcons: { [key: string]: React.ElementType } = {
  "Der Visionär": Lightbulb,
  "Der Growth-Leader": TrendingUp,
  "Der Strategische Umsetzer": Shield,
  "Der Sales-Entrepreneur": Handshake,
  "Der Entwickler": Sprout,
  "Der Ausgewogene Unternehmer": Scale,
}

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [freetextAnswers, setFreetextAnswers] = useState<{ [key: string]: string }>({})
  const [assessmentId, setAssessmentId] = useState<string>("")
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const aiAnalysisStr = sessionStorage.getItem("aiAnalysis")
    if (!aiAnalysisStr) {
      router.push("/assessment")
      return
    }

    const data = JSON.parse(aiAnalysisStr)
    setResult(data.basicResults)
    setAiAnalysis(data.aiAnalysis)
    
    // Assessment ID laden
    const storedAssessmentId = sessionStorage.getItem("assessmentId")
    if (storedAssessmentId) {
      setAssessmentId(storedAssessmentId)
    }
    
    // Email automatisch vorausfüllen
    const userEmail = sessionStorage.getItem("userEmail")
    if (userEmail) {
      setEmail(userEmail)
    }
    
    // Freitext-Antworten aus Answers extrahieren
    const answersStr = sessionStorage.getItem("assessmentAnswers")
    if (answersStr) {
      const allAnswers = JSON.parse(answersStr)
      const freetext: { [key: string]: string } = {}
      Object.entries(allAnswers).forEach(([key, value]) => {
        if (key.includes("text") && typeof value === "string") {
          freetext[key] = value
        }
      })
      setFreetextAnswers(freetext)
    }
  }, [router])

  const handleSendEmail = async () => {
    if (!email || !result || !aiAnalysis) return

    setSending(true)
    try {
      // Hole userName und company aus sessionStorage
      const userName = sessionStorage.getItem("userName") || ""
      const company = sessionStorage.getItem("userCompany") || ""
      
      const response = await fetch("/api/send-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, result, aiAnalysis, userName, company, assessmentId }),
      })

      if (response.ok) {
        setSent(true)
      }
    } catch (error) {
      console.error("Error sending email:", error)
    } finally {
      setSending(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!result || !aiAnalysis) return

    setDownloading(true)
    try {
      // Hole userName und company aus sessionStorage
      const userName = sessionStorage.getItem("userName") || ""
      const company = sessionStorage.getItem("userCompany") || ""
      
      // Erweitere result mit User-Daten
      const resultWithUserData = {
        ...result,
        firstName: userName.split(' ')[0] || '',
        lastName: userName.split(' ').slice(1).join(' ') || '',
        companyName: company
      }
      
      // Nutze jsPDF (client-seitig, funktioniert immer)
      const pdfBlob = await generatePDF(resultWithUserData, true, JSON.stringify(aiAnalysis), freetextAnswers)
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Wingman_Assessment_${result.entrepreneurType.replace(/\s+/g, "_")}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading PDF:", error)
    } finally {
      setDownloading(false)
    }
  }

  if (!result || !aiAnalysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm md:text-lg text-muted-foreground">Ihre Ergebnisse werden geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Logo Header */}
      <div className="flex justify-center pt-6 md:pt-8 pb-4">
          <img
            src="/images/wingman-logo.png"
            alt="Wingman Coaching"
            className="h-12 md:h-16 w-auto"
          />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        <div className="space-y-8 md:space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4 md:space-y-6">
            <div className="inline-block px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-2 md:mb-4">
              <p className="text-xs md:text-sm font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide flex items-center gap-2 justify-center">
                <Brain className="w-4 h-4" />
                KI-Gestützte Analyse
              </p>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground">Ihre Ergebnisse</h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              Basierend auf Ihren Antworten haben wir eine umfassende, personalisierte Auswertung erstellt
            </p>
          </div>

          {/* Wingman Mittelstandsindex Hero */}
          <Card className="p-6 md:p-12 bg-gradient-to-br from-yellow-500/20 via-card/80 to-card/60 backdrop-blur-sm border-yellow-500/30 shadow-2xl shadow-yellow-500/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
              <div className="flex-1 text-center md:text-left space-y-3 md:space-y-4">
                <div className="space-y-2">
                  <p className="text-xs md:text-sm text-muted-foreground font-semibold tracking-wider uppercase">
                    Wingman Mittelstandsindex
                  </p>
                  <div className="flex items-baseline gap-3 justify-center md:justify-start">
                    <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-yellow-500">
                      {result.wingmanIndex || result.overallScore}
                    </span>
                    <span className="text-2xl md:text-3xl text-muted-foreground">/100</span>
                  </div>
                  <p className="text-base md:text-xl font-semibold text-foreground">
                    {result.indexSubtitle}
                  </p>
                </div>
                <div className="pt-4 border-t border-border/30">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    {result.entrepreneurType}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground max-w-xl">
                    {aiAnalysis?.executiveSummary?.split('\n')?.[0] || aiAnalysis?.patternInsights?.[0] || "Ihr unternehmerisches Profil wurde analysiert"}
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl shadow-yellow-500/40">
                  <div className="w-28 h-28 md:w-44 md:h-44 rounded-full bg-background flex items-center justify-center">
                    {(() => {
                      const TypeIcon = typeIcons[result.entrepreneurType] || Target
                      return <TypeIcon className="w-16 h-16 md:w-24 md:h-24 text-yellow-500" />
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Email Section */}
          <div className="flex justify-center">
            <Card className="p-6 md:p-10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/30 shadow-xl max-w-3xl w-full">
              {!sent ? (
                <div className="space-y-4 md:space-y-6">
                  <div className="text-center space-y-3 md:space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-yellow-500/10">
                      <Download className="w-6 h-6 md:w-8 md:h-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-xl md:text-3xl font-bold text-foreground">Vollständigen Report erhalten</h3>
                    <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                      Laden Sie Ihre detaillierte PDF-Analyse herunter oder lassen Sie sie per E-Mail zusenden
                    </p>
                  </div>

                  {/* Direct Download Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={handleDownloadPDF}
                      disabled={downloading}
                      size="lg"
                      className="bg-yellow-500 text-black hover:bg-yellow-400 h-12 md:h-14 px-8 md:px-12 text-base md:text-lg gap-2 shadow-xl font-bold"
                    >
                      {downloading ? (
                        "Wird erstellt..."
                      ) : (
                        <>
                          <Download className="w-4 h-4 md:w-5 md:h-5" />
                          Report jetzt herunterladen
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-4 text-muted-foreground">oder per E-Mail erhalten</span>
                    </div>
                  </div>

                  {/* Email Option */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-2xl mx-auto">
                    <Input
                      type="email"
                      placeholder="ihre.email@beispiel.de"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-background h-12 md:h-14 text-base md:text-lg px-4 md:px-6"
                    />
                    <Button
                      onClick={handleSendEmail}
                      disabled={!email || sending}
                      variant="outline"
                      size="lg"
                      className="h-12 md:h-14 px-6 md:px-10 text-base md:text-lg gap-2 bg-transparent"
                    >
                      {sending ? (
                        "Wird gesendet..."
                      ) : (
                        <>
                          <Mail className="w-4 h-4 md:w-5 md:h-5" />
                          Per E-Mail senden
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4 md:space-y-6 py-4 md:py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-yellow-500/20">
                    <Mail className="w-8 h-8 md:w-10 md:h-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">E-Mail erfolgreich versendet!</h3>
                  <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto px-4">
                    Ihr detaillierter Report wurde an <strong>{email}</strong> gesendet.
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Category Scores Chart */}
          <Card className="p-6 md:p-10 bg-card/50 backdrop-blur-sm border-yellow-500/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-xl md:text-2xl font-bold text-foreground">Ihre Kompetenzanalyse</h3>
            </div>
            <ScoreChart categoryScores={result.categoryScores} />
          </Card>

          {/* Polare Achsen & Perspektiven */}
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Detaillierte Kompetenz-Dimensionen</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                Ihre Position auf den polaren Achsen zeigt, wo Sie aktuell stehen.
              </p>
            </div>
            <PolarAxes categoryScores={result.categoryScores} />
          </div>

          {/* AI Insights */}
          <Card className="p-6 md:p-10 bg-gradient-to-br from-yellow-500/5 to-card/50 backdrop-blur-sm border-yellow-500/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <Brain className="w-6 h-6 md:w-7 md:h-7 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-xl md:text-2xl font-bold text-foreground">KI-Gestützte Insights</h3>
            </div>
            <div className="space-y-4">
              {aiAnalysis?.patternInsights?.map((insight: string, idx: number) => (
                <Card key={idx} className="p-4 md:p-6 bg-card/80 backdrop-blur-sm border-border/50">
                  <p className="text-sm md:text-base text-foreground leading-relaxed">{insight}</p>
                </Card>
              )) || <p className="text-muted-foreground">Keine Insights verfügbar</p>}
            </div>
          </Card>

          {/* Type Description */}
          <TypeDescription type={result.entrepreneurType} />

          {/* AI-Generated Strengths & Development Areas */}
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            <Card className="p-6 md:p-8 bg-gradient-to-br from-yellow-500/10 to-card/50 backdrop-blur-sm border-yellow-500/30 shadow-xl">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <Zap className="w-6 h-6 md:w-7 md:h-7 text-yellow-600 dark:text-yellow-400" />
                <h3 className="text-xl md:text-2xl font-bold text-foreground">Ihre Stärken</h3>
              </div>
              <ul className="space-y-3 md:space-y-4">
                {aiAnalysis?.strengths?.map((strength: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold text-xs md:text-sm">✓</span>
                    </div>
                    <div className="text-sm md:text-base text-foreground leading-relaxed">
                      {typeof strength === 'string' ? strength : (
                        <>
                          <strong>{strength.title}</strong>
                          <p className="mt-1">{strength.description}</p>
                        </>
                      )}
                    </div>
                  </li>
                )) || <li className="text-muted-foreground">Keine Stärken verfügbar</li>}
              </ul>
            </Card>

            <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border/30 shadow-xl">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <Target className="w-6 h-6 md:w-7 md:h-7 text-muted-foreground" />
                <h3 className="text-xl md:text-2xl font-bold text-foreground">Entwicklungsbereiche</h3>
              </div>
              <ul className="space-y-3 md:space-y-4">
                {aiAnalysis?.developmentAreas?.map((area: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-muted-foreground font-bold text-xs md:text-sm">→</span>
                    </div>
                    <div className="text-sm md:text-base text-foreground leading-relaxed">
                      {typeof area === 'string' ? area : (
                        <>
                          <strong>{area.title}</strong>
                          <p className="mt-1">{area.analysis}</p>
                        </>
                      )}
                    </div>
                  </li>
                )) || <li className="text-muted-foreground">Keine Entwicklungsbereiche verfügbar</li>}
              </ul>
            </Card>
          </div>

          {/* Action Steps */}
          <Card className="p-6 md:p-10 bg-gradient-to-br from-yellow-500/5 to-card/50 backdrop-blur-sm border-yellow-500/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <Lightbulb className="w-6 h-6 md:w-7 md:h-7 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-xl md:text-2xl font-bold text-foreground">Ihre nächsten Schritte</h3>
            </div>
            <div className="space-y-4">
              {(aiAnalysis?.actionPlan?.shortTerm || []).concat(aiAnalysis?.actionPlan?.mediumTerm || [], aiAnalysis?.actionPlan?.longTerm || []).map((step: string, idx: number) => (
                <Card key={idx} className="p-4 md:p-6 bg-card/80 backdrop-blur-sm border-border/50">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold">{idx + 1}</span>
                    </div>
                    <p className="text-sm md:text-base text-foreground leading-relaxed pt-1">{step}</p>
                  </div>
                </Card>
              )) || <p className="text-muted-foreground">Keine Action Steps verfügbar</p>}
            </div>
          </Card>

          {/* Call to Action - Erstgespräch buchen */}
          <Card className="relative overflow-hidden p-8 md:p-12 bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-card/50 backdrop-blur-sm border-yellow-500/40 shadow-2xl">
            {/* Dekorative Elemente */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl -z-10" />
            
            <div className="relative z-10 text-center space-y-6 md:space-y-8">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-yellow-500/20 border-2 border-yellow-500/40">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h3 className="text-2xl md:text-4xl font-bold text-foreground">
                  Bereit für den nächsten Schritt?
                </h3>
                <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Besprechen Sie Ihre Ergebnisse in einem kostenlosen Erstgespräch mit einem Wingman Experten und entwickeln Sie einen konkreten Umsetzungsplan.
                </p>
              </div>

              {/* Benefits */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm md:text-base">
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">30 Minuten kostenlos</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Unverbindlich</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Individuell auf Sie zugeschnitten</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button
                  onClick={async () => {
                    // Track CTA Click in Supabase
                    const assessmentId = sessionStorage.getItem("assessmentId")
                    if (assessmentId) {
                      try {
                        await fetch("/api/assessment/track-cta", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ assessmentId }),
                        })
                      } catch (error) {
                        console.error("CTA tracking error:", error)
                      }
                    }
                    window.location.href = '/termin-buchen'
                  }}
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold h-14 md:h-16 px-8 md:px-12 text-base md:text-lg gap-3 shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Erstgespräch jetzt buchen
                </Button>
                <Button
                  onClick={() => window.open('https://www.wingmancoaching.de/', '_blank')}
                  variant="outline"
                  size="lg"
                  className="h-14 md:h-16 px-8 md:px-12 text-base md:text-lg border-yellow-500/40 hover:border-yellow-500 hover:bg-yellow-500/10 bg-transparent"
                >
                  Mehr erfahren
                </Button>
              </div>

              {/* Trust Element */}
              <p className="text-xs md:text-sm text-muted-foreground/80 pt-4">
                Über 500 Unternehmer haben bereits ihr Potenzial mit Wingman Coaching entfaltet
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
