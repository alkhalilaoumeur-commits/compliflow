"use client";

import { useDatenschutzStore } from "@/lib/datenschutz/store";
import { Field, TextInput } from "@/components/avv/field";
import { BEWERBER_MGMT_LABELS, type BewerberMgmtSystem } from "@/lib/datenschutz/types";
import { hasHinschgPflicht } from "@/lib/datenschutz/contract";

const BEWERBER_ORDER: BewerberMgmtSystem[] = [
  "personio",
  "bamboohr",
  "workday",
  "greenhouse",
  "lever",
  "softgarden",
  "selbst_gehostet",
  "andere",
];

export function StepHR() {
  const data = useDatenschutzStore((s) => s.data);
  const patch = useDatenschutzStore((s) => s.patch);

  const updateH = <K extends keyof typeof data.hr>(
    key: K,
    value: (typeof data.hr)[K],
  ) => {
    patch({ hr: { ...data.hr, [key]: value } });
  };

  const hinschgAuto = hasHinschgPflicht(data);

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Beschäftigten-Datenschutz: Bewerbungsformular, Mitarbeiter-Fotos, Background-Checks und
        HinSchG-Meldekanal (Pflicht ab 50 Mitarbeitern).
      </p>

      {/* Bewerbungsformular */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group mb-4">
          <input
            type="checkbox"
            checked={data.hr.bewerbungsformular}
            onChange={(e) => updateH("bewerbungsformular", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Bewerbungsformular</strong> auf der Webseite (Karriere-Seite)
            </span>
          </div>
        </label>

        {data.hr.bewerbungsformular && (
          <div className="border border-line bg-bg-soft p-5 flex flex-col gap-4">
            <Field label="Bewerber-Management-System">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BEWERBER_ORDER.map((b) => {
                  const isActive = data.hr.bewerberMgmt === b;
                  const cfg = BEWERBER_MGMT_LABELS[b];
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => updateH("bewerberMgmt", b)}
                      className={
                        "px-3 py-2.5 text-left border transition " +
                        (isActive
                          ? "border-accent bg-accent-soft"
                          : "border-line bg-bg hover:border-accent")
                      }
                    >
                      <div className="font-body text-[14px] leading-[1.6] font-medium text-ink">{cfg.name}</div>
                      <div className="text-[11px] text-ink-faded mt-0.5">{cfg.anbieter}</div>
                    </button>
                  );
                })}
              </div>
            </Field>

            {data.hr.bewerberMgmt === "andere" && (
              <Field label="Name des Anbieters" required>
                <TextInput
                  value={data.hr.bewerberMgmtCustom ?? ""}
                  onChange={(e) => updateH("bewerberMgmtCustom", e.target.value)}
                  placeholder="z.B. recruitee GmbH"
                />
              </Field>
            )}
          </div>
        )}
      </div>

      {/* Mitarbeiterfotos */}
      <div className="border-t border-line pt-6">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.hr.mitarbeiterfotos}
            onChange={(e) => updateH("mitarbeiterfotos", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Team-Seite mit Mitarbeiter-Fotos</strong> (§ 22 KUG —
              Einwilligung erforderlich)
            </span>
          </div>
        </label>
      </div>

      {/* Background-Check */}
      <div className="border-t border-line pt-6">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.hr.backgroundCheck}
            onChange={(e) => updateH("backgroundCheck", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Background-Check / Pre-Employment-Screening</strong>{" "}
              (erweiterte Bewerber-Recherche)
            </span>
          </div>
        </label>
      </div>

      {/* HinSchG */}
      <div className="border-t border-line pt-6">
        <label className="flex items-start gap-3 cursor-pointer group mb-2">
          <input
            type="checkbox"
            checked={data.hr.hinschgMeldekanal || hinschgAuto}
            onChange={(e) => updateH("hinschgMeldekanal", e.target.checked)}
            disabled={hinschgAuto}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">HinSchG-Meldekanal</strong> (Whistleblower-Hotline nach
              Hinweisgeberschutzgesetz)
            </span>
          </div>
        </label>

        {hinschgAuto && (
          <div className="border-l-4 border-accent bg-accent-soft p-3 ml-7">
            <p className="text-[12px] text-ink leading-relaxed">
              <strong>Automatisch aktiv</strong> — ab 50 Mitarbeitern Pflicht (§ 12 HinSchG).
              Klausel wird im Datenschutz ergänzt.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
