import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createHmac } from "node:crypto";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/waitlist/confirm/route";

// Die Confirm-Route leitet bei ungültiger Eingabe (Email/Source/Token) auf
// /waitlist/invalid um. Diese sicherheitsrelevanten Ablehnungs-Pfade sind ohne
// Netzwerk testbar. Der Erfolgs-Pfad (gültiges HMAC-Token) schreibt in Supabase
// bzw. eine Datei und versendet Mails — wird hier bewusst nicht ausgelöst.
function req(query: string): NextRequest {
  return new NextRequest(`http://localhost:3000/api/waitlist/confirm${query}`, {
    method: "GET",
  });
}

function isRedirectToInvalid(res: Response): boolean {
  const loc = res.headers.get("location") ?? "";
  return (res.status === 307 || res.status === 308) && loc.includes("/waitlist/invalid");
}

const TEST_SECRET = "test-doi-secret-for-vitest";

function buildToken(email: string, source: string, tsOverride?: number): string {
  const ts = tsOverride ?? Math.floor(Date.now() / 1000);
  const hmac = createHmac("sha256", TEST_SECRET)
    .update(`${email}:${source}:${ts}`)
    .digest("hex");
  return `${ts}.${hmac}`;
}

describe("GET /api/waitlist/confirm", () => {
  const prevSecret = process.env.DOI_SECRET;
  beforeEach(() => { process.env.DOI_SECRET = TEST_SECRET; });
  afterEach(() => {
    if (prevSecret !== undefined) process.env.DOI_SECRET = prevSecret;
    else delete process.env.DOI_SECRET;
  });

  it("leitet bei ungültiger Email auf /waitlist/invalid", async () => {
    const res = await GET(req("?email=kaputt&source=avv&token=abc"));
    expect(isRedirectToInvalid(res)).toBe(true);
  });

  it("leitet bei fehlendem Token auf /waitlist/invalid", async () => {
    const res = await GET(req("?email=a@b.de&source=avv"));
    expect(isRedirectToInvalid(res)).toBe(true);
  });

  it("leitet bei unbekannter Source auf /waitlist/invalid", async () => {
    const res = await GET(req("?email=a@b.de&source=hacker&token=abc"));
    expect(isRedirectToInvalid(res)).toBe(true);
  });

  it("leitet bei falschem Token auf /waitlist/invalid", async () => {
    const res = await GET(req("?email=a@b.de&source=avv&token=falsch123"));
    expect(isRedirectToInvalid(res)).toBe(true);
  });

  it("leitet bei abgelaufenem Token (> 7 Tage) auf /waitlist/invalid", async () => {
    const EIGHT_DAYS_S = 8 * 24 * 60 * 60;
    const oldTs = Math.floor(Date.now() / 1000) - EIGHT_DAYS_S;
    const token = buildToken("a@b.de", "avv", oldTs);
    const res = await GET(req(`?email=a@b.de&source=avv&token=${token}`));
    expect(isRedirectToInvalid(res)).toBe(true);
  });

  it("leitet bei zukunftsdatiertem Token (> 5 min) auf /waitlist/invalid", async () => {
    const futureTs = Math.floor(Date.now() / 1000) + 600; // 10 Minuten in der Zukunft
    const token = buildToken("a@b.de", "avv", futureTs);
    const res = await GET(req(`?email=a@b.de&source=avv&token=${token}`));
    expect(isRedirectToInvalid(res)).toBe(true);
  });

  it("leitet bei gültigem Token auf /waitlist/confirmed (Supabase-Schreiben schlägt fehl → trotzdem confirmed)", async () => {
    const token = buildToken("test-doi@example.com", "avv");
    const res = await GET(req(`?email=test-doi@example.com&source=avv&token=${token}`));
    const loc = res.headers.get("location") ?? "";
    // Ohne Supabase/RESEND leitet confirmed-Redirect auf /waitlist/confirmed
    expect(res.status === 307 || res.status === 308).toBe(true);
    expect(loc.includes("/waitlist/confirmed")).toBe(true);
  });
});
