# Watermark-Removal — Stripe-Setup

> Erstellt: 2026-06-16  
> Sprint 5 Output: Day-1-Cash-Modell ist im Code, **Stripe-Konfiguration manuell durch Ilias erforderlich**.

## Was du in Stripe (Dashboard) machen musst

### Schritt 1: Produkt anlegen
1. Stripe Dashboard → Produktkatalog → **Neues Produkt**
2. Name: **"Compliflow Watermark-Removal"**
3. Beschreibung: "Einmalige Entfernung des Compliflow-Credits aus einem generierten Dokument."
4. Bild: optional Compliflow-Logo

### Schritt 2: Preis anlegen
- Modell: **Einmaliger Preis** (NICHT Subscription)
- Betrag: **0,99 EUR**
- Steuersatz: nach Bedarf (Kleinunternehmer: keine USt; sonst 19% MwSt einberechnen, dann Brutto = 1,18 EUR konfigurieren)
- Pricing-Stufe: einfach (eine Stufe, 0,99 €)

### Schritt 3: Price-ID kopieren
Nach Erstellung erhält der Preis eine ID, z.B. `price_1OAbc...`. Diese muss in die `.env` (Coolify Production):

```env
STRIPE_PRICE_WATERMARK_REMOVAL=price_1OAbc...
```

### Schritt 4: Alte Pro-Tier-Price-IDs entfernen
```env
# DIESE BEIDEN KÖNNEN/SOLLTEN RAUS:
# STRIPE_PRICE_AVV_PRO=price_xxx
# STRIPE_PRICE_VVT_PRO=price_xxx
```

⚠️ Hinweis: Falls bereits Käufer mit alten Sessions existieren, `verify-session/route.ts` akzeptiert Legacy-Sessions weiterhin (für 6 Monate ausreichende Übergangsfrist).

### Schritt 5: Webhook-Endpoint prüfen
Der Webhook-Endpoint (`/api/stripe/webhook`) bleibt unverändert. Stripe wird automatisch über erfolgreiche Watermark-Removal-Zahlungen informieren.

## Lokale Entwicklung (Mock-Modus)
Wenn `STRIPE_SECRET_KEY` ODER `STRIPE_PRICE_WATERMARK_REMOVAL` NICHT gesetzt sind:
- Checkout-Route gibt einen Mock-Redirect zurück: `?watermark_removed=true&mock=true`
- Watermark-Store speichert mock-Session-ID
- User sieht das "Watermark entfernt"-State sofort, ohne echte Zahlung

→ Perfekt für lokales UI-Testing.

## Was Compliflow technisch macht

| Komponente | Was sie tut |
|---|---|
| `app/api/stripe/checkout/route.ts` | Erstellt Stripe-Checkout-Session, Metadata: `product=watermark_removal`, `doc_type=...` |
| `app/api/stripe/verify-session/route.ts` | Validiert Session → bestätigt Watermark-Removal-Kauf |
| `lib/watermark/store.ts` | Zustand-Store mit `localStorage`-Persistenz, pro Doc-Typ |
| `components/watermark/remove-button.tsx` | Button + Stripe-Checkout-Start + Auto-URL-Param-Verarbeitung nach Stripe-Redirect |
| `lib/{datenschutz,agb,widerruf,cookie-banner}/contract.ts` | `buildHtml(d, { credit: false })` → Footer raus |

## User-Flow

1. User füllt Wizard aus, kommt im Review-Step an
2. Right-Sidebar zeigt **"Compliflow-Credit entfernen — 0,99 €"** Box
3. Klick → POST `/api/stripe/checkout` mit `docType`
4. Redirect zu Stripe-Checkout (deutsch, Karte-Zahlung)
5. Nach Erfolg → Redirect zurück: `/X-generator?watermark_removed=true&session_id=cs_test_...&doc_type=X`
6. `WatermarkRemoveButton` sieht URL-Params, speichert Session in `localStorage`
7. Alle nachfolgenden `buildHtml(d, { credit: !isBought })` → KEIN Compliflow-Credit
8. Bei Browser-Wechsel: localStorage-State weg → User muss neu kaufen (per-Browser-Modell)

## Plausible-Events

| Event | Wann | Props |
|---|---|---|
| `Watermark Checkout Started` | Click auf Button | `doc_type` |
| `Watermark Removed` | Nach Return von Stripe (Mock + Live) | `doc_type`, `mode` (mock/live) |

## Stripe-Konfiguration in Coolify

```env
# Production (Coolify Env)
PAYMENT_PROVIDER=live
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_WATERMARK_REMOVAL=price_1OAbc...
NEXT_PUBLIC_APP_URL=https://compliflow.de
```

```env
# Local (.env)
PAYMENT_PROVIDER=mock        # ← Mock-Modus
# Stripe-Keys bewusst LEER lassen, dann läuft Mock-Flow
```

## Open Tasks für Ilias

- [ ] Stripe-Produkt + Preis anlegen (Schritt 1-3)
- [ ] `STRIPE_PRICE_WATERMARK_REMOVAL` in Coolify Production-Env eintragen
- [ ] Alte `STRIPE_PRICE_AVV_PRO` + `STRIPE_PRICE_VVT_PRO` aus Coolify entfernen
- [ ] Stripe-Produkte "AVV Pro" + "VVT Pro" archivieren (NICHT löschen — Legacy-Käufer wollen ggf. noch verifizieren können)
- [ ] Webhook in Stripe → `https://compliflow.de/api/stripe/webhook` aktiv lassen
- [ ] Test in Production: 1× Watermark-Removal kaufen, Doku ohne Credit prüfen
