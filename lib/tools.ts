export type Tool = {
  id: string;
  idx: string;
  name: string;
  tag: string;
  pitch: string;
  bullets: string[];
  launchLabel: string;
  span: string;
  offset: number;
  status: "live" | "soon";
  href?: string;
};

export const tools: Tool[] = [
  {
    id: "avv",
    idx: "01 / 07",
    name: "AVV-Generator",
    tag: "Auftragsverarbeitung · Art. 28 DSGVO",
    pitch:
      "Mehrstufiger Wizard für Auftragsverarbeitungs-Verträge. Live-Vorschau, PDF-Export, Schrems-II-Klauseln automatisch.",
    bullets: [
      "Quick-Add für Stripe, Google, Hetzner, Plausible & mehr",
      "Schrems-II-Klauseln automatisch bei Drittland-Transfers",
      "Live-PDF-Vorschau, kein Upload, kein Account",
    ],
    launchLabel: "Live · kostenlos starten",
    span: "lg:col-span-3",
    offset: 0,
    status: "live",
    href: "/avv",
  },
  {
    id: "vvt",
    idx: "02 / 07",
    name: "Verarbeitungsverzeichnis",
    tag: "Pflichtregister · Art. 30 DSGVO",
    pitch:
      "Strukturierte Aufnahme aller Verarbeitungstätigkeiten — mit 10 Branchen-Vorlagen, Rechtsgrundlagen-Auswahl und PDF-Export.",
    bullets: [
      "10 Standard-Vorlagen für DACH-KMU",
      "Rechtsgrundlagen Art. 6 / 9 DSGVO",
      "Vollständige PDF nach Art. 30 Abs. 1",
    ],
    launchLabel: "Live · kostenlos starten",
    span: "lg:col-span-3",
    offset: 0,
    status: "live",
    href: "/vvt",
  },
  {
    id: "impressum",
    idx: "03 / 07",
    name: "Impressum-Generator",
    tag: "Pflichtangaben · § 5 DDG",
    pitch:
      "Rechtssicheres Impressum nach § 5 DDG (ehem. § 5 TMG) in 5 Minuten. HTML-Snippet zum Einfügen + PDF-Backup. Für alle Rechtsformen.",
    bullets: [
      "Alle Pflichtangaben nach § 5 DDG + § 18 MStV",
      "Vorlagen für Ärzte, Anwälte, Handwerker, Architekten",
      "HTML zum Kopieren + PDF-Export",
    ],
    launchLabel: "Live · kostenlos starten",
    span: "lg:col-span-3",
    offset: 0,
    status: "live",
    href: "/impressum-generator",
  },
  {
    id: "datenschutz",
    idx: "04 / 07",
    name: "Datenschutz-Generator",
    tag: "Datenschutzerklärung · Art. 13/14 DSGVO",
    pitch:
      "Vollständige Datenschutzerklärung mit 40+ Sonderfällen: Hosting, Analytics, Newsletter, Marketing-Pixel, KI-Chatbot mit AI-Act-Hinweis, Bonität SCHUFA 2026, Branchen-Klauseln.",
    bullets: [
      "12 Wizard-Steps mit Auto-Drittland-Erkennung",
      "AI Act Art. 50 + SCHUFA 100-999 (Reform 17.03.2026)",
      "Aufsichtsbehörde aus PLZ automatisch eingetragen",
    ],
    launchLabel: "Live · kostenlos starten",
    span: "lg:col-span-3",
    offset: 0,
    status: "live",
    href: "/datenschutz-generator",
  },
  {
    id: "widerruf",
    idx: "05 / 07",
    name: "Widerrufsbelehrung",
    tag: "§ 312g, § 355 BGB · Anhang § 312f",
    pitch:
      "Rechtssichere Widerrufsbelehrung mit Muster-Widerrufsformular nach Anhang § 312f BGB. 7 Leistungstypen, 12 Ausschlussgründe, B2B-Variante.",
    bullets: [
      "Ware, Dienstleistung, digitaler Inhalt, Streaming",
      "12 Ausschlussgründe nach § 312g Abs. 2",
      "Muster-Widerrufsformular automatisch angehängt",
    ],
    launchLabel: "Live · kostenlos starten",
    span: "lg:col-span-3",
    offset: 0,
    status: "live",
    href: "/widerrufsbelehrung-generator",
  },
  {
    id: "agb",
    idx: "06 / 07",
    name: "AGB-Generator",
    tag: "§§ 305-310 BGB · 3 Varianten",
    pitch:
      "Allgemeine Geschäftsbedingungen in 3 Varianten: B2C Dienstleistung, B2C Shop, B2B. Mit Variant-Auswahl und allen Pflichtklauseln.",
    bullets: [
      "3 Varianten: Dienstleistung, Shop, B2B",
      "Skonto, Eigentumsvorbehalt, § 377 HGB-Rüge",
      "OS-Plattform-Link bei B2C, Gerichtsstand bei B2B",
    ],
    launchLabel: "Live · kostenlos starten",
    span: "lg:col-span-3",
    offset: 0,
    status: "live",
    href: "/agb-generator",
  },
  {
    id: "cookie-banner",
    idx: "07 / 07",
    name: "Cookie-Banner",
    tag: "Consent Management · § 25 TDDDG",
    pitch:
      "Modernes Consent-Tool mit Audit-Trail, 4 Banner-Stilen und 18 Tracking-Tools. BGH-2025-konform mit gleich prominentem Accept/Reject.",
    bullets: [
      "Accept und Reject gleich prominent (BGH 2025)",
      "Tracking erst nach echtem Consent — GA4, Meta, Plausible & mehr",
      "12-Monats-Re-Consent automatisch (DSK)",
    ],
    launchLabel: "Live · kostenlos starten",
    span: "lg:col-span-3",
    offset: 0,
    status: "live",
    href: "/cookie-banner-generator",
  },
];
