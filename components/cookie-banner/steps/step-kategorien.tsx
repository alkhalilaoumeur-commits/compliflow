"use client";

import { useCookieBannerStore } from "@/lib/cookie-banner/store";
import { Field, TextInput, TextArea } from "@/components/avv/field";
import type { KategorieConfig, KategorieId } from "@/lib/cookie-banner/types";

const KATEGORIE_ORDER: KategorieId[] = ["essential", "funktional", "statistik", "marketing"];

export function StepKategorien() {
  const data = useCookieBannerStore((s) => s.data);
  const patch = useCookieBannerStore((s) => s.patch);

  const updateKat = (id: KategorieId, changes: Partial<KategorieConfig>) => {
    const next = data.kategorien.map((k) => (k.id === id ? { ...k, ...changes } : k));
    patch({ kategorien: next });
  };

  const sortedKategorien = KATEGORIE_ORDER
    .map((id) => data.kategorien.find((k) => k.id === id))
    .filter((k): k is KategorieConfig => k !== undefined);

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Welche Cookie-Kategorien bietest du an? Pro aktiver Kategorie kann der Besucher
        eine eigene Entscheidung treffen. Essential ist nach § 25 Abs. 2 TDDDG immer aktiv
        und kann nicht abgelehnt werden.
      </p>

      <div className="border-l-4 border-accent bg-accent-soft p-4">
        <p className="font-body text-[14px] leading-[1.6] text-ink">
          <strong>BGH 2025:</strong> Reject-All muss gleich prominent angeboten werden wie
          Accept-All. Das übernimmt Compliflow automatisch — du musst dich nur um die
          Kategorien kümmern.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {sortedKategorien.map((k) => {
          const isPflicht = k.pflicht;
          const checkboxId = `cat-${k.id}-aktiv`;
          return (
            <div
              key={k.id}
              className={
                "border p-5 transition " +
                (k.aktiv ? "border-accent bg-accent-soft" : "border-line bg-bg-soft")
              }
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-1">
                    {k.id}
                  </div>
                  <div className="text-base font-medium text-ink">
                    {k.name}
                    {isPflicht && (
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-ink-faded">
                        · Pflicht
                      </span>
                    )}
                  </div>
                </div>
                <label
                  htmlFor={checkboxId}
                  className={
                    "flex items-center gap-2 shrink-0 " +
                    (isPflicht ? "cursor-not-allowed" : "cursor-pointer")
                  }
                >
                  <input
                    id={checkboxId}
                    type="checkbox"
                    checked={isPflicht ? true : k.aktiv}
                    disabled={isPflicht}
                    onChange={(e) => updateKat(k.id, { aktiv: e.target.checked })}
                    className="h-4 w-4 accent-accent"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                    {k.aktiv || isPflicht ? "aktiv" : "deaktiviert"}
                  </span>
                </label>
              </div>

              <div className="flex flex-col gap-3">
                <Field label="Anzeige-Name im Banner">
                  <TextInput
                    value={k.name}
                    onChange={(e) => updateKat(k.id, { name: e.target.value })}
                    placeholder={k.name}
                  />
                </Field>

                <Field
                  label="Beschreibung im Banner"
                  hint="Erscheint wenn der Besucher 'Einstellungen' öffnet"
                >
                  <TextArea
                    value={k.beschreibung}
                    onChange={(e) => updateKat(k.id, { beschreibung: e.target.value })}
                    rows={3}
                  />
                </Field>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-ink-faded leading-relaxed">
        Deaktivierte Kategorien werden im Banner nicht angezeigt. Faustregel: Nur Kategorien
        aktivieren, deren Tools du auch tatsächlich einsetzt (siehe nächster Schritt).
      </p>
    </div>
  );
}
