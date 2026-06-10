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

  const [confirmClear, setConfirmClear] = useState(false);
  const completedCount = KATEGORIEN.length - fehlend.length;

  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      <p className="text-ink-dim text-sm">
        Wähle für jede der 8 Schutzkategorien (Art. 32 DSGVO) mindestens eine umgesetzte Maßnahme.
        Eigene Maßnahmen kannst du je Kategorie ergänzen.
      </p>

      {/* Status bar */}
      <div className="flex items-center gap-4 py-3 border-b border-line">
        <div className="flex gap-1.5">
          {KATEGORIEN.map((k) => {
            const done = tomsInKategorie(k).length > 0;
            return (
              <div
                key={k}
                title={TOM_KATEGORIE_LABELS[k].label}
                className={`h-1.5 w-8 transition-colors ${done ? "bg-accent" : "bg-line"}`}
              />
            );
          })}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faded ml-auto">
          {completedCount} / 8 Kategorien · {toms.length} Maßnahme{toms.length !== 1 ? "n" : ""}
        </span>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={() => {
            // Alle 8 Kategorien abdecken — je die erste Maßnahme pro Kategorie
            const KATEGORIEN_REIHENFOLGE: TomKategorie[] = [
              "zutritt", "zugang", "zugriff", "weitergabe",
              "eingabe", "auftrag", "verfuegbarkeit", "trennung",
            ];
            const empfohlen: { kategorie: TomKategorie; beschreibung: string }[] = [];
            for (const kat of KATEGORIEN_REIHENFOLGE) {
              const items = STANDARD_TOMS.filter((s) => s.kategorie === kat).slice(0, 2);
              empfohlen.push(...items);
            }
            update("toms", empfohlen.map((s) => ({
              id: crypto.randomUUID(),
              kategorie: s.kategorie,
              beschreibung: s.beschreibung,
            })));
          }}
          className="px-4 py-2 font-mono text-[11px] uppercase tracking-widest bg-accent text-bg hover:bg-ink transition"
        >
          Standard-Set (16 TOMs)
        </button>
        {confirmClear ? (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">Alle entfernen?</span>
            <button
              type="button"
              onClick={() => { update("toms", []); setConfirmClear(false); }}
              className="px-3 py-2 font-mono text-[11px] uppercase tracking-widest border border-warn text-warn hover:bg-warn hover:text-bg transition"
            >
              Ja
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              className="px-3 py-2 font-mono text-[11px] uppercase tracking-widest border border-line text-ink-dim hover:border-accent transition"
            >
              Nein
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => toms.length > 0 && setConfirmClear(true)}
            disabled={toms.length === 0}
            className="px-4 py-2 font-mono text-[11px] uppercase tracking-widest border border-line text-ink-dim hover:border-accent hover:text-accent transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Alle abwählen
          </button>
        )}
      </div>

      {/* Category sections */}
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
  const isDone = aktive.length > 0;

  return (
    <div
      className={`border transition-colors ${
        isDone ? "border-[rgba(31,61,47,0.35)]" : "border-line"
      } bg-[rgba(240,236,226,0.3)]`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[rgba(240,236,226,0.6)] transition"
      >
        <div className="flex items-center gap-4">
          {/* Done indicator */}
          <span
            className={`flex-shrink-0 inline-flex h-6 w-6 items-center justify-center border transition ${
              isDone
                ? "bg-accent border-accent text-bg"
                : "border-line text-ink-faded"
            }`}
            aria-hidden="true"
          >
            {isDone ? (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <span className="font-mono text-[10px]" />
            )}
          </span>
          <div>
            <div className="font-display font-bold text-[17px]">{meta.label}</div>
            <div className="text-xs text-ink-dim mt-0.5">{meta.beschreibung}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          {isDone && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              {aktive.length} aktiv
            </span>
          )}
          <span className={`font-mono text-[16px] transition ${open ? "rotate-45" : ""} inline-block text-ink-dim`}>
            +
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-line px-5 pb-5 pt-4 flex flex-col gap-2">
          {standards.map((s) => {
            const isActive = aktive.some((a) => a.beschreibung === s.beschreibung);
            return (
              <button
                key={s.beschreibung}
                type="button"
                onClick={() => onToggle(s.beschreibung)}
                className={
                  "w-full text-left px-4 py-3 border transition flex items-start gap-3 " +
                  (isActive
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-bg-soft hover:border-accent")
                }
              >
                <span
                  className={`flex-shrink-0 mt-0.5 inline-flex h-4 w-4 items-center justify-center border transition ${
                    isActive ? "bg-accent border-accent text-bg" : "border-line"
                  }`}
                  aria-hidden="true"
                >
                  {isActive && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span className="text-sm text-ink">{s.beschreibung}</span>
              </button>
            );
          })}

          {/* Custom TOMs */}
          {aktive.filter((a) => a.custom).map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-3 px-4 py-3 bg-accent-soft border border-accent"
            >
              <span
                className="flex-shrink-0 mt-0.5 inline-flex h-4 w-4 items-center justify-center bg-accent border-accent border text-bg"
                aria-hidden="true"
              >
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-sm flex-1 text-ink">{a.beschreibung}</span>
              <button
                type="button"
                onClick={() => onRemove(a.id)}
                className="font-mono text-[10px] uppercase tracking-widest text-ink-faded hover:text-accent transition flex-shrink-0"
              >
                Entfernen
              </button>
            </div>
          ))}

          {/* Add custom */}
          <div className="flex gap-2 mt-2 pt-3 border-t border-line">
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
              className="flex-1 bg-bg-soft border border-line px-3 py-2 text-sm text-ink outline-none focus:border-accent transition"
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
