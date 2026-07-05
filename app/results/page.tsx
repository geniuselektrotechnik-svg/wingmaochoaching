"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { SplitButton } from "@/components/ui/split-button"
import type { AssessmentResult } from "@/lib/scoring"
import { ScoreChart } from "@/components/results/score-chart"
import { TypeDescription } from "@/components/results/type-description"
import { PolarAxes } from "@/components/results/polar-axes"
import { generatePDF } from "@/lib/pdf-generator"
import { TrendingUp, Target, Lightbulb, Handshake, Shield, Sprout, Scale } from "lucide-react"

// Icon-Mapping für jeden Unternehmenstyp
const typeIcons: { [key: string]: React.ElementType } = {
  "Der Visionär": Lightbulb,
  "Der Growth-Leader": TrendingUp,
  "Der Strategische Umsetzer": Shield,
  "Der Sales-Entrepreneur": Handshake,
  "Der Entwickler": Sprout,
  "Der Ausgewogene Unternehmer": Scale,
}

/** Sektions-Kopf im Landing-Stil: / LABEL / + Titel + dünne gelbe Linie */
function SectionHead({ label, title }: { label: string; title: string }) {
  return (
    <div className="space-y-2 mb-8">
      <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#fae608]">/ {label} /</p>
      <h2 className="text-2xl md:text-3xl font-medium tracking-[-0.02em] text-white">{title}</h2>
      <div className="h-[2px] w-full bg-[#fae608]/70 mt-4" />
    </div>
  )
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
      const userName = sessionStorage.getItem("userName") || ""
      const company = sessionStorage.getItem("userCompany") || ""

      const resultWithUserData = {
        ...result,
        firstName: userName.split(" ")[0] || "",
        lastName: userName.split(" ").slice(1).join(" ") || "",
        companyName: company,
      }

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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-xs w-full">
          <div className="w-full h-[2px] bg-white/[0.13] overflow-hidden">
            <div className="h-full w-1/2 bg-[#fae608] animate-pulse" />
          </div>
          <p className="text-sm text-white/55">Ihre Ergebnisse werden geladen...</p>
        </div>
      </div>
    )
  }

  const TypeIcon = typeIcons[result.entrepreneurType] || Target

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Logo Header */}
      <div className="flex justify-center pt-7 md:pt-9 pb-4">
        <a href="/" aria-label="Zur Startseite">
          <img src="/images/wingman-logo.png" alt="Wingman Coaching" className="h-10 md:h-12 w-auto" />
        </a>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-5 py-8 md:py-14 max-w-5xl">
        <div className="space-y-14 md:space-y-20">
          {/* Header */}
          <div className="text-center space-y-4">
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#fae608]">
              / Ihre Auswertung /
            </p>
            <h1 className="text-4xl md:text-5xl font-medium tracking-[-0.02em] text-white">Ihre Ergebnisse</h1>
            <p className="text-[15px] text-white/60 max-w-2xl mx-auto leading-relaxed">
              Basierend auf Ihren Antworten haben wir eine umfassende, personalisierte Auswertung erstellt.
            </p>
          </div>

          {/* Wingman Mittelstandsindex */}
          <div className="bg-[#0d0d0d] border border-white/10">
            <div className="p-7 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left space-y-4">
                <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#fae608]">
                  / Wingman Mittelstandsindex /
                </p>
                <div className="flex items-end gap-3 justify-center md:justify-start">
                  <span className="text-7xl md:text-8xl font-medium tracking-[-0.03em] text-[#fae608] leading-none">
                    {result.wingmanIndex || result.overallScore}
                  </span>
                  <span className="text-2xl text-white/40 pb-1">/100</span>
                </div>
                <p className="text-base md:text-lg font-semibold text-white">{result.indexSubtitle}</p>
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-xl md:text-2xl font-medium tracking-[-0.02em] text-white mb-2">
                    {result.entrepreneurType}
                  </h3>
                  <p className="text-[15px] text-white/60 max-w-xl leading-relaxed">
                    {aiAnalysis?.executiveSummary?.split("\n")?.[0] ||
                      aiAnalysis?.patternInsights?.[0] ||
                      "Ihr unternehmerisches Profil wurde analysiert"}
                  </p>
                </div>
              </div>
              <div className="w-32 h-32 md:w-44 md:h-44 bg-[#fae608] flex items-center justify-center shrink-0">
                <TypeIcon className="w-16 h-16 md:w-22 md:h-22 text-[#0a0a0a]" strokeWidth={1.6} />
              </div>
            </div>
          </div>

          {/* Report erhalten */}
          <div className="bg-[#0d0d0d] border border-white/10 p-7 md:p-10">
            {!sent ? (
              <div className="space-y-7">
                <div className="text-center space-y-3">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#fae608]">
                    / Ihr Report /
                  </p>
                  <h3 className="text-2xl md:text-3xl font-medium tracking-[-0.02em] text-white">
                    Vollständigen Report erhalten
                  </h3>
                  <p className="text-[15px] text-white/60 max-w-xl mx-auto">
                    Laden Sie Ihre detaillierte PDF Analyse herunter oder lassen Sie sie per E-Mail zusenden.
                  </p>
                </div>

                <div className="flex justify-center">
                  <SplitButton onClick={handleDownloadPDF} disabled={downloading}>
                    {downloading ? "Wird erstellt..." : "Report jetzt herunterladen"}
                  </SplitButton>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/[0.13]" />
                  <span className="text-[11px] uppercase tracking-[0.08em] text-white/40">
                    oder per E-Mail erhalten
                  </span>
                  <div className="flex-1 h-px bg-white/[0.13]" />
                </div>

                <div className="flex flex-col sm:flex-row gap-[2px] max-w-xl mx-auto">
                  <Input
                    type="email"
                    placeholder="ihre.email@beispiel.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-[50px] flex-1 text-base rounded-none border border-white/15 bg-[#050505] text-white placeholder:text-white/35 focus-visible:border-[#fae608] focus-visible:ring-0 transition-colors duration-200"
                  />
                  <SplitButton variant="dark" onClick={handleSendEmail} disabled={!email || sending}>
                    {sending ? "Wird gesendet..." : "Per E-Mail senden"}
                  </SplitButton>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 py-6">
                <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#fae608]">/ Versendet /</p>
                <h3 className="text-2xl md:text-3xl font-medium tracking-[-0.02em] text-white">
                  E-Mail erfolgreich versendet
                </h3>
                <p className="text-[15px] text-white/60 max-w-md mx-auto">
                  Ihr detaillierter Report wurde an <strong className="text-white">{email}</strong> gesendet.
                </p>
              </div>
            )}
          </div>

          {/* Kompetenzanalyse */}
          <div>
            <SectionHead label="Scores" title="Ihre Kompetenzanalyse" />
            <ScoreChart categoryScores={result.categoryScores} />
          </div>

          {/* Polare Achsen */}
          <div>
            <SectionHead label="Dimensionen" title="Detaillierte Kompetenz-Dimensionen" />
            <p className="text-[15px] text-white/60 max-w-2xl -mt-4 mb-8">
              Ihre Position auf den polaren Achsen zeigt, wo Sie aktuell stehen.
            </p>
            <PolarAxes categoryScores={result.categoryScores} />
          </div>

          {/* KI Insights */}
          <div>
            <SectionHead label="Muster" title="Zentrale Erkenntnisse" />
            <div className="space-y-[2px]">
              {aiAnalysis?.patternInsights?.map((insight: string, idx: number) => (
                <div key={idx} className="p-5 md:p-6 bg-[#0d0d0d] border border-white/10 flex items-start gap-4">
                  <span className="w-2 h-2 bg-[#fae608] mt-[7px] shrink-0" />
                  <p className="text-[15px] text-white/80 leading-relaxed">{insight}</p>
                </div>
              )) || <p className="text-white/50">Keine Insights verfügbar</p>}
            </div>
          </div>

          {/* Type Description */}
          <TypeDescription type={result.entrepreneurType} />

          {/* Stärken & Entwicklungsbereiche */}
          <div className="grid lg:grid-cols-2 gap-[2px]">
            <div className="bg-[#0d0d0d] border border-white/10 p-7 md:p-8">
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#fae608] mb-6">
                / Ihre Stärken /
              </p>
              <ul className="space-y-5">
                {aiAnalysis?.strengths?.map((strength: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-3.5">
                    <span className="w-2 h-2 bg-[#fae608] mt-[7px] shrink-0" />
                    <div className="text-[15px] text-white/80 leading-relaxed">
                      {typeof strength === "string" ? (
                        strength
                      ) : (
                        <>
                          <strong className="text-white">{strength.title}</strong>
                          <p className="mt-1">{strength.description}</p>
                        </>
                      )}
                    </div>
                  </li>
                )) || <li className="text-white/50">Keine Stärken verfügbar</li>}
              </ul>
            </div>

            <div className="bg-[#0d0d0d] border border-white/10 p-7 md:p-8">
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-white/60 mb-6">
                / Entwicklungsbereiche /
              </p>
              <ul className="space-y-5">
                {aiAnalysis?.developmentAreas?.map((area: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-3.5">
                    <span className="w-2 h-2 border border-white/40 mt-[7px] shrink-0" />
                    <div className="text-[15px] text-white/80 leading-relaxed">
                      {typeof area === "string" ? (
                        area
                      ) : (
                        <>
                          <strong className="text-white">{area.title}</strong>
                          <p className="mt-1">{area.analysis}</p>
                        </>
                      )}
                    </div>
                  </li>
                )) || <li className="text-white/50">Keine Entwicklungsbereiche verfügbar</li>}
              </ul>
            </div>
          </div>

          {/* Nächste Schritte */}
          <div>
            <SectionHead label="Ihr Plan" title="Ihre nächsten Schritte" />
            <div className="space-y-[2px]">
              {(aiAnalysis?.actionPlan?.shortTerm || [])
                .concat(aiAnalysis?.actionPlan?.mediumTerm || [], aiAnalysis?.actionPlan?.longTerm || [])
                .map((step: string, idx: number) => (
                  <div key={idx} className="p-5 md:p-6 bg-[#0d0d0d] border border-white/10 flex items-start gap-5">
                    <span className="text-[#fae608] font-semibold text-lg tabular-nums leading-none pt-0.5">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[15px] text-white/80 leading-relaxed">{step}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* CTA Erstgespräch */}
          <div className="bg-[#0d0d0d] border border-[#fae608]/40 p-8 md:p-14 text-center space-y-7">
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#fae608]">/ Jetzt starten /</p>
            <h3 className="text-3xl md:text-4xl font-medium tracking-[-0.02em] text-white">
              Bereit für den nächsten Schritt?
            </h3>
            <p className="text-[15px] md:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
              Besprechen Sie Ihre Ergebnisse in einem kostenlosen Erstgespräch mit einem Wingman Experten und
              entwickeln Sie einen konkreten Umsetzungsplan.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center text-[13px] text-white/60">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-[#fae608]" /> 30 Minuten kostenlos
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-[#fae608]" /> Unverbindlich
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-[#fae608]" /> Individuell auf Sie zugeschnitten
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <SplitButton
                onClick={async () => {
                  // Track CTA Click in Supabase
                  const trackedId = sessionStorage.getItem("assessmentId")
                  if (trackedId) {
                    try {
                      await fetch("/api/assessment/track-cta", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ assessmentId: trackedId }),
                      })
                    } catch (error) {
                      console.error("CTA tracking error:", error)
                    }
                  }
                  window.location.href = "/termin-buchen"
                }}
                className="w-full sm:w-auto"
              >
                Erstgespräch jetzt buchen
              </SplitButton>
              <SplitButton variant="dark" className="w-full sm:w-auto" onClick={() => window.open("https://www.wingmancoaching.de/", "_blank")}>
                Mehr erfahren
              </SplitButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
