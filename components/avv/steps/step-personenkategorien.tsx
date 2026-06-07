"use client";

import { useState } from "react";
import { useAvvStore } from "@/lib/avv/store";
import { STANDARD_PERSONENKATEGORIEN } from "@/lib/avv/defaults";
import { Field } from "../field";

export function StepPersonenkategorien() {
  const data = useAvvStore((s) => s.data);
  const patch = useAvvStore((s) => s.patch);
  const [customInput, setCustomInput] = useState("");

  const toggle = (id: string) => {
    const current = data.personenkategorien;
    patch({
      personenkategorien: current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id],
    });
  };

  const addCustom = () => {
    const v = customInput.trim();
    if (!v) return;
    patch({ personenkategorienCustom: [...data.personenkategorienCustom, v] });
    setCustomInput("");
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <Field label="Kategorien betroffener Personen">
        <div className="grid grid-cols-2 gap-3">
          {STANDARD_PERSONENKATEGORIEN.map((cat) => {
            const active = data.personenkategorien.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggle(cat.id)}
                className={
                  "text-left p-4 border transition flex items-center gap-3 " +
                  (active
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-bg-soft hover:border-accent")
                }
              >
                <span
                  className={`flex-shrink-0 inline-flex h-4 w-4 items-center justify-center border transition ${
                    active ? "bg-accent border-accent text-bg" : "border-line"
                  }`}
                  aria-hidden="true"
                >
                  {active && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span className="font-display font-bold">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Weitere Kategorien (frei)">
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
            placeholder="z.B. Ehrenamtliche, Vertragspartner B2B …"
            className="flex-1 bg-bg-soft border border-line px-4 py-3 text-ink outline-none focus:border-accent transition"
          />
          <button
            type="button"
            onClick={addCustom}
            className="px-5 py-3 font-mono text-xs uppercase tracking-widest bg-bg-soft border border-line hover:border-accent transition"
          >
            + Hinzufügen
          </button>
        </div>
        {data.personenkategorienCustom.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {data.personenkategorienCustom.map((v, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-2 bg-bg-soft border border-line text-sm"
              >
                {v}
                <button
                  type="button"
                  onClick={() =>
                    patch({
                      personenkategorienCustom: data.personenkategorienCustom.filter(
                        (_, i) => i !== idx,
                      ),
                    })
                  }
                  className="text-ink-faded hover:text-accent"
                  aria-label="Entfernen"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </Field>
    </div>
  );
}
