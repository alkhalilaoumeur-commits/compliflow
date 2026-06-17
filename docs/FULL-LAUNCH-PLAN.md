# Compliflow Full-Launch-Plan — Alle Generatoren bis Launch

> **Erstellt:** 2026-06-13
> **Ziel:** Launch mit Feature-Parität zu e-recht24 (alle wichtigen Generatoren)
> **Neuer Launch-Termin:** 25.06.-30.06.2026 (verschoben von 17.06.)
> **Strategie-Doc:** `~/vault/agency/business-center/21-compliflow-monetarisierungs-strategie.md`

---

## Status-Inventar (2026-06-13)

### ✅ Bereits gebaut + Production-Ready
- **Impressum-Generator** (`/impressum-generator`) mit HTML-Export
- **AVV-Generator** (`/avv`) — PDF + Widerrufs-Consent
- **VVT-Generator** (`/vvt`) — Verzeichnis Verarbeitungstätigkeiten
- **Cookie-Banner-Page** (`/cookie-banner`) — Route existiert, Inhalt fehlt
- **Stripe-Webhook + Pricing-Seite** (wird umgestellt)
- **Datenschutz/Impressum/AGB/Widerruf** als statische Compliflow-eigene Pflichtseiten

### ❌ Fehlt für Vollständig-Launch
1. **Datenschutz-Generator** (Hauptprodukt!) — 6-8h Build
2. **Widerrufsbelehrung-Generator** — 4-6h
3. **AGB-Generator** (3 Varianten: Dienstleistung, Shop, B2B) — 14-20h
4. **Cookie-Banner-Generator** (statisches Free-Tier) — 8-12h
5. **HTML-Export-Backlink** in allen Generatoren — 1h
6. **Brevo-Email-Integration** — 3-4h
7. **Compliflow-Datenschutz** (eigene Seite) erweitern um Brevo + Supabase — 1h
8. **Landing-Page-Update** — alle 7 Tools als Karten — 2h
9. **Pricing-Page-Umbau** — von Pro-Tier auf Embed-Hinweis — 1h
10. **Final-Polish + Tests** — 4-6h

**Gesamt-Bauaufwand: ~50-60 Stunden = 7-10 effektive Bautage**

---

## Sprint-Plan

### Sprint 1 — Datenschutz-Generator (Tag 1-2, 13.-14.06.)

**Höchste Priorität — Hauptprodukt mit höchstem Embed-Wert.**

#### Architektur (Spiegel zu Impressum)

```
lib/datenschutz/
  ├── types.ts          # DatenschutzData + Module-Types
  ├── defaults.ts       # Standard-Klauseln (Hetzner, Stripe, Plausible, etc.)
  ├── store.ts          # Zustand-Store (zustand + persist)
  ├── contract.ts       # buildHtml() + buildPlaintext() + Validation
  └── pdf/
      └── renderer.tsx  # React-PDF Komponente

app/datenschutz-generator/
  ├── layout.tsx        # SEO Meta + JSON-LD
  └── page.tsx          # WizardShell

components/datenschutz/
  ├── wizard-shell.tsx  # 8 Steps Wizard
  ├── html-export.tsx   # HTML/Plaintext-Copy
  ├── live-preview.tsx  # Live-Vorschau
  └── steps/
      ├── step-verantwortlicher.tsx
      ├── step-hosting.tsx
      ├── step-analytics.tsx
      ├── step-newsletter.tsx
      ├── step-payment.tsx
      ├── step-social.tsx
      ├── step-rechte.tsx
      └── step-review.tsx
```

#### Datenmodell

```typescript
type DatenschutzData = {
  schemaVersion: 1;
  
  // Verantwortlicher (übernimmt aus Impressum-Store wenn vorhanden)
  verantwortlicher: {
    name: string;
    firma: string;
    strasse: string;
    plz: string;
    ort: string;
    land: Land;
    email: string;
    telefon?: string;
  };
  
  // Optional: Datenschutzbeauftragter
  dsb?: {
    name: string;
    email: string;
  };
  
  // Module — was nutzt der User?
  hosting: HostingAnbieter;          // "hetzner" | "ionos" | "aws" | "vercel" | "andere"
  analytics: AnalyticsModule[];      // ["plausible", "ga4", "matomo", "hotjar"]
  newsletter?: NewsletterModule;     // "brevo" | "mailerlite" | "mailchimp"
  payment: PaymentModule[];          // ["stripe", "paypal", "klarna", "sofort"]
  social: SocialModule[];            // ["facebook_plugin", "instagram_plugin", "youtube_embed"]
  embedded: EmbeddedModule[];        // ["google_fonts", "google_maps", "calendly"]
  cookies: CookieKategorie[];        // Welche Kategorien werden gesetzt
  
  // Drittlandtransfer
  drittland: {
    aktiv: boolean;
    laender: string[];               // ["USA", "UK"]
    sccs_vorhanden: boolean;
  };
  
  // Optionale Module
  kontaktformular: boolean;
  bewerbungsformular: boolean;
  kundenkonto: boolean;
  shop: boolean;
  blog: boolean;
  
  // Meta
  letztAktualisiert: string;
  erstelltAm: string;
};
```

#### Wizard-Steps

| # | Step | Inhalt |
|---|---|---|
| 1 | **Verantwortlicher** | Name, Adresse, Email (aus Impressum übernehmen wenn da) |
| 2 | **Hosting** | Wer hostet deine Webseite? (Hetzner/IONOS/Vercel/AWS) |
| 3 | **Analytics & Tracking** | Plausible, GA4, Matomo, Hotjar (Multi-Select) |
| 4 | **Newsletter** | Brevo, Mailerlite, Mailchimp (Single oder kein Newsletter) |
| 5 | **Payment** | Stripe, PayPal, Klarna (für Shops/SaaS) |
| 6 | **Social + Embedded** | FB-Plugin, IG, YouTube, Google Maps, Google Fonts |
| 7 | **Betroffenenrechte** | Standard-Klauseln Art. 13-22 DSGVO + Beschwerderecht |
| 8 | **Prüfen + Export** | HTML/PDF mit Backlink |

#### Defaults / Standard-Klauseln

Pro Modul vorgefertigter rechtssicherer Text mit Quellenangaben:
- Quelle: GDD-Mustertexte 2026
- Quelle: Bitkom Datenschutz-Vorlagen
- Quelle: Aktuelle DSK-Orientierungshilfen

#### Tests

```
__tests__/datenschutz/
  ├── contract.test.ts       # buildHtml mit allen Modulen
  ├── validation.test.ts     # Alle Pflichtfelder
  └── e2e.test.ts            # Wizard durchklicken + Export
```

**Definition of Done Sprint 1:**
- [ ] Wizard 8 Steps funktioniert
- [ ] HTML-Export mit Compliflow-Backlink
- [ ] PDF-Export
- [ ] Live-Vorschau aktualisiert sich beim Tippen
- [ ] Zustand-Persistenz funktioniert
- [ ] Alle Module rendern korrekt
- [ ] Tests grün

---

### Sprint 2 — Widerrufsbelehrung-Generator (Tag 3, 15.06.)

**Klein, schnell — hoher Wert für Shop-Betreiber.**

```
lib/widerrufsbelehrung/
  ├── types.ts
  ├── defaults.ts
  ├── store.ts
  └── contract.ts

app/widerrufsbelehrung-generator/
  └── page.tsx

components/widerrufsbelehrung/
  ├── wizard-shell.tsx
  └── steps/
      ├── step-anbieter.tsx
      ├── step-leistung.tsx        # Ware / Dienstleistung / digitaler Inhalt
      ├── step-frist.tsx           # 14 Tage Standard
      └── step-review.tsx
```

#### Datenmodell

```typescript
type WiderrufData = {
  anbieter: { /* aus Impressum */ };
  leistungstyp: "ware" | "dienstleistung" | "digital";
  besonderheiten: {
    digitalSofortDownload: boolean;     // Widerruf erlischt bei sofortigem Download
    dienstleistungSofort: boolean;      // Widerruf erlischt bei Erbringung
    rueckgabeFristTage: number;         // Standard 14
  };
  versandkostenInfo?: string;
  rueckgabeAdresse: { /* aus Impressum */ };
};
```

**Wichtig:** Muster-Widerrufsformular nach Anhang § 312f BGB integrieren.

**Definition of Done Sprint 2:**
- [ ] 4 Steps Wizard
- [ ] HTML-Export
- [ ] PDF-Export inkl. Muster-Widerrufsformular
- [ ] Tests

---

### Sprint 3 — AGB-Generator (Tag 4-6, 16.-18.06.)

**Größter Bau-Aufwand wegen 3 Varianten.**

```
lib/agb/
  ├── types.ts
  ├── defaults/
  │   ├── dienstleistung-b2c.ts
  │   ├── shop-b2c.ts
  │   └── b2b.ts
  ├── store.ts
  └── contract.ts

app/agb-generator/
  └── page.tsx

components/agb/
  ├── wizard-shell.tsx
  └── steps/
      ├── step-variant.tsx          # Welche AGB-Art?
      ├── step-anbieter.tsx
      ├── step-leistung.tsx         # Was wird verkauft?
      ├── step-zahlung.tsx          # Zahlungsbedingungen
      ├── step-lieferung.tsx        # Lieferung (nur Shop)
      ├── step-haftung.tsx          # Haftungsausschluss
      ├── step-recht.tsx            # Anwendbares Recht + Gerichtsstand
      └── step-review.tsx
```

#### 3 Varianten

| Variante | Wer | Spezial-Klauseln |
|---|---|---|
| **Dienstleistung B2C** | Solo-Freelancer, Berater, Agenturen | Erbringung, Zahlungsziel, Vertragslaufzeit |
| **Shop B2C** | E-Commerce | Versand, Lieferung, Eigentumsvorbehalt, EAR |
| **B2B** | Unternehmen → Unternehmen | Weniger Verbraucherschutz, Skonto, längere Zahlungsziele |

**Definition of Done Sprint 3:**
- [ ] Wizard mit Varianten-Auswahl funktioniert
- [ ] Alle 3 Varianten exportieren korrekt
- [ ] HTML + PDF Export
- [ ] Backlink eingebaut
- [ ] Tests

---

### Sprint 4 — Cookie-Banner-Generator (Tag 7-8, 19.-20.06.)

**Free-Tier:** Statischer HTML/CSS/JS-Snippet zum Einbau. Kein zentrales Consent-Management (das wird Phase 2 Premium).

```
lib/cookie-banner/
  ├── types.ts
  ├── defaults.ts          # Verschiedene Banner-Stile
  ├── store.ts
  └── builder.ts           # Generiert kompletten <script>-Block
```

#### Was generiert wird

```html
<!-- User kopiert das in seinen <head> -->
<script>
  // Minimaler Cookie-Banner mit Accept/Reject
  // Speichert Wahl in localStorage
  // Lädt erst Google Analytics/etc. nach Accept
</script>
<style>...</style>
<div id="compliflow-cookie-banner">...</div>
```

#### Konfigurierbar

- **Stil:** Bottom-Bar, Modal, Sidebar
- **Buttons:** Nur "Akzeptieren" / "Akzeptieren + Ablehnen" / Vollständig (Akzeptieren/Ablehnen/Settings)
- **Tracking-Tools:** Welche Scripts werden erst nach Consent geladen
- **Farben:** an Brand-Farben anpassbar
- **Sprache:** DE/EN

**Definition of Done Sprint 4:**
- [ ] Banner-Builder funktioniert (Live-Vorschau)
- [ ] Generierter Code funktioniert isoliert (in einer Test-HTML)
- [ ] Free-Version mit Compliflow-Credit am Banner
- [ ] HTML-Snippet zum Kopieren
- [ ] Tests

---

### Sprint 5 — Brevo-Email-Integration (Tag 9, 21.06.)

**Zentrale Pipeline für Email-Capture.**

#### Code-Komponenten

```
lib/brevo/
  ├── client.ts          # Brevo API Wrapper
  ├── lists.ts           # List-Management
  └── templates.ts       # Welche Template-IDs für was

app/api/brevo/
  ├── subscribe/
  │   └── route.ts       # POST /api/brevo/subscribe { email, source, consent }
  └── confirm/
      └── route.ts       # GET /api/brevo/confirm?token=xxx

components/email-capture/
  ├── capture-modal.tsx       # Vor PDF-Download
  ├── newsletter-form.tsx     # Footer-Form
  └── exit-intent.tsx         # Exit-Intent Popup
```

#### Capture-Punkte

1. **Vor PDF-Download** in jedem Generator
   - Modal: "Email für PDF" + Checkbox "Updates zu neuen Tools"
   - Double-Opt-In via Brevo
2. **Footer-Newsletter** auf jeder Seite
3. **Exit-Intent** auf Tool-Seiten (Phase 2)

#### Datenschutz-Update

- Brevo + Supabase als Auftragsverarbeiter eintragen
- AVV mit Brevo abschließen (im Brevo-Dashboard)
- Datenschutzerklärung in `app/datenschutz/page.tsx` erweitern

**Definition of Done Sprint 5:**
- [ ] Brevo-Account erstellt + DPA
- [ ] Email-Capture-Modal funktioniert
- [ ] Double-Opt-In via Brevo läuft
- [ ] Welcome-Mail-Template
- [ ] Datenschutz erweitert
- [ ] Test: Email eintragen → Bestätigungs-Mail kommt an → Klick → Liste-Eintrag

---

### Sprint 6 — Landing-Page + Pricing-Page-Umbau (Tag 10, 22.06.)

#### Landing-Page (`app/page.tsx`)

7 Tool-Karten zeigen:
- Impressum-Generator
- Datenschutz-Generator
- AGB-Generator (mit Varianten-Badge)
- Widerrufsbelehrung-Generator
- Cookie-Banner-Generator
- AVV-Generator
- VVT-Generator

Plus: Hero mit klarem Value-Prop "Komplett-Compliance für deine Webseite. Kostenlos. Direkt einbaubar."

#### Pricing-Page (`app/preise/page.tsx`)

Komplett umbauen:
- Alle Free-Tools auflisten
- Hinweis auf kommende Premium-Embed-Tier (7€/M mit Auto-Update — "kommt in Kürze")
- Keine 29€/19€ Pro-Tiers mehr

---

### Sprint 7 — Final-Polish + Tests + Backlink-Einbau (Tag 11, 23.06.)

#### Tasks

1. **Backlink in ALLEN HTML-Exporten** einbauen:
   - Impressum (`lib/impressum/contract.ts`)
   - Datenschutz (neu)
   - AGB (neu)
   - Widerrufsbelehrung (neu)
   - Cookie-Banner (neu)
2. **Cross-Tool-Navigation** — User-Flow von einem Tool zum nächsten
3. **SEO Meta Tags** für alle neuen Routes
4. **Sitemap** updaten
5. **robots.txt** prüfen
6. **End-to-End-Test:** Jeder Generator komplett durchklicken + Export
7. **Mobile-Responsiveness** prüfen

---

### Sprint 8 — Launch-Vorbereitung (Tag 12, 24.06.)

#### Launch-Day Checkliste

- [ ] Production-Deploy via Coolify
- [ ] DNS prüfen (compliflow.de)
- [ ] Plausible Analytics aktiv
- [ ] Brevo-Pipeline läuft
- [ ] Health-Check-Endpoint funktioniert
- [ ] Stripe deaktiviert (kein Pro-Tier mehr)
- [ ] PH-Launch-Material vorbereitet
- [ ] Indie-Hackers-Post fertig
- [ ] LinkedIn-Post fertig
- [ ] Reddit-Posts (r/SideProject, r/SaaS, r/Datenschutz) fertig

---

## Quality Gates (vor jedem Sprint-Übergang)

Bevor ich zum nächsten Sprint übergehe:

1. ✅ **Funktionstest** — Wizard durchklicken, Daten eingeben, exportieren
2. ✅ **HTML-Validierung** — generierter HTML-Code im Browser testen
3. ✅ **TypeScript-Build** — `npm run build` läuft ohne Fehler
4. ✅ **Lint** — `npm run lint` läuft ohne Fehler
5. ✅ **Persistenz-Test** — Daten überleben Browser-Reload
6. ✅ **Mobile-Check** — Wizard auf 375px-Breite testbar

---

## Risiken

| Risiko | Wahrscheinlichkeit | Mitigation |
|---|---|---|
| Generator wird größer als geschätzt | hoch | Scope-Cut: erst MVP-Variante, dann ausbauen |
| Rechtliche Lücken in Default-Texten | mittel | Quellen-Tracking + Anwalt-Review in Phase 3 |
| Brevo-Integration buggy | niedrig | Brevo-API ist gut dokumentiert |
| Cookie-Banner Browser-Kompatibilität | mittel | Auf alten Browsern testen, Polyfills wenn nötig |
| Launch-Verschiebung weil Code nicht fertig | mittel | Sprint-Cuts erlaubt: AGB B2B oder Shop kann nach Launch |

---

## Sofort-Beginn: Sprint 1 Datenschutz-Generator

Nach Plan-Dokumentation starte ich direkt mit:
1. `lib/datenschutz/types.ts`
2. `lib/datenschutz/defaults.ts`
3. `lib/datenschutz/store.ts`
4. `lib/datenschutz/contract.ts`
5. Component-Layer
6. Tests
