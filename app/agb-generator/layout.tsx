import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AGB-Generator | Compliflow",
  description:
    "AGB für Webseite oder Online-Shop kostenlos erstellen. 3 Varianten: B2C Dienstleistung, B2C Shop, B2B. HTML zum direkten Einbinden + PDF.",
  alternates: { canonical: "https://compliflow.de/agb-generator" },
  keywords: [
    "AGB",
    "Allgemeine Geschäftsbedingungen",
    "AGB-Generator",
    "AGB erstellen",
    "AGB kostenlos",
    "Online-Shop AGB",
    "B2C AGB",
    "B2B AGB",
    "Dienstleister AGB",
    "§ 305 BGB",
    "§ 306 BGB",
    "§ 307 BGB",
    "§ 308 BGB",
    "§ 309 BGB",
    "§ 312i BGB",
    "AGB Vorlage",
    "AGB Muster",
  ],
  openGraph: {
    title: "AGB-Generator kostenlos — §§ 305-310 BGB",
    description:
      "AGB für B2C-Dienstleistung, B2C-Shop oder B2B in wenigen Minuten erstellen. HTML zum Einfügen + PDF. Kostenlos, ohne Account.",
    url: "https://compliflow.de/agb-generator",
    siteName: "Compliflow",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AGB-Generator — kostenlos",
    description:
      "AGB nach §§ 305-310 BGB in wenigen Minuten. HTML + PDF. Kostenlos.",
  },
};

export default function AgbLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
