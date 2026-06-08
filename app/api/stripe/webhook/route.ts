import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { sendPaymentConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ received: true });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-05-27.dahlia",
  });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ received: true });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Webhook signature failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const tool = session.metadata?.tool as "avv" | "vvt" | undefined;
    const customerEmail = session.customer_details?.email;

    if (tool && customerEmail && process.env.RESEND_API_KEY) {
      try {
        await sendPaymentConfirmation({
          to: customerEmail,
          tool,
          sessionId: session.id,
        });
      } catch (err) {
        console.error("Resend email error:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
