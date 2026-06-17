"use client";

import { useAgbStore } from "@/lib/agb/store";
import { Field, TextInput } from "@/components/avv/field";
import { ZAHLUNG_LABELS, type ZahlungsArt } from "@/lib/agb/types";

const ZAHLUNG_ORDER: ZahlungsArt[] = [
  "vorkasse",
  "rechnung",
  "ueberweisung",
  "lastschrift",
  "stripe",
  "paypal",
  "klarna",
];

export function StepZahlung() {
  const data = useAgbStore((s) => s.data);
  const patch = useAgbStore((s) => s.patch);

  const updateZ = <K extends keyof typeof data.zahlung>(
    key: K,
    value: (typeof data.zahlung)[K],
  ) => {
    patch({ zahlung: { ...data.zahlung, [key]: value } });
  };

  const isSelected = (art: ZahlungsArt) => data.zahlung.arten.includes(art);

  const toggle = (art: ZahlungsArt) => {
    if (isSelected(art)) {
      updateZ("arten", data.zahlung.arten.filter((a) => a !== art));
    } else {
      updateZ("arten", [...data.zahlung.arten, art]);
    }
  };

  const parseInt0 = (raw: string): number => {
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) return 0;
    return Math.max(0, n);
  };

  const onZahlungszielChange = (raw: string) => {
    updateZ("zahlungszielTage", Math.min(parseInt0(raw), 365));
  };

  const onSkontoProzentChange = (raw: string) => {
    const n = parseInt0(raw);
    const clamped = Math.min(n, 10);
    updateZ("skontoProzent", clamped === 0 ? undefined : clamped);
  };

  const onSkontoTageChange = (raw: string) => {
    const n = parseInt0(raw);
    const clamped = Math.min(n, 30);
    updateZ("skontoTage", clamped === 0 ? undefined : clamped);
  };

  const isB2B = data.variante === "b2b";

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Welche Zahlungsarten akzeptierst du und mit welchen Bedingungen? Mindestens eine
        Zahlungsart muss aktiv sein.
      </p>

      <Field label="Zahlungsarten" required hint="Mehrfachauswahl möglich">
        <div className="flex flex-col gap-2">
          {ZAHLUNG_ORDER.map((art) => {
            const selected = isSelected(art);
            return (
              <button
                key={art}
                type="button"
                onClick={() => toggle(art)}
                className={
                  "px-4 py-3 text-left border transition " +
                  (selected
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-bg-soft hover:border-accent")
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-body text-[14px] leading-[1.6] font-medium text-ink">
                    {ZAHLUNG_LABELS[art]}
                  </span>
                  {selected && (
                    <span className="font-mono text-[11px] text-accent shrink-0">✓</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Field>

      <Field
        label="Zahlungsziel (Tage)"
        required
        hint="B2B typisch 14 Tage, B2C oft 7 oder sofort"
      >
        <TextInput
          type="number"
          inputMode="numeric"
          min={0}
          max={365}
          value={String(data.zahlung.zahlungszielTage)}
          onChange={(e) => onZahlungszielChange(e.target.value)}
          placeholder="14"
        />
      </Field>

      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Verzug & Inkasso
        </p>

        <div className="flex flex-col gap-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.zahlung.verzugszinsen}
              onChange={(e) => updateZ("verzugszinsen", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <div>
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">Verzugszinsen-Klausel</strong>
              </span>
              <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                Standard nach § 288 BGB — B2C 5%-Punkte, B2B 9%-Punkte über Basiszinssatz +
                40 EUR Mahnpauschale.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.zahlung.inkassoKlausel}
              onChange={(e) => updateZ("inkassoKlausel", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <div>
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">Inkasso-Hinweis</strong>
              </span>
              <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                Hinweis, dass bei anhaltendem Verzug ein Inkassobüro eingeschaltet werden kann.
              </p>
            </div>
          </label>
        </div>
      </div>

      {isB2B && (
        <div className="border-t border-line pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
            Skonto (nur B2B)
          </p>
          <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
            Skonto nur bei B2B üblich. Beide Felder leer (0) = keine Skonto-Klausel.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Skonto-Prozent (0-10)"
              hint="Üblich: 2-3%"
            >
              <TextInput
                type="number"
                inputMode="numeric"
                min={0}
                max={10}
                value={String(data.zahlung.skontoProzent ?? "")}
                onChange={(e) => onSkontoProzentChange(e.target.value)}
                placeholder="2"
              />
            </Field>
            <Field
              label="Skonto-Tage (0-30)"
              hint="Üblich: 7-14 Tage"
            >
              <TextInput
                type="number"
                inputMode="numeric"
                min={0}
                max={30}
                value={String(data.zahlung.skontoTage ?? "")}
                onChange={(e) => onSkontoTageChange(e.target.value)}
                placeholder="14"
              />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}
