import type { Metadata } from "next";
import { WizardShell } from "@/components/avv/wizard-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AVV-Generator kostenlos — Auftragsverarbeitungsvertrag Art. 28 DSGVO",
  description:
    "Auftragsverarbeitungsvertrag nach Art. 28 DSGVO in 10 Minuten erstellen: alle 13 Pflichtinhalte, PDF-Export, kein Account, keine Daten-Upload. Kostenlos für Selbstständige und KMU.",
  alternates: { canonical: "https://compliflow.de/avv" },
  openGraph: {
    title: "AVV-Generator kostenlos — DSGVO Art. 28",
    description: "Auftragsverarbeitungsvertrag in 10 Minuten. Alle 13 Pflichtinhalte, PDF-Download, kein Account.",
    url: "https://compliflow.de/avv",
  },
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "AVV nach Art. 28 DSGVO erstellen",
  description: "Auftragsverarbeitungsvertrag in 10 Minuten erstellen — kostenlos, kein Account, alle 13 Pflichtinhalte.",
  totalTime: "PT10M",
  tool: [{ "@type": "HowToTool", name: "Compliflow AVV-Generator" }],
  step: [
    { "@type": "HowToStep", position: 1, name: "Parteien eintragen", text: "Auftraggeber (du) und Auftragsverarbeiter (z. B. Stripe, Vercel) mit Namen, Adresse und Kontaktdaten eintragen." },
    { "@type": "HowToStep", position: 2, name: "Verarbeitung definieren", text: "Gegenstand, Zweck und Dauer der Datenverarbeitung beschreiben. Welche Daten werden wie verarbeitet?" },
    { "@type": "HowToStep", position: 3, name: "Datenkategorien wählen", text: "Welche Art von Daten werden verarbeitet? (z. B. E-Mail-Adressen, Bankdaten, Gesundheitsdaten)" },
    { "@type": "HowToStep", position: 4, name: "Personenkategorien angeben", text: "Wessen Daten werden verarbeitet? (z. B. Kunden, Mitarbeiter, Interessenten)" },
    { "@type": "HowToStep", position: 5, name: "TOMs festlegen", text: "Technische und organisatorische Maßnahmen nach Art. 32 DSGVO auswählen oder aus dem Standard-Set übernehmen." },
    { "@type": "HowToStep", position: 6, name: "Subauftragsverarbeiter angeben", text: "Verwendet der Verarbeiter weitere Dienstleister? (z. B. Stripe → AWS)" },
    { "@type": "HowToStep", position: 7, name: "PDF herunterladen", text: "Den fertigen AVV als PDF downloaden, ausdrucken oder digital unterzeichnen." },
  ],
};

export default function AvvPage() {
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
