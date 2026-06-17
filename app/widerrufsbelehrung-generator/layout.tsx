import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung-Generator | Compliflow",
  description:
    "Rechtssichere Widerrufsbelehrung nach BGB Anhang § 312f kostenlos erstellen. HTML zum Einbinden + Muster-Widerrufsformular. Für Online-Shops, Dienstleister und digitale Inhalte.",
  alternates: { canonical: "https://compliflow.de/widerrufsbelehrung-generator" },
  keywords: [
    "Widerrufsbelehrung",
    "Widerrufsbelehrung Generator",
    "Widerrufsrecht",
    "Muster-Widerrufsformular",
    "§ 312g BGB",
    "§ 355 BGB",
    "§ 356 BGB",
    "§ 357 BGB",
    "Anhang § 312f BGB",
    "Fernabsatzvertrag",
    "Online-Shop Widerruf",
    "Widerrufsrecht Verbraucher",
    "Widerrufsfrist 14 Tage",
    "Widerrufsbelehrung kostenlos",
    "Widerrufsbelehrung Vorlage",
  ],
  openGraph: {
    title: "Widerrufsbelehrung-Generator kostenlos — § 312g BGB",
    description:
      "Widerrufsbelehrung für Online-Shop, Dienstleistung oder digitale Inhalte in wenigen Minuten. HTML zum Einfügen + Muster-Widerrufsformular. Kostenlos, ohne Account.",
    url: "https://compliflow.de/widerrufsbelehrung-generator",
    siteName: "Compliflow",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Widerrufsbelehrung-Generator — kostenlos",
    description:
      "Widerrufsbelehrung nach Anhang § 312f BGB in wenigen Minuten. HTML + Muster-Widerrufsformular. Kostenlos.",
  },
};

export default function WiderrufLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
