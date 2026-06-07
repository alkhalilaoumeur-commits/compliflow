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
    idx: "01 / 03",
    name: "AVV-Generator",
    tag: "Auftragsverarbeitung · Art. 28 DSGVO",
    pitch:
      "Mehrstufiger Wizard für Auftragsverarbeitungs-Verträge. Live-Vorschau, PDF-Export, Schrems-II-Klauseln automatisch, Custom-Branding in Pro.",
    bullets: [
      "Quick-Add für Stripe, Google, Hetzner, Plausible & mehr",
      "Schrems-II-Klauseln automatisch bei Drittland-Transfers",
      "Live-PDF-Vorschau, kein Upload, kein Account",
    ],
    launchLabel: "Live · kostenlos starten",
    span: "lg:col-span-4",
    offset: 0,
    status: "live",
    href: "/avv",
  },
  {
    id: "vvt",
    idx: "02 / 03",
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
    span: "lg:col-span-4",
    offset: 0,
    status: "live",
    href: "/vvt",
  },
  {
    id: "cookie-banner",
    idx: "03 / 03",
    name: "Cookie-Banner",
    tag: "Consent Management · TTDSG",
    pitch:
      "Modernes Consent-Tool mit Audit-Trail, Google Consent Mode V2 und fünf Banner-Stilen. Ein Embed-Snippet pro Domain.",
    bullets: [
      "Akzeptieren und Ablehnen gleich prominent",
      "Tracking erst nach echtem Consent",
      "Subscription-Modell für Agenturen",
    ],
    launchLabel: "19. August 2026",
    span: "lg:col-span-4",
    offset: 0,
    status: "soon",
  },
];
