"use client";

import { useEffect, useState } from "react";

const BASE = 6_287_400_000;
const PER_SECOND = 12.4;
const ANCHOR = new Date("2026-06-06T00:00:00+02:00").getTime();

function format(n: number) {
  return Math.floor(n).toLocaleString("de-DE");
}

export function BussgeldCounter() {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    function tick() {
      const elapsed = (Date.now() - ANCHOR) / 1000;
      setValue(BASE + elapsed * PER_SECOND);
    }
    tick();
    const i = setInterval(tick, 100);
    return () => clearInterval(i);
  }, []);

  return (
    <span className="font-display text-accent tabular-nums">
      {value === null ? format(BASE) : format(value)}€
    </span>
  );
}
