# API-Prüfliste — Compliflow

> Master-Liste aller HTTP-Endpoints + Server-Actions für die API-Sicherheitsprüfung.
> Stand: 2026-06-24 · Quelle: `app/api/**/route.ts` + `app/actions/waitlist.ts` + `lib/rate-limit.ts`

**Rate-Limit-Infrastruktur (alle teilen sich `lib/rate-limit.ts`):** Sliding-Window via Upstash Redis wenn `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` gesetzt sind, sonst In-Memory-Fallback (resettet bei Container-Restart). IP-Ermittlung überall identisch: `x-real-ip` → letzter Eintrag von `x-forwarded-for` → `"unknown"`.

---

## 1. Stripe Checkout
- **Pfad:** `/api/stripe/checkout` · `app/api/stripe/checkout/route.ts`
- **Methode:** `POST`
- **Rate-Limit:** ✅ Ja — `checkoutLimiter` = **5/Minute pro IP**
- **Input-Validierung:**
  - `docType` (Body): muss in Whitelist `ALLOWED_DOC_TYPES` (avv, vvt, impressum, datenschutz, widerruf, agb, cookie_banner) — manuell per `.includes()`
  - `returnPath` (Body, optional): durch `sanitizeReturnPath()` — nur relative Pfade, kein `//`, kein `://`, max. 200 Zeichen (Open-Redirect-Schutz)
- **Bei fehlerhaftem Input:**
  - Rate-Limit überschritten → **429** `{ error: "Zu viele Anfragen" }`
  - Ungültiger/fehlender `docType` → **400** `{ error: "Ungültiger docType-Parameter" }`
  - Stripe-Keys fehlen + Production → **503** `{ error: "Payment system unavailable" }`; in Dev → Mock-URL
  - Exception (Stripe-Fehler) → **500** `{ error: "Checkout fehlgeschlagen" }`

## 2. Stripe Webhook
- **Pfad:** `/api/stripe/webhook` · `app/api/stripe/webhook/route.ts`
- **Methode:** `POST`
- **Rate-Limit:** ❌ **Nein — bewusst** (Stripe sendet von wechselnden IPs + retried; Schutz läuft über HMAC-Signatur statt IP)
- **Input-Validierung:**
  - `stripe-signature` Header: Pflicht
  - Body: HMAC-Signaturprüfung via `stripe.webhooks.constructEvent()` gegen `STRIPE_WEBHOOK_SECRET`
  - Verarbeitet nur Event-Typ `checkout.session.completed`, braucht `metadata.tool` + `customer_details.email`
- **Bei fehlerhaftem Input:**
  - Keys fehlen + Production → **500** `{ error: "Server misconfigured" }`; in Dev → still `{ received: true }`
  - Fehlender Signatur-Header → **400** `{ error: "Missing stripe-signature header" }`
  - Signatur ungültig (gefälschter Request) → **400** `{ error: "Webhook signature failed" }`
  - Sonst immer → **200** `{ received: true }` (Email-Fehler werden nur geloggt, kein Abbruch)

## 3. Stripe Verify-Session
- **Pfad:** `/api/stripe/verify-session` · `app/api/stripe/verify-session/route.ts`
- **Methode:** `GET`
- **Rate-Limit:** ✅ Ja — `verifyLimiter` = **20/Minute pro IP**
- **Input-Validierung:**
  - `sessionId` (Query-Param): nur Existenzprüfung (`if (!sessionId)`), keine Format-Validierung
  - Echte Prüfung über Stripe: `payment_status === "paid"` + `status === "complete"` + Metadata (`product === "watermark_removal"` + `doc_type`, oder Legacy `tool`)
- **Bei fehlerhaftem Input:**
  - Rate-Limit → **429** `{ valid: false, error: "Zu viele Anfragen" }`
  - Fehlende `sessionId` → **400** `{ valid: false }`
  - `STRIPE_SECRET_KEY` fehlt → **503** `{ error: "Payment system unavailable" }`
  - Stripe-Fehler/ungültige Session → **400** `{ valid: false }`

## 4. Brevo Subscribe
- **Pfad:** `/api/brevo/subscribe` · `app/api/brevo/subscribe/route.ts`
- **Methode:** `POST`
- **Rate-Limit:** ✅ Ja — `brevoLimiter` = **5/Minute pro IP**
- **Input-Validierung:**
  - `email` (Body): per `isValidEmail()` aus `lib/brevo/client`
  - `consent` (Body): muss exakt `=== true` (UWG §7 Pflicht)
  - `quelle` (Body, optional): Whitelist `ALLOWED_QUELLEN` (10 Werte) — ungültig fällt still auf `"compliflow_generator"` zurück
- **Bei fehlerhaftem Input:**
  - Rate-Limit → **429** `{ ok: false, error: "Zu viele Anfragen…" }`
  - Body kein gültiges JSON → **400** `{ ok: false, error: "Ungültiger Request-Body" }`
  - Ungültige Email → **400** `{ ok: false, error: "Bitte eine gültige E-Mail-Adresse eingeben." }`
  - Kein Consent → **400** `{ ok: false, error: "Bitte stimme der Verarbeitung zu…" }`
  - `BREVO_API_KEY` fehlt + Production → **503**; in Dev → Mock `{ ok: true, mock: true }`
  - Brevo-Fehler → **429** oder **500** (je nach `result.status`)

## 5. Waitlist Confirm (DOI)
- **Pfad:** `/api/waitlist/confirm` · `app/api/waitlist/confirm/route.ts`
- **Methode:** `GET` (Link-Klick aus DOI-Email)
- **Rate-Limit:** ✅ Ja — `doiConfirmLimiter` = **10/Minute pro IP**
- **Input-Validierung:**
  - `email` (Query): Regex `EMAIL_RX`
  - `source` (Query): Whitelist `ALLOWED_SOURCES` (coming-soon, avv, vvt, cookie-banner)
  - `token` (Query): HMAC-Prüfung via `verifyDoiToken(email, source, token)` — bindet Email+Source kryptografisch an Token
- **Bei fehlerhaftem Input:** (alle als **Redirect**, nicht JSON)
  - `NEXT_PUBLIC_APP_URL` fehlt + Production → **500** `{ error: "Server misconfigured" }`
  - Rate-Limit → **Redirect** `/waitlist/invalid`
  - Email-Regex/Token fehlt → **Redirect** `/waitlist/invalid`
  - Ungültige `source` → **Redirect** `/waitlist/invalid`
  - Token ungültig → **Redirect** `/waitlist/invalid`
  - Erfolg → **Redirect** `/waitlist/confirmed`

## 6. Server-Action: `joinWaitlist` (DOI-Start)
- **Pfad:** `app/actions/waitlist.ts` — Next.js Server Action (`"use server"`), kein HTTP-Endpoint, aufgerufen aus Formular
- **Methode:** Form-Submit (`FormData`)
- **Rate-Limit:** ✅ Ja — **doppelt:**
  1. `waitlistLimiter` = **5/Minute pro IP** (Upstash-persistent)
  2. `isEmailRateLimited()` = **1 DOI-Email pro Adresse / 10 Min** (In-Memory-Map, max. 500 Einträge mit Cleanup)
- **Input-Validierung:**
  - `email` (FormData): Regex `EMAIL_RX`
  - `source` (FormData): Whitelist `ALLOWED_SOURCES`, ungültig fällt still auf `"coming-soon"` zurück
- **Bei fehlerhaftem Input:**
  - Ungültige Email → `{ ok: false, message: "Bitte gib eine gültige Email-Adresse ein." }`
  - `NEXT_PUBLIC_APP_URL` fehlt + Production → `{ ok: false, message: "Interner Konfigurationsfehler…" }`
  - Rate-Limit (IP **oder** Email) → **stille Erfolgsmeldung** `{ ok: true, … }` (Enumeration-Schutz: Angreifer erfährt nicht, ob blockiert wurde)

---

## Auffälligkeiten für die Prüfung

1. **`verify-session` validiert das `sessionId`-Format nicht** (nur Existenz). Unkritisch, weil Stripe die ID ohnehin ablehnt → **400**. Aber: jeder ungültige Versuch kostet einen Stripe-API-Call (innerhalb des 20/min-Limits).
2. **In-Memory-Rate-Limits resetten bei Container-Restart** — ohne Upstash sind 4 von 6 Limitern bei einem Coolify-Redeploy „offen". Für den Launch okay, aber bewusst (siehe Upstash-Todo).
3. **`joinWaitlist`s Email-Cooldown ist rein In-Memory** (nicht Upstash) → bei mehreren Container-Instanzen oder Restart greift er nicht zuverlässig. Der IP-Limiter davor ist persistent, fängt das gröbste ab.
4. **Webhook ohne Rate-Limit ist korrekt** — gut begründet im Code-Kommentar. Kein Findings-Kandidat.

---

## Übersichtstabelle

| # | Endpoint | Methode | Rate-Limit | Auth/Signatur |
|---|----------|---------|-----------|---------------|
| 1 | `/api/stripe/checkout` | POST | 5/min | — |
| 2 | `/api/stripe/webhook` | POST | keins (bewusst) | HMAC-Signatur |
| 3 | `/api/stripe/verify-session` | GET | 20/min | Stripe-Session |
| 4 | `/api/brevo/subscribe` | POST | 5/min | Consent-Flag |
| 5 | `/api/waitlist/confirm` | GET | 10/min | HMAC-DOI-Token |
| 6 | `joinWaitlist` (Server-Action) | FormData | 5/min IP + 1/10min Email | — |
