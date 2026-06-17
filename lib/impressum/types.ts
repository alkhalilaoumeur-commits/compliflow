/**
 * Impressum-Datenmodell
 * Quelle: § 5 DDG (Deutschland, ersetzt § 5 TMG seit 14.05.2025) + § 18 MStV + VSBG
 * Plus: § 5 ECG / § 25 MedienG (Österreich), Art. 3 UWG (Schweiz)
 * Stand: 2026-06-12
 */

export type Land = "DE" | "AT" | "CH";

export type Rechtsform =
  | "einzelunternehmer"
  | "kleinunternehmer"
  | "freiberufler"
  | "gbr"
  | "gmbh"
  | "ug"
  | "ohg"
  | "kg"
  | "ag"
  | "ev"
  | "stiftung"
  | "andere";

export type Person = {
  vorname: string;
  nachname: string;
  rolle?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// HIGH FIX #8: Berufshaftpflicht-Versicherung (Pflicht für freie Berufe)
// Anwalt (§ 51 BRAO), Steuerberater (§ 67 StBerG), Arzt (BO § 21),
// Architekt (HOAI/Landesgesetz) → Name + Anschrift Versicherer +
// geografischer Geltungsbereich Pflicht im Impressum.
// ─────────────────────────────────────────────────────────────────────────────
export type Berufshaftpflicht = {
  aktiv: boolean;
  versicherer?: string;          // z.B. "HDI Versicherung AG"
  anschrift?: string;            // Anschrift des Versicherers
  geltungsbereich?: string;      // z.B. "Deutschland", "EU/EWR"
};

export type Adresse = {
  strasse: string;
  plz: string;
  ort: string;
  land: Land;
};

export type Kontakt = {
  email: string;
  telefon?: string;
  fax?: string;
  kontaktformular?: string;
};

export type RegisterArt = "HRB" | "HRA" | "VR" | "PR" | "GnR" | "GenR";

export type Register = {
  art?: RegisterArt;
  nummer?: string;
  gericht?: string;
};

export type Steuer = {
  ustId?: string;          // USt-IdNr. nach § 27a UStG
  wirtschaftsId?: string;  // W-IdNr. (ab Dez. 2026 Pflicht)
  steuernummer?: string;   // Optional als Fallback
  kleinunternehmer?: boolean; // § 19 UStG-Hinweis
};

export type Beruf = {
  aktiv: boolean;
  berufsbezeichnung?: string;
  verleihungsstaat?: string; // z.B. "Deutschland"
  kammer?: {
    name: string;
    adresse?: string;
    webseite?: string;
  };
  aufsichtsbehoerde?: {
    name: string;
    adresse?: string;
    webseite?: string;
  };
  berufsrechtlicheRegelungen?: string;
  zugaenglichUnter?: string;
  // HIGH FIX #8: Berufshaftpflicht-Versicherung
  haftpflicht?: Berufshaftpflicht;
};

// ─────────────────────────────────────────────────────────────────────────────
// HIGH FIX #6: Vereins-/Stiftungs-Spezifika
// e.V.-Impressen brauchen: Vereinszweck (Kurzform), VR-Nummer (im Register
// bereits abgedeckt), Vorstand nach § 26 BGB, ggf. Gemeinnützigkeit nach
// § 52 AO + Freistellungsbescheid-Angabe. Stiftung: Stiftungsbehörde.
// ─────────────────────────────────────────────────────────────────────────────
export type Vereinszusatz = {
  aktiv: boolean;
  vereinszweck?: string;                    // 1-2 Sätze, z.B. "Förderung des Sports im Stadtteil"
  gemeinnuetzig?: boolean;
  freistellungsbescheidVon?: string;        // z.B. "Finanzamt Stuttgart vom 15.03.2024"
  stiftungsbehoerde?: string;               // z.B. "Regierungspräsidium Stuttgart" (nur bei Stiftung)
};

// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL FIX #1: § 34 GewO — Gewerbeerlaubnis-Pflichten
// Betroffene Berufe nach § 34c-i GewO: Makler, Versicherer, Finanzanlagen-
// Vermittler, Honorarberater, Wohnimmobilien-Kredit-Vermittler. Bei aktiver
// Tätigkeit MUSS im Impressum: Erlaubnis-Art + Erlaubnisbehörde + Registernr.
// stehen (sonst Abmahnrisiko nach UWG + Gewerbeuntersagung).
// ─────────────────────────────────────────────────────────────────────────────

export type GewerbeerlaubnisTyp =
  | "gewo_34c"   // Immobilienmakler, Bauträger, Darlehensvermittler
  | "gewo_34d"   // Versicherungsvermittler/-berater
  | "gewo_34f"   // Finanzanlagenvermittler
  | "gewo_34h"   // Honorar-Finanzanlagenberater
  | "gewo_34i";  // Immobiliardarlehensvermittler

export type Gewerbeerlaubnis = {
  aktiv: boolean;
  typ?: GewerbeerlaubnisTyp;
  erlaubnisbehoerde?: string;          // z.B. "Industrie- und Handelskammer Stuttgart"
  erlaubnisbehoerdeAdresse?: string;
  registernummer?: string;              // z.B. IHK-Reg-Nr. "D-W-104-RAYHJ-67"
  vermittlerregisterUrl?: string;       // z.B. https://www.vermittlerregister.info
};

export const GEWO_LABELS: Record<GewerbeerlaubnisTyp, { kurz: string; lang: string; defaultBehoerde: string; defaultRegisterUrl?: string }> = {
  gewo_34c: {
    kurz: "§ 34c GewO",
    lang: "Immobilienmakler / Bauträger / Darlehensvermittler",
    defaultBehoerde: "Zuständiges Gewerbeamt der Gemeinde",
  },
  gewo_34d: {
    kurz: "§ 34d GewO",
    lang: "Versicherungsvermittler / Versicherungsberater",
    defaultBehoerde: "Industrie- und Handelskammer (IHK)",
    defaultRegisterUrl: "https://www.vermittlerregister.info",
  },
  gewo_34f: {
    kurz: "§ 34f GewO",
    lang: "Finanzanlagenvermittler",
    defaultBehoerde: "Industrie- und Handelskammer (IHK)",
    defaultRegisterUrl: "https://www.vermittlerregister.info",
  },
  gewo_34h: {
    kurz: "§ 34h GewO",
    lang: "Honorar-Finanzanlagenberater",
    defaultBehoerde: "Industrie- und Handelskammer (IHK)",
    defaultRegisterUrl: "https://www.vermittlerregister.info",
  },
  gewo_34i: {
    kurz: "§ 34i GewO",
    lang: "Immobiliardarlehensvermittler",
    defaultBehoerde: "Industrie- und Handelskammer (IHK)",
    defaultRegisterUrl: "https://www.vermittlerregister.info",
  },
};

export type Redaktion = {
  aktiv: boolean;
  // § 18 MStV: Inhaltlich Verantwortlicher bei journalistisch-redaktionellen Angeboten
  verantwortlicher?: {
    vorname: string;
    nachname: string;
    strasse: string;
    plz: string;
    ort: string;
  };
};

export type VsbgTeilnahme =
  | "nein"          // Nicht teilnahmebereit
  | "freiwillig"    // Teilnahmebereit freiwillig
  | "verpflichtet"; // Gesetzlich verpflichtet

export type Vsbg = {
  istB2c: boolean;           // Verkauf an Verbraucher?
  teilnahme: VsbgTeilnahme;
  schlichtungsstelle?: string;
};

export type Haftung = {
  haftungInhalte: boolean;
  haftungLinks: boolean;
  urheberrecht: boolean;
};

export type ImpressumData = {
  schemaVersion: 1;

  // Anbieter
  rechtsform: Rechtsform;
  rechtsformAndere?: string;   // Wenn rechtsform="andere"
  firma: string;               // Bei juristischen Personen
  vorname: string;             // Bei natürlichen Personen
  nachname: string;
  inhaberzusatz?: string;      // z.B. "Inh." vor Name

  // Adresse + Kontakt
  adresse: Adresse;
  kontakt: Kontakt;

  // Vertretung (bei juristischen Personen + Vereinen)
  vertretung: Person[];

  // Register + Steuer
  register: Register;
  steuer: Steuer;

  // Stammkapital (bei GmbH/UG/AG)
  stammkapital?: string;

  // Reglementierter Beruf
  beruf: Beruf;

  // CRITICAL FIX #1: § 34 GewO-Tätigkeiten (Makler, Versicherer, Finanzberater)
  gewerbeerlaubnis: Gewerbeerlaubnis;

  // HIGH FIX #5: AG-Aufsichtsratsvorsitzender (§ 80 AktG)
  aufsichtsratsvorsitzender?: Person;

  // HIGH FIX #6: Vereins-/Stiftungs-Spezifika
  vereinszusatz: Vereinszusatz;

  // § 18 MStV - Inhaltlich Verantwortlicher
  redaktion: Redaktion;

  // Verbraucherschlichtung
  vsbg: Vsbg;

  // Haftungsklauseln
  haftung: Haftung;

  // Meta
  letztAktualisiert: string;
  erstelltAm: string;
};

export type WizardStep =
  | "anbieter"
  | "kontakt"
  | "register"
  | "vertretung"
  | "zusatz"
  | "review";

export const WIZARD_STEPS: { id: WizardStep; label: string; sub: string }[] = [
  { id: "anbieter", label: "Anbieter", sub: "Rechtsform, Name, Firma" },
  { id: "kontakt", label: "Adresse & Kontakt", sub: "Wo bist du erreichbar" },
  { id: "register", label: "Register & Steuer", sub: "HRB, USt-ID, Wirtschafts-ID" },
  { id: "vertretung", label: "Vertretung & Beruf", sub: "Geschäftsführer + ggf. Kammer" },
  { id: "zusatz", label: "Zusatzangaben", sub: "Blog, Verbraucher, Haftung" },
  { id: "review", label: "Prüfen & Exportieren", sub: "HTML + PDF herunterladen" },
];

export const RECHTSFORM_LABELS: Record<Rechtsform, { kurz: string; lang: string; juristisch: boolean }> = {
  einzelunternehmer: { kurz: "Einzelunternehmer", lang: "Einzelunternehmen (eingetragen)", juristisch: false },
  kleinunternehmer: { kurz: "Kleinunternehmer", lang: "Kleinunternehmer (§ 19 UStG)", juristisch: false },
  freiberufler: { kurz: "Freiberufler", lang: "Freiberufliche Tätigkeit", juristisch: false },
  gbr: { kurz: "GbR", lang: "Gesellschaft bürgerlichen Rechts (GbR)", juristisch: true },
  gmbh: { kurz: "GmbH", lang: "Gesellschaft mit beschränkter Haftung (GmbH)", juristisch: true },
  ug: { kurz: "UG (haftungsbeschränkt)", lang: "Unternehmergesellschaft (haftungsbeschränkt)", juristisch: true },
  ohg: { kurz: "OHG", lang: "Offene Handelsgesellschaft (OHG)", juristisch: true },
  kg: { kurz: "KG", lang: "Kommanditgesellschaft (KG)", juristisch: true },
  ag: { kurz: "AG", lang: "Aktiengesellschaft (AG)", juristisch: true },
  ev: { kurz: "e.V.", lang: "Eingetragener Verein (e.V.)", juristisch: true },
  stiftung: { kurz: "Stiftung", lang: "Stiftung", juristisch: true },
  andere: { kurz: "Andere", lang: "Andere Rechtsform", juristisch: true },
};

export const REGISTER_LABELS: Record<RegisterArt, string> = {
  HRB: "Handelsregister B (HRB)",
  HRA: "Handelsregister A (HRA)",
  VR: "Vereinsregister (VR)",
  PR: "Partnerschaftsregister (PR)",
  GnR: "Genossenschaftsregister (GnR)",
  GenR: "Gesellschaftsregister (GesR)",
};

export const LAND_LABELS: Record<Land, string> = {
  DE: "Deutschland",
  AT: "Österreich",
  CH: "Schweiz",
};
