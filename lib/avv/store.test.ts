import { describe, it, expect } from "vitest";
import { getStepIndex, getProgress } from "@/lib/avv/store";
import { WIZARD_STEPS } from "@/lib/avv/types";

describe("getStepIndex", () => {
  it("gibt 0 für den ersten Schritt zurück", () => {
    expect(getStepIndex("parteien")).toBe(0);
  });

  it("gibt den letzten Index für den letzten Schritt zurück", () => {
    expect(getStepIndex("review")).toBe(WIZARD_STEPS.length - 1);
  });

  it("gibt den korrekten Index für einen mittleren Schritt zurück", () => {
    expect(getStepIndex("toms")).toBe(
      WIZARD_STEPS.findIndex((s) => s.id === "toms"),
    );
  });

  it("gibt -1 für einen unbekannten Schritt zurück", () => {
    // findIndex liefert -1, wenn nichts gefunden wird
    expect(getStepIndex("nichtvorhanden" as never)).toBe(-1);
  });
});

describe("getProgress", () => {
  it("gibt den Prozentanteil für den ersten Schritt zurück", () => {
    expect(getProgress("parteien")).toBeCloseTo((1 / WIZARD_STEPS.length) * 100);
  });

  it("gibt 100 für den letzten Schritt zurück", () => {
    expect(getProgress("review")).toBe(100);
  });

  it("berechnet ((idx + 1) / total) * 100 korrekt für einen mittleren Schritt", () => {
    const idx = WIZARD_STEPS.findIndex((s) => s.id === "datenkategorien");
    expect(getProgress("datenkategorien")).toBeCloseTo(
      ((idx + 1) / WIZARD_STEPS.length) * 100,
    );
  });

  it("liefert für einen unbekannten Schritt 0 (idx=-1 → 0/total)", () => {
    expect(getProgress("nichtvorhanden" as never)).toBe(0);
  });
});
