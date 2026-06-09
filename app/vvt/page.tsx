import type { Metadata } from "next";
import { VvtWizardShell } from "@/components/vvt/wizard-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verarbeitungsverzeichnis kostenlos erstellen — DSGVO Art. 30",
  description:
    "Verarbeitungsverzeichnis nach Art. 30 DSGVO kostenlos und DSGVO-konform erstellen: alle 8 Pflichtangaben, 10 Branchen-Vorlagen, PDF-Export, kein Account nötig.",
  alternates: { canonical: "https://compliflow.de/vvt" },
  openGraph: {
    title: "Verarbeitungsverzeichnis kostenlos — DSGVO Art. 30",
    description: "VVT nach Art. 30 DSGVO in 10 Minuten. 8 Pflichtangaben, 10 Vorlagen, PDF-Download, kein Account.",
    url: "https://compliflow.de/vvt",
  },
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Verarbeitungsverzeichnis nach Art. 30 DSGVO erstellen",
  description: "VVT in 15 Minuten erstellen — kostenlos, kein Account, alle 8 Pflichtangaben, 10 Branchen-Vorlagen.",
  totalTime: "PT15M",
  tool: [{ "@type": "HowToTool", name: "Compliflow VVT-Generator" }],
  step: [
    { "@type": "HowToStep", position: 1, name: "Unternehmensangaben eintragen", text: "Name, Adresse und Kontaktdaten des Verantwortlichen (dein Unternehmen) sowie ggf. des Datenschutzbeauftragten eintragen." },
    { "@type": "HowToStep", position: 2, name: "Verarbeitungstätigkeiten erfassen", text: "Alle Prozesse erfassen, bei denen personenbezogene Daten verarbeitet werden. Für jede Tätigkeit: Bezeichnung, Zweck, Rechtsgrundlage, Datenkategorien und Empfänger angeben." },
    { "@type": "HowToStep", position: 3, name: "PDF herunterladen", text: "Das fertige Verarbeitungsverzeichnis als PDF downloaden und sicher aufbewahren." },
  ],
};

export default function VvtPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <VvtWizardShell />
    </>
  );
}
