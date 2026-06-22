import { describe, it, expect } from "vitest";
import {
  isAnbieterValid,
  isKategorienValid,
  isTrackingValid,
  isStilValid,
  isVerhaltenValid,
  getCompletionStatus,
  buildSnippet,
  buildAnleitung,
} from "@/lib/cookie-banner/builder";
import { INITIAL_COOKIE_BANNER } from "@/lib/cookie-banner/defaults";
import type { CookieBannerData, TrackingTool } from "@/lib/cookie-banner/types";

// ─────────────────────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gültiges CookieBannerData: basiert auf dem importierbaren INITIAL_COOKIE_BANNER,
 * setzt aber anbieter.name (im Default leer → isAnbieterValid wäre sonst false).
 * Deep-Clone, damit Tests sich nicht gegenseitig beeinflussen.
 */
function validData(): CookieBannerData {
  const d: CookieBannerData = JSON.parse(JSON.stringify(INITIAL_COOKIE_BANNER));
  d.anbieter.name = "Beispiel GmbH";
  return d;
}

// ─────────────────────────────────────────────────────────────────────────────
// isAnbieterValid
// ─────────────────────────────────────────────────────────────────────────────

describe("isAnbieterValid", () => {
  it("ist true bei Name + datenschutzUrl", () => {
    expect(isAnbieterValid(validData())).toBe(true);
  });

  it("ist false ohne Name", () => {
    const d = validData();
    d.anbieter.name = "";
    expect(isAnbieterValid(d)).toBe(false);
  });

  it("ist false bei nur-Whitespace-Name", () => {
    const d = validData();
    d.anbieter.name = "   ";
    expect(isAnbieterValid(d)).toBe(false);
  });

  it("ist false ohne datenschutzUrl", () => {
    const d = validData();
    d.anbieter.datenschutzUrl = "";
    expect(isAnbieterValid(d)).toBe(false);
  });

  it("ist false bei nur-Whitespace-datenschutzUrl", () => {
    const d = validData();
    d.anbieter.datenschutzUrl = "   ";
    expect(isAnbieterValid(d)).toBe(false);
  });

  it("ist false wenn Name UND datenschutzUrl fehlen", () => {
    const d = validData();
    d.anbieter.name = "";
    d.anbieter.datenschutzUrl = "";
    expect(isAnbieterValid(d)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isKategorienValid
// ─────────────────────────────────────────────────────────────────────────────

describe("isKategorienValid", () => {
  it("ist true wenn essential aktiv ist (Default)", () => {
    expect(isKategorienValid(validData())).toBe(true);
  });

  it("ist false wenn essential nicht aktiv ist", () => {
    const d = validData();
    d.kategorien = d.kategorien.map((k) =>
      k.id === "essential" ? { ...k, aktiv: false } : k,
    );
    expect(isKategorienValid(d)).toBe(false);
  });

  it("ist false wenn essential gar nicht in der Liste vorkommt", () => {
    const d = validData();
    d.kategorien = d.kategorien.filter((k) => k.id !== "essential");
    expect(isKategorienValid(d)).toBe(false);
  });

  it("ist false bei leerer Kategorien-Liste", () => {
    const d = validData();
    d.kategorien = [];
    expect(isKategorienValid(d)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isTrackingValid (immer true)
// ─────────────────────────────────────────────────────────────────────────────

describe("isTrackingValid", () => {
  it("ist immer true (Default)", () => {
    expect(isTrackingValid(validData())).toBe(true);
  });

  it("ist auch true bei leeren trackingTools", () => {
    const d = validData();
    d.trackingTools = [];
    expect(isTrackingValid(d)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isStilValid (immer true)
// ─────────────────────────────────────────────────────────────────────────────

describe("isStilValid", () => {
  it("ist immer true (Default)", () => {
    expect(isStilValid(validData())).toBe(true);
  });

  it("ist true für jeden Stil", () => {
    for (const stil of ["bottom_bar", "modal", "sidebar_left", "sidebar_right"] as const) {
      const d = validData();
      d.stil = stil;
      expect(isStilValid(d)).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isVerhaltenValid
// ─────────────────────────────────────────────────────────────────────────────

describe("isVerhaltenValid", () => {
  it("ist true bei 12 Monaten (Default)", () => {
    expect(isVerhaltenValid(validData())).toBe(true);
  });

  it("ist true an der Untergrenze (1 Monat)", () => {
    const d = validData();
    d.verhalten.consentLaufzeitMonate = 1;
    expect(isVerhaltenValid(d)).toBe(true);
  });

  it("ist true an der Obergrenze (24 Monate)", () => {
    const d = validData();
    d.verhalten.consentLaufzeitMonate = 24;
    expect(isVerhaltenValid(d)).toBe(true);
  });

  it("ist false unter der Untergrenze (0 Monate)", () => {
    const d = validData();
    d.verhalten.consentLaufzeitMonate = 0;
    expect(isVerhaltenValid(d)).toBe(false);
  });

  it("ist false über der Obergrenze (25 Monate)", () => {
    const d = validData();
    d.verhalten.consentLaufzeitMonate = 25;
    expect(isVerhaltenValid(d)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getCompletionStatus
// ─────────────────────────────────────────────────────────────────────────────

describe("getCompletionStatus", () => {
  it("liefert allValid=true bei gültigem Datensatz", () => {
    const status = getCompletionStatus(validData());
    expect(status.allValid).toBe(true);
    expect(status.checks).toEqual({
      anbieter: true,
      kategorien: true,
      tracking: true,
      stil: true,
      verhalten: true,
      review: true,
    });
  });

  it("review ist immer true (hardcoded)", () => {
    const d = validData();
    d.anbieter.name = "";
    expect(getCompletionStatus(d).checks.review).toBe(true);
  });

  it("allValid=false und anbieter-check=false bei fehlendem Namen", () => {
    const d = validData();
    d.anbieter.name = "";
    const status = getCompletionStatus(d);
    expect(status.checks.anbieter).toBe(false);
    expect(status.allValid).toBe(false);
  });

  it("allValid=false bei ungültiger Consent-Laufzeit", () => {
    const d = validData();
    d.verhalten.consentLaufzeitMonate = 99;
    const status = getCompletionStatus(d);
    expect(status.checks.verhalten).toBe(false);
    expect(status.allValid).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildSnippet
// ─────────────────────────────────────────────────────────────────────────────

describe("buildSnippet", () => {
  it("liefert einen nicht-leeren String", () => {
    const snippet = buildSnippet(validData());
    expect(typeof snippet).toBe("string");
    expect(snippet.length).toBeGreaterThan(0);
  });

  it("enthält Root-Container, Style- und Script-Block", () => {
    const snippet = buildSnippet(validData());
    expect(snippet).toContain('<div id="compliflow-cb-root">');
    expect(snippet).toContain('<style id="compliflow-cb-style">');
    expect(snippet).toContain('<script id="compliflow-cb-script">');
    expect(snippet).toContain('id="compliflow-cb"');
  });

  it("enthält die Texte (Accept/Reject) aus den Daten", () => {
    const snippet = buildSnippet(validData());
    expect(snippet).toContain("Alle akzeptieren");
    expect(snippet).toContain("Alle ablehnen");
  });

  it("enthält den storageKey in der JS-Config", () => {
    const d = validData();
    d.storageKey = "mein-eigener-key";
    const snippet = buildSnippet(d);
    expect(snippet).toContain("mein-eigener-key");
  });

  it("enthält den Compliflow-Credit-Backlink standardmäßig (credit default true)", () => {
    // Hinweis: die CSS-Klasse .compliflow-cb__credit steht IMMER im <style>-Block.
    // Der eigentliche Credit-DIV (mit Backlink) ist das, was conditional ist.
    const snippet = buildSnippet(validData());
    expect(snippet).toContain("ref=embed-cookie-banner");
    expect(snippet).toContain("Cookie-Banner von");
    expect(snippet).toContain("Free-Tier mit Compliflow-Credit");
  });

  it("lässt den Credit-Backlink weg bei options.credit=false", () => {
    const snippet = buildSnippet(validData(), { credit: false });
    expect(snippet).not.toContain("ref=embed-cookie-banner");
    expect(snippet).not.toContain("Cookie-Banner von");
    expect(snippet).toContain("Premium-Tier ohne Compliflow-Credit");
  });

  it("bindet einen GA4-Tracking-Tool-Loader ein", () => {
    const d = validData();
    const ga4: TrackingTool = {
      id: "tool1",
      typ: "ga4",
      name: "Google Analytics 4",
      kategorie: "statistik",
      configId: "G-ABC123",
    };
    d.trackingTools = [ga4];
    const snippet = buildSnippet(d);
    expect(snippet).toContain("G-ABC123");
    expect(snippet).toContain("Google Analytics 4");
    expect(snippet).toContain("anonymize_ip");
  });

  it("rendert ein Modal-Backdrop bei stil=modal + blockiertHintergrund", () => {
    const d = validData();
    d.stil = "modal";
    d.verhalten.blockiertHintergrund = true;
    const snippet = buildSnippet(d);
    expect(snippet).toContain('id="compliflow-cb-backdrop"');
    expect(snippet).toContain('aria-modal="true"');
  });

  it("escaped HTML-Sonderzeichen in Anbieter-Daten", () => {
    const d = validData();
    d.anbieter.datenschutzUrl = '/datenschutz?a=1&b="x"';
    const snippet = buildSnippet(d);
    expect(snippet).toContain("&amp;");
    expect(snippet).toContain("&quot;");
  });

  it("enthält das Erstell-Datum im Header-Kommentar", () => {
    const d = validData();
    d.letztAktualisiert = "2026-01-01";
    const snippet = buildSnippet(d);
    expect(snippet).toContain("2026-01-01");
  });

  it("rendert die Settings-Kategorien wenn settingsButton aktiv ist", () => {
    const d = validData();
    d.verhalten.settingsButton = true;
    const snippet = buildSnippet(d);
    expect(snippet).toContain('id="compliflow-cb-settings"');
    expect(snippet).toContain('data-action="toggle-settings"');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildAnleitung
// ─────────────────────────────────────────────────────────────────────────────

describe("buildAnleitung", () => {
  it("liefert einen nicht-leeren String", () => {
    const text = buildAnleitung(validData());
    expect(typeof text).toBe("string");
    expect(text.length).toBeGreaterThan(0);
  });

  it("enthält die Überschrift und Einbau-Hinweis", () => {
    const text = buildAnleitung(validData());
    expect(text).toContain("Cookie-Banner Einbau-Anleitung");
    expect(text).toContain("</body>");
  });

  it("listet 'Keine Tracking-Tools' wenn keine konfiguriert sind", () => {
    const text = buildAnleitung(validData());
    expect(text).toContain("Keine Tracking-Tools konfiguriert");
  });

  it("listet konfigurierte Tracking-Tools auf", () => {
    const d = validData();
    d.trackingTools = [
      { id: "t1", typ: "plausible", name: "Plausible", kategorie: "statistik", configId: "x.de" },
    ];
    const text = buildAnleitung(d);
    expect(text).toContain("Plausible");
    expect(text).toContain("Kategorie: statistik");
  });

  it("zeigt den reCAPTCHA-Hinweis nur bei konfiguriertem reCAPTCHA", () => {
    const ohne = buildAnleitung(validData());
    expect(ohne).not.toContain("HINWEIS reCAPTCHA");

    const d = validData();
    d.trackingTools = [
      { id: "r1", typ: "google_recaptcha", name: "reCAPTCHA", kategorie: "essential" },
    ];
    const mit = buildAnleitung(d);
    expect(mit).toContain("HINWEIS reCAPTCHA");
  });

  it("enthält das Stand-Datum", () => {
    const d = validData();
    d.letztAktualisiert = "2026-03-15";
    const text = buildAnleitung(d);
    expect(text).toContain("2026-03-15");
  });
});
