import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AVV-Generator — DSGVO-konform in 2 Minuten",
  description:
    "Erstelle einen rechtssicheren Auftragsverarbeitungs-Vertrag nach Art. 28 DSGVO. Mit Live-Vorschau, PDF-Export, Schrems-II-Logik. Kostenlos starten, keine Anmeldung.",
  alternates: { canonical: "/avv" },
};

export default function AvvLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
