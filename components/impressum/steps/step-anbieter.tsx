"use client";

import { useImpressumStore } from "@/lib/impressum/store";
import { Field, TextInput } from "@/components/avv/field";
import { RECHTSFORM_LABELS, type Rechtsform } from "@/lib/impressum/types";
import { rechtsformConfig } from "@/lib/impressum/defaults";

const RECHTSFORM_ORDER: Rechtsform[] = [
  "einzelunternehmer",
  "kleinunternehmer",
  "freiberufler",
  "gbr",
  "gmbh",
  "ug",
  "ohg",
  "kg",
  "ag",
  "ev",
  "stiftung",
  "andere",
];

export function StepAnbieter() {
  const data = useImpressumStore((s) => s.data);
  const patch = useImpressumStore((s) => s.patch);
  const cfg = rechtsformConfig(data.rechtsform);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Wer steht hinter der Webseite? Bei juristischen Personen (GmbH, e.V.) brauchst du den
        offiziellen Namen aus dem Register. Bei Einzelunternehmern reicht dein voller Name.
      </p>

      <Field label="Rechtsform" required>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {RECHTSFORM_ORDER.map((rf) => {
            const isActive = data.rechtsform === rf;
            return (
              <button
                key={rf}
                type="button"
                onClick={() => patch({ rechtsform: rf })}
                className={
                  "px-3 py-2.5 text-left border transition text-sm " +
                  (isActive
                    ? "border-accent bg-accent-soft text-ink"
                    : "border-line bg-bg-soft hover:border-accent")
                }
              >
                {RECHTSFORM_LABELS[rf].kurz}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-ink-faded">
          {RECHTSFORM_LABELS[data.rechtsform].lang}
        </p>
      </Field>

      {data.rechtsform === "andere" && (
        <Field label="Bezeichnung der Rechtsform" required>
          <TextInput
            value={data.rechtsformAndere ?? ""}
            onChange={(e) => patch({ rechtsformAndere: e.target.value })}
            placeholder="z. B. PartG mbB, KGaA, SE …"
          />
        </Field>
      )}

      {cfg.needsFirma && (
        <Field
          label={cfg.juristisch ? "Vollständiger Firmenname" : "Firmenname (optional)"}
          required={cfg.juristisch}
          hint={cfg.juristisch ? "Genau so wie im Register eingetragen" : "Nur ausfüllen wenn du einen Firmennamen nutzt"}
        >
          <TextInput
            value={data.firma}
            onChange={(e) => patch({ firma: e.target.value })}
            placeholder={cfg.juristisch ? "Mustermann GmbH" : "Mustermann IT-Service"}
          />
        </Field>
      )}

      {cfg.needsVorname && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Vorname" required>
              <TextInput
                value={data.vorname}
                onChange={(e) => patch({ vorname: e.target.value })}
                placeholder="Max"
              />
            </Field>
            <Field label="Nachname" required>
              <TextInput
                value={data.nachname}
                onChange={(e) => patch({ nachname: e.target.value })}
                placeholder="Mustermann"
              />
            </Field>
          </div>

          {!cfg.juristisch && data.firma && (
            <Field
              label="Zusatz vor dem Namen"
              hint="z. B. 'Inh.' (Inhaber), wird vor deinen Namen gesetzt"
            >
              <TextInput
                value={data.inhaberzusatz ?? "Inh."}
                onChange={(e) => patch({ inhaberzusatz: e.target.value })}
                placeholder="Inh."
              />
            </Field>
          )}
        </>
      )}

      {!cfg.needsFirma && !cfg.needsVorname && (
        <div className="border border-line bg-bg-soft p-4">
          <p className="font-body text-[14px] leading-[1.6] text-ink-dim">
            Für diese Rechtsform werden im nächsten Schritt weitere Angaben abgefragt.
          </p>
        </div>
      )}
    </div>
  );
}
