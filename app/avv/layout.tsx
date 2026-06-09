import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AVV-Generator — Auftragsverarbeitungsvertrag kostenlos erstellen",
  description:
    "Auftragsverarbeitungsvertrag nach Art. 28 DSGVO kostenlos erstellen: alle 13 Pflichtinhalte, Schrems-II-Klauseln, PDF-Export in 10 Minuten. Kein Account nötig.",
  alternates: { canonical: "https://compliflow.de/avv" },
  openGraph: {
    title: "AVV-Generator — Auftragsverarbeitungsvertrag Art. 28 DSGVO | Compliflow",
    description:
      "Auftragsverarbeitungsvertrag nach Art. 28 DSGVO kostenlos erstellen. Alle 13 Pflichtinhalte, Stripe-, Google- und Hetzner-Presets, Schrems-II-Logik. PDF-Download ohne Account.",
    url: "https://compliflow.de/avv",
    siteName: "Compliflow",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AVV-Generator — Auftragsverarbeitungsvertrag kostenlos erstellen",
    description:
      "Auftragsverarbeitungsvertrag nach Art. 28 DSGVO kostenlos erstellen: alle 13 Pflichtinhalte, Schrems-II-Klauseln, PDF-Export in 10 Minuten. Kein Account nötig.",
  },
};

export default function AvvLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
