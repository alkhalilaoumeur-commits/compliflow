# Compliflow Pre-Launch Verifikations-Playbook

> **Erstellt:** 2026-06-16 | **Für Launch:** 17.06.2026
> **Zweck:** Schritt-für-Schritt-Protokoll zur Verifikation dass Compliflow funktional UND sicher ist vor Go-Live
> **Zeitbudget:** ~3.5h vor Launch + 5 Min alle 2h erste 24h
> **Regel:** Keine Phase überspringen. Jede Phase blockiert die nächste.

---

## Phasenübersicht

| Phase | Inhalt | Dauer | Wann |
|---|---|---|---|
| A | Funktional: Geht alles? | 45 Min | Heute Abend |
| B | Sicherheit: Layer-für-Layer | 90 Min | Heute Abend |
| C | Datenbank: Speicherung sicher? | 30 Min | Heute Abend |
| D | End-to-End-Smoke-Test | 20 Min | Morgen früh |
| E | Pre-Production-Checkliste | 15 Min | Direkt vor Push |
| F | Post-Launch-Monitoring | 5 Min × erste 24h | Nach Launch |

---

## PHASE A — Funktional: Geht alles? (~45 Min)

**Ziel:** Jeden User-Workflow einmal komplett durchklicken und dokumentieren was passiert.

### Schritt 1 — Lokale Workflow-Tests (Manuell im Browser)

Starte lokal: `cd ~/compliflow && npm run dev` → `http://localhost:3000`

Pro Workflow notieren: **funktioniert / kaputt / unklar**

| # | Workflow | Was klicken | Erwartetes Ergebnis |
|---|---|---|---|
| 1 | Waitlist-Anmeldung | Email eingeben + Submit | "Fast dabei — bestätige per Email" + Resend-Logs zeigen DOI-Mail |
| 2 | Waitlist-Bestätigung | Bestätigungs-Link aus Email klicken | Redirect zu `/waitlist/confirmed` + Eintrag in Supabase mit `confirmed=true` |
| 3 | AVV-Wizard | `/avv` durchklicken bis PDF-Download | PDF wird im Browser generiert + downloadet |
| 4 | Stripe-Checkout | Pro-Button auf `/preise` | Redirect zu Stripe Checkout-Page mit Widerrufs-Checkbox |
| 5 | Stripe Success-Return | Nach Test-Zahlung mit `4242 4242 4242 4242` | Redirect zurück + `verify-session` returns valid + PDF-Download freigeschaltet |

**Wenn ein Workflow bricht → STOP**, fixen, wiederholen. Erst weiter wenn alle 5 grün.

### Schritt 2 — Edge-Cases pro Workflow

Pro Workflow mindestens diese 3 Edge-Cases durchspielen:

**Waitlist:**
- Email mit Großbuchstaben → muss als lowercase gespeichert werden
- Doppelte Anmeldung mit gleicher Email innerhalb 10 Min → Rate-Limit greift, **aber** Antwort bleibt "Fast dabei" (Verhindert User-Enumeration)
- Bestätigungs-Link mit manipuliertem Token (1 Zeichen ändern) → Redirect zu `/waitlist/invalid`

**AVV-Wizard:**
- Felder leer lassen + Submit → Validierungsfehler erscheint, kein Crash
- JavaScript deaktivieren → klare Meldung, kein leere Seite
- Mobile-Ansicht (Browser-DevTools 375px) → alles bedienbar

**Stripe-Checkout:**
- Mit Test-Karte `4000 0000 0000 0002` (declined) → Stripe zeigt Fehler, Compliflow zeigt sauberen Fallback
- Browser-Tab schließen mitten im Checkout → kein orphan Eintrag in DB
- `session_id` aus URL nach Erfolg manuell ändern → `verify-session` returns invalid

### Schritt 3 — Mobile + Desktop + 2 Browser

- **Chrome Desktop** (häufigster)
- **Safari Mobile (iOS)** (kritisch für PDF-Download)
- **Firefox Desktop** (Bias-Check)

### Schritt 4 — Console + Network Tab prüfen

Bei JEDEM Workflow Browser-DevTools offen lassen:
- **Console:** Keine roten Fehler. Warnings OK aber notieren.
- **Network:** Keine 4xx/5xx. Keine doppelten Requests.
- **Application → Local Storage:** Nach Stripe-Success liegt `session_id` korrekt drin.

---

## PHASE B — Sicherheit: Layer-für-Layer (~90 Min)

**Ziel:** Aktiv versuchen die Anwendung kaputtzumachen und die 4 roten Pre-Launch-Fixes verifizieren.

### Schritt 5 — HTTP-Header Audit

`curl -I https://compliflow.de`

Diese Header MÜSSEN da sein:
```
Content-Security-Policy: default-src 'self'; ...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), ...
Strict-Transport-Security: max-age=31536000; ...   ← nur in Production
```

**Automatisierte Checks:**
- https://securityheaders.com/?q=compliflow.de — Ziel mindestens A
- https://observatory.mozilla.org/analyze/compliflow.de — Ziel B+

### Schritt 6 — Penetration-Tests (Du als Angreifer)

**Angriff 1 — Stripe-Webhook ohne Signatur**
```bash
curl -X POST https://compliflow.de/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"checkout.session.completed","data":{...}}'
```
**Erwartet:** Response leer/200 ohne Email-Versand. **NICHT erwartet:** Email landet bei dir oder Eintrag in DB.

**Angriff 2 — Rate-Limit-Test**
```bash
for i in {1..10}; do
  curl -X POST https://compliflow.de/api/stripe/checkout \
    -H "Content-Type: application/json" \
    -d '{"tool":"avv"}' \
    -w "%{http_code}\n" -o /dev/null -s
done
```
**Erwartet:** Erste 5 = 200, danach 429.

**Angriff 3 — DOI-Token-Replay (kritischster Test!)**
- Trag dich auf der Waitlist ein, kriege Bestätigungs-Email
- Klick den Link → wird zu `/waitlist/confirmed` redirected
- Kopiere die URL aus der Email
- Klick die URL **nochmal** in Inkognito-Fenster

**Erwartet nach Fix R1:** Redirect ohne zweite Owner-Notification an dich.
**Wenn du eine zweite Notification kriegst:** Fix R1 ist nicht drin → **DEAL-BREAKER für Launch**.

### Schritt 7 — Stripe-Test-Modus vs Live-Modus

| Check | Wo | Wert |
|---|---|---|
| Coolify ENV `STRIPE_SECRET_KEY` | Coolify-Dashboard | beginnt mit `sk_live_` |
| Coolify ENV `STRIPE_WEBHOOK_SECRET` | Coolify | `whsec_` aus dem Live-Webhook |
| Stripe Dashboard | dashboard.stripe.com | **Live-Mode aktiv** |
| Webhook-Endpoint | Stripe → Webhooks | `https://compliflow.de/api/stripe/webhook` listed + "Listening" |
| Publishable Key | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_` (nicht `pk_test_`) |

**1 Live-Test mit deiner eigenen Karte für 29€ → sofort Refund.**

### Schritt 8 — Email-Delivery Verifikation

**Resend-Dashboard öffnen:**
- Domain `compliflow.de` verifiziert (SPF + DKIM + DMARC alle grün)
- Test-Email an mindestens **3 verschiedene Provider**: Gmail, GMX, web.de
- Pro Postfach prüfen: Posteingang oder Spam? Absender verifiziert? Links funktionieren?

---

## PHASE C — Datenbank: Speicherung sicher? (~30 Min)

**Ziel:** Supabase-Setup auditieren — kann jemand fremder reinschauen, schreiben, löschen?

### Schritt 9 — Supabase RLS-Policies prüfen

Im Supabase-Dashboard → `Authentication` → `Policies` → Tabelle `waitlist`:

- ✅ RLS ist **enabled**
- ✅ KEINE Policy die `anon` Rolle `SELECT` erlaubt (sonst Email-Liste public!)
- ✅ KEINE Policy die `anon` Rolle `INSERT/UPDATE/DELETE` erlaubt
- ✅ Service Role wird serverseitig benutzt (nicht ANON-Key)

**Manueller Hack-Test:**
```bash
curl "https://YOUR_PROJECT.supabase.co/rest/v1/waitlist?select=*" \
  -H "apikey: YOUR_ANON_KEY"
```
**Erwartet:** `[]` oder Permission-Error. **NICHT:** Die Email-Liste.

### Schritt 10 — PII-Audit (DSGVO-Verarbeitungsverzeichnis)

| Datenfeld | Wo gespeichert | Verschlüsselt at-rest? | Verschlüsselt in-transit? | Wer hat Zugriff? | Löschfrist |
|---|---|---|---|---|---|
| Email (Waitlist) | Supabase `waitlist` | Ja (Supabase Default) | Ja (HTTPS) | Du via Service-Role | Bis Opt-Out |
| Email (Stripe) | Stripe + Resend | Ja | Ja | Stripe, Resend | nach 10J (HGB) |
| Firmen-Daten (AVV/VVT) | Browser localStorage | Nein | n/a | nur User selbst | bis User löscht |
| IP-Adresse | Rate-Limit Map (RAM) | n/a | n/a | nur App | bei Restart |
| Stripe Session ID | localStorage | Nein | n/a | nur User | indefinit |

**Sanity-Checks:**
- AVV/VVT-Daten verlassen nie den Browser → Network-Tab: keine POST mit Firmendaten an deinen Server
- Keine PII in Server-Logs: `grep -rn "console.log" app/ lib/`

### Schritt 11 — Backup + Recovery

- Supabase tägliche Backups aktiv? (Free-Tier hat 7-Tage-Backup)
- Restore-Test mit Dummy-Daten durchspielen

---

## PHASE D — End-to-End-Smoke-Test (~20 Min)

### Schritt 12 — Der "echte Kunde"-Durchlauf

Auf `https://compliflow.de` Inkognito-Browser:

1. Startseite besuchen
2. AVV-Generator durchklicken bis Pro-Aufforderung
3. Pro klicken → Stripe Checkout
4. Mit Live-Karte 29€ zahlen
5. Zurück zu Compliflow → PDF-Download
6. PDF öffnen + auf Vollständigkeit prüfen
7. **Refund über Stripe-Dashboard direkt danach**
8. Resend prüfen: kam Zahlungsbestätigung an?
9. localStorage löschen + neu laden → Pro-Status sollte gone sein

### Schritt 13 — Performance Baseline messen

- **PageSpeed Insights** → Mobile ≥ 80, Desktop ≥ 90
- **Lighthouse** → Performance, A11Y, Best Practices, SEO alle > 85
- **Plausible** Real-time view zeigt dich

**Rote Flags:**
- LCP > 4s → SEO-Killer
- CLS > 0.1 → User springt ab
- Accessibility < 80 → A11Y-Klage-Risiko

---

## PHASE E — Pre-Production-Checkliste (~15 Min)

### Schritt 14 — Die 12 nicht-verhandelbaren Items

```
[ ] PAYMENT_PROVIDER ist auf "live" in Coolify
[ ] STRIPE_SECRET_KEY beginnt mit sk_live_
[ ] STRIPE_WEBHOOK_SECRET ist whsec_ aus Live-Mode
[ ] DOI_SECRET gesetzt + mindestens 32 Zeichen (openssl rand -hex 32)
[ ] RESEND_API_KEY funktioniert
[ ] SUPABASE Service-Role-Key serverseitig (NICHT NEXT_PUBLIC_ Prefix)
[ ] Supabase RLS aktiv auf allen Tabellen
[ ] NEXT_PUBLIC_APP_URL = https://compliflow.de
[ ] Plausible-Domain ist compliflow.de verifiziert
[ ] /impressum, /datenschutz, /agb, /widerruf gefüllt + verlinkt im Footer
[ ] Coolify-Healthcheck grün
[ ] DNS A-Record + AAAA-Record auf Hetzner-IP korrekt
```

### Schritt 15 — Rollback-Plan parat halten

- **Coolify Rollback:** Wie lange dauert das? Vorher 1× testen
- **DNS-TTL:** Cloudflare TTL auf 5 Min stellen vor Launch
- **Notfall-Kontakte:** Hetzner-Support + Stripe-Support notiert
- **Status-Page:** Simple "We're investigating" Seite parat

---

## PHASE F — Post-Launch-Monitoring (Erste 24h)

### Schritt 16 — Alle 2h checken

| Check | Wo | Was du sehen willst |
|---|---|---|
| Container läuft | Coolify-Dashboard | Status grün, Restart-Count = 0 |
| HTTP-Errors | Coolify-Logs | Keine 5xx letzte 2h |
| Stripe-Events | Stripe → Webhooks | Alle Events "Delivered" (200) |
| Email-Delivery | Resend | Bounce < 5%, Delivery > 95% |
| Traffic | Plausible | Visits + Sources |
| Waitlist | Supabase | Neue Einträge mit `confirmed=true` |
| Conversions | Stripe | Tatsächliche Zahlungen |

### Schritt 17 — Owner-Alerts setzen

- **Stripe:** Settings → Notifications → "Failed payment", "Webhook failure"
- **Resend:** Webhook für Bounces
- **Coolify:** Container-Down-Notification
- **UptimeRobot** (gratis): 1-Min-Ping auf `https://compliflow.de`

---

## Meta-Regel: Was bei Phase-Skip schiefgeht

| Phase übersprungen | Worst-Case |
|---|---|
| A (Funktional) | Kunde zahlt 29€, kriegt kein PDF, Vertrauen + 29€ weg |
| B (Sicherheit) | DOI-Replay → Spam-Verstärker → Resend sperrt dich → Email-Liste tot |
| C (Datenbank) | RLS-Fehler → Email-Liste public-leak → DSGVO-Meldung Pflicht innerhalb 72h → Bußgeld |
| D (E2E) | Live-Stripe falsch → erster Kunde Fehler → schlechte Review |
| E (Pre-Prod) | `PAYMENT_PROVIDER=mock` in Prod → Kunde sieht "Mock Checkout" |
| F (Monitoring) | Container crasht Stunde 3 → Du merkst es morgens → 6h Downtime |

**Phase C hat höchstes Schadenspotenzial (DSGVO bis 4% Jahresumsatz oder 20 Mio €).**

---

## Files-Bezug

- Code: `~/compliflow/`
- Monetarisierungs-Strategie: `~/vault/agency/business-center/21-compliflow-monetarisierungs-strategie.md`
- Embed-Architektur (für Phase 2): `~/vault/agency/business-center/22-compliflow-embed-architektur.md`
- Security-Audit-Notes (4 rote Fixes): siehe Memory `project_compliflow_*` oder Konversation
