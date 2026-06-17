/**
 * Cookie-Banner-Datenmodell
 * Quellen: § 25 TDDDG + Art. 6/7 DSGVO + BGH 2025 (Reject-All-Prominenz)
 * Stand: 2026-06-16
 */

// ─────────────────────────────────────────────────────────────────────────────
// Stil / Layout
// ─────────────────────────────────────────────────────────────────────────────

export type BannerStil =
  | "bottom_bar"      // Sticky-Bar unten
  | "modal"           // Modal in Bildschirmmitte
  | "sidebar_left"    // Slide-In von links
  | "sidebar_right";  // Slide-In von rechts

export type Sprache = "de" | "en";

export type Farbschema = {
  primaer: string;        // Accept-Button (z.B. "#FF4D00")
  primaerText: string;    // Text auf Accept-Button (z.B. "#FFFFFF")
  sekundaer: string;      // Reject-Button (z.B. "#1F2937")
  sekundaerText: string;  // Text auf Reject-Button
  hintergrund: string;    // Banner-Background (z.B. "#FFFFFF")
  text: string;           // Banner-Text
  link: string;           // Link-Farbe für Datenschutz/Impressum
  rand: string;           // Border-Farbe
};

// ─────────────────────────────────────────────────────────────────────────────
// Kategorien
// ─────────────────────────────────────────────────────────────────────────────

export type KategorieId = "essential" | "funktional" | "statistik" | "marketing";

export type KategorieConfig = {
  id: KategorieId;
  aktiv: boolean;             // wird im Banner angeboten?
  name: string;
  beschreibung: string;
  pflicht: boolean;           // essential = immer pflicht, kein Opt-Out
};

// ─────────────────────────────────────────────────────────────────────────────
// Tracking-Tools (werden nach Consent geladen)
// ─────────────────────────────────────────────────────────────────────────────

export type TrackingToolTyp =
  | "ga4"                  // Google Analytics 4
  | "gtm"                  // Google Tag Manager
  | "plausible"            // Plausible Analytics
  | "matomo"               // Matomo
  | "hotjar"               // Hotjar
  | "microsoft_clarity"
  | "meta_pixel"           // Facebook Pixel
  | "tiktok_pixel"
  | "linkedin_insight"
  | "google_ads"
  | "youtube_iframe"
  | "vimeo"
  | "google_maps"
  | "google_fonts"
  | "google_recaptcha"
  | "intercom"
  | "crisp_chat"
  | "custom_script";       // freier Script-Block

export type TrackingTool = {
  id: string;
  typ: TrackingToolTyp;
  name: string;
  kategorie: KategorieId;
  /** Bei externen Scripts: src URL */
  scriptSrc?: string;
  /** Bei Tag-IDs (GA4, GTM, Meta etc.) */
  configId?: string;
  /** Bei custom_script: kompletter Script-Inhalt */
  inlineScript?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Verhalten
// ─────────────────────────────────────────────────────────────────────────────

export type Verhalten = {
  /** Reject-All gleich prominent wie Accept-All (BGH 2025 Pflicht) */
  rejectAllProminent: boolean;
  /** Detaillierte Einstellungen anbieten */
  settingsButton: boolean;
  /** Consent-Lifetime in Monaten (DSK: max. 12 Monate, nach denen Re-Consent) */
  consentLaufzeitMonate: number;
  /** Banner beim ersten Besuch automatisch öffnen */
  autoOeffnen: boolean;
  /** "Weiter ohne Tracking" als 3. Option */
  weiterOhneTracking: boolean;
  /** Cookie-Banner blockiert den Hintergrund (modal-Verhalten) */
  blockiertHintergrund: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Texte (auf Sprache anpassbar)
// ─────────────────────────────────────────────────────────────────────────────

export type Texte = {
  headline: string;
  beschreibung: string;
  acceptAll: string;
  rejectAll: string;
  settingsOeffnen: string;
  einstellungenSpeichern: string;
  settingsHeadline: string;
  datenschutzLink: string;
  impressumLink: string;
  notwendigPflicht: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Anbieter (für Verlinkung)
// ─────────────────────────────────────────────────────────────────────────────

export type Anbieter = {
  name: string;
  datenschutzUrl: string;
  impressumUrl: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Hauptmodell
// ─────────────────────────────────────────────────────────────────────────────

export type CookieBannerData = {
  schemaVersion: 1;

  // 1. Anbieter
  anbieter: Anbieter;

  // 2. Sprache + Texte
  sprache: Sprache;
  texte: Texte;

  // 3. Stil
  stil: BannerStil;
  farben: Farbschema;
  schriftgroesseRem: number;     // default 0.875
  abgerundetPx: number;          // border-radius, default 8
  schatten: boolean;

  // 4. Kategorien
  kategorien: KategorieConfig[];

  // 5. Tracking-Tools
  trackingTools: TrackingTool[];

  // 6. Verhalten
  verhalten: Verhalten;

  // 7. Storage
  storageKey: string;            // localStorage key

  // 8. Meta
  letztAktualisiert: string;
  erstelltAm: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Wizard-Steps
// ─────────────────────────────────────────────────────────────────────────────

export type WizardStep =
  | "anbieter"
  | "kategorien"
  | "tracking"
  | "stil"
  | "verhalten"
  | "review";

export const WIZARD_STEPS: { id: WizardStep; label: string; sub: string }[] = [
  { id: "anbieter",   label: "Anbieter",     sub: "Name + Verlinkungen" },
  { id: "kategorien", label: "Kategorien",   sub: "Welche Cookies du nutzt" },
  { id: "tracking",   label: "Tracking",     sub: "Welche Tools nach Consent laden" },
  { id: "stil",       label: "Stil",         sub: "Layout + Farben" },
  { id: "verhalten",  label: "Verhalten",    sub: "Reject-All + Lifetime + Auto-Open" },
  { id: "review",     label: "Export",       sub: "Snippet kopieren" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Labels für UI
// ─────────────────────────────────────────────────────────────────────────────

export const STIL_LABELS: Record<BannerStil, { name: string; beschreibung: string }> = {
  bottom_bar:    { name: "Sticky-Bar unten",  beschreibung: "Schmaler Streifen am unteren Bildschirmrand. Unauffälligste Variante." },
  modal:         { name: "Modal in Mitte",     beschreibung: "Pop-up in der Bildschirmmitte. Blockiert den Hintergrund." },
  sidebar_left:  { name: "Slide-In links",    beschreibung: "Schmale Karte slidet von links rein. Mobil-freundlich." },
  sidebar_right: { name: "Slide-In rechts",   beschreibung: "Schmale Karte slidet von rechts rein. Mobil-freundlich." },
};

export const SPRACHE_LABELS: Record<Sprache, string> = {
  de: "Deutsch",
  en: "English",
};

export const KATEGORIE_LABELS: Record<KategorieId, { name: string; pflicht: boolean }> = {
  essential:  { name: "Technisch notwendig",  pflicht: true  },
  funktional: { name: "Funktional / Komfort", pflicht: false },
  statistik:  { name: "Statistik / Analytics", pflicht: false },
  marketing:  { name: "Marketing / Werbung",  pflicht: false },
};

export const TOOL_TYP_LABELS: Record<TrackingToolTyp, { name: string; kategorie: KategorieId; defaultSrc?: string }> = {
  ga4:                { name: "Google Analytics 4", kategorie: "statistik", defaultSrc: "https://www.googletagmanager.com/gtag/js?id=" },
  gtm:                { name: "Google Tag Manager", kategorie: "marketing", defaultSrc: "https://www.googletagmanager.com/gtm.js?id=" },
  plausible:          { name: "Plausible Analytics", kategorie: "statistik", defaultSrc: "https://plausible.io/js/script.js" },
  matomo:             { name: "Matomo", kategorie: "statistik" },
  hotjar:             { name: "Hotjar", kategorie: "statistik", defaultSrc: "https://static.hotjar.com/c/hotjar-" },
  microsoft_clarity:  { name: "Microsoft Clarity", kategorie: "statistik", defaultSrc: "https://www.clarity.ms/tag/" },
  meta_pixel:         { name: "Meta Pixel (Facebook/Instagram)", kategorie: "marketing", defaultSrc: "https://connect.facebook.net/en_US/fbevents.js" },
  tiktok_pixel:       { name: "TikTok Pixel", kategorie: "marketing", defaultSrc: "https://analytics.tiktok.com/i18n/pixel/events.js" },
  linkedin_insight:   { name: "LinkedIn Insight Tag", kategorie: "marketing", defaultSrc: "https://snap.licdn.com/li.lms-analytics/insight.min.js" },
  google_ads:         { name: "Google Ads (Conversion)", kategorie: "marketing", defaultSrc: "https://www.googletagmanager.com/gtag/js?id=" },
  youtube_iframe:     { name: "YouTube Embeds", kategorie: "funktional" },
  vimeo:              { name: "Vimeo Embeds", kategorie: "funktional" },
  google_maps:        { name: "Google Maps Embeds", kategorie: "funktional", defaultSrc: "https://maps.googleapis.com/maps/api/js" },
  google_fonts:       { name: "Google Fonts (extern geladen)", kategorie: "funktional", defaultSrc: "https://fonts.googleapis.com/css2" },
  google_recaptcha:   { name: "Google reCAPTCHA", kategorie: "essential", defaultSrc: "https://www.google.com/recaptcha/api.js" },
  intercom:           { name: "Intercom Chat", kategorie: "funktional" },
  crisp_chat:         { name: "Crisp Chat", kategorie: "funktional", defaultSrc: "https://client.crisp.chat/l.js" },
  custom_script:      { name: "Eigenes Script", kategorie: "statistik" },
};
