"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="relative z-10 min-h-screen flex flex-col">
      <header className="border-b border-line">
        <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 py-5">
          <a href="/" className="opacity-90 hover:opacity-100 transition inline-block">
            <span className="font-display text-[20px] font-semibold tracking-tight text-ink">
              Compliflow
            </span>
          </a>
        </div>
      </header>

      <section className="flex-1 flex items-center">
        <div className="mx-auto w-full max-w-2xl px-6 py-24">
          <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-warn mb-4">
            Fehler aufgetreten
          </p>
          <h1
            className="font-display font-bold text-5xl md:text-6xl leading-[0.95] mb-6"
            style={{ letterSpacing: "-0.04em" }}
          >
            Etwas ist schiefgelaufen.
          </h1>
          <p className="text-ink-dim text-lg leading-relaxed mb-10 max-w-lg">
            Ein unerwarteter Fehler ist aufgetreten. Deine Eingaben sind sicher in deinem Browser
            gespeichert — einfach die Seite neu laden und weitermachen.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={reset}
              className="btn-primary inline-flex h-12 items-center justify-center px-7 font-body text-[14px] font-medium tracking-tight gap-2"
            >
              Erneut versuchen
            </button>
            <a
              href="/"
              className="btn-ghost inline-flex h-12 items-center justify-center px-6 font-body text-[14px] font-medium"
            >
              Zur Startseite
            </a>
          </div>

          {error.digest && (
            <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-ink-faded">
              Fehler-ID: {error.digest} ·{" "}
              <a href="mailto:hello@compliflow.de" className="text-accent hover:text-ink transition">
                hello@compliflow.de
              </a>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
