import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative z-10 min-h-screen">
      <header className="border-b border-line">
        <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 py-5 flex items-center justify-between">
          <Link href="/" className="opacity-90 hover:opacity-100 transition">
            <Logo variant="lockup" size={26} />
          </Link>
          <nav className="font-mono text-[10px] uppercase tracking-widest text-ink-dim space-x-4">
            <Link href="/" className="hover:text-ink">
              Start
            </Link>
            <Link href="/avv" className="hover:text-accent">
              AVV-Generator
            </Link>
          </nav>
        </div>
      </header>

      <article className="mx-auto w-full max-w-3xl px-6 md:px-10 lg:px-12 py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-3">
          Rechtliche Hinweise
        </p>
        <h1
          className="font-display font-bold text-4xl md:text-5xl leading-tight"
          style={{ letterSpacing: "-0.03em" }}
        >
          {title}
        </h1>
        <p className="text-ink-dim text-sm mt-3">
          Stand: {lastUpdated} · Anbieter:{" "}
          <strong className="text-ink">Al-Khalil Aoumeur</strong>, Stuttgart
        </p>

        <div className="prose prose-invert max-w-none mt-12 space-y-6 text-ink-dim leading-relaxed">
          {children}
        </div>

        <div className="border-t border-line mt-16 pt-8 font-mono text-[10px] uppercase tracking-widest text-ink-faded">
          Bei Fragen:{" "}
          <a href="mailto:hello@compliflow.de" className="text-accent hover:text-ink">
            hello@compliflow.de
          </a>
        </div>
      </article>
    </main>
  );
}

export function LegalSection({
  title,
  number,
  children,
}: {
  title: string;
  number?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2
        className="font-display font-bold text-2xl text-ink mt-10 mb-4"
        style={{ letterSpacing: "-0.02em" }}
      >
        {number && <span className="text-accent mr-2">{number}</span>}
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
