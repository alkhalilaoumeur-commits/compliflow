"use client";

import { useState, useTransition } from "react";
import { joinWaitlist } from "@/app/actions/waitlist";

type Status =
  | { kind: "idle" }
  | { kind: "ok"; msg: string }
  | { kind: "err"; msg: string };

export function WaitlistForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await joinWaitlist(fd);
      setStatus(res.ok ? { kind: "ok", msg: res.message } : { kind: "err", msg: res.message });
      if (res.ok) e.currentTarget?.reset?.();
    });
  }

  const done = status.kind === "ok";

  return (
    <form onSubmit={onSubmit} className="mt-10 max-w-lg">
      <div className="relative flex flex-col gap-3 border border-line bg-bg-soft p-2 sm:flex-row sm:items-stretch sm:gap-0">
        <input
          type="email"
          name="email"
          required
          placeholder="dein.name@firma.de"
          autoComplete="email"
          disabled={pending || done}
          className="flex-1 bg-transparent px-4 py-4 font-body text-[15px] text-ink placeholder:text-ink-faded focus:outline-none focus:placeholder:text-ink-faded/60 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={pending || done}
          className="group relative inline-flex items-center justify-center bg-accent px-6 py-4 font-display text-[14px] font-bold uppercase tracking-[0.1em] text-bg transition-all duration-300 hover:bg-ink hover:text-bg disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="relative z-10">
            {pending ? "Speichere…" : done ? "Eingetragen ✓" : "Auf die Liste"}
          </span>
        </button>
      </div>

      <div className="mt-4 min-h-[20px] font-mono text-[11px] uppercase tracking-[0.15em]">
        {status.kind === "ok" && (
          <span className="text-accent">{status.msg}</span>
        )}
        {status.kind === "err" && (
          <span className="text-accent">{status.msg}</span>
        )}
        {status.kind === "idle" && !pending && (
          <span className="text-ink-faded">
            Wir nutzen deine Mail nur für die Launch-Benachrichtigung.
          </span>
        )}
      </div>
    </form>
  );
}
