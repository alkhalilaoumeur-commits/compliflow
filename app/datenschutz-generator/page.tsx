import { WizardShell } from "@/components/datenschutz/wizard-shell";

export const dynamic = "force-dynamic";

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Rechtssichere Datenschutzerklärung nach Art. 13 DSGVO erstellen",
  description:
    "Datenschutzerklärung für deine Webseite in 10 Minuten erstellen — kostenlos, kein Account, alle Pflichtangaben nach Art. 13/14 DSGVO + § 25 TDDDG.",
  totalTime: "PT10M",
  tool: [{ "@type": "HowToTool", name: "Compliflow Datenschutz-Generator" }],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Verantwortlicher angeben",
      text: "Name, Adresse, Email und ggf. Datenschutzbeauftragten eintragen. Branche und Mitarbeiterzahl wählen — wir erkennen automatisch DSB- und HinSchG-Pflicht.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Hosting-Provider wählen",
      text: "Wer betreibt die Server (Hetzner, IONOS, Vercel, AWS etc.). Bei US-Anbietern wird automatisch ein Drittland-Hinweis ergänzt.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Kommunikation konfigurieren",
      text: "Kontaktformular, Live-Chat, KI-Chatbot (mit AI-Act-Hinweis), Webinare und Push-Notifications.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Analytics + Marketing-Tools wählen",
      text: "Plausible, Matomo, GA4, Meta Pixel, Google Ads etc. Joint-Controller-Hinweis automatisch bei Meta.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Newsletter + E-Commerce",
      text: "Newsletter-Anbieter (Brevo, Mailchimp), Zahlung, Versand, Bonitätsprüfung (Schufa & Co.), Bewertungssystem.",
    },
    {
      "@type": "HowToStep",
      position: 6,
      name: "Social + Embedded + HR",
      text: "Social-Plugins (Facebook, Instagram), eingebettete Drittdienste (Google Maps, YouTube), Bewerbungsformular, HinSchG-Meldekanal.",
    },
    {
      "@type": "HowToStep",
      position: 7,
      name: "Spezial + Drittland prüfen",
      text: "Profiling, automatisierte Entscheidungen, Videoüberwachung. Drittländer werden automatisch aus den Modulen abgeleitet (USA, China etc.).",
    },
    {
      "@type": "HowToStep",
      position: 8,
      name: "HTML oder PDF exportieren",
      text: "HTML-Code in die eigene Webseite einfügen oder PDF herunterladen.",
    },
  ],
};

export default function DatenschutzGeneratorPage() {
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
