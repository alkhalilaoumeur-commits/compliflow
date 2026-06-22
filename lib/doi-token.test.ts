import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createHmac } from "node:crypto";
import { buildDoiToken, verifyDoiToken } from "@/lib/doi-token";

// Hilfsfunktion: baut ein Token direkt mit eigenem Timestamp — für Grenzfall-Tests.
function buildTokenWithTs(email: string, source: string, ts: number, secret: string): string {
  const hmac = createHmac("sha256", secret)
    .update(`${email}:${source}:${ts}`)
    .digest("hex");
  return `${ts}.${hmac}`;
}

const TEST_SECRET = "test-secret-for-unit-tests";
const EMAIL = "test@example.com";
const SOURCE = "avv";

beforeAll(() => {
  process.env.DOI_SECRET = TEST_SECRET;
});

afterAll(() => {
  delete process.env.DOI_SECRET;
});

// ─── Gültiges Token ─────────────────────────────────────────────────────────

describe("verifyDoiToken — gültiges Token", () => {
  it("akzeptiert ein frisch generiertes Token", () => {
    const token = buildDoiToken(EMAIL, SOURCE);
    expect(verifyDoiToken(EMAIL, SOURCE, token)).toBe(true);
  });

  it("akzeptiert ein Token das eine Stunde alt ist", () => {
    const ts = Math.floor(Date.now() / 1000) - 3600;
    const token = buildTokenWithTs(EMAIL, SOURCE, ts, TEST_SECRET);
    expect(verifyDoiToken(EMAIL, SOURCE, token)).toBe(true);
  });

  it("akzeptiert ein Token das 6 Tage und 23 Stunden alt ist (knapp innerhalb 7 Tage)", () => {
    const ts = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60 - 60);
    const token = buildTokenWithTs(EMAIL, SOURCE, ts, TEST_SECRET);
    expect(verifyDoiToken(EMAIL, SOURCE, token)).toBe(true);
  });
});

// ─── Manipuliertes Token ─────────────────────────────────────────────────────

describe("verifyDoiToken — manipuliertes Token", () => {
  it("lehnt Token mit gefälschtem HMAC-Teil ab", () => {
    const token = buildDoiToken(EMAIL, SOURCE);
    const [ts] = token.split(".");
    const tampered = `${ts}.` + "a".repeat(64); // gültige Länge, falscher Wert
    expect(verifyDoiToken(EMAIL, SOURCE, tampered)).toBe(false);
  });

  it("lehnt Token mit modifiziertem Timestamp (1 Sekunde früher) ab", () => {
    const token = buildDoiToken(EMAIL, SOURCE);
    const [tsStr, hmac] = token.split(".");
    const modifiedToken = `${parseInt(tsStr) - 1}.${hmac}`;
    expect(verifyDoiToken(EMAIL, SOURCE, modifiedToken)).toBe(false);
  });

  it("lehnt Token mit veränderten letzten 2 Zeichen im HMAC ab", () => {
    const token = buildDoiToken(EMAIL, SOURCE);
    const flipped = token.slice(0, -2) + (token.endsWith("aa") ? "bb" : "aa");
    expect(verifyDoiToken(EMAIL, SOURCE, flipped)).toBe(false);
  });
});

// ─── Falsche Email ────────────────────────────────────────────────────────────

describe("verifyDoiToken — Token für andere Email", () => {
  it("lehnt Token ab wenn andere Email übergeben wird", () => {
    const token = buildDoiToken(EMAIL, SOURCE);
    expect(verifyDoiToken("other@example.com", SOURCE, token)).toBe(false);
  });

  it("lehnt Token ab wenn andere Source übergeben wird", () => {
    const token = buildDoiToken(EMAIL, SOURCE);
    expect(verifyDoiToken(EMAIL, "vvt", token)).toBe(false);
  });

  it("lehnt Token ab wenn Email und Source vertauscht sind", () => {
    const token = buildDoiToken(EMAIL, SOURCE);
    expect(verifyDoiToken(SOURCE, EMAIL, token)).toBe(false);
  });
});

// ─── Leere / falsch-geformte Token ──────────────────────────────────────────

describe("verifyDoiToken — leere oder fehlgeformte Token", () => {
  it("lehnt leeren String ab", () => {
    expect(verifyDoiToken(EMAIL, SOURCE, "")).toBe(false);
  });

  it("lehnt Token ohne Punkt-Trenner ab", () => {
    expect(verifyDoiToken(EMAIL, SOURCE, "noDotInHere")).toBe(false);
  });

  it("lehnt Token mit nicht-numerischem Timestamp ab (NaN)", () => {
    expect(verifyDoiToken(EMAIL, SOURCE, "abc.deadbeef")).toBe(false);
  });

  it("lehnt Token mit Timestamp 0 ab", () => {
    const token = buildTokenWithTs(EMAIL, SOURCE, 0, TEST_SECRET);
    expect(verifyDoiToken(EMAIL, SOURCE, token)).toBe(false);
  });

  it("lehnt abgelaufenes Token (> 7 Tage alt) ab", () => {
    const ts = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60 + 1);
    const token = buildTokenWithTs(EMAIL, SOURCE, ts, TEST_SECRET);
    expect(verifyDoiToken(EMAIL, SOURCE, token)).toBe(false);
  });

  it("lehnt Token ab das > 5 Minuten in der Zukunft liegt", () => {
    const ts = Math.floor(Date.now() / 1000) + 301;
    const token = buildTokenWithTs(EMAIL, SOURCE, ts, TEST_SECRET);
    expect(verifyDoiToken(EMAIL, SOURCE, token)).toBe(false);
  });

  it("akzeptiert Token 4 Minuten in der Zukunft (innerhalb der 5-Min-Toleranz)", () => {
    const ts = Math.floor(Date.now() / 1000) + 240;
    const token = buildTokenWithTs(EMAIL, SOURCE, ts, TEST_SECRET);
    expect(verifyDoiToken(EMAIL, SOURCE, token)).toBe(true);
  });
});

// ─── Kein Secret gesetzt ─────────────────────────────────────────────────────

describe("verifyDoiToken — kein DOI_SECRET", () => {
  it("wirft wenn DOI_SECRET nicht gesetzt ist", () => {
    const token = buildDoiToken(EMAIL, SOURCE);
    delete process.env.DOI_SECRET;
    expect(() => verifyDoiToken(EMAIL, SOURCE, token)).toThrow("DOI_SECRET missing");
    process.env.DOI_SECRET = TEST_SECRET; // wiederherstellen
  });
});
