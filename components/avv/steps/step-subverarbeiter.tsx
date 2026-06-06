"use client";

import { useState } from "react";
import { useAvvStore } from "@/lib/avv/store";
import { DRITTLAND_TOP20, QUICK_SUBVERARBEITER } from "@/lib/avv/defaults";
import type { Subverarbeiter, Sicherheitsgarantie } from "@/lib/avv/types";

export function StepSubverarbeiter() {
  const items = useAvvStore((s) => s.data.subverarbeiter);
  const update = useAvvStore((s) => s.update);

  const add = (partial: Partial<Subverarbeiter> = {}) => {
    const neu: Subverarbeiter = {
      id: crypto.randomUUID(),
      firma: partial.firma ?? "",
      anschrift: partial.anschrift ?? "",
      zweck: partial.zweck ?? "",
      land: partial.land ?? "DE",
      sicherheitsgarantie: deriveGarantie(partial.land ?? "DE"),
    };
    update("subverarbeiter", [...items, neu]);
  };

  const updateItem = (id: string, patch: Partial<Subverarbeiter>) => {
    update(
      "subverarbeiter",
      items.map((s) =>
        s.id === id ? { ...s, ...patch, sicherheitsgarantie: patch.land ? deriveGarantie(patch.land) : (patch.sicherheitsgarantie ?? s.sicherheitsgarantie) } : s,
      ),
    );
  };

  const remove = (id: string) => {
    update("subverarbeiter", items.filter((s) => s.id !== id));
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <p className="text-ink-dim text-sm mb-3">
          Liste alle Dienstleister auf, die ebenfalls personenbezogene Daten verarbeiten —
          z.B. Hosting, E-Mail-Versand, Zahlungsdienste. Bei Drittländern erfolgt automatisch
          ein Schrems-II-Hinweis.
        </p>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-dim mb-2">
            Häufige Anbieter (Schnell-Hinzufügen):
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_SUBVERARBEITER.map((q) => (
              <button
                key={q.firma}
                type="button"
                onClick={() => add(q)}
                className="px-3 py-2 text-xs bg-bg-soft border border-line hover:border-accent transition"
              >
                + {q.firma.split(/[ ,]/)[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {items.length === 0 && (
        <div className="border border-dashed border-line p-10 text-center">
          <p className="text-ink-dim text-sm">Noch keine Subverarbeiter eingetragen.</p>
          <button
            type="button"
            onClick={() => add()}
            className="mt-4 px-5 py-3 font-mono text-xs uppercase tracking-widest bg-accent text-bg hover:bg-ink transition"
          >
            + Ersten Subverarbeiter hinzufügen
          </button>
        </div>
      )}

      {items.map((s, idx) => (
        <SubCard
          key={s.id}
          item={s}
          index={idx}
          onUpdate={(p) => updateItem(s.id, p)}
          onRemove={() => remove(s.id)}
        />
      ))}

      {items.length > 0 && (
        <button
          type="button"
          onClick={() => add()}
          className="px-5 py-3 font-mono text-xs uppercase tracking-widest border border-line hover:border-accent text-ink-dim hover:text-ink transition self-start"
        >
          + Weiteren hinzufügen
        </button>
      )}
    </div>
  );
}

function deriveGarantie(land: string): Sicherheitsgarantie {
  const meta = DRITTLAND_TOP20.find((l) => l.code === land);
  if (!meta) return "Keine";
  if (meta.inEU) return "EU-EWR";
  if (meta.angemessenheit) return "Angemessenheitsbeschluss";
  return "Standardvertragsklauseln";
}

function SubCard({
  item,
  index,
  onUpdate,
  onRemove,
}: {
  item: Subverarbeiter;
  index: number;
  onUpdate: (patch: Partial<Subverarbeiter>) => void;
  onRemove: () => void;
}) {
  const landMeta = DRITTLAND_TOP20.find((l) => l.code === item.land);
  const isSchremsII = landMeta?.schremsII;

  return (
    <div className="border border-line bg-bg-soft/40 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
          Subverarbeiter #{index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-ink-faded hover:text-accent text-xs"
        >
          Entfernen
        </button>
      </div>

      <input
        type="text"
        placeholder="Firma"
        value={item.firma}
        onChange={(e) => onUpdate({ firma: e.target.value })}
        className="bg-bg border border-line px-3 py-2 text-ink outline-none focus:border-accent"
      />
      <input
        type="text"
        placeholder="Anschrift / Sitz"
        value={item.anschrift}
        onChange={(e) => onUpdate({ anschrift: e.target.value })}
        className="bg-bg border border-line px-3 py-2 text-ink outline-none focus:border-accent"
      />
      <input
        type="text"
        placeholder="Verarbeitungszweck (z.B. Hosting)"
        value={item.zweck}
        onChange={(e) => onUpdate({ zweck: e.target.value })}
        className="bg-bg border border-line px-3 py-2 text-ink outline-none focus:border-accent"
      />

      <div className="grid grid-cols-2 gap-3">
        <select
          value={item.land}
          onChange={(e) => onUpdate({ land: e.target.value })}
          className="bg-bg border border-line px-3 py-2 text-ink outline-none focus:border-accent"
        >
          {DRITTLAND_TOP20.map((l) => (
            <option key={l.code} value={l.code}>
              {l.land} ({l.code})
            </option>
          ))}
        </select>
        <div className="bg-bg-soft border border-line px-3 py-2 text-sm text-ink-dim flex items-center">
          {item.sicherheitsgarantie === "EU-EWR" && "Innerhalb EU/EWR"}
          {item.sicherheitsgarantie === "Angemessenheitsbeschluss" && "Angemessenheitsbeschluss"}
          {item.sicherheitsgarantie === "Standardvertragsklauseln" && "Standardvertragsklauseln (SCCs)"}
        </div>
      </div>

      {isSchremsII && (
        <div className="border-l-2 border-accent bg-accent/5 p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1">
            Schrems-II-Hinweis
          </p>
          <p className="text-xs text-ink-dim mb-2">
            Für Übermittlungen in dieses Land sind zusätzliche Schutzmaßnahmen nötig.
            Beschreibe kurz, welche Maßnahmen umgesetzt sind:
          </p>
          <textarea
            placeholder="z.B. Verschlüsselung der Daten vor Übertragung, Pseudonymisierung, EU-Daten-Region des Anbieters …"
            value={item.schremsIIZusatzmassnahmen ?? ""}
            onChange={(e) => onUpdate({ schremsIIZusatzmassnahmen: e.target.value })}
            className="w-full bg-bg border border-line px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            rows={2}
          />
        </div>
      )}
    </div>
  );
}
