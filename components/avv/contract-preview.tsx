"use client";

import { useAvvStore } from "@/lib/avv/store";
import { buildContract, buildAnlagen } from "@/lib/avv/contract";
import { formatDateDE } from "@/lib/utils";

export function ContractPreview() {
  const data = useAvvStore((s) => s.data);
  const blocks = buildContract(data);
  const anlagen = buildAnlagen(data);

  return (
    <div className="bg-ink text-bg p-8 max-w-3xl mx-auto font-body text-sm leading-relaxed">
      {/* Deckblatt */}
      <header className="text-center pb-8 mb-8 border-b-2 border-[rgba(246,242,234,0.8)]">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[rgba(246,242,234,0.6)] mb-3">
          Auftragsverarbeitungsvertrag
        </p>
        <h1
          className="font-display font-bold text-4xl mb-3"
          style={{ letterSpacing: "-0.03em" }}
        >
          AVV nach Art. 28 DSGVO
        </h1>
        <p className="text-sm text-[rgba(246,242,234,0.7)]">
          Zwischen <strong>{data.auftraggeber.firma || "—"}</strong> und{" "}
          <strong>{data.auftragnehmer.firma || "—"}</strong>
        </p>
        <p className="text-xs text-[rgba(246,242,234,0.5)] mt-2">
          Erstellt: {formatDateDE(new Date())}
        </p>
      </header>

      {/* Vertragstext */}
      {blocks.map((block) => (
        <section key={block.id} className="mb-7">
          <h2 className="font-display font-bold text-lg mb-3" style={{ letterSpacing: "-0.02em" }}>
            {block.number && <span className="text-accent mr-2">{block.number}</span>}
            {block.title}
          </h2>
          {block.paragraphs.map((p, i) => (
            <p key={i} className="mb-2 text-[13px] leading-relaxed">
              {p}
            </p>
          ))}
        </section>
      ))}

      {/* Anlagen */}
      {anlagen.map((anlage) => (
        <section key={anlage.id} className="mt-10 pt-6 border-t border-[rgba(246,242,234,0.3)]">
          <h2 className="font-display font-bold text-lg mb-4" style={{ letterSpacing: "-0.02em" }}>
            {anlage.title}
          </h2>
          {anlage.content.type === "tom-table" && (
            <div className="space-y-4">
              {anlage.content.groups.map((g) => (
                <div key={g.kategorie}>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1">
                    {g.kategorie}
                  </p>
                  <ul className="list-disc list-inside text-[12px] space-y-1">
                    {g.items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {anlage.content.type === "sub-table" && (
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-[rgba(246,242,234,0.4)] text-left">
                  <th className="py-2 pr-2 font-mono text-[10px] uppercase tracking-widest">Firma</th>
                  <th className="py-2 pr-2 font-mono text-[10px] uppercase tracking-widest">Sitz</th>
                  <th className="py-2 pr-2 font-mono text-[10px] uppercase tracking-widest">Zweck</th>
                  <th className="py-2 pr-2 font-mono text-[10px] uppercase tracking-widest">Land</th>
                  <th className="py-2 font-mono text-[10px] uppercase tracking-widest">Garantie</th>
                </tr>
              </thead>
              <tbody>
                {anlage.content.rows.map((r, i) => (
                  <tr key={i} className="border-b border-[rgba(246,242,234,0.2)]">
                    <td className="py-2 pr-2">{r.firma}</td>
                    <td className="py-2 pr-2">{r.sitz}</td>
                    <td className="py-2 pr-2">{r.zweck}</td>
                    <td className="py-2 pr-2">{r.land}</td>
                    <td className="py-2">{r.garantie}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {anlage.content.type === "data-categories" && (
            <div className="space-y-3 text-[12px]">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1">
                  Datenkategorien
                </p>
                <p>{anlage.content.daten.join(", ") || "—"}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1">
                  Betroffene Personen
                </p>
                <p>{anlage.content.personen.join(", ") || "—"}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-1">
                  Verarbeitungsarten
                </p>
                <p>{anlage.content.arten.join(", ") || "—"}</p>
              </div>
            </div>
          )}
        </section>
      ))}

      {/* Unterschrift */}
      <section className="mt-12 pt-8 border-t-2 border-[rgba(246,242,234,0.8)] grid grid-cols-2 gap-12">
        <div>
          <p className="text-[10px] text-[rgba(246,242,234,0.6)] mb-2">
            {data.abschlussOrt || "—"}, den {data.abschlussDatum ? formatDateDE(data.abschlussDatum) : "—"}
          </p>
          <div className="border-b border-[rgba(246,242,234,0.6)] pb-1 mb-2 h-8">&nbsp;</div>
          <p className="text-[11px] text-[rgba(246,242,234,0.7)]">
            Unterschrift Verantwortlicher
            <br />
            <strong>{data.auftraggeber.vertretung || "—"}</strong>
            <br />
            {data.auftraggeber.firma || ""}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[rgba(246,242,234,0.6)] mb-2">
            {data.abschlussOrt || "—"}, den {data.abschlussDatum ? formatDateDE(data.abschlussDatum) : "—"}
          </p>
          <div className="border-b border-[rgba(246,242,234,0.6)] pb-1 mb-2 h-8">&nbsp;</div>
          <p className="text-[11px] text-[rgba(246,242,234,0.7)]">
            Unterschrift Auftragsverarbeiter
            <br />
            <strong>{data.auftragnehmer.vertretung || "—"}</strong>
            <br />
            {data.auftragnehmer.firma || ""}
          </p>
        </div>
      </section>

      <footer className="mt-10 pt-4 border-t border-[rgba(246,242,234,0.3)] text-center">
        <p className="font-mono text-[9px] uppercase tracking-widest text-[rgba(246,242,234,0.5)]">
          Erstellt mit Compliflow · compliflow.de
        </p>
      </footer>
    </div>
  );
}
