"use client";
import { useEffect, useState } from "react";

export function ExitPopup() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dismissed = localStorage.getItem("exit-popup-dismissed");
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    let triggered = false;

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      setShow(true);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 5) trigger();
    };

    const handleScroll = () => {
      const scrolled = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrolled > 0.75 && !sessionStorage.getItem("scroll-popup-shown")) {
        sessionStorage.setItem("scroll-popup-shown", "1");
        trigger();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }, 8000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("exit-popup-dismissed", Date.now().toString());
  };

  if (!mounted || !show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15, 18, 14, 0.72)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        className="relative w-full max-w-[520px] overflow-hidden"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-line)",
          boxShadow: "0 32px 80px rgba(15,18,14,0.35)",
          animation: "popupIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Top accent bar */}
        <div className="h-1 bg-accent" />

        <div className="p-8 md:p-10">
          {/* Close */}
          <button
            onClick={dismiss}
            className="absolute top-5 right-5 h-8 w-8 flex items-center justify-center font-mono text-[18px] text-ink-faded hover:text-ink transition-colors"
            aria-label="Schließen"
          >
            ×
          </button>

          {/* Eyebrow */}
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-4">
            Warte kurz —
          </p>

          {/* Headline */}
          <h2 className="font-display text-[34px] font-medium leading-[1.05] tracking-[-0.02em] text-ink mb-4">
            Dein AVV ist in<br />
            <em className="italic text-accent">10 Minuten fertig.</em>
          </h2>

          <p className="font-body text-[15px] leading-relaxed text-ink-dim mb-7">
            Kostenlos, kein Account, direkt im Browser. Anwaltlich geprüfte Vorlage nach Art. 28 DSGVO — sofort als PDF.
          </p>

          {/* Checklist */}
          <ul className="space-y-2.5 mb-8">
            {[
              "Alle 13 Pflichtinhalte nach Art. 28 DSGVO",
              "Sofort-Download als PDF — kein Upload",
              "Daten verlassen nie deinen Browser",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 font-body text-[13px] text-ink-dim">
                <svg className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="/avv"
            onClick={dismiss}
            className="btn-primary flex h-13 items-center justify-center gap-2 font-body text-[15px] font-medium tracking-tight w-full"
            style={{ height: "52px" }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-bg" aria-hidden="true" />
            AVV jetzt kostenlos erstellen →
          </a>

          <button
            onClick={dismiss}
            className="mt-4 w-full text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded hover:text-ink transition-colors"
          >
            Vielleicht später
          </button>
        </div>
      </div>

      <style>{`
        @keyframes popupIn {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
