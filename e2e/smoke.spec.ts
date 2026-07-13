import { test, expect, type Page } from "@playwright/test";

const SHOTS = "audit-artifacts/screenshots";

// 3rd-party-/Netzwerk-Rauschen, das nichts über die App-Gesundheit aussagt.
const IGNORE = [
  "plausible.io",
  "js.stripe.com",
  "fonts.gstatic.com",
  "favicon",
  "net::ERR",
  "Failed to load resource",
  "ERR_BLOCKED_BY_CLIENT",
];

// Sammelt echte JS-Fehler (uncaught exceptions + Hydration-Mismatches),
// ignoriert erwartetes 3rd-party-Netzwerkrauschen.
function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (IGNORE.some((i) => text.includes(i))) return;
    errors.push(`console.error: ${text}`);
  });
  return errors;
}

const GENERATORS: { path: string; name: string }[] = [
  { path: "/avv", name: "avv" },
  { path: "/vvt", name: "vvt" },
  { path: "/impressum-generator", name: "impressum" },
  { path: "/datenschutz-generator", name: "datenschutz" },
  { path: "/widerrufsbelehrung-generator", name: "widerruf" },
  { path: "/agb-generator", name: "agb" },
  { path: "/cookie-banner-generator", name: "cookie-banner" },
];

test.describe("Generatoren — Smoke + Hydration", () => {
  for (const gen of GENERATORS) {
    test(`${gen.name} lädt ohne JS-/Hydration-Fehler`, async ({ page }) => {
      const errors = trackErrors(page);
      const resp = await page.goto(gen.path, { waitUntil: "networkidle" });
      expect(resp?.status(), `HTTP-Status für ${gen.path}`).toBeLessThan(400);

      // Wizard-Shell / Hauptinhalt gerendert
      await expect(page.locator("h1, h2").first()).toBeVisible();

      await page.screenshot({ path: `${SHOTS}/generator-${gen.name}.png`, fullPage: true });

      // Hydration/Uncaught-Fehler sind ein K.-o.-Kriterium ("Frontend spinnt")
      const hydration = errors.filter(
        (e) => /hydrat|did not match|Minified React error/i.test(e),
      );
      expect(hydration, `Hydration-Fehler auf ${gen.path}`).toEqual([]);
      expect(errors, `JS-Fehler auf ${gen.path}`).toEqual([]);
    });
  }
});

test.describe("Homepage + Waitlist", () => {
  test("Homepage lädt sauber", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("h1").first()).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/homepage.png`, fullPage: true });
    expect(errors.filter((e) => /hydrat|did not match/i.test(e))).toEqual([]);
  });

  test("Waitlist-Anmeldung zeigt Bestätigungs-Hinweis", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // Die Waitlist-Sektion liegt unten und wird erst nach Hydration gemountet.
    await page.locator("#warteliste").scrollIntoViewIfNeeded();
    const email = page.locator("#waitlist-email");
    await expect(email).toBeVisible({ timeout: 15_000 });
    await email.fill("audit-e2e@example.com");
    await email.press("Enter");
    // Server-Action antwortet mit "…bitte bestätige deine Anmeldung per E-Mail."
    await expect(page.getByText(/bestätige deine Anmeldung|Fast dabei/i)).toBeVisible({
      timeout: 15_000,
    });
    await page.screenshot({ path: `${SHOTS}/waitlist-success.png`, fullPage: true });
  });
});
