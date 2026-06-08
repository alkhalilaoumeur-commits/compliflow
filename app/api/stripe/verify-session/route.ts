import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
