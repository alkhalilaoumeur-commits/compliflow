"use client";

import { useEffect, useState } from "react";

const LAUNCH_TARGET = new Date("2026-06-17T09:00:00+02:00").getTime();
const COOKIE_BANNER_TARGET = new Date("2026-08-19T09:00:00+02:00").getTime();

function daysUntil(now: number, target: number) {
  return Math.max(0, Math.ceil((target - now) / 86_400_000));
}

export function Countdown({
  variant = "inline",
  for: forTarget = "launch",
}: {
  variant?: "inline" | "compact";
  for?: "launch" | "cookie-banner";
}) {
  const [days, setDays] = useState<number | null>(null);
  const target = forTarget === "cookie-banner" ? COOKIE_BANNER_TARGET : LAUNCH_TARGET;

  useEffect(() => {
    setDays(daysUntil(Date.now(), target));
    const i = setInterval(() => setDays(daysUntil(Date.now(), target)), 60_000);
    return () => clearInterval(i);
  }, [target]);

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
