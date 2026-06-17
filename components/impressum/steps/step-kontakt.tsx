"use client";

import { useImpressumStore } from "@/lib/impressum/store";
import { Field, TextInput } from "@/components/avv/field";
import { LAND_LABELS, type Land } from "@/lib/impressum/types";

const LAENDER: Land[] = ["DE", "AT", "CH"];

export function StepKontakt() {
  const data = useImpressumStore((s) => s.data);
  const patch = useImpressumStore((s) => s.patch);

  const updateAdresse = (key: keyof typeof data.adresse, value: string) => {
    patch({ adresse: { ...data.adresse, [key]: value } });
  };
  const updateKontakt = (key: keyof typeof data.kontakt, value: string) => {
    patch({ kontakt: { ...data.kontakt, [key]: value } });
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Adresse + schnelle Kontaktmöglichkeit nach § 5 Abs. 1 Nr. 2 DDG. <strong>Wichtig:</strong>{" "}
        Kein Postfach erlaubt — Hausanschrift Pflicht. Mindestens E-Mail + Telefon (oder
        Kontaktformular).
      </p>

      <Field label="Land der Niederlassung" required>
        <div className="flex gap-2">
          {LAENDER.map((l) => {
            const isActive = data.adresse.land === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() => updateAdresse("land", l)}
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

      <Field label="Straße und Hausnummer" required hint="Keine Postfächer (§ 5 DDG)">
        <TextInput
          value={data.adresse.strasse}
          onChange={(e) => updateAdresse("strasse", e.target.value)}
          placeholder="Musterstraße 12"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Postleitzahl" required>
          <TextInput
            value={data.adresse.plz}
            onChange={(e) => updateAdresse("plz", e.target.value)}
            placeholder="70599"
          />
        </Field>
        <Field label="Ort" required className="sm:col-span-2">
          <TextInput
            value={data.adresse.ort}
            onChange={(e) => updateAdresse("ort", e.target.value)}
            placeholder="Stuttgart"
          />
        </Field>
      </div>

      <div className="border-t border-line pt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-4">
          Kontakt
        </p>

        <Field label="E-Mail-Adresse" required>
          <TextInput
            type="email"
            value={data.kontakt.email}
            onChange={(e) => updateKontakt("email", e.target.value)}
            placeholder="kontakt@example.de"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Field
            label="Telefonnummer"
            hint="Pflicht — oder Kontaktformular unten"
          >
            <TextInput
              value={data.kontakt.telefon ?? ""}
              onChange={(e) => updateKontakt("telefon", e.target.value)}
              placeholder="+49 711 1234567"
            />
          </Field>
          <Field label="Fax (optional)">
            <TextInput
              value={data.kontakt.fax ?? ""}
              onChange={(e) => updateKontakt("fax", e.target.value)}
              placeholder="+49 711 1234568"
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field
            label="Kontaktformular-URL"
            hint="Alternativ zur Telefonnummer (eine schnelle Kontaktoption ist Pflicht)"
          >
            <TextInput
              value={data.kontakt.kontaktformular ?? ""}
              onChange={(e) => updateKontakt("kontaktformular", e.target.value)}
              placeholder="https://example.de/kontakt"
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
