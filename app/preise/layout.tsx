import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preise — AVV & VVT Generator kostenlos oder 29 € Pro | Compliflow",
  description:
    "Compliflow kostenlos starten: AVV und VVT ohne Branding kostenlos. Pro-Version für 29 € einmalig — PDF ohne Compliflow-Footer. Kein Abo, kein Account.",
  alternates: { canonical: "https://compliflow.de/preise" },
  openGraph: {
    title: "Compliflow Preise — DSGVO-Dokumente ab 0 €",
    description:
      "AVV und Verarbeitungsverzeichnis kostenlos erstellen. Pro-PDF ohne Branding für 29 € einmalig. Einmalige Zahlung, kein Abo, sofortiger Download.",
    url: "https://compliflow.de/preise",
    siteName: "Compliflow",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compliflow Preise — AVV & VVT Generator kostenlos oder 29 €",
    description:
      "Compliflow kostenlos starten: AVV und VVT ohne Branding kostenlos. Pro-Version für 29 € einmalig — PDF ohne Compliflow-Footer. Kein Abo, kein Account.",
  },
};

export default function PreiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
