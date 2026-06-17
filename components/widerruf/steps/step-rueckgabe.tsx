"use client";

import { useWiderrufStore } from "@/lib/widerrufsbelehrung/store";
import { Field, TextInput } from "@/components/avv/field";

export function StepRueckgabe() {
  const data = useWiderrufStore((s) => s.data);
  const patch = useWiderrufStore((s) => s.patch);

  const updateR = <K extends keyof typeof data.rueckgabe>(
    key: K,
    value: (typeof data.rueckgabe)[K],
  ) => {
    patch({ rueckgabe: { ...data.rueckgabe, [key]: value } });
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Wohin soll der Kunde die Ware zurückschicken — und wer trägt die Kosten der Rücksendung?
        Bei nicht paketversandfähiger Ware (Sperrgut) musst du eine Kostenschätzung angeben.
      </p>

      {/* Abweichende Rücksendeadresse */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group mb-3">
          <input
            type="checkbox"
            checked={data.rueckgabe.abweichendeAdresse}
            onChange={(e) => updateR("abweichendeAdresse", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Abweichende Rücksendeadresse</strong> — Ware wird an eine
              andere Adresse als die Anbieter-Adresse zurückgeschickt
            </span>
            <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
              z.B. Lager/Retouren-Center eines Logistikpartners. Wenn deaktiviert: Rücksendung an
              die Anbieter-Adresse aus Schritt 1.
            </p>
          </div>
        </label>

        {data.rueckgabe.abweichendeAdresse && (
          <div className="border border-line bg-bg-soft p-5 flex flex-col gap-4 mt-3">
            <Field label="Empfänger-Name" required>
              <TextInput
                value={data.rueckgabe.rueckgabeName ?? ""}
                onChange={(e) => updateR("rueckgabeName", e.target.value)}
                placeholder="z.B. Mustermann Retouren-Center"
              />
            </Field>

            <Field label="Straße und Hausnummer" required>
              <TextInput
                value={data.rueckgabe.rueckgabeStrasse ?? ""}
                onChange={(e) => updateR("rueckgabeStrasse", e.target.value)}
                placeholder="Logistikweg 7"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="PLZ" required>
                <TextInput
                  value={data.rueckgabe.rueckgabePlz ?? ""}
                  onChange={(e) => updateR("rueckgabePlz", e.target.value)}
                  placeholder="40212"
                />
              </Field>
              <Field label="Ort" required className="sm:col-span-2">
                <TextInput
                  value={data.rueckgabe.rueckgabeOrt ?? ""}
                  onChange={(e) => updateR("rueckgabeOrt", e.target.value)}
                  placeholder="Düsseldorf"
                />
              </Field>
            </div>
          </div>
        )}
      </div>

      {/* Kosten der Rücksendung */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Kosten der Rücksendung
        </p>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.rueckgabe.kundeTraegtKosten}
            onChange={(e) => updateR("kundeTraegtKosten", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Kunde trägt die Rücksendekosten</strong>
            </span>
            <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
              Standard im Online-Handel. Wenn deaktiviert, übernimmst DU als Anbieter die Kosten.
            </p>
          </div>
        </label>

        {!data.rueckgabe.kundeTraegtKosten && (
          <div className="border-l-4 border-accent bg-accent-soft p-4 mt-4">
            <p className="font-body text-[14px] leading-[1.6] text-ink">
              <strong>Du übernimmst die Rücksendekosten</strong> — entsprechende Klausel wird
              automatisch in der Widerrufsbelehrung ergänzt.
            </p>
          </div>
        )}
      </div>

      {/* Sperrgut */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Sperrgut
        </p>

        <label className="flex items-start gap-3 cursor-pointer group mb-3">
          <input
            type="checkbox"
            checked={data.rueckgabe.sperrgut}
            onChange={(e) => updateR("sperrgut", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Sperrgut — nicht paketversandfähig</strong>
            </span>
            <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
              z.B. Möbel, große Geräte, Sportgeräte. Bei Sperrgut MUSS eine Kostenschätzung
              angegeben werden (§ 357 Abs. 6 BGB).
            </p>
          </div>
        </label>

        {data.rueckgabe.sperrgut && (
          <div className="border border-line bg-bg-soft p-5 mt-3">
            <Field
              label="Geschätzte Rücksendekosten"
              required
              hint="z.B. „50 EUR“ oder „bis zu 80 EUR pro Paket“. Wird wörtlich in die Belehrung übernommen."
            >
              <TextInput
                value={data.rueckgabe.geschaetzteKosten ?? ""}
                onChange={(e) => updateR("geschaetzteKosten", e.target.value)}
                placeholder="50 EUR"
              />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}
