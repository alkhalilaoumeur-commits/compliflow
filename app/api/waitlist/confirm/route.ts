import { createHmac } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { sendWaitlistNotification, sendWaitlistConfirmed } from "@/lib/email";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_SOURCES = ["coming-soon", "avv", "vvt", "cookie-banner"] as const;

const confirmBucket = new Map<string, { count: number; resetAt: number }>();
function isConfirmRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = confirmBucket.get(ip);
  if (!entry || now > entry.resetAt) {
    confirmBucket.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 10) return true;
  entry.count++;
  return false;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
function doiEpoch(): number {
  return Math.floor(Date.now() / SEVEN_DAYS_MS);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function verifyDoiToken(email: string, source: string, token: string): boolean {
  const secret = process.env.DOI_SECRET ?? (process.env.NODE_ENV === "production" ? null : "dev-only-fallback");
  if (!secret) return false;
  // Accept current and previous epoch → up to ~14 days validity
  const currentEpoch = doiEpoch();
  for (const epoch of [currentEpoch, currentEpoch - 1]) {
    const expected = createHmac("sha256", secret)
      .update(`${email}:${source}:${epoch}`)
      .digest("hex");
    if (timingSafeEqual(expected, token)) return true;
  }
  return false;
}

export async function GET(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  const ip =
    req.headers.get("x-real-ip")?.trim() ??
    (xff ? xff.split(",").at(-1)!.trim() : undefined) ??
    "unknown";

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://compliflow.de";

  if (isConfirmRateLimited(ip)) {
    return NextResponse.redirect(`${baseUrl}/waitlist/invalid`);
  }

  const { searchParams } = req.nextUrl;
  const email = (searchParams.get("email") ?? "").trim().toLowerCase();
  const source = searchParams.get("source") ?? "coming-soon";
  const token = searchParams.get("token") ?? "";

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
        // Hängt Supabase, blockiert sonst der Server-Thread bis ~30s Default-Timeout
        signal: AbortSignal.timeout(5000),
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
    } catch (err) {
      console.error("WAITLIST FALLBACK: .data/waitlist-confirmed.jsonl write failed — entry lost if container has no persistent volume", err);
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
