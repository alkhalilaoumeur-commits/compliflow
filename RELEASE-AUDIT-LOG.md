# RELEASE-AUDIT-LOG — Compliflow

> Autonomer, adversarialer Release-Audit. Lead Security & Release Engineer.
> Gestartet: 2026-07-08. Jeder Fund mit Beweis (Datei:Zeile / Test / Tool-Ausgabe).
> Regel: adversarial statt bestätigend. Fixes sofort, Regressionstest rot→grün.

---

## WICHTIGER AUSGANGSBEFUND (Kontext-Korrektur)

Der Master-Prompt geht von "0 Tests, ungehärtete App" aus. **Das ist überholt.**
Verifiziert am 2026-07-08:

- **534 Vitest-Tests grün** in 35 Testdateien (`npx vitest run`) — inkl. aller 5 API-Routen, DOI-Token, Stores, PDF-Dokumente.
- Bereits gefixt laut `SECURITY-TODO.md` + Git-Historie (verifiziert): DOI-Token nach `lib/doi-token.ts` extrahiert (timing-safe, 7-Tage-Ablauf, kein Dev-Fallback), `verify-session` serverseitig eingebunden (Commit 03f083c), Watermark für AVV/VVT verdrahtet (3920651), Rate-Limiter zentralisiert + Upstash-persistent (`lib/rate-limit.ts`), XFF-Spoofing-Schutz, CSP + Security-Header, Blog-XSS geschlossen, `escapeHtml` zentralisiert.

**Konsequenz:** Der Audit ist eine **adversariale Re-Verifikation** bereits gehärteten Codes, kein Neubau. Ziel: halten die Fixes einem Angriff stand, und Schließen der echten Rest-Lücken (Playwright/E2E, PDF-Artefakte, Prüfung Rechtskonformität, diese Deliverables).

---

## BASELINE (Block 0)

| Aspekt | Stand |
|---|---|
| Test-Runner | Vitest 4.1.9 konfiguriert (`vitest.config.ts`), 534 Tests grün |
| E2E / Playwright | **NICHT vorhanden** — offen (Block 6) |
| PDF-Artefakte | **NICHT vorhanden** — offen (Block 7) |
| CI | GitHub Actions vorhanden (`.github/`) |
| Git-Stand | Branch `main`; lokal modifiziert: `docs/TODOS.md`; neu: `docs/COOLIFY-KEYS-SETUP.md` |

5 API-Routen (`app/api/`): stripe/checkout, stripe/webhook, stripe/verify-session, waitlist/confirm, brevo/subscribe + Health.
1 Server-Action: `app/actions/waitlist.ts` (`joinWaitlist`).
7 Generatoren: avv, vvt, impressum, datenschutz, widerrufsbelehrung, agb, cookie-banner.

---

## BLOCK 1 — HMAC-DOI-Token ✅ verifiziert + 1 Fix

**Adversariale Prüfung von `lib/doi-token.ts`:**

| Prüfung | Ergebnis | Beleg |
|---|---|---|
| Timing-safe Vergleich | ✅ Node `crypto.timingSafeEqual` (C++, konstant-zeitig). Längen-Check leakt nur die Länge des SHA256-Hex (kein Geheimnis) | `lib/doi-token.ts:26-29` |
| Dev-Fallback in Prod unmöglich | ✅ `getSecret()` wirft hart bei fehlendem `DOI_SECRET`, kein `NODE_ENV`-Guard mehr | `lib/doi-token.ts:5-9` |
| Ablauf | ✅ Timestamp signiert, 7-Tage-Fenster + 5-Min-Zukunftstoleranz | `lib/doi-token.ts:42-44` |
| Nicht-numerischer TS | ✅ `Number.isFinite` + `<= 0` → false | `lib/doi-token.ts:40` |
| Kein Punkt-Trenner | ✅ `indexOf(".") === -1` → false | `lib/doi-token.ts:34-35` |
| **Unicode/Nicht-Hex-HMAC** | 🔴→✅ **GEFUNDEN & GEFIXT** (siehe unten) | |
| email:source:ts-Kollision | ⚠️ theoretisch, nicht ausnutzbar: `source` ist auf 4 feste Werte ohne `:`/`@` gewhitelistet, `email` muss `@` enthalten; Verify rechnet HMAC aus (email,source) der URL neu — keine praktikable Mehrdeutigkeit. Dokumentiert, nicht gefixt (KISS) | `app/actions/waitlist.ts:14`, `confirm/route.ts:9` |

### FUND 1.1 [MEDIUM] — RangeError-Crash bei Unicode-HMAC (DoS-Robustheit)
- **Ort:** `lib/doi-token.ts` `verifyDoiToken` / `timingSafeEqual`
- **Beweis (vorher):** Empirischer Repro — ein 64-**Zeichen**-Token mit Multibyte-Unicode (`"ä".repeat(64)`) hat String-Länge 64, aber `Buffer.from()` → 128 Byte. `nodeTimingSafeEqual(buf64, buf128)` wirft `RangeError: Input buffers must have the same byte length`. Da die Confirm-Route `verifyDoiToken` ohne try/catch aufruft (`confirm/route.ts:41`), führt ein Request `?token=<ts>.ää…` zu **HTTP 500 statt sauberem Redirect auf `/waitlist/invalid`**. Angreifer-triggerbare unbehandelte Exception.
- **Klasse:** Fremdinput vor `Buffer.from()`/Krypto-Vergleich nicht formatvalidiert. Einzelinstanz (nur hier wird attacker-controlled String in timingSafeEqual gegeben).
- **Fix:** HMAC-Teil gegen `/^[0-9a-f]{64}$/` validieren, bevor der Byte-Vergleich läuft (`lib/doi-token.ts:3-4, 40-46`). Nicht geheimnisabhängig → kein Timing-Leak.
- **Regressionstest:** `lib/doi-token.test.ts` — 4 neue Fälle (Unicode-HMAC `not.toThrow`, Nicht-Hex, überlang 128, Uppercase-Hex). **21/21 grün** (vorher hätte der Unicode-Fall geworfen).

**Abbruchkriterium 1:** ✅ erfüllt (timing-safe, robust gegen Fremdinput, Dev-Fallback in Prod unmöglich, Ablauf — alles per Test belegt). Replay-Aspekt siehe Block 2/8.

---

## OFFENE PUNKTE / NÄCHSTER SCHRITT

**Als Nächstes:** Block 2 — die 5 public API-Routen + Server-Action adversarial (Open-Redirect in checkout `sanitizeReturnPath`, Webhook-Signatur vor Seiteneffekt, verify-session-Einbindung, Replay/Mail-Bombing, CORS/IP-Spoofing). Danach Block 3 (Watermark-Flow), dann Integration der 3 laufenden Hintergrund-Rechercheure (Block 4 Datenschutz-Leak, Block 5 Rechtskonformität, Block 9 Secrets/Infra), dann Block 6 (Playwright) + Block 7 (PDF-Artefakte).

**Manuelle Schritte (bisher):** siehe `SECURITY-TODO.md` — Upstash-ENV + Coolify-Keys (aus `docs/COOLIFY-KEYS-SETUP.md`).
