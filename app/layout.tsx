import type React from "react"
import type { Metadata } from "next"
import { Inter_Tight } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Footer } from "@/components/footer"
import "./globals.css"

// Gleiche Schrift wie die Landingpage (self-hosted durch next/font, CSP-konform)
const interTight = Inter_Tight({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Wingman Coaching | 360-Grad-Unternehmensanalyse",
  description:
    "360-Grad-Unternehmensanalyse fuer Unternehmer: Klarheit ueber Vertrieb, Finanzen, Strategie und Wachstum. 78 Fragen, KI-Auswertung, 90-Tage-Plan.",
  icons: {
    icon: [{ url: "/wingman-favicon.svg", type: "image/svg+xml" }],
    apple: "/images/wingman-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={`${interTight.className} antialiased`}>
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
