/**
 * Impressum-Contract
 * Validierung + HTML/Text-Builder für rechtssichere Ausgabe
 * Quelle: § 5 DDG + § 18 MStV + § 5 ECG (AT) + Art. 3 UWG (CH)
 */

import type { ImpressumData, WizardStep, Land } from "./types";
import { RECHTSFORM_LABELS, REGISTER_LABELS, GEWO_LABELS } from "./types";
import {
  rechtsformConfig,
  HAFTUNG_TEXTE,
  VSBG_TEXTE,
  OS_PLATTFORM_TEXT,
} from "./defaults";
import { escapeHtml } from "@/lib/utils";

/** Validierung — pro Step */
export function isAnbieterValid(d: ImpressumData): boolean {
  const cfg = rechtsformConfig(d.rechtsform);
  if (cfg.needsFirma && !d.firma.trim()) return false;
  if (cfg.needsVorname && (!d.vorname.trim() || !d.nachname.trim())) return false;
  if (d.rechtsform === "andere" && !d.rechtsformAndere?.trim()) return false;
  return true;
}

export function isKontaktValid(d: ImpressumData): boolean {
  const { strasse, plz, ort } = d.adresse;
  if (!strasse.trim() || !plz.trim() || !ort.trim()) return false;
  if (!d.kontakt.email.trim()) return false;
  // Email-Plausibilität
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.kontakt.email)) return false;
  // Schnelle Kontaktmöglichkeit nach § 5 DDG: Email + (Telefon ODER Kontaktformular)
  if (!d.kontakt.telefon?.trim() && !d.kontakt.kontaktformular?.trim()) return false;
  return true;
}

export function isRegisterValid(d: ImpressumData): boolean {
  const cfg = rechtsformConfig(d.rechtsform);
  if (cfg.needsRegister) {
    if (!d.register.art || !d.register.nummer?.trim() || !d.register.gericht?.trim()) {
      return false;
    }
  }
  return true;
}

export function isVertretungValid(d: ImpressumData): boolean {
  const cfg = rechtsformConfig(d.rechtsform);
  if (cfg.needsVertretung) {
    if (d.vertretung.length === 0) return false;
    for (const p of d.vertretung) {
      if (!p.vorname.trim() || !p.nachname.trim()) return false;
    }
  }
  if (d.beruf.aktiv) {
    if (!d.beruf.berufsbezeichnung?.trim() || !d.beruf.verleihungsstaat?.trim()) {
      return false;
    }
    // CRITICAL FIX #3: Kammer ODER Aufsichtsbehörde Pflicht (nicht Kammer allein).
    // Heilpraktiker haben nur Aufsichtsbehörde (Gesundheitsamt), keine Kammer.
    const hatKammer = !!d.beruf.kammer?.name?.trim();
    const hatAufsicht = !!d.beruf.aufsichtsbehoerde?.name?.trim();
    if (!hatKammer && !hatAufsicht) return false;
    if (!d.beruf.berufsrechtlicheRegelungen?.trim()) return false;
  }
  // CRITICAL FIX #1: § 34 GewO-Erlaubnispflichten
  if (d.gewerbeerlaubnis?.aktiv) {
    if (!d.gewerbeerlaubnis.typ) return false;
    if (!d.gewerbeerlaubnis.erlaubnisbehoerde?.trim()) return false;
    // Registernummer nur Pflicht bei 34d/34f/34h/34i, nicht bei 34c
    if (d.gewerbeerlaubnis.typ !== "gewo_34c" && !d.gewerbeerlaubnis.registernummer?.trim()) {
      return false;
    }
  }
  // HIGH FIX #5: AG braucht Aufsichtsratsvorsitzenden (§ 80 AktG)
  if (d.rechtsform === "ag") {
    const a = d.aufsichtsratsvorsitzender;
    if (!a?.vorname?.trim() || !a?.nachname?.trim()) return false;
  }
  // HIGH FIX #6: e.V. / Stiftung Vereinszweck-Pflichten
  if ((d.rechtsform === "ev" || d.rechtsform === "stiftung") && d.vereinszusatz?.aktiv) {
    if (!d.vereinszusatz.vereinszweck?.trim()) return false;
    if (d.vereinszusatz.gemeinnuetzig && !d.vereinszusatz.freistellungsbescheidVon?.trim()) {
      return false;
    }
    if (d.rechtsform === "stiftung" && !d.vereinszusatz.stiftungsbehoerde?.trim()) return false;
  }
  // HIGH FIX #8: Berufshaftpflicht — wenn aktiv, alle 3 Felder Pflicht
  if (d.beruf.aktiv && d.beruf.haftpflicht?.aktiv) {
    if (!d.beruf.haftpflicht.versicherer?.trim()) return false;
    if (!d.beruf.haftpflicht.anschrift?.trim()) return false;
    if (!d.beruf.haftpflicht.geltungsbereich?.trim()) return false;
  }
  return true;
}

export function isZusatzValid(d: ImpressumData): boolean {
  if (d.redaktion.aktiv) {
    const v = d.redaktion.verantwortlicher;
    if (!v) return false;
    if (!v.vorname.trim() || !v.nachname.trim()) return false;
    if (!v.strasse.trim() || !v.plz.trim() || !v.ort.trim()) return false;
  }
  return true;
}

export function getCompletionStatus(d: ImpressumData) {
  const checks: Record<WizardStep, boolean> = {
    anbieter: isAnbieterValid(d),
    kontakt: isKontaktValid(d),
    register: isRegisterValid(d),
    vertretung: isVertretungValid(d),
    zusatz: isZusatzValid(d),
    review: true,
  };
  const total = Object.keys(checks).length - 1; // review zählt nicht
  const completedCount = Object.entries(checks).filter(
    ([k, v]) => k !== "review" && v,
  ).length;
  return { checks, total, completedCount };
}

/** Anbieter-Block: Name + Firma je nach Rechtsform */
function buildAnbieterText(d: ImpressumData): string {
  const cfg = rechtsformConfig(d.rechtsform);
  const lines: string[] = [];

  if (cfg.juristisch && d.firma) {
    // Bei juristischen Personen: Firma in voller Form
    if (d.rechtsform === "andere" && d.rechtsformAndere) {
      lines.push(`${d.firma} (${d.rechtsformAndere})`);
    } else {
      lines.push(d.firma);
    }
  } else {
    // Bei natürlichen Personen: Vorname + Nachname
    const name = `${d.vorname} ${d.nachname}`.trim();
    if (d.firma) {
      // Einzelunternehmer mit Firmenname (z.B. "Müller IT-Service · Inh. Max Müller")
      lines.push(d.firma);
      lines.push(`${d.inhaberzusatz || "Inh."} ${name}`);
    } else {
      lines.push(name);
    }
  }

  return lines.join("\n");
}

function buildAdresseText(d: ImpressumData): string {
  const { strasse, plz, ort } = d.adresse;
  return `${strasse}\n${plz} ${ort}`;
}

function buildKontaktText(d: ImpressumData): string {
  const lines: string[] = [];
  if (d.kontakt.telefon) lines.push(`Telefon: ${d.kontakt.telefon}`);
  if (d.kontakt.fax) lines.push(`Telefax: ${d.kontakt.fax}`);
  lines.push(`E-Mail: ${d.kontakt.email}`);
  if (d.kontakt.kontaktformular) lines.push(`Kontaktformular: ${d.kontakt.kontaktformular}`);
  return lines.join("\n");
}

function buildVertretungText(d: ImpressumData): string | null {
  if (d.vertretung.length === 0) return null;
  const cfg = rechtsformConfig(d.rechtsform);
  if (!cfg.needsVertretung) return null;

  // HIGH FIX #7: GbR braucht ALLE Gesellschafter (BGH 2009 Rechtsfähigkeit)
  const label =
    d.rechtsform === "gmbh" || d.rechtsform === "ug"
      ? "Vertretungsberechtigter Geschäftsführer"
      : d.rechtsform === "ag"
        ? "Vertretungsberechtigter Vorstand"
        : d.rechtsform === "ev" || d.rechtsform === "stiftung"
          ? "Vertretungsberechtigter Vorstand"
          : d.rechtsform === "gbr"
            ? "Vertretungsberechtigte Gesellschafter (alle Gesellschafter)"
            : "Vertretungsberechtigt";

  const names = d.vertretung
    .map((p) => `${p.vorname} ${p.nachname}${p.rolle ? ` (${p.rolle})` : ""}`)
    .join(", ");

  const lines = [`${label}: ${names}`];

  // HIGH FIX #5: AG-Aufsichtsratsvorsitzender (§ 80 AktG)
  if (d.rechtsform === "ag" && d.aufsichtsratsvorsitzender) {
    const a = d.aufsichtsratsvorsitzender;
    if (a.vorname?.trim() && a.nachname?.trim()) {
      lines.push(`Aufsichtsratsvorsitzender: ${a.vorname} ${a.nachname}`);
    }
  }

  return lines.join("\n");
}

/**
 * HIGH FIX #6: Vereins-/Stiftungs-Spezifika-Block
 */
function buildVereinszusatzText(d: ImpressumData): string | null {
  if (!(d.rechtsform === "ev" || d.rechtsform === "stiftung")) return null;
  if (!d.vereinszusatz?.aktiv) return null;
  const lines: string[] = [];
  if (d.vereinszusatz.vereinszweck) {
    lines.push(`Vereinszweck: ${d.vereinszusatz.vereinszweck}`);
  }
  if (d.rechtsform === "stiftung" && d.vereinszusatz.stiftungsbehoerde) {
    lines.push(`Stiftungsbehörde: ${d.vereinszusatz.stiftungsbehoerde}`);
  }
  if (d.vereinszusatz.gemeinnuetzig) {
    let g = "Steuerlich begünstigt als gemeinnützig gemäß § 52 AO.";
    if (d.vereinszusatz.freistellungsbescheidVon) {
      g += ` Freistellungsbescheid des ${d.vereinszusatz.freistellungsbescheidVon}.`;
    }
    lines.push(g);
  }
  return lines.length > 0 ? lines.join("\n\n") : null;
}

function buildRegisterText(d: ImpressumData): string | null {
  if (!d.register.art || !d.register.nummer) return null;
  const label = REGISTER_LABELS[d.register.art];
  const lines = [
    `Registereintrag: ${label}`,
    `Registernummer: ${d.register.nummer}`,
  ];
  if (d.register.gericht) lines.push(`Registergericht: ${d.register.gericht}`);
  return lines.join("\n");
}

function buildSteuerText(d: ImpressumData): string | null {
  const lines: string[] = [];
  if (d.steuer.ustId) {
    lines.push(`Umsatzsteuer-Identifikationsnummer (§ 27a UStG):\n${d.steuer.ustId}`);
  }
  if (d.steuer.wirtschaftsId) {
    lines.push(`Wirtschafts-Identifikationsnummer (§ 139c AO):\n${d.steuer.wirtschaftsId}`);
  }
  if (!d.steuer.ustId && d.steuer.steuernummer) {
    lines.push(`Steuernummer: ${d.steuer.steuernummer}`);
  }
  if (d.steuer.kleinunternehmer) {
    lines.push(
      `Hinweis: Aufgrund der Kleinunternehmerregelung gemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen.`,
    );
  }
  return lines.length > 0 ? lines.join("\n\n") : null;
}

function buildStammkapitalText(d: ImpressumData): string | null {
  if (!d.stammkapital?.trim()) return null;
  return `Stammkapital: ${d.stammkapital}`;
}

function buildBerufText(d: ImpressumData): string | null {
  if (!d.beruf.aktiv) return null;
  const lines: string[] = ["Angaben zum reglementierten Beruf:"];
  if (d.beruf.berufsbezeichnung) {
    lines.push(`Berufsbezeichnung: ${d.beruf.berufsbezeichnung}`);
  }
  if (d.beruf.verleihungsstaat) {
    lines.push(`Verleihender Staat: ${d.beruf.verleihungsstaat}`);
  }
  if (d.beruf.kammer?.name) {
    let kammer = `Zuständige Kammer: ${d.beruf.kammer.name}`;
    if (d.beruf.kammer.adresse) kammer += `, ${d.beruf.kammer.adresse}`;
    if (d.beruf.kammer.webseite) kammer += ` (${d.beruf.kammer.webseite})`;
    lines.push(kammer);
  }
  if (d.beruf.aufsichtsbehoerde?.name) {
    let auf = `Aufsichtsbehörde: ${d.beruf.aufsichtsbehoerde.name}`;
    if (d.beruf.aufsichtsbehoerde.adresse) auf += `, ${d.beruf.aufsichtsbehoerde.adresse}`;
    if (d.beruf.aufsichtsbehoerde.webseite) auf += ` (${d.beruf.aufsichtsbehoerde.webseite})`;
    lines.push(auf);
  }
  if (d.beruf.berufsrechtlicheRegelungen) {
    lines.push(`Berufsrechtliche Regelungen: ${d.beruf.berufsrechtlicheRegelungen}`);
  }
  if (d.beruf.zugaenglichUnter) {
    lines.push(`Einsehbar unter: ${d.beruf.zugaenglichUnter}`);
  }
  return lines.join("\n");
}

/**
 * HIGH FIX #8: Berufshaftpflicht-Versicherung
 * Pflichtangabe für freie Berufe (Anwalt § 51 BRAO, StB § 67 StBerG,
 * Arzt BO § 21, Architekt HOAI). Eigener Block für bessere Sichtbarkeit.
 */
function buildBerufshaftpflichtText(d: ImpressumData): string | null {
  const h = d.beruf?.haftpflicht;
  if (!d.beruf.aktiv || !h?.aktiv) return null;
  if (!h.versicherer || !h.anschrift || !h.geltungsbereich) return null;
  return [
    `Versicherer: ${h.versicherer}`,
    `Anschrift: ${h.anschrift}`,
    `Räumlicher Geltungsbereich: ${h.geltungsbereich}`,
  ].join("\n");
}

function buildRedaktionText(d: ImpressumData): string | null {
  if (!d.redaktion.aktiv || !d.redaktion.verantwortlicher) return null;
  const v = d.redaktion.verantwortlicher;
  return `Inhaltlich verantwortlich gemäß § 18 Abs. 2 MStV:\n${v.vorname} ${v.nachname}\n${v.strasse}\n${v.plz} ${v.ort}`;
}

function buildVsbgText(d: ImpressumData): string | null {
  // CRITICAL FIX #2: OS-Plattform-Link von VSBG entkoppeln (separater Block).
  // VSBG-Text nur noch für die Schlichtungs-Teilnahme-Aussage.
  if (!d.vsbg.istB2c && d.vsbg.teilnahme === "nein") {
    return VSBG_TEXTE.nein;
  }
  return VSBG_TEXTE[d.vsbg.teilnahme];
}

/**
 * CRITICAL FIX #2: Art. 14 Abs. 1 ODR-VO — Pflicht-Link für B2C-Online-Händler
 * UNABHÄNGIG von der VSBG-Teilnahme. Pflicht, sobald Verkauf an Verbraucher
 * stattfindet.
 */
function buildOsPlattformText(d: ImpressumData): string | null {
  if (!d.vsbg.istB2c) return null;
  return OS_PLATTFORM_TEXT;
}

/**
 * CRITICAL FIX #1: § 34 GewO-Erlaubnis-Block
 * Pflicht im Impressum bei gewerblicher Tätigkeit nach § 34c-i GewO
 * (Makler, Versicherer, Finanzanlagenvermittler etc.).
 */
function buildGewerbeerlaubnisText(d: ImpressumData): string | null {
  const g = d.gewerbeerlaubnis;
  if (!g?.aktiv || !g.typ) return null;
  const info = GEWO_LABELS[g.typ];
  const lines: string[] = [
    `Erlaubnis nach ${info.kurz} (${info.lang})`,
    "",
  ];
  if (g.erlaubnisbehoerde) {
    let beh = `Erlaubnisbehörde: ${g.erlaubnisbehoerde}`;
    if (g.erlaubnisbehoerdeAdresse) beh += `, ${g.erlaubnisbehoerdeAdresse}`;
    lines.push(beh);
  }
  if (g.registernummer) {
    lines.push(`Registernummer: ${g.registernummer}`);
  }
  const registerUrl = g.vermittlerregisterUrl ?? info.defaultRegisterUrl;
  if (registerUrl) {
    lines.push(`Vermittlerregister: ${registerUrl}`);
  }
  return lines.join("\n");
}

function buildHaftungText(d: ImpressumData): string | null {
  const blocks: string[] = [];
  if (d.haftung.haftungInhalte) blocks.push(HAFTUNG_TEXTE.haftungInhalte);
  if (d.haftung.haftungLinks) blocks.push(HAFTUNG_TEXTE.haftungLinks);
  if (d.haftung.urheberrecht) blocks.push(HAFTUNG_TEXTE.urheberrecht);
  return blocks.length > 0 ? blocks.join("\n\n") : null;
}

export type Section = {
  id: string;
  title?: string;
  body: string;
};

/** Strukturierte Sektionen für PDF + Preview */
export function buildSections(d: ImpressumData): Section[] {
  const sections: Section[] = [];

  // Block 1: Anbieter + Adresse
  const anbieter = buildAnbieterText(d);
  const adresse = buildAdresseText(d);
  sections.push({
    id: "anbieter",
    title: "Angaben gemäß § 5 DDG",
    body: `${anbieter}\n\n${adresse}`,
  });

  // Block 2: Kontakt
  sections.push({
    id: "kontakt",
    title: "Kontakt",
    body: buildKontaktText(d),
  });

  // Block 3: Vertretung (falls vorhanden)
  const vertretung = buildVertretungText(d);
  if (vertretung) {
    sections.push({ id: "vertretung", title: "Vertretung", body: vertretung });
  }

  // Block 4: Register
  const register = buildRegisterText(d);
  if (register) {
    sections.push({ id: "register", title: "Registereintrag", body: register });
  }

  // Block 5: Stammkapital
  const stammkapital = buildStammkapitalText(d);
  if (stammkapital) {
    sections.push({ id: "stammkapital", body: stammkapital });
  }

  // Block 6: Steuer
  const steuer = buildSteuerText(d);
  if (steuer) {
    sections.push({ id: "steuer", title: "Steuerangaben", body: steuer });
  }

  // Block 6b: Vereinszusatz (HIGH FIX #6) — direkt nach Steuer für e.V./Stiftung
  const verein = buildVereinszusatzText(d);
  if (verein) {
    sections.push({
      id: "vereinszusatz",
      title: d.rechtsform === "stiftung" ? "Angaben zur Stiftung" : "Angaben zum Verein",
      body: verein,
    });
  }

  // Block 7: Reglementierter Beruf
  const beruf = buildBerufText(d);
  if (beruf) {
    sections.push({ id: "beruf", body: beruf });
  }

  // Block 7a: Berufshaftpflicht-Versicherung (HIGH FIX #8)
  const haftpflicht = buildBerufshaftpflichtText(d);
  if (haftpflicht) {
    sections.push({
      id: "berufshaftpflicht",
      title: "Berufshaftpflichtversicherung",
      body: haftpflicht,
    });
  }

  // Block 7b: § 34 GewO-Tätigkeit (CRITICAL FIX #1)
  const gewo = buildGewerbeerlaubnisText(d);
  if (gewo) {
    sections.push({
      id: "gewerbeerlaubnis",
      title: "Erlaubnispflichtige Tätigkeit (§ 34 GewO)",
      body: gewo,
    });
  }

  // Block 8: § 18 MStV — HIGH FIX #4: V.i.S.d.P. als alternative Bezeichnung im Titel
  const redaktion = buildRedaktionText(d);
  if (redaktion) {
    sections.push({
      id: "redaktion",
      title: "Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV — V.i.S.d.P.)",
      body: redaktion,
    });
  }

  // Block 9: Verbraucherschlichtung
  const vsbg = buildVsbgText(d);
  if (vsbg) {
    sections.push({ id: "vsbg", title: "Verbraucherschlichtung", body: vsbg });
  }

  // Block 9b: OS-Plattform-Link (CRITICAL FIX #2) — eigener Block, Art. 14 ODR-VO
  const osPlatform = buildOsPlattformText(d);
  if (osPlatform) {
    sections.push({ id: "os_plattform", title: "Online-Streitbeilegung (OS)", body: osPlatform });
  }

  // Block 10: Haftung
  const haftung = buildHaftungText(d);
  if (haftung) {
    sections.push({ id: "haftung", body: haftung });
  }

  return sections;
}

export type BuildOptions = {
  /** Compliflow-Credit-Backlink am Ende einfügen (Standard: true = Free-Tier) */
  credit?: boolean;
};

/** HTML-Snippet zum Einfügen in eigene Webseite */
export function buildHtml(d: ImpressumData, options: BuildOptions = {}): string {
  const credit = options.credit !== false;
  const sections = buildSections(d);
  const parts: string[] = [];
  parts.push('<section class="impressum">');
  parts.push("  <h1>Impressum</h1>");

  for (const sec of sections) {
    if (sec.title) {
      parts.push(`  <h2>${escapeHtml(sec.title)}</h2>`);
    }
    const lines = sec.body.split("\n").map((l) => escapeHtml(l));
    parts.push(`  <p>${lines.join("<br>")}</p>`);
  }

  if (credit) {
    parts.push(
      `  <p class="compliflow-credit" style="margin-top:2rem;font-size:0.8rem;color:#666;border-top:1px solid #eee;padding-top:1rem;">Erstellt mit <a href="https://compliflow.de?ref=embed-impressum" rel="noopener" target="_blank">Compliflow</a> — kostenloser Impressum-Generator</p>`,
    );
  }

  parts.push("</section>");
  parts.push("");
  parts.push(`<!-- Erstellt mit Compliflow · compliflow.de · made by DRVN -->`);
  parts.push(
    `<!-- Stand: ${d.letztAktualisiert} -->`,
  );
  return parts.join("\n");
}

/** Plaintext (für Copy-Paste oder Mail) */
export function buildPlaintext(d: ImpressumData, options: BuildOptions = {}): string {
  const credit = options.credit !== false;
  const sections = buildSections(d);
  const parts: string[] = ["IMPRESSUM\n"];
  for (const sec of sections) {
    if (sec.title) parts.push(`\n${sec.title}\n${"─".repeat(sec.title.length)}`);
    parts.push(sec.body);
    parts.push("");
  }
  if (credit) {
    parts.push("\n---");
    parts.push(`Erstellt mit Compliflow (https://compliflow.de) — kostenloser Impressum-Generator`);
  }
  parts.push(`Stand: ${d.letztAktualisiert}`);
  return parts.join("\n");
}

/** Land-spezifischer Header (zukünftig: AT / CH-Varianten) */
export function getLandHeader(land: Land): string {
  switch (land) {
    case "DE":
      return "Angaben gemäß § 5 DDG";
    case "AT":
      return "Angaben gemäß § 5 ECG / § 25 MedienG";
    case "CH":
      return "Angaben gemäß Art. 3 UWG";
  }
}
