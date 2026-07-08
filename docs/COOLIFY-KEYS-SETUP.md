# Coolify Go-Live — alle Keys besorgen & eintragen

> **Warum diese Datei:** Der Container startet **nicht**, solange nicht alle 8 Pflicht-ENV-Vars
> in Coolify gesetzt sind. Der Boot-Check (`lib/env.ts` → `validateEnv()`) bricht den Start
> absichtlich ab und listet die fehlenden Vars im Container-Log. Das ist ein Sicherheitsnetz,
> kein Bug.
>
> **Status prüfen nach dem Deploy:** `npm run check:config -- https://compliflow.de`
> (zeigt pro Integration Live/Fallback/Down, ohne Secrets zu leaken — siehe `lib/integrations-status.ts`).

Detaillierte Einzel-Anleitungen liegen daneben: `docs/WATERMARK-STRIPE-SETUP.md`, `docs/BREVO-SETUP.md`, `docs/DEPLOY-JETZT.md`.

---

## Fortschritt (abhaken beim Durchklicken)

- [ ] **1. Stripe** — `STRIPE_SECRET_KEY`, `STRIPE_PRICE_WATERMARK_REMOVAL`, `STRIPE_WEBHOOK_SECRET`
- [ ] **2. Resend** — `RESEND_API_KEY` (+ Domain `compliflow.de` verifiziert)
- [ ] **3. Brevo** — `BREVO_API_KEY`, `BREVO_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`
- [ ] **4. DOI_SECRET** — schon generiert (siehe unten), nur eintragen
- [ ] **5. Alle 8 in Coolify → Environment Variables → als "Runtime only"**
- [ ] **6. Redeploy** klicken
- [ ] **7. `npm run check:config -- https://compliflow.de`** → alles LIVE?

---

## 1. Stripe → 3 Keys

> ⚠️ Konto muss **aktiviert** sein (Geschäftsdaten + Bankverbindung), sonst keine `sk_live_`-Keys.
> Oben rechts **Testmodus AUSschalten** — du brauchst Live-Werte.

| Var | Weg im Dashboard | Format |
|---|---|---|
| `STRIPE_SECRET_KEY` | Entwickler → API-Schlüssel → Geheimschlüssel „anzeigen" | `sk_live_…` |
| `STRIPE_PRICE_WATERMARK_REMOVAL` | Produktkatalog → + Produkt → 0,99 EUR, **Einmalig** → Preis-ID kopieren | `price_…` (nicht `prod_`) |
| `STRIPE_WEBHOOK_SECRET` | Entwickler → Webhooks → + Endpunkt → URL siehe unten → Event `checkout.session.completed` → Signaturgeheimnis anzeigen | `whsec_…` |

**Webhook-Endpunkt-URL:** `https://compliflow.de/api/stripe/webhook`
**Event:** nur `checkout.session.completed` (einziges, das der Code auswertet — `app/api/stripe/webhook/route.ts`)

---

## 2. Resend → 1 Key

> Domain `compliflow.de` muss **verifiziert** sein, sonst kein Versand von `hello@compliflow.de`.

1. **resend.com** → Domains → Add Domain → `compliflow.de`
2. Angezeigte **DNS-Einträge** (SPF, DKIM) beim Domain-Anbieter eintragen → „Verify" → warten bis grün
3. **API Keys** → Create API Key → kopieren

| Var | Format |
|---|---|
| `RESEND_API_KEY` | `re_…` |

---

## 3. Brevo → 3 Werte

| Var | Weg im Dashboard | Format |
|---|---|---|
| `BREVO_API_KEY` | Name (oben rechts) → SMTP & API → API Keys → Generate | `xkeysib-…` |
| `BREVO_LIST_ID` | Contacts → Lists → + Add a list → Liste öffnen → ID ablesen | Zahl, z.B. `3` |
| `BREVO_DOI_TEMPLATE_ID` | Campaigns → Templates → New Template mit Bestätigungs-Button (Merge-Tag `{{ doubleOptin }}`) → ID ablesen | Zahl, z.B. `2` |

> **`BREVO_DOI_TEMPLATE_ID` ist der fummeligste Teil.** Die Vorlage ist die „Bitte bestätige deine
> Anmeldung"-Mail. Der Bestätigungs-Button MUSS den Double-Opt-In-Link (`{{ doubleOptin }}`) enthalten,
> sonst führt der Link ins Leere. Code-Referenz: `lib/brevo/client.ts` ruft `/contacts/doubleOptinConfirmation`
> mit `templateId`, `includeListIds`, `redirectionUrl = <APP_URL>/waitlist/confirmed`.

---

## 4. DOI_SECRET (schon generiert)

Signiert die Bestätigungs-Links. **Einmal setzen, nie wieder ändern** (sonst werden alle schon
verschickten Links ungültig). Nicht im Code speichern, nur in Coolify.

```
DOI_SECRET=jWFiFXTVPXLOsg5OMIbZe8ADWx-oemk2E_MBWmlo8jbi8bIEeA4Om0MWfXvuGLUz
```

> Neu generieren (falls je nötig): `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`

---

## 5. In Coolify eintragen

**Coolify → dein Service → Environment Variables**, jeweils **„Runtime only"**:

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_WATERMARK_REMOVAL=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
BREVO_API_KEY=xkeysib-...
BREVO_LIST_ID=3
BREVO_DOI_TEMPLATE_ID=2
DOI_SECRET=jWFiFXTVPXLOsg5OMIbZe8ADWx-oemk2E_MBWmlo8jbi8bIEeA4Om0MWfXvuGLUz
```

`NEXT_PUBLIC_APP_URL` ist bereits gesetzt (fehlte nicht im letzten Fehler-Log).

Dann **Redeploy** → Container startet → `npm run check:config -- https://compliflow.de`.

---

## Offener Code-Bug (nach dem Deploy fixen)

Der Webhook liest `session.metadata.tool`, der Checkout setzt aber `metadata.product`/`doc_type`
(`app/api/stripe/checkout/route.ts` vs. `app/api/stripe/webhook/route.ts`). Folge: Nach einer
0,99€-Zahlung geht die Bestätigungs-Mail **nicht** automatisch raus. Separater Fix, unabhängig
von den Keys.
