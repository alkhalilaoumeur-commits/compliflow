import { describe, it, expect } from "vitest";
import {
  isAnbieterValid,
  isKontaktValid,
  isRegisterValid,
  isVertretungValid,
  isZusatzValid,
  getCompletionStatus,
  buildSections,
  buildHtml,
  buildPlaintext,
  getLandHeader,
} from "@/lib/impressum/contract";
import { INITIAL_IMPRESSUM } from "@/lib/impressum/defaults";
import type { ImpressumData } from "@/lib/impressum/types";

/**
 * Liefert ein vollständig valides ImpressumData-Objekt für einen
 * Einzelunternehmer (einfachste Rechtsform: nur Vor-/Nachname Pflicht,
 * kein Register, keine Vertretung).
 */
function validEinzel(): ImpressumData {
  return {
    ...structuredClone(INITIAL_IMPRESSUM),
    rechtsform: "einzelunternehmer",
    vorname: "Max",
    nachname: "Mustermann",
    adresse: { strasse: "Musterstr. 1", plz: "70173", ort: "Stuttgart", land: "DE" },
    kontakt: { email: "max@example.com", telefon: "0711 123456" },
  };
}

/** Vollständig valide GmbH (Firma, Vertretung, Register Pflicht). */
function validGmbh(): ImpressumData {
  return {
    ...structuredClone(INITIAL_IMPRESSUM),
    rechtsform: "gmbh",
    firma: "Muster GmbH",
    adresse: { strasse: "Musterstr. 1", plz: "70173", ort: "Stuttgart", land: "DE" },
    kontakt: { email: "info@muster.de", telefon: "0711 123456" },
    vertretung: [{ vorname: "Erika", nachname: "Musterfrau", rolle: "Geschäftsführerin" }],
    register: { art: "HRB", nummer: "12345", gericht: "Amtsgericht Stuttgart" },
    stammkapital: "25.000 EUR",
  };
}

describe("isAnbieterValid", () => {
  it("akzeptiert validen Einzelunternehmer", () => {
    expect(isAnbieterValid(validEinzel())).toBe(true);
  });

  it("lehnt Einzelunternehmer ohne Vorname ab", () => {
    const d = validEinzel();
    d.vorname = "";
    expect(isAnbieterValid(d)).toBe(false);
  });

  it("lehnt Einzelunternehmer ohne Nachname ab", () => {
    const d = validEinzel();
    d.nachname = "   ";
    expect(isAnbieterValid(d)).toBe(false);
  });

  it("akzeptiert valide GmbH mit Firma", () => {
    expect(isAnbieterValid(validGmbh())).toBe(true);
  });

  it("lehnt GmbH ohne Firma ab", () => {
    const d = validGmbh();
    d.firma = "";
    expect(isAnbieterValid(d)).toBe(false);
  });

  it("verlangt rechtsformAndere bei rechtsform=andere", () => {
    const d = validGmbh();
    d.rechtsform = "andere";
    d.rechtsformAndere = "";
    expect(isAnbieterValid(d)).toBe(false);
    d.rechtsformAndere = "Limited";
    expect(isAnbieterValid(d)).toBe(true);
  });
});

describe("isKontaktValid", () => {
  it("akzeptiert valide Adresse + Email + Telefon", () => {
    expect(isKontaktValid(validEinzel())).toBe(true);
  });

  it("lehnt fehlende Strasse ab", () => {
    const d = validEinzel();
    d.adresse.strasse = "";
    expect(isKontaktValid(d)).toBe(false);
  });

  it("lehnt fehlende PLZ ab", () => {
    const d = validEinzel();
    d.adresse.plz = "";
    expect(isKontaktValid(d)).toBe(false);
  });

  it("lehnt fehlenden Ort ab", () => {
    const d = validEinzel();
    d.adresse.ort = "";
    expect(isKontaktValid(d)).toBe(false);
  });

  it("lehnt fehlende Email ab", () => {
    const d = validEinzel();
    d.kontakt.email = "";
    expect(isKontaktValid(d)).toBe(false);
  });

  it("lehnt unplausible Email ab", () => {
    const d = validEinzel();
    d.kontakt.email = "keine-email";
    expect(isKontaktValid(d)).toBe(false);
  });

  it("lehnt ab wenn weder Telefon noch Kontaktformular vorhanden", () => {
    const d = validEinzel();
    d.kontakt.telefon = "";
    d.kontakt.kontaktformular = "";
    expect(isKontaktValid(d)).toBe(false);
  });

  it("akzeptiert Kontaktformular als Alternative zum Telefon", () => {
    const d = validEinzel();
    d.kontakt.telefon = "";
    d.kontakt.kontaktformular = "https://example.com/kontakt";
    expect(isKontaktValid(d)).toBe(true);
  });
});

describe("isRegisterValid", () => {
  it("ist true wenn Rechtsform kein Register braucht (Einzelunternehmer)", () => {
    const d = validEinzel();
    expect(isRegisterValid(d)).toBe(true);
  });

  it("ist true bei GmbH mit vollständigem Register", () => {
    expect(isRegisterValid(validGmbh())).toBe(true);
  });

  it("ist false bei GmbH ohne Register-Art", () => {
    const d = validGmbh();
    d.register.art = undefined;
    expect(isRegisterValid(d)).toBe(false);
  });

  it("ist false bei GmbH ohne Register-Nummer", () => {
    const d = validGmbh();
    d.register.nummer = "";
    expect(isRegisterValid(d)).toBe(false);
  });

  it("ist false bei GmbH ohne Register-Gericht", () => {
    const d = validGmbh();
    d.register.gericht = "";
    expect(isRegisterValid(d)).toBe(false);
  });
});

describe("isVertretungValid", () => {
  it("ist true bei Einzelunternehmer ohne Vertretung", () => {
    expect(isVertretungValid(validEinzel())).toBe(true);
  });

  it("ist true bei GmbH mit gültiger Vertretung", () => {
    expect(isVertretungValid(validGmbh())).toBe(true);
  });

  it("ist false bei GmbH ohne Vertretung", () => {
    const d = validGmbh();
    d.vertretung = [];
    expect(isVertretungValid(d)).toBe(false);
  });

  it("ist false wenn Vertreter unvollständigen Namen hat", () => {
    const d = validGmbh();
    d.vertretung = [{ vorname: "", nachname: "Test" }];
    expect(isVertretungValid(d)).toBe(false);
  });

  it("verlangt bei AG einen Aufsichtsratsvorsitzenden", () => {
    const d = validGmbh();
    d.rechtsform = "ag";
    // ohne Aufsichtsrat -> false
    expect(isVertretungValid(d)).toBe(false);
    d.aufsichtsratsvorsitzender = { vorname: "Hans", nachname: "Prüfer" };
    expect(isVertretungValid(d)).toBe(true);
  });

  it("validiert reglementierten Beruf: Kammer ODER Aufsicht Pflicht", () => {
    const d = validEinzel();
    d.beruf = {
      aktiv: true,
      berufsbezeichnung: "Rechtsanwalt",
      verleihungsstaat: "Deutschland",
      berufsrechtlicheRegelungen: "BRAO",
    };
    // weder Kammer noch Aufsicht -> false
    expect(isVertretungValid(d)).toBe(false);
    d.beruf.kammer = { name: "Rechtsanwaltskammer Stuttgart" };
    expect(isVertretungValid(d)).toBe(true);
  });

  it("akzeptiert Aufsichtsbehörde ohne Kammer (Heilpraktiker)", () => {
    const d = validEinzel();
    d.beruf = {
      aktiv: true,
      berufsbezeichnung: "Heilpraktiker",
      verleihungsstaat: "Deutschland",
      berufsrechtlicheRegelungen: "HeilprG",
      aufsichtsbehoerde: { name: "Gesundheitsamt Stuttgart" },
    };
    expect(isVertretungValid(d)).toBe(true);
  });

  it("verlangt berufsrechtliche Regelungen bei aktivem Beruf", () => {
    const d = validEinzel();
    d.beruf = {
      aktiv: true,
      berufsbezeichnung: "Arzt",
      verleihungsstaat: "Deutschland",
      kammer: { name: "Ärztekammer" },
      berufsrechtlicheRegelungen: "",
    };
    expect(isVertretungValid(d)).toBe(false);
  });

  it("validiert Gewerbeerlaubnis 34d (Registernummer Pflicht)", () => {
    const d = validEinzel();
    d.gewerbeerlaubnis = {
      aktiv: true,
      typ: "gewo_34d",
      erlaubnisbehoerde: "IHK Stuttgart",
      registernummer: "",
    };
    expect(isVertretungValid(d)).toBe(false);
    d.gewerbeerlaubnis.registernummer = "D-W-104-RAYHJ-67";
    expect(isVertretungValid(d)).toBe(true);
  });

  it("erlaubt Gewerbeerlaubnis 34c ohne Registernummer", () => {
    const d = validEinzel();
    d.gewerbeerlaubnis = {
      aktiv: true,
      typ: "gewo_34c",
      erlaubnisbehoerde: "Gewerbeamt Stuttgart",
    };
    expect(isVertretungValid(d)).toBe(true);
  });

  it("validiert Vereinszweck für e.V. wenn vereinszusatz aktiv", () => {
    const d = validGmbh();
    d.rechtsform = "ev";
    d.vereinszusatz = { aktiv: true, vereinszweck: "" };
    expect(isVertretungValid(d)).toBe(false);
    d.vereinszusatz.vereinszweck = "Förderung des Sports";
    expect(isVertretungValid(d)).toBe(true);
  });

  it("verlangt Stiftungsbehörde bei Stiftung mit vereinszusatz", () => {
    const d = validGmbh();
    d.rechtsform = "stiftung";
    d.vereinszusatz = { aktiv: true, vereinszweck: "Wissenschaft" };
    expect(isVertretungValid(d)).toBe(false);
    d.vereinszusatz.stiftungsbehoerde = "Regierungspräsidium Stuttgart";
    expect(isVertretungValid(d)).toBe(true);
  });

  it("validiert Berufshaftpflicht (alle 3 Felder Pflicht)", () => {
    const d = validEinzel();
    d.beruf = {
      aktiv: true,
      berufsbezeichnung: "Rechtsanwalt",
      verleihungsstaat: "Deutschland",
      berufsrechtlicheRegelungen: "BRAO",
      kammer: { name: "RAK" },
      haftpflicht: { aktiv: true, versicherer: "HDI", anschrift: "", geltungsbereich: "EU" },
    };
    expect(isVertretungValid(d)).toBe(false);
    d.beruf.haftpflicht!.anschrift = "Riethorst 2, 30659 Hannover";
    expect(isVertretungValid(d)).toBe(true);
  });
});

describe("isZusatzValid", () => {
  it("ist true wenn Redaktion inaktiv", () => {
    expect(isZusatzValid(validEinzel())).toBe(true);
  });

  it("ist false wenn Redaktion aktiv aber kein Verantwortlicher", () => {
    const d = validEinzel();
    d.redaktion = { aktiv: true };
    expect(isZusatzValid(d)).toBe(false);
  });

  it("ist false wenn Verantwortlicher unvollständige Adresse hat", () => {
    const d = validEinzel();
    d.redaktion = {
      aktiv: true,
      verantwortlicher: { vorname: "Max", nachname: "M", strasse: "Str 1", plz: "", ort: "Stuttgart" },
    };
    expect(isZusatzValid(d)).toBe(false);
  });

  it("ist true wenn Verantwortlicher vollständig", () => {
    const d = validEinzel();
    d.redaktion = {
      aktiv: true,
      verantwortlicher: { vorname: "Max", nachname: "M", strasse: "Str 1", plz: "70173", ort: "Stuttgart" },
    };
    expect(isZusatzValid(d)).toBe(true);
  });
});

describe("getCompletionStatus", () => {
  it("liefert total=5 (review zählt nicht)", () => {
    const s = getCompletionStatus(validEinzel());
    expect(s.total).toBe(5);
  });

  it("zählt alle 5 Steps als komplett bei validem Einzelunternehmer", () => {
    const s = getCompletionStatus(validEinzel());
    expect(s.completedCount).toBe(5);
    expect(s.checks.anbieter).toBe(true);
    expect(s.checks.kontakt).toBe(true);
    expect(s.checks.review).toBe(true);
  });

  it("reduziert completedCount bei ungültigem Anbieter", () => {
    const d = validEinzel();
    d.vorname = "";
    const s = getCompletionStatus(d);
    expect(s.checks.anbieter).toBe(false);
    expect(s.completedCount).toBe(4);
  });

  it("liefert checks für alle Wizard-Steps", () => {
    const s = getCompletionStatus(validEinzel());
    expect(Object.keys(s.checks).sort()).toEqual(
      ["anbieter", "kontakt", "register", "review", "vertretung", "zusatz"].sort(),
    );
  });
});

describe("buildSections", () => {
  it("liefert ein Array mit gültiger Section-Struktur", () => {
    const secs = buildSections(validEinzel());
    expect(Array.isArray(secs)).toBe(true);
    expect(secs.length).toBeGreaterThan(0);
    for (const s of secs) {
      expect(typeof s.id).toBe("string");
      expect(typeof s.body).toBe("string");
    }
  });

  it("enthält immer anbieter und kontakt als erste Blöcke", () => {
    const secs = buildSections(validEinzel());
    expect(secs[0].id).toBe("anbieter");
    expect(secs[0].title).toBe("Angaben gemäß § 5 DDG");
    expect(secs[1].id).toBe("kontakt");
  });

  it("anbieter-Body enthält Name und Adresse", () => {
    const secs = buildSections(validEinzel());
    expect(secs[0].body).toContain("Max Mustermann");
    expect(secs[0].body).toContain("70173 Stuttgart");
  });

  it("enthält Vertretungs- und Register-Block bei GmbH", () => {
    const secs = buildSections(validGmbh());
    const ids = secs.map((s) => s.id);
    expect(ids).toContain("vertretung");
    expect(ids).toContain("register");
    expect(ids).toContain("stammkapital");
  });

  it("ergänzt OS-Plattform-Block bei B2C", () => {
    const d = validEinzel();
    d.vsbg = { istB2c: true, teilnahme: "nein" };
    const secs = buildSections(d);
    expect(secs.map((s) => s.id)).toContain("os_plattform");
  });

  it("enthält Steuerblock wenn USt-ID gesetzt", () => {
    const d = validEinzel();
    d.steuer = { ustId: "DE123456789" };
    const secs = buildSections(d);
    const steuer = secs.find((s) => s.id === "steuer");
    expect(steuer).toBeDefined();
    expect(steuer!.body).toContain("DE123456789");
  });

  it("enthält Haftungsblock bei Default-Haftungsflags", () => {
    const secs = buildSections(validEinzel());
    expect(secs.map((s) => s.id)).toContain("haftung");
  });
});

describe("buildHtml", () => {
  it("liefert nicht-leeren String mit section + h1", () => {
    const html = buildHtml(validEinzel());
    expect(html.length).toBeGreaterThan(0);
    expect(html).toContain('<section class="impressum">');
    expect(html).toContain("<h1>Impressum</h1>");
  });

  it("fügt Credit-Backlink standardmäßig ein", () => {
    const html = buildHtml(validEinzel());
    expect(html).toContain("compliflow-credit");
    expect(html).toContain("https://compliflow.de?ref=embed-impressum");
  });

  it("lässt Credit-Backlink bei credit:false weg", () => {
    const html = buildHtml(validEinzel(), { credit: false });
    expect(html).not.toContain("compliflow-credit");
    expect(html).not.toContain("ref=embed-impressum");
  });

  it("escaped HTML-Sonderzeichen im Inhalt", () => {
    const d = validEinzel();
    d.vorname = "<b>Max</b>";
    const html = buildHtml(d);
    expect(html).toContain("&lt;b&gt;Max&lt;/b&gt;");
    expect(html).not.toContain("<b>Max</b>");
  });

  it("enthält Stand-Kommentar mit letztAktualisiert", () => {
    const d = validEinzel();
    d.letztAktualisiert = "2026-01-01";
    const html = buildHtml(d);
    expect(html).toContain("Stand: 2026-01-01");
  });
});

describe("buildPlaintext", () => {
  it("liefert nicht-leeren String mit IMPRESSUM-Header", () => {
    const txt = buildPlaintext(validEinzel());
    expect(txt.length).toBeGreaterThan(0);
    expect(txt).toContain("IMPRESSUM");
  });

  it("fügt Credit standardmäßig ein", () => {
    const txt = buildPlaintext(validEinzel());
    expect(txt).toContain("Erstellt mit Compliflow");
    expect(txt).toContain("https://compliflow.de");
  });

  it("lässt Credit bei credit:false weg", () => {
    const txt = buildPlaintext(validEinzel(), { credit: false });
    expect(txt).not.toContain("Erstellt mit Compliflow");
  });

  it("enthält Inhalt aus den Sektionen", () => {
    const txt = buildPlaintext(validEinzel());
    expect(txt).toContain("Max Mustermann");
    expect(txt).toContain("max@example.com");
  });

  it("enthält Stand mit letztAktualisiert", () => {
    const d = validEinzel();
    d.letztAktualisiert = "2026-02-02";
    expect(buildPlaintext(d)).toContain("Stand: 2026-02-02");
  });
});

describe("getLandHeader", () => {
  it("liefert DDG-Header für DE", () => {
    expect(getLandHeader("DE")).toBe("Angaben gemäß § 5 DDG");
  });

  it("liefert ECG/MedienG-Header für AT", () => {
    expect(getLandHeader("AT")).toBe("Angaben gemäß § 5 ECG / § 25 MedienG");
  });

  it("liefert UWG-Header für CH", () => {
    expect(getLandHeader("CH")).toBe("Angaben gemäß Art. 3 UWG");
  });
});
