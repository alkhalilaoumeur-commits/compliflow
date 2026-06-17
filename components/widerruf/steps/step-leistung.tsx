"use client";

import { useWiderrufStore } from "@/lib/widerrufsbelehrung/store";
import { Field, TextInput } from "@/components/avv/field";
import {
  LEISTUNGSTYP_LABELS,
  type Leistungstyp,
} from "@/lib/widerrufsbelehrung/types";

const LEISTUNGSTYP_ORDER: Leistungstyp[] = [
  "ware_einzeln",
  "ware_mehrteilig",
  "ware_abo",
  "dienstleistung",
  "digitaler_inhalt",
  "online_inhalt_streaming",
  "gemischt",
];

const isDigitalTyp = (t: Leistungstyp): boolean =>
  t === "digitaler_inhalt" || t === "online_inhalt_streaming";

const isDienstleistungTyp = (t: Leistungstyp): boolean => t === "dienstleistung";

export function StepLeistung() {
  const data = useWiderrufStore((s) => s.data);
  const patch = useWiderrufStore((s) => s.patch);

  const setTyp = (typ: Leistungstyp) => patch({ leistungstyp: typ });

  const updateBesonder = <K extends keyof typeof data.besonderheiten>(
    key: K,
    value: (typeof data.besonderheiten)[K],
  ) => {
    patch({ besonderheiten: { ...data.besonderheiten, [key]: value } });
  };

  const onFristChange = (raw: string) => {
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) {
      patch({ fristTage: 14 });
      return;
    }
    const clamped = Math.max(14, Math.min(365, n));
    patch({ fristTage: clamped });
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Was verkaufst du? Der Leistungstyp bestimmt, wann die Widerrufsfrist beginnt — bei Ware ab
        Erhalt, bei Dienstleistungen ab Vertragsabschluss.
      </p>

      {/* HIGH FIX #4: Versicherung / Kredit-Warnung */}
      <div className="border border-accent bg-accent-soft p-4 max-w-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-2">
          Achtung — diese Verträge braucht Compliflow nicht
        </p>
        <p className="font-body text-[13px] leading-[1.55] text-ink">
          <strong className="text-ink">Versicherungsverträge</strong> (§ 8 VVG, 14 Tage / Lebensversicherung 30 Tage) und{" "}
          <strong className="text-ink">Verbraucherkredite</strong> (§ 495 BGB) haben eigene Pflicht-Belehrungsformen mit anderen Inhalten (z. B. Effektivzins, Vertragslaufzeit). Compliflow deckt das aktuell nicht ab — nutze dafür eine spezialisierte Vorlage oder einen Anwalt.
        </p>
      </div>

      <Field label="Leistungstyp" required>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LEISTUNGSTYP_ORDER.map((t) => {
            const isActive = data.leistungstyp === t;
            const cfg = LEISTUNGSTYP_LABELS[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTyp(t)}
                className={
                  "px-3 py-3 text-left border transition " +
                  (isActive
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-bg-soft hover:border-accent")
                }
              >
                <div className="font-body text-[14px] leading-[1.6] font-medium text-ink">{cfg.kurz}</div>
                <div className="text-[11px] text-ink-faded mt-0.5 leading-snug">
                  {cfg.lang}
                </div>
              </button>
            );
          })}
        </div>
      </Field>

      <Field
        label="Beschreibung der Leistung (optional)"
        hint="Wird nicht im Pflichttext verwendet, hilft aber Kunden bei der Zuordnung"
      >
        <TextInput
          value={data.leistungBeschreibung ?? ""}
          onChange={(e) => patch({ leistungBeschreibung: e.target.value })}
          placeholder="z.B. Online-Kurse zum Thema Marketing"
        />
      </Field>

      <Field label="Widerrufsfrist (Tage)" required hint="Standard 14 Tage. Kann verlängert, nicht verkürzt werden (min. 14, max. 365).">
        <TextInput
          type="number"
          inputMode="numeric"
          min={14}
          max={365}
          value={String(data.fristTage)}
          onChange={(e) => onFristChange(e.target.value)}
          placeholder="14"
        />
      </Field>

      {/* Conditional Toggles je nach Leistungstyp */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Besonderheiten
        </p>
        <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
          Bei digitalen Inhalten und Dienstleistungen kann das Widerrufsrecht erlöschen, wenn der
          Kunde der sofortigen Ausführung zustimmt.
        </p>

        <div className="flex flex-col gap-3">
          {isDigitalTyp(data.leistungstyp) && (
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={data.besonderheiten.digitalSofortDownload}
                onChange={(e) => updateBesonder("digitalSofortDownload", e.target.checked)}
                className="mt-1 h-4 w-4 accent-accent"
              />
              <div>
                <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                  <strong className="text-ink">Sofortiger Download / sofortige Bereitstellung</strong>{" "}
                  — Kunde stimmt ausdrücklich zu, dass mit der Ausführung VOR Fristablauf begonnen
                  wird
                </span>
                <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                  Erlöschen-Klausel nach § 356 Abs. 5 BGB wird automatisch ergänzt.
                </p>
              </div>
            </label>
          )}

          {isDienstleistungTyp(data.leistungstyp) && (
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={data.besonderheiten.dienstleistungSofort}
                onChange={(e) => updateBesonder("dienstleistungSofort", e.target.checked)}
                className="mt-1 h-4 w-4 accent-accent"
              />
              <div>
                <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                  <strong className="text-ink">Sofortige Erbringung der Dienstleistung</strong> —
                  Kunde stimmt ausdrücklich zu, dass VOR Fristablauf mit der Erbringung begonnen
                  wird
                </span>
                <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                  Erlöschen-Klausel nach § 356 Abs. 4 BGB wird automatisch ergänzt.
                </p>
              </div>
            </label>
          )}

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.besonderheiten.erbringungBegonnen}
              onChange={(e) => updateBesonder("erbringungBegonnen", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <div>
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">Erbringung kann während der Widerrufsfrist beginnen</strong>
                {" "}— Kunde verlangt explizit Beginn vor Fristende
              </span>
              <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                Bei Widerruf muss der Kunde dann anteilig zahlen, was bereits erbracht wurde.
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
