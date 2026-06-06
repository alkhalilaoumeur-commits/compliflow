"use client";

import { useEffect, useState } from "react";
import { useAvvStore } from "@/lib/avv/store";
import { AvvPdfDocument } from "@/lib/avv/pdf/avv-document";
import { getCompletionStatus } from "@/lib/avv/contract";
import { slugify } from "@/lib/utils";

export function PdfDownload() {
  const data = useAvvStore((s) => s.data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [PDFDownloadLink, setComp] = useState<any>(null);

  useEffect(() => {
    let active = true;
    import("@react-pdf/renderer").then((mod) => {
      if (active) setComp(() => mod.PDFDownloadLink);
    });
    return () => {
      active = false;
    };
  }, []);

  const { completedCount, total, checks } = getCompletionStatus(data);
  const isComplete = completedCount === total;
  const missing = Object.entries(checks)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  const filename = `AVV_${slugify(data.auftraggeber.firma || "Vertrag")}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;

  if (!isComplete) {
    return (
      <div className="border border-line bg-bg-soft p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
          Noch unvollständig
        </p>
        <p className="text-sm text-ink-dim mb-3">
          Folgende Bereiche brauchen noch Eingaben:
        </p>
        <ul className="text-sm space-y-1">
          {missing.map((m) => (
            <li key={m} className="flex items-center gap-2">
              <span className="text-accent">×</span>
              <span>{m === "toms" ? "Schutzmaßnahmen (mind. 8)" : m}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!PDFDownloadLink) {
    return (
      <button
        type="button"
        disabled
        className="px-6 py-4 font-mono text-xs uppercase tracking-widest bg-bg-soft border border-line text-ink-dim"
      >
        PDF wird vorbereitet …
      </button>
    );
  }

  return (
    <PDFDownloadLink document={<AvvPdfDocument data={data} />} fileName={filename}>
      {({ loading }: { loading: boolean }) => (
        <span
          className={
            "inline-block px-7 py-4 font-mono text-xs uppercase tracking-widest transition " +
            (loading
              ? "bg-bg-soft border border-line text-ink-dim cursor-wait"
              : "bg-accent text-bg hover:bg-ink cursor-pointer")
          }
        >
          {loading ? "PDF wird erstellt …" : "📄 AVV als PDF herunterladen"}
        </span>
      )}
    </PDFDownloadLink>
  );
}
