import { createHmac } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { sendWaitlistNotification, sendWaitlistConfirmed } from "@/lib/email";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_SOURCES = ["coming-soon", "avv", "vvt", "cookie-banner"] as const;

function verifyDoiToken(email: string, source: string, token: string): boolean {
  const secret = process.env.DOI_SECRET ?? "compliflow-doi-fallback-secret";
  const expected = createHmac("sha256", secret).update(`${email}:${source}`).digest("hex");
  // Timing-safe comparison
  if (expected.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return diff === 0;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const email = (searchParams.get("email") ?? "").trim().toLowerCase();
  const source = searchParams.get("source") ?? "coming-soon";
  const token = searchParams.get("token") ?? "";

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://compliflow.de";

  // Validierung
  if (!EMAIL_RX.test(email) || !token) {
    return NextResponse.redirect(`${baseUrl}/waitlist/invalid`);
  }
  if (!ALLOWED_SOURCES.includes(source as typeof ALLOWED_SOURCES[number])) {
    return NextResponse.redirect(`${baseUrl}/waitlist/invalid`);
  }
  if (!verifyDoiToken(email, source, token)) {
    return NextResponse.redirect(`${baseUrl}/waitlist/invalid`);
  }

  // Token gültig → jetzt in Supabase oder Datei speichern
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      // merge-duplicates: bei vorhandener Email → UPDATE confirmed=true (kein silent ignore)
      await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify([{ email, source, confirmed: true, confirmed_at: new Date().toISOString() }]),
      });
    } catch (err) {
      console.error("Supabase DOI confirm failed", err);
    }
  } else {
    try {
      const dataDir = path.join(process.cwd(), ".data");
      await fs.mkdir(dataDir, { recursive: true });
      const file = path.join(dataDir, "waitlist-confirmed.jsonl");
      const line = JSON.stringify({ email, source, confirmed_at: new Date().toISOString() }) + "\n";
      await fs.appendFile(file, line, "utf8");
    } catch {
      // Fallback-Schreiben schlägt still fehl
    }
  }

  // Inhaber benachrichtigen + Bestätigungsmail an Nutzer
  sendWaitlistNotification({ email, source }).catch((err) =>
    console.error("Waitlist notification failed:", err)
  );
  sendWaitlistConfirmed({ email, source }).catch((err) =>
    console.error("Waitlist confirmed email failed:", err)
  );

  return NextResponse.redirect(`${baseUrl}/waitlist/confirmed`);
}
