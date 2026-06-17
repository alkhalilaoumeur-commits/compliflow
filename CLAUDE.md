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

## Build-System — HARTE REGEL

**Niemals `output: "standalone"` permanent in `next.config.js` setzen.**

Warum: Permanenter Standalone-Output erzeugt nach jedem `npm run build` einen Standalone-Build im `.next/standalone/`. Wenn danach `npm run dev` läuft, mischen sich diese Production-Chunks mit den Dev-Hot-Reload-Chunks → der Webpack-Resolver findet plötzlich Module nicht mehr (z. B. `"Cannot find module './948.js'"`). Das ist das wiederkehrende "Frontend spinnt"-Problem.

**Korrekte Lösung (ist im Code):**

```js
// next.config.js
const useStandalone = process.env.BUILD_STANDALONE === "1";
const nextConfig = {
  ...(useStandalone ? { output: "standalone" } : {}),
  // ...
};
```

**Scripts in `package.json`:**

| Befehl | Zweck |
|---|---|
| `npm run dev` | Lokaler Dev-Server (mit `predev`-Cleanup gegen Reste alter Builds) |
| `npm run build` | Normaler Build (kompatibel mit Dev) |
| `npm run build:standalone` | Production-Build für Docker/Coolify (`BUILD_STANDALONE=1`) |
| `npm run clean` | Volles Reset von `.next` + Caches |

**Für Coolify-Deployment:** Build-Command auf `npm run build:standalone` setzen ODER Build-ENV `BUILD_STANDALONE=1` im Coolify-Service eintragen.

**Wenn das Frontend wieder spinnt:**

```bash
npm run clean && npm run dev
```

---

## Tech-Stack (Pflicht)

| Layer | Tool |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| DB | Waitlist: Double-Opt-In via HMAC-Token. Supabase optional (ANON-Key + RLS), Fallback: .data/waitlist-confirmed.jsonl |
| Auth | KEIN Login/Auth. Pro-Status = Stripe Session ID in localStorage (verify-session bei jedem Load). Keine Accounts. |
| Payment | Stripe Checkout Sessions + consent_collection (Widerrufsrecht §356 BGB). price_xxx IDs in ENV-Vars. |
| PDF-Gen | @react-pdf/renderer (client-side im Browser). KEINE server-side Generierung. |
| Email | Resend (hello@compliflow.de). 3 Typen: Zahlungsbestätigung, DOI-Bestätigung, DOI-Confirmed. |
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

## Pricing — STRATEGIE-PIVOT 2026-06-13

> ⚠️ **Pro-Tier verworfen.** Vollständige Begründung in `docs/MONETIZATION-STRATEGY.md` und
> `~/vault/agency/business-center/21-compliflow-monetarisierungs-strategie.md`.

**Aktuelles Modell ab Launch 17.06.2026:**
- **Alles 100% gratis** — kein Pro-Tier, kein Footer-Zwang, kein Branding-Lock
- AVV/VVT/Cookie-Banner ohne jede Paywall
- Monetarisierung kommt NICHT vom AVV-Tool, sondern aus:
  1. **Affiliate-Links** ab Monat 3-4 (Brevo, Hetzner, Borlabs etc.)
  2. **Premium-Generatoren** ab Monat 4-7 (AI-Act, HACCP, NIS2 — Nischen ohne Free-Konkurrenz, 29-99€)
  3. **Email-Liste** als Verkaufskanal für Premium-Tools + Cross-Promotion zu Rechnify

**Historischer Stand (verworfen):** ~~Pro Single 29€, Pro Agency 19€/M~~
- Stripe-Produkte deaktivieren, NICHT löschen (für Premium-Tools später wiederverwenden)
- Widerruf-Consent-Modal bleibt im Code (für Premium-Tools später)
- `verify-session` Route bleibt (für Premium-Tools später)

**Email-Liste (NEU — Pflicht vor Launch):**
- Brevo als Email-Marketing-Tool (EU-Server, DPA verfügbar, Free-Tier 300 Mails/Tag)
- Capture vor PDF-Download mit Double-Opt-In
- Getrennte Marketing-Einwilligung (separate Checkbox)
- Datenschutzerklärung muss Brevo + Supabase listen (Lücke aus Risiko-Analyse)

**Web-Embed (ZENTRALES Konzept, Update 2026-06-13):**
- ✅ Impressum-Generator hat bereits HTML-Copy-Paste-Export
- ⏳ Datenschutz-Generator MUSS gebaut werden (Spiegel zu Impressum, 6-8h Aufwand)
- ⏳ HTML-Exports brauchen Compliflow-Credit-Backlink (`<a href="https://compliflow.de?ref=embed-X">` am Ende) → SEO-Boost durch Backlink-Maschine
- 📅 Phase 2 (Monat 2-3): JS-Widget mit Auto-Update als Premium-Tier 7€/M — erster echter Cashflow-Pfad
- Details: `docs/WEB-EMBED-IMPLEMENTATION.md`

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
