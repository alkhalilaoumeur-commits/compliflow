import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { verifyLimiter } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  const ip =
    req.headers.get("x-real-ip")?.trim() ??
    (xff ? xff.split(",").at(-1)!.trim() : undefined) ??
    "unknown";

  if (await verifyLimiter(ip)) {
    return NextResponse.json({ valid: false, error: "Zu viele Anfragen" }, { status: 429 });
  }

  const sessionId = req.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("[verify-session] STRIPE_SECRET_KEY not set");
    return NextResponse.json({ error: "Payment system unavailable" }, { status: 503 });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-05-27.dahlia",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Watermark-Removal-Validation (neues Modell)
    const isWatermark =
      session.payment_status === "paid" &&
      session.status === "complete" &&
      session.metadata?.product === "watermark_removal" &&
      !!session.metadata?.doc_type;

    // Legacy AVV/VVT-Pro-Validation (für bestehende Sessions weiterhin akzeptiert)
    const isLegacyPro =
      session.payment_status === "paid" &&
      session.status === "complete" &&
      !!session.metadata?.tool;

    return NextResponse.json({
      valid: isWatermark || isLegacyPro,
      product: isWatermark ? "watermark_removal" : (isLegacyPro ? "legacy_pro" : null),
      docType: isWatermark ? session.metadata?.doc_type : null,
      tool: isLegacyPro ? session.metadata?.tool : null,
    });
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
