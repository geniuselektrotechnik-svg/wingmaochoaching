import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Footer } from "@/components/footer"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

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
      <body className={`font-sans antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
