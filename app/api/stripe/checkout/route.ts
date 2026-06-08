import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TOOLS = ["avv", "vvt"] as const;
type Tool = (typeof ALLOWED_TOOLS)[number];

// Einfaches In-Memory Rate-Limiting: max 5 Checkout-Requests pro IP pro Minute
const ipRequests = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequests.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { tool } = body as { tool: Tool };

    if (!tool || !ALLOWED_TOOLS.includes(tool)) {
      return NextResponse.json({ error: "Ungültiger Tool-Parameter" }, { status: 400 });
    }

    const priceId =
      tool === "avv"
        ? process.env.STRIPE_PRICE_AVV_PRO
        : process.env.STRIPE_PRICE_VVT_PRO;

    if (!process.env.STRIPE_SECRET_KEY || !priceId) {
      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${tool}?success=true&mock=true`,
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-05-27.dahlia",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      locale: "de",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${tool}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${tool}`,
      metadata: { tool },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Checkout fehlgeschlagen" }, { status: 500 });
  }
}
