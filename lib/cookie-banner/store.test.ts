import { describe, it, expect } from "vitest";
import { getStepIndex, getProgress } from "@/lib/cookie-banner/store";
import { WIZARD_STEPS } from "@/lib/cookie-banner/types";

// ─────────────────────────────────────────────────────────────────────────────
// getStepIndex — Reine Funktion, kein Zugriff auf den zustand-Hook
// ─────────────────────────────────────────────────────────────────────────────

describe("getStepIndex", () => {
  it("liefert 0 für den ersten Step (anbieter)", () => {
    expect(getStepIndex("anbieter")).toBe(0);
  });

  it("liefert den letzten Index für den letzten Step (review)", () => {
    expect(getStepIndex("review")).toBe(WIZARD_STEPS.length - 1);
  });

  it("liefert den korrekten Index für jeden definierten Step", () => {
    WIZARD_STEPS.forEach((step, i) => {
      expect(getStepIndex(step.id)).toBe(i);
    });
  });

  it("liefert -1 für einen unbekannten Step", () => {
    // @ts-expect-error — bewusst ungültiger Wert für Edge-Case
    expect(getStepIndex("gibtsnicht")).toBe(-1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getProgress
// ─────────────────────────────────────────────────────────────────────────────

describe("getProgress", () => {
  it("liefert beim ersten Step (1/N)*100", () => {
    expect(getProgress("anbieter")).toBeCloseTo((1 / WIZARD_STEPS.length) * 100);
  });

  it("liefert 100 beim letzten Step", () => {
    expect(getProgress("review")).toBe(100);
  });

  it("steigt monoton von Step zu Step", () => {
    let prev = -1;
    for (const step of WIZARD_STEPS) {
      const p = getProgress(step.id);
      expect(p).toBeGreaterThan(prev);
      prev = p;
    }
  });

  it("liefert für jeden Step den erwarteten Prozentwert", () => {
    WIZARD_STEPS.forEach((step, i) => {
      expect(getProgress(step.id)).toBeCloseTo(((i + 1) / WIZARD_STEPS.length) * 100);
    });
  });

  it("liefert 0 für einen unbekannten Step (idx -1 → (0/N)*100)", () => {
    // @ts-expect-error — bewusst ungültiger Wert für Edge-Case
    expect(getProgress("gibtsnicht")).toBe(0);
  });
});
