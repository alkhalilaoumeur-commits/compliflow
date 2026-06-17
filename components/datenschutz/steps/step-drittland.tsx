"use client";

import { useDatenschutzStore } from "@/lib/datenschutz/store";
import { deriveDrittlaender } from "@/lib/datenschutz/contract";

export function StepDrittland() {
  const data = useDatenschutzStore((s) => s.data);
  const patch = useDatenschutzStore((s) => s.patch);

  const updateD = <K extends keyof typeof data.drittland>(
    key: K,
    value: (typeof data.drittland)[K],
  ) => {
    patch({ drittland: { ...data.drittland, [key]: value } });
  };

  const derived = deriveDrittlaender(data);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Drittland-Transfer (außerhalb EU/EWR) — wir leiten automatisch aus deinen ausgewählten
        Modulen ab, in welche Länder Daten fließen.
      </p>

      <div className="border border-line bg-bg-soft p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Auto-erkannte Drittländer
        </p>
        {derived.length === 0 ? (
          <p className="font-body text-[14px] leading-[1.6] text-ink-dim">
            Aktuell keine Drittland-Transfers erkannt — alle aktiven Module laufen in der EU/EWR.
            Sehr gut!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {derived.map((l) => (
              <span
                key={l}
                className="inline-flex items-center gap-2 bg-bg border border-accent text-accent px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest"
              >
                {l}
              </span>
            ))}
          </div>
        )}

        {derived.length > 0 && (
          <p className="text-[11px] text-ink-faded mt-3 leading-relaxed">
            Diese Länder wurden aus Hosting, Analytics, Marketing-Tools, KI-Anbietern und
            Versanddienstleistern abgeleitet. Wenn weitere Drittland-Empfänger existieren, lass
            es vom Anwalt prüfen.
          </p>
        )}
      </div>

      <div className="border-t border-line pt-6 flex flex-col gap-3">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.drittland.sccsVorhanden}
            onChange={(e) => updateD("sccsVorhanden", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Standardvertragsklauseln (SCCs)</strong> nach Art. 46
              DSGVO sind mit allen Drittland-Empfängern abgeschlossen
            </span>
            <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
              Empfohlen: vorbelegt aktiv. SCCs sind bei US-Anbietern Standard und in den meisten
              AVVs enthalten.
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.drittland.tiaDurchgefuehrt}
            onChange={(e) => updateD("tiaDurchgefuehrt", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Transfer Impact Assessment (TIA)</strong> wurde
              durchgeführt
            </span>
            <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
              Nach EuGH "Schrems II" empfohlen — Prüfung ob im Drittland ein vergleichbares
              Schutzniveau besteht.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
