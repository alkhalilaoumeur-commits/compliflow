"use client";

import { useState, useEffect, useRef } from "react";

type ToolEntry = {
  href: string;
  name: string;
  tag: string;
};

const TOOLS: ToolEntry[] = [
  { href: "/impressum-generator",       name: "Impressum-Generator",   tag: "§ 5 DDG" },
  { href: "/datenschutz-generator",     name: "Datenschutzerklärung",   tag: "Art. 13/14 DSGVO" },
  { href: "/avv",                       name: "AVV-Generator",          tag: "Art. 28 DSGVO" },
  { href: "/vvt",                       name: "Verarbeitungsverzeichnis", tag: "Art. 30 DSGVO" },
  { href: "/widerrufsbelehrung-generator", name: "Widerrufsbelehrung",   tag: "§ 312g BGB" },
  { href: "/agb-generator",             name: "AGB-Generator",          tag: "§§ 305-310 BGB" },
  { href: "/cookie-banner-generator",   name: "Cookie-Banner",          tag: "§ 25 TDDDG" },
];

export function ToolsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative hidden md:inline-block">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((s) => !s)}
        className={
          "inline-flex items-center gap-1.5 font-body text-[14px] transition " +
          (open ? "text-ink" : "text-ink-dim hover:text-ink")
        }
      >
        Tools
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
          className={"transition-transform " + (open ? "rotate-180" : "")}
        >
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-3 w-[340px] border border-line bg-bg shadow-[0_24px_48px_-16px_rgba(10,9,6,0.18)]"
        >
          <div className="border-b border-line bg-bg-soft px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded">
              7 Generatoren · alle kostenlos
            </p>
          </div>
          <ul className="divide-y divide-line">
            {TOOLS.map((t) => (
              <li key={t.href}>
                <a
                  href={t.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-bg-soft"
                >
                  <div className="min-w-0">
                    <span className="block truncate font-display text-[15px] font-medium text-ink group-hover:text-accent">
                      {t.name}
                    </span>
                    <span className="block truncate font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faded mt-0.5">
                      {t.tag}
                    </span>
                  </div>
                  <span className="font-mono text-[12px] text-ink-faded group-hover:text-accent shrink-0">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
