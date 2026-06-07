import { WaitlistForm } from "@/components/waitlist-form";
import { Countdown } from "@/components/countdown";
import { tools } from "@/lib/tools";
import { PRIMER, FAQS } from "@/lib/content";

export default function Home() {
  return (
    <main className="relative z-10 min-h-screen">
      <Header />
      <Hero />
      <TrustStrip />
      <Suite />
      <Primer />
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
    <header className="border-b border-line/70">
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
            href="#suite"
            className="hidden font-body text-[14px] text-ink-dim hover:text-ink md:inline"
          >
            Tools
          </a>
          <a
            href="#faq"
            className="hidden font-body text-[14px] text-ink-dim hover:text-ink md:inline"
          >
            Fragen
          </a>
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
            href="/avv"
            className="btn-primary inline-flex h-9 items-center justify-center gap-2 px-4 font-body text-[13px] font-medium tracking-tight"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-bg" aria-hidden="true" />
            Kostenlos starten
          </a>
        </nav>
      </Container>
    </header>
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
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
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
            drei Tools auf einer Domain, anwaltlich geprüfte Vorlagen, Sitz in
            Stuttgart, Datenhaltung in Frankfurt.
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
              <Countdown variant="compact" /> bis Cookie-Banner
            </span>
          </div>
        </div>

        <aside
          className="rise col-span-12 lg:col-span-4 lg:pt-2"
          style={{ animationDelay: "360ms" }}
        >
          <div className="border border-line bg-surface p-7 shadow-sm">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded mb-5">
              Tool-Status
            </p>
            <ul className="space-y-3">
              {tools.map((t) => (
                <li
                  key={t.id}
                  className={`flex items-center justify-between gap-4 rounded-none border px-4 py-3 ${
                    t.status === "live"
                      ? "border-accent/30 bg-accent-soft"
                      : "border-line/60 bg-bg-soft/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {t.status === "live" ? (
                      <span className="relative flex-shrink-0 inline-flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                      </span>
                    ) : (
                      <span className="flex-shrink-0 h-2 w-2 rounded-full border border-line-strong bg-bg-soft" />
                    )}
                    <div className="min-w-0">
                      <div className={`font-display text-[14px] font-semibold leading-tight truncate ${t.status === "live" ? "text-ink" : "text-ink-dim"}`}>
                        {t.name}
                      </div>
                    </div>
                  </div>
                  <div className={`flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] ${t.status === "live" ? "text-accent font-semibold" : "text-ink-faded"}`}>
                    {t.status === "live" ? "Live" : t.launchLabel}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t border-line pt-4 font-body text-[12px] text-ink-faded">
              <Countdown variant="compact" /> bis Cookie-Banner
            </div>
          </div>
        </aside>
      </Container>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { label: "Hosting", value: "EU · Frankfurt" },
    { label: "Vorlagen", value: "Anwaltlich geprüft" },
    { label: "Tracking", value: "Plausible · cookieless" },
    { label: "Sitz", value: "Stuttgart" },
  ];
  return (
    <section className="border-y border-line bg-surface">
      <Container className="grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4 md:gap-x-10 md:py-10">
        {items.map((i) => (
          <div key={i.label} className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded">
              {i.label}
            </span>
            <span className="mt-1.5 font-display text-[17px] font-medium text-ink">
              {i.value}
            </span>
          </div>
        ))}
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
              01 · Die Suite
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <h2 className="balance font-display text-[34px] font-medium leading-[1.1] tracking-[-0.015em] text-ink md:text-[44px]">
              Drei eigenständige Werkzeuge. Ein gemeinsamer Account.
            </h2>
            <p className="measure mt-5 font-body text-[16px] leading-[1.6] text-ink-dim">
              Du brauchst nicht alle drei am ersten Tag — aber sie sind so gebaut,
              dass sich Daten und Mandanten zwischen ihnen teilen lassen.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-y-12 lg:gap-x-10">
          {tools.map((tool, i) => {
            const isLive = tool.status === "live";
            const Wrapper = isLive && tool.href ? "a" : "article";
            const wrapperProps = isLive && tool.href ? { href: tool.href } : {};
            return (
              <Wrapper
                key={tool.id}
                {...wrapperProps}
                className={`col-span-12 lg:col-span-4 rise group block ${
                  isLive
                    ? "card-hover border border-line bg-surface p-7 cursor-pointer shadow-sm hover:border-accent hover:shadow-md"
                    : "border border-line/40 p-7 opacity-70"
                }`}
                style={{ animationDelay: `${300 + i * 100}ms` }}
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
            );
          })}
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
              02 · Worum es geht
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
            <article
              key={p.id}
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
          ))}
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
              03 · Häufige Fragen
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
            04 · Vor dem Launch
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
              <Countdown variant="compact" /> bis Cookie-Banner (Tool 3).
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
              Themen
            </p>
            <ul className="space-y-2 font-body text-[14px] text-ink-dim">
              <li>
                <a
                  href="/blog/avv-dsgvo-leitfaden"
                  className="link-underline hover:text-ink"
                >
                  AVV nach Art. 28
                </a>
              </li>
              <li>
                <a
                  href="/blog/verarbeitungsverzeichnis"
                  className="link-underline hover:text-ink"
                >
                  Verarbeitungsverzeichnis
                </a>
              </li>
              <li>
                <a
                  href="/blog/cookie-banner-dsgvo"
                  className="link-underline hover:text-ink"
                >
                  Cookie-Banner & TTDSG
                </a>
              </li>
              <li>
                <a
                  href="/blog/schrems-ii"
                  className="link-underline hover:text-ink"
                >
                  Schrems II
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
