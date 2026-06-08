"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2026-06-17T09:00:00+02:00").getTime();

function daysUntil(now: number) {
  return Math.max(0, Math.ceil((TARGET - now) / 86_400_000));
}

export function Countdown({ variant = "inline" }: { variant?: "inline" | "compact" }) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(daysUntil(Date.now()));
    const i = setInterval(() => setDays(daysUntil(Date.now())), 60_000);
    return () => clearInterval(i);
  }, []);

  if (days === null) {
    return <span aria-hidden="true">—</span>;
  }

  if (variant === "compact") {
    return (
      <span>
        in <strong className="font-medium text-ink">{days}</strong>{" "}
        {days === 1 ? "Tag" : "Tagen"}
      </span>
    );
  }

  return (
    <span>
      <span className="font-display text-ink">{days}</span>{" "}
      {days === 1 ? "Tag" : "Tage"} bis Launch
    </span>
  );
}
