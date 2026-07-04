/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return {
      // Läuft VOR dem Datei-System-Routing: Startseite liefert die statische Webflow-Landing
      beforeFiles: [{ source: "/", destination: "/landing/index.html" }],
    }
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self' https://*.supabase.co https://api.brevo.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ]
  },
}

export default nextConfig
