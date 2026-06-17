/**
 * Impressum-Defaults
 * Branchen-Templates für reglementierte Berufe + Aufsichtsbehörden
 */

import type { Rechtsform, ImpressumData } from "./types";

const todayIso = () => new Date().toISOString().split("T")[0];

export const INITIAL_IMPRESSUM: ImpressumData = {
  schemaVersion: 1,
  rechtsform: "einzelunternehmer",
  firma: "",
  vorname: "",
  nachname: "",
  adresse: {
    strasse: "",
    plz: "",
    ort: "",
    land: "DE",
  },
  kontakt: {
    email: "",
    telefon: "",
  },
  vertretung: [],
  register: {},
  steuer: {
    kleinunternehmer: false,
  },
  beruf: {
    aktiv: false,
  },
  gewerbeerlaubnis: {
    aktiv: false,
  },
  vereinszusatz: {
    aktiv: false,
  },
  redaktion: {
    aktiv: false,
  },
  vsbg: {
    istB2c: false,
    teilnahme: "nein",
  },
  haftung: {
    haftungInhalte: true,
    haftungLinks: true,
    urheberrecht: true,
  },
  letztAktualisiert: todayIso(),
  erstelltAm: todayIso(),
};

/** Branchen-Templates für reglementierte Berufe — vereinfacht für Selbstständige */
export type BerufVorlage = {
  id: string;
  label: string;
  berufsbezeichnung: string;
  verleihungsstaat: string;
  kammer: { name: string; webseite?: string };
  berufsrechtlicheRegelungen: string;
  zugaenglichUnter?: string;
};

export const BERUF_VORLAGEN: BerufVorlage[] = [
  {
    id: "arzt",
    label: "Arzt / Ärztin",
    berufsbezeichnung: "Arzt / Ärztin",
    verleihungsstaat: "Deutschland",
    kammer: { name: "Zuständige Landesärztekammer", webseite: "https://www.bundesaerztekammer.de" },
    berufsrechtlicheRegelungen: "Bundesärzteordnung, Berufsordnung der zuständigen Landesärztekammer, Heilberufe-Kammergesetz",
    zugaenglichUnter: "https://www.bundesaerztekammer.de/recht",
  },
  {
    id: "zahnarzt",
    label: "Zahnarzt / Zahnärztin",
    berufsbezeichnung: "Zahnarzt / Zahnärztin",
    verleihungsstaat: "Deutschland",
    kammer: { name: "Zuständige Landeszahnärztekammer", webseite: "https://www.bzaek.de" },
    berufsrechtlicheRegelungen: "Zahnheilkundegesetz, Berufsordnung der Landeszahnärztekammer",
    zugaenglichUnter: "https://www.bzaek.de",
  },
  {
    id: "apotheker",
    label: "Apotheker / Apothekerin",
    berufsbezeichnung: "Apotheker / Apothekerin",
    verleihungsstaat: "Deutschland",
    kammer: { name: "Zuständige Landesapothekerkammer", webseite: "https://www.abda.de" },
    berufsrechtlicheRegelungen: "Apothekengesetz, Apothekenbetriebsordnung, Berufsordnung",
    zugaenglichUnter: "https://www.abda.de",
  },
  {
    id: "rechtsanwalt",
    label: "Rechtsanwalt / Rechtsanwältin",
    berufsbezeichnung: "Rechtsanwalt / Rechtsanwältin",
    verleihungsstaat: "Deutschland",
    kammer: { name: "Zuständige Rechtsanwaltskammer", webseite: "https://www.brak.de" },
    berufsrechtlicheRegelungen: "Bundesrechtsanwaltsordnung (BRAO), Berufsordnung (BORA), Fachanwaltsordnung (FAO), Rechtsanwaltsvergütungsgesetz (RVG)",
    zugaenglichUnter: "https://www.brak.de/fuer-anwaelte/berufsrecht",
  },
  {
    id: "steuerberater",
    label: "Steuerberater / Steuerberaterin",
    berufsbezeichnung: "Steuerberater / Steuerberaterin",
    verleihungsstaat: "Deutschland",
    kammer: { name: "Zuständige Steuerberaterkammer", webseite: "https://www.bstbk.de" },
    berufsrechtlicheRegelungen: "Steuerberatungsgesetz (StBerG), Durchführungsverordnung (DVStB), Berufsordnung, Steuerberatervergütungsverordnung (StBVV)",
    zugaenglichUnter: "https://www.bstbk.de",
  },
  {
    id: "architekt",
    label: "Architekt / Architektin",
    berufsbezeichnung: "Architekt / Architektin",
    verleihungsstaat: "Deutschland",
    kammer: { name: "Zuständige Architektenkammer des Bundeslandes", webseite: "https://www.bak.de" },
    berufsrechtlicheRegelungen: "Architektengesetz des Bundeslandes, Berufsordnung der Architektenkammer",
    zugaenglichUnter: "https://www.bak.de",
  },
  {
    id: "wirtschaftspruefer",
    label: "Wirtschaftsprüfer / Wirtschaftsprüferin",
    berufsbezeichnung: "Wirtschaftsprüfer / Wirtschaftsprüferin",
    verleihungsstaat: "Deutschland",
    kammer: { name: "Wirtschaftsprüferkammer", webseite: "https://www.wpk.de" },
    berufsrechtlicheRegelungen: "Wirtschaftsprüferordnung (WPO), Berufssatzung WP/vBP",
    zugaenglichUnter: "https://www.wpk.de",
  },
  {
    id: "handwerker-anlagea",
    label: "Handwerker (Anlage A — zulassungspflichtig)",
    berufsbezeichnung: "Handwerksbetrieb (zulassungspflichtig)",
    verleihungsstaat: "Deutschland",
    kammer: { name: "Zuständige Handwerkskammer", webseite: "https://www.zdh.de" },
    berufsrechtlicheRegelungen: "Handwerksordnung (HwO), insb. Anlage A",
    zugaenglichUnter: "https://www.gesetze-im-internet.de/hwo",
  },
  {
    id: "physiotherapeut",
    label: "Physiotherapeut / Physiotherapeutin",
    berufsbezeichnung: "Physiotherapeut / Physiotherapeutin",
    verleihungsstaat: "Deutschland",
    kammer: { name: "Zuständige Aufsichtsbehörde des Bundeslandes (Gesundheitsamt)" },
    berufsrechtlicheRegelungen: "Masseur- und Physiotherapeutengesetz (MPhG)",
    zugaenglichUnter: "https://www.gesetze-im-internet.de/mphg",
  },
  {
    id: "heilpraktiker",
    label: "Heilpraktiker / Heilpraktikerin",
    berufsbezeichnung: "Heilpraktiker / Heilpraktikerin",
    verleihungsstaat: "Deutschland",
    kammer: { name: "Zuständiges Gesundheitsamt" },
    berufsrechtlicheRegelungen: "Heilpraktikergesetz (HeilprG)",
    zugaenglichUnter: "https://www.gesetze-im-internet.de/heilprg",
  },
];

/** Standardtexte für Haftungsklauseln (DE) */
export const HAFTUNG_TEXTE = {
  haftungInhalte: `Haftung für Inhalte

Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.

Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.`,

  haftungLinks: `Haftung für Links

Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.

Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.`,

  urheberrecht: `Urheberrecht

Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.

Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.`,
};

export const VSBG_TEXTE = {
  nein: `Verbraucherstreitbeilegung / Universalschlichtungsstelle

Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.`,

  freiwillig: `Verbraucherstreitbeilegung / Universalschlichtungsstelle

Wir sind bereit, an einem Streitbeilegungsverfahren vor der Universalschlichtungsstelle des Zentrums für Schlichtung e.V. (Straßburger Straße 8, 77694 Kehl, www.universalschlichtungsstelle.de) teilzunehmen.`,

  verpflichtet: `Verbraucherstreitbeilegung / Universalschlichtungsstelle

Wir sind gesetzlich verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.`,
};

export const OS_PLATTFORM_TEXT = `Online-Streitbeilegung

Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/. Unsere E-Mail-Adresse findest du oben im Impressum.`;

/** Welche Felder werden je Rechtsform gebraucht? */
export function rechtsformConfig(rf: Rechtsform) {
  const conf = {
    needsFirma: false,
    needsVorname: false,
    needsVertretung: false,
    needsStammkapital: false,
    needsRegister: false,
    kannRegister: false,
    juristisch: false,
  };
  switch (rf) {
    case "einzelunternehmer":
      conf.needsVorname = true;
      conf.kannRegister = true; // kann eingetragen sein (e.K.)
      break;
    case "kleinunternehmer":
      conf.needsVorname = true;
      break;
    case "freiberufler":
      conf.needsVorname = true;
      break;
    case "gbr":
      conf.needsFirma = true;
      conf.needsVertretung = true;
      conf.juristisch = true;
      break;
    case "gmbh":
    case "ug":
      conf.needsFirma = true;
      conf.needsVertretung = true;
      conf.needsRegister = true;
      conf.needsStammkapital = true;
      conf.juristisch = true;
      break;
    case "ohg":
    case "kg":
      conf.needsFirma = true;
      conf.needsVertretung = true;
      conf.needsRegister = true;
      conf.juristisch = true;
      break;
    case "ag":
      conf.needsFirma = true;
      conf.needsVertretung = true;
      conf.needsRegister = true;
      conf.needsStammkapital = true;
      conf.juristisch = true;
      break;
    case "ev":
      conf.needsFirma = true;
      conf.needsVertretung = true;
      conf.needsRegister = true;
      conf.juristisch = true;
      break;
    case "stiftung":
      conf.needsFirma = true;
      conf.needsVertretung = true;
      conf.juristisch = true;
      break;
    case "andere":
      conf.needsFirma = true;
      conf.kannRegister = true;
      conf.juristisch = true;
      break;
  }
  return conf;
}
