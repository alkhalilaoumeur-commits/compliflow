import type { Datenkategorie, Personenkategorie, Tom, TomKategorie } from "./types";

export const STANDARD_DATENKATEGORIEN: Datenkategorie[] = [
  { id: "kontakt", label: "Kontaktdaten", beispiele: ["Name", "E-Mail", "Telefon", "Anschrift"] },
  { id: "vertrag", label: "Vertragsdaten", beispiele: ["Bestellnummer", "Vertragsinhalt", "Laufzeit"] },
  { id: "zahlung", label: "Zahlungsdaten", beispiele: ["IBAN", "Kreditkarte (tokenisiert)", "Rechnungsadresse"] },
  { id: "nutzung", label: "Nutzungsdaten", beispiele: ["Login-Zeit", "Klicks", "Sitzungsdauer"] },
  { id: "stamm", label: "Stammdaten", beispiele: ["Geburtsdatum", "Geschlecht", "Sprache"] },
  { id: "kommunikation", label: "Kommunikationsdaten", beispiele: ["Nachrichten", "Support-Tickets"] },
  { id: "standort", label: "Standortdaten", beispiele: ["IP-basiert", "GPS"] },
  { id: "geraet", label: "Gerätedaten", beispiele: ["Browser", "OS", "User-Agent", "Cookie-IDs"] },
  { id: "bewerbung", label: "Bewerbungsdaten", beispiele: ["Lebenslauf", "Anschreiben", "Zeugnisse"] },
  { id: "mitarbeiter", label: "Mitarbeiterdaten", beispiele: ["Personalnummer", "Gehalt", "Zeiterfassung"] },
  { id: "gesundheit", label: "Gesundheitsdaten", beispiele: ["Krankheit", "Behandlungen"], besondereKategorie: true },
  { id: "biometrie", label: "Biometrische Daten", beispiele: ["Fingerabdruck", "Gesichtsscan"], besondereKategorie: true },
];

export const STANDARD_PERSONENKATEGORIEN: Personenkategorie[] = [
  { id: "kunden", label: "Kunden" },
  { id: "interessenten", label: "Interessenten / Leads" },
  { id: "mitarbeiter", label: "Mitarbeiter" },
  { id: "bewerber", label: "Bewerber" },
  { id: "lieferanten", label: "Lieferanten / Geschäftspartner" },
  { id: "newsletter", label: "Newsletter-Abonnenten" },
  { id: "besucher", label: "Website-Besucher" },
  { id: "minderjaehrige", label: "Minderjährige" },
];

type StandardTom = { kategorie: TomKategorie; beschreibung: string };

export const STANDARD_TOMS: StandardTom[] = [
  // Zutrittskontrolle (physischer Zugang)
  { kategorie: "zutritt", beschreibung: "Server in zertifizierten Rechenzentren (ISO 27001)" },
  { kategorie: "zutritt", beschreibung: "Zutritt zu Geschäftsräumen nur für autorisierte Personen" },
  { kategorie: "zutritt", beschreibung: "Schlüsselregelung / Chip-Karten-Zugang" },
  // Zugangskontrolle (System-Zugang)
  { kategorie: "zugang", beschreibung: "Passwortrichtlinie (Mindestlänge, Komplexität, regelmäßiger Wechsel)" },
  { kategorie: "zugang", beschreibung: "Zwei-Faktor-Authentifizierung (2FA) für alle Admin-Konten" },
  { kategorie: "zugang", beschreibung: "Automatischer Logout nach Inaktivität" },
  { kategorie: "zugang", beschreibung: "VPN-Pflicht für Remote-Zugriff" },
  // Zugriffskontrolle (Daten-Zugriff)
  { kategorie: "zugriff", beschreibung: "Rollen- und Rechtekonzept (Least-Privilege-Prinzip)" },
  { kategorie: "zugriff", beschreibung: "Verschlüsselung von Datenträgern (Full-Disk-Encryption)" },
  { kategorie: "zugriff", beschreibung: "Protokollierung von Datenzugriffen (Audit-Logs)" },
  // Weitergabekontrolle (Übermittlung)
  { kategorie: "weitergabe", beschreibung: "Transportverschlüsselung (TLS 1.2+) bei allen Datenübertragungen" },
  { kategorie: "weitergabe", beschreibung: "End-to-End-Verschlüsselung bei sensiblen Daten" },
  { kategorie: "weitergabe", beschreibung: "Sichere Datenträgerentsorgung (Schredder, Wipe-Standards)" },
  // Eingabekontrolle (Nachvollziehbarkeit)
  { kategorie: "eingabe", beschreibung: "Vollständige Protokollierung von Eingaben, Änderungen und Löschungen" },
  { kategorie: "eingabe", beschreibung: "Versionierung kritischer Datensätze" },
  // Auftragskontrolle (Subverarbeiter)
  { kategorie: "auftrag", beschreibung: "Schriftliche AVVs mit allen Subverarbeitern" },
  { kategorie: "auftrag", beschreibung: "Regelmäßige Überprüfung der Subverarbeiter (mind. jährlich)" },
  { kategorie: "auftrag", beschreibung: "Klare Weisungsdokumentation" },
  // Verfügbarkeitskontrolle
  { kategorie: "verfuegbarkeit", beschreibung: "Tägliche verschlüsselte Backups (Offsite)" },
  { kategorie: "verfuegbarkeit", beschreibung: "Disaster-Recovery-Plan dokumentiert und getestet" },
  { kategorie: "verfuegbarkeit", beschreibung: "Redundante Systeme (Failover)" },
  { kategorie: "verfuegbarkeit", beschreibung: "USV / Notstromversorgung im Rechenzentrum" },
  // Trennungskontrolle (Mandantenfähigkeit)
  { kategorie: "trennung", beschreibung: "Logische Mandantentrennung in der Datenbank" },
  { kategorie: "trennung", beschreibung: "Getrennte Test- und Produktivsysteme" },
];

export const TOM_KATEGORIE_LABELS: Record<TomKategorie, { label: string; beschreibung: string }> = {
  zutritt: { label: "Zutrittskontrolle", beschreibung: "Schutz vor unbefugtem physischen Zutritt zu Verarbeitungsanlagen" },
  zugang: { label: "Zugangskontrolle", beschreibung: "Verhinderung unbefugter Systemnutzung" },
  zugriff: { label: "Zugriffskontrolle", beschreibung: "Sicherstellung dass nur Berechtigte Zugriff auf zugewiesene Daten haben" },
  weitergabe: { label: "Weitergabekontrolle", beschreibung: "Schutz personenbezogener Daten bei Übertragung" },
  eingabe: { label: "Eingabekontrolle", beschreibung: "Nachvollziehbarkeit, wer Daten wann eingegeben/geändert hat" },
  auftrag: { label: "Auftragskontrolle", beschreibung: "Sicherstellung dass Auftragsverarbeitung nach Weisung erfolgt" },
  verfuegbarkeit: { label: "Verfügbarkeitskontrolle", beschreibung: "Schutz vor zufälliger Zerstörung oder Verlust" },
  trennung: { label: "Trennungskontrolle", beschreibung: "Getrennte Verarbeitung von Daten unterschiedlicher Zwecke" },
};

export const DRITTLAND_TOP20 = [
  // EU/EWR — immer ohne Schrems-II-Problematik
  { code: "DE", land: "Deutschland", inEU: true },
  { code: "AT", land: "Österreich", inEU: true },
  { code: "IE", land: "Irland", inEU: true },
  { code: "LU", land: "Luxemburg", inEU: true },
  { code: "EE", land: "Estland", inEU: true },
  { code: "FR", land: "Frankreich", inEU: true },
  { code: "NL", land: "Niederlande", inEU: true },
  { code: "SE", land: "Schweden", inEU: true },
  { code: "FI", land: "Finnland", inEU: true },
  // Angemessenheitsbeschluss — Art. 45 DSGVO
  { code: "CH", land: "Schweiz", angemessenheit: true },
  { code: "GB", land: "Vereinigtes Königreich", angemessenheit: true },
  { code: "CA", land: "Kanada", angemessenheit: true },
  { code: "JP", land: "Japan", angemessenheit: true },
  { code: "KR", land: "Südkorea", angemessenheit: true },
  { code: "IL", land: "Israel", angemessenheit: true },
  // Drittland — Schrems-II-Zusatzmaßnahmen erforderlich
  { code: "US", land: "USA", schremsII: true },
  { code: "IN", land: "Indien", schremsII: true },
  { code: "BR", land: "Brasilien", schremsII: true },
  { code: "AU", land: "Australien", schremsII: true },
  { code: "SG", land: "Singapur", schremsII: true },
  { code: "ZA", land: "Südafrika", schremsII: true },
  { code: "CN", land: "China", schremsII: true },
  { code: "RU", land: "Russland", schremsII: true },
];

export const QUICK_SUBVERARBEITER = [
  { firma: "Stripe Payments Europe Ltd.", anschrift: "Dublin, Irland", land: "IE", zweck: "Zahlungsabwicklung" },
  { firma: "Vercel Inc.", anschrift: "San Francisco, USA", land: "US", zweck: "Hosting / CDN" },
  { firma: "Amazon Web Services EMEA SARL", anschrift: "Luxemburg", land: "LU", zweck: "Cloud-Infrastruktur" },
  { firma: "Google Ireland Ltd.", anschrift: "Dublin, Irland", land: "IE", zweck: "Workspace / Analytics" },
  { firma: "Microsoft Ireland Operations Ltd.", anschrift: "Dublin, Irland", land: "IE", zweck: "Cloud-Dienste" },
  { firma: "Supabase Inc.", anschrift: "San Francisco, USA", land: "US", zweck: "Datenbank / Auth" },
  { firma: "Resend Inc.", anschrift: "San Francisco, USA", land: "US", zweck: "Transaktions-E-Mails" },
  { firma: "Mailchimp / Intuit Inc.", anschrift: "Atlanta, USA", land: "US", zweck: "Newsletter-Versand" },
  { firma: "Hetzner Online GmbH", anschrift: "Gunzenhausen, Deutschland", land: "DE", zweck: "Hosting" },
  { firma: "Plausible Insights OÜ", anschrift: "Tallinn, Estland", land: "EE", zweck: "Web-Analytics" },
  { firma: "Zoom Video Communications, Inc.", anschrift: "San Jose, USA", land: "US", zweck: "Video-Konferenzen" },
  { firma: "Sendinblue SAS (Brevo)", anschrift: "Paris, Frankreich", land: "FR", zweck: "Newsletter-Versand" },
  { firma: "Cloudflare, Inc.", anschrift: "San Francisco, USA", land: "US", zweck: "CDN / DDoS-Schutz" },
  { firma: "Notion Labs, Inc.", anschrift: "San Francisco, USA", land: "US", zweck: "Projektmanagement / Dokumentation" },
  { firma: "Haufe-Lexware GmbH & Co. KG (Lexoffice)", anschrift: "Freiburg, Deutschland", land: "DE", zweck: "Buchhaltung / Rechnungen" },
];
