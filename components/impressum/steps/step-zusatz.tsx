"use client";

import { useImpressumStore } from "@/lib/impressum/store";
import { Field, TextInput } from "@/components/avv/field";
import type { VsbgTeilnahme } from "@/lib/impressum/types";

const VSBG_OPTIONS: { value: VsbgTeilnahme; label: string; desc: string }[] = [
  { value: "nein", label: "Nicht teilnahmebereit", desc: "Standard für die meisten Selbstständigen" },
  { value: "freiwillig", label: "Freiwillig", desc: "Ich biete Schlichtung freiwillig an" },
  { value: "verpflichtet", label: "Gesetzlich verpflichtet", desc: "Bestimmte Branchen sind gesetzlich verpflichtet" },
];

export function StepZusatz() {
  const data = useImpressumStore((s) => s.data);
  const patch = useImpressumStore((s) => s.patch);

  const updateRedaktion = <K extends keyof typeof data.redaktion>(
    key: K,
    value: (typeof data.redaktion)[K],
  ) => {
    patch({ redaktion: { ...data.redaktion, [key]: value } });
  };

  const updateVerantwortlicher = (
    key: keyof NonNullable<typeof data.redaktion.verantwortlicher>,
    value: string,
  ) => {
    const v = data.redaktion.verantwortlicher ?? {
      vorname: "",
      nachname: "",
      strasse: "",
      plz: "",
      ort: "",
    };
    patch({
      redaktion: {
        ...data.redaktion,
        verantwortlicher: { ...v, [key]: value },
      },
    });
  };

  const updateVsbg = <K extends keyof typeof data.vsbg>(
    key: K,
    value: (typeof data.vsbg)[K],
  ) => {
    patch({ vsbg: { ...data.vsbg, [key]: value } });
  };

  const updateHaftung = <K extends keyof typeof data.haftung>(
    key: K,
    value: (typeof data.haftung)[K],
  ) => {
    patch({ haftung: { ...data.haftung, [key]: value } });
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* § 18 MStV */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group mb-4">
          <input
            type="checkbox"
            checked={data.redaktion.aktiv}
            onChange={(e) => updateRedaktion("aktiv", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
              § 18 MStV — Blog, News oder redaktionelle Inhalte
            </span>
            <span className="block font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition mt-1">
              Veröffentliche ich journalistisch-redaktionelle Inhalte (Blog, Newsletter,
              regelmäßige Artikel zu aktuellen Themen)? → Inhaltlich Verantwortlicher mit
              vollem Namen + Adresse pflichtig.
            </span>
          </div>
        </label>

        {data.redaktion.aktiv && (
          <div className="border border-line bg-bg-soft p-5 flex flex-col gap-4">
            <p className="font-body text-[14px] leading-[1.6] text-ink-dim">
              Inhaltlich Verantwortlicher i.S.d. § 18 Abs. 2 MStV — meistens dieselbe Person
              wie der Anbieter, kann aber auch jemand anderes sein.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Vorname" required>
                <TextInput
                  value={data.redaktion.verantwortlicher?.vorname ?? ""}
                  onChange={(e) => updateVerantwortlicher("vorname", e.target.value)}
                  placeholder="Max"
                />
              </Field>
              <Field label="Nachname" required>
                <TextInput
                  value={data.redaktion.verantwortlicher?.nachname ?? ""}
                  onChange={(e) => updateVerantwortlicher("nachname", e.target.value)}
                  placeholder="Mustermann"
                />
              </Field>
            </div>

            <Field label="Straße + Hausnummer" required>
              <TextInput
                value={data.redaktion.verantwortlicher?.strasse ?? ""}
                onChange={(e) => updateVerantwortlicher("strasse", e.target.value)}
                placeholder="Musterstraße 12"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="PLZ" required>
                <TextInput
                  value={data.redaktion.verantwortlicher?.plz ?? ""}
                  onChange={(e) => updateVerantwortlicher("plz", e.target.value)}
                  placeholder="70599"
                />
              </Field>
              <Field label="Ort" required className="sm:col-span-2">
                <TextInput
                  value={data.redaktion.verantwortlicher?.ort ?? ""}
                  onChange={(e) => updateVerantwortlicher("ort", e.target.value)}
                  placeholder="Stuttgart"
                />
              </Field>
            </div>
          </div>
        )}
      </div>

      {/* VSBG */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Verbraucherstreitbeilegung (VSBG)
        </p>
        <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
          Verkaufst du an Verbraucher (B2C)? Dann musst du Stellung zur
          Verbraucherschlichtung nehmen und auf die OS-Plattform der EU verlinken.
        </p>

        <label className="flex items-start gap-3 cursor-pointer group mb-4">
          <input
            type="checkbox"
            checked={data.vsbg.istB2c}
            onChange={(e) => updateVsbg("istB2c", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
            Ich verkaufe Produkte oder Dienstleistungen an Verbraucher (B2C). OS-Plattform-Hinweis
            wird automatisch ergänzt.
          </span>
        </label>

        <Field label="Teilnahme an Streitbeilegung" required>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {VSBG_OPTIONS.map((opt) => {
              const isActive = data.vsbg.teilnahme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateVsbg("teilnahme", opt.value)}
                  className={
                    "px-3 py-3 text-left border transition " +
                    (isActive
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-bg-soft hover:border-accent")
                  }
                >
                  <div className="font-body text-[14px] leading-[1.6] font-medium text-ink">{opt.label}</div>
                  <div className="text-[11px] text-ink-faded mt-0.5">{opt.desc}</div>
                </button>
              );
            })}
          </div>
        </Field>
      </div>

      {/* Haftungsklauseln */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Haftungsklauseln (Standard-Disclaimer)
        </p>
        <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
          Übliche Haftungsbegrenzungen für Webseiten. Nicht zwingend pflichtig, aber sehr
          empfohlen. Du kannst sie einzeln deaktivieren.
        </p>

        <div className="flex flex-col gap-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.haftung.haftungInhalte}
              onChange={(e) => updateHaftung("haftungInhalte", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Haftung für Inhalte</strong> (§ 7 Abs. 1 DDG) — Standardklausel
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.haftung.haftungLinks}
              onChange={(e) => updateHaftung("haftungLinks", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Haftung für externe Links</strong> — Standardklausel
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.haftung.urheberrecht}
              onChange={(e) => updateHaftung("urheberrecht", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Urheberrecht</strong> — Standardklausel für eigene Inhalte
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
