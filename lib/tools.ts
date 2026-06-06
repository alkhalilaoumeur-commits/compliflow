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
      "Vorlagen für Google Workspace, Mailchimp, ChatGPT, Stripe",
      "Optional digitaler Versand via DocuSign",
      "Mehrere AVVs zentral verwalten (Agentur-Tier)",
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
      "Strukturierte Aufnahme aller Verarbeitungstätigkeiten — mit Branchen-Vorlagen, Multi-Mandant für Agenturen und Export für deinen Steuerberater.",
    bullets: [
      "PDF, Excel und CSV-Export",
      "Automatische Jahres-Erinnerung",
      "Aggregation aller Auftragsverarbeiter",
    ],
    launchLabel: "15. Juli 2026",
    span: "lg:col-span-4",
    offset: 0,
    status: "soon",
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
