/**
 * AGB-Datenmodell
 * Quellen: §§ 305-310 BGB (AGB-Recht) + § 312i BGB (E-Commerce) + § 312d BGB (Fernabsatz) + Art. 246 EGBGB
 * Stand: 2026-06-16
 */

import type { Land } from "../impressum/types";

// ─────────────────────────────────────────────────────────────────────────────
// Variante — welche AGB-Vorlage
// ─────────────────────────────────────────────────────────────────────────────

export type AgbVariante =
  | "b2c_dienstleistung"   // Solo-Freelancer, Berater, Agenturen → Verbraucher
  | "b2c_shop"             // Online-Shop B2C
  | "b2b";                 // Reines B2B (Dienstleistung oder Ware)

export const VARIANTE_LABELS: Record<AgbVariante, { name: string; beschreibung: string }> = {
  b2c_dienstleistung: {
    name: "B2C Dienstleistung",
    beschreibung: "Du bist Dienstleister (Berater, Coach, Agentur, Freelancer) und verkaufst an Verbraucher.",
  },
  b2c_shop: {
    name: "B2C Shop",
    beschreibung: "Du betreibst einen Online-Shop und verkaufst Waren an Verbraucher.",
  },
  b2b: {
    name: "B2B (Geschäftskunden)",
    beschreibung: "Du verkaufst ausschließlich an Unternehmen, Selbstständige oder juristische Personen.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Anbieter
// ─────────────────────────────────────────────────────────────────────────────

export type Anbieter = {
  name: string;
  vertretungsberechtigter?: string;
  strasse: string;
  plz: string;
  ort: string;
  land: Land;
  email: string;
  telefon?: string;
  registerArt?: "HRB" | "HRA" | "VR";
  registerNummer?: string;
  registerGericht?: string;
  ustId?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Leistungs-Konfiguration
// ─────────────────────────────────────────────────────────────────────────────

export type LeistungsArt =
  | "beratung"           // Beratungs-Dienstleistung
  | "coaching"           // Coaching, Training
  | "agentur"            // Webdesign, Marketing, etc.
  | "fortbildung"        // Online-Kurse, Workshops
  | "saas"               // SaaS / Software-Abo
  | "physisch"           // Physische Ware (Shop)
  | "digital_download"   // Digitale Produkte zum Download
  | "abo_service"        // Abo-Service (z.B. Mitgliedschaft)
  | "individuell";

export type LeistungsConfig = {
  art: LeistungsArt;
  beschreibung: string;             // Free-Text Leistungsbeschreibung
  leistungsort?: string;            // bei Vor-Ort-Dienstleistung
  online: boolean;                  // wird online erbracht?
};

// ─────────────────────────────────────────────────────────────────────────────
// Zahlung
// ─────────────────────────────────────────────────────────────────────────────

export type ZahlungsArt =
  | "vorkasse"
  | "rechnung"
  | "lastschrift"
  | "stripe"
  | "paypal"
  | "klarna"
  | "ueberweisung";

export type ZahlungsConfig = {
  arten: ZahlungsArt[];
  zahlungszielTage: number;             // typisch B2B 14, B2C 7
  skontoProzent?: number;               // B2B-Skonto
  skontoTage?: number;
  verzugszinsen: boolean;               // verzugszinsen-klausel?
  inkassoKlausel: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Lieferung (Shop)
// ─────────────────────────────────────────────────────────────────────────────

export type LieferungConfig = {
  versand: boolean;
  versandkostenInfo: string;            // Free-Text "Versandkosten lt. Shop"
  lieferzeitTage: string;               // "5-10 Werktage"
  liefergebiet: string;                 // "Deutschland und EU"
  eigentumsvorbehalt: boolean;          // bis vollständige Bezahlung
  eigentumsvorbehaltVerlaengert: boolean; // B2B: Verarbeitung etc.
  gefahruebergang: "ab_versand" | "ab_uebergabe"; // B2B vs. B2C
};

// ─────────────────────────────────────────────────────────────────────────────
// Stornierung / Vertragsbeendigung
// ─────────────────────────────────────────────────────────────────────────────

export type StornierungConfig = {
  kostenlosBisTage: number;             // Storno ohne Gebühr bis X Tage vor Termin
  stornogebuehrenStaffel: { vorTagen: number; gebuehrProzent: number }[];
  kuendigungsfristTage: number;         // bei Dauerverträgen
  ausserordentlichesKuendigungsrecht: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// C3 — FairKonG: Erstlaufzeit + automatische Verlängerung B2C (seit 01.03.2022)
// ─────────────────────────────────────────────────────────────────────────────

export type DauerVertragConfig = {
  istDauervertrag: boolean;             // Toggle: handelt es sich um Dauerschuld?
  erstlaufzeitMonate: number;            // max. 24 bei B2C
  automatischeVerlaengerung: boolean;
  verlaengerungsKuendigungsfristTage: number; // max. 30 bei B2C (= 1 Monat)
  kuendigungsButtonUrl?: string;        // C2 § 312k BGB
};

// ─────────────────────────────────────────────────────────────────────────────
// H1 — Digitales Produkt / Dienstleistung (§§ 327 ff. BGB)
// ─────────────────────────────────────────────────────────────────────────────

export type DigitalConfig = {
  istDigital: boolean;                  // wird automatisch bei art saas/digital_download/fortbildung
  bereitstellungsZeitraumMonate: number;// Dauer der Aktualisierungs-/Updates-Pflicht
  sicherheitsUpdates: boolean;          // § 327g BGB Pflicht-Sicherheits-Updates
  // M3 Nutzungsrechte
  nutzungsRechte: "persoenlich" | "einfach" | "kommerziell";
  geraeteLimit?: number;
  weitergabeVerbot: boolean;
  // M2 SaaS Verfügbarkeit
  verfuegbarkeitsZiel?: string;         // z.B. "98% im Jahresmittel"
  // M7 Daten-Export bei Vertragsende
  datenExportTage: number;              // Frist in Tagen
};

// ─────────────────────────────────────────────────────────────────────────────
// M4 — Vertraulichkeit
// ─────────────────────────────────────────────────────────────────────────────

export type VertraulichkeitConfig = {
  vertraulichkeitsKlausel: boolean;
  nachvertraglichJahre: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// Gewährleistung
// ─────────────────────────────────────────────────────────────────────────────

export type GewaehrleistungConfig = {
  /** Bei B2B kann auf 12 Monate verkürzt werden, B2C bleibt 24 */
  fristMonate: number;
  unterlassenRuegepflicht: boolean;     // B2B: § 377 HGB
  nachbesserungsversuche: number;       // Standard 2
};

// ─────────────────────────────────────────────────────────────────────────────
// Haftung
// ─────────────────────────────────────────────────────────────────────────────

export type HaftungsConfig = {
  /** Beschränkt auf Vorsatz/grobe Fahrlässigkeit (in B2B üblich; B2C streng begrenzt) */
  beschraenkungAufVorsatzGrobeFL: boolean;
  /** Beschränkung auf vertragstypische, vorhersehbare Schäden */
  beschraenkungVertragstypisch: boolean;
  /** Höchstbetragsbeschränkung */
  hoechstbetragEuro?: number;
  /** Datenverlust-Haftungsausschluss */
  datenverlustAusgeschlossen: boolean;
  /** Mitverschulden des Kunden */
  mitverschuldenAnrechnung: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Vertragsschluss-Konfiguration
// ─────────────────────────────────────────────────────────────────────────────

export type VertragsschlussArt =
  | "angebot_annahme"     // Angebot vom Kunden, Annahme durch Anbieter
  | "automatische_buchung" // Sofort-Buchung mit Bestätigung
  | "auftragsbestaetigung"; // Per Email Auftragsbestätigung

// ─────────────────────────────────────────────────────────────────────────────
// Hauptmodell
// ─────────────────────────────────────────────────────────────────────────────

export type AgbData = {
  schemaVersion: 2;
  variante: AgbVariante;

  // 1. Anbieter
  anbieter: Anbieter;

  // 2. Leistung
  leistung: LeistungsConfig;

  // 3. Vertragsschluss
  vertragsschluss: VertragsschlussArt;
  vertragsspracheDe: boolean;           // Standard true

  // 4. Zahlung
  zahlung: ZahlungsConfig;

  // 5. Lieferung (nur Shop)
  lieferung: LieferungConfig;

  // 6. Stornierung
  stornierung: StornierungConfig;
  ermoeglicheStornierung: boolean;      // Toggle ob Storno-Regelung gewünscht

  // 6b. Dauervertrag (FairKonG + § 312k Kündigungsbutton) — C2 + C3
  dauervertrag: DauerVertragConfig;

  // 6c. Digital-Konfiguration (§§ 327 ff. BGB) — H1, M2, M3, M5, M7
  digital: DigitalConfig;

  // 6d. Vertraulichkeit (für Coaching/Beratung) — M4
  vertraulichkeit: VertraulichkeitConfig;

  // 6e. Force Majeure (M1)
  forceMajeureKlausel: boolean;

  // 7. Gewährleistung
  gewaehrleistung: GewaehrleistungConfig;

  // 8. Haftung
  haftung: HaftungsConfig;

  // 9. Datenschutz-Verweis
  datenschutzUrl: string;               // URL zur Datenschutzerklärung
  widerrufUrl: string;                  // URL zur Widerrufsbelehrung (B2C)

  // 10. Sonstiges
  gerichtsstand: string;                // bei B2B Gerichtsstand-Klausel
  erfuellungsort: string;               // bei B2B
  schiedsklausel: boolean;              // optional

  // H2 — VSBG-Teilnahme
  vsbgTeilnahmebereit: boolean;
  vsbgSchlichtungsstelle?: string;     // bei teilnahmebereit: konkrete Stelle

  // 11. Meta
  letztAktualisiert: string;
  erstelltAm: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Wizard-Steps
// ─────────────────────────────────────────────────────────────────────────────

export type WizardStep =
  | "variante"
  | "anbieter"
  | "leistung"
  | "zahlung"
  | "lieferung"
  | "haftung"
  | "review";

export const WIZARD_STEPS: { id: WizardStep; label: string; sub: string }[] = [
  { id: "variante",   label: "Variante",     sub: "B2C Service, B2C Shop oder B2B" },
  { id: "anbieter",   label: "Anbieter",     sub: "Du als Unternehmer" },
  { id: "leistung",   label: "Leistung",     sub: "Was bietest du an" },
  { id: "zahlung",    label: "Zahlung",      sub: "Bedingungen + Zahlungsarten" },
  { id: "lieferung",  label: "Lieferung",    sub: "Nur bei Shop / Versand" },
  { id: "haftung",    label: "Haftung",      sub: "Gewährleistung + Haftungsgrenzen" },
  { id: "review",     label: "Export",       sub: "HTML + PDF herunterladen" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Wann gilt §§ 327 ff. BGB (digitales Produkt / Dienstleistung)?
// ─────────────────────────────────────────────────────────────────────────────

export function isDigitaleArt(a: LeistungsArt): boolean {
  return a === "saas" || a === "digital_download" || a === "abo_service" || a === "fortbildung";
}

export function isDauerschuldArt(a: LeistungsArt): boolean {
  return a === "saas" || a === "abo_service" || a === "coaching";
}

// ─────────────────────────────────────────────────────────────────────────────
// Labels
// ─────────────────────────────────────────────────────────────────────────────

export const LEISTUNGSART_LABELS: Record<LeistungsArt, string> = {
  beratung: "Beratung",
  coaching: "Coaching / Training",
  agentur: "Agentur-Leistungen (Webdesign, Marketing, etc.)",
  fortbildung: "Online-Kurse / Workshops / Fortbildung",
  saas: "SaaS / Software-Abo",
  physisch: "Physische Ware",
  digital_download: "Digitale Produkte (Download)",
  abo_service: "Abo-Service / Mitgliedschaft",
  individuell: "Individuelle Leistung (Beschreibung erforderlich)",
};

export const ZAHLUNG_LABELS: Record<ZahlungsArt, string> = {
  vorkasse: "Vorkasse / Überweisung im Voraus",
  rechnung: "Kauf auf Rechnung",
  lastschrift: "SEPA-Lastschrift",
  stripe: "Stripe (Kreditkarte, Apple/Google Pay)",
  paypal: "PayPal",
  klarna: "Klarna (Sofort / Ratenkauf / Rechnung)",
  ueberweisung: "Standard-Überweisung",
};

export const VERTRAGSSCHLUSS_LABELS: Record<VertragsschlussArt, string> = {
  angebot_annahme: "Klassisch: Kundenangebot + meine Annahme",
  automatische_buchung: "Sofort-Buchung (Self-Service / Online-Shop)",
  auftragsbestaetigung: "Auftragsbestätigung per E-Mail",
};
