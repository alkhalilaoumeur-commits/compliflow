"use client";

import { useState } from "react";
import { useCookieBannerStore } from "@/lib/cookie-banner/store";
import { buildSnippet, buildAnleitung } from "@/lib/cookie-banner/builder";
import { useWatermarkStore } from "@/lib/watermark/store";

type Mode = "snippet" | "anleitung";

export function SnippetExport() {
  const data = useCookieBannerStore((s) => s.data);
  const isBought = useWatermarkStore((s) => s.isBought("cookie_banner"));
  const [mode, setMode] = useState<Mode>("snippet");
  const [copied, setCopied] = useState(false);

  const content = mode === "snippet"
    ? buildSnippet(data, { credit: !isBought })
    : buildAnleitung(data);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      if (typeof window !== "undefined" && typeof (window as any).plausible === "function") {
        (window as any).plausible("Cookie Banner Copied", { props: { mode, stil: data.stil } });
      }
    } catch {
      // fallback: nichts
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 border border-line bg-bg p-1">
        <button
          type="button"
          onClick={() => setMode("snippet")}
          className={
            "flex-1 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition " +
            (mode === "snippet"
              ? "bg-accent text-bg"
              : "text-ink-dim hover:text-ink")
          }
        >
          Snippet
        </button>
        <button
          type="button"
          onClick={() => setMode("anleitung")}
          className={
            "flex-1 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition " +
            (mode === "anleitung"
              ? "bg-accent text-bg"
              : "text-ink-dim hover:text-ink")
          }
        >
          Anleitung
        </button>
      </div>

      <pre className="bg-bg border border-line p-3 text-[11px] text-ink-dim font-mono max-h-48 overflow-auto whitespace-pre-wrap leading-relaxed">
        {content}
      </pre>

      <button
        type="button"
        onClick={copy}
        className={
          "inline-flex h-12 items-center justify-center gap-2 font-mono text-[12px] uppercase tracking-widest transition " +
          (copied
            ? "bg-accent text-bg"
            : "bg-accent text-bg hover:bg-ink")
        }
      >
        {copied ? "✓ Kopiert!" : `${mode === "snippet" ? "Snippet" : "Anleitung"} in Zwischenablage`}
      </button>

      {mode === "snippet" && (
        <p className="text-[11px] text-ink-faded leading-relaxed">
          Tipp: Diesen Block direkt VOR dem schließenden{" "}
          <code className="bg-bg border border-line px-1">{"</body>"}</code>-Tag deiner Webseite
          einfügen. Tracking-Skripte (GA4, Pixel, …) NICHT mehr separat einbinden — der Banner
          lädt sie selbst nach Consent.
        </p>
      )}
    </div>
  );
}
