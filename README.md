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

Siehe `CLAUDE.md` und `~/vault/agency/intern/brand-identity.md`.

- Farben: Espresso `#0A0906` + Vermillion `#FF4D00`
- Display-Font: Syne
- Body-Font: DM Sans
- Tonalität: Duzen, professionell-technisch

---

## Planung

- `~/vault/agency/business-center/12-avv-generator-launch-plan.md` — AVV-Plan + Finanz-Modell
- `~/vault/agency/business-center/13-strategie-sommer-2026.md` — 8-Wochen-Roadmap
- `~/vault/agency/business-center/avv-suite-checkliste.html` — 500-Todo-Checkliste

---

## Sicherheits-Hinweis

Niemals committen:
- `.env.local`
- Stripe-Live-Keys
- Supabase-Service-Role-Keys
- DocuSign-Credentials

Alle Secrets in Vercel-Env-Vars oder lokal in `.env.local` (gitignored).
