import { NextResponse } from "next/server"

export async function POST() {
  // Setze Cookie auf leer/abgelaufen
  const response = NextResponse.json({ success: true })
  response.cookies.set("admin_auth", "", {
    httpOnly: true,
    maxAge: 0 // Ablaufen sofort
  })
  
  console.log("[DEBUG] Logout successful, cookie cleared")
  return response
}
