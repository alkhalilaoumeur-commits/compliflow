"use client";

import { useState } from "react";
import { useWiderrufStore } from "@/lib/widerrufsbelehrung/store";
import { buildHtml, buildPlaintext } from "@/lib/widerrufsbelehrung/contract";
import { useWatermarkStore } from "@/lib/watermark/store";

type Mode = "html" | "text";

export function HtmlExport() {
  const data = useWiderrufStore((s) => s.data);
  const isBought = useWatermarkStore((s) => s.isBought("widerruf"));
  const [mode, setMode] = useState<Mode>("html");
  const [copied, setCopied] = useState(false);

  const content = mode === "html"
    ? buildHtml(data, { credit: !isBought })
    : buildPlaintext(data);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      if (typeof window !== "undefined" && typeof (window as any).plausible === "function") {
        (window as any).plausible("Widerruf Copied", { props: { mode } });
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
          onClick={() => setMode("html")}
          className={
            "flex-1 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition " +
            (mode === "html"
              ? "bg-accent text-bg"
              : "text-ink-dim hover:text-ink")
          }
        >
          HTML
        </button>
        <button
          type="button"
          onClick={() => setMode("text")}
          className={
            "flex-1 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition " +
            (mode === "text"
              ? "bg-accent text-bg"
              : "text-ink-dim hover:text-ink")
          }
        >
          Plaintext
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
        {copied ? "✓ Kopiert!" : `${mode === "html" ? "HTML" : "Text"} in Zwischenablage`}
      </button>

      {mode === "html" && (
        <p className="text-[11px] text-ink-faded leading-relaxed">
          Tipp: Diesen Code zwischen <code className="bg-bg border border-line px-1">{"<body>"}</code>{" "}
          und <code className="bg-bg border border-line px-1">{"</body>"}</code> deiner
          Widerrufs-Seite einfügen.
        </p>
      )}
    </div>
  );
}
