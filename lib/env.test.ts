// Boot-Check-Test: validateEnv() ist das Sicherheitsnetz, das den Container
// in Production gar nicht erst starten lässt, wenn eine Pflicht-ENV-Variable fehlt
// (aufgerufen aus instrumentation.ts → register()). Ohne diesen Test wüssten wir
// erst beim echten Coolify-Deploy, ob das Netz hält.
//
// Wichtig: lib/env.ts friert `IS_PROD` beim Modul-Load ein
// (const IS_PROD = process.env.NODE_ENV === "production"). Deshalb muss das Modul
// für jeden Fall mit gesetztem NODE_ENV FRISCH geladen werden (resetModules + dynamic import).

const ALL_REQUIRED = [
  "RESEND_API_KEY",
  "DOI_SECRET",
  "NEXT_PUBLIC_APP_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_WATERMARK_REMOVAL",
  "BREVO_API_KEY",
  "BREVO_LIST_ID",
  "BREVO_DOI_TEMPLATE_ID",
];

// Format-gültige Platzhalter für die Vars mit Format-Check (siehe FORMAT_CHECKS in env.ts).
// Der Rest bekommt beliebige dummy-Werte — dort zählt nur Anwesenheit.
const VALID_FORMAT: Record<string, string> = {
  STRIPE_SECRET_KEY: "sk_live_dummy",
  STRIPE_WEBHOOK_SECRET: "whsec_dummy",
  NEXT_PUBLIC_APP_URL: "https://compliflow.de",
};

function fullProdEnv(): Record<string, string> {
  return Object.fromEntries(
    ALL_REQUIRED.map((k) => [k, VALID_FORMAT[k] ?? `dummy-${k}`])
  );
}

// Lädt validateEnv frisch mit gegebenem NODE_ENV und gegebenen Vars.
async function loadValidateEnv(nodeEnv: string, vars: Record<string, string>) {
  vi.resetModules();
  vi.stubEnv("NODE_ENV", nodeEnv);
  for (const key of ALL_REQUIRED) vi.stubEnv(key, vars[key] ?? "");
  const mod = await import("./env");
  return mod.validateEnv;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("validateEnv — Boot-Check in Production", () => {
  it("wirft, wenn DOI_SECRET fehlt", async () => {
    const env = fullProdEnv();
    env.DOI_SECRET = "";
    const validateEnv = await loadValidateEnv("production", env);
    expect(() => validateEnv()).toThrow(/DOI_SECRET/);
    expect(() => validateEnv()).toThrow(/Server startup aborted/);
  });

  it("wirft, wenn STRIPE_SECRET_KEY fehlt", async () => {
    const env = fullProdEnv();
    env.STRIPE_SECRET_KEY = "";
    const validateEnv = await loadValidateEnv("production", env);
    expect(() => validateEnv()).toThrow(/STRIPE_SECRET_KEY/);
  });

  it("wirft, wenn RESEND_API_KEY fehlt", async () => {
    const env = fullProdEnv();
    env.RESEND_API_KEY = "";
    const validateEnv = await loadValidateEnv("production", env);
    expect(() => validateEnv()).toThrow(/RESEND_API_KEY/);
  });

  it("listet ALLE fehlenden Variablen auf einmal auf", async () => {
    const env = fullProdEnv();
    env.DOI_SECRET = "";
    env.STRIPE_WEBHOOK_SECRET = "";
    const validateEnv = await loadValidateEnv("production", env);
    expect(() => validateEnv()).toThrow(/DOI_SECRET/);
    expect(() => validateEnv()).toThrow(/STRIPE_WEBHOOK_SECRET/);
  });

  it("wirft NICHT, wenn alle Pflicht-Variablen gesetzt und format-gültig sind", async () => {
    const validateEnv = await loadValidateEnv("production", fullProdEnv());
    expect(() => validateEnv()).not.toThrow();
  });
});

describe("validateEnv — Format-Prüfung in Production", () => {
  it("wirft, wenn STRIPE_SECRET_KEY ein Testmodus-Key ist (sk_test_)", async () => {
    const env = fullProdEnv();
    env.STRIPE_SECRET_KEY = "sk_test_abc123";
    const validateEnv = await loadValidateEnv("production", env);
    expect(() => validateEnv()).toThrow(/STRIPE_SECRET_KEY/);
    expect(() => validateEnv()).toThrow(/sk_live_/);
  });

  it("wirft, wenn NEXT_PUBLIC_APP_URL kein https ist", async () => {
    const env = fullProdEnv();
    env.NEXT_PUBLIC_APP_URL = "http://compliflow.de";
    const validateEnv = await loadValidateEnv("production", env);
    expect(() => validateEnv()).toThrow(/NEXT_PUBLIC_APP_URL/);
  });

  it("wirft, wenn STRIPE_WEBHOOK_SECRET das whsec_-Präfix fehlt", async () => {
    const env = fullProdEnv();
    env.STRIPE_WEBHOOK_SECRET = "abc123";
    const validateEnv = await loadValidateEnv("production", env);
    expect(() => validateEnv()).toThrow(/STRIPE_WEBHOOK_SECRET/);
  });

  it("meldet eine fehlende Var NICHT doppelt als Format-Fehler", async () => {
    const env = fullProdEnv();
    env.STRIPE_SECRET_KEY = "";
    const validateEnv = await loadValidateEnv("production", env);
    // Genau eine Zeile zu STRIPE_SECRET_KEY (fehlt), nicht zusätzlich Format-Zeile.
    try {
      validateEnv();
      throw new Error("sollte geworfen haben");
    } catch (e) {
      const msg = (e as Error).message;
      const hits = msg.split("\n").filter((l) => l.includes("STRIPE_SECRET_KEY"));
      expect(hits).toHaveLength(1);
      expect(hits[0]).toMatch(/fehlt/);
    }
  });
});

describe("validateEnv — Dev/Test ist No-Op", () => {
  it("wirft NICHT in development, auch wenn alle Variablen fehlen", async () => {
    const validateEnv = await loadValidateEnv("development", {});
    expect(() => validateEnv()).not.toThrow();
  });
});
