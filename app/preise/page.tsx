import { MobileNav } from "@/components/mobile-nav";
import { ToolsDropdown } from "@/components/tools-dropdown";

export const metadata = {
  title: "Preise — Compliflow",
  description:
    "Alle Generatoren sind kostenlos. 0,99€ einmalig pro Dokument, wenn du den Compliflow-Hinweis im Footer entfernen willst.",
};

export default function PreisePage() {
  return (
    <main id="main-content" className="relative z-10 min-h-screen">
      <Header />
      <Hero />
      <Watermark />
      <Funding />
      <FAQ />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="border-b border-[rgba(226,221,209,0.7)]">
      <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 flex items-center justify-between py-5">
        <a href="/" className="flex items-baseline gap-2.5">
          <span className="font-display text-[20px] font-semibold tracking-tight text-ink">
            Compliflow
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded md:inline">
            DSGVO Suite
          </span>
        </a>
        <nav className="flex items-center gap-5 md:gap-7">
          <ToolsDropdown />
          <a href="/blog" className="hidden font-body text-[14px] text-ink-dim hover:text-ink md:inline transition">
            Blog
          </a>
          <a
            href="/datenschutz-generator"
            className="hidden md:inline-flex btn-primary h-9 items-center justify-center gap-2 px-4 font-body text-[13px] font-medium tracking-tight"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-bg" aria-hidden="true" />
            Kostenlos starten
          </a>
          <MobileNav />
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-12 gap-y-8 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-6">
              Preise
            </p>
            <h1 className="font-display text-[40px] font-medium leading-[1.05] tracking-[-0.02em] text-ink sm:text-[56px] lg:text-[72px]">
              <span className="italic text-accent">0 €.</span>{" "}
              Für alle 7 Generatoren.
            </h1>
            <p className="mt-8 measure font-body text-[17px] leading-[1.65] text-ink-dim md:text-[18px]">
              Alle Compliflow-Generatoren sind kostenlos: Impressum, Datenschutz, AVV,
              VVT, Widerruf, AGB und Cookie-Banner. Kein Abo, kein Pro-Modell, keine
              Funktionen hinter einer Paywall. Auch das PDF bekommst du komplett.
            </p>
            <p className="mt-4 measure font-body text-[15px] leading-[1.65] text-ink-faded md:text-[16px]">
              Optional: <strong className="text-ink">0,99&nbsp;€ einmalig pro Dokument</strong>,
              wenn du den dezenten &bdquo;Erstellt mit Compliflow&ldquo;-Hinweis im Footer
              entfernen willst.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="/datenschutz-generator"
                className="btn-primary inline-flex h-12 items-center justify-center gap-2 px-7 font-body text-[15px] font-medium tracking-tight"
              >
                Datenschutz-Generator starten →
              </a>
              <a
                href="/agb-generator"
                className="btn-ghost inline-flex h-12 items-center justify-center px-6 font-body text-[14px] font-medium gap-2"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                AGB-Generator starten
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Watermark() {
  return (
    <section className="border-b border-line bg-bg-soft">
      <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 py-20 lg:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faded mb-10">
          01 · Eine optionale Mikro-Zahlung
        </p>
        <div className="grid grid-cols-12 gap-y-10 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-6">
            <h2 className="font-display text-[32px] font-medium leading-[1.1] tracking-[-0.015em] text-ink md:text-[40px]">
              0,99 € pro Dokument — falls du den Footer-Hinweis weg willst.
            </h2>
            <p className="mt-5 measure font-body text-[16px] leading-[1.65] text-ink-dim">
              Jedes generierte Dokument enthält am Ende einen kleinen Hinweis
              &bdquo;Erstellt mit Compliflow&ldquo;. Wer das nicht möchte, kann es für
              0,99 € einmalig entfernen. Kein Abo, keine Folgekosten.
            </p>
            <ul className="mt-6 space-y-2 font-body text-[14px] text-ink-dim">
              <li>• Bezahlung via Stripe (Karte, Apple Pay, Google Pay)</li>
              <li>• Einmalig pro Dokument-Typ — Datenschutz + AGB = 2× 0,99 €</li>
              <li>• Gespeichert in deinem Browser (kein Account)</li>
              <li>• Widerruf erlischt mit Beginn der Bereitstellung (§ 356 Abs. 5 BGB)</li>
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="border border-line bg-bg p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-4">
                Beispiel
              </p>
              <div className="border border-line bg-bg-soft p-5 mb-3">
                <p className="font-body text-[13px] text-ink leading-relaxed">
                  &hellip; Diese Datenschutzerklärung ist aktuell gültig und hat den
                  Stand vom 16. Juni 2026.
                </p>
                <p className="mt-3 font-body text-[11px] text-ink-faded">
                  Erstellt mit{" "}
                  <span className="underline">Compliflow</span> — kostenloser
                  Datenschutz-Generator
                </p>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded mb-1">
                ↓ Nach Watermark-Removal
              </p>
              <div className="border border-line bg-bg-soft p-5">
                <p className="font-body text-[13px] text-ink leading-relaxed">
                  &hellip; Diese Datenschutzerklärung ist aktuell gültig und hat den
                  Stand vom 16. Juni 2026.
                </p>
                <p className="mt-3 font-body text-[11px] text-ink-faded italic">
                  (kein Footer-Hinweis)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Funding() {
  return (
    <section className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 py-20 lg:py-28">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faded mb-10">
        02 · Wie wir finanziert sind
      </p>
      <div className="grid grid-cols-12 gap-y-10 lg:gap-x-12">
        <div className="col-span-12 lg:col-span-5">
          <h2 className="font-display text-[32px] font-medium leading-[1.1] tracking-[-0.015em] text-ink md:text-[40px]">
            Transparent statt versteckt.
          </h2>
          <p className="mt-5 measure font-body text-[16px] leading-[1.65] text-ink-dim">
            Compliflow finanziert sich über drei Wege — keiner davon kostet dich etwas,
            wenn du nicht willst.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          <FundingCard
            number="01"
            title="DRVN — die Firma hinter Compliflow"
            body="Compliflow wird von DRVN Automatisations (Al-Khalil Aoumeur, Stuttgart) entwickelt. DRVN baut DSGVO-konforme Webseiten und Automatisierungs-Lösungen für kleine Unternehmen. Compliflow ist unser Beitrag an die Community — gleichzeitig lernen Menschen DRVN kennen, manche werden später Webseiten-Kunden."
          />
          <FundingCard
            number="02"
            title="Optionales 0,99 € Watermark-Removal"
            body="Wer den dezenten Compliflow-Hinweis aus seinem generierten Dokument entfernen will, zahlt einmalig 0,99 € pro Dokument-Typ. Mehr als 99 % unserer Nutzer brauchen das nicht — die Free-Version ist voll funktional."
          />
          <FundingCard
            number="03"
            title="Premium Embed-Service (in Vorbereitung)"
            body="In Kürze: Automatisch aktualisierte Datenschutzerklärung, Impressum und Cookie-Banner als JS-Widget. Bei DSGVO-Änderungen aktualisieren wir zentral — alle eingebundenen Webseiten zeigen sofort die neue Version. Geplant zu 7 € / Monat. Heute schon: Free-HTML-Copy-Paste."
          />
        </div>
      </div>

      <p className="mt-12 font-mono text-[10px] uppercase tracking-widest text-ink-faded">
        Kein Tracking · Kein Konto · Daten bleiben in deinem Browser
      </p>
    </section>
  );
}

function FundingCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <article className="border border-line bg-surface p-7">
      <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">
        {number}
      </p>
      <h3 className="font-display text-[22px] font-medium leading-snug tracking-[-0.01em] text-ink">
        {title}
      </h3>
      <p className="mt-4 font-body text-[15px] leading-[1.65] text-ink-dim">{body}</p>
    </article>
  );
}

function FAQ() {
  const items = [
    {
      q: "Wirklich komplett kostenlos? Wo ist der Haken?",
      a: "Es gibt keinen Haken. Alle 7 Generatoren — Impressum, Datenschutz, AVV, VVT, Widerruf, AGB, Cookie-Banner — sind und bleiben gratis. Auch das PDF ist vollständig nutzbar. Im Footer steht 'Erstellt mit Compliflow' — falls du das nicht willst, gibt es das Watermark-Removal für 0,99 €.",
    },
    {
      q: "Was ist das 0,99 € Watermark-Removal genau?",
      a: "Jedes generierte Dokument hat einen dezenten Footer-Hinweis 'Erstellt mit Compliflow'. Wer den nicht möchte, kann ihn einmalig pro Dokument-Typ für 0,99 € entfernen. Bezahlung läuft über Stripe (Karte, Apple Pay, Google Pay). Der Status wird in deinem Browser gespeichert — beim Browser-Wechsel kein automatischer Übertrag.",
    },
    {
      q: "Muss ich ein Konto erstellen?",
      a: "Nein. Du brauchst weder Email noch Konto. Deine Eingaben bleiben in deinem Browser, wir speichern nichts auf unseren Servern. Optional kannst du dich für DSGVO-Updates auf unsere Email-Liste eintragen — Double-Opt-In, jederzeit abbestellbar.",
    },
    {
      q: "Wie verdient ihr dann Geld?",
      a: "Drei Wege: (1) DRVN Automatisations als Mutterfirma — viele Compliflow-Nutzer werden später DRVN-Kunden für DSGVO-Webseiten. (2) Optionales 0,99 € Watermark-Removal. (3) In Kürze: Premium Embed-Service mit Auto-Update bei DSGVO-Änderungen (7 € / Monat). Affiliate-Werbung lehnen wir bewusst ab — sie würde das Vertrauen kosten.",
    },
    {
      q: "Sind die Dokumente rechtlich korrekt?",
      a: "Die Vorlagen decken alle gesetzlich vorgeschriebenen Pflichtinhalte ab: Art. 13/14 + Art. 28 + Art. 30 DSGVO, § 25 TDDDG, § 5 DDG, §§ 305-310 BGB, Anhang § 312f BGB. Aktuell gehalten zu Stand 2026 (AI Act, SCHUFA-Reform, § 26 BDSG-neu, BGH-Cookie-Urteile). Sie ersetzen keine individuelle Rechtsberatung in Sonderfällen.",
    },
    {
      q: "Was, wenn sich Gesetze ändern?",
      a: "Wir aktualisieren die Vorlagen, sobald relevante Änderungen anstehen (z. B. EuGH-Urteile, neue Aufsichtsbehörden-Hinweise). Bestehende statische PDFs ändern sich nicht — du erstellst dann einfach ein neues. Für automatische Updates auf deiner laufenden Webseite kommt unser Premium Embed-Service.",
    },
  ];

  return (
    <section className="border-t border-line">
      <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-12 gap-y-10 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faded">
              03 · Häufige Fragen
            </p>
            <h2 className="mt-4 font-display text-[32px] font-medium leading-[1.1] tracking-[-0.015em] text-ink md:text-[40px]">
              Fragen zum Modell.
            </h2>
            <p className="mt-4 font-body text-[15px] leading-[1.6] text-ink-dim">
              Alle anderen Fragen:{" "}
              <a
                href="mailto:hello@compliflow.de"
                className="link-underline font-medium text-ink"
              >
                hello@compliflow.de
              </a>
            </p>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="border-t border-line">
              {items.map((item) => (
                <details key={item.q} className="group border-b border-line py-6">
                  <summary className="flex cursor-pointer items-start justify-between gap-6">
                    <span className="font-display text-[17px] font-medium leading-snug text-ink md:text-[19px]">
                      {item.q}
                    </span>
                    <span className="faq-icon mt-1 font-display text-[22px] font-medium text-ink-faded group-open:text-accent flex-shrink-0">
                      +
                    </span>
                  </summary>
                  <p className="measure mt-4 font-body text-[15px] leading-[1.65] text-ink-dim">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 py-10">
        <div className="flex flex-col items-start justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faded md:flex-row md:items-center">
          <span>© 2026 Al-Khalil Aoumeur · Compliflow · made by DRVN</span>
          <div className="flex gap-5">
            <a href="/impressum" className="hover:text-ink transition">Impressum</a>
            <a href="/datenschutz" className="hover:text-ink transition">Datenschutz</a>
            <a href="/agb" className="hover:text-ink transition">AGB</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
