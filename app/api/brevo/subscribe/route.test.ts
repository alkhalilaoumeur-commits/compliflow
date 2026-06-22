import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/brevo/subscribe/route";

// Ohne BREVO_API_KEY antwortet die Route im Mock-Modus. Validierung (Email,
// Consent, Rate-Limit, kaputter Body) ist ohne Netzwerk testbar.
function req(body: unknown, ip = "3.3.3.3", raw?: string): NextRequest {
  return new NextRequest("http://localhost:3000/api/brevo/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: raw ?? JSON.stringify(body),
  });
}

describe("POST /api/brevo/subscribe", () => {
  const prev = { ...process.env };
  beforeEach(() => {
    delete process.env.BREVO_API_KEY;
  });
  afterEach(() => {
    process.env = { ...prev };
  });

  it("liefert Mock-Antwort bei gültiger Email + Consent ohne BREVO_API_KEY", async () => {
    const res = await POST(req({ email: "a@b.de", consent: true }, "30.0.0.1"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.mock).toBe(true);
  });

  it("lehnt fehlenden Consent mit 400 ab", async () => {
    const res = await POST(req({ email: "a@b.de", consent: false }, "30.0.0.2"));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
  });

  it("lehnt ungültige Email mit 400 ab", async () => {
    const res = await POST(req({ email: "kaputt", consent: true }, "30.0.0.3"));
    expect(res.status).toBe(400);
  });

  it("lehnt kaputten JSON-Body mit 400 ab", async () => {
    const res = await POST(req(undefined, "30.0.0.4", "{nicht-json"));
    expect(res.status).toBe(400);
  });

  it("greift nach 5 Anfragen pro IP/Minute mit 429 (Rate-Limit)", async () => {
    const ip = "30.9.9.9";
    let last: Response | undefined;
    for (let i = 0; i < 6; i++) {
      last = await POST(req({ email: "a@b.de", consent: true }, ip));
    }
    expect(last!.status).toBe(429);
  });
});
