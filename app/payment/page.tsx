"use client"

import { Input } from "@/components/ui/input"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Check } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [voucherCode, setVoucherCode] = useState("")
  const [voucherApplied, setVoucherApplied] = useState(false)
  const [voucherError, setVoucherError] = useState("")

  const paymentMethods = [
    {
      id: "paypal",
      name: "PayPal",
      logo: "/images/paypal-logo.png",
      description: "Schnell und sicher bezahlen",
    },
    {
      id: "card",
      name: "Kreditkarte",
      logo: "/images/card-logo.svg",
      description: "Visa, Mastercard, American Express",
    },
    {
      id: "klarna",
      name: "Klarna",
      logo: "/images/klarna-logo.svg",
      description: "Jetzt kaufen, später bezahlen",
    },
    {
      id: "sepa",
      name: "SEPA Lastschrift",
      logo: "/images/sepa-lastschrift-logo.png",
      description: "Bankeinzug per SEPA-Verfahren",
    },
  ]

  const handleApplyVoucher = () => {
    if (voucherCode.toLowerCase() === "wingman100") {
      setVoucherApplied(true)
      setVoucherError("")
    } else {
      setVoucherError("Ungültiger Gutschein-Code")
      setVoucherApplied(false)
    }
  }

  const handleContinue = () => {
    if (voucherApplied) {
      // Mit Gutschein direkt weiter
      sessionStorage.setItem("hasPaid", "true")
      router.push("/start")
    } else if (selectedMethod) {
      // Normale Zahlung
      sessionStorage.setItem("hasPaid", "true")
      router.push("/start")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Logo Header */}
      <div className="flex justify-center pt-6 md:pt-8 pb-4">
        <img
          src="/images/wingman-logo.png"
          alt="Wingman Coaching"
          className="h-12 md:h-14 w-auto"
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-10 max-w-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Ihre Unternehmeranalyse</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Professionelles 360° Assessment
            </p>
          </div>

          {/* Compact Pricing Card */}
          <Card className="p-6 md:p-8 bg-card border-border shadow-lg">
            <div className="space-y-4">
              <div className="text-center pb-4 border-b border-border/50">
                <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-1">599€</div>
                <p className="text-sm text-muted-foreground">Einmalige Investition</p>
              </div>

              <div>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">78 Fragen (67 Skala-Fragen + 11 Freitext)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">KI-gestützte Tiefenanalyse Ihres Unternehmens</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Premium PDF-Report (20-25 Seiten) mit Statistiken</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Personalisierter 90-Tage Entwicklungsplan</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Detaillierte Handlungsempfehlungen basierend auf Ihren Antworten</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Gutschein-Code Section */}
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-card/50 border-green-500/30">
            <h2 className="text-lg font-semibold text-foreground mb-4">Gutschein-Code einlösen</h2>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Gutschein-Code eingeben"
                  value={voucherCode}
                  onChange={(e) => {
                    setVoucherCode(e.target.value)
                    setVoucherError("")
                  }}
                  className="flex-1"
                  disabled={voucherApplied}
                />
                <Button
                  onClick={handleApplyVoucher}
                  disabled={!voucherCode || voucherApplied}
                  className="bg-green-500 text-black hover:bg-green-400"
                >
                  Einlösen
                </Button>
              </div>
              {voucherError && (
                <p className="text-sm text-red-500">{voucherError}</p>
              )}
              {voucherApplied && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Check className="w-5 h-5" />
                  <p className="text-sm font-semibold">Gutschein erfolgreich eingelöst! Sie können nun kostenlos fortfahren.</p>
                </div>
              )}
            </div>
          </Card>

          {/* Payment Methods */}
          {!voucherApplied && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Zahlungsmethode wählen</h2>
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full text-left transition-all ${
                    selectedMethod === method.id ? "ring-2 ring-primary" : "hover:border-primary/50"
                  }`}
                >
                  <Card className="p-4 md:p-6 bg-card/50 backdrop-blur-sm border-border/50">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="flex items-center justify-center w-12 h-10 md:w-14 md:h-12 flex-shrink-0">
                        <Image
                          src={method.logo || "/placeholder.svg"}
                          alt={method.name}
                          width={method.id === "paypal" ? 50 : 80}
                          height={method.id === "paypal" ? 40 : 50}
                          className="object-contain"
                          unoptimized={method.id === "sepa" || method.id === "paypal"}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground mb-1 text-sm md:text-base">{method.name}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">{method.description}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedMethod === method.id ? "border-primary bg-primary" : "border-muted-foreground"
                        }`}
                      >
                        {selectedMethod === method.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="gap-2 bg-transparent order-2 sm:order-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!voucherApplied && !selectedMethod}
              size="lg"
              className="bg-yellow-500 text-black hover:bg-yellow-400 px-8 order-1 sm:order-2 font-bold"
            >
              {voucherApplied ? "Kostenlos zur Analyse" : "Weiter zur Analyse"}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground pt-2 md:pt-4">Sichere Zahlung - SSL-verschlüsselt</p>
        </div>
      </main>
    </div>
  )
}
