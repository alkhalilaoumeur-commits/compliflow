const IS_PROD = process.env.NODE_ENV === "production";

/**
 * Gibt den Wert einer ENV-Variable zurück.
 * In Production: wirft sofort wenn nicht gesetzt.
 * In Dev: gibt eine Warnung aus und gibt "" zurück.
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (value) return value;
  if (IS_PROD) {
    throw new Error(`[env] Required variable "${key}" not set — cannot serve requests`);
  }
  console.warn(`\x1b[33m[env] WARNING: "${key}" not set — this throws in production\x1b[0m`);
  return "";
}

const REQUIRED_IN_PRODUCTION = [
  "RESEND_API_KEY",
  "DOI_SECRET",
  "NEXT_PUBLIC_APP_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_WATERMARK_REMOVAL",
  "BREVO_API_KEY",
  "BREVO_LIST_ID",
  "BREVO_DOI_TEMPLATE_ID",
] as const;

/**
 * Wird beim Server-Start aufgerufen (instrumentation.ts).
 * Wirft in Production wenn eine kritische Variable fehlt → Container startet nicht.
 * In Dev ein No-Op.
 */
export function validateEnv(): void {
  if (!IS_PROD) return;
  const missing = REQUIRED_IN_PRODUCTION.filter((k) => !process.env[k]);
  if (missing.length === 0) return;
  throw new Error(
    `[env] Server startup aborted — missing required environment variables:\n` +
      missing.map((k) => `  ✗ ${k}`).join("\n") +
      `\n\nSet these in Coolify → Service → Environment Variables.`
  );
}
