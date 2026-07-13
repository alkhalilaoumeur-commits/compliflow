export async function register() {
  // Nur im Node.js-Runtime ausführen, nicht im Edge-Runtime
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateEnv } = await import("@/lib/env");
    validateEnv();

    // Persistenz-Modus beim Start laut loggen, damit eine stille
    // Fehlkonfiguration (Datenverlust bei Redeploy) sofort sichtbar ist.
    const hasSupabase =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (hasSupabase) {
      console.info("[startup] Waitlist-Persistenz: Supabase (redeploy-sicher)");
    } else {
      console.warn(
        "[startup] Waitlist-Persistenz: DATEI-FALLBACK .data/waitlist-confirmed.jsonl — " +
          "NICHT redeploy-sicher ohne persistentes Volume. Bestätigte Emails gehen bei jedem Deploy verloren. " +
          "NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY setzen oder Volume mounten.",
      );
    }
  }
}
