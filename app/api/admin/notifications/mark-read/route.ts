import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  try {
    const { notificationId } = await request.json()

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return NextResponse.json({ error: "Failed to mark notification" }, { status: 500 })
  }
}
