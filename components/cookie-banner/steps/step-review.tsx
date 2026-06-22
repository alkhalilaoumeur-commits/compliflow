"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCookieBannerStore } from "@/lib/cookie-banner/store";
import { buildSnippet } from "@/lib/cookie-banner/builder";
import { SnippetExport } from "../snippet-export";
import { useVerifiedWatermark } from "@/lib/watermark/use-verified-watermark";
import { WatermarkRemoveButton } from "@/components/watermark/remove-button";
import { CaptureCard } from "@/components/email-capture/capture-card";

export function StepReview() {
  const data = useCookieBannerStore((s) => s.data);
  const isBought = useVerifiedWatermark("cookie_banner") === "verified";
  const reset = useCookieBannerStore((s) => s.reset);
  const [pdfState, setPdfState] = useState<"idle" | "info">("idle");
  const [confirmReset, setConfirmReset] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Snippet komplett neu bauen, sobald sich data ändert
  const snippet = useMemo(() => buildSnippet(data, { credit: false }), [data]);

  // srcDoc: HTML-Stub + Snippet + Auto-Show
  const srcDoc = useMemo(() => {
    return `<!DOCTYPE html>
<html lang="${data.sprache}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Vorschau</title>
<style>
  html, body { margin: 0; padding: 0; height: 100%; background: #FAFAF7; font-family: system-ui, -apple-system, sans-serif; }
  .stub {
    padding: 24px;
    color: #6B6B66;
    font-size: 13px;
    line-height: 1.5;
    max-width: 520px;
  }
  .stub h2 { font-size: 14px; font-weight: 600; margin: 0 0 8px; color: #0A0906; }
  .stub p { margin: 0 0 8px; }
</style>
</head>
<body>
<div class="stub">
  <h2>Demo-Webseite</h2>
  <p>Dies ist eine simulierte Seite, damit du siehst, wie dein Cookie-Banner für Besucher aussieht.</p>
  <p>Klicke die Buttons im Banner, um das Verhalten zu testen — der Consent wird hier nicht real gespeichert.</p>
</div>
${snippet}
<script>
  // Banner sofort sichtbar machen (autoOeffnen kann inaktiv sein, wir wollen aber immer Preview)
  (function() {
    function show() {
      var b = document.getElementById("compliflow-cb");
      if (b) b.hidden = false;
      var bd = document.getElementById("compliflow-cb-backdrop");
      if (bd) bd.style.display = "block";
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function() { setTimeout(show, 50); });
    } else {
      setTimeout(show, 50);
    }
  })();
</script>
</body>
</html>`;
  }, [snippet, data.sprache]);

  // iframe srcDoc neu setzen bei jedem Datenwechsel
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = srcDoc;
    }
  }, [srcDoc]);

  const handlePdf = () => {
    setPdfState("info");
    setTimeout(() => setPdfState("idle"), 4000);
    if (typeof window !== "undefined" && typeof (window as any).plausible === "function") {
      (window as any).plausible("Cookie Banner PDF Attempt", {
        props: { status: "coming-soon", stil: data.stil },
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 max-w-6xl">
      {/* Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            Live-Vorschau — so sieht dein Banner aus
          </p>
        </div>

        <div className="border border-line bg-bg shadow-sm overflow-hidden">
          <iframe
            ref={iframeRef}
            srcDoc={srcDoc}
            title="Cookie-Banner Live-Vorschau"
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-[500px] bg-white"
            style={{ border: "none", display: "block" }}
          />
        </div>

        <p className="text-[11px] text-ink-faded mt-3 leading-relaxed">
          Das Banner reagiert hier wie auf einer echten Webseite. Klicks auf Accept/Reject
          schließen den Banner in der Vorschau. Reload (Strg+R) öffnet ihn wieder.
        </p>

        <div className="mt-6 pt-4 border-t border-line">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">
            Erstellt mit Compliflow · compliflow.de · made by DRVN
          </p>
        </div>
      </div>

      {/* Export-Panel */}
      <aside className="flex flex-col gap-6">
        <WatermarkRemoveButton docType="cookie_banner" returnPath="/cookie-banner-generator" />

        <CaptureCard quelle="cookie_banner" />

        <div className="border border-line bg-bg-soft p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-2">
            Snippet — empfohlen
          </p>
          <p className="font-display text-lg font-medium text-ink mb-1">
            In Webseite einfügen
          </p>
          <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
            Kompletter HTML+JS+CSS-Block. Vor dem schließenden{" "}
            <code className="bg-bg border border-line px-1 text-[11px]">{"</body>"}</code>{" "}
            einfügen. Funktioniert mit jeder Webseite.
          </p>
          <SnippetExport />
        </div>

        <div className="border border-line bg-bg-soft p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-2">
            PDF — Backup / Druck
          </p>
          <p className="font-display text-lg font-medium text-ink mb-1">
            Als PDF herunterladen
          </p>
          <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
            Snippet-Code mit Dokumentation als PDF. Praktisch für Nachweis bei
            Aufsichtsbehörden oder Audit.
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
              PDF-Export kommt bald. Für den Moment den Snippet- oder Anleitungs-Tab nutzen —
              beide sind für die Doku verwendbar.
            </p>
          )}
        </div>

        <div className="border border-dashed border-line bg-bg p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-2">
            Hinweis
          </p>
          <p className="font-body text-[14px] leading-[1.6] text-ink-dim">
            Compliflow erzeugt einen BGH-2025-konformen Banner mit gleich prominenten
            Accept/Reject-Buttons. Bei IAB-TCF, US-Datenübermittlungen oder Drittland-Transfers
            zusätzlich Anwalt konsultieren.
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
