import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz-Generator kostenlos — Art. 13 DSGVO + TDDDG | Compliflow",
  description:
    "Rechtssichere Datenschutzerklärung nach Art. 13 DSGVO + § 25 TDDDG in 10 Minuten erstellen: Hosting, Analytics, Marketing, Newsletter, KI-Chatbot, HR. Auto-erkennt Drittland-Transfer + DSB-Pflicht + DSFA. HTML zum Einfügen + PDF-Download. Kostenlos, kein Account.",
  alternates: { canonical: "https://compliflow.de/datenschutz-generator" },
  keywords: [
    "Datenschutzerklärung Generator",
    "Datenschutz erstellen",
    "DSGVO Vorlage",
    "Art. 13 DSGVO",
    "Art. 14 DSGVO",
    "§ 25 TDDDG",
    "TTDSG",
    "Datenschutzerklärung Webseite",
    "DSGVO konform",
    "Datenschutz Generator kostenlos",
    "AI Act Datenschutz",
    "KI Chatbot Datenschutz",
    "DSB Pflicht prüfen",
    "Joint Controller Meta",
    "Drittlandtransfer",
  ],
  openGraph: {
    title: "Datenschutz-Generator kostenlos — DSGVO + TDDDG",
    description:
      "Datenschutzerklärung in 10 Minuten. Auto-erkennt Drittland, DSFA-Pflicht und Joint-Controller. HTML-Snippet zum Einfügen + PDF-Backup. Kostenlos, ohne Account.",
    url: "https://compliflow.de/datenschutz-generator",
    siteName: "Compliflow",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Datenschutz-Generator — DSGVO kostenlos",
    description:
      "Datenschutzerklärung für deine Webseite in 10 Minuten. Auto-DSFA-Check + Drittland-Erkennung. HTML + PDF. Kostenlos.",
  },
};

export default function DatenschutzLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
