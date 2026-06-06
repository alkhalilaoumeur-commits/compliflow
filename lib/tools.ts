export type Tool = {
  id: string;
  idx: string;
  name: string;
  pitch: string;
  bullets: string[];
  launchLabel: string;
  span: string;
  offset: number;
};

export const tools: Tool[] = [
  {
    id: "avv",
    idx: "01 / 03",
    name: "AVV-Generator",
    pitch:
      "DSGVO-konformer Auftragsverarbeitungs-Vertrag nach Art. 28 in unter zwei Minuten. Wizard statt Word-Vorlage, mit Live-Vorschau und Custom-Branding.",
    bullets: [
      "Schrems-II-Klauseln automatisch",
      "Vorlagen für Mailchimp, Google, ChatGPT",
      "DocuSign-Versand (Pro)",
    ],
    launchLabel: "17. Juni 2026",
    span: "md:col-span-7",
    offset: 0,
  },
  {
    id: "vvt",
    idx: "02 / 03",
    name: "Verarbeitungs­verzeichnis",
    pitch:
      "Das Pflicht-Register nach Art. 30 — strukturiert, prüfungssicher, in Stunden statt Tagen. Mit Branchen-Vorlagen und Export für deinen Steuerberater.",
    bullets: [
      "PDF, Excel, CSV Export",
      "Jahres-Erinnerung integriert",
      "Multi-Mandant für Agenturen",
    ],
    launchLabel: "15. Juli 2026",
    span: "md:col-span-5 md:col-start-8",
    offset: 96,
  },
  {
    id: "cookie",
    idx: "03 / 03",
    name: "Cookie-Banner",
    pitch:
      "Ein modernes Consent-Tool, das nicht aussieht wie 2014. TTDSG-konform, Google Consent Mode V2, ein Embed-Snippet auf jeder Webseite.",
    bullets: [
      "5 Banner-Stile zur Wahl",
      "Audit-Trail mitprotokolliert",
      "Subscription für Agenturen",
    ],
    launchLabel: "19. August 2026",
    span: "md:col-span-6 md:col-start-3",
    offset: 48,
  },
];
