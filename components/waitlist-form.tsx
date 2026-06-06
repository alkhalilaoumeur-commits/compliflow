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
    <form onSubmit={onSubmit} className="w-full">
      <label htmlFor="waitlist-email" className="sr-only">
        Deine Email-Adresse
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="waitlist-email"
          type="email"
          name="email"
          required
          placeholder="dein.name@firma.de"
          autoComplete="email"
          disabled={pending || done}
          className="h-12 flex-1 rounded-none border border-line-strong bg-surface-alt px-4 font-body text-[15px] text-ink placeholder:text-ink-faded focus:border-accent focus:outline-none focus:ring-0 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={pending || done}
          className="btn-primary inline-flex h-12 items-center justify-center rounded-none px-7 font-body text-[14px] font-medium tracking-tight disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Speichere…" : done ? "Eingetragen" : "Auf die Warteliste"}
        </button>
      </div>

      <p
        className={`mt-3 min-h-[20px] font-body text-[13px] ${
          status.kind === "ok"
            ? "text-accent"
            : status.kind === "err"
              ? "text-warn"
              : "text-ink-faded"
        }`}
      >
        {status.kind === "ok"
          ? status.msg
          : status.kind === "err"
            ? status.msg
            : "Eine Mail beim Launch. Keine weiteren Newsletter. Abmelden mit einem Klick."}
      </p>
    </form>
  );
}
