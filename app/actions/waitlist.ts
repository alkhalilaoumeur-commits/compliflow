"use server";

import { buildDoiToken } from "@/lib/doi-token";
import { sendWaitlistDoiEmail } from "@/lib/email";

type Result =
  | { ok: true; message: string }
  | { ok: false; message: string };

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const source = String(formData.get("source") ?? "coming-soon");

  if (!email || !EMAIL_RX.test(email)) {
    return { ok: false, message: "Bitte gib eine gültige Email-Adresse ein." };
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
