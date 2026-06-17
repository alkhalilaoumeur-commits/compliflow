"use client";

import { useCookieBannerStore } from "@/lib/cookie-banner/store";
import { Field, TextInput } from "@/components/avv/field";
import { SPRACHE_LABELS, type Sprache } from "@/lib/cookie-banner/types";
import { TEXTE_DE, TEXTE_EN } from "@/lib/cookie-banner/defaults";

const SPRACHEN: Sprache[] = ["de", "en"];

export function StepAnbieter() {
  const data = useCookieBannerStore((s) => s.data);
  const patch = useCookieBannerStore((s) => s.patch);

  const updateA = <K extends keyof typeof data.anbieter>(
    key: K,
    value: (typeof data.anbieter)[K],
  ) => {
    patch({ anbieter: { ...data.anbieter, [key]: value } });
  };

  const setSprache = (s: Sprache) => {
    patch({
      sprache: s,
      texte: s === "de" ? TEXTE_DE : TEXTE_EN,
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Wer ist der Betreiber der Webseite und wo finden Besucher die Datenschutzerklärung?
        Diese Angaben werden im Banner als Links verlinkt — Pflicht nach Art. 13 DSGVO.
      </p>

      <div className="border-l-4 border-accent bg-accent-soft p-4">
        <p className="font-body text-[14px] leading-[1.6] text-ink">
          <strong>Die hier eingegebenen URLs werden im Banner als Links</strong> zur
          Datenschutzerklärung und (optional) zum Impressum verwendet. Der Banner zeigt sie
          immer direkt unter dem Beschreibungstext.
        </p>
      </div>

      <Field
        label="Name / Firma"
        required
        hint="Wird intern genutzt — taucht nicht direkt im Banner auf, aber im Snippet als Identifier"
      >
        <TextInput
          value={data.anbieter.name}
          onChange={(e) => updateA("name", e.target.value)}
          placeholder="Mustermann GmbH"
        />
      </Field>

      <Field
        label="URL zur Datenschutzerklärung"
        required
        hint="Relative Pfade (/datenschutz) oder volle URLs (https://…)"
      >
        <TextInput
          value={data.anbieter.datenschutzUrl}
          onChange={(e) => updateA("datenschutzUrl", e.target.value)}
          placeholder="/datenschutz"
        />
      </Field>

      <Field
        label="URL zum Impressum (optional)"
        hint="Wenn leer, wird der Impressum-Link im Banner nicht angezeigt"
      >
        <TextInput
          value={data.anbieter.impressumUrl}
          onChange={(e) => updateA("impressumUrl", e.target.value)}
          placeholder="/impressum"
        />
      </Field>

      <div className="border-t border-line pt-8">
        <Field label="Sprache des Banners" required>
          <div className="flex gap-2">
            {SPRACHEN.map((s) => {
              const isActive = data.sprache === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSprache(s)}
                  className={
                    "px-4 py-2 border transition text-sm " +
                    (isActive
                      ? "border-accent bg-accent-soft text-ink"
                      : "border-line bg-bg-soft hover:border-accent")
                  }
                >
                  {SPRACHE_LABELS[s]}
                </button>
              );
            })}
          </div>
        </Field>
        <p className="text-[11px] text-ink-faded mt-3 leading-relaxed">
          Wechsel der Sprache überschreibt deine eigenen Banner-Texte mit dem
          Standard-Wortlaut. Wenn du die Texte später anpassen willst, mach das am Ende.
        </p>
      </div>
    </div>
  );
}
