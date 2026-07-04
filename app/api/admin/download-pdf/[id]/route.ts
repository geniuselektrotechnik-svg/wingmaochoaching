import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { generatePDF } from "@/lib/pdf-generator"
import { typeProfiles, typeStatesAndActions } from "@/lib/scoring"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Fetch assessment from database
    const { data: assessment, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !assessment) {
      console.error("Assessment not found:", error)
      return NextResponse.json({ error: "Assessment nicht gefunden" }, { status: 404 })
    }

    if (!assessment.scores || !assessment.entrepreneur_type) {
      return NextResponse.json({ error: "Assessment nicht abgeschlossen" }, { status: 400 })
    }

    // Function to get index subtitle
    const getIndexSubtitle = (score: number): string => {
      if (score >= 85) {
        return "Exzellenz – Sie gehören zur Oberklasse"
      } else if (score >= 75) {
        return "Starke Basis – auf dem Weg zur Spitze"
      } else if (score >= 65) {
        return "Solide Basis – klares Potenzial zur Oberklasse"
      } else if (score >= 55) {
        return "Entwicklungsfähig – wichtige Hebel erkennbar"
      } else if (score >= 45) {
        return "Grundlagen vorhanden – erhebliches Wachstumspotenzial"
      } else {
        return "Startphase – große Chancen durch systematische Entwicklung"
      }
    }

    // Parse AI analysis if it exists
    let aiAnalysis = null
    try {
      if (assessment.ai_analysis) {
        aiAnalysis = typeof assessment.ai_analysis === 'string' 
          ? JSON.parse(assessment.ai_analysis) 
          : assessment.ai_analysis
      }
    } catch (e) {
      console.error("Error parsing AI analysis:", e)
    }

    // Reconstruct result object with user data
    const result = {
      overallScore: Math.round(
        assessment.scores.reduce((acc: number, s: any) => acc + s.percentage, 0) / assessment.scores.length
      ),
      wingmanIndex: Math.round(
        assessment.scores.reduce((acc: number, s: any) => acc + s.percentage, 0) / assessment.scores.length
      ),
      indexSubtitle: getIndexSubtitle(Math.round(
        assessment.scores.reduce((acc: number, s: any) => acc + s.percentage, 0) / assessment.scores.length
      )),
      scores: assessment.scores, // Ensure 'scores' key exists
      categoryScores: assessment.scores,
      entrepreneurType: assessment.entrepreneur_type,
      firstName: assessment.first_name || '',
      lastName: assessment.last_name || '',
      companyName: assessment.company || '',
      strengths: aiAnalysis?.strengths || [],
      developmentAreas: aiAnalysis?.developmentAreas || [],
      patterns: aiAnalysis?.patternInsights || [],
      recommendation: aiAnalysis?.recommendations?.wingmanProgram || { primary: '', secondary: '' },
      aiInsights: aiAnalysis,
      isPremium: assessment.is_premium || false,
      typeProfile: typeProfiles[assessment.entrepreneur_type as keyof typeof typeProfiles] || typeProfiles["Der Ausgewogene Unternehmer"],
      statesAndActions: typeStatesAndActions[assessment.entrepreneur_type as keyof typeof typeStatesAndActions] || typeStatesAndActions["Der Ausgewogene Unternehmer"],
    }

    // Generiere PDF mit jsPDF (serverless-kompatibel)
    const pdfBlob = await generatePDF(result)
    const pdfBuffer = await pdfBlob.arrayBuffer()

    // Track download
    await supabase
      .from("assessments")
      .update({
        pdf_downloaded: true,
        pdf_downloaded_at: new Date().toISOString(),
      })
      .eq("id", id)

    // Return PDF
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="wingman-assessment-${assessment.first_name}-${assessment.last_name}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "PDF-Generierung fehlgeschlagen" }, { status: 500 })
  }
}
