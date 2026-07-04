import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token fehlt" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("cancellation_token", token)
      .eq("status", "confirmed")
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Ungültiger oder abgelaufener Token" }, { status: 404 })
    }

    return NextResponse.json({ appointment: data })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ error: "Verifizierung fehlgeschlagen" }, { status: 500 })
  }
}
