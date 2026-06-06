"use client";

import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
};

export function Field({ label, hint, error, required, children, className, htmlFor }: FieldProps) {
  return (
    <label htmlFor={htmlFor} className={cn("flex flex-col gap-2", className)}>
      <span className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">
        {label}
        {required && (
          <span aria-hidden="true" className="text-accent ml-1">
            *
          </span>
        )}
      </span>
      {children}
      {hint && !error && <span className="text-[11px] text-ink-faded">{hint}</span>}
      {error && (
        <span role="alert" className="text-[11px] text-accent">
          {error}
        </span>
      )}
    </label>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean },
) {
  const { invalid, className, ...rest } = props;
  return (
    <input
      {...rest}
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full bg-bg-soft border px-4 py-3 text-ink placeholder:text-ink-faded font-body text-base outline-none transition focus-visible:ring-2 focus-visible:ring-accent/40",
        invalid ? "border-accent" : "border-line focus:border-accent",
        className,
      )}
    />
  );
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean },
) {
  const { invalid, className, ...rest } = props;
  return (
    <textarea
      {...rest}
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full bg-bg-soft border px-4 py-3 text-ink placeholder:text-ink-faded font-body text-base outline-none transition resize-y min-h-[100px] focus-visible:ring-2 focus-visible:ring-accent/40",
        invalid ? "border-accent" : "border-line focus:border-accent",
        className,
      )}
    />
  );
}

export function CharCounter({
  value,
  min,
  max,
}: {
  value: string;
  min: number;
  max?: number;
}) {
  const count = (value ?? "").length;
  const tooShort = count < min;
  const tooLong = max ? count > max : false;
  const color = tooShort || tooLong ? "text-accent" : "text-ink-faded";
  return (
    <span className={cn("font-mono text-[10px] uppercase tracking-widest", color)}>
      {count} / mind. {min}
      {max ? ` (max. ${max})` : ""}
    </span>
  );
}
