import Image from "next/image";
import { WaitlistForm } from "@/components/waitlist-form";
import { Countdown } from "@/components/countdown";
import { ScrollReveal } from "@/components/scroll-reveal";
import { DocumentMockup } from "@/components/document-mockup";
import { ExitPopup } from "@/components/exit-popup";
import { MobileNav } from "@/components/mobile-nav";
import { tools } from "@/lib/tools";
import { PRIMER, FAQS } from "@/lib/content";
import { BLOG_POSTS } from "@/lib/blog-posts";

export default function Home() {
  return (
    <main className="relative z-10 min-h-screen">
      <ExitPopup />
      <Header />
      <UrgencyBar />
      <Hero />
      <ToolLogos />
      <TrustAndStats />
      <HowItWorks />
      <PhotoSection />
      <Suite />
      <Comparison />
      <Primer />
      <BlogTeaser />
      <Faq />
      <Waitlist />
      <Footer />
    </main>
  );
}

function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-[rgba(226,221,209,0.7)]">
      <Container className="flex items-center justify-between py-5">
        <a href="/" className="fade-in flex items-baseline gap-2.5">
          <span className="font-display text-[20px] font-semibold tracking-tight text-ink">
            Compliflow
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded md:inline">
            DSGVO Suite
          </span>
        </a>
        <nav className="fade-in flex items-center gap-5 md:gap-7">
          <a
            href="/avv"
            className="hidden md:inline font-body text-[14px] text-ink-dim hover:text-ink"
          >
            AVV
          </a>
          <a
            href="/vvt"
            className="hidden md:inline font-body text-[14px] text-ink-dim hover:text-ink"
          >
            VVT
          </a>
          <a
            href="/preise"
            className="hidden md:inline font-body text-[14px] text-ink-dim hover:text-ink"
          >
            Preise
          </a>
          <a
            href="/blog"
            className="hidden md:inline font-body text-[14px] text-ink-dim hover:text-ink"
          >
            Blog
          </a>
          <a
            href="/avv"
            className="hidden md:inline-flex btn-primary h-9 items-center justify-center gap-2 px-4 font-body text-[13px] font-medium tracking-tight"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-bg" aria-hidden="true" />
            Kostenlos starten
          </a>
          <MobileNav />
        </nav>
      </Container>
    </header>
  );
}

function UrgencyBar() {
  return (
    <div className="border-b border-[rgba(31,61,47,0.25)] bg-[rgba(31,61,47,0.06)]">
      <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-1.5 py-2.5 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent font-semibold">
          <svg className="inline-block mr-1.5 mb-0.5 h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.5L1.5 13h13L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 6v3.5M8 11.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>DSGVO-Pflicht
        </span>
        <span className="hidden font-body text-[12px] text-ink-dim sm:inline">
          Ohne AVV: Bußgeld bis <strong className="text-ink">20 Mio. €</strong> nach Art. 83 DSGVO
        </span>
        <span className="hidden font-body text-[12px] text-ink-dim md:inline">·</span>
        <span className="hidden font-body text-[12px] text-ink-dim md:inline">
          Alle Pflichtinhalte nach Art. 28 DSGVO — <strong className="text-ink">kostenlos</strong>
        </span>
        <a href="/avv" className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent underline underline-offset-2">
          Jetzt absichern →
        </a>
      </Container>
    </div>
  );
}

function ToolLogos() {
  const services = [
    "Stripe", "Google Workspace", "AWS", "Vercel", "Mailchimp",
    "HubSpot", "Zoom", "Calendly", "Notion", "Slack", "Dropbox", "GitHub",
  ];
  return (
    <section className="border-b border-line bg-surface">
      <Container className="py-7">
        <p className="mb-5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faded">
          Passende AVV-Klauseln für alle wichtigen Dienste
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {services.map((name) => (
            <span
              key={name}
              className="border border-line bg-bg px-3 py-1 font-mono text-[11px] tracking-wide text-ink-dim hover:border-accent hover:text-ink transition-colors"
            >
              {name}
            </span>
          ))}
          <span className="border border-dashed border-line px-3 py-1 font-mono text-[11px] tracking-wide text-ink-faded">
            + alle anderen
          </span>
        </div>
      </Container>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative">
      <Container className="grid grid-cols-12 gap-y-10 pt-20 pb-24 lg:gap-x-12 lg:pt-28 lg:pb-32">
        <div className="col-span-12 lg:col-span-8">
          <p
            className="rise mb-7 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent"
            style={{ animationDelay: "0ms" }}
          >
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[rgba(31,61,47,0.6)]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Tools 01 + 02 live — AVV & Verarbeitungsverzeichnis
          </p>

          <h1
            className="rise balance font-display text-[44px] font-medium leading-[1.05] tracking-[-0.02em] text-ink sm:text-[56px] md:text-[68px] lg:text-[80px]"
            style={{ animationDelay: "80ms" }}
          >
            Compliance, in Stunden statt{" "}
            <em className="italic text-accent">Anwaltstagen.</em>
          </h1>

          <p
            className="rise measure mt-8 font-body text-[18px] leading-[1.6] text-ink-dim md:text-[19px]"
            style={{ animationDelay: "160ms" }}
          >
            Compliflow ist die DSGVO-Werkbank für deutsche Selbstständige und
            Agenturen: AVV-Generator, Verarbeitungsverzeichnis und Cookie-Banner —
            drei Tools auf einer Domain, alle Pflichtfelder nach Art. 28 und Art. 30
            DSGVO, Sitz in Stuttgart, Datenhaltung in Frankfurt.
          </p>

          <div
            className="rise mt-10 flex flex-wrap items-center gap-x-4 gap-y-3"
            style={{ animationDelay: "240ms" }}
          >
            <a
              href="/avv"
              className="btn-primary inline-flex h-12 items-center justify-center gap-2 px-7 font-body text-[15px] font-medium tracking-tight"
            >
              AVV-Generator kostenlos starten
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="/vvt"
              className="btn-ghost inline-flex h-12 items-center justify-center px-6 font-body text-[14px] font-medium gap-2"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              Verarbeitungsverzeichnis starten
            </a>
            <span className="hidden font-body text-[13px] text-ink-faded md:inline">
              <Countdown variant="compact" for="cookie-banner" /> bis Cookie-Banner
            </span>
          </div>

          <div
            className="rise mt-6 flex flex-wrap items-center gap-x-5 gap-y-2"
            style={{ animationDelay: "320ms" }}
          >
            <span className="flex items-center gap-1.5 font-body text-[13px] text-ink-dim">
              <svg className="h-3.5 w-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              Kein Account nötig
            </span>
            <span className="flex items-center gap-1.5 font-body text-[13px] text-ink-dim">
              <svg className="h-3.5 w-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              Alle 13 Pflichtinhalte nach Art. 28
            </span>
            <span className="flex items-center gap-1.5 font-body text-[13px] text-ink-dim">
              <svg className="h-3.5 w-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              Daten verlassen nie deinen Browser
            </span>
          </div>
        </div>

        <aside
          className="rise col-span-12 lg:col-span-4 lg:pt-2"
          style={{ animationDelay: "360ms" }}
        >
          <DocumentMockup />
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded">
            <Countdown variant="compact" for="cookie-banner" /> bis Cookie-Banner
          </p>
        </aside>
      </Container>
    </section>
  );
}

function Suite() {
  return (
    <section id="suite" className="relative">
      <Container className="py-24 lg:py-32">
        <div className="mb-16 grid grid-cols-12 gap-y-6 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faded">
              02 · Die Suite
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <h2 className="balance font-display text-[34px] font-medium leading-[1.1] tracking-[-0.015em] text-ink md:text-[44px]">
              Drei eigenständige Werkzeuge. Eine Suite.
            </h2>
            <p className="measure mt-5 font-body text-[16px] leading-[1.6] text-ink-dim">
              Du brauchst nicht alle drei am ersten Tag — AVV und VVT sind jetzt live, Cookie-Banner kommt im August. Alle komplett kostenlos, ohne Account, ohne Upload.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-y-12 lg:gap-x-10">
          {tools.map((tool, i) => {
            const isLive = tool.status === "live";
            const Wrapper = isLive && tool.href ? "a" : "article";
            const wrapperProps = isLive && tool.href ? { href: tool.href } : {};
            return (
              <ScrollReveal key={tool.id} delay={i * 100} className="col-span-12 lg:col-span-4">
              <Wrapper
                {...wrapperProps}
                className={`group block w-full h-full ${
                  isLive
                    ? "card-hover border border-line bg-surface p-7 cursor-pointer shadow-sm hover:border-accent hover:shadow-md"
                    : "border border-[rgba(226,221,209,0.4)] p-7 opacity-70"
                }`}
              >
                <div className="flex items-baseline justify-between border-b border-line pb-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded">
                    {tool.idx}
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.15em] ${
                      isLive ? "text-accent font-semibold" : "text-ink-faded"
                    }`}
                  >
                    {isLive && (
                      <span
                        className="relative inline-flex h-1.5 w-1.5 mr-1.5 align-middle"
                        aria-hidden="true"
                      >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                      </span>
                    )}
                    {tool.launchLabel}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-[26px] font-medium leading-[1.15] tracking-[-0.01em] text-ink md:text-[28px]">
                  {tool.name}
                </h3>
                <p className="mt-4 font-body text-[15px] leading-[1.65] text-ink-dim">
                  {tool.pitch}
                </p>
                <ul className="mt-6 space-y-2.5 border-t border-line pt-5 font-body text-[14px] text-ink-dim">
                  {tool.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span className="text-accent mt-0.5 flex-shrink-0" aria-hidden="true">
                        ›
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {isLive && (
                  <div className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent group-hover:gap-3 transition-all">
                    Jetzt öffnen
                    <span aria-hidden="true" className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                )}
              </Wrapper>
              </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function TrustAndStats() {
  const rows = [
    { value: "0 €", label: "Kostenlos", meta: "für immer" },
    { value: "10 Min.", label: "Bis zum PDF", meta: "statt Anwaltstagen" },
    { value: "100%", label: "Im Browser", meta: "kein Upload, kein Konto" },
    { value: "Art. 28 & 30", label: "DSGVO-konform", meta: "alle Pflichtfelder abgedeckt" },
    { value: "EU", label: "Hosting", meta: "Frankfurt · kein US-Server" },
    { value: "20 Mio. €", label: "Bußgeld-Risiko", meta: "ohne AVV nach Art. 83" },
  ];

  return (
    <section className="border-y border-line bg-surface">
      <Container className="grid grid-cols-3 gap-y-8 gap-x-6 py-10 md:grid-cols-6 md:py-12">
        {rows.map((r, i) => (
          <ScrollReveal key={r.label} delay={i * 60}>
            <div className="flex flex-col">
              <span className="font-display text-[22px] font-medium tracking-[-0.02em] text-ink leading-tight">
                {r.value}
              </span>
              <span className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink">
                {r.label}
              </span>
              <span className="font-body text-[11px] text-ink-faded">{r.meta}</span>
            </div>
          </ScrollReveal>
        ))}
      </Container>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Daten eingeben",
      body: "Du gibst deinen Unternehmensnamen, deine Adresse und deine Verarbeitungstätigkeiten ein — keine Rechtskenntnisse nötig. Geführte Felder mit Erklärungen auf Deutsch.",
      tag: "5 Minuten",
    },
    {
      n: "02",
      title: "Wizard durchlaufen",
      body: "Schritt für Schritt durch alle Pflichtfelder nach DSGVO. Rechtsgrundlagen, Betroffenengruppen, Datenkategorien, Empfänger, Löschfristen — alles vorausgefüllt, anpassbar.",
      tag: "Geführt",
    },
    {
      n: "03",
      title: "PDF herunterladen",
      body: "Fertig. Dein rechtlich korrektes Dokument wird direkt im Browser erstellt — kein Upload, kein Konto, keine Wartezeit. Sofort-Download als PDF.",
      tag: "Sofort",
    },
  ];

  return (
    <section className="border-t border-line">
      <Container className="py-24 lg:py-32">
        <div className="mb-16 grid grid-cols-12 gap-y-6 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faded">
              01 · Wie es funktioniert
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <h2 className="balance font-display text-[34px] font-medium leading-[1.1] tracking-[-0.015em] text-ink md:text-[44px]">
              Von null auf compliant in 10 Minuten.
            </h2>
            <p className="measure mt-5 font-body text-[16px] leading-[1.6] text-ink-dim">
              Kein Anwalt. Kein Upload. Kein Konto. Alles läuft lokal in deinem Browser.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-y-8 lg:gap-x-10">
          {steps.map((step, i) => (
            <ScrollReveal
              key={step.n}
              delay={i * 100}
              className="col-span-12 lg:col-span-4"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center bg-accent text-bg">
                  <span className="font-mono text-[13px] font-bold tracking-widest">
                    {step.n}
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] border border-line px-2.5 py-1 text-ink-faded">
                  {step.tag}
                </span>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block flex-1 h-px bg-line" aria-hidden />
                )}
              </div>
              <h3
                className="font-display text-[24px] font-medium leading-[1.2] tracking-[-0.01em] text-ink"
              >
                {step.title}
              </h3>
              <p className="mt-3 font-body text-[15px] leading-[1.65] text-ink-dim">
                {step.body}
              </p>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-4">
          <a
            href="/avv"
            className="btn-primary inline-flex h-12 items-center gap-2 px-7 font-body text-[14px] font-medium tracking-tight"
          >
            AVV-Generator starten →
          </a>
          <a
            href="/vvt"
            className="btn-ghost inline-flex h-12 items-center gap-2 px-6 font-body text-[14px] font-medium"
          >
            VVT-Generator starten →
          </a>
        </div>
      </Container>
    </section>
  );
}

function PhotoSection() {
  return (
    <section className="relative overflow-hidden" style={{ height: "480px" }}>
      <Image
        src="/images/hero-desk.png"
        alt="Auftragsverarbeitungsvertrag fertig auf Schreibtisch"
        fill
        className="object-cover"
        quality={85}
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(15,18,12,0.82) 0%, rgba(15,18,12,0.65) 45%, rgba(15,18,12,0.1) 100%)",
        }}
      />
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10 lg:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent mb-4">
            Das Ergebnis
          </p>
          <h2
            className="font-display font-medium leading-[1.05] tracking-[-0.02em] max-w-xl"
            style={{ fontSize: "clamp(36px, 5vw, 56px)", color: "#fdfbf6" }}
          >
            Dein AVV.<br />
            <em className="italic" style={{ color: "var(--color-accent)" }}>
              Fertig. Sofort.
            </em>
          </h2>
          <p className="mt-5 font-body text-[16px] leading-relaxed max-w-md" style={{ color: "rgba(253,251,246,0.65)" }}>
            Kein Anwalt. Kein Upload. Kein Warten. Lokal in deinem Browser — das Dokument landet direkt bei dir.
          </p>
          <a
            href="/avv"
            className="mt-8 inline-flex h-12 items-center gap-2 px-7 font-body text-[14px] font-medium tracking-tight"
            style={{ background: "var(--color-accent)", color: "var(--color-bg)" }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-bg opacity-60" aria-hidden="true" />
            AVV kostenlos erstellen →
          </a>
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  const rows = [
    { label: "Zeitaufwand", compliflow: "10–20 Minuten", anwalt: "3–8 Stunden", vorlage: "2–4 Stunden" },
    { label: "Kosten", compliflow: "Kostenlos", anwalt: "300–800 €/h", vorlage: "0 € + Risiko" },
    { label: "Alle Pflichtfelder (Art. 28)", compliflow: "Ja — geführt", anwalt: "Ja", vorlage: "Oft unvollständig" },
    { label: "Datenschutz", compliflow: "100 % lokal", anwalt: "Per E-Mail / Upload", vorlage: "Lokal" },
    { label: "Kein Account nötig", compliflow: "Ja", anwalt: "Nein", vorlage: "Ja" },
    { label: "Sofort verfügbar", compliflow: "Ja", anwalt: "Termin nötig", vorlage: "Ja" },
  ];

  return (
    <section className="border-t border-line bg-surface">
      <Container className="py-24 lg:py-32">
        <div className="mb-14 grid grid-cols-12 gap-y-6 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faded">
              03 · Vergleich
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <h2 className="balance font-display text-[34px] font-medium leading-[1.1] tracking-[-0.015em] text-ink md:text-[44px]">
              Warum nicht einfach zum Anwalt?
            </h2>
            <p className="measure mt-5 font-body text-[16px] leading-[1.6] text-ink-dim">
              Compliflow ist keine Rechtsberatung — aber für Standarddokumente nach Art. 28 und Art. 30 DSGVO sind geführte Vorlagen mit allen Pflichtfeldern für die meisten Selbstständigen die sinnvollere Wahl als Word-Vorlagen ohne Struktur.
            </p>
          </div>
        </div>

        <ScrollReveal>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded w-[32%]">
                  Kriterium
                </th>
                <th className="pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-accent w-[24%]">
                  Compliflow
                </th>
                <th className="pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded w-[22%]">
                  Anwalt
                </th>
                <th className="pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded w-[22%]">
                  Word-Vorlage
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={`border-b border-line ${i % 2 === 0 ? "" : "bg-[rgba(240,236,226,0.3)]"}`}
                >
                  <td className="py-4 font-body text-[14px] text-ink-dim pr-6">
                    {row.label}
                  </td>
                  <td className="py-4 font-body text-[14px] font-medium text-accent">
                    {row.compliflow}
                  </td>
                  <td className="py-4 font-body text-[14px] text-ink-faded">
                    {row.anwalt}
                  </td>
                  <td className="py-4 font-body text-[14px] text-ink-faded">
                    {row.vorlage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </ScrollReveal>

        <div className="mt-8 border-t border-line pt-6 font-body text-[13px] leading-relaxed text-ink-faded">
          Compliflow ersetzt keine individuelle Rechtsberatung. Bei Sonderfällen (besondere Datenkategorien nach Art. 9, Drittlandtransfers, behördliche Prüfungen) einen Datenschutzanwalt einschalten.
        </div>
      </Container>
    </section>
  );
}

function Primer() {
  return (
    <section id="worum" className="border-t border-line bg-surface">
      <Container className="py-24 lg:py-32">
        <div className="mb-20 grid grid-cols-12 gap-y-6 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faded">
              04 · Worum es geht
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <h2 className="balance font-display text-[34px] font-medium leading-[1.1] tracking-[-0.015em] text-ink md:text-[44px]">
              DSGVO ohne Jura-Studium. Drei Begriffe, die jeder Inhaber kennen sollte.
            </h2>
          </div>
        </div>

        <div className="space-y-20 lg:space-y-28">
          {PRIMER.map((p) => (
            <ScrollReveal key={p.id}>
            <article
              className="grid grid-cols-12 gap-y-8 lg:gap-x-12"
            >
              <div className="col-span-12 lg:col-span-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded">
                  {p.eyebrow} · {p.law}
                </p>
                <h3 className="mt-3 font-display text-[28px] font-medium leading-[1.15] tracking-[-0.01em] text-ink md:text-[32px]">
                  {p.title}
                </h3>
                <dl className="mt-6 grid grid-cols-1 gap-y-3 border-t border-line pt-5 font-body text-[13px] sm:grid-cols-2">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faded">
                      Launch
                    </dt>
                    <dd className="mt-1 text-ink">{p.launch}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faded">
                      Dauer
                    </dt>
                    <dd className="mt-1 text-accent">{p.duration}</dd>
                  </div>
                </dl>
              </div>

              <div className="col-span-12 lg:col-span-8">
                <p className="measure font-body text-[17px] leading-[1.65] text-ink md:text-[18px]">
                  {p.body}
                </p>
                <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {p.pillars.map((pillar, i) => (
                    <li
                      key={pillar}
                      className="flex items-baseline gap-3 border-t border-line pt-3 font-body text-[14px] text-ink-dim"
                    >
                      <span className="font-mono text-[11px] text-accent">
                        0{i + 1}
                      </span>
                      <span>{pillar}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function BlogTeaser() {
  const posts = [...BLOG_POSTS]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  return (
    <section className="border-t border-line">
      <Container className="py-20 lg:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-3">
              Blog
            </p>
            <h2 className="font-display text-[32px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
              DSGVO-Wissen,<br />
              <span className="italic">das hilft.</span>
            </h2>
          </div>
          <a
            href="/blog"
            className="hidden md:inline font-mono text-[12px] uppercase tracking-[0.15em] text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors"
          >
            Alle Artikel →
          </a>
        </div>
        <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
          {posts.map((post, i) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`group block py-8 border-t border-line hover:opacity-80 transition-opacity ${
                i < 2 ? "md:border-r md:border-line md:pr-8" : ""
              } ${i > 0 ? "md:pl-8" : ""}`}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
                {post.category}
              </p>
              <h3 className="font-display text-[19px] font-medium leading-snug tracking-tight text-ink group-hover:text-accent transition-colors">
                {post.title}
              </h3>
              <p className="mt-3 font-body text-[13px] leading-relaxed text-ink-faded line-clamp-2">
                {post.excerpt}
              </p>
              <p className="mt-4 font-mono text-[11px] text-ink-faded">
                {post.readingTime} Min. Lesezeit
              </p>
            </a>
          ))}
        </div>
        <div className="mt-6 md:hidden">
          <a
            href="/blog"
            className="font-mono text-[12px] uppercase tracking-[0.15em] text-ink border-b border-ink pb-0.5"
          >
            Alle Artikel →
          </a>
        </div>
      </Container>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="border-t border-line">
      <Container className="py-24 lg:py-32">
        <div className="grid grid-cols-12 gap-y-10 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faded">
              05 · Häufige Fragen
            </p>
            <h2 className="mt-4 balance font-display text-[34px] font-medium leading-[1.1] tracking-[-0.015em] text-ink md:text-[42px]">
              Was Leute uns am häufigsten fragen.
            </h2>
            <p className="measure-narrow mt-5 font-body text-[15px] leading-[1.6] text-ink-dim">
              Wenn deine Frage hier fehlt, schreib uns an{" "}
              <a
                href="mailto:hello@compliflow.de"
                className="link-underline font-medium text-ink"
              >
                hello@compliflow.de
              </a>
              .
            </p>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="border-t border-line">
              {FAQS.map((item) => (
                <details
                  key={item.q}
                  className="group border-b border-line py-6"
                >
                  <summary className="flex cursor-pointer items-start justify-between gap-6">
                    <span className="font-display text-[18px] font-medium leading-snug text-ink md:text-[20px]">
                      {item.q}
                    </span>
                    <span className="faq-icon mt-1 font-display text-[22px] font-medium text-ink-faded group-open:text-accent">
                      +
                    </span>
                  </summary>
                  <p className="measure mt-4 font-body text-[15px] leading-[1.65] text-ink-dim md:text-[16px]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Waitlist() {
  return (
    <section id="warteliste" className="border-t border-line bg-surface">
      <Container className="py-24 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faded">
            06 · Vor dem Launch
          </p>
          <h2 className="mt-5 balance font-display text-[40px] font-medium leading-[1.05] tracking-[-0.02em] text-ink md:text-[56px]">
            Cookie-Banner ist in Arbeit.
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-body text-[16px] leading-[1.6] text-ink-dim">
            Tool 1 (AVV) und Tool 2 (VVT) sind live. Trag dich ein — Anmelder bekommen{" "}
            <span className="text-ink">34 % Rabatt</span> auf den Cookie-Banner Pro
            in der Launch-Woche und Early-Access zwei Tage vorher.
          </p>

          <div className="mt-10 border border-line bg-surface-alt p-6 shadow-md md:p-8">
            <WaitlistForm />
          </div>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded">
            Hosting in Frankfurt · DSGVO-konform · Keine Tracker
          </p>
        </div>
      </Container>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <Container className="py-14">
        <div className="grid grid-cols-12 gap-y-10 gap-x-6">
          <div className="col-span-12 md:col-span-5">
            <p className="font-display text-[20px] font-semibold tracking-tight text-ink">
              Compliflow
            </p>
            <p className="mt-3 max-w-sm font-body text-[14px] leading-[1.55] text-ink-dim">
              DSGVO-Compliance-Tool-Suite. Eine Marke von DRVN — Al-Khalil Aoumeur,
              Stuttgart.
            </p>
            <p className="mt-6 font-body text-[14px] text-ink-faded">
              <Countdown variant="compact" for="cookie-banner" /> bis Cookie-Banner (Tool 3).
            </p>
          </div>

          <div className="col-span-6 md:col-span-2">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded">
              Tools
            </p>
            <ul className="space-y-2 font-body text-[14px] text-ink-dim">
              <li>
                <a href="/avv" className="link-underline hover:text-ink">
                  AVV-Generator
                </a>
              </li>
              <li>
                <a href="/vvt" className="link-underline hover:text-ink">
                  Verarbeitungsverzeichnis
                </a>
              </li>
              <li>
                <a href="/cookie-banner" className="link-underline hover:text-ink">
                  Cookie-Banner
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded">
              Mehr
            </p>
            <ul className="space-y-2 font-body text-[14px] text-ink-dim">
              <li>
                <a href="/preise" className="link-underline hover:text-ink">
                  Preise
                </a>
              </li>
              <li>
                <a href="/blog" className="link-underline hover:text-ink">
                  Blog
                </a>
              </li>
              <li>
                <a href="/#suite" className="link-underline hover:text-ink">
                  Die Suite
                </a>
              </li>
              <li>
                <a href="/#faq" className="link-underline hover:text-ink">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/#warteliste" className="link-underline hover:text-ink">
                  Cookie-Banner Warteliste
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-3">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded">
              Kontakt
            </p>
            <a
              href="mailto:hello@compliflow.de"
              className="link-underline block font-body text-[14px] font-medium text-ink"
            >
              hello@compliflow.de
            </a>
            <p className="mt-3 font-body text-[13px] leading-relaxed text-ink-faded">
              Egilolfstraße 41
              <br />
              70599 Stuttgart
            </p>
            <ul className="mt-5 space-y-1.5 font-body text-[13px] text-ink-dim">
              <li>
                <a href="/impressum" className="link-underline hover:text-ink">
                  Impressum
                </a>
              </li>
              <li>
                <a href="/datenschutz" className="link-underline hover:text-ink">
                  Datenschutz
                </a>
              </li>
              <li>
                <a href="/agb" className="link-underline hover:text-ink">
                  AGB
                </a>
              </li>
              <li>
                <a href="/widerruf" className="link-underline hover:text-ink">
                  Widerruf
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-line pt-6 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faded md:flex-row md:items-center">
          <span>© 2026 Al-Khalil Aoumeur · Compliflow</span>
          <span>Stuttgart · Frankfurt · Plausible Analytics</span>
        </div>
      </Container>
    </footer>
  );
}
