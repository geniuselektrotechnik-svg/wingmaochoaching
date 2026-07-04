import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// In-memory rate limit store (per Edge-Instanz; reicht für diesen Use-Case)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  )
}

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}

function cleanupStore() {
  const now = Date.now()
  for (const [key, val] of rateLimitStore.entries()) {
    if (now > val.resetAt) rateLimitStore.delete(key)
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const ip = getClientIp(request)

  if (Math.random() < 0.01) cleanupStore()

  // Admin-Login: 5 Versuche pro 15 Minuten
  if (pathname === "/api/admin/login") {
    if (!checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) {
      console.warn("[SECURITY] Rate limit exceeded for login from:", ip)
      return NextResponse.json(
        { error: "Zu viele Versuche. Bitte 15 Minuten warten." },
        { status: 429 }
      )
    }
    return NextResponse.next()
  }

  // KI-Analyse: 10 Anfragen pro Stunde
  if (pathname === "/api/analyze") {
    if (!checkRateLimit(`analyze:${ip}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte später erneut versuchen." },
        { status: 429 }
      )
    }
    return NextResponse.next()
  }

  // Öffentliche Write-Endpunkte: 20 pro Stunde
  if (
    pathname === "/api/assessment/create" ||
    pathname === "/api/appointments/book" ||
    pathname === "/api/send-results"
  ) {
    if (!checkRateLimit(`pub:${ip}`, 20, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte später erneut versuchen." },
        { status: 429 }
      )
    }
    return NextResponse.next()
  }

  // Alle anderen /api/admin/* Routes: Auth-Check
  if (pathname.startsWith("/api/admin/")) {
    const authTokenEnv = process.env.ADMIN_AUTH_TOKEN

    if (!authTokenEnv) {
      console.error("[CRITICAL] ADMIN_AUTH_TOKEN not configured")
      return NextResponse.json(
        { error: "Server nicht konfiguriert" },
        { status: 500 }
      )
    }

    const cookieToken = request.cookies.get("admin_auth")?.value

    if (!cookieToken || cookieToken !== authTokenEnv) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/api/admin/:path*",
    "/api/analyze",
    "/api/assessment/create",
    "/api/appointments/book",
    "/api/send-results",
  ],
}
