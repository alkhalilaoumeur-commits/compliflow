import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { joinWaitlist } from "@/app/actions/waitlist";

// joinWaitlist ruft await headers() (next/headers) für die IP-Ermittlung des
// Rate-Limits auf. In vitest gibt es keinen Request-Scope → ohne Mock wirft der
// Aufruf "headers was called outside a request scope". Wir liefern leere Header,
// sodass die IP auf "unknown" fällt (für die Validierungs-Tests irrelevant).
vi.mock("next/headers", () => ({
  headers: async () => new Map<string, string>(),
}));

// joinWaitlist ist eine Server-Action. Ohne RESEND_API_KEY ist der Mail-Versand
// ein No-Op (fire-and-forget). DOI_SECRET wird im Test explizit gesetzt —
// kein Dev-Fallback mehr im Code.
function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

describe("joinWaitlist", () => {
  const prevResend = process.env.RESEND_API_KEY;
  const prevDoi = process.env.DOI_SECRET;
  beforeEach(() => {
    delete process.env.RESEND_API_KEY;
    process.env.DOI_SECRET = "test-secret-for-vitest";
  });
  afterEach(() => {
    if (prevResend !== undefined) process.env.RESEND_API_KEY = prevResend;
    if (prevDoi !== undefined) process.env.DOI_SECRET = prevDoi;
    else delete process.env.DOI_SECRET;
  });

  it("lehnt eine ungültige Email ab", async () => {
    const res = await joinWaitlist(form({ email: "kein-email", source: "avv" }));
    expect(res.ok).toBe(false);
  });

  it("lehnt eine leere Email ab", async () => {
    const res = await joinWaitlist(form({ email: "", source: "avv" }));
    expect(res.ok).toBe(false);
  });

  it("akzeptiert eine gültige Email", async () => {
    const res = await joinWaitlist(form({ email: "neu-unique-1@compliflow.de", source: "avv" }));
    expect(res.ok).toBe(true);
  });

  it("antwortet beim zweiten Versuch derselben Adresse weiterhin ok (Rate-Limit, kein Fehler)", async () => {
    const email = "wiederholung-unique-2@compliflow.de";
    await joinWaitlist(form({ email, source: "avv" }));
    const res = await joinWaitlist(form({ email, source: "avv" }));
    expect(res.ok).toBe(true);
  });
});
