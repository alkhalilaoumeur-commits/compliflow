"use client";

import { useState } from "react";
import { useAvvStore } from "@/lib/avv/store";
import { STANDARD_DATENKATEGORIEN } from "@/lib/avv/defaults";
import { Field } from "../field";

export function StepDatenkategorien() {
  const data = useAvvStore((s) => s.data);
  const patch = useAvvStore((s) => s.patch);
  const [customInput, setCustomInput] = useState("");

  const toggle = (id: string) => {
    const current = data.datenkategorien;
    patch({
      datenkategorien: current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id],
    });
  };

  const addCustom = () => {
    const v = customInput.trim();
    if (!v) return;
    patch({ datenkategorienCustom: [...data.datenkategorienCustom, v] });
    setCustomInput("");
  };

  const removeCustom = (idx: number) => {
    patch({
      datenkategorienCustom: data.datenkategorienCustom.filter((_, i) => i !== idx),
    });
  };

  const hatBesondere = data.datenkategorien.some((id) => {
    const cat = STANDARD_DATENKATEGORIEN.find((c) => c.id === id);
    return cat?.besondereKategorie;
  });

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <Field label="Standard-Datenkategorien" hint="Mehrfachauswahl. Klick zum Aktivieren.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STANDARD_DATENKATEGORIEN.map((cat) => {
            const active = data.datenkategorien.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggle(cat.id)}
                className={
                  "text-left p-4 border transition " +
                  (active
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-bg-soft hover:border-accent")
                }
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold">{cat.label}</span>
                  {cat.besondereKategorie && (
                    <span className="font-mono text-[9px] uppercase tracking-widest text-accent">
                      Art. 9
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-dim mt-1">{cat.beispiele.join(" · ")}</p>
              </button>
            );
          })}
        </div>
      </Field>

      {hatBesondere && (
        <div className="border-l-2 border-accent bg-accent-soft p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
            Warnung — Besondere Datenkategorien (Art. 9 DSGVO)
          </p>
          <p className="text-sm text-ink-dim">
            Du hast Daten besonderer Kategorien ausgewählt (z.B. Gesundheits- oder biometrische Daten).
            Diese unterliegen strengeren Anforderungen — der generierte AVV enthält automatisch eine
            verschärfte Schutzklausel.
          </p>
        </div>
      )}

      <Field label="Weitere Datenkategorien (frei)" hint="Was deine Daten betrifft, aber nicht oben gelistet ist">
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
            placeholder="z.B. Trainingsdaten, Telemetrie, …"
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
        {data.datenkategorienCustom.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {data.datenkategorienCustom.map((v, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-2 bg-bg-soft border border-line text-sm"
              >
                {v}
                <button
                  type="button"
                  onClick={() => removeCustom(idx)}
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
