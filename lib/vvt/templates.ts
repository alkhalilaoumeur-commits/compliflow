import type { Verarbeitungstaetigkeit } from "./types";

let _counter = 1;
const uid = () => `t-${Date.now()}-${_counter++}`;

export type TemplateEntry = {
  id: string;
  bezeichnung: string;
  branche?: string;
  activity: Omit<Verarbeitungstaetigkeit, "id">;
};

export const VVT_TEMPLATES: TemplateEntry[] = [
  {
    id: "kundenverwaltung",
    bezeichnung: "Kundenverwaltung / CRM",
    activity: {
      bezeichnung: "Kundenverwaltung / CRM",
      zweck: "Verwaltung von Kundenstammdaten, Kommunikation und Vertragsabwicklung zur Erfüllung bestehender Verträge",
      rechtsgrundlagen: ["art6-1b"],
      betroffenengruppen: ["Kunden / Auftraggeber"],
      datenkategorien: [
        "Kontaktdaten (Name, Adresse, E-Mail, Telefon)",
        "Vertragsdaten (Bestellungen, Rechnungen, Verträge)",
        "Kommunikationsdaten (E-Mails, Chat-Verläufe)",
      ],
      besondereKategorien: false,
      empfaenger: [
        {
          id: uid(),
          name: "CRM-Software (z.B. HubSpot, Salesforce)",
          kategorie: "IT-Dienstleister / Hosting",
          istAuftragsverarbeiter: true,
          land: "USA / EU",
          avvVorhanden: false,
        },
      ],
      drittlandGarantie: "standardvertragsklauseln",
      loeschfristen: "Vertragsdaten: 10 Jahre (§ 257 HGB, § 147 AO). Kontaktdaten nach Vertragsende: 3 Jahre (§ 195 BGB). Nicht konvertierte Interessenten: 3 Jahre nach letztem Kontakt.",
      toms: "Zugriff nur für berechtigte Mitarbeiter (rollenbasiert). Verschlüsselte Übertragung (TLS). Passwortschutz mit 2FA. Regelmäßige Datensicherung.",
    },
  },
  {
    id: "buchhaltung",
    bezeichnung: "Buchhaltung / Rechnungsstellung",
    activity: {
      bezeichnung: "Buchhaltung und Rechnungsstellung",
      zweck: "Steuerrechtliche und handelsrechtliche Dokumentation von Geschäftsvorfällen, Rechnungsstellung, Mahnwesen",
      rechtsgrundlagen: ["art6-1b", "art6-1c"],
      betroffenengruppen: ["Kunden / Auftraggeber", "Lieferanten / Auftragnehmer"],
      datenkategorien: [
        "Kontaktdaten (Name, Adresse, E-Mail, Telefon)",
        "Vertragsdaten (Bestellungen, Rechnungen, Verträge)",
        "Zahlungsdaten (Bankverbindung, Zahlungshistorie)",
        "Identifikationsdaten (Geburtsdatum, Personalausweis)",
      ],
      besondereKategorien: false,
      empfaenger: [
        {
          id: uid(),
          name: "Steuerberater",
          kategorie: "Steuerberater / Buchhalter",
          istAuftragsverarbeiter: false,
          land: "Deutschland",
          avvVorhanden: false,
        },
        {
          id: uid(),
          name: "Buchhaltungssoftware (z.B. DATEV, Lexoffice)",
          kategorie: "IT-Dienstleister / Hosting",
          istAuftragsverarbeiter: true,
          land: "Deutschland",
          avvVorhanden: false,
        },
      ],
      drittlandGarantie: "keine-uebermittlung",
      loeschfristen: "Buchungsbelege, Rechnungen: 10 Jahre (§ 257 Abs. 1 HGB, § 147 Abs. 1 AO). Mahnkorrespondenz: 3 Jahre nach Abschluss.",
      toms: "Buchungsdaten nur für Buchhalter/Steuerberater zugänglich. Dateiserver mit Zugriffsrechten. Verschlüsselte Übertragung an Steuerberater. Jährliche Datensicherung.",
    },
  },
  {
    id: "mitarbeiterverwaltung",
    bezeichnung: "Mitarbeiterverwaltung / HR",
    activity: {
      bezeichnung: "Personalverwaltung und Lohnabrechnung",
      zweck: "Begründung, Durchführung und Beendigung von Beschäftigungsverhältnissen; Lohn- und Gehaltsabrechnung; gesetzliche Meldepflichten",
      rechtsgrundlagen: ["art88", "art6-1c"],
      betroffenengruppen: ["Mitarbeiter / Beschäftigte"],
      datenkategorien: [
        "Kontaktdaten (Name, Adresse, E-Mail, Telefon)",
        "Identifikationsdaten (Geburtsdatum, Personalausweis)",
        "Beschäftigungsdaten (Gehalt, Arbeitszeiten, Urlaub)",
        "Zahlungsdaten (Bankverbindung, Zahlungshistorie)",
      ],
      besondereKategorien: false,
      empfaenger: [
        {
          id: uid(),
          name: "Lohnbuchhaltung / Steuerberater",
          kategorie: "Steuerberater / Buchhalter",
          istAuftragsverarbeiter: false,
          land: "Deutschland",
          avvVorhanden: false,
        },
        {
          id: uid(),
          name: "Krankenversicherung / BG",
          kategorie: "Sozialversicherungsträger",
          istAuftragsverarbeiter: false,
          land: "Deutschland",
          avvVorhanden: false,
        },
        {
          id: uid(),
          name: "Finanzamt",
          kategorie: "Behörden / Finanzamt",
          istAuftragsverarbeiter: false,
          land: "Deutschland",
          avvVorhanden: false,
        },
      ],
      drittlandGarantie: "keine-uebermittlung",
      loeschfristen: "Entgeltunterlagen: 6 Jahre (§ 257 HGB). Lohnsteuerunterlagen: 6 Jahre (§ 41 EStG). Personalakten nach Ausscheiden: 3 Jahre allgemein, ggf. länger nach Einzelfall.",
      toms: "HR-Daten nur für HR-Personal zugänglich. Passwortgeschütztes HR-System. Physische Unterlagen in abschließbaren Schränken. Vertraulichkeitsverpflichtung für Personalverantwortliche.",
    },
  },
  {
    id: "newsletter",
    bezeichnung: "E-Mail-Marketing / Newsletter",
    activity: {
      bezeichnung: "Newsletter und E-Mail-Marketing",
      zweck: "Information von Interessenten und Kunden über Neuigkeiten, Angebote und Dienstleistungen per E-Mail nach ausdrücklicher Einwilligung (Double-Opt-In)",
      rechtsgrundlagen: ["art6-1a"],
      betroffenengruppen: ["Kunden / Auftraggeber", "Interessenten / Leads"],
      datenkategorien: [
        "Kontaktdaten (Name, Adresse, E-Mail, Telefon)",
        "Nutzungsdaten (IP-Adresse, Browser, Logfiles)",
        "Profilierungsdaten (Kaufverhalten, Interessen)",
      ],
      besondereKategorien: false,
      empfaenger: [
        {
          id: uid(),
          name: "E-Mail-Versanddienstleister (z.B. Mailchimp, Brevo)",
          kategorie: "E-Mail-Dienstleister",
          istAuftragsverarbeiter: true,
          land: "USA / EU",
          avvVorhanden: false,
        },
      ],
      drittlandGarantie: "standardvertragsklauseln",
      loeschfristen: "Newsletter-Kontakte: Bis Widerruf der Einwilligung, danach sofortige Löschung. Widerrufsnachweis: 3 Jahre nach Widerruf.",
      toms: "Double-Opt-In-Verfahren mit Nachweis. Einfache Abmeldemöglichkeit in jeder Mail. AVV mit E-Mail-Dienstleister. Keine Weitergabe der Adressen an Dritte.",
    },
  },
  {
    id: "website-betrieb",
    bezeichnung: "Website-Betrieb / Webhosting",
    activity: {
      bezeichnung: "Betrieb und Sicherung der Website",
      zweck: "Bereitstellung der Unternehmenswebsite, Sicherstellung der IT-Sicherheit (Abwehr von Angriffen), Fehleranalyse und Serverstatistiken",
      rechtsgrundlagen: ["art6-1f"],
      berechtigtesInteresseDetail: "Berechtigtes Interesse an IT-Sicherheit und fehlerfreiem Betrieb der Website (Erwägungsgrund 49 DSGVO)",
      betroffenengruppen: ["Websitebesucher"],
      datenkategorien: [
        "Nutzungsdaten (IP-Adresse, Browser, Logfiles)",
      ],
      besondereKategorien: false,
      empfaenger: [
        {
          id: uid(),
          name: "Hosting-Anbieter (z.B. Hetzner, STRATO)",
          kategorie: "IT-Dienstleister / Hosting",
          istAuftragsverarbeiter: true,
          land: "Deutschland",
          avvVorhanden: false,
        },
      ],
      drittlandGarantie: "keine-uebermittlung",
      loeschfristen: "Server-Logfiles: 7 Tage nach automatischer Rotation. Keine Personenprofile aus Logdaten.",
      toms: "Hosting in Deutschland (DSGVO-konform). Automatische Löschung der Logfiles. HTTPS/TLS-Verschlüsselung. Regelmäßige Sicherheitsupdates des Webservers.",
    },
  },
  {
    id: "kontaktformular",
    bezeichnung: "Kontaktaufnahme / Anfragen",
    activity: {
      bezeichnung: "Kontaktformular und Kundenanfragen",
      zweck: "Bearbeitung von Anfragen, Angebotserstellung und Kommunikation mit Interessenten und Kunden",
      rechtsgrundlagen: ["art6-1b", "art6-1f"],
      berechtigtesInteresseDetail: "Berechtigtes Interesse an der Beantwortung von Anfragen potenzieller Kunden",
      betroffenengruppen: ["Interessenten / Leads", "Kunden / Auftraggeber"],
      datenkategorien: [
        "Kontaktdaten (Name, Adresse, E-Mail, Telefon)",
        "Kommunikationsdaten (E-Mails, Chat-Verläufe)",
      ],
      besondereKategorien: false,
      empfaenger: [
        {
          id: uid(),
          name: "E-Mail-Anbieter (für Empfang der Anfragen)",
          kategorie: "E-Mail-Dienstleister",
          istAuftragsverarbeiter: true,
          land: "Deutschland / EU",
          avvVorhanden: false,
        },
      ],
      drittlandGarantie: "eu-ewr",
      loeschfristen: "Anfragen ohne Vertragsschluss: 3 Monate nach Abschluss der Kommunikation. Bei Vertragsschluss: Übergang in Kundenverwaltung.",
      toms: "Vertrauliche Behandlung aller Anfragen. HTTPS-Übertragung des Kontaktformulars. Spam-Schutz (CAPTCHA). Kein Einsatz von Tracking bei der Formular-Übermittlung.",
    },
  },
  {
    id: "bewerbermanagement",
    bezeichnung: "Bewerbermanagement / Recruiting",
    activity: {
      bezeichnung: "Bewerbermanagement",
      zweck: "Durchführung von Bewerbungsverfahren zur Besetzung offener Stellen",
      rechtsgrundlagen: ["art88", "art6-1b"],
      betroffenengruppen: ["Bewerber"],
      datenkategorien: [
        "Kontaktdaten (Name, Adresse, E-Mail, Telefon)",
        "Identifikationsdaten (Geburtsdatum, Personalausweis)",
        "Bewerbungsunterlagen (Lebenslauf, Zeugnisse)",
        "Kommunikationsdaten (E-Mails, Chat-Verläufe)",
      ],
      besondereKategorien: false,
      empfaenger: [
        {
          id: uid(),
          name: "HR-Software / Bewerbermanagementsystem",
          kategorie: "IT-Dienstleister / Hosting",
          istAuftragsverarbeiter: true,
          land: "Deutschland / EU",
          avvVorhanden: false,
        },
      ],
      drittlandGarantie: "keine-uebermittlung",
      loeschfristen: "Abgelehnte Bewerber: 6 Monate nach Absage (AGG-Frist). Mit Einwilligung zur Datei: bis zu 12 Monate. Eingestellte Bewerber: Übergang in Personalakte.",
      toms: "Bewerberdaten nur für Personalverantwortliche einsehbar. Rollenbasierter Zugriff. Gesonderte Ablage von Bewerberdaten. Löschkonzept mit automatischer Erinnerung.",
    },
  },
  {
    id: "videoüberwachung",
    bezeichnung: "Videoüberwachung",
    activity: {
      bezeichnung: "Videoüberwachung der Geschäftsräume",
      zweck: "Schutz vor Einbruch, Diebstahl und Sachbeschädigung; Wahrung des Hausrechts in öffentlich zugänglichen Bereichen",
      rechtsgrundlagen: ["art6-1f"],
      berechtigtesInteresseDetail: "Berechtigtes Interesse am Schutz des Eigentums und der Sicherheit der Beschäftigten (§ 4 BDSG)",
      betroffenengruppen: ["Kunden / Auftraggeber", "Mitarbeiter / Beschäftigte"],
      datenkategorien: [
        "Fotografie / Videoaufnahmen",
      ],
      besondereKategorien: false,
      empfaenger: [
        {
          id: uid(),
          name: "Sicherheitsdienst (ggf.)",
          kategorie: "IT-Dienstleister / Hosting",
          istAuftragsverarbeiter: false,
          land: "Deutschland",
          avvVorhanden: false,
        },
      ],
      drittlandGarantie: "keine-uebermittlung",
      loeschfristen: "Videoaufzeichnungen: 72 Stunden, dann automatische Überschreibung. Bei Vorfällen: Sicherung bis zur Klärung, max. 10 Tage.",
      toms: "Hinweisschilder vor dem überwachten Bereich (§ 4 BDSG). Zugriff nur für berechtigte Personen. Verschlüsselter Speicher. Strikte Zweckbindung (keine Verhaltenskontrolle). Datenschutz-Folgenabschätzung erfolgt.",
    },
  },
  {
    id: "lieferantenverwaltung",
    bezeichnung: "Lieferanten- und Partnerverwaltung",
    activity: {
      bezeichnung: "Lieferanten- und Dienstleisterverwaltung",
      zweck: "Verwaltung von Lieferanten- und Partnerbeziehungen, Einkauf, Vertragsmanagement",
      rechtsgrundlagen: ["art6-1b"],
      betroffenengruppen: ["Lieferanten / Auftragnehmer", "Geschäftspartner"],
      datenkategorien: [
        "Kontaktdaten (Name, Adresse, E-Mail, Telefon)",
        "Vertragsdaten (Bestellungen, Rechnungen, Verträge)",
        "Zahlungsdaten (Bankverbindung, Zahlungshistorie)",
      ],
      besondereKategorien: false,
      empfaenger: [
        {
          id: uid(),
          name: "ERP-System / Warenwirtschaft",
          kategorie: "IT-Dienstleister / Hosting",
          istAuftragsverarbeiter: true,
          land: "Deutschland / EU",
          avvVorhanden: false,
        },
      ],
      drittlandGarantie: "keine-uebermittlung",
      loeschfristen: "Lieferantenstammdaten nach Vertragsende: 10 Jahre (§ 257 HGB). Rechnungsbelege: 10 Jahre (§ 147 AO).",
      toms: "Lieferantendaten nur für Einkaufs-/Buchhaltungsabteilung. Zugriff über rollenbasiertes ERP-System. TLS-Verschlüsselung.",
    },
  },
  {
    id: "webanalytics",
    bezeichnung: "Web-Analytics / Website-Statistiken",
    activity: {
      bezeichnung: "Anonyme Website-Statistiken (Plausible / Matomo)",
      zweck: "Verbesserung des Website-Angebots durch anonyme Nutzungsstatistiken; Analyse von Zugriffszahlen und populären Inhalten",
      rechtsgrundlagen: ["art6-1f"],
      berechtigtesInteresseDetail: "Berechtigtes Interesse an der Verbesserung des Webangebots durch cookiefreie, anonyme Statistiken ohne Erstellung von Nutzerprofilen",
      betroffenengruppen: ["Websitebesucher"],
      datenkategorien: [
        "Nutzungsdaten (IP-Adresse, Browser, Logfiles)",
      ],
      besondereKategorien: false,
      empfaenger: [
        {
          id: uid(),
          name: "Plausible Analytics / Matomo (selbst gehostet oder EU-Cloud)",
          kategorie: "IT-Dienstleister / Hosting",
          istAuftragsverarbeiter: true,
          land: "EU / Estland",
          avvVorhanden: false,
        },
      ],
      drittlandGarantie: "eu-ewr",
      loeschfristen: "Aggregierte Statistiken: keine Löschfrist (nicht personenbezogen nach Anonymisierung). IP-Adressen werden nicht gespeichert.",
      toms: "Cookiefreies Tracking. IP-Anonymisierung. Keine Weitergabe an Werbenetze. Kein Cross-Site-Tracking. Datenverarbeitung in der EU.",
    },
  },
];

export function getTemplateById(id: string): TemplateEntry | undefined {
  return VVT_TEMPLATES.find((t) => t.id === id);
}

export function createActivityFromTemplate(templateId: string): Verarbeitungstaetigkeit {
  const template = getTemplateById(templateId);
  if (!template) throw new Error(`Template ${templateId} not found`);
  return {
    ...template.activity,
    id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    empfaenger: template.activity.empfaenger.map((e) => ({
      ...e,
      id: `emp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    })),
  };
}

export function createBlankActivity(): Verarbeitungstaetigkeit {
  return {
    id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    bezeichnung: "",
    zweck: "",
    rechtsgrundlagen: [],
    betroffenengruppen: [],
    datenkategorien: [],
    besondereKategorien: false,
    empfaenger: [],
    drittlandGarantie: "keine-uebermittlung",
    loeschfristen: "",
    toms: "",
  };
}
