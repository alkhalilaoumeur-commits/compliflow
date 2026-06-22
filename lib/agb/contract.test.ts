import { describe, it, expect } from "vitest";
import {
  isVarianteValid,
  isAnbieterValid,
  isLeistungValid,
  isZahlungValid,
  isLieferungValid,
  isHaftungValid,
  getCompletionStatus,
  buildHtml,
  buildPlaintext,
} from "@/lib/agb/contract";
import { INITIAL_AGB } from "@/lib/agb/defaults";
import type { AgbData } from "@/lib/agb/types";

// ─────────────────────────────────────────────────────────────────────────────
// Fixture-Helper
// INITIAL_AGB ist gültig bzgl. variante/zahlung/lieferung, aber anbieter+leistung
// sind leer → daher für Happy-Path Anbieter und Leistung befüllen.
// ─────────────────────────────────────────────────────────────────────────────

function validData(over: Partial<AgbData> = {}): AgbData {
  return {
    ...INITIAL_AGB,
    anbieter: {
      ...INITIAL_AGB.anbieter,
      name: "Muster GmbH",
      strasse: "Hauptstraße 1",
      plz: "70173",
      ort: "Stuttgart",
      email: "kontakt@muster.de",
    },
    leistung: {
      ...INITIAL_AGB.leistung,
      beschreibung: "Beratungsleistungen im Bereich Digitalisierung",
    },
    ...over,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// isVarianteValid
// ─────────────────────────────────────────────────────────────────────────────

describe("isVarianteValid", () => {
  it("ist true wenn eine Variante gesetzt ist", () => {
    expect(isVarianteValid(validData())).toBe(true);
    expect(isVarianteValid(validData({ variante: "b2b" }))).toBe(true);
  });

  it("ist false wenn keine Variante gesetzt ist", () => {
    expect(isVarianteValid(validData({ variante: "" as AgbData["variante"] }))).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isAnbieterValid
// ─────────────────────────────────────────────────────────────────────────────

describe("isAnbieterValid", () => {
  it("ist true bei vollständigem Anbieter mit gültiger E-Mail", () => {
    expect(isAnbieterValid(validData())).toBe(true);
  });

  it("ist false beim leeren Initial-Anbieter", () => {
    expect(isAnbieterValid(INITIAL_AGB)).toBe(false);
  });

  it("ist false wenn der Name fehlt", () => {
    const d = validData();
    d.anbieter.name = "   ";
    expect(isAnbieterValid(d)).toBe(false);
  });

  it("ist false wenn Straße, PLZ oder Ort fehlen", () => {
    expect(isAnbieterValid(validData({ anbieter: { ...validData().anbieter, strasse: "" } }))).toBe(false);
    expect(isAnbieterValid(validData({ anbieter: { ...validData().anbieter, plz: "" } }))).toBe(false);
    expect(isAnbieterValid(validData({ anbieter: { ...validData().anbieter, ort: "" } }))).toBe(false);
  });

  it("ist false wenn die E-Mail leer ist", () => {
    expect(isAnbieterValid(validData({ anbieter: { ...validData().anbieter, email: "" } }))).toBe(false);
  });

  it("ist false bei ungültigem E-Mail-Format", () => {
    expect(isAnbieterValid(validData({ anbieter: { ...validData().anbieter, email: "keine-email" } }))).toBe(false);
    expect(isAnbieterValid(validData({ anbieter: { ...validData().anbieter, email: "a@b" } }))).toBe(false);
    expect(isAnbieterValid(validData({ anbieter: { ...validData().anbieter, email: "a@b@c.de" } }))).toBe(false);
  });

  it("ist true bei korrektem E-Mail-Format", () => {
    expect(isAnbieterValid(validData({ anbieter: { ...validData().anbieter, email: "info@example.com" } }))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isLeistungValid
// ─────────────────────────────────────────────────────────────────────────────

describe("isLeistungValid", () => {
  it("ist true wenn eine Beschreibung vorhanden ist", () => {
    expect(isLeistungValid(validData())).toBe(true);
  });

  it("ist false wenn die Beschreibung leer ist", () => {
    expect(isLeistungValid(validData({ leistung: { ...validData().leistung, beschreibung: "" } }))).toBe(false);
  });

  it("ist false wenn die Beschreibung nur aus Leerzeichen besteht", () => {
    expect(isLeistungValid(validData({ leistung: { ...validData().leistung, beschreibung: "   " } }))).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isZahlungValid
// ─────────────────────────────────────────────────────────────────────────────

describe("isZahlungValid", () => {
  it("ist true bei mindestens einer Zahlungsart und nicht-negativem Zahlungsziel", () => {
    expect(isZahlungValid(validData())).toBe(true);
  });

  it("ist false wenn keine Zahlungsart gewählt ist", () => {
    expect(isZahlungValid(validData({ zahlung: { ...validData().zahlung, arten: [] } }))).toBe(false);
  });

  it("ist false bei negativem Zahlungsziel", () => {
    expect(isZahlungValid(validData({ zahlung: { ...validData().zahlung, zahlungszielTage: -1 } }))).toBe(false);
  });

  it("ist true bei Zahlungsziel 0", () => {
    expect(isZahlungValid(validData({ zahlung: { ...validData().zahlung, zahlungszielTage: 0 } }))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isLieferungValid
// ─────────────────────────────────────────────────────────────────────────────

describe("isLieferungValid", () => {
  it("ist true für b2c_dienstleistung ohne Versand", () => {
    expect(isLieferungValid(validData())).toBe(true);
  });

  it("ist false für b2c_dienstleistung mit Versand", () => {
    expect(
      isLieferungValid(
        validData({ variante: "b2c_dienstleistung", lieferung: { ...validData().lieferung, versand: true } }),
      ),
    ).toBe(false);
  });

  it("ist true für b2c_shop ohne Versand", () => {
    expect(
      isLieferungValid(validData({ variante: "b2c_shop", lieferung: { ...validData().lieferung, versand: false } })),
    ).toBe(true);
  });

  it("ist false für b2c_shop mit Versand aber ohne Lieferzeit", () => {
    expect(
      isLieferungValid(
        validData({
          variante: "b2c_shop",
          lieferung: { ...validData().lieferung, versand: true, lieferzeitTage: "", versandkostenInfo: "5 EUR" },
        }),
      ),
    ).toBe(false);
  });

  it("ist false für b2c_shop mit Versand aber ohne Versandkosten-Info", () => {
    expect(
      isLieferungValid(
        validData({
          variante: "b2c_shop",
          lieferung: { ...validData().lieferung, versand: true, lieferzeitTage: "3-5 Tage", versandkostenInfo: "" },
        }),
      ),
    ).toBe(false);
  });

  it("ist true für b2c_shop mit vollständigen Versand-Angaben", () => {
    expect(
      isLieferungValid(
        validData({
          variante: "b2c_shop",
          lieferung: {
            ...validData().lieferung,
            versand: true,
            lieferzeitTage: "3-5 Tage",
            versandkostenInfo: "5 EUR pauschal",
          },
        }),
      ),
    ).toBe(true);
  });

  it("ist true für b2b mit vollständigen Versand-Angaben", () => {
    expect(
      isLieferungValid(
        validData({
          variante: "b2b",
          lieferung: {
            ...validData().lieferung,
            versand: true,
            lieferzeitTage: "1 Woche",
            versandkostenInfo: "nach Aufwand",
          },
        }),
      ),
    ).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isHaftungValid
// ─────────────────────────────────────────────────────────────────────────────

describe("isHaftungValid", () => {
  it("ist immer true", () => {
    expect(isHaftungValid(validData())).toBe(true);
    expect(isHaftungValid(INITIAL_AGB)).toBe(true);
    expect(isHaftungValid(validData({ variante: "b2b" }))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getCompletionStatus
// ─────────────────────────────────────────────────────────────────────────────

describe("getCompletionStatus", () => {
  it("liefert allValid=true bei vollständigen Daten", () => {
    const status = getCompletionStatus(validData());
    expect(status.allValid).toBe(true);
    expect(status.checks).toEqual({
      variante: true,
      anbieter: true,
      leistung: true,
      zahlung: true,
      lieferung: true,
      haftung: true,
      review: true,
    });
  });

  it("review-Check ist immer true", () => {
    expect(getCompletionStatus(INITIAL_AGB).checks.review).toBe(true);
  });

  it("liefert allValid=false beim leeren Initial-Datensatz", () => {
    const status = getCompletionStatus(INITIAL_AGB);
    expect(status.allValid).toBe(false);
    expect(status.checks.anbieter).toBe(false);
    expect(status.checks.leistung).toBe(false);
    // variante/zahlung/lieferung/haftung sind im Initial-Datensatz gültig
    expect(status.checks.variante).toBe(true);
    expect(status.checks.zahlung).toBe(true);
    expect(status.checks.lieferung).toBe(true);
    expect(status.checks.haftung).toBe(true);
  });

  it("spiegelt einzelne fehlerhafte Schritte wider", () => {
    const status = getCompletionStatus(
      validData({ zahlung: { ...validData().zahlung, arten: [] } }),
    );
    expect(status.checks.zahlung).toBe(false);
    expect(status.allValid).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildHtml
// ─────────────────────────────────────────────────────────────────────────────

describe("buildHtml", () => {
  it("liefert einen nicht-leeren String", () => {
    const html = buildHtml(validData());
    expect(typeof html).toBe("string");
    expect(html.length).toBeGreaterThan(0);
  });

  it("enthält Standard-Überschrift und Wrapper bei Default-Optionen", () => {
    const html = buildHtml(validData());
    expect(html).toContain("<h1>Allgemeine Geschäftsbedingungen</h1>");
    expect(html).toContain('<section class="compliflow-agb" lang="de">');
    expect(html).toContain("<!-- AGB erstellt mit Compliflow");
  });

  it("verwendet den B2B-Titel bei Variante b2b", () => {
    const html = buildHtml(validData({ variante: "b2b" }));
    expect(html).toContain("<h1>Allgemeine Geschäftsbedingungen (B2B)</h1>");
  });

  it("ersetzt den Anbieternamen-Platzhalter (kein {{ANBIETER_NAME}} mehr im Output)", () => {
    const html = buildHtml(validData());
    expect(html).toContain("Muster GmbH");
    expect(html).not.toContain("{{ANBIETER_NAME}}");
  });

  it("lässt keine offenen Template-Platzhalter übrig", () => {
    const html = buildHtml(validData());
    expect(html).not.toMatch(/\{\{[A-Z_]+\}\}/);
  });

  it("fügt den Compliflow-Credit-Backlink standardmäßig ein", () => {
    const html = buildHtml(validData());
    expect(html).toContain("compliflow-credit");
    expect(html).toContain("https://compliflow.de?ref=embed-agb");
  });

  it("lässt den Credit-Backlink bei credit:false weg", () => {
    const html = buildHtml(validData(), { credit: false });
    expect(html).not.toContain("compliflow-credit");
    expect(html).not.toContain("https://compliflow.de?ref=embed-agb");
  });

  it("lässt den section-Wrapper bei wrap:false weg", () => {
    const html = buildHtml(validData(), { wrap: false });
    expect(html).not.toContain('<section class="compliflow-agb"');
    expect(html).not.toContain("<!-- AGB erstellt mit Compliflow");
    // Inhalt ist trotzdem vorhanden
    expect(html).toContain("<h1>Allgemeine Geschäftsbedingungen</h1>");
  });

  it("enthält bei B2B-Variante die Gerichtsstand-/Schlussklausel und keinen B2C-Widerruf", () => {
    const html = buildHtml(validData({ variante: "b2b" }));
    expect(html).toContain("Schlussbestimmungen");
    // B2B → kein Widerrufs-Abschnitt
    expect(html).not.toContain("Widerrufsrecht");
  });

  it("enthält bei B2C den Widerrufs-Abschnitt", () => {
    const html = buildHtml(validData({ variante: "b2c_dienstleistung" }));
    expect(html).toContain("Widerrufsrecht");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildPlaintext
// ─────────────────────────────────────────────────────────────────────────────

describe("buildPlaintext", () => {
  it("liefert einen nicht-leeren String", () => {
    const text = buildPlaintext(validData());
    expect(typeof text).toBe("string");
    expect(text.length).toBeGreaterThan(0);
  });

  it("enthält keine HTML-Tags mehr", () => {
    const text = buildPlaintext(validData());
    expect(text).not.toMatch(/<[a-z][^>]*>/i);
    expect(text).not.toContain("</");
  });

  it("entfernt den HTML-Kommentar", () => {
    const text = buildPlaintext(validData());
    expect(text).not.toContain("<!--");
    expect(text).not.toContain("-->");
  });

  it("enthält den Titel als Klartext mit Unterstreichung", () => {
    const text = buildPlaintext(validData());
    expect(text).toContain("Allgemeine Geschäftsbedingungen");
    expect(text).toMatch(/={3,}/); // h1-Unterstreichung
  });

  it("dekodiert HTML-Entities und löst Links zu 'Text (URL)' auf", () => {
    const text = buildPlaintext(validData());
    // Credit-Link wird zu "Compliflow (https://compliflow.de?ref=embed-agb)"
    expect(text).toContain("https://compliflow.de?ref=embed-agb");
    // keine zurückbleibenden Entities
    expect(text).not.toContain("&amp;");
    expect(text).not.toContain("&quot;");
  });

  it("lässt den Credit-Hinweis bei credit:false weg", () => {
    const text = buildPlaintext(validData(), { credit: false });
    expect(text).not.toContain("compliflow.de?ref=embed-agb");
  });

  it("enthält keine offenen Template-Platzhalter", () => {
    const text = buildPlaintext(validData());
    expect(text).not.toMatch(/\{\{[A-Z_]+\}\}/);
  });
});
