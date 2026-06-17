"use client";

import { useState } from "react";
import { useVvtStore } from "@/lib/vvt/store";
import { Field, TextInput, TextArea } from "@/components/avv/field";
import {
  VVT_MODUS_LABELS,
  evaluierePflicht,
  type VvtModus,
  type AuftraggeberMandant,
} from "@/lib/vvt/types";
import { createBlankAuftraggeber } from "@/lib/vvt/templates";

export function StepUnternehmen() {
  const data = useVvtStore((s) => s.data);
  const v = data.verantwortlicher;
  const patch = useVvtStore((s) => s.patchVerantwortlicher);
  const setModus = useVvtStore((s) => s.setModus);
  const patchPflichtCheck = useVvtStore((s) => s.patchPflichtCheck);
  const addAuftraggeber = useVvtStore((s) => s.addAuftraggeber);
  const updateAuftraggeber = useVvtStore((s) => s.updateAuftraggeber);
  const removeAuftraggeber = useVvtStore((s) => s.removeAuftraggeber);

  const [showPflichtCheck, setShowPflichtCheck] = useState(false);
  const pflicht = evaluierePflicht(data.pflichtCheck);

  return (
    <div className="flex flex-col gap-10">
      {/* ─────────── Modus-Auswahl (C1) ─────────── */}
      <ModusSelect modus={data.modus} setModus={setModus} />

      {/* ─────────── Art. 30 Abs. 5 Pflicht-Check (M1) ─────────── */}
      <details
        open={showPflichtCheck}
        onToggle={(e) => setShowPflichtCheck((e.target as HTMLDetailsElement).open)}
        className="border border-line p-6 bg-[rgba(240,236,226,0.4)]"
      >
        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-widest text-accent hover:text-ink transition">
          Bin ich überhaupt VVT-pflichtig? (Art. 30 Abs. 5 Check)
        </summary>
        <div className="mt-5 flex flex-col gap-4">
          <p className="text-sm text-ink-dim">
            Vier Fragen — falls eine mit „Ja" beantwortet wird, ist das VVT Pflicht.
          </p>
          <CheckboxRow
            checked={data.pflichtCheck.mitarbeiter250Plus}
            onChange={(v) => patchPflichtCheck({ mitarbeiter250Plus: v })}
            label="Wir haben 250 oder mehr Mitarbeiter"
          />
          <CheckboxRow
            checked={data.pflichtCheck.nichtNurGelegentlich}
            onChange={(v) => patchPflichtCheck({ nichtNurGelegentlich: v })}
            label="Wir verarbeiten personenbezogene Daten regelmäßig (nicht nur gelegentlich)"
          />
          <CheckboxRow
            checked={data.pflichtCheck.besondereKategorien}
            onChange={(v) => patchPflichtCheck({ besondereKategorien: v })}
            label="Wir verarbeiten besondere Kategorien nach Art. 9 (Gesundheit, Religion, biometrisch) oder strafrechtliche Daten (Art. 10)"
          />
          <CheckboxRow
            checked={data.pflichtCheck.risikoFuerBetroffene}
            onChange={(v) => patchPflichtCheck({ risikoFuerBetroffene: v })}
            label="Unsere Verarbeitung birgt erhöhtes Risiko (Profiling, Scoring, Mitarbeiterbewertung)"
          />
          <div
            className={`mt-2 border-l-2 p-4 ${
              pflicht.istPflichtig
                ? "border-accent bg-accent-soft"
                : "border-warn bg-[rgba(154,93,26,0.05)]"
            }`}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest mb-1">
              {pflicht.istPflichtig ? "VVT ist Pflicht" : "VVT könnte entfallen"}
            </p>
            <p className="text-sm text-ink leading-relaxed">{pflicht.grund}</p>
          </div>
        </div>
      </details>

      {/* ─────────── Stammdaten (Verantwortlicher / Auftragsverarbeiter) ─────────── */}
      <div className="grid gap-10 md:grid-cols-2">
        <div className="border border-line bg-[rgba(240,236,226,0.5)] p-7 flex flex-col gap-5">
          <div>
            <h2
              className="font-display font-bold text-2xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              {data.modus === "verantwortlicher"
                ? "Verantwortliche Stelle"
                : "Auftragsverarbeitende Stelle"}
            </h2>
            <p className="mt-1 text-sm text-ink-dim">
              {data.modus === "verantwortlicher"
                ? "Die Stelle, die das Verzeichnis nach Art. 30 Abs. 1 DSGVO führt."
                : "Die Stelle, die das Verzeichnis nach Art. 30 Abs. 2 DSGVO führt."}
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
            </div>
          </details>

          {/* H2: EU-Vertreter (Art. 27 DSGVO) — strukturiert */}
          <EuVertreterBlock
            hatVertreter={v.hatEuVertreter ?? false}
            vertreter={v.euVertreter}
            land={v.land}
            onToggle={(b) => patch({ hatEuVertreter: b })}
            onChange={(p) =>
              patch({
                euVertreter: {
                  bezeichnung: v.euVertreter?.bezeichnung ?? "",
                  anschrift: v.euVertreter?.anschrift ?? "",
                  email: v.euVertreter?.email ?? "",
                  ...p,
                },
              })
            }
          />
        </div>

        {/* DSB + Info */}
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

            <CheckboxRow
              checked={v.hatDsb ?? false}
              onChange={(b) => patch({ hatDsb: b })}
              label="Wir haben einen Datenschutzbeauftragten"
              dense
            />

            {v.hatDsb && (
              <div className="flex flex-col gap-4 border-t border-line pt-5 mt-5">
                <Field label="Name des DSB" required={v.hatDsb}>
                  <TextInput
                    placeholder="Dr. Erika Mustermann"
                    value={v.dsb?.name ?? ""}
                    onChange={(e) =>
                      patch({
                        dsb: {
                          name: e.target.value,
                          email: v.dsb?.email ?? "",
                          telefon: v.dsb?.telefon,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="E-Mail des DSB" required={v.hatDsb}>
                  <TextInput
                    type="email"
                    placeholder="dsb@example.de"
                    value={v.dsb?.email ?? ""}
                    onChange={(e) =>
                      patch({
                        dsb: {
                          name: v.dsb?.name ?? "",
                          email: e.target.value,
                          telefon: v.dsb?.telefon,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="Telefon des DSB">
                  <TextInput
                    placeholder="+49 711 123456"
                    value={v.dsb?.telefon ?? ""}
                    onChange={(e) =>
                      patch({
                        dsb: {
                          name: v.dsb?.name ?? "",
                          email: v.dsb?.email ?? "",
                          telefon: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
              </div>
            )}
          </div>

          <div className="border border-[rgba(226,221,209,0.6)] bg-accent-soft p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
              {data.modus === "verantwortlicher"
                ? "Pflicht nach Art. 30 Abs. 1 DSGVO"
                : "Pflicht nach Art. 30 Abs. 2 DSGVO"}
            </p>
            <ul className="space-y-1.5 font-body text-sm text-ink-dim">
              {(data.modus === "verantwortlicher"
                ? [
                    "Name und Kontaktdaten des Verantwortlichen",
                    "Zweck jeder Verarbeitungstätigkeit",
                    "Datenkategorien und Betroffenengruppen",
                    "Empfänger, auch in Drittländern",
                    "Löschfristen (soweit möglich)",
                    "Technisch-organisatorische Maßnahmen",
                  ]
                : [
                    "Name und Kontaktdaten des Auftragsverarbeiters",
                    "Name jedes Verantwortlichen, in dessen Auftrag verarbeitet wird",
                    "Kategorien der im Auftrag durchgeführten Verarbeitungen",
                    "Drittlandübermittlungen (soweit anwendbar)",
                    "Technisch-organisatorische Maßnahmen",
                  ]
              ).map((item) => (
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

      {/* ─────────── Auftraggeber-Mandanten (nur bei Modus Auftragsverarbeiter) ─────────── */}
      {data.modus === "auftragsverarbeiter" && (
        <AuftraggeberSection
          mandanten={data.auftraggeber}
          onAdd={() => addAuftraggeber(createBlankAuftraggeber())}
          onUpdate={updateAuftraggeber}
          onRemove={removeAuftraggeber}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Modus-Auswahl
// ─────────────────────────────────────────────────────────────────────────────

function ModusSelect({
  modus,
  setModus,
}: {
  modus: VvtModus;
  setModus: (m: VvtModus) => void;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">
        Welche Rolle haben Sie?
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {(Object.keys(VVT_MODUS_LABELS) as VvtModus[]).map((m) => {
          const active = modus === m;
          return (
            <button
              key={m}
              type="button"
              onClick={() => setModus(m)}
              className={`text-left border p-5 transition ${
                active
                  ? "border-accent bg-accent-soft"
                  : "border-line bg-bg-soft hover:border-accent"
              }`}
            >
              <div className="font-display text-[16px] font-semibold text-ink">
                {VVT_MODUS_LABELS[m].kurz}
              </div>
              <p className="mt-1.5 text-[13px] text-ink-dim leading-snug">
                {VVT_MODUS_LABELS[m].lang}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EU-Vertreter Block (Art. 27 DSGVO)
// ─────────────────────────────────────────────────────────────────────────────

function EuVertreterBlock({
  hatVertreter,
  vertreter,
  land,
  onToggle,
  onChange,
}: {
  hatVertreter: boolean;
  vertreter?: { bezeichnung: string; anschrift: string; email: string };
  land?: string;
  onToggle: (b: boolean) => void;
  onChange: (p: Partial<{ bezeichnung: string; anschrift: string; email: string }>) => void;
}) {
  const EU_LAENDER = [
    "Deutschland", "Österreich", "Frankreich", "Italien", "Spanien",
    "Niederlande", "Belgien", "Luxemburg", "Polen", "Tschechien",
    "Schweden", "Dänemark", "Finnland", "Irland", "Portugal",
  ];
  const istInEu = land && EU_LAENDER.includes(land);
  return (
    <div className="border-t border-line pt-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
        EU-Vertreter (Art. 27 DSGVO)
      </p>
      <p className="text-[12px] text-ink-faded mb-3 leading-snug">
        Pflicht für Unternehmen <strong>außerhalb EU/EWR</strong>, die Daten von Personen
        in der EU verarbeiten. Bei Sitz in DE/AT/EU normalerweise nicht erforderlich.
      </p>
      <CheckboxRow
        checked={hatVertreter}
        onChange={onToggle}
        label="Wir haben einen EU-Vertreter benannt"
        dense
      />
      {istInEu && hatVertreter && (
        <p className="mt-2 text-[12px] text-ink-faded">
          Hinweis: Bei Sitz in {land} ist ein EU-Vertreter nach Art. 27 normalerweise nicht
          notwendig — Eintrag wird trotzdem aufgenommen.
        </p>
      )}
      {hatVertreter && (
        <div className="mt-4 flex flex-col gap-3">
          <Field label="Bezeichnung / Firma" required>
            <TextInput
              placeholder="EU-Vertretung GmbH"
              value={vertreter?.bezeichnung ?? ""}
              onChange={(e) => onChange({ bezeichnung: e.target.value })}
            />
          </Field>
          <Field label="Anschrift in EU/EWR" required>
            <TextInput
              placeholder="Musterstraße 1, 10115 Berlin, Deutschland"
              value={vertreter?.anschrift ?? ""}
              onChange={(e) => onChange({ anschrift: e.target.value })}
            />
          </Field>
          <Field label="E-Mail" required>
            <TextInput
              type="email"
              placeholder="vertreter@example.eu"
              value={vertreter?.email ?? ""}
              onChange={(e) => onChange({ email: e.target.value })}
            />
          </Field>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Auftraggeber-Mandanten Sektion (nur bei modus=auftragsverarbeiter)
// ─────────────────────────────────────────────────────────────────────────────

function AuftraggeberSection({
  mandanten,
  onAdd,
  onUpdate,
  onRemove,
}: {
  mandanten: AuftraggeberMandant[];
  onAdd: () => void;
  onUpdate: (id: string, p: Partial<AuftraggeberMandant>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="border border-line p-7 bg-[rgba(240,236,226,0.5)]">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2
            className="font-display font-bold text-2xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Auftraggeber (Verantwortliche)
          </h2>
          <p className="mt-1 text-sm text-ink-dim">
            Nach Art. 30 Abs. 2 lit. a DSGVO: Name jedes Verantwortlichen, in dessen Auftrag Sie
            verarbeiten. Mindestens 1 erforderlich.
          </p>
        </div>
      </div>

      {mandanten.length === 0 && (
        <p className="text-sm text-ink-faded mb-4">
          Noch keine Auftraggeber erfasst.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {mandanten.map((m, idx) => (
          <div key={m.id} className="border border-line bg-bg p-5">
            <div className="flex items-baseline justify-between mb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                Auftraggeber {String(idx + 1).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => onRemove(m.id)}
                className="font-mono text-[10px] uppercase tracking-widest text-ink-faded hover:text-warn transition"
              >
                × Entfernen
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Bezeichnung / Firma" required>
                <TextInput
                  placeholder="Auftraggeber GmbH"
                  value={m.bezeichnung}
                  onChange={(e) => onUpdate(m.id, { bezeichnung: e.target.value })}
                />
              </Field>
              <Field label="Ansprechpartner">
                <TextInput
                  placeholder="Max Mustermann"
                  value={m.ansprechpartner}
                  onChange={(e) => onUpdate(m.id, { ansprechpartner: e.target.value })}
                />
              </Field>
              <Field label="Anschrift" required>
                <TextInput
                  placeholder="Straße 1, 10115 Berlin, Deutschland"
                  value={m.anschrift}
                  onChange={(e) => onUpdate(m.id, { anschrift: e.target.value })}
                />
              </Field>
              <Field label="E-Mail" required>
                <TextInput
                  type="email"
                  placeholder="datenschutz@auftraggeber.de"
                  value={m.email}
                  onChange={(e) => onUpdate(m.id, { email: e.target.value })}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field
                  label="Kategorien der im Auftrag durchgeführten Verarbeitungen"
                  required
                  hint={'Art. 30 Abs. 2 lit. b DSGVO — z.B. „Hosting + Backup der Kundendatenbank, E-Mail-Versand"'}
                >
                  <TextArea
                    placeholder="z.B. SaaS-Bereitstellung CRM-System, Datenhosting, automatische Backups, Helpdesk"
                    value={m.verarbeitungsbeschreibung}
                    onChange={(e) =>
                      onUpdate(m.id, { verarbeitungsbeschreibung: e.target.value })
                    }
                    rows={2}
                  />
                </Field>
              </div>
              <CheckboxRow
                checked={m.hatDsb}
                onChange={(b) => onUpdate(m.id, { hatDsb: b })}
                label="Auftraggeber hat eigenen DSB"
                dense
              />
              <CheckboxRow
                checked={m.avvAbgeschlossen}
                onChange={(b) => onUpdate(m.id, { avvAbgeschlossen: b })}
                label="AVV nach Art. 28 DSGVO abgeschlossen"
                dense
              />
              {m.hatDsb && (
                <div className="sm:col-span-2">
                  <Field label="DSB-Kontakt (Name + E-Mail)">
                    <TextInput
                      placeholder="Dr. Erika Beispiel · dsb@auftraggeber.de"
                      value={m.dsbKontakt ?? ""}
                      onChange={(e) => onUpdate(m.id, { dsbKontakt: e.target.value })}
                    />
                  </Field>
                </div>
              )}
              {m.avvAbgeschlossen && (
                <Field label="AVV-Datum">
                  <TextInput
                    type="date"
                    value={m.avvDatum ?? ""}
                    onChange={(e) => onUpdate(m.id, { avvDatum: e.target.value })}
                  />
                </Field>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 border border-dashed border-line px-4 py-3 text-sm text-ink-dim hover:border-accent hover:text-accent transition font-mono uppercase tracking-widest"
        >
          <span>+</span>
          <span>Auftraggeber hinzufügen</span>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Wiederverwendbarer Checkbox-Row
// ─────────────────────────────────────────────────────────────────────────────

function CheckboxRow({
  checked,
  onChange,
  label,
  dense = false,
}: {
  checked: boolean;
  onChange: (b: boolean) => void;
  label: string;
  dense?: boolean;
}) {
  return (
    <label className={`flex items-start gap-3 cursor-pointer ${dense ? "" : "mb-1"}`}>
      <div
        className={`mt-0.5 h-4 w-4 border flex-shrink-0 flex items-center justify-center transition ${
          checked ? "bg-accent border-accent" : "bg-bg-soft border-line"
        }`}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
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
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="font-mono text-[11px] uppercase tracking-widest text-ink-dim leading-tight">
        {label}
      </span>
    </label>
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
