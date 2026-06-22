# APP-AUDIT-CONTEXT — Compliflow

> Technische Bestandsaufnahme für Sicherheits-Audit. Erstellt am 2026-06-18 durch Code-Recherche (nicht Doku-Übernahme).
> Sachlich, ungeschönt. Befunde mit Dateipfaden belegt. Wo etwas fehlt: explizit "NICHT VORHANDEN" / "UNKLAR".

---

## 1. ZWECK & KONTEXT

- **Was:** Eine Suite von 7 clientseitigen Generatoren für deutsche/DSGVO-Rechtsdokumente: AVV (Auftragsverarbeitungsvertrag), VVT (Verarbeitungsverzeichnis), Impressum, Datenschutzerklärung, Widerrufsbelehrung, AGB, Cookie-Banner. Nutzer füllt einen mehrstufigen Wizard aus, das Dokument wird **komplett im Browser** generiert (PDF via `@react-pdf/renderer`, oder HTML-Copy-Paste-Export). Alles gratis; einziges Bezahl-Feature: „Compliflow-Credit entfernen" für 0,99 € (Stripe).
- **Zielgruppe:** Solo-Unternehmer, kleine Firmen, Freelancer im DACH-Raum ohne Rechtsabteilung.
- **Multi-tenant?** NEIN. Single-tenant im strengen Sinn: Es gibt **keine Nutzerkonten und keine serverseitige Nutzer-Datentrennung**. Jeder Nutzer hält seine Wizard-Daten ausschließlich im eigenen Browser-`localStorage` (zustand `persist`). Server speichert von Nutzern praktisch nichts — Ausnahme: bestätigte Waitlist-Emails (Supabase-Tabelle oder lokale Datei). Eine Mandantentrennung existiert daher gar nicht, weil es keine serverseitig gehaltenen Nutzerdaten gibt.
- **Geschäftskritisch:**
  - **Geld:** Stripe-Checkout für 0,99 € Watermark-Removal. Sehr geringes Volumen/Betrag; finanzielles Risiko pro Vorfall gering.
  - **Sensible Daten:** Die Wizard-Eingaben enthalten personenbezogene/firmenbezogene Daten (Namen, Adressen, Geschäftsführer, Steuernummern, Verarbeitungstätigkeiten). Diese verlassen den Browser **nicht** (keine Server-Speicherung) — das ist das zentrale Design-Versprechen und gleichzeitig der größte Vertrauensfaktor. Waitlist-/Newsletter-Emails sind personenbezogen und werden an Dritte (Supabase, Brevo, Resend) übermittelt.
  - **Verfügbarkeit:** Marketing-/SEO-Seite. Ausfall = Umsatzverlust durch entgangene Leads, kein Datenverlust (Daten liegen beim Nutzer).

---

## 2. TECH-STACK

| Layer | Konkret | Version (aus `package.json`) |
|---|---|---|
| Framework | Next.js (App Router) | **14.2.35** |
| Runtime | React / React-DOM | 18.3.1 |
| Sprache | TypeScript | ^5 (`strict` siehe `tsconfig.json`) |
| Node | engines | `>=20.0.0` |
| Styling | Tailwind CSS | ^3.4.15 (+ `clsx`, `tailwind-merge`) |
| State | zustand (+ `persist` → localStorage) | ^5.0.14 |
| Forms / Validierung | react-hook-form ^7.77, @hookform/resolvers ^5.4, **zod ^4.4.3** | |
| PDF-Generierung | @react-pdf/renderer (**clientseitig**) | ^4.5.1 |
| Payment | **Stripe** (`stripe` SDK), API-Version `2026-05-27.dahlia` | ^22.2.0 |
| Transaktions-Email | **Resend** (`hello@compliflow.de`) | ^6.12.4 |
| Marketing-Email | **Brevo** (eigener fetch-Client, kein SDK) — `lib/brevo/client.ts` | REST v3 |
| DB (optional) | **Supabase** via REST (`fetch`, kein SDK), nur Waitlist | — |
| DB-Fallback | lokale Datei `.data/waitlist-confirmed.jsonl` | — |
| Analytics | Plausible (`plausible.io/js/script.js`, `data-domain="compliflow.de"`, hardcoded in `app/layout.tsx:209`) | — |
| Icons | lucide-react | ^1.17.0 |
| Hosting | Hetzner VPS (178.104.147.61) + Coolify + Traefik. **Kein Vercel** (laut CLAUDE.md; `.vercel`-Ordner existiert aber im Repo) | — |
| Container | Dockerfile vorhanden, `output: standalone` nur via `BUILD_STANDALONE=1` | — |
| **Cron / Scheduler** | **NICHT VORHANDEN** — keine Cron-Jobs, kein Scheduler, keine wiederkehrenden Tasks im Code | — |
| **ORM** | **NICHT VORHANDEN** — kein ORM. Supabase wird über rohe REST-`fetch`-Calls angesprochen | — |
| **Auth-Library** | **NICHT VORHANDEN** — kein NextAuth/Clerk/Lucia o.ä., bewusst kein Login | — |

Weitere externe APIs: keine über Stripe/Resend/Brevo/Supabase/Plausible hinaus. DocuSign/PostHog sind in `.env.example` nur als „Phase 2 — noch nicht aktiv" auskommentiert.

---

## 3. KOMPLETTE ROUTEN- & ACTION-MAP

**API-Routen (5)** — alle unter `app/api/`. **Server-Actions (1)** — `app/actions/`.

| Pfad / Name | Methode | Public/Auth | Rolle | Was es tut | Externe Dienste |
|---|---|---|---|---|---|
| `app/api/stripe/checkout/route.ts` | POST | **Public** | keine | Erstellt Stripe-Checkout-Session für 0,99 € Watermark-Removal. Validiert `docType` gegen Whitelist, sanitisiert `returnPath` (Open-Redirect-Schutz), In-Memory-Rate-Limit 5/min/IP. In Prod ohne Keys → 503; in Dev → Mock-URL mit `mock=true`. | Stripe |
| `app/api/stripe/webhook/route.ts` | POST | **Public** (Stripe-signiert) | keine | Empfängt Stripe-Webhooks. Verifiziert Signatur via `constructEvent()`. Bei `checkout.session.completed` + `metadata.tool` (avv/vvt) → Zahlungsbestätigungs-Mail. In Prod ohne Keys → 500. | Stripe, Resend |
| `app/api/stripe/verify-session/route.ts` | GET | **Public** | keine | Prüft serverseitig via `stripe.checkout.sessions.retrieve()` ob eine Session bezahlt ist (Watermark- oder Legacy-Pro). Rate-Limit 20/min/IP. **⚠️ Wird im gesamten Frontend NICHT aufgerufen** (siehe §6/§8). | Stripe |
| `app/api/waitlist/confirm/route.ts` | GET | **Public** (HMAC-Token) | keine | Double-Opt-In-Bestätigung der Waitlist. Verifiziert HMAC-SHA256-Token (timing-safe), Email-Regex, Source-Whitelist. Schreibt `confirmed=true` nach Supabase (REST, Timeout 5s) **oder** in lokale `.jsonl`-Datei. Schickt Owner-Notification + Confirmed-Mail. | Supabase, Resend |
| `app/api/brevo/subscribe/route.ts` | POST | **Public** | keine | Trägt Email in Brevo-DOI-Liste ein. Rate-Limit 5/min/IP, Email-Check, `consent===true` Pflicht (UWG §7), `quelle`-Whitelist. Ohne `BREVO_API_KEY` → Mock-Antwort. | Brevo |
| `app/actions/waitlist.ts` → `joinWaitlist(formData)` | Server Action | **Public** | keine | Nimmt Email + Source entgegen, baut HMAC-DOI-Token, schickt DOI-Bestätigungsmail. Rate-Limit 1 Mail / 10 min / Email. Speichert **nichts** (Speicherung erst beim Confirm). | Resend |

Keine weiteren Server-Actions im Code (`grep "use server"` → nur `app/actions/waitlist.ts`).

**Seiten-Routen (18 `page.tsx`)** — alle rein public, statisch/clientseitig, ohne Server-Datenzugriff:
`/`, `/avv`, `/vvt`, `/impressum-generator`, `/datenschutz-generator`, `/widerrufsbelehrung-generator`, `/agb-generator`, `/cookie-banner-generator`, `/preise`, `/blog`, `/blog/[slug]`, `/impressum`, `/datenschutz`, `/agb`, `/widerruf`, `/cookie-banner` (Info-Seite), `/waitlist/confirmed`, `/waitlist/invalid`.

---

## 4. USER-WORKFLOW-MAP

### Public (alle Besucher — es gibt nur diese Ebene)

**Landing & Marketing**
- `/` Suite-Landing: Waitlist-Form (`components/waitlist-form.tsx`) → Server-Action `joinWaitlist` → DOI-Mail. Exit-Popup (`components/exit-popup.tsx`), Countdown, Tools-Dropdown, Mobile-Nav.
- `/preise`, `/blog`, `/blog/[slug]`: rein statisch/SEO.
- Rechts-Seiten `/impressum`, `/datenschutz`, `/agb`, `/widerruf`, `/cookie-banner`: statischer Pflicht-Content.

**Generator-Workflow (identisches Muster für alle 7 Tools)**
- Seiten: `/avv`, `/vvt`, `/impressum-generator`, `/datenschutz-generator`, `/widerrufsbelehrung-generator`, `/agb-generator`, `/cookie-banner-generator`.
- Mehrstufiger Wizard (`components/<tool>/wizard-shell.tsx` + `steps/`). Jede Eingabe schreibt in zustand-Store mit `persist` → **localStorage** (Keys z.B. `compliflow-avv-v1`). Kein Netzwerk-Call beim Ausfüllen.
- **Abschluss / Review-Step:**
  - AVV/VVT: PDF-Download-Button (`components/avv/pdf-download.tsx`, `components/vvt/pdf-download.tsx`) → PDF wird im Browser via `@react-pdf/renderer` erzeugt. Plausible-Event „PDF Downloaded".
  - Impressum/Datenschutz/AGB/Widerruf/Cookie-Banner: HTML-/Snippet-Export (`components/<tool>/html-export.tsx` / `snippet-export.tsx`) zum Copy-Paste, mit/ohne Credit-Backlink je nach Watermark-Kauf.
- **Watermark entfernen (Bezahl-Flow):** `components/watermark/remove-button.tsx` → POST `/api/stripe/checkout` → Stripe-Checkout → Redirect zurück mit `?watermark_removed=true&session_id=...&doc_type=...` → Button setzt localStorage-Flag (`compliflow-watermark-v1`).

**Email-Capture**
- `components/email-capture/capture-card.tsx` → POST `/api/brevo/subscribe` (Brevo-DOI).
- Waitlist-Form → Server-Action → `/api/waitlist/confirm?...token` (Klick in Mail) → Redirect `/waitlist/confirmed` oder `/waitlist/invalid`.

### Eingeloggter Nutzer
**NICHT VORHANDEN** — es gibt keinen Login.

### Admin
**NICHT VORHANDEN** — kein Admin-Bereich, keine Admin-Routen, keine Rollen. Der einzige „Admin-Kanal" ist die Owner-Email (`alkhalilaoumeur@gmail.com`, hardcoded in `lib/email.ts:4`), die Waitlist-Benachrichtigungen empfängt.

### System-Events (automatisch)
- **Stripe-Webhook** `checkout.session.completed` → `/api/stripe/webhook` → ggf. Resend-Zahlungsmail (nur für Legacy `metadata.tool` avv/vvt; Watermark-Käufe lösen **keine** Mail aus, siehe §8).
- **Email-Trigger:** DOI-Mail (Anmeldung), Owner-Notification + Confirmed-Mail (nach DOI-Klick), Zahlungsbestätigung (Webhook).
- **Cron:** keiner.

---

## 5. DATENMODELL

**Es gibt kein klassisches serverseitiges Datenmodell.** Zwei Speicherorte existieren:

### 5a. Serverseitig: Supabase-Tabelle `waitlist` (optional, nur wenn ENV gesetzt)
Quelle: `docs/supabase-schema.sql`.

| Feld | Typ | Sensibel? |
|---|---|---|
| `id` | bigserial PK | nein |
| `email` | text NOT NULL, UNIQUE | **JA — personenbezogen** |
| `source` | text DEFAULT 'coming-soon' | nein |
| `confirmed` | boolean DEFAULT false | nein |
| `confirmed_at` | timestamptz | nein |
| `created_at` | timestamptz DEFAULT now() | nein |

RLS aktiv. Policies: `anon` darf INSERT + UPDATE (UPDATE nur `confirmed=true`, kein Downgrade), **kein** SELECT/DELETE für anon; nur `authenticated` (Dashboard/Service-Role) darf lesen.
**Fallback ohne Supabase:** Datei `.data/waitlist-confirmed.jsonl` (`{email, source, confirmed_at}` pro Zeile) — liegt im Container-Filesystem, **nicht persistent über Container-Neustart/Redeploy** (siehe §11).

### 5b. Clientseitig: localStorage (zustand persist) — der eigentliche „Datenbestand"
Alle Wizard-Eingaben. Jeder Store in `lib/<tool>/store.ts`. Enthält **stark personenbezogene/firmenbezogene Daten**:

| Store / localStorage-Key | Inhalt (sensibel markiert) |
|---|---|
| `compliflow-avv-v1` (`lib/avv/store.ts`) | Auftraggeber/-nehmer **(Firma, Anschrift, Vertreter, Land)**, Verarbeitungsarten, **Datenkategorien**, **Personenkategorien**, TOMs, Subverarbeiter, Abschlussdatum/-ort |
| `compliflow-vvt-...` (`lib/vvt/store.ts`) | Unternehmensdaten, Verarbeitungstätigkeiten **(personenbezogen)** |
| `compliflow-impressum-...` | **Name, Anschrift, Kontakt, Register-/Steuernummer, Vertretungsberechtigte** |
| `compliflow-datenschutz-...` | Verantwortlicher, eingesetzte Dienste, **Kontaktdaten** |
| `compliflow-widerruf-...`, `compliflow-agb-...`, `compliflow-cookie-banner-...` | Anbieterdaten, Konditionen |
| `compliflow-watermark-v1` (`lib/watermark/store.ts`) | Pro DocType: `{sessionId, paidAt}` — Kauf-Flag |

**Mandantentrennung:** entfällt — Daten sind pro Browser isoliert (localStorage-Origin-Scoping des Browsers, kein serverseitiger Mechanismus). Zwischen verschiedenen Nutzern gibt es serverseitig nichts zu trennen, weil serverseitig nichts gespeichert wird (außer der einzelnen Waitlist-Email-Tabelle ohne Nutzerbezug).

---

## 6. AUTH & BERECHTIGUNGEN

- **Sessions/Tokens:** Es gibt **keine Auth-Session, keine Login-Cookies, keine JWTs**. Kein `middleware.ts` vorhanden.
- Zwei tokenartige Mechanismen existieren, beide **nicht** für Login:
  1. **HMAC-DOI-Token** (Waitlist): stateless, `HMAC-SHA256(email:source, DOI_SECRET)`. Erzeugt in `app/actions/waitlist.ts:30` (`buildDoiToken`), verifiziert timing-safe in `app/api/waitlist/confirm/route.ts:10` (`verifyDoiToken`).
  2. **Stripe Session-ID** (Watermark-Kauf): wird im localStorage gehalten, **nicht** als Auth-Token serverseitig validiert.
- **Rollen/Berechtigungsstufen:** KEINE. Es gibt keine Rollen, keine geschützten Routen, keinen Auth-Check. Alle API-Routen sind public.
- **Zentraler Auth-Check:** **NICHT VORHANDEN.** Der einzige kryptografische Zugriffs-Check ist die DOI-Token-Verifikation:

```ts
// app/api/waitlist/confirm/route.ts:10
function verifyDoiToken(email: string, source: string, token: string): boolean {
  const secret = process.env.DOI_SECRET ?? (process.env.NODE_ENV === "production" ? null : "dev-only-fallback");
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(`${email}:${source}`).digest("hex");
  if (expected.length !== token.length) return false;     // timing-safe Vergleich
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}
```

- **Pro-/Bezahl-„Berechtigung":** rein clientseitig über `lib/watermark/store.ts` (localStorage). `remove-button.tsx:45-58` setzt das Kauf-Flag, sobald die URL `watermark_removed=true` + `session_id` (irgendein Wert) trägt — **ohne** Aufruf von `/api/stripe/verify-session`. Die serverseitige Verifikationsroute existiert, wird aber im gesamten Frontend nirgends verwendet (`grep "verify-session"` → nur Definition + Doku). → **Trivial umgehbar** (siehe §8/§11).
- **Cookie-Konfiguration:** Die App setzt **selbst keine Cookies** (kein `Set-Cookie`, keine Session-Cookies). Daher keine `httpOnly`/`secure`/`sameSite`-Einstellungen vorhanden — **NICHT ZUTREFFEND mangels eigener Cookies**. Plausible ist cookie-los.

---

## 7. EXTERNE INTEGRATIONEN & SECRETS

### Stripe
- Init: in jeder Route lokal `new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-05-27.dahlia" })` (`checkout`, `webhook`, `verify-session`).
- Webhook-Event: `checkout.session.completed`, verarbeitet in `app/api/stripe/webhook/route.ts:36`. Signatur via `constructEvent()`.
- ENV: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_WATERMARK_REMOVAL` (**im Code genutzt, aber in `.env.example` NICHT dokumentiert — Doku-Lücke**), Legacy `STRIPE_PRICE_AVV_PRO`/`STRIPE_PRICE_VVT_PRO` (in `.env.example`, im Code nicht mehr referenziert).
- Fehlt Key: Prod → 503/500; Dev → Mock-Modus.

### Resend (Transaktions-Email)
- Init: `lib/email.ts:6` `getResend()` → `null` wenn `RESEND_API_KEY` fehlt (dann werden Mails still übersprungen).
- ENV: `RESEND_API_KEY`. Absender `hello@compliflow.de`, Owner-Empfänger hardcoded `alkhalilaoumeur@gmail.com`.
- Fehlt Key: alle Mail-Funktionen sind No-Ops (kein Fehler).

### Brevo (Marketing-Email)
- Init: `lib/brevo/client.ts:34` `brevoSubscribeDoi`, roher `fetch` gegen `https://api.brevo.com/v3/contacts/doubleOptinConfirmation`.
- ENV: `BREVO_API_KEY`, `BREVO_LIST_ID` (Default 1), `BREVO_DOI_TEMPLATE_ID` (Default 1). **`BREVO_*` in `.env.example` NICHT dokumentiert — Doku-Lücke.**
- Fehlt Key: `/api/brevo/subscribe` antwortet im Mock-Modus mit `ok:true, mock:true`.

### Supabase (Waitlist)
- Init: kein SDK; roher `fetch` in `app/api/waitlist/confirm/route.ts:49` (REST `/rest/v1/waitlist`, `Prefer: resolution=merge-duplicates`, Timeout 5s).
- ENV: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (nur Anon-Key, RLS-geschützt).
- Fehlt: Fallback auf `.data/waitlist-confirmed.jsonl`.

### Plausible
- Script hardcoded `app/layout.tsx:209` (`data-domain="compliflow.de"`). ENV `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` existiert, wird laut `.env.example` aber nicht real genutzt.

### Vollständige ENV-Liste (nur Namen)
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_WATERMARK_REMOVAL`, `STRIPE_PRICE_AVV_PRO`, `STRIPE_PRICE_VVT_PRO`, `RESEND_API_KEY`, `BREVO_API_KEY`, `BREVO_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `DOI_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

**Verhalten bei fehlender Variable:**
- `DOI_SECRET` fehlt in Prod → `joinWaitlist` wirft (`app/actions/waitlist.ts:32`); Confirm schlägt fehl (`verifyDoiToken` → false). In Dev: unsicherer Fallback `"dev-only-fallback"`.
- `STRIPE_*` fehlt in Prod → Checkout 503, Webhook 500. Dev → Mock.
- `RESEND_API_KEY` fehlt → Mails werden still übersprungen (kein Fehler, **stille Degradierung**).
- `BREVO_API_KEY` fehlt → Mock-Antwort.
- Supabase-ENV fehlt → Datei-Fallback.
- `NEXT_PUBLIC_APP_URL` fehlt → Default `https://compliflow.de` (bzw. `http://localhost:3000` im Checkout).

---

## 8. GELD-/ZAHLUNGSFLUSS

Produkt: **Watermark-Removal, 0,99 € einmalig pro DocType.** (Altes 29 €-Pro-Tier verworfen; Code teils noch als „Legacy" vorhanden.)

**Pfad Schritt für Schritt:**
1. Nutzer klickt „Für 0,99 € entfernen" im Review-Step → `components/watermark/remove-button.tsx:63` `startCheckout()`.
2. POST `/api/stripe/checkout` mit `{docType, returnPath}`. Rate-Limit 5/min/IP. `docType`-Whitelist + `returnPath`-Sanitizing (`sanitizeReturnPath`, Open-Redirect-Schutz).
3. Route erstellt `stripe.checkout.sessions.create({ mode:"payment", line_items:[{price: STRIPE_PRICE_WATERMARK_REMOVAL}], consent_collection:{terms_of_service:"required"}, metadata:{product:"watermark_removal", doc_type} })` (`checkout/route.ts:87`). `success_url` enthält `watermark_removed=true&session_id={CHECKOUT_SESSION_ID}&doc_type=...`.
4. Nutzer zahlt bei Stripe.
5. Stripe redirectet zur `success_url`. `remove-button.tsx:37-61` liest die URL-Parameter und setzt **clientseitig** das Kauf-Flag im localStorage.
6. Parallel: Stripe ruft `/api/stripe/webhook` mit `checkout.session.completed` auf. Signatur wird verifiziert. **Aber:** der Webhook-Handler reagiert nur auf `metadata.tool` (avv/vvt = Legacy), **nicht** auf `metadata.product==="watermark_removal"`. → **Für Watermark-Käufe passiert serverseitig nichts** (keine Mail, keine Speicherung, keine Quittung).

**Idempotenz:** KEINE. Der Webhook hat keinen Idempotenz-/Dedup-Mechanismus (kein `idempotency_key`, keine Event-ID-Speicherung). Da er aber nur eine Mail verschickt und Watermark-Events ignoriert, ist das Risiko aktuell gering.

**Rückerstattungen:** NICHT VORHANDEN — kein `charge.refunded`/`refund`-Handling im Code.

**Fehlerfälle:**
- Prod ohne Stripe-Keys: Checkout → 503, Webhook → 500 (kein stiller Fake-Erfolg mehr; war früher Lücke #3, gefixt).
- **Kernschwäche (akzeptiertes Restrisiko laut `SECURITY-TODO.md` #4):** Die Pro-Freischaltung ist rein clientseitig und vertraut den URL-Parametern. Ein Nutzer kann durch manuelles Aufrufen von `…?watermark_removed=true&session_id=x&doc_type=avv` das Flag ohne Zahlung setzen. `/api/stripe/verify-session` würde das serverseitig prüfen, **wird aber nirgends aufgerufen**. Ökonomisch irrelevant (0,99 €), sicherheitstechnisch ein echtes, dokumentiertes Bypass.
- **Funktions-Bug:** Watermark-Kauf wirkt nur in den HTML-Export-Tools (Impressum/Datenschutz/AGB/Widerruf/Cookie-Banner über `isBought`-Flag, z.B. `components/impressum/html-export.tsx:12`). Für **AVV und VVT** ist der Credit im PDF **hardcoded** (`lib/avv/pdf/avv-document.tsx:496,630`) und `WatermarkRemoveButton` ist in deren Review-Steps **gar nicht eingebunden**. → Ein AVV/VVT-Watermark-Kauf würde nichts entfernen. (Aktuell kein realer Schaden, da der Button dort fehlt — aber inkonsistent.)

---

## 9. STATE / LEBENSZYKLUS

Es gibt keine serverseitigen Entitäten mit Status-Maschine. Die relevanten Lebenszyklen:

**Waitlist-Eintrag**
- Zustände: `(nicht existent)` → `angemeldet, unbestätigt` (DOI-Mail raus, **nichts gespeichert**) → `confirmed=true` (nach DOI-Klick gespeichert).
- Übergang erzwungen durch: HMAC-Token-Verifikation in `/api/waitlist/confirm`. Ohne gültiges Token kein `confirmed`. Supabase-RLS verhindert Downgrade (`confirmed` darf via anon nur auf `true`).

**Watermark-Kauf (pro DocType)**
- Zustände: `not bought` → `bought` (`lib/watermark/store.ts`, localStorage).
- Übergang: gesetzt in `remove-button.tsx` aus URL-Param. **Nicht serverseitig erzwungen** (siehe §8). Reset via `reset()` möglich.

**Wizard-Fortschritt (pro Tool)**
- `currentStep` durchläuft `WIZARD_STEPS` (z.B. `lib/avv/store.ts`). `goNext`/`goPrev` begrenzen auf gültige Indizes. PDF-Download erst bei Vollständigkeit (`getCompletionStatus`, `components/avv/pdf-download.tsx:44`). Reiner Client-State, kein Server-Erzwingen.

**Order / Abo / Account:** NICHT VORHANDEN (keine Bestellungen, keine Abos, keine Accounts).

---

## 10. AKTUELLER TEST-STAND

- **Automatisierte Tests: NICHT VORHANDEN.** Keine `*.test.*` / `*.spec.*`, keine `__tests__/`/`tests/`-Verzeichnisse, kein Test-Runner (kein Jest/Vitest/Playwright in `package.json`). `npm run lint` (Next-Lint) ist die einzige automatisierte Prüfung.
- **Ohne jeden Test (= alle kritischen Pfade ungetestet):**
  - Stripe-Webhook-Signaturprüfung & Event-Handling.
  - Checkout-Erstellung, `returnPath`-Sanitizing, Rate-Limiting.
  - DOI-Token Erzeugung/Verifikation (HMAC, timing-safe) — sicherheitskritisch, kein Test.
  - Supabase-Upsert vs. Datei-Fallback.
  - PDF-/HTML-Generierung der 7 Generatoren.
  - Watermark-Flag-Logik.
- Manuelle Verifikation ist dokumentiert (`docs/PRE-LAUNCH-VERIFICATION-PLAYBOOK.md`), ersetzt aber keine automatisierten Tests.

---

## 11. BEKANNTE PROBLEME & RISIKEN

Quelle: `SECURITY-TODO.md` (Audit 2026-06-13, Fixes 2026-06-17) + eigene Code-Befunde.

**Gefixt (verifiziert im Code):**
- Webhook akzeptiert in Prod keine ungeprüften Requests mehr (500 ohne Keys, 400 ohne Signatur).
- Checkout-Mock nur noch in Dev (Prod → 503).
- Supabase-Fetch hat `AbortSignal.timeout(5000)`.

**Offen / fragil:**
1. **Pro-Status clientseitig umgehbar** (akzeptiertes Restrisiko #4): `verify-session` existiert, wird nie aufgerufen; `remove-button.tsx` vertraut URL-Params. Bypass ohne Zahlung möglich.
2. **Watermark-Feature inkonsistent verdrahtet:** wirkt nur bei HTML-Export-Tools; AVV/VVT-PDF-Credit ist hardcoded und der Button fehlt dort (`lib/avv/pdf/avv-document.tsx`). Funktionaler Defekt, falls dort je verkauft wird.
3. **In-Memory-Rate-Limiting** (`Map`) in checkout/verify/brevo/waitlist: überlebt keinen Container-Restart, wirkt nicht über mehrere Instanzen. Aktuell 1 Container → akzeptiert (#7).
4. **Datei-Fallback `.data/waitlist-confirmed.jsonl`** ist im Container nicht persistent (Redeploy → weg). Ohne konfiguriertes Supabase gehen bestätigte Waitlist-Emails bei jedem Deploy verloren. Schreibfehler werden **still verschluckt** (`confirm/route.ts:71`).
5. **`DOI_SECRET` Dev-Fallback** `"dev-only-fallback"`: in Dev werden Tokens mit bekanntem Secret signiert. In Prod korrekt abgesichert (wirft/false), aber der Fallback ist eine Fußangel falls `NODE_ENV` falsch gesetzt ist.
6. **Doku-Lücken `.env.example`:** `STRIPE_PRICE_WATERMARK_REMOVAL` und alle `BREVO_*` werden im Code genutzt, fehlen aber in `.env.example` → Risiko, dass sie beim Deploy vergessen werden (→ stiller Mock/Degraded-Mode).
7. **Stille Degradierung bei fehlendem `RESEND_API_KEY`:** Mails werden no-op übersprungen, ohne Alarm. Eine fehlende Konfiguration fällt erst auf, wenn Mails ausbleiben.
8. **Webhook ohne Idempotenz** (siehe §8) — derzeit risikoarm, aber latent.
9. **Restliche Advisories** (#5): Next.js Image-DoS `GHSA-h64f-5h5j-jqjh`, postcss XSS — als nicht zutreffend bewertet, nicht gepatcht.
10. **Code-Hygiene:** drei `eslint-disable @typescript-eslint/no-explicit-any` (`lib/avv/store.ts:62`, `lib/vvt/store.ts:159,179`, `components/avv/pdf-download.tsx:21`). Keine `TODO/FIXME/HACK`-Marker im Quellcode gefunden.
11. **`.vercel`-Verzeichnis im Repo**, obwohl Hosting laut CLAUDE.md ausdrücklich Hetzner/Coolify ist — potenziell verwaiste/irreführende Konfiguration. UNKLAR ob aktiv.

---

## 12. FEHLERBEHANDLUNG & LOGGING

- **API-Handler:** durchgängig `try/catch` mit generischen Fehlermeldungen an den Client. Keine Stack-Traces oder interne Details im Response-Body.
  - Checkout: `catch → { error: "Checkout fehlgeschlagen" }, 500` (`checkout/route.ts:116`).
  - Webhook: Signaturfehler → `{ error: "Webhook signature failed" }, 400` (generisch, kein Detail).
  - verify-session: Fehler → `{ valid:false }, 400` (kein Detail).
  - Brevo: Brevo-Fehlermeldung wird teils 1:1 durchgereicht (`route.ts:99` `error: result.error`) — kann externe API-Texte an den Client leaken (geringes Risiko, keine Secrets).
- **Logging:** `console.error` mit **Metadaten/Kontext, ohne Secrets** (z.B. „CRITICAL: Stripe-Keys fehlen", „Supabase DOI confirm failed", „Resend email error"). Kein strukturiertes Logging, kein Sentry/externes Error-Tracking (**NICHT VORHANDEN**) — Fehler landen nur in den Container-`stdout`-Logs.
- **Verschluckte Fehler (bewusst):**
  - Datei-Fallback-Schreibfehler: leerer `catch {}` (`confirm/route.ts:71`) — Eintrag geht verloren, niemand erfährt es.
  - Alle Mail-Sends: per `.catch(console.error)` entkoppelt, blockieren den Hauptflow nicht, aber Versandfehler sind nur im Log sichtbar.
  - `getResend()===null` bei fehlendem Key → Mail-Funktionen returnen still.
- **Globale UI-Fehler:** `app/error.tsx` und `app/not-found.tsx` vorhanden (React Error Boundary / 404).
- **Info-Leak an Client:** Keine internen Pfade/Stacks/Secrets in Responses gefunden. Einzige minimale Leak-Fläche: durchgereichte Brevo-Fehlertexte (siehe oben).

---

## Zusammenfassung der wichtigsten Audit-relevanten Punkte

1. **Keine Auth, keine Accounts, keine serverseitigen Nutzerdaten** — Angriffsfläche dadurch klein, aber „Pro-Status" ist clientseitig und trivial fälschbar (ökonomisch egal bei 0,99 €).
2. **`verify-session` ist toter Code** — die einzige serverseitige Kaufprüfung wird nirgends genutzt.
3. **Watermark-Feature halb verdrahtet** — wirkt nicht bei AVV/VVT-PDF.
4. **Null automatisierte Tests** auf sicherheitskritischen Pfaden (HMAC, Webhook, Checkout).
5. **Persistenz-Risiko** bei Datei-Fallback (Datenverlust bei Redeploy, stiller Schreibfehler).
6. **`.env.example` unvollständig** (`STRIPE_PRICE_WATERMARK_REMOVAL`, `BREVO_*`).
