# Technische und Organisatorische Maßnahmen (TOMs)

> Eigene TOMs nach Art. 32 DSGVO für Compliflow.
> **Verantwortlich:** Al-Khalil Aoumeur
> **Stand:** 6. Juni 2026 — vor jedem Tool-Launch reviewen

---

## 1. Zutrittskontrolle

Schutz vor unbefugtem physischen Zutritt zu Datenverarbeitungsanlagen.

- ✅ Server in zertifizierten Rechenzentren (Vercel auf AWS, Supabase auf AWS-EU-Frankfurt — ISO 27001 zertifiziert)
- ✅ Arbeitsgerät (MacBook) nur in privater Wohnung
- ✅ Geräteverschlüsselung (FileVault) aktiv
- ✅ Kein Zugriff Dritter auf Arbeitsgerät (keine Mitarbeiter)

## 2. Zugangskontrolle

Verhinderung unbefugter Systemnutzung.

- ✅ 2FA aktiv auf: GitHub, Vercel, Supabase, Stripe, Resend, Plausible, iCloud, 1Password
- ✅ Passwort-Manager (1Password) für alle Accounts
- ✅ Mindestlänge 16 Zeichen, einzigartig pro Service
- ✅ Auto-Lock nach 5 Min Inaktivität
- ✅ Keine SSH-Keys ohne Passphrase

## 3. Zugriffskontrolle

Schutz vor unbefugtem Lesen, Kopieren, Verändern, Löschen.

- ✅ Supabase Row-Level-Security (RLS) auf allen Tabellen mit User-Bezug
- ✅ Service-Role-Key niemals client-seitig
- ✅ Env-Vars in Vercel als Encrypted Secrets
- ✅ Lokale `.env.local` in `.gitignore`
- ✅ Datenträger-Verschlüsselung (FileVault)
- ⏳ Audit-Log über Daten-Zugriffe — wird mit Pro-Tier implementiert (Phase 7)

## 4. Weitergabekontrolle

Schutz personenbezogener Daten bei Übertragung.

- ✅ HTTPS/TLS 1.3 auf compliflow.de erzwungen (Vercel Auto-HTTPS)
- ✅ HSTS-Header gesetzt (Strict-Transport-Security)
- ✅ E-Mail-Versand mit TLS (Resend) + DKIM/SPF/DMARC konfiguriert
- ✅ Backup-Daten verschlüsselt bei Supabase
- ✅ Keine Datenexporte über unverschlüsselte Kanäle

## 5. Eingabekontrolle

Nachvollziehbarkeit von Eingaben, Änderungen, Löschungen.

- ✅ Git-Versionierung des gesamten Codes
- ✅ Supabase erstellt `created_at`/`updated_at`-Timestamps automatisch
- ✅ Audit-Trail bei kritischen Aktionen (geplant für Pro-Tier)
- ✅ Server-Logs 7 Tage retentioniert

## 6. Auftragskontrolle

Sicherstellung dass Auftragsverarbeitung nach Weisung erfolgt.

- ✅ Schriftliche AVVs mit allen Auftragsverarbeitern:
  - Vercel: DPA akzeptiert im Vercel-Dashboard
  - Supabase: DPA + SCCs akzeptiert
  - Stripe: Data Processing Addendum akzeptiert
  - Resend: DPA akzeptiert
  - Plausible: DPA akzeptiert (EE)
- ✅ Sub-Liste in eigenem VVT (`docs/internal/verarbeitungsverzeichnis.md`)
- ✅ Jährliche Überprüfung der Sub-Liste (nächste: 06/2027)

## 7. Verfügbarkeitskontrolle

Schutz vor zufälliger Zerstörung oder Verlust.

- ✅ Tägliche automatische Backups bei Supabase (7 Tage Retention)
- ✅ Git-Repo auf GitHub als Code-Backup
- ✅ Disaster-Recovery-Plan: Re-Deploy von Git via Vercel + Supabase-Restore aus letztem Backup
- ✅ Vercel/Supabase haben eigene SLA + Multi-AZ-Redundanz
- ✅ Lokales Backup der `.env.local` in 1Password (verschlüsselt)
- ⏳ Restore-Test halbjährlich — nächster Termin: 12/2026

## 8. Trennungskontrolle (Mandantenfähigkeit)

Getrennte Verarbeitung für unterschiedliche Zwecke.

- ✅ Logische Mandanten-Trennung über User-IDs in DB
- ✅ Row-Level-Security (RLS) verhindert User-übergreifende Reads
- ✅ Getrennte Vercel-Projekte für DRVN-Brand vs. Compliflow
- ✅ Getrennte Supabase-Projekte für jedes Tool (geplant)
- ✅ Stripe-Customer-IDs nur an eigenen Account gebunden

---

## Datenpannen-Reaktionsplan (Art. 33/34 DSGVO)

### Sofortmaßnahmen (innerhalb 1 Stunde)

1. Vorfall isolieren — betroffene Systeme vom Netz nehmen wenn möglich
2. Ausmaß bewerten — wie viele Personen, welche Daten
3. Vorfall dokumentieren mit Zeitstempel
4. Bei Pro-Kunden: Auftraggeber informieren (innerhalb 24h gemäß AVV § 8)

### Innerhalb 72 Stunden (Art. 33 DSGVO)

- Meldung an Aufsichtsbehörde (Landesbeauftragter für den Datenschutz Baden-Württemberg)
- Online-Meldeformular: https://www.baden-wuerttemberg.datenschutz.de/datenpanne-melden/
- Inhalt:
  - Art der Verletzung
  - Betroffene Datenkategorien & Anzahl
  - Folgen
  - Maßnahmen zur Eindämmung
  - Kontaktdaten

### Bei hohem Risiko: Information Betroffener (Art. 34 DSGVO)

- Direkte Kommunikation an betroffene Nutzer per E-Mail
- Klare Sprache, kein Verstecken
- Hinweise was Betroffene tun sollen (Passwort ändern, etc.)

### Nachgang

- Root-Cause-Analyse
- Maßnahmen zur Vermeidung des Wiederauftretens
- TOM-Liste aktualisieren

---

## Aktualisierung

Diese TOMs sind:
- Bei jedem neuen Tool zu reviewen
- Bei Änderung der Tech-Stack-Anbieter zu aktualisieren
- Mindestens jährlich vollständig durchzugehen
- Auf Anfrage von Auftraggebern (Pro-Kunden) als PDF auszugeben

**Nächste Review:** Vor Launch Tool 2 (Juli 2026)
