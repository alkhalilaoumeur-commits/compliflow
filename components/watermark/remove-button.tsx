"use client";

import { useState, useEffect } from "react";
import { useWatermarkStore, type DocType } from "@/lib/watermark/store";

type Props = {
  docType: DocType;
  /** Pfad zum aktuellen Generator (für Redirect zurück nach Checkout) */
  returnPath: string;
};

const DOC_LABEL: Record<DocType, string> = {
  avv: "AVV",
  vvt: "VVT",
  impressum: "Impressum",
  datenschutz: "Datenschutzerklärung",
  widerruf: "Widerrufsbelehrung",
  agb: "AGB",
  cookie_banner: "Cookie-Banner",
};

/**
 * Watermark-Removal-Button — wird in jedem Generator in der Review-Sektion gezeigt.
 *
 * Verhalten:
 * - Solange nicht gekauft: Button "Compliflow-Credit entfernen — 0,99€" → öffnet Stripe-Checkout
 * - Nach erfolgreichem Payment: localStorage-Flag setzen, "Gekauft" anzeigen
 * - Bei Cancel: nichts machen
 */
export function WatermarkRemoveButton({ docType, returnPath }: Props) {
  const isBought = useWatermarkStore((s) => s.isBought(docType));
  const setBought = useWatermarkStore((s) => s.setBought);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL-Parameter beim Mount auswerten (Stripe redirect zurück)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const removed = params.get("watermark_removed");
    const sessionId = params.get("session_id");
    const mock = params.get("mock");
    const paramDocType = params.get("doc_type") as DocType | null;

    if (removed === "true" && paramDocType === docType) {
      if (mock === "true" || sessionId) {
        setBought(docType, {
          sessionId: sessionId || `mock_${Date.now()}`,
          paidAt: Date.now(),
        });
        // URL bereinigen
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
        // Plausible
        if (typeof (window as unknown as { plausible?: (e: string, opts?: object) => void }).plausible === "function") {
          (window as unknown as { plausible: (e: string, opts?: object) => void })
            .plausible("Watermark Removed", { props: { doc_type: docType, mode: mock === "true" ? "mock" : "live" } });
        }
      }
    }
  }, [docType, setBought]);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType, returnPath }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout fehlgeschlagen");
      }
      // Plausible Event
      if (typeof window !== "undefined" && typeof (window as unknown as { plausible?: (e: string, opts?: object) => void }).plausible === "function") {
        (window as unknown as { plausible: (e: string, opts?: object) => void })
          .plausible("Watermark Checkout Started", { props: { doc_type: docType } });
      }
      window.location.href = data.url;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unbekannter Fehler";
      setError(msg);
      setLoading(false);
    }
  }

  if (isBought) {
    return (
      <div className="flex flex-col gap-2 border border-line bg-bg p-4">
        <div className="flex items-center gap-2">
          <span className="text-accent">✓</span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink">
            Watermark entfernt
          </span>
        </div>
        <p className="text-[12px] text-ink-dim leading-relaxed">
          Dein {DOC_LABEL[docType]} wird ohne &bdquo;Erstellt mit Compliflow&ldquo;-Hinweis exportiert.
          Kauf gespeichert für diesen Browser.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 border border-line bg-bg-soft p-4">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
          Optional
        </span>
        <span className="font-display text-[15px] font-semibold text-ink">
          Compliflow-Credit entfernen — 0,99&nbsp;€
        </span>
        <p className="text-[12px] text-ink-dim leading-relaxed">
          Standard: dein {DOC_LABEL[docType]} enthält am Ende einen kleinen Hinweis &bdquo;Erstellt
          mit Compliflow&ldquo;. Für 0,99 € einmalig entfernen.
        </p>
      </div>
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className={
          "inline-flex h-11 items-center justify-center gap-2 font-mono text-[12px] uppercase tracking-widest transition " +
          (loading
            ? "bg-ink-dim text-bg cursor-wait"
            : "bg-accent text-bg hover:bg-ink")
        }
      >
        {loading ? "Lädt …" : "Für 0,99 € entfernen"}
      </button>
      {error && (
        <p className="text-[11px] text-red-600">{error}</p>
      )}
    </div>
  );
}
