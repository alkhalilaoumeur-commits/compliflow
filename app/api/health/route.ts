import { NextRequest, NextResponse } from "next/server";
import { buildHealthReport } from "@/lib/integrations-status";
import { healthLimiter } from "@/lib/rate-limit";

/**
 * Health-/Config-Check — GET /api/health
 *
 * Zeigt für jede Integration (Stripe/Resend/Brevo/Supabase/Upstash + Basis),
 * ob sie ECHT läuft oder im Mock/Fallback. Leakt KEINE Secrets — nur
 * "vorhanden ja/nein" und den Modus (Live/Test).
 *
 * HTTP-Code:
 *   200 → alles ok oder nur degraded (Mock/Fallback, funktioniert)
 *   503 → mindestens eine Integration ist "down" (in Production kaputt)
 * So kann Coolifys Docker-HEALTHCHECK / ein Monitoring den 503 direkt erkennen.
 */

// Immer frisch aus dem aktuellen ENV lesen, nie statisch cachen.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  // Externe Aufrufe (kommen mit Proxy-Headern durch Traefik) rate-limiten —
  // der interne Docker-HEALTHCHECK von 127.0.0.1 hat keine Proxy-Header und
  // darf nie geblockt werden, sonst meldet der Container fälschlich unhealthy.
  const externalIp = req.headers.get("x-real-ip")?.trim();
  if (externalIp && (await healthLimiter(externalIp))) {
    return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 });
  }

  const report = buildHealthReport();
  return NextResponse.json(report, {
    status: report.healthy ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
