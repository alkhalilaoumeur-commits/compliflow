"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2026-06-17T09:00:00+02:00").getTime();

type T = { d: number; h: number; m: number; s: number };

function diff(now: number): T {
  const ms = Math.max(0, TARGET - now);
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export function Countdown({ variant = "hero" }: { variant?: "hero" | "compact" }) {
  const [t, setT] = useState<T | null>(null);

  useEffect(() => {
    setT(diff(Date.now()));
    const i = setInterval(() => setT(diff(Date.now())), 1000);
    return () => clearInterval(i);
  }, []);

  if (!t) {
    return <div className="h-[60px]" aria-hidden="true" />;
  }

  if (variant === "compact") {
    return (
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim">
        T-{String(t.d).padStart(2, "0")}d {String(t.h).padStart(2, "0")}h{" "}
        {String(t.m).padStart(2, "0")}m
      </span>
    );
  }

  return (
    <div className="flex items-end gap-4 font-display">
      {[
        ["Tage", t.d],
        ["Std", t.h],
        ["Min", t.m],
        ["Sek", t.s],
      ].map(([label, val]) => (
        <div key={label} className="text-left">
          <div className="text-[44px] font-extrabold leading-none tracking-tight text-ink md:text-[64px]">
            {String(val).padStart(2, "0")}
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faded">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
