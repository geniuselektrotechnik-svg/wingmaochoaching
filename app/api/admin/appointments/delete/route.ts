import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    const { appointmentId } = await request.json()

    // Lösche Termin permanent aus DB
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", appointmentId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting appointment:", error)
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 })
  }
}
