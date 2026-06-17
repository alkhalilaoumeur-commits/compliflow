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
    launch: "Live seit Juni 2026",
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
    duration: "10 Min statt 2 Tage",
    launch: "Live seit Juni 2026",
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
    a: "Compliflow ist eine Suite aus 7 Generatoren, die DSGVO- und Compliance-Pflicht-Dokumente für deutsche Selbstständige und Agenturen automatisch erstellen: Impressum, Datenschutzerklärung, AVV, Verarbeitungsverzeichnis, Widerrufsbelehrung, AGB und Cookie-Banner. Kein Account nötig, keine Daten-Upload, alles läuft lokal in deinem Browser.",
  },
  {
    q: "Welche Tools sind live?",
    a: "Alle 7 Generatoren sind live und komplett kostenlos nutzbar: Impressum-Generator (§ 5 DDG), Datenschutz-Generator (Art. 13/14 DSGVO), AVV-Generator (Art. 28 DSGVO), Verarbeitungsverzeichnis (Art. 30 DSGVO), Widerrufsbelehrung (Anhang § 312f BGB), AGB-Generator (3 Varianten, §§ 305-310 BGB) und Cookie-Banner (BGH-2025-konform, § 25 TDDDG).",
  },
  {
    q: "Brauche ich als Solo-Selbstständiger wirklich einen AVV?",
    a: "Sobald du auch nur einen externen Dienst nutzt, der personenbezogene Daten anfasst — Mailchimp, Google Workspace, Stripe, einen Cloud-Hoster, dein CRM — ja. Die DSGVO unterscheidet nicht nach Firmengröße. Der typische Solo-Selbstständige in DACH braucht 8 bis 15 AVVs.",
  },
  {
    q: "Was kostet Compliflow?",
    a: "Free-Tier mit Compliflow-Footer ist kostenlos. Pro Dokument (29 €, einmalig) entfernt den Footer — je AVV und VVT separat buchbar. Agency (19 €/Monat) ist für Datenschutzberater und Agenturen geplant, die unbegrenzt Mandanten-Dokumente erstellen.",
  },
  {
    q: "Ist das hier rechtsverbindlich?",
    a: "Compliflow generiert strukturierte Vorlagen, die alle Pflichtinhalte nach Art. 28 und Art. 30 DSGVO abdecken. Die Dokumente ersetzen keine individuelle Rechtsberatung — für Sonderfälle (Art. 9-Daten, Drittlandtransfers, behördliche Prüfungen) empfehlen wir einen Datenschutz-Anwalt.",
  },
  {
    q: "Wo werden meine Daten gespeichert?",
    a: "Komplett in der EU. Deine Eingaben verlassen niemals deinen Browser — wir speichern keine Dokument-Inhalte auf unseren Servern. Der Webserver läuft bei Hetzner in Frankfurt am Main. Wir nutzen Plausible Analytics statt Google Analytics, weil Plausible cookieless und DSGVO-konform ist. Die Liste aller Auftragsverarbeiter steht in unserer Datenschutzerklärung.",
  },
  {
    q: "Kann ich Compliflow als Agentur für meine Kunden nutzen?",
    a: "Der Agency-Plan (19 €/Monat, bald buchbar) ist genau dafür gedacht: unbegrenzte Dokumente ohne Branding, Mandanten-Übersicht und Prioritäts-Support. Jetzt schon per E-Mail vormerken: hello@compliflow.de.",
  },
  {
    q: "Wer steht hinter Compliflow?",
    a: "Al-Khalil Aoumeur, Solo-Builder aus Stuttgart, Mitte zwanzig, baut SaaS-Produkte für deutsche KMU. Compliflow ist das dritte Produkt unter der DRVN-Marke, nach ServeFlow (Restaurant-Software) und BookBase (Buchungssystem).",
  },
  {
    q: "Gilt der AVV auch für Österreich und die Schweiz?",
    a: "AVV und VVT basieren auf der EU-DSGVO, die in allen EU-Mitgliedstaaten gilt — also auch in Österreich. In der Schweiz gilt seit 2023 das revidierte Datenschutzgesetz (revDSG), das der DSGVO weitgehend entspricht. Die Pflichtinhalte eines AVV sind in beiden Ländern kompatibel. Compliflow ist auf deutsches Recht (DE) optimiert; bei AT- oder CH-spezifischen Anforderungen empfiehlt sich eine lokale Prüfung.",
  },
  {
    q: "Verliere ich meine Eingaben wenn ich die Seite neu lade?",
    a: "Nein. Alle Eingaben werden automatisch in deinem Browser (localStorage) gespeichert — auch nach einem Seiten-Reload, Tab-Wechsel oder Browser-Neustart sind alle Felder noch da. Nichts wird an unsere Server übertragen. Nur wenn du explizit auf 'Zurücksetzen' klickst oder den Browser-Verlauf löschst, werden die Daten entfernt.",
  },
  {
    q: "In welchem Format erhalte ich das fertige Dokument?",
    a: "Als PDF-Datei, direkt aus deinem Browser generiert — ohne Upload, ohne E-Mail, ohne Wartezeit. Die kostenlose Version enthält einen kleinen 'Erstellt mit Compliflow'-Footer. Pro (29 € einmalig) entfernt diesen. Das PDF ist zum Ausdrucken, digitalen Unterzeichnen (z. B. mit DocuSign oder Adobe Sign) oder zur Ablage geeignet.",
  },
];
