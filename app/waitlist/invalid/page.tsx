import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ungültiger Link — Compliflow",
  description: "Dieser Bestätigungs-Link ist ungültig oder abgelaufen.",
  robots: { index: false, follow: false },
};

export default function WaitlistInvalidPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="max-w-[480px] w-full border border-line bg-surface p-10 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-warn mb-6">
          Fehler
        </p>
        <h1 className="font-display text-[28px] font-semibold leading-tight tracking-tight text-ink mb-4">
          Link ungültig.
        </h1>
        <p className="font-body text-[15px] text-ink-dim leading-relaxed mb-8">
          Dieser Bestätigungs-Link ist ungültig oder wurde bereits verwendet.
          Trage dich erneut auf der Startseite ein.
        </p>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center gap-2 border border-line font-mono text-[11px] uppercase tracking-widest text-ink-dim hover:border-accent hover:text-accent transition px-8"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </main>
  );
}
