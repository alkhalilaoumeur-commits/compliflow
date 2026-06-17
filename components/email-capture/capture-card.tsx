"use client";

import { useState } from "react";

type Quelle =
  | "compliflow_generator"
  | "avv"
  | "vvt"
  | "impressum"
  | "datenschutz"
  | "widerruf"
  | "agb"
  | "cookie_banner"
  | "newsletter_form"
  | "exit_intent";

type Props = {
  /** Welcher Generator hat den User "gefangen" — für Segmentierung in Brevo */
  quelle: Quelle;
  /** Headline der Karte */
  headline?: string;
  /** Sub-Text unter Headline */
  beschreibung?: string;
  /** CTA-Text auf Button */
  ctaText?: string;
};

type State = "idle" | "loading" | "success" | "already" | "error";

/**
 * Email-Capture-Karte für Compliflow-Generatoren.
 * Wird in jeder Review-Sidebar gezeigt + Double-Opt-In via Brevo getriggert.
 */
export function CaptureCard({
  quelle,
  headline = "Bleib auf dem Laufenden",
  beschreibung = "Bei wichtigen DSGVO-Updates und neuen Tools schicken wir dir eine Nachricht. Keine Werbung, kein Spam. Jederzeit abbestellbar.",
  ctaText = "Anmelden",
}: Props) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !consent) return;
    setState("loading");
    setMessage("");

    try {
      const res = await fetch("/api/brevo/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), quelle, consent: true }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setState("error");
        setMessage(data.error ?? "Anmeldung fehlgeschlagen.");
        return;
      }
      // Plausible-Event
      if (typeof window !== "undefined" && typeof (window as unknown as { plausible?: (e: string, opts?: object) => void }).plausible === "function") {
        (window as unknown as { plausible: (e: string, opts?: object) => void })
          .plausible("Email Captured", { props: { quelle, mode: data.mock ? "mock" : "live", isNew: data.isNew ?? true } });
      }
      setState(data.isNew === false ? "already" : "success");
      setMessage(data.message ?? "Bitte bestätige die E-Mail aus deinem Posteingang.");
      setEmail("");
      setConsent(false);
    } catch {
      setState("error");
      setMessage("Netzwerkfehler. Bitte später erneut versuchen.");
    }
  }

  if (state === "success" || state === "already") {
    return (
      <div className="flex flex-col gap-2 border border-line bg-bg p-5">
        <div className="flex items-center gap-2">
          <span className="text-accent text-lg">✓</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink">
            {state === "already" ? "Bereits angemeldet" : "Bestätigung gesendet"}
          </span>
        </div>
        <p className="text-[12px] text-ink-dim leading-relaxed">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 border border-line bg-bg-soft p-5">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
          Optional
        </span>
        <span className="font-display text-[15px] font-semibold text-ink">{headline}</span>
        <p className="text-[12px] text-ink-dim leading-relaxed">{beschreibung}</p>
      </div>

      <input
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="deine@email.de"
        className="h-11 border border-line bg-bg px-3 font-body text-[14px] text-ink placeholder:text-ink-faded focus:outline-none focus:border-accent"
      />

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 accent-accent"
          required
        />
        <span className="text-[11px] text-ink-dim leading-relaxed">
          Ich willige ein, dass meine E-Mail-Adresse via Brevo (EU-Server) verarbeitet wird, um mir
          DSGVO-Updates und neue Compliflow-Tools per E-Mail anzukündigen. Mehr in der{" "}
          <a href="/datenschutz" target="_blank" rel="noopener" className="text-accent underline">
            Datenschutzerklärung
          </a>
          . Widerruf jederzeit möglich.
        </span>
      </label>

      <button
        type="submit"
        disabled={state === "loading" || !email.trim() || !consent}
        className={
          "inline-flex h-11 items-center justify-center gap-2 font-mono text-[12px] uppercase tracking-widest transition " +
          (state === "loading" || !email.trim() || !consent
            ? "bg-ink-dim text-bg cursor-not-allowed"
            : "bg-accent text-bg hover:bg-ink")
        }
      >
        {state === "loading" ? "Sende …" : ctaText}
      </button>

      {state === "error" && message && (
        <p className="text-[11px] text-red-600 leading-relaxed">{message}</p>
      )}

      <p className="text-[10px] text-ink-faded leading-relaxed">
        Bestätigung per E-Mail (Double-Opt-In, § 7 UWG). Bei Anmeldung schicken wir dir einen
        Bestätigungs-Link, danach bist du auf der Liste.
      </p>
    </form>
  );
}
