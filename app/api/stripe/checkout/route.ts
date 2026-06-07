import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tool } = body as { tool: "avv" | "vvt" };

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
      payment_method_types: ["card", "sepa_debit"],
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
