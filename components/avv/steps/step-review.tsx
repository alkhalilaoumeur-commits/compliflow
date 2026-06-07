"use client";

import dynamic from "next/dynamic";
import { useAvvStore } from "@/lib/avv/store";
import { WIZARD_STEPS } from "@/lib/avv/types";
import { STANDARD_DATENKATEGORIEN, STANDARD_PERSONENKATEGORIEN } from "@/lib/avv/defaults";
import { ContractPreview } from "../contract-preview";

const PdfDownload = dynamic(
  () => import("../pdf-download").then((m) => m.PdfDownload),
  {
    ssr: false,
    loading: () => (
      <button
        type="button"
        disabled
        className="px-6 py-4 font-mono text-xs uppercase tracking-widest bg-bg-soft border border-line text-ink-dim"
      >
        PDF-Modul wird geladen …
      </button>
    ),
  },
);

export function StepReview() {
  const data = useAvvStore((s) => s.data);
  const setStep = useAvvStore((s) => s.setStep);

  const labelOfDatenkategorie = (id: string) =>
    STANDARD_DATENKATEGORIEN.find((c) => c.id === id)?.label ?? id;
  const labelOfPersonenkategorie = (id: string) =>
    STANDARD_PERSONENKATEGORIEN.find((c) => c.id === id)?.label ?? id;

  return (
    <div className="grid lg:grid-cols-[1fr_1fr] gap-10">
      {/* Linke Seite: Zusammenfassung + Download */}
      <div className="flex flex-col gap-6">
        <Section title="Vertragsparteien" onEdit={() => setStep("parteien")}>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
                Verantwortlicher
              </div>
              <div className="font-display font-bold">{data.auftraggeber.firma || "—"}</div>
              <div className="text-sm text-ink-dim">
                {data.auftraggeber.strasse}, {data.auftraggeber.plz} {data.auftraggeber.ort}
              </div>
              <div className="text-sm text-ink-dim mt-1">
                {data.auftraggeber.vertretung} · {data.auftraggeber.email}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
                Auftragsverarbeiter
              </div>
              <div className="font-display font-bold">{data.auftragnehmer.firma || "—"}</div>
              <div className="text-sm text-ink-dim">
                {data.auftragnehmer.strasse}, {data.auftragnehmer.plz} {data.auftragnehmer.ort}
              </div>
              <div className="text-sm text-ink-dim mt-1">
                {data.auftragnehmer.vertretung} · {data.auftragnehmer.email}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Verarbeitung" onEdit={() => setStep("verarbeitung")}>
          <div className="text-sm space-y-3">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                Gegenstand
              </span>
              <p className="mt-1">{data.verarbeitung.gegenstand || "—"}</p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                Zweck
              </span>
              <p className="mt-1">{data.verarbeitung.zweck || "—"}</p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                Arten ({(data.verarbeitung.arten ?? []).length})
              </span>
              <p className="mt-1">{(data.verarbeitung.arten ?? []).join(", ") || "—"}</p>
            </div>
          </div>
        </Section>

        <Section
          title={`Datenkategorien (${
            data.datenkategorien.length + data.datenkategorienCustom.length
          })`}
          onEdit={() => setStep("datenkategorien")}
        >
          <div className="flex flex-wrap gap-2">
            {data.datenkategorien.map((id) => (
              <Tag key={id}>{labelOfDatenkategorie(id)}</Tag>
            ))}
            {data.datenkategorienCustom.map((v, i) => (
              <Tag key={`c${i}`}>{v}</Tag>
            ))}
          </div>
        </Section>

        <Section
          title={`Betroffene (${
            data.personenkategorien.length + data.personenkategorienCustom.length
          })`}
          onEdit={() => setStep("personenkategorien")}
        >
          <div className="flex flex-wrap gap-2">
            {data.personenkategorien.map((id) => (
              <Tag key={id}>{labelOfPersonenkategorie(id)}</Tag>
            ))}
            {data.personenkategorienCustom.map((v, i) => (
              <Tag key={`c${i}`}>{v}</Tag>
            ))}
          </div>
        </Section>

        <Section title={`Schutzmaßnahmen (${data.toms.length} TOMs)`} onEdit={() => setStep("toms")}>
          <div className="text-sm text-ink-dim">
            {data.toms.length === 0
              ? "Noch keine TOMs gewählt — bitte mindestens 8 wählen (eine pro Kategorie)."
              : `${data.toms.length} Maßnahmen über ${
                  new Set(data.toms.map((t) => t.kategorie)).size
                } Kategorien.`}
          </div>
        </Section>

        <Section
          title={`Subverarbeiter (${data.subverarbeiter.length})`}
          onEdit={() => setStep("subverarbeiter")}
        >
          {data.subverarbeiter.length === 0 ? (
            <p className="text-sm text-ink-dim">Keine eingetragen — Vertrag enthält Klausel „derzeit nicht vorgesehen".</p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {data.subverarbeiter.map((s) => (
                <li key={s.id} className="flex items-center justify-between">
                  <span>
                    {s.firma} · {s.zweck}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                    {s.land}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Unterschrift" onEdit={() => {}}>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">
                Ort der Unterschrift
              </span>
              <input
                type="text"
                placeholder="Stuttgart"
                value={data.abschlussOrt}
                onChange={(e) =>
                  useAvvStore.getState().patch({ abschlussOrt: e.target.value })
                }
                className="bg-bg-soft border border-line px-4 py-3 text-ink outline-none focus:border-accent transition"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">
                Datum
              </span>
              <input
                type="date"
                value={data.abschlussDatum}
                onChange={(e) =>
                  useAvvStore.getState().patch({ abschlussDatum: e.target.value })
                }
                className="bg-bg-soft border border-line px-4 py-3 text-ink outline-none focus:border-accent transition"
              />
            </label>
          </div>
        </Section>

        <div className="border-l-2 border-accent bg-accent-soft p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
            Wichtiger Hinweis (Disclaimer)
          </p>
          <p className="text-sm text-ink-dim">
            Diese Vorlage erfüllt die Pflichtinhalte nach Art. 28 Abs. 3 DSGVO,
            <strong className="text-ink"> ersetzt jedoch keine individuelle Rechtsberatung</strong>.
            Wir empfehlen vor Unterschrift eine Prüfung durch einen Rechtsanwalt oder
            Datenschutzbeauftragten — insbesondere bei besonderen Datenkategorien (Art. 9 DSGVO)
            oder Drittland-Transfers.
          </p>
        </div>

        <div className="border-t border-line pt-6">
          <p className="text-sm text-ink-dim mb-4">
            Bereit zum Download. Der AVV enthält 13 Paragraphen nach Art. 28 DSGVO plus 3 Anlagen.
          </p>
          <PdfDownload />
        </div>
      </div>

      {/* Rechte Seite: Live-Preview */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-dim mb-3 flex items-center justify-between">
          <span>Live-Vorschau</span>
          <span className="text-accent">aktualisiert sich beim Bearbeiten</span>
        </div>
        <div className="relative border border-line shadow-[0_20px_60px_-30px_rgba(31,61,47,0.2)]">
          <div className="max-h-[78vh] overflow-y-auto">
            <ContractPreview />
          </div>
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-16"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(21,23,27,0.6))" }}
            aria-hidden="true"
          />
          <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[rgba(246,242,234,0.6)]">
              Scrollen für mehr
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-line bg-[rgba(240,236,226,0.3)] p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-lg" style={{ letterSpacing: "-0.02em" }}>
          {title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="font-mono text-[10px] uppercase tracking-widest text-ink-dim hover:text-accent transition"
        >
          Bearbeiten →
        </button>
      </div>
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-3 py-1.5 bg-bg-soft border border-line text-sm">
      {children}
    </span>
  );
}
