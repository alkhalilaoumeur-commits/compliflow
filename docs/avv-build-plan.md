# AVV-Generator — Localhost-Build-Plan

> **Ziel:** Perfekter AVV-Generator, lokal lauffähig (`npm run dev` → `localhost:3000/avv`).
> **Explizit zurückgestellt:** Stripe, Supabase-DB, Resend-Email, Auth, Deploy, Vercel.
> **Erstellt:** 2026-06-06
> **Geschätzte Dauer (Solo, fokussiert):** 4–6 Tage Netto-Build

---

## Definition von „perfekt"

Ein User tippt seine Daten ein und bekommt am Ende ein **PDF, das ein Datenschutzbeauftragter ohne Beanstandung akzeptieren würde**. Konkret:

1. Vertragstext deckt alle 13 Pflicht-Punkte aus Art. 28 Abs. 3 DSGVO ab
2. TOMs nach Art. 32 DSGVO sauber aufgeführt
3. Schrems-II-Logik für US/Drittland-Subverarbeiter korrekt
4. PDF sieht aus wie ein Anwalts-Vertrag, nicht wie ein KI-Output
5. Wizard < 2 Minuten ausfüllbar
6. Wizard funktioniert auf Mobile
7. State überlebt Reload (localStorage)
8. Keine TypeScript-Errors, kein Console-Error
9. DRVN-Brand sauber umgesetzt

---

## Architektur-Prinzipien

- **localStorage als „DB":** Wizard-State wird im Browser gespeichert. Supabase-Migration später trivial — Datenmodell ist DB-kompatibel designed.
- **Modulare Vertragsbausteine:** Vertragstext nicht als ein Riesen-String, sondern als Komponenten-Tree mit Conditional Rendering. Das macht spätere Updates pflegbar.
- **PDF = React-PDF (`@react-pdf/renderer`)**, weil komplett server-/client-side ohne Browser-Dependency, kein Puppeteer-Overhead für localhost.
- **Validation everywhere:** Zod-Schema für jedes Wizard-Step, kein „free text" ohne Bounds.
- **Server Components als Default**, Client nur wo State / Interaktion nötig.

---

## Phasen-Übersicht

| Phase | Was | Akzeptanz | Tage |
|---|---|---|---|
| 0 | Dependencies + Routing | `/avv` Route existiert, alle Libs installiert | 0.25 |
| 1 | Datenmodell + Types + Zod | Type-System für komplette AVV-Daten | 0.5 |
| 2 | Wizard-Shell | Step-Container, Progress-Bar, Next/Back funktioniert | 0.5 |
| 3 | Wizard-Steps (7 Stück) | Alle 7 Steps mit Forms, Validation, Persistence | 1.5 |
| 4 | Vertragstext-Engine | Modulare Bausteine, conditional Logic, Live-Preview | 1 |
| 5 | PDF-Generator | React-PDF mit allen Sektionen + Anlagen | 1 |
| 6 | Polish + Brand + Test | Animationen, Mobile, Edge-Cases, Lighthouse | 0.75 |
| **Total** | | | **5.5 Tage** |

---

## Phase 0 — Setup & Dependencies (0.25 Tage)

### Todos

- [ ] **0.1** Im Projekt prüfen: läuft `npm run dev` ohne Error? Welche Libs schon installiert?
- [ ] **0.2** Dependencies installieren:
  ```bash
  npm i react-hook-form zod @hookform/resolvers
  npm i @react-pdf/renderer
  npm i zustand                          # State über Steps hinweg
  npm i clsx tailwind-merge              # Class-Utilities
  npm i lucide-react                     # Icons (geometrisch, passt zu DRVN)
  ```
- [ ] **0.3** Route anlegen: `app/avv/page.tsx` (vorerst Placeholder)
- [ ] **0.4** Route anlegen: `app/avv/layout.tsx` (eigenes Layout für Tool-Bereich)
- [ ] **0.5** `lib/utils.ts` mit `cn()`-Helper (clsx + twMerge)

### Akzeptanz

- `http://localhost:3000/avv` lädt ohne Error
- Alle Libs in `package.json`
- TypeScript: `tsc --noEmit` clean

---

## Phase 1 — Datenmodell + Validation (0.5 Tage)

### Wofür

Bevor irgendeine UI gebaut wird: Wir definieren **was ein AVV als Daten ist**. Wenn der Type richtig ist, schreibt sich die UI fast von selbst.

### Todos

- [ ] **1.1** `lib/avv/types.ts` — TypeScript-Types für:
  ```ts
  Vertragspartei  { firma, anschrift, vertretung, email, registergericht? }
  Verarbeitung    { gegenstand, dauer, zweck, art, weisungsbefugte[] }
  Datenkategorie  { id, label, beispiele[] }            // z.B. Kontakt, Zahlung, Tracking
  Personenkategorie { id, label }                       // Kunden, Mitarbeiter, Bewerber
  TOM             { id, kategorie, beschreibung, implementiert: bool }
  Subverarbeiter  { firma, anschrift, zweck, drittland, sccs?, angemessenheitsbeschluss? }
  Drittland       { land, sicherheitsgarantie: "SCC" | "Angemessenheit" | "Bindende Unternehmensregeln" | "Keine" }
  AvvFormData     { auftraggeber, auftragnehmer, verarbeitung, datenkategorien[], personenkategorien[], toms[], subverarbeiter[], drittlandTransfer, schremsIIMassnahmen[] }
  ```

- [ ] **1.2** `lib/avv/schema.ts` — Zod-Schemas für jeden Type:
  ```ts
  vertragsParteiSchema   // strenge Email-Validation, Pflichtfelder
  verarbeitungSchema     // Mindestlängen
  ...
  avvFormSchema          // composed schema
  ```

- [ ] **1.3** `lib/avv/defaults.ts` — Vordefinierte Listen:
  - 12 Standard-Datenkategorien (Bitkom-Empfehlung)
  - 8 Standard-Personenkategorien
  - 24 Standard-TOMs (Zugangs-, Zugriffs-, Weitergabe-, Eingabe-, Auftrags-, Verfügbarkeitskontrolle nach BDSG-alt + DSGVO-konform aktualisiert)
  - Top-20 Drittländer mit Status (US, UK, CH, Indien, Israel, etc.)

- [ ] **1.4** `lib/avv/store.ts` — Zustand-Store für Wizard:
  ```ts
  useAvvStore: {
    currentStep: number
    data: Partial<AvvFormData>
    setStep, nextStep, prevStep
    updateData, resetData
    isStepValid(step): bool
  }
  // persist-middleware → localStorage
  ```

### Akzeptanz

- Types-File ist vollständig, alle Felder vorhanden
- Zod-Schema validiert Beispiel-Daten korrekt (Test im Browser-Console)
- Store überlebt Page-Reload (localStorage)

---

## Phase 2 — Wizard-Shell (0.5 Tage)

### Wofür

Container, der alle 7 Steps trägt. Progress sichtbar, Navigation per Buttons + Keyboard, State im Store.

### Todos

- [ ] **2.1** `components/avv/wizard-shell.tsx` — Outer Container:
  - Header mit Logo + Step-Indicator („Schritt 3 von 7")
  - Progress-Bar (Vermillion-fill, line-Background)
  - Main-Content-Area
  - Footer mit „Zurück" + „Weiter"-Buttons
  - „Speichern & später fortsetzen"-Hint (localStorage)

- [ ] **2.2** `components/avv/wizard-progress.tsx` — Animierte Progress-Bar
- [ ] **2.3** `components/avv/wizard-nav.tsx` — Footer-Navigation, deaktiviert „Weiter" wenn Step invalid
- [ ] **2.4** `components/avv/step-label.tsx` — Step-Titel + Sub-Beschreibung, einheitlich gestyled
- [ ] **2.5** Keyboard-Shortcuts: `Enter` = Weiter, `Esc` = Zurück (mit Confirm wenn Daten)
- [ ] **2.6** `app/avv/page.tsx` rendert Wizard-Shell + lädt aktuellen Step dynamisch

### Akzeptanz

- 7 leere Steps durchschaltbar
- Progress-Bar zeigt korrekten Fortschritt
- Reload erhält aktuellen Step + Daten
- Mobile: Buttons & Progress sichtbar, Layout bricht nicht

---

## Phase 3 — Die 7 Wizard-Steps (1.5 Tage)

### Aufbau jedes Steps

Jeder Step ist eine eigene Komponente unter `components/avv/steps/`, nutzt `react-hook-form` lokal, schreibt validierten State in Zustand-Store.

### Step-Liste

#### Step 1 — Vertragsparteien (`step-parties.tsx`)

- [ ] **3.1** Zwei Card-Sections nebeneinander: „Auftraggeber" + „Auftragsverarbeiter"
- [ ] **3.2** Felder je Partei: Firma, Anschrift (Straße, PLZ, Ort, Land), Vertretungsberechtigte Person, Email, Optional: Registergericht + HRB
- [ ] **3.3** Hint-Box: „Du bist meist Auftraggeber wenn du dieses Tool nutzt"
- [ ] **3.4** Live-Validation: Email-Format, PLZ-Plausibilität

#### Step 2 — Gegenstand & Zweck (`step-purpose.tsx`)

- [ ] **3.5** Textarea: Gegenstand der Verarbeitung (mit Beispielen als Placeholder)
- [ ] **3.6** Radio: Dauer (befristet bis Datum / unbefristet / Vertragslaufzeit)
- [ ] **3.7** Textarea: Zweck (Was wird mit den Daten gemacht?)
- [ ] **3.8** Multi-Select: Art der Verarbeitung (Erheben, Speichern, Anpassen, Übermitteln, Löschen, …)

#### Step 3 — Datenkategorien (`step-data-categories.tsx`)

- [ ] **3.9** Multi-Select-Grid: 12 Standard-Datenkategorien als anklickbare Karten
  - z.B. Kontaktdaten, Zahlungsdaten, Vertragsdaten, Nutzungsdaten, Standortdaten, Gesundheitsdaten (besondere Kat. nach Art. 9), …
- [ ] **3.10** „Andere"-Feld für Custom-Eingabe (Multi-Tag)
- [ ] **3.11** Warning-Box wenn besondere Kategorien (Art. 9) ausgewählt: „Erhöhte Anforderungen!"

#### Step 4 — Betroffenen-Kategorien (`step-data-subjects.tsx`)

- [ ] **3.12** Multi-Select: Kunden, Interessenten, Mitarbeiter, Bewerber, Lieferanten, Newsletter-Abonnenten, Website-Besucher, Andere
- [ ] **3.13** Custom-Tag-Eingabe

#### Step 5 — TOMs (`step-toms.tsx`)

- [ ] **3.14** Akkordeon-Struktur nach Art. 32 DSGVO-Kategorien:
  - Zutrittskontrolle, Zugangskontrolle, Zugriffskontrolle, Weitergabekontrolle, Eingabekontrolle, Auftragskontrolle, Verfügbarkeitskontrolle, Trennungskontrolle
- [ ] **3.15** Je Kategorie: Checkbox-Liste mit Standard-Maßnahmen (z.B. „TLS-Verschlüsselung", „2FA", „Rollen-basiertes Zugriffskonzept", „Verschlüsselte Backups")
- [ ] **3.16** Custom-TOM-Eingabe je Kategorie
- [ ] **3.17** „Mindestens 1 TOM je Kategorie"-Validation mit Hint

#### Step 6 — Subverarbeiter (`step-subprocessors.tsx`)

- [ ] **3.18** Repeatable Form: User kann beliebig viele Subverarbeiter hinzufügen
- [ ] **3.19** Pro Subverarbeiter: Firma, Anschrift, Verarbeitungszweck, Drittland-Dropdown
- [ ] **3.20** Bei Drittland ≠ EU: Sicherheitsgarantie-Dropdown (SCC, Angemessenheitsbeschluss, BCR, keine)
- [ ] **3.21** Bei US: Schrems-II-Hinweis-Box + Optional „Zusatzmaßnahmen" (Verschlüsselung, Pseudonymisierung)
- [ ] **3.22** Quick-Add-Buttons für Top-10 (Google, AWS, Stripe, Vercel, Supabase, …)

#### Step 7 — Review & Generate (`step-review.tsx`)

- [ ] **3.23** Zusammenfassung aller eingegebenen Daten in 4 Spalten
- [ ] **3.24** „Bearbeiten"-Links je Sektion (springt zu entsprechendem Step)
- [ ] **3.25** Live-Vorschau des Vertrags (rechte Seite, Sticky)
- [ ] **3.26** Email-Capture-Feld (für Free-Tier-Marketing — aber **kein** Email-Versand auf localhost)
- [ ] **3.27** Großer CTA-Button: „AVV als PDF herunterladen"

### Akzeptanz

- Alle 7 Steps lauffähig
- Validation greift, kein „Weiter" bei invalid State
- localStorage hält Daten über alle 7 Steps zusammenhängend
- Tab-Order korrekt (Accessibility)

---

## Phase 4 — Vertragstext-Engine (1 Tag)

### Wofür

Der eigentliche Vertragstext — modular, conditional, rechtssicher. Quelle: GDD-Muster + Bitkom-Empfehlung + DSGVO-Artikel direkt.

### Todos

- [ ] **4.1** `lib/avv/contract-template.ts` — Vertragstext als TypeScript-Objekt:
  ```ts
  contractTemplate = {
    praeambel: (data) => "...",
    paragraph1_gegenstand: (data) => "...",
    paragraph2_weisungsbefugnis: (data) => "...",
    paragraph3_pflichten: (data) => "...",
    ...
    paragraph12_schlussbestimmungen: (data) => "..."
  }
  ```

- [ ] **4.2** Recherche & Übernahme der 12 Standard-Paragraphen:
  1. Präambel
  2. Gegenstand und Dauer
  3. Konkretisierung der Verarbeitung (Art, Zweck, Kategorien)
  4. Weisungen
  5. Pflichten des Auftragnehmers (Vertraulichkeit, TOMs)
  6. Unterauftragsverhältnisse (Subverarbeiter-Liste, Genehmigungsregeln)
  7. Rechte der Betroffenen
  8. Unterstützung des Verantwortlichen (Auskünfte, DPIA)
  9. Meldung von Datenpannen (72h-Frist)
  10. Beendigung (Rückgabe/Löschung)
  11. Audit-Rechte
  12. Schlussbestimmungen + Drittland-Klauseln (wenn anwendbar)

- [ ] **4.3** `components/avv/contract-preview.tsx` — Live-Vorschau-Komponente, rendert aktuellen Vertragsstand auf Basis Store-Daten
- [ ] **4.4** Conditional Logic Edge-Cases:
  - Besondere Kategorien Art. 9 → strengerer §5
  - US-Subverarbeiter → §12 mit SCC-Verweis
  - Auftragnehmer in Drittland → komplette Schrems-II-Klausel
  - Befristete Dauer → konkrete Enddatum-Klausel
- [ ] **4.5** **Juristischer Quality-Check:** Vertrag mit ChatGPT (GPT-4 / Claude Opus) gegen Art. 28 DSGVO prüfen lassen — Lückenliste abarbeiten

### Akzeptanz

- Vertragstext ist vollständig nach Art. 28 Abs. 3
- Live-Preview ändert sich sofort bei jeder User-Eingabe
- Conditional Logic für 4 Edge-Cases verifiziert
- Selbst-Test: Vertrag für „Compliflow nutzt Stripe als Subverarbeiter" durchspielen → liest sich juristisch korrekt

---

## Phase 5 — PDF-Generator (1 Tag)

### Wofür

Aus den Wizard-Daten + Vertragstext eine professionelle PDF-Datei, die heruntergeladen werden kann.

### Todos

- [ ] **5.1** `lib/avv/pdf/avv-document.tsx` — React-PDF-Komponente:
  ```tsx
  <Document>
    <Page>           // Deckblatt
    <Page>           // Inhaltsverzeichnis
    <Page>           // Vertragstext §1–§12 (mehrere Pages)
    <Page>           // Anlage 1: TOMs
    <Page>           // Anlage 2: Subverarbeiter
    <Page>           // Anlage 3: Datenkategorien & Betroffenen
  </Document>
  ```

- [ ] **5.2** PDF-Styles: Schriftart **Inter** (System-tauglich für PDF, da Syne in PDF tricky), Schwarz-auf-Weiß für Druckbarkeit, klare Hierarchie (H1/H2/Body)
- [ ] **5.3** Deckblatt-Design: Vertragsparteien-Box, Datum, „Auftragsverarbeitungsvertrag nach Art. 28 DSGVO" als Titel, Compliflow-Logo (logo-mark-on-light.svg) unten klein
- [ ] **5.4** Inhaltsverzeichnis automatisch generiert aus Paragraphen
- [ ] **5.5** Page-Footer auf jeder Seite: „Seite X von Y · AVV [Firma Auftraggeber] · [Datum]"
- [ ] **5.6** Free-Tier-Footer (vorerst immer drin): „Erstellt mit Compliflow · compliflow.de"
- [ ] **5.7** Anlage 1 (TOMs): Strukturierte Tabelle mit 8 Kategorien × ausgewählte Maßnahmen
- [ ] **5.8** Anlage 2 (Subverarbeiter): Tabelle Firma | Sitz | Zweck | Drittland-Status
- [ ] **5.9** Download-Button-Logic: `<PDFDownloadLink>` von react-pdf, Filename: `AVV_[FirmaAuftraggeber]_[YYYY-MM-DD].pdf`

### Akzeptanz

- PDF lädt herunter, ist > 5 Seiten lang
- Öffnet in Preview/Adobe Reader ohne Warnung
- Druckbar auf A4 (kein Text abgeschnitten)
- Tabellen zerbrechen nicht über Seiten falsch
- Selbst-Test: Den eigenen Compliflow-AVV mit Vercel als Subverarbeiter durchspielen → sieht aus wie ein echter Vertrag

---

## Phase 6 — Polish, Brand, Test (0.75 Tage)

### Todos

- [ ] **6.1** **Animationen:** `rise`-Animation für jeden Step-Eingang (aus globals.css), Stagger bei Datenkategorien-Cards
- [ ] **6.2** **Brand-Konsistenz:** Alle Komponenten gegen `brand/BRAND.md` checken (Farben, Spacing, Typo)
- [ ] **6.3** **Mobile:** Wizard auf iPhone 13 / Galaxy S20 testen — keine Overflows, Buttons groß genug
- [ ] **6.4** **Empty-States:** Was sieht User, wenn er Step betritt? Keine leeren weißen Flächen.
- [ ] **6.5** **Error-States:** Zod-Validation-Errors mit Vermillion-Border + Inline-Message
- [ ] **6.6** **Loading-State** für PDF-Generierung (Spinner + „PDF wird erstellt …")
- [ ] **6.7** **Accessibility-Pass:**
  - ARIA-Labels auf allen Form-Feldern
  - Focus-Ring sichtbar
  - Color-Contrast WCAG AA
  - Screen-Reader-Test mit VoiceOver
- [ ] **6.8** **Edge-Cases manuell testen:**
  - Leere Subverarbeiter-Liste → Anlage 2 wird ausgeblendet im PDF
  - Custom-TOM mit Sonderzeichen → keine PDF-Render-Errors
  - Refresh mitten im Wizard → State wiederhergestellt
  - localStorage gelöscht → Wizard startet sauber bei Step 1
- [ ] **6.9** **Lighthouse-Audit** auf `/avv` → Mindestens 90 in allen 4 Kategorien
- [ ] **6.10** **TypeScript Strict-Check:** `tsc --noEmit --strict` → 0 Errors

### Akzeptanz

- Wizard-Durchlauf von Anfang bis PDF-Download in < 2 Minuten möglich
- Sieht aus wie ein 50€-Stripe-Produkt, nicht wie ein Schul-Projekt
- Funktioniert auf Mobile + Desktop ohne Bug
- Lighthouse ≥ 90, TS strict clean

---

## Was bewusst NICHT in diesem Plan ist

| Feature | Warum nicht | Wann (geplant) |
|---|---|---|
| Stripe-Checkout | Localhost-Phase, kein Payment nötig | Phase 7, separat |
| Supabase-DB | localStorage reicht erstmal | Phase 7 (vor Deploy) |
| Auth (Magic-Link) | Nicht nötig für Free-Wizard | Phase 7 (für Pro-Features) |
| Resend-Email | Kein Versand auf localhost | Phase 7 |
| DocuSign | Pro-Feature, später | Phase 8+ |
| Multi-AVV-Management | Pro-Agency-Feature | Phase 8+ |
| Custom-Branding (Pro) | Free funktioniert ohne | Phase 7 |
| Plausible-Analytics | localhost-irrelevant | beim Deploy |
| Sentry / Error-Tracking | localhost = direkt im Browser sichtbar | beim Deploy |
| SEO-Content-Hub (Blog) | nicht Tool-relevant | Parallel-Track |
| Affiliate-System | Post-Launch | nach 50 Pro-Käufen |

---

## Risiken & Mitigation

| Risiko | Wahrscheinlichkeit | Mitigation |
|---|---|---|
| Vertragstext juristisch lückenhaft | hoch | Phase 4.5: explizit Quality-Check mit LLM gegen Art. 28 |
| React-PDF kann Syne-Font nicht | mittel | Stattdessen Inter für PDF — moderne Sans, geometrisch genug |
| Wizard wird zu lang (User-Abbruch) | mittel | Jeden Step auf ≤ 5 Felder limitieren, Defaults vorausfüllen |
| localStorage-Quota voll | niedrig | AVV-Daten sind kompakt (< 10 KB), kein Risiko |
| Mobile-Layout bricht bei Repeatable Subverarbeiter | mittel | Phase 3.18: Card-Layout statt Table |
| Zustand-Persist verliert beim Type-Change | mittel | Migration-Strategie im Store (Version-Field) |

---

## Konkrete Reihenfolge (Tag für Tag)

### Tag 1 (Phase 0 + 1)
- Vormittag: Dependencies, Route, lib/utils
- Nachmittag: Datenmodell, Zod-Schema, Zustand-Store, Defaults-Listen

### Tag 2 (Phase 2 + Steps 1–2)
- Vormittag: Wizard-Shell, Progress, Navigation
- Nachmittag: Step 1 (Parteien), Step 2 (Gegenstand)

### Tag 3 (Steps 3–5)
- Vormittag: Step 3 (Datenkategorien) + Step 4 (Betroffene)
- Nachmittag: Step 5 (TOMs) — der größte Step

### Tag 4 (Steps 6–7 + Vertragstext-Start)
- Vormittag: Step 6 (Subverarbeiter mit Schrems-II-Logik)
- Nachmittag: Step 7 (Review) + Vertragstext-Engine starten

### Tag 5 (Vertragstext + PDF)
- Vormittag: Vertragstext-Engine vollständig + LLM-Quality-Check
- Nachmittag: PDF-Document-Komponente + Anlagen

### Tag 6 (Polish)
- Vormittag: Animationen, Brand-Pass, Mobile-Tests
- Nachmittag: Accessibility, Lighthouse, Edge-Cases, Buffer für Fixes

---

## Status-Tracking

| Datum | Phase | % Done | Blocker | Note |
|---|---|---|---|---|
| 2026-06-06 | 0 Setup | 100% | — | Deps + Route + utils |
| 2026-06-06 | 1 Datenmodell | 100% | — | Types, Zod, Defaults, Zustand-Store |
| 2026-06-06 | 2 Wizard-Shell | 100% | — | Progress, Nav, Hydration, Validation |
| 2026-06-06 | 3 7 Steps | 100% | — | Alle Steps mit Forms + Validation |
| 2026-06-06 | 4 Vertragstext | 100% | — | 13 §§ + 3 Anlagen, Conditional Logic, Live-Preview |
| 2026-06-06 | 5 PDF-Generator | 100% | — | React-PDF lazy-loaded, Deckblatt+TOC+Anlagen+Footer |
| 2026-06-06 | 6 Polish | 80% | Mobile + Lighthouse nicht aktiv getestet | Animationen, Validation-Enforcement, Empty-States |

---

## Nächster Schritt (jetzt)

**Phase 0 starten:** Dependencies installieren + `/avv`-Route anlegen.

```bash
cd ~/compliflow
npm i react-hook-form zod @hookform/resolvers @react-pdf/renderer zustand clsx tailwind-merge lucide-react
```

Wenn das durch ist → ich melde mich mit den ersten konkreten Files.
