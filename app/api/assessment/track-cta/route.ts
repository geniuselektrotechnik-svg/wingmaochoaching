import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    const { assessmentId } = await request.json()

    if (!assessmentId) {
      return NextResponse.json({ error: "Assessment ID erforderlich" }, { status: 400 })
    }

    // Update CTA tracking
    const { error } = await supabase
      .from("assessments")
      .update({
        cta_clicked: true,
        cta_clicked_at: new Date().toISOString(),
      })
      .eq("id", assessmentId)

    if (error) {
      console.error("CTA tracking error:", error)
      return NextResponse.json({ error: "Tracking fehlgeschlagen" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("CTA tracking error:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
