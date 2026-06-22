import { NextRequest, NextResponse } from "next/server";
import { brevoSubscribeDoi, isValidEmail } from "@/lib/brevo/client";
import { brevoLimiter } from "@/lib/rate-limit";

/**
 * Brevo-Subscribe-Endpoint (Double-Opt-In)
 *
 * POST /api/brevo/subscribe
 * Body: { email: string, quelle?: string, consent: boolean }
 *
 * - Rate-Limit: 5/Minute pro IP (persistent via Upstash wenn konfiguriert)
 * - Plausibilitätscheck der Email
 * - Consent-Flag muss true sein (UWG § 7 Pflicht)
 * - Brevo verschickt Bestätigungs-Email automatisch
 */

const ALLOWED_QUELLEN = [
  "compliflow_generator",
  "avv",
  "vvt",
  "impressum",
  "datenschutz",
  "widerruf",
  "agb",
  "cookie_banner",
  "newsletter_form",
  "exit_intent",
] as const;

export async function POST(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  const ip =
    req.headers.get("x-real-ip")?.trim() ??
    (xff ? xff.split(",").at(-1)!.trim() : undefined) ??
    "unknown";

  if (await brevoLimiter(ip)) {
    return NextResponse.json(
      { ok: false, error: "Zu viele Anfragen — bitte später erneut versuchen." },
      { status: 429 },
    );
  }

  let body: { email?: string; quelle?: string; consent?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Ungültiger Request-Body" }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const quelle = body.quelle ?? "compliflow_generator";
  const consent = body.consent === true;

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Bitte eine gültige E-Mail-Adresse eingeben." }, { status: 400 });
  }

  if (!consent) {
    return NextResponse.json(
      { ok: false, error: "Bitte stimme der Verarbeitung zu (Double-Opt-In-Verfahren)." },
      { status: 400 },
    );
  }

  const safeQuelle = (ALLOWED_QUELLEN as readonly string[]).includes(quelle)
    ? quelle
    : "compliflow_generator";

  if (!process.env.BREVO_API_KEY) {
    if (process.env.NODE_ENV === "production") {
      console.error("[brevo/subscribe] BREVO_API_KEY not set in production");
      return NextResponse.json(
        { ok: false, error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }
    // Dev-only Mock
    return NextResponse.json({
      ok: true,
      mock: true,
      message: "Mock-Modus: BREVO_API_KEY nicht gesetzt. In Production würde jetzt eine Bestätigungs-Email gesendet.",
    });
  }

  const result = await brevoSubscribeDoi({
    email,
    quelle: safeQuelle,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status === 429 ? 429 : 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    isNew: result.isNew,
    message: result.isNew
      ? "Bitte bestätige deine E-Mail über den Link, den wir dir gerade geschickt haben."
      : "Du bist bereits angemeldet — alles gut.",
  });
}
