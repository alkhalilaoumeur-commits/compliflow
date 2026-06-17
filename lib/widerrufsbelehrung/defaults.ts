/**
 * Widerrufsbelehrung-Defaults
 * Quelle: Anhang § 312f BGB (offizielles Muster) + offizielle Gestaltungshinweise
 * Stand: 2026-06-16
 */

import type { WiderrufData } from "./types";

const todayIso = () => new Date().toISOString().split("T")[0];

// ─────────────────────────────────────────────────────────────────────────────
// Initial-State
// ─────────────────────────────────────────────────────────────────────────────

export const INITIAL_WIDERRUF: WiderrufData = {
  schemaVersion: 1,

  anbieter: {
    name: "",
    strasse: "",
    plz: "",
    ort: "",
    land: "DE",
    email: "",
  },

  leistungstyp: "ware_einzeln",
  fristTage: 14,

  besonderheiten: {
    digitalSofortDownload: false,
    dienstleistungSofort: false,
    erbringungBegonnen: false,
  },

  ausschluesse: [],

  rueckgabe: {
    abweichendeAdresse: false,
    kundeTraegtKosten: true,
    sperrgut: false,
  },

  inkludiereMusterformular: true,
  istB2C: true,

  letztAktualisiert: todayIso(),
  erstelltAm: todayIso(),
};

// ─────────────────────────────────────────────────────────────────────────────
// Standard-Texte (alle aus Anhang § 312f BGB)
// ─────────────────────────────────────────────────────────────────────────────

export const TEXTE = {
  ueberschrift: "Widerrufsbelehrung",

  widerrufsrecht_intro: "Sie haben das Recht, binnen {{TAGE}} Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.",

  widerrufsfrist_ware_einzeln: "Die Widerrufsfrist beträgt {{TAGE}} Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.",

  widerrufsfrist_ware_mehrteilig: "Die Widerrufsfrist beträgt {{TAGE}} Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die letzte Ware in Besitz genommen haben bzw. hat.",

  widerrufsfrist_ware_abo: "Die Widerrufsfrist beträgt {{TAGE}} Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die erste Ware in Besitz genommen haben bzw. hat.",

  widerrufsfrist_dienstleistung: "Die Widerrufsfrist beträgt {{TAGE}} Tage ab dem Tag des Vertragsabschlusses.",

  widerrufsfrist_digital: "Die Widerrufsfrist beträgt {{TAGE}} Tage ab dem Tag des Vertragsabschlusses.",

  ausuebung: `Um Ihr Widerrufsrecht auszuüben, müssen Sie uns ({{ANBIETER_NAME}}, {{ANBIETER_ADRESSE}}, E-Mail: {{ANBIETER_EMAIL}}{{ANBIETER_TELEFON}}) mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.

Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.`,

  folgen_ueberschrift: "Folgen des Widerrufs",

  // HIGH FIX #6: § 357a Abs. 3 BGB — Verbraucher kann anderes Zahlungsmittel verlangen.
  folgen_ware: `Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet. Sie haben das Recht, die Rückerstattung auf einem anderen Zahlungsmittel als das ursprünglich verwendete zu verlangen, sofern dadurch für Sie keine Entgelte entstehen (§ 357a Abs. 3 BGB).

Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.

Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an {{RUECKGABE_ADRESSE}} zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.

{{RUECKSENDEKOSTEN}}

Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.`,

  ruecksende_kunde: "Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.",
  ruecksende_sperrgut: "Sie tragen die unmittelbaren Kosten der Rücksendung der Waren. Die Kosten werden auf höchstens etwa {{KOSTEN}} geschätzt.",
  ruecksende_anbieter: "Wir tragen die Kosten der Rücksendung der Waren.",

  folgen_dienstleistung: `Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.

Haben Sie verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen sollen, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.`,

  folgen_digital_sofort: `**Hinweis zum Erlöschen des Widerrufsrechts:** Das Widerrufsrecht erlischt bei einem Vertrag zur Lieferung von nicht auf einem körperlichen Datenträger befindlichen digitalen Inhalten, wenn wir mit der Ausführung des Vertrags begonnen haben, nachdem Sie ausdrücklich zugestimmt haben, dass wir mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnen, UND Sie Ihre Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung mit Beginn der Ausführung des Vertrags Ihr Widerrufsrecht verlieren.`,

  folgen_dienstleistung_sofort: `**Hinweis zum Erlöschen des Widerrufsrechts:** Bei einem Vertrag über die Erbringung von Dienstleistungen erlischt das Widerrufsrecht auch dann, wenn wir die Dienstleistung vollständig erbracht haben und mit der Ausführung der Dienstleistung erst begonnen haben, nachdem Sie dazu Ihre ausdrückliche Zustimmung gegeben haben und gleichzeitig Ihre Kenntnis davon bestätigt haben, dass Sie Ihr Widerrufsrecht bei vollständiger Vertragserfüllung durch uns verlieren.`,

  // HIGH FIX #7: § 356 Abs. 3 BGB — Fristverlängerung bei fehlender/fehlerhafter Belehrung
  fristverlaengerung_hinweis: `**Hinweis zur Widerrufsfrist:** Sollten wir Sie nicht ordnungsgemäß über Ihr Widerrufsrecht belehrt haben, verlängert sich die Widerrufsfrist um 12 Monate. Diese Belehrung ist auf den Stand des oben genannten Datums aktuell. Bei Gesetzesänderungen erstellen Sie eine neue Belehrung mit Compliflow.`,

  ende_belehrung: "— Ende der Widerrufsbelehrung —",

  // Muster-Widerrufsformular nach Anlage 2 zu Artikel 246a § 1 Abs. 2 Satz 1 Nr. 1 EGBGB
  musterformular: `## Muster-Widerrufsformular

(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)

— An {{ANBIETER_NAME}}, {{ANBIETER_ADRESSE}}, E-Mail: {{ANBIETER_EMAIL}}{{ANBIETER_TELEFON_MUSTER}}{{ANBIETER_FAX}}:

— Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*) / die Erbringung der folgenden Dienstleistung (*):

— Bestellt am (*) / erhalten am (*):

— Name des/der Verbraucher(s):

— Anschrift des/der Verbraucher(s):

— Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):

— Datum:

(*) Unzutreffendes streichen.`,

  // Hinweis bei B2B-Vertrag
  kein_widerrufsrecht_b2b: `## Hinweis zum Widerrufsrecht

Das Widerrufsrecht nach §§ 312g, 355 BGB steht ausschließlich Verbrauchern im Sinne des § 13 BGB zu. Da der Vertrag mit Ihnen als Unternehmer im Sinne des § 14 BGB geschlossen wird, besteht KEIN gesetzliches Widerrufsrecht.`,

  // Hinweis bei kompletten Ausschluss
  ausschluss_hinweis: `## Hinweis zum Ausschluss des Widerrufsrechts

Aufgrund der Art der von uns angebotenen Leistung besteht für Sie kein Widerrufsrecht nach den folgenden Vorschriften:`,
};
