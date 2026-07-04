import { type NextRequest, NextResponse } from "next/server"
import { generatePDFWithPuppeteer } from "@/lib/pdf-generator-puppeteer"

export async function POST(request: NextRequest) {
  try {
    const { result, aiAnalysis, freetextAnswers } = await request.json()

    if (!result) {
      return NextResponse.json({ error: "Result data required" }, { status: 400 })
    }

    // Generiere PDF mit Puppeteer
    const pdfBuffer = await generatePDFWithPuppeteer(result)

    // Returniere PDF
    return new Response(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Wingman_Assessment_${result.entrepreneurType?.replace(/\s+/g, "_") || "Report"}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "PDF-Generierung fehlgeschlagen" }, { status: 500 })
  }
}
