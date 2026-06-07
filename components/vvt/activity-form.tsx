"use client";

import { useState } from "react";
import type { Verarbeitungstaetigkeit, Empfaenger, Rechtsgrundlage } from "@/lib/vvt/types";
import {
  RECHTSGRUNDLAGEN_LABELS,
  DRITTLAND_GARANTIE_LABELS,
  STANDARD_BETROFFENENGRUPPEN,
  STANDARD_DATENKATEGORIEN,
  STANDARD_EMPFAENGER_KATEGORIEN,
} from "@/lib/vvt/types";
import { Field, TextInput, TextArea } from "@/components/avv/field";

type Props = {
  value: Verarbeitungstaetigkeit;
  onChange: (partial: Partial<Verarbeitungstaetigkeit>) => void;
};

export function ActivityForm({ value, onChange }: Props) {
  const [customBetroffene, setCustomBetroffene] = useState("");
  const [customDaten, setCustomDaten] = useState("");

  const toggleRechtsgrundlage = (rg: Rechtsgrundlage) => {
    const existing = value.rechtsgrundlagen;
    if (existing.includes(rg)) {
      onChange({ rechtsgrundlagen: existing.filter((r) => r !== rg) });
    } else {
      onChange({ rechtsgrundlagen: [...existing, rg] });
    }
  };

  const toggleBetroffene = (item: string) => {
    const existing = value.betroffenengruppen;
    if (existing.includes(item)) {
      onChange({ betroffenengruppen: existing.filter((b) => b !== item) });
    } else {
      onChange({ betroffenengruppen: [...existing, item] });
    }
  };

  const addCustomBetroffene = () => {
    const trimmed = customBetroffene.trim();
    if (!trimmed || value.betroffenengruppen.includes(trimmed)) return;
    onChange({ betroffenengruppen: [...value.betroffenengruppen, trimmed] });
    setCustomBetroffene("");
  };

  const toggleDaten = (item: string) => {
    const existing = value.datenkategorien;
    if (existing.includes(item)) {
      onChange({ datenkategorien: existing.filter((d) => d !== item) });
    } else {
      onChange({ datenkategorien: [...existing, item] });
    }
  };

  const addCustomDaten = () => {
    const trimmed = customDaten.trim();
    if (!trimmed || value.datenkategorien.includes(trimmed)) return;
    onChange({ datenkategorien: [...value.datenkategorien, trimmed] });
    setCustomDaten("");
  };

  const addEmpfaenger = () => {
    const emp: Empfaenger = {
      id: `emp-${Date.now()}`,
      name: "",
      kategorie: "",
      istAuftragsverarbeiter: false,
      land: "Deutschland",
      avvVorhanden: false,
    };
    onChange({ empfaenger: [...value.empfaenger, emp] });
  };

  const updateEmpfaenger = (id: string, partial: Partial<Empfaenger>) => {
    onChange({
      empfaenger: value.empfaenger.map((e) =>
        e.id === id ? { ...e, ...partial } : e
      ),
    });
  };

  const removeEmpfaenger = (id: string) => {
    onChange({ empfaenger: value.empfaenger.filter((e) => e.id !== id) });
  };

  const showBesondereKategorienHint = value.datenkategorien.some((d) =>
    d.toLowerCase().includes("gesundheit") ||
    d.toLowerCase().includes("biometrisch") ||
    d.toLowerCase().includes("art. 9")
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Grunddaten */}
      <section>
        <SectionLabel n={1}>Grundangaben</SectionLabel>
        <div className="grid gap-5">
          <Field label="Bezeichnung der Tätigkeit" required>
            <TextInput
              placeholder="z.B. Kundenverwaltung, Newsletter, Bewerbermanagement"
              value={value.bezeichnung}
              onChange={(e) => onChange({ bezeichnung: e.target.value })}
            />
          </Field>
          <Field
            label="Zweck der Verarbeitung"
            required
            hint="Warum werden die Daten verarbeitet? Je konkreter, desto besser."
          >
            <TextArea
              placeholder="z.B. Verwaltung von Kundenstammdaten und Kommunikation zur Vertragserfüllung"
              value={value.zweck}
              onChange={(e) => onChange({ zweck: e.target.value })}
              rows={3}
            />
          </Field>
        </div>
      </section>

      {/* Rechtsgrundlage */}
      <section>
        <SectionLabel n={2}>Rechtsgrundlage (Art. 6 / Art. 9 DSGVO)</SectionLabel>
        <p className="mb-4 text-sm text-ink-dim">
          Mindestens eine ist Pflicht. Mehrere sind möglich, wenn verschiedene Datenkategorien
          unterschiedlich verarbeitet werden.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(RECHTSGRUNDLAGEN_LABELS) as Rechtsgrundlage[]).map((rg) => {
            const active = value.rechtsgrundlagen.includes(rg);
            const isBesonders = rg.startsWith("art9");
            return (
              <button
                key={rg}
                type="button"
                onClick={() => toggleRechtsgrundlage(rg)}
                className={`flex items-start gap-3 border p-3 text-left text-[13px] transition ${
                  active
                    ? "border-accent bg-accent-soft text-ink"
                    : "border-line hover:border-[rgba(31,61,47,0.5)] text-ink-dim"
                }`}
              >
                <span
                  className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 border transition ${
                    active ? "bg-accent border-accent" : "bg-bg-soft border-line-strong"
                  }`}
                />
                <span>
                  {RECHTSGRUNDLAGEN_LABELS[rg]}
                  {isBesonders && (
                    <span className="ml-1 font-mono text-[10px] text-accent">
                      ·&nbsp;ART.&nbsp;9
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
        {value.rechtsgrundlagen.includes("art6-1f") && (
          <div className="mt-3">
            <Field
              label="Berechtigtes Interesse — Begründung (Art. 6 Abs. 1 lit. f)"
              required
              hint="Pflicht: Welches konkrete Interesse überwiegt die Interessen der Betroffenen?"
            >
              <TextArea
                placeholder="z.B. Berechtigtes Interesse an IT-Sicherheit und fehlerfreiem Betrieb der Website (Erwägungsgrund 49 DSGVO)"
                value={value.berechtigtesInteresseDetail ?? ""}
                onChange={(e) =>
                  onChange({ berechtigtesInteresseDetail: e.target.value })
                }
                rows={2}
              />
            </Field>
          </div>
        )}

        {/* Besondere Kategorien Art. 9 */}
        <div className="mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`h-4 w-4 border flex-shrink-0 flex items-center justify-center transition ${
                value.besondereKategorien
                  ? "bg-accent border-accent"
                  : "bg-bg-soft border-line"
              }`}
              onClick={() => onChange({ besondereKategorien: !value.besondereKategorien })}
            >
              {value.besondereKategorien && (
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
              checked={value.besondereKategorien}
              onChange={(e) => onChange({ besondereKategorien: e.target.checked })}
            />
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">
              Enthält besondere Datenkategorien (Art. 9 DSGVO)
            </span>
          </label>
          {(value.besondereKategorien || showBesondereKategorienHint) && (
            <p className="mt-2 text-sm text-warn border border-[rgba(154,93,26,0.3)] bg-[rgba(154,93,26,0.05)] px-3 py-2">
              Achtung: Besondere Datenkategorien (Gesundheit, Religion, politische Meinung,
              biometrische Daten etc.) benötigen eine explizite Rechtsgrundlage aus Art. 9 Abs. 2
              DSGVO und eine Datenschutz-Folgenabschätzung (Art. 35 DSGVO).
            </p>
          )}
        </div>
      </section>

      {/* Betroffenengruppen */}
      <section>
        <SectionLabel n={3}>Betroffene Personen</SectionLabel>
        <div className="mb-3 flex flex-wrap gap-2">
          {STANDARD_BETROFFENENGRUPPEN.map((item) => {
            const active = value.betroffenengruppen.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleBetroffene(item)}
                className={`border px-3 py-1.5 text-[13px] transition font-body ${
                  active
                    ? "border-accent bg-accent-soft text-ink"
                    : "border-line hover:border-[rgba(31,61,47,0.5)] text-ink-dim"
                }`}
              >
                {item}
              </button>
            );
          })}
          {/* Custom betroffene that aren't in the standard list */}
          {value.betroffenengruppen
            .filter((b) => !STANDARD_BETROFFENENGRUPPEN.includes(b))
            .map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleBetroffene(item)}
                className="border border-accent bg-accent-soft px-3 py-1.5 text-[13px] text-ink transition font-body"
              >
                {item} ×
              </button>
            ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Eigene Gruppe hinzufügen …"
            value={customBetroffene}
            onChange={(e) => setCustomBetroffene(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomBetroffene())}
            className="flex-1 bg-bg-soft border border-line px-4 py-2 text-sm text-ink placeholder:text-ink-faded outline-none focus:border-accent transition"
          />
          <button
            type="button"
            onClick={addCustomBetroffene}
            className="border border-line px-4 py-2 text-sm font-mono uppercase tracking-widest text-ink-dim hover:border-accent hover:text-accent transition"
          >
            +
          </button>
        </div>
      </section>

      {/* Datenkategorien */}
      <section>
        <SectionLabel n={4}>Datenkategorien</SectionLabel>
        <div className="mb-3 flex flex-wrap gap-2">
          {STANDARD_DATENKATEGORIEN.map((item) => {
            const active = value.datenkategorien.includes(item);
            const isBesonders =
              item.toLowerCase().includes("gesundheit") ||
              item.toLowerCase().includes("biometrisch");
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleDaten(item)}
                className={`border px-3 py-1.5 text-[13px] transition font-body ${
                  active
                    ? "border-accent bg-accent-soft text-ink"
                    : "border-line hover:border-[rgba(31,61,47,0.5)] text-ink-dim"
                } ${isBesonders ? "border-dashed" : ""}`}
              >
                {item}
                {isBesonders && (
                  <span className="ml-1 font-mono text-[10px] text-accent">Art.9</span>
                )}
              </button>
            );
          })}
          {value.datenkategorien
            .filter((d) => !STANDARD_DATENKATEGORIEN.includes(d))
            .map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleDaten(item)}
                className="border border-accent bg-accent-soft px-3 py-1.5 text-[13px] text-ink transition font-body"
              >
                {item} ×
              </button>
            ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Eigene Datenkategorie …"
            value={customDaten}
            onChange={(e) => setCustomDaten(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomDaten())}
            className="flex-1 bg-bg-soft border border-line px-4 py-2 text-sm text-ink placeholder:text-ink-faded outline-none focus:border-accent transition"
          />
          <button
            type="button"
            onClick={addCustomDaten}
            className="border border-line px-4 py-2 text-sm font-mono uppercase tracking-widest text-ink-dim hover:border-accent hover:text-accent transition"
          >
            +
          </button>
        </div>
      </section>

      {/* Empfänger */}
      <section>
        <SectionLabel n={5}>Empfänger & Auftragsverarbeiter</SectionLabel>
        <p className="mb-4 text-sm text-ink-dim">
          Wer bekommt Zugriff auf die Daten? Auch Auftragsverarbeiter (Softwareanbieter, Dienstleister)
          gehören hier rein.
        </p>
        <div className="flex flex-col gap-3">
          {value.empfaenger.map((emp) => (
            <EmpfaengerRow
              key={emp.id}
              value={emp}
              onChange={(p) => updateEmpfaenger(emp.id, p)}
              onRemove={() => removeEmpfaenger(emp.id)}
            />
          ))}
          <button
            type="button"
            onClick={addEmpfaenger}
            className="flex items-center gap-2 border border-dashed border-line px-4 py-3 text-sm text-ink-dim hover:border-accent hover:text-accent transition font-mono uppercase tracking-widest"
          >
            <span>+</span>
            <span>Empfänger hinzufügen</span>
          </button>
        </div>
      </section>

      {/* Drittland */}
      <section>
        <SectionLabel n={6}>Drittland-Transfer (Art. 44 ff. DSGVO)</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(DRITTLAND_GARANTIE_LABELS) as (keyof typeof DRITTLAND_GARANTIE_LABELS)[]).map(
            (key) => {
              const active = value.drittlandGarantie === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onChange({ drittlandGarantie: key })}
                  className={`flex items-start gap-3 border p-3 text-left text-[13px] transition ${
                    active
                      ? "border-accent bg-accent-soft text-ink"
                      : "border-line hover:border-[rgba(31,61,47,0.5)] text-ink-dim"
                  }`}
                >
                  <span
                    className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 rounded-full border transition ${
                      active ? "bg-accent border-accent" : "bg-bg-soft border-line-strong"
                    }`}
                  />
                  {DRITTLAND_GARANTIE_LABELS[key]}
                </button>
              );
            }
          )}
        </div>
        {value.drittlandGarantie !== "keine-uebermittlung" &&
          value.drittlandGarantie !== "eu-ewr" && (
            <div className="mt-3">
              <Field label="Details zur Garantie (optional)" hint="z.B. Empfänger, Drittland, Link zu den SCC">
                <TextInput
                  placeholder="z.B. Google LLC, USA — EU-Standardvertragsklauseln inkl. Schrems-II-TIA"
                  value={value.drittlandDetail ?? ""}
                  onChange={(e) => onChange({ drittlandDetail: e.target.value })}
                />
              </Field>
            </div>
          )}
      </section>

      {/* Löschfristen */}
      <section>
        <SectionLabel n={7}>Löschfristen</SectionLabel>
        <Field
          label="Aufbewahrungsdauer / Löschkonzept"
          required
          hint="Art. 30 DSGVO verlangt 'soweit möglich' Angaben. Konkrete Fristen erhöhen die DSGVO-Konformität."
        >
          <TextArea
            placeholder="z.B. Rechnungen: 10 Jahre (§ 257 HGB). Kontaktdaten nach Vertragsende: 3 Jahre. E-Mails: 3 Monate nach Abschluss der Kommunikation."
            value={value.loeschfristen}
            onChange={(e) => onChange({ loeschfristen: e.target.value })}
            rows={3}
          />
        </Field>
      </section>

      {/* TOMs */}
      <section>
        <SectionLabel n={8}>Technisch-organisatorische Maßnahmen (Art. 32)</SectionLabel>
        <Field
          label="Sicherheitsmaßnahmen"
          hint="Kurze Beschreibung der TOMs für diese Verarbeitungstätigkeit. Oder Verweis auf separates TOM-Dokument."
        >
          <TextArea
            placeholder="z.B. Zugriff nur für berechtigte Mitarbeiter (rollenbasiert). Verschlüsselte Übertragung (TLS). Passwortschutz mit 2FA. Regelmäßige Datensicherung. Siehe auch: TOM-Dokument v1.0."
            value={value.toms}
            onChange={(e) => onChange({ toms: e.target.value })}
            rows={3}
          />
        </Field>
        <button
          type="button"
          onClick={() =>
            onChange({
              toms: "Zugriff nur für berechtigte Mitarbeiter (rollenbasiert). Verschlüsselte Übertragung (TLS). Passwortschutz mit 2FA. Regelmäßige Datensicherung auf isolierten Systemen. Incident-Response-Plan vorhanden.",
            })
          }
          className="mt-2 font-mono text-[10px] uppercase tracking-widest text-accent hover:text-ink-dim transition"
        >
          Standard-TOMs einfügen
        </button>
      </section>

      {/* Anmerkungen */}
      <section>
        <details>
          <summary className="cursor-pointer select-none font-mono text-[11px] uppercase tracking-widest text-ink-dim hover:text-accent transition">
            + Anmerkungen / interne Notizen (optional)
          </summary>
          <div className="pt-4">
            <TextArea
              placeholder="Interne Notizen, Besonderheiten, Überprüfungsdatum …"
              value={value.anmerkungen ?? ""}
              onChange={(e) => onChange({ anmerkungen: e.target.value })}
              rows={2}
            />
          </div>
        </details>
      </section>
    </div>
  );
}

function SectionLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-baseline gap-3">
      <span className="font-mono text-[11px] text-accent">{String(n).padStart(2, "0")}</span>
      <h3
        className="font-display font-semibold text-[18px]"
        style={{ letterSpacing: "-0.01em" }}
      >
        {children}
      </h3>
    </div>
  );
}

function EmpfaengerRow({
  value,
  onChange,
  onRemove,
}: {
  value: Empfaenger;
  onChange: (p: Partial<Empfaenger>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border border-line bg-[rgba(240,236,226,0.6)] p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name des Empfängers / Diensts">
          <TextInput
            placeholder="z.B. Stripe Inc., Google Workspace"
            value={value.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </Field>
        <Field label="Kategorie">
          <select
            value={value.kategorie}
            onChange={(e) => onChange({ kategorie: e.target.value })}
            className="w-full bg-bg-soft border border-line px-4 py-3 text-ink font-body text-sm outline-none focus:border-accent transition"
          >
            <option value="">Bitte wählen …</option>
            {STANDARD_EMPFAENGER_KATEGORIEN.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Land / Sitz des Empfängers">
          <TextInput
            placeholder="z.B. Deutschland, USA, Irland"
            value={value.land}
            onChange={(e) => onChange({ land: e.target.value })}
          />
        </Field>
        <div className="flex flex-col gap-3 pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              className={`h-4 w-4 border flex-shrink-0 flex items-center justify-center transition ${
                value.istAuftragsverarbeiter ? "bg-accent border-accent" : "bg-bg-soft border-line"
              }`}
              onClick={() =>
                onChange({ istAuftragsverarbeiter: !value.istAuftragsverarbeiter })
              }
            >
              {value.istAuftragsverarbeiter && (
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
              checked={value.istAuftragsverarbeiter}
              onChange={(e) => onChange({ istAuftragsverarbeiter: e.target.checked })}
            />
            <span className="text-[12px] text-ink-dim">Auftragsverarbeiter (AVV nötig)</span>
          </label>
          {value.istAuftragsverarbeiter && (
            <label className="flex items-center gap-2 cursor-pointer pl-6">
              <div
                className={`h-4 w-4 border flex-shrink-0 flex items-center justify-center transition ${
                  value.avvVorhanden ? "bg-accent border-accent" : "bg-bg-soft border-line"
                }`}
                onClick={() => onChange({ avvVorhanden: !value.avvVorhanden })}
              >
                {value.avvVorhanden && (
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
                checked={value.avvVorhanden ?? false}
                onChange={(e) => onChange({ avvVorhanden: e.target.checked })}
              />
              <span className="text-[12px] text-ink-dim">
                AVV vorhanden{" "}
                <a
                  href="/avv"
                  className="text-accent underline underline-offset-2 text-[11px]"
                >
                  (jetzt erstellen →)
                </a>
              </span>
            </label>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="mt-3 font-mono text-[10px] uppercase tracking-widest text-ink-faded hover:text-accent transition"
      >
        × Entfernen
      </button>
    </div>
  );
}
