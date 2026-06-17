"use client";

import { useAgbStore } from "@/lib/agb/store";
import { VARIANTE_LABELS, type AgbVariante } from "@/lib/agb/types";

const VARIANTE_ORDER: AgbVariante[] = [
  "b2c_dienstleistung",
  "b2c_shop",
  "b2b",
];

export function StepVariante() {
  const data = useAgbStore((s) => s.data);
  const patch = useAgbStore((s) => s.patch);

  const setVariante = (v: AgbVariante) => patch({ variante: v });

  const showSpracheToggle =
    data.variante === "b2c_shop" || data.variante === "b2b";

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Für welches Geschäftsmodell sind diese AGB? Die Wahl bestimmt, welche Klauseln (Geltungsbereich,
        Vertragsschluss, Gewährleistung, Haftung) automatisch generiert werden — denn B2C- und
        B2B-Verträge unterliegen unterschiedlichen Regeln (§§ 305-310 BGB).
      </p>

      <div className="border-l-4 border-accent bg-accent-soft p-4">
        <p className="font-body text-[14px] leading-[1.6] text-ink">
          <strong>Diese Auswahl bestimmt, welche Klauseln in deiner AGB landen</strong> — sie kann
          später nicht ohne Umstellung der gesamten Struktur geändert werden.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {VARIANTE_ORDER.map((v) => {
          const isActive = data.variante === v;
          const cfg = VARIANTE_LABELS[v];
          return (
            <button
              key={v}
              type="button"
              onClick={() => setVariante(v)}
              className={
                "px-4 py-4 text-left border transition " +
                (isActive
                  ? "border-accent bg-accent-soft"
                  : "border-line bg-bg-soft hover:border-accent")
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-base font-medium text-ink">{cfg.name}</div>
                  <p className="text-[12px] text-ink-faded mt-1 leading-snug">
                    {cfg.beschreibung}
                  </p>
                </div>
                {isActive && (
                  <span className="font-mono text-[11px] text-accent shrink-0 mt-0.5">✓</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showSpracheToggle && (
        <div className="border-t border-line pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
            Vertragssprache
          </p>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.vertragsspracheDe}
              onChange={(e) => patch({ vertragsspracheDe: e.target.checked })}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <div>
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">Vertragssprache Deutsch</strong>
              </span>
              <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                Standard: Deutsch. Deaktiviere nur, wenn du primär in englischer Sprache
                Verträge abschließt.
              </p>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
