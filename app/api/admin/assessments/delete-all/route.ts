import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  // STRICT: Auth Token MUSS gesetzt sein
  const authToken = process.env.ADMIN_AUTH_TOKEN

  if (!authToken) {
    console.error("[CRITICAL] ADMIN_AUTH_TOKEN not configured")
    return NextResponse.json(
      { error: "Server nicht konfiguriert" },
      { status: 500 }
    )
  }

  // Auth-Check: Middleware prüft bereits, aber Double-Check für Sicherheit
  const cookieToken = request.cookies.get("admin_auth")?.value

  if (!cookieToken || cookieToken !== authToken) {
    console.warn("[SECURITY] Unauthorized delete-all attempt")
    return NextResponse.json(
      { error: "Nicht autorisiert" },
      { status: 401 }
    )
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Get all assessments
    const { data: assessments } = await supabase.from("assessments").select("id")

    if (!assessments || assessments.length === 0) {
      return NextResponse.json({ success: true, message: "Keine Kunden zum Löschen" })
    }

    const assessmentIds = assessments.map((a) => a.id)

    // Delete all related data in cascade
    // 1. Delete payments
    await supabase.from("payments").delete().in("assessment_id", assessmentIds)

    // 2. Delete appointments
    await supabase.from("appointments").delete().in("assessment_id", assessmentIds)

    // 3. Delete notifications
    await supabase.from("notifications").delete().in("related_id", assessmentIds)

    // 4. Delete assessments
    await supabase.from("assessments").delete().in("id", assessmentIds)

    console.log(`[SECURITY] Admin deleted ${assessmentIds.length} customers`)

    return NextResponse.json({ 
      success: true, 
      message: `${assessmentIds.length} Kunden gelöscht`
    })
  } catch (error) {
    console.error("Error deleting all customers:", error)
    return NextResponse.json({ error: "Failed to delete customers" }, { status: 500 })
  }
}
