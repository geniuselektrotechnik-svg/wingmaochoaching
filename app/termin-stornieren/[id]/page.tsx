"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function TerminStorniereePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  const handleCancel = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/appointments/cancel/${resolvedParams.id}`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Cancellation failed")

      setCancelled(true)
      toast({
        title: "Termin storniert",
        description: "Sie erhalten eine Bestätigung per E-Mail",
      })

      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Stornierung fehlgeschlagen. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
        <Card className="p-8">
          {!cancelled ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">Termin stornieren?</h1>
                <p className="text-muted-foreground">
                  Möchten Sie diesen Termin wirklich stornieren? Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? "Wird storniert..." : "Ja, Termin stornieren"}
                </Button>
                <Button onClick={() => router.push("/")} variant="outline" className="w-full bg-transparent">
                  Abbrechen
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">Termin storniert</h1>
                <p className="text-muted-foreground">
                  Ihr Termin wurde erfolgreich storniert. Sie erhalten eine Bestätigungsmail.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Sie werden weitergeleitet...</p>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
