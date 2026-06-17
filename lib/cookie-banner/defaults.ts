/**
 * Cookie-Banner-Defaults
 * Quellen: § 25 TDDDG + DSK 2024 (12 Monate Re-Consent) + BGH 2025 (Reject-All-Prominenz)
 */

import type { CookieBannerData, KategorieConfig, Texte } from "./types";

const todayIso = () => new Date().toISOString().split("T")[0];

// ─────────────────────────────────────────────────────────────────────────────
// Standard-Kategorien
// ─────────────────────────────────────────────────────────────────────────────

export const STANDARD_KATEGORIEN: KategorieConfig[] = [
  {
    id: "essential",
    aktiv: true,
    pflicht: true,
    name: "Technisch notwendig",
    beschreibung: "Diese Cookies sind für den Betrieb der Webseite erforderlich (Login, Session, Spracheinstellung, Cookie-Einwilligung selbst). Sie können nicht abgelehnt werden (§ 25 Abs. 2 TDDDG).",
  },
  {
    id: "funktional",
    aktiv: false,
    pflicht: false,
    name: "Funktional / Komfort",
    beschreibung: "Diese Cookies verbessern den Komfort, z.B. eingebundene Videos, Karten, Schriftarten von externen Anbietern.",
  },
  {
    id: "statistik",
    aktiv: true,
    pflicht: false,
    name: "Statistik / Analytics",
    beschreibung: "Diese Cookies helfen uns zu verstehen, wie Besucher unsere Webseite nutzen, indem Informationen anonym gesammelt werden.",
  },
  {
    id: "marketing",
    aktiv: false,
    pflicht: false,
    name: "Marketing / Werbung",
    beschreibung: "Diese Cookies werden verwendet, um Werbung relevanter und ansprechender für Sie zu gestalten.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Texte je Sprache
// ─────────────────────────────────────────────────────────────────────────────

export const TEXTE_DE: Texte = {
  headline: "Wir verwenden Cookies",
  beschreibung: "Wir setzen technisch notwendige Cookies ein und möchten mit Ihrer Einwilligung weitere Cookies zur Analyse und Optimierung nutzen. Sie können Ihre Auswahl jederzeit ändern.",
  acceptAll: "Alle akzeptieren",
  rejectAll: "Alle ablehnen",
  settingsOeffnen: "Einstellungen",
  einstellungenSpeichern: "Auswahl speichern",
  settingsHeadline: "Cookie-Einstellungen",
  datenschutzLink: "Datenschutzerklärung",
  impressumLink: "Impressum",
  notwendigPflicht: "(immer aktiv)",
};

export const TEXTE_EN: Texte = {
  headline: "We use cookies",
  beschreibung: "We use technically necessary cookies and would like to use further cookies for analysis and optimization with your consent. You can change your selection at any time.",
  acceptAll: "Accept all",
  rejectAll: "Reject all",
  settingsOeffnen: "Settings",
  einstellungenSpeichern: "Save selection",
  settingsHeadline: "Cookie settings",
  datenschutzLink: "Privacy policy",
  impressumLink: "Imprint",
  notwendigPflicht: "(always active)",
};

// ─────────────────────────────────────────────────────────────────────────────
// Initial-State
// ─────────────────────────────────────────────────────────────────────────────

export const INITIAL_COOKIE_BANNER: CookieBannerData = {
  schemaVersion: 1,

  anbieter: {
    name: "",
    datenschutzUrl: "/datenschutz",
    impressumUrl: "/impressum",
  },

  sprache: "de",
  texte: TEXTE_DE,

  stil: "bottom_bar",
  farben: {
    primaer: "#FF4D00",
    primaerText: "#FFFFFF",
    sekundaer: "#0A0906",
    sekundaerText: "#FFFFFF",
    hintergrund: "#FFFFFF",
    text: "#0A0906",
    link: "#FF4D00",
    rand: "#E5E7EB",
  },
  schriftgroesseRem: 0.875,
  abgerundetPx: 8,
  schatten: true,

  kategorien: STANDARD_KATEGORIEN,
  trackingTools: [],

  verhalten: {
    rejectAllProminent: true,
    settingsButton: true,
    consentLaufzeitMonate: 12,
    autoOeffnen: true,
    weiterOhneTracking: false,
    blockiertHintergrund: false,
  },

  storageKey: "compliflow-consent",

  letztAktualisiert: todayIso(),
  erstelltAm: todayIso(),
};
