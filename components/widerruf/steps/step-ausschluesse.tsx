"use client";

import { useWiderrufStore } from "@/lib/widerrufsbelehrung/store";
import {
  AUSSCHLUSS_LABELS,
  type Ausschlussgrund,
} from "@/lib/widerrufsbelehrung/types";

// CRITICAL FIX #1: Alle 12 § 312g Abs. 2 BGB Nr. 1-12 Ausschlussgründe
// (individuelle_anfertigung war Alias zu massgefertigt — entfernt;
// digital_sofort_download + dienstleistung_sofort sind Erlöschens-Gründe
// nach § 356 Abs. 4/5 BGB und liegen jetzt im `besonderheiten`-Block des Models).
const AUSSCHLUSS_ORDER: Ausschlussgrund[] = [
  "massgefertigt",
  "schnell_verderblich",
  "versiegelt_hygiene",
  "vermischt",
  "alkohol_preisspekulation",
  "presse_zeitung",
  "auktion",
  "datentraeger_entsiegelt",
  "freizeit_termin",
  "dringende_reparatur",
  "personenbefoerderung",
  "edelmetall_marktbindung",
];

export function StepAusschluesse() {
  const data = useWiderrufStore((s) => s.data);
  const patch = useWiderrufStore((s) => s.patch);

  const isSelected = (grund: Ausschlussgrund) => data.ausschluesse.includes(grund);

  const toggle = (grund: Ausschlussgrund) => {
    if (isSelected(grund)) {
      patch({ ausschluesse: data.ausschluesse.filter((g) => g !== grund) });
    } else {
      patch({ ausschluesse: [...data.ausschluesse, grund] });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Bestimmte Waren und Dienstleistungen sind nach <strong>§ 312g Abs. 2 BGB</strong> vom
        Widerrufsrecht ausgeschlossen. Wähle nur die Gründe aus, die für deine konkrete Leistung
        tatsächlich zutreffen — Ausschlüsse, die du nicht nachweisen kannst, sind abmahnbar.
      </p>

      <div className="border-l-4 border-warn bg-bg-soft p-4">
        <p className="font-body text-[14px] leading-[1.6] text-ink">
          <strong className="text-warn">Wichtig:</strong> Diese Ausschlüsse gelten nur, wenn die
          gesetzlichen Voraussetzungen erfüllt sind. Wähle nur was wirklich zutrifft — im Zweifel
          weniger angeben.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {AUSSCHLUSS_ORDER.map((grund) => {
          const selected = isSelected(grund);
          const cfg = AUSSCHLUSS_LABELS[grund];
          return (
            <button
              key={grund}
              type="button"
              onClick={() => toggle(grund)}
              className={
                "px-4 py-3 text-left border transition " +
                (selected
                  ? "border-accent bg-accent-soft"
                  : "border-line bg-bg-soft hover:border-accent")
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-body text-[14px] leading-[1.6] font-medium text-ink">{cfg.titel}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
                      {cfg.paragraph}
                    </span>
                  </div>
                  <p className="text-[12px] text-ink-faded mt-1 leading-snug">
                    {cfg.beschreibung}
                  </p>
                </div>
                {selected && (
                  <span className="font-mono text-[11px] text-accent shrink-0 mt-0.5">✓</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {data.ausschluesse.length > 0 && (
        <div className="border border-line bg-bg p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-2">
            {data.ausschluesse.length} Ausschluss{data.ausschluesse.length === 1 ? "" : "gründe"} aktiv
          </p>
          <p className="text-[12px] text-ink-dim leading-relaxed">
            Diese Ausschlussgründe werden am Ende der Widerrufsbelehrung als Hinweis ergänzt — mit
            Titel, Paragraph und Beschreibung.
          </p>
        </div>
      )}
    </div>
  );
}
