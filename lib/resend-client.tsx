// Brevo (Sendinblue) Client - keine externe Library nötig, nutzt native fetch

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function getSenderEmail(): string {
  return process.env.SENDER_EMAIL || "wingmancoaching91@gmail.com"
}

function getBrevoApiKey(): string {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    throw new Error("BREVO_API_KEY ist nicht gesetzt!")
  }
  return apiKey
}

interface AppointmentBookedEmailData {
  name: string
  email: string
  phone: string
  date: string
  time: string
  cancellationLink: string
}

interface AppointmentCancelledEmailData {
  name: string
  email: string
  phone: string
  date: string
  time: string
}

interface PDFEmailData {
  email: string
  userName: string
  company: string
  entrepreneurType: string
  overallScore: number
  pdfBase64: string
}

// Sende Terminbestätigungs-Email
export async function sendAppointmentBookedEmail(data: AppointmentBookedEmailData): Promise<boolean> {
  try {
    const apiKey = getBrevoApiKey()
    
    const formattedDate = new Date(data.date).toLocaleDateString("de-DE", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Wingman Coaching", email: getSenderEmail() },
        to: [{ email: data.email, name: escapeHtml(data.name) }],
        subject: "✅ Ihre Terminbestätigung - Wingman",
        htmlContent: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%); color: #000; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
              .info-box { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .info-row { margin: 10px 0; }
              .label { font-weight: bold; color: #6b7280; }
              .button { display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
              .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Ihre Terminbestätigung</h1>
              </div>
              <div class="content">
                <p>Hallo ${escapeHtml(data.name)},</p>
                <p>vielen Dank für Ihre Terminbuchung! Ihr Termin wurde erfolgreich gebucht:</p>

                <div class="info-box">
                  <div class="info-row">
                    <span class="label">📅 Datum:</span> ${escapeHtml(formattedDate)}
                  </div>
                  <div class="info-row">
                    <span class="label">🕐 Uhrzeit:</span> ${escapeHtml(data.time)} Uhr
                  </div>
                  <div class="info-row">
                    <span class="label">📞 Telefon:</span> ${escapeHtml(data.phone)}
                  </div>
                </div>

                <p>Wir freuen uns auf das Gespräch mit Ihnen!</p>

                <p style="margin-top: 30px;">
                  <strong>Termin stornieren:</strong><br>
                  Falls Sie den Termin nicht wahrnehmen können, können Sie ihn über diesen Link stornieren:
                </p>

                <a href="${escapeHtml(data.cancellationLink)}" class="button">Termin stornieren</a>

                <div class="footer">
                  <p>© ${new Date().getFullYear()} Wingman. Alle Rechte vorbehalten.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      }),
    })

    if (!response.ok) {
      throw new Error(`Brevo API Error: ${response.status}`)
    }

    console.log("✅ Terminbestätigungs-Email erfolgreich versendet")
    return true
  } catch (error) {
    console.error("❌ Fehler beim Versenden der Terminbestätigungs-Email:", error)
    return false
  }
}

// Sende Stornierungsbestätigungs-Email
export async function sendAppointmentCancelledEmail(data: AppointmentCancelledEmailData): Promise<boolean> {
  try {
    const apiKey = getBrevoApiKey()

    const formattedDate = new Date(data.date).toLocaleDateString("de-DE", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Wingman Coaching", email: getSenderEmail() },
        to: [{ email: data.email, name: escapeHtml(data.name) }],
        subject: "Termin storniert - Wingman",
        htmlContent: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
              .info-box { background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
              .info-row { margin: 10px 0; }
              .label { font-weight: bold; color: #6b7280; }
              .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Termin storniert</h1>
              </div>
              <div class="content">
                <p>Hallo ${escapeHtml(data.name)},</p>
                <p>Ihr Termin wurde erfolgreich storniert:</p>

                <div class="info-box">
                  <div class="info-row">
                    <span class="label">📅 Datum:</span> ${escapeHtml(formattedDate)}
                  </div>
                  <div class="info-row">
                    <span class="label">🕐 Uhrzeit:</span> ${escapeHtml(data.time)} Uhr
                  </div>
                </div>

                <p>Wenn Sie einen neuen Termin buchen möchten, besuchen Sie bitte unsere Website.</p>

                <div class="footer">
                  <p>© ${new Date().getFullYear()} Wingman. Alle Rechte vorbehalten.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      }),
    })

    if (!response.ok) {
      throw new Error(`Brevo API Error: ${response.status}`)
    }

    console.log("✅ Stornierungsbestätigungs-Email erfolgreich versendet")
    return true
  } catch (error) {
    console.error("❌ Fehler beim Versenden der Stornierungsbestätigungs-Email:", error)
    return false
  }
}

// Sende PDF-Email
export async function sendPDFEmail(data: PDFEmailData): Promise<boolean> {
  try {
    const apiKey = getBrevoApiKey()

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Wingman Coaching", email: getSenderEmail() },
        to: [{ email: data.email, name: escapeHtml(data.userName) }],
        subject: "Ihre Wingman Unternehmensanalyse 360°",
        htmlContent: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%); color: #000; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
              .score-box { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
              .score { font-size: 48px; font-weight: bold; color: #F59E0B; }
              .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Ihre Unternehmensanalyse 360°</h1>
              </div>
              <div class="content">
                <p>Hallo ${escapeHtml(data.userName)},</p>
                <p>vielen Dank für Ihre Teilnahme an der Wingman Unternehmensanalyse 360°!</p>

                <div class="score-box">
                  <p style="margin: 0; font-size: 14px; color: #6b7280;">Ihr Gesamt-Score</p>
                  <div class="score">${Number(data.overallScore)}/100</div>
                  <p style="margin: 10px 0 0 0; font-size: 16px; font-weight: bold;">${escapeHtml(data.entrepreneurType)}</p>
                </div>

                <p>Im Anhang finden Sie Ihre vollständige Analyse als PDF mit allen Details und individuellen Empfehlungen für ${escapeHtml(data.company)}.</p>

                <p><strong>Nächste Schritte:</strong><br>
                Buchen Sie jetzt ein kostenloses Beratungsgespräch, um Ihre Ergebnisse zu besprechen und einen individuellen Aktionsplan zu entwickeln.</p>

                <div class="footer">
                  <p>© ${new Date().getFullYear()} Wingman. Alle Rechte vorbehalten.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
        attachment: [
          {
            name: "Wingman_Unternehmensanalyse_360.pdf",
            content: data.pdfBase64,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Brevo API Error: ${response.status}`)
    }

    console.log("✅ PDF-Email erfolgreich versendet")
    return true
  } catch (error) {
    console.error("❌ Fehler beim Versenden der PDF-Email:", error)
    return false
  }
}
