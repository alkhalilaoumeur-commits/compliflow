import { describe, it, expect } from "vitest";
import { bundeslandFromPlz } from "@/lib/datenschutz/defaults";

describe("bundeslandFromPlz", () => {
  it("ordnet PLZ 01-09 Sachsen (SN) zu", () => {
    expect(bundeslandFromPlz("01067")).toBe("SN"); // Dresden
    expect(bundeslandFromPlz("09111")).toBe("SN"); // Chemnitz
  });

  it("ordnet PLZ 10-16 Berlin (BE) zu", () => {
    expect(bundeslandFromPlz("10115")).toBe("BE"); // Berlin
    expect(bundeslandFromPlz("16348")).toBe("BE");
  });

  it("ordnet PLZ 17-19 Mecklenburg-Vorpommern (MV) zu", () => {
    expect(bundeslandFromPlz("18055")).toBe("MV"); // Rostock
  });

  it("ordnet PLZ 20-25 Hamburg (HH) zu", () => {
    expect(bundeslandFromPlz("20095")).toBe("HH"); // Hamburg
  });

  it("ordnet PLZ 26-38 sowie 49 Niedersachsen (NI) zu", () => {
    expect(bundeslandFromPlz("26122")).toBe("NI"); // Oldenburg
    expect(bundeslandFromPlz("30159")).toBe("NI"); // Hannover
    expect(bundeslandFromPlz("38100")).toBe("NI"); // Braunschweig
    expect(bundeslandFromPlz("49074")).toBe("NI"); // Osnabrück
  });

  it("ordnet PLZ 39 Sachsen-Anhalt (ST) zu", () => {
    expect(bundeslandFromPlz("39104")).toBe("ST"); // Magdeburg
  });

  it("ordnet PLZ 40-48 und 50-59 NRW (NW) zu", () => {
    expect(bundeslandFromPlz("40210")).toBe("NW"); // Düsseldorf
    expect(bundeslandFromPlz("50667")).toBe("NW"); // Köln
    expect(bundeslandFromPlz("59065")).toBe("NW");
  });

  it("ordnet PLZ 60-65 Hessen (HE) zu", () => {
    expect(bundeslandFromPlz("60311")).toBe("HE"); // Frankfurt
  });

  it("ordnet PLZ 66 Saarland (SL) zu", () => {
    expect(bundeslandFromPlz("66111")).toBe("SL"); // Saarbrücken
  });

  it("ordnet PLZ 67-69 Rheinland-Pfalz (RP) zu", () => {
    expect(bundeslandFromPlz("67059")).toBe("RP"); // Ludwigshafen
  });

  it("ordnet PLZ 70-79 und 88-89 Baden-Württemberg (BW) zu", () => {
    expect(bundeslandFromPlz("70173")).toBe("BW"); // Stuttgart
    expect(bundeslandFromPlz("79098")).toBe("BW"); // Freiburg
    expect(bundeslandFromPlz("88045")).toBe("BW"); // Friedrichshafen
    expect(bundeslandFromPlz("89073")).toBe("BW"); // Ulm
  });

  it("ordnet PLZ 80-87, 90-97 Bayern (BY) zu", () => {
    expect(bundeslandFromPlz("80331")).toBe("BY"); // München
    expect(bundeslandFromPlz("90402")).toBe("BY"); // Nürnberg
    expect(bundeslandFromPlz("97070")).toBe("BY"); // Würzburg
  });

  it("ordnet PLZ 98-99 Thüringen (TH) zu", () => {
    expect(bundeslandFromPlz("99084")).toBe("TH"); // Erfurt
  });

  it("gibt UNBEKANNT bei nicht-numerischer PLZ zurück", () => {
    expect(bundeslandFromPlz("abc")).toBe("UNBEKANNT");
    expect(bundeslandFromPlz("")).toBe("UNBEKANNT");
  });

  it("gibt UNBEKANNT bei PLZ 00 zurück (keine Range trifft)", () => {
    // "00xxx" -> p === 0, keine der >=1-Bedingungen greift
    expect(bundeslandFromPlz("00123")).toBe("UNBEKANNT");
  });

  it("nutzt nur die ersten zwei Stellen der PLZ", () => {
    // slice(0,2) -> "10" egal was danach kommt
    expect(bundeslandFromPlz("10999XYZ")).toBe("BE");
  });
});
