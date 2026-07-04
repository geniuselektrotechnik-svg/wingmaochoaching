import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST() {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("read", false)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return NextResponse.json({ error: "Failed to mark notifications" }, { status: 500 })
  }
}
