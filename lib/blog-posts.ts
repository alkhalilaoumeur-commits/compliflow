export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: number;
  content: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "avv-dsgvo-art-28-leitfaden-2026",
    title: "AVV nach DSGVO Art. 28 — Vollständiger Leitfaden 2026",
    excerpt:
      "Was ein Auftragsverarbeitungsvertrag ist, wann er Pflicht ist, und welche 13 Mindestinhalte er enthalten muss. Mit konkreten Beispielen für Stripe, Google Workspace und Vercel.",
    category: "DSGVO Grundlagen",
    date: "2026-06-01",
    readingTime: 8,
    content: `
## Was ist ein AVV?

Ein Auftragsverarbeitungsvertrag (AVV) ist ein schriftlicher Vertrag zwischen einem Verantwortlichen (du) und einem Auftragsverarbeiter (z.B. Stripe, Google, Vercel). Er regelt, wie der Auftragsverarbeiter personenbezogene Daten in deinem Auftrag verarbeitet.

Die Rechtsgrundlage ist **Art. 28 DSGVO**. Ohne AVV drohen Bußgelder bis zu 10 Mio. € oder 2 % des weltweiten Jahresumsatzes.

## Wann brauchst du einen AVV?

Immer wenn ein externer Dienstleister in deinem Auftrag personenbezogene Daten verarbeitet. Das betrifft fast jeden Online-Dienst:

- **E-Mail-Marketing:** Mailchimp, Brevo, ActiveCampaign
- **Payment:** Stripe, PayPal, Mollie
- **Hosting:** AWS, Vercel, Hetzner, DigitalOcean
- **Analytics:** Google Analytics, Plausible (auch wenn DSGVO-konform)
- **CRM:** HubSpot, Salesforce, Pipedrive
- **Kommunikation:** Slack, Microsoft Teams, Zoom

## Die 13 Mindestinhalte nach Art. 28 Abs. 3 DSGVO

Ein rechtlich wirksamer AVV muss mindestens enthalten:

1. Gegenstand und Dauer der Verarbeitung
2. Art und Zweck der Verarbeitung
3. Art der personenbezogenen Daten
4. Kategorien betroffener Personen
5. Pflichten und Rechte des Verantwortlichen
6. Weisungsgebundenheit des Auftragsverarbeiters
7. Vertraulichkeitspflicht
8. Technische und organisatorische Maßnahmen (TOM)
9. Regelung zu Subauftragsverarbeitern
10. Unterstützung bei Betroffenenanfragen
11. Löschung oder Rückgabe nach Auftragsende
12. Nachweis- und Prüfpflichten
13. Drittlandübermittlungen (Schrems II)

## Häufige Fehler

**Fehler 1: Kein AVV mit US-Anbietern**
Viele Selbstständige nutzen Stripe, Google Analytics oder AWS ohne AVV. Das ist ein DSGVO-Verstoß.

**Fehler 2: Veraltete AVV-Vorlagen**
Nach dem Schrems-II-Urteil (2020) und dem EU-US Data Privacy Framework (2023) müssen AVVs aktualisiert werden.

**Fehler 3: Fehlende Subauftragsverarbeiter-Klausel**
Stripe nutzt AWS als Infrastruktur — das muss im AVV stehen.

## Fazit

Ein AVV ist keine Formalität, sondern ein echtes rechtliches Dokument. Mit Compliflow generierst du in 10 Minuten einen DSGVO-konformen AVV — kostenlos, kein Account nötig.
    `.trim(),
  },
  {
    slug: "avv-google-workspace-pflicht",
    title: "Brauche ich einen AVV mit Google Workspace? Ja — hier warum",
    excerpt:
      "Google Workspace verarbeitet E-Mails, Dokumente und Kontakte deiner Kunden. Warum das Pflicht ist, wie du ihn abschließt, und was das EU-US Data Privacy Framework 2023 ändert.",
    category: "Praxis",
    date: "2026-05-20",
    readingTime: 5,
    content: `
## Google Workspace und die DSGVO

Wenn du Google Workspace (Gmail, Drive, Docs, Meet) für dein Business nutzt, verarbeitet Google personenbezogene Daten in deinem Auftrag — E-Mail-Adressen, Inhalte von Nachrichten, Dokumente mit Kundendaten.

Das ist klassische Auftragsverarbeitung nach Art. 28 DSGVO. Ein AVV ist Pflicht.

## Wie schließt du den AVV mit Google ab?

Google stellt einen AVV automatisch bereit. Du musst ihn aktiv akzeptieren:

1. Google Admin Console öffnen
2. Account → Rechtliche Grundlagen → Datenschutz
3. "Datenverarbeitungsänderung" akzeptieren

**Wichtig:** Das ist kein Kompromiss — du nimmst Googles AVV-Konditionen an, nicht die eigenen. Du brauchst aber trotzdem einen eigenen AVV für deine Datenschutzerklärung.

## Was hat sich durch das EU-US DPF 2023 geändert?

Seit Juli 2023 gilt das EU-US Data Privacy Framework (Nachfolger von Privacy Shield). Das bedeutet:

- US-Anbieter mit DPF-Zertifizierung (darunter Google) sind wieder als sicher eingestuft
- Drittlandübermittlungen zu zertifizierten US-Anbietern sind legal
- Du musst im AVV trotzdem die Grundlage der Übermittlung angeben

## Fazit

Ja, du brauchst einen AVV mit Google. Compliflow generiert ihn in 10 Minuten — inklusive korrekter Drittland-Klausel für die USA.
    `.trim(),
  },
  {
    slug: "avv-steuerberater-pflicht-checkliste",
    title: "AVV-Pflicht für Selbstständige — Die Checkliste für 2026",
    excerpt:
      "Welche Tools einen AVV erfordern, wer kontrolliert, und wie hoch die Bußgelder wirklich sind. Eine praktische Checkliste für Freelancer und kleine Unternehmen.",
    category: "Checkliste",
    date: "2026-05-10",
    readingTime: 6,
    content: `
## Wer kontrolliert AVVs?

In Deutschland sind die Landesdatenschutzbehörden (LfD) zuständig. Sie führen Stichproben durch und reagieren auf Beschwerden — auch von Mitbewerbern oder Kunden.

## Die 10 häufigsten Dienste ohne AVV

Laut DSGVO-Prüfungen der letzten Jahre fehlt bei diesen Diensten am häufigsten ein AVV:

1. **Stripe** (Payment)
2. **Google Analytics** (Analytics)
3. **Mailchimp / Brevo** (E-Mail-Marketing)
4. **Calendly** (Terminbuchung)
5. **Notion** (Projektmanagement mit Kundendaten)
6. **Slack** (interne Kommunikation mit Kundendaten)
7. **Zoom** (Videokonferenzen)
8. **HubSpot** (CRM)
9. **Vercel / Netlify** (Hosting mit User-Daten)
10. **Typeform / JotForm** (Formulare mit personenbezogenen Daten)

## Was droht ohne AVV?

Bußgelder nach Art. 83 Abs. 4 DSGVO: bis zu **10 Mio. € oder 2 % des weltweiten Jahresumsatzes** (der höhere Betrag gilt).

In der Praxis: Die meisten Verfahren gegen Kleinunternehmer enden mit **500–5.000 €** — oft wegen fehlendem AVV kombiniert mit anderen Verstößen.

## Checkliste: Hast du alle AVVs?

- [ ] Stripe oder anderer Payment-Anbieter
- [ ] E-Mail-Marketing-Tool (Mailchimp, Brevo etc.)
- [ ] Hosting-Provider (Hetzner, Vercel, AWS etc.)
- [ ] Cloud-Speicher (Google Drive, Dropbox etc.)
- [ ] CRM oder Kundendatenbank
- [ ] Analyse-Tool (auch DSGVO-konforme wie Plausible)
- [ ] Buchungssystem (Calendly etc.)
- [ ] Buchhaltungssoftware (Lexoffice, DATEV etc.)

## Fazit

Wenn du auch nur einen Dienst aus dieser Liste nutzt — und fast jeder tut das — brauchst du einen AVV. Compliflow erstellt ihn kostenlos, in 10 Minuten, direkt im Browser.
    `.trim(),
  },
  {
    slug: "verarbeitungsverzeichnis-vorlage-kostenlos",
    title: "Verarbeitungsverzeichnis Vorlage — kostenlos, DSGVO Art. 30 konform",
    excerpt:
      "Was ein Verarbeitungsverzeichnis ist, wer es braucht, welche 8 Pflichtangaben rein müssen — und wie du es in 10 Minuten kostenlos erstellen kannst.",
    category: "Verarbeitungsverzeichnis",
    date: "2026-06-05",
    readingTime: 7,
    content: `
## Was ist ein Verarbeitungsverzeichnis?

Das Verarbeitungsverzeichnis (VVT) ist ein internes Dokument, das alle Prozesse in deinem Unternehmen listet, bei denen personenbezogene Daten verarbeitet werden — von der Kundenverwaltung über die Buchhaltung bis zum Newsletter.

Die Pflicht kommt aus **Art. 30 Abs. 1 DSGVO** und gilt seit 2018. Bei einer Datenschutz-Prüfung wird es als Erstes verlangt.

## Wer braucht ein Verarbeitungsverzeichnis?

**Kurzantwort: Fast jeder Selbstständige und jedes Unternehmen.**

Ausnahme: Betriebe mit weniger als 250 Mitarbeitern müssen keins führen — aber NUR wenn sie keine Daten verarbeiten, die ein Risiko für betroffene Personen darstellen. In der Praxis trifft diese Ausnahme kaum jemanden:

- Wenn du Kundendaten führst → Pflicht
- Wenn du einen Newsletter betreibst → Pflicht
- Wenn du Mitarbeiter hast → Pflicht
- Wenn du Stripe, Google Analytics oder ein CRM nutzt → Pflicht

## Die 8 Pflichtangaben nach Art. 30 Abs. 1 DSGVO

Jede Verarbeitungstätigkeit in deinem VVT muss diese Angaben enthalten:

1. **Name und Kontakt des Verantwortlichen** (du oder dein Unternehmen)
2. **Zweck der Verarbeitung** (z.B. "Rechnungsstellung und Kundenpflege")
3. **Kategorien betroffener Personen** (z.B. Kunden, Mitarbeiter, Interessenten)
4. **Kategorien personenbezogener Daten** (z.B. Name, E-Mail, Bankverbindung)
5. **Empfänger der Daten** (wer bekommt die Daten: Steuerberater, Cloud-Anbieter etc.)
6. **Übermittlung in Drittländer** (USA, Indien etc. — erfordert Schrems-II-Garantien)
7. **Geplante Löschfristen** (z.B. Rechnungen 10 Jahre nach HGB)
8. **Technische und organisatorische Maßnahmen (TOMs)** (wie die Daten geschützt werden)

## Beispiel: Was gehört in ein VVT für einen Freelancer?

Typische Verarbeitungstätigkeiten für einen Solo-Selbstständigen:

**1. Kundenverwaltung / CRM**
- Zweck: Vertragsabschluss und -abwicklung
- Daten: Name, Adresse, E-Mail, Vertragsdaten
- Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
- Löschfrist: 3 Jahre nach Vertragsende (§ 195 BGB)

**2. Buchhaltung**
- Zweck: Rechnungsstellung, Steuerrecht
- Daten: Name, Adresse, Bankverbindung, Rechnungsbeträge
- Rechtsgrundlage: Art. 6 Abs. 1 lit. c DSGVO (gesetzliche Pflicht)
- Löschfrist: 10 Jahre (§ 257 HGB, § 147 AO)

**3. E-Mail-Marketing**
- Zweck: Newsletter, Angebote
- Daten: E-Mail-Adresse, Opt-In-Datum
- Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
- Löschfrist: Bis Widerruf der Einwilligung

## Was passiert ohne Verarbeitungsverzeichnis?

Bußgelder nach Art. 83 Abs. 4 DSGVO bis **10 Mio. € oder 2 % des weltweiten Jahresumsatzes**. In der Praxis bei Kleinunternehmern: 500–5.000 € — meist bei Kombination mit anderen Verstößen.

Wichtiger: Die Datenschutzbehörde fragt das VVT als Erstes bei einer Prüfung ab. Ohne es gilt die gesamte Datenschutzorganisation als mangelhaft.

## Fazit

Ein Verarbeitungsverzeichnis braucht niemand monatelang zu erstellen. Compliflow führt dich in 10 Minuten durch alle 8 Pflichtangaben — kostenlos, kein Account, Daten bleiben in deinem Browser.
    `.trim(),
  },
  {
    slug: "ttdsg-cookie-banner-pflicht-2026",
    title: "TTDSG und DSGVO: Cookie-Banner Pflicht 2026 — Was Selbstständige wissen müssen",
    excerpt:
      "Seit dem TTDSG 2021 gelten für Cookies strengere Regeln als unter der alten DSGVO-Auslegung. Warum ein einfaches 'OK'-Banner nicht ausreicht, was technische Cookies sind, und wann der Consent wirklich freiwillig ist.",
    category: "Cookie-Banner",
    date: "2026-06-08",
    readingTime: 6,
    content: `
## Was ist das TTDSG?

Das **Telekommunikation-Telemedien-Datenschutz-Gesetz (TTDSG)** trat am 1. Dezember 2021 in Kraft und ergänzt die DSGVO im Bereich Cookies und digitale Dienste. Während die DSGVO allgemein für personenbezogene Daten gilt, regelt das TTDSG speziell den Zugriff auf Endgeräte — also das Setzen und Auslesen von Cookies, Local Storage und ähnlicher Technologien.

**Kurzfassung:** Ohne ausdrückliche Einwilligung dürfen keine nicht-notwendigen Cookies gesetzt werden. Das gilt seit dem TTDSG noch strenger als vorher.

## Welche Cookies brauchen keinen Consent?

Nach § 25 Abs. 2 TTDSG sind Cookies ohne Einwilligung erlaubt, wenn sie:

- **Technisch notwendig** sind, um einen ausdrücklich angeforderten Dienst bereitzustellen (z.B. Session-Cookies für den Login, Warenkorb-Cookies)
- **Ausschließlich zur Übertragung einer Nachricht** über ein Netz verwendet werden

Alles andere — Analytics, Marketing, Retargeting, Social-Media-Plugins — braucht aktiven Consent.

## Was macht einen Cookie-Banner DSGVO-konform?

**1. Kein "Dark Pattern" beim Ablehnen**
Die Datenschutzbehörden haben klargestellt: Der "Ablehnen"-Button muss genauso prominent sein wie der "Akzeptieren"-Button. Ein kleines Kreuzchen versteckt im Footer reicht nicht.

**2. Kein Pre-Checked**
Checkboxen müssen leer sein. Vorausgewählte Einwilligungen sind unwirksam.

**3. Granularität**
Nutzer müssen einzelne Zwecke (Analytics, Marketing, etc.) separat ein- und ausschalten können.

**4. Widerruf so einfach wie Einwilligung**
Ein Consent-Button oben, kein Widerruf zu finden: Das ist nicht konform. Nutzer müssen ihre Einwilligung jederzeit widerrufen können.

**5. Kein Consent-Gating**
Inhalte dürfen nicht hinter einer Consent-Mauer versteckt werden, wenn die Nutzung des Dienstes nicht von Tracking abhängt.

## Reicht Google Analytics mit Consent noch?

Ja — aber nur mit echtem Opt-in und aktiviertem **Google Consent Mode V2**. Ohne Consent Mode schickt Google Analytics Daten auch ohne Cookie. Consent Mode verhindert das: Bei abgelehntem Consent werden nur anonymisierte Ping-Daten gesendet (Conversion Modeling, kein personenbezogenes Tracking).

**Praktische Umsetzung:**
- Google Tag Manager: Consent Mode V2 konfigurieren
- Analytics-Skript erst nach Consent laden
- "Grundlegende Einwilligungen" korrekt taggen

## Was kostet ein nicht-konformer Cookie-Banner?

Die deutschen Datenschutzbehörden verhängen bei Cookie-Verstößen typischerweise:

- **Kleinunternehmer / Selbstständige:** 500–5.000 € (Ermessen)
- **Mittelständische Unternehmen:** 10.000–100.000 €
- **Konzerne:** Bis 20 Mio. € oder 4 % weltweiter Jahresumsatz (DSGVO-Maximum)

Wichtig: Cookie-Beschwerden können von jedem eingereicht werden — auch von Mitbewerbern.

## Checkliste: Ist dein Cookie-Banner konform?

- [ ] Akzeptieren und Ablehnen gleich prominent
- [ ] Keine vorausgewählten Checkboxen
- [ ] Granulare Zwecke (Analytics, Marketing getrennt)
- [ ] Widerruf jederzeit möglich (z.B. Einstellungen-Link im Footer)
- [ ] Technische Cookies ausgenommen (kein Consent-Erfordernis)
- [ ] Google Consent Mode V2 aktiv (bei Google Analytics)
- [ ] Audit-Trail vorhanden (wer hat wann was akzeptiert?)

## Was Compliflow anbietet

Der **Compliflow Cookie-Banner** (Launch: 19. August 2026) adressiert genau diese Anforderungen: fünf Banner-Stile, Google Consent Mode V2 direkt integriert, vollständiger Audit-Trail, gleich prominente Buttons — und ein Snippet pro Domain ohne Plugin-Installation.

Bis zum Launch kannst du dich auf die Warteliste eintragen und bekommst 34 % Early-Bird-Rabatt.
    `.trim(),
  },
  {
    slug: "avv-mailchimp-newsletter-dienste-dsgvo",
    title: "AVV für Mailchimp & Newsletter-Dienste — Pflicht und Muster 2026",
    excerpt:
      "Wer Mailchimp, Brevo, CleverReach oder Klaviyo nutzt, braucht zwingend einen AVV. Wie du ihn abschließt, was er enthalten muss — und wo der Haken bei US-Anbietern liegt.",
    category: "AVV",
    date: "2026-06-09",
    readingTime: 7,
    content: `
## Brauche ich für Mailchimp einen AVV?

Ja — zwingend. Wenn du Mailchimp, Brevo, CleverReach, Klaviyo oder einen anderen E-Mail-Marketing-Dienst nutzt, verarbeitet dieser personenbezogene Daten (mindestens: E-Mail-Adressen, Versandverhalten) in deinem Auftrag. Das löst nach **Art. 28 DSGVO** die Pflicht zum Abschluss eines Auftragsverarbeitungsvertrags aus.

Es spielt dabei keine Rolle, ob du fünf Abonnenten oder fünfzigtausend hast.

## Was ist bei US-Anbietern zu beachten?

Mailchimp, Klaviyo und viele andere Dienste sind US-Unternehmen. Seit dem **Schrems-II-Urteil** (EuGH 2020) und dem Wegfall des Privacy Shield reicht ein einfacher AVV alleine nicht mehr. Du benötigst zusätzlich:

- **EU-Standardvertragsklauseln (SCC)** der EU-Kommission (2021er Fassung)
- Ein **Transfer Impact Assessment (TIA)**: Bewertung ob das SCC-Niveau im Zielland tatsächlich gewährleistet ist
- Ggf. zusätzliche technische Maßnahmen (Verschlüsselung, Pseudonymisierung)

Das klingt komplex — in der Praxis stellen die meisten großen Anbieter die SCC als Standard-Vertragszusatz bereit.

## Wo findest du den AVV für gängige Newsletter-Dienste?

**Mailchimp (Intuit):** Unter _Account → Legal → Data Processing Agreement_ im Mailchimp-Dashboard. Mailchimp stellt DPA + SCC als vorkonfiguriertes Dokument bereit.

**Brevo (ehem. Sendinblue):** Unter _Einstellungen → Mein Unternehmen → Rechtliches_. Brevo hat EU-Server-Option (Frankfurt), was die Drittland-Problematik entschärft.

**CleverReach:** DPA direkt im Dashboard unter _Einstellungen → Datenschutz_. Hosting in Deutschland (Oldenburg).

**Klaviyo:** Unter _Settings → Privacy & Compliance → Data Processing Agreement_.

**ActiveCampaign:** DPA im Kundenkonto unter _Settings → Privacy_.

## Was muss der AVV mit dem Newsletter-Dienst enthalten?

Nach **Art. 28 Abs. 3 DSGVO** mindestens:

- Gegenstand und Dauer der Verarbeitung
- Art und Zweck der Verarbeitung (E-Mail-Marketing, Tracking)
- Art der personenbezogenen Daten (E-Mail, Name, IP-Adresse, Klickverhalten)
- Betroffenengruppen (Newsletter-Abonnenten, Kunden)
- Pflichten und Rechte des Verantwortlichen

Zusätzlich: Weisungsgebundenheit, Vertraulichkeit, Sicherheitsmaßnahmen (TOMs), Subauftragsverarbeiter (z.B. AWS hinter Mailchimp), Unterstützungspflichten, Rückgabe/Löschung nach Vertragsende.

## Subauftragsverarbeiter: Das vergessen die meisten

Mailchimp selbst nutzt AWS als Cloud-Infrastruktur. Damit ist AWS ein **Sub-Auftragsverarbeiter** — du musst im AVV prüfen, ob der Hauptanbieter seine Sub-AV listet und dir widersprechungsrecht einräumt. Der Mailchimp-DPA enthält eine Liste aller Sub-Prozessoren.

## Einen eigenen AVV mit deinem Dienstleister abschließen?

In manchen Fällen — z.B. wenn du einen deutschen IT-Dienstleister mit Newsletter-Versand beauftragst statt Mailchimp direkt zu nutzen — musst du einen **eigenen AVV** abschließen. Der Dienstleister ist dann dein Auftragsverarbeiter, nicht Mailchimp.

Für diesen Fall kannst du den [Compliflow AVV-Generator](/avv) nutzen: alle 13 Pflichtinhalte nach Art. 28 DSGVO, Live-Vorschau, PDF-Download — kostenlos und ohne Account.

## Checkliste: AVV für Newsletter-Dienste

- [ ] Anbieter identifizieren (Mailchimp, Brevo etc.)
- [ ] DPA/AVV im Kundenkonto abschließen oder hochladen
- [ ] Prüfen: EU-Hosting oder US-Hosting?
- [ ] Bei US-Hosting: SCC + TIA vorhanden?
- [ ] Sub-Auftragsverarbeiter-Liste des Anbieters dokumentieren
- [ ] AVV in Datenschutzdokumentation aufnehmen
- [ ] Im Verarbeitungsverzeichnis (Art. 30) eintragen

## Fazit

Newsletter-Marketing ohne AVV ist in Deutschland ein bekanntes Bußgeld-Risiko. Die gute Nachricht: Alle gängigen Dienste stellen fertige DPAs bereit. Du musst sie nur abrufen und abschließen — oder für individuelle Dienstleister einen eigenen AVV erstellen.
    `.trim(),
  },
  {
    slug: "welche-dienste-brauchen-avv-dsgvo-liste",
    title: "Welche Dienste brauchen einen AVV? Die vollständige Liste für Selbstständige",
    excerpt:
      "Stripe, Google Analytics, Notion, Zoom, Calendly — welche deiner Tools lösen die AVV-Pflicht aus? Eine praxisnahe Übersicht für Freelancer und kleine Unternehmen.",
    category: "DSGVO Grundlagen",
    date: "2026-06-09",
    readingTime: 6,
    content: `
## Die Grundregel: Wann ist ein AVV Pflicht?

Ein Auftragsverarbeitungsvertrag ist immer dann Pflicht, wenn ein externer Dienstleister **in deinem Auftrag** personenbezogene Daten verarbeitet. Die Schlüsselfrage: Nutzt du ein Tool, das dabei Daten von deinen Kunden, Interessenten oder Mitarbeitern anfasst?

Ist die Antwort ja → AVV Pflicht.

## Zahlungsabwicklung

**Stripe:** Pflicht. Stripe verarbeitet Zahlungsdaten deiner Kunden (Name, E-Mail, IBAN/Karte). Stripe stellt einen fertigen DPA bereit — im Stripe-Dashboard unter _Settings → Legal → Data Processing Agreement_. SCC für US-Transfer enthalten.

**PayPal:** Pflicht. Ähnlich wie Stripe. Im PayPal-Account unter _Rechtliches → DPA_ verfügbar.

**Mollie / Klarna / Adyen:** Pflicht. Alle stellen fertige DPAs bereit.

## E-Mail & Kommunikation

**Google Workspace (Gmail, Drive, Docs):** Pflicht. Google verarbeitet E-Mail-Inhalte, Dokumente und Kontaktdaten. Google stellt einen DPA bereit; Google Cloud Frankfurt ist als EU-Datenstandort verfügbar.

**Microsoft 365 / Outlook:** Pflicht. Microsoft stellt Data Processing Addendum bereit.

**Zoom:** Pflicht. Teilnehmerdaten, Aufnahmen, Chat-Verläufe — alles personenbezogen.

**Slack:** Pflicht. Kommunikationsinhalte, Nutzerdaten, Integration mit anderen Tools.

**Calendly:** Pflicht. Bucher-Daten (Name, E-Mail) werden in Calendly-Systemen gespeichert.

## Marketing & Analytics

**Google Analytics (GA4):** Pflicht. IP-Adressen und Nutzungsverhalten sind personenbezogen. Ohne Cookie-Banner und AVV ist GA4 in Deutschland abmahnfähig.

**Plausible Analytics:** Kein AVV nötig. Plausible verarbeitet keine personenbezogenen Daten und ist cookieless DSGVO-konform.

**Mailchimp / Brevo / CleverReach:** Pflicht. E-Mail-Adressen, Klickverhalten, Versandhistorie.

**HubSpot / Salesforce:** Pflicht. CRM-Daten sind per Definition personenbezogen.

## Projektmanagement & Ablage

**Notion:** Pflicht — wenn du dort Kundendaten, Mitarbeiterdaten oder personenbezogene Informationen speicherst. Notion ist ein US-Dienst (Cloudflare/AWS-Infrastruktur).

**Airtable / Monday.com / Trello:** Pflicht bei Kundendaten.

**Dropbox / Google Drive:** Pflicht wenn Kundendokumente oder personenbezogene Dateien gespeichert werden.

## Buchhaltung & Rechnungen

**Lexoffice / sevDesk / FastBill:** Pflicht. Diese Tools verarbeiten Kundenstammdaten und Rechnungsdaten.

**DATEV:** Pflicht — und hier oft vergessen: Auch der Steuerberater braucht einen AVV mit dir, wenn er deine Kundendaten in DATEV verarbeitet.

## Hosting & Infrastruktur

**Hetzner / Strato / IONOS:** Pflicht. Jeder Hosting-Anbieter der Zugriff auf deine Kundendaten hat. Hetzner (Deutschland) stellt eine fertige DPA bereit.

**Vercel / Netlify / AWS:** Pflicht. Log-Dateien enthalten IP-Adressen = personenbezogen.

**Cloudflare:** Pflicht. CDN verarbeitet technisch personenbezogene Daten (IPs).

## Support & Chat

**Freshdesk / Zendesk / Intercom:** Pflicht. Kundensupport-Anfragen mit Namen, E-Mails, Beschreibungen.

**Typeform / JotForm:** Pflicht wenn Formulare personenbezogene Daten erfassen (fast immer).

## Wann ist kein AVV nötig?

- **Gemeinsame Verantwortlichkeit**: Wenn zwei Firmen gemeinsam über Zweck und Mittel entscheiden → statt AVV eine _Joint Controller Agreement_ nach Art. 26 DSGVO
- **Auftragsverarbeiter als eigenständig Verantwortliche**: Wenn ein Dienstleister Daten für eigene Zwecke nutzt → er ist dann selbst Verantwortlicher, kein Auftragsverarbeiter
- **Reine Leitungsträger**: Telekommunikationsanbieter haben eine eigene Rechtsgrundlage

## So gehst du vor

1. Liste alle Tools auf, die du in deinem Unternehmen nutzt
2. Filtere: Welche verarbeiten personenbezogene Daten?
3. Für jeden Dienst: DPA im Kundenkonto abrufen und abschließen
4. Für eigene Dienstleister ohne fertigen DPA: [Eigenen AVV erstellen](/avv)
5. Alle AVVs im Verarbeitungsverzeichnis dokumentieren ([VVT erstellen](/vvt))

Die meisten großen US-Dienste haben fertige DPAs. Bei kleineren Dienstleistern oder lokalen Anbietern musst du oft selbst einen AVV aufsetzen — genau dafür ist der Compliflow AVV-Generator da.
    `.trim(),
  },
  {
    slug: "dsgvo-freelancer-selbstaendige-pflichten-2026",
    title: "DSGVO für Freelancer und Selbstständige — was ist wirklich Pflicht?",
    excerpt:
      "Als Freelancer bist du selbst Verantwortlicher nach DSGVO — auch ohne Angestellte. Welche Pflichten du hast, was du sofort tun solltest, und was du dir sparen kannst.",
    category: "DSGVO Grundlagen",
    date: "2026-06-09",
    readingTime: 7,
    content: `
## Die kurze Antwort

Ja, auch Freelancer und Soloselbstständige unterliegen der DSGVO — sobald sie personenbezogene Daten von Dritten (Kunden, Interessenten) verarbeiten. Das gilt ab dem ersten Angebots-E-Mail.

Die gute Nachricht: Als Einzelperson ohne Angestellte entfällt ein Teil der Pflichten. Aber der Kern bleibt.

## Was Freelancer definitiv brauchen

### 1. Datenschutzerklärung auf der Website

Pflicht ab dem ersten Tag. Inhalt: Welche Daten, zu welchem Zweck, auf welcher Rechtsgrundlage. Kontaktformulare, Analytics, Newsletter — alles muss transparent erklärt sein.

### 2. Auftragsverarbeitungsverträge (AVV) mit Tools

Jedes Tool das du für Kundendaten nutzt, benötigt einen AVV:

- **E-Mail:** Google Workspace, Outlook/Microsoft 365, Fastmail
- **Projektmanagement:** Notion, Asana, ClickUp, Trello
- **Buchhaltung:** Lexoffice, Billomat, FastBill, DATEV
- **Kommunikation:** Slack, Zoom, Microsoft Teams
- **Dateiablage:** Google Drive, Dropbox, OneDrive
- **Newsletter:** Mailchimp, Brevo, ActiveCampaign

[Hier kostenlos einen AVV erstellen →](/avv)

### 3. Verarbeitungsverzeichnis (VVT) nach Art. 30 DSGVO

Auch Selbstständige müssen ein VVT führen — die Ausnahme für Unternehmen unter 250 Mitarbeitern gilt nicht pauschal. Sie gilt nur, wenn die Verarbeitung kein Risiko für Betroffene darstellt. Praktisch: Führe es einfach, dann bist du auf der sicheren Seite.

[VVT kostenlos erstellen →](/vvt)

### 4. Betroffenenrechte ermöglichen

Kunden können jederzeit Auskunft, Löschung oder Berichtigung ihrer Daten verlangen. Du musst innerhalb von einem Monat antworten. Tipp: Speichere Daten nur so lange wie nötig.

## Was Freelancer NICHT brauchen

**Datenschutzbeauftragter:** Erst Pflicht ab 20 Mitarbeitern, die regelmäßig personenbezogene Daten verarbeiten (seit 2020: 20 statt 10). Als Solo-Freelancer: nicht nötig.

**Datenschutz-Folgenabschätzung (DSFA):** Nur bei hochriskanter Verarbeitung (z.B. medizinische Daten, biometrische Erkennung, systematische Überwachung). Für normale Freelancer irrelevant.

**Aufzeichnung von Verarbeitungen in Subunternehmen:** Nur relevant wenn du selbst Auftragsverarbeiter bist (z.B. als Datenschutzberater, der für andere Firmen tätig wird).

## Die 5 häufigsten DSGVO-Fehler von Freelancern

**Fehler 1: Kein AVV mit dem E-Mail-Anbieter**
Du bearbeitest Kunden-E-Mails über Gmail oder Outlook. Beide verarbeiten personenbezogene Daten für dich. Ohne AVV: Verstoß.

**Fehler 2: Google Analytics ohne Datenschutzerklärung**
Jeder Website-Besucher wird getrackt. Kein Tracking ohne Disclosure — oder DSGVO-konformes Analytics ohne Consent nutzen (z.B. Plausible).

**Fehler 3: Kein Impressum und keine Datenschutzerklärung auf der Website**
Pflicht für jede geschäftliche Website, auch Freelancer-Portfolios.

**Fehler 4: Kundendaten unbegrenzt lang aufbewahren**
Nach Abschluss eines Projekts dürfen Kontaktdaten nicht für immer gespeichert bleiben. Handelsrechtliche Aufbewahrungspflicht: 6–10 Jahre für Rechnungen, aber nicht für alle Daten.

**Fehler 5: Tools ohne Prüfung nutzen**
Neues Projektmanagement-Tool eingeführt? Erstmal prüfen: Wo liegen die Server? Gibt es eine DPA? Gehört der Anbieter zu einem US-Konzern?

## Konkrete Checkliste für Freelancer

- [ ] Datenschutzerklärung auf Website vorhanden und aktuell
- [ ] Impressum vorhanden (§ 5 TMG)
- [ ] AVV mit allen Drittanbietern abgeschlossen ([jetzt erstellen](/avv))
- [ ] Verarbeitungsverzeichnis angelegt ([jetzt erstellen](/vvt))
- [ ] Kontaktformular-Einträge: Speicherdauer festgelegt
- [ ] Newsletter: Double-Opt-In, Abmeldefunktion, AVV mit E-Mail-Anbieter
- [ ] Rechnungen: 10 Jahre aufbewahren (§ 147 AO), danach löschen
- [ ] Anfragen von Betroffenen: Prozess festgelegt (Antwort in 30 Tagen)

## Was kostet ein DSGVO-Verstoß als Freelancer?

Die Aufsichtsbehörden haben die Verhältnismäßigkeit im Blick — ein Soloselbstständiger wird anders behandelt als ein Konzern. Typische Bußgelder für kleine Verstöße: 1.000–10.000 €.

Aber: Der Reputationsschaden kann größer sein als das Bußgeld. Kunden die wissen dass du DSGVO-konform arbeitest, vertrauen dir mehr — besonders B2B.

## Fazit

DSGVO als Freelancer ist kein Monster. Die drei wichtigsten Schritte: Datenschutzerklärung, AVVs mit Tools abschließen, VVT anlegen. Mit Compliflow erledigst du AVV und VVT kostenlos in 15 Minuten.
    `.trim(),
  },
  {
    slug: "verarbeitungsverzeichnis-erstellen-anleitung-art-30-dsgvo",
    title: "Verarbeitungsverzeichnis erstellen — Schritt-für-Schritt-Anleitung (Art. 30 DSGVO)",
    excerpt:
      "Was ein VVT ist, wer es braucht, wie du es korrekt aufbaust — und welche 10 Tätigkeiten typische Unternehmen führen. Mit Vorlage und kostenlosem Generator.",
    category: "Verarbeitungsverzeichnis",
    date: "2026-06-09",
    readingTime: 8,
    content: `
## Was ist ein Verarbeitungsverzeichnis?

Das Verarbeitungsverzeichnis (VVT) nach Art. 30 DSGVO ist eine interne Dokumentation aller Vorgänge, bei denen personenbezogene Daten verarbeitet werden. Es ist kein öffentliches Dokument — du führst es intern und legst es auf Anfrage der Datenschutzbehörde vor.

Ohne VVT: Bußgeld nach Art. 83 Abs. 4 DSGVO bis zu **10 Mio. € oder 2 % des weltweiten Jahresumsatzes**.

## Wer muss ein VVT führen?

**Grundsatz:** Jede natürliche oder juristische Person, Behörde, Einrichtung oder Stelle, die personenbezogene Daten verarbeitet.

**Die Ausnahme** (Art. 30 Abs. 5 DSGVO): Unternehmen mit weniger als 250 Mitarbeitern KÖNNEN auf das VVT verzichten — aber nur wenn die Verarbeitung kein Risiko für die Betroffenen darstellt, nicht regelmäßig erfolgt und keine besonderen Datenkategorien (Art. 9) verarbeitet werden.

**Praktisch:** Diese Ausnahme greift für die meisten KMU und Selbstständigen nicht, weil fast immer mindestens eine Verarbeitung regelmäßig erfolgt (Kundendaten, Newsletter, Buchhaltung). Führe ein VVT — du bist damit auf der sicheren Seite.

## Was muss ins VVT? (Art. 30 Abs. 1 DSGVO)

Für jede Verarbeitungstätigkeit benötigst du:

1. **Bezeichnung der Tätigkeit** (z.B. "Kundenverwaltung", "Newsletter-Versand")
2. **Zweck der Verarbeitung** (wozu werden die Daten verwendet?)
3. **Rechtsgrundlage** (Art. 6 DSGVO — Einwilligung, Vertrag, berechtigtes Interesse etc.)
4. **Kategorien betroffener Personen** (Kunden, Mitarbeiter, Bewerber, Website-Besucher)
5. **Kategorien personenbezogener Daten** (Name, E-Mail, Adresse, Zahlungsdaten etc.)
6. **Empfänger der Daten** (interne Stellen und externe Dienstleister)
7. **Drittlandtransfers** (Daten außerhalb der EU — Garantien nach Art. 44 ff.)
8. **Löschfristen** (wann werden die Daten gelöscht oder archiviert?)
9. **Technische und organisatorische Maßnahmen** (TOMs nach Art. 32 DSGVO)
10. **Datenschutzbeauftragter** (falls vorhanden)

## Die 10 häufigsten Verarbeitungstätigkeiten im KMU

### 1. Kundenverwaltung
**Daten:** Name, Adresse, E-Mail, Telefon, Kaufhistorie
**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b (Vertragserfüllung)
**Löschfrist:** 3 Jahre nach letztem Kontakt, Rechnungen 10 Jahre (§ 257 HGB)

### 2. Buchhaltung und Rechnungswesen
**Daten:** Name, Adresse, IBAN, Betrag, Steuer-ID
**Rechtsgrundlage:** Art. 6 Abs. 1 lit. c (rechtliche Verpflichtung)
**Löschfrist:** 10 Jahre (§ 147 AO, § 257 HGB)

### 3. Newsletter-Marketing
**Daten:** E-Mail-Adresse, Name, Opt-in-Datum, Klickverhalten
**Rechtsgrundlage:** Art. 6 Abs. 1 lit. a (Einwilligung — Double Opt-in Pflicht!)
**Löschfrist:** Sofort nach Widerruf der Einwilligung

### 4. Mitarbeiterverwaltung
**Daten:** Personalstammdaten, Gehalt, Bankverbindung, Krankenfehlzeiten
**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b + § 26 BDSG
**Löschfrist:** 3 Monate nach Austritt für Bewerbungsunterlagen; Lohnunterlagen 10 Jahre

### 5. Website-Betrieb (Logfiles)
**Daten:** IP-Adressen, Browser-Typ, aufgerufene Seiten, Timestamps
**Rechtsgrundlage:** Art. 6 Abs. 1 lit. f (berechtigtes Interesse — IT-Sicherheit)
**Löschfrist:** Maximal 7 Tage (Orientierung: BSI-Empfehlung)

### 6. Kontaktformulare / Anfragen
**Daten:** Name, E-Mail, Nachrichteninhalt
**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b (vorvertragliche Maßnahmen) oder lit. f
**Löschfrist:** 6 Monate nach Abschluss der Kommunikation

### 7. Bewerbermanagement
**Daten:** Lebenslauf, Zeugnisse, Foto, Kontaktdaten
**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b + § 26 BDSG
**Löschfrist:** 3 Monate nach Absage (§ 15 AGG), sofern keine Einwilligung zur längeren Speicherung

### 8. Web-Analytics
**Daten:** IP-Adressen (ggf. anonymisiert), Seitenaufrufe, Verhalten
**Rechtsgrundlage:** Art. 6 Abs. 1 lit. a (Einwilligung) bei Tracking mit Cookies; lit. f bei cookielosem Analytics (z.B. Plausible)
**Löschfrist:** Je nach Tool — Plausible 2 Jahre, GA4 konfigurierbar (Standard 14 Monate)

### 9. E-Mail-Kommunikation
**Daten:** E-Mail-Adressen, Nachrichteninhalte, Anhänge
**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b (Vertragsdurchführung) oder lit. f
**Löschfrist:** 3 Jahre nach Abschluss des Geschäftsvorgangs, Handelsbriefe 6 Jahre (§ 257 HGB)

### 10. Zahlungsabwicklung
**Daten:** Name, IBAN, Kreditkartendaten (via Stripe), Betrag
**Rechtsgrundlage:** Art. 6 Abs. 1 lit. b (Vertragserfüllung)
**Löschfrist:** 10 Jahre (steuerrechtliche Aufbewahrungspflicht)

## Typische Empfänger im VVT

Für jede Tätigkeit musst du die Empfänger (intern und extern) angeben:

- **IT-Hosting:** Hetzner, AWS, Vercel
- **E-Mail:** Google Workspace, Outlook/Microsoft 365
- **Payment:** Stripe, PayPal
- **Newsletter:** Mailchimp, Brevo
- **Buchhaltung:** Lexoffice, DATEV, Steuerberater
- **Analytics:** Plausible, GA4
- **CRM:** HubSpot, Salesforce

Für alle externen Dienstleister, die personenbezogene Daten verarbeiten: [AVV abschließen](/avv).

## So erstellst du dein VVT in 10 Minuten

1. **Starte den VVT-Generator** auf [compliflow.de/vvt](/vvt)
2. **Gib dein Unternehmen ein** (Name, Adresse, Vertreter, E-Mail)
3. **Wähle deine Tätigkeiten** aus 10 vorbereiteten Vorlagen (Kundenverwaltung, Newsletter, Buchhaltung etc.)
4. **Passe die Felder an** (Löschfristen, Empfänger, Rechtsgrundlage)
5. **PDF herunterladen** — fertig.

Das generierte PDF enthält alle Pflichtfelder nach Art. 30 DSGVO. Kostenlos, kein Account nötig.

## Wie oft muss das VVT aktualisiert werden?

Das Gesetz sagt: Immer wenn sich die Verarbeitungstätigkeit ändert. In der Praxis: **Mindestens einmal jährlich** überprüfen. Anlass für Updates:

- Neue Tools eingeführt (neues CRM, neuer Hoster)
- Neue Mitarbeiter oder Tätigkeiten
- Änderung bei Löschfristen
- Neuer Dienstleister (neues AVV nötig)
- Behördliche Vorgabe geändert

## Fazit

Das Verarbeitungsverzeichnis ist kein Monster. Mit dem [Compliflow VVT-Generator](/vvt) erledigst du es in 10 Minuten — kostenlos, kein Account, alle Pflichtfelder vorausgefüllt. Danach hast du ein rechtssicheres Dokument, das du bei Behördenanfragen vorlegen kannst.
    `.trim(),
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
