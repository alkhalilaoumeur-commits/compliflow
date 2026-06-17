"use client";

import { useWiderrufStore } from "@/lib/widerrufsbelehrung/store";
import { Field, TextInput } from "@/components/avv/field";
import type { Land } from "@/lib/impressum/types";
import { LAND_LABELS } from "@/lib/impressum/types";

const LAENDER: Land[] = ["DE", "AT", "CH"];

export function StepAnbieter() {
  const data = useWiderrufStore((s) => s.data);
  const patch = useWiderrufStore((s) => s.patch);

  const updateA = (key: keyof typeof data.anbieter, value: string) => {
    patch({ anbieter: { ...data.anbieter, [key]: value } });
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Wer ist der Unternehmer/Anbieter? Das ist die Person oder das Unternehmen, das die Ware
        verkauft bzw. die Dienstleistung erbringt — Adresse und E-Mail werden später in der
        Widerrufsbelehrung als Empfänger des Widerrufs ausgewiesen.
      </p>

      <Field label="Name / Firma" required hint="Bei Einzelunternehmen: dein voller Name, bei GmbH: Firmenname">
        <TextInput
          value={data.anbieter.name}
          onChange={(e) => updateA("name", e.target.value)}
          placeholder="Mustermann GmbH"
        />
      </Field>

      <Field label="Straße und Hausnummer" required>
        <TextInput
          value={data.anbieter.strasse}
          onChange={(e) => updateA("strasse", e.target.value)}
          placeholder="Musterstraße 12"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="PLZ" required>
          <TextInput
            value={data.anbieter.plz}
            onChange={(e) => updateA("plz", e.target.value)}
            placeholder="70599"
          />
        </Field>
        <Field label="Ort" required className="sm:col-span-2">
          <TextInput
            value={data.anbieter.ort}
            onChange={(e) => updateA("ort", e.target.value)}
            placeholder="Stuttgart"
          />
        </Field>
      </div>

      <Field label="Land" required>
        <div className="flex gap-2">
          {LAENDER.map((l) => {
            const isActive = data.anbieter.land === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() =>
                  patch({ anbieter: { ...data.anbieter, land: l } })
                }
                className={
                  "px-4 py-2 border transition text-sm " +
                  (isActive
                    ? "border-accent bg-accent-soft text-ink"
                    : "border-line bg-bg-soft hover:border-accent")
                }
              >
                {LAND_LABELS[l]}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="E-Mail-Adresse" required hint="An diese Adresse wird der Widerruf geschickt">
          <TextInput
            type="email"
            value={data.anbieter.email}
            onChange={(e) => updateA("email", e.target.value)}
            placeholder="widerruf@example.de"
          />
        </Field>
        <Field
          label="Telefon (empfohlen)"
          hint="BGH 2020 (I ZR 169/19): Wenn im Impressum vorhanden, muss die Nummer auch in der Widerrufsbelehrung stehen — Compliflow ergänzt sie automatisch."
        >
          <TextInput
            value={data.anbieter.telefon ?? ""}
            onChange={(e) => updateA("telefon", e.target.value)}
            placeholder="+49 711 1234567"
          />
        </Field>
      </div>

      <Field label="Fax (optional)" hint="Wird nur im Muster-Widerrufsformular angezeigt">
        <TextInput
          value={data.anbieter.fax ?? ""}
          onChange={(e) => updateA("fax", e.target.value)}
          placeholder="+49 711 1234568"
        />
      </Field>

      {/* B2C-Toggle */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Vertragspartner
        </p>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.istB2C}
            onChange={(e) => patch({ istB2C: e.target.checked })}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Verkauf an Verbraucher (B2C)</strong> — Kunden sind
              Verbraucher im Sinne des § 13 BGB
            </span>
            <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
              Pflicht für Widerrufsrecht. Bei reinem B2B-Verkauf besteht KEIN gesetzliches
              Widerrufsrecht.
            </p>
          </div>
        </label>

        {!data.istB2C && (
          <div className="border-l-4 border-warn bg-bg-soft p-4 mt-4">
            <p className="font-body text-[14px] leading-[1.6] text-ink">
              <strong className="text-warn">Kein Widerrufsrecht</strong> — der Käufer ist
              Unternehmer (§ 14 BGB). Die generierte Belehrung weist explizit darauf hin, dass kein
              gesetzliches Widerrufsrecht nach §§ 312g, 355 BGB besteht.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
