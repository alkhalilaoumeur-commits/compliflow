import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preise — AVV & VVT Generator",
  description:
    "Kostenlos starten oder 29 € einmalig für ein professionelles PDF ohne Branding. Keine Subscription, kein Account. Sofort-Download nach Zahlung.",
  alternates: { canonical: "/preise" },
  openGraph: {
    title: "Compliflow Preise — DSGVO-Dokumente ab 0 €",
    description:
      "AVV und Verarbeitungsverzeichnis kostenlos erstellen. Pro-PDF ohne Branding für 29 € einmalig. Einmalige Zahlung, kein Abo, sofortiger Download.",
    url: "https://compliflow.de/preise",
  },
};

export default function PreiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
