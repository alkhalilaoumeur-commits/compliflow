# Compliflow

> DSGVO-Compliance-Tool-Suite für DACH-Selbstständige.

**Domain:** [compliflow.de](https://compliflow.de)
**Status:** Aktiv im Build · Launch Tool 1 am 17.06.2026
**Betreiber:** Al-Khalil Aoumeur (DRVN)

---

## Suite-Tools

| Pfad | Tool | Status | Launch |
|---|---|---|---|
| `/avv` | AVV-Generator (Art. 28 DSGVO) | In Build | 17.06.2026 |
| `/vvt` | Verarbeitungsverzeichnis | Geplant | 15.07.2026 |
| `/cookie-banner` | Cookie-CMP / Consent-Manager | Geplant | 19.08.2026 |

---

## Tech-Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **DB & Auth:** Supabase (EU-Region Frankfurt)
- **Payments:** Stripe (Live DACH, Stripe Tax aktiv)
- **PDFs:** React-PDF / Puppeteer (server-side)
- **Email:** Resend
- **Analytics:** Plausible (DSGVO-konform)
- **Heatmaps:** PostHog EU
- **Hosting:** Vercel

---

## Brand-Identity

Vollstaendige Guidelines: [`brand/BRAND.md`](./brand/BRAND.md)

- Farben: Espresso `#0A0906` + Vermillion `#FF4D00` + Cream `#F4EFE8`
- Display-Font: Syne · Body-Font: DM Sans · Mono: JetBrains Mono
- Tonalitaet: Duzen, professionell-technisch
- Logo-Konzept: Doppel-C / Channel (siehe `brand/`)

### Logo verwenden (React)

```tsx
import { Logo } from "@/components/brand/logo";

<Logo variant="lockup" size={40} />   // Mark + Wordmark
<Logo variant="mark" size={32} />     // nur Symbol
<Logo variant="wordmark" size={28} /> // nur Text
```

### Logo-Dateien (SVG)

- [`brand/logo-mark.svg`](./brand/logo-mark.svg) — Mark, `currentColor`-adaptiv
- [`brand/logo-mark-on-dark.svg`](./brand/logo-mark-on-dark.svg) — fuer dunklen BG
- [`brand/logo-mark-on-light.svg`](./brand/logo-mark-on-light.svg) — fuer hellen BG
- [`brand/logo-wordmark.svg`](./brand/logo-wordmark.svg) — nur "compliflow"
- [`brand/logo-lockup-on-dark.svg`](./brand/logo-lockup-on-dark.svg) — Mark+Wordmark dunkel
- [`brand/logo-lockup-on-light.svg`](./brand/logo-lockup-on-light.svg) — Mark+Wordmark hell
- [`brand/favicon.svg`](./brand/favicon.svg) — Favicon mit BG-Square
- [`app/icon.svg`](./app/icon.svg) — Next.js auto-Favicon
- [`app/apple-icon.svg`](./app/apple-icon.svg) — iOS Home-Screen-Icon

---

## Projekt-Dokumentation

Alles direkt im Projekt-Ordner (statt verstreut im Vault):

- [`docs/launch-plan.md`](./docs/launch-plan.md) — AVV-Plan + Finanz-Modell + Pricing
- [`docs/sommer-roadmap.md`](./docs/sommer-roadmap.md) — 8-Wochen-Roadmap Sommer 2026
- [`docs/master-checkliste.html`](./docs/master-checkliste.html) — 500-Todo-Checkliste (im Browser oeffnen)
- [`CLAUDE.md`](./CLAUDE.md) — Claude-Instruktionen fuer dieses Projekt

Vault-Versionen bleiben als Master erhalten und werden bei aenderungen weiter gepflegt.

---

## Sicherheits-Hinweis

Niemals committen:
- `.env.local`
- Stripe-Live-Keys
- Supabase-Service-Role-Keys
- DocuSign-Credentials

Alle Secrets in Vercel-Env-Vars oder lokal in `.env.local` (gitignored).
