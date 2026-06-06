/**
 * AVV-Datenmodell
 * Quelle: Art. 28 DSGVO + Bitkom-Mustervertrag + GDD-Empfehlungen
 * Stand: 2026-06-06
 */

export type Vertragspartei = {
  firma: string;
  strasse: string;
  plz: string;
  ort: string;
  land: string;
  vertretung: string;
  email: string;
  telefon?: string;
  registergericht?: string;
  hrb?: string;
  ustId?: string;
};

export type Dauer =
  | { typ: "befristet"; bis: string }
  | { typ: "unbefristet" }
  | { typ: "vertragslaufzeit" };

export type Verarbeitungsart =
  | "Erheben"
  | "Speichern"
  | "Anpassen"
  | "Übermitteln"
  | "Auslesen"
  | "Abgleichen"
  | "Verknüpfen"
  | "Einschränken"
  | "Löschen"
  | "Vernichten";

export type Verarbeitung = {
  gegenstand: string;
  dauer: Dauer;
  zweck: string;
  arten: Verarbeitungsart[];
};

export type Datenkategorie = {
  id: string;
  label: string;
  beispiele: string[];
  besondereKategorie?: boolean;
};

export type Personenkategorie = {
  id: string;
  label: string;
};

export type TomKategorie =
  | "zutritt"
  | "zugang"
  | "zugriff"
  | "weitergabe"
  | "eingabe"
  | "auftrag"
  | "verfuegbarkeit"
  | "trennung";

export type Tom = {
  id: string;
  kategorie: TomKategorie;
  beschreibung: string;
  custom?: boolean;
};

export type Sicherheitsgarantie =
  | "EU-EWR"
  | "Angemessenheitsbeschluss"
  | "Standardvertragsklauseln"
  | "BindendeUnternehmensregeln"
  | "Keine";

export type Subverarbeiter = {
  id: string;
  firma: string;
  anschrift: string;
  zweck: string;
  land: string;
  sicherheitsgarantie: Sicherheitsgarantie;
  schremsIIZusatzmassnahmen?: string;
};

export type AvvFormData = {
  schemaVersion: 1;
  auftraggeber: Partial<Vertragspartei>;
  auftragnehmer: Partial<Vertragspartei>;
  verarbeitung: Partial<Verarbeitung>;
  datenkategorien: string[];
  datenkategorienCustom: string[];
  personenkategorien: string[];
  personenkategorienCustom: string[];
  toms: Tom[];
  subverarbeiter: Subverarbeiter[];
  abschlussDatum: string;
  abschlussOrt: string;
  acceptDisclaimer?: boolean;
};

export type WizardStep =
  | "parteien"
  | "verarbeitung"
  | "datenkategorien"
  | "personenkategorien"
  | "toms"
  | "subverarbeiter"
  | "review";

export const WIZARD_STEPS: { id: WizardStep; label: string; sub: string }[] = [
  { id: "parteien", label: "Vertragsparteien", sub: "Wer schließt den Vertrag" },
  { id: "verarbeitung", label: "Gegenstand & Zweck", sub: "Was wird verarbeitet und warum" },
  { id: "datenkategorien", label: "Datenkategorien", sub: "Welche Arten von Daten" },
  { id: "personenkategorien", label: "Betroffene Personen", sub: "Wessen Daten verarbeitet werden" },
  { id: "toms", label: "Schutzmaßnahmen", sub: "Technische und organisatorische Maßnahmen" },
  { id: "subverarbeiter", label: "Subverarbeiter", sub: "Weitere Dienstleister" },
  { id: "review", label: "Prüfen & Erstellen", sub: "Vertrag generieren und herunterladen" },
];
