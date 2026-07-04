import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assessmentId } = await params

    if (!assessmentId) {
      return NextResponse.json({ error: "Assessment ID required" }, { status: 400 })
    }

    // Fetch assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", assessmentId)
      .single()

    if (assessmentError || !assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    // Fetch answers (stored in the answers column)
    let answers = []
    try {
      if (assessment.answers) {
        if (typeof assessment.answers === "string") {
          answers = JSON.parse(assessment.answers)
        } else {
          answers = assessment.answers
        }
      }
    } catch {
      // answers bleibt leeres Array
    }

    return NextResponse.json(
      {
        assessment: {
          ...assessment,
          answers: answers,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching customer details:", error)
    return NextResponse.json(
      { error: "Failed to fetch customer details" },
      { status: 500 }
    )
  }
}
