import { describe, it, expect } from "vitest";
import {
  isAnbieterValid,
  isLeistungValid,
  isAusschluesseValid,
  isRueckgabeValid,
  getCompletionStatus,
  buildHtml,
  buildPlaintext,
} from "@/lib/widerrufsbelehrung/contract";
import { INITIAL_WIDERRUF } from "@/lib/widerrufsbelehrung/defaults";
import type { WiderrufData } from "@/lib/widerrufsbelehrung/types";

// Vollständig valides Fixture: INITIAL_WIDERRUF + ausgefüllter Anbieter.
// INITIAL_WIDERRUF hat leeren Anbieter, daher isAnbieterValid=false ab Werk.
function validData(): WiderrufData {
  return {
    ...INITIAL_WIDERRUF,
    anbieter: {
      ...INITIAL_WIDERRUF.anbieter,
      name: "Muster GmbH",
      strasse: "Musterstr. 1",
      plz: "70173",
      ort: "Stuttgart",
      email: "kontakt@muster.de",
    },
  };
}

describe("isAnbieterValid", () => {
  it("ist true bei vollständigem, gültigem Anbieter", () => {
    expect(isAnbieterValid(validData())).toBe(true);
  });

  it("ist false bei leerem INITIAL_WIDERRUF (kein Name etc.)", () => {
    expect(isAnbieterValid(INITIAL_WIDERRUF)).toBe(false);
  });

  it("ist false bei fehlendem Namen", () => {
    const d = validData();
    d.anbieter.name = "   ";
    expect(isAnbieterValid(d)).toBe(false);
  });

  it("ist false bei fehlender Adresse (strasse/plz/ort)", () => {
    const d1 = validData();
    d1.anbieter.strasse = "";
    expect(isAnbieterValid(d1)).toBe(false);

    const d2 = validData();
    d2.anbieter.plz = "";
    expect(isAnbieterValid(d2)).toBe(false);

    const d3 = validData();
    d3.anbieter.ort = "";
    expect(isAnbieterValid(d3)).toBe(false);
  });

  it("ist false bei leerer E-Mail", () => {
    const d = validData();
    d.anbieter.email = "";
    expect(isAnbieterValid(d)).toBe(false);
  });

  it("ist false bei ungültigem E-Mail-Format", () => {
    const d = validData();
    d.anbieter.email = "keine-email";
    expect(isAnbieterValid(d)).toBe(false);
  });
});

describe("isLeistungValid", () => {
  it("ist true bei gesetztem Leistungstyp und fristTage >= 14", () => {
    expect(isLeistungValid(validData())).toBe(true);
  });

  it("ist false bei fristTage < 14", () => {
    const d = validData();
    d.fristTage = 7;
    expect(isLeistungValid(d)).toBe(false);
  });

  it("ist true bei fristTage genau 14 (Untergrenze)", () => {
    const d = validData();
    d.fristTage = 14;
    expect(isLeistungValid(d)).toBe(true);
  });

  it("ist false ohne Leistungstyp", () => {
    const d = validData();
    // leistungstyp ist im echten Typ Pflicht, fehlender Wert wird wie falsy behandelt
    (d as unknown as { leistungstyp: undefined }).leistungstyp = undefined;
    expect(isLeistungValid(d)).toBe(false);
  });
});

describe("isAusschluesseValid", () => {
  it("ist immer true (optionaler Schritt)", () => {
    expect(isAusschluesseValid(validData())).toBe(true);
    expect(isAusschluesseValid(INITIAL_WIDERRUF)).toBe(true);
  });
});

describe("isRueckgabeValid", () => {
  it("ist true bei Default-Rückgabe (keine abweichende Adresse, kein Sperrgut)", () => {
    expect(isRueckgabeValid(validData())).toBe(true);
  });

  it("ist false bei abweichender Adresse ohne vollständige Felder", () => {
    const d = validData();
    d.rueckgabe.abweichendeAdresse = true;
    expect(isRueckgabeValid(d)).toBe(false);
  });

  it("ist true bei abweichender Adresse mit allen Feldern", () => {
    const d = validData();
    d.rueckgabe.abweichendeAdresse = true;
    d.rueckgabe.rueckgabeName = "Lager GmbH";
    d.rueckgabe.rueckgabeStrasse = "Logistikweg 5";
    d.rueckgabe.rueckgabePlz = "12345";
    d.rueckgabe.rueckgabeOrt = "Berlin";
    expect(isRueckgabeValid(d)).toBe(true);
  });

  it("ist false bei Sperrgut ohne geschätzte Kosten", () => {
    const d = validData();
    d.rueckgabe.sperrgut = true;
    expect(isRueckgabeValid(d)).toBe(false);
  });

  it("ist true bei Sperrgut mit geschätzten Kosten", () => {
    const d = validData();
    d.rueckgabe.sperrgut = true;
    d.rueckgabe.geschaetzteKosten = "50 EUR";
    expect(isRueckgabeValid(d)).toBe(true);
  });
});

describe("getCompletionStatus", () => {
  it("liefert allValid=true bei vollständigem Datensatz", () => {
    const status = getCompletionStatus(validData());
    expect(status.allValid).toBe(true);
    expect(status.checks.anbieter).toBe(true);
    expect(status.checks.leistung).toBe(true);
    expect(status.checks.ausschluesse).toBe(true);
    expect(status.checks.rueckgabe).toBe(true);
    expect(status.checks.review).toBe(true);
  });

  it("liefert allValid=false bei unvollständigem Anbieter", () => {
    const status = getCompletionStatus(INITIAL_WIDERRUF);
    expect(status.allValid).toBe(false);
    expect(status.checks.anbieter).toBe(false);
  });

  it("review ist immer true", () => {
    expect(getCompletionStatus(INITIAL_WIDERRUF).checks.review).toBe(true);
  });
});

describe("buildHtml", () => {
  it("erzeugt einen nicht-leeren String mit section-Wrapper und Überschrift", () => {
    const html = buildHtml(validData());
    expect(typeof html).toBe("string");
    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain("Widerrufsbelehrung");
    expect(html).toContain('<section class="compliflow-widerruf"');
  });

  it("fügt standardmäßig den Compliflow-Credit-Backlink ein", () => {
    const html = buildHtml(validData());
    expect(html).toContain("compliflow-credit");
    expect(html).toContain("https://compliflow.de?ref=embed-widerruf");
  });

  it("lässt den Credit-Backlink bei credit:false weg", () => {
    const html = buildHtml(validData(), { credit: false });
    expect(html).not.toContain("compliflow-credit");
    expect(html).not.toContain("ref=embed-widerruf");
  });

  it("lässt den section-Wrapper bei wrap:false weg", () => {
    const html = buildHtml(validData(), { wrap: false });
    expect(html).not.toContain('<section class="compliflow-widerruf"');
    expect(html).toContain("Widerrufsbelehrung");
  });

  it("inkludiert das Musterformular bei includeMusterformular:true", () => {
    // Eindeutige Zeile aus dem Musterformular-Body (kommt nur dort vor, nicht im Ausuebung-Absatz)
    const html = buildHtml(validData(), { includeMusterformular: true });
    expect(html).toContain("Unzutreffendes streichen");
    expect(html).toContain("<h2>Muster-Widerrufsformular</h2>");
  });

  it("lässt das Musterformular bei includeMusterformular:false weg", () => {
    const html = buildHtml(validData(), { includeMusterformular: false });
    expect(html).not.toContain("Unzutreffendes streichen");
    expect(html).not.toContain("<h2>Muster-Widerrufsformular</h2>");
  });

  it("zeigt bei B2B (istB2C=false) den Kein-Widerrufsrecht-Hinweis", () => {
    const d = validData();
    d.istB2C = false;
    const html = buildHtml(d);
    expect(html).toContain("Hinweis zum Widerrufsrecht");
    expect(html).toContain("KEIN gesetzliches Widerrufsrecht");
    // B2B-Zweig zeigt keinen Folgen-Abschnitt
    expect(html).not.toContain("Folgen des Widerrufs");
  });

  it("listet aktivierte Ausschlussgründe auf", () => {
    const d = validData();
    d.ausschluesse = ["massgefertigt"];
    const html = buildHtml(d);
    expect(html).toContain("Hinweis zum Ausschluss des Widerrufsrechts");
    expect(html).toContain("Maßgefertigte Ware");
  });
});

describe("buildPlaintext", () => {
  it("erzeugt einen nicht-leeren String ohne HTML-Tags", () => {
    const text = buildPlaintext(validData());
    expect(typeof text).toBe("string");
    expect(text.length).toBeGreaterThan(0);
    expect(text).not.toContain("<section");
    expect(text).not.toContain("<p>");
    expect(text).not.toContain("<h2>");
  });

  it("enthält den Überschriften-Text", () => {
    const text = buildPlaintext(validData());
    expect(text).toContain("Widerrufsbelehrung");
  });

  it("enthält bei Default den Credit als Klartext-Link", () => {
    const text = buildPlaintext(validData());
    expect(text).toContain("compliflow.de");
  });

  it("lässt den Credit bei credit:false weg", () => {
    const text = buildPlaintext(validData(), { credit: false });
    expect(text).not.toContain("ref=embed-widerruf");
  });

  it("wandelt HTML-Entities zurück (kein &amp;)", () => {
    const text = buildPlaintext(validData());
    expect(text).not.toContain("&amp;");
    expect(text).not.toContain("&quot;");
  });
});
