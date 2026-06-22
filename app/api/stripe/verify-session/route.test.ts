import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/stripe/verify-session/route";

// Ohne STRIPE_SECRET_KEY bzw. ohne sessionId antwortet die Route mit 400
// { valid:false } — diese Pfade plus das Rate-Limit sind ohne Stripe testbar.
// Die echte Session-Verifikation (stripe.retrieve) ist Netzwerk und wird nicht getestet.
function req(query: string, ip = "2.2.2.2"): NextRequest {
  return new NextRequest(`http://localhost:3000/api/stripe/verify-session${query}`, {
    method: "GET",
    headers: { "x-forwarded-for": ip },
  });
}

describe("GET /api/stripe/verify-session", () => {
  const prev = { ...process.env };
  beforeEach(() => {
    delete process.env.STRIPE_SECRET_KEY;
  });
  afterEach(() => {
    process.env = { ...prev };
  });

  it("antwortet 400/valid:false ohne sessionId", async () => {
    const res = await GET(req("", "20.0.0.1"));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.valid).toBe(false);
  });

  it("antwortet 503 wenn STRIPE_SECRET_KEY fehlt", async () => {
    const res = await GET(req("?sessionId=cs_test_abc", "20.0.0.2"));
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toBeTruthy();
  });

  it("greift nach 20 Anfragen pro IP/Minute mit 429 (Rate-Limit)", async () => {
    const ip = "20.9.9.9";
    let last: Response | undefined;
    for (let i = 0; i < 21; i++) {
      last = await GET(req("?sessionId=x", ip));
    }
    expect(last!.status).toBe(429);
  });
});
