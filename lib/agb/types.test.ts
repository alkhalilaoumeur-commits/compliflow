import { describe, it, expect } from "vitest";
import { isDigitaleArt, isDauerschuldArt } from "@/lib/agb/types";
import type { LeistungsArt } from "@/lib/agb/types";

// isDigitaleArt → true für: saas, digital_download, abo_service, fortbildung
describe("isDigitaleArt", () => {
  it("ist true für digitale Leistungsarten", () => {
    expect(isDigitaleArt("saas")).toBe(true);
    expect(isDigitaleArt("digital_download")).toBe(true);
    expect(isDigitaleArt("abo_service")).toBe(true);
    expect(isDigitaleArt("fortbildung")).toBe(true);
  });

  it("ist false für nicht-digitale Leistungsarten", () => {
    expect(isDigitaleArt("beratung")).toBe(false);
    expect(isDigitaleArt("coaching")).toBe(false);
    expect(isDigitaleArt("agentur")).toBe(false);
    expect(isDigitaleArt("physisch")).toBe(false);
    expect(isDigitaleArt("individuell")).toBe(false);
  });

  it("klassifiziert jede LeistungsArt eindeutig", () => {
    const alle: LeistungsArt[] = [
      "beratung",
      "coaching",
      "agentur",
      "fortbildung",
      "saas",
      "physisch",
      "digital_download",
      "abo_service",
      "individuell",
    ];
    const digital = alle.filter(isDigitaleArt);
    expect(digital.sort()).toEqual(
      ["abo_service", "digital_download", "fortbildung", "saas"].sort(),
    );
  });
});

// isDauerschuldArt → true für: saas, abo_service, coaching
describe("isDauerschuldArt", () => {
  it("ist true für Dauerschuld-Leistungsarten", () => {
    expect(isDauerschuldArt("saas")).toBe(true);
    expect(isDauerschuldArt("abo_service")).toBe(true);
    expect(isDauerschuldArt("coaching")).toBe(true);
  });

  it("ist false für übrige Leistungsarten", () => {
    expect(isDauerschuldArt("beratung")).toBe(false);
    expect(isDauerschuldArt("agentur")).toBe(false);
    expect(isDauerschuldArt("fortbildung")).toBe(false);
    expect(isDauerschuldArt("physisch")).toBe(false);
    expect(isDauerschuldArt("digital_download")).toBe(false);
    expect(isDauerschuldArt("individuell")).toBe(false);
  });

  it("unterscheidet sich von isDigitaleArt (fortbildung ist digital, aber kein Dauerschuld)", () => {
    expect(isDigitaleArt("fortbildung")).toBe(true);
    expect(isDauerschuldArt("fortbildung")).toBe(false);
    // coaching ist Dauerschuld, aber nicht digital
    expect(isDauerschuldArt("coaching")).toBe(true);
    expect(isDigitaleArt("coaching")).toBe(false);
  });
});
