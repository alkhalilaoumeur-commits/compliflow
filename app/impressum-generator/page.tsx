import { WizardShell } from "@/components/impressum/wizard-shell";

export const dynamic = "force-dynamic";

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Rechtssicheres Impressum nach § 5 DDG erstellen",
  description:
    "Impressum für deine Webseite in 5 Minuten erstellen — kostenlos, kein Account, alle Pflichtangaben nach § 5 DDG (Digitale-Dienste-Gesetz, ehem. § 5 TMG).",
  totalTime: "PT5M",
  tool: [{ "@type": "HowToTool", name: "Compliflow Impressum-Generator" }],
  step: [
    { "@type": "HowToStep", position: 1, name: "Anbieter angeben", text: "Rechtsform wählen (Einzelunternehmer, GmbH, GbR, e.V. etc.) und Namen oder Firma eintragen." },
    { "@type": "HowToStep", position: 2, name: "Adresse + Kontakt", text: "Hausanschrift, E-Mail und Telefon oder Kontaktformular angeben. Keine Postfächer erlaubt." },
    { "@type": "HowToStep", position: 3, name: "Register + Steuer", text: "Handelsregister, USt-IdNr. und (ab Dez. 2026) Wirtschafts-ID-Nummer eintragen." },
    { "@type": "HowToStep", position: 4, name: "Vertretung + Beruf", text: "Geschäftsführer angeben, ggf. Kammer und Berufsbezeichnung für reglementierte Berufe." },
    { "@type": "HowToStep", position: 5, name: "Zusatzangaben", text: "Bei Blog/News: § 18 MStV Verantwortlicher. Bei B2C: Verbraucherschlichtung. Plus Standard-Haftungsklauseln." },
    { "@type": "HowToStep", position: 6, name: "HTML oder PDF exportieren", text: "HTML-Code in die eigene Webseite einfügen oder PDF herunterladen." },
  ],
};

export default function ImpressumGeneratorPage() {
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
