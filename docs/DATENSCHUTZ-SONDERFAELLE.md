# Datenschutzerklärung — Vollständige Sonderfall-Analyse 2026

> **Erstellt:** 2026-06-13
> **Zweck:** Vollständige Liste aller Sonderfälle die im Compliflow Datenschutz-Generator abgefragt werden müssen
> **Letzte Rechtslage:** Stand 06/2026 — TDDDG seit 14.05.2024, BDSG-neu Juli 2025, AI Act Transparenz ab 02.08.2026, SCHUFA-Reform 17.03.2026
> **Quellen:** DSGVO, BDSG, TDDDG, DDG, AI Act, HinSchG, NIS2, BGH-Urteile 2025, DSK-Orientierungshilfen

---

## TEIL 1 — RECHTSGRUNDLAGEN & GESETZESLAGE

### 1.1 Primärgesetze

| Gesetz | Was regelt | Status |
|---|---|---|
| **DSGVO (EU)** | Datenverarbeitung gesamt | gültig seit 25.05.2018 |
| **BDSG** | Deutsche Konkretisierungen DSGVO | aktuell BDSG-neu Juli 2025 |
| **TDDDG** (ehem. TTDSG) | Cookies, Tracking, Endgerätzugriff | gültig seit 14.05.2024 |
| **DDG** (ehem. TMG) | Impressum, digitale Dienste | gültig seit 14.05.2024 |
| **AI Act (EU)** | KI-Systeme, Transparenz | Transparenzpflichten ab 02.08.2026 |
| **HinSchG** | Hinweisgeberschutz | gültig seit 02.07.2023 |
| **NIS2** | Cybersicherheit | gültig seit 17.10.2024 |
| **TKG** | Telekommunikation | aktuell 2021 |
| **UWG** | Werbung, § 7 Spam | aktuell 2022 |
| **PSD2** | Zahlungsdienste | aktuell 2018 |
| **GeschGehG** | Geschäftsgeheimnisse | aktuell 2019 |

### 1.2 Wichtigste DSGVO-Artikel für Datenschutzerklärung

| Artikel | Inhalt |
|---|---|
| **Art. 6** | Rechtsgrundlagen (a-f) |
| **Art. 7** | Bedingungen für Einwilligung |
| **Art. 9** | Besondere Kategorien (Gesundheit, Religion, etc.) |
| **Art. 13** | Informationspflichten bei Direkterhebung |
| **Art. 14** | Informationspflichten bei Dritterhebung |
| **Art. 15** | Auskunftsrecht |
| **Art. 16** | Berichtigung |
| **Art. 17** | Löschung |
| **Art. 18** | Einschränkung |
| **Art. 20** | Datenübertragbarkeit |
| **Art. 21** | Widerspruch |
| **Art. 22** | Automatisierte Entscheidungen + Profiling |
| **Art. 28** | Auftragsverarbeitung |
| **Art. 35** | Datenschutz-Folgenabschätzung (DSFA) |
| **Art. 37-39** | Datenschutzbeauftragter |
| **Art. 44-49** | Drittlandtransfer |

### 1.3 Aktuelle BGH-Urteile + Behördenvorgaben 2025/2026

- **BGH 2025**: Reject-All-Button muss auf erster Cookie-Banner-Ebene gleich prominent sein wie Accept-All
- **DSK 2024**: Cookie-Einwilligung muss alle 12 Monate erneuert werden
- **EuGH C-446/21 (Schrems II)**: Drittlandtransfer braucht TIA (Transfer Impact Assessment)
- **BGH I ZR 90/20**: Direktwerbung an Bestandskunden zulässig nur unter strengen Voraussetzungen
- **EuGH C-634/21**: SCHUFA-Score-Bildung = automatisierte Entscheidung nach Art. 22 DSGVO

---

## TEIL 2 — SONDERFALL-KATALOG (40 Fälle)

Jeder Sonderfall hat:
- **Was:** Worum geht's
- **Trigger-Frage:** Wie erkennt der Fragebogen dass dieser Fall greift?
- **Rechtsgrundlage:** Art./§
- **Was muss in die Datenschutzerklärung**
- **Besonderheiten/Stolperfallen**

---

### Kategorie A — Webseiten-Basis (immer)

#### A1 — Hosting & Server-Log-Dateien
- **Was:** Jede Webseite hat einen Hoster, Server-Logs werden automatisch erstellt
- **Trigger:** Immer (Pflichtteil)
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
- **Pflicht:** Hoster-Name, Anschrift, Datenkategorien (IP, Zugriffszeit), Speicherdauer
- **Stolperfalle:** US-Hosting (Vercel/Cloudflare) braucht zusätzlich DPF-Hinweis + SCCs

#### A2 — SSL/TLS-Verschlüsselung
- **Was:** Hinweis dass die Verbindung verschlüsselt ist
- **Trigger:** Immer (Pflicht)
- **Rechtsgrundlage:** Art. 32 DSGVO
- **Pflicht:** Standard-Hinweis "Diese Webseite nutzt SSL/TLS-Verschlüsselung"

#### A3 — Cookies (technisch notwendig)
- **Was:** Session-Cookies, CSRF-Token, Spracheinstellung
- **Trigger:** Immer (jede dynamische Webseite)
- **Rechtsgrundlage:** § 25 Abs. 2 Nr. 2 TDDDG (technisch erforderlich = kein Consent)
- **Pflicht:** Auflistung + Zweck + Speicherdauer

#### A4 — Cookies (consent-pflichtig)
- **Was:** Analytics, Marketing, Social Media, Funktional
- **Trigger:** Werden überhaupt nicht-essentielle Cookies/Tracker gesetzt?
- **Rechtsgrundlage:** § 25 Abs. 1 TDDDG + Art. 6 Abs. 1 lit. a DSGVO
- **Pflicht:** Cookie-Banner Pflicht, Widerruf möglich, Reject-All gleich prominent
- **Stolperfalle BGH 2025:** Reject-All-Button muss SOFORT sichtbar sein, nicht hinter "Settings"

#### A5 — Allgemeine Betroffenenrechte
- **Was:** Auskunft, Berichtigung, Löschung, Einschränkung, Übertragbarkeit, Widerspruch, Widerruf, Beschwerderecht
- **Trigger:** Immer (Pflicht)
- **Rechtsgrundlage:** Art. 15-22 + Art. 77 DSGVO

#### A6 — Verantwortlicher
- **Was:** Wer betreibt die Webseite und ist für DSGVO verantwortlich
- **Trigger:** Immer
- **Rechtsgrundlage:** Art. 13 Abs. 1 lit. a DSGVO
- **Pflicht:** Name, Anschrift, Kontakt
- **Sonderfall:** Joint Controller (Art. 26 DSGVO) wenn 2 Verantwortliche gemeinsam

---

### Kategorie B — Wer betreibt die Seite

#### B1 — Datenschutzbeauftragter
- **Was:** DSB ist Pflicht bei bestimmten Konstellationen
- **Trigger-Frage:** Mehr als 20 Beschäftigte ständig in automatisierter Datenverarbeitung? ODER besondere Kategorien (Art. 9) verarbeitet? ODER systematische Überwachung von Personen?
- **Rechtsgrundlage:** § 38 BDSG + Art. 37 DSGVO
- **Pflicht wenn aktiv:** Name + Kontakt + Hinweis "extern bestellt" wenn zutreffend
- **Stolperfalle:** Sub-20-Personen aber Arztpraxis/Personalvermittlung/Videoüberwachung → trotzdem Pflicht

#### B2 — Joint Controller (gemeinsame Verantwortliche)
- **Was:** 2+ Unternehmen verantworten Verarbeitung gemeinsam
- **Trigger-Frage:** Nutzt Du Facebook Custom Audiences, Google Analytics Audience-Sharing, oder ähnliche Plattform-Funktionen?
- **Rechtsgrundlage:** Art. 26 DSGVO
- **Pflicht:** Joint-Controller-Vereinbarung erwähnen + Wesentliche Inhalte der Vereinbarung bereitstellen

#### B3 — Verein / Stiftung / e.V.
- **Was:** Vereine haben eigene Datenschutzaspekte (Mitgliederliste, Beitragszahlungen, Vorstand)
- **Trigger-Frage:** Bist du Verein/Stiftung mit Mitgliedern?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vereinszweck = Vertragsdurchführung)
- **Pflicht:** Mitgliederdaten-Verarbeitung, ggf. Vorstandsbild im Internet, Spendenmanagement

#### B4 — Schule / Bildungseinrichtung / Behörde
- **Was:** Öffentliche Stellen haben strengere Anforderungen + landesspezifisches Datenschutzgesetz
- **Trigger-Frage:** Bist du öffentliche Stelle?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. e DSGVO + Landesdatenschutzgesetze
- **Pflicht:** Aufsichtsbehörde-Hinweis, ggf. § 35 BDSG (Forschung) erwähnen

---

### Kategorie C — Tracking & Analytics

#### C1 — Web-Analytics ohne Cookies (Plausible, Fathom, Umami)
- **Trigger:** Nutzt du eines dieser Tools?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO
- **Pflicht:** Anbieter + Hinweis "cookieloses Analytics, keine personenbezogene Verarbeitung"

#### C2 — Web-Analytics mit Cookies (Google Analytics 4, Matomo mit Cookies, Hotjar, Microsoft Clarity)
- **Trigger:** Nutzt du eines dieser Tools?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) + § 25 Abs. 1 TDDDG
- **Pflicht:** Cookie-Banner Pflicht, Anbieter, IP-Anonymisierung, ggf. DPF/SCCs bei US-Anbieter

#### C3 — Session-Recording / Heatmaps (Hotjar, Microsoft Clarity, Mouseflow)
- **Trigger:** Werden Mausbewegungen/Klicks aufgezeichnet?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO + § 25 Abs. 1 TDDDG
- **Pflicht:** Klare Information was aufgezeichnet wird, Möglichkeit zum Widerspruch

#### C4 — Affiliate-Tracking (impact.com, Awin, eigene Affiliate-IDs)
- **Trigger:** Werden Klicks auf Partner-Links getrackt?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse Provision)
- **Pflicht:** Hinweis auf Affiliate-Tracking + verwendete Tracking-Methode

#### C5 — Remarketing / Retargeting (Google Ads Remarketing, Meta Pixel, LinkedIn Insight)
- **Trigger:** Werden Besucher-Daten für Werbung wiederverwendet?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO + § 25 Abs. 1 TDDDG
- **Pflicht:** Strenge Einwilligung, DPF/SCCs für US-Anbieter, Joint Controller bei Meta Pixel

#### C6 — Conversion-Tracking (Google Ads, Meta Conversions API, LinkedIn)
- **Trigger:** Werden Käufe/Anmeldungen für Werbeoptimierung getrackt?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO + § 25 Abs. 1 TDDDG

#### C7 — Server-Side-Tracking (GTM Server-Side)
- **Trigger:** Wird Tracking vom Server statt vom Browser ausgeführt?
- **Rechtsgrundlage:** Trotzdem Einwilligung nach DSK-Beschluss 2024
- **Stolperfalle:** Server-Side macht KEINE Consent-Pflicht überflüssig

---

### Kategorie D — Kommunikation

#### D1 — Kontaktformular
- **Trigger:** Gibt es ein Formular zur Anfrage?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) ODER lit. f
- **Pflicht:** Daten + Zweck + Speicherdauer + Rechtsgrundlage

#### D2 — Newsletter (Single Opt-In / Double Opt-In)
- **Trigger:** Sammelst du Emails für Newsletter?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO + § 7 UWG
- **Pflicht:** Double-Opt-In ist FAKTISCH Pflicht (sonst UWG-Verstoß), Anbieter, Tracking-Hinweis (Open/Click)
- **Stolperfalle:** Single Opt-In = Abmahnrisiko

#### D3 — Marketing-Emails an Bestandskunden (§ 7 Abs. 3 UWG)
- **Trigger:** Schickst du Werbung an Kunden ohne separate Einwilligung?
- **Rechtsgrundlage:** § 7 Abs. 3 UWG (4 Voraussetzungen erfüllt?)
- **Pflicht:** Hinweis dass Email aus Kauf erhoben wurde + Widerspruchsmöglichkeit

#### D4 — Live-Chat (Crisp, Intercom, Tawk.to, eigener Bot)
- **Trigger:** Gibt es einen Chat auf der Seite?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO + § 25 Abs. 1 TDDDG
- **Pflicht:** Anbieter, was wird übertragen, ggf. AI-Hinweis (NEU 2026 AI Act)

#### D5 — KI-Chatbot (ChatGPT-basiert, Claude-basiert, eigene LLM-Lösung)
- **Trigger:** Ist der Chatbot KI-basiert (generativ)?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a/b DSGVO + AI Act Art. 50
- **Pflicht NEU 2026:** Sichtbarer Hinweis "Ich bin eine KI" AM CHATBOT (nicht versteckt in DSE), Datenschutzklausel zur LLM-Verarbeitung, AVV mit KI-Anbieter, AI-Provider-Hinweis (OpenAI, Anthropic etc.)
- **Stolperfalle AI Act:** Hinweis muss am Touchpoint sein, NICHT nur in Datenschutzerklärung

#### D6 — Webinare / Video-Calls (Zoom, Microsoft Teams, Webex, Google Meet)
- **Trigger:** Werden Webinare/Meetings mit Aufzeichnung veranstaltet?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a + b DSGVO
- **Pflicht:** Anbieter, Aufzeichnungs-Hinweis, DPF/SCCs für US-Anbieter

#### D7 — Push-Notifications (Browser-Push, Web Push API)
- **Trigger:** Werden Browser-Push-Nachrichten gesendet?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO + § 25 Abs. 1 TDDDG
- **Pflicht:** Endgerät-Token wird gespeichert, Widerruf möglich

---

### Kategorie E — Login & User-Accounts

#### E1 — Kundenkonto / Registrierung
- **Trigger:** Gibt es einen Login-Bereich?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragsdurchführung)
- **Pflicht:** Datenkategorien, Speicherdauer, Löschung bei Inaktivität

#### E2 — Social Login (OAuth) — Google / Facebook / Apple / GitHub
- **Trigger:** Login via Drittanbieter möglich?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a + b DSGVO
- **Pflicht:** Welcher Anbieter, welche Daten werden übertragen, DPF/SCCs bei US-Anbieter

#### E3 — Single Sign-On (SSO) für Unternehmen
- **Trigger:** B2B-SSO via Microsoft/Okta?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO

#### E4 — Multi-Factor-Authentication (MFA)
- **Trigger:** Wird Telefonnummer für 2FA gespeichert?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (Sicherheit)
- **Pflicht:** Wenn SMS-2FA: SMS-Anbieter benennen

#### E5 — Account-Inaktivität / automatische Löschung
- **Trigger:** Wann werden inaktive Accounts gelöscht?
- **Rechtsgrundlage:** Art. 17 DSGVO + Art. 5 Abs. 1 lit. e (Speicherbegrenzung)
- **Pflicht:** Konkrete Frist (z.B. 24 Monate Inaktivität → Löschung)

---

### Kategorie F — E-Commerce / Shop

#### F1 — Bestellabwicklung
- **Trigger:** Werden Bestellungen entgegengenommen?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO

#### F2 — Zahlungsabwicklung (Stripe, PayPal, Klarna, etc.)
- **Trigger:** Welche Zahlungsanbieter werden genutzt?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO
- **Pflicht:** Anbieter, was übertragen wird, ggf. DPF/SCCs

#### F3 — Bonitätsprüfung (SCHUFA, Creditreform, infoscore, CRIFBÜRGEL)
- **Trigger:** Wird bei Rechnung/Lastschrift Bonität geprüft?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) + Art. 22 DSGVO
- **Pflicht NEU 2026 (SCHUFA-Reform):** Hinweis auf neuen SCHUFA-Score (100-999) + Logik der automatisierten Entscheidung (EuGH C-634/21 verlangt Erklärung)
- **Stolperfalle:** Bonität ist automatisierte Entscheidung nach Art. 22 — User hat Recht auf menschliche Überprüfung

#### F4 — Versanddienstleister (DHL, Hermes, DPD, GLS, UPS)
- **Trigger:** Versendet ihr Waren?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO
- **Pflicht:** Versender benennen

#### F5 — Retouren & Reklamation
- **Trigger:** Werden Rücksendungen verarbeitet?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b + c DSGVO

#### F6 — Bewertungssystem (Trusted Shops, eKomi, Trustpilot, Google Reviews)
- **Trigger:** Werden Kunden um Bewertungen gebeten?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (separate Einwilligung)
- **Pflicht:** Anbieter, Datenübermittlung

#### F7 — Gutscheine, Rabatt-Codes, Treuepunkte
- **Trigger:** Gibt es ein Treueprogramm?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a + b DSGVO

#### F8 — Buy Now Pay Later (Klarna, Afterpay, Ratepay)
- **Trigger:** Wird BNPL angeboten?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO + Bonitätsprüfung Art. 22 DSGVO

---

### Kategorie G — Marketing & Direktwerbung

#### G1 — Facebook/Meta Pixel + Conversion API
- **Trigger:** Wird Meta-Pixel genutzt?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO + § 25 Abs. 1 TDDDG
- **Pflicht:** Joint-Controller-Hinweis (Pixel ist Joint Controller mit Meta), DPF-Zertifizierung Meta, Custom Audiences erklären
- **Stolperfalle:** Conversion API serverseitig braucht trotzdem Einwilligung

#### G2 — Google Ads (Search, Display, YouTube)
- **Trigger:** Wird Google Ads genutzt?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO + § 25 Abs. 1 TDDDG

#### G3 — TikTok Pixel
- **Trigger:** Wird TikTok Pixel verwendet?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO
- **Stolperfalle:** TikTok = Verbindung zu China, eigene Drittland-Problematik

#### G4 — LinkedIn Insight Tag
- **Trigger:** B2B-Tracking via LinkedIn?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO

#### G5 — Customer Data Platform (Segment, RudderStack, eigene CDP)
- **Trigger:** Wird User-Verhalten zentral aggregiert?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a/f DSGVO
- **Pflicht:** Detaillierte Profilbildung erklären

#### G6 — Email-Tracking (Open, Click, Read-Receipt)
- **Trigger:** Werden Newsletter-Öffnungen/Klicks getrackt?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (separate Einwilligung!)

#### G7 — Lookalike Audiences / Custom Audiences
- **Trigger:** Werden Kundendaten zur Zielgruppen-Erweiterung an Plattformen übertragen?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO + Joint Controller

---

### Kategorie H — Eingebettete Inhalte / Third-Party

#### H1 — Google Fonts (lokal vs. extern)
- **Trigger:** Werden Google Fonts genutzt?
- **Pflicht je nach Implementierung:**
  - Lokal gehostet: kein Consent nötig (Art. 6 Abs. 1 lit. f DSGVO)
  - Extern von Google: Einwilligung Pflicht (LG München I 20 O 19158/20)

#### H2 — Google Maps
- **Trigger:** Karte eingebettet?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO + § 25 Abs. 1 TDDDG
- **Stolperfalle:** "Privacy-Enhanced Mode" reicht NICHT, Consent trotzdem nötig

#### H3 — YouTube Videos
- **Trigger:** YouTube-Videos eingebettet?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO
- **Pflicht:** youtube-nocookie.com Mode erwähnen oder Click-to-Load Lösung

#### H4 — Vimeo, Wistia, Loom
- **Trigger:** Andere Video-Embeds?

#### H5 — Calendly, Cal.com, TidyCal
- **Trigger:** Terminbuchungs-Tool eingebettet?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung)

#### H6 — Typeform, Tally, Google Forms
- **Trigger:** Externe Formulare?

#### H7 — Google reCAPTCHA / hCaptcha / Cloudflare Turnstile
- **Trigger:** Bot-Schutz auf Formularen?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (Spam-Schutz)

#### H8 — Stripe Elements / Checkout
- **Trigger:** Stripe-Bezahlfeld auf eigener Seite?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO + § 25 Abs. 2 Nr. 2 TDDDG (techn. erforderlich)

#### H9 — Trustpilot Widget / Google Reviews Widget
- **Trigger:** Bewertungs-Widget eingebettet?

#### H10 — Spotify / SoundCloud / Apple Music Embeds
- **Trigger:** Audio-Embeds?

---

### Kategorie I — Beschäftigte (HR)

#### I1 — Bewerbungsformular auf Webseite
- **Trigger:** Können sich Bewerber direkt auf der Webseite bewerben?
- **Rechtsgrundlage:** § 26 BDSG (Beschäftigungsverhältnis-Anbahnung)
- **Pflicht:** Aufbewahrungsfristen (Standard 6 Monate nach Ablehnung), Datenkategorien, Profilbildung-Verbot

#### I2 — Bewerbermanagement-System (Personio, BambooHR, Workday)
- **Trigger:** Werden Bewerbungen in System gespeichert?
- **Pflicht:** Anbieter, AVV-Hinweis, ggf. DPF/SCCs

#### I3 — Background-Check / Pre-Employment-Screening
- **Trigger:** Werden Hintergrundprüfungen durchgeführt?
- **Rechtsgrundlage:** § 26 BDSG (sehr strenge Grenzen!)

#### I4 — Mitarbeiterfotos auf Webseite ("Über uns" / Team-Seite)
- **Trigger:** Sind Mitarbeiter-Fotos auf der Seite?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. a DSGVO (Einwilligung!) + KUG
- **Stolperfalle:** Bei Austritt: Bilder müssen entfernt werden

---

### Kategorie J — Branchen-Sonderfälle

#### J1 — Gesundheitsdaten (Arztpraxis, Psychotherapie, Physiotherapie)
- **Trigger:** Werden Gesundheitsdaten verarbeitet?
- **Rechtsgrundlage:** Art. 9 Abs. 2 lit. h DSGVO + § 22 BDSG
- **Pflicht:** Sehr strenge Anforderungen, DSFA Pflicht, DSB Pflicht

#### J2 — Rechtsanwalt / Steuerberater / Wirtschaftsprüfer
- **Trigger:** Berufsgeheimnisträger?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. c + e + f DSGVO + berufsrechtliche Verschwiegenheit
- **Pflicht:** § 203 StGB, Mandantengeheimnis

#### J3 — Pflegedienst / Pflegeheim
- **Trigger:** Pflegerische Daten?
- **Rechtsgrundlage:** Art. 9 DSGVO + SGB XI

#### J4 — Schule / Hochschule
- **Trigger:** Schülerdaten / Studierendendaten?
- **Rechtsgrundlage:** Landesdatenschutzgesetze + SchulG

#### J5 — Kinder unter 16 (Art. 8 DSGVO)
- **Trigger:** Richten sich Angebote an Minderjährige?
- **Rechtsgrundlage:** Art. 8 DSGVO — Einwilligungsfähigkeit ab 16, davor Elternzustimmung

#### J6 — Hotel / Beherbergung
- **Trigger:** Meldepflicht?
- **Rechtsgrundlage:** BMG + § 30 BMG (Meldeschein-Aufbewahrung 1 Jahr)

#### J7 — Versicherung / Finanzdienstleister
- **Trigger:** GwG-Pflichten? VAG?
- **Rechtsgrundlage:** GwG + VAG + DSGVO

#### J8 — Whistleblowing-Plattform (HinSchG)
- **Trigger:** Hat das Unternehmen eine Meldestelle (Pflicht ab 50 MA)?
- **Rechtsgrundlage:** HinSchG + Art. 6 Abs. 1 lit. c DSGVO
- **Pflicht:** Vertraulichkeit, Schutz Hinweisgeber

#### J9 — KI-Anbieter / SaaS mit KI-Komponente
- **Trigger:** Bietet das Produkt KI-Funktionen?
- **Rechtsgrundlage:** AI Act Art. 50 (Transparenz) + DSGVO
- **Pflicht ab 02.08.2026:** AI Act-Compliance, Risikoklassen, ggf. Hochrisiko-Doku

---

### Kategorie K — Internationaler Kontext

#### K1 — Drittlandtransfer USA
- **Trigger:** Nutzt du US-Anbieter (Vercel, AWS, Cloudflare, Google, Microsoft)?
- **Rechtsgrundlage:** Art. 45/46 DSGVO
- **Pflicht 2026:** DPF-Zertifizierung prüfen + erwähnen + zusätzlich SCCs für nicht-DPF-Sachen + TIA

#### K2 — Drittlandtransfer UK
- **Trigger:** UK-Anbieter?
- **Rechtsgrundlage:** Art. 45 DSGVO + UK-Angemessenheitsbeschluss

#### K3 — Drittlandtransfer Schweiz
- **Trigger:** Schweizer Anbieter?
- **Rechtsgrundlage:** Angemessenheitsbeschluss CH (Art. 45)

#### K4 — Drittlandtransfer Andere (China, Indien, Brasilien etc.)
- **Trigger:** Anbieter aus diesen Ländern?
- **Rechtsgrundlage:** SCCs Pflicht + TIA Pflicht

---

### Kategorie L — Spezielle Verarbeitungen

#### L1 — Profiling (automatisiertes Scoring von Personen)
- **Trigger:** Werden Nutzer-Profile algorithmisch bewertet?
- **Rechtsgrundlage:** Art. 22 DSGVO

#### L2 — Automatisierte Entscheidungen
- **Trigger:** Werden Entscheidungen ohne menschliche Beteiligung getroffen (Kredit, Vertragsangebot, Versicherung)?
- **Rechtsgrundlage:** Art. 22 DSGVO
- **Pflicht:** Erklärung der Logik, menschliche Überprüfung anbieten

#### L3 — Videoüberwachung auf Webseite
- **Trigger:** Live-Cam oder Webcam-Stream?
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO + § 4 BDSG

#### L4 — DSFA-Pflicht
- **Trigger:** Steht eine Verarbeitung auf der DSK-Muss-Liste? Z.B.: Profilbildung, automatisierte Entscheidung, große Datenmengen besonderer Kategorien
- **Rechtsgrundlage:** Art. 35 DSGVO
- **Pflicht:** DSFA durchführen + Verantwortlicher dokumentieren

---

## TEIL 3 — FRAGEBOGEN-DECISION-TREE

### Strategie

Der Wizard muss in der MINIMUM-Variante nur 6-8 Fragen stellen, aber je nach Antwort 20-30 Folgefragen triggern. Wie ein Gerichtsverfahren mit Verzweigungen.

### Master-Decision-Tree

```
STEP 1: Verantwortlicher
├── Wer bist du? (Solo/GmbH/UG/Verein/Behörde)
├── Anschrift + Kontakt
└── Mehr als 20 MA? → DSB-Frage aktivieren

STEP 2: Hosting (Pflicht)
├── Hoster wählen
└── Wenn US: DPF-Hinweis + SCCs aktivieren

STEP 3: Wer besucht deine Seite?
├── Auch Kinder unter 16? → J5
├── Auch B2B-Kunden? → SCHUFA-Bonität fragen
├── International? → K1-K4 aktivieren

STEP 4: Was tut deine Seite (Multi-Select)?
├── [ ] Newsletter sammeln → D2
├── [ ] Kontaktformular → D1
├── [ ] Login/Kundenkonto → E1
├── [ ] Bestellungen → F1+F2+F3
├── [ ] Termine buchen → H5
├── [ ] Live-Chat → D4
├── [ ] KI-Chatbot → D5 + AI-Act
├── [ ] Bewerbungen → I1+I2
├── [ ] Webinare → D6
├── [ ] Push-Notifications → D7

STEP 5: Welche Tracking-Tools (Multi-Select)?
├── [ ] Analytics → C1 oder C2
├── [ ] Session-Recording → C3
├── [ ] Meta/Facebook Pixel → G1 (+ Joint Controller!)
├── [ ] Google Ads → G2
├── [ ] TikTok Pixel → G3
├── [ ] LinkedIn → G4
├── [ ] Affiliate → C4
├── [ ] Remarketing → C5

STEP 6: Welche Embeds (Multi-Select)?
├── [ ] Google Fonts → H1 (lokal/extern?)
├── [ ] Google Maps → H2
├── [ ] YouTube → H3
├── [ ] Vimeo → H4
├── [ ] reCAPTCHA → H7
├── [ ] Social-Media-Plugins → A4

STEP 7: Zahlungsabwicklung
├── Anbieter Multi-Select → F2
├── Bonitätsprüfung? → F3 + Art. 22 DSGVO
├── BNPL? → F8

STEP 8: Beschäftigte (nur wenn relevant)
├── Bewerbungsformular? → I1
├── Mitarbeiterfotos auf "Team"-Seite? → I4
├── HinSchG-Meldepflicht (>50 MA)? → J8

STEP 9: Branche (Single-Select)
├── Allgemein → keine Sonderregeln
├── Arztpraxis → J1
├── Anwalt/StB → J2
├── Pflege → J3
├── Hotel → J6
├── Versicherung → J7
├── KI-SaaS → J9 (+ AI Act)
├── Schule/Uni → J4

STEP 10: Review + Export
├── Live-Vorschau
├── HTML-Copy mit Backlink
├── PDF-Download
```

### Smart-Defaults (User vereinfachen)

- **"Ich nutze gar nichts" Schnellweg** → Minimal-Datenschutzerklärung mit nur A1-A6 + Hosting
- **"Ich nutze Standard SaaS" Schnellweg** → Solo-Freelancer-Default mit Brevo + Stripe + Plausible
- **"Online-Shop" Schnellweg** → Shop-Komplettpaket mit Zahlung + Versand + Bewertung

---

## TEIL 4 — TODO-LIST FÜR CODE-UPDATE

### Was in `lib/datenschutz/types.ts` ergänzt werden muss

- [ ] **`branche` Field** mit Enum (allgemein, arzt, anwalt, pflege, hotel, versicherung, ki_saas, schule)
- [ ] **`zielgruppe` Field** (b2b, b2c, beide, kinder_unter_16)
- [ ] **`mehr_als_20_mitarbeiter` boolean** (für DSB-Pflicht-Trigger)
- [ ] **`mehr_als_50_mitarbeiter` boolean** (für HinSchG-Trigger)
- [ ] **`besondere_kategorien_art9` boolean** (Gesundheitsdaten, religiöse, etc.)
- [ ] **`bonitaetspruefung` boolean** (für SCHUFA-Klausel)
- [ ] **`bnpl_aktiv` boolean** (Buy Now Pay Later)
- [ ] **`automatisierte_entscheidungen` boolean** (Art. 22 DSGVO)
- [ ] **`bewerbungsformular_aktiv` boolean** (separates von `funktionen`)
- [ ] **`mitarbeiterfotos_aktiv` boolean**
- [ ] **`hinschg_meldekanal` boolean**
- [ ] **`profiling` boolean**
- [ ] **`ki_chatbot` boolean** (für AI Act 2026!)
- [ ] **`ki_anbieter` enum** (openai, anthropic, google, mistral, eigene_loesung)
- [ ] **`videoueberwachung_live` boolean**
- [ ] **`zahlungsanbieter` array** erweitern um SOFORT, Apple Pay, Google Pay, Lastschrift
- [ ] **`versanddienstleister` array** (DHL, Hermes, DPD, GLS, UPS)
- [ ] **`bewertungssystem` enum** (trusted_shops, ekomi, trustpilot, google_reviews)
- [ ] **`google_fonts_lokal` boolean** (für unterschiedliche Klauseln)
- [ ] **`youtube_nocookie_mode` boolean**
- [ ] **`server_side_tracking` boolean**
- [ ] **`remarketing` boolean**
- [ ] **`facebook_pixel_active` boolean** (für Joint Controller-Klausel)
- [ ] **`affiliate_tracking` boolean**
- [ ] **`recaptcha_active` boolean**
- [ ] **`joint_controller` boolean** + Joint-Controller-Vereinbarung-Verweis
- [ ] **`vereinszweck` field** für Vereine

### Was in `lib/datenschutz/defaults.ts` ergänzt werden muss

- [ ] Bewerbungsformular-Klausel (§ 26 BDSG-konform mit 6-Monats-Aufbewahrung)
- [ ] Bonitätsprüfung-Klausel (SCHUFA + Art. 22 DSGVO Logik-Erklärung NEU 2026)
- [ ] Versanddienstleister-Klauseln pro Anbieter
- [ ] Bewertungssystem-Klauseln pro Anbieter
- [ ] Mitarbeiterfoto-Klausel (Art. 6 Abs. 1 lit. a + KUG)
- [ ] HinSchG-Meldekanal-Klausel
- [ ] DSB-Klausel (intern vs. extern)
- [ ] Joint-Controller-Klausel (Meta Pixel, GA4)
- [ ] KI-Chatbot-Klausel mit AI Act-Hinweis (Art. 50 AI Act ab 02.08.2026)
- [ ] Webinar/Video-Call-Klausel (Zoom, Teams, Meet)
- [ ] Push-Notifications-Klausel
- [ ] Profiling-Klausel (Art. 22 DSGVO Logik-Erklärung)
- [ ] Branchen-Klauseln (Arzt § 22 BDSG, Anwalt § 203 StGB, Pflege SGB XI)
- [ ] Kinder-unter-16-Klausel (Art. 8 DSGVO)
- [ ] Affiliate-Tracking-Klausel
- [ ] Remarketing-Klausel
- [ ] Trustpilot/Google-Reviews-Klausel
- [ ] reCAPTCHA-Klausel (Bot-Schutz)
- [ ] Lookalike Audiences-Klausel
- [ ] CDP-Klausel (Segment, RudderStack)
- [ ] Video-Embed-Klauseln erweitert (Vimeo, Wistia, Loom)

### Was in `lib/datenschutz/contract.ts` ergänzt werden muss

- [ ] `renderBewerbung()` Modul
- [ ] `renderBonitaet()` Modul mit Art. 22 DSGVO-Logik
- [ ] `renderVersand()` Modul
- [ ] `renderBewertungen()` Modul
- [ ] `renderMitarbeiterfotos()` Modul
- [ ] `renderHinSchG()` Modul
- [ ] `renderDsb()` erweitern (intern/extern)
- [ ] `renderJointController()` Modul
- [ ] `renderKiChatbot()` mit AI-Act-Hinweis
- [ ] `renderWebinar()` Modul
- [ ] `renderPushNotifications()` Modul
- [ ] `renderProfiling()` Modul
- [ ] `renderBranche()` Modul mit Branchen-Spezifika
- [ ] `renderKinder()` Modul
- [ ] Drittland-Logik aufstocken: pro Anbieter automatisch erkennen ob US und DPF anhängen

### Was im Wizard ergänzt werden muss (NEU Steps)

Bisher 8 Steps, neu nötig: **12 Steps**

1. Verantwortlicher (mit DSB-Frage)
2. Branche + Zielgruppe (NEU)
3. Hosting
4. Webseiten-Funktionen (Multi-Select erweitern um Bewerbung, Webinar, Push, KI-Chatbot)
5. Analytics & Tracking
6. Marketing & Pixel (NEU separat)
7. Newsletter
8. Zahlungsabwicklung (mit Bonitätsfrage)
9. Versand & Bewertungen (NEU)
10. Embeds (mit Google-Fonts-lokal/extern, YouTube-nocookie-Frage)
11. Beschäftigte (NEU, nur bei aktivierter Bewerbung/Team-Seite)
12. Review + Export

---

## TEIL 5 — QUELLEN (Stand 06/2026)

- DSGVO: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- BDSG: https://www.gesetze-im-internet.de/bdsg_2018/
- TDDDG (ehem. TTDSG): https://www.gesetze-im-internet.de/tddsg/
- DDG (ehem. TMG): https://www.gesetze-im-internet.de/ddg/
- AI Act: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- HinSchG: https://www.gesetze-im-internet.de/hinschg/
- BfDI: https://www.bfdi.bund.de/
- DSK-Beschlüsse: https://www.datenschutzkonferenz-online.de/
- DSK-Liste DSFA-Pflicht: https://www.lda.bayern.de/media/dsfa_muss_liste_dsk_de.pdf
- e-recht24 TDDDG: https://www.e-recht24.de/datenschutz/12834-tdddg.html
- datenschutz-generator.de Cookie-Guide: https://datenschutz-generator.de/tdddg-cookies/
- SCHUFA-Reform 2026: https://www.heise.de/news/Schufa-oeffnet-Blackbox-Neuer-Score-ab-Ende-Maerz-einsehbar-11099500.html

---

## NÄCHSTE SCHRITTE

1. **Du liest dieses Doc durch** und sagst mir was fehlt/falsch ist
2. Ich erweitere `types.ts` um die 25+ neuen Fields
3. Ich erweitere `defaults.ts` um die ~30 neuen Klausel-Bausteine
4. Ich erweitere `contract.ts` um die neuen Render-Module
5. Ich baue den 12-Step-Wizard mit Conditional-Branching
6. Tests + Browser-Check

**Realistisch:** Sprint 1 mit voller Sonderfall-Abdeckung = +6-10h zusätzlich (also 12-18h gesamt statt 6-8h initial).

Soll ich jetzt direkt mit Code-Erweiterung anfangen, oder willst du erst durchs Doc gehen?
