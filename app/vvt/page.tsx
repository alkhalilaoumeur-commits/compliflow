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

export default function VvtPage() {
  return <VvtWizardShell />;
}
