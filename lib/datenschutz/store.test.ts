import { describe, it, expect } from "vitest";
import { getStepIndex, getProgress } from "@/lib/datenschutz/store";
import { WIZARD_STEPS } from "@/lib/datenschutz/types";

describe("getStepIndex", () => {
  it("gibt 0 für den ersten Step zurück", () => {
    expect(getStepIndex("verantwortlicher")).toBe(0);
  });

  it("gibt den letzten Index für den Review-Step zurück", () => {
    expect(getStepIndex("review")).toBe(WIZARD_STEPS.length - 1);
  });

  it("gibt für jeden Step den korrekten Index laut WIZARD_STEPS zurück", () => {
    WIZARD_STEPS.forEach((s, i) => {
      expect(getStepIndex(s.id)).toBe(i);
    });
  });

  it("gibt -1 für einen unbekannten Step zurück", () => {
    // findIndex liefert -1, wenn kein Step matcht
    expect(getStepIndex("gibt_es_nicht" as never)).toBe(-1);
  });
});

describe("getProgress", () => {
  it("berechnet den Fortschritt für den ersten Step", () => {
    // (0 + 1) / 12 * 100
    expect(getProgress("verantwortlicher")).toBeCloseTo((1 / WIZARD_STEPS.length) * 100);
  });

  it("gibt 100% für den letzten Step zurück", () => {
    expect(getProgress("review")).toBe(100);
  });

  it("steigt monoton von Step zu Step", () => {
    const werte = WIZARD_STEPS.map((s) => getProgress(s.id));
    for (let i = 1; i < werte.length; i++) {
      expect(werte[i]).toBeGreaterThan(werte[i - 1]);
    }
  });

  it("liefert konsistente Werte mit getStepIndex", () => {
    WIZARD_STEPS.forEach((s) => {
      const erwartet = ((getStepIndex(s.id) + 1) / WIZARD_STEPS.length) * 100;
      expect(getProgress(s.id)).toBe(erwartet);
    });
  });
});
