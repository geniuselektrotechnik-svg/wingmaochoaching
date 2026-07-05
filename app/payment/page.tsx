"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { SplitButton } from "@/components/ui/split-button"

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

  const features = [
    "78 Fragen (67 Skala-Fragen + 11 Freitext)",
    "KI gestützte Tiefenanalyse Ihres Unternehmens",
    "Premium PDF Report (20-25 Seiten) mit Statistiken",
    "Personalisierter 90 Tage Entwicklungsplan",
    "Detaillierte Handlungsempfehlungen basierend auf Ihren Antworten",
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
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#fae608]">/ Schritt 1 von 3 /</p>
            <h1 className="text-3xl md:text-4xl font-medium tracking-[-0.02em] leading-[1.15] text-white">
              Ihre Unternehmensanalyse
            </h1>
            <p className="text-[15px] leading-relaxed text-white/60">Professionelles 360° Assessment</p>
          </div>

          {/* Pricing */}
          <div className="bg-[#0d0d0d] border border-white/10">
            <div className="p-7 md:p-9 border-b border-white/10">
              <div className="flex items-end gap-3">
                <span className="text-5xl md:text-6xl font-medium tracking-[-0.03em] text-[#fae608] leading-none">
                  599€
                </span>
                <span className="text-[13px] uppercase tracking-[0.06em] text-white/50 pb-1.5">
                  Einmalige Investition
                </span>
              </div>
            </div>
            <ul className="p-7 md:p-9 space-y-4">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3.5">
                  <span className="w-2 h-2 bg-[#fae608] mt-[7px] shrink-0" />
                  <span className="text-[15px] leading-relaxed text-white/80">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Gutschein */}
          <div className="space-y-4">
            <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-white/70">Gutschein-Code</p>
            <div className="flex flex-col sm:flex-row gap-[2px]">
              <Input
                type="text"
                placeholder="Gutschein-Code eingeben"
                value={voucherCode}
                onChange={(e) => {
                  setVoucherCode(e.target.value)
                  setVoucherError("")
                }}
                disabled={voucherApplied}
                className="h-[50px] flex-1 text-base rounded-none border border-white/15 bg-[#0d0d0d] text-white placeholder:text-white/35 focus-visible:border-[#fae608] focus-visible:ring-0 transition-colors duration-200"
              />
              <SplitButton variant="dark" onClick={handleApplyVoucher} disabled={!voucherCode || voucherApplied}>
                Einlösen
              </SplitButton>
            </div>
            {voucherError && <p className="text-sm text-red-400 font-semibold">{voucherError}</p>}
            {voucherApplied && (
              <div className="p-4 bg-[#0d0d0d] border-l-2 border-[#fae608]">
                <p className="text-sm font-semibold text-[#fae608]">
                  Gutschein erfolgreich eingelöst. Sie können nun kostenlos fortfahren.
                </p>
              </div>
            )}
          </div>

          {/* Zahlungsmethoden */}
          {!voucherApplied && (
            <div className="space-y-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-white/70">
                Zahlungsmethode wählen
              </p>
              <div className="space-y-[2px]">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full text-left transition-colors duration-150 bg-[#0d0d0d] border p-4 md:p-5 ${
                      selectedMethod === method.id
                        ? "border-[#fae608]"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-16 h-10 bg-white shrink-0">
                        <Image
                          src={method.logo || "/placeholder.svg"}
                          alt={method.name}
                          width={method.id === "paypal" ? 42 : 52}
                          height={method.id === "paypal" ? 32 : 30}
                          className="object-contain max-h-7"
                          unoptimized={method.id === "sepa" || method.id === "paypal"}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm md:text-base">{method.name}</h3>
                        <p className="text-[13px] text-white/50 truncate">{method.description}</p>
                      </div>
                      <div
                        className={`w-4 h-4 shrink-0 border transition-colors ${
                          selectedMethod === method.id ? "bg-[#fae608] border-[#fae608]" : "border-white/30"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            <SplitButton variant="dark" direction="left" onClick={() => router.push("/")} className="order-2 sm:order-1">
              Zurück
            </SplitButton>

            <SplitButton
              onClick={handleContinue}
              disabled={!voucherApplied && !selectedMethod}
              className="order-1 sm:order-2"
            >
              {voucherApplied ? "Kostenlos zur Analyse" : "Weiter zur Analyse"}
            </SplitButton>
          </div>

          <p className="text-[13px] text-center text-white/40">Sichere Zahlung – SSL-verschlüsselt</p>
        </div>
      </main>
    </div>
  )
}
