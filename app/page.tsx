import { WaitlistForm } from "@/components/waitlist-form";
import { tools } from "@/lib/tools";

export default function Home() {
  return (
    <main className="relative z-10 min-h-screen">
      <Header />
      <Hero />
      <ToolStack />
      <WaitlistSection />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 pt-10 md:px-12 lg:px-20">
      <a href="/" className="flex items-baseline gap-2 fade-in">
        <span className="font-display text-[22px] font-extrabold tracking-tight text-ink">
          Compli<span className="text-accent">flow</span>
        </span>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faded md:inline">
          / DSGVO Stack
        </span>
      </a>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faded fade-in">
        Stuttgart · Juni 2026
      </span>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative mx-auto w-full max-w-[1400px] px-6 pb-24 pt-24 md:px-12 lg:px-20 lg:pt-32">
      <div className="grid grid-cols-12 gap-y-12 lg:gap-x-12">
        <div className="col-span-12 lg:col-span-8">
          <div
            className="rise mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-accent"
            style={{ animationDelay: "0ms" }}
          >
            <span className="h-px w-10 bg-accent" />
            Drei Tools. Eine Suite. Launch in Kürze.
          </div>

          <h1
            className="rise font-display text-[clamp(46px,9vw,124px)] font-extrabold leading-[0.92] tracking-[-0.035em]"
            style={{ animationDelay: "120ms" }}
          >
            DSGVO-Bußgelder
            <br />
            <span className="text-ink-dim">vermeiden.</span>
            <br />
            <span className="relative inline-block">
              Tools statt
              <span className="glyph-tilt ml-3 text-accent">Anwalt</span>.
            </span>
          </h1>

          <p
            className="rise mt-10 max-w-xl font-body text-[17px] leading-[1.55] text-ink-dim md:text-[19px]"
            style={{ animationDelay: "260ms" }}
          >
            Wir bauen die Compliance-Tools, die deutsche Selbstständige
            wirklich brauchen — schnell, modern, ohne Anwaltsgebühren. Drei
            Tools rollen über den Sommer aus. Trag dich ein, dann pingen wir
            dich zum Start.
          </p>
        </div>

        <aside
          className="rise relative col-span-12 lg:col-span-4 lg:pt-24"
          style={{ animationDelay: "400ms" }}
        >
          <div className="border-l border-line pl-6 lg:pl-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faded">
              Status · 2026-06-06
            </div>
            <div className="mt-4 space-y-5">
              <StatusRow label="Tool 1" value="AVV-Generator" sub="Build läuft" />
              <StatusRow label="Tool 2" value="Verarbeitungsverzeichnis" sub="In Planung" />
              <StatusRow label="Tool 3" value="Cookie-Banner" sub="In Planung" />
            </div>
            <div className="hairline mt-8 h-px" />
            <p className="mt-6 font-mono text-[11px] leading-relaxed text-ink-faded">
              Gebaut von einem Solo-Builder in&nbsp;
              <span className="text-ink-dim">Stuttgart</span>. Kein
              Risikokapital, keine PR-Maschine — nur echte Werkzeuge.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function StatusRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faded">
        {label}
      </span>
      <span className="text-right">
        <span className="block font-display text-[15px] font-bold text-ink">
          {value}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
          {sub}
        </span>
      </span>
    </div>
  );
}

function ToolStack() {
  return (
    <section className="relative mx-auto w-full max-w-[1400px] border-t border-line px-6 py-24 md:px-12 lg:px-20 lg:py-32">
      <div className="mb-16 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faded">
            01 — Die Suite
          </div>
        </div>
        <h2 className="col-span-12 font-display text-[40px] font-bold leading-[1.05] tracking-[-0.02em] md:col-span-9 md:text-[56px]">
          Drei Werkzeuge, die zusammen <em className="not-italic text-accent">arbeiten</em>.
        </h2>
      </div>

      <div className="grid grid-cols-12 gap-y-10 md:gap-x-8">
        {tools.map((tool, i) => (
          <article
            key={tool.id}
            className={`col-span-12 ${tool.span} group relative`}
            style={{ marginTop: tool.offset }}
          >
            <div className="rise" style={{ animationDelay: `${600 + i * 150}ms` }}>
              <div className="mb-8 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faded">
                  {tool.idx}
                </span>
                <span className="border border-line bg-bg-soft px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim group-hover:border-accent group-hover:text-accent transition-colors duration-500">
                  {tool.launchLabel}
                </span>
              </div>

              <h3 className="mb-4 font-display text-[34px] font-bold leading-[1.05] tracking-[-0.02em] md:text-[42px]">
                {tool.name}
              </h3>

              <p className="mb-6 max-w-md font-body text-[15px] leading-[1.55] text-ink-dim">
                {tool.pitch}
              </p>

              <ul className="space-y-2 font-mono text-[12px] text-ink-faded">
                {tool.bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="text-accent">→</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 h-px w-full bg-line group-hover:bg-accent transition-colors duration-700" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function WaitlistSection() {
  return (
    <section
      id="warteliste"
      className="relative mx-auto w-full max-w-[1400px] border-t border-line px-6 py-24 md:px-12 lg:px-20 lg:py-32"
    >
      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-12 lg:col-span-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faded">
            02 — Warteliste
          </div>
          <h2 className="mt-6 font-display text-[44px] font-bold leading-[1.02] tracking-[-0.02em] md:text-[64px]">
            Sei vor dem
            <br />
            <span className="text-accent">Launch</span> dabei.
          </h2>
        </div>

        <div className="col-span-12 lg:col-span-7 lg:pt-6">
          <p className="max-w-lg font-body text-[16px] leading-[1.55] text-ink-dim">
            Eine Mail. Kein Spam. Kein Newsletter, der dich überflutet. Wir
            schreiben dir genau einmal, wenn das erste Tool live ist — und
            mit einem Early-Bird-Rabatt von <span className="text-ink">34 %</span>.
          </p>

          <WaitlistForm />

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faded">
            <Trust label="Hosting" value="EU · Frankfurt" />
            <Trust label="Tracking" value="Plausible" />
            <Trust label="DSGVO" value="Selbst-konform" />
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
    <footer className="mx-auto w-full max-w-[1400px] border-t border-line px-6 py-12 md:px-12 lg:px-20">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-5">
          <span className="font-display text-[18px] font-extrabold tracking-tight">
            Compli<span className="text-accent">flow</span>
          </span>
          <p className="mt-2 max-w-sm font-body text-[13px] leading-relaxed text-ink-faded">
            Ein Projekt von Al-Khalil Aoumeur · DRVN · Stuttgart.
          </p>
        </div>
        <div className="col-span-6 md:col-span-3">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faded">
            Kontakt
          </div>
          <a
            href="mailto:hello@compliflow.de"
            className="font-body text-[13px] text-ink-dim hover:text-accent transition-colors"
          >
            hello@compliflow.de
          </a>
        </div>
        <div className="col-span-6 md:col-span-4">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faded">
            Bald hier
          </div>
          <p className="font-body text-[13px] text-ink-dim">
            Impressum, Datenschutz und AGB folgen mit dem ersten Tool-Launch
            am 17. Juni.
          </p>
        </div>
      </div>
      <div className="hairline mt-12 h-px" />
      <div className="mt-6 flex flex-col items-start justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faded md:flex-row md:items-center">
        <span>© 2026 Al-Khalil Aoumeur</span>
        <span>Built in Stuttgart · Hosted in Frankfurt</span>
      </div>
    </footer>
  );
}
