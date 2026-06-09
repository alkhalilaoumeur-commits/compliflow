import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verarbeitungsverzeichnis kostenlos erstellen — Art. 30 DSGVO | Compliflow",
  description:
    "Verarbeitungsverzeichnis nach Art. 30 DSGVO kostenlos erstellen: 10 Branchen-Vorlagen, Rechtsgrundlagen-Auswahl, PDF-Download. Kein Account, keine Anmeldung, alle Pflichtfelder.",
  alternates: {
    canonical: "https://compliflow.de/vvt",
  },
  openGraph: {
    title: "Verarbeitungsverzeichnis kostenlos erstellen — Art. 30 DSGVO | Compliflow",
    description:
      "Verarbeitungsverzeichnis nach Art. 30 DSGVO in 15 Minuten erstellen. 10 Branchen-Vorlagen für Freelancer, Agenturen und KMU. PDF-Download, kein Account.",
    url: "https://compliflow.de/vvt",
    siteName: "Compliflow",
    type: "website",
  },
};

export default function VvtLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
