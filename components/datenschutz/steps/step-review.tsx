"use client";

import { useState } from "react";
import { useDatenschutzStore } from "@/lib/datenschutz/store";
import { buildHtml, getCompletionStatus } from "@/lib/datenschutz/contract";
import { HtmlExport } from "../html-export";
import { useVerifiedWatermark } from "@/lib/watermark/use-verified-watermark";
import { WatermarkRemoveButton } from "@/components/watermark/remove-button";
import { CaptureCard } from "@/components/email-capture/capture-card";

export function StepReview() {
  const data = useDatenschutzStore((s) => s.data);
  const isBought = useVerifiedWatermark("datenschutz") === "verified";
  const [pdfState, setPdfState] = useState<"idle" | "info">("idle");
  const { allValid } = getCompletionStatus(data);

  // HTML ohne <section>-Wrap für Inline-Preview
  const html = buildHtml(data, { credit: false, wrap: false });

  const handlePdf = () => {
    setPdfState("info");
    setTimeout(() => setPdfState("idle"), 4000);
    if (typeof window !== "undefined" && typeof (window as any).plausible === "function") {
      (window as any).plausible("Datenschutz PDF Attempt", { props: { status: "coming-soon" } });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 max-w-6xl">
      {!allValid && (
        <div className="col-span-full mb-2 border border-[rgba(154,93,26,0.4)] bg-[rgba(154,93,26,0.05)] p-4 flex items-start gap-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-warn" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 1.5L1.5 13h13L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M8 6v3.5M8 11.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p className="font-body text-[13px] text-ink-dim">
            <strong className="text-warn">Unvollständig.</strong>{" "}
            Nicht alle Pflichtschritte nach Art. 13/14 DSGVO sind ausgefüllt.
            Bitte alle Schritte abschließen, bevor du die Datenschutzerklärung einsetzt.
          </p>
        </div>
      )}

      {/* Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            Vorschau — so sieht dein Datenschutz aus
          </p>
        </div>

        <div className="border border-line bg-bg p-8 shadow-sm max-h-[700px] overflow-auto">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink mb-6">
            Datenschutzerklärung
          </h1>

          <div
            className="datenschutz-preview font-body text-[14px] leading-[1.6] text-ink leading-relaxed prose-compliflow"
            // buildHtml liefert sicheres HTML aus eigener Quelle (escape im contract.ts)
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <div className="mt-8 pt-4 border-t border-line">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
              Erstellt mit Compliflow · compliflow.de · made by DRVN
            </p>
          </div>
        </div>

        <style jsx>{`
          .datenschutz-preview :global(h1) {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 1.5rem 0 0.75rem;
          }
          .datenschutz-preview :global(h2) {
            font-size: 1rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--accent, #1F3D2F);
            margin: 1.5rem 0 0.5rem;
          }
          .datenschutz-preview :global(h3) {
            font-size: 0.875rem;
            font-weight: 600;
            margin: 1rem 0 0.5rem;
          }
          .datenschutz-preview :global(p) {
            margin: 0 0 0.75rem;
          }
          .datenschutz-preview :global(ul) {
            margin: 0 0 0.75rem;
            padding-left: 1.25rem;
          }
          .datenschutz-preview :global(li) {
            margin: 0.25rem 0;
            list-style: disc;
          }
          .datenschutz-preview :global(strong) {
            font-weight: 600;
          }
        `}</style>
      </div>

      {/* Export-Panel */}
      <aside className="flex flex-col gap-6">
        <WatermarkRemoveButton docType="datenschutz" returnPath="/datenschutz-generator" />

        <CaptureCard quelle="datenschutz" />

        <div className="border border-line bg-bg-soft p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-2">
            HTML — empfohlen
          </p>
          <p className="font-display text-lg font-medium text-ink mb-1">
            In Webseite einfügen
          </p>
          <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
            Code kopieren und auf deiner Datenschutz-Seite einfügen. Funktioniert mit jedem
            Webseiten-Builder.
          </p>
          <HtmlExport />
        </div>

        <div className="border border-line bg-bg-soft p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-2">
            PDF — Backup / Druck
          </p>
          <p className="font-display text-lg font-medium text-ink mb-1">
            Als PDF herunterladen
          </p>
          <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
            Zum Archivieren oder als Nachweis bei behördlichen Anfragen.
          </p>
          <button
            type="button"
            onClick={handlePdf}
            className="inline-flex h-12 w-full items-center justify-center gap-3 bg-bg border border-accent text-accent font-mono text-[12px] uppercase tracking-widest transition hover:bg-accent hover:text-bg"
          >
            PDF herunterladen
          </button>
          {pdfState === "info" && (
            <p className="text-[11px] text-ink-faded mt-2 leading-relaxed">
              PDF-Export kommt bald. Für den Moment den HTML- oder Plaintext-Export nutzen — beide
              sind als Druck-Backup verwendbar.
            </p>
          )}
        </div>

        <div className="border border-dashed border-line bg-bg p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-2">
            Hinweis
          </p>
          <p className="font-body text-[14px] leading-[1.6] text-ink-dim">
            Compliflow generiert eine Datenschutzerklärung mit allen Standard-Pflichtangaben nach
            Art. 13/14 DSGVO + § 25 TDDDG. Bei besonderen Konstellationen (Konzernstrukturen,
            Auftragsdatenverarbeitung von Konzern-Kunden, etc.) lass es vom Anwalt prüfen.
          </p>
        </div>
      </aside>
    </div>
  );
}
