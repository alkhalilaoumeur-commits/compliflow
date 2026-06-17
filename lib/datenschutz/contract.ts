/**
 * Datenschutz-Contract — Erweiterte Version mit allen Sonderfällen
 * Quellen: Art. 13/14 DSGVO + § 25 TDDDG + § 26 BDSG + § 5 DDG + § 22 KUG + Art. 50 AI Act + HinSchG
 * Stand: 2026-06-13
 */

import type {
  DatenschutzData,
  WizardStep,
  MarketingTool,
  Versanddienstleister,
  Bewertungssystem,
  Auskunftei,
  KiChatbotProvider,
  VideoCallProvider,
} from "./types";
import {
  HOSTING_LABELS,
  ANALYTICS_LABELS,
  NEWSLETTER_LABELS,
  PAYMENT_LABELS,
  SOCIAL_LABELS,
  EMBEDDED_LABELS,
  MARKETING_LABELS,
  VERSAND_LABELS,
  BEWERTUNG_LABELS,
  AUSKUNFTEI_LABELS,
  CHAT_LABELS,
  KI_CHATBOT_LABELS,
  VIDEO_CALL_LABELS,
  BEWERBER_MGMT_LABELS,
  BRANCHE_LABELS,
} from "./types";
import {
  HOSTING_KLAUSELN,
  ANALYTICS_KLAUSELN,
  NEWSLETTER_KLAUSELN,
  PAYMENT_KLAUSELN,
  SOCIAL_KLAUSELN,
  EMBEDDED_KLAUSELN,
  STANDARD_TEXTE,
  MARKETING_KLAUSELN,
  VERSAND_KLAUSELN,
  BEWERTUNG_KLAUSELN,
  AUSKUNFTEI_KLAUSELN,
  BONITAET_TEMPLATE,
  CHAT_KLAUSELN,
  KI_CHATBOT_KLAUSELN,
  KI_CHATBOT_TEMPLATE,
  VIDEO_CALL_KLAUSELN,
  VIDEO_CALL_TEMPLATE,
  PUSH_KLAUSEL,
  HR_KLAUSELN,
  BRANCHEN_KLAUSELN,
  SPEZIAL_KLAUSELN,
  GOOGLE_FONTS_LOKAL_KLAUSEL,
  DSB_PFLICHT_HINWEIS,
  AUFSICHTSBEHOERDEN,
  bundeslandFromPlz,
  SPEICHERDAUERN,
  DATENKATEGORIEN,
  STANDARD_EMPFAENGER,
  ART_14_HINWEIS_BONITAET,
  AI_ACT_TOUCHPOINT_WARNING,
  JOINT_CONTROLLER_WESENTLICHES,
  DSFA_PFLICHT_HINWEIS,
} from "./defaults";

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

export function isVerantwortlicherValid(d: DatenschutzData): boolean {
  const v = d.verantwortlicher;
  if (!v.name.trim()) return false;
  if (!v.strasse.trim() || !v.plz.trim() || !v.ort.trim()) return false;
  if (!v.email.trim()) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return false;
  if (d.dsb.aktiv) {
    if (!d.dsb.name?.trim() || !d.dsb.email?.trim()) return false;
  }
  return true;
}

export function isHostingValid(d: DatenschutzData): boolean {
  if (!d.hosting.provider) return false;
  if (d.hosting.provider === "andere" && !d.hosting.customName?.trim()) return false;
  return true;
}

export function isKommunikationValid(d: DatenschutzData): boolean {
  if (d.kommunikation.kiChatbot && !d.kommunikation.kiChatbotProvider) return false;
  if (d.kommunikation.liveChat && !d.kommunikation.chatProvider) return false;
  if (d.kommunikation.webinare && !d.kommunikation.videoCallProvider) return false;
  return true;
}

export function isAnalyticsValid(_d: DatenschutzData): boolean { return true; }
export function isMarketingValid(_d: DatenschutzData): boolean { return true; }
export function isNewsletterValid(d: DatenschutzData): boolean {
  if (!d.newsletter.aktiv) return true;
  return !!d.newsletter.provider;
}
export function isEcommerceValid(d: DatenschutzData): boolean {
  if (d.ecommerce.bonitaetspruefung && (!d.ecommerce.auskunftei || d.ecommerce.auskunftei.length === 0)) {
    return false;
  }
  return true;
}
export function isSocialValid(_d: DatenschutzData): boolean { return true; }
export function isHRValid(d: DatenschutzData): boolean {
  if (d.hr.bewerbungsformular && d.hr.bewerberMgmt === "andere" && !d.hr.bewerberMgmtCustom?.trim()) {
    return false;
  }
  return true;
}
export function isSpezialValid(_d: DatenschutzData): boolean { return true; }
export function isDrittlandValid(_d: DatenschutzData): boolean { return true; }

export type CompletionStatus = {
  checks: Record<WizardStep, boolean>;
  allValid: boolean;
};

export function getCompletionStatus(d: DatenschutzData): CompletionStatus {
  const checks: Record<WizardStep, boolean> = {
    verantwortlicher: isVerantwortlicherValid(d),
    hosting: isHostingValid(d),
    kommunikation: isKommunikationValid(d),
    analytics: isAnalyticsValid(d),
    marketing: isMarketingValid(d),
    newsletter: isNewsletterValid(d),
    ecommerce: isEcommerceValid(d),
    social: isSocialValid(d),
    hr: isHRValid(d),
    spezial: isSpezialValid(d),
    drittland: isDrittlandValid(d),
    review: true,
  };
  return { checks, allValid: Object.values(checks).every(Boolean) };
}

// ─────────────────────────────────────────────────────────────────────────────
// Auto-Derivation Helpers — automatisch ableiten was der User braucht
// ─────────────────────────────────────────────────────────────────────────────

/** CRITICAL FIX #19: Errechnet ob DSFA nach Art. 35 DSGVO Pflicht ist */
export function hasDsfaPflicht(d: DatenschutzData): boolean {
  // Kriterien aus DSK-Muss-Liste:
  // 1. Automatisierte Entscheidung mit Rechtswirkung
  if (d.spezial.automatisierte_entscheidung) return true;
  // 2. Profiling im großen Umfang
  if (d.spezial.profiling && (d.mitarbeiterzahl === "mittel_50_249" || d.mitarbeiterzahl === "gross_250plus")) return true;
  // 3. Besondere Datenkategorien (Art. 9) im großen Umfang
  if (d.spezial.besondere_kategorien_art9 && d.mitarbeiterzahl !== "solo") return true;
  // 4. Branchen-Indikatoren
  if (d.branche === "arzt" || d.branche === "pflege") return true;
  // 5. Videoüberwachung mit Personenidentifikation
  if (d.spezial.videoueberwachung_live) return true;
  // 6. KI-Hochrisiko (Hochrisiko-KI nach AI Act Annex III)
  if (d.branche === "ki_saas") return true;
  return false;
}

/** Errechnet ob automatisch DSB-Pflicht greift */
export function hasDsbPflicht(d: DatenschutzData): boolean {
  if (d.mitarbeiterzahl === "schwelle_20_49") return true;
  if (d.mitarbeiterzahl === "mittel_50_249") return true;
  if (d.mitarbeiterzahl === "gross_250plus") return true;
  if (d.spezial.besondere_kategorien_art9) return true;
  if (["arzt", "anwalt", "pflege", "versicherung"].includes(d.branche)) return true;
  return false;
}

/** Errechnet ob HinSchG-Meldekanal-Pflicht greift */
export function hasHinschgPflicht(d: DatenschutzData): boolean {
  if (d.mitarbeiterzahl === "mittel_50_249") return true;
  if (d.mitarbeiterzahl === "gross_250plus") return true;
  return false;
}

/** Errechnet ob Joint-Controller-Hinweis nötig (z.B. Meta Pixel aktiv) */
export function hasJointController(d: DatenschutzData): boolean {
  if (d.spezial.jointController) return true;
  return d.marketing.some((m) => MARKETING_LABELS[m].jointController);
}

/** Sammelt automatisch alle Drittland-Länder aus den aktiven Modulen */
export function deriveDrittlaender(d: DatenschutzData): string[] {
  const set = new Set<string>(d.drittland.laender);

  // Hosting
  if (!HOSTING_LABELS[d.hosting.provider].istEU) set.add("USA");

  // Analytics
  d.analytics.forEach((a) => {
    if (!ANALYTICS_LABELS[a.tool].istEU) set.add("USA");
  });

  // Newsletter
  if (d.newsletter.aktiv && d.newsletter.provider) {
    if (!NEWSLETTER_LABELS[d.newsletter.provider].istEU) set.add("USA");
  }

  // Chat
  if (d.kommunikation.liveChat && d.kommunikation.chatProvider) {
    if (!CHAT_LABELS[d.kommunikation.chatProvider].istEU) set.add("USA");
  }

  // KI-Chatbot
  if (d.kommunikation.kiChatbot && d.kommunikation.kiChatbotProvider) {
    if (KI_CHATBOT_LABELS[d.kommunikation.kiChatbotProvider].istUS) set.add("USA");
  }

  // Video-Call
  if (d.kommunikation.webinare && d.kommunikation.videoCallProvider) {
    if (VIDEO_CALL_LABELS[d.kommunikation.videoCallProvider].istUS) set.add("USA");
  }

  // Marketing (US-lastig)
  d.marketing.forEach((m) => {
    if (MARKETING_LABELS[m].usAnbieter) set.add("USA");
  });
  if (d.marketing.includes("tiktok_pixel")) set.add("China");

  return Array.from(set);
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML-Helpers
// ─────────────────────────────────────────────────────────────────────────────

export type BuildOptions = {
  credit?: boolean;
  wrap?: boolean;
};

const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const para = (text: string): string => `<p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>`;
const heading = (level: 1 | 2 | 3, text: string): string => `<h${level}>${escapeHtml(text)}</h${level}>`;
const list = (items: string[]): string =>
  `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;

/** Strukturierte Info-Zeile mit Bold-Label, z.B. "Datenkategorien: ..." */
const infoLine = (label: string, text: string): string =>
  `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(text)}</p>`;

function escapeHtmlPreserveBold(s: string): string {
  // Zwei-Phasen-Escape mit eindeutigen Sentinel-Zeichen (verhindert Kollision mit
  // Zahlen im Fließtext wie "Art. 9 Abs. 2 lit. h").
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
      if (trimmed.startsWith("# ")) return heading(1, trimmed.slice(2));
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
// Sektion-Renderer
// ─────────────────────────────────────────────────────────────────────────────

function renderHeader(): string {
  return mdSectionToHtml(STANDARD_TEXTE.header);
}

function renderVerantwortlicher(d: DatenschutzData): string {
  const v = d.verantwortlicher;
  const lines = [
    v.name,
    v.strasse,
    `${v.plz} ${v.ort}`,
    v.land === "AT" ? "Österreich" : v.land === "CH" ? "Schweiz" : "Deutschland",
    "",
    `E-Mail: ${v.email}`,
  ];
  if (v.telefon) lines.push(`Telefon: ${v.telefon}`);
  return heading(2, "1. Verantwortlicher") + para(lines.join("\n"));
}

function renderDsb(d: DatenschutzData): string {
  if (!d.dsb.aktiv) return "";
  const lines = [d.dsb.name ?? "", `E-Mail: ${d.dsb.email ?? ""}`];
  if (d.dsb.telefon) lines.push(`Telefon: ${d.dsb.telefon}`);
  if (d.dsb.istExtern) lines.push("(extern bestellter Datenschutzbeauftragter)");
  let out = heading(2, "Datenschutzbeauftragter") + para(lines.filter(Boolean).join("\n"));
  if (hasDsbPflicht(d)) {
    out += para(DSB_PFLICHT_HINWEIS.replace(/\*\*/g, ""));
  }
  return out;
}

function renderHosting(d: DatenschutzData): string {
  const k = HOSTING_KLAUSELN[d.hosting.provider];
  const title = d.hosting.provider === "andere" && d.hosting.customName
    ? `Hosting (${d.hosting.customName})`
    : `Hosting (${HOSTING_LABELS[d.hosting.provider].name})`;
  return [
    heading(2, title),
    para(k.text),
    infoLine("Datenkategorien", DATENKATEGORIEN.hosting),
    infoLine("Rechtsgrundlage", k.rechtsgrundlage),
    infoLine("Speicherdauer", SPEICHERDAUERN.hosting_logs),
  ].join("\n");
}

function renderCookies(d: DatenschutzData): string {
  if (d.cookies.kategorien.length === 1 && d.cookies.kategorien[0] === "essential") {
    return mdSectionToHtml(STANDARD_TEXTE.cookies_basis);
  }
  const kategorien = d.cookies.kategorien
    .map((k) => {
      switch (k) {
        case "essential":  return "Technisch notwendig (kein Consent erforderlich, § 25 Abs. 2 TDDDG)";
        case "funktional": return "Funktional / Komfort";
        case "statistik":  return "Statistik / Analytics";
        case "marketing":  return "Marketing / Werbung";
        case "social":     return "Social Media Plugins";
      }
    }).filter(Boolean) as string[];

  const consentInfo = d.cookies.hatConsentBanner
    ? "Sie können Ihre Cookie-Einstellungen jederzeit über unser Cookie-Banner ändern oder widerrufen. Die Cookie-Einwilligung wird gemäß DSK-Beschluss spätestens alle 12 Monate erneuert."
    : "Sie können Ihre Cookie-Einstellungen in Ihrem Browser jederzeit anpassen oder löschen.";

  return [
    mdSectionToHtml(STANDARD_TEXTE.cookies_basis),
    heading(3, "Eingesetzte Cookie-Kategorien"),
    list(kategorien),
    para(consentInfo),
  ].join("\n");
}

function renderAnalytics(d: DatenschutzData): string {
  if (d.analytics.length === 0) return "";
  const parts: string[] = [heading(2, "Analyse-Tools und Tracking")];
  for (const a of d.analytics) {
    const k = ANALYTICS_KLAUSELN[a.tool];
    const datenkat = k.consent ? DATENKATEGORIEN.analytics_cookies : DATENKATEGORIEN.analytics_cookieless;
    const speicher = k.consent ? SPEICHERDAUERN.analytics_cookies : SPEICHERDAUERN.analytics_cookieless;
    parts.push(heading(3, ANALYTICS_LABELS[a.tool].name));
    parts.push(para(k.text));
    parts.push(infoLine("Datenkategorien", datenkat));
    parts.push(infoLine("Rechtsgrundlage", k.rechtsgrundlage));
    parts.push(infoLine("Speicherdauer", speicher));
  }
  return parts.join("\n");
}

function renderMarketing(d: DatenschutzData): string {
  if (d.marketing.length === 0) return "";
  const parts: string[] = [heading(2, "Marketing- und Pixel-Tools")];
  for (const m of d.marketing) {
    const k = MARKETING_KLAUSELN[m];
    const isRemarketing = m === "google_ads_remarketing";
    parts.push(heading(3, MARKETING_LABELS[m].name));
    parts.push(para(k.text));
    parts.push(infoLine("Datenkategorien", DATENKATEGORIEN.marketing));
    parts.push(infoLine("Rechtsgrundlage", k.rechtsgrundlage));
    parts.push(infoLine("Speicherdauer", isRemarketing ? SPEICHERDAUERN.marketing_remarketing : SPEICHERDAUERN.marketing_pixel));
    if (k.jointControllerHinweis) {
      parts.push(para(k.jointControllerHinweis));
    }
  }
  return parts.join("\n");
}

function renderNewsletter(d: DatenschutzData): string {
  if (!d.newsletter.aktiv || !d.newsletter.provider) return "";
  const k = NEWSLETTER_KLAUSELN[d.newsletter.provider];
  return [
    heading(2, `Newsletter (${NEWSLETTER_LABELS[d.newsletter.provider].name})`),
    para(k.text),
    infoLine("Datenkategorien", DATENKATEGORIEN.newsletter),
    infoLine("Rechtsgrundlage", k.rechtsgrundlage),
    infoLine("Speicherdauer", SPEICHERDAUERN.newsletter_einwilligung),
  ].join("\n");
}

function renderPayment(d: DatenschutzData): string {
  if (d.payment.length === 0) return "";
  const parts = [heading(2, "Zahlungsanbieter")];
  for (const p of d.payment) {
    parts.push(heading(3, PAYMENT_LABELS[p]));
    parts.push(para(PAYMENT_KLAUSELN[p]));
  }
  return parts.join("\n");
}

function renderEcommerce(d: DatenschutzData): string {
  if (!d.ecommerce.bestellungen) return "";
  const parts: string[] = [];

  // Versand
  if (d.ecommerce.versand.length > 0) {
    parts.push(heading(2, "Versanddienstleister"));
    parts.push(para("Für den Versand Ihrer Bestellung geben wir Ihre Lieferadresse an folgende Versanddienstleister weiter:"));
    for (const v of d.ecommerce.versand) {
      parts.push(heading(3, VERSAND_LABELS[v]));
      parts.push(para(VERSAND_KLAUSELN[v]));
    }
    parts.push(para("Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragsdurchführung). Mit dem Versanddienstleister haben wir einen Auftragsverarbeitungsvertrag nach Art. 28 DSGVO abgeschlossen."));
  }

  // Bonitätsprüfung
  if (d.ecommerce.bonitaetspruefung && d.ecommerce.auskunftei && d.ecommerce.auskunftei.length > 0) {
    const auskunfteienText = d.ecommerce.auskunftei
      .map((a: Auskunftei) => {
        const info = AUSKUNFTEI_KLAUSELN[a];
        return `- ${info.anbieter}${info.spezifika ? "\n  " + info.spezifika : ""}`;
      })
      .join("\n");

    const logikText = d.ecommerce.auskunftei.includes("schufa")
      ? "Die Entscheidung über die Zahlungsfreigabe erfolgt automatisiert auf Basis des SCHUFA-Scores (neue Skala 100-999, gültig ab 17.03.2026). In die Berechnung des Scores fließen u.a. ein: Zahlungserfahrungen aus Krediten und Verträgen, laufende Kredite und deren Status, Dauer von Bankverbindungen, Häufigkeit von Bonitätsanfragen, Negativmerkmale (Zahlungsstörungen, Insolvenz)."
      : "Die Entscheidung über die Zahlungsfreigabe erfolgt automatisiert auf Basis der von der Auskunftei übermittelten Bonitätsdaten.";

    const bonitaet = BONITAET_TEMPLATE
      .replace("{{AUSKUNFTEIEN}}", auskunfteienText)
      .replace("{{LOGIK_TEXT}}", logikText);
    parts.push(mdSectionToHtml(bonitaet));
    parts.push(infoLine("Datenkategorien", DATENKATEGORIEN.bonitaet));
    parts.push(infoLine("Speicherdauer", SPEICHERDAUERN.bonitaet));
    parts.push(mdSectionToHtml(ART_14_HINWEIS_BONITAET));
  }

  // Bewertungssystem
  if (d.ecommerce.bewertungssystem !== "keiner") {
    const b = BEWERTUNG_KLAUSELN[d.ecommerce.bewertungssystem];
    parts.push(heading(2, `Bewertungssystem (${BEWERTUNG_LABELS[d.ecommerce.bewertungssystem]})`));
    parts.push(para(b.text));
    parts.push(para(`Rechtsgrundlage: ${b.rechtsgrundlage}`));
  }

  return parts.join("\n");
}

function renderSocial(d: DatenschutzData): string {
  if (d.social.length === 0 && d.embedded.length === 0) return "";
  const parts: string[] = [heading(2, "Social Media und eingebettete Inhalte")];

  for (const s of d.social) {
    const k = SOCIAL_KLAUSELN[s];
    parts.push(heading(3, SOCIAL_LABELS[s]));
    parts.push(para(k.text));
    parts.push(para(`Rechtsgrundlage: ${k.rechtsgrundlage}`));
  }

  for (const e of d.embedded) {
    // Google Fonts: spezifische Behandlung lokal vs. extern
    if (e === "google_fonts" && d.embedOptionen.googleFontsLokal) {
      parts.push(mdSectionToHtml(GOOGLE_FONTS_LOKAL_KLAUSEL));
      continue;
    }
    const k = EMBEDDED_KLAUSELN[e];
    parts.push(heading(3, EMBEDDED_LABELS[e]));
    parts.push(para(k.text));
    parts.push(para(`Rechtsgrundlage: ${k.rechtsgrundlage}`));
  }

  return parts.join("\n");
}

function renderKommunikation(d: DatenschutzData): string {
  const parts: string[] = [];

  // Kontaktformular
  if (d.kommunikation.kontaktformular || d.funktionen.kontaktformular) {
    parts.push(mdSectionToHtml(STANDARD_TEXTE.kontaktformular));
  }

  // Live-Chat (klassisch)
  if (d.kommunikation.liveChat && d.kommunikation.chatProvider) {
    const k = CHAT_KLAUSELN[d.kommunikation.chatProvider];
    parts.push(heading(2, `Live-Chat (${CHAT_LABELS[d.kommunikation.chatProvider].name})`));
    parts.push(para(k.text));
    parts.push(para(`Rechtsgrundlage: ${k.rechtsgrundlage}`));
  }

  // KI-Chatbot (mit AI Act Hinweis)
  if (d.kommunikation.kiChatbot && d.kommunikation.kiChatbotProvider) {
    const info = KI_CHATBOT_KLAUSELN[d.kommunikation.kiChatbotProvider];
    const drittlandHinweis = info.istUS
      ? "**Drittlandtransfer:** Die Datenübermittlung erfolgt in die USA. Der Anbieter ist nach dem EU-U.S. Data Privacy Framework zertifiziert. Zusätzlich liegen Standardvertragsklauseln (SCCs) nach Art. 46 DSGVO vor."
      : "**Datenverarbeitung:** ausschließlich innerhalb der EU.";
    const trainingHinweis = d.kommunikation.kiTrainingAusgeschlossen
      ? "insbesondere ausschließt, dass Ihre Eingaben zum Training der KI-Modelle verwendet werden"
      : "die Bedingungen für eine etwaige Modellverbesserung regelt";

    const text = KI_CHATBOT_TEMPLATE
      .replace("{{ANBIETER_TEXT}}", info.anbieterText)
      .replace("{{TRAINING_HINWEIS}}", trainingHinweis)
      .replace("{{DRITTLAND_HINWEIS}}", drittlandHinweis);
    parts.push(mdSectionToHtml(text));
    parts.push(infoLine("Datenkategorien", DATENKATEGORIEN.ki_chatbot));
    parts.push(mdSectionToHtml(AI_ACT_TOUCHPOINT_WARNING));
  }

  // Webinare / Video-Calls
  if (d.kommunikation.webinare && d.kommunikation.videoCallProvider) {
    const info = VIDEO_CALL_KLAUSELN[d.kommunikation.videoCallProvider];
    const drittlandHinweis = info.istUS
      ? "**Drittlandtransfer:** Datenübermittlung in die USA möglich. Anbieter ist nach dem EU-U.S. Data Privacy Framework zertifiziert. SCCs liegen vor."
      : "";
    const text = VIDEO_CALL_TEMPLATE
      .replace("{{NAME}}", VIDEO_CALL_LABELS[d.kommunikation.videoCallProvider].name)
      .replace("{{ANBIETER}}", info.anbieterText)
      .replace("{{DRITTLAND_HINWEIS}}", drittlandHinweis);
    parts.push(mdSectionToHtml(text));
  }

  // Push-Notifications
  if (d.kommunikation.pushNotifications) {
    parts.push(mdSectionToHtml(PUSH_KLAUSEL));
  }

  return parts.join("\n");
}

function renderHR(d: DatenschutzData): string {
  const parts: string[] = [];

  if (d.hr.bewerbungsformular) {
    parts.push(mdSectionToHtml(HR_KLAUSELN.bewerbung));

    if (d.hr.bewerberMgmt) {
      const info = BEWERBER_MGMT_LABELS[d.hr.bewerberMgmt];
      const sysName = d.hr.bewerberMgmt === "andere" ? (d.hr.bewerberMgmtCustom ?? "Anderer Anbieter") : info.name;
      const drittlandHinweis = ["bamboohr", "workday", "greenhouse", "lever"].includes(d.hr.bewerberMgmt)
        ? " Bei US-Anbieter: Datentransfer in die USA möglich, Anbieter sind nach dem EU-U.S. Data Privacy Framework zertifiziert; SCCs liegen vor."
        : "";
      const text = HR_KLAUSELN.bewerberMgmt
        .replace("{{SYSTEM_NAME}}", sysName)
        .replace("{{ANBIETER}}", info.anbieter)
        .replace("{{DRITTLAND_HINWEIS}}", drittlandHinweis);
      parts.push(mdSectionToHtml(text));
    }
  }

  if (d.hr.mitarbeiterfotos) {
    parts.push(mdSectionToHtml(HR_KLAUSELN.mitarbeiterfotos));
  }

  if (d.hr.backgroundCheck) {
    parts.push(mdSectionToHtml(HR_KLAUSELN.backgroundCheck));
  }

  if (d.hr.hinschgMeldekanal || hasHinschgPflicht(d)) {
    parts.push(mdSectionToHtml(HR_KLAUSELN.hinschg));
  }

  return parts.join("\n");
}

function renderBranche(d: DatenschutzData): string {
  const text = BRANCHEN_KLAUSELN[d.branche];
  if (!text) return "";
  return mdSectionToHtml(text);
}

function renderFunktionen(d: DatenschutzData): string {
  const parts: string[] = [];
  // Bewerbungsformular wird in renderHR behandelt
  if (d.funktionen.kundenkonto) parts.push(STANDARD_TEXTE.kundenkonto);
  return parts.map(mdSectionToHtml).join("\n");
}

function renderSpezial(d: DatenschutzData): string {
  const parts: string[] = [];
  if (d.spezial.profiling) parts.push(mdSectionToHtml(SPEZIAL_KLAUSELN.profiling));
  if (d.spezial.automatisierte_entscheidung) parts.push(mdSectionToHtml(SPEZIAL_KLAUSELN.automatisierteEntscheidung));
  if (hasJointController(d)) {
    parts.push(mdSectionToHtml(SPEZIAL_KLAUSELN.jointController));
    parts.push(mdSectionToHtml(JOINT_CONTROLLER_WESENTLICHES));
  }
  if (d.spezial.videoueberwachung_live) {
    parts.push(mdSectionToHtml(SPEZIAL_KLAUSELN.videoueberwachung_live));
    parts.push(infoLine("Datenkategorien", DATENKATEGORIEN.videoueberwachung_live));
    parts.push(infoLine("Speicherdauer", SPEICHERDAUERN.videoueberwachung_live));
  }
  if (d.zielgruppe === "auch_kinder_unter_16") parts.push(mdSectionToHtml(SPEZIAL_KLAUSELN.kinder));
  return parts.join("\n");
}

function renderDrittland(d: DatenschutzData): string {
  const derived = deriveDrittlaender(d);
  if (derived.length === 0 && !d.drittland.aktiv) return "";

  const laender = derived.length > 0 ? derived : d.drittland.laender;
  if (laender.length === 0) return "";

  const lines = [
    `Im Rahmen unserer Datenverarbeitung kann es zu einer Übertragung von personenbezogenen Daten in folgende Drittländer (außerhalb der EU/EWR) kommen: ${laender.join(", ")}.`,
    d.drittland.sccsVorhanden
      ? "Wir haben mit den jeweiligen Empfängern Standardvertragsklauseln (SCCs) nach Art. 46 DSGVO abgeschlossen, um ein angemessenes Schutzniveau zu gewährleisten."
      : "Bitte beachten Sie, dass in den genannten Drittländern möglicherweise kein mit der EU vergleichbares Datenschutzniveau besteht.",
    laender.includes("USA")
      ? "Für US-amerikanische Anbieter gilt zusätzlich das EU-U.S. Data Privacy Framework (Angemessenheitsbeschluss der EU-Kommission von Juli 2023), sofern der Anbieter zertifiziert ist."
      : "",
    laender.includes("China")
      ? "Für Anbieter mit Datenübertragung nach China besteht kein Angemessenheitsbeschluss. Hier gelten ausschließlich SCCs sowie ein durchgeführtes Transfer Impact Assessment (TIA)."
      : "",
    d.drittland.tiaDurchgefuehrt
      ? "Vor der Übertragung wurde ein Transfer Impact Assessment (TIA) durchgeführt."
      : "",
  ].filter(Boolean);
  return heading(2, "Datenübertragung in Drittländer") + lines.map(para).join("\n");
}

function renderBetroffenenrechte(): string {
  return mdSectionToHtml(STANDARD_TEXTE.betroffenenrechte);
}

/** CRITICAL FIX #1: Bundesland-spezifische Aufsichtsbehörde rendern */
function renderAufsichtsbehoerde(d: DatenschutzData): string {
  let bundesland = d.verantwortlicher.bundesland;
  if (!bundesland) {
    if (d.verantwortlicher.land === "AT") bundesland = "AT_BUND";
    else if (d.verantwortlicher.land === "CH") bundesland = "CH_BUND";
    else bundesland = bundeslandFromPlz(d.verantwortlicher.plz);
  }
  const b = AUFSICHTSBEHOERDEN[bundesland];
  const lines = [
    `Für Sie zuständig ist nach Art. 77 DSGVO die folgende Aufsichtsbehörde (auf Basis Ihres Unternehmenssitzes):`,
    "",
    `**${b.name}**`,
    b.adresse,
    `Telefon: ${b.telefon}`,
    `E-Mail: ${b.email}`,
    `Web: ${b.webseite}`,
    "",
    `Zusätzlich können Sie sich an die Aufsichtsbehörde Ihres gewöhnlichen Aufenthalts oder Ihres Arbeitsplatzes wenden.`,
  ];
  return heading(2, "Zuständige Aufsichtsbehörde") + mdSectionToHtml(lines.join("\n"));
}

/** HIGH FIX #3: Standard-Empfänger-Sektion */
function renderEmpfaenger(): string {
  return mdSectionToHtml(STANDARD_EMPFAENGER);
}

/** CRITICAL FIX #19: DSFA-Hinweis bei hochriskanten Verarbeitungen */
function renderDsfa(d: DatenschutzData): string {
  if (!hasDsfaPflicht(d)) return "";
  return mdSectionToHtml(DSFA_PFLICHT_HINWEIS);
}

function renderSchluss(d: DatenschutzData): string {
  return mdSectionToHtml(STANDARD_TEXTE.schluss) + para(`Stand: ${d.letztAktualisiert}`);
}

function renderCredit(): string {
  return `<p class="compliflow-credit" style="margin-top:2rem;font-size:0.8rem;color:#666;border-top:1px solid #eee;padding-top:1rem;">Erstellt mit <a href="https://compliflow.de?ref=embed-datenschutz" rel="noopener" target="_blank">Compliflow</a> — kostenloser Datenschutz-Generator</p>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML-Builder (Haupt-Export)
// ─────────────────────────────────────────────────────────────────────────────

export function buildHtml(d: DatenschutzData, options: BuildOptions = {}): string {
  const credit = options.credit !== false;
  const wrap = options.wrap !== false;

  const sections = [
    renderHeader(),
    renderVerantwortlicher(d),
    renderDsb(d),
    renderBranche(d),
    renderHosting(d),
    renderCookies(d),
    renderAnalytics(d),
    renderMarketing(d),
    renderNewsletter(d),
    renderPayment(d),
    renderEcommerce(d),
    renderSocial(d),
    renderKommunikation(d),
    renderHR(d),
    renderFunktionen(d),
    renderSpezial(d),
    renderDsfa(d),                  // CRITICAL FIX #19
    renderEmpfaenger(),              // HIGH FIX #3
    renderDrittland(d),
    renderBetroffenenrechte(),
    renderAufsichtsbehoerde(d),      // CRITICAL FIX #1
    renderSchluss(d),
  ].filter(Boolean);

  const body = sections.join("\n\n");
  const inner = credit ? `${body}\n${renderCredit()}` : body;
  if (!wrap) return inner;
  return `<!-- Datenschutzerklärung erstellt mit Compliflow (https://compliflow.de) am ${d.letztAktualisiert} -->
<section class="compliflow-datenschutz" lang="de">
${inner}
</section>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Plaintext-Builder (für PDF + Word-Paste)
// ─────────────────────────────────────────────────────────────────────────────

function stripMarkdown(md: string): string {
  return md
    .split(/\n\n+/)
    .map((block) => {
      const t = block.trim();
      if (t.startsWith("## ")) {
        const title = t.slice(3);
        return `\n${title}\n${"-".repeat(title.length)}\n`;
      }
      if (t.startsWith("### ")) {
        const title = t.slice(4);
        return `\n${title}\n${"~".repeat(title.length)}\n`;
      }
      if (t.startsWith("# ")) {
        const title = t.slice(2);
        return `\n${title}\n${"=".repeat(title.length)}\n`;
      }
      return t.replace(/\*\*([^*]+)\*\*/g, "$1");
    })
    .join("\n\n");
}

function plainSection(title: string, body: string): string {
  if (!body.trim()) return "";
  return `\n${title}\n${"-".repeat(title.length)}\n\n${body.trim()}\n`;
}

export function buildPlaintext(d: DatenschutzData, options: BuildOptions = {}): string {
  // HTML zu Text vereinfachen — wir nehmen die HTML-Sections und konvertieren
  const html = buildHtml(d, { credit: options.credit !== false, wrap: false });
  // Sehr einfache HTML-zu-Text-Konvertierung
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
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
