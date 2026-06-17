import { WizardShell } from "@/components/agb/wizard-shell";

export const dynamic = "force-dynamic";

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Rechtssichere AGB nach §§ 305-310 BGB erstellen",
  description:
    "AGB für Webseite, Online-Shop oder B2B-Vertrieb in wenigen Minuten erstellen — kostenlos, kein Account, alle Standard-Klauseln nach BGB-Recht inkl. Geltungsbereich, Vertragsschluss, Zahlung, Lieferung, Gewährleistung, Haftung.",
  totalTime: "PT8M",
  tool: [{ "@type": "HowToTool", name: "Compliflow AGB-Generator" }],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Variante wählen",
      text: "B2C Dienstleistung, B2C Shop oder reines B2B? Die Wahl bestimmt, welche Klauseln (Geltungsbereich, Vertragsschluss, Gewährleistung, Haftung) in deine AGB einfließen — § 13 BGB für Verbraucher, § 14 BGB für Unternehmer.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Anbieter angeben",
      text: "Name, Adresse, E-Mail und optional Vertretungsberechtigter, Handelsregister und USt-ID eintragen.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Leistung beschreiben",
      text: "Welche Art von Leistung (Beratung, Coaching, Agentur, SaaS, physische Ware …) und wie kommt der Vertrag zustande (Angebot/Annahme, Sofort-Buchung, Auftragsbestätigung).",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Zahlungsbedingungen",
      text: "Akzeptierte Zahlungsarten, Zahlungsziel in Tagen, Verzugszinsen-Klausel und bei B2B optional Skonto-Bedingungen.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Lieferung & Stornierung",
      text: "Bei B2C-Shop: Versandgebiet, Lieferzeit, Versandkosten, Eigentumsvorbehalt und Gefahrübergang. Bei Dienstleistungen: Stornierungs- und Kündigungsfristen.",
    },
    {
      "@type": "HowToStep",
      position: 6,
      name: "Haftung & Gewährleistung",
      text: "Gewährleistungsfrist (B2C 24, B2B 12 Monate), Haftungsbeschränkungen, Datenverlust-Klausel und bei B2B Gerichtsstand + Erfüllungsort.",
    },
    {
      "@type": "HowToStep",
      position: 7,
      name: "HTML kopieren oder PDF exportieren",
      text: "HTML-Code in die eigene Webseite einfügen — fertig.",
    },
  ],
};

export default function AgbGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <WizardShell />
    </>
  );
}
