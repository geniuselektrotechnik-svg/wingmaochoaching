import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { generateCancellationToken, storeCancellationToken, createCancellationLink } from "@/lib/cancellation-token"
import { sendAppointmentBookedEmail } from "@/lib/resend-client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, date, time } = body

    // Create Supabase client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Insert appointment
    const { data, error } = await supabase
      .from("appointments")
      .insert({
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        appointment_date: date,
        appointment_time: time,
        status: "confirmed",
      })
      .select()
      .single()

    if (error) throw error

    const token = generateCancellationToken(data.id)
    await storeCancellationToken(data.id, token)
    const cancellationLink = createCancellationLink(token)

    // Sende Email via Resend
    const emailSent = await sendAppointmentBookedEmail({
      name,
      email,
      phone,
      date,
      time,
      cancellationLink,
    })
    
    if (!emailSent) {
      console.warn("⚠️ Email konnte nicht versendet werden")
      console.warn("ABER: Der Termin wurde erfolgreich in der Datenbank gespeichert!")
    }

    // Erstelle Notification in Datenbank für Admin Panel
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    await supabaseAdmin.from("notifications").insert({
      type: "appointment_booked",
      title: "Neuer Termin gebucht",
      message: `${name} (${email}) hat einen Termin gebucht für ${new Date(date).toLocaleDateString("de-DE")} um ${time} Uhr.`,
      related_id: data.id,
    })

    return NextResponse.json({ 
      success: true, 
      appointmentId: data.id,
      cancellationLink: cancellationLink,
      appointment: data 
    })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json({ error: "Booking failed" }, { status: 500 })
  }
}
