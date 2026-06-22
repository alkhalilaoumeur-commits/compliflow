export async function register() {
  // Nur im Node.js-Runtime ausführen, nicht im Edge-Runtime
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateEnv } = await import("@/lib/env");
    validateEnv();
  }
}
