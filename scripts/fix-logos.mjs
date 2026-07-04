// Repariert Logo-Dateien, die als base64-Text (falsche Endung) gespeichert wurden,
// in echte Bilddateien. Nutzt sharp (im Projekt vorhanden).
import sharp from "sharp"
import { readFile, writeFile } from "node:fs/promises"

const DIR = "/Users/agelianas/wingman-fix/public/images/"

async function isBinaryImage(path) {
  const buf = await readFile(path)
  // Echte Bilder starten mit bekannten Magic Bytes
  const head = buf.subarray(0, 12)
  const sig = head.toString("hex")
  return (
    sig.startsWith("89504e47") || // PNG
    sig.startsWith("ffd8ff") || // JPEG
    sig.includes("6674797061766966") || // ftypavif
    head.toString("utf8").includes("<svg")
  )
}

async function decodeBase64File(path) {
  const text = (await readFile(path, "utf8")).trim()
  return Buffer.from(text, "base64")
}

// wingman-logo: gültige Quelle ist die .avif -> echte png/jpg erzeugen
async function fromAvif(srcAvif, outPath, fmt) {
  const buf = await readFile(DIR + srcAvif)
  const img = sharp(buf)
  const out = fmt === "jpeg" ? img.jpeg({ quality: 92 }) : img.png()
  await out.toFile(DIR + outPath)
  const meta = await sharp(await readFile(DIR + outPath)).metadata()
  console.log(`OK  ${outPath}  ${meta.width}x${meta.height} ${meta.format}`)
}

// base64-Datei in echtes png dekodieren
async function fixBase64(path, outFmt = "png") {
  if (await isBinaryImage(DIR + path)) {
    console.log(`SKIP ${path} (bereits gültiges Bild)`)
    return
  }
  const raw = await decodeBase64File(DIR + path)
  const img = sharp(raw)
  const out = outFmt === "jpeg" ? img.jpeg({ quality: 92 }) : img.png()
  const result = await out.toBuffer()
  await writeFile(DIR + path, result)
  const meta = await sharp(result).metadata()
  console.log(`FIX ${path}  ${meta.width}x${meta.height} ${meta.format}`)
}

await fromAvif("wingman-logo.avif", "wingman-logo.png", "png")
await fromAvif("wingman-logo.avif", "wingman-logo.jpg", "jpeg")
await fixBase64("paypal-logo.png", "png")
await fixBase64("sepa-lastschrift-logo.png", "png")

console.log("fertig")
