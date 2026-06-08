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

export default function AvvPage() {
  return <WizardShell />;
}
