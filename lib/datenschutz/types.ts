/**
 * Datenschutzerklärung-Datenmodell
 * Quelle: Art. 13/14 DSGVO + § 25 TDDDG (ehem. TTDSG) + GDD-Mustertexte 2026 + Bitkom + DSK-Orientierungshilfen
 * Stand: 2026-06-13
 */

import type { Land } from "../impressum/types";

// ─────────────────────────────────────────────────────────────────────────────
// Bundesland — für lokale Aufsichtsbehörden-Auswahl (DSGVO Art. 77)
// ─────────────────────────────────────────────────────────────────────────────

export type Bundesland =
  | "BW" | "BY" | "BE" | "BB" | "HB" | "HH" | "HE" | "MV"
  | "NI" | "NW" | "RP" | "SL" | "SN" | "ST" | "SH" | "TH"
  | "AT_BUND" | "CH_BUND" | "BUND" | "UNBEKANNT";

// ─────────────────────────────────────────────────────────────────────────────
// Verantwortlicher
// ─────────────────────────────────────────────────────────────────────────────

export type Verantwortlicher = {
  name: string;          // Bei juristischen Personen: Firma
  vorname?: string;
  nachname?: string;
  strasse: string;
  plz: string;
  ort: string;
  land: Land;
  bundesland?: Bundesland;
  email: string;
  telefon?: string;
};

export type Datenschutzbeauftragter = {
  aktiv: boolean;
  name?: string;
  email?: string;
  telefon?: string;
  istExtern?: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Hosting
// ─────────────────────────────────────────────────────────────────────────────

export type HostingProvider =
  | "hetzner"
  | "ionos"
  | "strato"
  | "all_inkl"
  | "netcup"
  | "vercel"
  | "cloudflare_pages"
  | "aws"
  | "azure"
  | "gcp"
  | "andere";

export type HostingConfig = {
  provider: HostingProvider;
  customName?: string;       // bei "andere"
  region?: string;           // z.B. "EU-Frankfurt", "USA"
  istEU: boolean;            // EU-Hosting?
};

// ─────────────────────────────────────────────────────────────────────────────
// Analytics & Tracking
// ─────────────────────────────────────────────────────────────────────────────

export type AnalyticsTool =
  | "plausible"
  | "matomo"
  | "ga4"                // Google Analytics 4
  | "hotjar"
  | "microsoft_clarity"
  | "umami"
  | "fathom";

export type AnalyticsConfig = {
  tool: AnalyticsTool;
  istEUHosting: boolean;     // bei Matomo/Umami self-hosted
  anonymisiereIp: boolean;   // typisch bei GA4
};

// ─────────────────────────────────────────────────────────────────────────────
// Newsletter
// ─────────────────────────────────────────────────────────────────────────────

export type NewsletterProvider =
  | "brevo"
  | "mailerlite"
  | "rapidmail"
  | "cleverreach"
  | "mailchimp"
  | "convertkit"
  | "selbst_gehostet";

export type NewsletterConfig = {
  aktiv: boolean;
  provider?: NewsletterProvider;
  doubleOptIn: boolean;     // Pflicht in DE — sollte immer true sein
  trackingAktiv: boolean;   // Open/Click-Tracking
};

// ─────────────────────────────────────────────────────────────────────────────
// Payment
// ─────────────────────────────────────────────────────────────────────────────

export type PaymentProvider =
  | "stripe"
  | "paypal"
  | "klarna"
  | "sofort"               // alias SOFORT/Klarna
  | "amazon_pay"
  | "apple_pay"
  | "google_pay"
  | "rechnung"
  | "ueberweisung"
  | "lastschrift";

// ─────────────────────────────────────────────────────────────────────────────
// Social Media + Embedded Content
// ─────────────────────────────────────────────────────────────────────────────

export type SocialEmbed =
  | "facebook_plugin"
  | "instagram_plugin"
  | "twitter_x_widget"
  | "linkedin_insight"
  | "linkedin_share"
  | "youtube_embed"
  | "vimeo_embed"
  | "tiktok_embed";

export type EmbeddedService =
  | "google_fonts"
  | "google_maps"
  | "google_recaptcha"
  | "calendly"
  | "cal_com"
  | "intercom"
  | "crisp_chat"
  | "tawk_to"
  | "typeform"
  | "youtube_iframe"
  | "stripe_elements";

// ─────────────────────────────────────────────────────────────────────────────
// Cookies
// ─────────────────────────────────────────────────────────────────────────────

export type CookieKategorie =
  | "essential"      // Technisch notwendig — kein Consent nötig
  | "funktional"     // Sprache, Theme etc.
  | "statistik"      // Analytics
  | "marketing"      // Ads, Remarketing
  | "social";        // Social-Plugin-Cookies

export type CookieConfig = {
  kategorien: CookieKategorie[];
  hatConsentBanner: boolean;        // Hat User einen Cookie-Banner?
  bannerTool?: "compliflow" | "borlabs" | "cookiebot" | "usercentrics" | "selbst" | "keiner";
};

// ─────────────────────────────────────────────────────────────────────────────
// Funktionen der Webseite
// ─────────────────────────────────────────────────────────────────────────────

export type WebsiteFunktion = {
  kontaktformular: boolean;
  bewerbungsformular: boolean;
  kundenkonto: boolean;
  shop: boolean;
  blog: boolean;
  forum: boolean;
  liveChat: boolean;
  buchungssystem: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Drittlandtransfer
// ─────────────────────────────────────────────────────────────────────────────

export type Drittland =
  | "USA"
  | "UK"
  | "Schweiz"
  | "Indien"
  | "Kanada"
  | "Andere";

export type DrittlandConfig = {
  aktiv: boolean;
  laender: Drittland[];
  sccsVorhanden: boolean;          // Standardvertragsklauseln
  tiaDurchgefuehrt: boolean;       // Transfer Impact Assessment
};

// ─────────────────────────────────────────────────────────────────────────────
// Branche / Kontext
// ─────────────────────────────────────────────────────────────────────────────

export type Branche =
  | "allgemein"
  | "arzt"               // Arztpraxis, Therapeut, Psychotherapie
  | "anwalt"             // Anwalt, StB, WP, Notar
  | "pflege"             // Pflegedienst, Pflegeheim
  | "hotel"              // Hotel, Beherbergung
  | "versicherung"       // Versicherungen, Finanzdienstleister
  | "ki_saas"            // KI-/SaaS-Anbieter
  | "schule"             // Schule, Hochschule, öffentliche Stelle
  | "verein"             // Verein, Stiftung
  | "ecommerce";         // E-Commerce, Shop

export type Zielgruppe = "b2c" | "b2b" | "beide" | "auch_kinder_unter_16";

// ─────────────────────────────────────────────────────────────────────────────
// HR / Beschäftigte
// ─────────────────────────────────────────────────────────────────────────────

export type BewerberMgmtSystem =
  | "personio"
  | "bamboohr"
  | "workday"
  | "greenhouse"
  | "lever"
  | "softgarden"
  | "selbst_gehostet"
  | "andere";

export type HRConfig = {
  bewerbungsformular: boolean;
  bewerberMgmt?: BewerberMgmtSystem;
  bewerberMgmtCustom?: string;
  mitarbeiterfotos: boolean;         // Team-Seite mit Mitarbeiter-Bildern
  backgroundCheck: boolean;          // Pre-Employment-Screening
  hinschgMeldekanal: boolean;        // HinSchG-Meldekanal (Pflicht >50 MA)
};

// ─────────────────────────────────────────────────────────────────────────────
// Marketing / Tracking erweitert
// ─────────────────────────────────────────────────────────────────────────────

export type MarketingTool =
  | "meta_pixel"            // Facebook/Instagram Pixel
  | "meta_conversion_api"   // Server-Side Meta
  | "google_ads"
  | "google_ads_remarketing"
  | "tiktok_pixel"
  | "linkedin_insight"
  | "pinterest_tag"
  | "twitter_pixel"
  | "outbrain"
  | "taboola"
  | "criteo"
  | "rtb_house";

export type CdpTool =
  | "segment"
  | "rudderstack"
  | "hightouch"
  | "tealium"
  | "selbst_gehostet"
  | "keiner";

// ─────────────────────────────────────────────────────────────────────────────
// E-Commerce erweitert
// ─────────────────────────────────────────────────────────────────────────────

export type Versanddienstleister =
  | "dhl"
  | "hermes"
  | "dpd"
  | "gls"
  | "ups"
  | "fedex"
  | "deutsche_post"
  | "trans_o_flex"
  | "andere";

export type Bewertungssystem =
  | "trusted_shops"
  | "ekomi"
  | "trustpilot"
  | "google_reviews"
  | "ausgezeichnet_org"
  | "shopvote"
  | "keiner";

export type Auskunftei =
  | "schufa"
  | "creditreform"
  | "infoscore"
  | "crif_buergel"
  | "boniversum";

export type EcommerceConfig = {
  bestellungen: boolean;
  versand: Versanddienstleister[];
  bonitaetspruefung: boolean;
  auskunftei?: Auskunftei[];
  bewertungssystem: Bewertungssystem;
  treueprogramm: boolean;
  bnpl_aktiv: boolean;                // Buy Now Pay Later
};

// ─────────────────────────────────────────────────────────────────────────────
// Kommunikation erweitert
// ─────────────────────────────────────────────────────────────────────────────

export type ChatProvider =
  | "crisp"
  | "intercom"
  | "tawk_to"
  | "zendesk_chat"
  | "userlike"
  | "olark"
  | "selbst_gehostet";

export type KiChatbotProvider =
  | "openai"            // ChatGPT API
  | "anthropic"         // Claude API
  | "google_gemini"
  | "mistral"
  | "azure_openai"
  | "selbst_gehostet"
  | "andere";

export type VideoCallProvider =
  | "zoom"
  | "ms_teams"
  | "google_meet"
  | "webex"
  | "jitsi"
  | "bigbluebutton"
  | "whereby"
  | "andere";

export type KommunikationConfig = {
  kontaktformular: boolean;
  liveChat: boolean;
  chatProvider?: ChatProvider;
  kiChatbot: boolean;
  kiChatbotProvider?: KiChatbotProvider;
  kiTrainingAusgeschlossen: boolean;     // AVV schließt Training aus
  webinare: boolean;
  videoCallProvider?: VideoCallProvider;
  pushNotifications: boolean;
  pushAnbieter?: "eigene_loesung" | "onesignal" | "firebase_fcm" | "pushwoosh";
};

// ─────────────────────────────────────────────────────────────────────────────
// Spezielle Verarbeitungen
// ─────────────────────────────────────────────────────────────────────────────

export type SpezialConfig = {
  profiling: boolean;                  // Algorithmische Bewertung von Personen
  automatisierte_entscheidung: boolean; // Art. 22 DSGVO
  jointController: boolean;            // Art. 26 DSGVO (z.B. bei Meta Pixel auto-true)
  videoueberwachung_live: boolean;     // Live-Cam auf Webseite
  besondere_kategorien_art9: boolean;  // Gesundheits-/Religions-/etc. Daten
  cdp?: CdpTool;                       // Customer Data Platform
};

// ─────────────────────────────────────────────────────────────────────────────
// Embed-Optionen erweitert
// ─────────────────────────────────────────────────────────────────────────────

export type EmbedOptionen = {
  googleFontsLokal: boolean;       // true = lokal gehostet, false = extern
  youtubeNoCookieMode: boolean;    // youtube-nocookie.com Mode aktiv?
  serverSideTracking: boolean;     // GTM Server-Side
};

// ─────────────────────────────────────────────────────────────────────────────
// Skalen für Mitarbeiterzahl (DSB- + HinSchG-Trigger)
// ─────────────────────────────────────────────────────────────────────────────

export type Mitarbeiterzahl =
  | "solo"             // 1 Person
  | "klein_2_19"       // 2-19 MA (keine DSB-Pflicht)
  | "schwelle_20_49"   // 20-49 MA (DSB-Pflicht!)
  | "mittel_50_249"    // 50-249 MA (DSB + HinSchG)
  | "gross_250plus";   // 250+ MA (alle Pflichten)

// ─────────────────────────────────────────────────────────────────────────────
// Hauptmodell
// ─────────────────────────────────────────────────────────────────────────────

export type DatenschutzData = {
  schemaVersion: 2;                   // erhöht weil Schema-Erweiterung

  // 1. Verantwortlicher + Branche
  verantwortlicher: Verantwortlicher;
  dsb: Datenschutzbeauftragter;
  branche: Branche;
  brancheCustom?: string;
  zielgruppe: Zielgruppe;
  mitarbeiterzahl: Mitarbeiterzahl;

  // 2. Hosting
  hosting: HostingConfig;
  embedOptionen: EmbedOptionen;

  // 3. Analytics & Tracking
  analytics: AnalyticsConfig[];

  // 4. Marketing erweitert
  marketing: MarketingTool[];

  // 5. Newsletter
  newsletter: NewsletterConfig;

  // 6. Payment + E-Commerce
  payment: PaymentProvider[];
  ecommerce: EcommerceConfig;

  // 7. Social + Embedded
  social: SocialEmbed[];
  embedded: EmbeddedService[];

  // 8. Cookies
  cookies: CookieConfig;

  // 9. Kommunikation (Kontakt + Chat + KI + Webinar + Push)
  kommunikation: KommunikationConfig;

  // 10. HR / Beschäftigte
  hr: HRConfig;

  // 11. Funktionen (Login, Konto, etc.)
  funktionen: WebsiteFunktion;

  // 12. Spezielle Verarbeitungen
  spezial: SpezialConfig;

  // 13. Drittlandtransfer
  drittland: DrittlandConfig;

  // 14. Meta
  letztAktualisiert: string;
  erstelltAm: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Wizard-Steps (erweitert auf 12 Steps mit Conditional-Branching)
// ─────────────────────────────────────────────────────────────────────────────

export type WizardStep =
  | "verantwortlicher"     // 1. Wer + Branche + Mitarbeiterzahl
  | "hosting"              // 2. Hosting
  | "kommunikation"        // 3. Kontakt, Chat, KI, Webinare, Push
  | "analytics"            // 4. Analytics
  | "marketing"            // 5. Pixel, Ads, Retargeting
  | "newsletter"           // 6. Newsletter
  | "ecommerce"            // 7. Shop, Zahlung, Versand, Bonität (nur wenn Shop aktiv)
  | "social"               // 8. Social + Embeds
  | "hr"                   // 9. Bewerbung, Mitarbeiterfotos, HinSchG (conditional)
  | "spezial"              // 10. Profiling, autom. Entscheidung, Video
  | "drittland"            // 11. Drittlandtransfer-Übersicht
  | "review";              // 12. Review + Export

export const WIZARD_STEPS: { id: WizardStep; label: string; sub: string }[] = [
  { id: "verantwortlicher", label: "Verantwortlicher",  sub: "Wer + Branche + Mitarbeiterzahl" },
  { id: "hosting",          label: "Hosting",           sub: "Wer hostet deine Webseite" },
  { id: "kommunikation",    label: "Kommunikation",     sub: "Kontakt, Chat, KI, Webinare" },
  { id: "analytics",        label: "Analytics",         sub: "Was misst du auf der Seite" },
  { id: "marketing",        label: "Marketing & Pixel", sub: "Werbung, Retargeting, CDP" },
  { id: "newsletter",       label: "Newsletter",        sub: "Email-Marketing-Tool" },
  { id: "ecommerce",        label: "Shop & Zahlung",    sub: "Bestellungen, Versand, Bonität" },
  { id: "social",           label: "Social & Embeds",   sub: "Eingebettete Inhalte" },
  { id: "hr",               label: "Beschäftigte",      sub: "Bewerbung, Team-Fotos, HinSchG" },
  { id: "spezial",          label: "Spezielles",        sub: "Profiling, Automatisierung" },
  { id: "drittland",        label: "Drittländer",       sub: "Datentransfer außerhalb EU" },
  { id: "review",           label: "Prüfen & Export",   sub: "HTML + PDF herunterladen" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Branchen-Labels
// ─────────────────────────────────────────────────────────────────────────────

export const BRANCHE_LABELS: Record<Branche, { name: string; sonderregeln: boolean }> = {
  allgemein:    { name: "Allgemein (keine Branchen-Sonderregeln)",     sonderregeln: false },
  arzt:         { name: "Arzt / Therapeut / Gesundheitsberuf",          sonderregeln: true  },
  anwalt:       { name: "Anwalt / Steuerberater / Wirtschaftsprüfer",   sonderregeln: true  },
  pflege:       { name: "Pflegedienst / Pflegeheim",                    sonderregeln: true  },
  hotel:        { name: "Hotel / Beherbergung",                         sonderregeln: true  },
  versicherung: { name: "Versicherung / Finanzdienstleister",           sonderregeln: true  },
  ki_saas:      { name: "KI-/SaaS-Anbieter",                            sonderregeln: true  },
  schule:       { name: "Schule / Hochschule / öffentliche Stelle",     sonderregeln: true  },
  verein:       { name: "Verein / Stiftung / e.V.",                     sonderregeln: true  },
  ecommerce:    { name: "Online-Shop / E-Commerce",                     sonderregeln: false },
};

export const ZIELGRUPPE_LABELS: Record<Zielgruppe, string> = {
  b2c: "Privatkunden (B2C)",
  b2b: "Unternehmenskunden (B2B)",
  beide: "Beide (B2C + B2B)",
  auch_kinder_unter_16: "Auch Kinder unter 16 Jahre",
};

export const MITARBEITERZAHL_LABELS: Record<Mitarbeiterzahl, { name: string; pflichten: string[] }> = {
  solo:           { name: "Solo (nur ich)",            pflichten: [] },
  klein_2_19:     { name: "2-19 Mitarbeiter",          pflichten: [] },
  schwelle_20_49: { name: "20-49 Mitarbeiter",         pflichten: ["Datenschutzbeauftragter Pflicht (§ 38 BDSG)"] },
  mittel_50_249:  { name: "50-249 Mitarbeiter",        pflichten: ["DSB Pflicht", "HinSchG-Meldekanal Pflicht"] },
  gross_250plus:  { name: "250+ Mitarbeiter",          pflichten: ["DSB Pflicht", "HinSchG-Meldekanal Pflicht", "VVT (Art. 30 DSGVO) immer Pflicht"] },
};

export const MARKETING_LABELS: Record<MarketingTool, { name: string; jointController: boolean; usAnbieter: boolean }> = {
  meta_pixel:              { name: "Meta Pixel (Facebook/Instagram)",       jointController: true,  usAnbieter: true  },
  meta_conversion_api:     { name: "Meta Conversion API (Server-Side)",     jointController: true,  usAnbieter: true  },
  google_ads:              { name: "Google Ads",                            jointController: false, usAnbieter: true  },
  google_ads_remarketing:  { name: "Google Ads Remarketing",                jointController: false, usAnbieter: true  },
  tiktok_pixel:            { name: "TikTok Pixel",                          jointController: false, usAnbieter: true  },
  linkedin_insight:        { name: "LinkedIn Insight Tag",                  jointController: false, usAnbieter: true  },
  pinterest_tag:           { name: "Pinterest Tag",                         jointController: false, usAnbieter: true  },
  twitter_pixel:           { name: "Twitter/X Pixel",                       jointController: false, usAnbieter: true  },
  outbrain:                { name: "Outbrain",                              jointController: false, usAnbieter: true  },
  taboola:                 { name: "Taboola",                               jointController: false, usAnbieter: true  },
  criteo:                  { name: "Criteo Retargeting",                    jointController: false, usAnbieter: false },
  rtb_house:               { name: "RTB House",                             jointController: false, usAnbieter: false },
};

export const VERSAND_LABELS: Record<Versanddienstleister, string> = {
  dhl: "DHL Paket GmbH",
  hermes: "Hermes Germany GmbH",
  dpd: "DPD Deutschland GmbH",
  gls: "GLS Germany GmbH & Co. OHG",
  ups: "United Parcel Service Deutschland S.à r.l. & Co. OHG",
  fedex: "FedEx Express Germany GmbH",
  deutsche_post: "Deutsche Post AG",
  trans_o_flex: "trans-o-flex Express GmbH & Co. KGaA",
  andere: "Anderer Versanddienstleister",
};

export const BEWERTUNG_LABELS: Record<Bewertungssystem, string> = {
  trusted_shops: "Trusted Shops",
  ekomi: "eKomi",
  trustpilot: "Trustpilot",
  google_reviews: "Google Reviews",
  ausgezeichnet_org: "Ausgezeichnet.org",
  shopvote: "Shopvote",
  keiner: "Kein Bewertungssystem",
};

export const AUSKUNFTEI_LABELS: Record<Auskunftei, string> = {
  schufa: "SCHUFA Holding AG",
  creditreform: "Creditreform Boniversum GmbH",
  infoscore: "infoscore Consumer Data GmbH (Arvato/Bertelsmann)",
  crif_buergel: "CRIF Bürgel GmbH",
  boniversum: "Boniversum (Verband der Vereine Creditreform e.V.)",
};

export const CHAT_LABELS: Record<ChatProvider, { name: string; istEU: boolean }> = {
  crisp:           { name: "Crisp",            istEU: true  },
  intercom:        { name: "Intercom",         istEU: false },
  tawk_to:         { name: "Tawk.to",          istEU: false },
  zendesk_chat:    { name: "Zendesk Chat",     istEU: false },
  userlike:        { name: "Userlike",         istEU: true  },
  olark:           { name: "Olark",            istEU: false },
  selbst_gehostet: { name: "Selbst gehostet",  istEU: true  },
};

export const KI_CHATBOT_LABELS: Record<KiChatbotProvider, { name: string; anbieter: string; istUS: boolean }> = {
  openai:          { name: "ChatGPT / OpenAI API",  anbieter: "OpenAI, L.L.C., USA",                        istUS: true  },
  anthropic:       { name: "Claude / Anthropic",    anbieter: "Anthropic, PBC, USA",                        istUS: true  },
  google_gemini:   { name: "Google Gemini",         anbieter: "Google Ireland Ltd. / Google LLC, USA",      istUS: true  },
  mistral:         { name: "Mistral AI",            anbieter: "Mistral AI SAS, Frankreich (EU)",            istUS: false },
  azure_openai:    { name: "Azure OpenAI Service",  anbieter: "Microsoft Ireland Operations Ltd. (EU-Region)", istUS: false },
  selbst_gehostet: { name: "Selbst gehostete LLM",  anbieter: "Eigene Server",                              istUS: false },
  andere:          { name: "Anderer KI-Anbieter",   anbieter: "Siehe Eintrag",                              istUS: false },
};

export const VIDEO_CALL_LABELS: Record<VideoCallProvider, { name: string; anbieter: string; istUS: boolean }> = {
  zoom:           { name: "Zoom",              anbieter: "Zoom Communications Inc., USA",                istUS: true  },
  ms_teams:       { name: "Microsoft Teams",   anbieter: "Microsoft Ireland Operations Ltd. (EU-Region)", istUS: false },
  google_meet:    { name: "Google Meet",       anbieter: "Google Ireland Ltd. / Google LLC, USA",        istUS: true  },
  webex:          { name: "Cisco Webex",       anbieter: "Cisco Systems Inc., USA",                      istUS: true  },
  jitsi:          { name: "Jitsi Meet",        anbieter: "Selbst gehostet / 8x8 Inc., USA",              istUS: false },
  bigbluebutton:  { name: "BigBlueButton",     anbieter: "Selbst gehostet (Open Source)",                istUS: false },
  whereby:        { name: "Whereby",           anbieter: "Whereby AS, Norwegen",                         istUS: false },
  andere:         { name: "Anderer Anbieter",  anbieter: "Siehe Eintrag",                                istUS: false },
};

export const BEWERBER_MGMT_LABELS: Record<BewerberMgmtSystem, { name: string; anbieter: string }> = {
  personio:        { name: "Personio",          anbieter: "Personio SE & Co. KG, Deutschland" },
  bamboohr:        { name: "BambooHR",          anbieter: "BambooHR LLC, USA" },
  workday:         { name: "Workday",           anbieter: "Workday Inc., USA" },
  greenhouse:      { name: "Greenhouse",        anbieter: "Greenhouse Software Inc., USA" },
  lever:           { name: "Lever",             anbieter: "Lever Inc., USA" },
  softgarden:      { name: "softgarden",        anbieter: "softgarden e-recruiting GmbH, Deutschland" },
  selbst_gehostet: { name: "Selbst gehostet",   anbieter: "Eigene Lösung" },
  andere:          { name: "Anderer Anbieter",  anbieter: "Siehe Eintrag" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Labels für UI
// ─────────────────────────────────────────────────────────────────────────────

export const HOSTING_LABELS: Record<HostingProvider, { name: string; istEU: boolean }> = {
  hetzner:           { name: "Hetzner Online GmbH",                    istEU: true  },
  ionos:             { name: "IONOS SE",                               istEU: true  },
  strato:            { name: "STRATO AG",                              istEU: true  },
  all_inkl:          { name: "ALL-INKL.COM",                           istEU: true  },
  netcup:            { name: "netcup GmbH",                            istEU: true  },
  vercel:            { name: "Vercel Inc.",                            istEU: false }, // USA
  cloudflare_pages:  { name: "Cloudflare, Inc.",                       istEU: false }, // USA
  aws:               { name: "Amazon Web Services (AWS)",              istEU: false }, // USA, EU-Region möglich
  azure:             { name: "Microsoft Azure",                        istEU: false }, // USA, EU-Region möglich
  gcp:               { name: "Google Cloud Platform",                  istEU: false }, // USA, EU-Region möglich
  andere:            { name: "Anderer Anbieter",                       istEU: true  }, // Default optimistisch
};

export const ANALYTICS_LABELS: Record<AnalyticsTool, { name: string; istEU: boolean; anbieter: string }> = {
  plausible:          { name: "Plausible Analytics",  istEU: true,  anbieter: "Plausible Insights OÜ (Estland)" },
  matomo:             { name: "Matomo",                istEU: true,  anbieter: "InnoCraft Ltd / self-hosted" },
  ga4:                { name: "Google Analytics 4",    istEU: false, anbieter: "Google Ireland Ltd / Google LLC" },
  hotjar:             { name: "Hotjar",                istEU: false, anbieter: "Hotjar Ltd (Malta)" },
  microsoft_clarity:  { name: "Microsoft Clarity",     istEU: false, anbieter: "Microsoft Corporation" },
  umami:              { name: "Umami",                 istEU: true,  anbieter: "Umami Software / self-hosted" },
  fathom:             { name: "Fathom Analytics",      istEU: false, anbieter: "Conva Ventures Inc. (Kanada)" },
};

export const NEWSLETTER_LABELS: Record<NewsletterProvider, { name: string; istEU: boolean }> = {
  brevo:           { name: "Brevo (ehem. Sendinblue)", istEU: true  },
  mailerlite:      { name: "MailerLite",                istEU: true  },
  rapidmail:       { name: "rapidmail",                 istEU: true  },
  cleverreach:     { name: "CleverReach",               istEU: true  },
  mailchimp:       { name: "Mailchimp",                 istEU: false },
  convertkit:      { name: "ConvertKit (Kit)",          istEU: false },
  selbst_gehostet: { name: "Selbst gehostet",           istEU: true  },
};

export const PAYMENT_LABELS: Record<PaymentProvider, string> = {
  stripe:        "Stripe",
  paypal:        "PayPal",
  klarna:        "Klarna",
  sofort:        "Sofortüberweisung (Klarna)",
  amazon_pay:    "Amazon Pay",
  apple_pay:     "Apple Pay",
  google_pay:    "Google Pay",
  rechnung:      "Kauf auf Rechnung",
  ueberweisung:  "Vorkasse / Banküberweisung",
  lastschrift:   "SEPA-Lastschrift",
};

export const SOCIAL_LABELS: Record<SocialEmbed, string> = {
  facebook_plugin:  "Facebook Plugin (Like-Button, Share)",
  instagram_plugin: "Instagram Embed",
  twitter_x_widget: "Twitter/X Widget",
  linkedin_insight: "LinkedIn Insight Tag",
  linkedin_share:   "LinkedIn Share-Button",
  youtube_embed:    "YouTube Video Embed",
  vimeo_embed:      "Vimeo Video Embed",
  tiktok_embed:     "TikTok Embed",
};

export const EMBEDDED_LABELS: Record<EmbeddedService, string> = {
  google_fonts:     "Google Fonts",
  google_maps:      "Google Maps",
  google_recaptcha: "Google reCAPTCHA",
  calendly:         "Calendly",
  cal_com:          "Cal.com",
  intercom:         "Intercom Chat",
  crisp_chat:       "Crisp Chat",
  tawk_to:          "Tawk.to Chat",
  typeform:         "Typeform",
  youtube_iframe:   "YouTube iFrame API",
  stripe_elements:  "Stripe Elements",
};

export const COOKIE_KATEGORIE_LABELS: Record<CookieKategorie, { name: string; consent: boolean }> = {
  essential:  { name: "Technisch notwendig",     consent: false },
  funktional: { name: "Funktional (Komfort)",    consent: true  },
  statistik:  { name: "Statistik / Analytics",   consent: true  },
  marketing:  { name: "Marketing / Werbung",     consent: true  },
  social:     { name: "Social Media Plugins",    consent: true  },
};
