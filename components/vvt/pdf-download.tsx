"use client";

import { useState } from "react";
import type { VvtFormData } from "@/lib/vvt/types";
import { useVerifiedWatermark } from "@/lib/watermark/use-verified-watermark";

type Props = {
  data: VvtFormData;
  disabled?: boolean;
};

export function VvtPdfDownload({ data, disabled }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const isBought = useVerifiedWatermark("vvt") === "verified";

  const handleDownload = async () => {
    if (state === "loading" || disabled) return;
    setState("loading");
    try {
      const { renderVvtPdf } = await import("@/lib/vvt/pdf/vvt-document");
      const blob = await renderVvtPdf(data, !isBought);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const name = (data.verantwortlicher.bezeichnung ?? "Unternehmen")
        .replace(/\s+/g, "-")
        .toLowerCase();
      const dateStr = data.letztAktualisiert.slice(0, 10);
      a.download = `VVT-${name}-${dateStr}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      if (typeof window !== "undefined" && typeof (window as any).plausible === "function") {
        (window as any).plausible("PDF Downloaded", { props: { tool: "vvt", tier: isBought ? "paid" : "free" } });
      }
      setState("idle");
    } catch (err) {
      console.error("VVT PDF error:", err);
      setState("error");
      setTimeout(() => setState("idle"), 4000);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={disabled || state === "loading"}
        className="inline-flex h-14 w-full items-center justify-center gap-3 bg-accent text-bg font-mono text-[13px] uppercase tracking-widest transition hover:bg-ink disabled:bg-bg-soft disabled:text-ink-faded disabled:cursor-not-allowed"
      >
        {state === "loading" ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-bg border-t-[rgba(246,242,234,0.3)]" />
            PDF wird erstellt …
          </>
        ) : state === "error" ? (
          "Fehler — bitte erneut versuchen"
        ) : (
          <>
            <DownloadIcon />
            VVT als PDF herunterladen
          </>
        )}
      </button>
      <p className="text-center font-mono text-[10px] uppercase tracking-widest text-ink-faded">
        Art. 30 DSGVO · {data.taetigkeiten.length} Tätigkeit
        {data.taetigkeiten.length !== 1 ? "en" : ""}
      </p>
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
