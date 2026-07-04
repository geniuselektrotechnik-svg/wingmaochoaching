// Wingman Logo als Base64 für PDF-Generierung
// PNG Logo konvertiert zu Base64 String

export const WINGMAN_LOGO_BASE64 = async (): Promise<string> => {
  try {
    // Lade das Logo-Bild
    const response = await fetch('/images/wingman-logo.png')
    const blob = await response.blob()
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error loading logo:', error)
    // Fallback: kleines generiertes Logo als SVG -> Base64
    const svg = `<svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="60" rx="8" fill="#fbbf24"/>
      <text x="100" y="38" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle" fill="#000">WINGMAN</text>
    </svg>`
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }
}
