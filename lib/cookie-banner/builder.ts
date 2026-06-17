/**
 * Cookie-Banner-Builder — generiert das komplette HTML+CSS+JS-Snippet
 * Quellen: § 25 TDDDG + BGH 2025 (Reject-All-Prominenz) + DSK 2024 (12-Monats-Re-Consent)
 */

import type { CookieBannerData, WizardStep, KategorieId, TrackingTool } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

export function isAnbieterValid(d: CookieBannerData): boolean {
  if (!d.anbieter.name.trim()) return false;
  if (!d.anbieter.datenschutzUrl.trim()) return false;
  return true;
}

export function isKategorienValid(d: CookieBannerData): boolean {
  // Mindestens essential muss aktiv sein
  return d.kategorien.some((k) => k.id === "essential" && k.aktiv);
}

export function isTrackingValid(_d: CookieBannerData): boolean {
  return true;
}

export function isStilValid(_d: CookieBannerData): boolean {
  return true;
}

export function isVerhaltenValid(d: CookieBannerData): boolean {
  if (d.verhalten.consentLaufzeitMonate < 1 || d.verhalten.consentLaufzeitMonate > 24) return false;
  return true;
}

export type CompletionStatus = {
  checks: Record<WizardStep, boolean>;
  allValid: boolean;
};

export function getCompletionStatus(d: CookieBannerData): CompletionStatus {
  const checks: Record<WizardStep, boolean> = {
    anbieter: isAnbieterValid(d),
    kategorien: isKategorienValid(d),
    tracking: isTrackingValid(d),
    stil: isStilValid(d),
    verhalten: isVerhaltenValid(d),
    review: true,
  };
  return { checks, allValid: Object.values(checks).every(Boolean) };
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS-Builder
// ─────────────────────────────────────────────────────────────────────────────

function buildCss(d: CookieBannerData): string {
  const f = d.farben;
  const positionStyles: Record<typeof d.stil, string> = {
    bottom_bar: `
  .compliflow-cb { position: fixed; bottom: 0; left: 0; right: 0; max-width: 100%; }
  .compliflow-cb__inner { max-width: 1200px; margin: 0 auto; padding: 16px 24px; display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between; }
  .compliflow-cb__text { flex: 1 1 320px; min-width: 280px; }
  .compliflow-cb__buttons { display: flex; gap: 8px; flex-wrap: wrap; }`,
    modal: `
  .compliflow-cb { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 480px; width: calc(100% - 32px); max-height: 90vh; overflow-y: auto; z-index: 100000; }
  ${d.verhalten.blockiertHintergrund ? ".compliflow-cb-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99999; }" : ""}
  .compliflow-cb__inner { padding: 24px; }
  .compliflow-cb__buttons { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }`,
    sidebar_left: `
  .compliflow-cb { position: fixed; bottom: 24px; left: 24px; max-width: 380px; width: calc(100% - 48px); }
  .compliflow-cb__inner { padding: 20px; }
  .compliflow-cb__buttons { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }`,
    sidebar_right: `
  .compliflow-cb { position: fixed; bottom: 24px; right: 24px; max-width: 380px; width: calc(100% - 48px); }
  .compliflow-cb__inner { padding: 20px; }
  .compliflow-cb__buttons { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }`,
  };

  return `<style id="compliflow-cb-style">
  #compliflow-cb-root, #compliflow-cb-root * { box-sizing: border-box; }
  #compliflow-cb-root { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: ${d.schriftgroesseRem}rem; line-height: 1.5; }
${positionStyles[d.stil]}
  .compliflow-cb {
    background: ${f.hintergrund};
    color: ${f.text};
    border: 1px solid ${f.rand};
    border-radius: ${d.abgerundetPx}px;
    ${d.schatten ? "box-shadow: 0 10px 40px rgba(0,0,0,0.15);" : ""}
    z-index: 100000;
  }
  .compliflow-cb__headline { font-size: 1.05em; font-weight: 600; margin: 0 0 8px 0; }
  .compliflow-cb__desc { margin: 0; }
  .compliflow-cb__links { margin-top: 8px; font-size: 0.85em; }
  .compliflow-cb__links a { color: ${f.link}; text-decoration: underline; margin-right: 12px; }
  .compliflow-cb__btn { display: inline-flex; align-items: center; justify-content: center; padding: 10px 16px; border: none; border-radius: ${Math.max(4, d.abgerundetPx - 4)}px; font-size: inherit; font-weight: 600; cursor: pointer; min-height: 40px; transition: opacity 0.15s; }
  .compliflow-cb__btn:hover { opacity: 0.9; }
  .compliflow-cb__btn--primary { background: ${f.primaer}; color: ${f.primaerText}; }
  .compliflow-cb__btn--secondary { background: ${f.sekundaer}; color: ${f.sekundaerText}; }
  .compliflow-cb__btn--ghost { background: transparent; color: ${f.text}; text-decoration: underline; border: none; padding: 10px 8px; }
  .compliflow-cb__settings { display: none; margin-top: 16px; padding-top: 16px; border-top: 1px solid ${f.rand}; }
  .compliflow-cb__settings.is-open { display: block; }
  .compliflow-cb__cat { padding: 12px 0; border-bottom: 1px solid ${f.rand}; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .compliflow-cb__cat:last-child { border-bottom: none; }
  .compliflow-cb__cat-info { flex: 1; }
  .compliflow-cb__cat-name { font-weight: 600; }
  .compliflow-cb__cat-desc { font-size: 0.9em; color: ${f.text}; opacity: 0.8; margin-top: 4px; }
  .compliflow-cb__cat-toggle { flex-shrink: 0; }
  .compliflow-cb__cat-toggle input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
  .compliflow-cb__cat-toggle input[disabled] { cursor: not-allowed; opacity: 0.6; }
  .compliflow-cb__pflicht { font-size: 0.8em; color: ${f.text}; opacity: 0.7; margin-left: 6px; }
  .compliflow-cb__credit { margin-top: 12px; font-size: 0.72em; opacity: 0.6; text-align: center; }
  .compliflow-cb__credit a { color: ${f.link}; text-decoration: underline; }
</style>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML-Builder
// ─────────────────────────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildBannerHtml(d: CookieBannerData, options: BuildOptions = {}): string {
  const t = d.texte;
  const aktiveKategorien = d.kategorien.filter((k) => k.aktiv);
  const credit = options.credit !== false;

  const datenschutzLink = `<a href="${escapeHtml(d.anbieter.datenschutzUrl)}" target="_blank" rel="noopener">${escapeHtml(t.datenschutzLink)}</a>`;
  const impressumLink = `<a href="${escapeHtml(d.anbieter.impressumUrl)}" target="_blank" rel="noopener">${escapeHtml(t.impressumLink)}</a>`;

  // Settings-Block (Categorie-Toggles)
  const settingsHtml = d.verhalten.settingsButton
    ? `
    <div class="compliflow-cb__settings" id="compliflow-cb-settings" role="region" aria-label="${escapeHtml(t.settingsHeadline)}">
      <h3 style="margin:0 0 8px 0;font-size:1em;font-weight:600;">${escapeHtml(t.settingsHeadline)}</h3>
      ${aktiveKategorien
        .map(
          (k) => `<div class="compliflow-cb__cat">
        <div class="compliflow-cb__cat-info">
          <div class="compliflow-cb__cat-name">${escapeHtml(k.name)}${k.pflicht ? `<span class="compliflow-cb__pflicht">${escapeHtml(t.notwendigPflicht)}</span>` : ""}</div>
          <div class="compliflow-cb__cat-desc">${escapeHtml(k.beschreibung)}</div>
        </div>
        <div class="compliflow-cb__cat-toggle">
          <input type="checkbox" data-category="${k.id}" ${k.pflicht ? "checked disabled" : ""} aria-label="${escapeHtml(k.name)}" />
        </div>
      </div>`,
        )
        .join("")}
      <button type="button" class="compliflow-cb__btn compliflow-cb__btn--primary" data-action="save" style="margin-top:12px;width:100%;">${escapeHtml(t.einstellungenSpeichern)}</button>
    </div>`
    : "";

  // BGH 2025: Reject-All gleich prominent wie Accept-All
  const buttonsHtml = `
    <div class="compliflow-cb__buttons">
      <button type="button" class="compliflow-cb__btn compliflow-cb__btn--primary" data-action="accept-all">${escapeHtml(t.acceptAll)}</button>
      <button type="button" class="compliflow-cb__btn ${d.verhalten.rejectAllProminent ? "compliflow-cb__btn--secondary" : "compliflow-cb__btn--ghost"}" data-action="reject-all">${escapeHtml(t.rejectAll)}</button>
      ${d.verhalten.settingsButton ? `<button type="button" class="compliflow-cb__btn compliflow-cb__btn--ghost" data-action="toggle-settings">${escapeHtml(t.settingsOeffnen)}</button>` : ""}
    </div>`;

  const creditHtml = credit
    ? `<div class="compliflow-cb__credit">Cookie-Banner von <a href="https://compliflow.de?ref=embed-cookie-banner" target="_blank" rel="noopener">Compliflow</a></div>`
    : "";

  const backdrop = d.stil === "modal" && d.verhalten.blockiertHintergrund
    ? `<div class="compliflow-cb-backdrop" id="compliflow-cb-backdrop"></div>`
    : "";

  return `${backdrop}<div class="compliflow-cb" id="compliflow-cb" role="dialog" aria-modal="${d.stil === "modal"}" aria-labelledby="compliflow-cb-headline" hidden>
  <div class="compliflow-cb__inner">
    <div class="compliflow-cb__text">
      <h2 id="compliflow-cb-headline" class="compliflow-cb__headline">${escapeHtml(t.headline)}</h2>
      <p class="compliflow-cb__desc">${escapeHtml(t.beschreibung)}</p>
      <div class="compliflow-cb__links">${datenschutzLink}${d.anbieter.impressumUrl ? impressumLink : ""}</div>
    </div>
    <div>
      ${buttonsHtml}
    </div>
    ${settingsHtml}
    ${creditHtml}
  </div>
</div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// JS-Builder (Vanilla JS, kein React/Frameworks)
// ─────────────────────────────────────────────────────────────────────────────

function buildToolLoader(tools: TrackingTool[]): string {
  if (tools.length === 0) return "";
  const grouped: Record<KategorieId, TrackingTool[]> = {
    essential: [],
    funktional: [],
    statistik: [],
    marketing: [],
  };
  tools.forEach((t) => {
    if (grouped[t.kategorie]) grouped[t.kategorie].push(t);
  });

  return Object.entries(grouped)
    .filter(([_, ts]) => ts.length > 0)
    .map(
      ([kat, ts]) => `      if (consent.${kat}) {
${ts.map((t) => buildSingleToolLoad(t)).join("\n")}
      }`,
    )
    .join("\n");
}

function buildSingleToolLoad(t: TrackingTool): string {
  const name = JSON.stringify(t.name);
  if (t.inlineScript) {
    // Inline script
    return `        // ${t.name} (inline)
        if (!document.getElementById("cf-loaded-${t.id}")) {
          var inlineScript${t.id} = document.createElement("script");
          inlineScript${t.id}.id = "cf-loaded-${t.id}";
          inlineScript${t.id}.text = ${JSON.stringify(t.inlineScript)};
          document.head.appendChild(inlineScript${t.id});
        }`;
  }
  if (t.typ === "ga4" && t.configId) {
    return `        // Google Analytics 4
        if (!window.gtag) {
          var gaScript = document.createElement("script");
          gaScript.async = true;
          gaScript.src = "https://www.googletagmanager.com/gtag/js?id=${t.configId}";
          document.head.appendChild(gaScript);
          window.dataLayer = window.dataLayer || [];
          window.gtag = function(){ window.dataLayer.push(arguments); };
          window.gtag("js", new Date());
          window.gtag("config", "${t.configId}", { anonymize_ip: true });
        }`;
  }
  if (t.typ === "gtm" && t.configId) {
    return `        // Google Tag Manager
        if (!window.dataLayer) {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
          var gtmScript = document.createElement("script");
          gtmScript.async = true;
          gtmScript.src = "https://www.googletagmanager.com/gtm.js?id=${t.configId}";
          document.head.appendChild(gtmScript);
        }`;
  }
  if (t.typ === "plausible" && t.configId) {
    return `        // Plausible Analytics
        if (!document.getElementById("cf-plausible")) {
          var pl = document.createElement("script");
          pl.id = "cf-plausible";
          pl.defer = true;
          pl.dataset.domain = "${t.configId}";
          pl.src = ${JSON.stringify(t.scriptSrc || "https://plausible.io/js/script.js")};
          document.head.appendChild(pl);
        }`;
  }
  if (t.typ === "meta_pixel" && t.configId) {
    return `        // Meta Pixel
        if (!window.fbq) {
          !function(f,b,e,v,n,t,s){
            if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
          }(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
          window.fbq("init", "${t.configId}");
          window.fbq("track", "PageView");
        }`;
  }
  if (t.scriptSrc) {
    // Generic external script
    return `        // ${t.name}
        if (!document.querySelector('script[data-cf-id="${t.id}"]')) {
          var sc = document.createElement("script");
          sc.async = true;
          sc.src = ${JSON.stringify(t.scriptSrc + (t.configId ?? ""))};
          sc.dataset.cfId = "${t.id}";
          document.head.appendChild(sc);
        }`;
  }
  return `        // ${t.name} (kein Loader konfiguriert)`;
}

function buildJs(d: CookieBannerData): string {
  const cfg = {
    storageKey: d.storageKey,
    consentLaufzeitMs: d.verhalten.consentLaufzeitMonate * 30 * 24 * 60 * 60 * 1000,
    autoOeffnen: d.verhalten.autoOeffnen,
    settingsButton: d.verhalten.settingsButton,
    aktiveKategorien: d.kategorien.filter((k) => k.aktiv).map((k) => k.id),
    pflichtKategorien: d.kategorien.filter((k) => k.aktiv && k.pflicht).map((k) => k.id),
  };
  const toolLoader = buildToolLoader(d.trackingTools);

  return `<script id="compliflow-cb-script">
(function() {
  "use strict";

  var CFG = ${JSON.stringify(cfg)};
  var BANNER_ID = "compliflow-cb";
  var BACKDROP_ID = "compliflow-cb-backdrop";
  var SETTINGS_ID = "compliflow-cb-settings";

  function read() {
    try {
      var raw = localStorage.getItem(CFG.storageKey);
      if (!raw) return null;
      var p = JSON.parse(raw);
      if (!p || !p.consent || !p.timestamp) return null;
      // 12-Monats-Reset (DSK 2024)
      if (Date.now() - p.timestamp > CFG.consentLaufzeitMs) return null;
      return p;
    } catch(e) { return null; }
  }

  function write(consent) {
    try {
      localStorage.setItem(CFG.storageKey, JSON.stringify({
        consent: consent,
        timestamp: Date.now(),
        version: 1
      }));
    } catch(e) {}
  }

  function buildConsent(action) {
    var consent = {};
    CFG.aktiveKategorien.forEach(function(k) {
      if (CFG.pflichtKategorien.indexOf(k) !== -1) { consent[k] = true; return; }
      if (action === "accept-all") consent[k] = true;
      else if (action === "reject-all") consent[k] = false;
      else consent[k] = false;
    });
    return consent;
  }

  function buildConsentFromSettings() {
    var consent = {};
    CFG.aktiveKategorien.forEach(function(k) {
      if (CFG.pflichtKategorien.indexOf(k) !== -1) { consent[k] = true; return; }
      var input = document.querySelector('input[data-category="'+k+'"]');
      consent[k] = input ? input.checked : false;
    });
    return consent;
  }

  function loadTools(consent) {
${toolLoader || "      // Keine Tracking-Tools konfiguriert"}
    window.dispatchEvent(new CustomEvent("compliflow:consent-applied", { detail: consent }));
  }

  function applyAndHide(consent) {
    write(consent);
    loadTools(consent);
    var banner = document.getElementById(BANNER_ID);
    if (banner) banner.hidden = true;
    var backdrop = document.getElementById(BACKDROP_ID);
    if (backdrop) backdrop.style.display = "none";
    document.body.style.overflow = "";
  }

  function showBanner() {
    var banner = document.getElementById(BANNER_ID);
    if (banner) banner.hidden = false;
    var backdrop = document.getElementById(BACKDROP_ID);
    if (backdrop) backdrop.style.display = "block";
  }

  function init() {
    var banner = document.getElementById(BANNER_ID);
    if (!banner) return;
    banner.addEventListener("click", function(e) {
      var target = e.target;
      if (!target || !target.dataset || !target.dataset.action) return;
      var action = target.dataset.action;
      if (action === "accept-all") {
        applyAndHide(buildConsent("accept-all"));
      } else if (action === "reject-all") {
        applyAndHide(buildConsent("reject-all"));
      } else if (action === "save") {
        applyAndHide(buildConsentFromSettings());
      } else if (action === "toggle-settings") {
        var settings = document.getElementById(SETTINGS_ID);
        if (settings) settings.classList.toggle("is-open");
      }
    });

    var existing = read();
    if (existing) {
      loadTools(existing.consent);
    } else if (CFG.autoOeffnen) {
      showBanner();
    }

    // Globaler Re-Open Hook
    window.compliflowCookies = {
      open: showBanner,
      reset: function() { try { localStorage.removeItem(CFG.storageKey); } catch(e) {} showBanner(); },
      consent: function() { var p = read(); return p ? p.consent : null; },
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
</script>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Builder
// ─────────────────────────────────────────────────────────────────────────────

export type BuildOptions = {
  /** Compliflow-Credit-Footer einbinden (Watermark) */
  credit?: boolean;
};

/**
 * Generiert das komplette Snippet zum Einbau in <body>.
 * User-Webseite muss nur diesen Block in den <body> einfügen.
 */
export function buildSnippet(d: CookieBannerData, options: BuildOptions = {}): string {
  const credit = options.credit !== false;
  const css = buildCss(d);
  const html = buildBannerHtml(d, { credit });
  const js = buildJs(d);

  return `<!-- Compliflow Cookie-Banner v1 — erstellt am ${d.letztAktualisiert} -->
<!-- ${credit ? "Free-Tier mit Compliflow-Credit. Für werbefreien Output: Watermark-Removal über compliflow.de." : "Premium-Tier ohne Compliflow-Credit"} -->
<div id="compliflow-cb-root">
${css}
${html}
${js}
</div>
<!-- Ende Compliflow Cookie-Banner -->`;
}

/**
 * Plaintext-Variante: nicht sinnvoll für Banner. Aber als Erklärung:
 */
export function buildAnleitung(d: CookieBannerData): string {
  return `Cookie-Banner Einbau-Anleitung
============================

1. Snippet kopieren (siehe HTML-Tab)
2. Den kompletten Block direkt VOR dem schließenden </body>-Tag deiner Webseite einfügen
3. Tracking-Skripte (Google Analytics etc.) NICHT mehr separat einbinden — der Banner lädt sie selbst nach Consent

Konfigurierte Tracking-Tools:
${d.trackingTools.map((t) => `- ${t.name} (Kategorie: ${t.kategorie})`).join("\n") || "- Keine Tracking-Tools konfiguriert"}

Banner neu öffnen (z.B. via Footer-Link "Cookie-Einstellungen"):
<a href="#" onclick="event.preventDefault(); window.compliflowCookies && window.compliflowCookies.open();">Cookie-Einstellungen</a>

Consent zurücksetzen (für Tests):
window.compliflowCookies.reset();

Aktuellen Consent-Status abrufen:
window.compliflowCookies.consent();

Stand: ${d.letztAktualisiert}
`;
}
