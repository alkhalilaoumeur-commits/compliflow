// Testet buildHealthReport() — die gemeinsame Wahrheitsquelle hinter /api/health
// und scripts/check-config.mjs. buildHealthReport liest process.env bei jedem
// Aufruf (nicht beim Modul-Load), deshalb reicht vi.stubEnv ohne resetModules.

import { afterEach, describe, expect, it, vi } from "vitest";
import { buildHealthReport, type Level } from "./integrations-status";

// Alle Vars, die der Report anfasst — werden pro Test explizit gesetzt/geleert,
// damit echte ENV-Werte der Testmaschine nicht durchsickern.
const ALL_VARS = [
  "STRIPE_SECRET_KEY",
  "STRIPE_PRICE_WATERMARK_REMOVAL",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "BREVO_API_KEY",
  "BREVO_LIST_ID",
  "BREVO_DOI_TEMPLATE_ID",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "DOI_SECRET",
  "NEXT_PUBLIC_APP_URL",
];

// Vollständig & korrekt konfigurierte Production-Umgebung.
const FULL_PROD: Record<string, string> = {
  STRIPE_SECRET_KEY: "sk_live_dummy",
  STRIPE_PRICE_WATERMARK_REMOVAL: "price_dummy",
  STRIPE_WEBHOOK_SECRET: "whsec_dummy",
  RESEND_API_KEY: "re_dummy",
  BREVO_API_KEY: "xkeysib-dummy",
  BREVO_LIST_ID: "3",
  BREVO_DOI_TEMPLATE_ID: "2",
  NEXT_PUBLIC_SUPABASE_URL: "https://xyz.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-dummy",
  UPSTASH_REDIS_REST_URL: "https://x.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "tok-dummy",
  DOI_SECRET: "secret-dummy",
  NEXT_PUBLIC_APP_URL: "https://compliflow.de",
};

function apply(nodeEnv: string, vars: Record<string, string>) {
  vi.stubEnv("NODE_ENV", nodeEnv);
  for (const k of ALL_VARS) vi.stubEnv(k, vars[k] ?? "");
}

function levelOf(report: ReturnType<typeof buildHealthReport>, key: string): Level {
  const it = report.integrations.find((i) => i.key === key);
  if (!it) throw new Error(`Integration ${key} fehlt im Report`);
  return it.level;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("buildHealthReport", () => {
  it("meldet alles ok bei vollständiger Production-Config", () => {
    apply("production", FULL_PROD);
    const report = buildHealthReport();
    expect(report.healthy).toBe(true);
    expect(report.overall).toBe("ok");
    for (const it of report.integrations) expect(it.level).toBe("ok");
  });

  it("leakt niemals einen Secret-Wert", () => {
    apply("production", FULL_PROD);
    const json = JSON.stringify(buildHealthReport());
    for (const value of Object.values(FULL_PROD)) {
      expect(json).not.toContain(value);
    }
  });

  it("Stripe: fehlender Key ist in Production down, in Dev nur degraded", () => {
    apply("production", { ...FULL_PROD, STRIPE_SECRET_KEY: "" });
    expect(levelOf(buildHealthReport(), "stripe")).toBe("down");

    apply("development", { ...FULL_PROD, STRIPE_SECRET_KEY: "" });
    expect(levelOf(buildHealthReport(), "stripe")).toBe("degraded");
  });

  it("Stripe: Testmodus-Key in Production ist down und wird im Modus benannt", () => {
    apply("production", { ...FULL_PROD, STRIPE_SECRET_KEY: "sk_test_dummy" });
    const stripe = buildHealthReport().integrations.find((i) => i.key === "stripe")!;
    expect(stripe.level).toBe("down");
    expect(stripe.mode).toBe("Testmodus");
  });

  it("Stripe: fehlender Webhook-Secret ist degraded (Checkout läuft, Verifizierung nicht)", () => {
    apply("production", { ...FULL_PROD, STRIPE_WEBHOOK_SECRET: "" });
    expect(levelOf(buildHealthReport(), "stripe")).toBe("degraded");
  });

  it("Resend: fehlender Key ist Prod down, Dev degraded", () => {
    apply("production", { ...FULL_PROD, RESEND_API_KEY: "" });
    expect(levelOf(buildHealthReport(), "resend")).toBe("down");
    apply("development", { ...FULL_PROD, RESEND_API_KEY: "" });
    expect(levelOf(buildHealthReport(), "resend")).toBe("degraded");
  });

  it("Brevo: unvollständige Config ist Prod down, Dev degraded", () => {
    apply("production", { ...FULL_PROD, BREVO_LIST_ID: "" });
    expect(levelOf(buildHealthReport(), "brevo")).toBe("down");
    apply("development", { ...FULL_PROD, BREVO_LIST_ID: "" });
    expect(levelOf(buildHealthReport(), "brevo")).toBe("degraded");
  });

  it("Supabase: ohne Config immer degraded (Datei-Fallback), nie down", () => {
    apply("production", { ...FULL_PROD, NEXT_PUBLIC_SUPABASE_URL: "", NEXT_PUBLIC_SUPABASE_ANON_KEY: "" });
    const sb = buildHealthReport().integrations.find((i) => i.key === "supabase")!;
    expect(sb.level).toBe("degraded");
    expect(sb.mode).toBe("Datei-Fallback");
  });

  it("Upstash: ohne Config immer degraded (In-Memory), nie down", () => {
    apply("production", { ...FULL_PROD, UPSTASH_REDIS_REST_URL: "", UPSTASH_REDIS_REST_TOKEN: "" });
    expect(levelOf(buildHealthReport(), "upstash")).toBe("degraded");
  });

  it("Basis: App-URL ohne https ist in Production down", () => {
    apply("production", { ...FULL_PROD, NEXT_PUBLIC_APP_URL: "http://compliflow.de" });
    expect(levelOf(buildHealthReport(), "core")).toBe("down");
  });

  it("overall = down sobald eine Integration down ist", () => {
    apply("production", { ...FULL_PROD, RESEND_API_KEY: "" });
    const report = buildHealthReport();
    expect(report.overall).toBe("down");
    expect(report.healthy).toBe(false);
  });

  it("overall = degraded wenn nur Fallbacks aktiv, nichts down", () => {
    // Volle Prod-Config, aber Supabase + Upstash im Fallback.
    apply("production", {
      ...FULL_PROD,
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
      UPSTASH_REDIS_REST_URL: "",
      UPSTASH_REDIS_REST_TOKEN: "",
    });
    const report = buildHealthReport();
    expect(report.overall).toBe("degraded");
    expect(report.healthy).toBe(true);
  });
});
