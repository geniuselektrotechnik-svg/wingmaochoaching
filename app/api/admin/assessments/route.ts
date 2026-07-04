import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  try {
    // Fetch all assessments ordered by created_at DESC
    const { data, error } = await supabase
      .from("assessments")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Fehler beim Laden der Daten" }, { status: 500 })
    }

    return NextResponse.json({ assessments: data })
  } catch (error: any) {
    console.error("Error fetching assessments:", error)
    return NextResponse.json({ error: "Ein Fehler ist aufgetreten" }, { status: 500 })
  }
}
