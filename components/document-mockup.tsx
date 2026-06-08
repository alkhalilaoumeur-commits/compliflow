export function DocumentMockup() {
  const clauses = [
    { n: "§ 1", title: "Gegenstand und Dauer", widths: [85, 72, 60] },
    { n: "§ 2", title: "Art und Zweck", widths: [78, 90, 55] },
    { n: "§ 3", title: "Pflichten des Verarbeiters", widths: [92, 68, 80] },
    { n: "§ 4", title: "Weisungsrecht", widths: [70, 85] },
  ];

  return (
    <div className="relative w-full select-none" aria-hidden="true">
      {/* Shadow layer 2 */}
      <div
        className="absolute border border-[rgba(226,221,209,0.5)]"
        style={{
          inset: 0,
          transform: "translate(12px, 12px)",
          background: "rgba(236,232,222,0.5)",
        }}
      />
      {/* Shadow layer 1 */}
      <div
        className="absolute border border-[rgba(226,221,209,0.7)]"
        style={{
          inset: 0,
          transform: "translate(6px, 6px)",
          background: "rgba(242,238,228,0.7)",
        }}
      />

      {/* Main document */}
      <div
        className="relative"
        style={{
          background: "#FAFAF6",
          border: "1px solid rgba(226,221,209,0.9)",
          boxShadow: "0 8px 32px rgba(15,18,14,0.1)",
        }}
      >
        {/* Document header */}
        <div
          className="px-6 py-5 border-b"
          style={{ borderColor: "rgba(226,221,209,0.7)", background: "rgba(240,236,226,0.4)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-faded mb-1.5">
                Compliflow · Art. 28 DSGVO
              </p>
              <h3 className="font-display text-[17px] font-semibold leading-tight text-ink">
                Auftragsverarbeitungsvertrag
              </h3>
              <p className="font-body text-[11px] text-ink-dim mt-1">
                Zwischen Auftraggeber und Auftragsverarbeiter
              </p>
            </div>
            {/* PDF ready badge */}
            <span
              className="flex-shrink-0 font-mono text-[9px] uppercase tracking-[0.15em] px-2.5 py-1.5 text-bg"
              style={{ background: "var(--color-accent)" }}
            >
              PDF ✓
            </span>
          </div>
        </div>

        {/* Document body */}
        <div className="px-6 py-5 space-y-4">
          {clauses.map((clause) => (
            <div key={clause.n}>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-mono text-[10px] font-bold text-accent">{clause.n}</span>
                <span className="font-display text-[13px] font-semibold text-ink">{clause.title}</span>
              </div>
              <div className="space-y-1.5 pl-6">
                {clause.widths.map((w, i) => (
                  <div
                    key={i}
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${w}%`,
                      background: "rgba(200,195,180,0.6)",
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Signature area */}
        <div
          className="px-6 pt-4 pb-5 border-t grid grid-cols-2 gap-6"
          style={{ borderColor: "rgba(226,221,209,0.7)", background: "rgba(240,236,226,0.25)" }}
        >
          {["Auftraggeber", "Auftragsverarbeiter"].map((label) => (
            <div key={label}>
              <div
                className="h-8 mb-2 border-b"
                style={{ borderColor: "rgba(150,145,130,0.5)" }}
              />
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink-faded">{label}</p>
              <p className="font-mono text-[8px] text-ink-faded opacity-50">Datum: ___________</p>
            </div>
          ))}
        </div>

        {/* Footer stamp */}
        <div
          className="px-6 py-2 flex items-center justify-between border-t"
          style={{ borderColor: "rgba(226,221,209,0.5)", background: "rgba(240,236,226,0.2)" }}
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-ink-faded opacity-60">
            Erstellt mit Compliflow
          </span>
          <span className="font-mono text-[8px] text-ink-faded opacity-60">
            compliflow.de
          </span>
        </div>
      </div>
    </div>
  );
}
