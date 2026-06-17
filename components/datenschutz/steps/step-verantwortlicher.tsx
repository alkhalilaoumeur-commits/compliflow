"use client";

import { useDatenschutzStore } from "@/lib/datenschutz/store";
import { Field, TextInput } from "@/components/avv/field";
import {
  BRANCHE_LABELS,
  ZIELGRUPPE_LABELS,
  MITARBEITERZAHL_LABELS,
  type Branche,
  type Zielgruppe,
  type Mitarbeiterzahl,
} from "@/lib/datenschutz/types";
import type { Land } from "@/lib/impressum/types";
import { LAND_LABELS } from "@/lib/impressum/types";
import { hasDsbPflicht } from "@/lib/datenschutz/contract";

const LAENDER: Land[] = ["DE", "AT", "CH"];

const BRANCHE_ORDER: Branche[] = [
  "allgemein",
  "ecommerce",
  "arzt",
  "anwalt",
  "pflege",
  "hotel",
  "versicherung",
  "ki_saas",
  "schule",
  "verein",
];

const ZIELGRUPPE_ORDER: Zielgruppe[] = ["b2c", "b2b", "beide", "auch_kinder_unter_16"];

const MITARBEITERZAHL_ORDER: Mitarbeiterzahl[] = [
  "solo",
  "klein_2_19",
  "schwelle_20_49",
  "mittel_50_249",
  "gross_250plus",
];

export function StepVerantwortlicher() {
  const data = useDatenschutzStore((s) => s.data);
  const patch = useDatenschutzStore((s) => s.patch);

  const updateV = (key: keyof typeof data.verantwortlicher, value: string) => {
    patch({ verantwortlicher: { ...data.verantwortlicher, [key]: value } });
  };
  const updateDsb = <K extends keyof typeof data.dsb>(key: K, value: (typeof data.dsb)[K]) => {
    patch({ dsb: { ...data.dsb, [key]: value } });
  };

  const dsbPflicht = hasDsbPflicht(data);

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Wer ist verantwortlich für die Datenverarbeitung auf der Webseite? Das ist meistens das
        Unternehmen oder die Person, die die Webseite betreibt — gleich wie im Impressum.
      </p>

      <Field label="Name / Firma" required hint="Bei Einzelunternehmen: dein voller Name, bei GmbH: Firmenname">
        <TextInput
          value={data.verantwortlicher.name}
          onChange={(e) => updateV("name", e.target.value)}
          placeholder="Mustermann GmbH"
        />
      </Field>

      <Field label="Straße und Hausnummer" required hint="Keine Postfächer (Hausanschrift Pflicht)">
        <TextInput
          value={data.verantwortlicher.strasse}
          onChange={(e) => updateV("strasse", e.target.value)}
          placeholder="Musterstraße 12"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="PLZ" required>
          <TextInput
            value={data.verantwortlicher.plz}
            onChange={(e) => updateV("plz", e.target.value)}
            placeholder="70599"
          />
        </Field>
        <Field label="Ort" required className="sm:col-span-2">
          <TextInput
            value={data.verantwortlicher.ort}
            onChange={(e) => updateV("ort", e.target.value)}
            placeholder="Stuttgart"
          />
        </Field>
      </div>

      <Field label="Land" required>
        <div className="flex gap-2">
          {LAENDER.map((l) => {
            const isActive = data.verantwortlicher.land === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() =>
                  patch({ verantwortlicher: { ...data.verantwortlicher, land: l } })
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
        <Field label="E-Mail-Adresse" required>
          <TextInput
            type="email"
            value={data.verantwortlicher.email}
            onChange={(e) => updateV("email", e.target.value)}
            placeholder="datenschutz@example.de"
          />
        </Field>
        <Field label="Telefon (optional)">
          <TextInput
            value={data.verantwortlicher.telefon ?? ""}
            onChange={(e) => updateV("telefon", e.target.value)}
            placeholder="+49 711 1234567"
          />
        </Field>
      </div>

      {/* Branche */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Branche & Kontext
        </p>
        <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
          Bei bestimmten Branchen (Arzt, Anwalt etc.) gelten Sonderregeln — wir ergänzen sie
          automatisch.
        </p>

        <Field label="Branche" required>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BRANCHE_ORDER.map((b) => {
              const isActive = data.branche === b;
              const cfg = BRANCHE_LABELS[b];
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => patch({ branche: b })}
                  className={
                    "px-3 py-3 text-left border transition " +
                    (isActive
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-bg-soft hover:border-accent")
                  }
                >
                  <div className="font-body text-[14px] leading-[1.6] font-medium text-ink">{cfg.name}</div>
                  {cfg.sonderregeln && (
                    <div className="text-[11px] text-ink-faded mt-0.5">
                      → Branchen-Sonderklausel wird ergänzt
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="mt-6">
          <Field label="Zielgruppe" required>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ZIELGRUPPE_ORDER.map((z) => {
                const isActive = data.zielgruppe === z;
                return (
                  <button
                    key={z}
                    type="button"
                    onClick={() => patch({ zielgruppe: z })}
                    className={
                      "px-3 py-2.5 text-left border transition text-sm " +
                      (isActive
                        ? "border-accent bg-accent-soft text-ink"
                        : "border-line bg-bg-soft hover:border-accent")
                    }
                  >
                    {ZIELGRUPPE_LABELS[z]}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>

        <div className="mt-6">
          <Field label="Mitarbeiterzahl" required hint="Bestimmt DSB- und HinSchG-Pflichten">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MITARBEITERZAHL_ORDER.map((m) => {
                const isActive = data.mitarbeiterzahl === m;
                const cfg = MITARBEITERZAHL_LABELS[m];
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => patch({ mitarbeiterzahl: m })}
                    className={
                      "px-3 py-3 text-left border transition " +
                      (isActive
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-bg-soft hover:border-accent")
                    }
                  >
                    <div className="font-body text-[14px] leading-[1.6] font-medium text-ink">{cfg.name}</div>
                    {cfg.pflichten.length > 0 && (
                      <div className="text-[11px] text-ink-faded mt-0.5">
                        {cfg.pflichten.join(" · ")}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Field>
        </div>
      </div>

      {/* DSB */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Datenschutzbeauftragter (DSB)
        </p>

        {dsbPflicht && (
          <div className="border-l-4 border-accent bg-accent-soft p-4 mb-4">
            <p className="font-body text-[14px] leading-[1.6] text-ink">
              <strong>DSB-Pflicht für dich</strong> nach § 38 BDSG / Art. 37 DSGVO — entweder wegen
              Mitarbeiterzahl (≥ 20), besonderer Datenkategorien (Art. 9) oder Branche (z.B.
              Arzt/Anwalt). Bitte einen DSB benennen.
            </p>
          </div>
        )}

        <label className="flex items-start gap-3 cursor-pointer group mb-4">
          <input
            type="checkbox"
            checked={data.dsb.aktiv}
            onChange={(e) => updateDsb("aktiv", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
            Wir haben einen Datenschutzbeauftragten benannt
          </span>
        </label>

        {data.dsb.aktiv && (
          <div className="border border-line bg-bg-soft p-5 flex flex-col gap-4">
            <Field label="Name des DSB" required>
              <TextInput
                value={data.dsb.name ?? ""}
                onChange={(e) => updateDsb("name", e.target.value)}
                placeholder="Max Mustermann"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="E-Mail des DSB" required>
                <TextInput
                  type="email"
                  value={data.dsb.email ?? ""}
                  onChange={(e) => updateDsb("email", e.target.value)}
                  placeholder="dsb@example.de"
                />
              </Field>
              <Field label="Telefon (optional)">
                <TextInput
                  value={data.dsb.telefon ?? ""}
                  onChange={(e) => updateDsb("telefon", e.target.value)}
                  placeholder="+49 711 1234567"
                />
              </Field>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={data.dsb.istExtern ?? false}
                onChange={(e) => updateDsb("istExtern", e.target.checked)}
                className="mt-1 h-4 w-4 accent-accent"
              />
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                Externer DSB (kein Mitarbeiter, sondern beauftragter Dienstleister)
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
