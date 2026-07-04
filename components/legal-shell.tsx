import type React from "react"
import { Card } from "@/components/ui/card"

/**
 * Einheitliche Hülle für alle Rechtstexte (Datenschutz, AGB, Widerruf).
 * Sorgt für konsistente Typografie über verschachtelte Elemente.
 */
export function LegalShell({
  title,
  intro,
  children,
}: {
  title: string
  intro?: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <a href="/" aria-label="Zur Startseite">
          <img src="/images/wingman-logo.png" alt="Wingman Coaching" className="h-11 w-auto mb-8" />
        </a>
        <Card className="p-8 md:p-10">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {intro ? <p className="text-sm text-foreground/60 mb-6">{intro}</p> : <div className="mb-6" />}
          <div className="space-y-4 text-foreground/90 leading-relaxed text-[15px] [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:pt-5 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:pt-3 [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1">
            {children}
          </div>
        </Card>
      </div>
    </div>
  )
}
