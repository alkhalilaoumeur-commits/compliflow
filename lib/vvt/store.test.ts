import { describe, it, expect } from "vitest";
import {
  getVvtStepIndex,
  getVvtProgress,
  isUnternehmenValid,
  isTaetigkeitenValid,
} from "@/lib/vvt/store";
import { createBlankActivity, createBlankAuftraggeber } from "@/lib/vvt/templates";
import type { VvtFormData, VvtVerantwortlicher } from "@/lib/vvt/types";

// Gültige verantwortliche Stelle (alle Basis-Pflichtfelder gefüllt)
const validVerantwortlicher: Partial<VvtVerantwortlicher> = {
  bezeichnung: "Muster GmbH",
  name: "Max Mustermann",
  strasse: "Musterstr. 1",
  plz: "70599",
  ort: "Stuttgart",
  land: "Deutschland",
  email: "info@muster.de",
  hatDsb: false,
  hatEuVertreter: false,
};

function baseData(overrides: Partial<VvtFormData> = {}): VvtFormData {
  return {
    schemaVersion: 2,
    modus: "verantwortlicher",
    pflichtCheck: {
      mitarbeiter250Plus: false,
      nichtNurGelegentlich: true,
      besondereKategorien: false,
      risikoFuerBetroffene: false,
    },
    verantwortlicher: { ...validVerantwortlicher },
    auftraggeber: [],
    taetigkeiten: [],
    erstelltAm: "2026-06-18",
    letztAktualisiert: "2026-06-18",
    ...overrides,
  };
}

describe("getVvtStepIndex", () => {
  it("liefert den korrekten Index je Step", () => {
    expect(getVvtStepIndex("unternehmen")).toBe(0);
    expect(getVvtStepIndex("taetigkeiten")).toBe(1);
    expect(getVvtStepIndex("abschluss")).toBe(2);
  });

  it("liefert -1 für unbekannten Step", () => {
    // @ts-expect-error absichtlich ungültiger Wert
    expect(getVvtStepIndex("gibt-es-nicht")).toBe(-1);
  });
});

describe("getVvtProgress", () => {
  it("berechnet den Fortschritt pro Step (3 Steps)", () => {
    expect(getVvtProgress("unternehmen")).toBeCloseTo(33.333, 2);
    expect(getVvtProgress("taetigkeiten")).toBeCloseTo(66.666, 2);
    expect(getVvtProgress("abschluss")).toBe(100);
  });

  it("liefert 0 für unbekannten Step (idx -1)", () => {
    // @ts-expect-error absichtlich ungültiger Wert
    expect(getVvtProgress("gibt-es-nicht")).toBe(0);
  });
});

describe("isUnternehmenValid", () => {
  it("ist gültig, wenn alle Basis-Pflichtfelder gefüllt sind", () => {
    expect(isUnternehmenValid(baseData())).toBe(true);
  });

  it("ist ungültig, wenn ein Basis-Pflichtfeld fehlt", () => {
    const data = baseData({
      verantwortlicher: { ...validVerantwortlicher, email: "" },
    });
    expect(isUnternehmenValid(data)).toBe(false);
  });

  it("ist ungültig, wenn die Bezeichnung fehlt", () => {
    const data = baseData({
      verantwortlicher: { ...validVerantwortlicher, bezeichnung: undefined },
    });
    expect(isUnternehmenValid(data)).toBe(false);
  });

  it("ist ungültig bei aktiviertem EU-Vertreter ohne dessen Pflichtfelder", () => {
    const data = baseData({
      verantwortlicher: { ...validVerantwortlicher, hatEuVertreter: true },
    });
    expect(isUnternehmenValid(data)).toBe(false);
  });

  it("ist gültig bei aktiviertem EU-Vertreter mit vollständigen Feldern", () => {
    const data = baseData({
      verantwortlicher: {
        ...validVerantwortlicher,
        hatEuVertreter: true,
        euVertreter: {
          bezeichnung: "EU Rep Ltd",
          anschrift: "Dublin, IE",
          email: "rep@eu.example",
        },
      },
    });
    expect(isUnternehmenValid(data)).toBe(true);
  });

  it("ist ungültig bei EU-Vertreter mit unvollständigen Feldern", () => {
    const data = baseData({
      verantwortlicher: {
        ...validVerantwortlicher,
        hatEuVertreter: true,
        euVertreter: {
          bezeichnung: "EU Rep Ltd",
          anschrift: "",
          email: "rep@eu.example",
        },
      },
    });
    expect(isUnternehmenValid(data)).toBe(false);
  });

  it("ist ungültig im Auftragsverarbeiter-Modus ohne Auftraggeber", () => {
    const data = baseData({ modus: "auftragsverarbeiter", auftraggeber: [] });
    expect(isUnternehmenValid(data)).toBe(false);
  });

  it("ist gültig im Auftragsverarbeiter-Modus mit mind. 1 Auftraggeber", () => {
    const data = baseData({
      modus: "auftragsverarbeiter",
      auftraggeber: [createBlankAuftraggeber()],
    });
    expect(isUnternehmenValid(data)).toBe(true);
  });
});

describe("isTaetigkeitenValid", () => {
  it("ist ungültig ohne Tätigkeiten", () => {
    expect(isTaetigkeitenValid(baseData())).toBe(false);
  });

  it("ist gültig mit mind. einer Tätigkeit", () => {
    const data = baseData({ taetigkeiten: [createBlankActivity()] });
    expect(isTaetigkeitenValid(data)).toBe(true);
  });
});
