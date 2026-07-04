"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/hooks/use-toast"
import { CalendarIcon, Clock, Check, User, Mail, Phone, ArrowRight, ArrowLeft } from "lucide-react"

export default function TerminBuchenPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Available time slots (9:00 - 17:00)
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00"
  ]

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Felder aus",
        variant: "destructive",
      })
      return
    }
    setStep(2)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setStep(3)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(4)
  }

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: selectedDate.toISOString().split("T")[0],
          time: selectedTime,
        }),
      })

      if (!response.ok) throw new Error("Booking failed")

      const data = await response.json()

      toast({
        title: "Termin gebucht!",
        description: "Sie erhalten eine Bestätigung per E-Mail",
      })

      // URL-encode alle Daten für die Bestätigungs-Seite
      const params = new URLSearchParams({
        id: data.appointmentId,
        cancellationLink: data.cancellationLink,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: selectedDate?.toISOString() || "",
        time: selectedTime,
      })

      router.push(`/termin-bestaetigung?${params.toString()}`)
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Buchung fehlgeschlagen. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-5xl">
          <img
            src="/images/wingman-logo.png"
            alt="Wingman Coaching"
            className="h-10 w-auto"
          />
          <div className="text-sm text-muted-foreground">
            Schritt {step} von 4
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  s < step ? "bg-primary text-primary-foreground" :
                  s === step ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${
                    s < step ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground px-2">
            <span>Ihre Daten</span>
            <span>Datum</span>
            <span>Uhrzeit</span>
            <span>Bestätigen</span>
          </div>
        </div>

        {/* Content Card */}
        <Card className="p-8 md:p-12 shadow-xl border-primary/10">
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Ihre Kontaktdaten</h2>
                <p className="text-muted-foreground text-balance">
                  Wir benötigen Ihre Daten um Sie zu kontaktieren und den Termin zu bestätigen
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">Vollständiger Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="z.B. Max Mustermann"
                      className="pl-10 h-12 text-base"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">E-Mail Adresse *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ihre@email.de"
                      className="pl-10 h-12 text-base"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base">Telefonnummer *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+49 123 456789"
                      className="pl-10 h-12 text-base"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 text-base" size="lg">
                  Weiter zum Datum
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <CalendarIcon className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Wählen Sie ein Datum</h2>
                <p className="text-muted-foreground text-balance">
                  Wählen Sie einen verfügbaren Wochentag (Montag - Freitag)
                </p>
              </div>
              
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                  className="rounded-md border shadow-sm"
                />
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setStep(1)} 
                className="w-full h-12 text-base"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Zurück
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Wählen Sie eine Uhrzeit</h2>
                <p className="text-muted-foreground text-balance mb-2">
                  {selectedDate?.toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Verfügbare Zeiten zwischen 9:00 und 17:00 Uhr
                </p>
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    onClick={() => handleTimeSelect(time)}
                    className="h-14 text-base hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                  >
                    {time}
                  </Button>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setStep(2)} 
                className="w-full h-12 text-base"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Zurück
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Termin bestätigen</h2>
                <p className="text-muted-foreground text-balance">
                  Überprüfen Sie Ihre Angaben bevor Sie den Termin verbindlich buchen
                </p>
              </div>

              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-muted/40 border rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Kontaktdaten</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-semibold">{formData.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">E-Mail</p>
                        <p className="font-semibold">{formData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Telefon</p>
                        <p className="font-semibold">{formData.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Info */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <h3 className="font-semibold text-sm text-primary/80 uppercase tracking-wide mb-4">Ihr Termin</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      <p className="text-lg font-bold">
                        {selectedDate?.toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <p className="text-lg font-bold">{selectedTime} Uhr</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button 
                  onClick={handleBooking} 
                  disabled={isSubmitting} 
                  className="w-full h-14 text-base font-semibold" 
                  size="lg"
                >
                  {isSubmitting ? "Wird gebucht..." : "Jetzt verbindlich buchen"}
                  {!isSubmitting && <Check className="ml-2 h-5 w-5" />}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setStep(3)} 
                  className="w-full h-12 text-base"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Zurück
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Mit der Buchung bestätigen Sie, dass Sie die Datenschutzerklärung gelesen haben und dieser zustimmen.
              </p>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
