// Cancellation Token System für Termin-Stornierungen
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Generiere einen sicheren Token
export function generateCancellationToken(appointmentId: string): string {
  const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  // Nutze base64 und mache es URL-safe manuell
  return Buffer.from(`${appointmentId}:${randomString}`)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

// Speichere Token in Datenbank
export async function storeCancellationToken(appointmentId: string, token: string): Promise<boolean> {
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  const { error } = await supabase
    .from("appointments")
    .update({ cancellation_token: token })
    .eq("id", appointmentId)

  if (error) {
    console.error("Token speichern Fehler:", error)
    return false
  }

  return true
}

// Verifiziere Token und gebe Appointment ID zurück
export async function verifyCancellationToken(token: string): Promise<string | null> {
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  const { data, error } = await supabase
    .from("appointments")
    .select("id, status")
    .eq("cancellation_token", token)
    .eq("status", "confirmed")
    .single()

  if (error || !data) {
    return null
  }

  return data.id
}

// Erstelle Stornierungslink
export function createCancellationLink(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app"
  return `${baseUrl}/appointments/cancel?token=${token}`
}
