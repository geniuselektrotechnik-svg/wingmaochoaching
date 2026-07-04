"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function CancelAppointmentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appointment, setAppointment] = useState<any>(null)

  useEffect(() => {
    if (!token) {
      setError("Kein gültiger Stornierungslink")
      return
    }

    // Lade Termin-Details
    loadAppointment()
  }, [token])

  const loadAppointment = async () => {
    try {
      const response = await fetch(`/api/appointments/verify-token?token=${token}`)
      if (!response.ok) {
        setError("Ungültiger oder abgelaufener Link")
        return
      }
      const data = await response.json()
      setAppointment(data.appointment)
    } catch (err) {
      setError("Fehler beim Laden der Termin-Daten")
    }
  }

  const handleCancel = async () => {
    if (!appointment) return

    setLoading(true)
    try {
      const response = await fetch(`/api/appointments/cancel/${appointment.id}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Stornierung fehlgeschlagen")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (err) {
      setError("Fehler bei der Stornierung. Bitte kontaktieren Sie uns direkt.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card border-yellow-500/20">
        {/* Success State */}
        {success && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Termin storniert</h2>
            <p className="text-muted-foreground">
              Ihr Termin wurde erfolgreich storniert. Sie erhalten eine Bestätigungs-Email.
            </p>
            <p className="text-sm text-muted-foreground">
              Sie werden in wenigen Sekunden zur Startseite weitergeleitet...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !success && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Fehler</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => router.push("/")} variant="outline">
              Zur Startseite
            </Button>
          </div>
        )}

        {/* Confirmation State */}
        {!success && !error && appointment && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Termin stornieren?</h2>
              <p className="text-muted-foreground">Möchten Sie diesen Termin wirklich stornieren?</p>
            </div>

            <Card className="p-4 bg-yellow-500/5 border-yellow-500/20">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Name:</dt>
                  <dd className="font-semibold text-foreground">{appointment.customer_name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Datum:</dt>
                  <dd className="font-semibold text-foreground">
                    {new Date(appointment.appointment_date).toLocaleDateString("de-DE", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Uhrzeit:</dt>
                  <dd className="font-semibold text-foreground">{appointment.appointment_time} Uhr</dd>
                </div>
              </dl>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="flex-1 bg-transparent"
                disabled={loading}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleCancel}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Wird storniert...
                  </>
                ) : (
                  "Termin stornieren"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {!success && !error && !appointment && (
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 mx-auto animate-spin text-yellow-500" />
            <p className="text-muted-foreground">Lade Termin-Daten...</p>
          </div>
        )}
      </Card>
    </div>
  )
}
