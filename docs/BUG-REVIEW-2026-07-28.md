# Bug-Review Compliflow — 2026-07-28

Vollständiger Befundbericht aus dem 4-Bereiche-Review (Server, Client/Wizard, Generator-Rechtstexte, Config/Infra) + Build/Typecheck/Tests. Stand: Commit e577056, Branch main.

> **UPDATE 2026-08-04:** Alle kritischen und hohen Befunde sowie der Großteil
> der mittleren/niedrigen wurden in den Commits `21bc25a`…(fix-Serie) behoben.
> Bewusst NICHT umgesetzt (Architektur-Entscheidungen, siehe Abschluss-Bericht
> der Session): DOI-One-Time-Token (M2), Email-im-Token statt Query (niedrig),
> Webhook-Idempotenz, E2E-Ausbau, Email-Capture-Gate vor Download (Konzeptfrage).

**Gesamtstatus (28.07.):** Build grün, 546/546 Unit-Tests grün. Aber: 5 kritische, 10 hohe, ~18 mittlere, ~15 niedrige Befunde.

---

## KRITISCH

### K1 — Falsche Paragrafen-Nummern in generierten Widerrufsbelehrungen
`lib/widerrufsbelehrung/types.ts:183-244` — § 312g Abs. 2 BGB-Nummern mehrfach falsch zugeordnet:
- Z. 211 Zeitungen/Zeitschriften: zitiert Nr. 6, korrekt Nr. 7
- Z. 221 versiegelte Datenträger/Software: zitiert Nr. 8, korrekt Nr. 6
- Z. 216 öffentliche Versteigerung: zitiert Nr. 7, korrekt Nr. 10
- Z. 237 Personenbeförderung: zitiert Nr. 12 (= Wett-/Lotterie); korrekt § 312 Abs. 2 Nr. 5 BGB
- Z. 242 Edelmetalle: „Nr. 5 (analog)" — korrekt Nr. 8

`renderAusschluesse` (`lib/widerrufsbelehrung/contract.ts:170-177`) übernimmt die Zitate 1:1 in den Export. Abmahnrisiko für Nutzer.

### K2 — Verworfene Pro-Preise (29 €/19 €) live auf Homepage-FAQ + Google-JSON-LD
- `lib/content.ts:66-68, 78-79, 94-95`: „Pro Dokument (29 €)… Agency (19 €/Monat)" — Pro-Tier wurde 2026-06-13 verworfen. Widerspruch zu `/preise` („alles 0 €") und zu Z. 59 derselben Datei.
- `app/layout.tsx:139-140` (Offers 29 €/19 €), `:152` (VVT price 29), `:163` (Cookie-Banner price 9/PreOrder), `:166-173` (FAQPage-Schema mit den falschen Antworten) → Google kann die Preise als Rich Result ausspielen.

### K3 — Cookie-Banner-Snippet: Nutzereingaben unescaped im generierten JS/CSS
- `lib/cookie-banner/builder.ts:241,246,256,266,279-280`: `t.configId` roh in JS-String-Literale interpoliert. Freies Textfeld ohne Formatvalidierung (`step-tracking.tsx:253-260`). Ein `"` in der ID = SyntaxError = komplettes Consent-Management der Kundenseite tot; gezielt: JS-Injection ins Embed. Fix: `JSON.stringify()`.
- `builder.ts:82-113`: Farbwerte + Zahlen roh im `<style>`-Block; freies TextInput ohne Hex-Validierung (`step-stil.tsx:119-124`). `</style><script>`-Injection bzw. CSS-Bruch möglich. Fix: `/^#[0-9a-fA-F]{3,8}$/`-Whitelist + `Number()`.
- `builder.ts:232`: `JSON.stringify(t.inlineScript)` escapet `</script>` nicht → HTML-Parser beendet das Snippet-Script vorzeitig. Fix: `.replace(/<\//g, "<\\/")`.
- `builder.ts:135-136`: `datenschutzUrl`/`impressumUrl` ohne Schema-Check → `javascript:`-Links im Embed möglich.

### K4 — Zahlungsbestätigungs-Mail feuert für das echte Produkt nie
`app/api/stripe/webhook/route.ts:48-51` prüft `session.metadata?.tool` (Legacy Pro-Tier). Der aktive Checkout (`app/api/stripe/checkout/route.ts:81-85`) setzt aber `metadata.product = "watermark_removal"` — kein `tool`. Jede echte 0,99-€-Zahlung durchläuft den Webhook ohne Mail. `sendPaymentConfirmation` (`lib/email.ts:193-207`) ist zudem noch komplett auf das verworfene Pro-Tier getextet, `returnUrl` hardcodiert auf Prod (Z. 207).

### K5 — Bestätigte Waitlist-Emails können komplett verloren gehen (Doppel-Befund)
1. `app/api/waitlist/confirm/route.ts:52-63`: Supabase-`fetch` ohne `res.ok`-Prüfung — 4xx (RLS, falscher Key, 409-Duplikat) läuft still durch, Nutzer sieht „bestätigt". `Prefer: merge-duplicates` wirkt ohne `?on_conflict=email` evtl. nicht.
2. `Dockerfile:24-39` + `route.ts:69-76`: Datei-Fallback schreibt nach `/app/.data`; `WORKDIR /app` gehört root, `USER nextjs` darf dort kein Verzeichnis anlegen → EACCES, nur geloggt. Kein Volume definiert. Da die Supabase-Keys in Coolify noch fehlen (Go-Live-Blocker), ginge im Deploy JEDE bestätigte Email verloren.

---

## HOCH

### H1 — EU-ODR-Plattform (abgeschaltet 20.07.2025) als „Pflicht-Link" in jedem B2C-Impressum
`lib/impressum/defaults.ts:195-197`, `lib/impressum/contract.ts:317-325` (für alle B2C als Pflichtblock), `app/impressum/page.tsx:48-66` (eigene Seite). VO (EU) 2024/3228 hat die ODR-VO aufgehoben; Link ist tot, Pflicht entfallen.

### H2 — PLZ→Bundesland-Mapping falsch → falsche Aufsichtsbehörde in Datenschutzerklärungen
`lib/datenschutz/defaults.ts:1130-1154` (`bundeslandFromPlz`) + `contract.ts:700-720`. U. a.: 28xxx (Bremen)→NI, 24xxx (SH)→HH (HB und SH per PLZ nie erreichbar), 54-56xxx (RLP)→NW, 68/69xxx (BW)→RP, 63xxx (BY)→HE, 03xxx/14xxx (BB)→SN/BE, 06/07xxx (ST/TH)→SN. Dokument nennt dann autoritativ die falsche Behörde mit Kontaktdaten.

### H3 — AGB: fehlende USt-ID ⇒ automatisch falsche Kleinunternehmer-Behauptung
`lib/agb/contract.ts:147-154`: kein Kleinunternehmer-Flag; leeres optionales USt-ID-Feld ⇒ „Als Kleinunternehmer i.S.v. § 19 UStG…" in den AGB. Zudem widersprüchlicher Output bei Netto-Preisen (`defaults.ts:192/198`).

### H4 — Rohe Platzhalter erreichen den Datenschutz-Export (Verstoß Audit-Regel 5)
`lib/datenschutz/defaults.ts:850` („[Hochrisiko / …]"), `:862` („[Landesbeauftragte/r …]"), `:647/684` („[Anbieter individuell ergänzen]"), `:516`. Nicht von `getCompletionStatus` (contract.ts:134-150) geblockt. Ebenso `lib/agb/contract.ts:244-245`: „(noch zu benennen)" bei VSBG.

### H5 — TTDSG/TMG (veraltete Gesetzesnamen) in Blog + Content + Meta
- `lib/content.ts:38,40`; `lib/blog-posts.ts:242-1291` (TTDSG durchgängig in 2 Cookie-Artikeln; `:555,946,951,1333` „§ 5 TMG"; `:1277` „§ 13 TMG" — seit 2021 aufgehoben)
- `app/layout.tsx:49,162`; `app/cookie-banner/page.tsx:8,81,96`; SEO-Keywords in 2 Generator-Layouts.
- Generatoren selbst sind sauber (DDG/TDDDG/MStV korrekt).

### H6 — Impressum-PDF ignoriert bezahlten Watermark-Removal
`lib/impressum/pdf/impressum-document.tsx:127-141`: `PageFooter` rendert immer den Credit, kein `showCredit`-Parameter. `components/impressum/pdf-download.tsx:26,34` übergibt keinen Kauf-Status. Käufer (0,99 €) bekommt das bezahlte Feature im PDF nicht. Analog: `components/widerruf/html-export.tsx:18` — Plaintext-Export ignoriert Kauf (`credit: true` Default).

### H7 — Homepage widerspricht sich: Cookie-Banner „live" UND „in Arbeit" + Rabatt auf verworfenes Pro
`app/page.tsx:800-807` (Waitlist: „Cookie-Banner in Arbeit… 34 % Rabatt auf Cookie-Banner Pro") vs. `:836` + `lib/tools.ts:125-141` (live, gratis). Rabatt-Versprechen auf Gratis-Produkt = UWG-Risiko.

### H8 — Datenschutz-Generator: aktivierte Optionen verschwinden stumm
`lib/datenschutz/contract.ts:431-491`: `renderEcommerce` returned `""` bei `bestellungen=false` — Bewertungen/Bonität/BNPL/Treue/Versand werden trotz Aktivierung nicht gerendert (z. B. Trustpilot ohne Shop).

### H9 — Cookie-Banner-Marketing behauptet nicht existierende Features
„Audit-Trail in der Datenbank" (`lib/content.ts:45`, `lib/tools.ts:130`, `app/cookie-banner/page.tsx:96`) — Banner speichert nur localStorage; eigene Anleitung sagt „KEIN serverseitiger Nachweis" (builder.ts:482-489). Falsches Produktversprechen.

### H10 — Email-Enumeration über /api/brevo/subscribe
`app/api/brevo/subscribe/route.ts:101-107` + `lib/brevo/client.ts:90-92`: `duplicate_parameter` ⇒ „bereits angemeldet" — verrät, wer im Newsletter steht. Waitlist-Action macht es richtig (immer gleiche Antwort).

---

## MITTEL

- **M1 Upstash-Ausfall = unbehandelte 500er:** `lib/rate-limit.ts:84-90` ohne try/catch; alle Aufrufer rufen Limiter außerhalb ihres try (checkout:42, subscribe:37, confirm:25, verify-session:12, actions/waitlist:54).
- **M2 DOI-Confirm: GET mit Seiteneffekt, 7 Tage replaybar:** `waitlist/confirm/route.ts` + `lib/doi-token.ts:50` — kein One-Time-Token; Mail-Scanner (Outlook SafeLinks) bestätigen ohne Klick; Replay flutet Owner-Mailbox + JSONL.
- **M3 verify-session: leerer catch:** `app/api/stripe/verify-session/route.ts:52-54` — Stripe-Ausfall nicht von ungültiger Session unterscheidbar, kein Log (Verstoß Audit-Regel 4).
- **M4 VVT-Export-Gate schwächer als eigene Checkliste:** `components/vvt/steps/step-abschluss.tsx:26-27` verlangt weniger als die Art.-30-Checkliste (Z. 157-181) und `isUnternehmenValid` (`lib/vvt/store.ts:209-223`) — Export mit offenen Pflichtpunkten möglich.
- **M5 Cookie-Preview-iframe faktisch unsandboxed:** `step-review.tsx:116` `allow-scripts allow-same-origin` — Consent wird real in compliflow.de-localStorage geschrieben (UI behauptet Gegenteil, Z. 61); danach laden echte Tracker im iframe. Fix: `allow-same-origin` entfernen.
- **M6 /cookie-banner-Zombie-Seite:** `app/cookie-banner/page.tsx:87-107` „Kommt im August 2026" + Waitlist, obwohl Generator live; 2 Blog-Links zeigen dorthin (`lib/blog-posts.ts`).
- **M7 404-Seite veraltet:** `app/not-found.tsx:34,50-73` — „Cookie-Banner kommt 19.08." + nur 2 von 7 Tools als live.
- **M8 ARCHITECTURE.md widerspricht Code:** `docs/ARCHITECTURE.md:37,66,133` „Stripe inaktiv"/„Pro-Status" — Watermark-Checkout ist aktiv.
- **M9 Docker-HEALTHCHECK nutzt `/` statt `/api/health`:** `Dockerfile:43-44` — die 503-Logik der Health-Route (`app/api/health/route.ts:11-14`) läuft ins Leere.
- **M10 Title-Doppelung:** `app/layout.tsx:35` Template `%s · Compliflow` + Marken-Titel in preise/blog/[slug]/3 Generator-Layouts/vvt/not-found → „… Compliflow · Compliflow".
- **M11 /preise OG-Widerspruch:** `app/preise/layout.tsx:10-11` OG sagt „Affiliate-Provisionen", Seite selbst (`page.tsx:241`) „Affiliate lehnen wir ab". Doppel-Metadata Page vs. Layout.
- **M12 AVV „bis zum —":** `lib/avv/contract.ts:66-67` — `getCompletionStatus` prüft `dauer.bis` nicht (Z. 399-405).
- **M13 AVV Drittland-Widersprüche:** contract.ts:222-224 („Garantien bestehen") vs. Anlage 2 „Keine geeignete Garantie" (Z. 106-108, 358); § 6a erzwingt SCC+TIA auch bei Angemessenheitsbeschluss-Ländern (Z. 86-90, 229-239).
- **M14 DSB-Hinweis mit falscher Begründung:** `lib/datenschutz/defaults.ts:969` + contract.ts:317-319 — immer „20+ Mitarbeiter", auch wenn Trigger Branche/Art.-9-Daten bei Solo war.
- **M15 Drittland-Ableitung mappt alles auf „USA":** `lib/datenschutz/types.ts:520-521,620,623` + contract.ts:198-236 — Malta/Kanada/UK-Anbieter erzeugen „USA-Transfer + DPF"-Text.
- **M16 Unbelegte Behauptungen als Fixtext:** contract.ts:685-687 „durchgeführtes TIA" unabhängig vom Flag; diverse „SCCs liegen vor"/„DPF-zertifiziert" ohne Nutzerbestätigung.
- **M17 Widerruf-Textlogik:** Verweis auf unsichtbares Datum + Betreiber-Anrede im Verbrauchertext (`defaults.ts:100`, contract.ts:245-278); digitale Inhalte bekommen Dienstleistungs-Folgentext, „gemischt" unvollständig (contract.ts:193-212); pauschaler Total-Ausschluss-Satz bei Teil-Ausschluss (`defaults.ts:131-133`, contract.ts:262).
- **M18 Manifest-Icon vermutlich 404:** `app/manifest.ts:23-28` referenziert `/apple-icon.svg` — App-Router-Konvention liefert `.svg` dort nicht aus; am Server verifizieren.

---

## NIEDRIG

- Typecheck rot: `lib/env.test.ts` nutzt Vitest-Globals ohne Typen — `"types": ["vitest/globals"]` in tsconfig fehlt (Build ist davon nicht betroffen, nur `npx tsc --noEmit`/IDE).
- `/api/health` öffentlich, ohne Rate-Limit, verrät Betriebsdetails (`lib/integrations-status.ts`).
- Upstream-Fehlerobjekte in Logs können Emails enthalten (`brevo/subscribe:94`, `actions/waitlist:73`, `confirm:80-85`).
- Email als GET-Query im Confirm-Link (`actions/waitlist.ts:70`) — landet in Access-Logs/History.
- Fake-Erfolg + 10-Min-Sperre wenn DOI-Mail scheitert (`actions/waitlist.ts:58-74`); Anti-Abuse-Maps prozess-lokal.
- checkout: ungültiges JSON → 500 statt 400 (`checkout/route.ts:47,103-106`).
- `BREVO_LIST_ID` etc. nur Präsenz-geprüft, `parseInt→NaN` möglich (`lib/brevo/client.ts:53-54`).
- Webhook ohne Idempotenz/livemode-Check (`webhook/route.ts:46-62`).
- `String.replace` ohne `$`-Escaping in AGB/Widerruf-Templates (`widerrufsbelehrung/contract.ts:122-135` u. a., `agb/contract.ts:388`) — `$&` im Firmennamen reproduziert Platzhalter. Fix: Callback-Form.
- Waitlist-Form-Reset läuft nie (`components/waitlist-form.tsx:23` — `currentTarget` im async-Callback null).
- Exit-Popup: localStorage ohne try/catch (`components/exit-popup.tsx:10,47`) — crasht bei blockiertem Storage.
- Countdown-Ziel 17.06.2026 in der Vergangenheit (`components/countdown.tsx:5`); Countdown + DocumentMockup + 3 Sektionen in `app/page.tsx` toter Code (Z. 3,5,104,342,606).
- Impressum-Dateiname: unerreichbarer Fallback (`components/impressum/pdf-download.tsx:13`).
- Stores: migrate greift nur bei Versionssprung; `lib/watermark/store.ts:42` ganz ohne migrate (`{"bought":null}` → TypeError in `isBought`).
- E2E deckt /preise, /blog, Legal-Seiten, 404 nicht ab; Waitlist-E2E feuert echte Server-Action (mit Prod-Keys: echte Mails).
- Cookie-Builder: `scriptSrc + configId` konkateniert (builder.ts:289) → kaputte URL wenn beide gesetzt; Tools deaktivierter Kategorien laden stumm nie.
- Muster-Widerrufsformular ergänzt Telefonnummer entgegen amtlicher Anlage 2 (`widerrufsbelehrung/defaults.ts:109`).
- Impressum: GenR/GnR-Kürzel verwechslungsträchtig; GbR ohne `kannRegister` trotz eGbR seit MoPeG (`lib/impressum/types.ts:274-281`, `defaults.ts:221-225`).
- SCHUFA-Klausel mit hartem Datum „ab 17.03.2026" unverifiziert (`lib/datenschutz/defaults.ts:561`).
- `\x01`-SENTINEL-Steuerzeichen im Quellcode (widerruf/agb/datenschutz contract.ts) — funktioniert, aber fragil bei Editor-Normalisierung.
- CLAUDE.md nennt `/affiliate`-Route (existiert nicht) und „VVT/Cookie geplant" (längst live).

---

## Konzeptfrage (kein Bug, aber Abweichung von der Doku)

Email-Capture: CLAUDE.md sagt „Capture VOR PDF-Download" — implementiert ist die CaptureCard überall als optionale Karte NEBEN dem bereits freigeschalteten Export. Konsistent umgesetzt, aber falls das Gate gewollt war, fehlt es in allen 7 Tools.

## Explizit geprüft und in Ordnung

- Audit-Regeln 1 (keine Wizard-PII zum Server), 2 (Validierung+Rate-Limit vor Seiteneffekt, IP-Extraktion korrekt), 3 (validateEnv laut), 7 (keine Fremdfehlertexte zum Client), 9 (HMAC-Hex-Guard) — erfüllt.
- Build-Regel standalone-nur-per-ENV eingehalten; CSP/Security-Header in next.config.js; Sitemap/Robots konsistent; Pflichtseiten vorhanden + verlinkt; Plausible-Events nur Enums; Hydration-Guards in allen 7 Wizards; XSS-Escaping in Text-HTML-Exports sauber; Credit-Backlinks in allen HTML-Buildern; Disclaimer in allen 7 Generatoren; „RStV" kommt nirgends vor.
