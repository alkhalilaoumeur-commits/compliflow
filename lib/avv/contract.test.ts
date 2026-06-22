import { describe, it, expect } from "vitest";
import {
  buildContract,
  buildAnlagen,
  getCompletionStatus,
} from "@/lib/avv/contract";
import type { AvvFormData, Tom, Subverarbeiter } from "@/lib/avv/types";

/* -------------------------------------------------------------------------- */
/*  Fixture — minimal valides AvvFormData (kein Default-Objekt im Code        */
/*  vorhanden, daher hier aus den Typen aufgebaut).                           */
/* -------------------------------------------------------------------------- */

function vollePartei() {
  return {
    firma: "Beispiel GmbH",
    strasse: "Hauptstr. 1",
    plz: "70599",
    ort: "Stuttgart",
    land: "Deutschland",
    vertretung: "Max Muster",
    email: "max@beispiel.de",
  };
}

// Genau eine TOM pro Kategorie → volle Coverage
const ALLE_TOMS: Tom[] = [
  { id: "t1", kategorie: "zutritt", beschreibung: "Zutrittskontrolle aktiv" },
  { id: "t2", kategorie: "zugang", beschreibung: "Zugangskontrolle aktiv" },
  { id: "t3", kategorie: "zugriff", beschreibung: "Zugriffskontrolle aktiv" },
  { id: "t4", kategorie: "weitergabe", beschreibung: "Weitergabekontrolle aktiv" },
  { id: "t5", kategorie: "eingabe", beschreibung: "Eingabekontrolle aktiv" },
  { id: "t6", kategorie: "auftrag", beschreibung: "Auftragskontrolle aktiv" },
  { id: "t7", kategorie: "verfuegbarkeit", beschreibung: "Verfuegbarkeit aktiv" },
  { id: "t8", kategorie: "trennung", beschreibung: "Trennungskontrolle aktiv" },
];

function baseData(): AvvFormData {
  return {
    schemaVersion: 1,
    auftraggeber: vollePartei(),
    auftragnehmer: vollePartei(),
    verarbeitung: {
      gegenstand: "Hosting und Betrieb der Kundenanwendung",
      dauer: { typ: "unbefristet" },
      zweck: "Bereitstellung der vertraglich vereinbarten Leistungen",
      arten: ["Speichern", "Auslesen"],
    },
    datenkategorien: ["kontakt"],
    datenkategorienCustom: [],
    personenkategorien: ["kunden"],
    personenkategorienCustom: [],
    toms: ALLE_TOMS,
    subverarbeiter: [],
    abschlussDatum: "2026-06-18",
    abschlussOrt: "Stuttgart",
  };
}

/* -------------------------------------------------------------------------- */
/*  buildContract                                                             */
/* -------------------------------------------------------------------------- */

describe("buildContract", () => {
  it("gibt ein Array von ContractBlocks mit korrekter Struktur zurück", () => {
    const blocks = buildContract(baseData());
    expect(Array.isArray(blocks)).toBe(true);
    expect(blocks.length).toBeGreaterThan(0);
    for (const b of blocks) {
      expect(typeof b.id).toBe("string");
      expect(typeof b.number).toBe("string");
      expect(typeof b.title).toBe("string");
      expect(Array.isArray(b.paragraphs)).toBe(true);
    }
  });

  it("enthält Präambel und die Standard-Paragraphen §1 bis §13", () => {
    const ids = buildContract(baseData()).map((b) => b.id);
    expect(ids).toContain("praeambel");
    expect(ids).toContain("p1");
    expect(ids).toContain("p6");
    expect(ids).toContain("p12");
    expect(ids).toContain("schluss");
  });

  it("fügt KEINEN §6a hinzu, wenn der Auftragnehmer in der EU/EWR sitzt", () => {
    const ids = buildContract(baseData()).map((b) => b.id);
    expect(ids).not.toContain("p6a");
  });

  it("fügt §6a hinzu, wenn der Auftragnehmer in einem Drittland sitzt", () => {
    const data = baseData();
    data.auftragnehmer = { ...vollePartei(), land: "USA" };
    const ids = buildContract(data).map((b) => b.id);
    expect(ids).toContain("p6a");
  });

  it("nutzt im §2 den Satz für besondere Datenkategorien, wenn eine ausgewählt ist", () => {
    const data = baseData();
    data.datenkategorien = ["gesundheit"]; // besondereKategorie: true
    const p2 = buildContract(data).find((b) => b.id === "p2")!;
    expect(p2.paragraphs[1]).toContain("besondere Kategorien personenbezogener Daten");
    expect(p2.paragraphs[1]).toContain("Art. 9");
  });

  it("nutzt im §2 den Negativ-Satz, wenn keine besondere Kategorie ausgewählt ist", () => {
    const p2 = buildContract(baseData()).find((b) => b.id === "p2")!;
    expect(p2.paragraphs[1]).toContain("keine besonderen Kategorien");
  });

  it("verwendet im §6 den Text für vorhandene Subverarbeiter, wenn welche existieren", () => {
    const data = baseData();
    const sub: Subverarbeiter = {
      id: "s1",
      firma: "Hetzner Online GmbH",
      anschrift: "Gunzenhausen",
      zweck: "Hosting",
      land: "DE",
      sicherheitsgarantie: "EU-EWR",
    };
    data.subverarbeiter = [sub];
    const p6 = buildContract(data).find((b) => b.id === "p6")!;
    expect(p6.paragraphs[0]).toContain("Anlage 2 aufgeführten Subunternehmer");
  });

  it("verwendet im §6 den Negativ-Text, wenn keine Subverarbeiter existieren", () => {
    const p6 = buildContract(baseData()).find((b) => b.id === "p6")!;
    expect(p6.paragraphs[0]).toContain("derzeit nicht vorgesehen");
  });

  it("fällt bei fehlenden Pflichtfeldern auf Platzhalter '—' zurück, ohne zu crashen", () => {
    const data = baseData();
    data.verarbeitung = { dauer: { typ: "unbefristet" } } as AvvFormData["verarbeitung"];
    data.datenkategorien = [];
    data.personenkategorien = [];
    const blocks = buildContract(data);
    const p1 = blocks.find((b) => b.id === "p1")!;
    expect(p1.paragraphs[0]).toContain("—");
  });
});

/* -------------------------------------------------------------------------- */
/*  buildAnlagen                                                              */
/* -------------------------------------------------------------------------- */

describe("buildAnlagen", () => {
  it("gibt ohne Subverarbeiter genau Anlage 1 und Anlage 3 zurück", () => {
    const ids = buildAnlagen(baseData()).map((a) => a.id);
    expect(ids).toContain("anlage1");
    expect(ids).toContain("anlage3");
    expect(ids).not.toContain("anlage2");
  });

  it("fügt Anlage 2 hinzu, wenn Subverarbeiter vorhanden sind", () => {
    const data = baseData();
    data.subverarbeiter = [
      {
        id: "s1",
        firma: "Hetzner Online GmbH",
        anschrift: "Gunzenhausen",
        zweck: "Hosting",
        land: "DE",
        sicherheitsgarantie: "EU-EWR",
      },
    ];
    const anlagen = buildAnlagen(data);
    const anlage2 = anlagen.find((a) => a.id === "anlage2")!;
    expect(anlage2).toBeDefined();
    expect(anlage2.content.type).toBe("sub-table");
    if (anlage2.content.type === "sub-table") {
      expect(anlage2.content.rows[0].firma).toBe("Hetzner Online GmbH");
      // Ländercode DE wird in den Klarnamen aufgelöst
      expect(anlage2.content.rows[0].land).toBe("Deutschland");
      expect(anlage2.content.rows[0].garantie).toBe("innerhalb EU/EWR");
    }
  });

  it("Anlage 1 enthält nur TOM-Gruppen mit mindestens einem Eintrag", () => {
    const data = baseData();
    data.toms = [
      { id: "t1", kategorie: "zutritt", beschreibung: "Nur Zutritt" },
    ];
    const anlage1 = buildAnlagen(data).find((a) => a.id === "anlage1")!;
    expect(anlage1.content.type).toBe("tom-table");
    if (anlage1.content.type === "tom-table") {
      expect(anlage1.content.groups.length).toBe(1);
      expect(anlage1.content.groups[0].items).toContain("Nur Zutritt");
    }
  });

  it("Anlage 3 enthält die aufgelösten Daten-, Personen- und Verarbeitungs-Labels", () => {
    const anlage3 = buildAnlagen(baseData()).find((a) => a.id === "anlage3")!;
    expect(anlage3.content.type).toBe("data-categories");
    if (anlage3.content.type === "data-categories") {
      expect(anlage3.content.daten).toContain("Kontaktdaten");
      expect(anlage3.content.personen).toContain("Kunden");
      expect(anlage3.content.arten).toEqual(["Speichern", "Auslesen"]);
    }
  });

  it("hängt Custom-Kategorien an die Standard-Labels an", () => {
    const data = baseData();
    data.datenkategorienCustom = ["Spezialdaten X"];
    const anlage3 = buildAnlagen(data).find((a) => a.id === "anlage3")!;
    if (anlage3.content.type === "data-categories") {
      expect(anlage3.content.daten).toContain("Kontaktdaten");
      expect(anlage3.content.daten).toContain("Spezialdaten X");
    }
  });
});

/* -------------------------------------------------------------------------- */
/*  getCompletionStatus                                                       */
/* -------------------------------------------------------------------------- */

describe("getCompletionStatus", () => {
  it("meldet alle Schritte als abgeschlossen für ein vollständiges Datenobjekt", () => {
    const status = getCompletionStatus(baseData());
    expect(status.checks.parteien).toBe(true);
    expect(status.checks.verarbeitung).toBe(true);
    expect(status.checks.datenkategorien).toBe(true);
    expect(status.checks.personenkategorien).toBe(true);
    expect(status.checks.toms).toBe(true);
    expect(status.checks.subverarbeiter).toBe(true);
    expect(status.checks.review).toBe(true);
    expect(status.fehlendeTomKategorien).toEqual([]);
    expect(status.completedCount).toBe(status.total);
    expect(status.total).toBe(7);
  });

  it("meldet parteien=false, wenn ein Pflichtfeld einer Partei fehlt", () => {
    const data = baseData();
    data.auftraggeber = { ...vollePartei(), email: "" };
    const status = getCompletionStatus(data);
    expect(status.checks.parteien).toBe(false);
    expect(status.completedCount).toBeLessThan(status.total);
  });

  it("meldet verarbeitung=false, wenn Gegenstand zu kurz ist (<10 Zeichen)", () => {
    const data = baseData();
    data.verarbeitung = { ...baseData().verarbeitung, gegenstand: "kurz" };
    expect(getCompletionStatus(data).checks.verarbeitung).toBe(false);
  });

  it("meldet verarbeitung=false, wenn keine Verarbeitungsart gewählt ist", () => {
    const data = baseData();
    data.verarbeitung = { ...baseData().verarbeitung, arten: [] };
    expect(getCompletionStatus(data).checks.verarbeitung).toBe(false);
  });

  it("akzeptiert datenkategorien auch wenn nur Custom-Einträge vorhanden sind", () => {
    const data = baseData();
    data.datenkategorien = [];
    data.datenkategorienCustom = ["Eigene Kategorie"];
    expect(getCompletionStatus(data).checks.datenkategorien).toBe(true);
  });

  it("meldet datenkategorien=false, wenn weder Standard noch Custom gesetzt ist", () => {
    const data = baseData();
    data.datenkategorien = [];
    data.datenkategorienCustom = [];
    expect(getCompletionStatus(data).checks.datenkategorien).toBe(false);
  });

  it("listet fehlende TOM-Kategorien auf und setzt toms=false", () => {
    const data = baseData();
    data.toms = [{ id: "t1", kategorie: "zutritt", beschreibung: "Nur Zutritt" }];
    const status = getCompletionStatus(data);
    expect(status.checks.toms).toBe(false);
    expect(status.fehlendeTomKategorien).not.toContain("zutritt");
    expect(status.fehlendeTomKategorien).toContain("zugang");
    expect(status.fehlendeTomKategorien.length).toBe(7);
  });

  it("hat subverarbeiter und review immer auf true (optionale Schritte)", () => {
    const data = baseData();
    data.subverarbeiter = [];
    const status = getCompletionStatus(data);
    expect(status.checks.subverarbeiter).toBe(true);
    expect(status.checks.review).toBe(true);
  });
});
