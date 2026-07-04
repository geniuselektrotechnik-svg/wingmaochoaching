"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Lock } from "lucide-react"

export default function AdminLogin() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!code.trim()) {
      setError(true)
      return
    }

    setLoading(true)
    console.log("[DEBUG FRONTEND] Login starting...")
    console.log("[DEBUG FRONTEND] Password eingegeben:", code)
    
    try {
      // Sende Passwort zum Backend für Validierung
      console.log("[DEBUG FRONTEND] Fetching /api/admin/login...")
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: code })
      })

      console.log("[DEBUG FRONTEND] Response status:", response.status)
      console.log("[DEBUG FRONTEND] Response ok:", response.ok)
      
      const data = await response.json()
      console.log("[DEBUG FRONTEND] Response data:", data)

      if (response.ok) {
        console.log("[DEBUG FRONTEND] Login erfolgreich, Cookie sollte gesetzt sein...")
        console.log("[DEBUG FRONTEND] Verzögerung vor redirect...")
        
        // Kurze Verzögerung um sicherzustellen dass Cookie gespeichert ist
        await new Promise(resolve => setTimeout(resolve, 100))
        
        console.log("[DEBUG FRONTEND] Starte redirect zu /admin/dashboard...")
        try {
          router.push("/admin/dashboard")
          console.log("[DEBUG FRONTEND] Router.push aufgerufen")
        } catch (pushError) {
          console.error("[DEBUG FRONTEND] Router.push Fehler:", pushError)
        }
      } else {
        console.log("[DEBUG FRONTEND] Login fehlgeschlagen, error:", data.error)
        setError(true)
        setTimeout(() => setError(false), 2000)
      }
    } catch (error) {
      console.error("[DEBUG FRONTEND] Fetch error:", error)
      setError(true)
    } finally {
      setLoading(false)
      setCode("")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img
            src="/images/wingman-logo.png"
            alt="Wingman Coaching"
            className="h-16 w-auto mx-auto mb-8"
          />
          <h1 className="text-3xl font-bold text-foreground">Admin-Bereich</h1>
          <p className="text-muted-foreground mt-2">Zugangscode eingeben</p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Code eingeben"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className={`text-center text-xl tracking-widest ${error ? "border-red-500" : ""}`}
              />
              {error && <p className="text-sm text-red-500 text-center">Falscher Code</p>}
              <Button onClick={handleLogin} className="w-full" size="lg">
                Anmelden
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
