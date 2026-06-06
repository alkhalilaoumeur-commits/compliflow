import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal/legal-layout";

export const metadata: Metadata = {
  title: "AGB — Compliflow",
  description: "Allgemeine Geschäftsbedingungen für die Nutzung von Compliflow.",
  alternates: { canonical: "/agb" },
  robots: { index: true, follow: true },
};

export default function AgbPage() {
  return (
    <LegalLayout title="Allgemeine Geschäftsbedingungen" lastUpdated="6. Juni 2026">
      <LegalSection title="Geltungsbereich" number="§ 1">
        <p>
          (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für alle
          Verträge zwischen Al-Khalil Aoumeur, Egilolfstraße 41, 70599 Stuttgart
          (nachfolgend „Anbieter" oder „wir") und den Nutzern der Compliflow-Suite
          (nachfolgend „Nutzer" oder „du") über die kostenpflichtigen Leistungen.
        </p>
        <p>
          (2) Abweichende, entgegenstehende oder ergänzende AGB des Nutzers werden nicht
          Vertragsbestandteil, es sei denn, ihrer Geltung wird ausdrücklich schriftlich
          zugestimmt.
        </p>
      </LegalSection>

      <LegalSection title="Leistungen" number="§ 2">
        <p>
          (1) Wir stellen webbasierte Tools zur Verfügung, mit denen Nutzer
          DSGVO-Pflichtdokumente (insbesondere AVV-Verträge, Verarbeitungsverzeichnisse
          und Cookie-Banner) erstellen können.
        </p>
        <p>
          (2) Die Tools werden in einer kostenlosen Free-Version und in
          kostenpflichtigen Pro-Versionen angeboten. Der jeweilige Funktionsumfang ergibt
          sich aus der aktuellen Produktbeschreibung auf compliflow.de.
        </p>
        <p>
          (3) Die durch unsere Tools erstellten Dokumente basieren auf gängigen
          Mustertexten (Bitkom, GDD, DSK) und stellen keine individuelle Rechtsberatung
          dar. Wir empfehlen, die Dokumente vor Verwendung durch einen Rechtsanwalt oder
          Datenschutzbeauftragten prüfen zu lassen.
        </p>
      </LegalSection>

      <LegalSection title="Vertragsschluss" number="§ 3">
        <p>
          (1) Die Darstellung der Produkte auf der Webseite stellt kein bindendes Angebot
          dar, sondern eine Aufforderung zur Abgabe eines Angebots.
        </p>
        <p>
          (2) Durch Klick auf den Bestell-Button gibst du ein verbindliches Angebot ab.
          Der Vertrag kommt zustande, sobald wir die Zahlung bestätigen.
        </p>
      </LegalSection>

      <LegalSection title="Preise und Zahlung" number="§ 4">
        <p>
          (1) Die jeweils aktuellen Preise sind auf der Webseite ausgewiesen. Als
          Kleinunternehmer gemäß § 19 UStG weisen wir keine Umsatzsteuer aus.
        </p>
        <p>
          (2) Die Zahlung erfolgt über den Zahlungsdienstleister Stripe per
          Kreditkarte, SEPA oder anderen verfügbaren Methoden. Die Zahlung ist sofort
          mit Vertragsschluss fällig.
        </p>
        <p>
          (3) Die Bereitstellung der Pro-Funktionen erfolgt unverzüglich nach erfolgreicher
          Zahlung.
        </p>
      </LegalSection>

      <LegalSection title="Widerrufsrecht für Verbraucher" number="§ 5">
        <p>
          (1) Verbrauchern steht das gesetzliche Widerrufsrecht zu. Die Einzelheiten
          ergeben sich aus der{" "}
          <a href="/widerruf" className="text-accent hover:text-ink">
            Widerrufsbelehrung
          </a>
          .
        </p>
        <p>
          (2) <strong className="text-ink">Wichtig:</strong> Bei digitalen Inhalten
          (z.B. PDF-Downloads von AVV-Verträgen) erlischt das Widerrufsrecht gemäß § 356
          Abs. 5 BGB mit dem Beginn der Ausführung, wenn du ausdrücklich zugestimmt hast
          und bestätigst, dass du dein Widerrufsrecht verlierst.
        </p>
      </LegalSection>

      <LegalSection title="Nutzungsrechte" number="§ 6">
        <p>
          (1) Mit der Erstellung eines Dokuments durch unsere Tools erhältst du ein
          zeitlich und örtlich unbeschränktes, nicht ausschließliches Recht zur Nutzung
          dieses Dokuments für die eigenen geschäftlichen Zwecke.
        </p>
        <p>
          (2) Eine Weitergabe der durch das Tool erstellten Dokumente an Dritte ist
          erlaubt, soweit dies im normalen Geschäftsverkehr (z.B. Übergabe an
          Vertragspartner) erfolgt.
        </p>
        <p>
          (3) Eine kommerzielle Weiterverbreitung der Tools selbst oder ihrer
          Quellbausteine ist nicht gestattet.
        </p>
      </LegalSection>

      <LegalSection title="Haftung" number="§ 7">
        <p>
          (1) Wir haften unbeschränkt für Schäden aus der Verletzung des Lebens, des
          Körpers oder der Gesundheit, die auf einer vorsätzlichen oder fahrlässigen
          Pflichtverletzung beruhen, sowie für sonstige Schäden, die auf einer
          vorsätzlichen oder grob fahrlässigen Pflichtverletzung beruhen.
        </p>
        <p>
          (2) Bei leichter Fahrlässigkeit haften wir nur für die Verletzung wesentlicher
          Vertragspflichten (Kardinalpflichten), wobei die Haftung der Höhe nach auf den
          bei Vertragsschluss vorhersehbaren, vertragstypischen Schaden begrenzt ist.
        </p>
        <p>
          (3) <strong className="text-ink">Keine Haftung übernehmen wir</strong> für die
          inhaltliche Richtigkeit, Vollständigkeit oder Aktualität der durch das Tool
          erstellten Dokumente im Einzelfall. Die Dokumente ersetzen keine individuelle
          Rechtsberatung.
        </p>
        <p>
          (4) Die Verwendung der generierten Dokumente erfolgt auf eigene Verantwortung
          des Nutzers.
        </p>
      </LegalSection>

      <LegalSection title="Datenschutz" number="§ 8">
        <p>
          Es gilt unsere{" "}
          <a href="/datenschutz" className="text-accent hover:text-ink">
            Datenschutzerklärung
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Schlussbestimmungen" number="§ 9">
        <p>
          (1) Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gegenüber
          Verbrauchern gilt diese Rechtswahl nur insoweit, als nicht der gewährte Schutz
          durch zwingende Bestimmungen des Rechts des Staates, in dem der Verbraucher
          seinen gewöhnlichen Aufenthalt hat, entzogen wird.
        </p>
        <p>
          (2) Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam sein
          oder werden, so wird die Wirksamkeit der übrigen Bestimmungen davon nicht
          berührt.
        </p>
        <p>
          (3) Gerichtsstand für alle Streitigkeiten aus diesem Vertragsverhältnis ist
          Stuttgart, soweit der Nutzer Kaufmann, juristische Person des öffentlichen
          Rechts oder öffentlich-rechtliches Sondervermögen ist.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
