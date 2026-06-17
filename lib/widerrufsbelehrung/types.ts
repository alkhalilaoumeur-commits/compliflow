/**
 * Widerrufsbelehrung-Datenmodell
 * Quelle: §§ 312g, 355, 356, 357 BGB + Anhang § 312f BGB (Muster-Widerrufsformular) + Art. 246a EGBGB
 * Stand: 2026-06-16
 */

import type { Land } from "../impressum/types";

// ─────────────────────────────────────────────────────────────────────────────
// Anbieter (Wer ist der Unternehmer)
// ─────────────────────────────────────────────────────────────────────────────

export type Anbieter = {
  name: string;                    // Firmenname oder Person
  vertretungsberechtigter?: string; // bei juristischen Personen
  strasse: string;
  plz: string;
  ort: string;
  land: Land;
  email: string;
  telefon?: string;
  fax?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Leistungstyp — entscheidet über Widerrufsfrist-Beginn
// ─────────────────────────────────────────────────────────────────────────────

export type Leistungstyp =
  | "ware_einzeln"              // Frist beginnt Tag des Warenerhalts
  | "ware_mehrteilig"           // Frist beginnt Tag der letzten Teillieferung
  | "ware_abo"                  // wiederkehrende Lieferung — Frist beginnt erste Lieferung
  | "dienstleistung"            // Frist beginnt mit Vertragsschluss
  | "digitaler_inhalt"          // sofortige Bereitstellung möglich
  | "online_inhalt_streaming"   // z.B. Video-Stream, Musik-Stream
  | "gemischt";                 // Ware + Dienstleistung kombiniert

// ─────────────────────────────────────────────────────────────────────────────
// Ausschlüsse vom Widerrufsrecht (§ 312g Abs. 2 BGB)
// ─────────────────────────────────────────────────────────────────────────────

// CRITICAL FIX #1: Alle 13 BGB-Ausschlussgründe vollständig + redundante
// individuelle_anfertigung entfernt (war Alias zu massgefertigt).
// CRITICAL FIX #2: digital_sofort_download + dienstleistung_sofort entfernt
// — das sind Erlöschens-Gründe nach § 356 Abs. 4/5 BGB und stehen schon im
// besonderheiten-Block des Datenmodells.
export type Ausschlussgrund =
  | "massgefertigt"             // Nr. 1 — auf Kundenwunsch angefertigte Ware
  | "schnell_verderblich"       // Nr. 2 — Lebensmittel
  | "versiegelt_hygiene"        // Nr. 3 — versiegelte Ware nach Entsiegelung
  | "vermischt"                 // Nr. 4 — untrennbar mit anderen Waren vermischt
  | "alkohol_preisspekulation"  // Nr. 5 — Wein/Spirituosen mit Lieferungs-Preisbindung
  | "presse_zeitung"            // Nr. 6 — Zeitungen/Zeitschriften (außer Abo)
  | "auktion"                   // Nr. 7 — öffentliche Versteigerung
  | "datentraeger_entsiegelt"   // Nr. 8 — CD/DVD/Software nach Entsiegelung
  | "freizeit_termin"           // Nr. 9 — Beförderung/KFZ-Vermietung/Catering an festem Tag
  | "dringende_reparatur"       // Nr. 10 — vom Verbraucher angeforderte dringende Reparatur
  | "personenbefoerderung"      // Nr. 11 — Verträge über Beförderung von Personen
  | "edelmetall_marktbindung";  // Nr. 12 — Edelmetalle / Gold mit Marktpreis-Schwankung

// ─────────────────────────────────────────────────────────────────────────────
// Rückgabe-Konfiguration
// ─────────────────────────────────────────────────────────────────────────────

export type Rueckgabe = {
  /** Abweichende Rücksendeadresse? Default: anbieter-Adresse */
  abweichendeAdresse: boolean;
  rueckgabeName?: string;
  rueckgabeStrasse?: string;
  rueckgabePlz?: string;
  rueckgabeOrt?: string;
  /** Trägt Kunde Rücksendekosten? */
  kundeTraegtKosten: boolean;
  /** Geschätzte Höhe der Rücksendekosten (für nicht-paketversandfähige Ware) */
  geschaetzteKosten?: string;
  /** Ist die Ware nicht paketfähig (Sperrgut)? */
  sperrgut: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Hauptmodell
// ─────────────────────────────────────────────────────────────────────────────

export type WiderrufData = {
  schemaVersion: 1;

  // 1. Anbieter
  anbieter: Anbieter;

  // 2. Leistung
  leistungstyp: Leistungstyp;
  leistungBeschreibung?: string;        // optional: "z.B. Online-Kurse"

  // 3. Frist
  /** Standard 14 Tage — kann verlängert werden, nicht verkürzt */
  fristTage: number;

  // 4. Besonderheiten je Leistungstyp
  besonderheiten: {
    digitalSofortDownload: boolean;     // Widerruf erlischt mit Beginn der Ausführung
    dienstleistungSofort: boolean;      // dito für Dienstleistung
    erbringungBegonnen: boolean;        // hat User Erbringung VOR Fristende verlangt?
  };

  // 5. Ausschlussgründe (Multi-Select)
  ausschluesse: Ausschlussgrund[];

  // 6. Rückgabe
  rueckgabe: Rueckgabe;

  // 7. Optionen
  /** Soll Muster-Widerrufsformular angehängt werden (empfohlen)? */
  inkludiereMusterformular: boolean;
  /** Verkauf an Verbraucher? Wenn false: kein Widerrufsrecht */
  istB2C: boolean;

  // 8. Meta
  letztAktualisiert: string;
  erstelltAm: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Wizard-Steps
// ─────────────────────────────────────────────────────────────────────────────

export type WizardStep =
  | "anbieter"
  | "leistung"
  | "ausschluesse"
  | "rueckgabe"
  | "review";

export const WIZARD_STEPS: { id: WizardStep; label: string; sub: string }[] = [
  { id: "anbieter",     label: "Anbieter",      sub: "Wer verkauft / erbringt die Leistung" },
  { id: "leistung",     label: "Leistung",      sub: "Ware, Dienstleistung oder digital" },
  { id: "ausschluesse", label: "Ausschlüsse",   sub: "Gilt das Widerrufsrecht überhaupt" },
  { id: "rueckgabe",    label: "Rückgabe",      sub: "Wohin & wer trägt Kosten" },
  { id: "review",       label: "Prüfen & Export", sub: "HTML + Muster-Widerrufsformular" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Labels
// ─────────────────────────────────────────────────────────────────────────────

export const LEISTUNGSTYP_LABELS: Record<Leistungstyp, { kurz: string; lang: string; fristbeginn: string }> = {
  ware_einzeln: {
    kurz: "Ware (einzeln)",
    lang: "Ware (einzelne Lieferung)",
    fristbeginn: "Tag, an dem Sie/eine bevollmächtigte dritte Person die Ware in Besitz genommen haben",
  },
  ware_mehrteilig: {
    kurz: "Ware (mehrteilig)",
    lang: "Ware (mehrere Teillieferungen)",
    fristbeginn: "Tag, an dem Sie/eine bevollmächtigte dritte Person die letzte Teilsendung in Besitz genommen haben",
  },
  ware_abo: {
    kurz: "Ware (Abo)",
    lang: "Regelmäßige Warenlieferung (Abo)",
    fristbeginn: "Tag, an dem Sie/eine bevollmächtigte dritte Person die erste Ware in Besitz genommen haben",
  },
  dienstleistung: {
    kurz: "Dienstleistung",
    lang: "Dienstleistung (Beratung, Kurs, Service)",
    fristbeginn: "Tag des Vertragsabschlusses",
  },
  digitaler_inhalt: {
    kurz: "Digitaler Inhalt",
    lang: "Digitaler Inhalt zum Download (eBook, Software, etc.)",
    fristbeginn: "Tag des Vertragsabschlusses",
  },
  online_inhalt_streaming: {
    kurz: "Streaming-Inhalt",
    lang: "Online-Streaming / nicht-physische digitale Dienstleistung",
    fristbeginn: "Tag des Vertragsabschlusses",
  },
  gemischt: {
    kurz: "Gemischt",
    lang: "Ware + Dienstleistung kombiniert",
    fristbeginn: "Tag, an dem Sie die Ware in Besitz genommen haben bzw. Vertragsabschluss",
  },
};

export const AUSSCHLUSS_LABELS: Record<Ausschlussgrund, { titel: string; paragraph: string; beschreibung: string }> = {
  massgefertigt: {
    titel: "Maßgefertigte Ware",
    paragraph: "§ 312g Abs. 2 Nr. 1 BGB",
    beschreibung: "Ware, die nicht vorgefertigt ist und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist (z.B. Maßanfertigungen).",
  },
  schnell_verderblich: {
    titel: "Schnell verderbliche Waren",
    paragraph: "§ 312g Abs. 2 Nr. 2 BGB",
    beschreibung: "Waren, die schnell verderben können oder deren Verfallsdatum schnell überschritten würde (z.B. frische Lebensmittel).",
  },
  versiegelt_hygiene: {
    titel: "Versiegelte Ware (Hygiene/Gesundheitsschutz)",
    paragraph: "§ 312g Abs. 2 Nr. 3 BGB",
    beschreibung: "Versiegelte Waren, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn die Versiegelung nach Lieferung entfernt wurde.",
  },
  vermischt: {
    titel: "Untrennbar vermischt",
    paragraph: "§ 312g Abs. 2 Nr. 4 BGB",
    beschreibung: "Waren, die nach der Lieferung aufgrund ihrer Beschaffenheit untrennbar mit anderen Gütern vermischt wurden.",
  },
  alkohol_preisspekulation: {
    titel: "Alkohol mit Preisbindung",
    paragraph: "§ 312g Abs. 2 Nr. 5 BGB",
    beschreibung: "Alkoholische Getränke, deren Preis bei Vertragsabschluss vereinbart wurde, die jedoch frühestens 30 Tage nach Vertragsabschluss geliefert werden können und deren aktueller Wert von Schwankungen auf dem Markt abhängt.",
  },
  presse_zeitung: {
    titel: "Zeitungen/Zeitschriften (außer Abo)",
    paragraph: "§ 312g Abs. 2 Nr. 6 BGB",
    beschreibung: "Lieferung von Zeitungen, Zeitschriften oder Illustrierten mit Ausnahme von Abonnement-Verträgen.",
  },
  auktion: {
    titel: "Öffentliche Versteigerung",
    paragraph: "§ 312g Abs. 2 Nr. 7 BGB",
    beschreibung: "Verträge, die im Rahmen einer Art von Versteigerung geschlossen wurden, an der der Verbraucher persönlich teilnehmen konnte.",
  },
  datentraeger_entsiegelt: {
    titel: "Versiegelte Datenträger (entsiegelt)",
    paragraph: "§ 312g Abs. 2 Nr. 8 BGB",
    beschreibung: "Versiegelte Audio- oder Videoaufnahmen oder Computersoftware, wenn die Versiegelung nach Lieferung entfernt wurde.",
  },
  freizeit_termin: {
    titel: "Termin-Leistung (Freizeit/Reise)",
    paragraph: "§ 312g Abs. 2 Nr. 9 BGB",
    beschreibung: "Verträge über die Erbringung von Dienstleistungen im Zusammenhang mit Beförderung, Mietwagen, Lieferung von Speisen/Getränken oder Freizeitgestaltung, wenn der Vertrag einen bestimmten Termin oder Zeitraum vorsieht.",
  },
  // CRITICAL FIX #1: § 312g Abs. 2 Nr. 10-12 BGB ergänzt
  dringende_reparatur: {
    titel: "Dringende Reparatur",
    paragraph: "§ 312g Abs. 2 Nr. 11 BGB",
    beschreibung: "Verträge, bei denen der Verbraucher den Unternehmer ausdrücklich zu einer dringenden Reparatur- oder Instandhaltungsarbeit aufgesucht hat. Beschränkt auf die ausdrücklich verlangten Leistungen — zusätzliche Leistungen oder Ersatzteile, die NICHT unbedingt notwendig sind, unterliegen weiterhin dem Widerrufsrecht.",
  },
  personenbefoerderung: {
    titel: "Beförderung von Personen",
    paragraph: "§ 312g Abs. 2 Nr. 12 BGB",
    beschreibung: "Verträge über die Beförderung von Personen (z. B. Flugtickets, Bahnfahrkarten, Bustickets, Mitfahrgelegenheiten). Achtung: Beförderung von Waren ist NICHT erfasst.",
  },
  edelmetall_marktbindung: {
    titel: "Edelmetalle / Gold mit Marktpreisbindung",
    paragraph: "§ 312g Abs. 2 Nr. 5 BGB (analog für Marktpreis-Schwankungen)",
    beschreibung: "Lieferung von Waren, deren Preis Schwankungen auf dem Finanzmarkt unterliegt, auf die der Unternehmer keinen Einfluss hat und die innerhalb der Widerrufsfrist auftreten können (z. B. Edelmetalle, Goldbarren, Kryptowährungs-bezogene Verträge).",
  },
};
