import { describe, it, expect } from "vitest";
import { renderVvtPdf } from "@/lib/vvt/pdf/vvt-document";
import { createBlankActivity } from "@/lib/vvt/templates";
import type { VvtFormData } from "@/lib/vvt/types";

// renderVvtPdf erzeugt direkt einen PDF-Blob. Wir rendern beide Varianten
// (mit/ohne Credit) real und prüfen, dass beide ein gültiges PDF liefern und
// dass der showCredit-Schalter die Ausgabe tatsächlich verändert.
const fixture: VvtFormData = {
  schemaVersion: 2,
  modus: "verantwortlicher",
  pflichtCheck: {
    mitarbeiter250Plus: false,
    nichtNurGelegentlich: true,
    besondereKategorien: false,
    risikoFuerBetroffene: false,
  },
  verantwortlicher: {
    land: "Deutschland",
    hatDsb: false,
    hatEuVertreter: false,
    bezeichnung: "Test GmbH",
    name: "Max Mustermann",
    strasse: "Musterstraße 1",
    plz: "70599",
    ort: "Stuttgart",
    email: "max@example.de",
  },
  auftraggeber: [],
  taetigkeiten: [createBlankActivity()],
  erstelltAm: "2026-06-22",
  letztAktualisiert: "2026-06-22",
};

describe("renderVvtPdf — Watermark/Credit", () => {
  it("erzeugt ein nicht-leeres PDF mit Credit (Default)", async () => {
    const blob = await renderVvtPdf(fixture);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it("erzeugt ein nicht-leeres PDF ohne Credit (showCredit=false)", async () => {
    const blob = await renderVvtPdf(fixture, false);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it("der showCredit-Schalter verändert die PDF-Ausgabe", async () => {
    const withCredit = await renderVvtPdf(fixture, true);
    const withoutCredit = await renderVvtPdf(fixture, false);
    expect(withCredit.size).not.toBe(withoutCredit.size);
  });
});
