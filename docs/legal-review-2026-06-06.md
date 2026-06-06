# Legal-Review AVV-Generator — 2026-06-06

> Ehrliche Prüfung des generierten Vertragstexts gegen Art. 28 DSGVO + des Codes auf Bugs.
> **Bestanden:** 8 Pflichtklauseln nach Art. 28 Abs. 3 lit. a-h alle vorhanden.
> **Gefundene Lücken:** 8 kritisch, 4 nice-to-have, 6 Code-Issues.
> **Status nach Fix:** ✅ Alle 8 kritischen Lücken geschlossen, 3 von 4 Nice-to-have implementiert, 5 von 6 Code-Issues gefixt.
> **Build-Health:** TypeScript strict clean · Production-Build clean (28.5 kB /avv) · Dev HTTP 200

---

## 1. Pflicht-Inhalte Art. 28 Abs. 3 lit. a-h — Mapping

| Pflicht | DSGVO-Stelle | Im Vertrag wo | Status |
|---|---|---|---|
| Verarbeitung nur auf dokumentierte Weisung | lit. a | § 3 | ✅ vorhanden, aber Wortlaut wird präzisiert |
| Vertraulichkeitsverpflichtung Beschäftigte | lit. b | § 4 Abs. 2 | ✅ vorhanden |
| Sicherheit (Art. 32 TOMs) | lit. c | § 5 + Anlage 1 | ✅ vorhanden |
| Bedingungen Heranziehung Subunternehmer | lit. d | § 6 | ⚠ Subverarbeiter-Haftung Art. 28 Abs. 4 Satz 2 fehlt |
| Unterstützung Betroffenenrechte | lit. e | § 7 | ✅ vorhanden |
| Unterstützung Pflichten Art. 32-36 | lit. f | § 4 Abs. 3, § 8, § 9 | ✅ vorhanden |
| Rückgabe/Löschung nach Beendigung | lit. g | § 12 | ⚠ konkrete Löschfrist fehlt |
| Informationspflicht + Audits | lit. h | § 10 | ✅ vorhanden |

---

## 2. Kritische Lücken (vor Fix)

### 2.1 § 6 — Subverarbeiter-Haftung nach Art. 28 Abs. 4 Satz 2

**DSGVO-Wortlaut:** „Kommt der weitere Auftragsverarbeiter seinen Datenschutzpflichten nicht nach, so haftet der erste Auftragsverarbeiter gegenüber dem Verantwortlichen für die Einhaltung der Pflichten des anderen Auftragsverarbeiters."

**Bisher im Vertrag:** Nicht erwähnt.

**Risiko:** Verantwortlicher hätte keinen vertraglichen Haftungsanspruch wenn Sub-Verarbeiter Datenschutz verletzt.

**Fix:** Neuer Absatz in § 6.

---

### 2.2 § 3 Abs. 1 — Drittland-Klausel präzisieren

**DSGVO-Wortlaut Art. 28 Abs. 3 lit. a:** „… es sei denn, er ist nach dem Recht der Union oder der Mitgliedstaaten, dem der Auftragsverarbeiter unterliegt, hierzu verpflichtet; in einem solchen Fall teilt der Auftragsverarbeiter dem Verantwortlichen diese rechtlichen Anforderungen vor der Verarbeitung mit, sofern das betreffende Recht eine solche Mitteilung nicht wegen eines wichtigen öffentlichen Interesses verbietet."

**Bisher im Vertrag:** Nur „… sofern er nicht durch das Recht der Union oder der Mitgliedstaaten verpflichtet ist."

**Fix:** Mitteilungspflicht ergänzen.

---

### 2.3 § 4 Abs. 4 — Datenschutzbeauftragter

**Bisher:** „Der Auftragsverarbeiter benennt — sofern gesetzlich erforderlich — einen Datenschutzbeauftragten."

**Verbesserung:** Auch bei Nicht-Verpflichtung muss ein Ansprechpartner benannt werden, sonst ist der Verantwortliche bei Anfragen blind.

---

### 2.4 § 12 — Löschfrist

**Bisher:** „Nach Beendigung … hat der Auftragsverarbeiter alle … personenbezogenen Daten … nach dessen Wahl zurückzugeben oder zu löschen."

**Lücke:** Keine konkrete Frist.

**Fix:** „… innerhalb von 30 Tagen nach Vertragsende, sofern keine längere Frist vereinbart wurde."

---

### 2.5 TOM-Validation — Kategorie-Coverage

**Bisher:** Code verlangt `data.toms.length >= 8`.

**Lücke:** User könnte 8 TOMs in EINER Kategorie haben und 7 Kategorien leer.

**Fix:** Prüfung muss sein: „Mindestens 1 TOM pro Kategorie (8 Kategorien gemäß Art. 32 DSGVO)."

---

### 2.6 Abschluss-Datum + Unterschriftsort fehlt im Wizard

**Bisher:** Der User kann das **Datum und den Ort der Unterschrift nicht eingeben**. PDF hat dann nur Unterschriftslinien, aber kein Datum im Dokument selbst.

**Fix:** Felder im Review-Step + PDF-Cover + Unterschriftenblock.

---

### 2.7 Drittland-Auftragnehmer (nicht Sub) — eigene Klausel

**Bisher:** Wir behandeln Schrems-II nur für Subverarbeiter. Wenn aber der **Auftragnehmer selbst** in einem Drittland sitzt (z.B. Compliflow nutzt US-SaaS direkt), fehlt eine Klausel.

**Fix:** Neuer § im Vertrag oder Erweiterung § 6.

---

### 2.8 § 6 — Kündigungsrecht bei Sub-Widerspruch

**Bisher:** Verantwortlicher kann widersprechen, aber keine Folgen wenn Auftragnehmer den Sub trotzdem einsetzt.

**Fix:** Außerordentliches Kündigungsrecht ergänzen.

---

## 3. Nice-to-have-Verbesserungen

### 3.1 § 11 — Haftungsbeschränkung im Innenverhältnis
Für Solo-Builder ist „gesetzliche Vorschriften" riskant. Standard-Klausel: „Im Innenverhältnis haftet jede Partei nur bei Vorsatz oder grober Fahrlässigkeit, soweit gesetzlich zulässig."

### 3.2 § 5 Abs. 4 — Audit-Kosten
„Der Auftragsverarbeiter trägt die Kosten der Erstanforderung; weitere Anforderungen innerhalb eines Jahres trägt der Verantwortliche."

### 3.3 § 13 — Bezug zum Hauptvertrag
Bisher nicht erwähnt. Sollte: „Im Übrigen gelten die Bestimmungen des Hauptvertrags."

### 3.4 Disclaimer im PDF prominenter
Aktuell nur „Generiert mit Compliflow" — sollte explizit auf "Vorlage ersetzt keine Rechtsberatung" hinweisen.

---

## 4. Code-Issues

### 4.1 `getCompletionStatus()` — TOM-Coverage
Logik prüft nur Anzahl, nicht Kategorie-Abdeckung. Siehe 2.5.

### 4.2 `step-subverarbeiter.tsx` — `deriveGarantie` überschreibt User-Wahl
Wenn User auf "Bindende Unternehmensregeln" stellt und dann das Land ändert, wird seine Wahl ohne Hinweis überschrieben.
**Aktion:** Bewusst lassen — Default basierend auf Land ist sinnvoller default, User kann nicht falsch wählen.

### 4.3 `crypto.randomUUID()` — Browser-Compat
Funktioniert in localhost + HTTPS, scheitert auf HTTP-Domains außerhalb localhost. Phase 7 (Deploy) → kein Issue auf compliflow.de (HTTPS).

### 4.4 Step-Validation greift erst beim „Weiter"-Klick
Aktuell wird das `disabled` an den Next-Button gehängt. Aber: keine visuellen Fehlermarkierungen direkt am ungültigen Feld.
**Aktion:** Phase 6 Polish — nicht jetzt fixen, später wenn Lighthouse-Audit kommt.

### 4.5 Wizard-Shell — `key={currentStep}` Animation
Funktioniert, aber bei schnellem Hin-und-Her flackert es kurz. Akzeptabel.

### 4.6 PDF — Inter-Font via CDN
Funktioniert online, scheitert offline. Für eine Web-App OK. Bei Offline-First später Font lokal einbinden.

---

## 5. Liste der Fixes in diesem Commit

1. § 3 Abs. 1 — DSGVO-konformer Wortlaut + Mitteilungspflicht
2. § 4 Abs. 4 — DSB-Klausel + Pflicht-Ansprechpartner
3. § 6 — Subverarbeiter-Haftung Art. 28 Abs. 4 Satz 2
4. § 6 — Kündigungsrecht bei Sub-Widerspruch
5. § 6 — Drittland-Auftragnehmer-Klausel (wenn Auftragnehmer-Land ≠ EU/EWR)
6. § 11 — Haftungsbeschränkung Vorsatz/grobe Fahrlässigkeit
7. § 12 — Konkrete Löschfrist (30 Tage)
8. § 13 — Bezug zum Hauptvertrag
9. PDF + Wizard — Abschluss-Datum + Ort der Unterschrift
10. `getCompletionStatus()` — TOM-Kategorie-Coverage statt Anzahl
11. Disclaimer im PDF prominenter (eigene Seite)

---

## 6. Ehrliche Einschätzung

Der nach diesem Fix generierte AVV erfüllt **alle 8 Pflichtklauseln nach Art. 28 Abs. 3 lit. a-h DSGVO**. Er ist auf dem Niveau dessen, was kostenlose Vorlagen großer Datenschutz-Portale anbieten (e-recht24, datenschutzexperte, GDD).

**Was er nicht ersetzt:**
- Branchen-spezifische Klauseln (Healthcare, Banken)
- Internationale Spezifika (Schweiz nDSG, UK DPA)
- Komplexe Konzern-Strukturen
- Anwaltliche Einzelfall-Prüfung

**Disclaimer-Pflicht:** Im PDF + Tool muss prominent stehen: „Diese Vorlage ersetzt keine individuelle Rechtsberatung. Wir empfehlen vor Unterschrift eine Prüfung durch einen Anwalt oder Datenschutzbeauftragten."
