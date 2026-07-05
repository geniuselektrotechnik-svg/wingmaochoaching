import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/results", "/questions", "/appointments"],
      },
    ],
    sitemap: "https://wingmancoaching-test.de/sitemap.xml",
  }
}
