"use client";

import { useEffect, useState } from "react";
import { useImpressumStore, getStepIndex, getProgress } from "@/lib/impressum/store";
import { WIZARD_STEPS, type WizardStep } from "@/lib/impressum/types";
import { getCompletionStatus } from "@/lib/impressum/contract";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { StepAnbieter } from "./steps/step-anbieter";
import { StepKontakt } from "./steps/step-kontakt";
import { StepRegister } from "./steps/step-register";
import { StepVertretung } from "./steps/step-vertretung";
import { StepZusatz } from "./steps/step-zusatz";
import { StepReview } from "./steps/step-review";

export function WizardShell() {
  const currentStep = useImpressumStore((s) => s.currentStep);
  const setStep = useImpressumStore((s) => s.setStep);
  const goNext = useImpressumStore((s) => s.goNext);
  const goPrev = useImpressumStore((s) => s.goPrev);
  const reset = useImpressumStore((s) => s.reset);
  const data = useImpressumStore((s) => s.data);
  const [hydrated, setHydrated] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const stepIdx = getStepIndex(currentStep);
  const progress = getProgress(currentStep);
  const meta = WIZARD_STEPS[stepIdx];
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === WIZARD_STEPS.length - 1;

  const completion = getCompletionStatus(data);
  const stepValid = completion.checks[currentStep];

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-dim">
        <div className="font-mono text-[11px] uppercase tracking-widest">Lade Wizard …</div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-[rgba(246,242,234,0.9)] border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <a href="/" className="opacity-80 hover:opacity-100 transition" aria-label="Zur Startseite">
            <Logo variant="lockup" size={24} />
          </a>
          <div className="hidden md:flex items-center gap-0">
            {WIZARD_STEPS.map((s, i) => {
              const isCurrent = s.id === currentStep;
              const isDone = completion.checks[s.id] && i < stepIdx;
              const isClickable = i <= stepIdx || isDone;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => isClickable && setStep(s.id)}
                  disabled={!isClickable}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 transition font-mono text-[10px] uppercase tracking-widest",
                    isCurrent && "text-accent",
                    !isCurrent && isClickable && "text-ink-dim hover:text-ink cursor-pointer",
                    !isClickable && "text-ink-faded cursor-not-allowed",
                  )}
                >
                  <span className={cn(
                    "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold border transition",
                    isCurrent ? "bg-accent text-bg border-accent" : "",
                    isDone ? "border-accent bg-accent-soft text-accent" : "",
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
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-[10px] tracking-widest uppercase text-ink-faded">
              § 5 DDG
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase bg-accent-soft text-accent px-2.5 py-1">
              {stepIdx + 1} / {WIZARD_STEPS.length}
            </span>
          </div>
        </div>
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
            {stepIdx + 1} / {WIZARD_STEPS.length}
          </span>
        </div>
      </header>

      {/* Step Title */}
      <div className="max-w-5xl mx-auto px-6 pt-14 pb-2 w-full" key={`title-${currentStep}`}>
        <p
          className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent mb-4 rise"
          style={{ animationDelay: "0ms" }}
        >
          Schritt {String(stepIdx + 1).padStart(2, "0")} · Impressum · § 5 DDG
        </p>
        <h1
          className="font-display font-bold text-[38px] md:text-[52px] leading-[1.04] rise"
          style={{ letterSpacing: "-0.03em", animationDelay: "40ms" }}
        >
          {meta.label}
        </h1>
        <p className="text-ink-dim mt-4 text-[17px] leading-[1.6] rise max-w-2xl" style={{ animationDelay: "80ms" }}>
          {meta.sub}
        </p>
        <div className="mt-6 h-px bg-line rise" style={{ animationDelay: "100ms" }} />

        {currentStep === "anbieter" && (
          <p className="mt-4 text-[12px] text-ink-faded rise" style={{ animationDelay: "110ms" }}>
            Pflichtangaben nach § 5 DDG (seit 14.05.2025, ersetzt § 5 TMG) — bei Verstoß bis
            50.000 € Bußgeld. Compliflow generiert alle Standard-Pflichtangaben,{" "}
            <strong className="text-ink-dim">ersetzt aber keine Rechtsberatung</strong> bei
            Sonderfällen.
          </p>
        )}
      </div>

      {/* Step Content */}
      <main id="main-content" className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
        <div key={currentStep} className="rise" style={{ animationDelay: "120ms" }}>
          {currentStep === "anbieter" && <StepAnbieter />}
          {currentStep === "kontakt" && <StepKontakt />}
          {currentStep === "register" && <StepRegister />}
          {currentStep === "vertretung" && <StepVertretung />}
          {currentStep === "zusatz" && <StepZusatz />}
          {currentStep === "review" && <StepReview />}
        </div>
      </main>

      {/* Sticky Footer Navigation */}
      <footer className="sticky bottom-0 z-20 backdrop-blur-md bg-[rgba(246,242,234,0.95)] border-t border-line shadow-[0_-1px_0_0_rgba(226,221,209,1)]">
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
                {missingHint(currentStep)}
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
              HTML / PDF kopieren ↑
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}

function missingHint(step: WizardStep): string {
  switch (step) {
    case "anbieter":
      return "Rechtsform + Name angeben";
    case "kontakt":
      return "Adresse + Email + Telefon/Formular";
    case "register":
      return "Falls eingetragen: Register + Nummer + Gericht";
    case "vertretung":
      return "Vertretungsberechtigte + ggf. Beruf";
    case "zusatz":
      return "Pflichtfelder bei Blog ergänzen";
    default:
      return "";
  }
}
