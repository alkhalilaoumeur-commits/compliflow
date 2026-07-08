# SECURITY-CHECKLIST — Compliflow

> Stand: 2026-07-08 (Release-Audit). Jeder Punkt mit Beleg im Code / Test.
> ✅ = verifiziert · ⚠️ = Rest-/Prod-Config-Abhängigkeit · 🔵 = geplant/manuell

## HMAC / Token
- ✅ DOI-Token HMAC-SHA256, timing-safe via Node `crypto.timingSafeEqual` — `lib/doi-token.ts:26`
- ✅ Kein Dev-Fallback-Secret; `getSecret()` wirft hart bei fehlendem `DOI_SECRET` — `lib/doi-token.ts:5`
- ✅ Fixer 7-Tage-Ablauf `{ts}.{hmac}` + 5-Min-Zukunftstoleranz — `lib/doi-token.ts:42`
- ✅ HMAC-Hex-Guard `/^[0-9a-f]{64}$/` gegen Unicode/Nicht-Hex-Crash — `lib/doi-token.ts:4,44` · Test `lib/doi-token.test.ts` (21)

## Public API + Server-Action
- ✅ `stripe/checkout`: docType-Whitelist, `sanitizeReturnPath` (kein Open-Redirect), 5/min — `checkout/route.ts`
- ✅ `stripe/webhook`: Signatur über Roh-Body VOR Seiteneffekt, kein sig → 400, Prod ohne Keys → 500 — `webhook/route.ts:41`
- ✅ `stripe/verify-session`: eingebunden (kein toter Code), prüft paid+complete+Metadata, 20/min — `verify-session/route.ts`
- ✅ `waitlist/confirm`: Rate-Limit→Email→Source→HMAC vor DB/Mail, Fallback-Fehler laut — `confirm/route.ts`
- ✅ `brevo/subscribe`: consent===true serverseitig, quelle-Whitelist, generische Fehler — `subscribe/route.ts`
- ✅ Server-Action `joinWaitlist`: IP-5/min + Email-1/10min gegen Mail-Bombing — `actions/waitlist.ts`
- ✅ IP-Extraktion XFF-Spoofing-sicher (`x-real-ip` > letzter XFF)
- ✅ Rate-Limiter Memory-Sweep gegen unbegrenztes Map-Wachstum — `lib/rate-limit.ts:56` · Test `lib/rate-limit.test.ts`
- ⚠️ Persistentes Rate-Limit erst mit Upstash-ENV (sonst In-Memory, resettet bei Restart)

## Geld / Watermark
- ✅ Preis ausschließlich serverseitig aus `STRIPE_PRICE_WATERMARK_REMOVAL` (Client kann ihn nicht setzen)
- ✅ Mock-„bezahlt" nur in Dev; Prod ohne Keys → 503
- ✅ Watermark konsistent über alle 7 Tools (verify-session-basiert, AVV/VVT verdrahtet)
- ✅ Bypass-Schließung: `verify-session` prüft Kauf serverseitig — `use-verified-watermark.ts:44`

## localStorage-Datenschutz
- ✅ Kein Fetch/Beacon/WS überträgt Wizard-Feldinhalte (verifiziert projektweit)
- ✅ Plausible-Events nur Enums, keine PII/Email
- ✅ Alle `dangerouslySetInnerHTML`: statisches JSON-LD/Repo-Blog oder `buildHtml()` mit vollständigem `escapeHtml` (& < > " ')
- ✅ CSP + Security-Header gesetzt (HSTS, X-Frame DENY, nosniff, Referrer, Permissions) — `next.config.js`
- ⚠️ CSP `script-src 'unsafe-inline'` — zweite XSS-Linie geschwächt (Fund 9.1, Nonce-Umbau geplant)
- 🔵 Globaler „localStorage löschen"-Button (inkl. Watermark-Store) — geplant
- 🔵 `migrate`-Funktionen für impressum/datenschutz/agb/cookie-banner/widerruf — geplant

## Rechtskonformität (Code-Ebene)
- ✅ Alle 7 Tools: sichtbarer Rechtsberatungs-Disclaimer
- ✅ Export-Gating HART über alle 7 Tools (kein unvollständiges Dokument exportierbar)
- ✅ AVV: alle Art.-28-Abs.-3-Pflichtbestandteile (per PDF-Test belegt)
- ✅ Impressum: § 5 DDG / § 18 MStV, Datum 14.05.2024 korrigiert; § 5 TMG → DDG projektweit
- ✅ Keine Platzhalter-Leaks (PDF-Vollständigkeitstest); Widerruf-Komma-Leak gefixt
- 🔵 Inhaltliche Rechtsfragen → siehe RELEASE-AUDIT-LOG.md „RECHTLICHE FREIGABE NÖTIG"

## Infra / Secrets
- ✅ Keine Secrets im Repo (`git ls-files`), `.gitignore`/`.dockerignore` decken `.env*`/`.data`/`.vercel`
- ✅ `.env.example` vollständig (alle im Code gelesenen Vars)
- ✅ Prod scheitert laut bei fehlenden 9 Pflicht-Vars + Format-Check — `lib/env.ts` + `instrumentation.ts`
- ✅ Owner-Email nicht hardcoded (aus ENV)
- 🔵 Next.js 14.2.35 → 15/16 Migration (offene Advisories, Fund 9.2)

## Tests
- ✅ 546 Vitest-Tests grün, 37 Dateien
- ✅ Kritische Pfade getestet: DOI-Token, alle 5 Routen, Rate-Limit, PDF-Vollständigkeit, Stores/Contracts
- 🔵 Playwright-E2E (Block 6) — offen

## Manuell / vor Live-Gang
- 🔵 Coolify: 9 Pflicht-ENV-Vars + Upstash-ENV setzen (`docs/COOLIFY-KEYS-SETUP.md`)
- 🔵 Live-Stripe-Testkauf (0,99 €) end-to-end
- 🔵 Supabase-RLS mit echtem Anon-Key gegen SELECT/DELETE/Fälschung prüfen (Block 8)
- 🔵 Rechtliche Freigabe der Templates durch IT-Anwalt
