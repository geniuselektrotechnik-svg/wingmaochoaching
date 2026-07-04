"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, Mail, User, Download, CheckCircle, XCircle, Calendar, 
  Phone, Bell, LogOut, Users, FileText, Clock, AlertCircle, Trash2 
} from "lucide-react"

interface Assessment {
  id: string
  first_name: string
  last_name: string
  company: string | null
  industry: string | null
  email: string
  phone: string | null
  entrepreneur_type: string | null
  scores: any
  cta_clicked: boolean
  cta_clicked_at: string | null
  pdf_downloaded: boolean
  pdf_downloaded_at: string | null
  created_at: string
  completed_at: string | null
}

interface Appointment {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  appointment_date: string
  appointment_time: string
  status: string
  notes: string | null
  created_at: string
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  related_id: string | null
  read: boolean
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [activeTab, setActiveTab] = useState<"assessments" | "appointments" | "notifications">("assessments")
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Lade Daten direkt, Middleware prüft auth automatisch
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [router])

  const fetchData = async () => {
    try {
      const [assessmentsRes, appointmentsRes, notificationsRes] = await Promise.all([
        fetch("/api/admin/assessments", { credentials: "include" }),
        fetch("/api/admin/appointments", { credentials: "include" }),
        fetch("/api/admin/notifications", { credentials: "include" }),
      ])

      // Wenn 401, redirect zur Login
      if (assessmentsRes.status === 401 || appointmentsRes.status === 401 || notificationsRes.status === 401) {
        console.log("[DEBUG] Got 401, redirecting to /admin")
        router.push("/admin")
        return
      }

      if (assessmentsRes.ok) {
        const data = await assessmentsRes.json()
        setAssessments(data.assessments || [])
      }

      if (appointmentsRes.ok) {
        const data = await appointmentsRes.json()
        setAppointments(data.appointments || [])
      }

      if (notificationsRes.ok) {
        const data = await notificationsRes.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.notifications.filter((n: Notification) => !n.read).length)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    // Clear httpOnly Cookie durch Logout-API (falls nötig)
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include"
      })
    } catch (error) {
      console.error("[DEBUG] Logout error:", error)
    }
    
    // Redirect zur Login-Seite
    router.push("/admin")
  }

  const handleDownloadPDF = async (assessmentId: string) => {
    try {
      // Öffne PDF in neuem Tab (funktioniert im v0-Preview)
      window.open(`/api/admin/download-pdf/${assessmentId}`, '_blank')
    } catch (error) {
      console.error("Error opening PDF:", error)
      alert("PDF konnte nicht geöffnet werden. Bitte versuchen Sie es erneut.")
    }
  }

  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      setPasswordError("Bitte beide Felder ausfüllen")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwörter stimmen nicht überein")
      return
    }
    if (newPassword.length < 6) {
      setPasswordError("Passwort muss mindestens 6 Zeichen lang sein")
      return
    }
    
    // Speichere neues Passwort in localStorage
    localStorage.setItem("adminPassword", newPassword)
    
    // Reset Felder
    setNewPassword("")
    setConfirmPassword("")
    setPasswordError("")
    setShowPasswordDialog(false)
    
    alert("✅ Passwort erfolgreich geändert!")
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm("Möchten Sie diesen Termin wirklich stornieren?")) return

    try {
    const response = await fetch(`/api/admin/appointments/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ appointment_id: appointmentId })
    })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error)
    }
  }

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!confirm("Möchten Sie diesen Termin wirklich PERMANENT löschen? Dies kann nicht rückgängig gemacht werden.")) return

    try {
    const response = await fetch(`/api/admin/appointments/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: appointmentId })
    })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error deleting appointment:", error)
    }
  }

  const handleDeleteCustomer = async (assessmentId: string) => {
    const assessment = assessments.find(a => a.id === assessmentId)
    if (!confirm(`Möchten Sie ${assessment?.first_name} ${assessment?.last_name} mit allen Daten wirklich löschen? (Assessment, Termine, Analyse) Dies kann nicht rückgängig gemacht werden.`)) return

    try {
    const response = await fetch(`/api/admin/assessments/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: assessmentId })
    })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
    }
  }

  const handleDeleteAllCustomers = async () => {
    const confirmCount = prompt(`⚠️ WARNUNG: Sie werden ${assessments.length} Kunden mit ALLEN Daten löschen! Diese Aktion kann NICHT rückgängig gemacht werden.\n\nGeben Sie die Anzahl "${assessments.length}" ein zum Bestätigen:`)
    
    if (confirmCount !== assessments.length.toString()) {
      alert("Löschung abgebrochen!")
      return
    }

    if (!confirm("✓ Bestätigt. Alle Kundendaten UND Benachrichtigungen werden jetzt permanent gelöscht...")) return

    try {
      // Lösche sowohl Assessments als auch Benachrichtigungen
      const [assessmentsRes, notificationsRes] = await Promise.all([
        fetch(`/api/admin/assessments/delete-all`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }),
        fetch(`/api/admin/notifications/delete-all`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
      ])

      if (assessmentsRes.ok && notificationsRes.ok) {
        alert("✓ Alle Kunden und Benachrichtigungen wurden gelöscht!")
        fetchData()
      } else {
        alert("Fehler beim Löschen der Daten")
      }
    } catch (error) {
      console.error("Error deleting all data:", error)
      alert("Fehler beim Löschen der Daten")
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/admin/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ notificationId }),
      })
      fetchData()
    } catch (error) {
      console.error("Error marking notification:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/admin/notifications/mark-all-read", {
        method: "POST",
        credentials: "include",
      })
      fetchData()
    } catch (error) {
      console.error("Error marking all notifications:", error)
    }
  }

  const completedAssessments = assessments.filter((a) => a.completed_at)
  const ctaClicks = assessments.filter((a) => a.cta_clicked).length
  const conversionRate = assessments.length > 0 ? ((ctaClicks / assessments.length) * 100).toFixed(1) : "0"
  const confirmedAppointments = appointments.filter((a) => a.status === "confirmed").length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-yellow-500/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg font-semibold text-muted-foreground">Lade Daten...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-yellow-500/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Wingman Admin Dashboard</h1>
            <p className="text-muted-foreground">Verwaltung von Assessments, Terminen & Benachrichtigungen</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(true)}
              className="w-full sm:w-auto border-yellow-500/30 hover:bg-yellow-500/10 hover:border-yellow-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Passwort ändern
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteAllCustomers}
              className="gap-2 border-red-500/40 hover:border-red-500 hover:bg-red-500/10 bg-transparent text-red-600 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
              Alle löschen
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 border-yellow-500/40 hover:border-yellow-500 hover:bg-yellow-500/10 bg-transparent w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-card border-yellow-500/30 hover:border-yellow-500/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assessments</p>
                <p className="text-2xl font-bold text-foreground">{assessments.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-card border-green-500/30 hover:border-green-500/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Abgeschlossen</p>
                <p className="text-2xl font-bold text-foreground">{completedAssessments.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-card border-blue-500/30 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Termine</p>
                <p className="text-2xl font-bold text-foreground">{confirmedAppointments}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-card border-purple-500/30 hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CTA Rate</p>
                <p className="text-2xl font-bold text-foreground">{conversionRate}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1">
            <TabsTrigger 
              value="assessments" 
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-semibold"
            >
              <FileText className="w-4 h-4 mr-2" />
              Assessments
            </TabsTrigger>
            <TabsTrigger 
              value="appointments" 
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-semibold"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Termine
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="relative data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-semibold"
            >
              <Bell className="w-4 h-4 mr-2" />
              Benachrichtigungen
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 h-5">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-4">
            {assessments.length === 0 ? (
              <Card className="p-12 text-center bg-card/50 backdrop-blur-sm">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">Noch keine Assessments vorhanden</p>
              </Card>
            ) : (
              assessments.map((assessment) => (
                <Card key={assessment.id} className="p-6 border-border/50 hover:border-yellow-500/40 transition-all bg-card/50 backdrop-blur-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-bold text-foreground">
                          {assessment.first_name} {assessment.last_name}
                        </h3>
                        {assessment.entrepreneur_type && (
                          <Badge className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30">
                            {assessment.entrepreneur_type}
                          </Badge>
                        )}
                        {assessment.completed_at ? (
                          <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                            Abgeschlossen
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30">
                            In Bearbeitung
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          {assessment.email}
                        </div>
                        {assessment.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {assessment.phone}
                          </div>
                        )}
                        {assessment.company && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="w-4 h-4" />
                            {assessment.company}
                          </div>
                        )}
                        {assessment.industry && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="w-4 h-4" />
                            Branche: {assessment.industry}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {new Date(assessment.created_at).toLocaleDateString("de-DE")} {new Date(assessment.created_at).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                        {assessment.cta_clicked && (
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            CTA geklickt
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {assessment.completed_at && (
                        <>
                          <Button
                            onClick={() => handleDownloadPDF(assessment.id)}
                            size="sm"
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold gap-2"
                          >
                            <Download className="w-4 h-4" />
                            PDF
                          </Button>
                          <Button
                            onClick={() => router.push(`/admin/customer/${assessment.id}`)}
                            variant="outline"
                            size="sm"
                            className="border-blue-500/40 hover:border-blue-500 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 bg-transparent gap-2"
                          >
                            Details anschauen
                          </Button>
                        </>
                      )}
                      <Button
                        onClick={() => handleDeleteCustomer(assessment.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-500/40 hover:border-red-500 hover:bg-red-500/10 text-red-600 dark:text-red-400 bg-transparent gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Löschen
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            {appointments.length === 0 ? (
              <Card className="p-12 text-center bg-card/50 backdrop-blur-sm">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">Noch keine Termine vorhanden</p>
              </Card>
            ) : (
              appointments.map((appointment) => (
                <Card key={appointment.id} className="p-6 border-border/50 hover:border-yellow-500/40 transition-all bg-card/50 backdrop-blur-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-bold text-foreground">{appointment.customer_name}</h3>
                        <Badge className={appointment.status === "confirmed" 
                          ? "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30"
                        }>
                          {appointment.status === "confirmed" ? "Bestätigt" : "Storniert"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          {appointment.customer_email}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          {appointment.customer_phone}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(appointment.appointment_date).toLocaleDateString("de-DE")}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {appointment.appointment_time}
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                          <strong>Notiz:</strong> {appointment.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {appointment.status === "confirmed" && (
                        <Button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          variant="outline"
                          size="sm"
                          className="border-yellow-500/40 hover:border-yellow-500 hover:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 bg-transparent gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Stornieren
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-500/40 hover:border-red-500 hover:bg-red-500/10 text-red-600 dark:text-red-400 bg-transparent gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Löschen
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            {notifications.length > 0 && unreadCount > 0 && (
              <div className="flex justify-end mb-4">
                <Button
                  onClick={handleMarkAllAsRead}
                  size="sm"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
                >
                  Alle als gelesen markieren
                </Button>
              </div>
            )}

            {notifications.length === 0 ? (
              <Card className="p-12 text-center bg-card/50 backdrop-blur-sm">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">Keine Benachrichtigungen</p>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-6 cursor-pointer transition-all ${
                    notification.read
                      ? "border-border/50 opacity-70 bg-card/30"
                      : "border-yellow-500/40 bg-yellow-500/5 hover:bg-yellow-500/10"
                  }`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.type === "assessment_started"
                        ? "bg-blue-500/20"
                        : "bg-green-500/20"
                    }`}>
                      {notification.type === "assessment_started" ? (
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <h4 className="font-bold text-foreground">{notification.title}</h4>
                        {!notification.read && (
                          <Badge className="bg-yellow-500 text-black text-xs font-bold">NEU</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleDateString("de-DE")} {new Date(notification.created_at).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Password Change Dialog */}
      {showPasswordDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">Admin Passwort ändern</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowPasswordDialog(false)
                  setNewPassword("")
                  setConfirmPassword("")
                  setPasswordError("")
                }}
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Neues Passwort
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    setPasswordError("")
                  }}
                  className="w-full px-4 py-3 rounded-lg border-2 border-yellow-500/30 bg-background focus:border-yellow-500 focus:outline-none"
                  placeholder="Mindestens 6 Zeichen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Passwort bestätigen
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setPasswordError("")
                  }}
                  className="w-full px-4 py-3 rounded-lg border-2 border-yellow-500/30 bg-background focus:border-yellow-500 focus:outline-none"
                  placeholder="Passwort wiederholen"
                />
              </div>

              {passwordError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-600 dark:text-red-400 text-sm">
                  {passwordError}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleChangePassword}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
                >
                  Passwort speichern
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordDialog(false)
                    setNewPassword("")
                    setConfirmPassword("")
                    setPasswordError("")
                  }}
                  className="flex-1"
                >
                  Abbrechen
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Das neue Passwort wird lokal gespeichert und gilt für diesen Browser.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
