"use client";

import { useState, useEffect } from "react";

const LINKS = [
  { href: "/avv", label: "AVV-Generator" },
  { href: "/vvt", label: "VVT-Generator" },
  { href: "/impressum-generator", label: "Impressum-Generator" },
  { href: "/preise", label: "Preise" },
  { href: "/blog", label: "Blog" },
  { href: "/#suite", label: "Die Suite" },
  { href: "/#faq", label: "Häufige Fragen" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center text-ink hover:text-accent transition-colors"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 5h14M2 9h10M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 top-[58px] z-40 bg-ink/20 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav
            className="fixed left-0 right-0 top-[58px] z-50 border-b border-line bg-[rgba(246,242,234,0.97)] backdrop-blur-md shadow-lg"
            aria-label="Mobile Navigation"
          >
            <ul className="flex flex-col px-6 py-2 divide-y divide-line">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 font-body text-[15px] text-ink-dim hover:text-ink transition-colors"
                  >
                    <span>{link.label}</span>
                    <span className="font-mono text-[11px] text-ink-faded" aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
              <li className="py-4">
                <a
                  href="/avv"
                  onClick={() => setOpen(false)}
                  className="btn-primary inline-flex h-11 w-full items-center justify-center gap-2 px-4 font-body text-[14px] font-medium tracking-tight"
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-bg" aria-hidden="true" />
                  Kostenlos starten
                </a>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
