import { describe, it, expect } from "vitest";
import { getStepIndex, getProgress } from "@/lib/widerrufsbelehrung/store";
import { WIZARD_STEPS } from "@/lib/widerrufsbelehrung/types";

describe("getStepIndex", () => {
  it("liefert 0 für den ersten Step 'anbieter'", () => {
    expect(getStepIndex("anbieter")).toBe(0);
  });

  it("liefert den letzten Index für 'review'", () => {
    expect(getStepIndex("review")).toBe(WIZARD_STEPS.length - 1);
  });

  it("liefert den korrekten Index für einen mittleren Step", () => {
    expect(getStepIndex("ausschluesse")).toBe(
      WIZARD_STEPS.findIndex((s) => s.id === "ausschluesse"),
    );
  });

  it("liefert für jeden definierten Step seinen Array-Index", () => {
    WIZARD_STEPS.forEach((s, i) => {
      expect(getStepIndex(s.id)).toBe(i);
    });
  });
});

describe("getProgress", () => {
  it("liefert für den ersten Step (1/N)*100", () => {
    expect(getProgress("anbieter")).toBeCloseTo((1 / WIZARD_STEPS.length) * 100);
  });

  it("liefert 100 für den letzten Step", () => {
    expect(getProgress("review")).toBe(100);
  });

  it("liefert monoton steigende Werte über alle Steps", () => {
    const werte = WIZARD_STEPS.map((s) => getProgress(s.id));
    for (let i = 1; i < werte.length; i++) {
      expect(werte[i]).toBeGreaterThan(werte[i - 1]);
    }
  });

  it("liefert Werte im Bereich (0, 100]", () => {
    WIZARD_STEPS.forEach((s) => {
      const p = getProgress(s.id);
      expect(p).toBeGreaterThan(0);
      expect(p).toBeLessThanOrEqual(100);
    });
  });
});
