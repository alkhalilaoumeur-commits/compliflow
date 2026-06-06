import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal/legal-layout";

export const metadata: Metadata = {
  title: "Impressum — Compliflow",
  description: "Anbieterkennzeichnung gemäß § 5 TMG für compliflow.de.",
  alternates: { canonical: "/impressum" },
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <LegalLayout title="Impressum" lastUpdated="6. Juni 2026">
      <LegalSection title="Anbieter (§ 5 TMG)">
        <p>
          <strong className="text-ink">Al-Khalil Aoumeur</strong>
          <br />
          Egilolfstraße 41
          <br />
          70599 Stuttgart
          <br />
          Deutschland
        </p>
        <p>
          Einzelunternehmen — Kleinunternehmer gemäß § 19 UStG (keine Ausweisung von
          Umsatzsteuer).
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          E-Mail:{" "}
          <a href="mailto:hello@compliflow.de" className="text-accent hover:text-ink">
            hello@compliflow.de
          </a>
        </p>
        <p className="text-sm">
          Telefonische Erreichbarkeit nur nach Terminvereinbarung per E-Mail.
        </p>
      </LegalSection>

      <LegalSection title="Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)">
        <p>
          Al-Khalil Aoumeur, Egilolfstraße 41, 70599 Stuttgart.
        </p>
      </LegalSection>

      <LegalSection title="EU-Streitschlichtung">
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung
          (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-ink"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          .
        </p>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </LegalSection>

      <LegalSection title="Haftungsausschluss">
        <p>
          <strong className="text-ink">Inhalt:</strong> Die Inhalte unserer Seiten wurden
          mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
          Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
        </p>
        <p>
          <strong className="text-ink">Vorlagen:</strong> Die durch Compliflow generierten
          Dokumente (AVV, VVT, Cookie-Banner) basieren auf gängigen Mustertexten (Bitkom,
          GDD, DSK) und stellen <strong className="text-ink">keine individuelle Rechtsberatung</strong>{" "}
          dar. Bei komplexen oder branchenspezifischen Konstellationen empfehlen wir eine
          Prüfung durch einen Rechtsanwalt oder Datenschutzbeauftragten.
        </p>
        <p>
          <strong className="text-ink">Externe Links:</strong> Unser Angebot enthält Links
          zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben.
          Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
        </p>
      </LegalSection>

      <LegalSection title="Urheberrecht">
        <p>
          Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
          unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
          Verbreitung und jede Art der Verwertung außerhalb der Grenzen des
          Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw.
          Erstellers.
        </p>
        <p>
          Die durch Compliflow generierten AVV-, VVT- und Cookie-Banner-Dokumente können
          vom jeweiligen Nutzer frei verwendet und weitergegeben werden.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
