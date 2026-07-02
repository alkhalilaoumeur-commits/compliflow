import { NextResponse } from "next/server";
import { buildHealthReport } from "@/lib/integrations-status";

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

export function GET() {
  const report = buildHealthReport();
  return NextResponse.json(report, {
    status: report.healthy ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
