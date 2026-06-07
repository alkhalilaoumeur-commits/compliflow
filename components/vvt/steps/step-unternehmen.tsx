"use client";

import { useVvtStore } from "@/lib/vvt/store";
import { Field, TextInput } from "@/components/avv/field";

export function StepUnternehmen() {
  const v = useVvtStore((s) => s.data.verantwortlicher);
  const patch = useVvtStore((s) => s.patchVerantwortlicher);

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {/* Hauptangaben */}
      <div className="border border-line bg-[rgba(240,236,226,0.5)] p-7 flex flex-col gap-5">
        <div>
          <h2
            className="font-display font-bold text-2xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Verantwortliche Stelle
          </h2>
          <p className="mt-1 text-sm text-ink-dim">
            Die Stelle, die das Verarbeitungsverzeichnis führt (Art. 30 Abs. 1 DSGVO).
          </p>
        </div>

        <Field label="Unternehmens- / Organisationsname" required>
          <TextInput
            placeholder="Mustermann GmbH"
            value={v.bezeichnung ?? ""}
            onChange={(e) => patch({ bezeichnung: e.target.value })}
            autoComplete="organization"
          />
        </Field>

        <Field
          label="Vertretungsberechtigte Person"
          required
          hint="Geschäftsführer, Inhaber, Vorstand — wer rechtlich verantwortlich ist."
        >
          <TextInput
            placeholder="Max Mustermann, Geschäftsführer"
            value={v.name ?? ""}
            onChange={(e) => patch({ name: e.target.value })}
            autoComplete="name"
          />
        </Field>

        <Field label="Straße & Hausnummer" required>
          <TextInput
            placeholder="Musterstraße 1"
            value={v.strasse ?? ""}
            onChange={(e) => patch({ strasse: e.target.value })}
            autoComplete="street-address"
          />
        </Field>

        <div className="grid grid-cols-[100px_1fr] gap-3">
          <Field label="PLZ" required>
            <TextInput
              placeholder="70599"
              value={v.plz ?? ""}
              onChange={(e) => patch({ plz: e.target.value })}
              inputMode="numeric"
              maxLength={5}
            />
          </Field>
          <Field label="Ort" required>
            <TextInput
              placeholder="Stuttgart"
              value={v.ort ?? ""}
              onChange={(e) => patch({ ort: e.target.value })}
              autoComplete="address-level2"
            />
          </Field>
        </div>

        <Field label="Land" required>
          <select
            value={v.land ?? "Deutschland"}
            onChange={(e) => patch({ land: e.target.value })}
            className="w-full bg-bg-soft border border-line px-4 py-3 text-ink font-body text-base outline-none focus:border-accent transition"
          >
            {LAENDER.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Field>

        <Field label="E-Mail (Datenschutz-Kontakt)" required>
          <TextInput
            type="email"
            placeholder="datenschutz@example.de"
            value={v.email ?? ""}
            onChange={(e) => patch({ email: e.target.value })}
            autoComplete="email"
          />
        </Field>

        <details className="mt-1">
          <summary className="cursor-pointer select-none font-mono text-[11px] uppercase tracking-widest text-ink-dim hover:text-accent transition">
            + Telefon & Website (optional)
          </summary>
          <div className="flex flex-col gap-4 pt-4">
            <Field label="Telefon">
              <TextInput
                placeholder="+49 711 123456"
                value={v.telefon ?? ""}
                onChange={(e) => patch({ telefon: e.target.value })}
                autoComplete="tel"
              />
            </Field>
            <Field label="Website">
              <TextInput
                type="url"
                placeholder="https://example.de"
                value={v.website ?? ""}
                onChange={(e) => patch({ website: e.target.value })}
              />
            </Field>
            <Field label="EU-Vertreter (Art. 27 DSGVO)" hint="Nur wenn du keinen EU-Sitz hast.">
              <TextInput
                placeholder="Name, Adresse des EU-Vertreters"
                value={v.vertreter ?? ""}
                onChange={(e) => patch({ vertreter: e.target.value })}
              />
            </Field>
          </div>
        </details>
      </div>

      {/* DSB */}
      <div className="flex flex-col gap-6">
        <div className="border border-line bg-[rgba(240,236,226,0.5)] p-7">
          <h2
            className="font-display font-bold text-xl mb-1"
            style={{ letterSpacing: "-0.02em" }}
          >
            Datenschutzbeauftragter
          </h2>
          <p className="text-sm text-ink-dim mb-5">
            Pflicht ab 20 MA mit regelmäßiger Datenverarbeitung (§ 38 BDSG) oder bei
            bestimmten Verarbeitungen (Art. 37 DSGVO). Angabe im VVT empfohlen.
          </p>

          <label className="flex items-start gap-3 cursor-pointer group mb-6">
            <div
              className={`mt-0.5 h-4 w-4 border flex-shrink-0 flex items-center justify-center transition ${
                v.hatDsb ? "bg-accent border-accent" : "bg-bg-soft border-line"
              }`}
              onClick={() => patch({ hatDsb: !v.hatDsb })}
            >
              {v.hatDsb && (
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="#F6F2EA"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              className="sr-only"
              checked={v.hatDsb ?? false}
              onChange={(e) => patch({ hatDsb: e.target.checked })}
            />
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">
              Wir haben einen Datenschutzbeauftragten
            </span>
          </label>

          {v.hatDsb && (
            <div className="flex flex-col gap-4 border-t border-line pt-5">
              <Field label="Name des DSB" required={v.hatDsb}>
                <TextInput
                  placeholder="Dr. Erika Mustermann"
                  value={v.dsb?.name ?? ""}
                  onChange={(e) =>
                    patch({ dsb: { name: e.target.value, email: v.dsb?.email ?? "", telefon: v.dsb?.telefon } })
                  }
                />
              </Field>
              <Field label="E-Mail des DSB" required={v.hatDsb}>
                <TextInput
                  type="email"
                  placeholder="dsb@example.de"
                  value={v.dsb?.email ?? ""}
                  onChange={(e) =>
                    patch({ dsb: { name: v.dsb?.name ?? "", email: e.target.value, telefon: v.dsb?.telefon } })
                  }
                />
              </Field>
              <Field label="Telefon des DSB">
                <TextInput
                  placeholder="+49 711 123456"
                  value={v.dsb?.telefon ?? ""}
                  onChange={(e) =>
                    patch({ dsb: { name: v.dsb?.name ?? "", email: v.dsb?.email ?? "", telefon: e.target.value } })
                  }
                />
              </Field>
            </div>
          )}
        </div>

        {/* Info-Box */}
        <div className="border border-[rgba(226,221,209,0.6)] bg-accent-soft p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
            Pflicht nach Art. 30 Abs. 1 DSGVO
          </p>
          <ul className="space-y-1.5 font-body text-sm text-ink-dim">
            {[
              "Name und Kontaktdaten des Verantwortlichen",
              "Zweck jeder Verarbeitungstätigkeit",
              "Datenkategorien und Betroffenengruppen",
              "Empfänger, auch in Drittländern",
              "Löschfristen (soweit möglich)",
              "Technisch-organisatorische Maßnahmen",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-accent mt-0.5" aria-hidden>
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const LAENDER = [
  "Deutschland",
  "Österreich",
  "Schweiz",
  "Frankreich",
  "Italien",
  "Spanien",
  "Niederlande",
  "Belgien",
  "Luxemburg",
  "Polen",
  "Tschechien",
  "Schweden",
  "Dänemark",
  "Finnland",
  "Irland",
  "Portugal",
  "USA",
  "Vereinigtes Königreich",
];
