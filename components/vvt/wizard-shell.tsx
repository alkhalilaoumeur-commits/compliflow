"use client";

import { useEffect, useState } from "react";
import {
  useVvtStore,
  getVvtStepIndex,
  getVvtProgress,
  isUnternehmenValid,
  isTaetigkeitenValid,
} from "@/lib/vvt/store";
import { VVT_WIZARD_STEPS } from "@/lib/vvt/types";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { StepUnternehmen } from "./steps/step-unternehmen";
import { StepTaetigkeiten } from "./steps/step-taetigkeiten";
import { StepAbschluss } from "./steps/step-abschluss";

export function VvtWizardShell() {
  const currentStep = useVvtStore((s) => s.currentStep);
  const setStep = useVvtStore((s) => s.setStep);
  const goNext = useVvtStore((s) => s.goNext);
  const goPrev = useVvtStore((s) => s.goPrev);
  const reset = useVvtStore((s) => s.reset);
  const data = useVvtStore((s) => s.data);
  const [hydrated, setHydrated] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const stepIdx = getVvtStepIndex(currentStep);
  const progress = getVvtProgress(currentStep);
  const meta = VVT_WIZARD_STEPS[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === VVT_WIZARD_STEPS.length - 1;

  const stepValid = (() => {
    if (currentStep === "unternehmen") return isUnternehmenValid(data);
    if (currentStep === "taetigkeiten") return isTaetigkeitenValid(data);
    return true;
  })();

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-dim">
        <div className="font-mono text-[11px] uppercase tracking-widest">
          Lade Verarbeitungsverzeichnis …
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-[rgba(246,242,234,0.9)] border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <a
            href="/"
            className="opacity-80 hover:opacity-100 transition"
            aria-label="Zur Startseite"
          >
            <Logo variant="lockup" size={24} />
          </a>

          {/* Step Nav — named steps on desktop */}
          <div className="hidden md:flex items-center gap-0">
            {VVT_WIZARD_STEPS.map((s, i) => {
              const isCurrent = s.id === currentStep;
              const isDone = i < stepIdx;
              const isClickable = isDone;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => isClickable && setStep(s.id)}
                  disabled={!isClickable && !isCurrent}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 transition font-mono text-[10px] uppercase tracking-widest",
                    isCurrent && "text-accent",
                    !isCurrent && isClickable && "text-ink-dim hover:text-ink cursor-pointer",
                    !isCurrent && !isClickable && "text-ink-faded cursor-default"
                  )}
                >
                  <span className={cn(
                    "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold border transition",
                    isCurrent ? "bg-accent text-bg border-accent" : "",
                    isDone ? "border-accent-hover bg-accent-soft text-accent" : "",
                    !isCurrent && !isDone ? "border-line text-ink-faded" : "",
                  )}>
                    {isDone ? "✓" : String(i + 1)}
                  </span>
                  <span className={cn(
                    "hidden lg:inline",
                    isCurrent ? "text-accent font-semibold" : ""
                  )}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tool badge + step counter */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-[10px] tracking-widest uppercase text-ink-faded">
              Art. 30 DSGVO
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase bg-accent-soft text-accent px-2.5 py-1">
              {stepIdx + 1} / {VVT_WIZARD_STEPS.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] bg-line">
          <div
            className="h-full bg-accent transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="md:hidden border-t border-line bg-bg/50 px-6 py-2 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
            {meta.label}
          </span>
          <span className="font-mono text-[10px] text-ink-faded">
            {stepIdx + 1} / {VVT_WIZARD_STEPS.length}
          </span>
        </div>
      </header>

      {/* Step Title */}
      <div
        className="max-w-5xl mx-auto px-6 pt-14 pb-2 w-full"
        key={`title-${currentStep}`}
      >
        <p
          className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent mb-4 rise"
          style={{ animationDelay: "0ms" }}
        >
          Schritt {String(stepIdx + 1).padStart(2, "0")} · VVT · Art. 30 DSGVO
        </p>
        <h1
          className="font-display font-bold text-[38px] md:text-[52px] leading-[1.04] rise"
          style={{ letterSpacing: "-0.03em", animationDelay: "40ms" }}
        >
          {meta.label}
        </h1>
        <p
          className="text-ink-dim mt-4 text-[17px] leading-[1.6] rise max-w-2xl"
          style={{ animationDelay: "80ms" }}
        >
          {meta.sub}
        </p>
        <div className="mt-6 h-px bg-line rise" style={{ animationDelay: "100ms" }} />

        {/* RDG-Disclaimer: Kein Rechtsrat — einmalig auf Schritt 1 */}
        {currentStep === "unternehmen" && (
          <p className="mt-4 text-[12px] text-ink-faded rise" style={{ animationDelay: "110ms" }}>
            Dieses Tool erstellt das Verarbeitungsverzeichnis nach Art. 30 DSGVO —{" "}
            <strong className="text-ink-dim">kein Rechtsrat</strong>. Bei komplexen Verarbeitungen
            bitte Datenschutzbeauftragten hinzuziehen.
          </p>
        )}
      </div>

      {/* Step Content */}
      <main id="main-content" className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
        <div key={currentStep} className="rise" style={{ animationDelay: "120ms" }}>
          {currentStep === "unternehmen" && <StepUnternehmen />}
          {currentStep === "taetigkeiten" && <StepTaetigkeiten />}
          {currentStep === "abschluss" && <StepAbschluss />}
        </div>
      </main>

      {/* Sticky Footer Navigation */}
      <footer className="sticky bottom-0 z-20 backdrop-blur-md bg-[rgba(246,242,234,0.95)] border-t border-line">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => { goPrev(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            disabled={isFirst}
            className="font-mono text-[11px] uppercase tracking-widest px-5 py-2.5 border border-line text-ink-dim hover:text-ink hover:border-accent transition disabled:opacity-20 disabled:cursor-not-allowed"
          >
            ← Zurück
          </button>

          <div className="flex items-center gap-4">
            {!stepValid && !isLast && (
              <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-ink-faded">
                {missingHint(currentStep, data)}
              </span>
            )}
            {confirmReset ? (
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">Sicher?</span>
                <button
                  type="button"
                  onClick={() => { reset(); setConfirmReset(false); }}
                  className="font-mono text-[10px] uppercase tracking-widest text-warn hover:underline transition"
                >
                  Ja
                </button>
                <span className="font-mono text-[10px] text-ink-faded">·</span>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="font-mono text-[10px] uppercase tracking-widest text-ink-dim hover:text-ink transition"
                >
                  Nein
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="font-mono text-[10px] uppercase tracking-widest text-ink-faded hover:text-warn transition"
              >
                Zurücksetzen
              </button>
            )}
          </div>

          {!isLast && (
            <button
              type="button"
              onClick={() => { goNext(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={!stepValid}
              title={!stepValid ? "Bitte alle Pflichtfelder ausfüllen" : undefined}
              className="btn-primary font-mono text-[11px] uppercase tracking-widest px-7 py-2.5 disabled:bg-bg-soft disabled:text-ink-faded disabled:border disabled:border-line disabled:cursor-not-allowed"
            >
              Weiter →
            </button>
          )}
          {isLast && (
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faded">
              PDF exportieren ↑
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}

import type { VvtFormData, VvtWizardStep } from "@/lib/vvt/types";

function missingHint(step: VvtWizardStep, data: VvtFormData): string {
  switch (step) {
    case "unternehmen":
      return "Unternehmensname, Vertreter, Anschrift und E-Mail ausfüllen";
    case "taetigkeiten":
      return "Mind. 1 Verarbeitungstätigkeit hinzufügen";
    default:
      return "";
  }
}
