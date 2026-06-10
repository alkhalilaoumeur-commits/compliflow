"use server";

import { createHmac } from "node:crypto";
import { sendWaitlistDoiEmail } from "@/lib/email";

type Result =
  | { ok: true; message: string }
  | { ok: false; message: string };

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Stateless Double Opt-In via HMAC-SHA256
// Token = HMAC(email:source, DOI_SECRET) — serverseitig verifizierbar ohne DB-Eintrag
function buildDoiToken(email: string, source: string): string {
  const secret = process.env.DOI_SECRET ?? "compliflow-doi-fallback-secret";
  return createHmac("sha256", secret).update(`${email}:${source}`).digest("hex");
}

export async function joinWaitlist(formData: FormData): Promise<Result> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const source = String(formData.get("source") ?? "coming-soon");

  if (!email || !EMAIL_RX.test(email)) {
    return { ok: false, message: "Bitte gib eine gültige Email-Adresse ein." };
  }

  // DOI-Email senden — Nutzer erscheint erst nach Klick auf Bestätigungs-Link in der confirmed-Liste
  const token = buildDoiToken(email, source);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://compliflow.de";
  const confirmUrl = `${baseUrl}/api/waitlist/confirm?email=${encodeURIComponent(email)}&source=${encodeURIComponent(source)}&token=${token}`;

  sendWaitlistDoiEmail({ email, source, confirmUrl }).catch((err) =>
    console.error("Waitlist DOI email failed:", err)
  );

  return { ok: true, message: "Fast dabei — bitte bestätige deine Anmeldung per E-Mail." };
}
