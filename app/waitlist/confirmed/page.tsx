import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anmeldung bestätigt — Compliflow",
  description: "Du bist auf der Warteliste. Wir melden uns beim Launch.",
  robots: { index: false, follow: false },
};

export default function WaitlistConfirmedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="max-w-[480px] w-full border border-line bg-surface p-10 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent mb-6">
          Bestätigt
        </p>
        <h1 className="font-display text-[28px] font-semibold leading-tight tracking-tight text-ink mb-4">
          Du bist dabei.
        </h1>
        <p className="font-body text-[15px] text-ink-dim leading-relaxed mb-8">
          Wir schicken dir eine einmalige E-Mail sobald CompliFlow live geht —
          zwei Tage Early-Access und 34&nbsp;% Rabatt in der Launch-Woche.
        </p>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center gap-2 border border-accent font-mono text-[11px] uppercase tracking-widest text-accent hover:bg-accent hover:text-bg transition px-8"
        >
          Zur Startseite
        </Link>
      </div>
    </main>
  );
}
