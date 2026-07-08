import { describe, it, expect } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

// Ohne UPSTASH_*-ENV nutzt createRateLimiter den In-Memory-Fallback.
// Diese Tests prüfen genau diesen Pfad (der beim Launch aktiv ist, solange
// Upstash nicht konfiguriert ist).

describe("createRateLimiter — In-Memory-Fallback", () => {
  it("erlaubt Requests unter dem Limit und blockt beim Erreichen", async () => {
    const limited = createRateLimiter(3, 60);
    const ip = "1.2.3.4";
    expect(await limited(ip)).toBe(false); // 1
    expect(await limited(ip)).toBe(false); // 2
    expect(await limited(ip)).toBe(false); // 3
    expect(await limited(ip)).toBe(true);  // 4 → geblockt
  });

  it("zählt pro IP getrennt", async () => {
    const limited = createRateLimiter(1, 60);
    expect(await limited("a")).toBe(false);
    expect(await limited("a")).toBe(true);
    // andere IP hat eigenes Budget
    expect(await limited("b")).toBe(false);
  });

  it("wächst nicht unbegrenzt: 6000 verschiedene IPs → kein Crash, Limit greift weiter", async () => {
    // Löst den Map-Sweep (store.size > 5000) aus. Regressionstest gegen Memory-DoS.
    const limited = createRateLimiter(1, 60);
    for (let i = 0; i < 6000; i++) {
      expect(await limited(`ip-${i}`)).toBe(false);
    }
    // Eine frische IP wird weiterhin korrekt limitiert
    expect(await limited("fresh")).toBe(false);
    expect(await limited("fresh")).toBe(true);
  });
});
