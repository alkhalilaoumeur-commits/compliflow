"use client";

import { useEffect, useState } from "react";
import { useAvvStore, getStepIndex, getProgress } from "@/lib/avv/store";
import { WIZARD_STEPS, type WizardStep } from "@/lib/avv/types";
import { getCompletionStatus } from "@/lib/avv/contract";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { StepParteien } from "./steps/step-parteien";
import { StepVerarbeitung } from "./steps/step-verarbeitung";
import { StepDatenkategorien } from "./steps/step-datenkategorien";
import { StepPersonenkategorien } from "./steps/step-personenkategorien";
import { StepToms } from "./steps/step-toms";
import { StepSubverarbeiter } from "./steps/step-subverarbeiter";
import { StepReview } from "./steps/step-review";

export function WizardShell() {
  const currentStep = useAvvStore((s) => s.currentStep);
  const setStep = useAvvStore((s) => s.setStep);
  const goNext = useAvvStore((s) => s.goNext);
  const goPrev = useAvvStore((s) => s.goPrev);
  const reset = useAvvStore((s) => s.reset);
  const data = useAvvStore((s) => s.data);
  const [hydrated, setHydrated] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      const sessionId = params.get("session_id");
      window.history.replaceState({}, "", "/avv");
      setStep("review");

      if (sessionId) {
        fetch(`/api/stripe/verify-session?sessionId=${encodeURIComponent(sessionId)}`)
          .then((r) => r.json())
          .then((d: { valid?: boolean; tool?: string }) => {
            if (d.valid && d.tool === "avv") localStorage.setItem("compliflow_pro_avv", sessionId);
          })
          .catch(() => {})
          .finally(() => {
            setSuccessBanner(true);
            setTimeout(() => setSuccessBanner(false), 8000);
          });
      } else {
        setSuccessBanner(true);
        setTimeout(() => setSuccessBanner(false), 8000);
      }
    }
  }, [setStep]);

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
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-[10px] tracking-widest uppercase text-ink-faded">
              Art. 28 DSGVO
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
      </header>

      {/* Pro Success Banner */}
      {successBanner && (
        <div className="bg-accent text-bg px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-widest">Pro aktiviert</span>
            <span className="font-body text-[13px]">
              AVV Pro freigeschaltet — dein Download enthält kein Compliflow-Branding.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(false)}
            className="font-mono text-[11px] opacity-70 hover:opacity-100 transition flex-shrink-0"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>
      )}

      {/* Step Title */}
      <div className="max-w-5xl mx-auto px-6 pt-14 pb-2 w-full" key={`title-${currentStep}`}>
        <p
          className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent mb-4 rise"
          style={{ animationDelay: "0ms" }}
        >
          Schritt {String(stepIdx + 1).padStart(2, "0")} · AVV · Art. 28 DSGVO
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
      </div>

      {/* Step Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
        <div key={currentStep} className="rise" style={{ animationDelay: "120ms" }}>
          {currentStep === "parteien" && <StepParteien />}
          {currentStep === "verarbeitung" && <StepVerarbeitung />}
          {currentStep === "datenkategorien" && <StepDatenkategorien />}
          {currentStep === "personenkategorien" && <StepPersonenkategorien />}
          {currentStep === "toms" && <StepToms />}
          {currentStep === "subverarbeiter" && <StepSubverarbeiter />}
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
                {missingHint(currentStep, completion)}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                if (confirm("Alle Eingaben verwerfen und neu starten?")) reset();
              }}
              className="font-mono text-[10px] uppercase tracking-widest text-ink-faded hover:text-warn transition"
            >
              Zurücksetzen
            </button>
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
              PDF erstellen ↑
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}

function missingHint(step: WizardStep, c: ReturnType<typeof getCompletionStatus>): string {
  switch (step) {
    case "parteien":
      return "Beide Parteien vollständig?";
    case "verarbeitung":
      return "Gegenstand, Zweck, Dauer, mind. 1 Art";
    case "datenkategorien":
      return "Mind. 1 Kategorie wählen";
    case "personenkategorien":
      return "Mind. 1 Kategorie wählen";
    case "toms":
      return c.fehlendeTomKategorien.length > 0
        ? `Noch ${c.fehlendeTomKategorien.length} Kategorie(n) ohne TOM`
        : "";
    default:
      return "";
  }
}
