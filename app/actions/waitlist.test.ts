import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { joinWaitlist } from "@/app/actions/waitlist";

// joinWaitlist ist eine Server-Action. Ohne RESEND_API_KEY ist der Mail-Versand
// ein No-Op (fire-and-forget), DOI_SECRET fällt im Nicht-Prod-Modus auf einen
// Dev-Fallback zurück — daher sind die Validierungs- und Erfolgs-Pfade ohne
// Netzwerk testbar.
function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

describe("joinWaitlist", () => {
  const prevKey = process.env.RESEND_API_KEY;
  beforeEach(() => {
    delete process.env.RESEND_API_KEY;
  });
  afterEach(() => {
    if (prevKey !== undefined) process.env.RESEND_API_KEY = prevKey;
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
