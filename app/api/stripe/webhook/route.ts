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
    const customerEmail = session.customer_details?.email;
    const meta = session.metadata ?? {};

    // Aktuelles Produkt: Watermark-Removal (metadata.product).
    // Legacy-Fallback: altes Pro-Tier setzte metadata.tool (avv/vvt).
    let docType: string | undefined;
    let docLabel: string | undefined;
    if (meta.product === "watermark_removal" && meta.doc_type) {
      docType = meta.doc_type;
      docLabel = meta.doc_label || meta.doc_type;
    } else if (meta.tool === "avv" || meta.tool === "vvt") {
      docType = meta.tool;
      docLabel = meta.tool === "avv" ? "AVV (Auftragsverarbeitungsvertrag)" : "VVT (Verzeichnis Verarbeitungstätigkeiten)";
    }

    if (docType && docLabel && customerEmail) {
      try {
        await sendPaymentConfirmation({
          to: customerEmail,
          docType,
          docLabel,
          sessionId: session.id,
        });
      } catch (err) {
        console.error("Resend email error:", err instanceof Error ? err.message : err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
