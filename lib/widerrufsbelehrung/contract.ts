/**
 * Widerrufsbelehrung-Contract
 * Validierung + HTML/Plaintext-Builder + Backlink
 * Quelle: Anhang § 312f BGB
 */

import type { WiderrufData, WizardStep, Leistungstyp, Ausschlussgrund } from "./types";
import { LEISTUNGSTYP_LABELS, AUSSCHLUSS_LABELS } from "./types";
import { TEXTE } from "./defaults";

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

export function isAnbieterValid(d: WiderrufData): boolean {
  const a = d.anbieter;
  if (!a.name.trim()) return false;
  if (!a.strasse.trim() || !a.plz.trim() || !a.ort.trim()) return false;
  if (!a.email.trim()) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email)) return false;
  return true;
}

export function isLeistungValid(d: WiderrufData): boolean {
  if (!d.leistungstyp) return false;
  if (d.fristTage < 14) return false; // mindestens 14 Tage Pflicht
  return true;
}

export function isAusschluesseValid(_d: WiderrufData): boolean {
  return true; // immer ok — optional
}

export function isRueckgabeValid(d: WiderrufData): boolean {
  if (d.rueckgabe.abweichendeAdresse) {
    if (!d.rueckgabe.rueckgabeName?.trim()) return false;
    if (!d.rueckgabe.rueckgabeStrasse?.trim()) return false;
    if (!d.rueckgabe.rueckgabePlz?.trim()) return false;
    if (!d.rueckgabe.rueckgabeOrt?.trim()) return false;
  }
  if (d.rueckgabe.sperrgut && !d.rueckgabe.geschaetzteKosten?.trim()) return false;
  return true;
}

export type CompletionStatus = {
  checks: Record<WizardStep, boolean>;
  allValid: boolean;
};

export function getCompletionStatus(d: WiderrufData): CompletionStatus {
  const checks: Record<WizardStep, boolean> = {
    anbieter: isAnbieterValid(d),
    leistung: isLeistungValid(d),
    ausschluesse: isAusschluesseValid(d),
    rueckgabe: isRueckgabeValid(d),
    review: true,
  };
  return { checks, allValid: Object.values(checks).every(Boolean) };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const para = (text: string): string => `<p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>`;
const heading = (level: 1 | 2 | 3, text: string): string => `<h${level}>${escapeHtml(text)}</h${level}>`;
const list = (items: string[]): string =>
  `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;

function escapeHtmlPreserveBold(s: string): string {
  const placeholder: string[] = [];
  const SENTINEL = "";
  const withPlaceholders = s.replace(/\*\*([^*]+)\*\*/g, (_m, inner) => {
    placeholder.push(`<strong>${escapeHtml(inner)}</strong>`);
    return `${SENTINEL}${placeholder.length - 1}${SENTINEL}`;
  });
  const escaped = escapeHtml(withPlaceholders);
  return escaped.replace(new RegExp(`${SENTINEL}(\\d+)${SENTINEL}`, "g"), (_m, idx) => placeholder[Number(idx)]);
}

function mdSectionToHtml(md: string): string {
  const blocks = md.split(/\n\n+/);
  return blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("## ")) return heading(2, trimmed.slice(3));
      if (trimmed.startsWith("### ")) return heading(3, trimmed.slice(4));
      if (trimmed.startsWith("- ")) {
        const items = trimmed.split("\n").map((l) => l.replace(/^- /, "").trim());
        return `<ul>${items.map((i) => `<li>${escapeHtmlPreserveBold(i)}</li>`).join("")}</ul>`;
      }
      return `<p>${escapeHtmlPreserveBold(trimmed).replace(/\n/g, "<br>")}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}

function formatAdresse(d: WiderrufData): string {
  const a = d.anbieter;
  return `${a.strasse}, ${a.plz} ${a.ort}`;
}

function formatRueckgabeAdresse(d: WiderrufData): string {
  if (d.rueckgabe.abweichendeAdresse) {
    return `${d.rueckgabe.rueckgabeName ?? ""}, ${d.rueckgabe.rueckgabeStrasse ?? ""}, ${d.rueckgabe.rueckgabePlz ?? ""} ${d.rueckgabe.rueckgabeOrt ?? ""}`;
  }
  return `${d.anbieter.name}, ${formatAdresse(d)}`;
}

function fristbeginnText(d: WiderrufData): string {
  const t = d.leistungstyp;
  const tage = d.fristTage;
  if (t === "ware_einzeln") return TEXTE.widerrufsfrist_ware_einzeln.replace(/\{\{TAGE\}\}/g, String(tage));
  if (t === "ware_mehrteilig") return TEXTE.widerrufsfrist_ware_mehrteilig.replace(/\{\{TAGE\}\}/g, String(tage));
  if (t === "ware_abo") return TEXTE.widerrufsfrist_ware_abo.replace(/\{\{TAGE\}\}/g, String(tage));
  if (t === "dienstleistung") return TEXTE.widerrufsfrist_dienstleistung.replace(/\{\{TAGE\}\}/g, String(tage));
  if (t === "digitaler_inhalt" || t === "online_inhalt_streaming")
    return TEXTE.widerrufsfrist_digital.replace(/\{\{TAGE\}\}/g, String(tage));
  if (t === "gemischt") return TEXTE.widerrufsfrist_ware_einzeln.replace(/\{\{TAGE\}\}/g, String(tage));
  return "";
}

function rueckkostenText(d: WiderrufData): string {
  if (!d.rueckgabe.kundeTraegtKosten) return TEXTE.ruecksende_anbieter;
  if (d.rueckgabe.sperrgut && d.rueckgabe.geschaetzteKosten) {
    return TEXTE.ruecksende_sperrgut.replace(/\{\{KOSTEN\}\}/g, d.rueckgabe.geschaetzteKosten);
  }
  return TEXTE.ruecksende_kunde;
}

function isWareTyp(t: Leistungstyp): boolean {
  return ["ware_einzeln", "ware_mehrteilig", "ware_abo"].includes(t);
}

function isDienstleistungTyp(t: Leistungstyp): boolean {
  return t === "dienstleistung";
}

function isDigitalTyp(t: Leistungstyp): boolean {
  return ["digitaler_inhalt", "online_inhalt_streaming"].includes(t);
}

// ─────────────────────────────────────────────────────────────────────────────
// Builder
// ─────────────────────────────────────────────────────────────────────────────

export type BuildOptions = {
  credit?: boolean;
  wrap?: boolean;
  includeMusterformular?: boolean;
};

function renderCredit(): string {
  return `<p class="compliflow-credit" style="margin-top:2rem;font-size:0.8rem;color:#666;border-top:1px solid #eee;padding-top:1rem;">Erstellt mit <a href="https://compliflow.de?ref=embed-widerruf" rel="noopener" target="_blank">Compliflow</a> — kostenloser Widerrufsbelehrungs-Generator</p>`;
}

function renderB2BHinweis(): string {
  return mdSectionToHtml(TEXTE.kein_widerrufsrecht_b2b);
}

function renderAusschluesse(d: WiderrufData): string {
  if (d.ausschluesse.length === 0) return "";
  const items = d.ausschluesse.map((a: Ausschlussgrund) => {
    const info = AUSSCHLUSS_LABELS[a];
    return `**${info.titel}** (${info.paragraph}): ${info.beschreibung}`;
  });
  return mdSectionToHtml(TEXTE.ausschluss_hinweis) + items.map(i => `<p>${escapeHtmlPreserveBold(i)}</p>`).join("\n");
}

function renderAusuebung(d: WiderrufData): string {
  const a = d.anbieter;
  const telefonText = a.telefon ? `, Telefon: ${a.telefon}` : "";
  const text = TEXTE.ausuebung
    .replace(/\{\{ANBIETER_NAME\}\}/g, a.name)
    .replace(/\{\{ANBIETER_ADRESSE\}\}/g, formatAdresse(d))
    .replace(/\{\{ANBIETER_EMAIL\}\}/g, a.email)
    .replace(/\{\{ANBIETER_TELEFON\}\}/g, telefonText);
  return mdSectionToHtml(text);
}

function renderFolgen(d: WiderrufData): string {
  const parts: string[] = [heading(2, TEXTE.folgen_ueberschrift)];

  if (isWareTyp(d.leistungstyp) || d.leistungstyp === "gemischt") {
    const text = TEXTE.folgen_ware
      .replace(/\{\{RUECKGABE_ADRESSE\}\}/g, formatRueckgabeAdresse(d))
      .replace(/\{\{RUECKSENDEKOSTEN\}\}/g, rueckkostenText(d));
    parts.push(mdSectionToHtml(text));
  }

  if (isDienstleistungTyp(d.leistungstyp)) {
    parts.push(mdSectionToHtml(TEXTE.folgen_dienstleistung));
    if (d.besonderheiten.dienstleistungSofort) {
      parts.push(mdSectionToHtml(TEXTE.folgen_dienstleistung_sofort));
    }
  }

  if (isDigitalTyp(d.leistungstyp)) {
    parts.push(mdSectionToHtml(TEXTE.folgen_dienstleistung));
    if (d.besonderheiten.digitalSofortDownload) {
      parts.push(mdSectionToHtml(TEXTE.folgen_digital_sofort));
    }
  }

  return parts.join("\n");
}

function renderMusterformular(d: WiderrufData): string {
  const a = d.anbieter;
  // HIGH FIX #5: Telefon im Muster-Widerrufsformular
  const telefonText = a.telefon ? `, Telefon: ${a.telefon}` : "";
  const faxText = a.fax ? `, Fax: ${a.fax}` : "";
  const text = TEXTE.musterformular
    .replace(/\{\{ANBIETER_NAME\}\}/g, a.name)
    .replace(/\{\{ANBIETER_ADRESSE\}\}/g, formatAdresse(d))
    .replace(/\{\{ANBIETER_EMAIL\}\}/g, a.email)
    .replace(/\{\{ANBIETER_TELEFON_MUSTER\}\}/g, telefonText)
    .replace(/\{\{ANBIETER_FAX\}\}/g, faxText);
  return mdSectionToHtml(text);
}

export function buildHtml(d: WiderrufData, options: BuildOptions = {}): string {
  const credit = options.credit !== false;
  const wrap = options.wrap !== false;
  const includeForm = options.includeMusterformular ?? d.inkludiereMusterformular;

  // B2B-Sonderfall: kein Widerrufsrecht
  if (!d.istB2C) {
    const sections = [
      heading(1, TEXTE.ueberschrift),
      renderB2BHinweis(),
    ];
    const body = sections.join("\n");
    const inner = credit ? `${body}\n${renderCredit()}` : body;
    if (!wrap) return inner;
    return `<!-- Widerrufsbelehrung erstellt mit Compliflow (https://compliflow.de) am ${d.letztAktualisiert} -->
<section class="compliflow-widerruf" lang="de">
${inner}
</section>`;
  }

  const tageStr = String(d.fristTage);
  const sections = [
    heading(1, TEXTE.ueberschrift),
    heading(2, "Widerrufsrecht"),
    para(TEXTE.widerrufsrecht_intro.replace(/\{\{TAGE\}\}/g, tageStr)),
    para(fristbeginnText(d)),
    renderAusuebung(d),
    renderFolgen(d),
    para(TEXTE.ende_belehrung),
    // HIGH FIX #7: 12-Monats-Fristverlängerungs-Hinweis nach § 356 Abs. 3 BGB
    mdSectionToHtml(TEXTE.fristverlaengerung_hinweis),
    renderAusschluesse(d),
    includeForm ? renderMusterformular(d) : "",
  ].filter(Boolean);

  const body = sections.join("\n");
  const inner = credit ? `${body}\n${renderCredit()}` : body;
  if (!wrap) return inner;
  return `<!-- Widerrufsbelehrung erstellt mit Compliflow (https://compliflow.de) am ${d.letztAktualisiert} -->
<section class="compliflow-widerruf" lang="de">
${inner}
</section>`;
}

export function buildPlaintext(d: WiderrufData, options: BuildOptions = {}): string {
  const html = buildHtml(d, { credit: options.credit !== false, wrap: false });
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, (_m, t) => `\n${t}\n${"=".repeat(t.length)}\n`)
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, (_m, t) => `\n\n${t}\n${"-".repeat(t.length)}\n`)
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, (_m, t) => `\n\n${t}\n${"~".repeat(t.length)}\n`)
    .replace(/<li[^>]*>(.*?)<\/li>/gi, "  • $1\n")
    .replace(/<\/?ul[^>]*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "$1")
    .replace(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "$2 ($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
