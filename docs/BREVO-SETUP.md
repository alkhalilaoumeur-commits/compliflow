# Brevo (Email-Marketing) — Setup-Anleitung

> Erstellt: 2026-06-16  
> Sprint 6 Output: Email-Capture-Pipeline ist im Code, **Brevo-Konfiguration manuell durch Ilias erforderlich**.

## Warum Brevo (und nicht Mailchimp/ConvertKit)

| Faktor | Brevo | Mailchimp | ConvertKit |
|---|---|---|---|
| Server-Standort | EU (Frankfurt) | USA | USA |
| DSGVO-Konformität | ✅ EU-Server, AVV ohne SCCs | ⚠️ SCCs nötig | ⚠️ SCCs nötig |
| Free-Tier | 300 Mails/Tag, unbegrenzte Kontakte | 500 Kontakte | 1.000 Kontakte |
| Double-Opt-In | ✅ eingebaut | ✅ eingebaut | ✅ eingebaut |
| API | dokumentiert, einfach | dokumentiert | dokumentiert |
| **Für Compliflow ideal** | ✅ — DSGVO-Tool sollte DSGVO-konformen Anbieter nutzen | ❌ | ❌ |

## Was du in Brevo machen musst

### Schritt 1: Brevo-Account erstellen
1. https://onboarding.brevo.com/account/register
2. Plan: **Free** reicht (300 Mails/Tag — bei Launch sehr gut)
3. Sprache: Deutsch
4. Adresse: deine Compliflow-Adresse (Egilolfstraße 41, Stuttgart)

### Schritt 2: Double-Opt-In-Liste anlegen
1. Brevo Dashboard → Contacts → Lists → **Create New List**
2. Name: **"Compliflow Newsletter"**
3. Folder: "Marketing" (oder neuer Folder)
4. ID merken — meist `1` für die erste Liste

### Schritt 3: Double-Opt-In-Email-Template
1. Brevo Dashboard → Email Templates → **Create New Template**
2. Modus: **Double-Opt-In Confirmation**
3. Sprache: Deutsch
4. Betreff: "Bitte bestätige deine E-Mail-Adresse"
5. Inhalt (Beispiel):

```
Hallo,

vielen Dank für dein Interesse an Compliflow.

Bitte bestätige deine E-Mail-Adresse durch Klick auf diesen Link:

[Bestätigen]  {{ params.DOUBLE_OPT_IN }}

Wenn du dich nicht angemeldet hast, ignoriere diese Mail einfach.

Beste Grüße,
Ilias von Compliflow
compliflow.de
```

6. Template-ID merken (z.B. `1`)

### Schritt 4: API-Key generieren
1. Brevo Dashboard → SMTP & API → API Keys → **Create New API Key**
2. Name: "Compliflow Production"
3. Berechtigungen: Default reicht
4. Key kopieren (wird nur einmal angezeigt!) — Format: `xkeysib-...`

### Schritt 5: DPA (Auftragsverarbeitungsvertrag) abschließen
1. Brevo Dashboard → Account Settings → Compliance → **Sign DPA**
2. Formular ausfüllen mit Compliflow-Daten
3. Bestätigung herunterladen + in Vault ablegen (`vault/agency/intern/avv/brevo-dpa-2026-XX-XX.pdf`)

### Schritt 6: Environment-Variablen setzen

**Production (Coolify):**
```env
BREVO_API_KEY=xkeysib-...
BREVO_LIST_ID=1
BREVO_DOI_TEMPLATE_ID=1
NEXT_PUBLIC_APP_URL=https://compliflow.de
```

**Lokal (`.env`):**
```env
# Leer lassen für Mock-Modus
# BREVO_API_KEY=
```

→ Im Mock-Modus simuliert die API erfolgreichen Versand, ohne Brevo zu kontaktieren.

## Was Compliflow technisch macht

| Komponente | Was sie tut |
|---|---|
| `lib/brevo/client.ts` | Wrapper für Brevo `/contacts/doubleOptinConfirmation` API |
| `app/api/brevo/subscribe/route.ts` | POST-Endpoint: Rate-Limit 5/Min, Email-Validierung, Consent-Pflicht-Check |
| `components/email-capture/capture-card.tsx` | Universelle Capture-UI: Email + Consent-Checkbox + Status-Feedback |
| `app/datenschutz/page.tsx` | NEU: § 4a Newsletter-Klausel mit Brevo-Daten + Rechtsgrundlage Art. 6 Abs. 1 lit. a + Speicherdauer |

## User-Flow

1. User füllt Wizard aus, kommt im Review-Step an
2. Right-Sidebar zeigt **"Bleib auf dem Laufenden"**-Karte
3. User trägt E-Mail ein, klickt Consent-Checkbox
4. Click "Anmelden" → POST `/api/brevo/subscribe` mit `{email, quelle, consent}`
5. Brevo verschickt automatisch Bestätigungs-Mail an User
6. UI zeigt: "Bitte bestätige deine E-Mail aus dem Posteingang"
7. User klickt Link in Mail → Brevo bestätigt → User auf Liste
8. Brevo-Liste hat Tags `QUELLE` und `ANMELDUNG_DATUM` für Segmentierung

## Plausible-Events

| Event | Wann | Props |
|---|---|---|
| `Email Captured` | Click auf "Anmelden" erfolgreich | `quelle` (welcher Generator), `mode` (mock/live), `isNew` |

## Open Tasks für Ilias

- [ ] Brevo-Account anlegen (Free-Plan)
- [ ] Liste "Compliflow Newsletter" erstellen + ID notieren
- [ ] Double-Opt-In-Template erstellen + ID notieren
- [ ] API-Key generieren
- [ ] DPA in Brevo unterzeichnen + PDF in Vault ablegen
- [ ] Env-Vars in Coolify Production eintragen
- [ ] Test in Production: 1× Email anmelden, DOI-Mail erhalten, bestätigen, Liste prüfen

## DSGVO-Checkliste (Compliflow als DSGVO-Tool MUSS sauber sein)

- ✅ Brevo als Auftragsverarbeiter in Datenschutzerklärung gelistet (§ 4a)
- ✅ EU-Server (Frankfurt) — keine SCCs/DPF nötig
- ✅ Double-Opt-In gesetzlich verpflichtend (§ 7 UWG) — eingebaut
- ✅ Consent-Checkbox als getrennte Einwilligung (NICHT pre-checked, NICHT mit anderen Aktionen koppeln)
- ✅ Abmelde-Hinweis in jeder Mail (Brevo macht automatisch)
- ✅ Speicherdauer transparent kommuniziert (3 Jahre nach letzter Interaktion)
- ✅ AVV mit Brevo abschließen (Schritt 5)
