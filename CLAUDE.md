# Compliflow — Claude-Instruktionen

> **Projekt:** DSGVO-Compliance-Tool-Suite für DACH-Markt
> **Domain:** compliflow.de
> **Status:** PRODUCTION READY — Launch 17.06.2026 (Code vollständig, Coolify-Deploy ausstehend)
> **Hosting:** Hetzner VPS (IP: 178.104.147.61) + Coolify + Traefik — KEIN Vercel!
> **Auth:** KEINE Login-Pflicht. Daten in localStorage. Pro-Status via Stripe Session ID im localStorage.

---

## Kontext

- **Ilias:** Wirtschaftsinformatik-Student, Solo-Builder, **keine Programmiererfahrung** — alles auf Deutsch erklären, einfach halten
- Bei jedem Schritt erklären: WAS du tust, WARUM, WOHIN die Daten gehen
- Lieber zu ausführlich als zu knapp
- Honest over polite — direkt sagen wenn etwas kaputt oder unrealistisch ist

---

## Suite-Architektur (Wichtig!)

Compliflow ist eine **Suite**, kein Einzel-Tool. Alle 3 Tools liegen unter EINER Domain als Pfade:

```
compliflow.de/
├── /              → Suite-Landing
├── /avv           → AVV-Generator (Tool 1, im Build)
├── /vvt           → Verarbeitungsverzeichnis (Tool 2, geplant)
├── /cookie-banner → Cookie-CMP (Tool 3, geplant)
├── /blog          → SEO-Content-Hub
├── /preise        → Pricing-Page (alle Tools + Bundles)
├── /affiliate     → Partner-Programm
├── /impressum     → Pflicht
├── /datenschutz   → Pflicht
├── /agb           → Pflicht
└── /widerruf      → Pflicht
```

Komponenten-Wiederverwendung über alle Tools maximieren — Wizard-Engine, PDF-Generator, Stripe-Logic, Auth alles gemeinsam.

---

## Tech-Stack (Pflicht)

| Layer | Tool |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| DB | KEIN Supabase in MVP. Waitlist optional mit Supabase, Fallback auf .data/waitlist.jsonl + Resend-Email |
| Auth | KEIN Login/Auth. Pro-Status = Stripe Session ID in localStorage. Keine Accounts. |
| Payment | Stripe Checkout Sessions (redirect-based). price_xxx IDs in ENV-Vars. card only. |
| PDF-Gen | @react-pdf/renderer (client-side im Browser). KEINE server-side Generierung. |
| Email | Resend (hello@compliflow.de). Nur: Zahlungsbestätigung + Waitlist-Notification. |
| Analytics | Plausible (compliflow.de konfiguriert, DSGVO-konform) |
| Hosting | Hetzner VPS (178.104.147.61) + Coolify + Traefik. KEIN Vercel. |
| Healthcheck | Docker HEALTHCHECK via wget auf Port 3000 |

---

## Brand-Identity (Pflicht)

Quelle: `~/vault/agency/intern/brand-identity.md` + `~/.claude/design-rules.md`

### Farben (ACTUAL — Light Cream Theme)

```css
/* globals.css und tailwind.config.ts */
--color-bg: #f6f2ea;         /* Cream/Beige, Haupthintergrund */
--color-bg-soft: #f0ece3;    /* Leicht dunkler */
--color-surface: #fdfbf6;    /* Für Cards */
--color-ink: #15171B;        /* Fast schwarz */
--color-ink-dim: #4F5359;
--color-ink-faded: #8B8E94;
--color-accent: #1F3D2F;     /* Dunkelgrün (DSGVO-Vertrauensfarbe) */
--color-accent-soft: #E8F0EC;
--color-line: #E2DDD1;
--color-warn: #D4A445;
```

**NICHT die alten DRVN-Farben (#0A0906 Espresso / #FF4D00 Vermillion)!**
Compliflow hat ein eigenes Design: hellcreme Hintergrund + dunkelgrüner Akzent.

### Typografie

- **Display:** Fraunces (nicht Syne!) — für Headlines (serif, editorial)
- **Body:** DM Sans (400/500/700) — für Text
- **Mono:** JetBrains Mono (für Labels, Chips, Tags)

### Tonalität

- Deutsch primär (Englisch optional als Schalter)
- **Duzen** (nicht siezen, "Wir" als Marke)
- Professionell-technisch, aber zugänglich
- Loss-Frame in Pitches ("Bußgeld vermeiden" > "Compliance erreichen")

### Design-Richtung

**Editorial-meets-Utilitarian** — klare Struktur, starke Typografie, Erdtöne + Vermillion-Akzent, keine Spielerei.

---

## Was VERBOTEN ist (Design-Rules)

- ❌ KEIN generisches Blau (#3B82F6) als Akzent
- ❌ KEIN Indigo/Violett/Lila-zu-Blau-Gradient
- ❌ KEIN Inter/Roboto/Arial als Display-Font
- ❌ KEIN Standard-Hero (zentrierter Text + Gradient-BG + 2 Buttons)
- ❌ KEIN 3-Column-Feature-Grid mit Emoji-Icons als Standard
- ❌ KEIN Bento-Grid als Default-Pattern
- ❌ KEIN Footer mit 4 gleichen Spalten
- ❌ KEINE Phrasen wie "Streamline your workflow", "Built for modern teams"
- ❌ KEINE Inline-Kommentare wie `// CTA button` oder `// Hero section`

Vollständig: `~/.claude/design-rules.md`

---

## Was PFLICHT ist (Design-Rules)

- ✅ Editorial-Asymmetrie irgendwo brechen
- ✅ Mindestens 1 Layout-Element bricht das Grid
- ✅ Display + Body unterscheidbar (Syne vs DM Sans)
- ✅ 70/20/10 Farb-Dominanz strikt
- ✅ Mindestens 1 choreografierte Eingangs-Animation (staggered)
- ✅ Hover-States überraschen (kein simples opacity)
- ✅ Atmosphäre über Noise/Texture/Schatten (nicht flach)
- ✅ Mobile-First Responsive

---

## Code-Standards

```css
/* IMMER CSS Custom Properties im :root für Design-System */
:root {
  --color-bg: #0A0906;
  --color-accent: #FF4D00;
  --font-display: 'Syne', system-ui;
  --font-body: 'DM Sans', system-ui;
  --space-unit: 8px;
}
```

- Spacing: **immer** über Spacing-Unit (8px-Raster), keine Magic Numbers
- Responsive: echte Breakpoints, nicht nur `md:grid-cols-3`
- Komponenten kontext-frei (keine harten Page-Abhängigkeiten)
- TypeScript strict mode
- Server Components default, Client nur wenn nötig

---

## Sicherheit (Pflicht)

- Niemals Secrets im Code, immer Env-Vars
- Supabase RLS für alle Tabellen
- Stripe-Webhook-Signatur verifizieren
- Rate-Limiting auf API-Routes
- CSP-Header via Vercel-Config
- 2FA auf allen Service-Accounts

---

## DSGVO-Compliance (Selbst-Vorbild!)

Wir bauen ein DSGVO-Tool — unsere Seite muss 110% sauber sein.

- Supabase EU-Region (Frankfurt)
- AVVs mit allen Sub-Diensten unterschrieben (Vercel, Supabase, Stripe, Resend, PostHog)
- Eigene Datenschutzerklärung benennt jeden eingesetzten Dienst
- Eigenes Impressum nach §5 TMG
- Eigenes VVT führen
- Cookie-Banner / Plausible-Hinweis prominent
- Datenpannen-Reaktionsplan dokumentiert

---

## Pricing (AKTUELL LIVE)

- **Free:** AVV/VVT kostenlos mit Compliflow-Branding-Footer
- **Pro Single:** 29€ einmalig pro Dokument (AVV oder VVT separat) — LIVE via Stripe
- **Pro Agency:** 19€/Monat — Button geht zu mailto:hello@compliflow.de (NOCH NICHT BUCHBAR)
- Widerruf-Consent-Modal vor Checkout (§ 356 Abs. 5 BGB — gesetzlich Pflicht) ✅
- Stripe Price IDs: `STRIPE_PRICE_AVV_PRO` und `STRIPE_PRICE_VVT_PRO` (beide in Coolify setzen)

---

## Verlinkungen zur Vollplanung

- AVV-Detail-Plan: `~/vault/agency/business-center/12-avv-generator-launch-plan.md`
- Sommer-Roadmap: `~/vault/agency/business-center/13-strategie-sommer-2026.md`
- **500-Todo-Checkliste:** `~/vault/agency/business-center/avv-suite-checkliste.html`
- Brand-Identity: `~/vault/agency/intern/brand-identity.md`
- Design-Rules: `~/.claude/design-rules.md` (per Hook geladen)
- Web-ROI: `~/vault/agency/intern/web-roi-guidelines.md` (für Hagi-Shop relevant)

---

## Communication Style

- Deutsch, Bullet Points, klare Struktur
- Bei jedem technischen Begriff: 1-Satz-Erklärung in Klammern
- Bei Code-Änderung: erklären was passiert + wohin die Daten gehen
- Challenge rather than flatter — ehrliches Feedback
- Match the mode: Architektur = divergent, Build = linear
- Jede Antwort endet mit einem konkreten nächsten Schritt
