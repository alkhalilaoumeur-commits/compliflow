"use client";

import { useEffect, useState } from "react";
import { useAvvStore } from "@/lib/avv/store";
import { AvvPdfDocument } from "@/lib/avv/pdf/avv-document";
import { getCompletionStatus } from "@/lib/avv/contract";
import { useVerifiedWatermark } from "@/lib/watermark/use-verified-watermark";
import { slugify } from "@/lib/utils";

const STEP_LABELS = {
  parteien: "Vertragsparteien vollständig ausfüllen",
  verarbeitung: "Gegenstand, Zweck, Dauer und Verarbeitungsart angeben",
  datenkategorien: "Mind. 1 Datenkategorie auswählen",
  personenkategorien: "Mind. 1 Betroffenengruppe auswählen",
  toms: "Schutzmaßnahmen (mind. 1 pro Kategorie, 8 Kategorien)",
  subverarbeiter: "Subverarbeiter-Schritt abschließen",
  review: "Unterschrift vervollständigen",
};

export function PdfDownload() {
  const data = useAvvStore((s) => s.data);
  const isBought = useVerifiedWatermark("avv") === "verified";
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
              <span>{STEP_LABELS[m as keyof typeof STEP_LABELS] ?? m}</span>
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
    <div className="flex flex-col gap-2">
      <div
        onClick={() => {
          if (typeof window !== "undefined" && typeof (window as any).plausible === "function") {
            (window as any).plausible("PDF Downloaded", { props: { tool: "avv", tier: isBought ? "paid" : "free" } });
          }
        }}
      >
        <PDFDownloadLink document={<AvvPdfDocument data={data} showCredit={!isBought} />} fileName={filename}>
          {({ loading }: { loading: boolean }) => (
            <span
              className={
                "inline-flex h-14 w-full items-center justify-center gap-3 font-mono text-[13px] uppercase tracking-widest transition " +
                (loading
                  ? "bg-bg-soft border border-line text-ink-dim cursor-wait"
                  : "bg-accent text-bg hover:bg-ink cursor-pointer")
              }
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[rgba(246,242,234,1)] border-t-[rgba(246,242,234,0.3)]" />
                  PDF wird erstellt …
                </>
              ) : (
                <>
                  <DownloadIcon />
                  AVV als PDF herunterladen
                </>
              )}
            </span>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 2v8M5 7l3 3 3-3M2 12h12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
