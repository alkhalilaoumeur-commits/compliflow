import { WizardShell } from "@/components/widerruf/wizard-shell";

export const dynamic = "force-dynamic";

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Rechtssichere Widerrufsbelehrung nach Anhang § 312f BGB erstellen",
  description:
    "Widerrufsbelehrung für deine Webseite oder deinen Online-Shop in wenigen Minuten erstellen — kostenlos, kein Account, alle Pflichtangaben nach §§ 312g, 355–357 BGB inkl. Muster-Widerrufsformular.",
  totalTime: "PT5M",
  tool: [{ "@type": "HowToTool", name: "Compliflow Widerrufsbelehrungs-Generator" }],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Anbieter angeben",
      text: "Name, Adresse, E-Mail und ggf. Telefon/Fax eintragen. Festlegen, ob der Verkauf an Verbraucher (B2C) erfolgt — bei reinem B2B besteht KEIN gesetzliches Widerrufsrecht.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Leistungstyp wählen",
      text: "Ware, Dienstleistung oder digitaler Inhalt? Der Leistungstyp bestimmt, wann die Widerrufsfrist beginnt. Standardfrist 14 Tage — Verlängerung möglich, Verkürzung nicht.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Ausschlüsse prüfen",
      text: "Wähle aus § 312g Abs. 2 BGB die Gründe aus, die für deine Leistung tatsächlich zutreffen (z.B. maßgefertigt, schnell verderblich, versiegelt). Nur was du nachweisen kannst.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Rückgabe konfigurieren",
      text: "Wohin soll der Kunde zurückschicken (abweichende Adresse möglich), wer trägt die Kosten und handelt es sich um Sperrgut (Möbel, große Geräte)?",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "HTML kopieren oder PDF exportieren",
      text: "HTML-Code in die eigene Webseite einfügen — Muster-Widerrufsformular ist automatisch angehängt.",
    },
  ],
};

export default function WiderrufsbelehrungGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <WizardShell />
    </>
  );
}
