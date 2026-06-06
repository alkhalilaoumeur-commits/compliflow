# Verarbeitungsverzeichnis (VVT) — Compliflow

> Eigenes Verarbeitungsverzeichnis nach Art. 30 Abs. 1 DSGVO.
> **Verantwortlicher:** Al-Khalil Aoumeur, Egilolfstraße 41, 70599 Stuttgart
> **Datenschutz-Kontakt:** hello@compliflow.de
> **Stand:** 6. Juni 2026 — vor jedem neuen Tool-Launch aktualisieren
> **DSB-Pflicht:** Nicht erforderlich (Einzelunternehmer, < 20 Personen, keine Kerntätigkeit der Verarbeitung sensibler Daten)

---

## Übersicht der Verarbeitungstätigkeiten

| # | Verarbeitungstätigkeit | Rechtsgrundlage | Speicherort | Löschfrist |
|---|---|---|---|---|
| V1 | Server-Logs (Hosting) | Art. 6 Abs. 1 lit. f | Vercel (EU) | 7 Tage |
| V2 | Wartelisten-Anmeldungen | Art. 6 Abs. 1 lit. b | Supabase (EU) | Bis Widerruf |
| V3 | Kontakt-Anfragen per E-Mail | Art. 6 Abs. 1 lit. b | E-Mail-Postfach | 3 Jahre nach letztem Kontakt |
| V4 | Web-Analytics (Plausible) | Art. 6 Abs. 1 lit. f | Plausible (EE) | Aggregat 24 Monate |
| V5 | AVV-Generator Daten (Pro) | Art. 6 Abs. 1 lit. b | Supabase (EU) | Bis 30 Tage nach Vertragsende |
| V6 | Zahlungsabwicklung (Pro) | Art. 6 Abs. 1 lit. b | Stripe (EU/Irland) | Stripe-Aufbewahrungspflichten |
| V7 | Transaktions-E-Mails | Art. 6 Abs. 1 lit. b | Resend (USA, SCCs) | 30 Tage |

---

## V1 — Server-Logs

| Feld | Wert |
|---|---|
| Zweck | Bereitstellung der Website, Sicherheit, Fehleranalyse |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an IT-Sicherheit) |
| Betroffene | Website-Besucher |
| Datenkategorien | IP-Adresse, Datum/Zeit, User-Agent, Referrer, HTTP-Statuscode |
| Empfänger | Vercel Inc. als Auftragsverarbeiter |
| Drittland | EU-Hosting (Frankfurt) — keine Drittlandübermittlung |
| Löschfrist | 7 Tage automatisch |
| TOMs | TLS, Logs in zugriffsbeschränktem Vercel-Dashboard |

## V2 — Wartelisten-Anmeldungen

| Feld | Wert |
|---|---|
| Zweck | Kontaktaufnahme für Launch-Benachrichtigung |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) + lit. a (Einwilligung Newsletter) |
| Betroffene | Interessenten |
| Datenkategorien | E-Mail-Adresse, Quelle, Zeitstempel |
| Empfänger | Supabase Inc. (Datenbank), Resend Inc. (Mailversand) |
| Drittland | Supabase EU-Region, Resend USA mit SCCs |
| Löschfrist | Bis Widerruf der Einwilligung |
| TOMs | Verschlüsselung at-rest + in-transit, Zugang nur über RLS |

## V3 — Kontakt-Anfragen

| Feld | Wert |
|---|---|
| Zweck | Beantwortung von Anfragen |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. b oder lit. f DSGVO |
| Betroffene | Anfragende |
| Datenkategorien | E-Mail-Adresse, Name (falls angegeben), Inhalt der Anfrage |
| Empfänger | — (interne Verarbeitung) |
| Drittland | — |
| Löschfrist | 3 Jahre nach letztem Kontakt (Verjährungsregel) |
| TOMs | 2FA auf E-Mail-Account, verschlüsselte Geräte |

## V4 — Web-Analytics

| Feld | Wert |
|---|---|
| Zweck | Reichweitenmessung, Verbesserung des Angebots |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. f DSGVO |
| Betroffene | Website-Besucher |
| Datenkategorien | Anonymisierte Aggregate (keine IP-Speicherung bei Plausible) |
| Empfänger | Plausible Insights OÜ (EE) |
| Drittland | EU-EWR — keine Drittlandübermittlung |
| Löschfrist | Aggregate 24 Monate |
| TOMs | Cookieless, keine personenbezogenen Daten |

## V5 — AVV-Generator Daten (Pro-Tier)

| Feld | Wert |
|---|---|
| Zweck | Erstellung, Verwaltung und Update von AVV-Verträgen für zahlende Kunden |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) |
| Betroffene | Pro-Kunden |
| Datenkategorien | Account-Daten (E-Mail, Firmenname), Vertragsdaten, ggf. Logo |
| Empfänger | Supabase (Datenbank + Storage) |
| Drittland | EU-Region Frankfurt |
| Löschfrist | 30 Tage nach Vertragsende (außer Aufbewahrungspflichten) |
| TOMs | Verschlüsselung, RLS pro User, regelmäßige Backups |

## V6 — Zahlungsabwicklung

| Feld | Wert |
|---|---|
| Zweck | Verarbeitung von Pro-Tier-Bestellungen |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. b DSGVO |
| Betroffene | Pro-Kunden |
| Datenkategorien | Name, Adresse, Zahlungsdaten (tokenisiert) |
| Empfänger | Stripe Payments Europe Ltd. (IE) |
| Drittland | EU-EWR (Irland) |
| Löschfrist | Stripe-Aufbewahrungspflichten (üblich 10 Jahre wg. § 147 AO) |
| TOMs | PCI-DSS bei Stripe, keine Kartendaten bei uns |

## V7 — Transaktions-E-Mails

| Feld | Wert |
|---|---|
| Zweck | Versand von Bestätigungen, Rechnungen, PDF-Downloads |
| Rechtsgrundlage | Art. 6 Abs. 1 lit. b DSGVO |
| Betroffene | Pro-Kunden + Wartelisten-Anmelder |
| Datenkategorien | E-Mail-Adresse, Versandinhalt |
| Empfänger | Resend Inc. (USA) |
| Drittland | USA mit SCCs + zusätzlicher Verschlüsselung |
| Löschfrist | 30 Tage Logs bei Resend, danach Löschung |
| TOMs | TLS, DKIM/SPF/DMARC konfiguriert |

---

## Auftragsverarbeiter-Liste (Anlage zum VVT)

Aktive AVVs (Stand 06.06.2026):

| Anbieter | Vertrag | Drittland | Schrems-II-Maßnahmen |
|---|---|---|---|
| Vercel Inc. | DPA akzeptiert | EU-Hosting | n.a. (EU-Region) |
| Supabase Inc. | DPA + SCCs | EU-Region | n.a. (EU-Region) |
| Stripe Payments Europe Ltd. | DPA | IE (EU) | n.a. (EU) |
| Resend Inc. | DPA + SCCs | USA | TLS, keine sensiblen Daten in Body |
| Plausible Insights OÜ | DPA | EE (EU) | n.a. (EU) |

---

## Aktualisierungspflicht

Dieses Verzeichnis ist **mit jeder Änderung an Datenflüssen** zu aktualisieren, insbesondere:

- Neuer Auftragsverarbeiter hinzugefügt
- Neue Verarbeitungstätigkeit (z.B. neues Tool launcht)
- Änderung der Zwecke/Rechtsgrundlage
- Änderung der Speicherorte oder Löschfristen

**Verantwortlich für die Pflege:** Al-Khalil Aoumeur (selbst)
**Nächste planmäßige Überprüfung:** Vor Launch Tool 2 (15.07.2026)

---

## Bereitstellung auf Verlangen der Aufsichtsbehörde

Auf Anfrage der zuständigen Aufsichtsbehörde (Landesbeauftragter für den Datenschutz Baden-Württemberg) wird dieses Verzeichnis innerhalb von 7 Werktagen schriftlich übermittelt.
