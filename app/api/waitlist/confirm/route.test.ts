import { describe, it, expect } from "vitest";
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

describe("GET /api/waitlist/confirm", () => {
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
});
