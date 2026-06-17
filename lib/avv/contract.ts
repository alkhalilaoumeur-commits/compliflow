/**
 * AVV-Vertragstext nach Art. 28 DSGVO — Legal-Review v1.1
 * Quellen: Art. 28 DSGVO, Bitkom-Mustervertrag, GDD-Empfehlungen, EuGH C-311/18.
 * Vollständige Mapping-Tabelle: docs/legal-review-2026-06-06.md
 */

import type { AvvFormData, Subverarbeiter, TomKategorie } from "./types";
import {
  STANDARD_DATENKATEGORIEN,
  STANDARD_PERSONENKATEGORIEN,
  TOM_KATEGORIE_LABELS,
  DRITTLAND_TOP20,
} from "./defaults";
import { formatDateDE } from "@/lib/utils";

export type ContractBlock = {
  id: string;
  number: string;
  title: string;
  paragraphs: string[];
};

export type ContractAnlage = {
  id: string;
  title: string;
  content: AnlageContent;
};

export type AnlageContent =
  | { type: "tom-table"; groups: { kategorie: string; items: string[] }[] }
  | { type: "sub-table"; rows: { firma: string; sitz: string; zweck: string; land: string; garantie: string }[] }
  | { type: "data-categories"; daten: string[]; personen: string[]; arten: string[] };

const ALLE_TOM_KATEGORIEN: TomKategorie[] = [
  "zutritt",
  "zugang",
  "zugriff",
  "weitergabe",
  "eingabe",
  "auftrag",
  "verfuegbarkeit",
  "trennung",
];

const EU_EWR_LAENDER = [
  "deutschland", "österreich", "oesterreich", "frankreich", "italien", "spanien",
  "niederlande", "belgien", "luxemburg", "irland", "portugal", "polen", "tschechien",
  "ungarn", "dänemark", "daenemark", "schweden", "finnland", "estland", "lettland",
  "litauen", "slowenien", "slowakei", "kroatien", "bulgarien", "rumänien", "rumaenien",
  "griechenland", "malta", "zypern", "island", "norwegen", "liechtenstein",
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function parteiVollAdresse(p: Partial<AvvFormData["auftraggeber"]>) {
  if (!p.firma) return "—";
  const parts = [p.firma, p.strasse, [p.plz, p.ort].filter(Boolean).join(" "), p.land];
  return parts.filter(Boolean).join(", ");
}

function dauerText(d: AvvFormData["verarbeitung"]["dauer"]) {
  if (!d) return "auf unbestimmte Zeit, jedoch nicht länger als die Hauptvertragsbeziehung";
  switch (d.typ) {
    case "befristet":
      return `bis zum ${d.bis ? formatDateDE(d.bis) : "—"}`;
    case "unbefristet":
      return "auf unbestimmte Zeit, bis zur Kündigung durch eine der Parteien";
    case "vertragslaufzeit":
      return "für die Dauer des zugrunde liegenden Hauptvertrags zwischen den Parteien";
  }
}

function hatBesondereKategorie(data: AvvFormData) {
  return data.datenkategorien.some((id) => {
    const cat = STANDARD_DATENKATEGORIEN.find((c) => c.id === id);
    return cat?.besondereKategorie;
  });
}

function drittlandSubs(subs: Subverarbeiter[]) {
  return subs.filter((s) => s.sicherheitsgarantie !== "EU-EWR");
}

function isAuftragnehmerInDrittland(data: AvvFormData) {
  const land = (data.auftragnehmer.land ?? "").trim().toLowerCase();
  if (!land) return false;
  return !EU_EWR_LAENDER.some((c) => land === c || land.includes(c));
}

function landName(code: string) {
  return DRITTLAND_TOP20.find((l) => l.code === code)?.land ?? code;
}

function garantieText(g: Subverarbeiter["sicherheitsgarantie"]) {
  switch (g) {
    case "EU-EWR":
      return "innerhalb EU/EWR";
    case "Angemessenheitsbeschluss":
      return "Angemessenheitsbeschluss der EU-Kommission";
    case "Standardvertragsklauseln":
      return "Standardvertragsklauseln (SCC, Modul 3)";
    case "BindendeUnternehmensregeln":
      return "Bindende interne Datenschutzvorschriften (BCR)";
    case "Keine":
      return "Keine geeignete Garantie";
  }
}

/* -------------------------------------------------------------------------- */
/*  Vertragstext §§                                                           */
/* -------------------------------------------------------------------------- */

export function buildContract(data: AvvFormData): ContractBlock[] {
  const ag = data.auftraggeber;
  const an = data.auftragnehmer;
  const v = data.verarbeitung;
  const arten = (v.arten ?? []).join(", ") || "—";
  const dauer = dauerText(v.dauer);
  const subs = data.subverarbeiter;
  const drittSubs = drittlandSubs(subs);
  const anInDrittland = isAuftragnehmerInDrittland(data);

  const datenLabels = data.datenkategorien
    .map((id) => STANDARD_DATENKATEGORIEN.find((c) => c.id === id)?.label ?? id)
    .concat(data.datenkategorienCustom);
  const personenLabels = data.personenkategorien
    .map((id) => STANDARD_PERSONENKATEGORIEN.find((c) => c.id === id)?.label ?? id)
    .concat(data.personenkategorienCustom);

  const blocks: ContractBlock[] = [];

  blocks.push({
    id: "praeambel",
    number: "",
    title: "Präambel",
    paragraphs: [
      `Zwischen ${parteiVollAdresse(ag)} — nachfolgend „Verantwortlicher" genannt —`,
      `und ${parteiVollAdresse(an)} — nachfolgend „Auftragsverarbeiter" genannt —`,
      `wird der nachfolgende Vertrag zur Auftragsverarbeitung gemäß Art. 28 Abs. 3 DSGVO geschlossen. Dieser Vertrag konkretisiert die datenschutzrechtlichen Pflichten der Parteien aus dem zwischen ihnen bestehenden Hauptvertragsverhältnis und ergänzt dieses um die zwingend erforderlichen Regelungen zur Verarbeitung personenbezogener Daten im Auftrag.`,
    ],
  });

  blocks.push({
    id: "p1",
    number: "§ 1",
    title: "Gegenstand und Dauer der Verarbeitung",
    paragraphs: [
      `(1) Gegenstand des Auftrags ist die folgende Verarbeitung personenbezogener Daten durch den Auftragsverarbeiter im Auftrag des Verantwortlichen: ${v.gegenstand || "—"}.`,
      `(2) Die Dauer der Verarbeitung erstreckt sich ${dauer}. Nach Vertragsende gilt § 12 dieses Vertrags entsprechend.`,
      `(3) Die Art der Verarbeitung umfasst insbesondere: ${arten}.`,
      `(4) Zweck der Verarbeitung ist: ${v.zweck || "—"}.`,
    ],
  });

  blocks.push({
    id: "p2",
    number: "§ 2",
    title: "Art der Daten und Kreis der Betroffenen",
    paragraphs: [
      `(1) Folgende Kategorien personenbezogener Daten werden verarbeitet: ${datenLabels.join(", ") || "—"}.`,
      hatBesondereKategorie(data)
        ? `(2) Es werden besondere Kategorien personenbezogener Daten nach Art. 9 DSGVO verarbeitet. Der Auftragsverarbeiter trifft hierfür zusätzliche Schutzmaßnahmen im Sinne des Art. 9 Abs. 2 lit. b DSGVO sowie eine ausdrücklich dokumentierte erweiterte Vertraulichkeitsverpflichtung der mit der Verarbeitung befassten Personen. Der Verantwortliche stellt sicher, dass eine geeignete Rechtsgrundlage nach Art. 9 Abs. 2 DSGVO für die Verarbeitung besteht, und teilt diese dem Auftragsverarbeiter auf Anfrage mit. Der Auftragsverarbeiter ist nicht verpflichtet, die Rechtsgrundlage eigenständig zu prüfen.`
        : `(2) Es werden keine besonderen Kategorien personenbezogener Daten im Sinne des Art. 9 DSGVO verarbeitet. Sollte sich dies während der Vertragslaufzeit ändern, ist eine schriftliche Vertragsergänzung erforderlich.`,
      `(3) Folgende Kategorien betroffener Personen sind von der Verarbeitung erfasst: ${personenLabels.join(", ") || "—"}.`,
    ],
  });

  // § 3 — DSGVO-konformer Wortlaut nach Art. 28 Abs. 3 lit. a
  blocks.push({
    id: "p3",
    number: "§ 3",
    title: "Weisungsbefugnis des Verantwortlichen",
    paragraphs: [
      `(1) Der Auftragsverarbeiter verarbeitet personenbezogene Daten ausschließlich auf dokumentierte Weisung des Verantwortlichen — auch in Bezug auf die Übermittlung personenbezogener Daten an ein Drittland oder eine internationale Organisation —, es sei denn, er ist hierzu nach dem Recht der Union oder der Mitgliedstaaten, dem er unterliegt, verpflichtet. In einem solchen Fall teilt der Auftragsverarbeiter dem Verantwortlichen diese rechtlichen Anforderungen vor der Verarbeitung mit, sofern das betreffende Recht eine solche Mitteilung nicht wegen eines wichtigen öffentlichen Interesses verbietet (Art. 28 Abs. 3 lit. a DSGVO).`,
      `(2) Mündliche Weisungen sind unverzüglich in schriftlicher oder dokumentierter elektronischer Form zu bestätigen. Als ausreichend gelten insbesondere: E-Mail, signiertes Ticket im Issue-Tracking-System, dokumentiertes Web-Formular, sowie qualifizierte elektronische Signaturen nach eIDAS-Verordnung (Art. 28 Abs. 9 DSGVO).`,
      `(3) Der Auftragsverarbeiter informiert den Verantwortlichen unverzüglich, falls er der Auffassung ist, dass eine Weisung gegen die DSGVO oder andere Datenschutzvorschriften der Union oder der Mitgliedstaaten verstößt. Bis zur Bestätigung oder Änderung der Weisung ist der Auftragsverarbeiter berechtigt, die Durchführung der Weisung auszusetzen.`,
      `(4) Vertretungsberechtigt für die Erteilung von Weisungen ist auf Seiten des Verantwortlichen: ${ag.vertretung || "—"} (${ag.email || "—"}).`,
    ],
  });

  blocks.push({
    id: "p4",
    number: "§ 4",
    title: "Pflichten des Auftragsverarbeiters",
    paragraphs: [
      `(1) Der Auftragsverarbeiter verarbeitet die personenbezogenen Daten ausschließlich im Rahmen dieser Vereinbarung und der erteilten Weisungen des Verantwortlichen, es sei denn, er ist gesetzlich zur Verarbeitung verpflichtet.`,
      `(2) Der Auftragsverarbeiter gewährleistet, dass die zur Verarbeitung der personenbezogenen Daten befugten Personen sich zur Vertraulichkeit verpflichtet haben oder einer angemessenen gesetzlichen Verschwiegenheitspflicht unterliegen. Die Verpflichtung wird durch eine separate Verschwiegenheitserklärung mit Datum und Unterschrift, alternativ durch eine entsprechende Klausel im Anstellungsvertrag mit dokumentiertem Belehrungsnachweis, festgehalten. Die Verpflichtung bleibt auch nach Beendigung des Anstellungsverhältnisses bestehen (Art. 28 Abs. 3 lit. b DSGVO).`,
      `(3) Der Auftragsverarbeiter unterstützt den Verantwortlichen unter Berücksichtigung der Art der Verarbeitung und der ihm zur Verfügung stehenden Informationen bei der Einhaltung der in den Artikeln 32 bis 36 DSGVO genannten Pflichten (Art. 28 Abs. 3 lit. f DSGVO).`,
      `(4) Sofern der Auftragsverarbeiter gesetzlich zur Bestellung eines Datenschutzbeauftragten verpflichtet ist (Art. 37 DSGVO, § 38 BDSG), teilt er dessen Namen und Kontaktdaten dem Verantwortlichen unverzüglich mit. Ist der Auftragsverarbeiter nicht zur Bestellung verpflichtet, benennt er gleichwohl einen festen Ansprechpartner für Datenschutzfragen, der dem Verantwortlichen für Auskünfte zur Verfügung steht.`,
      `(5) Der Auftragsverarbeiter führt ein Verzeichnis aller Kategorien von im Auftrag des Verantwortlichen durchgeführten Tätigkeiten der Verarbeitung gemäß Art. 30 Abs. 2 DSGVO und stellt es auf Anfrage der Aufsichtsbehörde bereit.`,
      `(6) Setzt der Auftragsverarbeiter zur Verarbeitung der personenbezogenen Daten KI-Systeme im Sinne der Verordnung (EU) 2024/1689 (EU AI Act) ein, informiert er den Verantwortlichen vorab schriftlich oder in dokumentierter Textform über Art, Zweck und Risikoklasse des Systems. Ab dem 02.08.2026 gelten zusätzlich die Pflichten nach Art. 25 AI Act (Verantwortung in der KI-Wertschöpfungskette); der Auftragsverarbeiter stellt dem Verantwortlichen auf Anfrage die nach Anhang XI bzw. Anhang XII des AI Acts erforderlichen Informationen bereit. Bei Einsatz von Hochrisiko-KI-Systemen nach Anhang III AI Act ist die ausdrückliche vorherige Zustimmung des Verantwortlichen erforderlich.`,
    ],
  });

  blocks.push({
    id: "p5",
    number: "§ 5",
    title: "Technische und organisatorische Maßnahmen (TOMs)",
    paragraphs: [
      `(1) Der Auftragsverarbeiter trifft die zur Gewährleistung eines dem Risiko angemessenen Schutzniveaus erforderlichen technischen und organisatorischen Maßnahmen gemäß Art. 32 DSGVO (Art. 28 Abs. 3 lit. c DSGVO).`,
      `(2) Die konkret umgesetzten Maßnahmen sind in Anlage 1 zu diesem Vertrag aufgeführt und Bestandteil dieser Vereinbarung.`,
      `(3) Die in Anlage 1 dokumentierten Maßnahmen werden während der Laufzeit dieses Vertrags an den Stand der Technik fortlaufend angepasst. Wesentliche Änderungen, die das Schutzniveau betreffen, sind dem Verantwortlichen unverzüglich anzuzeigen.`,
      `(4) Der Verantwortliche kann jederzeit Nachweise über die Umsetzung der TOMs verlangen, insbesondere Zertifizierungen, Auditberichte oder gleichwertige Belege. Die Kosten für die erstmalige Nachweisanforderung pro Kalenderjahr trägt der Auftragsverarbeiter; weitere Nachweisanforderungen innerhalb desselben Jahres trägt der Verantwortliche, sofern keine erheblichen Verstöße festgestellt werden.`,
    ],
  });

  // § 6 — Subverarbeiter mit Art. 28 Abs. 4 Satz 2 Haftung + Kündigungsrecht
  blocks.push({
    id: "p6",
    number: "§ 6",
    title: "Inanspruchnahme von Subunternehmern (weitere Auftragsverarbeiter)",
    paragraphs: [
      subs.length > 0
        ? `(1) Der Verantwortliche stimmt der Inanspruchnahme der in Anlage 2 aufgeführten Subunternehmer als weitere Auftragsverarbeiter im Sinne des Art. 28 Abs. 2 DSGVO zu. Die in Anlage 2 genannten Subunternehmer gelten als allgemein genehmigt.`
        : `(1) Eine Inanspruchnahme von Subunternehmern (weiteren Auftragsverarbeitern) ist derzeit nicht vorgesehen. Sollte der Auftragsverarbeiter weitere Auftragsverarbeiter einbeziehen wollen, bedarf dies der vorherigen gesonderten oder allgemeinen schriftlichen Genehmigung des Verantwortlichen.`,
      `(2) Bei einer beabsichtigten Hinzunahme eines weiteren Subunternehmers oder einem Wechsel eines bestehenden Subunternehmers informiert der Auftragsverarbeiter den Verantwortlichen mit angemessener Vorlaufzeit (mindestens 30 Tage) vorab schriftlich. Der Verantwortliche kann der Änderung innerhalb von 14 Tagen aus wichtigem datenschutzrechtlichen Grund widersprechen.`,
      `(3) Der Auftragsverarbeiter stellt sicher, dass die mit Subunternehmern abgeschlossenen Verträge denselben Datenschutzverpflichtungen unterliegen wie diese Vereinbarung, insbesondere hinsichtlich der technischen und organisatorischen Maßnahmen und der Weisungsbindung (Art. 28 Abs. 4 Satz 1 DSGVO).`,
      `(4) Kommt ein vom Auftragsverarbeiter herangezogener Subunternehmer seinen Datenschutzpflichten nicht nach, so haftet der Auftragsverarbeiter gegenüber dem Verantwortlichen für die Einhaltung der Pflichten dieses Subunternehmers in vollem Umfang (Art. 28 Abs. 4 Satz 2 DSGVO).`,
      `(5) Setzt der Auftragsverarbeiter einen Subunternehmer trotz wirksamen Widerspruchs des Verantwortlichen ein oder werden die geeigneten Garantien nach Abs. 6 nicht eingehalten, ist der Verantwortliche zur außerordentlichen Kündigung dieses Vertrags sowie des Hauptvertrags berechtigt. § 12 dieses Vertrags findet entsprechend Anwendung.`,
      drittSubs.length > 0
        ? `(6) Bei Subunternehmern in einem Drittland (vgl. Anlage 2) gewährleistet der Auftragsverarbeiter, dass geeignete Garantien im Sinne des Art. 46 DSGVO bestehen — insbesondere Standardvertragsklauseln in der Fassung des Durchführungsbeschlusses (EU) 2021/914, ein Angemessenheitsbeschluss oder bindende interne Datenschutzvorschriften (BCR). Zusätzlich führt der Auftragsverarbeiter vor jeder Drittlandverarbeitung ein Transfer Impact Assessment (TIA) nach den EDPB Recommendations 01/2020 durch, dokumentiert das Ergebnis und stellt es dem Verantwortlichen auf Anfrage zur Verfügung. Soweit nach der Abwägung erforderlich, werden ergänzende Schutzmaßnahmen nach den Vorgaben des EuGH-Urteils „Schrems II" (Rs. C-311/18) umgesetzt — insbesondere Verschlüsselung, Pseudonymisierung oder vertragliche Garantien.`
        : `(6) Eine Verarbeitung in einem Drittland außerhalb der EU/EWR durch Subunternehmer findet derzeit nicht statt. Vor jeder Drittlandverarbeitung sind die Voraussetzungen der Art. 44 ff. DSGVO einzuhalten, einschließlich der Durchführung eines Transfer Impact Assessment (TIA) nach EDPB Recommendations 01/2020.`,
    ],
  });

  // § 6a — Conditional: Auftragnehmer selbst im Drittland
  if (anInDrittland) {
    blocks.push({
      id: "p6a",
      number: "§ 6a",
      title: "Verarbeitung durch den Auftragsverarbeiter in einem Drittland",
      paragraphs: [
        `(1) Da der Auftragsverarbeiter seinen Sitz außerhalb der EU/des EWR hat (${an.land || "—"}), erfolgt die Verarbeitung in einem Drittland im Sinne des Kapitels V der DSGVO.`,
        `(2) Die Parteien schließen zur Absicherung der Verarbeitung die EU-Standardvertragsklauseln (Durchführungsbeschluss (EU) 2021/914, Modul 2 — Verantwortlicher an Auftragsverarbeiter) ab. Diese gelten als Bestandteil dieses Vertrags und gehen bei Widerspruch den Regelungen dieses Vertrags vor.`,
        `(3) Der Auftragsverarbeiter führt vor Beginn der Verarbeitung ein Transfer Impact Assessment (TIA) nach Maßgabe der EDPB Recommendations 01/2020 durch und dokumentiert dessen Ergebnis schriftlich. Auf dieser Grundlage sichert der Auftragsverarbeiter zu, ergänzende Schutzmaßnahmen umzusetzen, soweit dies zur Gewährleistung eines im Vergleich zur EU/EWR gleichwertigen Schutzniveaus erforderlich ist (insbesondere starke Verschlüsselung mit ausschließlicher Schlüsselkontrolle in der EU, Pseudonymisierung oder ergänzende vertragliche Garantien gegen unverhältnismäßige Behördenzugriffe).`,
      ],
    });
  }

  blocks.push({
    id: "p7",
    number: "§ 7",
    title: "Rechte der betroffenen Personen",
    paragraphs: [
      `(1) Der Auftragsverarbeiter unterstützt den Verantwortlichen mit geeigneten technischen und organisatorischen Maßnahmen, soweit möglich, dabei, seinen Pflichten zur Beantwortung von Anträgen auf Wahrnehmung der in Kapitel III der DSGVO genannten Rechte der betroffenen Person nachzukommen (insbesondere Art. 15 Auskunft, Art. 16 Berichtigung, Art. 17 Löschung, Art. 18 Einschränkung, Art. 20 Datenübertragbarkeit, Art. 21 Widerspruch — Art. 28 Abs. 3 lit. e DSGVO).`,
      `(2) Wendet sich eine betroffene Person mit einem solchen Antrag unmittelbar an den Auftragsverarbeiter, leitet dieser den Antrag unverzüglich an den Verantwortlichen weiter und beantwortet ihn nicht selbst, es sei denn, dies wäre nach dem anwendbaren Recht zwingend.`,
      `(3) Die Kosten für die Unterstützung nach Abs. 1 trägt der Verantwortliche, sofern die Unterstützung über den im Auftrag geschuldeten Leistungsumfang hinausgeht.`,
    ],
  });

  blocks.push({
    id: "p8",
    number: "§ 8",
    title: "Meldung von Datenschutzverletzungen",
    paragraphs: [
      `(1) Der Auftragsverarbeiter meldet dem Verantwortlichen unverzüglich nach Bekanntwerden jede Verletzung des Schutzes personenbezogener Daten (Art. 33 Abs. 2 DSGVO). Die Parteien vereinbaren als vertragliche Höchstfrist für diese Meldung eine Frist von 24 Stunden ab Bekanntwerden des Vorfalls. Diese vertragliche Verschärfung soll dem Verantwortlichen ermöglichen, seine eigene 72-Stunden-Meldepflicht gegenüber der Aufsichtsbehörde nach Art. 33 Abs. 1 DSGVO einzuhalten.`,
      `(2) Die Meldung enthält mindestens: Art der Verletzung, betroffene Datenkategorien, Anzahl betroffener Personen und Datensätze (sofern möglich), Folgen der Verletzung, ergriffene oder vorgeschlagene Abhilfemaßnahmen sowie Kontaktdaten der Ansprechperson.`,
      `(3) Der Auftragsverarbeiter unterstützt den Verantwortlichen bei der Erfüllung der Meldepflichten gemäß Art. 33 und 34 DSGVO sowie bei einer ggf. erforderlichen Information der Aufsichtsbehörde und/oder der betroffenen Personen.`,
    ],
  });

  blocks.push({
    id: "p9",
    number: "§ 9",
    title: "Datenschutz-Folgenabschätzung und Konsultation",
    paragraphs: [
      `(1) Der Auftragsverarbeiter unterstützt den Verantwortlichen bei der Durchführung einer Datenschutz-Folgenabschätzung gemäß Art. 35 DSGVO sowie bei einer ggf. erforderlichen vorherigen Konsultation der Aufsichtsbehörde nach Art. 36 DSGVO.`,
      `(2) Die Unterstützung umfasst insbesondere die Bereitstellung relevanter Informationen über Art, Umfang, Umstände und Zwecke der Verarbeitung sowie die eingesetzten technischen und organisatorischen Maßnahmen.`,
    ],
  });

  blocks.push({
    id: "p10",
    number: "§ 10",
    title: "Kontrollrechte des Verantwortlichen",
    paragraphs: [
      `(1) Der Verantwortliche hat das Recht, sich nach vorheriger Ankündigung (mindestens 14 Tage) und während der üblichen Geschäftszeiten ohne Störung des Betriebsablaufs von der Einhaltung der Vorschriften dieses Vertrages beim Auftragsverarbeiter zu überzeugen (Art. 28 Abs. 3 lit. h DSGVO).`,
      `(2) Der Auftragsverarbeiter stellt dem Verantwortlichen alle hierfür erforderlichen Informationen zur Verfügung und ermöglicht Überprüfungen — einschließlich Inspektionen — die vom Verantwortlichen oder einem von diesem beauftragten Prüfer durchgeführt werden, und trägt zu diesen bei.`,
      `(3) Der Auftragsverarbeiter kann den Nachweis über die Einhaltung der Vorschriften dieses Vertrages auch durch geeignete aktuelle Zertifizierungen (z.B. ISO 27001, ISO 27701), Auditberichte oder genehmigte Verhaltensregeln im Sinne des Art. 40 DSGVO erbringen.`,
      `(4) Die durch eine Kontrolle entstehenden Kosten trägt grundsätzlich der Verantwortliche. Werden bei der Kontrolle erhebliche Verstöße festgestellt, trägt der Auftragsverarbeiter die Kosten.`,
    ],
  });

  // § 11 — Haftungsbeschränkung Vorsatz/grobe Fahrlässigkeit
  blocks.push({
    id: "p11",
    number: "§ 11",
    title: "Haftung",
    paragraphs: [
      `(1) Die Parteien haften gegenüber betroffenen Personen entsprechend der in Art. 82 DSGVO getroffenen Regelung. Eine Haftung mehrerer Verantwortlicher oder Auftragsverarbeiter im Außenverhältnis richtet sich nach Art. 82 Abs. 4 und 5 DSGVO.`,
      `(2) Im Innenverhältnis haftet jede Partei nur bei Vorsatz oder grober Fahrlässigkeit, soweit gesetzlich zulässig. Bei leichter Fahrlässigkeit ist die Haftung auf den vorhersehbaren, vertragstypischen Schaden begrenzt. Diese Haftungsbegrenzung gilt nicht für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie nicht für Ansprüche nach dem Produkthaftungsgesetz.`,
      `(3) Bußgelder der Aufsichtsbehörden nach Art. 83 DSGVO werden im Innenverhältnis von derjenigen Partei getragen, deren konkreter Pflichtverstoß zur Verhängung des Bußgeldes geführt hat. Bei gemeinsamem Verschulden erfolgt eine anteilige Aufteilung im Verhältnis der jeweiligen Verschuldensanteile. Die Parteien informieren einander unverzüglich über behördliche Verfahren, die zu einem Bußgeld führen können, und gewähren sich vor Stellungnahmen Gelegenheit zur Mitwirkung.`,
      `(4) Soweit der Hauptvertrag zwischen den Parteien abweichende oder ergänzende Haftungsregelungen enthält, gelten diese ergänzend.`,
    ],
  });

  // § 12 — Konkrete Löschfrist 30 Tage
  blocks.push({
    id: "p12",
    number: "§ 12",
    title: "Beendigung und Rückgabe / Löschung der Daten",
    paragraphs: [
      `(1) Nach Beendigung dieses Vertrags hat der Auftragsverarbeiter alle in seinem Besitz befindlichen personenbezogenen Daten des Verantwortlichen nach dessen Wahl innerhalb einer Frist von 30 Tagen zurückzugeben oder zu löschen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen (Art. 28 Abs. 3 lit. g DSGVO). Eine längere Frist kann zwischen den Parteien einvernehmlich vereinbart werden, sofern dies aus technischen oder organisatorischen Gründen erforderlich ist.`,
      `(2) Die Löschung umfasst auch alle Sicherungskopien, sofern diese nicht aus zwingenden gesetzlichen Gründen aufbewahrt werden müssen. In diesem Fall werden die Daten so eingeschränkt, dass eine weitere Verarbeitung — außer für gesetzlich gebotene Zwecke — ausgeschlossen ist.`,
      `(3) Der Auftragsverarbeiter dokumentiert die Löschung in geeigneter Weise und bestätigt diese dem Verantwortlichen unaufgefordert spätestens 14 Tage nach Abschluss der Löschung schriftlich oder in Textform.`,
      `(4) Vorrangige gesetzliche Aufbewahrungspflichten (z.B. nach Handels- oder Steuerrecht) bleiben unberührt. Der Auftragsverarbeiter weist dem Verantwortlichen auf Verlangen die Rechtsgrundlage und Dauer der weiteren Aufbewahrung nach.`,
    ],
  });

  blocks.push({
    id: "schluss",
    number: "§ 13",
    title: "Schlussbestimmungen",
    paragraphs: [
      `(1) Sollten einzelne Bestimmungen dieses Vertrags unwirksam sein oder werden, so bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt. An die Stelle der unwirksamen Bestimmung tritt eine wirksame Bestimmung, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.`,
      `(2) Änderungen und Ergänzungen dieses Vertrags bedürfen der Schriftform oder einer dokumentierten elektronischen Form. Dies gilt auch für die Aufhebung dieses Schriftformerfordernisses.`,
      `(3) Bei Widersprüchen zwischen diesem Vertrag und sonstigen Vereinbarungen der Parteien hinsichtlich des Datenschutzes gehen die Regelungen dieses Vertrags vor. Im Übrigen gelten die Bestimmungen des zwischen den Parteien bestehenden Hauptvertrags.`,
      `(4) Gerichtsstand ist der Sitz des Verantwortlichen, soweit gesetzlich zulässig. Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.`,
      `(5) Dieser Vertrag tritt mit Unterzeichnung durch beide Parteien in Kraft.`,
    ],
  });

  return blocks;
}

/* -------------------------------------------------------------------------- */
/*  Anlagen                                                                   */
/* -------------------------------------------------------------------------- */

export function buildAnlagen(data: AvvFormData): ContractAnlage[] {
  const anlagen: ContractAnlage[] = [];

  const tomGroups = (Object.keys(TOM_KATEGORIE_LABELS) as Array<keyof typeof TOM_KATEGORIE_LABELS>).map(
    (k) => ({
      kategorie: TOM_KATEGORIE_LABELS[k].label,
      items: data.toms.filter((t) => t.kategorie === k).map((t) => t.beschreibung),
    }),
  );
  anlagen.push({
    id: "anlage1",
    title: "Anlage 1 — Technische und organisatorische Maßnahmen (Art. 32 DSGVO)",
    content: { type: "tom-table", groups: tomGroups.filter((g) => g.items.length > 0) },
  });

  if (data.subverarbeiter.length > 0) {
    anlagen.push({
      id: "anlage2",
      title: "Anlage 2 — Genehmigte Subunternehmer",
      content: {
        type: "sub-table",
        rows: data.subverarbeiter.map((s) => ({
          firma: s.firma,
          sitz: s.anschrift,
          zweck: s.zweck,
          land: landName(s.land),
          garantie: garantieText(s.sicherheitsgarantie),
        })),
      },
    });
  }

  const datenLabels = data.datenkategorien
    .map((id) => STANDARD_DATENKATEGORIEN.find((c) => c.id === id)?.label ?? id)
    .concat(data.datenkategorienCustom);
  const personenLabels = data.personenkategorien
    .map((id) => STANDARD_PERSONENKATEGORIEN.find((c) => c.id === id)?.label ?? id)
    .concat(data.personenkategorienCustom);
  anlagen.push({
    id: "anlage3",
    title: "Anlage 3 — Daten- und Personenkategorien, Verarbeitungsarten",
    content: {
      type: "data-categories",
      daten: datenLabels,
      personen: personenLabels,
      arten: data.verarbeitung.arten ?? [],
    },
  });

  return anlagen;
}

/* -------------------------------------------------------------------------- */
/*  Validation — TOM-Kategorie-Coverage + alle Pflichtfelder                  */
/* -------------------------------------------------------------------------- */

export function getCompletionStatus(data: AvvFormData) {
  const tomKategorienAbgedeckt = new Set(data.toms.map((t) => t.kategorie));
  const fehlendeTomKategorien = ALLE_TOM_KATEGORIEN.filter(
    (k) => !tomKategorienAbgedeckt.has(k),
  );

  const parteiVoll = (p: Partial<AvvFormData["auftraggeber"]>) =>
    !!p.firma && !!p.strasse && !!p.plz && !!p.ort && !!p.vertretung && !!p.email;

  const checks = {
    parteien: parteiVoll(data.auftraggeber) && parteiVoll(data.auftragnehmer),
    verarbeitung:
      !!data.verarbeitung.gegenstand &&
      (data.verarbeitung.gegenstand?.length ?? 0) >= 10 &&
      !!data.verarbeitung.zweck &&
      (data.verarbeitung.zweck?.length ?? 0) >= 10 &&
      !!data.verarbeitung.dauer &&
      (data.verarbeitung.arten?.length ?? 0) > 0,
    datenkategorien:
      data.datenkategorien.length > 0 || data.datenkategorienCustom.length > 0,
    personenkategorien:
      data.personenkategorien.length > 0 || data.personenkategorienCustom.length > 0,
    toms: fehlendeTomKategorien.length === 0,
    subverarbeiter: true,
    review: true,
  };
  const completedCount = Object.values(checks).filter(Boolean).length;
  return {
    checks,
    completedCount,
    total: Object.keys(checks).length,
    fehlendeTomKategorien,
  };
}
