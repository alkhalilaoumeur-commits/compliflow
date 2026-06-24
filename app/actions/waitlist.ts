"use server";

import { headers } from "next/headers";
import { buildDoiToken } from "@/lib/doi-token";
import { sendWaitlistDoiEmail } from "@/lib/email";
import { waitlistLimiter } from "@/lib/rate-limit";

type Result =
  | { ok: true; message: string }
  | { ok: false; message: string };

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Muss mit ALLOWED_SOURCES in app/api/waitlist/confirm/route.ts übereinstimmen
const ALLOWED_SOURCES = ["coming-soon", "avv", "vvt", "cookie-banner"] as const;

// Rate-limit: max 1 DOI-Email pro Adresse alle 10 Minuten
const doiCooldown = new Map<string, number>();
const DOI_COOLDOWN_MS = 10 * 60 * 1000;

function isEmailRateLimited(email: string): boolean {
  const last = doiCooldown.get(email);
  if (last && Date.now() - last < DOI_COOLDOWN_MS) return true;
  doiCooldown.set(email, Date.now());
  if (doiCooldown.size > 500) {
    // Älteste Einträge löschen wenn Map zu groß wird
    const oldest = [...doiCooldown.entries()].sort((a, b) => a[1] - b[1]).slice(0, 100);
    oldest.forEach(([k]) => doiCooldown.delete(k));
  }
  return false;
}


export async function joinWaitlist(formData: FormData): Promise<Result> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const rawSource = String(formData.get("source") ?? "coming-soon");
  // Ungültige Werte auf Default abklemmen — verhindert beliebige source-Werte in der Confirm-URL
  const source = (ALLOWED_SOURCES as readonly string[]).includes(rawSource)
    ? rawSource
    : "coming-soon";

  if (!email || !EMAIL_RX.test(email)) {
    return { ok: false, message: "Bitte gib eine gültige Email-Adresse ein." };
  }

  // IP-Rate-Limit (Upstash-persistent) — verhindert Email-Versand-Flut über
  // beliebig viele verschiedene Adressen von einer IP. Greift vor dem Versand.
  const hdrs = await headers();
  const xff = hdrs.get("x-forwarded-for");
  const ip =
    hdrs.get("x-real-ip")?.trim() ??
    (xff ? xff.split(",").at(-1)!.trim() : undefined) ??
    "unknown";

  if (await waitlistLimiter(ip)) {
    return { ok: true, message: "Fast dabei — bitte bestätige deine Anmeldung per E-Mail." };
  }

  if (isEmailRateLimited(email)) {
    return { ok: true, message: "Fast dabei — bitte bestätige deine Anmeldung per E-Mail." };
  }

  // DOI-Email senden — Nutzer erscheint erst nach Klick auf Bestätigungs-Link in der confirmed-Liste
  const token = buildDoiToken(email, source);
  const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!rawAppUrl && process.env.NODE_ENV === "production") {
    console.error("[waitlist] NEXT_PUBLIC_APP_URL not set — DOI links would point to wrong domain");
    return { ok: false, message: "Interner Konfigurationsfehler — bitte später versuchen." };
  }
  const baseUrl = rawAppUrl ?? "http://localhost:3000";
  const confirmUrl = `${baseUrl}/api/waitlist/confirm?email=${encodeURIComponent(email)}&source=${encodeURIComponent(source)}&token=${token}`;

  sendWaitlistDoiEmail({ email, source, confirmUrl }).catch((err) =>
    console.error("Waitlist DOI email failed:", err)
  );

  return { ok: true, message: "Fast dabei — bitte bestätige deine Anmeldung per E-Mail." };
}
