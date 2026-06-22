import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isValidEmail, brevoSubscribeDoi } from "@/lib/brevo/client";

// Beispieltest gegen echten App-Code: die Email-Plausibilitätsprüfung,
// die im Brevo-Newsletter-Flow (/api/brevo/subscribe) genutzt wird.
describe("isValidEmail", () => {
  it("akzeptiert eine normale Adresse", () => {
    expect(isValidEmail("ilias@compliflow.de")).toBe(true);
  });

  it("lehnt Adressen ohne @ ab", () => {
    expect(isValidEmail("ilias.compliflow.de")).toBe(false);
  });

  it("lehnt Adressen ohne Domain-Punkt ab", () => {
    expect(isValidEmail("ilias@localhost")).toBe(false);
  });

  it("lehnt leere Eingabe ab", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("lehnt zu lange Adressen (>254 Zeichen) ab", () => {
    const tooLong = "a".repeat(250) + "@x.de";
    expect(isValidEmail(tooLong)).toBe(false);
  });
});

// brevoSubscribeDoi spricht die Brevo-REST-API per fetch an. Wir mocken fetch,
// damit kein echter Netzwerk-Call passiert, und prüfen die Antwort-Logik.
describe("brevoSubscribeDoi", () => {
  const prevKey = process.env.BREVO_API_KEY;

  afterEach(() => {
    vi.unstubAllGlobals();
    if (prevKey === undefined) delete process.env.BREVO_API_KEY;
    else process.env.BREVO_API_KEY = prevKey;
  });

  it("schlägt ohne BREVO_API_KEY mit Status 500 fehl", async () => {
    delete process.env.BREVO_API_KEY;
    const res = await brevoSubscribeDoi({ email: "a@b.de" });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.status).toBe(500);
  });

  it("meldet bei HTTP 201 einen neuen Kontakt (isNew=true)", async () => {
    process.env.BREVO_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 201 })));
    const res = await brevoSubscribeDoi({ email: "neu@b.de" });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.isNew).toBe(true);
  });

  it("meldet bei HTTP 204 Erfolg ohne neuen Kontakt (isNew=false)", async () => {
    process.env.BREVO_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 204 })));
    const res = await brevoSubscribeDoi({ email: "bekannt@b.de" });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.isNew).toBe(false);
  });

  it("behandelt 'duplicate_parameter' als bereits-angemeldet (ok=true)", async () => {
    process.env.BREVO_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ code: "duplicate_parameter", message: "exists" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );
    const res = await brevoSubscribeDoi({ email: "doppelt@b.de" });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.isNew).toBe(false);
  });

  it("gibt einen Netzwerkfehler als ok=false zurück", async () => {
    process.env.BREVO_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network down"); }));
    const res = await brevoSubscribeDoi({ email: "fehler@b.de" });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.status).toBe(500);
  });
});
