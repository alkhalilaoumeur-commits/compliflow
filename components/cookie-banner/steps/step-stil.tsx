"use client";

import { useCookieBannerStore } from "@/lib/cookie-banner/store";
import { Field, TextInput } from "@/components/avv/field";
import { STIL_LABELS, type BannerStil, type Farbschema } from "@/lib/cookie-banner/types";
import { INITIAL_COOKIE_BANNER } from "@/lib/cookie-banner/defaults";

const STIL_ORDER: BannerStil[] = ["bottom_bar", "modal", "sidebar_left", "sidebar_right"];

const FARB_FELDER: Array<{ key: keyof Farbschema; label: string; hint: string }> = [
  { key: "primaer", label: "Accept-Button (Primär)", hint: "Hintergrund des Hauptbuttons" },
  { key: "primaerText", label: "Accept-Button Text", hint: "Schriftfarbe auf dem Accept-Button" },
  { key: "sekundaer", label: "Reject-Button (Sekundär)", hint: "Hintergrund des Ablehnen-Buttons" },
  { key: "sekundaerText", label: "Reject-Button Text", hint: "Schriftfarbe auf dem Reject-Button" },
  { key: "hintergrund", label: "Banner-Hintergrund", hint: "Hintergrundfarbe des Banners" },
  { key: "text", label: "Text", hint: "Hauptschriftfarbe im Banner" },
  { key: "link", label: "Link", hint: "Datenschutz / Impressum Link-Farbe" },
  { key: "rand", label: "Rand", hint: "Border-Farbe um Banner und Trennlinien" },
];

export function StepStil() {
  const data = useCookieBannerStore((s) => s.data);
  const patch = useCookieBannerStore((s) => s.patch);
  const update = useCookieBannerStore((s) => s.update);

  const updateFarbe = <K extends keyof Farbschema>(key: K, value: Farbschema[K]) => {
    patch({ farben: { ...data.farben, [key]: value } });
  };

  const resetFarben = () => {
    update("farben", INITIAL_COOKIE_BANNER.farben);
  };

  const parseFloat0 = (raw: string, fallback: number): number => {
    const n = parseFloat(raw);
    if (Number.isNaN(n)) return fallback;
    return n;
  };

  const parseInt0 = (raw: string): number => {
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) return 0;
    return Math.max(0, n);
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Wo und wie soll der Banner erscheinen? Stil, Farben und Form lassen sich frei einstellen.
        Mobil-freundlich sind alle Varianten — modal wirkt aber am intensivsten und ist auf
        kleineren Bildschirmen oft störend.
      </p>

      {/* Stil-Auswahl */}
      <Field label="Layout / Position" required>
        <div className="flex flex-col gap-2">
          {STIL_ORDER.map((s) => {
            const isActive = data.stil === s;
            const cfg = STIL_LABELS[s];
            return (
              <button
                key={s}
                type="button"
                onClick={() => update("stil", s)}
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
      </Field>

      {/* Farbschema */}
      <div className="border-t border-line pt-8">
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            Farbschema
          </p>
          <button
            type="button"
            onClick={resetFarben}
            className="font-mono text-[10px] uppercase tracking-widest text-ink-faded hover:text-accent transition"
          >
            ↻ DRVN-Default-Farben
          </button>
        </div>
        <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
          Stelle die Farben passend zu deiner Brand ein. Tipp: Reject-Button etwas dezenter
          halten — ist aber Pflicht-prominent (BGH 2025), nicht versteckt.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FARB_FELDER.map((feld) => (
            <Field key={feld.key} label={feld.label} hint={feld.hint}>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.farben[feld.key]}
                  onChange={(e) => updateFarbe(feld.key, e.target.value)}
                  className="h-12 w-16 border border-line bg-bg-soft cursor-pointer p-1"
                  aria-label={`${feld.label} wählen`}
                />
                <TextInput
                  value={data.farben[feld.key]}
                  onChange={(e) => updateFarbe(feld.key, e.target.value)}
                  className="flex-1 font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
            </Field>
          ))}
        </div>
      </div>

      {/* Form / Typo */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Form & Typografie
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Rundung (px)"
            hint="border-radius des Banners und der Buttons — 0 = scharfe Ecken, 24 = sehr rund"
          >
            <TextInput
              type="number"
              inputMode="numeric"
              min={0}
              max={24}
              value={String(data.abgerundetPx)}
              onChange={(e) =>
                update("abgerundetPx", Math.min(parseInt0(e.target.value), 24))
              }
              placeholder="8"
            />
          </Field>

          <Field
            label="Schriftgröße (rem)"
            hint="0.7 = klein, 0.875 = Standard, 1.2 = sehr groß"
          >
            <TextInput
              type="number"
              inputMode="decimal"
              min={0.7}
              max={1.2}
              step={0.05}
              value={String(data.schriftgroesseRem)}
              onChange={(e) =>
                update("schriftgroesseRem", Math.max(0.7, Math.min(1.2, parseFloat0(e.target.value, 0.875))))
              }
              placeholder="0.875"
            />
          </Field>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group mt-6">
          <input
            type="checkbox"
            checked={data.schatten}
            onChange={(e) => update("schatten", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Schatten unter dem Banner</strong>
            </span>
            <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
              Hebt den Banner stärker vom Hintergrund ab. Empfohlen bei hellen Webseiten.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
