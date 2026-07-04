import { LegalShell } from "@/components/legal-shell"

export const metadata = {
  title: "AGB | Wingman Coaching",
  description: "Allgemeine Geschäftsbedingungen von Wingman Coaching.",
}

export default function AGBPage() {
  return (
    <LegalShell title="Allgemeine Geschäftsbedingungen (AGB)" intro="Stand: Juli 2026">
      <h2>§ 1 Geltungsbereich und Vertragspartner</h2>
      <p>
        (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB“) gelten für sämtliche Verträge, die zwischen
        dem Kunden und Wingman Coaching, Inhaber Karol Peters, Grünbergstr. 36 e, 47445 Moers (nachfolgend
        „Anbieter“), über die auf der Website und in sonstigen Angeboten dargestellten Leistungen geschlossen werden.
      </p>
      <p>
        (2) Leistungen des Anbieters sind insbesondere die 360-Grad-Unternehmensanalyse, Coaching,
        Unternehmensberatung sowie Seminare, Workshops und Schulungen.
      </p>
      <p>
        (3) Verbraucher im Sinne dieser AGB ist jede natürliche Person, die den Vertrag zu Zwecken abschließt, die
        überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können
        (§ 13 BGB). Unternehmer ist eine natürliche oder juristische Person oder rechtsfähige Personengesellschaft,
        die bei Abschluss des Vertrags in Ausübung ihrer gewerblichen oder selbständigen beruflichen Tätigkeit
        handelt (§ 14 BGB).
      </p>
      <p>
        (4) Abweichende, entgegenstehende oder ergänzende Bedingungen des Kunden werden nicht Vertragsbestandteil, es
        sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich in Textform zu.
      </p>

      <h2>§ 2 Vertragsgegenstand und Leistungsbeschreibung</h2>
      <p>
        (1) Der konkrete Umfang der Leistung ergibt sich aus der jeweiligen Leistungs- bzw. Angebotsbeschreibung. Die
        360-Grad-Analyse umfasst die Auswertung der vom Kunden bereitgestellten Angaben, einen digitalen Report
        sowie einen darauf aufbauenden Handlungsplan.
      </p>
      <p>
        (2) Die Auswertung erfolgt teilweise KI-gestützt. Der Anbieter schuldet eine fachgerechte und sorgfältige
        Leistungserbringung, jedoch ausdrücklich keinen bestimmten wirtschaftlichen oder sonstigen Erfolg.
      </p>
      <p>
        (3) Ergebnisse, Einschätzungen und Empfehlungen sind unverbindlich und ersetzen keine Rechts-, Steuer-,
        Finanz- oder Unternehmensberatung im Einzelfall. Entscheidungen des Kunden auf Basis der Auswertung erfolgen
        in eigener Verantwortung.
      </p>

      <h2>§ 3 Zustandekommen des Vertrages</h2>
      <p>
        (1) Die Darstellung der Leistungen auf der Website stellt kein rechtlich bindendes Angebot dar, sondern eine
        unverbindliche Aufforderung zur Abgabe eines Angebots.
      </p>
      <p>
        (2) Mit dem Absenden der Bestellung bzw. Buchung gibt der Kunde ein verbindliches Angebot auf Abschluss eines
        Vertrages ab. Der Vertrag kommt zustande, sobald der Anbieter die Annahme erklärt (z. B. durch
        Bestätigung in Textform) oder mit der Erbringung der Leistung beginnt.
      </p>
      <p>(3) Der Vertragstext wird vom Anbieter gespeichert; der Kunde erhält die Vertragsdaten per E-Mail.</p>

      <h2>§ 4 Preise und Zahlungsbedingungen</h2>
      <p>
        (1) Es gelten die zum Zeitpunkt der Bestellung angegebenen Preise. Alle Preise verstehen sich als Endpreise;
        ein etwaiger Ausweis der Umsatzsteuer richtet sich nach den steuerlichen Verhältnissen des Anbieters.
      </p>
      <p>
        (2) Die Zahlung erfolgt über den Zahlungsdienstleister Stripe mit den dort angebotenen Zahlungsarten (z. B.
        PayPal, Klarna, Kreditkarte, SEPA-Lastschrift). Der Rechnungsbetrag ist mit Vertragsschluss sofort fällig,
        sofern nichts anderes vereinbart ist.
      </p>
      <p>
        (3) Gerät der Kunde in Zahlungsverzug, ist der Anbieter berechtigt, Verzugszinsen in gesetzlicher Höhe zu
        verlangen. Die Geltendmachung eines weitergehenden Schadens bleibt vorbehalten.
      </p>

      <h2>§ 5 Durchführung, Termine und Mitwirkung</h2>
      <p>
        (1) Digitale Leistungen (Analyse, Report) werden nach Zahlungseingang bzw. zum vereinbarten Zeitpunkt
        bereitgestellt. Termine (z. B. Erstgespräche, Coaching-Sitzungen) werden individuell vereinbart.
      </p>
      <p>
        (2) Der Kunde stellt alle für die Leistungserbringung erforderlichen Informationen rechtzeitig, vollständig
        und wahrheitsgemäß bereit. Die Qualität der Auswertung hängt maßgeblich von der Richtigkeit dieser Angaben
        ab. Für Folgen unrichtiger oder unvollständiger Angaben haftet der Anbieter nicht.
      </p>

      <h2>§ 6 Widerrufsrecht für Verbraucher</h2>
      <p>
        (1) Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Die Einzelheiten und das Muster-Widerrufsformular
        ergeben sich aus der <a href="/widerrufsrecht">Widerrufsbelehrung</a>.
      </p>
      <p>
        (2) Bei vollständig erbrachten Dienstleistungen sowie bei digitalen Inhalten kann das Widerrufsrecht unter
        den in der Widerrufsbelehrung genannten Voraussetzungen vorzeitig erlöschen, wenn der Kunde ausdrücklich
        zustimmt, dass mit der Ausführung vor Ablauf der Widerrufsfrist begonnen wird.
      </p>

      <h2>§ 7 Absage, Stornierung und Verschiebung von Terminen</h2>
      <p>
        (1) Unbeschadet des Widerrufsrechts kann ein vereinbarter Termin bis 24 Stunden vor Beginn kostenfrei
        abgesagt oder verschoben werden, sofern nichts anderes vereinbart ist.
      </p>
      <p>
        (2) Bei späterer Absage oder Nichterscheinen kann der Anbieter das vereinbarte Honorar für den betreffenden
        Termin in Rechnung stellen, sofern der Kunde die Absage zu vertreten hat. Dem Kunden bleibt der Nachweis
        vorbehalten, dass kein oder ein geringerer Schaden entstanden ist.
      </p>
      <p>
        (3) Der Anbieter ist berechtigt, Termine aus wichtigem Grund (z. B. Krankheit) zu verlegen; bereits gezahlte
        Beträge werden in diesem Fall auf einen Ersatztermin angerechnet oder erstattet.
      </p>

      <h2>§ 8 Nutzungsrechte und Urheberrecht</h2>
      <p>
        Reports, Auswertungen, Präsentationen, Konzepte und sonstige Unterlagen des Anbieters sind urheberrechtlich
        geschützt. Der Kunde erhält ein einfaches, nicht übertragbares Nutzungsrecht zur Verwendung für eigene
        Zwecke. Eine Vervielfältigung, Weitergabe an Dritte oder öffentliche Zugänglichmachung ist ohne
        vorherige Zustimmung des Anbieters in Textform nicht gestattet.
      </p>

      <h2>§ 9 Vertraulichkeit</h2>
      <p>
        Beide Vertragsparteien verpflichten sich, alle im Rahmen der Zusammenarbeit bekannt gewordenen
        vertraulichen Informationen und Geschäftsgeheimnisse der jeweils anderen Partei vertraulich zu behandeln und
        nicht unbefugt an Dritte weiterzugeben. Diese Pflicht besteht auch nach Beendigung des Vertrags fort.
      </p>

      <h2>§ 10 Gewährleistung</h2>
      <p>
        Es gelten die gesetzlichen Gewährleistungsrechte. Bei Mängeln der Leistung wird der Anbieter zunächst
        Gelegenheit zur Nacherfüllung erhalten. Der Kunde hat festgestellte Mängel unverzüglich und nachvollziehbar
        mitzuteilen.
      </p>

      <h2>§ 11 Haftung</h2>
      <p>
        (1) Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der
        Gesundheit sowie für Schäden, die auf Vorsatz oder grober Fahrlässigkeit beruhen.
      </p>
      <p>
        (2) Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten (Kardinalpflichten), deren Erfüllung
        die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und auf deren Einhaltung der Kunde
        regelmäßig vertraut, ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt.
      </p>
      <p>
        (3) Im Übrigen ist die Haftung ausgeschlossen. Die Haftung nach dem Produkthaftungsgesetz sowie im Rahmen
        ausdrücklich übernommener Garantien bleibt unberührt.
      </p>

      <h2>§ 12 Höhere Gewalt</h2>
      <p>
        Ereignisse höherer Gewalt, die dem Anbieter die Leistung wesentlich erschweren oder unmöglich machen,
        berechtigen den Anbieter, die Leistung um die Dauer der Behinderung zu verschieben. Als höhere Gewalt gelten
        insbesondere nicht vom Anbieter zu vertretende Betriebsstörungen, Ausfälle von Kommunikationsnetzen oder
        Diensten Dritter sowie behördliche Maßnahmen.
      </p>

      <h2>§ 13 Datenschutz</h2>
      <p>
        Der Anbieter verarbeitet personenbezogene Daten nach den geltenden Datenschutzvorschriften. Einzelheiten
        ergeben sich aus der <a href="/datenschutz">Datenschutzerklärung</a>.
      </p>

      <h2>§ 14 Streitbeilegung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:{" "}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr
        </a>
        . Der Anbieter ist weder verpflichtet noch bereit, an einem Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h2>§ 15 Schlussbestimmungen</h2>
      <p>
        (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Bei Verbrauchern
        gilt diese Rechtswahl nur, soweit dadurch der durch zwingende Bestimmungen des Rechts des Staates seines
        gewöhnlichen Aufenthalts gewährte Schutz nicht entzogen wird.
      </p>
      <p>
        (2) Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches
        Sondervermögen, ist ausschließlicher Gerichtsstand der Sitz des Anbieters.
      </p>
      <p>
        (3) Änderungen und Ergänzungen des Vertrags bedürfen der Textform. Sollten einzelne Bestimmungen dieser AGB
        unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
      </p>
    </LegalShell>
  )
}
