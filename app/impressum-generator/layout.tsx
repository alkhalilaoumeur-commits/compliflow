import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum-Generator kostenlos — § 5 DDG Pflichtangaben | Compliflow",
  description:
    "Rechtssicheres Impressum nach § 5 DDG (ehem. § 5 TMG) in 5 Minuten erstellen: Pflichtangaben für Einzelunternehmer, GmbH, GbR, e.V. und Freiberufler. HTML zum Einfügen + PDF-Download. Kostenlos, kein Account.",
  alternates: { canonical: "https://compliflow.de/impressum-generator" },
  keywords: [
    "Impressum Generator",
    "Impressum erstellen",
    "§ 5 DDG",
    "§ 5 TMG",
    "Digitale-Dienste-Gesetz",
    "Pflichtangaben Webseite",
    "Impressum Vorlage",
    "Impressumspflicht 2026",
    "§ 18 MStV",
    "Impressum GmbH",
    "Impressum Freiberufler",
    "Impressum Verein",
    "Wirtschafts-ID Impressum",
  ],
  openGraph: {
    title: "Impressum-Generator kostenlos — DSGVO + § 5 DDG",
    description:
      "Rechtssicheres Impressum in 5 Minuten. Alle Pflichtangaben nach § 5 DDG + § 18 MStV. HTML-Snippet zum Einfügen + PDF-Backup. Kostenlos, ohne Account.",
    url: "https://compliflow.de/impressum-generator",
    siteName: "Compliflow",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Impressum-Generator — § 5 DDG kostenlos",
    description:
      "Impressum für deine Webseite in 5 Minuten. HTML zum Einfügen + PDF. Kostenlos, kein Account.",
  },
};

export default function ImpressumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
