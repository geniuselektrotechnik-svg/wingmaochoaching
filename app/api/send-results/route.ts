import { type NextRequest, NextResponse } from "next/server"
import { generatePDF } from "@/lib/pdf-generator"
import { sendPDFEmail } from "@/lib/resend-client"

export async function POST(request: NextRequest) {
  try {
    const { email, result, userName, company } = await request.json()

    // Füge Namen und Unternehmen zum Result hinzu
    const resultWithUserData = {
      ...result,
      firstName: userName?.split(' ')[0] || '',
      lastName: userName?.split(' ').slice(1).join(' ') || '',
      companyName: company || ''
    }

    // Generiere PDF mit jsPDF (kein fs.mkdtemp nötig)
    const pdfBlob = await generatePDF(resultWithUserData)
    const pdfBase64 = Buffer.from(await pdfBlob.arrayBuffer()).toString("base64")

    // Sende Email mit PDF via Resend
    await sendPDFEmail({
      email,
      userName,
      company,
      entrepreneurType: result.entrepreneurType,
      overallScore: result.wingmanIndex || result.overallScore,
      pdfBase64,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in send-results API:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
