# Web-Embed Implementation — Free Copy-Paste + Premium Auto-Update

> **Entschieden:** 2026-06-13
> **Strategie-Doc:** `~/vault/agency/business-center/21-compliflow-monetarisierungs-strategie.md`

---

## Status-Check 2026-06-13

### Was schon existiert (Gut!)

- ✅ **Impressum-Generator** mit HTML-Copy-Paste-Export
  - Route: `app/impressum-generator/page.tsx`
  - HTML-Export-Komponente: `components/impressum/html-export.tsx`
  - Funktioniert: User kopiert HTML, fügt in eigene Webseite ein
  - **Das ist bereits Web-Embed Free-Tier — nichts zu tun!**

### Was fehlt für Launch 17.06.

- ❌ **Datenschutz-Generator mit HTML-Export** (Hauptprodukt für Embed!)
- ❌ **AGB-Generator mit HTML-Export** (Sekundär)
- ❌ **Branding/Credit-Backlink** im HTML-Export (für SEO-Effekt)
- ❌ **"Copy für deine Website"-CTA** prominent auf Tool-Seiten

### Was fehlt für Phase 2 (Monat 2-3)

- ❌ **JS-Widget mit Auto-Update** (Premium-Tier 7€/M)
- ❌ **Domain-Tracking** für Embed-Lizenzen
- ❌ **Versionierungs-System** für Texte
- ❌ **Webhook-Updates** bei Text-Änderungen

---

## Phase 1 — Free Tier (vor Launch 17.06.)

### Aufgabe 1: Datenschutz-Generator mit HTML-Export

**Build:** Spiegel-Strukur zu Impressum-Generator

```
app/datenschutz-generator/
  ├── layout.tsx
  ├── page.tsx          # Spiegel zu impressum-generator
lib/datenschutz/
  ├── contract.ts       # buildHtml() + buildPlaintext()
  ├── defaults.ts       # Standard-Klauseln (Hetzner, Stripe, Plausible, etc.)
  ├── store.ts          # Zustand-Store
  ├── types.ts          # DatenschutzData Type
  └── pdf/              # PDF-Generierung (wie Impressum)
components/datenschutz/
  ├── wizard-shell.tsx  # 6-8 Steps
  ├── html-export.tsx   # HTML/Plaintext-Copy
  └── steps/
      ├── step-betreiber.tsx       # Verantwortlicher (Name, Adresse, Email)
      ├── step-hosting.tsx          # Hosting-Anbieter (Hetzner, IONOS, Vercel etc.)
      ├── step-analytics.tsx        # Tracking-Tools (Plausible, GA4, Matomo)
      ├── step-payment.tsx          # Stripe, PayPal, Klarna
      ├── step-email.tsx            # Newsletter-Tool (Brevo, Mailerlite, Mailchimp)
      ├── step-rechtsgrundlagen.tsx # Art. 6 DSGVO Auswahl
      ├── step-betroffenenrechte.tsx # Standard-Klauseln
      └── step-review.tsx           # Final + HTML-Export
```

**Build-Aufwand:** 6-8 Stunden Solo-Build (Wizard-Engine wiederverwendbar aus Impressum)

### Aufgabe 2: AGB-Generator mit HTML-Export (Optional Launch, sonst Monat 2)

**Komplexer als Impressum/Datenschutz** wegen vielen Fallunterscheidungen (B2B vs. B2C, Shop vs. SaaS vs. Dienstleistung).

**Empfehlung:** Auf Monat 2 verschieben. Launch mit Impressum + Datenschutz reicht.

### Aufgabe 3: Compliflow-Credit-Backlink im Free-HTML-Export

**WICHTIG** für SEO-Boost durch Backlink-Maschine.

Modifikation in `lib/impressum/contract.ts` und `lib/datenschutz/contract.ts`:

```typescript
export function buildHtml(data: ImpressumData, options?: { credit?: boolean }): string {
  const includeCredit = options?.credit !== false; // Standard: ja
  
  const html = `<!-- Impressum erstellt mit Compliflow -->
<section class="compliflow-impressum">
  ${renderContent(data)}
  ${includeCredit ? `
  <p class="compliflow-credit" style="margin-top:2rem;font-size:0.75rem;color:#666;">
    Erstellt mit <a href="https://compliflow.de?ref=embed-impressum" rel="noopener" target="_blank">Compliflow</a>
  </p>
  ` : ''}
</section>`;
  
  return html;
}
```

**Tracking-Logik:** `?ref=embed-impressum` UTM-Parameter → in Plausible auswerten.

**SEO-Effekt:** bei 100 Embed-Nutzern = 100 Backlinks aus echten Websites. Wertvoller als jedes Listing.

### Aufgabe 4: Prominenter CTA auf Tool-Seiten

Auf `/impressum-generator` und `/datenschutz-generator` Headline anpassen:

> ## Impressum für deine Webseite in 5 Minuten
> Kostenlos. Kein Account. **HTML-Code zum direkten Einbinden** + PDF-Download.

Plus: Live-Vorschau mit "Code kopieren"-Button direkt sichtbar (nicht erst am Ende des Wizards).

### Aufgabe 5: Landing-Page-Update

Auf der Startseite (`app/page.tsx`) als Tool-Karte zeigen:

```
[Impressum-Generator]    [Datenschutz-Generator]    [AVV-Generator]
HTML für deine Website   HTML für deine Website     PDF-Vertrag
Kostenlos                Kostenlos                  Kostenlos
```

---

## Phase 2 — Premium JS-Widget mit Auto-Update (Monat 2-3)

### Konzept

**User-Sicht:**
```html
<!-- User kopiert das in seine Website -->
<div id="compliflow-datenschutz" data-id="ds_abc123xyz"></div>
<script src="https://compliflow.de/embed.js" async></script>
```

**Was passiert:**
1. Script lädt asynchron, fragt API `/api/embed/ds_abc123xyz/v1`
2. API gibt JSON zurück: `{ html: "...", version: "2026.03.15", license_valid: true }`
3. Script rendert HTML in `<div>`
4. Bei Lizenz-Ablauf: Hinweis "Embed-Lizenz abgelaufen" + Fallback auf statisches Cache

**Bei DSGVO-Änderung:**
1. Du aktualisierst zentrale Template-Datei
2. Cron-Job regeneriert alle Embed-Texte für alle aktiven Lizenzen
3. Nächster User-Page-Load → neue Version automatisch sichtbar
4. Optional: Notification-Mail an Lizenz-Inhaber ("Dein Datenschutz wurde aktualisiert wegen XY")

### Technische Komponenten

```
app/api/embed/
  ├── [id]/
  │   └── route.ts          # GET /api/embed/{id} → HTML + Metadata
  └── verify/
      └── route.ts          # Lizenz-Verifizierung

app/embed.js/
  └── route.ts              # Generierte JS-Datei (selber Code für alle Embeds)

lib/embed/
  ├── license.ts            # Lizenz-Validierung
  ├── cache.ts              # Server-Side-Cache + CDN-Layer
  ├── versioning.ts         # Text-Versionen tracken
  └── tracking.ts           # Domain-Tracking pro Lizenz

supabase/
  └── tables:
      ├── embed_licenses    # id, user_email, stripe_sub_id, domain, type, active_until
      ├── embed_versions    # type, version, html_template, valid_from
      └── embed_loads       # license_id, domain, timestamp (Usage-Tracking)
```

### Sicherheits-Anforderungen

1. **Lizenz-Bindung an Domain** — bei Abuse (1 Lizenz, 10 Domains): Warnung + nach 2 Strikes Lizenz-Sperre
2. **Rate-Limiting** auf `/api/embed/` (CDN-Layer + Server-Layer)
3. **Fallback-Cache** im Browser-localStorage (1 Woche) — falls Compliflow-Server kurzzeitig down
4. **CDN für static-content** (Cloudflare oder Bunny) — kritisch für Uptime
5. **Lizenz-Token vor Embed-Generation** verifizieren (HMAC mit Server-Secret)

### Pricing-Tier Premium

| Tier | Preis | Inhalt |
|---|---|---|
| **Free** | 0€ | HTML-Copy-Paste, statisch, mit Compliflow-Backlink |
| **Premium Single** | 7€/M oder 69€/Jahr | 1 Embed (z.B. Datenschutz) mit Auto-Update, 1 Domain, ohne Backlink |
| **Premium Multi** | 14€/M oder 139€/Jahr | bis 3 Embeds (Impressum + Datenschutz + AGB), 2 Domains |
| **Komplett-Compliance** | 19€/M oder 189€/Jahr | alle Embeds + Cookie-Banner + AVV-PDF + Premium-Generatoren | 

### Build-Reihenfolge Phase 2

1. **Woche 1:** Supabase-Schema + API-Routes (`/api/embed/[id]` + `/api/embed/verify`)
2. **Woche 1:** Stripe-Produkte für Premium-Tiers
3. **Woche 2:** `embed.js`-Generator + Domain-Tracking
4. **Woche 2:** User-Dashboard (`/account/embeds`) für Lizenz-Verwaltung
5. **Woche 3:** Update-Notification-System (Mail bei Text-Änderung)
6. **Woche 3:** Soft-Launch an Email-Liste

---

## Risiko-Mitigation für Web-Embed

| Risiko | Mitigation |
|---|---|
| Server-Downtime → User-Websites zeigen leere Datenschutzerklärung | CDN-Cache (Cloudflare) + Browser-localStorage-Fallback (1 Woche TTL) |
| Lizenz-Abuse (1 Lizenz, viele Domains) | Domain-Tracking + automatische Warnung bei Schwellenwert |
| DSGVO-Drift (Text wird veraltet) | Monatliche Review-Termine + Google Alerts auf "DSK Orientierungshilfe" |
| Stripe-Sperrung → User verlieren Zugang | Anbieter-Failover-Plan (Paddle/Stripe-Backup) — Phase 4 |
| Nutzer wechselt Tool → Embed leer | Lizenz läuft 30 Tage nach Kündigung weiter, dann Hinweis "Erneuere bei Compliflow" mit 14 Tagen Schonfrist |

---

## Nächste Schritte (Reihenfolge)

### Vor Launch 17.06.

1. ✅ **Impressum-HTML-Export prüfen** — funktioniert bereits (Backlink-Credit eintragen)
2. ⏳ **Datenschutz-Generator bauen** (Spiegel zu Impressum, 6-8h)
3. ⏳ **Compliflow-Credit-Backlink in HTML-Exports** einbauen (30 Min)
4. ⏳ **Landing-Page-Tool-Karten** anpassen (1h)
5. ⏳ **AGB-Generator** auf Phase 2 verschieben

### Nach Launch (Monat 2-3) — Premium-Embed

1. Stripe-Produkte für Premium-Tiers anlegen
2. Supabase-Schema für Lizenzen
3. `embed.js` + API-Routes bauen
4. User-Dashboard für Lizenz-Verwaltung
5. CDN-Setup (Cloudflare vor compliflow.de)
6. Soft-Launch an Email-Liste

---

## Cashflow-Impact

| Variante | Monat 6 Embed-Sub-Käufer | Monat 6 Revenue (Embed) |
|---|---|---|
| Nur Free-Embed | 0 | 0€ |
| Premium-Embed launched Monat 2 | 40-80 | 280-560€/M MRR |

**Premium-Embed-Strategie addiert ~1.500-3.000€ über die ersten 6 Monate** zur Compliflow-Roadmap.

Plus: bei 100+ Free-Embeds = 100+ Backlinks zu Compliflow → SEO-Compound-Effekt für die ganze Brand.
