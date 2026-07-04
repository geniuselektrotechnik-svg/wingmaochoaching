"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Building2, CheckCircle, AlertCircle } from "lucide-react"
import { assessmentQuestions } from "@/lib/questions"

interface Question {
  id: string
  category: string
  text: string
  type: string
  options?: string[]
}

interface Answer {
  question_id: string
  answer: string | number
}

interface Assessment {
  id: string
  first_name: string
  last_name: string
  company: string | null
  email: string
  entrepreneur_type: string | null
  completed_at: string | null
  created_at: string
  answers?: Answer[]
}

export default function CustomerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const assessmentId = params.id as string
  
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminAuth = sessionStorage.getItem("adminAuth")
    if (adminAuth !== "true") {
      router.push("/admin")
      return
    }

    fetchCustomerDetails()
  }, [router, assessmentId])

  const fetchCustomerDetails = async () => {
    try {
      const response = await fetch(`/api/admin/assessments/${assessmentId}`)
      if (response.ok) {
        const data = await response.json()
        setAssessment(data.assessment)
      } else {
        console.error("Failed to fetch customer details:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching customer details:", error)
    } finally {
      setLoading(false)
    }
  }

  const getQuestionText = (questionId: string): string => {
    const question = assessmentQuestions.find(q => q.id === questionId)
    return question?.text || "Unbekannte Frage"
  }

  const getQuestionCategory = (questionId: string): string => {
    const question = assessmentQuestions.find(q => q.id === questionId)
    return question?.category || "Unbekannt"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-yellow-500/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg font-semibold text-muted-foreground">Lade Kundendaten...</p>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-yellow-500/5 p-4">
        <div className="container mx-auto max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/dashboard")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </Button>
          <Card className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Kunde nicht gefunden</p>
          </Card>
        </div>
      </div>
    )
  }

  const parseAnswers = (): Answer[] => {
    if (!assessment.answers) return []
    if (Array.isArray(assessment.answers)) return assessment.answers
    if (typeof assessment.answers === "string") {
      try {
        return JSON.parse(assessment.answers)
      } catch {
        return []
      }
    }
    if (typeof assessment.answers === "object") {
      return Object.entries(assessment.answers as Record<string, any>).map(([questionId, answer]) => ({
        question_id: questionId,
        answer: answer
      }))
    }
    return []
  }

  const answersArray = parseAnswers()
  const answersByCategory = answersArray.reduce((acc: any, answer: Answer) => {
    const category = getQuestionCategory(answer.question_id)
    if (!acc[category]) acc[category] = []
    acc[category].push(answer)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-yellow-500/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/dashboard")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zum Dashboard
          </Button>

          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {assessment.first_name} {assessment.last_name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <Badge className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30">
                  {assessment.entrepreneur_type || "Unbekannt"}
                </Badge>
                {assessment.completed_at && (
                  <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Abgeschlossen
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                {assessment.email}
              </div>
              {assessment.company && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  {assessment.company}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                Erstellt: {new Date(assessment.created_at).toLocaleDateString("de-DE")}
              </div>
            </div>
          </div>
        </div>

        {/* Questions & Answers */}
        <div className="space-y-6">
          {Object.entries(answersByCategory).map(([category, answers]: [string, any]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground border-b border-border/30 pb-3">
                {category}
              </h2>

              <div className="space-y-4">
                {(answers as Answer[]).map((answer, idx) => (
                  <Card key={`${answer.question_id}-${idx}`} className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-foreground">
                        {getQuestionText(answer.question_id)}
                      </h3>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-foreground break-words">
                          {typeof answer.answer === "string"
                            ? answer.answer || "Keine Antwort"
                            : `${answer.answer}/10`
                          }
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {(!assessment.answers || assessment.answers.length === 0) && (
            <Card className="p-12 text-center bg-card/50 backdrop-blur-sm">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Noch keine Antworten vorhanden</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
