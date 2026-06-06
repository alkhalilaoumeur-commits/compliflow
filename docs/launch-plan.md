# AVV-Generator — Launch-Plan & Finanzmodell

> **Status:** AKTIV — Build geplant ab 2026-06-08
> **Erstellt:** 2026-06-06
> **Zweck:** Erstes Tool im DRVN-Indie-Stack — passives SEO-Asset für DACH-DSGVO-Markt

---

## 1. Die Idee in einem Satz

**Kostenloses Web-Tool, das User in 2 Minuten einen DSGVO-konformen Auftragsverarbeitungs-Vertrag (Art. 28 DSGVO) generieren lässt — Free-Tier zum Einsteigen, 29€ Pro-Tier mit Custom-Branding/DocuSign/Multi-AVV-Management.**

---

## 2. Warum dieses Tool (Quick-Recap)

- **12.000 monatliche Google-Suchen** auf "AVV Generator" + Long-Tail (insgesamt ~17.000)
- **Hohe Kaufintention** — wer das sucht, hat akuten DSGVO-Druck
- **DACH-Nische** — internationale Tools können das nicht (DACH-Recht zu spezifisch)
- **Bekannter Themen-Stack** — Ilias hat DSGVO-Skill aktiv, kennt das aus ServeFlow + DRVN
- **5-7 Tage Solo-buildbar** — Next.js + Vercel + Stripe + PDF-Gen + optional DocuSign
- **100% remote vermarktbar** — kein einziger persönlicher Termin nötig
- **Trojanisches Pferd zur DRVN-Brand** — Käufer = exakt DRVN-Zielgruppe (Agenturen, SaaS-Macher, Mittelstand)
- **Erweiterbar zur "DRVN Compliance Suite"** — Impressum, Datenschutz, Cookie-Banner als Folgetools

---

## 3. Konkurrenz-Schnellanalyse

| Anbieter | Stärke | Schwäche / Lücke für dich |
|---|---|---|
| **e-recht24.de** | Marktführer, DR 80+, Anwalt-gebrandet | Veraltete UX, schwer-navigierbar, AVV nicht das Hauptprodukt |
| **activeMind.de** | DSGVO-Consulting, hohe Authority | Enterprise-Pricing, kein modernes Self-Service-Tool |
| **datenschexpert.de** | Kostenlose Vorlagen | Statische Word-Dokumente, kein interaktiver Wizard |
| **dr-datenschutz.de** | Content-stark | Keine Tool-Generierung, nur Beratung |

**Deine Lücke:** Moderner UX-Wizard + DocuSign-Integration + Multi-AVV-Verwaltung + DACH-2026-Specifika (Schrems II, US-Drittländer, KI-Verarbeitung) + DRVN-Brand-Niveau-Design.

---

## 4. MVP-Scope (zu finalisieren am 2026-06-08)

### Pflicht für Tag-1-Launch (Tier 1)

- [ ] Mehrstufiger Wizard (5-7 Schritte)
- [ ] Live-Vorschau des Vertrags während der Eingabe
- [ ] PDF-Generierung (Server-Side, React-PDF oder Puppeteer)
- [ ] Free-Tier: Generierung mit "Powered by DRVN"-Footer
- [ ] Pro-Tier (29€ One-Time): ohne Footer + Custom-Logo + Custom-Farben
- [ ] Email-Capture vor Download (Lead-Magnet-Funktion)
- [ ] Stripe-Checkout für Pro
- [ ] Datenschutzerklärung + Impressum für DAS Tool selbst (Tool-Eigene Compliance!)

### Phase 2 (nach Launch)

- [ ] DocuSign-Integration (Pro+) — direkter Signatur-Versand
- [ ] Multi-AVV-Management (Agenturen): mehrere AVVs verwalten + updaten
- [ ] Subscription-Variante: 19€/M für unlimited Pro
- [ ] AVV-Update-Service: bei DSGVO-Änderung Benachrichtigung + Neu-Generierung

### Explizit NICHT für MVP (Scope-Creep-Schutz)

- ❌ User-Accounts mit Login (Magic-Link Mail reicht)
- ❌ Multi-Language (DACH only)
- ❌ Mobile-App
- ❌ Slack/Teams-Integration
- ❌ Vertragshistorie über 30 Tage Free / 1 Jahr Pro
- ❌ Eigene Anwalts-Beratungs-Funktion (Haftungs-Risiko!)

---

## 5. Tech-Stack-Entscheidung

| Layer | Tool | Begründung |
|---|---|---|
| Frontend | Next.js 14 + Tailwind | Standard-Stack, SEO-tauglich |
| Backend | Next.js API Routes | Solo-buildbar, kein Server-Management |
| Datenbank | Supabase (PostgreSQL) | Auth + DB + Storage in einem |
| PDF-Gen | React-PDF oder Puppeteer | Self-hosted, keine Externalkosten |
| Payment | Stripe (Live für DACH) | Bewährt, EU-USt automatisch via Stripe Tax |
| Hosting | Vercel | Vercel-Hobby reicht erstmal (Pro 240€/J wenn nötig) |
| Email | Resend | Bewährt aus ServeFlow-Setup |
| Analytics | Plausible (DRVN-Konto) | DSGVO-konform aus Prinzip (wir sind DSGVO-Tool!) |
| Search Console | Google + Bing Webmaster | SEO-Tracking Pflicht |

---

## 6. Pricing-Modelle (Entscheidung offen, 3 Optionen)

### Option A — Pure One-Time (einfachster Launch)

- Free: AVV mit DRVN-Footer + Email-Capture
- **Pro: 29€ One-Time** = Single AVV ohne Footer + Custom-Branding

**Pro:** Einfach kommunizierbar, schneller First Sale, niedrige Hürde
**Con:** Kein MRR-Aufbau, jeden Monat von Null

### Option B — Pure Subscription

- Free: 1 AVV/Monat mit Footer
- **Pro: 9€/M** = Unlimited AVVs + Branding + History

**Pro:** MRR baut sich auf, planbarer
**Con:** Höhere Kaufhürde, Churn-Risiko, viele User brauchen nur 1× AVV

### Option C — Hybrid (EMPFOHLEN)

- Free: AVV mit DRVN-Footer (unbegrenzt)
- **Pro Single: 29€ One-Time** = 1× AVV ohne Footer + Branding
- **Pro Agency: 19€/M Sub** = Unlimited + DocuSign + Multi-AVV-Mgmt

→ User wählt was zu seinem Bedarf passt. Erwartung: 60% One-Time, 40% Sub.

**Entscheidung dazu am Sonntag/Montag finalisieren.**

---

## 7. Finanz-Modell (3 Szenarien)

### Annahmen
- Markt-Decke DACH: ~17.000 Suchen/M total
- Top-3-Ranking = 30-50% Click-Share = max 5.000-8.500 Visits/M
- Visit → Free-Tier: 8-15% (hohe Intent)
- Free → Pro: 2-5%
- Effektiv Visit → Pro: 0,2% bis 0,7%

### Year 1 Übersicht

| Szenario | Monat 1 | Monat 3 | Monat 6 | Monat 12 | **Total Y1** |
|---|---|---|---|---|---|
| **Pessimistisch** | 30€ | 150€ | 450€ | 950€ | **~5.000€** |
| **Realistisch** | 90€ | 350€ | 1.100€ | 2.300€ | **~13.500€** |
| **Optimistisch** | 200€ | 700€ | 2.400€ | 4.800€ | **~28.000€** |

### Realistisches Szenario — Monat für Monat

| Monat | Visits | Free-SignUps | Pro-Käufe | Revenue M | Kumuliert |
|---|---|---|---|---|---|
| 1 | 800 | 80 | 3 | 90€ | 90€ |
| 2 | 1.200 | 120 | 5 | 160€ | 250€ |
| 3 | 2.000 | 220 | 9 | 290€ | 540€ |
| 4 | 3.200 | 380 | 16 | 510€ | 1.050€ |
| 5 | 4.500 | 540 | 24 | 770€ | 1.820€ |
| 6 | 6.000 | 720 | 33 | 1.080€ | 2.900€ |
| 9 | 8.500 | 1.080 | 53 | 1.700€ | 7.400€ |
| 12 | 10.000 | 1.260 | 67 | 2.160€ | **13.430€** |

### Year 2 + 3 (SEO-Compound)

| Jahr | Avg. MRR | Total Revenue | Kumuliert ab Launch |
|---|---|---|---|
| Jahr 1 | 1.100€/M | 13.500€ | 13.500€ |
| Jahr 2 | 2.500€/M | 30.000€ | 43.500€ |
| Jahr 3 | 3.200€/M | 38.400€ | **81.900€** |

### Kosten (Y1)

| Position | Y1 |
|---|---|
| Stripe-Fees | ~250€ |
| Vercel Pro | 0-240€ |
| DocuSign API | ~1.200€ |
| Domain + Misc | 50€ |
| **Total Kosten** | **~1.800€ (13%)** |
| **Net Y1** | **~11.700€** |
| **Steuern (~25%)** | -2.900€ |
| **Cash in Tasche Y1** | **~8.800€** |

### Bottom Line

**Realistisch: ~8-9k€ Cash Y1 / ~22k€ Y2 / ~28k€ Y3 — über 3 Jahre kumuliert ~55-60k€ netto aus EINEM Tool.**

Multipliziert mit 3-4 Tools im Indie-Stack → **80-150k€/Jahr nach 2 Jahren** möglich.

---

## 8. Was zwischen Pessimistisch und Optimistisch entscheidet

### Killer (drücken in Pessimistisch)

- e-recht24 reagiert und veröffentlicht eigenes Tool → -50% Traffic
- <8 SEO-Artikel veröffentlicht → -40% Traffic-Wachstum
- <15 Backlinks → SEO bleibt Seite 3-5
- Conversion <0,3% (schlechte UX/Pitch) → -60% Sales
- DSGVO-Reform → Re-Build nötig

### Hebel (heben in Optimistisch)

- Top-3-Ranking "AVV Generator" ab Monat 6 → +100% Traffic
- Affiliate-Partnerschaft 1 großer Steuerberater → +30-50 Pro/M direkt
- Newsletter-Liste 5.000+ in Monat 12 → Cross-Sell für Tool 2+3
- Compliance-Suite-Bundle (3 Tools für 99€) ab Monat 9 → +50% ARPU
- t3n/OMR/Heise "Tool des Monats" → +10k Visits-Buckel

---

## 9. Marketing-Plan (siehe 13-strategie-sommer-2026.md für Gesamt-Roadmap)

### Launch-Day-Liste (Pflicht)

**Mittwoch 17.06.2026 (vorgesehen):**
1. Product Hunt Launch (00:01 PST = 9:01 deutsche Zeit)
2. Indie Hackers Launch-Post
3. Hacker News Show HN
4. LinkedIn-Post mit PH-Link
5. Reddit r/SideProject + r/SaaS + r/Datenschutz

### Listings (Woche 2-4)

**Tier 1 (Pflicht):** Product Hunt, Indie Hackers, Hacker News, BetaList, OMR Reviews, t3n Tool-Tipps, Capterra DE, GetApp DE, trusted.de, SaaSHub

**Tier 2 (Empfohlen):** AlternativeTo, G2, Toolify, Gründerszene, deutsche-startups.de, Crunchbase, F6S, drvn-deals, Microlaunch

**Tier 3 (DSGVO-spezifisch — Goldgrube):** datenschutz-praxis.de, dr-datenschutz.de, datenschutzbeauftragter-info.de, activeMind, Bitkom, DSGVO-Hilfe-Forum, eRecht24 Partner

### Content-Hub (12 SEO-Artikel über 4 Monate)

Pflicht-Artikel (Titel + Keyword):

1. "AVV nach DSGVO Art. 28 — Vollständiger Leitfaden 2026" — `AVV DSGVO` (4.500/M)
2. "Brauche ich einen AVV mit Google Workspace? Ja, hier ist warum" — `AVV Google Workspace` (900/M)
3. "AVV-Pflicht für Steuerberater-Mandanten — Checkliste" — `AVV Steuerberater` (600/M)
4. "AVV vs. Joint-Controller-Vereinbarung — wann was?" — `Joint Controller AVV` (400/M)
5. "5 typische Fehler im AVV-Vertrag (mit echten Bußgeld-Fällen)" — `AVV Bußgeld` (300/M)
6. "AVV-Mustervertrag — kostenlos, DSGVO-konform, in 2 min" — `AVV Mustervertrag kostenlos` (1.800/M)
7. "AVV mit US-Anbietern nach Schrems-II / Privacy Shield 2.0" — `AVV Schrems II` (700/M)
8. "AVV-Vorlage 2026: Was hat sich gegenüber 2024 geändert?" — Trend-Hook
9. "AVV mit KI-Tools: ChatGPT, Claude, Midjourney — was musst du wissen?" — `AVV ChatGPT` (~500/M, wachsend)
10. "Auftragsverarbeiter-Vertrag oder Joint-Controller-Vereinbarung?" — `Auftragsverarbeiter` (3.200/M)
11. "DSGVO-Bußgelder 2025: Top-10-Fälle wegen fehlendem AVV" — Authority-Aufbau
12. "Kostenlose AVV-Vorlage vs. anwaltlich geprüfter Generator — was lohnt?" — Comparison-SEO

---

## 10. Risiken (transparent)

| Risiko | Wahrscheinlichkeit | Mitigation |
|---|---|---|
| e-recht24 reagiert mit eigenem Tool | mittel | Schneller sein, bessere UX, DACH-2026-Specifika betonen |
| Du verlierst Geduld in Monat 3 | hoch (klassischer Fehler) | Strikter 4-Monats-Commit, KPIs wöchentlich tracken |
| Conversion-Rate <0,3% | mittel | A/B-Test ab Monat 2, Heatmap mit PostHog |
| DocuSign-Kosten überraschen | mittel | Erst nach 50 Pro-Käufen integrieren |
| Haftungs-Risiko durch fehlerhaften AVV | niedrig (Vorlage = kein Anwalts-Rat) | Disclaimer + "Vorlage ohne Rechtsberatung"-Hinweis prominent |
| Domain-Brand-Konflikt | niedrig | Vor Registrierung Markenrecherche DPMA |

---

## 11. Sofort-Todos (Stand 2026-06-06)

- [ ] **Domain-Kandidaten checken** (Sa-So): compliflow.de, compliflow.de, drvn-avv.de, avv-tool.de
- [ ] **Pricing-Modell entscheiden** (Mo 08.06.): A/B/C
- [ ] **Repo + Vercel + Stripe-Test-Mode** (Mo 08.06.): Skeleton
- [ ] **Wizard-UI bauen** (Di-Do 09.-11.06.)
- [ ] **PDF-Generierung** (Fr 12.06.)
- [ ] **Free-Tier komplett + Email-Capture** (Mo-Di 15.-16.06.)
- [ ] **Landing-Page SEO-optimiert** (Mi 17.06. vormittags)
- [ ] **LAUNCH 17.06.** abends → Product Hunt + Indie Hackers + Hacker News
