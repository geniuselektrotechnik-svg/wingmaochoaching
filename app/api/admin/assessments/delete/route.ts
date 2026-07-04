import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

export async function POST(req: Request) {
  try {
    const { assessmentId } = await req.json()

    if (!assessmentId) {
      return NextResponse.json({ error: "Assessment ID required" }, { status: 400 })
    }

    // Delete all related data
    await Promise.all([
      // Delete appointments for this customer
      supabase
        .from("appointments")
        .delete()
        .eq("related_assessment_id", assessmentId),
      
      // Delete notifications for this assessment
      supabase
        .from("notifications")
        .delete()
        .eq("related_id", assessmentId),
      
      // Delete payments for this assessment
      supabase
        .from("payments")
        .delete()
        .eq("assessment_id", assessmentId),
      
      // Finally delete the assessment
      supabase
        .from("assessments")
        .delete()
        .eq("id", assessmentId)
    ])

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    )
  }
}
