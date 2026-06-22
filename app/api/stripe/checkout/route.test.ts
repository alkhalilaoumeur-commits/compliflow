import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/stripe/checkout/route";

// Im Test gilt NODE_ENV !== "production" → der Mock-Modus ist aktiv, solange
// keine STRIPE_SECRET_KEY/Price-IDs gesetzt sind. So lassen sich Validierung,
// Rate-Limit und Mock-Pfad ohne echten Stripe-Call prüfen.
function req(body: unknown, ip = "1.2.3.4"): NextRequest {
  return new NextRequest("http://localhost:3000/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

describe("POST /api/stripe/checkout", () => {
  const prev = { ...process.env };
  beforeEach(() => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_PRICE_WATERMARK_REMOVAL;
  });
  afterEach(() => {
    process.env = { ...prev };
  });

  it("liefert im Mock-Modus eine Erfolgs-URL für gültigen docType", async () => {
    const res = await POST(req({ docType: "avv", returnPath: "/avv" }, "10.0.0.1"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.url).toContain("watermark_removed=true");
    expect(data.url).toContain("mock=true");
    expect(data.url).toContain("doc_type=avv");
  });

  it("lehnt einen ungültigen docType mit 400 ab", async () => {
    const res = await POST(req({ docType: "schummel" }, "10.0.0.2"));
    expect(res.status).toBe(400);
  });

  it("sanitisiert einen Open-Redirect-returnPath (kein //fremd.host)", async () => {
    const res = await POST(req({ docType: "vvt", returnPath: "//evil.example.com" }, "10.0.0.3"));
    const data = await res.json();
    expect(data.url).not.toContain("//evil.example.com");
  });

  it("greift nach 5 Anfragen pro IP/Minute mit 429 (Rate-Limit)", async () => {
    const ip = "10.9.9.9";
    let last: Response | undefined;
    for (let i = 0; i < 6; i++) {
      last = await POST(req({ docType: "avv" }, ip));
    }
    expect(last!.status).toBe(429);
  });
});
