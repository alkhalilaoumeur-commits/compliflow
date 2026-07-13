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

## BLOCK 2 — 5 public API-Routen + Server-Action ✅ verifiziert + 2 Fixes

| Route | adversariale Prüfung | Ergebnis |
|---|---|---|
| `stripe/checkout` | docType-Whitelist (Array/Riesen-String → 400 ✅); `sanitizeReturnPath`: `//evil`, `://`, non-`/`, `javascript:` alle → `/` ✅; Host kommt **immer** aus `NEXT_PUBLIC_APP_URL` (Server-ENV), returnPath nur Pfad-Suffix → **kein Open-Redirect** möglich | ✅ |
| `stripe/webhook` | Signatur via `constructEvent()` über **Roh-Body** (`req.text()`) **vor** jedem Seiteneffekt; kein sig-Header → 400; fehlende Keys in Prod → 500; unbekannte Events → sauber 200 (kein 500-Retry-Storm) | ✅ |
| `stripe/verify-session` | **eingebunden** (kein toter Code): `remove-button.tsx:74` + `lib/watermark/use-verified-watermark.ts:44` rufen sie auf. Prüft `paid` + `complete` + Metadata, Reject vor Stripe-Call, 20/min-Limit | ✅ |
| `waitlist/confirm` | Prüf-Reihenfolge: Rate-Limit → Email-Regex → Source-Whitelist → HMAC **vor** DB/Mail-Seiteneffekt; Datei-Fallback-Fehler wird laut geloggt (`route.ts:75`) | ✅ |
| `brevo/subscribe` | `consent===true` serverseitig erzwungen (`route.ts:53,59`); `quelle`-Whitelist; JSON-Parse-Guard; fehlender Key in Prod → 503 | ✅ + Fix 2.2 |
| Server-Action `joinWaitlist` | IP-Rate-Limit (5/min, `waitlistLimiter`) **und** 1-Mail/10min/Email vor Versand; Source auf Default abgeklemmt → Mail-Bombing über Resend begrenzt | ✅ |

IP-Extraktion überall `x-real-ip` > letzter XFF-Wert → **XFF-Spoofing-sicher** (Angreifer kann Rate-Limit nicht per gefälschtem ersten XFF-Wert umgehen).

### FUND 2.1 [LOW-MED] — In-Memory-Rate-Limiter wuchs unbegrenzt (Memory-DoS)
- **Ort:** `lib/rate-limit.ts` `makeMemoryLimiter`
- **Beweis:** Die `Map` löschte **nie** abgelaufene Einträge → bei vielen verschiedenen IPs unbegrenztes Wachstum. Laut Projekt-Memory wird Upstash erst **nach** Launch eingerichtet → beim Launch ist genau dieser Fallback aktiv.
- **Fix:** Sweep abgelaufener Einträge sobald `store.size > 5000` (`lib/rate-limit.ts:56-61`). Aktive IPs im Fenster durch echten Traffic begrenzt → Map bleibt beschränkt.
- **Regressionstest:** `lib/rate-limit.test.ts` — 6000 verschiedene IPs → kein Crash, Limit greift weiter. 3 Tests grün.

### FUND 2.2 [LOW] — Brevo-/Config-Fehlertexte an den Client durchgereicht (Info-Leak)
- **Ort:** `app/api/brevo/subscribe/route.ts:93` (`error: result.error`) i.V.m. `lib/brevo/client.ts:50` (gab **Namen fehlender ENV-Vars** zurück) und `:88` (rohe Brevo-API-`message`).
- **Fix:** Route loggt den echten Upstream-/Config-Fehler nur serverseitig und gibt dem Client eine generische Meldung (`route.ts:91-98`). Keine Secrets, aber unnötige Config-/API-Disclosure geschlossen.

**Abbruchkriterium 2:** ✅ erfüllt — jede Route Input-Validierung + Rate-Limit + Reject vor Seiteneffekt (per Test belegt); `verify-session` ist eingebunden (kein toter Code).

---

## BLOCK 9 — Infra/Secrets/Config ✅ (Recherche-Agent, Belege verifiziert)

- **Secrets:** `git ls-files` zeigt nur `.env.example`; keine echten Keys eingecheckt; `.gitignore` + `.dockerignore` decken `.env*`, `.data/`, `*.pem`, `.vercel` ab. ✅
- **`.env.example` vollständig:** der im Master-Prompt vermutete Fehlbestand (`STRIPE_PRICE_WATERMARK_REMOVAL`, `BREVO_*`) existiert **nicht mehr** — alle im Code gelesenen Vars sind dokumentiert (`.env.example:35,62-63`). ✅
- **Startup-Check vorbildlich:** `lib/env.ts` `validateEnv()` prüft 9 Prod-Pflicht-Vars + Format (`sk_live_`, `whsec_`, `https://`) und **wirft hart** (`throw`) → Container startet nicht bei Fehlkonfiguration. Verkabelt via `instrumentation.ts` + `next.config.js` `instrumentationHook`. ✅ (Abbruchkriterium 11: „Prod scheitert laut" erfüllt)
- **Security-Header:** HSTS (Prod), X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, CSP alle gesetzt (`next.config.js`). ✅
- **PII in Logs:** keine vollständigen Emails/Wizard-Inhalte geloggt (nur Error-Objekte). ✅
- **`.vercel`:** nicht getrackt, ignoriert — kosmetische Altlast, kein Risiko.
- **Owner-Email:** **nicht** hardcoded (0 Treffer für die Adresse im Code — kommt aus ENV/Config). ✅

### FUND 9.1 [MEDIUM, dokumentiert — nicht blind gefixt] — CSP `script-src 'unsafe-inline'`
- **Ort:** `next.config.js:18`. `'unsafe-inline'` schwächt die CSP als zweite XSS-Verteidigungslinie; `img-src https:` erlaubt theoretisch Beacon-Exfiltration.
- **Warum nicht sofort gefixt:** Entfernen erfordert Nonce-basierte CSP via Middleware. Next.js 14 App Router injiziert eigene Inline-Bootstrap-Scripts + die JSON-LD-`dangerouslySetInnerHTML`-Blöcke; ein blindes Entfernen von `'unsafe-inline'` bricht Hydration/SEO. → **Empfohlene Härtung, aber unter „MANUELLE/GEPLANTE SCHRITTE"**, da regressionsträchtig und der primäre XSS-Schutz (vollständiges `escapeHtml`, verifiziert in Block 4) bereits greift.

### FUND 9.2 [HIGH — MANUELL] — Next.js 14.2.35 mit offenen Advisories
- `npm audit --omit=dev`: 1 high (Next.js: diverse DoS/SSRF/Cache-Poisoning/Rewrite-Smuggling) + 1 moderate (postcss transitiv). Fix laut npm nur via `next@16` (Breaking Change).
- **Bewertung:** Self-hosted (kein Vercel-Image-Proxy). Relevanteste: Image-Optimizer-DoS (nur falls `next/image` mit remote patterns), Rewrite-Smuggling (falls Rewrites genutzt). → **MANUELL:** Next-15/16-Migration planen + Breaking Changes testen. Nicht autonom im Audit-Scope (Framework-Major-Upgrade mit UI-Regressionsrisiko).

---

## BLOCK 4 — localStorage & Datenschutz-Kernversprechen ✅ bewiesen + 1 Fix offen

**Kernversprechen BEWIESEN (Recherche-Agent, Belege verifiziert):** Kein `fetch`/`XHR`/`sendBeacon`/`WebSocket` überträgt Wizard-**Feldinhalte**. Die einzigen Wizard-nahen Calls (`remove-button.tsx:74,96`, `use-verified-watermark.ts:44`) senden nur `docType`/`returnPath`/`sessionId`. Alle Plausible-Events tragen nur Enums (`mode`, `tool`, `doc_type`, `quelle`) — **keine PII, keine Email**. XSS: alle `dangerouslySetInnerHTML` sind entweder statisches JSON-LD/Repo-Blog oder `buildHtml()` mit vollständigem `escapeHtml` (& < > " '). → **Abbruchkriterien 5 + 6 erfüllt.**

Rest-Findings (ehrlich):
- **[MED] Kein globaler „Daten löschen"-Button:** Reset existiert pro Wizard (überschreibt Store mit Defaults), aber der **Watermark-Store** (`compliflow-watermark-v1`, Stripe-Session-IDs) wird nie geleert → bleibt auf geteilten Rechnern liegen. → **Fix geplant unten.**
- **[MED] `session_id`/`doc_type` Plausible-Race:** kann durch Timing vor `replaceState` an Plausible gehen — keine Wizard-PII, aber Stripe-ID im Analytics-Log. Dokumentiert.
- **[MED] 5 Stores ohne `migrate`:** impressum/datenschutz/agb/cookie-banner/widerruf haben `version` aber keine `migrate`-Funktion (avv/vvt haben sie korrekt) → bei künftiger Schema-Erweiterung `undefined` in verschachtelten Pflichtfeldern → Runtime-Fehler/kaputtes Dokument für zurückkehrende Nutzer. → **Fix geplant unten.**

---

## BLOCK 5 — Rechtskonformität ✅ Code-Defekte gefixt

Kernbefund: Template-**Inhalte** stark (AVV vollständig Art. 28, Impressum § 5 DDG/§ 18 MStV). Das Risiko lag im **fehlenden Export-Gating**.

### FUND 5.1 [HIGH — FEHLERKLASSE, gefixt] — Unvollständige Dokumente exportierbar
- **Beweis:** 5 von 7 Tools (impressum/datenschutz/agb/widerruf) rendern Export nur mit Warnbanner; **cookie-banner prüfte gar nichts**; vvt-Gate zu schwach (`taetigkeiten.length>=1` ohne Inhalt). → Nutzer konnte Impressum ohne Anschrift / Banner ohne Anbieternamen exportieren, obwohl `getCompletionStatus` existiert.
- **Fix (Klasse ausgerottet):** Alle 7 Tools haben jetzt konsistentes HART-Gating — Export gesperrt bis vollständig, „Export gesperrt"-Panel analog avv-Referenz. vvt-Gate härtet auf Art.-30-Kerninhalt pro Tätigkeit (Zweck+Rechtsgrundlage+Datenkategorien+Betroffenengruppen). Belege: `components/{cookie-banner,datenschutz,agb,widerruf,impressum}/steps/step-review.tsx`, `components/vvt/steps/step-abschluss.tsx`.
- **Prävention:** `getCompletionStatus`-Tests + PDF-Vollständigkeitstest (keine Platzhalter). CLAUDE.md-Regel 5.

### FUND 5.2 [MED — gefixt] — Veraltete Gesetzesbezüge
- § 5 TMG → § 5 DDG (`components/agb/steps/step-anbieter.tsx`, `app/impressum/page.tsx` — eigene Firmenseite); DDG-Datum 14.05.2025 → **14.05.2024** (`components/impressum/wizard-shell.tsx`, `lib/impressum/types.ts`).

### FUND 5.3 [MED — gefixt] — Komma-Leak Widerruf
- `lib/widerrufsbelehrung/contract.ts`: leere Adressteile erzeugten `", ,  "` im Dokument → jetzt `.filter(Boolean).join(", ")`.

**Abbruchkriterium 8:** ✅ Disclaimer (alle 7), Pflichtfeld-Gating (alle 7), keine Platzhalter-Leaks (PDF-Test), keine veralteten Gesetze — Code-Defekte gefixt.

**RECHTLICHE FREIGABE NÖTIG (IT-Anwalt, kein Code-Fix):**
- AVV Audit-Kostenverteilung + 30-Tage-Löschfrist (`lib/avv/contract.ts:205,282,305`) — Angemessenheit / Aufbewahrungspflichten.
- Widerruf abweichende Fristen > 14 Tage + gemischte Verträge (`lib/widerrufsbelehrung/contract.ts:27,122`).
- Cookie-Banner „BGH-2025-Reject-All-Prominenz" (`lib/cookie-banner/builder.ts:3`) — Urteilsbezug verifizieren.
- Werbeaussage „decken alle Pflichtinhalte ab" (`app/preise/page.tsx:245`) — nach Gating-Fix gegenprüfen (UWG).
- Datenschutz Joint-Controller-Auto-Annahme, Impressum Kammer-ODER-Aufsicht je Berufsgruppe.

---

## BLOCK 7 — PDF-Artefakte ✅

`audit-artifacts/pdf-artifacts.test.ts` erzeugt 4 echte PDFs (via `@react-pdf/renderer`): `avv-vollstaendig.pdf`, `avv-vollstaendig-ohne-credit.pdf`, `avv-lueckenhaft.pdf`, `vvt-vollstaendig.pdf` → `audit-artifacts/pdfs/`. **Automatische Asserts:** `%PDF-`-Header, Umlaute/ß/€ erhalten (Müller & Schäfer, Françoise Bär, €), alle Art.-28-Pflichtabschnitte (Weisung/Vertraulichkeit/TOMs/Subunternehmer/Löschung), **keine** Platzhalter (`{{`, `[FIRMA]`, `undefined`, `null,`, `Lorem`). Regeneration: `npx vitest run audit-artifacts/pdf-artifacts.test.ts`.

**Abbruchkriterium 9:** ✅ für AVV (voll/ohne-Credit/lückenhaft) + VVT (voll). Manuelle Sichtprüfung des Font-Renderings bleibt empfohlen (Datei liegt bereit).

---

## BLOCK 10 (teilweise) — Deliverables

- ✅ `SECURITY-CHECKLIST.md` erstellt (gruppiert).
- ✅ `CLAUDE.md` um 9 verbindliche Release-Audit-Regeln erweitert.
- ✅ `RELEASE-AUDIT-LOG.md` aktuell.
- ⚠️ Lint-Regeln: ESLint ist im Projekt **nicht installiert**; type-aware Setup (no-floating-promises) würde unbounded Bestandsverstöße aufwerfen. Die gefundenen Fehlerklassen sind stattdessen **durch Tests** dauerhaft abgesichert (prompt-konforme Alternative): Unicode-Token (`doi-token.test.ts`), Rate-Limit-DoS (`rate-limit.test.ts`), Export-Gating (Completion-Tests), Platzhalter (PDF-Test). ESLint-Setup als MANUELL dokumentiert.

---

## BLOCK 6 — UI-Flows E2E (Playwright) ✅ + 1 HIGH-Bug gefixt

Playwright 1.61 + Chromium eingerichtet (`playwright.config.ts`, `e2e/smoke.spec.ts`, `npm run test:e2e`). **9 E2E-Tests grün.** Screenshots in `audit-artifacts/screenshots/` (7 Generatoren + Homepage + Waitlist-Success).

- Alle 7 Generatoren: laden ohne Hydration-/Uncaught-JS-Fehler (Konsole überwacht, 3rd-party-Rauschen gefiltert), Wizard-Shell + Disclaimer sichtbar. Kein „Frontend spinnt"-Zustand.
- Waitlist: Formular füllen → submit → Server-Action `joinWaitlist` liefert Bestätigungs-Hinweis (E2E-verifiziert).

### FUND 6.1 [HIGH — UX/Conversion, gefixt] — Waitlist-Formular fehlte komplett auf der Homepage
- **Beweis:** `app/page.tsx` `Home()` rendert `<Waitlist/>` **nicht** — die Section (`function Waitlist()` Z. 791, enthält `<WaitlistForm/>`) war definiert, aber nie im Seitenbaum. SSR-HTML enthielt weder „Cookie-Banner ist in Arbeit" noch ein `input[type=email]`. Gleichzeitig verlinkte der Footer (`page.tsx:908`) auf `/#warteliste` → **toter Anker**. Für eine Pre-Launch-Seite mit Lead-Sammlung als Zweck fehlte damit das primäre Email-Capture.
- **Fix:** `<Waitlist />` vor `<Footer />` eingehängt (`app/page.tsx`). SSR-HTML enthält die Section jetzt; E2E-Flow grün.

**Abbruchkriterium 10:** ✅ alle 7 Generatoren + Waitlist per Playwright durchgespielt, Screenshots abgelegt, ein kaputter Zustand gefunden **und gefixt**. (Tieferes Schritt-für-Schritt-Durchklicken jedes Wizards = optionale Vertiefung.)

---

## BLOCK 4-Rest / BLOCK 8 (teilweise) — weitere Fixes

- ✅ **Block 4 `migrate`-Funktionen:** impressum/datenschutz/agb/cookie-banner/widerruf bekamen defensive `migrate` (merged persisted.data mit Initial-State) → keine Datenkorruption/Runtime-Crashes bei künftiger Schema-Erweiterung. tsc + 42 Store-Tests grün.
- ✅ **Block 8 Persistenz-Logging:** `instrumentation.ts` loggt beim Start laut, ob Waitlist auf Supabase (redeploy-sicher) oder Datei-Fallback (Datenverlust-Warnung) läuft.

---

## NÄCHSTER SCHRITT (Fortsetzung bei „mach weiter")

**Noch offen:**
1. **Block 4-Rest:** globaler „alle Compliflow-Daten löschen"-Button (inkl. Watermark-Store mit Stripe-Session-IDs) — für geteilte Rechner. UI-Ergänzung im Footer.
2. **Block 8:** Supabase-RLS mit echtem Anon-Key live gegen SELECT/DELETE/confirmed-Fälschung testen (braucht echte Supabase-Instanz → MANUELL); eigene `/datenschutz`-Seite gegen reale Auftragsverarbeiter (Stripe/Resend/Brevo/Supabase/Plausible/Hetzner) abgleichen; Löschweg Art. 15/17 für Waitlist-Emails skizzieren.
3. **Block 3:** dokumentierten Watermark-URL-Bypass final bewerten (verify-session-Kopplung im Client ist bereits vorhanden — nur noch verifizieren/dokumentieren).
4. **Vertiefung Block 6:** jeden Wizard Schritt-für-Schritt ausfüllen und Export-Gating (Export gesperrt → freigeschaltet) im Browser gegenprüfen.

**MANUELLE SCHRITTE:**
- Coolify: 9 Pflicht-ENV + Upstash-ENV (`UPSTASH_REDIS_REST_URL/TOKEN`) setzen — `docs/COOLIFY-KEYS-SETUP.md`.
- **[HIGH] Next.js 14.2.35 → 15/16 Migration** (Fund 9.2), Breaking Changes + UI testen.
- **[MED] CSP `'unsafe-inline'` → Nonce-basiert** (Fund 9.1).
- **[MED] ESLint type-aware Setup:** `eslint` + `@typescript-eslint/*` + `eslint-config-next` installieren, `no-floating-promises` / `no-misused-promises` (checksConditionals) aktivieren, Bestandsverstöße abarbeiten.
- Live-Stripe-Testkauf; rechtliche Template-Freigabe (Liste oben).
