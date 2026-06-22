# Compliflow — Security TODO

> **Audit-Datum:** 2026-06-13 · **Fix-Datum:** 2026-06-17 · **2. Audit:** 2026-06-22 · **3. Audit:** 2026-06-22
> **Auditor:** Claude Code (autonome Overtime-Session + Verify-Audit + 2. Sicherheits-Pass + P1/P3/P4-Fix-Pass)
> **Status:** ✅ #2 #3 #6 #8 #9 #10 #11 #12 #13 #14 gefixt · #4 = wontfix · #1 = deployen · #5 #7 nach Launch
>
> **Fix-Notiz 2026-06-22 (3. Pass):**
> - **#12 DOI_SECRET dev-fallback** — `"dev-only-fallback"` aus Code entfernt. Kein NODE_ENV-Guard mehr. Fehlendes `DOI_SECRET` → `console.error` + `return false`. In Dev: einfach `DOI_SECRET=dev-local` in `.env.local` setzen.
> - **#13 Blog-XSS-Sink** — `inlineHtml()` in `app/blog/[slug]/page.tsx` escaped jetzt mit `escHtml()` VOR den Regex-Transforms. `<script>alert(1)</script>` in Blog-Content → `&lt;script&gt;...` im DOM.
> - **#14 escapeHtml zentralisiert** — 4 lokale Kopien (widerrufsbelehrung, agb, datenschutz, impressum) durch zentrales `escapeHtml()` aus `lib/utils.ts` ersetzt. Impressum-Version fehlte `'`-Escape — jetzt einheitlich auf 5-Zeichen-Escape (& < > " ').
>
> **Fix-Notiz 2026-06-17:**
> - **#2 Webhook** — Production-Guard: fehlt `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` in Prod → 500 statt stillem `{received:true}`; fehlender `stripe-signature`-Header → 400.
> - **#3 Checkout** — Mock-Mode nur noch in Dev; in Prod ohne Stripe-Keys → 503 statt Fake-`watermark_removed=true`.
> - **#6 Supabase** — `AbortSignal.timeout(5000)` auf DOI-Confirm-fetch.
> - **#4 Pro-Logik (wontfix):** `verify-session` prüft bereits server-seitig via Stripe `retrieve()`. Das einzige reale Loch war der Mock-Fallback = #3 (jetzt zu). Eine vollständig server-seitige PDF-Sperre ist architektonisch ausgeschlossen (PDFs werden bewusst client-seitig mit `@react-pdf/renderer` erzeugt) und für ein 0,99 €-Wasserzeichen Over-Engineering. Akzeptiertes Restrisiko.
>
> **Fix-Notiz 2026-06-22:**
> - **#8 XFF-Spoofing** — Alle 3 Rate-Limiter (checkout, verify-session, brevo/subscribe) nutzen jetzt `x-real-ip` (Vorrang) statt erstem `x-forwarded-for`-Wert. Fallback: letzter Wert in XFF.
> - **#9 waitlist/confirm Rate-Limit** — GET-Endpoint hat jetzt 10 req/min/IP-Limit.
> - **#10 DOI-Token-Ablauf** — HMAC enthält jetzt Epoch (7-Tage-Fenster). Aktuelle + vorherige Epoch werden akzeptiert → max. 14 Tage Gültigkeit. Bisherige DOI-Links (ohne Epoch im HMAC) werden ungültig.
> - **#11 Stille Datenverlust** — Fallback `.data/`-Write loggt jetzt explizit statt still zu scheitern.

---

## 🔴 BLOCKER — vor Launch zwingend

### #1 — Ungepushte Commits live deployen

**Problem:** 18 lokale Commits sind nicht auf der Produktion. Darunter der Next.js 14.2.18 → 14.2.35 Fix für die kritischen CVEs `GHSA-f82v-jwr5-mffw` (Auth-Bypass) und `GHSA-4342-x723-ch2f` (SSRF).

**Beweis:** robots.txt auf compliflow.de zeigt nur `Allow: /` — die lokalen disallow-Rules sind nicht deployed.

**Fix:**
```bash
cd ~/compliflow
git status                 # Erst lokale Modifications committen oder stashen
git push                   # Dann pushen
# Coolify-Deploy abwarten (~3-5 min)
# Verifizieren: curl -I https://compliflow.de | grep -i server
```

- [ ] **TODO:** `git push` ausführen (Branch `main` → 18 Commits ahead)
- [ ] **TODO:** Coolify-Build-Log prüfen
- [ ] **TODO:** Nach Deploy: `curl -s https://compliflow.de/robots.txt` muss `Disallow: /api/` zeigen

---

### #2 — Stripe-Webhook: Silent-Fail bei fehlendem `STRIPE_WEBHOOK_SECRET`

**Problem:** [app/api/stripe/webhook/route.ts:17-19](./app/api/stripe/webhook/route.ts#L17)

```ts
if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
  return NextResponse.json({ received: true });  // 200 OK ohne Verifikation!
}
```

Falls `STRIPE_WEBHOOK_SECRET` in Coolify fehlt/gelöscht wird, akzeptiert die App **jeden gefälschten Webhook** mit 200 OK. Angreifer kann beliebige Email-Adressen mit gefälschten "Zahlung erfolgreich"-Mails fluten.

**Fix:** In Production hart fehlschlagen, nicht silent durchwinken:

```ts
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  if (process.env.NODE_ENV === "production") {
    console.error("CRITICAL: STRIPE_WEBHOOK_SECRET missing in production");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }
  return NextResponse.json({ received: true });  // nur Dev/Local
}
if (!sig) {
  return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
}
```

- [ ] **TODO:** Webhook-Route refactoren (Production-Guard einbauen)
- [ ] **TODO:** Coolify-ENV verifizieren dass `STRIPE_WEBHOOK_SECRET` gesetzt ist

---

## 🟠 HIGH — vor Launch fixen

### #3 — Stripe-Checkout: Mock-Mode-Fallback erlaubt Fake-Zahlungen in Production

**Problem:** [app/api/stripe/checkout/route.ts:45-49](./app/api/stripe/checkout/route.ts#L45)

```ts
if (!process.env.STRIPE_SECRET_KEY || !priceId) {
  return NextResponse.json({
    url: `${baseUrl}/${tool}?success=true&mock=true`,
  });
}
```

Falls Stripe-Keys in Production fehlen, gibt die App `success=true` zurück — ohne Zahlung. Kombiniert mit dem schwachen Verify-Flow kann ein Angreifer Pro-Status für sich freischalten.

**Fix:** Mock-Mode nur in Dev:

```ts
if (!process.env.STRIPE_SECRET_KEY || !priceId) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Payment system unavailable" }, { status: 503 });
  }
  return NextResponse.json({
    url: `${baseUrl}/${tool}?success=true&mock=true`,
  });
}
```

- [ ] **TODO:** Checkout-Route refactoren (Production-Guard einbauen)

---

### #4 — Pro-Aktivierung serverseitig absichern (PDF-Download-Schutz)

**Problem:** Aktuell prüft das Frontend per `verify-session?sessionId=...` ob Pro freigeschaltet ist. Wenn die PDF-Generierung clientseitig läuft oder die Pro-Aktivierung in LocalStorage gespeichert wird, kann ein Angreifer das per DevTools manipulieren.

**Fragen die geklärt werden müssen:**
- Wo wird die Pro-Logik geprüft? (Frontend oder Server?)
- Werden die PDFs server- oder clientseitig generiert?
- Wird der Branding-Footer (Free-Tier) server- oder clientseitig entfernt?

**Wenn clientseitig:** PDF-Download hinter eine API-Route legen, die `verify-session` server-seitig prüft und nur dann die Pro-Variante (ohne Watermark) liefert.

- [ ] **TODO:** Pro-Logik-Flow auditieren (welche Schicht entscheidet?)
- [ ] **TODO:** Falls clientseitig → PDF-Download server-seitig hinter Session-Check legen

---

## 🟡 MEDIUM — nicht kritisch, nach Launch fixen

### #5 — Verbleibende Next.js Advisories

Nach Update auf 14.2.35 noch offen:
- `GHSA-h64f-5h5j-jqjh` — DoS via Image Optimization API (HIGH)
- `postcss <8.5.10` — XSS in CSS Stringify (MODERATE)

**Bewertung:** Trifft Compliflow nicht zu (keine User-Uploads für Bilder, postcss nur build-time).

**Fix-Option (später):** Migration auf Next 15 LTS (`npm install next@15.3.9`).

- [ ] **TODO (nach Launch):** Eval Next 15 Migration

---

### #6 — Supabase-Fetch ohne Timeout

**Problem:** [app/api/waitlist/confirm/route.ts:49](./app/api/waitlist/confirm/route.ts#L49)

```ts
await fetch(`${supabaseUrl}/rest/v1/waitlist`, { ... })
```

Wenn Supabase hängt, blockiert der Server-Thread bis Default-Timeout (~30s). Mehrere parallel hängende Bestätigungen können den Server lahmlegen.

**Fix:**
```ts
await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
  ...,
  signal: AbortSignal.timeout(5000),
})
```

- [ ] **TODO:** AbortSignal.timeout(5000) hinzufügen

---

### #7 — In-Memory Rate-Limit überlebt keinen Container-Restart

**Problem:** [app/api/stripe/checkout/route.ts:8](./app/api/stripe/checkout/route.ts#L8)

```ts
const ipRequests = new Map<string, { count: number; resetAt: number }>();
```

Bei jedem Coolify-Restart startet der Rate-Limiter bei 0. Bei Horizontal-Scaling wirken die Limiter unabhängig.

**Aktuelle Realität:** 1 Container, kein Scaling-Problem. Restart-Reset akzeptabel.

**Fix-Option (später):** Redis-basiert wenn Skalierung kommt. Cloudflare WAF kann das auch übernehmen.

- [ ] **TODO (nach Launch):** Eval Cloudflare Rate-Limit Rules oder Redis-Migration

---

## ✅ SAUBER — bereits abgehakt

| Bereich | Status |
|---------|--------|
| Secrets im Code | keine gefunden |
| Secrets in Git-History | nur `.env.example` |
| `.gitignore` schützt `.env*` | ✓ |
| Security-Headers Production | HSTS, CSP, X-Frame DENY, nosniff, Referrer, Permissions |
| HTTP→HTTPS Redirect | ✓ |
| `.env` / `.git/config` public | 404 |
| Stripe-Webhook Signaturprüfung | `constructEvent()` |
| DOI-Token | HMAC-SHA256 + Timing-safe Compare + Epoch (14 Tage Ablauf) + kein hardcoded Fallback |
| Email-Validation | Regex + Lowercase + Trim |
| Source-Whitelist DOI | `ALLOWED_SOURCES` |
| Rate-Limiting | Checkout 5/min, Verify 20/min, DOI-Confirm 10/min, Brevo 5/min |
| IP-Extraktion | `x-real-ip` > letzter XFF-Wert (XFF-Spoofing-sicher) |
| `dangerouslySetInnerHTML` | Generators: buildHtml() mit zentralem escapeHtml() aus lib/utils.ts; Blog: inlineHtml() escaped vor Transforms; JSON-LD hardcoded |
| `eval()` / `Function()` | keine |
| SQL-Injection | kein direktes SQL (Supabase REST) |
| TypeScript Build | 0 Errors, 44 Seiten |
| Error-Messages | generisch, keine Stack-Traces |
| `console.error` | nur Metadaten, keine Secrets |
| `poweredByHeader` | `false` |

---

## REIHENFOLGE DER FIXES

Wenn du eins nach dem anderen abarbeitest:

1. **JETZT** — `git push` (Blocker #1 — CVE läuft live)
2. **Vor 17.06.** — Webhook-Production-Guard (#2)
3. **Vor 17.06.** — Checkout-Production-Guard (#3)
4. **Vor 17.06.** — Pro-Logik-Flow auditieren (#4)
5. **Vor 17.06.** — Supabase-Timeout (#6) — quick win
6. **Nach Launch** — Next 15 Migration (#5)
7. **Nach Launch** — Rate-Limit-Migration (#7)

---

*Audit-Tools: npm audit, manuelle Code-Review, curl (Production Headers), git log*
*Volldokumente: ~/vault/agency/intern/vibe-coding-sicherheitsrisiken.md + security-self-audit.md*
