"use client"

import { Textarea } from "@/components/ui/textarea"
import type { Question } from "@/lib/questions"

interface QuestionCardProps {
  question: Question
  value?: number | string
  onAnswer: (value: number | string) => void
}

/** Kategorie-Label im Landing-Stil: "/ KATEGORIE /" in Gelb, uppercase, gesperrt */
function CategoryTag({ children }: { children: string }) {
  return (
    <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#fae608]">
      {children}
    </p>
  )
}

export function QuestionCard({ question, value, onAnswer }: QuestionCardProps) {
  const scaleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  // Freitext-Frage
  if (question.type === "freetext") {
    const currentText = (typeof value === "string" ? value : "") || ""
    const charCount = currentText.length
    const minChars = 10
    const isValid = charCount >= minChars

    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <CategoryTag>{question.category}</CategoryTag>
          <h3 className="text-3xl md:text-4xl font-medium tracking-[-0.02em] leading-[1.15] text-white text-balance">
            {question.text}
          </h3>
          <p className="text-[15px] leading-relaxed text-white/60 max-w-2xl">
            Ihre persönliche Antwort hilft der KI, eine präzise und individuell auf Sie
            zugeschnittene Analyse zu erstellen.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={currentText}
              onChange={(e) => onAnswer(e.target.value)}
              placeholder={question.placeholder || "Ihre Antwort..."}
              className="min-h-[220px] text-base md:text-lg p-6 resize-none rounded-none border border-white/15 bg-[#0d0d0d] text-white placeholder:text-white/35 focus-visible:border-[#fae608] focus-visible:ring-0 transition-colors duration-200"
            />
            <div className="absolute bottom-4 right-4">
              <div
                className={`px-3 py-1.5 text-xs font-semibold ${
                  isValid
                    ? "bg-[#fae608] text-[#0a0a0a]"
                    : charCount > 0
                      ? "bg-[#1a1a1a] text-[#fae608] border border-[#fae608]/40"
                      : "bg-[#1a1a1a] text-white/50 border border-white/15"
                }`}
              >
                {isValid ? "Bereit" : charCount > 0 ? `Noch ${minChars - charCount} Zeichen` : "Mindestens 10 Zeichen"}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-[#0d0d0d] border-l-2 border-[#fae608]">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Tipp für beste Ergebnisse</p>
              <p className="text-[13px] leading-relaxed text-white/55">
                Je konkreter und ehrlicher Sie antworten, desto präziser kann die KI Ihre Situation
                analysieren. Denken Sie an spezifische Beispiele aus Ihrem Alltag.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Skala-Frage
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <CategoryTag>{question.category}</CategoryTag>
        <h3 className="text-3xl md:text-4xl font-medium tracking-[-0.02em] leading-[1.15] text-white text-balance">
          {question.text}
        </h3>
      </div>

      <div className="space-y-5">
        <div className="flex justify-between text-[13px] font-medium uppercase tracking-[0.04em] text-white/50">
          <span>{question.scaleLabels?.min || "Trifft gar nicht zu"}</span>
          <span>{question.scaleLabels?.max || "Trifft voll zu"}</span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-[2px]">
          {scaleValues.map((scaleValue) => (
            <button
              key={scaleValue}
              onClick={() => onAnswer(scaleValue)}
              className={`h-16 md:h-20 font-semibold text-lg md:text-xl transition-colors duration-150 ${
                value === scaleValue
                  ? "bg-[#fae608] text-[#0a0a0a]"
                  : "bg-[#111] text-white/70 border border-white/10 hover:border-[#fae608]/60 hover:text-white"
              }`}
            >
              {scaleValue}
            </button>
          ))}
        </div>

        <div className="flex gap-[2px]">
          {scaleValues.map((scaleValue) => (
            <div
              key={scaleValue}
              className={`h-[2px] flex-1 transition-colors ${
                value && scaleValue <= (value as number) ? "bg-[#fae608]" : "bg-white/[0.13]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
