"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Mail, User, Sparkles } from "lucide-react"

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
      sessionStorage.setItem("assessmentId", data.assessmentId)
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dekorative Background Elemente */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl -z-10" />
      
      {/* Logo Header */}
      <div className="flex justify-center pt-6 md:pt-8 pb-4">
          <img
            src="/images/wingman-logo.png"
            alt="Wingman Coaching"
            className="h-12 w-auto leading-8 opacity-100 md:h-16"
          />
      </div>
      
      <div className="min-h-screen flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-2xl space-y-10">
          {/* Header */}
          <div className="text-center space-y-6">
            {/* Icon */}
                        <div className="flex items-center justify-center gap-2 pt-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-12 h-1 bg-border" />
              <div className="w-3 h-3 rounded-full bg-border" />
              <div className="w-12 h-1 bg-border" />
              <div className="w-3 h-3 rounded-full bg-border" />
            </div>
            <p className="text-sm text-muted-foreground font-semibold">Schritt 1 von 3</p>
          </div>

          {/* Form Card */}
          <Card className="relative overflow-hidden p-8 md:p-12 bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-card/50 backdrop-blur-sm border-yellow-500/30 shadow-2xl">
            {/* Dekoratives Element im Card */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-base font-bold text-foreground flex items-center gap-2">
                    <User className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    Vorname *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Max"
                    className="h-14 text-base border-2 border-yellow-500/30 focus:border-yellow-500 bg-card/80 backdrop-blur-sm"
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-base font-bold text-foreground flex items-center gap-2">
                    <User className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    Nachname *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Mustermann"
                    className="h-14 text-base border-2 border-yellow-500/30 focus:border-yellow-500 bg-card/80 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base font-bold text-foreground flex items-center gap-2">
                    <Mail className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    E-Mail-Adresse *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="max@unternehmen.de"
                    className="h-14 text-base border-2 border-yellow-500/30 focus:border-yellow-500 bg-card/80 backdrop-blur-sm"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-base font-bold text-foreground flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Telefonnummer *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+49 123 456789"
                    className="h-14 text-base border-2 border-yellow-500/30 focus:border-yellow-500 bg-card/80 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground flex items-center gap-1 -mt-3">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Wir senden Ihnen den Premium-Report per E-Mail
              </p>

              {/* Company (Optional) */}
              <div className="space-y-3">
                <Label htmlFor="company" className="text-base font-bold text-foreground flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  Unternehmen 
                </Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Ihr Unternehmen"
                  className="h-14 text-base border-2 border-yellow-500/30 focus:border-yellow-500 bg-card/80 backdrop-blur-sm"
                />
              </div>

              {/* Branche */}
              <div className="space-y-3">
                <Label htmlFor="industry" className="text-base font-bold text-foreground flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  Branche *
                </Label>
                <Input
                  id="industry"
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="z.B. IT, Handwerk, Gesundheit, Beratung..."
                  className="h-14 text-base border-2 border-yellow-500/30 focus:border-yellow-500 bg-card/80 backdrop-blur-sm"
                  required
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Für branchenspezifische Empfehlungen in Ihrer Analyse
                </p>
              </div>

              {/* AGB Checkbox */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                <input
                  type="checkbox"
                  id="agb"
                  checked={agbAccepted}
                  onChange={(e) => setAgbAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-yellow-500/50 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="agb" className="text-sm text-foreground cursor-pointer">
                  Ich akzeptiere die{" "}
                  <a href="/agb" target="_blank" rel="noopener noreferrer" className="text-yellow-600 dark:text-yellow-400 hover:underline font-semibold">
                    AGB
                  </a>{" "}
                  und{" "}
                  <a href="/datenschutz" target="_blank" rel="noopener noreferrer" className="text-yellow-600 dark:text-yellow-400 hover:underline font-semibold">
                    Datenschutzerklärung
                  </a>
                  {" "}und bin damit einverstanden, dass meine Daten zur Analyse und Bearbeitung meiner Anfrage verwendet werden. *
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border-2 border-red-500/30 animate-in fade-in slide-in-from-top-2">
                  <p className="text-sm text-red-600 dark:text-red-400 font-semibold">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 text-lg font-bold bg-yellow-500 hover:bg-yellow-400 text-black shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-[1.02] gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin" />
                    Wird geladen...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyse jetzt starten
                  </>
                )}
              </Button>

              {/* Trust Elements */}
              <div className="pt-6 space-y-3 border-t border-border/50">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Sicher verschlüsselt</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">DSGVO-konform</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="font-semibold">500+ Unternehmer</span>
                  </div>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
