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
      <header className="sticky top-0 z-20 backdrop-blur bg-bg/85 border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <a
            href="/"
            className="opacity-90 hover:opacity-100 transition"
            aria-label="Zur Startseite"
          >
            <Logo variant="lockup" size={26} />
          </a>

          {/* Step Nav */}
          <div className="hidden md:flex items-center gap-1 text-[11px]">
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
                    "font-mono uppercase tracking-widest px-2 py-1 transition",
                    isCurrent && "text-accent font-bold",
                    !isCurrent && isClickable && "text-ink-dim hover:text-ink cursor-pointer",
                    !isCurrent && !isClickable && "text-ink-faded cursor-default"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              );
            })}
          </div>

          {/* Tool badge */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline font-mono text-[10px] tracking-widest uppercase text-ink-faded">
              VVT · Art. 30
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-ink-dim">
              {stepIdx + 1} / {VVT_WIZARD_STEPS.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] bg-line">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </header>

      {/* Step Title */}
      <div
        className="max-w-5xl mx-auto px-6 pt-12 w-full"
        key={`title-${currentStep}`}
      >
        <p
          className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent mb-3 rise"
          style={{ animationDelay: "0ms" }}
        >
          {String(stepIdx + 1).padStart(2, "0")} · Verarbeitungsverzeichnis Art. 30 DSGVO
        </p>
        <h1
          className="font-display font-bold text-4xl md:text-5xl leading-tight rise"
          style={{ letterSpacing: "-0.03em", animationDelay: "40ms" }}
        >
          {meta.label}
        </h1>
        <p
          className="text-ink-dim mt-3 text-lg rise"
          style={{ animationDelay: "80ms" }}
        >
          {meta.sub}
        </p>
      </div>

      {/* Step Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full">
        <div key={currentStep} className="rise" style={{ animationDelay: "120ms" }}>
          {currentStep === "unternehmen" && <StepUnternehmen />}
          {currentStep === "taetigkeiten" && <StepTaetigkeiten />}
          {currentStep === "abschluss" && <StepAbschluss />}
        </div>
      </main>

      {/* Sticky Footer Navigation */}
      <footer className="sticky bottom-0 z-20 backdrop-blur bg-bg-soft/95 border-t border-line">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={isFirst}
            className="font-mono text-xs uppercase tracking-widest px-5 py-3 border border-line text-ink-dim hover:text-ink hover:border-accent transition disabled:opacity-30 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            ← Zurück
          </button>

          <div className="flex items-center gap-3">
            {!stepValid && !isLast && (
              <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-ink-faded">
                {missingHint(currentStep, data)}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                if (confirm("Alle Eingaben verwerfen und neu starten?")) reset();
              }}
              className="font-mono text-[10px] uppercase tracking-widest text-ink-faded hover:text-accent transition"
            >
              Zurücksetzen
            </button>
          </div>

          {!isLast && (
            <button
              type="button"
              onClick={goNext}
              disabled={!stepValid}
              title={!stepValid ? "Bitte alle Pflichtfelder ausfüllen" : undefined}
              className="font-mono text-xs uppercase tracking-widest px-6 py-3 bg-accent text-bg hover:bg-ink transition disabled:bg-bg-soft disabled:text-ink-faded disabled:border disabled:border-line disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Weiter →
            </button>
          )}
          {isLast && (
            <span className="font-mono text-xs uppercase tracking-widest text-ink-dim">
              PDF oben exportieren ↑
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
