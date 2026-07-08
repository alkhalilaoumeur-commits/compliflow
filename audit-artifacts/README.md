# Audit-Artefakte

Erzeugte Belege aus dem Release-Audit. Binärdateien (`pdfs/`, `screenshots/`) sind
gitignored — sie werden per Test/Script regeneriert.

## PDFs neu erzeugen

```bash
npx vitest run audit-artifacts/pdf-artifacts.test.ts
```

Legt in `pdfs/` ab:

| Datei | Inhalt |
|---|---|
| `avv-vollstaendig.pdf` | AVV, alle Felder gefüllt, mit Compliflow-Credit — Umlaute/ß/€, lange Firmennamen |
| `avv-vollstaendig-ohne-credit.pdf` | Wie oben, Watermark gekauft (kein Credit) |
| `avv-lueckenhaft.pdf` | AVV mit leeren Feldern — Layout-Robustheit |
| `vvt-vollstaendig.pdf` | VVT nach Art. 30 DSGVO, voll ausgefüllt |

Der Test prüft zusätzlich automatisch: gültiger `%PDF-`-Header, Umlaute erhalten
(`Müller & Schäfer`, `Françoise Bär`), alle Art.-28-Pflichtabschnitte vorhanden,
**keine** rohen Platzhalter (`{{`, `[FIRMA]`, `undefined`, `null,`, `Lorem ipsum`).

## Manuelle Sichtprüfung

Öffne die PDFs und prüfe: Umlaute/€ korrekt gerendert (Font-Embedding), sehr lange
Firmennamen brechen das Layout nicht, keine unausgefüllten Platzhalter, alle
Pflichtabschnitte lesbar.
