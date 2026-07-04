import { Card } from "@/components/ui/card"

export const metadata = {
  title: "Impressum | Wingman Coaching",
  description: "Impressum und Anbieterkennzeichnung von Wingman Coaching.",
}

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <img src="/images/wingman-logo.png" alt="Wingman Coaching" className="h-11 w-auto mb-8" />
        <Card className="p-8 md:p-10">
          <h1 className="text-3xl font-bold mb-8">Impressum</h1>

          <div className="space-y-4 text-foreground/90 leading-relaxed">
            <h2 className="text-xl font-semibold">Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)</h2>
            <p>
              Wingman Coaching
              <br />
              Karol Peters
              <br />
              Grünbergstr. 36 e
              <br />
              47445 Moers
              <br />
              Deutschland
            </p>

            <h2 className="text-xl font-semibold pt-4">Kontakt</h2>
            <p>
              Telefon: 02841 4099425
              <br />
              E-Mail:{" "}
              <a href="mailto:kontakt@wingmancoaching.de" className="text-primary underline">
                kontakt@wingmancoaching.de
              </a>
            </p>

            <h2 className="text-xl font-semibold pt-4">Steuernummer</h2>
            <p>119/5231/4194</p>

            <h2 className="text-xl font-semibold pt-4">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>
              Karol Peters
              <br />
              Grünbergstr. 36 e
              <br />
              47445 Moers
            </p>

            <h2 className="text-xl font-semibold pt-4">Leistungsangebot</h2>
            <p>
              Coaching, Unternehmensberatung sowie die Durchführung von Seminaren, Workshops und
              Schulungsveranstaltungen. Angebot von unverbindlichen Erstgesprächen sowie anschließenden
              Beratungs- und Seminarleistungen.
            </p>

            <h2 className="text-xl font-semibold pt-4">EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              <br />
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>

            <h2 className="text-xl font-semibold pt-4">Verbraucherstreitbeilegung</h2>
            <p>
              Wir sind weder verpflichtet noch bereit, an einem Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
