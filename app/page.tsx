import { WaitlistForm } from "@/components/waitlist-form";
import { Ticker } from "@/components/ticker";
import { Countdown } from "@/components/countdown";
import { BussgeldCounter } from "@/components/bussgeld-counter";
import { MouseTracker } from "@/components/mouse-tracker";
import { tools } from "@/lib/tools";
import { PRIMER, FAQS } from "@/lib/content";

export default function Home() {
  return (
    <>
      <MouseTracker />
      <main className="relative z-10">
        <Header />
        <Ticker />
        <Hero />
        <CounterStrip />
        <ToolStack />
        <Primer />
        <Faq />
        <Waitlist />
        <Footer />
      </main>
    </>
  );
}

function Header() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 pt-8 md:px-12 lg:px-20">
      <a href="/" className="group fade-in flex items-baseline gap-3">
        <span className="font-display text-[20px] font-extrabold tracking-tight text-ink">
          Compli<span className="text-accent">flow</span>
        </span>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faded md:inline">
          / DSGVO Stack · Stuttgart
        </span>
      </a>
      <nav className="fade-in flex items-center gap-6">
        <a
          href="#tools"
          className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim hover:text-ink md:inline"
        >
          Tools
        </a>
        <a
          href="#was"
          className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim hover:text-ink md:inline"
        >
          Was wir bauen
        </a>
        <a
          href="#faq"
          className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim hover:text-ink md:inline"
        >
          FAQ
        </a>
        <a
          href="#warteliste"
          className="cta-hover border border-line bg-bg-soft px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink"
        >
          Warteliste
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="conic-bg"
        style={{ top: "-30%", right: "-15%", width: "60vw", height: "60vw" }}
        aria-hidden="true"
      />
      <span
        className="watermark hidden md:block"
        aria-hidden="true"
        style={{ top: "12%", right: "-4%" }}
      >
        01
      </span>

      <div className="relative mx-auto grid w-full max-w-[1600px] grid-cols-12 gap-y-12 px-6 pb-24 pt-20 md:px-12 lg:gap-x-12 lg:px-20 lg:pt-32">
        <div className="col-span-12 lg:col-span-8">
          <div
            className="rise mb-10 inline-flex items-center gap-3 border border-line bg-bg-soft px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-accent"
            style={{ animationDelay: "0ms" }}
          >
            <span className="pulse-dot" aria-hidden="true" />
            Drei Tools · Eine Suite · Sommer 2026
          </div>

          <h1
            className="rise font-display text-[clamp(54px,10vw,148px)] font-extrabold leading-[0.88] tracking-[-0.04em]"
            style={{ animationDelay: "120ms" }}
          >
            DSGVO ohne
            <br />
            <span className="text-ink-dim">Anwalts­honorar.</span>
            <br />
            <span className="relative inline-block">
              Compliance
              <span className="glyph-tilt ml-3 text-accent">automatisiert</span>.
            </span>
          </h1>

          <p
            className="rise mt-10 max-w-2xl font-body text-[18px] leading-[1.55] text-ink-dim md:text-[20px]"
            style={{ animationDelay: "260ms" }}
          >
            Compliflow baut drei rechtssichere Tools für deutsche
            Selbstständige und Agenturen: AVV-Generator, Verarbeitungs­verzeichnis
            und Cookie-Banner. In Minuten erledigt statt Tagen recherchiert. Ohne
            300-Euro-Anwaltsrechnung. Ohne Word-Vorlagen von 2014.
          </p>

          <div
            className="rise mt-12 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "400ms" }}
          >
            <a
              href="#warteliste"
              className="cta-hover relative inline-flex items-center bg-accent px-6 py-4 font-display text-[14px] font-bold uppercase tracking-[0.1em] text-bg"
            >
              <span className="relative z-10">Auf die Warteliste</span>
            </a>
            <a
              href="#tools"
              className="group inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] text-ink-dim hover:text-ink"
            >
              Die drei Tools ansehen
              <span className="transition-transform group-hover:translate-x-1">↓</span>
            </a>
          </div>
        </div>

        <aside
          className="rise relative col-span-12 lg:col-span-4 lg:pt-32"
          style={{ animationDelay: "540ms" }}
        >
          <div className="relative border border-line bg-bg-soft/60 p-8 backdrop-blur-sm">
            <div className="scanline" aria-hidden="true" />
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faded">
              Launch · Tool 01
            </div>
            <div className="mt-2 font-display text-[20px] font-bold tracking-tight">
              17. Juni 2026 · 09:00
            </div>
            <div className="hairline my-6 h-px" />
            <Countdown />
            <div className="hairline my-6 h-px" />
            <ul className="space-y-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faded">
              <li className="flex justify-between">
                <span>Tool 01 / AVV</span>
                <span className="text-ink">17.06.</span>
              </li>
              <li className="flex justify-between">
                <span>Tool 02 / VVT</span>
                <span className="text-ink-dim">15.07.</span>
              </li>
              <li className="flex justify-between">
                <span>Tool 03 / Cookie</span>
                <span className="text-ink-dim">19.08.</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

function CounterStrip() {
  return (
    <section className="relative border-y border-line bg-bg-soft/60 py-10 md:py-14">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-12 gap-6 px-6 md:px-12 lg:gap-12 lg:px-20">
        <div className="col-span-12 md:col-span-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faded">
            DSGVO-Bußgelder kumuliert seit Mai 2018 · EU-weit
          </div>
          <div className="mt-3 font-display text-[44px] font-extrabold leading-none tracking-tight md:text-[64px] lg:text-[80px]">
            <BussgeldCounter />
          </div>
          <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-dim">
            Quelle · enforcementtracker.com · DLA Piper Survey · live geschätzt
          </div>
        </div>
        <div className="col-span-12 grid grid-cols-3 gap-6 md:col-span-5">
          <Stat n="2.165" label="Verfahren in DACH" />
          <Stat n="64 %" label="KMU ohne vollständiges VVT" />
          <Stat n="20 Mio" label="Maximalbußgeld einzeln (€)" />
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="border-l border-line pl-4">
      <div className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-ink md:text-[28px]">
        {n}
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faded">
        {label}
      </div>
    </div>
  );
}

function ToolStack() {
  return (
    <section
      id="tools"
      className="relative mx-auto w-full max-w-[1600px] overflow-hidden px-6 py-24 md:px-12 lg:px-20 lg:py-32"
    >
      <span
        className="watermark hidden md:block"
        aria-hidden="true"
        style={{ top: "-8%", left: "-2%" }}
      >
        02
      </span>

      <div className="relative mb-16 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faded">
            02 · Die Suite
          </div>
        </div>
        <h2 className="col-span-12 font-display text-[40px] font-bold leading-[1.02] tracking-[-0.025em] md:col-span-9 md:text-[64px]">
          Drei Werkzeuge,
          <br />
          die sich gegenseitig <em className="not-italic text-accent">füttern</em>.
        </h2>
      </div>

      <div className="relative grid grid-cols-12 gap-y-10 md:gap-x-8">
        {tools.map((tool, i) => (
          <article
            key={tool.id}
            className={`col-span-12 ${tool.span}`}
            style={{ marginTop: tool.offset }}
          >
            <div
              className="rise demo-card-hover relative border border-line bg-bg-soft/40 p-8 backdrop-blur-sm md:p-10"
              style={{ animationDelay: `${600 + i * 150}ms` }}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faded">
                  {tool.idx}
                </span>
                <span className="inline-flex items-center gap-2 border border-line bg-bg px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  <span className="pulse-dot" aria-hidden="true" />
                  {tool.launchLabel}
                </span>
              </div>

              <h3 className="mb-5 font-display text-[34px] font-bold leading-[1.02] tracking-[-0.02em] md:text-[44px]">
                {tool.name}
              </h3>

              <p className="mb-7 max-w-md font-body text-[15px] leading-[1.55] text-ink-dim md:text-[16px]">
                {tool.pitch}
              </p>

              <ul className="space-y-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-dim">
                {tool.bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="text-accent">▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="demo-card-line mt-10 h-px w-full bg-line" />

              <div className="mt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em]">
                <span className="text-ink-faded">Bald verfügbar</span>
                <span className="demo-card-arrow text-ink-dim">⟶</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Primer() {
  return (
    <section id="was" className="relative border-y border-line bg-bg-soft/40">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 md:px-12 lg:px-20 lg:py-32">
        <div className="mb-16 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faded">
              03 · Worum es geht
            </div>
          </div>
          <h2 className="col-span-12 font-display text-[40px] font-bold leading-[1.02] tracking-[-0.025em] md:col-span-9 md:text-[64px]">
            DSGVO ohne <em className="not-italic text-accent">Jura-Studium</em>.
            <br />
            Drei Begriffe, die du verstehen musst.
          </h2>
        </div>

        <div className="space-y-20">
          {PRIMER.map((p, i) => (
            <article
              key={p.id}
              className="relative grid grid-cols-12 gap-y-6 md:gap-x-12"
            >
              <div className="col-span-12 md:col-span-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                  {p.eyebrow} · {p.law}
                </div>
                <h3 className="mt-3 font-display text-[32px] font-bold leading-[1.02] tracking-[-0.02em] md:text-[44px]">
                  {p.title}
                </h3>
                <div className="mt-6 inline-flex items-center gap-3 border border-line bg-bg px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em]">
                  <span className="text-ink-faded">Launch</span>
                  <span className="text-ink">{p.launch}</span>
                </div>
                <div className="mt-3 inline-flex items-center gap-3 border border-line bg-bg px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em]">
                  <span className="text-ink-faded">Dauer</span>
                  <span className="text-accent">{p.duration}</span>
                </div>
              </div>

              <div className="col-span-12 md:col-span-8">
                <p className="font-body text-[17px] leading-[1.65] text-ink md:text-[19px]">
                  {p.body}
                </p>
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {p.pillars.map((pillar) => (
                    <div
                      key={pillar}
                      className="flex items-start gap-3 border-l-2 border-line py-2 pl-4 font-body text-[14px] text-ink-dim"
                    >
                      <span className="mt-1 font-mono text-[10px] text-accent">
                        0{p.pillars.indexOf(pillar) + 1}
                      </span>
                      <span>{pillar}</span>
                    </div>
                  ))}
                </div>
              </div>

              {i < PRIMER.length - 1 && (
                <div className="hairline col-span-12 mt-8 h-px" />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section
      id="faq"
      className="relative mx-auto w-full max-w-[1600px] overflow-hidden px-6 py-24 md:px-12 lg:px-20 lg:py-32"
    >
      <span
        className="watermark hidden md:block"
        aria-hidden="true"
        style={{ bottom: "-15%", right: "-2%" }}
      >
        FAQ
      </span>

      <div className="relative grid grid-cols-12 gap-6 md:gap-12">
        <div className="col-span-12 md:col-span-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faded">
            04 · Häufige Fragen
          </div>
          <h2 className="mt-6 font-display text-[40px] font-bold leading-[1.02] tracking-[-0.025em] md:text-[56px]">
            Was Leute uns
            <br />
            <span className="text-accent">am häufigsten</span> fragen.
          </h2>
        </div>

        <div className="col-span-12 md:col-span-8">
          <div className="divide-y divide-line border-y border-line">
            {FAQS.map((item, i) => (
              <details
                key={item.q}
                className="group py-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-6">
                  <span className="flex gap-5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[18px] font-bold leading-snug tracking-tight text-ink md:text-[22px]">
                      {item.q}
                    </span>
                  </span>
                  <span className="mt-1 font-display text-[24px] text-ink-dim transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-4 pl-12 font-body text-[15px] leading-[1.65] text-ink-dim md:text-[16px]">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Waitlist() {
  return (
    <section
      id="warteliste"
      className="relative border-y border-line bg-bg-soft/40"
    >
      <div
        className="conic-bg"
        style={{ bottom: "-50%", left: "-10%", width: "50vw", height: "50vw" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto grid w-full max-w-[1600px] grid-cols-12 gap-12 px-6 py-24 md:px-12 lg:px-20 lg:py-32">
        <div className="col-span-12 lg:col-span-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faded">
            05 · Vor dem Launch
          </div>
          <h2 className="mt-6 font-display text-[48px] font-extrabold leading-[1.0] tracking-[-0.035em] md:text-[80px]">
            Trag dich
            <br />
            <span className="text-accent">jetzt ein</span>.
          </h2>
          <p className="mt-8 max-w-md font-body text-[16px] leading-[1.55] text-ink-dim">
            Eine Mail beim Launch. Kein Spam, kein Newsletter, der dich
            überflutet. Wartelisten-Anmelder bekommen <span className="text-ink">34 % Rabatt</span> in der Launch-Woche.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <WaitlistForm />

          <div className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faded md:grid-cols-4">
            <Trust label="Hosting" value="EU · Frankfurt" />
            <Trust label="Tracking" value="Plausible · Cookieless" />
            <Trust label="Compliance" value="Selbst DSGVO-konform" />
            <Trust label="Sitz" value="Stuttgart" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Trust({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div>{label}</div>
      <div className="mt-1 font-display text-[14px] font-bold tracking-normal text-ink">
        {value}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1600px] px-6 py-16 md:px-12 lg:px-20">
      <div className="grid grid-cols-12 gap-y-10 gap-x-6">
        <div className="col-span-12 md:col-span-5">
          <span className="font-display text-[28px] font-extrabold tracking-tight">
            Compli<span className="text-accent">flow</span>
          </span>
          <p className="mt-4 max-w-sm font-body text-[14px] leading-relaxed text-ink-dim">
            DSGVO-Compliance-Tool-Suite für deutsche Selbstständige und Agenturen.
            Drei Tools, eine Suite, kein Anwaltshonorar.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 border border-line bg-bg-soft px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
            <Countdown variant="compact" />
            <span className="text-ink-faded">bis Launch</span>
          </div>
        </div>

        <div className="col-span-6 md:col-span-2">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faded">
            Tools
          </div>
          <ul className="space-y-2 font-body text-[14px] text-ink-dim">
            <li>
              <a href="/avv" className="hover:text-accent">
                AVV-Generator
              </a>
            </li>
            <li>
              <a href="/vvt" className="hover:text-accent">
                Verarbeitungs­verzeichnis
              </a>
            </li>
            <li>
              <a href="/cookie-banner" className="hover:text-accent">
                Cookie-Banner
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-6 md:col-span-2">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faded">
            Themen
          </div>
          <ul className="space-y-2 font-body text-[14px] text-ink-dim">
            <li>
              <a href="/blog/avv-dsgvo-leitfaden" className="hover:text-accent">
                AVV nach Art. 28
              </a>
            </li>
            <li>
              <a href="/blog/verarbeitungsverzeichnis" className="hover:text-accent">
                Verarbeitungsverzeichnis
              </a>
            </li>
            <li>
              <a href="/blog/cookie-banner-dsgvo" className="hover:text-accent">
                Cookie-Banner & TTDSG
              </a>
            </li>
            <li>
              <a href="/blog/schrems-ii" className="hover:text-accent">
                Schrems II
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-12 md:col-span-3">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faded">
            Kontakt
          </div>
          <a
            href="mailto:hello@compliflow.de"
            className="block font-body text-[14px] text-ink hover:text-accent"
          >
            hello@compliflow.de
          </a>
          <p className="mt-3 font-body text-[13px] leading-relaxed text-ink-faded">
            Al-Khalil Aoumeur ·{" "}
            <span className="text-ink-dim">DRVN, Stuttgart</span>
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faded">
            Impressum, Datenschutz, AGB folgen mit Tool 01
          </p>
        </div>
      </div>

      <div className="hairline mt-14 h-px" />
      <div className="mt-6 flex flex-col items-start justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faded md:flex-row md:items-center">
        <span>© 2026 Al-Khalil Aoumeur · Compliflow</span>
        <span>Built in Stuttgart · Hosted in Frankfurt · Plausible-tracked</span>
      </div>
    </footer>
  );
}
