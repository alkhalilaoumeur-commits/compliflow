"use client";

import { useAvvStore } from "@/lib/avv/store";
import type { Vertragspartei } from "@/lib/avv/types";
import { validateEmail, validatePlz } from "@/lib/avv/schema";
import { Field, TextInput } from "../field";

type Side = "auftraggeber" | "auftragnehmer";

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
  "Indien",
  "Kanada",
  "Australien",
];

export function StepParteien() {
  return (
    <div className="grid md:grid-cols-2 gap-10">
      <ParteiCard
        side="auftraggeber"
        label="Auftraggeber (Verantwortlicher)"
        hint="Das bist meist du — wer Daten erhebt und die Verarbeitung in Auftrag gibt."
      />
      <ParteiCard
        side="auftragnehmer"
        label="Auftragsverarbeiter"
        hint="Wer die Daten in deinem Auftrag verarbeitet (z.B. Stripe, Vercel, ein Dienstleister)."
      />
    </div>
  );
}

function ParteiCard({ side, label, hint }: { side: Side; label: string; hint: string }) {
  const value = useAvvStore((s) => s.data[side]);
  const update = useAvvStore((s) => s.update);

  const set = <K extends keyof Vertragspartei>(key: K, v: Vertragspartei[K]) => {
    update(side, { ...value, [key]: v });
  };

  const emailError = validateEmail(value.email ?? "");
  const plzError = validatePlz(value.plz ?? "");

  return (
    <div className="border border-line bg-bg-soft/50 p-7 flex flex-col gap-5">
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ letterSpacing: "-0.02em" }}>
          {label}
        </h2>
        <p className="text-ink-dim text-sm mt-1">{hint}</p>
      </div>

      <Field label="Firma / Name" required>
        <TextInput
          placeholder="Mustermann GmbH"
          value={value.firma ?? ""}
          onChange={(e) => set("firma", e.target.value)}
          autoComplete="organization"
        />
      </Field>

      <Field label="Straße & Hausnummer" required>
        <TextInput
          placeholder="Musterstraße 1"
          value={value.strasse ?? ""}
          onChange={(e) => set("strasse", e.target.value)}
          autoComplete="street-address"
        />
      </Field>

      <div className="grid grid-cols-[100px_1fr] gap-3">
        <Field label="PLZ" required error={plzError}>
          <TextInput
            placeholder="70599"
            value={value.plz ?? ""}
            onChange={(e) => set("plz", e.target.value)}
            invalid={!!plzError && !!value.plz}
            autoComplete="postal-code"
            inputMode="numeric"
          />
        </Field>
        <Field label="Ort" required>
          <TextInput
            placeholder="Stuttgart"
            value={value.ort ?? ""}
            onChange={(e) => set("ort", e.target.value)}
            autoComplete="address-level2"
          />
        </Field>
      </div>

      <Field
        label="Land"
        required
        hint={
          value.land &&
          !["Deutschland", "Österreich", "Schweiz"].includes(value.land) &&
          isOutsideEU(value.land)
            ? "Drittland erkannt — Vertrag erhält automatisch Schrems-II-Klauseln."
            : undefined
        }
      >
        <select
          value={value.land ?? "Deutschland"}
          onChange={(e) => set("land", e.target.value)}
          className="w-full bg-bg-soft border border-line px-4 py-3 text-ink font-body text-base outline-none focus:border-accent transition"
        >
          {LAENDER.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Vertretungsberechtigte Person"
        required
        hint="Wer unterschreibt für die Firma? Mit Funktion (z.B. Geschäftsführer)."
      >
        <TextInput
          placeholder="Max Mustermann, Geschäftsführer"
          value={value.vertretung ?? ""}
          onChange={(e) => set("vertretung", e.target.value)}
          autoComplete="name"
        />
      </Field>

      <Field label="E-Mail" required error={emailError}>
        <TextInput
          type="email"
          placeholder="kontakt@example.de"
          value={value.email ?? ""}
          onChange={(e) => set("email", e.target.value)}
          invalid={!!emailError && !!value.email}
          autoComplete="email"
        />
      </Field>

      <details className="mt-2">
        <summary className="font-mono text-[11px] uppercase tracking-widest text-ink-dim cursor-pointer hover:text-accent transition select-none">
          + Optionale Angaben (Register, USt-ID, Telefon)
        </summary>
        <div className="flex flex-col gap-4 pt-4">
          <Field label="Telefon">
            <TextInput
              placeholder="+49 711 123456"
              value={value.telefon ?? ""}
              onChange={(e) => set("telefon", e.target.value)}
              autoComplete="tel"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Registergericht">
              <TextInput
                placeholder="Amtsgericht Stuttgart"
                value={value.registergericht ?? ""}
                onChange={(e) => set("registergericht", e.target.value)}
              />
            </Field>
            <Field label="HRB-Nr.">
              <TextInput
                placeholder="HRB 123456"
                value={value.hrb ?? ""}
                onChange={(e) => set("hrb", e.target.value)}
              />
            </Field>
          </div>
          <Field label="USt-IdNr.">
            <TextInput
              placeholder="DE123456789"
              value={value.ustId ?? ""}
              onChange={(e) => set("ustId", e.target.value)}
            />
          </Field>
        </div>
      </details>
    </div>
  );
}

function isOutsideEU(land: string): boolean {
  const eu = [
    "Deutschland",
    "Österreich",
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
  ];
  return !eu.includes(land);
}
