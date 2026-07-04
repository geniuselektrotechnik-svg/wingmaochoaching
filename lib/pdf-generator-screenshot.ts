import puppeteer from "puppeteer"

export async function generatePDFFromResultsPage(
  assessmentId: string,
  baseUrl?: string
): Promise<Buffer> {
  const url = baseUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const resultsUrl = `${url}/results?assessmentId=${assessmentId}`


  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
    ],
  })

  try {
    const page = await browser.newPage()

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2, // For better quality
    })

    // Navigate to results page
    await page.goto(resultsUrl, {
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 30000,
    })

    // Wait for charts and content to load
    await page.waitForSelector('[data-chart-loaded="true"]', { timeout: 10000 }).catch(() => {})

    // Additional wait for any animations or dynamic content
    await page.evaluate(() => {
      return new Promise((resolve) => {
        setTimeout(resolve, 2000)
      })
    })

    // Generate PDF from the page
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
      preferCSSPageSize: false,
    })

    return Buffer.from(pdfBuffer)
  } catch (error) {
    console.error("Error generating PDF from results page:", error)
    throw error
  } finally {
    await browser.close()
  }
}
