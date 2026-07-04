"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Mail, Calendar, X } from "lucide-react"
import { Suspense } from "react"
import Loading from "./loading"

interface AppointmentData {
  name: string
  email: string
  phone: string
  date: string
  time: string
}

export default function TerminBestaetigung() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [cancellationLink, setCancellationLink] = useState<string | null>(null)
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null)
  const searchParams = useSearchParams()
  const appointmentId = searchParams.get("id")

  useEffect(() => {
    // Trigger success animation
    setTimeout(() => setShowSuccess(true), 100)
    
    // Get cancellation link from URL if available
    const link = searchParams.get("cancellationLink")
    if (link) {
      setCancellationLink(decodeURIComponent(link))
    }

    // Get appointment data from URL params
    const name = searchParams.get("name")
    const email = searchParams.get("email")
    const phone = searchParams.get("phone")
    const date = searchParams.get("date")
    const time = searchParams.get("time")

    if (name && email && phone && date && time) {
      setAppointmentData({
        name: decodeURIComponent(name),
        email: decodeURIComponent(email),
        phone: decodeURIComponent(phone),
        date: decodeURIComponent(date),
        time: decodeURIComponent(time),
      })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-center pt-8 pb-4">
        <img
          src="/images/wingman-logo.png"
          alt="Wingman Coaching"
          className="h-14 w-auto"
        />
      </div>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Suspense fallback={<Loading />}>
          <Card className="p-8">
            <div className="text-center space-y-6">
              {/* Success Animation */}
              <div className="flex justify-center">
                <div className={`w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-500 ${showSuccess ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
                  <Check className={`w-10 h-10 text-primary transition-all duration-700 ${showSuccess ? "scale-100 rotate-0" : "scale-0 rotate-45"}`} />
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold mb-3">Termin erfolgreich gebucht!</h1>
                <p className="text-lg text-muted-foreground">
                  Vielen Dank für Ihre Buchung. Wir freuen uns auf das Gespräch mit Ihnen.
                </p>
              </div>

              <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                {appointmentData && (
                  <>
                    <div className="flex items-center gap-3 text-left">
                      <Calendar className="w-6 h-6 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Ihr Termin</p>
                        <p className="text-base font-medium text-foreground">
                          {appointmentData.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          📅 {new Date(appointmentData.date).toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          🕐 {appointmentData.time} Uhr
                        </p>
                        <p className="text-sm text-muted-foreground">
                          📞 {appointmentData.phone}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-3 text-left">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Bestätigung per E-Mail</p>
                    <p className="text-sm text-muted-foreground">
                      Sie erhalten in Kürze eine E-Mail mit allen Details zu Ihrem Termin.
                    </p>
                  </div>
                </div>
              </div>

              {cancellationLink && (
                <div className="pt-6">
                  <Button asChild variant="outline" size="lg" className="w-full bg-transparent text-red-600 border-red-500/40 hover:border-red-500 hover:bg-red-500/10">
                    <Link href={cancellationLink}>
                      <X className="mr-2 h-4 w-4" />
                      Termin stornieren
                    </Link>
                  </Button>
                </div>
              )}

              <p className="text-sm text-muted-foreground pt-4">
                Falls Sie den Termin stornieren möchten, klicken Sie auf den Button oben oder nutzen Sie den Link in der Bestätigungs-E-Mail.
              </p>
            </div>
          </Card>
        </Suspense>
      </main>
    </div>
  )
}
