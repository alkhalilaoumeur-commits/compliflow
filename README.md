# Compliflow

> Kostenlose DSGVO-Compliance-Tools für DACH-Selbstständige und Agenturen.

**Domain:** [compliflow.de](https://compliflow.de)  
**Status:** Production Ready — Launch 17.06.2026  
**Betreiber:** Al-Khalil Aoumeur

---

## Tools

| Pfad | Tool | Status |
|---|---|---|
| `/avv` | AVV-Generator nach Art. 28 DSGVO | **Live** |
| `/vvt` | Verarbeitungsverzeichnis nach Art. 30 DSGVO | **Live** |
| `/cookie-banner` | Cookie-CMP / Consent-Manager | Geplant August 2026 |

---

## Tech-Stack (tatsächlich implementiert)

- **Framework:** Next.js 14 (App Router) + TypeScript — `output: standalone`
- **Styling:** Tailwind CSS mit CSS Custom Properties (cream theme, grüner Akzent)
- **PDF:** `@react-pdf/renderer` — vollständig client-side im Browser, KEIN Server-Side
- **Auth:** KEINE Login-Pflicht. Pro-Status via Stripe Session ID in localStorage
- **Payment:** Stripe Checkout Sessions (redirect-based), `payment_method_types: ["card"]`
- **Email:** Resend — Zahlungsbestätigung + Waitlist-Notification
- **Analytics:** Plausible (cookie-free, DSGVO-konform)
- **Hosting:** Hetzner VPS + Coolify + Traefik (Port 3000)
- **Docker:** Multi-Stage Build, non-root user, HEALTHCHECK via wget

---

## Design

- **Hintergrund:** Cream `#f6f2ea` (kein Dark-Theme!)
- **Akzent:** Dunkelgrün `#1F3D2F` (DSGVO-Vertrauensfarbe)
- **Display-Font:** Fraunces (serif, editorial)
- **Body-Font:** DM Sans
- **Mono-Font:** JetBrains Mono (für Labels, Tags, Chips)

---

## ENV-Variablen (für Coolify)

```env
# Stripe (Server-Side-Redirect — Publishable Key wird NICHT benötigt)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_AVV_PRO=price_xxx
STRIPE_PRICE_VVT_PRO=price_xxx
# Email
RESEND_API_KEY=re_xxx
# App (KRITISCH: Stripe success_url nutzt diesen Wert)
NEXT_PUBLIC_APP_URL=https://compliflow.de
```

---

## Sicherheit

- Content-Security-Policy: `default-src 'self'`, keine wildcards
- X-Frame-Options: DENY (kein Clickjacking)
- HSTS: 1 Jahr + includeSubDomains
- Stripe Webhook: Signatur-Verifikation via `stripe.webhooks.constructEvent`
- Rate-Limiting: 5 Checkout-Requests/min/IP (in-memory, MVP-tauglich)
- Stripe Pro-Verifikation: Server-seitig via `/api/stripe/verify-session` (kein Client-Trust)

---

## Deployment

Schritt-für-Schritt Anleitung in [`docs/DEPLOY-JETZT.md`](./docs/DEPLOY-JETZT.md).

---

## Dokumentation

- [`docs/DEPLOY-JETZT.md`](./docs/DEPLOY-JETZT.md) — Coolify + Stripe + Resend Setup
- [`docs/launch-plan.md`](./docs/launch-plan.md) — Finanz-Modell + Marketing-Plan
- [`CLAUDE.md`](./CLAUDE.md) — Projekt-Kontext für Claude Code Sessions
- [`.env.example`](./.env.example) — Alle ENV-Variablen mit Beschreibung

---

## Sicherheits-Hinweis

Nicht committen: `.env.local`, Stripe-Live-Keys, Resend-Keys.  
Alle Secrets gehören in Coolify-Env-Vars (Production) oder `.env.local` (lokal, gitignored).
