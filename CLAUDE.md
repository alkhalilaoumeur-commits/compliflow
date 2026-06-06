# Compliflow — Claude-Instruktionen

> **Projekt:** DSGVO-Compliance-Tool-Suite für DACH-Markt
> **Domain:** compliflow.de
> **Status:** Build-Phase Tool 1 (AVV-Generator), Launch 17.06.2026

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
| DB | Supabase (EU-Region Frankfurt) |
| Auth | Supabase Auth (Magic-Link, kein Passwort) |
| Storage | Supabase Storage für PDFs |
| Payment | Stripe (Live, Stripe Tax aktiviert) |
| PDF-Gen | React-PDF oder Puppeteer (server-side) |
| Email | Resend (verifizierte Domain) |
| Analytics | Plausible (DSGVO-konform aus Prinzip — wir sind DSGVO-Tool!) |
| Heatmaps | PostHog EU |
| Hosting | Vercel |
| Error-Tracking | Sentry oder Vercel-Logs |

---

## Brand-Identity (Pflicht)

Quelle: `~/vault/agency/intern/brand-identity.md` + `~/.claude/design-rules.md`

### Farben

```css
--color-bg: #0A0906;        /* Espresso, dominant 70% */
--color-bg-soft: #14110D;
--color-bg-card: #1A1612;
--color-ink: #F4EFE8;       /* Hell-creme, 20% */
--color-ink-dim: #A89F92;
--color-accent: #FF4D00;    /* Vermillion, 10% scharf */
--color-line: #2A241D;
```

### Typografie

- **Display:** Syne (700/800) — für Headlines
- **Body:** DM Sans (400/500) — für Text
- **Mono (Code/Daten):** JetBrains Mono

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

## Pricing (Tool 1 — AVV)

- **Free:** AVV mit "Powered by Compliflow"-Footer + Email-Capture
- **Pro Single:** 29€ One-Time (Custom-Branding, kein Footer)
- **Pro Agency:** 19€/Monat (DocuSign + Multi-AVV-Mgmt)
- **Launch-Discount:** 19€ Early Bird in Woche 1
- **Bundle:** 49€ (AVV+VVT) ab 15.07.; 99€ Lifetime (alle 3) ab 19.08.

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
