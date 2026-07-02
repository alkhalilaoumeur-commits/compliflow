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

// Format-Prüfungen für Vars, bei denen ein gesetzter-aber-falscher Wert teuer ist:
// z. B. der Stripe-Testmodus-Key versehentlich in Prod, oder eine App-URL ohne https.
// Nur Anwesenheit zu prüfen fängt das nicht — ein Tippfehler kommt sonst durch.
const FORMAT_CHECKS: { key: string; valid: (v: string) => boolean; hint: string }[] = [
  {
    key: "STRIPE_SECRET_KEY",
    valid: (v) => v.startsWith("sk_live_"),
    hint: 'muss mit "sk_live_" beginnen (Testmodus-Key sk_test_ ist in Production falsch)',
  },
  {
    key: "STRIPE_WEBHOOK_SECRET",
    valid: (v) => v.startsWith("whsec_"),
    hint: 'muss mit "whsec_" beginnen',
  },
  {
    key: "NEXT_PUBLIC_APP_URL",
    valid: (v) => v.startsWith("https://"),
    hint: 'muss mit "https://" beginnen (DOI-Links dürfen nicht über http gebaut werden)',
  },
];

/**
 * Wird beim Server-Start aufgerufen (instrumentation.ts).
 * Wirft in Production wenn eine kritische Variable fehlt ODER ein offensichtlich
 * falsches Format hat → Container startet nicht.
 * In Dev ein No-Op.
 */
export function validateEnv(): void {
  if (!IS_PROD) return;

  const missing = REQUIRED_IN_PRODUCTION.filter((k) => !process.env[k]);

  // Format nur für gesetzte Vars prüfen — fehlende sind oben schon erfasst,
  // sonst würde dieselbe Var doppelt gemeldet.
  const malformed = FORMAT_CHECKS.filter(
    ({ key, valid }) => process.env[key] && !valid(process.env[key] as string)
  );

  if (missing.length === 0 && malformed.length === 0) return;

  const lines = [
    ...missing.map((k) => `  ✗ ${k} — fehlt`),
    ...malformed.map(({ key, hint }) => `  ✗ ${key} — ${hint}`),
  ];
  throw new Error(
    `[env] Server startup aborted — environment variable problems:\n` +
      lines.join("\n") +
      `\n\nSet/fix these in Coolify → Service → Environment Variables.`
  );
}
