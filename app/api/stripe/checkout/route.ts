import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { checkoutLimiter } from "@/lib/rate-limit";

/**
 * Watermark-Removal-Checkout (0,99€ One-Time)
 * Quelle: Compliflow Monetarisierungs-Strategie 2026-06-16 — Day-1-Cash-Hebel
 *
 * Ersetzt das alte 29€-Pro-Tier für AVV/VVT vollständig.
 * User zahlt 0,99€ um den "Erstellt mit Compliflow"-Credit aus seinem generierten
 * Dokument zu entfernen. Free-Tier bleibt voll funktional.
 */

const ALLOWED_DOC_TYPES = [
  "avv",
  "vvt",
  "impressum",
  "datenschutz",
  "widerruf",
  "agb",
  "cookie_banner",
] as const;
type DocType = (typeof ALLOWED_DOC_TYPES)[number];

const DOC_LABELS: Record<DocType, string> = {
  avv: "AVV (Auftragsverarbeitungsvertrag)",
  vvt: "VVT (Verzeichnis Verarbeitungstätigkeiten)",
  impressum: "Impressum",
  datenschutz: "Datenschutzerklärung",
  widerruf: "Widerrufsbelehrung",
  agb: "Allgemeine Geschäftsbedingungen",
  cookie_banner: "Cookie-Banner",
};

export async function POST(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  const ip =
    req.headers.get("x-real-ip")?.trim() ??
    (xff ? xff.split(",").at(-1)!.trim() : undefined) ??
    "unknown";

  if (await checkoutLimiter(ip)) {
    return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { docType, returnPath } = body as { docType: DocType; returnPath?: string };

    if (!docType || !ALLOWED_DOC_TYPES.includes(docType)) {
      return NextResponse.json({ error: "Ungültiger docType-Parameter" }, { status: 400 });
    }

    const priceId = process.env.STRIPE_PRICE_WATERMARK_REMOVAL;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const safeReturnPath = sanitizeReturnPath(returnPath);

    // Mock-Modus NUR lokal/Dev. In Production niemals einen Fake-"bezahlt"-Link
    // ausliefern — sonst kann jeder ohne Zahlung das Wasserzeichen entfernen.
    if (!process.env.STRIPE_SECRET_KEY || !priceId) {
      if (process.env.NODE_ENV === "production") {
        console.error("CRITICAL: Stripe-Keys/Price fehlen in Production (checkout)");
        return NextResponse.json({ error: "Payment system unavailable" }, { status: 503 });
      }
      return NextResponse.json({
        url: `${baseUrl}${safeReturnPath}?watermark_removed=true&mock=true&doc_type=${docType}`,
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
      success_url: `${baseUrl}${safeReturnPath}?watermark_removed=true&session_id={CHECKOUT_SESSION_ID}&doc_type=${docType}`,
      cancel_url: `${baseUrl}${safeReturnPath}?watermark_canceled=true`,
      metadata: {
        product: "watermark_removal",
        doc_type: docType,
        doc_label: DOC_LABELS[docType],
      },
      // Widerrufsrecht: Einwilligung zum sofortigen Beginn der digitalen Leistung
      // (§ 356 Abs. 5 BGB — Widerruf erlischt mit Beginn der Ausführung)
      consent_collection: {
        terms_of_service: "required",
      },
      custom_text: {
        terms_of_service_acceptance: {
          message:
            "Ich habe die [AGB](https://compliflow.de/agb) und [Widerrufsbelehrung](https://compliflow.de/widerruf) gelesen. Ich stimme ausdrücklich zu, dass die Leistung (Entfernung des Compliflow-Credits aus meinem Dokument) sofort beginnt und ich mein Widerrufsrecht damit verliere (§ 356 Abs. 5 BGB).",
        },
        submit: {
          message: "0,99€ für werbefreien Output. Einmalig pro Dokument.",
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Checkout fehlgeschlagen" }, { status: 500 });
  }
}

function sanitizeReturnPath(path?: string): string {
  if (!path || typeof path !== "string") return "/";
  // Nur relative Pfade zulassen (Open-Redirect-Schutz)
  if (!path.startsWith("/")) return "/";
  if (path.startsWith("//")) return "/";
  if (path.includes("://")) return "/";
  // Max 200 Zeichen
  return path.slice(0, 200);
}
