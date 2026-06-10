# Compliflow — Deploy-Checkliste (17.06.2026 Launch)

> Alle Schritte die Ilias manuell machen muss. Claude kann das nicht für dich erledigen.
> Reihenfolge einhalten — jeder Schritt baut auf dem vorherigen auf.

---

## SCHRITT 1: Coolify — App konfigurieren

**Dashboard:** http://178.104.147.61:8000

1. Compliflow-App öffnen
2. **Port auf `3000` setzen** (muss exakt 3000 sein)
3. Domain `compliflow.de` hinterlegen + HTTPS aktivieren
4. Buildpack: **Nixpacks** oder Docker (Dockerfile ist vorhanden)
5. Healthcheck URL: `/` (oder leer lassen — Docker hat eigenen Healthcheck)

---

## SCHRITT 2: Stripe — Produkte anlegen

**Dashboard:** https://dashboard.stripe.com/products

### AVV Pro anlegen:
1. "Produkt erstellen" → Name: `AVV Pro`
2. Preis: `29,00 EUR` → Einmalig (kein Abo!)
3. **Price-ID kopieren** (sieht aus wie `price_1RxxxxxxxxxxxxxxxxYYY`)

### VVT Pro anlegen:
1. "Produkt erstellen" → Name: `VVT Pro`
2. Preis: `29,00 EUR` → Einmalig (kein Abo!)
3. **Price-ID kopieren**

### Webhook registrieren:
1. Stripe → Entwickler → Webhooks → "Endpoint hinzufügen"
2. URL: `https://compliflow.de/api/stripe/webhook`
3. Events: `checkout.session.completed` auswählen
4. **Webhook-Secret kopieren** (sieht aus wie `whsec_xxx`)

---

## SCHRITT 3: Resend — Domain verifizieren

**Dashboard:** https://resend.com/domains

1. Domain `compliflow.de` hinzufügen
2. DNS-Einträge bei Namecheap eintragen (Resend zeigt sie dir)
3. Domain verifizieren (dauert 10-60 min)
4. **API Key erstellen** → kopieren
5. **DPA abschließen:** resend.com → Settings → Legal → "Data Processing Agreement" akzeptieren

---

## SCHRITT 3b: DSGVO-Pflicht — AVV mit Dienstleistern abschließen

**Diese Schritte sind rechtlich Pflicht vor dem ersten Nutzer.**

### Hetzner AVV:
1. https://accounts.hetzner.com → Verwaltung → Bestellformular Auftragsverarbeitung
2. Formular ausfüllen + zurückschicken (oder online signieren)
3. Bestätigung als PDF speichern

### Stripe AVV:
1. https://dashboard.stripe.com → Einstellungen → Datenschutz → "Auftragsverarbeitungsvertrag"
2. Online anklicken/bestätigen — dauert 30 Sekunden

### Resend DPA (siehe Schritt 3 oben)

### Supabase DPA (falls Supabase genutzt):
1. https://supabase.com/legal/dpa → herunterladen oder online akzeptieren
2. EU-Region in Supabase-Projekt aktivieren: Frankfurt (eu-central-1)

---

## SCHRITT 4: Coolify — ENV-Variablen eintragen

**Alle Variablen müssen eingetragen sein:**

```
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_AVV_PRO=price_1Rxxxxx
STRIPE_PRICE_VVT_PRO=price_1Rxxxxx
RESEND_API_KEY=re_xxxxx
NEXT_PUBLIC_APP_URL=https://compliflow.de

# Double Opt-In (PFLICHT — verhindert gefälschte Bestätigungs-Links)
# Generieren mit: openssl rand -hex 32
DOI_SECRET=<hier_32_zufällige_bytes_hex>

# Optional: Supabase für Waitlist-Speicherung
# Wenn nicht gesetzt → Fallback auf .data/waitlist-confirmed.jsonl im Container
# Supabase-Schema einrichten: docs/supabase-schema.sql ausführen!
# ANON-Key (nicht Service-Role-Key!) verwenden
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
```

> **Stripe Keys:** Dashboard → Entwickler → API-Schlüssel (Live-Modus!)
> **Achtung:** `sk_live_` und `pk_live_` — NICHT die Test-Keys (`sk_test_`)!

---

## SCHRITT 5: Deploy auslösen

1. Coolify → "Deploy" klicken
2. Build-Log beobachten — dauert ca. 3-5 Minuten
3. Nach "Build successful": https://compliflow.de öffnen

---

## SCHRITT 6: Smoke-Test (nach Go-Live)

Jeden Punkt abhaken bevor Launch-Posts:

- [ ] https://compliflow.de öffnet (kein Bad Gateway)
- [ ] /avv → Wizard durchlaufen → PDF downloaden (kostenlos)
- [ ] /vvt → Wizard durchlaufen → PDF downloaden
- [ ] /preise → "AVV Pro kaufen" klicken → Stripe-Checkout öffnet
- [ ] Stripe Testkauf: Karte `4242 4242 4242 4242`, beliebiges Datum, CVC `123`
- [ ] Nach Testkauf: E-Mail-Bestätigung kommt an (alkhalilaoumeur@gmail.com)
- [ ] PDF nach Zahlung: "Pro aktiv" wird angezeigt, kein Branding-Footer
- [ ] Waitlist-Formular auf Homepage: Email eintragen → DOI-Mail kommt an (Betreff: "Bitte bestätige deine Wartelisten-Anmeldung")
- [ ] DOI-Mail: Bestätigungs-Link klicken → /waitlist/confirmed Seite öffnet
- [ ] /preise → "AVV Pro kaufen" → Consent-Modal zeigt AGB + Widerruf-Links → Checkbox → Stripe-Checkout öffnet mit Einwilligungstext

---

## Troubleshooting

| Problem | Lösung |
|---|---|
| Bad Gateway nach Deploy | Port muss 3000 sein; Container braucht 30-60 sec zum Starten |
| Stripe Checkout schlägt fehl | ENV-Vars prüfen: STRIPE_SECRET_KEY, STRIPE_PRICE_AVV_PRO gesetzt? |
| Keine E-Mail nach Zahlung | RESEND_API_KEY gesetzt? Domain verifiziert? |
| Pro wird nicht aktiviert | STRIPE_WEBHOOK_SECRET prüfen; Webhook-URL korrekt? |
| Build schlägt fehl | Coolify → Build-Log → nach rotem Fehler suchen |

---

## Nach dem Launch (sofort)

1. **Plausible Analytics** prüfen: compliflow.de erscheint in Dashboard
2. **Google Search Console** → Domain hinzufügen + Sitemap einreichen: `https://compliflow.de/sitemap.xml`
3. **Stripe-Webhook testen**: Dashboard → Webhooks → "Test event senden"

---

---

## Sicherheits-Checkliste (automatisch geprüft, nur zur Übersicht)

Diese Punkte sind bereits im Code implementiert — nur bei Problemen prüfen:

| Schicht | Status | Beschreibung |
|---|---|---|
| Rate-Limiting Checkout | ✅ | Max 5 Stripe-Checkouts pro IP pro Minute |
| Rate-Limiting verify-session | ✅ | Max 20 Verifyings pro IP pro Minute |
| Rate-Limiting Waitlist DOI | ✅ | Max 1 DOI-Email pro Adresse pro 10 Min |
| Stripe Webhook Signatur | ✅ | `stripe.webhooks.constructEvent()` — keine Bypass-Möglichkeit |
| DOI-Token HMAC | ✅ | SHA-256 mit DOI_SECRET, timing-safe comparison |
| DOI_SECRET Pflicht Prod | ✅ | Server-Error wenn nicht gesetzt (kein Fallback mehr) |
| Keine Server-Datenspeicherung | ✅ | Wizard-Daten nur localStorage — kein DSGVO-Problem |
| CSP-Header | ✅ | script-src, connect-src, frame-src konfiguriert |
| HSTS | ✅ | max-age=31536000 in Production |

*Zuletzt aktualisiert von Claude Code · 10.06.2026*
