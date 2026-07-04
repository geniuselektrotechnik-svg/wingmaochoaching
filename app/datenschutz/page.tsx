import { LegalShell } from "@/components/legal-shell"

export const metadata = {
  title: "Datenschutzerklärung | Wingman Coaching",
  description: "Informationen zur Verarbeitung personenbezogener Daten bei Wingman Coaching nach DSGVO.",
}

export default function DatenschutzPage() {
  return (
    <LegalShell title="Datenschutzerklärung" intro="Stand: Juli 2026">
      <p>
        Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Nachfolgend informieren wir Sie gemäß
        Art. 13 und 14 der Datenschutz-Grundverordnung (DSGVO) darüber, welche Daten wir zu welchem Zweck
        und auf welcher Rechtsgrundlage verarbeiten.
      </p>

      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich im Sinne der DSGVO ist:
        <br />
        Wingman Coaching, Karol Peters
        <br />
        Grünbergstr. 36 e, 47445 Moers, Deutschland
        <br />
        Telefon: 02841 4099425
        <br />
        E-Mail: <a href="mailto:kontakt@wingmancoaching.de">kontakt@wingmancoaching.de</a>
      </p>

      <h2>2. Ihre Rechte als betroffene Person</h2>
      <p>Ihnen stehen gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten zu:</p>
      <ul>
        <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
        <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
        <li>Recht auf Löschung (Art. 17 DSGVO)</li>
        <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerspruchsrecht gegen die Verarbeitung (Art. 21 DSGVO)</li>
        <li>Recht auf Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
      </ul>
      <p>
        Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer
        personenbezogenen Daten zu beschweren (Art. 77 DSGVO). Zuständig ist u. a. die Landesbeauftragte für
        Datenschutz und Informationsfreiheit Nordrhein-Westfalen.
      </p>

      <h2>3. Hosting</h2>
      <p>
        Diese Website wird bei der Vercel Inc. (340 S Lemon Ave #4133, Walnut, CA 91789, USA) gehostet. Beim
        Aufruf der Website werden technisch notwendige Daten (siehe Server-Logfiles) verarbeitet. Rechtsgrundlage
        ist unser berechtigtes Interesse an einem sicheren und effizienten Betrieb (Art. 6 Abs. 1 lit. f DSGVO).
        Mit Vercel besteht ein Auftragsverarbeitungsvertrag. Bei Datenübermittlung in die USA stützen wir uns auf
        Standardvertragsklauseln bzw. das EU-US Data Privacy Framework.
      </p>

      <h2>4. Datenerfassung beim Besuch der Website (Server-Logfiles)</h2>
      <p>
        Beim Aufruf der Website werden automatisch Informationen erfasst, die Ihr Browser übermittelt: Browsertyp
        und -version, verwendetes Betriebssystem, Referrer-URL, Hostname des zugreifenden Rechners, Uhrzeit der
        Serveranfrage und die IP-Adresse. Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und
        dienen der technischen Auslieferung sowie der Sicherheit (Art. 6 Abs. 1 lit. f DSGVO).
      </p>

      <h2>5. Die 360-Grad-Analyse (Fragebogen &amp; Auswertung)</h2>
      <p>
        Wenn Sie die Unternehmensanalyse durchführen, verarbeiten wir Ihre Antworten auf den Fragebogen sowie die
        von Ihnen angegebenen Kontakt- und ggf. Unternehmensdaten (z. B. Name, E-Mail-Adresse, Telefonnummer,
        Branche), um die Auswertung zu erstellen und Ihnen den Ergebnis-Report bereitzustellen.
      </p>
      <ul>
        <li>
          <strong>Zweck:</strong> Erstellung der Analyse, des Reports und des 90-Tage-Plans, Bereitstellung der
          Ergebnisse und Kontaktaufnahme.
        </li>
        <li>
          <strong>Rechtsgrundlage:</strong> Vertragserfüllung bzw. vorvertragliche Maßnahmen (Art. 6 Abs. 1 lit. b
          DSGVO) sowie ggf. Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
        </li>
        <li>
          <strong>Zwischenspeicherung im Browser:</strong> Während der Beantwortung werden Ihre Antworten
          vorübergehend lokal in Ihrem Browser (localStorage) gespeichert, damit der Fortschritt nicht verloren geht.
        </li>
      </ul>

      <h2>6. Datenbank &amp; Backend (Supabase)</h2>
      <p>
        Zur Speicherung und Verarbeitung der Analyse- und Termindaten nutzen wir Supabase (Supabase Inc., 970 Toa
        Payoh North #07-04, Singapur; Server ggf. in der EU/USA). Supabase verarbeitet die Daten als
        Auftragsverarbeiter auf Grundlage eines entsprechenden Vertrags (Art. 28 DSGVO). Rechtsgrundlage ist die
        Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO).
      </p>

      <h2>7. KI-gestützte Auswertung (OpenAI)</h2>
      <p>
        Für die automatisierte Auswertung Ihrer Antworten setzen wir Dienste der OpenAI, L.L.C. (1960 Bryant
        Street, San Francisco, CA 94110, USA) ein. Dabei werden die für die Analyse erforderlichen Angaben aus dem
        Fragebogen an OpenAI übermittelt und dort verarbeitet, um den Auswertungstext zu generieren. Es findet eine
        Übermittlung in die USA statt; diese stützen wir auf Standardvertragsklauseln bzw. das EU-US Data Privacy
        Framework. Rechtsgrundlage ist die Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO). Geben Sie in Freitextfeldern
        bitte keine besonders sensiblen Daten an.
      </p>

      <h2>8. E-Mail-Versand (Brevo &amp; Resend)</h2>
      <p>
        Zum Versand von Bestätigungen, Reports und Benachrichtigungen nutzen wir:
      </p>
      <ul>
        <li>Brevo (Sendinblue GmbH, Köpenicker Str. 126, 10179 Berlin / Brevo SA, Frankreich)</li>
        <li>Resend (Resend, Inc., USA)</li>
      </ul>
      <p>
        Dabei werden Ihre E-Mail-Adresse und die Inhalte der jeweiligen Nachricht verarbeitet. Rechtsgrundlage ist
        die Vertragserfüllung bzw. unser berechtigtes Interesse an zuverlässiger Kommunikation (Art. 6 Abs. 1 lit. b
        und f DSGVO). Mit den Anbietern bestehen Auftragsverarbeitungsverträge; bei USA-Transfer gelten
        Standardvertragsklauseln.
      </p>

      <h2>9. Zahlungsabwicklung (Stripe)</h2>
      <p>
        Für kostenpflichtige Leistungen nutzen wir den Zahlungsdienstleister Stripe (Stripe Payments Europe, Ltd.,
        1 Grand Canal Street Lower, Dublin, Irland). Die Zahlungsdaten (z. B. Zahlungsmittel, Betrag, Name,
        E-Mail-Adresse) werden direkt von Stripe verarbeitet; vollständige Kartendaten erhalten wir nicht.
        Rechtsgrundlage ist die Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO). Weitere Informationen:{" "}
        <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer">
          stripe.com/de/privacy
        </a>
        .
      </p>

      <h2>10. Terminbuchung</h2>
      <p>
        Wenn Sie einen Termin buchen, verarbeiten wir die dafür erforderlichen Daten (Name, E-Mail-Adresse,
        Wunschtermin) zur Organisation und Durchführung des Termins. Rechtsgrundlage ist die Vertragserfüllung bzw.
        vorvertragliche Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO).
      </p>

      <h2>11. Kontaktaufnahme</h2>
      <p>
        Bei Kontaktaufnahme per E-Mail werden Ihre Angaben zur Bearbeitung der Anfrage und für Anschlussfragen
        gespeichert. Rechtsgrundlage ist unser berechtigtes Interesse an der Beantwortung (Art. 6 Abs. 1 lit. f
        DSGVO) bzw. die Vertragsanbahnung (Art. 6 Abs. 1 lit. b DSGVO).
      </p>

      <h2>12. Speicherdauer</h2>
      <p>
        Wir verarbeiten und speichern personenbezogene Daten nur so lange, wie es für die jeweiligen Zwecke
        erforderlich ist oder gesetzliche Aufbewahrungsfristen (z. B. handels- und steuerrechtlich, bis zu 10 Jahre)
        dies verlangen. Danach werden die Daten gelöscht.
      </p>

      <h2>13. SSL-/TLS-Verschlüsselung</h2>
      <p>
        Diese Seite nutzt aus Sicherheitsgründen eine TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen
        Sie am „https://“ in der Adresszeile Ihres Browsers.
      </p>

      <h2>14. Änderung dieser Datenschutzerklärung</h2>
      <p>
        Wir passen diese Datenschutzerklärung an, sobald Änderungen der von uns durchgeführten Datenverarbeitung
        dies erforderlich machen. Es gilt die jeweils auf dieser Seite veröffentlichte Fassung.
      </p>
    </LegalShell>
  )
}
