"use client";

import { useState } from "react";
import { useAvvStore } from "@/lib/avv/store";
import type { Vertragspartei } from "@/lib/avv/types";
import { validateEmail, validatePlz } from "@/lib/avv/schema";
import { Field, TextInput } from "../field";

type ServicePreset = Pick<Vertragspartei, "firma" | "strasse" | "plz" | "ort" | "land" | "email">;

const SERVICE_PRESETS: Record<string, ServicePreset> = {
  "Stripe": {
    firma: "Stripe Technology Europe Limited",
    strasse: "The One Building, 1 Grand Canal Street Lower",
    plz: "D02 H210",
    ort: "Dublin 2",
    land: "Irland",
    email: "privacy@stripe.com",
  },
  "Google Workspace": {
    firma: "Google Ireland Limited",
    strasse: "Gordon House, Barrow Street",
    plz: "D04 E5W5",
    ort: "Dublin 4",
    land: "Irland",
    email: "privacy@google.com",
  },
  "Hetzner": {
    firma: "Hetzner Online GmbH",
    strasse: "Industriestraße 25",
    plz: "91710",
    ort: "Gunzenhausen",
    land: "Deutschland",
    email: "privacy@hetzner.com",
  },
  "Mailchimp": {
    firma: "The Rocket Science Group LLC d/b/a Mailchimp",
    strasse: "675 Ponce de Leon Ave NE, Suite 5000",
    plz: "30308",
    ort: "Atlanta, GA",
    land: "USA",
    email: "privacy@mailchimp.com",
  },
  "Vercel": {
    firma: "Vercel Inc.",
    strasse: "340 S Lemon Ave #4133",
    plz: "91789",
    ort: "Walnut, CA",
    land: "USA",
    email: "privacy@vercel.com",
  },
  "Brevo": {
    firma: "Sendinblue SAS",
    strasse: "7 rue de Madrid",
    plz: "75008",
    ort: "Paris",
    land: "Frankreich",
    email: "privacy@brevo.com",
  },
  "Plausible": {
    firma: "Plausible Insights OÜ",
    strasse: "Väike-Paala 1",
    plz: "11415",
    ort: "Tallinn",
    land: "Estland",
    email: "privacy@plausible.io",
  },
  "AWS": {
    firma: "Amazon Web Services EMEA SARL",
    strasse: "38 Avenue John F. Kennedy",
    plz: "L-1855",
    ort: "Luxemburg",
    land: "Luxemburg",
    email: "aws-privacy@amazon.com",
  },
};

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
  const [showPresets, setShowPresets] = useState(false);

  const set = <K extends keyof Vertragspartei>(key: K, v: Vertragspartei[K]) => {
    update(side, { ...value, [key]: v });
  };

  const applyPreset = (name: string) => {
    const preset = SERVICE_PRESETS[name];
    update(side, { ...value, ...preset });
    setShowPresets(false);
  };

  const emailError = validateEmail(value.email ?? "");
  const plzError = validatePlz(value.plz ?? "");

  return (
    <div className="border border-line bg-[rgba(240,236,226,0.5)] p-7 flex flex-col gap-5">
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ letterSpacing: "-0.02em" }}>
          {label}
        </h2>
        <p className="text-ink-dim text-sm mt-1">{hint}</p>
      </div>

      {side === "auftragnehmer" && (
        <div>
          <button
            type="button"
            onClick={() => setShowPresets((p) => !p)}
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent hover:text-ink transition"
          >
            <span aria-hidden="true">{showPresets ? "−" : "+"}</span>
            Bekannten Dienst auswählen (Stripe, Google, Hetzner …)
          </button>
          {showPresets && (
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.keys(SERVICE_PRESETS).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => applyPreset(name)}
                  className="border border-line bg-bg-soft px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-dim hover:border-accent hover:text-accent transition"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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
