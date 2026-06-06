# Compliflow — Brand Guidelines

> Suite-Brand fuer DSGVO-Compliance-Tools im DACH-Markt. Teil der DRVN-Markenfamilie.
> Erstellt 2026-06-06 — Launch Tool 1 (AVV) am 17.06.2026.

---

## 1. Logo-Konzept

**Doppel-C / Channel**: Zwei konzentrische Boegen, die ein offenes "C" bilden. Der aeussere Bogen ist der **Vermillion-Akzent** (#FF4D00) — er liest sich als Flow-/Bewegungs-Stroke. Der innere Bogen ist die **Hauptmarke** (Cream auf dunklem BG, Espresso auf hellem BG).

**Was es bedeutet:**
- Buchstabe **C** = Compliflow / Compliance — sofortiger Brand-Bezug bei neuer Domain ohne Recognition.
- Zwei parallele Stroke = **Channel**, durch den Compliance-Workflows fliessen.
- Oeffnung nach rechts = Forward-Motion, "Output", Lead-Magnet-Geste.
- Skalierbar zum Suite-System: spaeter koennen zwischen den Stroke Tool-Indikatoren fuer AVV / VVT / Cookie sitzen.

**Was es NICHT ist:**
- Kein Schild (zu generisch fuer Compliance).
- Kein Checkmark (zu eng auf "approved" zentriert — die Suite ist mehr).
- Kein Knoten-Diagramm (zu abstrakt fuer Day-1 ohne Brand-Recognition).

---

## 2. Farben (Pflicht — DRVN-Familie)

| Token | Hex | Verwendung |
|---|---|---|
| `--color-bg` | `#0A0906` | Dominant 70%, Espresso, App-Hintergrund |
| `--color-bg-soft` | `#14110D` | Card-/Section-Hintergrund |
| `--color-bg-card` | `#1A1612` | Erhoehte Flaechen |
| `--color-ink` | `#F4EFE8` | 20%, Cream, Text auf dunklem BG |
| `--color-ink-dim` | `#A89F92` | Sekundaer-Text |
| `--color-ink-faded` | `#5C5447` | Tertiaer/Hint |
| `--color-accent` | `#FF4D00` | 10%, Vermillion, Akzent + Logo-Outer |
| `--color-line` | `#2A241D` | Trenner, Border |

**70/20/10-Regel:** Espresso dominant, Cream als Lese-Flaeche, Vermillion sparsam und scharf.

**Verbotene Farben:** generisches Blau (#3B82F6), Indigo, Violett, jedes Pastell. Auch im Logo nicht.

---

## 3. Typografie

| Font | Weight | Verwendung |
|---|---|---|
| **Syne** | 700 / 800 | Display (Headlines, Wordmark) |
| **DM Sans** | 400 / 500 / 700 | Body, Buttons, UI |
| **JetBrains Mono** | 400 / 500 | Code, Daten, Zahlen |

Wordmark-Setting: `Syne 800`, `letter-spacing: -0.04em`, lowercase. Die mittlere `l` in `compliflow` (Position 8) wird Vermillion eingefaerbt — das ist der einzige Farbtrick im Wordmark, der "flow" markiert.

---

## 4. Logo-Dateien

| Datei | Use-Case |
|---|---|
| `logo-mark.svg` | Generic Mark, `currentColor` fuer innere Stroke — passt sich Parent-Color an |
| `logo-mark-on-dark.svg` | Fixed: Cream innen + Vermillion aussen, fuer dunklen BG |
| `logo-mark-on-light.svg` | Fixed: Espresso innen + Vermillion aussen, fuer hellen BG |
| `logo-wordmark.svg` | Nur "compliflow" als Text-SVG (braucht Syne im Browser) |
| `logo-lockup-on-dark.svg` | Mark + Wordmark horizontal, fuer dunklen BG (z.B. Header) |
| `logo-lockup-on-light.svg` | Mark + Wordmark horizontal, fuer hellen BG (z.B. PDF) |
| `favicon.svg` | 64x64, optimiert fuer Browser-Tab, mit BG-Square |

Favicons live im Next.js auch unter `app/icon.svg` und `app/apple-icon.svg` (werden von Next automatisch ausgeliefert).

---

## 5. React-Komponente

In React: `import { Logo } from "@/components/brand/logo"`

```tsx
<Logo variant="mark" size={48} />       // nur Symbol
<Logo variant="wordmark" size={32} />   // nur Text
<Logo variant="lockup" size={40} />     // Symbol + Text (Default)
```

Die Komponente nutzt `currentColor` fuer den inneren Stroke — die Farbe wird vom Eltern-Element vererbt. Aussen-Stroke ist immer Vermillion (`#FF4D00`).

---

## 6. Clear Space & Sizing

- **Minimum-Groesse Mark:** 24px (Favicon-Bereich) — darunter Lesbarkeit verloren.
- **Minimum-Groesse Lockup:** 120px Breite — sonst Wordmark unlesbar.
- **Clear Space:** Mindestens 1/4 der Logo-Hoehe als Padding um das Logo herum.
- **Korrekte Hoehe Header:** 32-44px je nach Density.

---

## 7. Don'ts

- ❌ Innerer Stroke in einer anderen Farbe als Cream/Espresso/`currentColor`
- ❌ Aeusserer Stroke in einer anderen Farbe als Vermillion
- ❌ Stroke-Width veraendern (Verhaeltnis muss stimmen)
- ❌ Symbol gespiegelt / gedreht
- ❌ Wordmark in anderem Font als Syne 800
- ❌ Gradient, Shadow, Glow, 3D-Effekte
- ❌ "Compliflow" mit grossem C — immer lowercase als Wordmark

---

## 8. Verwendung im "Powered by"-Footer (Free-Tier)

Auf Free-AVV-PDFs erscheint:

```
Powered by [Logo Lockup, Hoehe 16px] · Erstelle deinen eigenen AVV auf compliflow.de
```

Verwende `logo-lockup-on-light.svg` (PDFs sind hellgrund). Wordmark + Mark.
Free-Tier-Footer ist Marketing-Pflicht — entfernen erst ab Pro-Plan.

---

## 9. Quellen & Referenzen

- DRVN-Brand-Identity-Master: `~/vault/agency/intern/brand-identity.md`
- Design-Rules: `~/.claude/design-rules.md` (per Hook geladen)
- Projekt-CLAUDE.md: `~/compliflow/CLAUDE.md`
- Launch-Plan: `~/compliflow/docs/launch-plan.md`
- Master-Checkliste: `~/compliflow/docs/master-checkliste.html`
