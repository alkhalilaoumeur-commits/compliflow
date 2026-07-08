import { createHmac, timingSafeEqual as nodeTimingSafeEqual } from "node:crypto";

const SEVEN_DAYS_S = 7 * 24 * 60 * 60;
// Ein gültiger HMAC-Teil ist immer exakt 64 Zeichen Lowercase-Hex (SHA256).
const HMAC_HEX_RX = /^[0-9a-f]{64}$/;

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

// Länge ist hier kein Geheimnis: expected ist immer ein 64-Zeichen-SHA256-Hex.
// Der Längen-Check dient nur dazu, dass nodeTimingSafeEqual (wirft bei
// ungleicher Länge) sauberes false statt einer Exception liefert.
// Der eigentliche Byte-Vergleich läuft in Node's C++ konstant-zeitig.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return nodeTimingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function verifyDoiToken(email: string, source: string, token: string): boolean {
  const secret = getSecret(); // wirft wenn DOI_SECRET fehlt — konsistent mit buildDoiToken

  const dotIdx = token.indexOf(".");
  if (dotIdx === -1) return false;

  const ts = parseInt(token.slice(0, dotIdx), 10);
  const hmac = token.slice(dotIdx + 1);

  // Fremdinput hart abklemmen, BEVOR Buffer.from() im Vergleich läuft:
  // ein 64-Zeichen-Token mit Unicode/Nicht-Hex hätte sonst >64 Byte und
  // nodeTimingSafeEqual würfe RangeError → 500 statt sauberem false.
  if (!HMAC_HEX_RX.test(hmac)) return false;

  if (!Number.isFinite(ts) || ts <= 0) return false;

  const nowS = Math.floor(Date.now() / 1000);
  if (nowS - ts > SEVEN_DAYS_S) return false;   // abgelaufen
  if (ts > nowS + 300) return false;             // zukunftsdatiert (max. 5 min Toleranz)

  const expected = createHmac("sha256", secret)
    .update(`${email}:${source}:${ts}`)
    .digest("hex");

  return timingSafeEqual(expected, hmac);
}
