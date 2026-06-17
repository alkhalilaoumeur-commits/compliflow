/**
 * Datenschutz-Defaults — Initialwerte + Modul-Klauseln
 * Quellen: Art. 13/14 DSGVO + § 25 TDDDG + GDD-Mustertexte 2026 + Bitkom-Vorlagen + DSK-Orientierungshilfen
 * Letzte juristische Review: 2026-06-13
 *
 * WICHTIG: Diese Klauseln sind Mustertexte, keine Rechtsberatung.
 * Bei wesentlichen DSGVO-Änderungen müssen die Texte aktualisiert werden.
 */

import type {
  DatenschutzData,
  HostingProvider,
  AnalyticsTool,
  NewsletterProvider,
  PaymentProvider,
  SocialEmbed,
  EmbeddedService,
  Branche,
  MarketingTool,
  Versanddienstleister,
  Bewertungssystem,
  Auskunftei,
  ChatProvider,
  KiChatbotProvider,
  VideoCallProvider,
  BewerberMgmtSystem,
} from "./types";

const todayIso = () => new Date().toISOString().split("T")[0];

// ─────────────────────────────────────────────────────────────────────────────
// Initial-State
// ─────────────────────────────────────────────────────────────────────────────

export const INITIAL_DATENSCHUTZ: DatenschutzData = {
  schemaVersion: 2,

  verantwortlicher: {
    name: "",
    strasse: "",
    plz: "",
    ort: "",
    land: "DE",
    email: "",
  },

  dsb: {
    aktiv: false,
  },

  branche: "allgemein",
  zielgruppe: "b2c",
  mitarbeiterzahl: "solo",

  hosting: {
    provider: "hetzner",
    istEU: true,
  },

  embedOptionen: {
    googleFontsLokal: true,
    youtubeNoCookieMode: true,
    serverSideTracking: false,
  },

  analytics: [],

  marketing: [],

  newsletter: {
    aktiv: false,
    doubleOptIn: true,
    trackingAktiv: false,
  },

  payment: [],

  ecommerce: {
    bestellungen: false,
    versand: [],
    bonitaetspruefung: false,
    bewertungssystem: "keiner",
    treueprogramm: false,
    bnpl_aktiv: false,
  },

  social: [],
  embedded: [],

  cookies: {
    kategorien: ["essential"],
    hatConsentBanner: false,
    bannerTool: "keiner",
  },

  kommunikation: {
    kontaktformular: false,
    liveChat: false,
    kiChatbot: false,
    kiTrainingAusgeschlossen: true,
    webinare: false,
    pushNotifications: false,
  },

  hr: {
    bewerbungsformular: false,
    mitarbeiterfotos: false,
    backgroundCheck: false,
    hinschgMeldekanal: false,
  },

  funktionen: {
    kontaktformular: false,
    bewerbungsformular: false,
    kundenkonto: false,
    shop: false,
    blog: false,
    forum: false,
    liveChat: false,
    buchungssystem: false,
  },

  spezial: {
    profiling: false,
    automatisierte_entscheidung: false,
    jointController: false,
    videoueberwachung_live: false,
    besondere_kategorien_art9: false,
  },

  drittland: {
    aktiv: false,
    laender: [],
    sccsVorhanden: true,
    tiaDurchgefuehrt: false,
  },

  letztAktualisiert: todayIso(),
  erstelltAm: todayIso(),
};

// ─────────────────────────────────────────────────────────────────────────────
// Hosting-Klauseln
// ─────────────────────────────────────────────────────────────────────────────

export const HOSTING_KLAUSELN: Record<HostingProvider, { text: string; rechtsgrundlage: string }> = {
  hetzner: {
    text: `Wir hosten unsere Webseite bei der Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Deutschland. Beim Aufruf unserer Webseite werden auf den Servern unseres Hosters Daten in sogenannten Server-Log-Dateien gespeichert (IP-Adresse, Datum/Uhrzeit, abgerufene Seite, Browser-Typ, übertragene Datenmenge). Diese Daten werden nach 14 Tagen automatisch gelöscht. Hetzner ist DSGVO-zertifiziert und verarbeitet Daten ausschließlich innerhalb der EU. Ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO liegt vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer technisch fehlerfreien Darstellung und Sicherheit unserer Webseite).",
  },
  ionos: {
    text: `Wir hosten unsere Webseite bei der IONOS SE, Elgendorfer Straße 57, 56410 Montabaur, Deutschland. Beim Aufruf unserer Webseite werden auf den Servern unseres Hosters Daten in sogenannten Server-Log-Dateien gespeichert (IP-Adresse, Datum/Uhrzeit, abgerufene Seite, Browser-Typ). Diese Daten werden nach kurzer Zeit automatisch gelöscht. IONOS verarbeitet Daten ausschließlich innerhalb der EU. Ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO liegt vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).",
  },
  strato: {
    text: `Wir hosten unsere Webseite bei der STRATO AG, Otto-Ostrowski-Straße 7, 10249 Berlin, Deutschland. Server-Log-Dateien (IP, Datum/Uhrzeit, Seite, Browser) werden nach kurzer Zeit automatisch gelöscht. STRATO verarbeitet Daten ausschließlich innerhalb der EU. Ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO liegt vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. f DSGVO.",
  },
  all_inkl: {
    text: `Wir hosten unsere Webseite bei der ALL-INKL.COM – Neue Medien Münnich, Hauptstraße 68, 02742 Friedersdorf, Deutschland. Server-Log-Dateien werden nach kurzer Zeit automatisch gelöscht. Datenverarbeitung erfolgt ausschließlich innerhalb der EU. Ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO liegt vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. f DSGVO.",
  },
  netcup: {
    text: `Wir hosten unsere Webseite bei der netcup GmbH, Daimlerstraße 25, 76185 Karlsruhe, Deutschland. Server-Log-Dateien werden nach kurzer Zeit automatisch gelöscht. Datenverarbeitung erfolgt ausschließlich innerhalb der EU. Ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO liegt vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. f DSGVO.",
  },
  vercel: {
    text: `Wir hosten unsere Webseite bei der Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Vercel betreibt ein globales CDN-Netzwerk; Anfragen werden vom nächstgelegenen Edge-Server beantwortet. Server-Log-Dateien (IP, Datum/Uhrzeit, Seite, Browser) werden zur Sicherheit und Performance temporär gespeichert. Es handelt sich um einen Drittlandtransfer in die USA. Vercel ist nach dem EU-U.S. Data Privacy Framework zertifiziert. Zusätzlich liegen Standardvertragsklauseln (SCCs) nach Art. 46 DSGVO vor. Ein Auftragsverarbeitungsvertrag (Data Processing Addendum) ist abgeschlossen.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. f DSGVO + Art. 45/46 DSGVO (Angemessenheitsbeschluss + SCCs).",
  },
  cloudflare_pages: {
    text: `Wir hosten unsere Webseite bei der Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA. Cloudflare betreibt ein globales Netzwerk; Anfragen werden vom nächstgelegenen Edge-Server beantwortet. Es handelt sich um einen Drittlandtransfer in die USA. Cloudflare ist nach dem EU-U.S. Data Privacy Framework zertifiziert. Standardvertragsklauseln (SCCs) nach Art. 46 DSGVO sind abgeschlossen. Ein Data Processing Addendum (DPA) liegt vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. f DSGVO + Art. 45/46 DSGVO.",
  },
  aws: {
    text: `Wir hosten unsere Webseite bei Amazon Web Services (AWS). Anbieter ist die Amazon Web Services EMEA SARL, 38 Avenue John F. Kennedy, L-1855 Luxemburg, mit Servern in der EU-Region. Bei US-amerikanischen Sub-Anbietern liegen Standardvertragsklauseln (SCCs) nach Art. 46 DSGVO vor. AWS ist nach dem EU-U.S. Data Privacy Framework zertifiziert. Ein Auftragsverarbeitungsvertrag (Data Processing Addendum) ist abgeschlossen.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. f DSGVO + ggf. Art. 45/46 DSGVO.",
  },
  azure: {
    text: `Wir hosten unsere Webseite bei Microsoft Azure. Anbieter ist die Microsoft Ireland Operations Ltd., One Microsoft Place, Dublin 18, Irland, mit Servern in der EU-Region. Bei US-amerikanischen Sub-Anbietern liegen Standardvertragsklauseln (SCCs) nach Art. 46 DSGVO vor. Microsoft ist nach dem EU-U.S. Data Privacy Framework zertifiziert. Ein Auftragsverarbeitungsvertrag liegt vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. f DSGVO + ggf. Art. 45/46 DSGVO.",
  },
  gcp: {
    text: `Wir hosten unsere Webseite bei der Google Cloud Platform. Anbieter ist die Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland, mit Servern in der EU-Region. Bei US-amerikanischen Sub-Anbietern liegen Standardvertragsklauseln (SCCs) nach Art. 46 DSGVO vor. Google ist nach dem EU-U.S. Data Privacy Framework zertifiziert. Ein Auftragsverarbeitungsvertrag liegt vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. f DSGVO + ggf. Art. 45/46 DSGVO.",
  },
  andere: {
    text: `Wir hosten unsere Webseite bei einem externen Hosting-Anbieter. Beim Aufruf unserer Webseite werden auf den Servern unseres Hosters Daten in Server-Log-Dateien gespeichert (IP-Adresse, Datum/Uhrzeit, abgerufene Seite, Browser-Typ). Mit dem Hosting-Anbieter haben wir einen Auftragsverarbeitungsvertrag nach Art. 28 DSGVO abgeschlossen.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. f DSGVO.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Analytics-Klauseln
// ─────────────────────────────────────────────────────────────────────────────

export const ANALYTICS_KLAUSELN: Record<AnalyticsTool, { text: string; rechtsgrundlage: string; consent: boolean }> = {
  plausible: {
    text: `Wir nutzen Plausible Analytics, ein DSGVO-konformes Analyse-Tool ohne Cookies. Anbieter ist Plausible Insights OÜ, Västriku tn 2, 50403 Tartu, Estland. Plausible verarbeitet keine personenbezogenen Daten und setzt keine Cookies. IP-Adressen werden anonymisiert und nicht gespeichert. Die Verarbeitung erfolgt vollständig innerhalb der EU.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer statistischen Auswertung der Webseitennutzung).",
    consent: false, // Plausible braucht laut Anbieter keinen Consent
  },
  matomo: {
    text: `Wir nutzen Matomo Analytics zur Analyse der Webseitennutzung. Matomo wird auf unseren eigenen Servern in der EU betrieben. IP-Adressen werden vor der Auswertung anonymisiert. Es werden Cookies eingesetzt, deren Nutzung Sie über unser Cookie-Banner steuern können.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
    consent: true,
  },
  ga4: {
    text: `Wir nutzen Google Analytics 4 zur Webseitenanalyse. Anbieter ist die Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland. Google Analytics setzt Cookies und überträgt Nutzungsdaten an Server von Google. IP-Adressen werden vor der Speicherung anonymisiert (IP-Anonymisierung aktiv). Eine Übertragung in die USA ist möglich; Google ist nach dem EU-U.S. Data Privacy Framework zertifiziert. Standardvertragsklauseln (SCCs) nach Art. 46 DSGVO liegen vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
    consent: true,
  },
  hotjar: {
    text: `Wir nutzen Hotjar zur Analyse des Nutzerverhaltens (Heatmaps, Session-Recordings). Anbieter ist Hotjar Ltd., Dragonara Business Centre, 5th Floor, Dragonara Road, Paceville St. Julian's, STJ 3141, Malta. Hotjar setzt Cookies und überträgt Nutzungsdaten an seine Server. Bei US-Servern liegen Standardvertragsklauseln (SCCs) vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
    consent: true,
  },
  microsoft_clarity: {
    text: `Wir nutzen Microsoft Clarity zur Analyse des Nutzerverhaltens (Heatmaps, Session-Recordings). Anbieter ist die Microsoft Corporation. Clarity setzt Cookies und überträgt Nutzungsdaten an Microsoft-Server in den USA. Microsoft ist nach dem EU-U.S. Data Privacy Framework zertifiziert; Standardvertragsklauseln liegen vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
    consent: true,
  },
  umami: {
    text: `Wir nutzen Umami Analytics, ein cookieloses, DSGVO-konformes Analyse-Tool. Umami wird auf unseren eigenen Servern innerhalb der EU betrieben. Es werden keine personenbezogenen Daten verarbeitet und keine Cookies gesetzt.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).",
    consent: false,
  },
  fathom: {
    text: `Wir nutzen Fathom Analytics, ein cookieloses Analyse-Tool. Anbieter ist Conva Ventures Inc., Kanada. Fathom verarbeitet keine personenbezogenen Daten und setzt keine Cookies. Bei der Datenübertragung nach Kanada gilt der Angemessenheitsbeschluss der EU-Kommission.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. f DSGVO + Art. 45 DSGVO (Angemessenheitsbeschluss Kanada).",
    consent: false,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Newsletter-Klauseln
// ─────────────────────────────────────────────────────────────────────────────

export const NEWSLETTER_KLAUSELN: Record<NewsletterProvider, { text: string; rechtsgrundlage: string }> = {
  brevo: {
    text: `Für den Versand unseres Newsletters nutzen wir Brevo (ehemals Sendinblue). Anbieter ist Sendinblue GmbH, Köpenicker Straße 126, 10179 Berlin, Deutschland (mit Servern in der EU). Wir verwenden ein Double-Opt-In-Verfahren: Nach der Anmeldung erhalten Sie eine Bestätigungs-E-Mail. Erst nach Klick auf den Bestätigungslink werden Sie in unsere Verteilerliste aufgenommen. Brevo wertet das Öffnen und Klicken in unseren Newslettern aus, sofern Sie zugestimmt haben. Sie können sich jederzeit über den Abmelde-Link am Ende jedes Newsletters abmelden. Ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO liegt vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).",
  },
  mailerlite: {
    text: `Für den Versand unseres Newsletters nutzen wir MailerLite. Anbieter ist UAB "MailerLite", Paupio g. 28, LT-11341 Vilnius, Litauen (EU). Wir verwenden ein Double-Opt-In-Verfahren. Ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO liegt vor. Bei US-Sub-Anbietern liegen Standardvertragsklauseln (SCCs) vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).",
  },
  rapidmail: {
    text: `Für den Versand unseres Newsletters nutzen wir rapidmail. Anbieter ist die rapidmail GmbH, Augustinerplatz 2, 79098 Freiburg im Breisgau, Deutschland. Die Datenverarbeitung erfolgt ausschließlich innerhalb der EU. Wir verwenden ein Double-Opt-In-Verfahren. Ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO liegt vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).",
  },
  cleverreach: {
    text: `Für den Versand unseres Newsletters nutzen wir CleverReach. Anbieter ist die CleverReach GmbH & Co. KG, Schafjückenweg 2, 26180 Rastede, Deutschland. Datenverarbeitung in der EU. Wir verwenden ein Double-Opt-In-Verfahren. Ein Auftragsverarbeitungsvertrag liegt vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).",
  },
  mailchimp: {
    text: `Für den Versand unseres Newsletters nutzen wir Mailchimp. Anbieter ist die Intuit Inc., 2700 Coast Avenue, Mountain View, CA 94043, USA. Mailchimp überträgt Daten in die USA. Es liegen Standardvertragsklauseln (SCCs) nach Art. 46 DSGVO vor; Intuit ist nach dem EU-U.S. Data Privacy Framework zertifiziert. Wir verwenden ein Double-Opt-In-Verfahren.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) + Art. 45/46 DSGVO.",
  },
  convertkit: {
    text: `Für den Versand unseres Newsletters nutzen wir ConvertKit (Kit). Anbieter ist die SeedProd LLC, USA. ConvertKit überträgt Daten in die USA. Es liegen Standardvertragsklauseln (SCCs) nach Art. 46 DSGVO vor. Wir verwenden ein Double-Opt-In-Verfahren.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) + Art. 46 DSGVO.",
  },
  selbst_gehostet: {
    text: `Für den Versand unseres Newsletters nutzen wir eine selbst gehostete Lösung auf unseren eigenen Servern innerhalb der EU. Wir verwenden ein Double-Opt-In-Verfahren: Nach der Anmeldung erhalten Sie eine Bestätigungs-E-Mail. Erst nach Klick auf den Bestätigungslink werden Sie in unsere Verteilerliste aufgenommen.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Payment-Klauseln (kompakter, weil rechtlich ähnlich)
// ─────────────────────────────────────────────────────────────────────────────

export const PAYMENT_KLAUSELN: Record<PaymentProvider, string> = {
  stripe: `Stripe — Anbieter: Stripe Payments Europe Limited, 1 Grand Canal Street Lower, Dublin 2, Irland (mit Servern in der EU). Bei Zahlung über Stripe werden Ihre Zahlungsdaten direkt an Stripe übermittelt. Ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO liegt vor. Bei US-Sub-Anbietern liegen Standardvertragsklauseln vor.`,
  paypal: `PayPal — Anbieter: PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxemburg. Bei Zahlung über PayPal werden Ihre Zahlungsdaten direkt an PayPal übermittelt.`,
  klarna: `Klarna — Anbieter: Klarna Bank AB (publ), Sveavägen 46, 111 34 Stockholm, Schweden (EU). Bei Zahlung über Klarna werden Ihre Zahlungsdaten direkt an Klarna übermittelt.`,
  sofort: `Sofortüberweisung (Klarna) — Anbieter: Klarna Bank AB (publ), Sveavägen 46, 111 34 Stockholm, Schweden. Bei Zahlung per Sofortüberweisung werden Ihre Bankdaten direkt an Klarna übermittelt.`,
  amazon_pay: `Amazon Pay — Anbieter: Amazon Payments Europe s.c.a., 38 avenue John F. Kennedy, L-1855 Luxemburg. Bei Zahlung über Amazon Pay werden Ihre Daten direkt an Amazon übermittelt.`,
  apple_pay: `Apple Pay — Anbieter: Apple Inc., One Apple Park Way, Cupertino, CA 95014, USA. Bei Apple Pay erfolgt die Zahlungsabwicklung über die Apple-Pay-Infrastruktur; Karten-Token werden gerätegebunden verarbeitet. Datentransfer in die USA möglich; Apple ist nach dem EU-U.S. Data Privacy Framework zertifiziert.`,
  google_pay: `Google Pay — Anbieter: Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland. Datentransfer in die USA möglich; Google ist nach dem EU-U.S. Data Privacy Framework zertifiziert.`,
  rechnung: `Kauf auf Rechnung — Bei Zahlung per Rechnung verarbeiten wir Ihre Adress- und Kontaktdaten zur Rechnungsstellung. Eine Bonitätsprüfung kann durch unseren Dienstleister erfolgen.`,
  ueberweisung: `Vorkasse / Banküberweisung — Bei Zahlung per Banküberweisung verarbeiten wir Ihre Bankdaten ausschließlich zum Zweck der Zahlungsabwicklung. Die Verarbeitung erfolgt über unsere Hausbank.`,
  lastschrift: `SEPA-Lastschrift — Bei Zahlung per Lastschrift verarbeiten wir Ihre Bankdaten zur Einziehung des fälligen Betrags. Die Daten werden an unsere Bank weitergegeben.`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Social Media Embeds
// ─────────────────────────────────────────────────────────────────────────────

export const SOCIAL_KLAUSELN: Record<SocialEmbed, { text: string; rechtsgrundlage: string }> = {
  facebook_plugin: {
    text: `Facebook Plugin — Anbieter: Meta Platforms Ireland Ltd., Merrion Road, Dublin 4, D04 X2K5, Irland. Beim Aufruf einer Seite mit Facebook-Plugin wird eine Verbindung zu Facebook-Servern hergestellt. Datentransfer in die USA möglich; Meta ist nach dem EU-U.S. Data Privacy Framework zertifiziert.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  instagram_plugin: {
    text: `Instagram Embed — Anbieter: Meta Platforms Ireland Ltd., Merrion Road, Dublin 4, D04 X2K5, Irland. Beim Aufruf einer Seite mit Instagram-Embed wird eine Verbindung zu Instagram-Servern hergestellt. Datentransfer in die USA möglich; Meta ist nach dem EU-U.S. Data Privacy Framework zertifiziert.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  twitter_x_widget: {
    text: `X (Twitter) Widget — Anbieter: X Corp., 1355 Market Street, Suite 900, San Francisco, CA 94103, USA. Datentransfer in die USA möglich; Standardvertragsklauseln liegen vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  linkedin_insight: {
    text: `LinkedIn Insight Tag — Anbieter: LinkedIn Ireland Unlimited Company, Wilton Plaza, Wilton Place, Dublin 2, Irland. Der Insight Tag dient zur Analyse und Conversion-Tracking. Datentransfer in die USA möglich; LinkedIn ist nach dem EU-U.S. Data Privacy Framework zertifiziert.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  linkedin_share: {
    text: `LinkedIn Share-Button — Anbieter: LinkedIn Ireland Unlimited Company, Wilton Plaza, Wilton Place, Dublin 2, Irland. Beim Klick auf den Share-Button wird eine Verbindung zu LinkedIn hergestellt.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  youtube_embed: {
    text: `YouTube Video Embed — Anbieter: Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland. Wir verwenden den erweiterten Datenschutzmodus (youtube-nocookie.com). Beim Abspielen eines Videos wird trotzdem eine Verbindung zu Google-Servern hergestellt. Datentransfer in die USA möglich; Google ist nach dem EU-U.S. Data Privacy Framework zertifiziert.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  vimeo_embed: {
    text: `Vimeo Video Embed — Anbieter: Vimeo Inc., 555 West 18th Street, New York, New York 10011, USA. Beim Abspielen eines Videos wird eine Verbindung zu Vimeo-Servern hergestellt. Datentransfer in die USA möglich; Standardvertragsklauseln liegen vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  tiktok_embed: {
    text: `TikTok Embed — Anbieter: TikTok Technology Limited, 10 Earlsfort Terrace, Dublin, D02 T380, Irland. Beim Aufruf einer Seite mit TikTok-Embed wird eine Verbindung zu TikTok-Servern hergestellt. Datentransfer in Drittländer (USA, China) möglich; Standardvertragsklauseln liegen vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Embedded Services (Maps, Fonts, Chat etc.)
// ─────────────────────────────────────────────────────────────────────────────

export const EMBEDDED_KLAUSELN: Record<EmbeddedService, { text: string; rechtsgrundlage: string; consent: boolean }> = {
  google_fonts: {
    text: `Google Fonts — Anbieter: Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland. Wir laden Schriftarten lokal vom eigenen Server (kein externer Aufruf) oder mit Einwilligung von Google-Servern. Bei externem Laden wird die IP-Adresse an Google übertragen.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) bei externem Laden / Art. 6 Abs. 1 lit. f DSGVO bei lokalem Hosting.",
    consent: true,
  },
  google_maps: {
    text: `Google Maps — Anbieter: Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland. Beim Aufruf einer Seite mit Google Maps wird eine Verbindung zu Google-Servern hergestellt. Datentransfer in die USA möglich; Google ist nach dem EU-U.S. Data Privacy Framework zertifiziert.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
    consent: true,
  },
  google_recaptcha: {
    text: `Google reCAPTCHA — Anbieter: Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland. reCAPTCHA dient zum Schutz vor automatisierten Anfragen (Bot-Schutz). Datentransfer in die USA möglich; Google ist nach dem EU-U.S. Data Privacy Framework zertifiziert.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am Schutz vor Spam und Missbrauch).",
    consent: false,
  },
  calendly: {
    text: `Calendly — Anbieter: Calendly LLC, 271 17th Street NW, Atlanta, GA 30363, USA. Wenn Sie über unsere Webseite einen Termin buchen, werden Ihre Eingaben an Calendly übertragen. Datentransfer in die USA möglich; Calendly ist nach dem EU-U.S. Data Privacy Framework zertifiziert.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. b DSGVO (Vertragsdurchführung) i.V.m. § 25 Abs. 1 TDDDG.",
    consent: true,
  },
  cal_com: {
    text: `Cal.com — Anbieter: Cal.com, Inc., USA. Wenn Sie einen Termin über Cal.com buchen, werden Ihre Eingaben an Cal.com übertragen. Bei US-Hosting liegen Standardvertragsklauseln (SCCs) vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. b DSGVO i.V.m. § 25 Abs. 1 TDDDG.",
    consent: true,
  },
  intercom: {
    text: `Intercom Chat — Anbieter: Intercom Inc., 55 2nd Street, 4th Floor, San Francisco, CA 94105, USA. Beim Öffnen des Chats wird eine Verbindung zu Intercom-Servern hergestellt. Datentransfer in die USA möglich; Standardvertragsklauseln liegen vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
    consent: true,
  },
  crisp_chat: {
    text: `Crisp Chat — Anbieter: Crisp IM SAS, 2 boulevard de Launay, 44100 Nantes, Frankreich (EU). Beim Öffnen des Chats wird eine Verbindung zu Crisp-Servern in der EU hergestellt.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
    consent: true,
  },
  tawk_to: {
    text: `Tawk.to Chat — Anbieter: tawk.to inc., 187 East Warm Springs Rd, SB298, Las Vegas, NV 89119, USA. Beim Öffnen des Chats wird eine Verbindung zu tawk.to-Servern hergestellt. Datentransfer in die USA möglich; Standardvertragsklauseln liegen vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
    consent: true,
  },
  typeform: {
    text: `Typeform — Anbieter: TYPEFORM S.L., Carrer Bac de Roda 163 Bajos, 08018 Barcelona, Spanien (EU). Wenn Sie ein Typeform-Formular ausfüllen, werden Ihre Eingaben an Typeform übertragen.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) bzw. lit. b DSGVO (Vertragsanbahnung).",
    consent: true,
  },
  youtube_iframe: {
    text: `YouTube iFrame — Anbieter: Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland. Wir verwenden den erweiterten Datenschutzmodus (youtube-nocookie.com). Beim Abspielen wird eine Verbindung zu YouTube-Servern hergestellt.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
    consent: true,
  },
  stripe_elements: {
    text: `Stripe Elements — Anbieter: Stripe Payments Europe Limited, 1 Grand Canal Street Lower, Dublin 2, Irland. Stripe Elements werden zur sicheren Eingabe von Zahlungsdaten genutzt. Bei der Zahlungsabwicklung erfolgt ein Datentransfer an Stripe.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. b DSGVO (Vertragsdurchführung) i.V.m. § 25 Abs. 2 Nr. 2 TDDDG.",
    consent: false, // technisch erforderlich für Bezahlung
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Standard-Texte (Header, Betroffenenrechte, etc.)
// ─────────────────────────────────────────────────────────────────────────────

export const STANDARD_TEXTE = {
  header: `# Datenschutzerklärung

Der Schutz Ihrer personenbezogenen Daten ist uns ein wichtiges Anliegen. Wir verarbeiten Ihre Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TDDDG). In dieser Datenschutzerklärung informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Webseite.`,

  verantwortlicher_intro: `## 1. Verantwortlicher

Verantwortlich für die Datenverarbeitung auf dieser Webseite ist:`,

  dsb_section: `## Datenschutzbeauftragter

Unseren Datenschutzbeauftragten erreichen Sie unter:`,

  betroffenenrechte: `## Ihre Rechte als Betroffener

Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:

- **Recht auf Auskunft** (Art. 15 DSGVO): Sie können Auskunft darüber verlangen, ob und welche Daten wir von Ihnen verarbeiten.
- **Recht auf Berichtigung** (Art. 16 DSGVO): Sie können die Berichtigung unrichtiger Daten verlangen.
- **Recht auf Löschung** (Art. 17 DSGVO): Sie können die Löschung Ihrer Daten verlangen, sofern keine Aufbewahrungspflichten entgegenstehen.
- **Recht auf Einschränkung der Verarbeitung** (Art. 18 DSGVO).
- **Recht auf Datenübertragbarkeit** (Art. 20 DSGVO).
- **Widerspruchsrecht** (Art. 21 DSGVO): Sie können der Verarbeitung jederzeit widersprechen.
- **Recht auf Widerruf erteilter Einwilligungen** (Art. 7 Abs. 3 DSGVO) — mit Wirkung für die Zukunft.

## Beschwerderecht bei der Aufsichtsbehörde

Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren. Zuständig ist die Aufsichtsbehörde des Bundeslandes Ihres Wohnsitzes oder unseres Sitzes. Eine Liste der Aufsichtsbehörden finden Sie unter: https://www.bfdi.bund.de/DE/Service/Anschriften/anschriften_table.html`,

  cookies_basis: `## Cookies und ähnliche Technologien

Unsere Webseite verwendet Cookies und ähnliche Technologien. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden. Wir unterscheiden zwischen technisch notwendigen Cookies (kein Consent erforderlich, § 25 Abs. 2 TDDDG) und Cookies, die Ihre Einwilligung benötigen (§ 25 Abs. 1 TDDDG).`,

  kontaktformular: `## Kontaktformular

Wenn Sie uns über das Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Formular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) bzw. Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
Speicherdauer: Die Daten werden gelöscht, sobald sie für die Erreichung des Zwecks nicht mehr erforderlich sind; spätestens nach Ablauf gesetzlicher Aufbewahrungsfristen.`,

  bewerbungsformular: `## Bewerbungsformular

Wenn Sie sich über unser Bewerbungsformular bei uns bewerben, verarbeiten wir Ihre Bewerbungsunterlagen (Lebenslauf, Anschreiben, Zeugnisse) ausschließlich zur Bewerberauswahl. Bei Nicht-Einstellung werden die Daten spätestens 6 Monate nach Abschluss des Bewerbungsverfahrens gelöscht.
Rechtsgrundlage: § 26 BDSG (Beschäftigungsverhältnis-Anbahnung) i.V.m. Art. 88 DSGVO.`,

  kundenkonto: `## Kundenkonto

Bei der Anlage eines Kundenkontos verarbeiten wir Ihre Stammdaten (Name, Adresse, E-Mail) sowie ggf. weitere Angaben. Ihr Kundenkonto bleibt bestehen, bis Sie es löschen oder wir es nach längerer Inaktivität löschen.
Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragsdurchführung).`,

  schluss: `## Aktualität und Änderung dieser Datenschutzerklärung

Diese Datenschutzerklärung ist aktuell gültig und hat den Stand vom oben angegebenen Datum. Durch die Weiterentwicklung unserer Webseite und Angebote oder aufgrund geänderter gesetzlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern. Die jeweils aktuelle Datenschutzerklärung können Sie jederzeit auf dieser Webseite abrufen.`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Marketing-Klauseln (Pixel, Ads, Retargeting)
// ─────────────────────────────────────────────────────────────────────────────

export const MARKETING_KLAUSELN: Record<MarketingTool, { text: string; rechtsgrundlage: string; jointControllerHinweis?: string }> = {
  meta_pixel: {
    text: `Wir verwenden den Meta Pixel der Meta Platforms Ireland Ltd., Merrion Road, Dublin 4, D04 X2K5, Irland. Der Meta Pixel erfasst Besucheraktionen auf unserer Webseite (Pageviews, Conversions) und übermittelt diese Daten an Meta. Dies ermöglicht uns die Auswertung der Effektivität unserer Anzeigen sowie das Targeting (Custom Audiences und Lookalike Audiences). Datenübertragung in die USA möglich; Meta ist nach dem EU-U.S. Data Privacy Framework zertifiziert. Standardvertragsklauseln nach Art. 46 DSGVO liegen vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
    jointControllerHinweis: "Wir und Meta sind für die Datenerhebung über den Pixel gemeinsam verantwortlich (Joint Controller nach Art. 26 DSGVO). Die wesentlichen Inhalte der Vereinbarung sind unter https://www.facebook.com/legal/controller_addendum einsehbar.",
  },
  meta_conversion_api: {
    text: `Zusätzlich zum Meta Pixel nutzen wir die Conversion API von Meta, um Conversion-Daten serverseitig an Meta zu übertragen. Auch bei serverseitiger Übertragung gilt: Die Einwilligungspflicht bleibt bestehen (DSK-Beschluss 2024). Anbieter wie beim Meta Pixel.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
    jointControllerHinweis: "Joint Controller wie beim Meta Pixel (siehe oben).",
  },
  google_ads: {
    text: `Wir nutzen Google Ads zur Schaltung von Werbeanzeigen. Anbieter ist die Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland. Datenübertragung in die USA möglich; Google ist nach dem EU-U.S. Data Privacy Framework zertifiziert.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  google_ads_remarketing: {
    text: `Wir nutzen Google Ads Remarketing/Retargeting. Damit werden Besucher unserer Webseite wiedererkannt und ihnen auf anderen Webseiten/Plattformen zielgerichtete Werbung angezeigt. Anbieter: Google Ireland Ltd. (siehe oben).`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  tiktok_pixel: {
    text: `Wir nutzen den TikTok Pixel der TikTok Technology Limited, 10 Earlsfort Terrace, Dublin, D02 T380, Irland. TikTok ist eine Tochtergesellschaft der ByteDance Ltd. mit Sitz in China. Es kann zu Datenübermittlungen in Drittländer (u.a. USA, China) kommen. China verfügt nicht über einen Angemessenheitsbeschluss der EU-Kommission. Es liegen Standardvertragsklauseln (SCCs) nach Art. 46 DSGVO vor. Ein Transfer Impact Assessment (TIA) wurde durchgeführt.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  linkedin_insight: {
    text: `Wir verwenden den LinkedIn Insight Tag. Anbieter ist die LinkedIn Ireland Unlimited Company, Wilton Plaza, Wilton Place, Dublin 2, Irland. Der Insight Tag dient zur Conversion-Messung und zum Aufbau zielgerichteter B2B-Werbekampagnen. Datentransfer in die USA möglich; LinkedIn ist nach dem EU-U.S. Data Privacy Framework zertifiziert.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  pinterest_tag: {
    text: `Wir nutzen das Pinterest Tag der Pinterest Europe Ltd., Palmerston House, 2nd Floor, Fenian Street, Dublin 2, Irland. Datentransfer in die USA möglich; Pinterest ist nach dem EU-U.S. Data Privacy Framework zertifiziert.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  twitter_pixel: {
    text: `Wir nutzen das Twitter/X Pixel. Anbieter ist die X Corp., 1355 Market Street, Suite 900, San Francisco, CA 94103, USA. Standardvertragsklauseln nach Art. 46 DSGVO liegen vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  outbrain: {
    text: `Wir nutzen Outbrain Native-Advertising. Anbieter ist die Outbrain UK Ltd., 5 New Bridge Street, EC4V 6JJ London, Vereinigtes Königreich. Es liegen Standardvertragsklauseln nach Art. 46 DSGVO vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  taboola: {
    text: `Wir nutzen Taboola Native-Advertising. Anbieter ist die Taboola Europe Ltd., 81-87 High Holborn, London WC1V 6DF, Vereinigtes Königreich. Es liegen Standardvertragsklauseln nach Art. 46 DSGVO vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  criteo: {
    text: `Wir nutzen Criteo zur personalisierten Werbe-Ausspielung. Anbieter ist die Criteo SA, 32 Rue Blanche, 75009 Paris, Frankreich (EU). Eine Datenverarbeitung erfolgt vorwiegend innerhalb der EU.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  rtb_house: {
    text: `Wir nutzen RTB House Retargeting. Anbieter ist die RTB House Spółka z ograniczoną odpowiedzialnością, Złota 61/101, 00-819 Warschau, Polen (EU). Datenverarbeitung in der EU.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Versanddienstleister-Klauseln
// ─────────────────────────────────────────────────────────────────────────────

export const VERSAND_KLAUSELN: Record<Versanddienstleister, string> = {
  dhl: `DHL Paket GmbH, Sträßchensweg 10, 53113 Bonn, Deutschland. Datenverarbeitung in der EU.`,
  hermes: `Hermes Germany GmbH, Essener Straße 89, 22419 Hamburg, Deutschland. Datenverarbeitung in der EU.`,
  dpd: `DPD Deutschland GmbH, Wailandtstraße 1, 63741 Aschaffenburg, Deutschland. Datenverarbeitung in der EU.`,
  gls: `GLS Germany GmbH & Co. OHG, GLS Germany-Straße 1-7, 36286 Neuenstein, Deutschland. Datenverarbeitung in der EU.`,
  ups: `United Parcel Service Deutschland S.à r.l. & Co. OHG, Görlitzer Straße 1, 41460 Neuss, Deutschland. Drittlandtransfer in die USA möglich; UPS ist nach dem EU-U.S. Data Privacy Framework zertifiziert.`,
  fedex: `FedEx Express Germany GmbH, Otto-Lilienthal-Straße 30, 28199 Bremen, Deutschland. Drittlandtransfer in die USA möglich; FedEx ist nach dem EU-U.S. Data Privacy Framework zertifiziert.`,
  deutsche_post: `Deutsche Post AG, Charles-de-Gaulle-Straße 20, 53113 Bonn, Deutschland. Datenverarbeitung in der EU.`,
  trans_o_flex: `trans-o-flex Express GmbH & Co. KGaA, Hertzstraße 10, 69469 Weinheim, Deutschland. Datenverarbeitung in der EU.`,
  andere: `Anderer Versanddienstleister. Bitte spezifischen Namen und Anschrift in der Datenschutzerklärung einsetzen.`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Bewertungssystem-Klauseln
// ─────────────────────────────────────────────────────────────────────────────

export const BEWERTUNG_KLAUSELN: Record<Bewertungssystem, { text: string; rechtsgrundlage: string }> = {
  trusted_shops: {
    text: `Wir nutzen Trusted Shops zur Sammlung und Veröffentlichung von Kundenbewertungen. Anbieter ist die Trusted Shops GmbH, Subbelrather Straße 15C, 50823 Köln, Deutschland. Nach erfolgter Bestellung wird Ihre Email-Adresse an Trusted Shops übermittelt, die Sie zu einer Bewertung einlädt.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Bewertungssammlung).",
  },
  ekomi: {
    text: `Wir nutzen eKomi zur Bewertungssammlung. Anbieter: eKomi Ltd., Markgrafenstraße 11, 10969 Berlin, Deutschland. Datenverarbeitung in der EU.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).",
  },
  trustpilot: {
    text: `Wir nutzen Trustpilot zur Bewertungssammlung. Anbieter: Trustpilot A/S, Pilestræde 58, 5., 1112 Kopenhagen K, Dänemark (EU). Datenverarbeitung primär in der EU.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).",
  },
  google_reviews: {
    text: `Wir nutzen Google Bewertungen / Google Business Profile zur Veröffentlichung von Kundenbewertungen. Anbieter: Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland. Datentransfer in die USA möglich; Google ist nach dem EU-U.S. Data Privacy Framework zertifiziert.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) bzw. Art. 6 Abs. 1 lit. a DSGVO (Einwilligung beim Einbetten der Reviews-Widgets).",
  },
  ausgezeichnet_org: {
    text: `Wir nutzen ausgezeichnet.org zur Bewertungssammlung. Anbieter: ITGP GmbH, Niederlassung Tirschenreuth, Mähringer Straße 60, 95643 Tirschenreuth, Deutschland.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).",
  },
  shopvote: {
    text: `Wir nutzen Shopvote zur Bewertungssammlung. Anbieter: BS Marketing UG (haftungsbeschränkt), Bochumer Straße 99, 44866 Bochum, Deutschland.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).",
  },
  keiner: {
    text: ``,
    rechtsgrundlage: ``,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Auskunftei-/Bonitäts-Klauseln (mit SCHUFA-Reform 2026)
// ─────────────────────────────────────────────────────────────────────────────

export const AUSKUNFTEI_KLAUSELN: Record<Auskunftei, { anbieter: string; spezifika?: string }> = {
  schufa: {
    anbieter: "SCHUFA Holding AG, Kormoranweg 5, 65201 Wiesbaden, Deutschland",
    spezifika: "Wir erhalten Bonitätsinformationen in Form eines Score-Werts auf der neuen SCHUFA-Skala von 100 bis 999 (gültig ab 17.03.2026). In die Berechnung fließen u.a. ein: Zahlungserfahrungen aus Krediten und Verträgen, laufende Kredite und deren Status, Dauer von Bankverbindungen, Häufigkeit von Bonitätsanfragen, Negativmerkmale.",
  },
  creditreform: {
    anbieter: "Creditreform Boniversum GmbH, Hellersbergstr. 11, 41460 Neuss, Deutschland",
  },
  infoscore: {
    anbieter: "infoscore Consumer Data GmbH (Arvato/Bertelsmann), Rheinstraße 99, 76532 Baden-Baden, Deutschland",
  },
  crif_buergel: {
    anbieter: "CRIF Bürgel GmbH, Friesenweg 4, Haus 12, 22763 Hamburg, Deutschland",
  },
  boniversum: {
    anbieter: "Verband der Vereine Creditreform e.V., Hellersbergstr. 12, 41460 Neuss, Deutschland",
  },
};

export const BONITAET_TEMPLATE = `## Bonitätsprüfung

Wenn Sie eine Zahlungsart wählen, bei der wir in Vorleistung gehen (z.B. Kauf auf Rechnung, Lastschrift, BNPL), führen wir eine Bonitätsprüfung durch.

**Auskunftei(en):**
{{AUSKUNFTEIEN}}

**Übermittelte Daten:** Name, Anschrift, Geburtsdatum, gewählte Zahlungsart, Bestellvolumen.

**Empfangene Daten:** Bonitätsinformationen auf Basis statistischer Verfahren.

**Logik der automatisierten Entscheidung (Art. 22 DSGVO + EuGH C-634/21):**
{{LOGIK_TEXT}}

**Folgen bei negativer Bonitätsprüfung:**
Bei negativer Bonität bieten wir Ihnen alternative Zahlungsarten an (z.B. Vorkasse). Eine vollautomatische, vollständige Ablehnung des Vertragsschlusses erfolgt nicht.

**Ihre Rechte:**
- Recht auf Anfechtung der Entscheidung
- Recht auf menschliche Überprüfung durch eine geschulte Person unseres Hauses
- Recht auf Darlegung des eigenen Standpunkts

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Forderungssicherung).`;

// ─────────────────────────────────────────────────────────────────────────────
// Chat-Klauseln (allgemein)
// ─────────────────────────────────────────────────────────────────────────────

export const CHAT_KLAUSELN: Record<ChatProvider, { text: string; rechtsgrundlage: string }> = {
  crisp: {
    text: `Wir nutzen Crisp Chat. Anbieter: Crisp IM SAS, 2 boulevard de Launay, 44100 Nantes, Frankreich (EU). Datenverarbeitung in der EU. Chatprotokolle werden für die Dauer der Kundenbeziehung gespeichert.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) bzw. lit. b DSGVO (Vertragsanbahnung).",
  },
  intercom: {
    text: `Wir nutzen Intercom. Anbieter: Intercom Inc., 55 2nd Street, 4th Floor, San Francisco, CA 94105, USA. Datentransfer in die USA. Standardvertragsklauseln nach Art. 46 DSGVO liegen vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  tawk_to: {
    text: `Wir nutzen Tawk.to. Anbieter: tawk.to inc., 187 East Warm Springs Rd, SB298, Las Vegas, NV 89119, USA. Datentransfer in die USA. Standardvertragsklauseln liegen vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  zendesk_chat: {
    text: `Wir nutzen Zendesk Chat. Anbieter: Zendesk Inc., 989 Market Street, San Francisco, CA 94103, USA. Datentransfer in die USA. Zendesk ist nach dem EU-U.S. Data Privacy Framework zertifiziert.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  userlike: {
    text: `Wir nutzen Userlike. Anbieter: Userlike UG (haftungsbeschränkt), Probsteigasse 44-46, 50670 Köln, Deutschland. Datenverarbeitung in der EU.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).",
  },
  olark: {
    text: `Wir nutzen Olark. Anbieter: Olark, Habla Inc., 405 El Camino Real #163, Menlo Park, CA 94025, USA. Standardvertragsklauseln nach Art. 46 DSGVO liegen vor.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.",
  },
  selbst_gehostet: {
    text: `Wir nutzen eine selbst gehostete Chat-Lösung auf unseren eigenen Servern innerhalb der EU. Chatprotokolle werden für die Dauer der Kundenbeziehung gespeichert.`,
    rechtsgrundlage: "Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) bzw. lit. b DSGVO (Vertragsanbahnung).",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// KI-Chatbot-Klauseln (mit AI Act ab 02.08.2026)
// ─────────────────────────────────────────────────────────────────────────────

export const KI_CHATBOT_KLAUSELN: Record<KiChatbotProvider, { anbieterText: string; istUS: boolean }> = {
  openai:          { anbieterText: "OpenAI, L.L.C., 3180 18th Street, San Francisco, CA 94110, USA. OpenAI ist nach dem EU-U.S. Data Privacy Framework zertifiziert. Standardvertragsklauseln nach Art. 46 DSGVO liegen vor.", istUS: true },
  anthropic:       { anbieterText: "Anthropic, PBC, 548 Market Street PMB 90375, San Francisco, CA 94104, USA. Standardvertragsklauseln nach Art. 46 DSGVO liegen vor.", istUS: true },
  google_gemini:   { anbieterText: "Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland (Vertragspartner); Google LLC, USA (Datenverarbeitung). Google ist nach dem EU-U.S. Data Privacy Framework zertifiziert.", istUS: true },
  mistral:         { anbieterText: "Mistral AI SAS, 15 rue des Halles, 75001 Paris, Frankreich (EU). Datenverarbeitung in der EU.", istUS: false },
  azure_openai:    { anbieterText: "Microsoft Ireland Operations Ltd., One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Irland. EU-Region (Frankfurt/Amsterdam) wählbar.", istUS: false },
  selbst_gehostet: { anbieterText: "Eigene Server innerhalb der EU. Modell wird auf unserer Infrastruktur betrieben.", istUS: false },
  andere:          { anbieterText: "[Anbieter individuell ergänzen]", istUS: false },
};

export const KI_CHATBOT_TEMPLATE = `## KI-Chatbot

Auf unserer Webseite bieten wir einen KI-basierten Chatbot an.

**Transparenzhinweis (Art. 50 AI Act):**
Sie kommunizieren mit einem KI-System, nicht mit einem Menschen. Dies wird Ihnen am Beginn jeder Konversation deutlich gemacht.

**KI-Anbieter:**
{{ANBIETER_TEXT}}

**Verarbeitung Ihrer Eingaben:**
Ihre Chat-Eingaben werden zur Beantwortung an den KI-Anbieter übermittelt. Wir haben mit dem Anbieter einen Auftragsverarbeitungsvertrag nach Art. 28 DSGVO abgeschlossen, der {{TRAINING_HINWEIS}}.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) bzw. lit. b DSGVO (Vertragsanbahnung).

{{DRITTLAND_HINWEIS}}

**Bitte beachten Sie:**
- Geben Sie keine sensiblen oder vertraulichen Informationen in den Chat ein.
- Geben Sie keine Daten Dritter ohne deren Einwilligung ein.
- Die Antworten der KI können fehlerhaft sein und ersetzen keine rechtliche, medizinische oder professionelle Beratung.`;

// ─────────────────────────────────────────────────────────────────────────────
// Video-Call-Klauseln (Zoom, Teams, Meet, Webex)
// ─────────────────────────────────────────────────────────────────────────────

export const VIDEO_CALL_KLAUSELN: Record<VideoCallProvider, { anbieterText: string; istUS: boolean }> = {
  zoom:          { anbieterText: "Zoom Communications Inc., 55 Almaden Boulevard, 6th Floor, San Jose, CA 95113, USA (vertretungsberechtigt für die EU: Zoom Video Communications GmbH, München). Datentransfer in die USA möglich; Zoom ist nach dem EU-U.S. Data Privacy Framework zertifiziert.", istUS: true },
  ms_teams:      { anbieterText: "Microsoft Ireland Operations Ltd., One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Irland. Datenverarbeitung in EU-Region möglich.", istUS: false },
  google_meet:   { anbieterText: "Google Ireland Ltd., Gordon House, Barrow Street, Dublin 4, Irland. Datentransfer in die USA möglich; Google ist nach dem EU-U.S. Data Privacy Framework zertifiziert.", istUS: true },
  webex:         { anbieterText: "Cisco Systems Inc., 170 West Tasman Drive, San Jose, CA 95134, USA. Standardvertragsklauseln nach Art. 46 DSGVO liegen vor.", istUS: true },
  jitsi:         { anbieterText: "Selbst gehosteter Jitsi-Meet-Server auf unserer Infrastruktur innerhalb der EU.", istUS: false },
  bigbluebutton: { anbieterText: "Selbst gehostetes BigBlueButton (Open Source) auf unserer Infrastruktur innerhalb der EU.", istUS: false },
  whereby:       { anbieterText: "Whereby AS, Storgata 124, 9008 Tromsø, Norwegen (EWR). Datenverarbeitung im EWR.", istUS: false },
  andere:        { anbieterText: "[Anbieter individuell ergänzen]", istUS: false },
};

export const VIDEO_CALL_TEMPLATE = `## Webinare und Video-Konferenzen

Für die Durchführung von Webinaren und Video-Konferenzen nutzen wir **{{NAME}}**.

**Anbieter:** {{ANBIETER}}

**Verarbeitete Daten:**
- Anmeldedaten (Name, Email)
- Audio- und Video-Daten während der Sitzung
- Chat-Nachrichten
- Metadaten (Teilnahmezeit, IP, Gerät)
- Bei Aufzeichnung: Audio/Video der Sitzung

**Aufzeichnung:**
Wenn wir eine Sitzung aufzeichnen, weisen wir Sie zu Beginn deutlich darauf hin. Sie haben das Recht, der Aufzeichnung zu widersprechen oder Ihre Kamera/Mikrofon zu deaktivieren.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragsdurchführung) bzw. Art. 6 Abs. 1 lit. a DSGVO (Einwilligung bei Aufzeichnung).

{{DRITTLAND_HINWEIS}}

Ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO ist abgeschlossen.`;

// ─────────────────────────────────────────────────────────────────────────────
// Push-Notifications
// ─────────────────────────────────────────────────────────────────────────────

export const PUSH_KLAUSEL = `## Push-Benachrichtigungen

Mit Ihrer Einwilligung können wir Ihnen Push-Benachrichtigungen über Ihren Browser senden.

**Verarbeitete Daten:**
- Push-Endpoint-Token Ihres Browsers
- Browser-Typ und Gerätekategorie
- Zeitstempel der Benachrichtigungen

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) + § 25 Abs. 1 TDDDG.

**Widerruf:** Sie können Push-Benachrichtigungen jederzeit über die Browser-Einstellungen deaktivieren. Nach Widerruf wird Ihr Token aus unserer Datenbank gelöscht.`;

// ─────────────────────────────────────────────────────────────────────────────
// HR-Klauseln
// ─────────────────────────────────────────────────────────────────────────────

export const HR_KLAUSELN = {
  bewerbung: `## Bewerbung über unsere Webseite

Wenn Sie sich über unser Bewerbungsformular bei uns bewerben, verarbeiten wir Ihre Bewerbungsunterlagen (Lebenslauf, Anschreiben, Zeugnisse, optional Foto und Gehaltsvorstellung) zur Durchführung des Bewerbungsverfahrens.

**Rechtsgrundlage:** § 26 Abs. 1 BDSG (Beschäftigungsverhältnis-Anbahnung) i.V.m. Art. 88 DSGVO.

**Speicherdauer:**
- Bei Nicht-Einstellung: Löschung spätestens 6 Monate nach Abschluss des Bewerbungsverfahrens (Frist resultiert aus § 15 Abs. 4 AGG zur Verteidigung gegen mögliche Diskriminierungsklagen).
- Bei längerer Aufbewahrung im Bewerber-Pool: nur mit Ihrer Einwilligung.
- Bei Einstellung: Übernahme in Personalakte.

**Empfänger:**
Ihre Bewerbungsdaten werden ausschließlich an die Personalabteilung und die für die Stelle zuständigen Führungskräfte weitergegeben. Eine Weitergabe an Dritte erfolgt nicht ohne Ihre Einwilligung.

**Besondere Kategorien (Art. 9 DSGVO):**
Wenn Sie freiwillig sensible Daten (z.B. Schwerbehinderung) angeben, verarbeiten wir diese nur, sofern dies für die Bewerbung erforderlich ist oder wenn Sie ausdrücklich eingewilligt haben.`,

  bewerberMgmt: `## Bewerbermanagement-System

Für die Verwaltung von Bewerbungen nutzen wir das Bewerbermanagement-System **{{SYSTEM_NAME}}**. Anbieter: {{ANBIETER}}. Mit dem Anbieter haben wir einen Auftragsverarbeitungsvertrag nach Art. 28 DSGVO abgeschlossen.{{DRITTLAND_HINWEIS}}`,

  mitarbeiterfotos: `## Veröffentlichung von Mitarbeiterfotos

Auf unserer Webseite veröffentlichen wir Fotos und Namen unserer Mitarbeiter auf der "Über uns"-/Team-Seite.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (ausdrückliche Einwilligung der abgebildeten Person) sowie § 22 KUG.

**Widerruf:** Mitarbeiter können ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen. Nach Widerruf werden Foto und Name unverzüglich entfernt.

**Bei Austritt:** Beim Ausscheiden aus dem Unternehmen werden Foto und Name spätestens innerhalb von 4 Wochen von der Webseite entfernt.`,

  backgroundCheck: `## Hintergrundprüfung im Bewerbungsverfahren

In bestimmten Fällen (z.B. Vertrauenspositionen, Führungspositionen, Positionen mit Finanzverantwortung) führen wir nach Ihrer ausdrücklichen Einwilligung eine Hintergrundprüfung durch.

**Geprüft werden ggf.:** Identität (Personalausweis-Abgleich), beruflicher Werdegang (Verifizierung Arbeitszeugnisse), Führungszeugnis (Vorlage durch Sie), SCHUFA-Auskunft.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) + § 26 Abs. 2 BDSG (Erforderlichkeit für Beschäftigungsverhältnis).

**Keine Hintergrundprüfung ohne Ihre vorherige schriftliche Einwilligung.**`,

  hinschg: `## Meldekanal nach HinSchG

Wir betreiben einen internen Meldekanal nach dem Hinweisgeberschutzgesetz (HinSchG). Über diesen können Sie Hinweise auf Rechtsverstöße melden.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. c DSGVO i.V.m. §§ 10, 11 HinSchG.

**Vertraulichkeit:** Die Identität der hinweisgebenden Person sowie aller in der Meldung genannten Personen wird streng vertraulich behandelt und ausschließlich den für die Bearbeitung zuständigen Personen offengelegt.

**Schutz vor Repressalien:** Hinweisgeber genießen den Schutz des § 36 HinSchG.

**Speicherdauer:** Dokumentation der Meldung mindestens 3 Jahre nach Abschluss des Verfahrens (§ 11 Abs. 5 HinSchG).`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Branchen-spezifische Klauseln
// ─────────────────────────────────────────────────────────────────────────────

export const BRANCHEN_KLAUSELN: Partial<Record<Branche, string>> = {
  arzt: `## Verarbeitung von Gesundheitsdaten

Im Rahmen unserer ärztlichen/therapeutischen Tätigkeit verarbeiten wir Gesundheitsdaten als besondere Kategorien personenbezogener Daten.

**Rechtsgrundlage:** Art. 9 Abs. 2 lit. h DSGVO (Gesundheitsversorgung) i.V.m. § 22 Abs. 1 Nr. 1 lit. b BDSG.

**Kategorien:** Anamnesedaten, Diagnose- und Behandlungsdaten, Medikamenten- und Therapieverlauf, Abrechnungsdaten (KV, privat).

**Empfänger:** Behandelnde Ärzte und Therapeuten unserer Praxis; bei Überweisung weiterbehandelnde Praxen/Krankenhäuser (mit Ihrer Einwilligung); Kassenärztliche Vereinigung / Privatabrechnung; ggf. Privatärztliche Verrechnungsstelle (PVS); Steuerberater (nur abrechnungsrelevante Daten ohne Diagnoseinhalte).

**Speicherdauer:** 10 Jahre nach Behandlungsende (§ 630f BGB / berufsrechtliche Vorgaben).

**Schweigepflicht:** Wir sind nach § 203 StGB zur Verschwiegenheit verpflichtet.

**Datenschutz-Folgenabschätzung:** Für die Verarbeitung umfangreicher Gesundheitsdaten wurde eine Datenschutz-Folgenabschätzung nach Art. 35 DSGVO durchgeführt.`,

  anwalt: `## Mandatsdaten und Berufsgeheimnis

Im Rahmen unseres Mandats verarbeiten wir Ihre personenbezogenen Daten zur Mandatsbearbeitung.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragsdurchführung) + Art. 6 Abs. 1 lit. c DSGVO (berufsrechtliche Pflichten).

**Berufliche Verschwiegenheit:** Wir sind als Rechtsanwälte/Steuerberater/Wirtschaftsprüfer nach § 43a BRAO / § 57 StBerG / § 43 WPO und § 203 StGB zur Verschwiegenheit verpflichtet.

**Aufbewahrungspflichten:** Mandatsakten 6 Jahre nach Mandatsende (§ 50 Abs. 1 BRAO / § 66 Abs. 1 StBerG); Handakten/Buchhaltung 10 Jahre (§ 147 AO).

**Empfänger:** Behörden/Gerichte im Mandatszusammenhang; andere beauftragte Berufsträger (mit Ihrer Zustimmung); IT-Dienstleister (mit AVV nach Art. 28 DSGVO + zusätzlicher Verschwiegenheitsverpflichtung nach § 43e BRAO / § 62 StBerG).`,

  pflege: `## Verarbeitung von Pflege- und Gesundheitsdaten

Im Rahmen unserer pflegerischen Tätigkeit verarbeiten wir Gesundheits- und Pflegedaten als besondere Kategorien personenbezogener Daten.

**Rechtsgrundlage:** Art. 9 Abs. 2 lit. h DSGVO + § 22 BDSG + SGB XI (Soziale Pflegeversicherung).

**Speicherdauer:** Pflegedokumentation 10 Jahre nach Pflegeende; Abrechnungsunterlagen 10 Jahre (§ 147 AO).`,

  hotel: `## Meldepflichten und Beherbergung

Als Beherbergungsbetrieb sind wir nach § 30 BMG verpflichtet, einen Meldeschein auszufüllen. Erfasst werden: Name, Geburtsdatum, Staatsangehörigkeit, Anschrift, Pass-/Personalausweisnummer (bei ausländischen Gästen).

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. c DSGVO i.V.m. § 30 BMG.

**Aufbewahrungsdauer:** 1 Jahr (§ 30 Abs. 4 BMG), danach Vernichtung.

**Empfänger:** Meldescheine werden auf Anforderung von Polizei und Sicherheitsbehörden eingesehen.`,

  versicherung: `## Versicherungsspezifische Datenverarbeitung

Als Versicherer/Versicherungsvermittler unterliegen wir besonderen Verarbeitungsregelungen.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b/c/f DSGVO + § 26 BDSG + VAG + VVG.

**Besonderheiten:** Verarbeitung von Gesundheitsdaten zur Risikoprüfung nur mit ausdrücklicher Einwilligung (Art. 9 Abs. 2 lit. a DSGVO). Auskunfteien-Abfrage zur Risikoeinschätzung. Geldwäsche-Prävention (GwG).

**Aufbewahrungsfristen:** Vertragsunterlagen 10 Jahre nach Vertragsende (§ 147 AO); GwG-Dokumente 5 Jahre.`,

  ki_saas: `## Besondere Hinweise als KI-/SaaS-Anbieter

Als KI-Anbieter unterliegen wir zusätzlich den Transparenzpflichten nach Art. 50 EU AI Act (Verordnung 2024/1689), die ab 02.08.2026 vollständig anwendbar sind.

**Risikoklasse:** Unser KI-System wurde gemäß AI Act klassifiziert als [Hochrisiko / begrenztes Risiko / minimales Risiko]. Bei Hochrisiko-Systemen liegt eine vollständige Risikoanalyse + Logbuchführung + menschliche Aufsicht vor.

**Trainingsdaten:** Wir nutzen ausschließlich Trainingsdaten, für die eine rechtmäßige Verarbeitungsgrundlage besteht. Keine Verwendung von Eingabedaten unserer Nutzer zum Modell-Training, sofern nicht ausdrücklich eingewilligt.

**Datenschutz-Folgenabschätzung:** Eine DSFA nach Art. 35 DSGVO wurde durchgeführt.`,

  schule: `## Schul-/Bildungsdaten-Verarbeitung

Als Bildungseinrichtung unterliegen wir zusätzlich den landesschulgesetzlichen Datenschutzregelungen.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. e DSGVO (öffentliche Aufgabe) + jeweilige Landesschulgesetze + Datenschutzverordnung für Schulen des jeweiligen Bundeslandes.

**Aufsichtsbehörde:** [Landesbeauftragte/r für Datenschutz des Bundeslandes].`,

  verein: `## Vereinsspezifische Datenverarbeitung

Als Verein verarbeiten wir Mitgliederdaten zur Erfüllung des Vereinszwecks.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vereinsmitgliedschaft = Vertragsverhältnis) i.V.m. unserer Vereinssatzung.

**Verarbeitete Daten:** Name, Adresse, Geburtsdatum, Beitrittsdatum, Bankverbindung für Beitragseinzug, Vereinsfunktionen.

**Veröffentlichung von Mitglieder-/Vorstandsdaten:** Nur mit ausdrücklicher Einwilligung der betroffenen Person.

**Aufbewahrungsdauer:** Mitgliedsdaten werden 3 Jahre nach Austritt gelöscht (Verjährungsfristen).`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Spezielle Verarbeitungen
// ─────────────────────────────────────────────────────────────────────────────

export const SPEZIAL_KLAUSELN = {
  profiling: `## Profiling

Im Rahmen unserer Webseite/Dienstleistung verwenden wir automatisierte Verfahren zur Bewertung Ihres Verhaltens (Profiling). Dabei wird auf Basis Ihrer personenbezogenen Daten ein Profil erstellt.

**Was wir profilieren:** Nutzungsverhalten, ggf. Kaufverhalten, Klickverhalten in Marketing-Emails.

**Logik:** Profile werden auf Basis statistischer Verfahren (Clustering, Klassifizierung) erstellt.

**Zweck:** Personalisierte Empfehlungen, Optimierung unserer Angebote, ggf. Direktmarketing (mit Einwilligung).

**Ihre Rechte:**
- Widerspruchsrecht gegen Profiling (Art. 21 Abs. 2 DSGVO)
- Recht auf menschliche Überprüfung automatisierter Entscheidungen (Art. 22 Abs. 3 DSGVO)
- Recht auf Darlegung des eigenen Standpunkts
- Recht auf Anfechtung der Entscheidung

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), soweit das Profiling auf Cookies/Tracking beruht (i.V.m. § 25 Abs. 1 TDDDG); andernfalls Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Optimierung unserer Angebote), gegen das Sie nach Art. 21 Abs. 2 DSGVO jederzeit Widerspruch einlegen können.`,

  automatisierteEntscheidung: `## Automatisierte Einzelentscheidungen (Art. 22 DSGVO)

Folgende Entscheidungen treffen wir teilweise vollautomatisch:
- Bonitätsprüfung bei Zahlung auf Rechnung (siehe oben)
- Anzeige individueller Rabattcodes / Angebote
- Spam-Filterung von Kontaktanfragen

**Logik:** Algorithmische Auswertung Ihrer historischen Daten und Profilinformationen.

**Folgen:** Bei negativer Entscheidung können Sie immer eine menschliche Überprüfung anfordern.

**Ihre Rechte:**
- Recht auf menschliche Überprüfung
- Recht auf Darlegung Ihres Standpunkts
- Recht auf Anfechtung der Entscheidung`,

  jointController: `## Gemeinsame Verantwortlichkeit (Joint Controllership)

Bei der Nutzung bestimmter Plattform-Tools sind wir gemeinsam mit dem Anbieter für die Datenverarbeitung verantwortlich (Joint Controller nach Art. 26 DSGVO).

**Meta-Plattformen:** Mit Meta Platforms Ireland Ltd. besteht eine Vereinbarung über gemeinsame Verantwortlichkeit ("Controller Addendum"). Wesentliche Inhalte unter: https://www.facebook.com/legal/controller_addendum

**Verantwortlichkeitsverteilung:**
- Wir sind verantwortlich für die rechtmäßige Erhebung der Daten auf unserer Webseite (Einwilligung).
- Der Plattform-Anbieter ist verantwortlich für die weitere Verarbeitung der Daten in seinem System.

**Ihre Rechte:** Sie können sowohl bei uns als auch beim jeweiligen Anbieter Ihre Rechte als betroffene Person geltend machen.`,

  videoueberwachung_live: `## Videoüberwachung / Live-Stream

Auf unserer Webseite wird ein Live-Video-Stream übertragen.

**Hinweispflicht vor Ort:** Am Standort der Kamera weisen wir durch deutlich sichtbare Schilder auf die Videoüberwachung hin (§ 4 Abs. 2 BDSG).

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) — Interessenabwägung wurde durchgeführt.

**Speicherung:** Die Live-Aufnahmen werden nicht gespeichert. (Bei abweichender Praxis: konkrete Aufbewahrungsfrist nennen.)

**Personenidentifizierung:** Personen sind aufgrund der Bildauflösung/Entfernung nicht identifizierbar. Andernfalls: zusätzliche Maßnahmen wie Verpixelung.`,

  kinder: `## Angebote für Kinder und Jugendliche

Unsere Angebote richten sich (auch) an Personen unter 16 Jahren.

**Rechtsgrundlage Einwilligung Minderjähriger (Art. 8 DSGVO):**
- Kinder unter 16 Jahren: Einwilligung der Eltern oder erziehungsberechtigten Person erforderlich.
- Wir setzen angemessene Maßnahmen ein, um die elterliche Zustimmung zu überprüfen.

**Besondere Schutzmaßnahmen:**
- Klare, kindgerechte Sprache in Einwilligungstexten
- Keine Profilbildung oder Direktwerbung an Minderjährige
- Keine Weitergabe an Dritte für Marketing-Zwecke
- Vereinfachte Möglichkeit zum Widerruf`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Embed-Optionen-Klauseln (Google Fonts lokal vs. extern)
// ─────────────────────────────────────────────────────────────────────────────

export const GOOGLE_FONTS_LOKAL_KLAUSEL = `## Google Fonts (lokal eingebunden)

Auf unserer Webseite verwenden wir Schriftarten von Google Fonts. Die Schriftarten werden lokal von unseren eigenen Servern geladen — es findet KEIN Verbindungsaufbau zu Google-Servern statt.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer einheitlichen Darstellung).`;

// ─────────────────────────────────────────────────────────────────────────────
// DSB-Klausel
// ─────────────────────────────────────────────────────────────────────────────

export const DSB_PFLICHT_HINWEIS = `**Hinweis zur DSB-Pflicht:** Aufgrund der Mitarbeiterzahl von 20 oder mehr Personen, die ständig mit automatisierter Verarbeitung personenbezogener Daten beschäftigt sind, haben wir gemäß § 38 BDSG einen Datenschutzbeauftragten bestellt.`;

// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL FIX #1: Aufsichtsbehörden pro Bundesland (DSGVO Art. 77)
// Quelle: BfDI-Liste 2026
// ─────────────────────────────────────────────────────────────────────────────

import type { Bundesland } from "./types";

export type Aufsichtsbehoerde = {
  name: string;
  adresse: string;
  telefon: string;
  email: string;
  webseite: string;
};

export const AUFSICHTSBEHOERDEN: Record<Bundesland, Aufsichtsbehoerde> = {
  BW: {
    name: "Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg (LfDI BW)",
    adresse: "Lautenschlagerstraße 20, 70173 Stuttgart",
    telefon: "+49 711 615541-0",
    email: "poststelle@lfdi.bwl.de",
    webseite: "https://www.baden-wuerttemberg.datenschutz.de/",
  },
  BY: {
    name: "Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)",
    adresse: "Promenade 18, 91522 Ansbach",
    telefon: "+49 981 180093-0",
    email: "poststelle@lda.bayern.de",
    webseite: "https://www.lda.bayern.de/",
  },
  BE: {
    name: "Berliner Beauftragte für Datenschutz und Informationsfreiheit (BlnBDI)",
    adresse: "Alt-Moabit 59-61, 10555 Berlin",
    telefon: "+49 30 13889-0",
    email: "mailbox@datenschutz-berlin.de",
    webseite: "https://www.datenschutz-berlin.de/",
  },
  BB: {
    name: "Landesbeauftragte für den Datenschutz und für das Recht auf Akteneinsicht Brandenburg",
    adresse: "Stahnsdorfer Damm 77, 14532 Kleinmachnow",
    telefon: "+49 33203 356-0",
    email: "poststelle@lda.brandenburg.de",
    webseite: "https://www.lda.brandenburg.de/",
  },
  HB: {
    name: "Die Landesbeauftragte für Datenschutz und Informationsfreiheit der Freien Hansestadt Bremen",
    adresse: "Arndtstraße 1, 27570 Bremerhaven",
    telefon: "+49 421 361-2010",
    email: "office@datenschutz.bremen.de",
    webseite: "https://www.datenschutz.bremen.de/",
  },
  HH: {
    name: "Der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit (HmbBfDI)",
    adresse: "Ludwig-Erhard-Straße 22, 20459 Hamburg",
    telefon: "+49 40 428 54-4040",
    email: "mailbox@datenschutz.hamburg.de",
    webseite: "https://datenschutz-hamburg.de/",
  },
  HE: {
    name: "Der Hessische Beauftragte für Datenschutz und Informationsfreiheit (HBDI)",
    adresse: "Gustav-Stresemann-Ring 1, 65189 Wiesbaden",
    telefon: "+49 611 1408-0",
    email: "poststelle@datenschutz.hessen.de",
    webseite: "https://datenschutz.hessen.de/",
  },
  MV: {
    name: "Der Landesbeauftragte für Datenschutz und Informationsfreiheit Mecklenburg-Vorpommern",
    adresse: "Werderstraße 74a, 19055 Schwerin",
    telefon: "+49 385 59494-0",
    email: "info@datenschutz-mv.de",
    webseite: "https://www.datenschutz-mv.de/",
  },
  NI: {
    name: "Die Landesbeauftragte für den Datenschutz Niedersachsen (LfD NI)",
    adresse: "Prinzenstraße 5, 30159 Hannover",
    telefon: "+49 511 120-4500",
    email: "poststelle@lfd.niedersachsen.de",
    webseite: "https://lfd.niedersachsen.de/",
  },
  NW: {
    name: "Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)",
    adresse: "Kavalleriestraße 2-4, 40213 Düsseldorf",
    telefon: "+49 211 38424-0",
    email: "poststelle@ldi.nrw.de",
    webseite: "https://www.ldi.nrw.de/",
  },
  RP: {
    name: "Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz",
    adresse: "Hintere Bleiche 34, 55116 Mainz",
    telefon: "+49 6131 208-2449",
    email: "poststelle@datenschutz.rlp.de",
    webseite: "https://www.datenschutz.rlp.de/",
  },
  SL: {
    name: "Unabhängiges Datenschutzzentrum Saarland (UDS)",
    adresse: "Fritz-Dobisch-Straße 12, 66111 Saarbrücken",
    telefon: "+49 681 94781-0",
    email: "poststelle@datenschutz.saarland.de",
    webseite: "https://www.datenschutz.saarland.de/",
  },
  SN: {
    name: "Die Sächsische Datenschutz- und Transparenzbeauftragte",
    adresse: "Devrientstraße 5, 01067 Dresden",
    telefon: "+49 351 85471-101",
    email: "saechsdsb@slt.sachsen.de",
    webseite: "https://www.saechsdsb.de/",
  },
  ST: {
    name: "Landesbeauftragter für den Datenschutz Sachsen-Anhalt",
    adresse: "Leiterstraße 9, 39104 Magdeburg",
    telefon: "+49 391 81803-0",
    email: "poststelle@lfd.sachsen-anhalt.de",
    webseite: "https://datenschutz.sachsen-anhalt.de/",
  },
  SH: {
    name: "Unabhängiges Landeszentrum für Datenschutz Schleswig-Holstein (ULD)",
    adresse: "Holstenstraße 98, 24103 Kiel",
    telefon: "+49 431 988-1200",
    email: "mail@datenschutzzentrum.de",
    webseite: "https://www.datenschutzzentrum.de/",
  },
  TH: {
    name: "Der Thüringer Landesbeauftragte für den Datenschutz und die Informationsfreiheit (TLfDI)",
    adresse: "Häßlerstraße 8, 99096 Erfurt",
    telefon: "+49 361 57 311 29 00",
    email: "poststelle@datenschutz.thueringen.de",
    webseite: "https://www.tlfdi.de/",
  },
  BUND: {
    name: "Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit (BfDI)",
    adresse: "Graurheindorfer Straße 153, 53117 Bonn",
    telefon: "+49 228 997799-0",
    email: "poststelle@bfdi.bund.de",
    webseite: "https://www.bfdi.bund.de/",
  },
  AT_BUND: {
    name: "Österreichische Datenschutzbehörde",
    adresse: "Barichgasse 40-42, 1030 Wien, Österreich",
    telefon: "+43 1 52 152-0",
    email: "dsb@dsb.gv.at",
    webseite: "https://www.dsb.gv.at/",
  },
  CH_BUND: {
    name: "Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB)",
    adresse: "Feldeggweg 1, 3003 Bern, Schweiz",
    telefon: "+41 58 462 43 95",
    email: "info@edoeb.admin.ch",
    webseite: "https://www.edoeb.admin.ch/",
  },
  UNBEKANNT: {
    name: "Die für Sie zuständige Datenschutz-Aufsichtsbehörde",
    adresse: "Abhängig vom Bundesland Ihres Sitzes",
    telefon: "Siehe BfDI-Liste",
    email: "—",
    webseite: "https://www.bfdi.bund.de/DE/Service/Anschriften/anschriften_table.html",
  },
};

/** Errechnet aus PLZ ein wahrscheinliches Bundesland */
export function bundeslandFromPlz(plz: string): Bundesland {
  const p = parseInt(plz.slice(0, 2), 10);
  if (isNaN(p)) return "UNBEKANNT";
  // Grobe PLZ-Bundesland-Zuordnung (DE)
  if (p >= 1 && p <= 9) return "SN";       // 01-09 Sachsen
  if (p >= 10 && p <= 16) return "BE";     // 10-16 Berlin/Brandenburg (Berlin überwiegt)
  if (p >= 17 && p <= 19) return "MV";     // 17-19 MV
  if (p >= 20 && p <= 25) return "HH";     // 20-25 Hamburg/SH
  if (p >= 26 && p <= 29) return "NI";     // 26-29 Niedersachsen
  if (p >= 30 && p <= 38) return "NI";     // 30-38 Niedersachsen
  if (p >= 39 && p <= 39) return "ST";     // 39 Sachsen-Anhalt
  if (p >= 40 && p <= 48) return "NW";     // 40-48 NRW
  if (p >= 49 && p <= 49) return "NI";     // 49 Niedersachsen
  if (p >= 50 && p <= 59) return "NW";     // 50-59 NRW
  if (p >= 60 && p <= 65) return "HE";     // 60-65 Hessen
  if (p >= 66 && p <= 66) return "SL";     // 66 Saarland
  if (p >= 67 && p <= 69) return "RP";     // 67-69 RLP
  if (p >= 70 && p <= 79) return "BW";     // 70-79 BW
  if (p >= 80 && p <= 87) return "BY";     // 80-87 Bayern
  if (p >= 88 && p <= 89) return "BW";     // 88-89 BW
  if (p >= 90 && p <= 96) return "BY";     // 90-96 Bayern
  if (p >= 97 && p <= 97) return "BY";     // 97 Bayern
  if (p >= 98 && p <= 99) return "TH";     // 98-99 Thüringen
  return "UNBEKANNT";
}

// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL FIX #2: Standard-Speicherdauern pro Modul
// ─────────────────────────────────────────────────────────────────────────────

export const SPEICHERDAUERN = {
  hosting_logs: "14 Tage automatisch gelöscht",
  newsletter_einwilligung: "bis Widerruf der Einwilligung, max. 3 Jahre nach letzter Interaktion",
  analytics_cookieless: "anonymisiert, keine personenbezogene Langzeitspeicherung",
  analytics_cookies: "anonymisiert nach 14 Monaten (GA4-Default)",
  marketing_pixel: "max. 90 Tage nach Klick (Cookie-Lebensdauer)",
  marketing_remarketing: "max. 540 Tage (typische Audience-Liste)",
  kontaktformular: "Löschung nach Abschluss der Bearbeitung, spätestens 12 Monate nach letzter Korrespondenz; Aufbewahrungspflichten (§ 257 HGB, § 147 AO) bleiben unberührt",
  bewerbung_nicht_eingestellt: "spätestens 6 Monate nach Abschluss des Bewerbungsverfahrens (§ 15 Abs. 4 AGG)",
  bewerbung_pool: "bis Widerruf, max. 24 Monate",
  kundenkonto_aktiv: "Dauer der Vertragsbeziehung; automatische Löschung nach 36 Monaten Inaktivität",
  bestellung_rechnung: "10 Jahre nach Ende des Steuerjahrs (§ 147 AO, § 257 HGB)",
  push_token: "bis Widerruf, max. 24 Monate ohne Notification-Klick",
  chat_protokolle: "12 Monate nach letztem Kontakt; bei Anbieter mit eigener Speicherdauer: nach deren Vorgabe",
  webinar_aufzeichnung: "12 Monate nach Aufzeichnung, danach Löschung",
  bonitaet: "Bonitätsdaten werden nicht dauerhaft bei uns gespeichert, sondern nur für die einmalige Entscheidung verwendet",
  bewertung_email: "30 Tage nach Bestellung (Einladungs-Email); Bewertungsinhalte beim Bewertungssystem-Anbieter",
  videoueberwachung_live: "keine Speicherung (Live-Stream); bei Speicherung: max. 72h",
  arzt_patienten: "10 Jahre nach Behandlungsende (§ 630f BGB)",
  anwalt_mandate: "6 Jahre nach Mandatsende (§ 50 BRAO); Handakten 10 Jahre (§ 147 AO)",
  hotel_meldeschein: "1 Jahr (§ 30 Abs. 4 BMG)",
  hinschg_meldung: "mindestens 3 Jahre nach Verfahrensabschluss (§ 11 Abs. 5 HinSchG)",
  joint_controller_meta: "Speicherdauer entsprechend der Vereinbarung mit Meta (siehe Meta-Datenschutzrichtlinie)",
  mitarbeiterfotos: "bis Widerruf oder Austritt + max. 4 Wochen",
};

// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL FIX #18: Datenkategorien pro Klausel (für vollständige Art. 13 Abs. 1 lit. c)
// ─────────────────────────────────────────────────────────────────────────────

export const DATENKATEGORIEN = {
  hosting: "IP-Adresse, Datum/Uhrzeit der Anfrage, abgerufene URL, HTTP-Statuscode, übertragene Datenmenge, User-Agent (Browser-Typ und -Version)",
  analytics_cookieless: "Hashed Session-ID (täglich rotierend), URL der Seite, Referrer, Bildschirmgröße, Browser-Sprache, Land (aus IP, ohne Speicherung der IP)",
  analytics_cookies: "Pseudonyme Client-ID, IP-Adresse (anonymisiert), Pageviews, Verweildauer, Klick-Pfade, Gerät, Betriebssystem, Browser",
  newsletter: "Email-Adresse, ggf. Vorname/Anrede, Anmeldezeitpunkt, Bestätigungszeitpunkt (Double-Opt-In), IP-Adresse der Anmeldung; bei aktivem Tracking zusätzlich: Öffnungs- und Klickdaten",
  marketing: "Pseudonyme Cookie-ID oder Pixel-ID, Conversion-Events, besuchte Seiten, Klick-Pfade, ggf. Hash-ID Ihrer E-Mail (Custom Audiences)",
  kontaktformular: "Name, E-Mail-Adresse, Inhalt der Nachricht, weitere von Ihnen eingegebene Daten, Zeitstempel, IP-Adresse",
  bewerbung: "Bewerbungsunterlagen (Lebenslauf, Anschreiben, Zeugnisse), Kontaktdaten, Gehaltsvorstellung, optionale Angaben (Foto, Geburtsdatum), ggf. besondere Kategorien nach Art. 9 DSGVO bei freiwilliger Mitteilung",
  kundenkonto: "Stammdaten (Name, Adresse, Email), Login-Daten (Username, Passwort-Hash), Profildaten, Vertrags- und Bestellhistorie, Kommunikationsverlauf",
  bestellung: "Stammdaten, Rechnungs- und Lieferadresse, Bestellinhalt, Zahlungsdaten (vom Zahlungsanbieter), Bestellnummer, Bestellzeitpunkt",
  zahlung: "Zahlungsmethode, Zahlungsdaten (an Zahlungsanbieter weitergeleitet, nicht bei uns gespeichert), Transaktions-ID, Status",
  bonitaet: "Name, Anschrift, Geburtsdatum, gewählte Zahlungsart, Bestellvolumen — übermittelt an die Auskunftei; empfangen wird ein Score-Wert und ggf. Negativmerkmale",
  versand: "Name, Lieferadresse; optional Email (Sendungsbenachrichtigung) und Telefon (Avisierung)",
  bewertung: "Email-Adresse, Bestellnummer; bei Abgabe der Bewertung zusätzlich: Bewertungstext, Sterne-Bewertung, ggf. Name/Pseudonym",
  chat: "Chat-Nachrichten, optional Name und Email für Rückantwort, IP-Adresse, Browser-Typ, Zeitstempel, Verweildauer",
  ki_chatbot: "Chat-Eingaben (Prompts), generierte Antworten, Session-ID, Zeitstempel, ggf. Konversations-Historie zur Kontextverbesserung innerhalb der Session",
  webinar: "Anmeldedaten (Name, Email), Audio-/Video-Daten während der Sitzung, Chat-Nachrichten, Metadaten (Teilnahmezeit, IP, Gerät), bei Aufzeichnung: Audio/Video der Sitzung",
  push: "Push-Endpoint-Token Ihres Browsers, Browser-Typ und Gerätekategorie, Zeitstempel der Benachrichtigungen",
  mitarbeiterfoto: "Name (Vor- und Nachname), Funktion/Rolle im Unternehmen, Foto",
  hinschg: "Inhalt der Meldung, ggf. identifizierende Angaben (sofern freiwillig mitgeteilt), Zeitstempel, Bearbeitungsverlauf",
  joint_controller_meta: "Pseudonyme Cookie-/Pixel-ID, besuchte Seiten, Conversion-Events, ggf. Hashed-Email bei Custom Audiences, Klick-Pfade",
  videoueberwachung_live: "Bildaufnahmen des überwachten Bereichs; bei nicht-identifizierender Auflösung: keine personenbezogenen Daten",
  arzt_gesundheit: "Anamnesedaten, Diagnose- und Behandlungsdaten, Medikamenten- und Therapieverlauf, Abrechnungsdaten (KV/privat)",
  anwalt_mandat: "Mandatsdaten, Schriftverkehr, Akten- und Abrechnungsunterlagen, ggf. besondere Kategorien je nach Mandatsgegenstand",
  hotel_meldeschein: "Name, Geburtsdatum, Staatsangehörigkeit, Anschrift, Pass-/Personalausweisnummer (bei ausländischen Gästen)",
  verein_mitglied: "Name, Anschrift, Geburtsdatum, Beitrittsdatum, Bankverbindung für Beitragseinzug, Vereinsfunktionen, Teilnahme an Veranstaltungen",
};

// ─────────────────────────────────────────────────────────────────────────────
// HIGH FIX #3: Standard-Empfänger-Kategorien (Art. 13 Abs. 1 lit. e)
// ─────────────────────────────────────────────────────────────────────────────

export const STANDARD_EMPFAENGER = `## Empfänger oder Kategorien von Empfängern

Eine Übermittlung Ihrer personenbezogenen Daten an Dritte erfolgt nur, wenn:
- Sie nach Art. 6 Abs. 1 lit. a DSGVO Ihre ausdrückliche Einwilligung dazu erteilt haben,
- die Weitergabe nach Art. 6 Abs. 1 lit. f DSGVO zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist und kein Grund zur Annahme besteht, dass Sie ein überwiegendes schutzwürdiges Interesse an der Nichtweitergabe Ihrer Daten haben,
- für die Weitergabe nach Art. 6 Abs. 1 lit. c DSGVO eine gesetzliche Verpflichtung besteht oder
- dies gesetzlich zulässig und nach Art. 6 Abs. 1 lit. b DSGVO für die Abwicklung von Vertragsverhältnissen mit Ihnen erforderlich ist.

**Typische Empfänger-Kategorien sind:**
- IT-Dienstleister (Hosting, Wartung, Support) — mit Auftragsverarbeitungsvertrag nach Art. 28 DSGVO
- Steuerberater / Wirtschaftsprüfer — gesetzliche Aufbewahrungspflichten nach § 147 AO / § 257 HGB (eigener Verantwortlicher, kein AV)
- Strafverfolgungs- oder Aufsichtsbehörden — bei berechtigter behördlicher Anfrage
- Versanddienstleister, Zahlungsanbieter, Bewertungssysteme (siehe jeweilige Abschnitte)
- Sub-Auftragsverarbeiter unserer Dienstleister (im Rahmen der jeweiligen AV-Verträge)`;

// ─────────────────────────────────────────────────────────────────────────────
// HIGH FIX #4: Art. 14 DSGVO — Datenherkunft bei Dritt-Erhebung
// ─────────────────────────────────────────────────────────────────────────────

export const ART_14_HINWEIS_BONITAET = `**Datenherkunft (Art. 14 DSGVO):** Die Bonitätsdaten erhalten wir direkt von der/den genannten Auskunftei(en). Sie haben das Recht auf Auskunft über die Herkunft der Daten, deren Empfänger sowie über die Existenz einer automatisierten Entscheidungsfindung.`;

// ─────────────────────────────────────────────────────────────────────────────
// HIGH FIX #9: AI Act Touchpoint-Warnung
// ─────────────────────────────────────────────────────────────────────────────

export const AI_ACT_TOUCHPOINT_WARNING = `**Wichtiger Hinweis zur Erfüllung der Transparenzpflicht (Art. 50 AI Act):** Dieser Datenschutzhinweis allein erfüllt die Transparenzpflicht nach Art. 50 AI Act NICHT. Als Betreiber des KI-Chatbots müssen Sie zusätzlich am Chatbot-Touchpoint einen unmittelbar sichtbaren Hinweis platzieren (z.B. "Ich bin ein KI-Assistent"), bevor die Konversation beginnt.`;

// ─────────────────────────────────────────────────────────────────────────────
// HIGH FIX #17: Joint Controller — Wesentliche Inhalte nach Art. 26 Abs. 2
// ─────────────────────────────────────────────────────────────────────────────

export const JOINT_CONTROLLER_WESENTLICHES = `## Wesentliche Inhalte der Joint-Controller-Vereinbarung (Art. 26 Abs. 2 DSGVO)

- **Zwecke und Mittel der Datenerhebung auf unserer Webseite:** Wir entscheiden.
- **Weitere Verarbeitung beim Plattform-Anbieter:** Der jeweilige Anbieter (z.B. Meta) entscheidet eigenständig.
- **Wahrnehmung Ihrer Rechte:** Sie können Auskunft, Berichtigung, Löschung sowohl bei uns als auch beim Plattform-Anbieter geltend machen. Die einfachere Bearbeitung erfolgt oft direkt beim Plattform-Anbieter, da dieser die Daten technisch verwaltet.
- **Bereitstellung der Informationen nach Art. 13/14 DSGVO:** Der Plattform-Anbieter stellt Ihnen die nötigen Datenschutzinformationen in seinem Hilfebereich zur Verfügung.
- **Verantwortung für Sicherheit:** Der Plattform-Anbieter trägt die Verantwortung für die Sicherheit der Daten in seinem System.
- **Meldung von Datenschutzverletzungen:** Beide Parteien informieren einander unverzüglich bei Vorfällen, die die gemeinsam verarbeiteten Daten betreffen.`;

// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL FIX #19: DSFA-Pflicht-Hinweis (Art. 35 DSGVO)
// ─────────────────────────────────────────────────────────────────────────────

export const DSFA_PFLICHT_HINWEIS = `## Datenschutz-Folgenabschätzung (Art. 35 DSGVO)

Aufgrund der Kombination der von uns durchgeführten Verarbeitungen (insbesondere automatisierte Entscheidungen mit Rechtswirkung, Profiling und/oder Verarbeitung besonderer Datenkategorien im großen Umfang) haben wir gemäß Art. 35 DSGVO eine **Datenschutz-Folgenabschätzung** durchgeführt. Diese ist intern dokumentiert und kann auf Anfrage in Auszügen eingesehen werden.`;

// ─────────────────────────────────────────────────────────────────────────────
// Sprint C — Audit 6/7 (2026-06-17)
// ─────────────────────────────────────────────────────────────────────────────

// H1: Kern-Verarbeitung der Bestellung (Vertragsabwicklung) — fehlte komplett
export const BESTELLUNG_KLAUSEL = `## Bestellung und Vertragsabwicklung

Wenn Sie bei uns eine Bestellung aufgeben, verarbeiten wir Ihre Daten zur Durchführung des Kaufvertrags (Bearbeitung der Bestellung, Lieferung, Rechnungsstellung, Bearbeitung von Widerruf und Gewährleistung).

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie für die Aufbewahrung Art. 6 Abs. 1 lit. c DSGVO (gesetzliche Aufbewahrungspflicht).

**Speicherdauer:** Rechnungs- und Buchungsdaten werden aufgrund handels- und steuerrechtlicher Pflichten 10 Jahre aufbewahrt (§ 147 AO, § 257 HGB). Nach Ablauf der Aufbewahrungsfristen werden die Daten gelöscht.`;

// H2: Bestandskundenwerbung per E-Mail ohne separate Einwilligung
export const NEWSLETTER_BESTANDSKUNDEN_HINWEIS = `**Werbung an Bestandskunden (§ 7 Abs. 3 UWG):** Haben Sie bei uns eine Ware oder Dienstleistung erworben und dabei Ihre E-Mail-Adresse angegeben, können wir Ihnen auch ohne gesonderte Einwilligung E-Mail-Werbung für eigene, ähnliche Produkte senden. Dies stützt sich auf unser berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO i.V.m. § 7 Abs. 3 UWG). Sie können dieser Nutzung jederzeit widersprechen, ohne dass hierfür andere als die Übermittlungskosten nach den Basistarifen entstehen — sowohl bei Erhebung der Adresse als auch in jeder einzelnen Nachricht (Abmelde-Link).`;

// H3: Besondere Kategorien (Art. 9) — allgemeine Klausel, wenn keine Branchen-Klausel greift
export const ART9_ALLGEMEIN_KLAUSEL = `## Verarbeitung besonderer Kategorien personenbezogener Daten (Art. 9 DSGVO)

Im Rahmen unserer Tätigkeit verarbeiten wir besondere Kategorien personenbezogener Daten nach Art. 9 Abs. 1 DSGVO (z.B. Gesundheitsdaten, Daten zu religiöser/weltanschaulicher Überzeugung, Gewerkschaftszugehörigkeit oder Sexualleben).

**Rechtsgrundlage:** Die Verarbeitung erfolgt nur, wenn eine der Voraussetzungen des Art. 9 Abs. 2 DSGVO vorliegt — insbesondere Ihre ausdrückliche Einwilligung (lit. a) oder eine gesetzliche Grundlage (lit. b–j i.V.m. § 22 BDSG).

**Schutzmaßnahmen:** Für diese Daten gelten erhöhte technische und organisatorische Schutzmaßnahmen (Zugriffsbeschränkung, Verschlüsselung, gesonderte Protokollierung). Eine Weitergabe erfolgt nur, soweit gesetzlich erlaubt oder von Ihnen ausdrücklich eingewilligt.`;

// M3: Art. 13 Abs. 2 lit. e — Pflicht zur Bereitstellung + Folgen der Nichtbereitstellung
export const BEREITSTELLUNGSPFLICHT_HINWEIS = `## Erforderlichkeit der Bereitstellung

Die Bereitstellung Ihrer personenbezogenen Daten ist weder gesetzlich noch vertraglich generell vorgeschrieben. Für den Abschluss und die Durchführung eines Vertrags mit uns sind jedoch bestimmte Daten erforderlich (z.B. Name, Kontakt- und ggf. Zahlungsdaten). Ohne diese Daten können wir den Vertrag nicht abschließen oder erfüllen. In gesetzlich geregelten Fällen (z.B. steuer- oder meldepflichtige Vorgänge) kann zusätzlich eine gesetzliche Bereitstellungspflicht bestehen. Soweit Daten freiwillig sind, weisen wir Sie an der jeweiligen Erhebungsstelle darauf hin.`;

// M4: Treueprogramm + BNPL
export const TREUEPROGRAMM_KLAUSEL = `## Kundenbindungs-/Treueprogramm

Wenn Sie an unserem Treue- oder Bonusprogramm teilnehmen, verarbeiten wir Ihre Stammdaten sowie Ihre Kauf- und Punktehistorie, um Prämien, Rabatte und personalisierte Vorteile bereitzustellen. Dabei kann eine Auswertung Ihres Kaufverhaltens (Profiling) stattfinden.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Durchführung des Teilnahmeverhältnisses) bzw. Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) für die personalisierte Auswertung.

**Speicherdauer:** für die Dauer Ihrer Teilnahme; nach Beendigung Löschung vorbehaltlich gesetzlicher Aufbewahrungsfristen.`;

export const BNPL_KLAUSEL = `## "Buy Now, Pay Later" (Kauf auf Rechnung / Ratenzahlung)

Bei Wahl einer "Buy Now, Pay Later"-Zahlungsart (spätere Zahlung oder Ratenkauf) übermitteln wir die für die Zahlungsabwicklung erforderlichen Daten an den jeweiligen Zahlungsdienstleister. Dieser führt in der Regel eine eigene Bonitätsprüfung durch und ist hierfür datenschutzrechtlich eigenständig verantwortlich; es gelten zusätzlich dessen Datenschutzhinweise.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Absicherung des Zahlungsausfallrisikos).`;

// L1: Server-Side-Tracking
export const SERVER_SIDE_TRACKING_HINWEIS = `## Serverseitiges Tracking (Server-Side Tagging)

Wir setzen serverseitiges Tracking (z.B. über einen Server-Side Google Tag Manager) ein. Dabei werden Messdaten nicht direkt aus Ihrem Browser an die Tool-Anbieter gesendet, sondern zunächst über unseren eigenen Server geleitet. Dies ermöglicht uns, übertragene Daten zu kontrollieren und zu minimieren. Die Einwilligungspflicht nach § 25 Abs. 1 TDDDG bleibt hiervon unberührt: Auch beim serverseitigen Tracking holen wir Ihre Einwilligung über unser Cookie-Banner ein, soweit erforderlich.

**Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) i.V.m. § 25 Abs. 1 TDDDG.`;

// L3: AI Act Art. 50 Abs. 2 — Kennzeichnung KI-generierter Inhalte
export const AI_ACT_CONTENT_HINWEIS = `**Hinweis zu KI-generierten Inhalten (Art. 50 Abs. 2 AI Act):** Soweit auf dieser Webseite künstlich erzeugte oder bearbeitete Bilder, Audio- oder Videoinhalte ("synthetische Inhalte") eingesetzt werden, sind diese als KI-generiert gekennzeichnet. Die Pflicht zur maschinenlesbaren Kennzeichnung gilt ab dem 02.08.2026.`;
