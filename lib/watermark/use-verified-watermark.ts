"use client";

/**
 * useVerifiedWatermark — server-verifizierter Wasserzeichen-Status.
 *
 * Problem mit purem localStorage: Jeder kann bought.avv = {...} ins localStorage
 * schreiben und bekommt sofort ein wasserzeichenfreies Dokument — ohne Stripe-Zahlung.
 *
 * Lösung: Beim ersten Render (Mount) wird die gespeicherte Session-ID einmalig
 * gegen /api/stripe/verify-session geprüft. Erst wenn Stripe bestätigt → "verified".
 * Bei ungültiger Session-ID: localStorage-Eintrag löschen, Wasserzeichen zeigen.
 *
 * Status-Semantik:
 *   "loading"  — Verifizierung läuft noch. Wasserzeichen anzeigen (konservativ).
 *   "verified" — Stripe hat bestätigt. Wasserzeichen ausblenden.
 *   "none"     — Nicht gekauft oder ungültige Session. Wasserzeichen anzeigen.
 */

import { useState, useEffect } from "react";
import { useWatermarkStore, type DocType } from "./store";

export type VerifiedStatus = "loading" | "verified" | "none";

export function useVerifiedWatermark(docType: DocType): VerifiedStatus {
  const entry = useWatermarkStore((s) => s.bought[docType]);
  const reset = useWatermarkStore((s) => s.reset);

  const [status, setStatus] = useState<VerifiedStatus>(entry ? "loading" : "none");

  useEffect(() => {
    if (!entry) {
      setStatus("none");
      return;
    }

    // Dev-Mock-Sessions (lokal ohne Stripe) sofort als verified markieren
    if (entry.sessionId.startsWith("mock_")) {
      setStatus("verified");
      return;
    }

    let active = true;

    fetch(`/api/stripe/verify-session?sessionId=${encodeURIComponent(entry.sessionId)}`)
      .then((r) => r.json())
      .then((data: { valid?: boolean; docType?: string | null }) => {
        if (!active) return;
        if (data.valid === true && data.docType === docType) {
          setStatus("verified");
        } else {
          // Ungültige oder fremde Session-ID → Eintrag löschen
          reset(docType);
          setStatus("none");
        }
      })
      .catch(() => {
        if (!active) return;
        // Netzwerkfehler → konservativ: Wasserzeichen zeigen, localStorage behalten
        // (kein Bestrafen von Käufern mit schlechter Verbindung)
        setStatus("none");
      });

    return () => {
      active = false;
    };
  }, [docType, entry?.sessionId, reset]);

  return status;
}
