import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preise — alle Generatoren kostenlos",
  description:
    "Alle 7 Compliflow-Generatoren sind kostenlos. Kein Abo, kein Pro-Modell. Optional: 0,99 € einmalig, um den Compliflow-Hinweis im Dokument zu entfernen.",
  alternates: { canonical: "https://compliflow.de/preise" },
  openGraph: {
    title: "Compliflow Preise — alle Generatoren kostenlos",
    description:
      "AVV, VVT, Impressum, Datenschutz, AGB, Widerrufsbelehrung und Cookie-Banner — kostenlos, ohne Account, ohne Abo. Finanziert über DRVN-Webseiten-Aufträge.",
    url: "https://compliflow.de/preise",
    siteName: "Compliflow",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compliflow Preise — komplett kostenlos",
    description:
      "Alle DSGVO-Generatoren von Compliflow sind kostenlos. Kein Abo, kein Pro-Modell.",
  },
};

export default function PreiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
