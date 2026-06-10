import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

// Rate-Limiting: max 20 verify-Anfragen pro IP pro Minute
// Verhindert Brute-Force auf Stripe Session IDs
const verifyRequests = new Map<string, { count: number; resetAt: number }>();

function isVerifyRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = verifyRequests.get(ip);
  if (!entry || now > entry.resetAt) {
    verifyRequests.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 20) return true;
  entry.count++;
  return false;
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isVerifyRateLimited(ip)) {
    return NextResponse.json({ valid: false, error: "Zu viele Anfragen" }, { status: 429 });
  }

  const sessionId = req.nextUrl.searchParams.get("sessionId");

  if (!sessionId || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-05-27.dahlia",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const isValid =
      session.payment_status === "paid" &&
      session.status === "complete" &&
      !!session.metadata?.tool;

    return NextResponse.json({
      valid: isValid,
      tool: isValid ? session.metadata?.tool : null,
    });
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
