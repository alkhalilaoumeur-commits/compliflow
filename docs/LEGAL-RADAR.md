# LEGAL-RADAR — Rechtsänderungs-Tracking für Compliflow

> **Angelegt:** 2026-07-08
> **Zweck:** System, mit dem wir Rechtsänderungen (DSGVO, TTDSG, BDSG, Urteile,
> Behörden-Leitlinien) zuverlässig erkennen und kontrolliert in unsere
> Templates + Embeds einarbeiten.
> **Ehrliche Messlatte:** 100% Vollständigkeit gibt es nicht — auch nicht bei
> eRecht24 mit Anwälten. Ziel: Nichts Relevantes bleibt länger als 1 Woche
> unentdeckt, und jede Änderung läuft kontrolliert bis in die Embeds durch.

---

## Die 4 Schichten

```
Schicht 1: QUELLEN-REGISTER   → was wir überwachen
Schicht 2: WATCHER (Cron)     → automatisch abrufen + KI-Vorfilter
Schicht 3: REVIEW-QUEUE       → Mensch prüft + gibt frei (Ilias)
Schicht 4: KLAUSEL-MAPPING    → Änderung → betroffene Klauseln → Regeneration
```

---

## Schicht 1 — Quellen-Register

Sortiert nach Verbindlichkeit. RSS = maschinenlesbarer Nachrichten-Feed, den
der Watcher automatisch abrufen kann.

### Stufe A — Gesetze (höchste Verbindlichkeit)

| Quelle | URL | Was kommt da? | Abruf |
|---|---|---|---|
| EUR-Lex / EU-Amtsblatt | eur-lex.europa.eu | Neue EU-Verordnungen (ePrivacy-VO, AI Act, Data Act) | RSS |
| Bundesgesetzblatt | recht.bund.de | BDSG-/TTDSG-/TMG-Änderungen | RSS/Watcher |

### Stufe B — Urteile (ändern die Auslegung)

| Quelle | URL | Was kommt da? | Abruf |
|---|---|---|---|
| EuGH | curia.europa.eu | Grundsatzurteile (Stil: Schrems II, Fashion ID) | RSS |
| BGH Pressestelle | bundesgerichtshof.de | DE-Grundsatzurteile (Stil: Smartlaw, Cookie-Einwilligung) | RSS/Watcher |

### Stufe C — Behörden (de facto Pflichtlektüre)

| Quelle | URL | Was kommt da? | Abruf |
|---|---|---|---|
| DSK (Datenschutzkonferenz) | datenschutzkonferenz-online.de | Orientierungshilfen, Beschlüsse | Watcher + Google Alert "DSK Orientierungshilfe" |
| EDSA/EDPB | edpb.europa.eu | EU-weite Guidelines | RSS |
| BfDI | bfdi.bund.de | Pressemitteilungen, Positionen | RSS |
| LfDI Baden-Württemberg | baden-wuerttemberg.datenschutz.de | Aktivste Landesbehörde, viele Praxishilfen | RSS/Watcher |

### Stufe D — Frühwarnung (interpretieren A-C vor uns)

| Quelle | Typ | Warum |
|---|---|---|
| Dr. Datenschutz (dr-datenschutz.de) | Blog/RSS | Schnelle Einordnung neuer Urteile |
| activeMind AG Newsletter | Newsletter | Praxisnah, DACH-Fokus |
| Härting Rechtsanwälte Blog | Blog/RSS | Juristische Tiefe |
| delegedata / datenschutz-notizen | Blog/RSS | Behörden-Praxis |

**Pflege-Regel:** Neue Quelle gefunden → hier eintragen. Tote Quelle → raus.
Dieses Register ist die Single Source of Truth für den Watcher.

---

## Schicht 2 — Watcher (automatisch, wöchentlich)

**Was:** Ein Cron-Job (zeitgesteuerter Automatik-Lauf), der 1x pro Woche läuft.

**Ablauf:**
1. Alle Feeds/Seiten aus dem Quellen-Register abrufen
2. Neue Einträge seit letztem Lauf sammeln (Abgleich gegen `seen.jsonl`)
3. KI-Vorfilter pro Eintrag:
   - **Relevant?** Betrifft es Datenschutz / Impressum / AVV / AGB / Cookie?
   - **Welche Templates** sind betroffen?
   - **Dringlichkeit:** `SOFORT` (Frist/Bußgeldrisiko) / `NORMAL` (nächster
     Review) / `INFO` (nur wissen)
4. Relevante Treffer als neue Einträge in die Review-Queue schreiben
   (Schicht 3), Rest verwerfen
5. Bei `SOFORT`-Treffern: zusätzlich Notification an Ilias

**Umsetzung (Reihenfolge):**
- [x] V1 (LIVE seit 2026-07-08): Cloud-Routine "Compliflow Legal-Radar (Mo+Do)",
      läuft Montag + Donnerstag ~07:00 Uhr. Quellen-Register + Selbst-Audit-
      Checkliste sind direkt im Agent-Prompt (Cloud sieht keine lokalen Dateien).
      Ergebnisse: https://claude.ai/code (Routine-ID: trig_01AHT8hGDACuw9izT6oJ1JRv)
- [ ] V2 (Phase 2): Script auf dem Hetzner-VPS mit echtem RSS-Parsing +
      Resend-Mail bei `SOFORT`
- [ ] Ergänzend ab sofort (5 Min, manuell): Google Alerts auf
      "DSK Orientierungshilfe", "TTDSG Änderung", "DSGVO Urteil EuGH"
      an hello@compliflow.de

---

## Schicht 3 — Review-Queue (Human-in-the-Loop)

**Harte Regel: Kein Auto-Publish von Rechtstexten ohne menschliche Freigabe.**
Die KI filtert und schlägt Textänderungen vor — freigegeben wird von Ilias
(später: Anwalt im Jahres-Review). Warum: Ein falscher Auto-Update-Text geht
sofort auf ALLE Kunden-Websites gleichzeitig raus.

**Status-Pipeline pro Eintrag:**

```
NEU → GEPRÜFT → TEXT ANGEPASST → CANARY OK → DEPLOYED → KUNDEN BENACHRICHTIGT
                     │
                     └── oder: VERWORFEN (mit 1 Satz Begründung)
```

**Ablage:** Vorerst `docs/legal-radar/queue.md` (einfach, git-versioniert).
Ab Phase 2 → Supabase-Tabelle `legal_changes`, damit das Dashboard und die
Kunden-Notification-Mails darauf zugreifen können.

**Eintrag-Format:**

```markdown
## LR-2026-001 — [Kurztitel]
- Quelle: [URL]
- Datum entdeckt: 2026-07-08
- Dringlichkeit: SOFORT | NORMAL | INFO
- Betroffene Templates: datenschutz, cookie
- Betroffene Klauseln: ga4-hinweis, ttdsg-einwilligung
- Status: NEU
- Was ändert sich: [2-3 Sätze]
- Vorgeschlagene Textänderung: [Link/Diff]
- Freigabe: — (Datum + wer)
```

**Zeitbudget Ilias:** ~15 Min/Woche Queue durchsehen. Plus quartalsweiser
Full-Review aller Templates (halber Tag) als Sicherheitsnetz gegen alles,
was der Watcher übersehen hat.

---

## Schicht 4 — Klausel-Mapping (macht das System wartbar)

**Prinzip:** Jede Klausel in unseren Templates hat eine ID, eine Version und
ein Mapping auf ihre Rechtsgrundlage. Meldet der Watcher "§25 TTDSG geändert",
wissen wir sofort, welche Klauseln betroffen sind — statt 40 Seiten Template
manuell zu durchsuchen.

**Format (pro Klausel, z.B. in `lib/datenschutz/defaults.ts` als Metadaten):**

```typescript
{
  id: "ga4-hinweis",
  version: "2026.06.1",
  rechtsgrundlage: ["Art. 6 Abs. 1 lit. a DSGVO", "§25 Abs. 1 TTDSG"],
  templates: ["datenschutz"],
  changelog: [
    { version: "2026.06.1", datum: "2026-06-10", grund: "Initial", quelle: "-" }
  ]
}
```

**Update-Fluss bei einer Rechtsänderung:**

```
Watcher meldet Änderung an §25 TTDSG
  → Mapping: betroffen sind Klauseln [ga4-hinweis, cookie-einwilligung]
  → Ilias prüft + passt Klauseltexte an → neue Klausel-Version
  → Canary: 1-2 Test-Embeds regenerieren + Sichtprüfung
  → Rollout: Cron regeneriert alle aktiven Embeds mit betroffenen Klauseln
  → Notification-Mail an betroffene Lizenz-Inhaber
    ("Dein Datenschutztext wurde aktualisiert wegen XY")
  → Queue-Eintrag auf DEPLOYED + Changelog-Eintrag in der Klausel
```

**Audit-Trail:** Der Changelog pro Klausel dokumentiert, WAS wann WARUM auf
Basis WELCHER Quelle geändert wurde. Wichtig für Kundenvertrauen ("warum hat
sich mein Text geändert?") und als Absicherung bei Streitfällen.

---

## Sicherheitsnetze (weil der Watcher nie 100% fängt)

1. **Quartals-Review:** Alle Templates komplett gegenlesen (halber Tag,
   Kalender-Termin — ohne Termin passiert es nicht)
2. **Anwalts-Check:** Ab ~500€ MRR einen Fachanwalt für IT-Recht für einen
   Jahres-Review buchen (500-1.500€ einmalig). Ehrlicher Kontext: Das ist der
   Moat von eRecht24 — unserer ist Preis + UX, nicht anwaltliche Tiefe.
3. **Kunden als Sensoren:** Feedback-Link im Embed-Footer ("Fehler im Text
   melden") — Kunden mit eigenem Datenschutzbeauftragten finden Lücken zuerst.

---

## Nächste Schritte

1. [ ] Google Alerts einrichten (5 Min, manuell — Ilias)
2. [ ] `docs/legal-radar/queue.md` anlegen beim ersten echten Fund
3. [ ] Watcher V1 als Scheduled Agent aufsetzen (wöchentlich)
4. [ ] Klausel-Metadaten beim Bau des Datenschutz-Generators direkt mit
       anlegen (NICHT nachrüsten — beim Bauen ist es 1h, nachträglich 1 Tag)

---

## Bezug

- Embed-Risiken, die noch offen sind: `docs/nichtvergessen.md`
- Embed-Technik + Phasen: `docs/WEB-EMBED-IMPLEMENTATION.md`
- Monetarisierung: `docs/MONETIZATION-STRATEGY.md`
