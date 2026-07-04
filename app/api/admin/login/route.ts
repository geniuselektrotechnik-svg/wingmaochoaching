import { NextResponse } from "next/server"
import { compare } from "bcryptjs"

export async function POST(request: Request) {
  try {
    const passwordHash = process.env.ADMIN_PASSWORD_HASH
    const authToken = process.env.ADMIN_AUTH_TOKEN

    if (!passwordHash || !authToken) {
      console.error("[CRITICAL] Admin credentials not configured")
      return NextResponse.json(
        { error: "Server nicht konfiguriert" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const password = body.password

    if (!password || typeof password !== "string" || password.length > 256) {
      return NextResponse.json(
        { error: "Passwort erforderlich" },
        { status: 400 }
      )
    }

    const isValid = await compare(password, passwordHash)

    if (!isValid) {
      console.warn("[SECURITY] Invalid admin login attempt")
      return NextResponse.json(
        { error: "Ungültiges Passwort" },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set("admin_auth", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    })

    console.log("[SECURITY] Admin login successful")
    return response
  } catch (error) {
    console.error("[Admin] Login error:", error instanceof Error ? error.message : "unknown")
    return NextResponse.json(
      { error: "Serverfehler" },
      { status: 500 }
    )
  }
}
