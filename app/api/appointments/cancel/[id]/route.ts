import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { sendAppointmentCancelledEmail } from "@/lib/resend-client"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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

    // Get appointment details
    const { data: appointment } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", id)
      .single()

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Update status to cancelled
    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", id)

    if (error) throw error

    // Sende Stornierungsbestätigung via Resend
    await sendAppointmentCancelledEmail({
      name: appointment.customer_name,
      email: appointment.customer_email,
      phone: appointment.customer_phone,
      date: appointment.appointment_date,
      time: appointment.appointment_time,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cancellation error:", error)
    return NextResponse.json({ error: "Cancellation failed" }, { status: 500 })
  }
}
