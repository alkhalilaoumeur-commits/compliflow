export const PRIMER = [
  {
    id: "avv",
    eyebrow: "Tool 01",
    title: "AVV — Auftragsverarbeitungs-Vertrag",
    law: "DSGVO Art. 28",
    keyword: "AVV Generator DSGVO",
    body: `Sobald du einen externen Dienst nutzt, der personenbezogene Daten deiner Kunden verarbeitet — Mailchimp, Google Workspace, Stripe, ein Cloud-Hoster, dein Steuerberater — schreibt die DSGVO einen Auftragsverarbeitungs-Vertrag vor. Ohne diesen Vertrag haftest du persönlich. Bußgelder beginnen bei vierstellig, gehen in Einzelfällen bis 20 Millionen Euro oder 4 % deines Jahresumsatzes.`,
    pillars: [
      "Wer haftet wofür im Datenfluss",
      "Welche TOMs der Anbieter einsetzen muss",
      "Was bei einem Datenleck passiert",
      "Wann der Vertrag endet und Daten gelöscht werden",
    ],
    duration: "2 Min statt 45 Min",
    launch: "17. Juni 2026",
  },
  {
    id: "vvt",
    eyebrow: "Tool 02",
    title: "VVT — Verarbeitungsverzeichnis",
    law: "DSGVO Art. 30",
    keyword: "Verarbeitungsverzeichnis Vorlage",
    body: `Das Verarbeitungsverzeichnis ist die Bestandsaufnahme aller deiner Datenflüsse — Mitarbeiter, Kunden, Newsletter, Buchhaltung, Bewerbungen. Jede Firma ab einer regelmäßigen Verarbeitung ist verpflichtet. Die meisten Selbstständigen haben gar keins, weil sie es nicht wissen. Bei Stichprobe der Datenschutzbehörde wird zuerst danach gefragt.`,
    pillars: [
      "Welche Daten du wofür verarbeitest",
      "Welche Tools im Spiel sind",
      "Wer als Auftragsverarbeiter dranhängt",
      "Wann gelöscht oder anonymisiert wird",
    ],
    duration: "Stunden statt Tage",
    launch: "15. Juli 2026",
  },
  {
    id: "cookie-banner",
    eyebrow: "Tool 03",
    title: "Cookie-Banner — Consent Management",
    law: "TTDSG + DSGVO Art. 6",
    keyword: "Cookie Banner DSGVO konform",
    body: `Seit dem TTDSG gilt: Tracking, Analytics, Marketing-Pixel — alles braucht aktive Zustimmung. Pre-Ticked, Cookie-Wall, oder ein "Akzeptieren"-Button ohne gleichwertiges "Ablehnen" sind abmahnbar. Wir bauen einen Banner, der nicht aussieht wie 2014 und gleichzeitig Audit-fest mitprotokolliert.`,
    pillars: [
      "Akzeptieren + Ablehnen gleich prominent",
      "Tracking erst nach Consent",
      "Google Consent Mode V2",
      "Audit-Trail in der Datenbank",
    ],
    duration: "10 Min Setup",
    launch: "19. August 2026",
  },
];

export const FAQS = [
  {
    q: "Was ist Compliflow?",
    a: "Compliflow ist eine Suite aus drei Tools, die DSGVO-Pflicht-Dokumente für deutsche Selbstständige und Agenturen automatisch erstellen: AVV-Generator, Verarbeitungsverzeichnis und Cookie-Banner. Alles auf einer Domain, mit gemeinsamem Account.",
  },
  {
    q: "Wann startet das erste Tool?",
    a: "Tool 1 (AVV-Generator) launcht am 17. Juni 2026. Tool 2 (VVT) folgt am 15. Juli, Tool 3 (Cookie-Banner) am 19. August. Wartelisten-Anmelder bekommen 34 % Early-Bird-Rabatt in der Launch-Woche.",
  },
  {
    q: "Brauche ich als Solo-Selbstständiger wirklich einen AVV?",
    a: "Sobald du auch nur einen externen Dienst nutzt, der personenbezogene Daten anfasst — Mailchimp, Google Workspace, Stripe, einen Cloud-Hoster, dein CRM — ja. Die DSGVO unterscheidet nicht nach Firmengröße. Der typische Solo-Selbstständige in DACH braucht 8 bis 15 AVVs.",
  },
  {
    q: "Was kostet Compliflow?",
    a: "Free-Tier mit Compliflow-Footer ist kostenlos. Pro Single (29 €, einmalig) entfernt den Footer und erlaubt Custom-Branding. Pro Agency (19 € pro Monat) bietet Multi-Mandant-Dashboard, DocuSign-Integration und Update-Service.",
  },
  {
    q: "Ist das hier rechtsverbindlich?",
    a: "Compliflow stellt rechtssichere Vorlagen bereit, die auf den offiziellen Bitkom- und DSK-Mustern basieren und anwaltlich geprüft sind. Wir ersetzen jedoch keine Einzelfall-Rechtsberatung. Für komplexe Konstellationen empfehlen wir einen IT-Rechts-Anwalt hinzuzuziehen.",
  },
  {
    q: "Wo werden meine Daten gespeichert?",
    a: "Komplett in der EU. Unsere Datenbank läuft auf Supabase in Frankfurt am Main. Wir nutzen Plausible Analytics anstelle von Google Analytics, weil Plausible cookieless und DSGVO-konform aus dem Karton ist. Die Liste aller Auftragsverarbeiter steht in unserer Datenschutzerklärung.",
  },
  {
    q: "Kann ich Compliflow als Agentur für meine Kunden nutzen?",
    a: "Genau dafür gibt es Pro Agency. Du verwaltest beliebig viele Mandanten unter einem Account, jeder bekommt eigene AVVs mit deinem Logo, der Versand läuft über DocuSign, und bei DSGVO-Änderungen aktualisierst du alle Dokumente mit einem Klick.",
  },
  {
    q: "Wer steht hinter Compliflow?",
    a: "Al-Khalil Aoumeur, Solo-Builder aus Stuttgart, Mitte zwanzig, baut SaaS-Produkte für deutsche KMU. Compliflow ist das dritte Produkt unter der DRVN-Marke, nach ServeFlow (Restaurant-Software) und BookBase (Buchungssystem).",
  },
];
