import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/stripe/webhook/route";

// Im Test (NODE_ENV !== "production") und ohne Stripe-Keys läuft der Webhook
// still durch ({ received:true }), statt eine ungeprüfte Signatur zu akzeptieren.
// Die echte Signaturprüfung (constructEvent mit gültigem Secret) ist eine
// Stripe-Integration und wird hier nicht getestet — siehe APP-AUDIT-CONTEXT.md §10.
function req(body: string): NextRequest {
  return new NextRequest("http://localhost:3000/api/stripe/webhook", {
    method: "POST",
    body,
  });
}

describe("POST /api/stripe/webhook", () => {
  const prev = { ...process.env };
  beforeEach(() => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });
  afterEach(() => {
    process.env = { ...prev };
  });

  it("läuft im Dev/Test ohne Keys still durch (received:true)", async () => {
    const res = await POST(req("{}"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.received).toBe(true);
  });
});
