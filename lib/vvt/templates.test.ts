import { describe, it, expect } from "vitest";
import {
  getTemplateById,
  createActivityFromTemplate,
  createBlankActivity,
  createBlankAuftraggeber,
  VVT_TEMPLATES,
} from "@/lib/vvt/templates";

describe("getTemplateById", () => {
  it("findet ein vorhandenes Template anhand gültiger ID", () => {
    const t = getTemplateById("kundenverwaltung");
    expect(t).toBeDefined();
    expect(t?.id).toBe("kundenverwaltung");
    expect(t?.bezeichnung).toBe("Kundenverwaltung / CRM");
  });

  it("gibt undefined für unbekannte ID zurück", () => {
    expect(getTemplateById("gibt-es-nicht")).toBeUndefined();
  });

  it("gibt undefined für leeren String zurück", () => {
    expect(getTemplateById("")).toBeUndefined();
  });

  it("findet jedes definierte Template", () => {
    for (const tpl of VVT_TEMPLATES) {
      expect(getTemplateById(tpl.id)).toBe(tpl);
    }
  });
});

describe("createActivityFromTemplate", () => {
  it("erzeugt eine vollständige Verarbeitungstätigkeit aus gültigem Template", () => {
    const a = createActivityFromTemplate("kundenverwaltung");
    expect(a.bezeichnung).toBe("Kundenverwaltung / CRM");
    expect(a.zweck).toContain("Kundenstammdaten");
    expect(a.rechtsgrundlagen).toEqual(["art6-1b"]);
    expect(a.besondereKategorien).toBe(false);
  });

  it("setzt eine eindeutige id mit activity-Präfix", () => {
    const a = createActivityFromTemplate("kundenverwaltung");
    expect(a.id).toMatch(/^activity-/);
  });

  it("erzeugt bei zwei Aufrufen unterschiedliche ids", () => {
    const a = createActivityFromTemplate("kundenverwaltung");
    const b = createActivityFromTemplate("kundenverwaltung");
    expect(a.id).not.toBe(b.id);
  });

  it("füllt Default-Pflichtfelder, wenn Template sie nicht setzt", () => {
    // kundenverwaltung hat keine datenherkunft/dsfaStatus/kiSysteme im Template
    const a = createActivityFromTemplate("kundenverwaltung");
    expect(a.datenherkunft).toBe("direkt");
    expect(a.dsfaStatus).toBe("nicht-erforderlich");
    expect(a.kiSysteme).toEqual([]);
  });

  it("übernimmt im Template gesetzte optionale Felder", () => {
    // webanalytics setzt datenherkunft=indirekt und dsfaStatus=nicht-erforderlich
    const a = createActivityFromTemplate("webanalytics");
    expect(a.datenherkunft).toBe("indirekt");
    expect(a.dsfaStatus).toBe("nicht-erforderlich");
  });

  it("vergibt jedem Empfänger eine neue emp-id", () => {
    const a = createActivityFromTemplate("buchhaltung");
    expect(a.empfaenger.length).toBeGreaterThan(0);
    for (const e of a.empfaenger) {
      expect(e.id).toMatch(/^emp-/);
    }
    // Felder ansonsten unverändert
    expect(a.empfaenger[0].name).toBe("Steuerberater");
  });

  it("wirft einen Fehler bei unbekanntem Template", () => {
    expect(() => createActivityFromTemplate("nope")).toThrow(
      "Template nope not found"
    );
  });
});

describe("createBlankActivity", () => {
  it("erzeugt eine leere Tätigkeit mit erwarteten Defaults", () => {
    const a = createBlankActivity();
    expect(a.id).toMatch(/^activity-/);
    expect(a.bezeichnung).toBe("");
    expect(a.zweck).toBe("");
    expect(a.rechtsgrundlagen).toEqual([]);
    expect(a.betroffenengruppen).toEqual([]);
    expect(a.datenkategorien).toEqual([]);
    expect(a.datenherkunft).toBe("direkt");
    expect(a.besondereKategorien).toBe(false);
    expect(a.empfaenger).toEqual([]);
    expect(a.drittlandGarantie).toBe("keine-uebermittlung");
    expect(a.loeschfristen).toBe("");
    expect(a.toms).toBe("");
    expect(a.dsfaStatus).toBe("nicht-erforderlich");
    expect(a.kiSysteme).toEqual([]);
  });

  it("erzeugt bei jedem Aufruf eine neue id", () => {
    expect(createBlankActivity().id).not.toBe(createBlankActivity().id);
  });
});

describe("createBlankAuftraggeber", () => {
  it("erzeugt einen leeren Auftraggeber mit erwarteten Defaults", () => {
    const a = createBlankAuftraggeber();
    expect(a.id).toMatch(/^auftraggeber-/);
    expect(a.bezeichnung).toBe("");
    expect(a.anschrift).toBe("");
    expect(a.ansprechpartner).toBe("");
    expect(a.email).toBe("");
    expect(a.hatDsb).toBe(false);
    expect(a.avvAbgeschlossen).toBe(false);
    expect(a.verarbeitungsbeschreibung).toBe("");
  });

  it("erzeugt bei jedem Aufruf eine neue id", () => {
    expect(createBlankAuftraggeber().id).not.toBe(createBlankAuftraggeber().id);
  });
});
