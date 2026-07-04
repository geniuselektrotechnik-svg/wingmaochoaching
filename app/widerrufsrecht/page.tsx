import { LegalShell } from "@/components/legal-shell"

export const metadata = {
  title: "Widerrufsbelehrung | Wingman Coaching",
  description: "Widerrufsbelehrung und Muster-Widerrufsformular für Verbraucher.",
}

export default function WiderrufsrechtPage() {
  return (
    <LegalShell title="Widerrufsbelehrung" intro="Gilt für Verbraucher im Sinne des § 13 BGB">
      <h2>Widerrufsrecht</h2>
      <p>
        Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die
        Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
      </p>
      <p>
        Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
      </p>
      <p>
        Wingman Coaching, Karol Peters, Grünbergstr. 36 e, 47445 Moers, Deutschland,
        <br />
        Telefon: 02841 4099425, E-Mail:{" "}
        <a href="mailto:kontakt@wingmancoaching.de">kontakt@wingmancoaching.de</a>
      </p>
      <p>
        mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren
        Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das unten stehende
        Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
      </p>
      <p>
        Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts
        vor Ablauf der Widerrufsfrist absenden.
      </p>

      <h2>Folgen des Widerrufs</h2>
      <p>
        Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben,
        unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über
        Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe
        Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde
        ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte
        berechnet.
      </p>
      <p>
        Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so haben Sie uns einen
        angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des
        Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich
        zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.
      </p>

      <h2>Vorzeitiges Erlöschen des Widerrufsrechts</h2>
      <p>
        Das Widerrufsrecht erlischt bei einem Vertrag über die Erbringung von Dienstleistungen, wenn wir die
        Dienstleistung vollständig erbracht haben und mit der Ausführung erst begonnen haben, nachdem Sie dazu Ihre
        ausdrückliche Zustimmung gegeben und gleichzeitig Ihre Kenntnis davon bestätigt haben, dass Sie Ihr
        Widerrufsrecht bei vollständiger Vertragserfüllung durch uns verlieren.
      </p>
      <p>
        Bei der Bereitstellung von digitalen Inhalten, die nicht auf einem körperlichen Datenträger geliefert werden
        (z. B. der digitale Analyse-Report), erlischt das Widerrufsrecht, wenn wir mit der Ausführung begonnen haben,
        nachdem Sie ausdrücklich zugestimmt haben, dass wir vor Ablauf der Widerrufsfrist mit der Ausführung
        beginnen, und Ihre Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung mit Beginn der Ausführung
        Ihr Widerrufsrecht verlieren.
      </p>

      <h2>Muster-Widerrufsformular</h2>
      <p>
        (Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es zurück.)
      </p>
      <p className="whitespace-pre-line rounded-lg border border-border p-4 text-sm">
        {`An: Wingman Coaching, Karol Peters, Grünbergstr. 36 e, 47445 Moers, kontakt@wingmancoaching.de

Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung (*):

_______________________________________________

Bestellt am (*) / erhalten am (*): _____________
Name des/der Verbraucher(s): __________________
Anschrift des/der Verbraucher(s): _____________
Datum: _______________________________________
Unterschrift (nur bei Mitteilung auf Papier): __________

(*) Unzutreffendes streichen.`}
      </p>
    </LegalShell>
  )
}
