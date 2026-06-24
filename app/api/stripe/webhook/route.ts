import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { sendPaymentConfirmation } from "@/lib/email";

/**
 * Stripe-Webhook-Empfänger.
 *
 * BEWUSST OHNE IP-Rate-Limit (anders als alle anderen API-Routes):
 * Stripe stellt Events von wechselnden IPs zu und retried bei Nicht-200.
 * Ein Rate-Limit würde legitime Events verwerfen → verlorene Zahlungsbestätigungen.
 * Der Schutz läuft stattdessen über die HMAC-Signaturprüfung unten
 * (constructEvent gegen STRIPE_WEBHOOK_SECRET) — gefälschte Requests fliegen
 * dort mit 400 raus, bevor irgendetwas verarbeitet wird.
 */
export async function POST(req: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";

  // In Production niemals ungeprüft 200 zurückgeben — sonst akzeptiert die App
  // gefälschte Webhooks (Fake-Zahlungs-Mails). Nur lokal/Dev darf still durchlaufen.
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    if (isProd) {
      console.error("CRITICAL: Stripe-Keys fehlen in Production (webhook)");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }
    return NextResponse.json({ received: true });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-05-27.dahlia",
  });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
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

    if (tool && customerEmail) {
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
