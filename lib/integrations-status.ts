/**
 * Integrations-Status — eine gemeinsame Wahrheitsquelle.
 *
 * Beantwortet die Frage: "Welche Integration läuft gerade ECHT, und welche
 * im Mock/Fallback?" — genau nach derselben Logik, die die einzelnen Routen
 * schon benutzen (lib/email.ts, lib/rate-limit.ts, brevo/subscribe, stripe/checkout,
 * waitlist/confirm). Wenn sich dort die Bedingung ändert, hier mitziehen.
 *
 * WICHTIG: Diese Datei liest ENV-Variablen, gibt aber NIEMALS deren Werte aus.
 * Nur "gesetzt ja/nein" und — wo unkritisch — den Modus (Live/Test aus dem
 * Key-Präfix). So kann der Report gefahrlos über /api/health nach außen.
 */

/** ok = echte Integration aktiv · degraded = Mock/Fallback (funktioniert eingeschränkt) · down = in Production kaputt (503/Absturz) */
export type Level = "ok" | "degraded" | "down";

export interface EnvVarState {
  /** Name der ENV-Variable — der WERT wird bewusst nie mitgegeben. */
  name: string;
  present: boolean;
}

export interface IntegrationStatus {
  key: string;
  label: string;
  level: Level;
  /** Kurzform des aktuellen Betriebsmodus, z. B. "Live", "Mock (Dev)", "Datei-Fallback". */
  mode: string;
  /** Menschliche Erklärung was das praktisch bedeutet. */
  detail: string;
  vars: EnvVarState[];
}

export interface HealthReport {
  /** true nur wenn keine Integration "down" ist. */
  healthy: boolean;
  /** Schlimmster Level über alle Integrationen. */
  overall: Level;
  environment: string;
  integrations: IntegrationStatus[];
}

function has(key: string): boolean {
  return Boolean(process.env[key]);
}

function v(name: string): EnvVarState {
  return { name, present: has(name) };
}

/** Rangfolge damit wir den schlimmsten Level bestimmen können. */
const RANK: Record<Level, number> = { ok: 0, degraded: 1, down: 2 };

function worst(levels: Level[]): Level {
  return levels.reduce<Level>((acc, l) => (RANK[l] > RANK[acc] ? l : acc), "ok");
}

/**
 * Baut den vollständigen Status-Report aus dem aktuellen process.env.
 * Reine Funktion — kein Netzwerk, keine Seiteneffekte.
 */
export function buildHealthReport(): HealthReport {
  const isProd = process.env.NODE_ENV === "production";

  const integrations: IntegrationStatus[] = [
    stripe(isProd),
    resend(isProd),
    brevo(isProd),
    supabase(),
    upstash(),
    core(isProd),
  ];

  const overall = worst(integrations.map((i) => i.level));

  return {
    healthy: overall !== "down",
    overall,
    environment: process.env.NODE_ENV ?? "unknown",
    integrations,
  };
}

// ─── Stripe (Zahlungen) ───────────────────────────────────────────────────────
// Spiegelt app/api/stripe/checkout/route.ts + lib/env.ts FORMAT_CHECKS.
function stripe(isProd: boolean): IntegrationStatus {
  const secret = process.env.STRIPE_SECRET_KEY ?? "";
  const price = has("STRIPE_PRICE_WATERMARK_REMOVAL");
  const webhook = has("STRIPE_WEBHOOK_SECRET");
  const vars = [
    v("STRIPE_SECRET_KEY"),
    v("STRIPE_PRICE_WATERMARK_REMOVAL"),
    v("STRIPE_WEBHOOK_SECRET"),
  ];

  // Key-Modus aus dem Präfix — kein Secret, nur "live oder test".
  const keyMode = !secret
    ? "fehlt"
    : secret.startsWith("sk_live_")
      ? "Live"
      : secret.startsWith("sk_test_")
        ? "Testmodus"
        : "unbekanntes Format";

  if (!secret || !price) {
    return {
      key: "stripe",
      label: "Stripe (Zahlungen)",
      level: isProd ? "down" : "degraded",
      mode: isProd ? "AUS" : "Mock (Dev)",
      detail: isProd
        ? "Key oder Price-ID fehlt — Checkout antwortet mit 503, keine Zahlungen möglich."
        : "Kein echter Checkout. Dev liefert einen Fake-'bezahlt'-Link (mock=true).",
      vars,
    };
  }

  // In Production ist ein Testmodus-Key ein harter Fehler (validateEnv blockt den Start).
  if (isProd && keyMode !== "Live") {
    return {
      key: "stripe",
      label: "Stripe (Zahlungen)",
      level: "down",
      mode: keyMode,
      detail: `STRIPE_SECRET_KEY ist ${keyMode} — in Production muss er mit "sk_live_" beginnen. Container-Start wird von validateEnv blockiert.`,
      vars,
    };
  }

  if (!webhook) {
    return {
      key: "stripe",
      label: "Stripe (Zahlungen)",
      level: "degraded",
      mode: keyMode,
      detail:
        "Checkout läuft, aber STRIPE_WEBHOOK_SECRET fehlt — Zahlungs-Bestätigungen via Webhook werden nicht verifiziert.",
      vars,
    };
  }

  return {
    key: "stripe",
    label: "Stripe (Zahlungen)",
    level: "ok",
    mode: keyMode,
    detail: `Echter Checkout aktiv (${keyMode}), Webhook-Verifizierung konfiguriert.`,
    vars,
  };
}

// ─── Resend (Transaktions-Mails) ──────────────────────────────────────────────
// Spiegelt lib/email.ts getResend().
function resend(isProd: boolean): IntegrationStatus {
  const key = has("RESEND_API_KEY");
  const vars = [v("RESEND_API_KEY")];

  if (key) {
    return {
      key: "resend",
      label: "Resend (Transaktions-Mails)",
      level: "ok",
      mode: "Live",
      detail: "E-Mails (Zahlungsbestätigung, DOI, Waitlist) werden echt versendet.",
      vars,
    };
  }

  return {
    key: "resend",
    label: "Resend (Transaktions-Mails)",
    level: isProd ? "down" : "degraded",
    mode: isProd ? "AUS" : "übersprungen (Dev)",
    detail: isProd
      ? "RESEND_API_KEY fehlt — jeder Mail-Versand wirft eine Exception."
      : "Kein Key: Mails werden im Dev stillschweigend übersprungen (nicht versendet).",
    vars,
  };
}

// ─── Brevo (Newsletter / Double-Opt-In) ───────────────────────────────────────
// Spiegelt app/api/brevo/subscribe/route.ts + lib/brevo/client.ts.
function brevo(isProd: boolean): IntegrationStatus {
  const key = has("BREVO_API_KEY");
  const list = has("BREVO_LIST_ID");
  const template = has("BREVO_DOI_TEMPLATE_ID");
  const vars = [v("BREVO_API_KEY"), v("BREVO_LIST_ID"), v("BREVO_DOI_TEMPLATE_ID")];
  const complete = key && list && template;

  if (complete) {
    return {
      key: "brevo",
      label: "Brevo (Newsletter/DOI)",
      level: "ok",
      mode: "Live",
      detail: "Newsletter-Anmeldungen werden echt an Brevo geschickt (Double-Opt-In-Mail geht raus).",
      vars,
    };
  }

  return {
    key: "brevo",
    label: "Brevo (Newsletter/DOI)",
    level: isProd ? "down" : "degraded",
    mode: isProd ? "AUS" : "Mock (Dev)",
    detail: isProd
      ? "Mindestens eine Brevo-Variable fehlt — /api/brevo/subscribe antwortet mit 503."
      : "Kein vollständiger Brevo-Zugang: Dev antwortet mit Mock (keine echte Anmeldung).",
    vars,
  };
}

// ─── Supabase (Waitlist-Datenbank) ────────────────────────────────────────────
// Spiegelt app/api/waitlist/confirm/route.ts.
function supabase(): IntegrationStatus {
  const url = has("NEXT_PUBLIC_SUPABASE_URL");
  const anon = has("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const vars = [v("NEXT_PUBLIC_SUPABASE_URL"), v("NEXT_PUBLIC_SUPABASE_ANON_KEY")];

  if (url && anon) {
    return {
      key: "supabase",
      label: "Supabase (Waitlist-DB)",
      level: "ok",
      mode: "Live",
      detail: "Bestätigte Waitlist-Einträge landen in der Supabase-Tabelle 'waitlist'.",
      vars,
    };
  }

  // Bewusster Fallback — nie "down". Aber Warnung: Datei überlebt keinen Container
  // ohne persistentes Volume.
  return {
    key: "supabase",
    label: "Supabase (Waitlist-DB)",
    level: "degraded",
    mode: "Datei-Fallback",
    detail:
      "Kein Supabase konfiguriert — Einträge gehen in .data/waitlist-confirmed.jsonl. ACHTUNG: ohne persistentes Volume beim Container-Neustart weg.",
    vars,
  };
}

// ─── Upstash Redis (Rate-Limiting) ────────────────────────────────────────────
// Spiegelt lib/rate-limit.ts tryGetRedis().
function upstash(): IntegrationStatus {
  const url = has("UPSTASH_REDIS_REST_URL");
  const token = has("UPSTASH_REDIS_REST_TOKEN");
  const vars = [v("UPSTASH_REDIS_REST_URL"), v("UPSTASH_REDIS_REST_TOKEN")];

  if (url && token) {
    return {
      key: "upstash",
      label: "Upstash Redis (Rate-Limit)",
      level: "ok",
      mode: "Live",
      detail: "Rate-Limits sind persistent und überleben Container-Restarts.",
      vars,
    };
  }

  return {
    key: "upstash",
    label: "Upstash Redis (Rate-Limit)",
    level: "degraded",
    mode: "In-Memory-Fallback",
    detail:
      "Kein Upstash — Rate-Limits liegen im RAM und resetten bei jedem Container-Restart (nach Deploy kurz wirkungslos).",
    vars,
  };
}

// ─── Basis (DOI-Signatur + App-URL) ───────────────────────────────────────────
// Gate für DOI-Token-Signatur und die in Mails gebauten Links.
function core(isProd: boolean): IntegrationStatus {
  const doi = has("DOI_SECRET");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const appUrlOk = appUrl.startsWith("https://");
  const vars = [v("DOI_SECRET"), v("NEXT_PUBLIC_APP_URL")];

  const levels: Level[] = [];
  const notes: string[] = [];

  if (doi) {
    levels.push("ok");
  } else {
    levels.push(isProd ? "down" : "degraded");
    notes.push("DOI_SECRET fehlt — Bestätigungs-Tokens können nicht signiert/geprüft werden.");
  }

  if (!appUrl) {
    levels.push(isProd ? "down" : "degraded");
    notes.push("NEXT_PUBLIC_APP_URL fehlt — Links in Mails fallen auf localhost zurück.");
  } else if (!appUrlOk) {
    levels.push(isProd ? "down" : "degraded");
    notes.push('NEXT_PUBLIC_APP_URL beginnt nicht mit "https://" — DOI-Links über http sind ungültig.');
  } else {
    levels.push("ok");
  }

  const level = worst(levels);
  return {
    key: "core",
    label: "Basis (DOI-Signatur + App-URL)",
    level,
    mode: level === "ok" ? "OK" : isProd ? "AUS" : "unvollständig (Dev)",
    detail: notes.length ? notes.join(" ") : "DOI-Signatur und App-URL korrekt gesetzt.",
    vars,
  };
}
