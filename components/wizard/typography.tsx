/**
 * Wizard-Typography-Tokens
 *
 * Einheitliche Schriftbausteine für alle Generator-Step-Komponenten.
 * Ersetzt verstreute Custom-Klassen wie text-[10px] vs. text-[11px] vs. text-sm.
 *
 * Hierarchie:
 *   - SectionHeader: Mono-Klein-Caps, accent-Farbe, für Untersektionen im Step
 *   - StepIntro:     Body-Sub-Text direkt unter Step-Titel, erklärt was der User tut
 *   - Hint:          Inline-Hilfe-Text unter Inputs / kleine Hinweise
 *   - InfoBox:       Hervorgehobene Info (z.B. "DSB-Pflicht wegen Mitarbeiterzahl")
 *   - WarnBox:       Accent-Box für rechtlich wichtige Hinweise
 */

import { cn } from "@/lib/utils";

type CommonProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionHeader({ children, className }: CommonProps) {
  return (
    <p
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function StepIntro({ children, className }: CommonProps) {
  return (
    <p
      className={cn(
        "font-body text-[14px] leading-[1.6] text-ink-dim",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Hint({ children, className }: CommonProps) {
  return (
    <p
      className={cn(
        "font-body text-[12px] leading-[1.5] text-ink-faded",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function InfoBox({ children, className }: CommonProps) {
  return (
    <div
      className={cn(
        "border border-line bg-bg-soft p-4 font-body text-[13px] leading-[1.55] text-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function WarnBox({ children, className }: CommonProps) {
  return (
    <div
      className={cn(
        "border border-accent bg-accent-soft p-4 font-body text-[13px] leading-[1.55] text-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Reusable Section-Block: SectionHeader + optionaler StepIntro + children.
 * Erspart das wiederholte mb-3 / mt-6 / border-t Setzen in jeder Step-Komponente.
 */
export function Section({
  header,
  intro,
  children,
  withDivider = false,
  className,
}: {
  header?: string;
  intro?: string;
  children: React.ReactNode;
  withDivider?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        withDivider ? "border-t border-line pt-8" : "",
        "flex flex-col gap-4",
        className,
      )}
    >
      {header && <SectionHeader>{header}</SectionHeader>}
      {intro && <StepIntro>{intro}</StepIntro>}
      {children}
    </div>
  );
}
