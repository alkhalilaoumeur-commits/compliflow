# NICHT VERGESSEN — Embed-Risiken, um die wir uns kümmern müssen

> **Angelegt:** 2026-07-08
> **Kontext:** Risiken für das Premium-Embed (Phase 2, Monat 2-3), die in
> `WEB-EMBED-IMPLEMENTATION.md` noch NICHT abgedeckt sind.
> **Regel:** Kein Punkt hier darf beim Phase-2-Launch offen sein. Jeder Punkt
> bekommt beim Abarbeiten einen Status: `OFFEN` → `IN ARBEIT` → `ERLEDIGT`.

---

## 1. Die DSGVO-Ironie — Embed ist selbst ein Drittanbieter-Dienst ⚠️ GRÖSSTE LÜCKE

**Status:** OFFEN
**Blockiert:** Phase-2-Launch

**Problem:** Bei jedem Seitenaufruf einer Kundenseite geht die IP-Adresse des
Besuchers an unseren Server (der Browser muss `embed.js` + die API anfragen).
Das ist Datenverarbeitung im Auftrag — wir werden Auftragsverarbeiter unserer
eigenen Kunden.

**Konsequenzen (alle Pflicht):**
- [ ] Der generierte Datenschutztext muss **Compliflow selbst als Dienst nennen**
      (selbstreferenzierende Klausel: "Diese Datenschutzerklärung wird über den
      Dienst Compliflow eingebunden…")
- [ ] Wir müssen Embed-Kunden einen **AVV mit Compliflow anbieten** — dafür haben
      wir praktischerweise einen AVV-Generator
- [ ] Server-Logs der Embed-API: IP-Speicherung minimieren (kürzen/anonymisieren),
      dokumentieren in unserem eigenen VVT

**Warum kritisch:** Ein DSGVO-Tool, das seinen Kunden ein DSGVO-Problem einbaut,
ist ein Marken-Killer und abmahnbar.

---

## 2. JS-Pflichtangaben sind abmahn-anfällig → Progressive Enhancement Pflicht

**Status:** OFFEN
**Blockiert:** Phase-2-Launch

**Problem:** Impressum/Datenschutz müssen "leicht erkennbar und unmittelbar
erreichbar" sein (§5 TMG). Wenn unser Script blockiert wird (Script-Blocker,
Ad-Blocker, CSP) oder der Server down ist, zeigt die Kundenseite ein **leeres
Impressum → der Kunde ist abmahnbar.**

**Lösung — Progressive Enhancement:**
- [ ] Der Kunde bekommt beim Kopieren nicht nur ein leeres `<div>`, sondern das
      `<div>` **mit der aktuellen statischen Version als Inhalt**
- [ ] Das Script **ersetzt** den Inhalt nur, wenn es eine neuere Version gibt
- [ ] Ergebnis: Es gibt nie eine leere Seite, egal was ausfällt

**Hinweis:** Das ist wichtiger als der localStorage-Fallback aus dem
Implementation-Doc — der greift nur bei wiederkehrenden Besuchern.

---

## 3. CSP der Kundenseite blockiert unser Script

**Status:** OFFEN
**Blockiert:** Nicht den Launch, aber den Support-Aufwand

**Problem:** CSP (Content Security Policy — eine Sicherheitsregel, die festlegt,
welche externen Scripts eine Seite laden darf) ist auf vielen Business-Websites
aktiv. Unser Embed lädt dann nicht → Support-Tickets "Embed geht nicht".

**Mitigation:**
- [ ] Fehlerfall im Widget abfangen: statischer Fallback-Text bleibt sichtbar
      (siehe Punkt 2 — löst das Problem zu 90% mit)
- [ ] Doku-Seite ab Tag 1: "Embed lädt nicht? Diese CSP-Einträge hinzufügen:
      `script-src https://compliflow.de; connect-src https://compliflow.de`"
- [ ] Im Dashboard beim Code-Kopieren einen Hinweis auf die Doku-Seite zeigen

---

## 4. Schema-Drift bei Regeneration

**Status:** OFFEN
**Blockiert:** Erste Template-Änderung nach Launch

**Problem:** Eine neue Template-Version braucht ein Feld, das der Kunde im
Wizard nie beantwortet hat (z.B. neue Pflichtangabe durch Gesetzesänderung).
Die automatische Regeneration erzeugt dann Lückentext auf der Kundenseite.

**Mitigation:**
- [ ] Config-Schema versionieren (jede Wizard-Antwort-Struktur hat eine Version)
- [ ] Vor jedem Publish: Validierung "hat jede aktive Config alle Felder, die
      das neue Template braucht?"
- [ ] Bei fehlenden Feldern: **Mail an den Kunden** ("Bitte 1 Frage
      nachbeantworten") + alte Textversion weiter ausliefern — NIEMALS
      kaputten Text pushen

---

## 5. Kein Staging für Template-Updates → Canary-Rollout

**Status:** OFFEN
**Blockiert:** Erste Template-Änderung nach Launch

**Problem:** Ein Tippfehler oder Logikfehler im zentralen Template geht sofort
live auf ALLE Kundenseiten gleichzeitig. Das ist der eine Fehler, der die Marke
killt.

**Mitigation:**
- [ ] Jedes Template-Update erst auf 1-2 eigene Test-Embeds ausrollen
      (Canary — Testkandidaten, die Fehler zuerst zeigen)
- [ ] Sichtprüfung der gerenderten Canaries, dann erst Rollout auf alle
- [ ] Kein Auto-Publish ohne menschliche Freigabe (siehe LEGAL-RADAR.md,
      Review-Queue)

---

## 6. Veraltete Kundendaten → Edit-Dashboard ist Launch-Blocker

**Status:** OFFEN
**Blockiert:** Phase-2-Launch

**Problem:** Kunde zieht um / ändert Firmierung → Embed zeigt alte Adresse.
Rechtlich sein Problem, praktisch unser Support-Ticket.

**Mitigation:**
- [ ] Dashboard `/account/embeds` mit Edit-Funktion für die eigene Config
      (steht schon im Implementation-Doc — hier als harte Abhängigkeit
      festgehalten: **ohne Edit-Dashboard kein Embed-Launch**)
- [ ] Nach Config-Änderung: sofortige Regeneration + Cache-Invalidierung

---

## 7. Rechtsdienstleistungsgesetz (RDG) — Formulierungen absichern

**Status:** OFFEN
**Blockiert:** Marketing-Texte + AGB für Phase 2

**Lage:** Gute Nachricht — der BGH hat 2021 im Smartlaw-Urteil entschieden,
dass automatisierte Vertragsgeneratoren KEINE unerlaubte Rechtsberatung sind.

**Aber diese Grenzen einhalten:**
- [ ] Kein individueller Beratungs-Chat / keine Einzelfall-Empfehlungen
- [ ] Keine Werbung mit "rechtssicher garantiert" o.ä.
- [ ] Disclaimer in AGB + auf Tool-Seiten: "erstellt auf Basis von Mustern,
      ersetzt keine Rechtsberatung im Einzelfall"

---

## 8. Cache-Invalidierung — alte Version hängt im CDN/Browser

**Status:** OFFEN
**Blockiert:** Erste Template-Änderung nach Launch

**Problem:** Nach einem Template-Update liefern CDN-Cache und
localStorage-Fallback noch tagelang die alte Version aus. Bei einer
Rechtsänderung mit Frist ist das ein echtes Problem.

**Mitigation:**
- [ ] Versions-Parameter in der API-Antwort (`version: "2026.07.1"`) — Script
      vergleicht und erzwingt Refresh bei Mismatch
- [ ] CDN-Cache mit kurzer TTL für die API-Route (z.B. 1h), lange TTL nur für
      `embed.js` selbst
- [ ] Bei kritischen Rechtsänderungen: manueller CDN-Purge als dokumentierter
      Schritt in der Update-Checkliste

---

## Bezug

- Bestehende Risiko-Tabelle (Downtime, Lizenz-Abuse, Stripe, DSGVO-Drift):
  `docs/WEB-EMBED-IMPLEMENTATION.md` → Abschnitt "Risiko-Mitigation"
- Rechtsänderungs-Tracking: `docs/LEGAL-RADAR.md`
