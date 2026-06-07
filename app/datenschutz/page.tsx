import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal/legal-layout";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — Compliflow",
  description:
    "Wie wir mit deinen personenbezogenen Daten umgehen: DSGVO-konform, EU-Hosting, transparent.",
  alternates: { canonical: "/datenschutz" },
  robots: { index: true, follow: true },
};

export default function DatenschutzPage() {
  return (
    <LegalLayout title="Datenschutzerklärung" lastUpdated="6. Juni 2026">
      <p className="text-ink">
        Wir bauen ein DSGVO-Tool — also achten wir besonders darauf, unsere eigene Seite
        datenschutzkonform zu gestalten. Diese Erklärung beschreibt vollständig, welche
        Daten wir wann verarbeiten und welche Rechte du hast.
      </p>

      <LegalSection title="Verantwortlicher" number="§ 1">
        <p>
          Verantwortlicher im Sinne der DSGVO ist:
          <br />
          <strong className="text-ink">Al-Khalil Aoumeur</strong>
          <br />
          Egilolfstraße 41
          <br />
          70599 Stuttgart
          <br />
          E-Mail:{" "}
          <a href="mailto:hello@compliflow.de" className="text-accent hover:text-ink">
            hello@compliflow.de
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Allgemeine Hinweise zur Datenverarbeitung" number="§ 2">
        <p>
          Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit
          dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und
          Leistungen erforderlich ist. Die Verarbeitung erfolgt auf Grundlage des Art. 6
          DSGVO sowie weiterer einschlägiger Rechtsvorschriften.
        </p>
      </LegalSection>

      <LegalSection title="Aufruf der Webseite (Server-Logs)" number="§ 3">
        <p>
          Beim Aufruf unserer Webseite werden durch unseren Hosting-Anbieter folgende
          Daten in sogenannten Server-Logs verarbeitet:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>IP-Adresse (anonymisiert nach 7 Tagen)</li>
          <li>Datum und Uhrzeit der Anfrage</li>
          <li>Zeitzonendifferenz zur GMT</li>
          <li>Inhalt der Anforderung (konkrete Seite)</li>
          <li>HTTP-Statuscode</li>
          <li>Verwendeter Browser, Betriebssystem</li>
          <li>Referrer-URL</li>
        </ul>
        <p>
          <strong className="text-ink">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
          (berechtigtes Interesse an einer technisch fehlerfreien Darstellung und IT-Sicherheit).
        </p>
        <p>
          <strong className="text-ink">Speicherdauer:</strong> 7 Tage, danach automatische
          Löschung.
        </p>
      </LegalSection>

      <LegalSection title="Eingesetzte Auftragsverarbeiter" number="§ 4">
        <p>
          Wir nutzen die folgenden Dienste, mit denen wir Verträge zur Auftragsverarbeitung
          gemäß Art. 28 DSGVO abgeschlossen haben:
        </p>

        <DienstCard
          name="Hetzner Online GmbH"
          land="Deutschland (EU)"
          zweck="Hosting der Website und Anwendung (VPS-Server)"
          garantie="EU-DE · AVV abgeschlossen"
          link="https://www.hetzner.com/de/legal/privacy-policy"
        />
        <DienstCard
          name="Stripe Payments Europe Ltd."
          land="Irland (EU)"
          zweck="Zahlungsabwicklung für kostenpflichtige Leistungen (Pro-Download)"
          garantie="EU-EWR · AVV abgeschlossen"
          link="https://stripe.com/privacy"
        />
        <DienstCard
          name="Resend Inc."
          land="USA"
          zweck="Versand von Transaktions-E-Mails"
          garantie="Standardvertragsklauseln (SCCs)"
          link="https://resend.com/legal/privacy-policy"
        />
        <DienstCard
          name="Plausible Insights OÜ"
          land="Estland (EU)"
          zweck="Cookie-lose Web-Analytics (DSGVO-konform, kein Tracking)"
          garantie="EU-EWR · keine personenbezogenen Daten gespeichert"
          link="https://plausible.io/privacy"
        />
      </LegalSection>

      <LegalSection title="Wartelisten- und Kontakt-Formular" number="§ 5">
        <p>
          Wenn du dich für unsere Warteliste einträgst oder per Kontaktformular mit uns in
          Verbindung trittst, verarbeiten wir deine E-Mail-Adresse zum Zweck der
          Kontaktaufnahme bzw. Information über den Launch.
        </p>
        <p>
          <strong className="text-ink">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
          (Vertragsanbahnung) bzw. lit. a DSGVO (Einwilligung).
        </p>
        <p>
          <strong className="text-ink">Speicherdauer:</strong> Bis zum Widerruf der
          Einwilligung. Du kannst dich jederzeit über den Abmeldelink in jeder E-Mail oder
          per Mail an hello@compliflow.de abmelden.
        </p>
      </LegalSection>

      <LegalSection title="Von den Generatoren verarbeitete Daten" number="§ 6">
        <p>
          Wenn du den <strong className="text-ink">AVV-Generator</strong> oder den{" "}
          <strong className="text-ink">VVT-Generator</strong> nutzt, werden die von dir
          eingegebenen Daten (Firmen- und Adressdaten, Vertretungsberechtigte, TOMs,
          Verarbeitungstätigkeiten etc.){" "}
          <strong className="text-ink">ausschließlich lokal in deinem Browser</strong>{" "}
          gespeichert (localStorage). Wir übertragen diese Daten zu keinem Zeitpunkt an
          unsere Server.
        </p>
        <p>
          Die generierten PDF-Dateien werden lokal in deinem Browser erstellt und
          direkt heruntergeladen. Wir haben keinen Zugriff darauf.
        </p>
        <p>
          <strong className="text-ink">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
          (Vertragserfüllung). Mangels Serverübertragung findet keine Auftragsverarbeitung
          durch uns statt.
        </p>
      </LegalSection>

      <LegalSection title="Cookies" number="§ 7">
        <p>
          Wir setzen keine Tracking-Cookies. Plausible Analytics ist cookieless. Lediglich
          technisch notwendige localStorage-Einträge werden zur Speicherung des
          Wizard-Fortschritts verwendet — diese verlassen deinen Browser nicht.
        </p>
      </LegalSection>

      <LegalSection title="Deine Rechte als betroffene Person" number="§ 8">
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <strong className="text-ink">Auskunftsrecht (Art. 15 DSGVO):</strong> Du kannst
            jederzeit Auskunft über die zu deiner Person gespeicherten Daten verlangen.
          </li>
          <li>
            <strong className="text-ink">Berichtigungsrecht (Art. 16 DSGVO):</strong>{" "}
            Unrichtige Daten korrigieren wir auf Verlangen.
          </li>
          <li>
            <strong className="text-ink">Löschungsrecht (Art. 17 DSGVO):</strong> Du kannst
            die Löschung deiner Daten verlangen, soweit keine Aufbewahrungspflichten
            entgegenstehen.
          </li>
          <li>
            <strong className="text-ink">Einschränkungsrecht (Art. 18 DSGVO):</strong> In
            bestimmten Fällen kannst du eine Einschränkung der Verarbeitung verlangen.
          </li>
          <li>
            <strong className="text-ink">Datenübertragbarkeit (Art. 20 DSGVO):</strong> Du
            kannst deine Daten in einem strukturierten, gängigen Format erhalten.
          </li>
          <li>
            <strong className="text-ink">Widerspruchsrecht (Art. 21 DSGVO):</strong> Gegen
            die Verarbeitung auf Grundlage berechtigter Interessen kannst du jederzeit
            widersprechen.
          </li>
          <li>
            <strong className="text-ink">Beschwerderecht (Art. 77 DSGVO):</strong> Du kannst
            dich bei einer Aufsichtsbehörde beschweren, in Baden-Württemberg beim{" "}
            <a
              href="https://www.baden-wuerttemberg.datenschutz.de/"
              className="text-accent hover:text-ink"
              target="_blank"
              rel="noopener noreferrer"
            >
              Landesbeauftragten für den Datenschutz Baden-Württemberg
            </a>
            .
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Datenschutzbeauftragter" number="§ 9">
        <p>
          Aufgrund unserer Unternehmensgröße sind wir nicht zur Bestellung eines
          Datenschutzbeauftragten verpflichtet. Anfragen rund um den Datenschutz
          richtest du bitte direkt an{" "}
          <a href="mailto:hello@compliflow.de" className="text-accent hover:text-ink">
            hello@compliflow.de
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Aktualität und Änderung dieser Erklärung" number="§ 10">
        <p>
          Diese Datenschutzerklärung ist aktuell gültig und hat den Stand vom 6. Juni
          2026. Durch Weiterentwicklung unserer Website können Änderungen erforderlich
          werden. Die jeweils aktuelle Fassung kann jederzeit unter{" "}
          <a href="/datenschutz" className="text-accent hover:text-ink">
            compliflow.de/datenschutz
          </a>{" "}
          abgerufen werden.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}

function DienstCard({
  name,
  land,
  zweck,
  garantie,
  link,
}: {
  name: string;
  land: string;
  zweck: string;
  garantie: string;
  link: string;
}) {
  return (
    <div className="border border-line bg-[rgba(240,236,226,0.4)] p-4 my-3">
      <p className="font-display font-bold text-ink">{name}</p>
      <div className="grid sm:grid-cols-3 gap-2 text-xs mt-2">
        <p>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faded block">
            Sitz
          </span>
          {land}
        </p>
        <p>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faded block">
            Zweck
          </span>
          {zweck}
        </p>
        <p>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faded block">
            Garantie
          </span>
          {garantie}
        </p>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[10px] uppercase tracking-widest text-accent hover:text-ink mt-2 inline-block"
      >
        → Datenschutzerklärung Anbieter
      </a>
    </div>
  );
}
