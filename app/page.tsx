"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, BarChart3, Target, TrendingUp, Users, Lightbulb, Shield, Handshake, Sprout, Scale } from "lucide-react"
import { assessmentQuestions } from "@/lib/questions"

export default function HomePage() {
  const router = useRouter()
  const totalQuestions = assessmentQuestions.length

  const benefits = [
    { icon: BarChart3, title: "Detaillierte Analyse", desc: `${totalQuestions} Fragen in 6 Kernbereichen` },
    { icon: Target, title: "Individuelle Auswertung", desc: "KI-gestützte Tiefenanalyse" },
    { icon: TrendingUp, title: "Konkrete Handlungsschritte", desc: "90-Tage Aktionsplan" }
  ]

  const stats = [
    { number: "500+", label: "Analysen durchgeführt" },
    { number: totalQuestions.toString(), label: "Fragen & Bewertungen" },
    { number: "15-20", label: "Minuten Bearbeitungszeit" }
  ]

  const entrepreneurTypes = [
    { name: "Der Visionär", icon: Lightbulb },
    { name: "Der Growth-Leader", icon: TrendingUp },
    { name: "Der Strategische Umsetzer", icon: Shield },
    { name: "Der Sales-Entrepreneur", icon: Handshake },
    { name: "Der Entwickler", icon: Sprout },
    { name: "Der Ausgewogene Unternehmer", icon: Scale },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img
            src="/images/wingman-logo.png"
            alt="Wingman Coaching"
            className="h-10 md:h-12 w-auto"
          />
          <Button
            variant="ghost"
            onClick={() => router.push("/payment")}
            className="text-sm font-medium"
          >
            Zur Analyse
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 md:py-28 lg:py-36 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-sm font-semibold backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shadow-lg shadow-yellow-500/50" />
              Premium Business Assessment
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[1.1] text-balance tracking-tight">
              Wo steht Ihr Business
              <span className="block mt-2 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 bg-clip-text text-transparent animate-gradient">
                wirklich?
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Die Wingman Unternehmensanalyse 360° ist ein unternehmerischer Spiegel, der Klarheit, Bewusstsein und fundierte Entscheidungsfähigkeit schafft. Ein strategisches Fundament, um Ihr Unternehmen gezielt weiterzuentwickeln und sich nachhaltig in der Oberklasse des Mittelstands zu positionieren. Nach Abschluss erhalten Sie einen detaillierten PDF-Report mit Ihrer persönlichen Auswertung.
            </p>

            {/* CTA Button */}
            <div className="flex items-center justify-center pt-6">
              <Button
                size="lg"
                onClick={() => router.push("/payment")}
                className="relative bg-yellow-500 text-black hover:bg-yellow-400 text-lg md:text-xl px-10 md:px-14 h-16 font-bold shadow-2xl shadow-yellow-500/30 transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/40 group w-full sm:w-auto overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Jetzt starten
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>

            {/* Anfangen  */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                <span>15-20 Minuten</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                <span>Sofort starten</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                <span>Vertraulich</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/20 bg-gradient-to-b from-muted/50 to-muted/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center space-y-3 group">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-yellow-500 to-yellow-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-base text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unternehmenstypen Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Welcher Unternehmenstyp sind Sie?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unternehmensanalyse 360 identifiziert 6 verschiedene Unternehmenstypen :   
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {entrepreneurTypes.map((type, idx) => {
              const TypeIcon = type.icon
              return (
                <div
                  key={idx}
                  className="group relative p-6 md:p-8 rounded-2xl bg-card border border-border/50 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10 hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-yellow-500/10">
                      <TypeIcon className="w-8 h-8 md:w-10 md:h-10 text-yellow-500" />
                    </div>
                    <h3 className="text-sm md:text-base lg:text-lg font-bold text-foreground group-hover:text-yellow-500 transition-colors">
                      {type.name}
                    </h3>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Was Sie erhalten
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <div
                  key={idx}
                  className="group relative p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-yellow-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-2"
                >
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-yellow-500/10">
                      <Icon className="w-7 h-7 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-yellow-500 transition-colors">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-base">{benefit.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-[2rem] bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-background border-2 border-yellow-500/30 p-10 md:p-16 text-center space-y-8 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Bereit für mehr Klarheit?
              </h2>
              <Button
                size="lg"
                onClick={() => router.push("/payment")}
                className="bg-yellow-500 text-black hover:bg-yellow-400 text-xl px-16 h-16 font-bold shadow-2xl shadow-yellow-500/30 transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/40"
              >
                Jetzt starten
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
