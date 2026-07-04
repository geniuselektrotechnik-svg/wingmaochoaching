import { type NextRequest, NextResponse } from "next/server"
import { generatePDFFromResultsPage } from "@/lib/pdf-generator-screenshot"

export async function POST(request: NextRequest) {
  try {
    const { assessmentId } = await request.json()

    if (!assessmentId) {
      return NextResponse.json({ error: "Assessment ID required" }, { status: 400 })
    }

    // Generiere PDF direkt von der /results Seite (1:1 Screenshot)
    const pdfBuffer = await generatePDFFromResultsPage(assessmentId)

    // Return PDF
    return new Response(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="wingman-assessment.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF screenshot:", error)
    return NextResponse.json({ error: "PDF-Generierung fehlgeschlagen" }, { status: 500 })
  }
}
