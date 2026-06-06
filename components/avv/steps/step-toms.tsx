"use client";

import { useState } from "react";
import { useAvvStore } from "@/lib/avv/store";
import {
  STANDARD_TOMS,
  TOM_KATEGORIE_LABELS,
} from "@/lib/avv/defaults";
import { getCompletionStatus } from "@/lib/avv/contract";
import type { Tom, TomKategorie } from "@/lib/avv/types";

const KATEGORIEN: TomKategorie[] = [
  "zutritt",
  "zugang",
  "zugriff",
  "weitergabe",
  "eingabe",
  "auftrag",
  "verfuegbarkeit",
  "trennung",
];

export function StepToms() {
  const data = useAvvStore((s) => s.data);
  const toms = data.toms;
  const update = useAvvStore((s) => s.update);
  const status = getCompletionStatus(data);
  const fehlend = status.fehlendeTomKategorien;

  const tomsInKategorie = (k: TomKategorie) => toms.filter((t) => t.kategorie === k);

  const toggle = (kategorie: TomKategorie, beschreibung: string) => {
    const exists = toms.find(
      (t) => t.kategorie === kategorie && t.beschreibung === beschreibung,
    );
    if (exists) {
      update("toms", toms.filter((t) => t.id !== exists.id));
    } else {
      const newTom: Tom = {
        id: crypto.randomUUID(),
        kategorie,
        beschreibung,
      };
      update("toms", [...toms, newTom]);
    }
  };

  const addCustom = (kategorie: TomKategorie, beschreibung: string) => {
    if (!beschreibung.trim()) return;
    update("toms", [
      ...toms,
      { id: crypto.randomUUID(), kategorie, beschreibung: beschreibung.trim(), custom: true },
    ]);
  };

  const remove = (id: string) => {
    update("toms", toms.filter((t) => t.id !== id));
  };

  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      <p className="text-ink-dim text-sm">
        Wähle für jede der 8 Schutzkategorien (Art. 32 DSGVO) mindestens eine umgesetzte Maßnahme.
        Eigene Maßnahmen kannst du je Kategorie ergänzen.
      </p>

      {fehlend.length > 0 ? (
        <div className="border-l-2 border-accent bg-accent/5 p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1">
            Noch unvollständig — fehlende Kategorien:
          </p>
          <p className="text-sm text-ink">
            {fehlend.map((k) => TOM_KATEGORIE_LABELS[k].label).join(" · ")}
          </p>
        </div>
      ) : (
        <div className="border-l-2 p-3" style={{ borderColor: "#4D8B5A", background: "rgba(77,139,90,0.06)" }}>
          <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "#4D8B5A" }}>
            ✓ Alle 8 Kategorien abgedeckt
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 items-center pb-2 border-b border-line">
        <button
          type="button"
          onClick={() => {
            const empfohlen = STANDARD_TOMS.slice(0, 16).map((s) => ({
              id: crypto.randomUUID(),
              kategorie: s.kategorie,
              beschreibung: s.beschreibung,
            }));
            update("toms", empfohlen);
          }}
          className="px-4 py-2 font-mono text-[11px] uppercase tracking-widest bg-accent text-bg hover:bg-ink transition"
        >
          ⚡ Empfohlenes Standard-Set aktivieren (16 TOMs)
        </button>
        <button
          type="button"
          onClick={() => {
            if (toms.length > 0 && confirm("Alle aktivierten TOMs entfernen?")) {
              update("toms", []);
            }
          }}
          className="px-4 py-2 font-mono text-[11px] uppercase tracking-widest border border-line text-ink-dim hover:border-accent hover:text-accent transition"
        >
          Alle abwählen
        </button>
        <span className="font-mono text-[10px] text-ink-faded ml-auto">
          {toms.length} aktive Maßnahme{toms.length !== 1 ? "n" : ""}
        </span>
      </div>

      {KATEGORIEN.map((k) => (
        <ToMSection
          key={k}
          kategorie={k}
          aktive={tomsInKategorie(k)}
          standards={STANDARD_TOMS.filter((s) => s.kategorie === k)}
          onToggle={(b) => toggle(k, b)}
          onAddCustom={(b) => addCustom(k, b)}
          onRemove={remove}
        />
      ))}
    </div>
  );
}

function ToMSection({
  kategorie,
  aktive,
  standards,
  onToggle,
  onAddCustom,
  onRemove,
}: {
  kategorie: TomKategorie;
  aktive: Tom[];
  standards: { kategorie: TomKategorie; beschreibung: string }[];
  onToggle: (b: string) => void;
  onAddCustom: (b: string) => void;
  onRemove: (id: string) => void;
}) {
  const [open, setOpen] = useState(aktive.length === 0);
  const [customInput, setCustomInput] = useState("");
  const meta = TOM_KATEGORIE_LABELS[kategorie];

  return (
    <div className="border border-line bg-bg-soft/30">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-bg-soft/60 transition"
      >
        <div>
          <div className="font-display font-bold text-lg">{meta.label}</div>
          <div className="text-xs text-ink-dim mt-1">{meta.beschreibung}</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
            {aktive.length} aktiv
          </span>
          <span className="text-ink-dim">{open ? "−" : "+"}</span>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 flex flex-col gap-2">
          {standards.map((s) => {
            const isActive = aktive.some((a) => a.beschreibung === s.beschreibung);
            return (
              <label
                key={s.beschreibung}
                className="flex items-start gap-3 cursor-pointer p-2 hover:bg-bg-soft/50 transition"
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => onToggle(s.beschreibung)}
                  className="mt-1 accent-accent"
                />
                <span className="text-sm">{s.beschreibung}</span>
              </label>
            );
          })}

          {aktive.filter((a) => a.custom).map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-3 p-2 bg-accent/5 border-l-2 border-accent"
            >
              <span className="text-sm flex-1">{a.beschreibung}</span>
              <button
                type="button"
                onClick={() => onRemove(a.id)}
                className="text-ink-faded hover:text-accent text-sm"
              >
                Entfernen
              </button>
            </div>
          ))}

          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddCustom(customInput);
                  setCustomInput("");
                }
              }}
              placeholder="Eigene Maßnahme hinzufügen …"
              className="flex-1 bg-bg-soft border border-line px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={() => {
                onAddCustom(customInput);
                setCustomInput("");
              }}
              className="px-4 py-2 font-mono text-[11px] uppercase tracking-widest bg-bg-soft border border-line hover:border-accent transition"
            >
              + Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
