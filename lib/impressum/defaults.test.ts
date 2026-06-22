import { describe, it, expect } from "vitest";
import { rechtsformConfig } from "@/lib/impressum/defaults";
import type { Rechtsform } from "@/lib/impressum/types";

describe("rechtsformConfig", () => {
  it("einzelunternehmer: nur Vorname Pflicht, kann Register, nicht juristisch", () => {
    const c = rechtsformConfig("einzelunternehmer");
    expect(c.needsVorname).toBe(true);
    expect(c.needsFirma).toBe(false);
    expect(c.kannRegister).toBe(true);
    expect(c.needsRegister).toBe(false);
    expect(c.juristisch).toBe(false);
  });

  it("kleinunternehmer: nur Vorname Pflicht, nicht juristisch", () => {
    const c = rechtsformConfig("kleinunternehmer");
    expect(c.needsVorname).toBe(true);
    expect(c.needsFirma).toBe(false);
    expect(c.kannRegister).toBe(false);
    expect(c.juristisch).toBe(false);
  });

  it("freiberufler: nur Vorname Pflicht, nicht juristisch", () => {
    const c = rechtsformConfig("freiberufler");
    expect(c.needsVorname).toBe(true);
    expect(c.juristisch).toBe(false);
  });

  it("gbr: Firma + Vertretung, juristisch, ohne Register", () => {
    const c = rechtsformConfig("gbr");
    expect(c.needsFirma).toBe(true);
    expect(c.needsVertretung).toBe(true);
    expect(c.needsRegister).toBe(false);
    expect(c.juristisch).toBe(true);
  });

  it("gmbh: Firma, Vertretung, Register, Stammkapital, juristisch", () => {
    const c = rechtsformConfig("gmbh");
    expect(c.needsFirma).toBe(true);
    expect(c.needsVertretung).toBe(true);
    expect(c.needsRegister).toBe(true);
    expect(c.needsStammkapital).toBe(true);
    expect(c.juristisch).toBe(true);
  });

  it("ug: wie gmbh (Register + Stammkapital)", () => {
    const c = rechtsformConfig("ug");
    expect(c.needsFirma).toBe(true);
    expect(c.needsVertretung).toBe(true);
    expect(c.needsRegister).toBe(true);
    expect(c.needsStammkapital).toBe(true);
    expect(c.juristisch).toBe(true);
  });

  it("ohg: Register Pflicht, aber kein Stammkapital", () => {
    const c = rechtsformConfig("ohg");
    expect(c.needsRegister).toBe(true);
    expect(c.needsStammkapital).toBe(false);
    expect(c.juristisch).toBe(true);
  });

  it("kg: Register Pflicht, aber kein Stammkapital", () => {
    const c = rechtsformConfig("kg");
    expect(c.needsRegister).toBe(true);
    expect(c.needsStammkapital).toBe(false);
    expect(c.juristisch).toBe(true);
  });

  it("ag: Register + Stammkapital + Vertretung, juristisch", () => {
    const c = rechtsformConfig("ag");
    expect(c.needsRegister).toBe(true);
    expect(c.needsStammkapital).toBe(true);
    expect(c.needsVertretung).toBe(true);
    expect(c.juristisch).toBe(true);
  });

  it("ev: Firma, Vertretung, Register, juristisch (kein Stammkapital)", () => {
    const c = rechtsformConfig("ev");
    expect(c.needsFirma).toBe(true);
    expect(c.needsVertretung).toBe(true);
    expect(c.needsRegister).toBe(true);
    expect(c.needsStammkapital).toBe(false);
    expect(c.juristisch).toBe(true);
  });

  it("stiftung: Firma + Vertretung, juristisch, ohne Register", () => {
    const c = rechtsformConfig("stiftung");
    expect(c.needsFirma).toBe(true);
    expect(c.needsVertretung).toBe(true);
    expect(c.needsRegister).toBe(false);
    expect(c.juristisch).toBe(true);
  });

  it("andere: Firma, kann Register, juristisch", () => {
    const c = rechtsformConfig("andere");
    expect(c.needsFirma).toBe(true);
    expect(c.kannRegister).toBe(true);
    expect(c.needsRegister).toBe(false);
    expect(c.juristisch).toBe(true);
  });

  it("liefert für jede Rechtsform alle erwarteten Schlüssel zurück", () => {
    const formen: Rechtsform[] = [
      "einzelunternehmer",
      "kleinunternehmer",
      "freiberufler",
      "gbr",
      "gmbh",
      "ug",
      "ohg",
      "kg",
      "ag",
      "ev",
      "stiftung",
      "andere",
    ];
    for (const rf of formen) {
      const c = rechtsformConfig(rf);
      expect(c).toHaveProperty("needsFirma");
      expect(c).toHaveProperty("needsVorname");
      expect(c).toHaveProperty("needsVertretung");
      expect(c).toHaveProperty("needsStammkapital");
      expect(c).toHaveProperty("needsRegister");
      expect(c).toHaveProperty("kannRegister");
      expect(c).toHaveProperty("juristisch");
    }
  });
});
