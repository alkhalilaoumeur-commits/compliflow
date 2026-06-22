import { describe, it, expect } from "vitest";
import { getStepIndex, getProgress } from "@/lib/agb/store";
import { WIZARD_STEPS } from "@/lib/agb/types";
import type { WizardStep } from "@/lib/agb/types";

// WIZARD_STEPS-Reihenfolge: variante, anbieter, leistung, zahlung, lieferung, haftung, review
describe("getStepIndex", () => {
  it("gibt den Index des ersten Steps zurück", () => {
    expect(getStepIndex("variante")).toBe(0);
  });

  it("gibt den Index des letzten Steps zurück", () => {
    expect(getStepIndex("review")).toBe(WIZARD_STEPS.length - 1);
  });

  it("gibt für jeden Step den korrekten Index entsprechend WIZARD_STEPS zurück", () => {
    WIZARD_STEPS.forEach((step, idx) => {
      expect(getStepIndex(step.id)).toBe(idx);
    });
  });

  it("gibt -1 für einen unbekannten Step zurück", () => {
    expect(getStepIndex("nicht_existiert" as WizardStep)).toBe(-1);
  });
});

// getProgress = ((idx + 1) / länge) * 100
describe("getProgress", () => {
  it("gibt für den ersten Step den ersten Bruchteil zurück", () => {
    expect(getProgress("variante")).toBeCloseTo((1 / WIZARD_STEPS.length) * 100);
  });

  it("gibt für den letzten Step 100% zurück", () => {
    expect(getProgress("review")).toBe(100);
  });

  it("steigt monoton über die Steps an", () => {
    const werte = WIZARD_STEPS.map((s) => getProgress(s.id));
    for (let i = 1; i < werte.length; i++) {
      expect(werte[i]).toBeGreaterThan(werte[i - 1]);
    }
  });

  it("berechnet jeden Step als ((idx+1)/länge)*100", () => {
    WIZARD_STEPS.forEach((step, idx) => {
      expect(getProgress(step.id)).toBeCloseTo(((idx + 1) / WIZARD_STEPS.length) * 100);
    });
  });

  it("gibt für einen unbekannten Step 0% zurück (idx -1)", () => {
    // idx = -1 → ((-1 + 1) / länge) * 100 = 0
    expect(getProgress("nicht_existiert" as WizardStep)).toBe(0);
  });
});
