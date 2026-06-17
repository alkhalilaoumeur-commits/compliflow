/**
 * AGB-Defaults — Initialwerte + Klausel-Bausteine pro Variante
 * Quellen: §§ 305-310, 312d, 312i, 433, 611, 631 BGB + § 377 HGB + Art. 246 EGBGB
 * Stand: 2026-06-16
 *
 * WICHTIG: Diese Klauseln sind Mustertexte, keine Rechtsberatung.
 * Bei Klauseln, die § 308/309 BGB unwirksam machen würden, ist Anwalts-Review zwingend.
 */

import type { AgbData } from "./types";

const todayIso = () => new Date().toISOString().split("T")[0];

// ─────────────────────────────────────────────────────────────────────────────
// Initial-State
// ─────────────────────────────────────────────────────────────────────────────

export const INITIAL_AGB: AgbData = {
  schemaVersion: 2,
  variante: "b2c_dienstleistung",

  anbieter: {
    name: "",
    strasse: "",
    plz: "",
    ort: "",
    land: "DE",
    email: "",
  },

  leistung: {
    art: "beratung",
    beschreibung: "",
    online: true,
  },

  vertragsschluss: "auftragsbestaetigung",
  vertragsspracheDe: true,

  zahlung: {
    arten: ["ueberweisung"],
    zahlungszielTage: 14,
    verzugszinsen: true,
    inkassoKlausel: true,
  },

  lieferung: {
    versand: false,
    versandkostenInfo: "",
    lieferzeitTage: "",
    liefergebiet: "Deutschland",
    eigentumsvorbehalt: true,
    eigentumsvorbehaltVerlaengert: false,
    gefahruebergang: "ab_uebergabe",
  },

  stornierung: {
    kostenlosBisTage: 14,
    stornogebuehrenStaffel: [
      { vorTagen: 7, gebuehrProzent: 50 },
      { vorTagen: 1, gebuehrProzent: 100 },
    ],
    kuendigungsfristTage: 30,
    ausserordentlichesKuendigungsrecht: true,
  },
  ermoeglicheStornierung: false,

  gewaehrleistung: {
    fristMonate: 24,
    unterlassenRuegepflicht: false,
    nachbesserungsversuche: 2,
  },

  haftung: {
    beschraenkungAufVorsatzGrobeFL: true,
    beschraenkungVertragstypisch: true,
    datenverlustAusgeschlossen: false,
    mitverschuldenAnrechnung: true,
  },

  datenschutzUrl: "/datenschutz",
  widerrufUrl: "/widerruf",

  gerichtsstand: "",
  erfuellungsort: "",
  schiedsklausel: false,

  dauervertrag: {
    istDauervertrag: false,
    erstlaufzeitMonate: 12,
    automatischeVerlaengerung: false,
    verlaengerungsKuendigungsfristTage: 30,
  },

  digital: {
    istDigital: false,
    bereitstellungsZeitraumMonate: 24,
    sicherheitsUpdates: true,
    nutzungsRechte: "persoenlich",
    weitergabeVerbot: true,
    datenExportTage: 30,
  },

  vertraulichkeit: {
    vertraulichkeitsKlausel: false,
    nachvertraglichJahre: 3,
  },

  forceMajeureKlausel: true,

  vsbgTeilnahmebereit: false,

  letztAktualisiert: todayIso(),
  erstelltAm: todayIso(),
};

// ─────────────────────────────────────────────────────────────────────────────
// Allgemeine Klausel-Bausteine
// ─────────────────────────────────────────────────────────────────────────────

export const KLAUSELN = {
  geltungsbereich_b2c_dienstleistung: `## § 1 Geltungsbereich

(1) Die nachstehenden Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") gelten für alle Verträge zwischen {{ANBIETER_NAME}} (nachfolgend "wir" oder "Anbieter") und Verbrauchern im Sinne des § 13 BGB (nachfolgend "Kunde" oder "Auftraggeber") über die von uns angebotenen Dienstleistungen.

(2) Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, wir stimmen ihrer Geltung ausdrücklich schriftlich zu.

(3) Vertragssprache ist {{VERTRAGSSPRACHE}}.`,

  geltungsbereich_b2c_shop: `## § 1 Geltungsbereich

(1) Für alle Bestellungen über unseren Online-Shop durch Verbraucher (§ 13 BGB) gelten die nachfolgenden AGB.

(2) Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können.

(3) Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, wir stimmen ihrer Geltung ausdrücklich schriftlich zu.

(4) Vertragssprache ist {{VERTRAGSSPRACHE}}.`,

  geltungsbereich_b2b: `## § 1 Geltungsbereich

(1) Diese AGB gelten ausschließlich gegenüber Unternehmern (§ 14 BGB), juristischen Personen des öffentlichen Rechts oder öffentlich-rechtlichen Sondervermögen.

(2) Sie gelten in der jeweils zum Zeitpunkt des Vertragsabschlusses gültigen Fassung als Rahmenvereinbarung auch für alle künftigen Geschäfte mit demselben Auftraggeber, ohne dass wir in jedem Einzelfall wieder auf sie hinweisen müssten.

(3) Entgegenstehende oder von unseren AGB abweichende Bedingungen des Auftraggebers erkennen wir nicht an, es sei denn, wir hätten ausdrücklich schriftlich ihrer Geltung zugestimmt. Dies gilt auch dann, wenn wir die Leistung in Kenntnis entgegenstehender oder abweichender Bedingungen vorbehaltlos ausführen.

(4) Vertragssprache ist {{VERTRAGSSPRACHE}}.`,

  // Vertragsschluss
  vertragsschluss_angebot_annahme: `## § 2 Vertragsschluss

(1) Die Darstellung unserer Leistungen auf unserer Webseite stellt kein bindendes Angebot dar, sondern eine Aufforderung zur Abgabe eines Angebots.

(2) Mit einer Anfrage über das Kontaktformular, per E-Mail oder telefonisch gibt der Kunde ein verbindliches Angebot ab.

(3) Wir können dieses Angebot innerhalb von 14 Tagen annehmen, indem wir dem Kunden eine schriftliche oder elektronische Auftragsbestätigung übersenden oder mit der Erbringung der Leistung beginnen.`,

  vertragsschluss_buchung: `## § 2 Vertragsschluss

(1) Mit der Buchung über unsere Webseite gibt der Kunde ein verbindliches Angebot zum Abschluss eines Vertrages ab. Vor der verbindlichen Buchung wird der Kunde auf die kostenpflichtige Natur seiner Bestellung ausdrücklich hingewiesen; die Buchungs-Schaltfläche ist mit den Worten „zahlungspflichtig buchen" oder einer entsprechend eindeutigen Formulierung gekennzeichnet (§ 312j Abs. 3 BGB).

(2) Vor Absenden der Buchung kann der Kunde seine Eingaben jederzeit überprüfen und über die Browser-Funktionen sowie die im Buchungsablauf angebotenen Bearbeitungsfunktionen korrigieren (§ 312i Abs. 1 Nr. 1 BGB).

(3) Der Vertrag kommt mit der Bestätigung der Buchung durch uns per E-Mail zustande. Die Bestätigung erfolgt unverzüglich, spätestens innerhalb von 24 Stunden.

(4) Den Vertragstext speichern wir und senden ihn gemeinsam mit diesen AGB per E-Mail zu (§ 312i Abs. 1 Nr. 2 BGB).`,

  vertragsschluss_auftragsbestaetigung: `## § 2 Vertragsschluss

(1) Die Beauftragung erfolgt schriftlich, in Textform (E-Mail) oder telefonisch.

(2) Der Vertrag kommt mit Zusendung einer schriftlichen oder elektronischen Auftragsbestätigung durch uns oder mit Beginn der Leistungserbringung zustande.`,

  vertragsschluss_b2c_shop: `## § 2 Vertragsschluss

(1) Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern einen unverbindlichen Online-Katalog dar.

(2) Durch Anklicken des Bestell-Buttons mit der Beschriftung „zahlungspflichtig bestellen" (oder einer entsprechend eindeutigen Formulierung, § 312j Abs. 3 BGB) gibt der Kunde eine verbindliche Bestellung der im Warenkorb enthaltenen Waren ab.

(3) Vor Absenden der Bestellung kann der Kunde alle Eingaben über die im Bestellablauf zur Verfügung gestellten Korrekturfunktionen sowie die Browser-Funktionen überprüfen und ändern (§ 312i Abs. 1 Nr. 1 BGB).

(4) Wir bestätigen den Eingang der Bestellung unverzüglich per E-Mail. Diese automatische Bestätigung dokumentiert lediglich, dass die Bestellung bei uns eingegangen ist, und stellt KEINE Annahme des Antrags dar.

(5) Der Kaufvertrag kommt erst mit unserer Auftragsbestätigung (separate E-Mail) oder mit der Versandbestätigung zustande, spätestens jedoch mit der Lieferung der Ware.

(6) Den Vertragstext speichern wir und senden Ihnen die Bestelldaten sowie unsere AGB per E-Mail zu (§ 312i Abs. 1 Nr. 2 BGB).`,

  // Preise
  preise_brutto_b2c: `## § 3 Preise

(1) Alle auf unserer Webseite angegebenen Preise sind Endpreise und enthalten die gesetzliche Umsatzsteuer.{{KU_HINWEIS}}

(2) Bei Versand fallen zusätzlich Versandkosten an, deren Höhe vor Vertragsabschluss angezeigt wird.`,

  preise_netto_b2b: `## § 3 Preise

(1) Alle Preise verstehen sich als Nettopreise zuzüglich der gesetzlich gültigen Umsatzsteuer.{{KU_HINWEIS}}

(2) Maßgeblich sind die zum Zeitpunkt des Vertragsabschlusses geltenden Preise.

(3) Bei Folgeaufträgen sind wir nicht an die vorherigen Preise gebunden.`,

  // Zahlung
  zahlung_b2c: `## § 4 Zahlung

(1) Es stehen folgende Zahlungsarten zur Verfügung: {{ZAHLUNGSARTEN}}.

(2) Der Rechnungsbetrag ist sofort nach Vertragsabschluss bzw. Rechnungsstellung zur Zahlung fällig, sofern nicht etwas anderes vereinbart wurde.

(3) Bei Zahlungsverzug sind wir berechtigt, Verzugszinsen in gesetzlicher Höhe (§ 288 BGB) zu berechnen.`,

  zahlung_b2b: `## § 4 Zahlung

(1) Es stehen folgende Zahlungsarten zur Verfügung: {{ZAHLUNGSARTEN}}.

(2) Rechnungen sind innerhalb von {{ZAHLUNGSZIEL}} Tagen ab Rechnungsdatum ohne Abzug zur Zahlung fällig.{{SKONTO_KLAUSEL}}

(3) Bei Zahlungsverzug berechnen wir Verzugszinsen in Höhe von 9 Prozentpunkten über dem Basiszinssatz (§ 288 Abs. 2 BGB) sowie eine Mahnpauschale von 40,00 EUR (§ 288 Abs. 5 BGB).

(4) Die Aufrechnung mit Gegenforderungen des Auftraggebers oder die Zurückbehaltung von Zahlungen wegen solcher Forderungen sind nur zulässig, wenn die Gegenforderungen unbestritten oder rechtskräftig festgestellt sind.

(5) Bei berechtigten Zweifeln an der Zahlungsfähigkeit oder Kreditwürdigkeit des Auftraggebers sind wir berechtigt, ohne Einschränkung etwa gewährter Zahlungsziele Vorauszahlung oder Sicherheitsleistung zu verlangen.`,

  // Leistungserbringung (B2C Dienstleistung)
  leistung_dienstleistung: `## § 5 Leistungserbringung

(1) Wir erbringen die vertraglich vereinbarten Leistungen nach den anerkannten Regeln der Technik und mit der erforderlichen Sorgfalt.

(2) Termine und Fristen sind nur dann verbindlich, wenn dies ausdrücklich vereinbart wurde. Die Einhaltung unserer Leistungspflichten setzt die rechtzeitige und ordnungsgemäße Mitwirkung des Kunden voraus.

(3) Wir sind berechtigt, zur Erfüllung unserer Leistungen geeignete Subunternehmer einzusetzen.

(4) Der Kunde stellt uns alle für die Leistungserbringung erforderlichen Informationen und Materialien rechtzeitig und unentgeltlich zur Verfügung.`,

  // Lieferung (Shop)
  lieferung_shop: `## § 5 Lieferung und Versand

(1) Wir liefern in {{LIEFERGEBIET}}.

(2) Versandkosten: {{VERSANDKOSTEN_INFO}}.

(3) Die Lieferzeit beträgt {{LIEFERZEIT}}, sofern nicht im Angebot anders angegeben.

(4) Der Versand erfolgt durch von uns ausgewählte Versanddienstleister.

(5) {{GEFAHRUEBERGANG}}

{{EIGENTUMSVORBEHALT}}`,

  gefahruebergang_b2c: "Die Gefahr des zufälligen Untergangs und der zufälligen Verschlechterung der verkauften Ware geht erst mit der Übergabe der Ware an den Verbraucher über (§ 446, § 475 Abs. 2 BGB).",
  gefahruebergang_b2b: "Die Gefahr des zufälligen Untergangs und der zufälligen Verschlechterung der Ware geht spätestens mit Übergabe an den Spediteur, Frachtführer oder die sonst zur Ausführung der Versendung bestimmte Person auf den Auftraggeber über.",

  eigentumsvorbehalt_b2c: `(6) Die gelieferte Ware bleibt bis zur vollständigen Bezahlung des Kaufpreises unser Eigentum.`,

  eigentumsvorbehalt_b2b_verlaengert: `(6) Die gelieferte Ware bleibt bis zur vollständigen Bezahlung aller Forderungen aus der Geschäftsverbindung unser Eigentum (Eigentumsvorbehalt).

(7) Der Auftraggeber ist berechtigt, die Vorbehaltsware im ordentlichen Geschäftsverkehr weiterzuverarbeiten und/oder zu veräußern. Bei Weiterverarbeitung erstreckt sich unser Eigentumsvorbehalt auf das neue Erzeugnis (Verarbeitungseigentumsvorbehalt).

(8) Die Forderungen des Auftraggebers aus dem Weiterverkauf der Vorbehaltsware tritt der Auftraggeber bereits jetzt zur Sicherung unserer sämtlichen Forderungen an uns ab (verlängerter Eigentumsvorbehalt).

(9) Wir verpflichten uns, die uns zustehenden Sicherheiten auf Verlangen des Auftraggebers freizugeben, soweit ihr realisierbarer Wert unsere Forderungen um mehr als 20 % übersteigt.`,

  // Stornierung / Vertragsbeendigung
  stornierung_dienstleistung: `## § 6 Stornierung / Vertragsbeendigung

(1) Eine kostenlose Stornierung der gebuchten Leistung ist bis {{KOSTENLOS_BIS_TAGE}} Tage vor dem vereinbarten Termin möglich.

(2) Bei späterer Stornierung gelten folgende pauschalisierte Gebühren als Ersatz für den uns entstehenden Aufwand und entgangenen Gewinn:
{{STAFFEL_KLAUSEL}}

(3) Dem Kunden bleibt der Nachweis vorbehalten, dass uns infolge der Stornierung ein geringerer oder gar kein Schaden entstanden ist (§ 309 Nr. 5 lit. b BGB). Wir behalten uns vor, im Einzelfall einen tatsächlich höheren Schaden konkret nachzuweisen.

(4) Bei Verträgen mit Dauerschuldcharakter (Abos, laufende Beratungs- bzw. Coaching-Verträge) beträgt die ordentliche Kündigungsfrist {{KUENDIGUNGSFRIST}} Tage zum Monatsende.

{{AUSSERORDENTLICH_KLAUSEL}}`,

  ausserordentlich: "(4) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.",

  // Widerruf-Verweis (B2C)
  widerruf_b2c: `## § 7 Widerrufsrecht

(1) Verbrauchern steht ein Widerrufsrecht zu. Die Einzelheiten ergeben sich aus unserer Widerrufsbelehrung, die Sie unter {{WIDERRUF_URL}} einsehen können und die ausdrücklich Bestandteil dieser AGB ist.

(2) Bei digitalen Inhalten und Dienstleistungen kann das Widerrufsrecht in den gesetzlich vorgesehenen Fällen erlöschen (§§ 356 Abs. 4, 5 BGB).`,

  // Gewährleistung
  gewaehrleistung_b2c_ware: `## § 8 Gewährleistung

(1) Es gelten die gesetzlichen Gewährleistungsrechte für Verbraucher mit einer Frist von 24 Monaten ab Übergabe der Ware (§§ 437, 438 BGB).

(2) Im Mängelfall hat der Kunde zunächst Anspruch auf Nacherfüllung. Wir können nach unserer Wahl nachbessern oder eine mangelfreie Sache liefern.

(3) Schlägt die Nacherfüllung fehl oder ist sie unzumutbar, kann der Kunde nach den gesetzlichen Vorschriften die Vergütung mindern, vom Vertrag zurücktreten oder Schadensersatz verlangen.`,

  gewaehrleistung_b2c_dienst: `## § 8 Gewährleistung

(1) Bei Dienstleistungen erbringen wir die vereinbarten Leistungen nach den anerkannten Regeln der Technik. Im Falle einer mangelhaften Leistung steht dem Kunden ein Anspruch auf Nacherfüllung (Mangelbeseitigung oder erneute Leistungserbringung) zu, soweit dies möglich und für uns zumutbar ist.

(2) Schlägt die Nacherfüllung fehl oder ist sie unzumutbar, gelten die gesetzlichen Rechte des Kunden.

(3) Bei reinen Beratungsleistungen, die ihrer Natur nach keine konkreten Erfolgsversprechen darstellen, übernehmen wir keine Garantie für den wirtschaftlichen Erfolg.`,

  gewaehrleistung_b2b: `## § 8 Gewährleistung

(1) Die Gewährleistungsfrist beträgt {{GEWAEHRLEISTUNGSFRIST}} Monate ab Übergabe der Ware bzw. Abnahme der Leistung. Diese Verkürzung gilt nicht für Schadensersatzansprüche wegen Verletzung des Lebens, des Körpers oder der Gesundheit, bei Vorsatz, grober Fahrlässigkeit, Übernahme einer Garantie sowie bei arglistig verschwiegenen Mängeln.

(2) Der Auftraggeber hat offensichtliche Mängel unverzüglich, spätestens innerhalb von 5 Werktagen nach Übergabe, schriftlich zu rügen. Andernfalls gilt die Ware/Leistung als genehmigt (§ 377 HGB).

(3) Im Mängelfall sind wir nach unserer Wahl zur Nachbesserung oder Ersatzlieferung berechtigt. Erst nach Fehlschlagen von zwei Nachbesserungsversuchen kann der Auftraggeber Minderung verlangen oder vom Vertrag zurücktreten.

(4) Ansprüche auf Schadensersatz statt der Leistung sind im Rahmen der Haftungsbeschränkung (§ 9) beschränkt.`,

  // Haftung
  haftung_b2c: `## § 9 Haftung

(1) Für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, die auf einer fahrlässigen Pflichtverletzung von uns oder einer vorsätzlichen oder fahrlässigen Pflichtverletzung eines unserer gesetzlichen Vertreter oder Erfüllungsgehilfen beruhen, haften wir nach den gesetzlichen Bestimmungen.

(2) Für sonstige Schäden gilt: Wir haften für Vorsatz und grobe Fahrlässigkeit. Bei leichter Fahrlässigkeit haften wir nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten), und auch dann nur beschränkt auf den vertragstypischen, vorhersehbaren Schaden.

(3) Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.

{{DATENVERLUST_KLAUSEL_B2C}}`,

  haftung_b2b: `## § 9 Haftung

(1) Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie nach den Vorschriften des Produkthaftungsgesetzes.

(2) Für leicht fahrlässige Pflichtverletzungen haften wir nur bei Verletzung einer wesentlichen Vertragspflicht (Kardinalpflicht), und auch dann nur beschränkt auf den vertragstypischen, vorhersehbaren Schaden.

(3) Im Übrigen ist eine Haftung — gleich aus welchem Rechtsgrund — ausgeschlossen.

{{HOECHSTBETRAG_KLAUSEL}}

{{DATENVERLUST_KLAUSEL}}

(6) Der Auftraggeber ist verpflichtet, Maßnahmen zur Schadensabwendung und -minderung zu treffen. Insbesondere ist der Auftraggeber für eine regelmäßige Sicherung seiner Daten verantwortlich.`,

  hoechstbetrag: "(4) Die Haftung ist insgesamt auf einen Betrag von {{HOECHSTBETRAG}} EUR pro Schadensfall begrenzt. Diese Begrenzung gilt nicht bei Vorsatz, grober Fahrlässigkeit und Personenschäden.",

  datenverlust_klausel: "(5) Für den Verlust von Daten und/oder Programmen haften wir nur insoweit, als der Verlust nicht durch angemessene Vorsorgemaßnahmen des Auftraggebers (Backups) vermeidbar gewesen wäre.",

  datenverlust_klausel_b2c: "(4) Bei der Erbringung digitaler Leistungen empfehlen wir dringend, eigene Sicherungskopien Ihrer Daten anzufertigen.",

  // Datenschutz-Verweis
  datenschutz: `## § 10 Datenschutz

Die Erhebung, Verarbeitung und Nutzung personenbezogener Daten erfolgt nach unserer Datenschutzerklärung, die unter {{DATENSCHUTZ_URL}} jederzeit einsehbar ist.`,

  // Schlussbestimmungen
  schluss_b2c: `## § 11 Schlussbestimmungen

(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG). Bei Verbrauchern mit gewöhnlichem Aufenthalt im EU-Ausland bleiben zwingende verbraucherschützende Vorschriften des Aufenthaltsstaats unberührt (Art. 6 Rom-I-VO).

(2) Sollte eine Bestimmung dieser AGB unwirksam sein oder werden, so wird die Wirksamkeit der übrigen Bestimmungen davon nicht berührt.

(3) Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter https://ec.europa.eu/consumers/odr finden.

{{VSBG_KLAUSEL}}

(5) Stand dieser AGB: {{STAND_DATUM}}`,

  schluss_b2b: `## § 11 Schlussbestimmungen

(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG).

(2) Ausschließlicher Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesem Vertrag ist {{GERICHTSSTAND}}. Wir sind jedoch berechtigt, den Auftraggeber auch an seinem allgemeinen Gerichtsstand zu verklagen.

(3) Erfüllungsort für sämtliche Leistungen ist {{ERFUELLUNGSORT}}.

(4) Sollte eine Bestimmung dieser AGB unwirksam sein oder werden, so wird die Wirksamkeit der übrigen Bestimmungen davon nicht berührt. An die Stelle der unwirksamen Bestimmung tritt eine wirksame Bestimmung, die der unwirksamen wirtschaftlich am nächsten kommt.

(5) Änderungen und Ergänzungen dieses Vertrages bedürfen der Textform (E-Mail genügt). Dies gilt auch für die Aufhebung dieses Textformerfordernisses, sofern gesetzlich zulässig.

{{SCHIEDSKLAUSEL}}

(7) Stand dieser AGB: {{STAND_DATUM}}`,

  // Skonto-Bausteine — als Nebensatz an Absatz 2 angehängt
  skonto: " Bei Zahlung innerhalb von {{SKONTO_TAGE}} Tagen ab Rechnungsdatum erhält der Auftraggeber {{SKONTO_PROZENT}}% Skonto.",

  // ─────────────────────────────────────────────────────────────────────────
  // C2 + C3 — Dauerschuldverhältnis: Kündigungsbutton + FairKonG
  // ─────────────────────────────────────────────────────────────────────────

  dauervertrag_b2c: `## § 6a Vertragslaufzeit, Verlängerung und Kündigung (Dauerschuldverhältnisse)

(1) Die anfängliche Vertragslaufzeit beträgt {{ERSTLAUFZEIT}} Monat(e) ab Vertragsschluss.

(2) {{VERLAENGERUNG_KLAUSEL}}

(3) Kündigungen sind in Textform (E-Mail genügt) an die im Impressum angegebene Kontaktadresse zu richten.

(4) Verbrauchern, die den Vertrag im elektronischen Geschäftsverkehr abgeschlossen haben, stellen wir auf unserer Webseite eine Kündigungsschaltfläche („Kündigungsbutton" nach § 312k BGB) zur Verfügung, über die die Kündigung des Dauerschuldverhältnisses jederzeit ohne Anmeldung möglich ist. {{KUENDIGUNGSBUTTON_LINK}}

(5) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.`,

  verlaengerung_aktiv_b2c: "Verlängert sich der Vertrag nach Ablauf der anfänglichen Laufzeit nicht ausdrücklich verlängert, so verlängert er sich automatisch auf unbestimmte Zeit. Der Kunde kann ihn ab diesem Zeitpunkt jederzeit mit einer Frist von {{VERLAENGERUNGS_KF}} Tagen kündigen (§ 309 Nr. 9 BGB in der Fassung des Faire-Verbraucherverträge-Gesetzes vom 01.03.2022).",

  verlaengerung_nicht_aktiv: "Der Vertrag endet automatisch zum Ablauf der vereinbarten Erstlaufzeit, sofern er nicht zuvor ausdrücklich verlängert wurde.",

  kuendigungsbutton_link_set: "Der Kündigungsbutton ist erreichbar unter: {{KUENDIGUNGSBUTTON_URL}}.",
  kuendigungsbutton_link_unset: "",

  // ─────────────────────────────────────────────────────────────────────────
  // H1 — §§ 327 ff. BGB: Digitale Produkte / Dienstleistungen (seit 01.01.2022)
  // ─────────────────────────────────────────────────────────────────────────

  digital_b2c: `## § 6b Digitale Produkte / Dienstleistungen (§§ 327 ff. BGB)

(1) Für digitale Produkte und Dienstleistungen (z. B. SaaS-Zugänge, Online-Kurse, Downloads, Mitgliedschaften) gelten zusätzlich die §§ 327 ff. BGB.

(2) Wir gewährleisten die vertragsgemäße Eignung des digitalen Produkts während der Bereitstellungs- bzw. Vertragslaufzeit (§ 327e BGB). Bei Mängeln steht dem Kunden Nacherfüllung (§ 327l), Vertragsbeendigung (§ 327m) oder Minderung (§ 327n) gemäß der gesetzlichen Vorgaben zu.

(3) Wir stellen während des Bereitstellungszeitraums von {{BEREITSTELLUNG_MONATE}} Monaten — bei dauerhaft bereitgestellten digitalen Produkten während der gesamten Bereitstellungsdauer — die Aktualisierungen zur Verfügung, die erforderlich sind, um die Vertragsgemäßheit aufrechtzuerhalten (§ 327f BGB).

{{SICHERHEITS_UPDATES_KLAUSEL}}

(5) Die Verjährungsfrist für Mängelansprüche bei digitalen Produkten beträgt 2 Jahre ab Ende des Bereitstellungs- bzw. Vertragszeitraums (§ 475e BGB).

(6) Der Kunde ist verpflichtet, angebotene Aktualisierungen innerhalb angemessener Frist zu installieren. Andernfalls haften wir nicht für Mängel, die ausschließlich auf der unterlassenen Installation beruhen, sofern wir auf die Folgen hingewiesen haben (§ 327f Abs. 2 BGB).

{{NUTZUNGSRECHTE_KLAUSEL}}

{{SLA_KLAUSEL}}

{{DATENEXPORT_KLAUSEL}}`,

  sicherheits_updates: "(4) Sicherheitsupdates stellen wir auch über die in Abs. 3 genannte Bereitstellungsdauer hinaus für die übliche Nutzungsdauer des digitalen Produkts zur Verfügung (§ 327g BGB).",

  nutzungsrechte_persoenlich: "(7) Der Kunde erhält ein einfaches, nicht übertragbares und nicht unterlizenzierbares Recht zur ausschließlich persönlichen Nutzung des digitalen Produkts. Eine Weitergabe an Dritte ist unzulässig.{{GERAETE_LIMIT}}",
  nutzungsrechte_einfach: "(7) Der Kunde erhält ein einfaches, nicht ausschließliches Nutzungsrecht am digitalen Produkt.{{GERAETE_LIMIT}}",
  nutzungsrechte_kommerziell: "(7) Der Kunde erhält ein einfaches, nicht ausschließliches Nutzungsrecht, das auch die kommerzielle Verwendung umfasst, jedoch keine Übertragung oder Unterlizenzierung erlaubt.{{GERAETE_LIMIT}}",
  geraete_limit: " Die Nutzung ist auf {{GERAETE_ZAHL}} Endgerät(e) gleichzeitig beschränkt.",

  sla_klausel: "(8) Wir bemühen uns um eine hohe Verfügbarkeit des Dienstes; angestrebt wird {{VERFUEGBARKEIT}}. Geplante Wartungsfenster werden in der Regel mit einer Vorankündigung von 24 Stunden außerhalb der Hauptnutzungszeit durchgeführt. Eine ununterbrochene Verfügbarkeit wird nicht geschuldet, soweit die Unterbrechung auf höhere Gewalt, planmäßige Wartung oder vom Kunden zu vertretende Umstände zurückzuführen ist.",

  datenexport_klausel: "(9) Bei Vertragsbeendigung können vom Kunden gespeicherte Daten innerhalb von {{DATENEXPORT_TAGE}} Tagen exportiert werden. Nach Ablauf dieser Frist werden die Daten gelöscht, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",

  // ─────────────────────────────────────────────────────────────────────────
  // M1 — Force Majeure
  // ─────────────────────────────────────────────────────────────────────────

  force_majeure: `## § 9a Höhere Gewalt

(1) Ereignisse höherer Gewalt, die uns die geschuldete Leistung wesentlich erschweren oder unmöglich machen — insbesondere behördliche Maßnahmen, Pandemien, Naturkatastrophen, Streiks, Cyberangriffe auf kritische Infrastruktur, längerfristige Stromausfälle oder Ausfälle der internationalen Lieferketten —, entbinden uns für die Dauer ihres Bestehens von der Leistungspflicht.

(2) Daraus resultierende Lieferfristen oder Termine verlängern sich entsprechend. Vereinbarte Termine werden nach Wegfall des Hindernisses neu abgestimmt.

(3) Wir werden den Kunden über das Ereignis und seine voraussichtliche Dauer unverzüglich informieren. Dauert das Ereignis länger als 8 Wochen, sind beide Vertragsparteien berechtigt, vom Vertrag zurückzutreten.`,

  // ─────────────────────────────────────────────────────────────────────────
  // M4 — Vertraulichkeit (Coaching / Beratung)
  // ─────────────────────────────────────────────────────────────────────────

  vertraulichkeit_klausel: `## § 9b Vertraulichkeit

(1) Beide Vertragsparteien verpflichten sich, alle im Zusammenhang mit der Vertragsdurchführung erlangten vertraulichen Informationen der jeweils anderen Partei — insbesondere Geschäfts- und Betriebsgeheimnisse, persönliche Umstände, Geschäftsstrategien und sensible Themen aus der Beratung — streng vertraulich zu behandeln und nicht an Dritte weiterzugeben.

(2) Die Vertraulichkeitspflicht gilt während der Vertragslaufzeit und für einen Zeitraum von {{NACHVERTRAGLICH_JAHRE}} Jahren nach Vertragsbeendigung.

(3) Ausgenommen sind Informationen, die (a) öffentlich bekannt sind oder werden, ohne dass dies auf einer Vertragsverletzung beruht, (b) bereits vor der Mitteilung bekannt waren oder (c) aufgrund gesetzlicher Vorschriften offengelegt werden müssen.`,

  // ─────────────────────────────────────────────────────────────────────────
  // VSBG-Varianten (H2)
  // ─────────────────────────────────────────────────────────────────────────

  vsbg_nicht_teilnahmebereit: "(4) An einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle nach § 36 VSBG nehmen wir nicht teil und sind dazu nicht verpflichtet.",
  vsbg_teilnahmebereit: "(4) Wir sind bereit, an einem Streitbeilegungsverfahren vor folgender Verbraucherschlichtungsstelle teilzunehmen: {{SCHLICHTUNGSSTELLE}}.",

  // ─────────────────────────────────────────────────────────────────────────
  // L1 — Schiedsklausel (B2B)
  // ─────────────────────────────────────────────────────────────────────────

  schiedsklausel_b2b: "(6) Streitigkeiten aus oder im Zusammenhang mit diesem Vertrag werden nach Wahl des klagenden Teils durch ein Schiedsgericht nach der Schiedsgerichtsordnung der Deutschen Institution für Schiedsgerichtsbarkeit e.V. (DIS) unter Ausschluss des ordentlichen Rechtswegs endgültig entschieden. Schiedsort ist {{GERICHTSSTAND}}, Verfahrenssprache Deutsch. Die Anzahl der Schiedsrichter beträgt einen.",
};
