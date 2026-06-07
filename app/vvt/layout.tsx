import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verarbeitungsverzeichnis | Compliflow — Art. 30 DSGVO",
  description:
    "Verarbeitungsverzeichnis nach Art. 30 DSGVO einfach erstellen: Branchen-Vorlagen für KMU, Rechtsgrundlagen-Auswahl, PDF-Export. Kostenlos und ohne Account.",
  alternates: {
    canonical: "https://compliflow.de/vvt",
  },
  openGraph: {
    title: "Verarbeitungsverzeichnis Generator | Compliflow",
    description:
      "Art. 30 DSGVO VVT in Minuten erstellen. Branchen-Vorlagen, Rechtsgrundlagen, PDF-Export.",
    url: "https://compliflow.de/vvt",
  },
};

export default function VvtLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
