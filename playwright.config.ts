import { defineConfig, devices } from "@playwright/test";

// E2E-Konfiguration für den Release-Audit (Block 6).
// Bootet den Next-Dev-Server und fährt die echten UI-Flows in Chromium.
// Screenshots landen in audit-artifacts/screenshots/ (gitignored).
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [["list"]],
  outputDir: "./audit-artifacts/.playwright-output",
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    viewport: { width: 1280, height: 900 },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
