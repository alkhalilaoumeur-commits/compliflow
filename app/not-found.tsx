import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Seite nicht gefunden — Compliflow",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      <header className="border-b border-line">
        <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 py-5">
          <Link href="/" className="opacity-90 hover:opacity-100 transition inline-block">
            <Logo variant="lockup" size={26} />
          </Link>
        </div>
      </header>

      <section className="flex-1 flex items-center">
        <div className="mx-auto w-full max-w-2xl px-6 py-24">
          <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-accent mb-4">
            404 · Seite nicht gefunden
          </p>
          <h1
            className="font-display font-bold text-5xl md:text-7xl leading-[0.95] mb-6"
            style={{ letterSpacing: "-0.04em" }}
          >
            Diese Seite gibt&apos;s nicht.
          </h1>
          <p className="text-ink-dim text-lg leading-relaxed mb-10 max-w-lg">
            Vielleicht hast du dich vertippt, oder die Seite ist noch nicht gebaut.
            Tool 3 (Cookie-Banner) kommt am 19. August 2026.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
            <Link
              href="/"
              className="border border-line bg-bg-soft p-5 hover:border-accent transition group"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-dim mb-2">
                Startseite
              </p>
              <p className="font-display font-bold text-lg group-hover:text-accent transition">
                Compliflow Suite
              </p>
              <p className="text-sm text-ink-dim mt-1">Alle Tools im Überblick</p>
            </Link>
            <Link
              href="/avv"
              className="border border-accent bg-accent-soft p-5 hover:bg-accent hover:text-bg transition group"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent group-hover:text-bg mb-2">
                Live · Tool 01
              </p>
              <p className="font-display font-bold text-lg">AVV-Generator</p>
              <p className="text-sm text-ink-dim mt-1 group-hover:text-[rgba(246,242,234,0.7)] transition">
                Art. 28 DSGVO
              </p>
            </Link>
            <Link
              href="/vvt"
              className="border border-accent bg-accent-soft p-5 hover:bg-accent hover:text-bg transition group"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent group-hover:text-bg mb-2">
                Live · Tool 02
              </p>
              <p className="font-display font-bold text-lg">VVT-Generator</p>
              <p className="text-sm text-ink-dim mt-1 group-hover:text-[rgba(246,242,234,0.7)] transition">
                Art. 30 DSGVO
              </p>
            </Link>
          </div>

          <p className="mt-12 font-mono text-[10px] uppercase tracking-widest text-ink-faded">
            Falls du einen Bug gefunden hast:{" "}
            <a href="mailto:hello@compliflow.de" className="text-accent hover:text-ink">
              hello@compliflow.de
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
