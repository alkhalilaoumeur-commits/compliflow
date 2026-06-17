"use client";

import { useState } from "react";
import { useImpressumStore } from "@/lib/impressum/store";
import { slugify } from "@/lib/utils";

export function PdfDownload() {
  const data = useImpressumStore((s) => s.data);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  const filename = () => {
    const name = slugify(
      data.firma || `${data.vorname}-${data.nachname}` || "Impressum",
    );
    const date = new Date().toISOString().split("T")[0];
    return `Impressum_${name}_${date}.pdf`;
  };

  const handleDownload = async () => {
    if (state === "loading") return;
    setState("loading");
    try {
      const { renderImpressumPdf } = await import(
        "@/lib/impressum/pdf/impressum-document"
      );
      const blob = await renderImpressumPdf(data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename();
      a.click();
      URL.revokeObjectURL(url);
      if (typeof window !== "undefined" && typeof (window as any).plausible === "function") {
        (window as any).plausible("PDF Downloaded", { props: { tool: "impressum", tier: "free" } });
      }
      setState("idle");
    } catch (err) {
      console.error("Impressum PDF error:", err);
      setState("error");
      setTimeout(() => setState("idle"), 4000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={state === "loading"}
      className="inline-flex h-12 w-full items-center justify-center gap-3 bg-bg border border-accent text-accent font-mono text-[12px] uppercase tracking-widest transition hover:bg-accent hover:text-bg disabled:opacity-60 disabled:cursor-wait"
    >
      {state === "loading" ? (
        <>
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          PDF wird erstellt …
        </>
      ) : state === "error" ? (
        "Fehler — bitte erneut versuchen"
      ) : (
        <>
          <DownloadIcon />
          PDF herunterladen
        </>
      )}
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="14"
      height="14"
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
