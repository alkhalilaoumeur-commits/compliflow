import { createHmac } from "node:crypto";

const SEVEN_DAYS_S = 7 * 24 * 60 * 60;

function getSecret(): string {
  const secret = process.env.DOI_SECRET;
  if (!secret) throw new Error("DOI_SECRET missing");
  return secret;
}

// Token-Format: "{unix_seconds}.{hmac-sha256}"
// Timestamp ist Teil der signierten Nachricht → nicht manipulierbar.
export function buildDoiToken(email: string, source: string): string {
  const secret = getSecret();
  const ts = Math.floor(Date.now() / 1000);
  const hmac = createHmac("sha256", secret)
    .update(`${email}:${source}:${ts}`)
    .digest("hex");
  return `${ts}.${hmac}`;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function verifyDoiToken(email: string, source: string, token: string): boolean {
  const secret = getSecret(); // wirft wenn DOI_SECRET fehlt — konsistent mit buildDoiToken

  const dotIdx = token.indexOf(".");
  if (dotIdx === -1) return false;

  const ts = parseInt(token.slice(0, dotIdx), 10);
  const hmac = token.slice(dotIdx + 1);

  if (!Number.isFinite(ts) || ts <= 0) return false;

  const nowS = Math.floor(Date.now() / 1000);
  if (nowS - ts > SEVEN_DAYS_S) return false;   // abgelaufen
  if (ts > nowS + 300) return false;             // zukunftsdatiert (max. 5 min Toleranz)

  const expected = createHmac("sha256", secret)
    .update(`${email}:${source}:${ts}`)
    .digest("hex");

  return timingSafeEqual(expected, hmac);
}
