"use client";

import { useState } from "react";
import { useVvtStore } from "@/lib/vvt/store";
import type { Verarbeitungstaetigkeit } from "@/lib/vvt/types";
import { VVT_TEMPLATES, createActivityFromTemplate, createBlankActivity } from "@/lib/vvt/templates";
import { ActivityForm } from "../activity-form";
import { cn } from "@/lib/utils";

type Mode = "list" | "add-choose" | "edit";

export function StepTaetigkeiten() {
  const taetigkeiten = useVvtStore((s) => s.data.taetigkeiten);
  const addTaetigkeit = useVvtStore((s) => s.addTaetigkeit);
  const updateTaetigkeit = useVvtStore((s) => s.updateTaetigkeit);
  const removeTaetigkeit = useVvtStore((s) => s.removeTaetigkeit);

  const [mode, setMode] = useState<Mode>("list");
  const [editId, setEditId] = useState<string | null>(null);
  const [draftActivity, setDraftActivity] = useState<Verarbeitungstaetigkeit | null>(null);

  const startAddFromTemplate = (templateId: string) => {
    const activity = createActivityFromTemplate(templateId);
    setDraftActivity(activity);
    setMode("edit");
    setEditId(null);
  };

  const startAddBlank = () => {
    setDraftActivity(createBlankActivity());
    setMode("edit");
    setEditId(null);
  };

  const startEdit = (id: string) => {
    const t = taetigkeiten.find((t) => t.id === id);
    if (!t) return;
    setDraftActivity({ ...t });
    setEditId(id);
    setMode("edit");
  };

  const saveDraft = () => {
    if (!draftActivity) return;
    if (editId) {
      updateTaetigkeit(editId, draftActivity);
    } else {
      addTaetigkeit(draftActivity);
    }
    setMode("list");
    setDraftActivity(null);
    setEditId(null);
  };

  const cancelEdit = () => {
    setMode("list");
    setDraftActivity(null);
    setEditId(null);
  };

  const isDraftValid =
    draftActivity &&
    draftActivity.bezeichnung.trim().length >= 2 &&
    draftActivity.zweck.trim().length >= 10 &&
    draftActivity.rechtsgrundlagen.length >= 1 &&
    draftActivity.betroffenengruppen.length >= 1 &&
    draftActivity.datenkategorien.length >= 1 &&
    draftActivity.loeschfristen.trim().length >= 5;

  // ─── List view ────────────────────────────────────────────────────────
  if (mode === "list") {
    return (
      <div className="flex flex-col gap-6">
        {taetigkeiten.length === 0 ? (
          <EmptyState onAddTemplate={() => setMode("add-choose")} onAddBlank={startAddBlank} startAddFromTemplate={startAddFromTemplate} />
        ) : (
          <>
            {/* List */}
            <div className="flex flex-col gap-3">
              {taetigkeiten.map((t, idx) => (
                <TaetigkeitCard
                  key={t.id}
                  index={idx}
                  value={t}
                  onEdit={() => startEdit(t.id)}
                  onRemove={() => {
                    if (confirm(`"${t.bezeichnung}" wirklich löschen?`)) {
                      removeTaetigkeit(t.id);
                    }
                  }}
                />
              ))}
            </div>

            {/* Add more */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMode("add-choose")}
                className="flex items-center gap-2 border border-dashed border-line px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-ink-dim hover:border-accent hover:text-accent transition"
              >
                + Aus Vorlage hinzufügen
              </button>
              <button
                type="button"
                onClick={startAddBlank}
                className="flex items-center gap-2 border border-dashed border-line px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-ink-dim hover:border-accent hover:text-accent transition"
              >
                + Leer hinzufügen
              </button>
            </div>

            <div className="border border-[rgba(226,221,209,0.6)] bg-accent-soft p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1.5">
                Vollständigkeit
              </p>
              <p className="text-sm text-ink-dim">
                {taetigkeiten.length} Tätigkeit{taetigkeiten.length !== 1 ? "en" : ""} erfasst.
                Typisches KMU-VVT hat 5–12 Tätigkeiten. Alle müssen regelmäßig (mind. jährlich)
                überprüft werden (Art. 30 DSGVO).
              </p>
            </div>
          </>
        )}
      </div>
    );
  }

  // ─── Choose template view ──────────────────────────────────────────────
  if (mode === "add-choose") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2
            className="font-display font-bold text-2xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Vorlage wählen
          </h2>
          <button
            type="button"
            onClick={cancelEdit}
            className="font-mono text-[11px] uppercase tracking-widest text-ink-dim hover:text-accent transition"
          >
            ← Zurück
          </button>
        </div>
        <p className="text-sm text-ink-dim">
          Wähle eine Vorlage als Startpunkt — alle Felder kannst du danach anpassen.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {VVT_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => startAddFromTemplate(tmpl.id)}
              className="border border-line p-4 text-left hover:border-accent transition group"
            >
              <div className="font-display font-semibold text-[16px] group-hover:text-accent transition" style={{ letterSpacing: "-0.01em" }}>
                {tmpl.bezeichnung}
              </div>
              <div className="mt-1.5 text-sm text-ink-dim line-clamp-2">
                {tmpl.activity.zweck}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-faded">
                {tmpl.activity.rechtsgrundlagen.map((rg) => {
                  const label = {
                    "art6-1a": "Einwilligung",
                    "art6-1b": "Vertrag",
                    "art6-1c": "Recht. Verpfl.",
                    "art6-1f": "Ber. Interesse",
                    "art88": "§ 26 BDSG",
                  }[rg as string] ?? rg;
                  return label;
                }).join(" · ")}
              </div>
            </button>
          ))}
          <button
            type="button"
            onClick={startAddBlank}
            className="border border-dashed border-line p-4 text-left hover:border-accent transition group"
          >
            <div className="font-display font-semibold text-[16px] text-ink-dim group-hover:text-accent transition" style={{ letterSpacing: "-0.01em" }}>
              + Leer beginnen
            </div>
            <div className="mt-1.5 text-sm text-ink-faded">
              Alle Felder selbst ausfüllen
            </div>
          </button>
        </div>
      </div>
    );
  }

  // ─── Edit / Add view ──────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8">
      {/* Edit header */}
      <div className="flex items-start justify-between">
        <div>
          <h2
            className="font-display font-bold text-2xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            {editId ? "Tätigkeit bearbeiten" : "Neue Tätigkeit"}
          </h2>
          <p className="mt-1 text-sm text-ink-dim">
            {editId
              ? `Änderungen an: "${taetigkeiten.find((t) => t.id === editId)?.bezeichnung}"`
              : "Alle Pflichtfelder ausfüllen, dann speichern."}
          </p>
        </div>
        <button
          type="button"
          onClick={cancelEdit}
          className="font-mono text-[11px] uppercase tracking-widest text-ink-dim hover:text-accent transition"
        >
          × Abbrechen
        </button>
      </div>

      {/* Form */}
      {draftActivity && (
        <ActivityForm
          value={draftActivity}
          onChange={(partial) =>
            setDraftActivity((prev) => (prev ? { ...prev, ...partial } : prev))
          }
        />
      )}

      {/* Save button */}
      <div className="sticky bottom-16 z-10">
        <div className="bg-[rgba(246,242,234,0.97)] backdrop-blur border-t border-line p-4 -mx-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="text-sm text-ink-dim">
              {!isDraftValid && (
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faded">
                  Bezeichnung, Zweck, Rechtsgrundlage, Betroffene, Datenkategorien +
                  Löschfristen fehlen noch
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelEdit}
                className="border border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-ink-dim hover:border-accent hover:text-accent transition"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={saveDraft}
                disabled={!isDraftValid}
                className={cn(
                  "px-6 py-2.5 font-mono text-[11px] uppercase tracking-widest transition",
                  isDraftValid
                    ? "bg-accent text-bg hover:bg-ink"
                    : "bg-bg-soft text-ink-faded border border-line cursor-not-allowed"
                )}
              >
                {editId ? "Änderungen speichern" : "Tätigkeit hinzufügen"} ✓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaetigkeitCard({
  index,
  value,
  onEdit,
  onRemove,
}: {
  index: number;
  value: Verarbeitungstaetigkeit;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="border border-line bg-[rgba(240,236,226,0.4)] p-5 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3
              className="font-display font-semibold text-lg truncate"
              style={{ letterSpacing: "-0.01em" }}
            >
              {value.bezeichnung || "(Ohne Bezeichnung)"}
            </h3>
            {value.besondereKategorien && (
              <span className="flex-shrink-0 font-mono text-[9px] uppercase tracking-widest border border-accent text-accent px-1.5 py-0.5">
                Art.&nbsp;9
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-ink-dim line-clamp-1">{value.zweck}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {value.rechtsgrundlagen.slice(0, 3).map((rg) => (
              <span
                key={rg}
                className="font-mono text-[10px] uppercase tracking-widest border border-line px-2 py-0.5 text-ink-faded"
              >
                {RG_SHORT[rg as keyof typeof RG_SHORT] ?? rg}
              </span>
            ))}
            <span className="font-mono text-[10px] uppercase tracking-widest border border-line px-2 py-0.5 text-ink-faded">
              {value.datenkategorien.length} Datenkategorien
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest border border-line px-2 py-0.5 text-ink-faded">
              {value.empfaenger.length} Empfänger
            </span>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-dim hover:border-accent hover:text-accent transition"
          >
            Bearbeiten
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-dim hover:border-accent hover:text-accent transition"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

const RG_SHORT: Record<string, string> = {
  "art6-1a": "Einwilligung",
  "art6-1b": "Vertrag",
  "art6-1c": "Recht. Verpfl.",
  "art6-1d": "Vitale Int.",
  "art6-1e": "Öff. Interesse",
  "art6-1f": "Ber. Interesse",
  "art9-2a": "Art.9 Einwill.",
  "art9-2b": "Art.9 Beschäft.",
  "art9-2c": "Art.9 Vital",
  "art9-2h": "Art.9 Gesundh.",
  "art88": "§ 26 BDSG",
};

function EmptyState({
  onAddTemplate,
  onAddBlank,
  startAddFromTemplate,
}: {
  onAddTemplate: () => void;
  onAddBlank: () => void;
  startAddFromTemplate: (id: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-8 py-12 text-center">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded mb-2">
          Noch keine Tätigkeiten
        </p>
        <h2
          className="font-display font-bold text-[28px] leading-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Erste Verarbeitungstätigkeit hinzufügen
        </h2>
        <p className="mt-3 max-w-md mx-auto text-base text-ink-dim">
          Starte mit einer Vorlage (empfohlen) oder füge eine eigene Tätigkeit hinzu.
          Typisches KMU: 5–12 Tätigkeiten.
        </p>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          type="button"
          onClick={onAddTemplate}
          className="btn-primary inline-flex h-11 items-center px-6 font-mono text-[12px] uppercase tracking-widest gap-2"
        >
          Aus Vorlage starten
        </button>
        <button
          type="button"
          onClick={onAddBlank}
          className="btn-ghost inline-flex h-11 items-center px-6 font-mono text-[12px] uppercase tracking-widest"
        >
          Leer hinzufügen
        </button>
      </div>

      {/* Quick templates */}
      <div className="w-full max-w-2xl">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded mb-3">
          Schnell starten — häufige Tätigkeiten
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {["kundenverwaltung", "buchhaltung", "newsletter", "website-betrieb", "mitarbeiterverwaltung"].map(
            (id) => {
              const tmpl = VVT_TEMPLATES.find((t) => t.id === id);
              if (!tmpl) return null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => startAddFromTemplate(id)}
                  className="border border-line px-4 py-2 text-sm text-ink-dim hover:border-accent hover:text-ink transition"
                >
                  + {tmpl.bezeichnung}
                </button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
