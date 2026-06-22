/**
 * AGB-Contract — Validierung + HTML/Plaintext-Builder für 3 Varianten
 * Quellen: §§ 305-310 BGB + § 312i BGB + § 312d BGB + Art. 246 EGBGB
 */

import type { AgbData, WizardStep } from "./types";
import { ZAHLUNG_LABELS, isDigitaleArt } from "./types";
import { KLAUSELN } from "./defaults";
import { escapeHtml } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

export function isVarianteValid(d: AgbData): boolean {
  return !!d.variante;
}

export function isAnbieterValid(d: AgbData): boolean {
  const a = d.anbieter;
  if (!a.name.trim()) return false;
  if (!a.strasse.trim() || !a.plz.trim() || !a.ort.trim()) return false;
  if (!a.email.trim()) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email);
}

export function isLeistungValid(d: AgbData): boolean {
  if (!d.leistung.beschreibung.trim()) return false;
  return true;
}

export function isZahlungValid(d: AgbData): boolean {
  if (d.zahlung.arten.length === 0) return false;
  if (d.zahlung.zahlungszielTage < 0) return false;
  return true;
}

export function isLieferungValid(d: AgbData): boolean {
  // L3 — b2c_dienstleistung kann kein physischen Versand haben
  if (d.variante === "b2c_dienstleistung" && d.lieferung.versand) return false;
  if (d.variante !== "b2c_shop" && d.variante !== "b2b") return true;
  if (!d.lieferung.versand) return true;
  if (!d.lieferung.lieferzeitTage.trim()) return false;
  if (!d.lieferung.versandkostenInfo.trim()) return false;
  return true;
}

export function isHaftungValid(_d: AgbData): boolean {
  return true;
}

export type CompletionStatus = {
  checks: Record<WizardStep, boolean>;
  allValid: boolean;
};

export function getCompletionStatus(d: AgbData): CompletionStatus {
  const checks: Record<WizardStep, boolean> = {
    variante: isVarianteValid(d),
    anbieter: isAnbieterValid(d),
    leistung: isLeistungValid(d),
    zahlung: isZahlungValid(d),
    lieferung: isLieferungValid(d),
    haftung: isHaftungValid(d),
    review: true,
  };
  return { checks, allValid: Object.values(checks).every(Boolean) };
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML-Helpers
// ─────────────────────────────────────────────────────────────────────────────


const para = (text: string): string => `<p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>`;
const heading = (level: 1 | 2 | 3, text: string): string => `<h${level}>${escapeHtml(text)}</h${level}>`;

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

// ─────────────────────────────────────────────────────────────────────────────
// Builder-Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatZahlungsarten(d: AgbData): string {
  return d.zahlung.arten.map((a) => ZAHLUNG_LABELS[a]).join(", ");
}

function buildSkontoKlausel(d: AgbData): string {
  if (!d.zahlung.skontoProzent || !d.zahlung.skontoTage) return "";
  return KLAUSELN.skonto
    .replace(/\{\{SKONTO_TAGE\}\}/g, String(d.zahlung.skontoTage))
    .replace(/\{\{SKONTO_PROZENT\}\}/g, String(d.zahlung.skontoProzent));
}

function buildStaffelKlausel(d: AgbData): string {
  if (d.stornierung.stornogebuehrenStaffel.length === 0) return "";
  return d.stornierung.stornogebuehrenStaffel
    .map((s) => `- Bis ${s.vorTagen} Tage vor Termin: ${s.gebuehrProzent}% der vereinbarten Vergütung`)
    .join("\n");
}

function buildVertragsschluss(d: AgbData): string {
  if (d.variante === "b2c_shop") return KLAUSELN.vertragsschluss_b2c_shop;
  switch (d.vertragsschluss) {
    case "angebot_annahme":      return KLAUSELN.vertragsschluss_angebot_annahme;
    case "automatische_buchung": return KLAUSELN.vertragsschluss_buchung;
    case "auftragsbestaetigung": return KLAUSELN.vertragsschluss_auftragsbestaetigung;
    default:                     return KLAUSELN.vertragsschluss_auftragsbestaetigung;
  }
}

function buildGeltungsbereich(d: AgbData): string {
  switch (d.variante) {
    case "b2c_dienstleistung": return KLAUSELN.geltungsbereich_b2c_dienstleistung;
    case "b2c_shop":           return KLAUSELN.geltungsbereich_b2c_shop;
    case "b2b":                return KLAUSELN.geltungsbereich_b2b;
  }
}

function buildPreise(d: AgbData): string {
  // Kleinunternehmer-Hinweis (M6 — Grammatik-Fix)
  const kuHinweis = d.anbieter.ustId
    ? ""
    : " Als Kleinunternehmer im Sinne von § 19 UStG erheben wir keine Umsatzsteuer und weisen diese daher auch nicht aus.";
  const template = d.variante === "b2b" ? KLAUSELN.preise_netto_b2b : KLAUSELN.preise_brutto_b2c;
  return template.replace(/\{\{KU_HINWEIS\}\}/g, kuHinweis);
}

function buildZahlung(d: AgbData): string {
  const arten = formatZahlungsarten(d);
  const skonto = buildSkontoKlausel(d);
  if (d.variante === "b2b") {
    return KLAUSELN.zahlung_b2b
      .replace(/\{\{ZAHLUNGSARTEN\}\}/g, arten)
      .replace(/\{\{ZAHLUNGSZIEL\}\}/g, String(d.zahlung.zahlungszielTage))
      .replace(/\{\{SKONTO_KLAUSEL\}\}/g, skonto);
  }
  return KLAUSELN.zahlung_b2c.replace(/\{\{ZAHLUNGSARTEN\}\}/g, arten);
}

function buildLieferungOderLeistung(d: AgbData): string {
  // B2B-Shop existiert konzeptionell — wir checken einfach Versand + Eigentumsvorbehalt
  const isShopWithVersand = (d.variante === "b2c_shop" || d.variante === "b2b") && d.lieferung.versand;
  if (isShopWithVersand) {
    const eigentum = d.lieferung.eigentumsvorbehaltVerlaengert
      ? KLAUSELN.eigentumsvorbehalt_b2b_verlaengert
      : (d.lieferung.eigentumsvorbehalt ? KLAUSELN.eigentumsvorbehalt_b2c : "");
    const gefahr = d.lieferung.gefahruebergang === "ab_uebergabe"
      ? KLAUSELN.gefahruebergang_b2c
      : KLAUSELN.gefahruebergang_b2b;
    return KLAUSELN.lieferung_shop
      .replace(/\{\{LIEFERGEBIET\}\}/g, d.lieferung.liefergebiet)
      .replace(/\{\{VERSANDKOSTEN_INFO\}\}/g, d.lieferung.versandkostenInfo)
      .replace(/\{\{LIEFERZEIT\}\}/g, d.lieferung.lieferzeitTage)
      .replace(/\{\{GEFAHRUEBERGANG\}\}/g, gefahr)
      .replace(/\{\{EIGENTUMSVORBEHALT\}\}/g, eigentum);
  }
  // Sonst Leistungsklausel
  return KLAUSELN.leistung_dienstleistung;
}

function buildStornierung(d: AgbData): string {
  if (!d.ermoeglicheStornierung) return "";
  const staffel = buildStaffelKlausel(d);
  const ausser = d.stornierung.ausserordentlichesKuendigungsrecht ? KLAUSELN.ausserordentlich : "";
  return KLAUSELN.stornierung_dienstleistung
    .replace(/\{\{KOSTENLOS_BIS_TAGE\}\}/g, String(d.stornierung.kostenlosBisTage))
    .replace(/\{\{STAFFEL_KLAUSEL\}\}/g, staffel)
    .replace(/\{\{KUENDIGUNGSFRIST\}\}/g, String(d.stornierung.kuendigungsfristTage))
    .replace(/\{\{AUSSERORDENTLICH_KLAUSEL\}\}/g, ausser);
}

function buildWiderruf(d: AgbData): string {
  if (d.variante === "b2b") return "";
  return KLAUSELN.widerruf_b2c.replace(/\{\{WIDERRUF_URL\}\}/g, d.widerrufUrl);
}

function buildGewaehrleistung(d: AgbData): string {
  if (d.variante === "b2c_shop") return KLAUSELN.gewaehrleistung_b2c_ware;
  if (d.variante === "b2c_dienstleistung") return KLAUSELN.gewaehrleistung_b2c_dienst;
  // B2B
  return KLAUSELN.gewaehrleistung_b2b.replace(/\{\{GEWAEHRLEISTUNGSFRIST\}\}/g, String(d.gewaehrleistung.fristMonate));
}

function buildHaftung(d: AgbData): string {
  if (d.variante === "b2b") {
    const hoechst = d.haftung.hoechstbetragEuro
      ? KLAUSELN.hoechstbetrag.replace(/\{\{HOECHSTBETRAG\}\}/g, String(d.haftung.hoechstbetragEuro))
      : "";
    const dv = d.haftung.datenverlustAusgeschlossen ? KLAUSELN.datenverlust_klausel : "";
    return KLAUSELN.haftung_b2b
      .replace(/\{\{HOECHSTBETRAG_KLAUSEL\}\}/g, hoechst)
      .replace(/\{\{DATENVERLUST_KLAUSEL\}\}/g, dv);
  }
  const dvB2c = d.haftung.datenverlustAusgeschlossen ? KLAUSELN.datenverlust_klausel_b2c : "";
  return KLAUSELN.haftung_b2c.replace(/\{\{DATENVERLUST_KLAUSEL_B2C\}\}/g, dvB2c);
}

function buildDatenschutz(d: AgbData): string {
  return KLAUSELN.datenschutz.replace(/\{\{DATENSCHUTZ_URL\}\}/g, d.datenschutzUrl);
}

function buildSchluss(d: AgbData): string {
  const datum = d.letztAktualisiert;
  if (d.variante === "b2b") {
    // L1 — Schiedsklausel optional
    const schieds = d.schiedsklausel
      ? KLAUSELN.schiedsklausel_b2b.replace(/\{\{GERICHTSSTAND\}\}/g, d.gerichtsstand || d.anbieter.ort)
      : "";
    return KLAUSELN.schluss_b2b
      .replace(/\{\{GERICHTSSTAND\}\}/g, d.gerichtsstand || d.anbieter.ort)
      .replace(/\{\{ERFUELLUNGSORT\}\}/g, d.erfuellungsort || d.anbieter.ort)
      .replace(/\{\{SCHIEDSKLAUSEL\}\}/g, schieds)
      .replace(/\{\{STAND_DATUM\}\}/g, datum);
  }
  // H2 — VSBG-Variante
  const vsbgText = d.vsbgTeilnahmebereit
    ? KLAUSELN.vsbg_teilnahmebereit.replace(/\{\{SCHLICHTUNGSSTELLE\}\}/g, d.vsbgSchlichtungsstelle || "(noch zu benennen)")
    : KLAUSELN.vsbg_nicht_teilnahmebereit;
  return KLAUSELN.schluss_b2c
    .replace(/\{\{VSBG_KLAUSEL\}\}/g, vsbgText)
    .replace(/\{\{STAND_DATUM\}\}/g, datum);
}

// ─────────────────────────────────────────────────────────────────────────────
// C2 + C3 — Dauerschuld-Klausel (FairKonG + Kündigungsbutton)
// ─────────────────────────────────────────────────────────────────────────────

function buildDauervertrag(d: AgbData): string {
  if (!d.dauervertrag.istDauervertrag || d.variante === "b2b") return "";
  const verl = d.dauervertrag.automatischeVerlaengerung
    ? KLAUSELN.verlaengerung_aktiv_b2c.replace(
        /\{\{VERLAENGERUNGS_KF\}\}/g,
        String(d.dauervertrag.verlaengerungsKuendigungsfristTage),
      )
    : KLAUSELN.verlaengerung_nicht_aktiv;
  const linkText = d.dauervertrag.kuendigungsButtonUrl
    ? KLAUSELN.kuendigungsbutton_link_set.replace(
        /\{\{KUENDIGUNGSBUTTON_URL\}\}/g,
        d.dauervertrag.kuendigungsButtonUrl,
      )
    : KLAUSELN.kuendigungsbutton_link_unset;
  return KLAUSELN.dauervertrag_b2c
    .replace(/\{\{ERSTLAUFZEIT\}\}/g, String(d.dauervertrag.erstlaufzeitMonate))
    .replace(/\{\{VERLAENGERUNG_KLAUSEL\}\}/g, verl)
    .replace(/\{\{KUENDIGUNGSBUTTON_LINK\}\}/g, linkText);
}

// ─────────────────────────────────────────────────────────────────────────────
// H1, M2, M3, M5, M7 — §§ 327 ff. BGB Digital-Klausel
// ─────────────────────────────────────────────────────────────────────────────

function buildDigital(d: AgbData): string {
  // Auto-detect: wenn Variante B2C + LeistungsArt digital → einbauen
  const istRelevant =
    d.variante !== "b2b" &&
    (d.digital.istDigital || isDigitaleArt(d.leistung.art));
  if (!istRelevant) return "";

  // Sicherheitsupdates (M5)
  const su = d.digital.sicherheitsUpdates ? KLAUSELN.sicherheits_updates : "";

  // Nutzungsrechte (M3)
  const nutzungsBase =
    d.digital.nutzungsRechte === "kommerziell"
      ? KLAUSELN.nutzungsrechte_kommerziell
      : d.digital.nutzungsRechte === "einfach"
        ? KLAUSELN.nutzungsrechte_einfach
        : KLAUSELN.nutzungsrechte_persoenlich;
  const geraeteText = d.digital.geraeteLimit
    ? KLAUSELN.geraete_limit.replace(/\{\{GERAETE_ZAHL\}\}/g, String(d.digital.geraeteLimit))
    : "";
  const nutzung = nutzungsBase.replace(/\{\{GERAETE_LIMIT\}\}/g, geraeteText);

  // SaaS-SLA (M2)
  const sla =
    d.leistung.art === "saas" && d.digital.verfuegbarkeitsZiel
      ? KLAUSELN.sla_klausel.replace(/\{\{VERFUEGBARKEIT\}\}/g, d.digital.verfuegbarkeitsZiel)
      : "";

  // Datenexport (M7)
  const dx = d.digital.datenExportTage
    ? KLAUSELN.datenexport_klausel.replace(/\{\{DATENEXPORT_TAGE\}\}/g, String(d.digital.datenExportTage))
    : "";

  return KLAUSELN.digital_b2c
    .replace(/\{\{BEREITSTELLUNG_MONATE\}\}/g, String(d.digital.bereitstellungsZeitraumMonate))
    .replace(/\{\{SICHERHEITS_UPDATES_KLAUSEL\}\}/g, su)
    .replace(/\{\{NUTZUNGSRECHTE_KLAUSEL\}\}/g, nutzung)
    .replace(/\{\{SLA_KLAUSEL\}\}/g, sla)
    .replace(/\{\{DATENEXPORT_KLAUSEL\}\}/g, dx);
}

// ─────────────────────────────────────────────────────────────────────────────
// M1 — Force Majeure
// ─────────────────────────────────────────────────────────────────────────────

function buildForceMajeure(d: AgbData): string {
  return d.forceMajeureKlausel ? KLAUSELN.force_majeure : "";
}

// ─────────────────────────────────────────────────────────────────────────────
// M4 — Vertraulichkeit (Coaching/Beratung)
// ─────────────────────────────────────────────────────────────────────────────

function buildVertraulichkeit(d: AgbData): string {
  if (!d.vertraulichkeit.vertraulichkeitsKlausel) return "";
  return KLAUSELN.vertraulichkeit_klausel.replace(
    /\{\{NACHVERTRAGLICH_JAHRE\}\}/g,
    String(d.vertraulichkeit.nachvertraglichJahre),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Builder
// ─────────────────────────────────────────────────────────────────────────────

export type BuildOptions = {
  credit?: boolean;
  wrap?: boolean;
};

function renderCredit(): string {
  return `<p class="compliflow-credit" style="margin-top:2rem;font-size:0.8rem;color:#666;border-top:1px solid #eee;padding-top:1rem;">Erstellt mit <a href="https://compliflow.de?ref=embed-agb" rel="noopener" target="_blank">Compliflow</a> — kostenloser AGB-Generator</p>`;
}

function renderHeader(d: AgbData): string {
  const titel = d.variante === "b2b" ? "Allgemeine Geschäftsbedingungen (B2B)" : "Allgemeine Geschäftsbedingungen";
  return heading(1, titel);
}

export function buildHtml(d: AgbData, options: BuildOptions = {}): string {
  const credit = options.credit !== false;
  const wrap = options.wrap !== false;

  // Variable Replacements
  const vsp = d.vertragsspracheDe ? "Deutsch" : "Englisch";
  const anbName = d.anbieter.name;

  const sections = [
    renderHeader(d),
    buildGeltungsbereich(d),
    buildVertragsschluss(d),
    buildPreise(d),
    buildZahlung(d),
    buildLieferungOderLeistung(d),
    buildStornierung(d),
    buildDauervertrag(d),       // C2 + C3
    buildDigital(d),            // H1 + M2 + M3 + M5 + M7
    buildWiderruf(d),
    buildGewaehrleistung(d),
    buildHaftung(d),
    buildForceMajeure(d),       // M1
    buildVertraulichkeit(d),    // M4
    buildDatenschutz(d),
    buildSchluss(d),
  ]
    .filter((s) => s && s.trim().length > 0)
    .map((s) =>
      s
        .replace(/\{\{ANBIETER_NAME\}\}/g, anbName)
        .replace(/\{\{VERTRAGSSPRACHE\}\}/g, vsp),
    );

  const body = sections.map((s) => (s.startsWith("<") ? s : mdSectionToHtml(s))).join("\n\n");
  const inner = credit ? `${body}\n${renderCredit()}` : body;

  if (!wrap) return inner;
  return `<!-- AGB erstellt mit Compliflow (https://compliflow.de) am ${d.letztAktualisiert} -->
<section class="compliflow-agb" lang="de">
${inner}
</section>`;
}

export function buildPlaintext(d: AgbData, options: BuildOptions = {}): string {
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
