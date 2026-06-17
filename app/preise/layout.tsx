import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preise — Compliflow ist komplett kostenlos | DSGVO-Generatoren",
  description:
    "Alle Compliflow-Generatoren sind kostenlos. Kein Abo, kein Pro-Modell, keine versteckten Kosten. So finanzieren wir uns.",
  alternates: { canonical: "https://compliflow.de/preise" },
  openGraph: {
    title: "Compliflow Preise — 0 € für alles, für immer",
    description:
      "AVV, VVT und bald Cookie-Banner — kostenlos, ohne Account, ohne Abo. Finanziert über DRVN-Webseiten-Aufträge und kleine Affiliate-Provisionen.",
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
