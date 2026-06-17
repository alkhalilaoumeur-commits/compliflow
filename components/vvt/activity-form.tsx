"use client";

import { useState } from "react";
import type {
  Verarbeitungstaetigkeit,
  Empfaenger,
  Rechtsgrundlage,
  Datenherkunft,
  DsfaStatus,
  KiRisikoklasse,
  KiSystem,
  GemeinsamVerantwortlich,
  LegitimateInterestAssessment,
} from "@/lib/vvt/types";
import {
  RECHTSGRUNDLAGEN_LABELS,
  DRITTLAND_GARANTIE_LABELS,
  STANDARD_BETROFFENENGRUPPEN,
  STANDARD_DATENKATEGORIEN,
  STANDARD_EMPFAENGER_KATEGORIEN,
  DATENHERKUNFT_LABELS,
  DSFA_STATUS_LABELS,
  KI_RISIKO_LABELS,
} from "@/lib/vvt/types";
import { Field, TextInput, TextArea } from "@/components/avv/field";

type Props = {
  value: Verarbeitungstaetigkeit;
  onChange: (partial: Partial<Verarbeitungstaetigkeit>) => void;
};

const EMPFAENGER_PRESETS: Omit<Empfaenger, "id">[] = [
  { name: "Stripe", kategorie: "Zahlungsdienstleister", istAuftragsverarbeiter: true, land: "Irland", avvVorhanden: false },
  { name: "Google Workspace", kategorie: "IT-Dienstleister / Hosting", istAuftragsverarbeiter: true, land: "Irland", avvVorhanden: false },
  { name: "Hetzner", kategorie: "IT-Dienstleister / Hosting", istAuftragsverarbeiter: true, land: "Deutschland", avvVorhanden: false },
  { name: "Mailchimp", kategorie: "E-Mail-Dienstleister", istAuftragsverarbeiter: true, land: "USA", avvVorhanden: false },
  { name: "Brevo", kategorie: "E-Mail-Dienstleister", istAuftragsverarbeiter: true, land: "Frankreich", avvVorhanden: false },
  { name: "Vercel", kategorie: "IT-Dienstleister / Hosting", istAuftragsverarbeiter: true, land: "USA", avvVorhanden: false },
  { name: "AWS", kategorie: "IT-Dienstleister / Hosting", istAuftragsverarbeiter: true, land: "Luxemburg", avvVorhanden: false },
  { name: "DATEV", kategorie: "Steuerberater / Buchhalter", istAuftragsverarbeiter: true, land: "Deutschland", avvVorhanden: false },
  { name: "Lexoffice", kategorie: "Steuerberater / Buchhalter", istAuftragsverarbeiter: true, land: "Deutschland", avvVorhanden: false },
  { name: "Zoom", kategorie: "IT-Dienstleister / Hosting", istAuftragsverarbeiter: true, land: "USA", avvVorhanden: false },
];

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

  const addEmpfaengerFromPreset = (preset: Omit<Empfaenger, "id">) => {
    const alreadyExists = value.empfaenger.some(
      (e) => e.name.toLowerCase() === preset.name.toLowerCase()
    );
    if (alreadyExists) return;
    onChange({
      empfaenger: [
        ...value.empfaenger,
        { id: `emp-${Date.now()}`, ...preset },
      ],
    });
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
                  className={`mt-0.5 flex-shrink-0 inline-flex h-4 w-4 items-center justify-center border transition ${
                    active ? "bg-accent border-accent text-bg" : "bg-bg-soft border-line-strong"
                  }`}
                  aria-hidden="true"
                >
                  {active && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
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
          <div className="mt-4 border border-line bg-[rgba(240,236,226,0.4)] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
              LIA — Drei-Stufen-Prüfung nach Art. 6 Abs. 1 lit. f
            </p>
            <p className="text-[12px] text-ink-dim mb-4 leading-snug">
              Pflicht bei berechtigtem Interesse: dokumentiere die Abwägung schriftlich
              (Stufenprüfung des EuGH und der Aufsichtsbehörden).
            </p>
            <div className="flex flex-col gap-3">
              <Field
                label="Berechtigtes Interesse — kurze Bezeichnung"
                hint="Klassisches Kurz-Feld für VVT-Übersicht"
              >
                <TextInput
                  placeholder="z.B. IT-Sicherheit und fehlerfreier Webseitenbetrieb (ErwG 49)"
                  value={value.berechtigtesInteresseDetail ?? ""}
                  onChange={(e) =>
                    onChange({ berechtigtesInteresseDetail: e.target.value })
                  }
                />
              </Field>
              <Field
                label="Stufe 1 — Identifikation des Interesses"
                hint="Welches konkrete Interesse wird verfolgt? (rechtlich, wirtschaftlich, ideell)"
              >
                <TextArea
                  placeholder="z.B. Wirtschaftliches Interesse an effizienter Bestandskundenkommunikation"
                  value={value.lia?.zweckIdentifiziert ?? ""}
                  onChange={(e) =>
                    onChange({
                      lia: {
                        zweckIdentifiziert: e.target.value,
                        notwendigkeitBegruendet: value.lia?.notwendigkeitBegruendet ?? "",
                        interessenabwaegung: value.lia?.interessenabwaegung ?? "",
                      },
                    })
                  }
                  rows={2}
                />
              </Field>
              <Field
                label="Stufe 2 — Notwendigkeit (Erforderlichkeit)"
                hint="Ist die Verarbeitung erforderlich? Gibt es mildere Mittel?"
              >
                <TextArea
                  placeholder="z.B. Direktwerbung an Bestandskunden ist erforderlich und nicht durch mildere Mittel ersetzbar"
                  value={value.lia?.notwendigkeitBegruendet ?? ""}
                  onChange={(e) =>
                    onChange({
                      lia: {
                        zweckIdentifiziert: value.lia?.zweckIdentifiziert ?? "",
                        notwendigkeitBegruendet: e.target.value,
                        interessenabwaegung: value.lia?.interessenabwaegung ?? "",
                      },
                    })
                  }
                  rows={2}
                />
              </Field>
              <Field
                label="Stufe 3 — Interessenabwägung"
                hint="Überwiegt das Interesse die Rechte/Freiheiten der Betroffenen? Vernünftige Erwartung?"
              >
                <TextArea
                  placeholder="z.B. Bestandskunden erwarten Newsletter zu vergleichbaren Produkten, Widerspruchsmöglichkeit in jeder Mail gegeben"
                  value={value.lia?.interessenabwaegung ?? ""}
                  onChange={(e) =>
                    onChange({
                      lia: {
                        zweckIdentifiziert: value.lia?.zweckIdentifiziert ?? "",
                        notwendigkeitBegruendet: value.lia?.notwendigkeitBegruendet ?? "",
                        interessenabwaegung: e.target.value,
                      },
                    })
                  }
                  rows={2}
                />
              </Field>
            </div>
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

      {/* Scoring-Hinweis bei Bonitätsdaten */}
      {value.datenkategorien.some((d) => d.toLowerCase().includes("bonität") || d.toLowerCase().includes("scoring")) && (
        <div className="border-l-2 border-warn bg-[rgba(154,93,26,0.06)] px-4 py-3 -mt-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-warn mb-1">
            Scoring &amp; Bonität — Pflichten 2026
          </p>
          <p className="text-[12px] text-ink-dim leading-snug">
            <strong className="text-ink">EuGH C-634/21 (07.12.2023, verbindlich):</strong>{" "}
            Wenn Dritte (Banken, Vermieter, Versandhandel) eine Entscheidung „maßgeblich" auf einen
            Score stützen, gilt der Score selbst als automatisierte Einzelentscheidung
            i.S.d. Art. 22 DSGVO. Folge: Auskunftsanspruch über Scoring-Logik (Art. 15), DSFA empfohlen,
            Score-Erläuterung in der Datenschutzerklärung Pflicht.
            {"\n\n"}
            <strong className="text-ink">SCHUFA-Score 100–999 (freiwillig, ab 2026):</strong>{" "}
            Die SCHUFA hat angekündigt, ihren Score-Wert auf eine neue Skala umzustellen — das ist
            eine Selbstverpflichtung der SCHUFA, kein Gesetz. Eine BDSG-Reform zum Scoring (§ 31 BDSG-neu)
            liegt als Gesetzentwurf vor, ist aber noch nicht verabschiedet.
          </p>
        </div>
      )}

      {/* Datenherkunft (H3) */}
      <section>
        <SectionLabel n={5}>Datenherkunft (Art. 13 / 14 DSGVO)</SectionLabel>
        <p className="mb-3 text-sm text-ink-dim">
          Bestimmt, welche Informationspflichten gelten — Art. 13 (direkt) oder Art. 14 (indirekt erhoben).
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {(Object.keys(DATENHERKUNFT_LABELS) as Datenherkunft[]).map((h) => {
            const active = value.datenherkunft === h;
            return (
              <button
                key={h}
                type="button"
                onClick={() => onChange({ datenherkunft: h })}
                className={`text-left border p-3 transition ${
                  active
                    ? "border-accent bg-accent-soft text-ink"
                    : "border-line hover:border-[rgba(31,61,47,0.5)] text-ink-dim"
                }`}
              >
                <div className="font-body text-[13px] font-medium">
                  {DATENHERKUNFT_LABELS[h].kurz}
                </div>
                <div className="mt-1 text-[11px] text-ink-faded leading-snug">
                  {DATENHERKUNFT_LABELS[h].lang}
                </div>
              </button>
            );
          })}
        </div>
        {value.datenherkunft === "indirekt" && (
          <p className="mt-2 text-[12px] text-warn border border-[rgba(154,93,26,0.3)] bg-[rgba(154,93,26,0.05)] px-3 py-2">
            Bei indirekter Erhebung: Art. 14 DSGVO verlangt Information binnen 1 Monat,
            Angabe der Datenquelle in der Datenschutzerklärung, ggf. der konkreten Drittquelle.
          </p>
        )}
      </section>

      {/* Empfänger */}
      <section>
        <SectionLabel n={6}>Empfänger & Auftragsverarbeiter</SectionLabel>
        <p className="mb-4 text-sm text-ink-dim">
          Wer bekommt Zugriff auf die Daten? Auch Auftragsverarbeiter (Softwareanbieter, Dienstleister)
          gehören hier rein.
        </p>

        {/* Quick-Add Presets */}
        <div className="mb-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded mb-2">
            Schnell hinzufügen
          </p>
          <div className="flex flex-wrap gap-2">
            {EMPFAENGER_PRESETS.map((preset) => {
              const alreadyAdded = value.empfaenger.some(
                (e) => e.name.toLowerCase() === preset.name.toLowerCase()
              );
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => addEmpfaengerFromPreset(preset)}
                  disabled={alreadyAdded}
                  className={`border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition ${
                    alreadyAdded
                      ? "border-accent bg-accent-soft text-accent cursor-default"
                      : "border-line bg-bg-soft text-ink-dim hover:border-accent hover:text-accent"
                  }`}
                >
                  {alreadyAdded ? "✓ " : "+ "}{preset.name}
                </button>
              );
            })}
          </div>
        </div>

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
            <span>Eigenen Empfänger hinzufügen</span>
          </button>
        </div>
      </section>

      {/* Joint Controller (H1) */}
      <section>
        <SectionLabel n={7}>Gemeinsame Verantwortlichkeit (Art. 26 DSGVO)</SectionLabel>
        <label className="flex items-start gap-3 cursor-pointer">
          <div
            className={`mt-0.5 h-4 w-4 border flex-shrink-0 flex items-center justify-center transition ${
              value.gemeinsamVerantwortlich?.istGemeinsam ? "bg-accent border-accent" : "bg-bg-soft border-line"
            }`}
            onClick={() => {
              const current = value.gemeinsamVerantwortlich;
              onChange({
                gemeinsamVerantwortlich: {
                  istGemeinsam: !current?.istGemeinsam,
                  partner: current?.partner ?? "",
                  zustaendigkeit: current?.zustaendigkeit ?? "",
                  vereinbarungLink: current?.vereinbarungLink,
                },
              });
            }}
          >
            {value.gemeinsamVerantwortlich?.istGemeinsam && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="#F6F2EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">
              Diese Verarbeitung erfolgt gemeinsam verantwortlich mit einem Dritten
            </span>
            <p className="mt-1 text-[12px] text-ink-faded leading-snug">
              Typische Fälle: Meta Pixel, Facebook Business Suite, Google Ads, LinkedIn Insight Tag,
              Co-Hosted Webinare. Pflicht nach Art. 26 Abs. 1 DSGVO: schriftliche Vereinbarung über
              die Aufteilung der Datenschutzpflichten.
            </p>
          </div>
        </label>
        {value.gemeinsamVerantwortlich?.istGemeinsam && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Gemeinsam Verantwortlicher (Partner)" required>
              <TextInput
                placeholder="z.B. Meta Platforms Ireland Limited"
                value={value.gemeinsamVerantwortlich.partner}
                onChange={(e) =>
                  onChange({
                    gemeinsamVerantwortlich: {
                      ...value.gemeinsamVerantwortlich!,
                      partner: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Link zur Joint-Controller-Vereinbarung (optional)">
              <TextInput
                placeholder="https://www.facebook.com/legal/controller_addendum"
                value={value.gemeinsamVerantwortlich.vereinbarungLink ?? ""}
                onChange={(e) =>
                  onChange({
                    gemeinsamVerantwortlich: {
                      ...value.gemeinsamVerantwortlich!,
                      vereinbarungLink: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <div className="sm:col-span-2">
              <Field
                label="Aufteilung der Pflichten"
                required
                hint="Wer ist wofür zuständig? (Informationspflichten Art. 13/14, Betroffenenrechte Art. 15-22, Sicherheit Art. 32, Datenpannen Art. 33/34)"
              >
                <TextArea
                  placeholder="z.B. Wir sind zuständig für: Information der Betroffenen, Einholung der Cookie-Einwilligung, Bearbeitung von Auskunftsersuchen erstinstanzlich. Meta ist zuständig für: technische Sicherheit der Pixel-Übermittlung, Speicherung im Meta-Backend."
                  value={value.gemeinsamVerantwortlich.zustaendigkeit}
                  onChange={(e) =>
                    onChange({
                      gemeinsamVerantwortlich: {
                        ...value.gemeinsamVerantwortlich!,
                        zustaendigkeit: e.target.value,
                      },
                    })
                  }
                  rows={3}
                />
              </Field>
            </div>
          </div>
        )}
      </section>

      {/* Drittland */}
      <section>
        <SectionLabel n={8}>Drittland-Transfer (Art. 44 ff. DSGVO)</SectionLabel>
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
                    className={`mt-0.5 flex-shrink-0 inline-flex h-4 w-4 items-center justify-center rounded-full border transition ${
                      active ? "bg-accent border-accent" : "bg-bg-soft border-line-strong"
                    }`}
                    aria-hidden="true"
                  >
                    {active && <span className="inline-block h-1.5 w-1.5 rounded-full bg-bg" />}
                  </span>
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
        <SectionLabel n={9}>Löschfristen</SectionLabel>
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
        <SectionLabel n={10}>Technisch-organisatorische Maßnahmen (Art. 32)</SectionLabel>
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

      {/* DSFA-Indikator (M2) */}
      <section>
        <SectionLabel n={11}>Datenschutz-Folgenabschätzung (Art. 35 DSGVO)</SectionLabel>
        <p className="mb-3 text-sm text-ink-dim">
          Pflicht bei voraussichtlich hohem Risiko (z.B. systematische Überwachung,
          besondere Kategorien, Profiling mit erheblichen Auswirkungen).
        </p>
        <div className="grid gap-2">
          {(Object.keys(DSFA_STATUS_LABELS) as DsfaStatus[]).map((s) => {
            const active = value.dsfaStatus === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ dsfaStatus: s })}
                className={`flex items-center gap-3 border p-3 text-left text-[13px] transition ${
                  active
                    ? "border-accent bg-accent-soft text-ink"
                    : "border-line hover:border-[rgba(31,61,47,0.5)] text-ink-dim"
                }`}
              >
                <span
                  className={`inline-flex h-4 w-4 items-center justify-center rounded-full border transition ${
                    active ? "bg-accent border-accent" : "bg-bg-soft border-line-strong"
                  }`}
                >
                  {active && <span className="inline-block h-1.5 w-1.5 rounded-full bg-bg" />}
                </span>
                {DSFA_STATUS_LABELS[s]}
              </button>
            );
          })}
        </div>
        {value.dsfaStatus === "dsfa-ausstehend" && (
          <p className="mt-2 text-[12px] text-warn border border-[rgba(154,93,26,0.3)] bg-[rgba(154,93,26,0.05)] px-3 py-2">
            Eine ausstehende DSFA ist ein dokumentierter Mangel. Vor Aufnahme der Verarbeitung
            muss die DSFA durchgeführt sein (Art. 35 Abs. 1 DSGVO).
          </p>
        )}
      </section>

      {/* KI-System (M3 — AI Act ab 02.08.2026) */}
      <KiSystemeBlock value={value.kiSysteme} onChange={(k) => onChange({ kiSysteme: k })} />

      {/* Letzte Prüfung (L1) */}
      <section>
        <SectionLabel n={13}>Letzte interne Prüfung</SectionLabel>
        <p className="mb-3 text-sm text-ink-dim">
          Best-Practice: VVT-Einträge mindestens jährlich überprüfen. Datum erleichtert
          spätere Audits durch die Aufsichtsbehörde.
        </p>
        <Field label="Datum der letzten Prüfung">
          <TextInput
            type="date"
            value={value.letztGeprueft ?? ""}
            onChange={(e) => onChange({ letztGeprueft: e.target.value })}
          />
        </Field>
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

// ─────────────────────────────────────────────────────────────────────────────
// KI-Systeme Block (AI Act Art. 25/50, ab 02.08.2026)
// ─────────────────────────────────────────────────────────────────────────────

function KiSystemeBlock({
  value,
  onChange,
}: {
  value: KiSystem[];
  onChange: (k: KiSystem[]) => void;
}) {
  const addKi = () => {
    onChange([
      ...value,
      { bezeichnung: "", risikoklasse: "begrenztes-risiko", anbieter: "" },
    ]);
  };
  const updateKi = (idx: number, partial: Partial<KiSystem>) => {
    onChange(value.map((k, i) => (i === idx ? { ...k, ...partial } : k)));
  };
  const removeKi = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };
  return (
    <section>
      <SectionLabel n={12}>KI-Einsatz (EU AI Act, ab 02.08.2026)</SectionLabel>
      <p className="mb-3 text-sm text-ink-dim">
        Werden in dieser Verarbeitung KI-Systeme eingesetzt? Bei Hochrisiko-Systemen
        (Anhang III AI Act) sind ab 02.08.2026 zusätzliche Pflichten zu erfüllen (DSFA,
        Konformitätsbewertung, menschliche Aufsicht).
      </p>
      {value.length === 0 && (
        <p className="mb-3 text-[12px] text-ink-faded">
          Bisher kein KI-System erfasst — wenn keines eingesetzt wird, kannst du diesen Abschnitt
          leer lassen.
        </p>
      )}
      <div className="flex flex-col gap-3">
        {value.map((k, idx) => (
          <div key={idx} className="border border-line bg-[rgba(240,236,226,0.6)] p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Bezeichnung des KI-Systems">
                <TextInput
                  placeholder="z.B. ChatGPT-Integration, HR-Screening-Tool"
                  value={k.bezeichnung}
                  onChange={(e) => updateKi(idx, { bezeichnung: e.target.value })}
                />
              </Field>
              <Field label="Anbieter">
                <TextInput
                  placeholder="z.B. OpenAI, Google, Eigenentwicklung"
                  value={k.anbieter}
                  onChange={(e) => updateKi(idx, { anbieter: e.target.value })}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Risikoklasse nach AI Act">
                  <select
                    value={k.risikoklasse}
                    onChange={(e) =>
                      updateKi(idx, { risikoklasse: e.target.value as KiRisikoklasse })
                    }
                    className="w-full bg-bg-soft border border-line px-4 py-3 text-ink font-body text-sm outline-none focus:border-accent transition"
                  >
                    {(Object.keys(KI_RISIKO_LABELS) as KiRisikoklasse[]).map((r) => (
                      <option key={r} value={r}>
                        {KI_RISIKO_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </Field>
                {k.risikoklasse === "hochrisiko" && (
                  <p className="mt-2 text-[12px] text-warn border border-[rgba(154,93,26,0.3)] bg-[rgba(154,93,26,0.05)] px-3 py-2">
                    Hochrisiko-System: ab 02.08.2026 sind Konformitätsbewertung, Risikomanagement,
                    DSFA und menschliche Aufsicht (Art. 14 AI Act) Pflicht.
                  </p>
                )}
                {k.risikoklasse === "verboten" && (
                  <p className="mt-2 text-[12px] text-warn border border-warn bg-[rgba(154,93,26,0.08)] px-3 py-2">
                    Verbotene Praktik nach Art. 5 AI Act — Einsatz seit 02.02.2025 untersagt.
                    Verarbeitung sofort einstellen.
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeKi(idx)}
              className="mt-3 font-mono text-[10px] uppercase tracking-widest text-ink-faded hover:text-warn transition"
            >
              × Entfernen
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addKi}
          className="flex items-center gap-2 border border-dashed border-line px-4 py-3 text-sm text-ink-dim hover:border-accent hover:text-accent transition font-mono uppercase tracking-widest"
        >
          <span>+</span>
          <span>KI-System hinzufügen</span>
        </button>
      </div>
    </section>
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
            <>
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
              {value.avvVorhanden && (
                <div className="pl-6">
                  <input
                    type="text"
                    placeholder="Pfad/URL zum AVV-Dokument (z.B. /docs/avv-stripe.pdf)"
                    value={value.avvDokumentLink ?? ""}
                    onChange={(e) => onChange({ avvDokumentLink: e.target.value })}
                    className="w-full bg-bg-soft border border-line px-3 py-1.5 text-[12px] text-ink placeholder:text-ink-faded outline-none focus:border-accent transition"
                  />
                </div>
              )}
            </>
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
