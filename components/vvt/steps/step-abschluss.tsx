"use client";

import { useVvtStore } from "@/lib/vvt/store";
import { VvtPdfDownload } from "../pdf-download";
import { RECHTSGRUNDLAGEN_LABELS, DRITTLAND_GARANTIE_LABELS } from "@/lib/vvt/types";

export function StepAbschluss() {
  const data = useVvtStore((s) => s.data);
  const v = data.verantwortlicher;

  const isReady =
    !!(v.bezeichnung && v.name && v.email) && data.taetigkeiten.length >= 1;

  const avMissing = data.taetigkeiten.flatMap((t) =>
    t.empfaenger
      .filter((e) => e.istAuftragsverarbeiter && !e.avvVorhanden)
      .map((e) => ({ taetigkeit: t.bezeichnung, empfaenger: e.name }))
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      {/* Preview */}
      <div className="flex flex-col gap-8">
        {/* Verantwortlicher Summary */}
        <section>
          <SectionLabel>Verantwortliche Stelle</SectionLabel>
          <div className="border border-line bg-[rgba(240,236,226,0.4)] p-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <DataRow label="Unternehmen" value={v.bezeichnung ?? "—"} />
            <DataRow label="Vertreter" value={v.name ?? "—"} />
            <DataRow
              label="Anschrift"
              value={[v.strasse, `${v.plz ?? ""} ${v.ort ?? ""}`.trim(), v.land]
                .filter(Boolean)
                .join(", ")}
            />
            <DataRow label="E-Mail" value={v.email ?? "—"} />
            {v.hatDsb && v.dsb && (
              <DataRow
                label="DSB"
                value={`${v.dsb.name} · ${v.dsb.email}`}
              />
            )}
          </div>
        </section>

        {/* Tätigkeiten Preview */}
        <section>
          <SectionLabel>
            {data.taetigkeiten.length} Verarbeitungstätigkeit{data.taetigkeiten.length !== 1 ? "en" : ""}
          </SectionLabel>
          {data.taetigkeiten.length === 0 ? (
            <div className="border border-dashed border-line p-6 text-center text-ink-dim text-sm">
              Noch keine Tätigkeiten — bitte zurückgehen und Tätigkeiten hinzufügen.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {data.taetigkeiten.map((t, idx) => (
                <div key={t.id} className="border border-line bg-[rgba(240,236,226,0.3)] p-5">
                  <div className="flex items-baseline gap-3 mb-3 pb-3 border-b border-line">
                    <span className="font-mono text-[10px] text-accent">
                      VVT-{String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className="font-display font-semibold text-[17px]"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {t.bezeichnung}
                    </h3>
                    {t.besondereKategorien && (
                      <span className="font-mono text-[9px] uppercase tracking-widest border border-accent text-accent px-1.5 py-0.5">
                        Art. 9
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[13px]">
                    <DataRow label="Zweck" value={t.zweck} full />
                    <DataRow
                      label="Rechtsgrundlage"
                      value={t.rechtsgrundlagen
                        .map((rg) => RECHTSGRUNDLAGEN_LABELS[rg])
                        .join("; ")}
                      full
                    />
                    <DataRow
                      label="Betroffene"
                      value={t.betroffenengruppen.join(", ")}
                    />
                    <DataRow
                      label="Datenkategorien"
                      value={`${t.datenkategorien.length} Kategorien`}
                    />
                    <DataRow
                      label="Empfänger"
                      value={`${t.empfaenger.length} (${t.empfaenger.filter((e) => e.istAuftragsverarbeiter).length} AV)`}
                    />
                    <DataRow
                      label="Drittland"
                      value={DRITTLAND_GARANTIE_LABELS[t.drittlandGarantie]}
                    />
                    <DataRow label="Löschfristen" value={t.loeschfristen} full />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Warnings */}
        {avMissing.length > 0 && (
          <section>
            <div className="border border-[rgba(154,93,26,0.4)] bg-[rgba(154,93,26,0.05)] p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-warn mb-2 flex items-center gap-1.5">
                <svg className="h-3 w-3 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.5L1.5 13h13L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M8 6v3.5M8 11.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Fehlende AVV-Verträge
              </p>
              <p className="text-sm text-ink-dim mb-3">
                Folgende Auftragsverarbeiter benötigen einen AVV nach Art. 28 DSGVO:
              </p>
              <ul className="flex flex-col gap-1.5">
                {avMissing.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-ink-dim">
                    <span className="text-warn">—</span>
                    <strong>{item.empfaenger}</strong>
                    <span className="text-ink-faded">in Tätigkeit: {item.taetigkeit}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/avv"
                className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-accent hover:text-ink transition"
              >
                AVV-Generator öffnen →
              </a>
            </div>
          </section>
        )}

        {/* Completeness checklist */}
        <section>
          <SectionLabel>Pflichtangaben nach Art. 30 DSGVO</SectionLabel>
          <div className="flex flex-col gap-2">
            {[
              {
                label: "Verantwortlicher vollständig",
                ok: !!(v.bezeichnung && v.name && v.strasse && v.plz && v.ort && v.email),
              },
              {
                label: `${data.taetigkeiten.length} Verarbeitungstätigkeit(en) erfasst`,
                ok: data.taetigkeiten.length >= 1,
              },
              {
                label: "Alle Tätigkeiten haben Rechtsgrundlage",
                ok: data.taetigkeiten.every((t) => t.rechtsgrundlagen.length >= 1),
              },
              {
                label: "Alle Tätigkeiten haben Empfänger dokumentiert",
                ok: data.taetigkeiten.every((t) => t.empfaenger.length >= 1),
              },
              {
                label: "Löschfristen erfasst",
                ok: data.taetigkeiten.every((t) => t.loeschfristen.trim().length > 0),
              },
              {
                label: "Drittland-Status dokumentiert",
                ok: data.taetigkeiten.every((t) => !!t.drittlandGarantie),
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 py-2 border-b border-line last:border-0">
                <span
                  className={`flex-shrink-0 inline-flex h-5 w-5 items-center justify-center border transition ${
                    item.ok
                      ? "bg-accent border-accent text-bg"
                      : "border-line bg-bg-soft text-ink-faded"
                  }`}
                  aria-hidden="true"
                >
                  {item.ok ? (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span className="font-mono text-[10px]">○</span>
                  )}
                </span>
                <span className={`text-sm ${item.ok ? "text-ink-dim" : "text-warn"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Download panel */}
      <div className="flex flex-col gap-5 lg:pt-2">
        <div className="border border-line bg-surface p-6 shadow-sm sticky top-24">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded mb-4">
            PDF Exportieren
          </p>

          <VvtPdfDownload data={data} disabled={!isReady} />

          {!isReady && (
            <p className="mt-3 text-xs text-warn">
              Verantwortlichen vollständig ausfüllen und mindestens eine Tätigkeit
              hinzufügen, bevor der PDF-Export möglich ist.
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2.5 border-t border-line pt-4">
            <InfoRow text="Art. 30 DSGVO konform" />
            <InfoRow text="Alle Pflichtfelder nach Art. 30 DSGVO" />
            <InfoRow text="Kein Datenspeichern auf Server" />
            <InfoRow text="Daten bleiben lokal im Browser" />
          </div>

          <div className="mt-5 border-t border-line pt-4">
            <p className="text-xs text-ink-faded leading-relaxed">
              Das VVT ersetzt keine Rechtsberatung. Bei Unsicherheiten einen
              Datenschutzberater hinzuziehen. Jährliche Überprüfungspflicht beachten
              (Art. 30 Abs. 4 DSGVO).
            </p>
          </div>
        </div>

        {/* Cross-tool hint */}
        <div className="border border-[rgba(226,221,209,0.6)] bg-accent-soft p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
            AVV-Generator
          </p>
          <p className="text-sm text-ink-dim">
            Dein VVT hat{" "}
            {avMissing.length > 0 ? (
              <strong>{avMissing.length} Auftragsverarbeiter ohne AVV</strong>
            ) : (
              "Auftragsverarbeiter"
            )}
            . Erstelle AVV-Musterdokumente nach Art. 28 DSGVO im AVV-Generator.
          </p>
          <a
            href="/avv"
            className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-accent hover:text-ink transition"
          >
            AVV erstellen →
          </a>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded mb-3">
      {children}
    </p>
  );
}

function DataRow({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faded block mb-0.5">
        {label}
      </span>
      <span className="text-ink">{value || "—"}</span>
    </div>
  );
}

function InfoRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5 font-body text-[13px] text-ink-dim">
      <span className="flex-shrink-0 font-mono text-[11px] text-accent" aria-hidden="true">✓</span>
      <span>{text}</span>
    </div>
  );
}
