import { WizardShell } from "@/components/cookie-banner/wizard-shell";

export const dynamic = "force-dynamic";

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "DSGVO-konformes Cookie-Banner nach § 25 TDDDG erstellen",
  description:
    "Cookie-Banner für Webseite kostenlos erstellen — BGH-2025-konform mit gleich prominentem Accept/Reject, automatischem Tool-Loader für GA4, Meta Pixel, Plausible & Co. HTML+JS-Snippet zum direkten Einbau.",
  totalTime: "PT6M",
  tool: [{ "@type": "HowToTool", name: "Compliflow Cookie-Banner-Generator" }],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Anbieter angeben",
      text: "Name, URL zur Datenschutzerklärung und optional Impressum eintragen. Sprache (Deutsch / English) wählen — die Banner-Texte werden automatisch gesetzt.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Kategorien definieren",
      text: "Essential, Funktional, Statistik und Marketing — pro Kategorie Name + Beschreibung pflegen. Essential ist nach § 25 Abs. 2 TDDDG Pflicht und immer aktiv.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Tracking-Tools hinzufügen",
      text: "GA4, GTM, Meta Pixel, Plausible, Hotjar, YouTube Embeds und weitere Tools mit Config-ID hinzufügen. Compliflow generiert den Loader — die Tools werden NUR nach Consent geladen.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Stil & Farben",
      text: "Layout (Sticky-Bar, Modal, Sidebar) wählen, Farbschema an Brand anpassen, Rundung und Schriftgröße einstellen.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Verhalten konfigurieren",
      text: "Consent-Laufzeit (DSK: max. 12 Monate), Auto-Öffnen, Detail-Einstellungen, Storage-Key. Reject-All-Prominenz ist BGH-2025-Pflicht und automatisch aktiv.",
    },
    {
      "@type": "HowToStep",
      position: 6,
      name: "Snippet kopieren",
      text: "Live-Vorschau prüfen, HTML+JS+CSS-Snippet kopieren und direkt vor </body> auf der Webseite einfügen. Bestehende Tracking-Skripte aus dem Webseiten-Code entfernen.",
    },
  ],
};

export default function CookieBannerGeneratorPage() {
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
