"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { sendWaitlistNotification } from "@/lib/email";

type Result =
  | { ok: true; message: string }
  | { ok: false; message: string };

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function joinWaitlist(formData: FormData): Promise<Result> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const source = String(formData.get("source") ?? "coming-soon");

  if (!email || !EMAIL_RX.test(email)) {
    return { ok: false, message: "Bitte gib eine gültige Email-Adresse ein." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=ignore-duplicates",
        },
        body: JSON.stringify([{ email, source }]),
      });
      if (!res.ok && res.status !== 409) {
        const text = await res.text();
        console.error("Supabase waitlist insert failed", res.status, text);
        return { ok: false, message: "Konnten dich nicht speichern — versuch es bitte gleich nochmal." };
      }
    } catch (err) {
      console.error("Supabase request errored", err);
      return { ok: false, message: "Konnten dich nicht speichern — versuch es bitte gleich nochmal." };
    }
  } else {
    try {
      const dataDir = path.join(process.cwd(), ".data");
      await fs.mkdir(dataDir, { recursive: true });
      const file = path.join(dataDir, "waitlist.jsonl");
      const line = JSON.stringify({ email, source, ts: new Date().toISOString() }) + "\n";
      await fs.appendFile(file, line, "utf8");
    } catch {
      // Fallback-Schreiben schlägt still fehl — Email-Notification ist die primäre Sicherung
    }
  }

  // Email-Benachrichtigung an Inhaber — läuft immer (Resend als Backup wenn kein Supabase)
  sendWaitlistNotification({ email, source }).catch((err) =>
    console.error("Waitlist notification failed:", err)
  );

  return { ok: true, message: "Eingetragen. Du hörst von uns beim Launch." };
}
