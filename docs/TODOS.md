# Compliflow — Todos & Status

**Letzte Aktualisierung:** 2026-06-17
**Aktueller Sprint:** Generator-Vollständigkeits-Audit (Sprint C)
**Build-Status:** ✅ TypeScript clean, Production-Build clean (alle 37 Routen kompilieren)
**Branch:** main

---

## 🎯 Wo wir gerade sind

Wir laufen den **Vollständigkeits-Audit aller 7 Generatoren** Schritt für Schritt durch.
Pro Generator: Coverage gegen geltendes Recht prüfen → CRITICAL/HIGH/MEDIUM/LOW Findings → Sprint A (nur CRITICAL+HIGH) ODER B (CRITICAL+HIGH) ODER C (alles) entscheiden → Fixes implementieren → Type-Check + Build.

**Stand 2026-06-17 abends:** 5 von 7 Generatoren auf Sprint-C-Niveau (~99 % Coverage). 2 Generatoren noch offen.

---

## ✅ Generatoren — Auditiert & gefixt

### 1. Impressum-Generator — Sprint B (~95 % Coverage)
Status: **fertig**
Was drin: § 5 DDG (ehem. TMG), § 18 MStV, § 34 GewO-Erlaubnisarten (Makler, Versicherer, Finanzberater, Inkasso, Rechtsdienstleister), AG-Aufsichtsratsvorsitzender, Vereinszusatz e.V./Stiftung, Berufshaftpflicht, V.i.S.d.P.-Klarstellung, Aufsichtsbehörde-statt-Kammer-Fix.

### 2. Widerruf-Generator — Sprint B (~95 % Coverage)
Status: **fertig**
Was drin: Anhang § 312f BGB Muster, alle 7 Leistungstypen, § 357a Abs. 3 BGB (Zahlungsmittel-Wahl), § 356 Abs. 3 BGB Fristverlängerung, BGH 2020 Telefon-Pflicht, korrekte Ausschluss-Codes nach § 312g BGB (Reparatur, Personenbeförderung, Edelmetall-Marktbindung), Versicherung/Kredit-Warnung.

### 3. AVV-Generator — Sprint B (~99 % Coverage)
Status: **fertig**
Was drin: alle CRITICAL Art. 28 Pflicht-Klauseln, TIA nach EDPB Recommendations 01/2020, eIDAS-Formklausel, Art. 83 Bußgeld-Trennung im Innenverhältnis, Schrems-II/SCC 2021/914 Modul 2/3, Verschwiegenheits-Form, 24h-Meldung als vertragliche Verschärfung markiert, **AI Act Art. 25 ab 02.08.2026** (§ 4 Abs. 6).

### 4. VVT-Generator — Sprint C (~99 % Coverage)
Status: **fertig**
Was drin: **Auftragsverarbeiter-Modus** (Art. 30 Abs. 2) zusätzlich zum Verantwortlichen-Modus, Pflicht-Quiz nach Abs. 5, Art. 26 Joint-Controller pro Tätigkeit (Meta Pixel etc.), Art. 27 EU-Vertreter strukturiert, Datenherkunft Art. 13/14, LIA als 3-Stufen-Prüfung, DSFA-Status (4 Stufen), KI-System-Block pro Tätigkeit (AI Act), SCHUFA-2026/EuGH-C-634/21 Hinweis bei Bonität (geschärft), Übersichtsmatrix im PDF, letzte-Prüfung pro Tätigkeit, AVV-Dokument-Link bei Empfänger.

### 5. AGB-Generator — Sprint C (~99 % Coverage)
Status: **fertig**
Was drin: § 312j Button-Lösung in B2C-Shop + Buchung, § 312k Kündigungsbutton-Klausel + URL-Feld, FairKonG Erstlaufzeit max. 24M + Verlängerungskündigung max. 30T, §§ 327 ff. BGB komplett (Updates, Sicherheitspatches, § 475e Verjährung), § 312i Eingabefehler + Vertragstext-Speicherung, § 309 Nr. 5 BGB Storno-Schutz, VSBG-Variante teilnahmebereit ja/nein, M1 Force Majeure, M2 SaaS-SLA, M3 Nutzungsrechte 3-stufig + Geräte-Limit, M4 Vertraulichkeit, M5 § 327g, M6 KU-Grammatik gefixt, M7 Daten-Export, L1 Schiedsklausel (DIS), L2 Skonto-Nummerierung, L3 Validation.

---

## 🟡 Generatoren — Audit noch ausstehend

### 6. Datenschutz-Generator — Sprint C ausstehend
**Letzter bekannter Coverage-Stand:** ~63 % (aus DSGVO-Audit vor Sprint-Fixes)
**Was muss geprüft werden:**
- Art. 13 / 14 DSGVO Pflichtangaben vollständig?
- Rechtsgrundlagen je Modul korrekt?
- TDDDG § 25 Cookie-Klauseln 2026-konform (statt TTDSG)
- AI Act Art. 50 Transparenzpflicht ab 02.08.2026
- SCHUFA-EuGH-C-634/21 + freiwillige SCHUFA-Score-Reform (gleicher Hinweis wie VVT)
- Branchen-Sonderklauseln (Arzt § 22 BDSG, Anwalt § 203 StGB)
- Joint-Controller-Klausel Meta Pixel nach Art. 26 DSGVO
- Newsletter-Bestandskundenprivileg § 7 Abs. 3 UWG + EuGH C-654/23
- Drittland-Transfer DPF/SCCs Doppelabsicherung

**Erwartete Findings:** mehrere CRITICAL + HIGH (analog AVV-Niveau).

### 7. Cookie-Banner-Generator — Audit ausstehend
**Was muss geprüft werden:**
- TDDDG § 25 (NICHT mehr TTDSG)
- Granularität der Einwilligung pro Zweck
- Widerrufsmöglichkeit gleich einfach wie Einwilligung
- Pre-Checked Boxes (verboten)
- „Alle ablehnen"-Button auf gleicher Ebene wie „Alle akzeptieren" (BGH/EuGH-Linie)
- Dark-Pattern-Audit (z.B. „Alle akzeptieren" optisch dominant)
- TCF 2.2-Kompatibilität
- AI-Act-Hinweis (Chatbot/KI auf der Seite)

---

## 🟡 Parallele Tracks — offen

### Email & Payment Funnel
- [ ] **Stripe-Produkt 0,99 € Watermark-Removal** in Live-Stripe anlegen ([docs/WATERMARK-STRIPE-SETUP.md](WATERMARK-STRIPE-SETUP.md))
- [ ] **Brevo-Account aktivieren**, API-Key in `.env` ([docs/BREVO-SETUP.md](BREVO-SETUP.md))
- [ ] **Double-Opt-In-Pipeline** end-to-end testen (Confirm-Token + Brevo-Hook)
- [ ] **Email-Workflow nach Generator-Submit:** Erfolgs-Mail mit PDF-Link + Erinnerung an 0,99 € Watermark-Removal
- [ ] **Zwischenseite "Generierung läuft …"** zwischen Submit und PDF-Download
- [ ] **Felder-Reset-Button** auf Wizard-Shell

### Recherche & Compliance-Living-Docs
- [ ] **Daily Telegram Research Bot** (Bot-Token noch offen — User triggert manuell)
- [ ] **Rechtsänderungen-2026 Master-Doc** anlegen: SCHUFA, AI Act, FairKonG, § 31 BDSG-Entwurf, Hinweisgeberschutzgesetz
- [ ] **AI Act KI-Kompetenz Memo (Art. 4)** für Ilias persönlich — 1 Seite, Vault: `~/vault/agency/intern/ai-kompetenz-memo.md`

### Pre-Launch / Marketing
- [ ] **e-recht24-Vergleichs-USPs** aus Sprint-Cs in Landing-Copy heben:
  - VVT: einziger free Generator mit Art. 30 Abs. 2 Auftragsverarbeiter-Modus
  - AVV: AI Act Art. 25 ab 02.08.2026 nur bei Compliflow
  - AGB: § 312k Kündigungsbutton, §§ 327 ff. komplett, FairKonG
- [ ] **Pre-Launch-Verification-Playbook abarbeiten** ([docs/PRE-LAUNCH-VERIFICATION-PLAYBOOK.md](PRE-LAUNCH-VERIFICATION-PLAYBOOK.md))
- [ ] **Production-Deploy** nach Audits 6+7 + Stripe + Brevo aktiv

### Embed (Phase 2, Monat 2-3 nach Launch)
- [ ] Auto-Update Block-Modell ([memory: Compliflow Embed-Architektur](https://example.com))
- [ ] Customer-Features als Filter
- [ ] Diff-Engine für Overrides
- [ ] Premium-Embed 7 € / M ab Monat 2-3 (eigentlicher Hebel laut Strategie-Memo)

---

## 🟢 Erledigt heute (2026-06-17)

- Schriften-Audit + Tools-Dropdown + Hero-Refactor (Higgsfield-Bild)
- Landing von 13 → 8 Sektionen kompakter
- Dev-Cache-Crash permanent gefixt via `next.config.js` no-store-Headers im Dev-Mode
- AVV Sprint B (Audit 3/7) — 3 CRITICAL + 5 HIGH durch
- VVT Sprint C (Audit 4/7) — 1 CRITICAL + 4 HIGH + 5 MEDIUM + 2 LOW
- AGB Sprint C (Audit 5/7) — 3 CRITICAL + 5 HIGH + 7 MEDIUM + 3 LOW
- SCHUFA-Hinweis im VVT geschärft (EuGH C-634/21 bleibt verbindlich, SCHUFA-Score-Reform als freiwillig markiert, § 31 BDSG-Reform als Entwurf gekennzeichnet)
- AI-Act-Status mit Ilias durchgesprochen (Hochrisiko trifft nicht zu; Art. 4 Memo offen; Art. 50 ab 02.08.2026 nur für Higgsfield-Bilder + ggf. Chatbot)

---

## 📍 Nächster konkreter Schritt

**Audit 6/7 — Datenschutz-Generator starten.**

User-Trigger: „weiter" → ich liefere zuerst den Coverage-Bericht, dann Sprint-A/B/C-Auswahl.

Wenn Datenschutz fertig: **Audit 7/7 Cookie-Banner**, dann **Pre-Launch-Verification-Playbook** abarbeiten und Production-Deploy.
