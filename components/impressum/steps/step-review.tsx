"use client";

import { useImpressumStore } from "@/lib/impressum/store";
import { buildSections } from "@/lib/impressum/contract";
import { useWatermarkStore } from "@/lib/watermark/store";
import { WatermarkRemoveButton } from "@/components/watermark/remove-button";
import { CaptureCard } from "@/components/email-capture/capture-card";
import { HtmlExport } from "../html-export";
import { PdfDownload } from "../pdf-download";

export function StepReview() {
  const data = useImpressumStore((s) => s.data);
  const sections = buildSections(data);
  const isBought = useWatermarkStore((s) => s.isBought("impressum"));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 max-w-6xl">
      {/* Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            Vorschau — so sieht dein Impressum aus
          </p>
          <p className="font-mono text-[10px] text-ink-faded">
            {sections.length} Sektion{sections.length !== 1 ? "en" : ""}
          </p>
        </div>

        <div className="border border-line bg-bg p-8 shadow-sm">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink mb-6">
            Impressum
          </h1>

          {sections.map((sec) => (
            <div key={sec.id} className="mb-6 last:mb-0">
              {sec.title && (
                <h2 className="font-display text-sm font-bold text-accent uppercase tracking-wider mb-2">
                  {sec.title}
                </h2>
              )}
              <p className="font-body text-[14px] leading-[1.6] text-ink leading-relaxed whitespace-pre-line">
                {sec.body}
              </p>
            </div>
          ))}

          {!isBought && (
            <div className="mt-8 pt-4 border-t border-line">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
                Erstellt mit Compliflow · compliflow.de · made by DRVN
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Export-Panel */}
      <aside className="flex flex-col gap-6">
        <WatermarkRemoveButton docType="impressum" returnPath="/impressum-generator" />

        <CaptureCard quelle="impressum" />

        <div className="border border-line bg-bg-soft p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-2">
            HTML — empfohlen
          </p>
          <p className="font-display text-lg font-medium text-ink mb-1">
            In Webseite einfügen
          </p>
          <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
            Code kopieren und auf deiner Impressums-Seite einfügen. Funktioniert mit jedem
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
            Zum Archivieren, Ausdrucken oder als Nachweis bei behördlichen Anfragen.
          </p>
          <PdfDownload />
        </div>

        <div className="border border-dashed border-line bg-bg p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-2">
            Hinweis
          </p>
          <p className="font-body text-[14px] leading-[1.6] text-ink-dim">
            Compliflow generiert ein Impressum mit allen Standard-Pflichtangaben nach § 5 DDG.
            Bei besonderen Konstellationen (z. B. Konzernstrukturen, Sonderaufsicht, ausländische
            Niederlassung) lass es vom Anwalt prüfen.
          </p>
        </div>
      </aside>
    </div>
  );
}
