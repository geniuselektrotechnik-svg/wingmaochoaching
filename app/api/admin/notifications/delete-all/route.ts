import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function POST() {
  try {
    // Lösche alle Benachrichtigungen
    const { error } = await supabase
      .from("notifications")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000") // Alle löschen (neq mit dummy ID)

    if (error) {
      console.error("Supabase error deleting all notifications:", error)
      return NextResponse.json({ error: "Fehler beim Löschen der Benachrichtigungen" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting all notifications:", error)
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 })
  }
}
