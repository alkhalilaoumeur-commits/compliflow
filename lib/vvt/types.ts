/**
 * VVT-Datenmodell — Verarbeitungsverzeichnis nach Art. 30 DSGVO
 * Pflicht für alle Verantwortlichen mit ≥250 MA oder regelmäßiger/riskanter Verarbeitung
 * Stand: 2026-06-07
 */

export type Rechtsgrundlage =
  | "art6-1a" // Einwilligung
  | "art6-1b" // Vertragserfüllung
  | "art6-1c" // Rechtliche Verpflichtung
  | "art6-1d" // Lebenswichtige Interessen
  | "art6-1e" // Öffentliches Interesse / öffentliche Gewalt
  | "art6-1f" // Berechtigtes Interesse
  | "art9-2a" // Besondere Kategorien: Einwilligung
  | "art9-2b" // Besondere Kategorien: Beschäftigung/Sozialschutz
  | "art9-2c" // Lebenswichtige Interessen (besondere Kategorien)
  | "art9-2h" // Gesundheitsversorgung
  | "art88";  // Beschäftigungsverhältnis (§ 26 BDSG)

export const RECHTSGRUNDLAGEN_LABELS: Record<Rechtsgrundlage, string> = {
  "art6-1a": "Art. 6 Abs. 1 lit. a — Einwilligung",
  "art6-1b": "Art. 6 Abs. 1 lit. b — Vertragserfüllung",
  "art6-1c": "Art. 6 Abs. 1 lit. c — Rechtliche Verpflichtung",
  "art6-1d": "Art. 6 Abs. 1 lit. d — Lebenswichtige Interessen",
  "art6-1e": "Art. 6 Abs. 1 lit. e — Öffentliches Interesse",
  "art6-1f": "Art. 6 Abs. 1 lit. f — Berechtigtes Interesse",
  "art9-2a": "Art. 9 Abs. 2 lit. a — Einwilligung (besondere Kategorien)",
  "art9-2b": "Art. 9 Abs. 2 lit. b — Beschäftigung/Sozialschutz",
  "art9-2c": "Art. 9 Abs. 2 lit. c — Lebenswichtige Interessen",
  "art9-2h": "Art. 9 Abs. 2 lit. h — Gesundheitsversorgung",
  "art88": "Art. 88 DSGVO i.V.m. § 26 BDSG — Beschäftigungsverhältnis",
};

export type DrittlandGarantie =
  | "keine-uebermittlung"
  | "eu-ewr"
  | "angemessenheitsbeschluss"
  | "standardvertragsklauseln"
  | "verbindliche-unternehmensregeln"
  | "einwilligung";

export const DRITTLAND_GARANTIE_LABELS: Record<DrittlandGarantie, string> = {
  "keine-uebermittlung": "Keine Übermittlung in Drittländer",
  "eu-ewr": "Empfänger im EU/EWR-Raum",
  "angemessenheitsbeschluss": "Angemessenheitsbeschluss (Art. 45 DSGVO)",
  "standardvertragsklauseln": "EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c)",
  "verbindliche-unternehmensregeln": "Verbindliche interne Datenschutzvorschriften (BCR)",
  "einwilligung": "Ausdrückliche Einwilligung (Art. 49 Abs. 1 lit. a)",
};

export type Empfaenger = {
  id: string;
  name: string;
  kategorie: string;
  istAuftragsverarbeiter: boolean;
  land: string;
  avvVorhanden?: boolean;
};

export type Verarbeitungstaetigkeit = {
  id: string;
  bezeichnung: string;
  zweck: string;
  rechtsgrundlagen: Rechtsgrundlage[];
  berechtigtesInteresseDetail?: string;
  betroffenengruppen: string[];
  datenkategorien: string[];
  besondereKategorien: boolean;
  empfaenger: Empfaenger[];
  drittlandGarantie: DrittlandGarantie;
  drittlandDetail?: string;
  loeschfristen: string;
  toms: string;
  anmerkungen?: string;
};

export type VvtVerantwortlicher = {
  bezeichnung: string;
  name: string;
  strasse: string;
  plz: string;
  ort: string;
  land: string;
  email: string;
  telefon?: string;
  website?: string;
  hatDsb: boolean;
  dsb?: {
    name: string;
    email: string;
    telefon?: string;
  };
  vertreter?: string;
};

export type VvtFormData = {
  schemaVersion: 1;
  verantwortlicher: Partial<VvtVerantwortlicher>;
  taetigkeiten: Verarbeitungstaetigkeit[];
  erstelltAm: string;
  letztAktualisiert: string;
};

export type VvtWizardStep = "unternehmen" | "taetigkeiten" | "abschluss";

export const VVT_WIZARD_STEPS: { id: VvtWizardStep; label: string; sub: string }[] = [
  { id: "unternehmen", label: "Verantwortliche Stelle", sub: "Wer führt das Verzeichnis" },
  { id: "taetigkeiten", label: "Verarbeitungstätigkeiten", sub: "Was wird verarbeitet" },
  { id: "abschluss", label: "Prüfen & Exportieren", sub: "VVT herunterladen" },
];

export const STANDARD_BETROFFENENGRUPPEN = [
  "Kunden / Auftraggeber",
  "Interessenten / Leads",
  "Mitarbeiter / Beschäftigte",
  "Bewerber",
  "Lieferanten / Auftragnehmer",
  "Websitebesucher",
  "Geschäftspartner",
  "Minderjährige",
  "Patienten / Klienten",
  "Vereinsmitglieder",
];

export const STANDARD_DATENKATEGORIEN = [
  "Kontaktdaten (Name, Adresse, E-Mail, Telefon)",
  "Identifikationsdaten (Geburtsdatum, Personalausweis)",
  "Vertragsdaten (Bestellungen, Rechnungen, Verträge)",
  "Zahlungsdaten (Bankverbindung, Zahlungshistorie)",
  "Nutzungsdaten (IP-Adresse, Browser, Logfiles)",
  "Kommunikationsdaten (E-Mails, Chat-Verläufe)",
  "Standortdaten",
  "Beschäftigungsdaten (Gehalt, Arbeitszeiten, Urlaub)",
  "Bewerbungsunterlagen (Lebenslauf, Zeugnisse)",
  "Gesundheitsdaten (Art. 9 DSGVO)",
  "Biometrische Daten (Art. 9 DSGVO)",
  "Bonitätsdaten / Scoring",
  "Fotografie / Videoaufnahmen",
  "Profilierungsdaten (Kaufverhalten, Interessen)",
];

export const STANDARD_EMPFAENGER_KATEGORIEN = [
  "IT-Dienstleister / Hosting",
  "Steuerberater / Buchhalter",
  "Zahlungsdienstleister",
  "E-Mail-Dienstleister",
  "CRM / Marketing-Software",
  "Logistik / Versand",
  "Behörden / Finanzamt",
  "Sozialversicherungsträger",
  "Banken / Kreditinstitute",
  "Interne Abteilungen",
];
