import { describe, it, expect } from "vitest";
import { evaluierePflicht } from "@/lib/vvt/types";
import type { PflichtCheck } from "@/lib/vvt/types";

// Basis: alle Flags false -> nicht pflichtig
const allFalse: PflichtCheck = {
  mitarbeiter250Plus: false,
  nichtNurGelegentlich: false,
  besondereKategorien: false,
  risikoFuerBetroffene: false,
};

describe("evaluierePflicht", () => {
  it("ist nicht pflichtig, wenn kein Kriterium zutrifft", () => {
    const res = evaluierePflicht(allFalse);
    expect(res.istPflichtig).toBe(false);
    expect(res.grund).toContain("Art. 30 Abs. 5");
  });

  it("ist pflichtig bei ≥250 Mitarbeitern (höchste Priorität)", () => {
    const res = evaluierePflicht({ ...allFalse, mitarbeiter250Plus: true });
    expect(res.istPflichtig).toBe(true);
    expect(res.grund).toContain("≥250");
  });

  it("≥250 MA hat Vorrang vor anderen Kriterien (Reihenfolge im Code)", () => {
    const res = evaluierePflicht({
      mitarbeiter250Plus: true,
      nichtNurGelegentlich: true,
      besondereKategorien: true,
      risikoFuerBetroffene: true,
    });
    expect(res.istPflichtig).toBe(true);
    // Grund muss der MA-Grund sein, da zuerst geprüft
    expect(res.grund).toContain("≥250");
  });

  it("ist pflichtig bei besonderen Kategorien (Art. 9)", () => {
    const res = evaluierePflicht({ ...allFalse, besondereKategorien: true });
    expect(res.istPflichtig).toBe(true);
    expect(res.grund).toContain("Art. 9");
  });

  it("besondereKategorien hat Vorrang vor Risiko und Gelegentlichkeit", () => {
    const res = evaluierePflicht({
      mitarbeiter250Plus: false,
      nichtNurGelegentlich: true,
      besondereKategorien: true,
      risikoFuerBetroffene: true,
    });
    expect(res.grund).toContain("Art. 9");
  });

  it("ist pflichtig bei Risiko für Betroffene", () => {
    const res = evaluierePflicht({ ...allFalse, risikoFuerBetroffene: true });
    expect(res.istPflichtig).toBe(true);
    expect(res.grund).toContain("Risiko für die Rechte");
  });

  it("risikoFuerBetroffene hat Vorrang vor nichtNurGelegentlich", () => {
    const res = evaluierePflicht({
      mitarbeiter250Plus: false,
      nichtNurGelegentlich: true,
      besondereKategorien: false,
      risikoFuerBetroffene: true,
    });
    expect(res.grund).toContain("Risiko für die Rechte");
  });

  it("ist pflichtig bei nicht nur gelegentlicher Verarbeitung", () => {
    const res = evaluierePflicht({ ...allFalse, nichtNurGelegentlich: true });
    expect(res.istPflichtig).toBe(true);
    expect(res.grund).toContain("nicht nur gelegentlich");
  });
});
