import { describe, it, expect } from "vitest";
import {
  isVerantwortlicherValid,
  isHostingValid,
  isKommunikationValid,
  isAnalyticsValid,
  isMarketingValid,
  isNewsletterValid,
  isEcommerceValid,
  isSocialValid,
  isHRValid,
  isSpezialValid,
  isDrittlandValid,
  getCompletionStatus,
  hasDsfaPflicht,
  hasDsbPflicht,
  hasHinschgPflicht,
  hasJointController,
  deriveDrittlaender,
  buildHtml,
  buildPlaintext,
} from "@/lib/datenschutz/contract";
import { INITIAL_DATENSCHUTZ } from "@/lib/datenschutz/defaults";
import type { DatenschutzData } from "@/lib/datenschutz/types";

// ─────────────────────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────────────────────

/** Tiefe Kopie des Initial-States, damit Tests sich nicht gegenseitig beeinflussen. */
function baseData(): DatenschutzData {
  return structuredClone(INITIAL_DATENSCHUTZ);
}

/** Vollständig valides Objekt (verantwortlicher ausgefüllt). */
function validData(): DatenschutzData {
  const d = baseData();
  d.verantwortlicher = {
    name: "Muster GmbH",
    strasse: "Musterstr. 1",
    plz: "70173",
    ort: "Stuttgart",
    land: "DE",
    email: "info@muster.de",
  };
  return d;
}

// ─────────────────────────────────────────────────────────────────────────────
// isVerantwortlicherValid
// ─────────────────────────────────────────────────────────────────────────────

describe("isVerantwortlicherValid", () => {
  it("ist true bei vollständig ausgefülltem Verantwortlichen", () => {
    expect(isVerantwortlicherValid(validData())).toBe(true);
  });

  it("ist false wenn der Name fehlt", () => {
    const d = validData();
    d.verantwortlicher.name = "  ";
    expect(isVerantwortlicherValid(d)).toBe(false);
  });

  it("ist false wenn Adressfelder (strasse/plz/ort) fehlen", () => {
    const d = validData();
    d.verantwortlicher.strasse = "";
    expect(isVerantwortlicherValid(d)).toBe(false);
    const d2 = validData();
    d2.verantwortlicher.plz = "";
    expect(isVerantwortlicherValid(d2)).toBe(false);
    const d3 = validData();
    d3.verantwortlicher.ort = "";
    expect(isVerantwortlicherValid(d3)).toBe(false);
  });

  it("ist false wenn die Email leer ist", () => {
    const d = validData();
    d.verantwortlicher.email = "";
    expect(isVerantwortlicherValid(d)).toBe(false);
  });

  it("ist false bei ungültigem Email-Format", () => {
    const d = validData();
    d.verantwortlicher.email = "keine-email";
    expect(isVerantwortlicherValid(d)).toBe(false);
  });

  it("ist false wenn DSB aktiv aber Name/Email fehlen", () => {
    const d = validData();
    d.dsb = { aktiv: true };
    expect(isVerantwortlicherValid(d)).toBe(false);
  });

  it("ist true wenn DSB aktiv und vollständig ausgefüllt", () => {
    const d = validData();
    d.dsb = { aktiv: true, name: "Max DSB", email: "dsb@muster.de" };
    expect(isVerantwortlicherValid(d)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isHostingValid
// ─────────────────────────────────────────────────────────────────────────────

describe("isHostingValid", () => {
  it("ist true bei einem gesetzten Standard-Provider", () => {
    expect(isHostingValid(validData())).toBe(true); // hetzner default
  });

  it("ist false bei provider 'andere' ohne customName", () => {
    const d = validData();
    d.hosting = { provider: "andere", istEU: true };
    expect(isHostingValid(d)).toBe(false);
  });

  it("ist true bei provider 'andere' mit customName", () => {
    const d = validData();
    d.hosting = { provider: "andere", customName: "Mein Hoster", istEU: true };
    expect(isHostingValid(d)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isKommunikationValid
// ─────────────────────────────────────────────────────────────────────────────

describe("isKommunikationValid", () => {
  it("ist true im Default (alles aus)", () => {
    expect(isKommunikationValid(validData())).toBe(true);
  });

  it("ist false bei kiChatbot ohne Provider", () => {
    const d = validData();
    d.kommunikation.kiChatbot = true;
    expect(isKommunikationValid(d)).toBe(false);
  });

  it("ist false bei liveChat ohne chatProvider", () => {
    const d = validData();
    d.kommunikation.liveChat = true;
    expect(isKommunikationValid(d)).toBe(false);
  });

  it("ist false bei webinare ohne videoCallProvider", () => {
    const d = validData();
    d.kommunikation.webinare = true;
    expect(isKommunikationValid(d)).toBe(false);
  });

  it("ist true wenn alle aktiven Module einen Provider haben", () => {
    const d = validData();
    d.kommunikation.kiChatbot = true;
    d.kommunikation.kiChatbotProvider = "openai";
    d.kommunikation.liveChat = true;
    d.kommunikation.chatProvider = "crisp";
    d.kommunikation.webinare = true;
    d.kommunikation.videoCallProvider = "zoom";
    expect(isKommunikationValid(d)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Immer-true-Validatoren
// ─────────────────────────────────────────────────────────────────────────────

describe("immer-true Validatoren", () => {
  it("isAnalyticsValid ist immer true", () => {
    expect(isAnalyticsValid(validData())).toBe(true);
  });
  it("isMarketingValid ist immer true", () => {
    expect(isMarketingValid(validData())).toBe(true);
  });
  it("isSocialValid ist immer true", () => {
    expect(isSocialValid(validData())).toBe(true);
  });
  it("isSpezialValid ist immer true", () => {
    expect(isSpezialValid(validData())).toBe(true);
  });
  it("isDrittlandValid ist immer true", () => {
    expect(isDrittlandValid(validData())).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isNewsletterValid
// ─────────────────────────────────────────────────────────────────────────────

describe("isNewsletterValid", () => {
  it("ist true wenn Newsletter inaktiv ist", () => {
    expect(isNewsletterValid(validData())).toBe(true);
  });

  it("ist false wenn aktiv aber kein Provider gewählt", () => {
    const d = validData();
    d.newsletter.aktiv = true;
    expect(isNewsletterValid(d)).toBe(false);
  });

  it("ist true wenn aktiv und Provider gesetzt", () => {
    const d = validData();
    d.newsletter.aktiv = true;
    d.newsletter.provider = "brevo";
    expect(isNewsletterValid(d)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isEcommerceValid
// ─────────────────────────────────────────────────────────────────────────────

describe("isEcommerceValid", () => {
  it("ist true im Default (keine Bonitätsprüfung)", () => {
    expect(isEcommerceValid(validData())).toBe(true);
  });

  it("ist false bei Bonitätsprüfung ohne Auskunftei", () => {
    const d = validData();
    d.ecommerce.bonitaetspruefung = true;
    expect(isEcommerceValid(d)).toBe(false);
  });

  it("ist false bei Bonitätsprüfung mit leerer Auskunftei-Liste", () => {
    const d = validData();
    d.ecommerce.bonitaetspruefung = true;
    d.ecommerce.auskunftei = [];
    expect(isEcommerceValid(d)).toBe(false);
  });

  it("ist true bei Bonitätsprüfung mit mindestens einer Auskunftei", () => {
    const d = validData();
    d.ecommerce.bonitaetspruefung = true;
    d.ecommerce.auskunftei = ["schufa"];
    expect(isEcommerceValid(d)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isHRValid
// ─────────────────────────────────────────────────────────────────────────────

describe("isHRValid", () => {
  it("ist true im Default (kein Bewerbungsformular)", () => {
    expect(isHRValid(validData())).toBe(true);
  });

  it("ist false bei Bewerbungsformular + 'andere' Mgmt ohne Custom-Name", () => {
    const d = validData();
    d.hr.bewerbungsformular = true;
    d.hr.bewerberMgmt = "andere";
    expect(isHRValid(d)).toBe(false);
  });

  it("ist true bei Bewerbungsformular + 'andere' Mgmt mit Custom-Name", () => {
    const d = validData();
    d.hr.bewerbungsformular = true;
    d.hr.bewerberMgmt = "andere";
    d.hr.bewerberMgmtCustom = "Eigenes Tool";
    expect(isHRValid(d)).toBe(true);
  });

  it("ist true bei Bewerbungsformular + Standard-Mgmt", () => {
    const d = validData();
    d.hr.bewerbungsformular = true;
    d.hr.bewerberMgmt = "personio";
    expect(isHRValid(d)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getCompletionStatus
// ─────────────────────────────────────────────────────────────────────────────

describe("getCompletionStatus", () => {
  it("liefert allValid=true bei vollständig validen Daten", () => {
    const status = getCompletionStatus(validData());
    expect(status.allValid).toBe(true);
    expect(status.checks.review).toBe(true);
    expect(Object.values(status.checks).every(Boolean)).toBe(true);
  });

  it("liefert allValid=false und markiert den fehlerhaften Step", () => {
    const d = validData();
    d.verantwortlicher.name = "";
    const status = getCompletionStatus(d);
    expect(status.allValid).toBe(false);
    expect(status.checks.verantwortlicher).toBe(false);
  });

  it("enthält einen Check-Eintrag pro Wizard-Step", () => {
    const status = getCompletionStatus(validData());
    expect(Object.keys(status.checks)).toHaveLength(12);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// hasDsfaPflicht
// ─────────────────────────────────────────────────────────────────────────────

describe("hasDsfaPflicht", () => {
  it("ist false im Default", () => {
    expect(hasDsfaPflicht(validData())).toBe(false);
  });

  it("ist true bei automatisierter Entscheidung", () => {
    const d = validData();
    d.spezial.automatisierte_entscheidung = true;
    expect(hasDsfaPflicht(d)).toBe(true);
  });

  it("ist true bei Profiling + mittlerer Mitarbeiterzahl", () => {
    const d = validData();
    d.spezial.profiling = true;
    d.mitarbeiterzahl = "mittel_50_249";
    expect(hasDsfaPflicht(d)).toBe(true);
  });

  it("ist false bei Profiling + solo (zu klein)", () => {
    const d = validData();
    d.spezial.profiling = true;
    d.mitarbeiterzahl = "solo";
    expect(hasDsfaPflicht(d)).toBe(false);
  });

  it("ist true bei Art-9-Daten + nicht-solo", () => {
    const d = validData();
    d.spezial.besondere_kategorien_art9 = true;
    d.mitarbeiterzahl = "klein_2_19";
    expect(hasDsfaPflicht(d)).toBe(true);
  });

  it("ist false bei Art-9-Daten + solo", () => {
    const d = validData();
    d.spezial.besondere_kategorien_art9 = true;
    d.mitarbeiterzahl = "solo";
    expect(hasDsfaPflicht(d)).toBe(false);
  });

  it("ist true bei Branche arzt oder pflege", () => {
    const d = validData();
    d.branche = "arzt";
    expect(hasDsfaPflicht(d)).toBe(true);
    const d2 = validData();
    d2.branche = "pflege";
    expect(hasDsfaPflicht(d2)).toBe(true);
  });

  it("ist true bei Live-Videoüberwachung", () => {
    const d = validData();
    d.spezial.videoueberwachung_live = true;
    expect(hasDsfaPflicht(d)).toBe(true);
  });

  it("ist true bei Branche ki_saas", () => {
    const d = validData();
    d.branche = "ki_saas";
    expect(hasDsfaPflicht(d)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// hasDsbPflicht
// ─────────────────────────────────────────────────────────────────────────────

describe("hasDsbPflicht", () => {
  it("ist false im Default (solo, allgemein)", () => {
    expect(hasDsbPflicht(validData())).toBe(false);
  });

  it("ist true ab 20 Mitarbeitern", () => {
    const d = validData();
    d.mitarbeiterzahl = "schwelle_20_49";
    expect(hasDsbPflicht(d)).toBe(true);
  });

  it("ist true bei mittlerer und großer Mitarbeiterzahl", () => {
    const d = validData();
    d.mitarbeiterzahl = "mittel_50_249";
    expect(hasDsbPflicht(d)).toBe(true);
    const d2 = validData();
    d2.mitarbeiterzahl = "gross_250plus";
    expect(hasDsbPflicht(d2)).toBe(true);
  });

  it("ist false bei klein_2_19 ohne Sonderfaktor", () => {
    const d = validData();
    d.mitarbeiterzahl = "klein_2_19";
    expect(hasDsbPflicht(d)).toBe(false);
  });

  it("ist true bei Art-9-Daten unabhängig von der Größe", () => {
    const d = validData();
    d.spezial.besondere_kategorien_art9 = true;
    expect(hasDsbPflicht(d)).toBe(true);
  });

  it("ist true bei sensiblen Branchen (arzt/anwalt/pflege/versicherung)", () => {
    for (const b of ["arzt", "anwalt", "pflege", "versicherung"] as const) {
      const d = validData();
      d.branche = b;
      expect(hasDsbPflicht(d)).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// hasHinschgPflicht
// ─────────────────────────────────────────────────────────────────────────────

describe("hasHinschgPflicht", () => {
  it("ist false bei kleiner Mitarbeiterzahl", () => {
    const d = validData();
    d.mitarbeiterzahl = "schwelle_20_49";
    expect(hasHinschgPflicht(d)).toBe(false);
  });

  it("ist true ab 50 Mitarbeitern", () => {
    const d = validData();
    d.mitarbeiterzahl = "mittel_50_249";
    expect(hasHinschgPflicht(d)).toBe(true);
  });

  it("ist true bei 250+ Mitarbeitern", () => {
    const d = validData();
    d.mitarbeiterzahl = "gross_250plus";
    expect(hasHinschgPflicht(d)).toBe(true);
  });

  it("ist false bei solo", () => {
    expect(hasHinschgPflicht(validData())).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// hasJointController
// ─────────────────────────────────────────────────────────────────────────────

describe("hasJointController", () => {
  it("ist false im Default", () => {
    expect(hasJointController(validData())).toBe(false);
  });

  it("ist true wenn explizit gesetzt", () => {
    const d = validData();
    d.spezial.jointController = true;
    expect(hasJointController(d)).toBe(true);
  });

  it("ist true bei Marketing-Tool mit jointController-Flag (Meta Pixel)", () => {
    const d = validData();
    d.marketing = ["meta_pixel"];
    expect(hasJointController(d)).toBe(true);
  });

  it("ist false bei Marketing-Tool ohne jointController-Flag (Google Ads)", () => {
    const d = validData();
    d.marketing = ["google_ads"];
    expect(hasJointController(d)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// deriveDrittlaender
// ─────────────────────────────────────────────────────────────────────────────

describe("deriveDrittlaender", () => {
  it("ist leer im Default (EU-Hosting, nichts aktiv)", () => {
    expect(deriveDrittlaender(validData())).toEqual([]);
  });

  it("fügt USA bei US-Hosting hinzu", () => {
    const d = validData();
    d.hosting = { provider: "vercel", istEU: false };
    expect(deriveDrittlaender(d)).toContain("USA");
  });

  it("fügt USA bei US-Analytics-Tool hinzu", () => {
    const d = validData();
    d.analytics = [{ tool: "ga4", istEUHosting: false, anonymisiereIp: true }];
    expect(deriveDrittlaender(d)).toContain("USA");
  });

  it("fügt kein USA bei EU-Analytics-Tool hinzu (plausible)", () => {
    const d = validData();
    d.analytics = [{ tool: "plausible", istEUHosting: true, anonymisiereIp: false }];
    expect(deriveDrittlaender(d)).toEqual([]);
  });

  it("fügt USA bei US-Newsletter-Provider hinzu", () => {
    const d = validData();
    d.newsletter.aktiv = true;
    d.newsletter.provider = "mailchimp";
    expect(deriveDrittlaender(d)).toContain("USA");
  });

  it("fügt USA bei US-Chat-Provider hinzu", () => {
    const d = validData();
    d.kommunikation.liveChat = true;
    d.kommunikation.chatProvider = "intercom";
    expect(deriveDrittlaender(d)).toContain("USA");
  });

  it("fügt USA bei US-KI-Chatbot hinzu", () => {
    const d = validData();
    d.kommunikation.kiChatbot = true;
    d.kommunikation.kiChatbotProvider = "openai";
    expect(deriveDrittlaender(d)).toContain("USA");
  });

  it("fügt USA bei US-Video-Call-Provider hinzu", () => {
    const d = validData();
    d.kommunikation.webinare = true;
    d.kommunikation.videoCallProvider = "zoom";
    expect(deriveDrittlaender(d)).toContain("USA");
  });

  it("fügt USA bei US-Marketing-Tool hinzu", () => {
    const d = validData();
    d.marketing = ["meta_pixel"];
    expect(deriveDrittlaender(d)).toContain("USA");
  });

  it("fügt China bei TikTok Pixel hinzu", () => {
    const d = validData();
    d.marketing = ["tiktok_pixel"];
    const result = deriveDrittlaender(d);
    expect(result).toContain("China");
    expect(result).toContain("USA");
  });

  it("übernimmt bereits gesetzte Drittländer und dedupliziert", () => {
    const d = validData();
    d.drittland.laender = ["USA"];
    d.hosting = { provider: "vercel", istEU: false };
    const result = deriveDrittlaender(d);
    expect(result.filter((l) => l === "USA")).toHaveLength(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildHtml
// ─────────────────────────────────────────────────────────────────────────────

describe("buildHtml", () => {
  it("erzeugt einen nicht-leeren HTML-String", () => {
    const html = buildHtml(validData());
    expect(typeof html).toBe("string");
    expect(html.length).toBeGreaterThan(0);
  });

  it("enthält Standard-Inhalte (Überschrift + Verantwortlicher)", () => {
    const html = buildHtml(validData());
    expect(html).toContain("Datenschutzerklärung");
    expect(html).toContain("Verantwortlicher");
    expect(html).toContain("Muster GmbH");
  });

  it("wrappt standardmäßig in eine section und fügt Credit-Backlink ein", () => {
    const html = buildHtml(validData());
    expect(html).toContain('<section class="compliflow-datenschutz"');
    expect(html).toContain("ref=embed-datenschutz");
  });

  it("lässt das Credit weg bei credit:false", () => {
    const html = buildHtml(validData(), { credit: false });
    expect(html).not.toContain("compliflow-credit");
  });

  it("lässt den section-Wrapper weg bei wrap:false", () => {
    const html = buildHtml(validData(), { wrap: false });
    expect(html).not.toContain('<section class="compliflow-datenschutz"');
  });

  it("escaped HTML-Sonderzeichen in Nutzereingaben", () => {
    const d = validData();
    d.verantwortlicher.name = "Müller & <Söhne>";
    const html = buildHtml(d);
    expect(html).toContain("&amp;");
    expect(html).toContain("&lt;");
    expect(html).not.toContain("<Söhne>");
  });

  it("rendert zusätzliche Module wenn aktiv (Newsletter)", () => {
    const d = validData();
    d.newsletter.aktiv = true;
    d.newsletter.provider = "brevo";
    const html = buildHtml(d);
    expect(html).toContain("Newsletter");
    expect(html).toContain("Brevo");
  });

  it("rendert einen Drittland-Abschnitt bei US-Hosting", () => {
    const d = validData();
    d.hosting = { provider: "vercel", istEU: false };
    const html = buildHtml(d);
    expect(html).toContain("Drittländer");
    expect(html).toContain("USA");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildPlaintext
// ─────────────────────────────────────────────────────────────────────────────

describe("buildPlaintext", () => {
  it("erzeugt einen nicht-leeren Text-String", () => {
    const text = buildPlaintext(validData());
    expect(typeof text).toBe("string");
    expect(text.length).toBeGreaterThan(0);
  });

  it("enthält keine HTML-Tags mehr", () => {
    const text = buildPlaintext(validData());
    expect(text).not.toMatch(/<[a-z][^>]*>/i);
  });

  it("enthält den Verantwortlichen-Namen im Klartext", () => {
    const text = buildPlaintext(validData());
    expect(text).toContain("Muster GmbH");
  });

  it("dekodiert HTML-Entities zurück in Klartext", () => {
    const d = validData();
    d.verantwortlicher.name = "Müller & Söhne";
    const text = buildPlaintext(d);
    expect(text).toContain("Müller & Söhne");
    expect(text).not.toContain("&amp;");
  });

  it("respektiert die credit-Option (kein Backlink-Text bei credit:false)", () => {
    const mit = buildPlaintext(validData(), { credit: true });
    const ohne = buildPlaintext(validData(), { credit: false });
    expect(mit).toContain("Compliflow");
    expect(ohne.length).toBeLessThan(mit.length);
  });
});
