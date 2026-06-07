"use client";

import { useState } from "react";
import { useAvvStore } from "@/lib/avv/store";
import { DRITTLAND_TOP20, QUICK_SUBVERARBEITER } from "@/lib/avv/defaults";
import type { Subverarbeiter, Sicherheitsgarantie } from "@/lib/avv/types";
import { Field, TextInput, TextArea } from "../field";

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
    <div className="border border-line bg-[rgba(240,236,226,0.4)] p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
          Subverarbeiter {String(index + 1).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="font-mono text-[10px] uppercase tracking-widest text-ink-faded hover:text-accent transition"
        >
          Entfernen
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Firma / Name" required>
          <TextInput
            placeholder="z.B. Hetzner Online GmbH"
            value={item.firma}
            onChange={(e) => onUpdate({ firma: e.target.value })}
          />
        </Field>
        <Field label="Anschrift / Sitz">
          <TextInput
            placeholder="z.B. Industriestraße 25, 91710 Gunzenhausen"
            value={item.anschrift}
            onChange={(e) => onUpdate({ anschrift: e.target.value })}
          />
        </Field>
      </div>

      <Field label="Verarbeitungszweck" required hint="Was genau macht dieser Subverarbeiter?">
        <TextInput
          placeholder="z.B. Hosting, E-Mail-Versand, Zahlungsabwicklung"
          value={item.zweck}
          onChange={(e) => onUpdate({ zweck: e.target.value })}
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Land / Sitz" required>
          <select
            value={item.land}
            onChange={(e) => onUpdate({ land: e.target.value })}
            className="w-full bg-bg-soft border border-line px-4 py-3 text-ink font-body text-base outline-none focus:border-accent transition"
          >
            {DRITTLAND_TOP20.map((l) => (
              <option key={l.code} value={l.code}>
                {l.land} ({l.code})
              </option>
            ))}
          </select>
        </Field>
        <Field label="DSGVO-Garantie">
          <div
            className={`flex items-center px-4 py-3 border text-sm ${
              item.sicherheitsgarantie === "EU-EWR"
                ? "border-[rgba(31,61,47,0.3)] bg-accent-soft text-accent font-mono text-[11px] uppercase tracking-widest"
                : "border-line bg-bg-soft text-ink-dim"
            }`}
          >
            {item.sicherheitsgarantie === "EU-EWR" && "Innerhalb EU/EWR"}
            {item.sicherheitsgarantie === "Angemessenheitsbeschluss" && "Angemessenheitsbeschluss"}
            {item.sicherheitsgarantie === "Standardvertragsklauseln" && "Standardvertragsklauseln (SCCs)"}
          </div>
        </Field>
      </div>

      {isSchremsII && (
        <div className="border-l-2 border-accent bg-accent-soft p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
            Schrems-II — Zusatzmaßnahmen erforderlich
          </p>
          <p className="text-xs text-ink-dim mb-3">
            Für Übermittlungen in dieses Land sind nach dem EuGH-Urteil (Schrems II)
            ergänzende Schutzmaßnahmen nötig. Beschreibe kurz, welche Maßnahmen umgesetzt sind:
          </p>
          <TextArea
            placeholder="z.B. Verschlüsselung der Daten vor Übertragung, Pseudonymisierung, EU-Daten-Region des Anbieters aktiviert …"
            value={item.schremsIIZusatzmassnahmen ?? ""}
            onChange={(e) => onUpdate({ schremsIIZusatzmassnahmen: e.target.value })}
            rows={2}
          />
        </div>
      )}
    </div>
  );
}
