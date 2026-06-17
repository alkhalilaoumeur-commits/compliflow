"use client";

import { useImpressumStore } from "@/lib/impressum/store";
import { Field, TextInput } from "@/components/avv/field";
import { REGISTER_LABELS, type RegisterArt } from "@/lib/impressum/types";
import { rechtsformConfig } from "@/lib/impressum/defaults";

const REGISTER_OPTIONS: RegisterArt[] = ["HRB", "HRA", "VR", "PR", "GnR"];

export function StepRegister() {
  const data = useImpressumStore((s) => s.data);
  const patch = useImpressumStore((s) => s.patch);
  const cfg = rechtsformConfig(data.rechtsform);

  const updateRegister = (key: keyof typeof data.register, value: string | undefined) => {
    patch({ register: { ...data.register, [key]: value } });
  };
  const updateSteuer = (key: keyof typeof data.steuer, value: string | boolean | undefined) => {
    patch({ steuer: { ...data.steuer, [key]: value } });
  };

  const registerPflicht = cfg.needsRegister;
  const registerMoeglich = cfg.kannRegister || cfg.needsRegister;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Registereintrag + Steuerangaben. <strong>USt-IdNr.</strong> wenn du sie hast.{" "}
        <strong>Wirtschafts-ID</strong> ab Dezember 2026 Pflicht (W-IdNr. wird vom Finanzamt
        automatisch vergeben).
      </p>

      {registerMoeglich && (
        <div className="border border-line bg-bg-soft p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
            Registereintrag {registerPflicht ? "(Pflicht)" : "(optional)"}
          </p>

          <Field label="Register-Typ" required={registerPflicht}>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => updateRegister("art", undefined)}
                className={
                  "px-3 py-2 text-sm border transition " +
                  (!data.register.art
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-bg hover:border-accent")
                }
              >
                Kein Register
              </button>
              {REGISTER_OPTIONS.map((art) => {
                const isActive = data.register.art === art;
                return (
                  <button
                    key={art}
                    type="button"
                    onClick={() => updateRegister("art", art)}
                    className={
                      "px-3 py-2 text-sm border transition " +
                      (isActive
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-bg hover:border-accent")
                    }
                  >
                    {art}
                  </button>
                );
              })}
            </div>
            {data.register.art && (
              <p className="mt-2 text-[11px] text-ink-faded">
                {REGISTER_LABELS[data.register.art]}
              </p>
            )}
          </Field>

          {data.register.art && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Field label="Registernummer" required={registerPflicht}>
                <TextInput
                  value={data.register.nummer ?? ""}
                  onChange={(e) => updateRegister("nummer", e.target.value)}
                  placeholder="HRB 123456"
                />
              </Field>
              <Field label="Registergericht" required={registerPflicht}>
                <TextInput
                  value={data.register.gericht ?? ""}
                  onChange={(e) => updateRegister("gericht", e.target.value)}
                  placeholder="Amtsgericht Stuttgart"
                />
              </Field>
            </div>
          )}
        </div>
      )}

      {cfg.needsStammkapital && (
        <Field
          label="Stammkapital"
          hint="Nur wenn relevant: bei voll eingezahlten Stammkapitalanteilen muss dies nicht angegeben werden, ansonsten muss der Gesamtbetrag der noch ausstehenden Einlagen angegeben werden."
        >
          <TextInput
            value={data.stammkapital ?? ""}
            onChange={(e) => patch({ stammkapital: e.target.value })}
            placeholder="z. B. 25.000 €"
          />
        </Field>
      )}

      <div className="border border-line bg-bg-soft p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Steuerangaben
        </p>

        <Field
          label="Umsatzsteuer-Identifikationsnummer (§ 27a UStG)"
          hint="Format: DE + 9 Ziffern (z. B. DE123456789). Leer lassen wenn du keine hast."
        >
          <TextInput
            value={data.steuer.ustId ?? ""}
            onChange={(e) => updateSteuer("ustId", e.target.value)}
            placeholder="DE123456789"
          />
        </Field>

        <div className="mt-4">
          <Field
            label="Wirtschafts-ID-Nummer (W-IdNr.)"
            hint="Ab Dez. 2026 Pflicht. Wird vom Finanzamt automatisch vergeben. Format: DE + 11 Ziffern + 5 Stellen."
          >
            <TextInput
              value={data.steuer.wirtschaftsId ?? ""}
              onChange={(e) => updateSteuer("wirtschaftsId", e.target.value)}
              placeholder="DE12345678901-12345"
            />
          </Field>
        </div>

        {!data.steuer.ustId && (
          <div className="mt-4">
            <Field
              label="Steuernummer (Fallback)"
              hint="Nur als Notlösung wenn keine USt-IdNr. vorhanden. Achtung: Steuernummer ist nicht öffentlich vorgesehen — wenn möglich USt-IdNr. beantragen."
            >
              <TextInput
                value={data.steuer.steuernummer ?? ""}
                onChange={(e) => updateSteuer("steuernummer", e.target.value)}
                placeholder="99/123/12345"
              />
            </Field>
          </div>
        )}

        <label className="flex items-start gap-3 mt-5 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.steuer.kleinunternehmer ?? false}
            onChange={(e) => updateSteuer("kleinunternehmer", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
            Kleinunternehmer (§ 19 UStG) — keine Umsatzsteuer ausgewiesen.
            Hinweis wird automatisch im Impressum ergänzt.
          </span>
        </label>
      </div>
    </div>
  );
}
