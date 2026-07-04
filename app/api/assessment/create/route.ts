import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, company, email, phone, industry } = body

    // Validierung
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: "Alle Pflichtfelder sind erforderlich" }, { status: 400 })
    }

    // Email Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 })
    }

    // Erstelle Assessment in Supabase
    const { data, error } = await supabase
      .from("assessments")
      .insert({
        first_name: firstName,
        last_name: lastName,
        company: company,
        email: email,
        phone: phone,
        industry: industry,
      })
      .select("id")
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Fehler beim Speichern in der Datenbank" }, { status: 500 })
    }

    // Erstelle Notification für Admin
    await supabase.from("notifications").insert({
      type: "assessment_started",
      title: "Neues Assessment gestartet",
      message: `${firstName} ${lastName} (${email}) hat ein Assessment gestartet${company ? ` - ${company}` : ""}.`,
      related_id: data.id,
    })

    return NextResponse.json({
      success: true,
      assessmentId: data.id,
    })
  } catch (error: any) {
    console.error("Error creating assessment:", error)
    return NextResponse.json({ error: "Ein unerwarteter Fehler ist aufgetreten" }, { status: 500 })
  }
}
