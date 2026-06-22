"use client";

import { useState } from "react";
import { useAgbStore } from "@/lib/agb/store";
import { buildHtml, getCompletionStatus } from "@/lib/agb/contract";
import { HtmlExport } from "../html-export";
import { useVerifiedWatermark } from "@/lib/watermark/use-verified-watermark";
import { WatermarkRemoveButton } from "@/components/watermark/remove-button";
import { CaptureCard } from "@/components/email-capture/capture-card";

export function StepReview() {
  const data = useAgbStore((s) => s.data);
  const isBought = useVerifiedWatermark("agb") === "verified";
  const reset = useAgbStore((s) => s.reset);
  const [pdfState, setPdfState] = useState<"idle" | "info">("idle");
  const { allValid } = getCompletionStatus(data);
  const [confirmReset, setConfirmReset] = useState(false);

  // HTML ohne <section>-Wrap für Inline-Preview
  const html = buildHtml(data, { credit: false, wrap: false });

  const handlePdf = () => {
    setPdfState("info");
    setTimeout(() => setPdfState("idle"), 4000);
    if (typeof window !== "undefined" && typeof (window as any).plausible === "function") {
      (window as any).plausible("AGB PDF Attempt", {
        props: { status: "coming-soon", variante: data.variante },
      });
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
            Nicht alle Pflichtschritte nach §§ 305-310 BGB sind ausgefüllt.
            Bitte alle Schritte abschließen, bevor du die AGB einsetzt.
          </p>
        </div>
      )}

      {/* Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            Vorschau — so sehen deine AGB aus
          </p>
        </div>

        <div className="border border-line bg-bg p-8 shadow-sm max-h-[700px] overflow-auto">
          <div
            className="agb-preview font-body text-[14px] leading-[1.6] text-ink leading-relaxed prose-compliflow"
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
          .agb-preview :global(h1) {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0 0 0.75rem;
          }
          .agb-preview :global(h2) {
            font-size: 1rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--accent, #1F3D2F);
            margin: 1.5rem 0 0.5rem;
          }
          .agb-preview :global(h3) {
            font-size: 0.875rem;
            font-weight: 600;
            margin: 1rem 0 0.5rem;
          }
          .agb-preview :global(p) {
            margin: 0 0 0.75rem;
          }
          .agb-preview :global(ul) {
            margin: 0 0 0.75rem;
            padding-left: 1.25rem;
          }
          .agb-preview :global(li) {
            margin: 0.25rem 0;
            list-style: disc;
          }
          .agb-preview :global(strong) {
            font-weight: 600;
          }
        `}</style>
      </div>

      {/* Export-Panel */}
      <aside className="flex flex-col gap-6">
        <WatermarkRemoveButton docType="agb" returnPath="/agb-generator" />

        <CaptureCard quelle="agb" />

        <div className="border border-line bg-bg-soft p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-2">
            HTML — empfohlen
          </p>
          <p className="font-display text-lg font-medium text-ink mb-1">
            In Webseite einfügen
          </p>
          <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
            Code kopieren und auf deiner AGB-Seite einfügen. Funktioniert mit jedem
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
            Compliflow generiert AGB nach §§ 305-310 BGB mit Standard-Klauseln pro Variante. Bei
            besonderen Konstellationen (Mischverträge, Plattformen, internationaler Vertrieb)
            lass die AGB vom Anwalt prüfen.
          </p>
        </div>

        <div className="border border-line bg-bg p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-2">
            Zurücksetzen
          </p>
          <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-3 leading-relaxed">
            Alle Eingaben verwerfen und mit einem leeren Wizard neu starten.
          </p>
          {confirmReset ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setConfirmReset(false);
                }}
                className="font-mono text-[10px] uppercase tracking-widest text-warn hover:underline transition"
              >
                Ja, zurücksetzen
              </button>
              <span className="font-mono text-[10px] text-ink-faded">·</span>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="font-mono text-[10px] uppercase tracking-widest text-ink-dim hover:text-ink transition"
              >
                Abbrechen
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="font-mono text-[10px] uppercase tracking-widest text-ink-faded hover:text-warn transition"
            >
              Wizard zurücksetzen
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
