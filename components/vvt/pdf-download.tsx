"use client";

import { useEffect, useState } from "react";
import type { VvtFormData } from "@/lib/vvt/types";

type Props = {
  data: VvtFormData;
  disabled?: boolean;
};

export function VvtPdfDownload({ data, disabled }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("compliflow_pro_vvt");
    if (stored) {
      fetch(`/api/stripe/verify-session?sessionId=${encodeURIComponent(stored)}`)
        .then((r) => r.json())
        .then((d: { valid?: boolean; tool?: string }) => {
          if (d.valid && d.tool === "vvt") {
            setIsPro(true);
          } else {
            localStorage.removeItem("compliflow_pro_vvt");
          }
        })
        .catch(() => {}); // Netzwerkfehler: kein Pro-Zugang — sicherer als optimistisch zu erlauben
    }
  }, []);

  const handleDownload = async () => {
    if (state === "loading" || disabled) return;
    setState("loading");
    try {
      const { renderVvtPdf } = await import("@/lib/vvt/pdf/vvt-document");
      const blob = await renderVvtPdf(data, isPro);
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
      setState("idle");
    } catch (err) {
      console.error("VVT PDF error:", err);
      setState("error");
      setTimeout(() => setState("idle"), 4000);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {isPro && (
        <div className="flex items-center gap-2 bg-accent-soft border border-[rgba(31,61,47,0.3)] px-4 py-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
            Pro aktiv
          </span>
          <span className="font-body text-[12px] text-ink-dim">— PDF ohne Compliflow-Branding</span>
        </div>
      )}
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
      {!isPro && (
        <div className="mt-1 border border-[rgba(31,61,47,0.25)] bg-[rgba(31,61,47,0.04)] p-4 flex flex-col gap-3">
          <div className="flex items-start gap-2.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent mt-0.5">Pro</span>
            <div>
              <p className="font-body text-[13px] text-ink font-medium leading-snug">PDF ohne Compliflow-Branding</p>
              <p className="font-body text-[12px] text-ink-dim mt-0.5">
                Für Mandanten, Geschäftspartner oder behördliche Einreichungen — 29 € einmalig, kein Abo.
              </p>
            </div>
          </div>
          <a
            href="/preise"
            className="inline-flex h-10 w-full items-center justify-center gap-2 border border-accent font-mono text-[11px] uppercase tracking-widest text-accent hover:bg-accent hover:text-bg transition"
          >
            Pro kaufen — 29 €
          </a>
        </div>
      )}
      {isPro && (
        <p className="text-center font-mono text-[10px] uppercase tracking-widest text-ink-faded">
          Art. 30 DSGVO · {data.taetigkeiten.length} Tätigkeit
          {data.taetigkeiten.length !== 1 ? "en" : ""}
        </p>
      )}
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
