/**
 * VVT-Datenmodell — Verarbeitungsverzeichnis nach Art. 30 DSGVO
 *
 * Pflicht für alle Verantwortlichen mit ≥250 MA, sowie nach Art. 30 Abs. 5 DSGVO
 * auch für kleinere Unternehmen, wenn die Verarbeitung
 *  - ein Risiko für die Rechte und Freiheiten der betroffenen Personen birgt,
 *  - nicht nur gelegentlich erfolgt, oder
 *  - besondere Datenkategorien (Art. 9) bzw. strafrechtliche Daten (Art. 10) umfasst.
 *
 * Tool deckt beide Modi ab: Art. 30 Abs. 1 (Verantwortlicher) und Art. 30 Abs. 2 (Auftragsverarbeiter).
 *
 * Stand: 2026-06-17 (Sprint-C Erweiterung)
 */

// ─────────────────────────────────────────────────────────────────────────────
// Modus: Verantwortlicher (Art. 30 Abs. 1) ODER Auftragsverarbeiter (Abs. 2)
// ─────────────────────────────────────────────────────────────────────────────

export type VvtModus = "verantwortlicher" | "auftragsverarbeiter";

export const VVT_MODUS_LABELS: Record<VvtModus, { kurz: string; lang: string }> = {
  verantwortlicher: {
    kurz: "Verantwortlicher (Art. 30 Abs. 1)",
    lang: "Sie entscheiden über Zwecke und Mittel der Datenverarbeitung — z.B. Sie verarbeiten Kundendaten, Mitarbeiterdaten, Newsletter-Empfänger.",
  },
  auftragsverarbeiter: {
    kurz: "Auftragsverarbeiter (Art. 30 Abs. 2)",
    lang: "Sie verarbeiten Daten ausschließlich im Auftrag anderer Unternehmen — z.B. als SaaS-Anbieter, Hosting-Dienstleister, Cloud-Provider, Lohnbüro.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Art. 30 Abs. 5 — Pflicht-Check (entscheidet, ob VVT überhaupt nötig ist)
// ─────────────────────────────────────────────────────────────────────────────

export type PflichtCheck = {
  mitarbeiter250Plus: boolean;          // ≥250 MA → immer VVT-pflichtig
  nichtNurGelegentlich: boolean;        // regelmäßige Verarbeitung
  besondereKategorien: boolean;         // Art. 9 oder Art. 10 Daten
  risikoFuerBetroffene: boolean;        // erhöhtes Risiko (z.B. Profiling, Scoring)
};

export type PflichtErgebnis = {
  istPflichtig: boolean;
  grund: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Rechtsgrundlagen
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Drittland-Garantie
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// H3: Datenherkunft (Art. 13 vs. Art. 14 DSGVO)
// ─────────────────────────────────────────────────────────────────────────────

export type Datenherkunft =
  | "direkt"          // direkt beim Betroffenen erhoben (Art. 13)
  | "indirekt"        // aus Drittquelle (Art. 14 — erweiterte Informationspflichten)
  | "gemischt";       // teils direkt, teils indirekt

export const DATENHERKUNFT_LABELS: Record<Datenherkunft, { kurz: string; lang: string }> = {
  direkt: {
    kurz: "Direkt beim Betroffenen (Art. 13 DSGVO)",
    lang: "Daten werden direkt von der betroffenen Person erhoben (z.B. Formular, Vertrag, Anmeldung)",
  },
  indirekt: {
    kurz: "Aus Drittquelle (Art. 14 DSGVO)",
    lang: "Daten stammen aus anderer Quelle (z.B. öffentliche Register, gekaufte Listen, Tracking-Pixel von Partnern)",
  },
  gemischt: {
    kurz: "Gemischt (Art. 13 + Art. 14 DSGVO)",
    lang: "Teile der Daten direkt, andere aus Drittquellen",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// H4: Legitimate Interest Assessment (LIA) — strukturierte 3-Stufen-Prüfung
//      bei Art. 6 Abs. 1 lit. f
// ─────────────────────────────────────────────────────────────────────────────

export type LegitimateInterestAssessment = {
  zweckIdentifiziert: string;       // Stufe 1: Welches Interesse wird verfolgt?
  notwendigkeitBegruendet: string;  // Stufe 2: Warum ist die Verarbeitung erforderlich?
  interessenabwaegung: string;      // Stufe 3: Abwägung gegen Rechte/Freiheiten der Betroffenen
};

// ─────────────────────────────────────────────────────────────────────────────
// M2: DSFA-Indikator (Art. 35 DSGVO)
// ─────────────────────────────────────────────────────────────────────────────

export type DsfaStatus =
  | "nicht-erforderlich"
  | "schwellwertanalyse-durchgefuehrt"
  | "dsfa-durchgefuehrt"
  | "dsfa-ausstehend";

export const DSFA_STATUS_LABELS: Record<DsfaStatus, string> = {
  "nicht-erforderlich": "Nicht erforderlich (kein hohes Risiko)",
  "schwellwertanalyse-durchgefuehrt": "Schwellwertanalyse durchgeführt, DSFA nicht erforderlich",
  "dsfa-durchgefuehrt": "DSFA durchgeführt und dokumentiert",
  "dsfa-ausstehend": "DSFA ausstehend (Risiko erkannt)",
};

// ─────────────────────────────────────────────────────────────────────────────
// M3: KI-System nach EU AI Act (ab 02.08.2026)
// ─────────────────────────────────────────────────────────────────────────────

export type KiRisikoklasse =
  | "kein-ki"
  | "minimal"
  | "begrenztes-risiko"
  | "hochrisiko"
  | "verboten";

export const KI_RISIKO_LABELS: Record<KiRisikoklasse, string> = {
  "kein-ki": "Kein KI-System im Einsatz",
  "minimal": "Minimales Risiko (Art. 5 AI Act — keine Pflichten)",
  "begrenztes-risiko": "Begrenztes Risiko (Art. 50 — Transparenzpflicht: Chatbots, Deepfakes)",
  "hochrisiko": "Hochrisiko (Anhang III — DSFA + Konformitätsbewertung)",
  "verboten": "Verbotene Praktik (Art. 5 AI Act)",
};

export type KiSystem = {
  bezeichnung: string;
  risikoklasse: KiRisikoklasse;
  anbieter: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// H1: Gemeinsame Verantwortlichkeit (Art. 26 DSGVO)
// ─────────────────────────────────────────────────────────────────────────────

export type GemeinsamVerantwortlich = {
  istGemeinsam: boolean;
  partner: string;       // z.B. "Meta Platforms Ireland Limited"
  zustaendigkeit: string;// Aufteilung der Pflichten nach Art. 26 Abs. 1
  vereinbarungLink?: string; // Link zur Joint-Controller-Vereinbarung
};

// ─────────────────────────────────────────────────────────────────────────────
// Empfänger
// ─────────────────────────────────────────────────────────────────────────────

export type Empfaenger = {
  id: string;
  name: string;
  kategorie: string;
  istAuftragsverarbeiter: boolean;
  land: string;
  avvVorhanden?: boolean;
  avvDokumentLink?: string;   // L2: Pfad/URL zum AVV-Dokument
};

// ─────────────────────────────────────────────────────────────────────────────
// Verarbeitungstätigkeit (Hauptobjekt)
// ─────────────────────────────────────────────────────────────────────────────

export type Verarbeitungstaetigkeit = {
  id: string;
  bezeichnung: string;
  zweck: string;
  rechtsgrundlagen: Rechtsgrundlage[];
  berechtigtesInteresseDetail?: string;
  lia?: LegitimateInterestAssessment;        // H4
  betroffenengruppen: string[];
  datenkategorien: string[];
  datenherkunft: Datenherkunft;              // H3
  besondereKategorien: boolean;
  gemeinsamVerantwortlich?: GemeinsamVerantwortlich; // H1
  empfaenger: Empfaenger[];
  drittlandGarantie: DrittlandGarantie;
  drittlandDetail?: string;
  loeschfristen: string;
  toms: string;
  dsfaStatus: DsfaStatus;                    // M2
  kiSysteme: KiSystem[];                     // M3
  anmerkungen?: string;
  letztGeprueft?: string;                    // L1 — ISO-Datum
};

// ─────────────────────────────────────────────────────────────────────────────
// Verantwortliche / Auftragsverarbeitende Stelle
// ─────────────────────────────────────────────────────────────────────────────

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
  // H2: Art. 27 — Vertreter, nur falls Verantwortlicher außerhalb EU/EWR sitzt
  hatEuVertreter: boolean;
  euVertreter?: {
    bezeichnung: string;
    anschrift: string;
    email: string;
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Für Auftragsverarbeiter-Modus: Liste der Auftraggeber (Verantwortlichen)
// nach Art. 30 Abs. 2 lit. a
// ─────────────────────────────────────────────────────────────────────────────

export type AuftraggeberMandant = {
  id: string;
  bezeichnung: string;        // Firmenname des Auftraggebers
  anschrift: string;
  ansprechpartner: string;
  email: string;
  hatDsb: boolean;
  dsbKontakt?: string;
  avvAbgeschlossen: boolean;
  avvDatum?: string;          // ISO
  verarbeitungsbeschreibung: string; // Kategorien der für diesen Auftraggeber durchgeführten Verarbeitungen
};

// ─────────────────────────────────────────────────────────────────────────────
// VvtFormData — Haupt-State
// ─────────────────────────────────────────────────────────────────────────────

export type VvtFormData = {
  schemaVersion: 2;
  modus: VvtModus;                                  // C1
  pflichtCheck: PflichtCheck;                        // M1
  verantwortlicher: Partial<VvtVerantwortlicher>;
  auftraggeber: AuftraggeberMandant[];               // C1 — nur befüllt bei modus=auftragsverarbeiter
  taetigkeiten: Verarbeitungstaetigkeit[];
  erstelltAm: string;
  letztAktualisiert: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Wizard-Steps
// ─────────────────────────────────────────────────────────────────────────────

export type VvtWizardStep = "unternehmen" | "taetigkeiten" | "abschluss";

export const VVT_WIZARD_STEPS: { id: VvtWizardStep; label: string; sub: string }[] = [
  { id: "unternehmen", label: "Verantwortliche Stelle", sub: "Wer führt das Verzeichnis" },
  { id: "taetigkeiten", label: "Verarbeitungstätigkeiten", sub: "Was wird verarbeitet" },
  { id: "abschluss", label: "Prüfen & Exportieren", sub: "VVT herunterladen" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Standard-Optionen
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Pflicht-Quiz auswerten (Art. 30 Abs. 5)
// ─────────────────────────────────────────────────────────────────────────────

export function evaluierePflicht(check: PflichtCheck): PflichtErgebnis {
  if (check.mitarbeiter250Plus) {
    return {
      istPflichtig: true,
      grund: "Sie haben ≥250 Mitarbeiter — VVT ist nach Art. 30 Abs. 1 DSGVO ohne Ausnahme Pflicht.",
    };
  }
  if (check.besondereKategorien) {
    return {
      istPflichtig: true,
      grund: "Sie verarbeiten besondere Datenkategorien nach Art. 9 DSGVO (z.B. Gesundheitsdaten, Religion, Gewerkschaftszugehörigkeit). Befreiung nach Abs. 5 entfällt.",
    };
  }
  if (check.risikoFuerBetroffene) {
    return {
      istPflichtig: true,
      grund: "Die Verarbeitung birgt ein Risiko für die Rechte und Freiheiten der betroffenen Personen (z.B. Profiling, Scoring, Mitarbeiterbewertung). Befreiung nach Abs. 5 entfällt.",
    };
  }
  if (check.nichtNurGelegentlich) {
    return {
      istPflichtig: true,
      grund: "Die Verarbeitung erfolgt nicht nur gelegentlich (z.B. laufender Kundenbestand, Mitarbeiterverwaltung, regelmäßiger Newsletter). Befreiung nach Abs. 5 entfällt.",
    };
  }
  return {
    istPflichtig: false,
    grund: "Sie könnten nach Art. 30 Abs. 5 DSGVO von der VVT-Pflicht befreit sein. Empfehlung: Trotzdem ein einfaches Verzeichnis führen — bei Behördenanfragen Pflicht zum Nachweis.",
  };
}
