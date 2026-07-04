"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function AssessmentIntroPage() {
  const router = useRouter()

  const benefits = ["Detaillierte Kompetenzanalyse", "Individuelle Stärken & Potenziale", "Report per E-Mail"]

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full text-center space-y-8 md:space-y-12">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/images/wingman-logo.png"
            alt="Wingman Coaching"
            className="h-16 md:h-20 w-auto"
          />
        </div>

        {/* Headline */}
        <div className="space-y-3 md:space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight text-balance px-2">
            Analyse Ihrer unternehmerischen Kompetenzen
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed px-2">
            Wissenschaftlich fundiert. Individuell ausgewertet.
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-3 max-w-md mx-auto">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-3 text-left">
              <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0" />
              <span className="text-base md:text-lg text-foreground">{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Button
            size="lg"
            onClick={() => router.push("/assessment/payment")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-base md:text-lg px-8 md:px-12 py-5 md:py-6 h-auto w-full sm:w-auto"
          >
            Jetzt starten
          </Button>

          <p className="text-xs md:text-sm text-muted-foreground">10-15 Minuten | Vertraulich</p>
        </div>
      </div>
    </div>
  )
}
