/**
 * Zentrales Rate-Limiting für alle API-Routes.
 *
 * Zwei Modi:
 * 1. Upstash Redis (persistent, überlebt Container-Restarts) — aktiv wenn
 *    UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN gesetzt sind.
 * 2. In-Memory Fallback (resettet bei Restart) — aktiv in Dev/ohne Upstash.
 *
 * Upstash einrichten:
 *   1. https://upstash.com → kostenloses Konto, neue Redis-DB (Region: EU-West)
 *   2. REST-URL + Token in Coolify als ENV eintragen:
 *      UPSTASH_REDIS_REST_URL=https://...
 *      UPSTASH_REDIS_REST_TOKEN=...
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Upstash-Client — nur initialisiert wenn beide ENV-Vars gesetzt sind.
function tryGetRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redisClient = tryGetRedis();

if (!redisClient && process.env.NODE_ENV === "production") {
  console.warn(
    "RATE-LIMIT: Upstash nicht konfiguriert — In-Memory-Fallback aktiv. " +
    "Rate-Limits resetten bei Container-Restart. UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN setzen."
  );
}

// ─── Upstash Sliding-Window Limiter ───────────────────────────────────────────

function makeUpstashLimiter(limit: number, windowS: number) {
  if (!redisClient) return null;
  return new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(limit, `${windowS} s`),
    analytics: false,
  });
}

// ─── In-Memory Fixed-Window Fallback ──────────────────────────────────────────

type Bucket = { count: number; resetAt: number };

function makeMemoryLimiter(limit: number, windowMs: number) {
  const store = new Map<string, Bucket>();
  return function isLimited(ip: string): boolean {
    const now = Date.now();
    const entry = store.get(ip);
    if (!entry || now > entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return false;
    }
    if (entry.count >= limit) return true;
    entry.count++;
    return false;
  };
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Erstellt einen Rate-Limiter der bei `limit` Requests pro `windowS` Sekunden greift.
 * Gibt eine async-Funktion zurück, die `true` wenn geblockt, `false` wenn erlaubt.
 */
export function createRateLimiter(limit: number, windowS: number) {
  const upstash = makeUpstashLimiter(limit, windowS);
  const memory = makeMemoryLimiter(limit, windowS * 1000);

  return async function isLimited(ip: string): Promise<boolean> {
    if (upstash) {
      const { success } = await upstash.limit(ip);
      return !success;
    }
    return memory(ip);
  };
}

// ─── Vorkonfigurierte Limiter (einmal pro Prozess initialisiert) ──────────────

export const checkoutLimiter = createRateLimiter(5, 60);    // 5/min
export const verifyLimiter = createRateLimiter(20, 60);     // 20/min
export const doiConfirmLimiter = createRateLimiter(10, 60); // 10/min
export const brevoLimiter = createRateLimiter(5, 60);       // 5/min
