"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SplitButton } from "@/components/ui/split-button"

/** Eingabefeld im Landing-Stil: dunkel, eckig, gelber Fokus-Rand */
const inputStyle =
  "h-14 text-base rounded-none border border-white/15 bg-[#0d0d0d] text-white placeholder:text-white/35 focus-visible:border-[#fae608] focus-visible:ring-0 transition-colors duration-200"

const labelStyle = "text-[13px] font-semibold uppercase tracking-[0.06em] text-white/70"

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fae608"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="15"
      height="15"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function StartPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    industry: "",
    email: "",
    phone: "",
  })
  const [agbAccepted, setAgbAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validierung (company ist optional)
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.industry) {
      setError("Bitte füllen Sie alle Pflichtfelder aus")
      return
    }

    // Email Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein")
      return
    }

    // AGB-Validierung
    if (!agbAccepted) {
      setError("Bitte akzeptieren Sie die AGB und Datenschutzerklärung")
      return
    }

    setLoading(true)

    try {
      // Speichere in Supabase
      const response = await fetch("/api/assessment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Fehler beim Speichern")
      }

      // Speichere ID und User-Daten im sessionStorage
      // (assessmentId kann null sein, wenn die Datenbank gerade nicht erreichbar ist)
      if (data.assessmentId) {
        sessionStorage.setItem("assessmentId", data.assessmentId)
      } else {
        sessionStorage.removeItem("assessmentId")
      }
      sessionStorage.setItem("userEmail", formData.email)
      sessionStorage.setItem("userName", `${formData.firstName} ${formData.lastName}`)
      sessionStorage.setItem("userCompany", formData.company || "")
      sessionStorage.setItem("userIndustry", formData.industry || "")
      sessionStorage.setItem("userPhone", formData.phone || "")

      // Weiter zu den Fragen
      router.push("/questions")
    } catch (err: any) {
      setError(err.message || "Ein Fehler ist aufgetreten")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Logo Header */}
      <div className="flex justify-center pt-7 md:pt-9 pb-4">
        <a href="/" aria-label="Zur Startseite">
          <img src="/images/wingman-logo.png" alt="Wingman Coaching" className="h-10 md:h-12 w-auto" />
        </a>
      </div>

      <main className="container mx-auto px-5 py-8 md:py-12 max-w-2xl">
        <div className="space-y-10">
          {/* Header */}
          <div className="space-y-4">
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#fae608]">/ Schritt 2 von 3 /</p>
            <h1 className="text-3xl md:text-4xl font-medium tracking-[-0.02em] leading-[1.15] text-white">
              Ihre Daten für den Report
            </h1>
            <p className="text-[15px] leading-relaxed text-white/60">
              Wir senden Ihnen den fertigen PDF Report per E-Mail und passen die Analyse an Ihre Branche an.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="firstName" className={labelStyle}>
                  Vorname *
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Max"
                  className={inputStyle}
                  required
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="lastName" className={labelStyle}>
                  Nachname *
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Mustermann"
                  className={inputStyle}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label htmlFor="email" className={labelStyle}>
                  E-Mail-Adresse *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="max@unternehmen.de"
                  className={inputStyle}
                  required
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="phone" className={labelStyle}>
                  Telefonnummer *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+49 123 456789"
                  className={inputStyle}
                  required
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="company" className={labelStyle}>
                Unternehmen
              </Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Ihr Unternehmen"
                className={inputStyle}
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="industry" className={labelStyle}>
                Branche *
              </Label>
              <Input
                id="industry"
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="z.B. IT, Handwerk, Gesundheit, Beratung..."
                className={inputStyle}
                required
              />
              <p className="text-[13px] text-white/45">Für branchenspezifische Empfehlungen in Ihrer Analyse.</p>
            </div>

            {/* AGB Checkbox */}
            <div className="flex items-start gap-4 p-5 bg-[#0d0d0d] border-l-2 border-[#fae608]">
              <input
                type="checkbox"
                id="agb"
                checked={agbAccepted}
                onChange={(e) => setAgbAccepted(e.target.checked)}
                className="mt-0.5 w-5 h-5 shrink-0 accent-[#fae608] cursor-pointer"
              />
              <label htmlFor="agb" className="text-[13px] leading-relaxed text-white/70 cursor-pointer">
                Ich akzeptiere die{" "}
                <a href="/agb" target="_blank" rel="noopener noreferrer" className="text-[#fae608] hover:underline font-semibold">
                  AGB
                </a>{" "}
                und{" "}
                <a href="/datenschutz" target="_blank" rel="noopener noreferrer" className="text-[#fae608] hover:underline font-semibold">
                  Datenschutzerklärung
                </a>{" "}
                und bin damit einverstanden, dass meine Daten zur Analyse und Bearbeitung meiner Anfrage verwendet
                werden. *
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-[#0d0d0d] border-l-2 border-red-500">
                <p className="text-sm text-red-400 font-semibold">{error}</p>
              </div>
            )}

            {/* Submit */}
            <SplitButton type="submit" disabled={loading} className="w-full">
              {loading ? "Wird geladen..." : "Analyse jetzt starten"}
            </SplitButton>

            {/* Trust Elements */}
            <div className="pt-6 border-t border-white/[0.13]">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 text-[13px] text-white/55">
                <span className="inline-flex items-center gap-2">
                  <Check /> Sicher verschlüsselt
                </span>
                <span className="inline-flex items-center gap-2">
                  <Check /> DSGVO-konform
                </span>
                <span className="inline-flex items-center gap-2">
                  <Check /> Vertraulich
                </span>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
