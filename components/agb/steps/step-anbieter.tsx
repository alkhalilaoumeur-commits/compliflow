"use client";

import { useAgbStore } from "@/lib/agb/store";
import { Field, TextInput } from "@/components/avv/field";
import type { Land } from "@/lib/impressum/types";
import { LAND_LABELS } from "@/lib/impressum/types";

const LAENDER: Land[] = ["DE", "AT", "CH"];

const REGISTER_ARTEN = ["HRB", "HRA", "VR"] as const;
type RegisterArt = (typeof REGISTER_ARTEN)[number];

export function StepAnbieter() {
  const data = useAgbStore((s) => s.data);
  const patch = useAgbStore((s) => s.patch);

  const updateA = <K extends keyof typeof data.anbieter>(
    key: K,
    value: (typeof data.anbieter)[K],
  ) => {
    patch({ anbieter: { ...data.anbieter, [key]: value } });
  };

  const setRegisterArt = (art: RegisterArt | undefined) => {
    updateA("registerArt", art);
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Wer ist der Anbieter dieser AGB? Name und Anschrift werden in der Geltungsbereichs- und
        Schlussklausel verwendet. Pflichtangaben gemäß § 5 TMG / DSA.
      </p>

      <Field
        label="Name / Firma"
        required
        hint="Bei Einzelunternehmen: dein voller Name, bei GmbH: vollständige Firma inkl. Rechtsform"
      >
        <TextInput
          value={data.anbieter.name}
          onChange={(e) => updateA("name", e.target.value)}
          placeholder="Mustermann GmbH"
        />
      </Field>

      <Field
        label="Vertretungsberechtigter (optional)"
        hint="Nur bei juristischen Personen relevant — z.B. Geschäftsführer einer GmbH"
      >
        <TextInput
          value={data.anbieter.vertretungsberechtigter ?? ""}
          onChange={(e) => updateA("vertretungsberechtigter", e.target.value)}
          placeholder="Max Mustermann"
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
                onClick={() => updateA("land", l)}
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
        <Field
          label="E-Mail-Adresse"
          required
          hint="Wird in den AGB als Kontakt für Vertragsanfragen genannt"
        >
          <TextInput
            type="email"
            value={data.anbieter.email}
            onChange={(e) => updateA("email", e.target.value)}
            placeholder="kontakt@example.de"
          />
        </Field>
        <Field label="Telefon (optional)">
          <TextInput
            value={data.anbieter.telefon ?? ""}
            onChange={(e) => updateA("telefon", e.target.value)}
            placeholder="+49 711 1234567"
          />
        </Field>
      </div>

      {/* Register-Block */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Handelsregister (optional)
        </p>
        <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
          Nur eintragen, wenn dein Unternehmen im Handels- oder Vereinsregister eingetragen ist.
        </p>

        <Field label="Register-Art">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRegisterArt(undefined)}
              className={
                "px-4 py-2 border transition text-sm " +
                (!data.anbieter.registerArt
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-line bg-bg-soft hover:border-accent")
              }
            >
              Keins
            </button>
            {REGISTER_ARTEN.map((art) => {
              const isActive = data.anbieter.registerArt === art;
              return (
                <button
                  key={art}
                  type="button"
                  onClick={() => setRegisterArt(art)}
                  className={
                    "px-4 py-2 border transition text-sm " +
                    (isActive
                      ? "border-accent bg-accent-soft text-ink"
                      : "border-line bg-bg-soft hover:border-accent")
                  }
                >
                  {art}
                </button>
              );
            })}
          </div>
        </Field>

        {data.anbieter.registerArt && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Field label="Registernummer">
              <TextInput
                value={data.anbieter.registerNummer ?? ""}
                onChange={(e) => updateA("registerNummer", e.target.value)}
                placeholder="123456"
              />
            </Field>
            <Field label="Registergericht">
              <TextInput
                value={data.anbieter.registerGericht ?? ""}
                onChange={(e) => updateA("registerGericht", e.target.value)}
                placeholder="Stuttgart"
              />
            </Field>
          </div>
        )}
      </div>

      <Field
        label="Umsatzsteuer-ID (optional)"
        hint="Wenn leer: Kleinunternehmer-Hinweis nach § 19 UStG wird automatisch ergänzt"
      >
        <TextInput
          value={data.anbieter.ustId ?? ""}
          onChange={(e) => updateA("ustId", e.target.value)}
          placeholder="DE123456789"
        />
      </Field>
    </div>
  );
}
