import { describe, it, expect } from "vitest";
import { getStepIndex, getProgress } from "@/lib/impressum/store";
import { WIZARD_STEPS } from "@/lib/impressum/types";

describe("getStepIndex", () => {
  it("liefert 0 für den ersten Step (anbieter)", () => {
    expect(getStepIndex("anbieter")).toBe(0);
  });

  it("liefert den letzten Index für review", () => {
    expect(getStepIndex("review")).toBe(WIZARD_STEPS.length - 1);
  });

  it("liefert den korrekten Index für jeden definierten Step", () => {
    WIZARD_STEPS.forEach((s, i) => {
      expect(getStepIndex(s.id)).toBe(i);
    });
  });

  it("liefert -1 für einen unbekannten Step", () => {
    // @ts-expect-error: bewusst ungültiger Wert für Edge-Case
    expect(getStepIndex("gibtsnicht")).toBe(-1);
  });
});

describe("getProgress", () => {
  it("liefert für den ersten Step 1/n * 100", () => {
    const expected = (1 / WIZARD_STEPS.length) * 100;
    expect(getProgress("anbieter")).toBeCloseTo(expected);
  });

  it("liefert 100% für den letzten Step (review)", () => {
    expect(getProgress("review")).toBeCloseTo(100);
  });

  it("steigt monoton über die Steps an", () => {
    let prev = -1;
    for (const s of WIZARD_STEPS) {
      const p = getProgress(s.id);
      expect(p).toBeGreaterThan(prev);
      prev = p;
    }
  });

  it("bleibt im Bereich (0, 100]", () => {
    for (const s of WIZARD_STEPS) {
      const p = getProgress(s.id);
      expect(p).toBeGreaterThan(0);
      expect(p).toBeLessThanOrEqual(100);
    }
  });
});
