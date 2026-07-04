"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { Question } from "@/lib/questions"

const minChars = 1; // Declare minChars variable

interface QuestionCardProps {
  question: Question
  value?: number | string
  onAnswer: (value: number | string) => void
}

export function QuestionCard({ question, value, onAnswer }: QuestionCardProps) {
  const scaleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const [textValue, setTextValue] = useState<string>("");

  // Freitext-Frage
  if (question.type === "freetext") {
    const currentText = (typeof value === "string" ? value : "") || ""
    const charCount = currentText.length
    const minChars = 10
    const isValid = charCount >= minChars
    
    return (
      <div className="space-y-8">
        {/* Question Card mit goldenem Akzent */}
        <Card className="relative p-10 md:p-12 border-yellow-500/40 bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-card/40 backdrop-blur-sm shadow-2xl overflow-hidden">
          {/* Dekorativer Gradient-Overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl -z-10" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full" />
              <div className="inline-block px-5 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/40 backdrop-blur-sm shadow-lg shadow-yellow-500/10">
                <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  {question.category}
                </p>
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground leading-relaxed text-balance">
              {question.text}
            </h3>
            <p className="text-base md:text-lg text-muted-foreground/90">
              Ihre persönliche Antwort hilft der KI, eine präzise und individuell auf Sie zugeschnittene Analyse zu erstellen.
            </p>
          </div>
        </Card>

        {/* Textarea Container mit Premium-Design */}
        <div className="space-y-3">
          <div className="relative group">
            <Textarea
              value={currentText}
              onChange={(e) => {
                onAnswer(e.target.value)
              }}
              placeholder={question.placeholder || "Ihre Antwort..."}
              className="min-h-[240px] text-base md:text-lg p-6 md:p-8 resize-none border-2 border-yellow-500/30 focus:border-yellow-500 bg-card/80 backdrop-blur-sm rounded-xl shadow-lg focus:shadow-yellow-500/20 focus:shadow-2xl transition-all duration-300 placeholder:text-muted-foreground/50"
            />
            
            {/* Character Counter */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm transition-all ${
                isValid 
                  ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30' 
                  : charCount > 0
                  ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30'
                  : 'bg-muted/80 text-muted-foreground border border-border/50'
              }`}>
                {isValid ? '✓ Bereit' : charCount > 0 ? `Noch ${minChars - charCount} Zeichen` : 'Mindestens 10 Zeichen'}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                Tipp für beste Ergebnisse
              </p>
              <p className="text-xs text-muted-foreground">
                Je konkreter und ehrlicher Sie antworten, desto präziser kann die KI Ihre Situation analysieren und individuelle Empfehlungen geben. Denken Sie an spezifische Beispiele aus Ihrem Alltag.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Scale-Frage (Original)
  return (
    <div className="space-y-10">
      {/* Question Card */}
      <Card className="p-10 border-border/30 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm shadow-2xl">
        <div className="space-y-3">
          <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide">{question.category}</p>
          </div>
          <h3 className="text-3xl font-bold text-foreground leading-relaxed text-balance">{question.text}</h3>
        </div>
      </Card>

      {/* Answer Options */}
      <div className="space-y-6">
        <div className="flex justify-between text-sm font-medium text-muted-foreground px-2">
          <span>{question.scaleLabels?.min || "Trifft gar nicht zu"}</span>
          <span>{question.scaleLabels?.max || "Trifft voll zu"}</span>
        </div>

        <div className="grid grid-cols-10 gap-3">
          {scaleValues.map((scaleValue) => (
            <button
              key={scaleValue}
              onClick={() => onAnswer(scaleValue)}
              className={`
                relative h-20 rounded-xl border-2 transition-all duration-200 font-bold text-xl
                ${
                  value === scaleValue
                    ? "border-yellow-500 bg-yellow-500 text-black shadow-lg shadow-yellow-500/50 scale-105"
                    : "border-border/50 bg-card/30 hover:border-yellow-500/60 hover:bg-card/60 hover:scale-105 text-foreground/80 hover:text-foreground"
                }
              `}
            >
              {scaleValue}
              {value === scaleValue && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-1 pt-2">
          {scaleValues.map((scaleValue) => (
            <div
              key={scaleValue}
              className={`h-1.5 w-8 rounded-full transition-all ${
                value && scaleValue <= (value as number) ? "bg-yellow-500" : "bg-border/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
