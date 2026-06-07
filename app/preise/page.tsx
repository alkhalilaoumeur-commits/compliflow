"use client";

import { useState } from "react";

type CheckoutState = "idle" | "loading" | "error";

export default function PreisePage() {
  return (
    <main className="relative z-10 min-h-screen">
      <Header />
      <Hero />
      <Tiers />
      <FAQ />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="border-b border-[rgba(226,221,209,0.7)]">
      <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 flex items-center justify-between py-5">
        <a href="/" className="flex items-baseline gap-2.5">
          <span className="font-display text-[20px] font-semibold tracking-tight text-ink">
            Compliflow
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded md:inline">
            DSGVO Suite
          </span>
        </a>
        <nav className="flex items-center gap-5 md:gap-7">
          <a href="/avv" className="hidden font-body text-[14px] text-ink-dim hover:text-ink md:inline">
            AVV-Generator
          </a>
          <a href="/vvt" className="hidden font-body text-[14px] text-ink-dim hover:text-ink md:inline">
            VVT-Generator
          </a>
          <a
            href="/avv"
            className="btn-primary inline-flex h-9 items-center justify-center gap-2 px-4 font-body text-[13px] font-medium tracking-tight"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-bg" aria-hidden="true" />
            Kostenlos starten
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-12 gap-y-8 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-6 rise">
              Preise
            </p>
            <h1
              className="font-display text-[40px] font-medium leading-[1.05] tracking-[-0.02em] text-ink rise sm:text-[56px] lg:text-[72px]"
              style={{ animationDelay: "60ms" }}
            >
              Bußgeld bis{" "}
              <span className="italic text-accent">20 Mio. €</span>
              {" "}— oder{" "}
              <span className="italic">29 € einmalig.</span>
            </h1>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:flex lg:items-end">
            <div
              className="rise border border-[rgba(226,221,209,0.6)] bg-[rgba(31,61,47,0.05)] p-6 border-l-2 border-l-accent"
              style={{ animationDelay: "120ms" }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">
                Realität ohne Compliflow
              </p>
              <ul className="space-y-2 font-body text-[14px] text-ink-dim">
                <li className="flex gap-2">
                  <span className="text-accent" aria-hidden>—</span>
                  <span>Datenschutzanwalt: 300–800 € pro Stunde</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent" aria-hidden>—</span>
                  <span>AVV manuell: 3–8 Stunden Recherche</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent" aria-hidden>—</span>
                  <span>VVT ohne Tool: 1–2 Arbeitstage</span>
                </li>
                <li className="flex gap-2 pt-2 border-t border-line">
                  <span className="text-accent" aria-hidden>—</span>
                  <span>
                    <strong className="text-ink">Compliflow:</strong> 10–20 Minuten
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tiers() {
  return (
    <section className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 py-20 lg:py-28">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faded mb-12">
        01 · Preismodell
      </p>

      <div className="grid grid-cols-12 gap-y-6 lg:gap-x-6">
        <FreeTier />
        <ProTier />
        <AgencyTier />
      </div>

      <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-ink-faded">
        Alle Preise inkl. MwSt. · Keine versteckten Kosten · Sofortiger Download
      </p>
    </section>
  );
}

function FreeTier() {
  return (
    <div className="col-span-12 lg:col-span-4 border border-line bg-surface p-8 flex flex-col gap-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded mb-2">
          01 / 03
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[44px] font-medium tracking-[-0.02em] text-ink">
            0 €
          </span>
          <span className="font-body text-[14px] text-ink-faded">für immer</span>
        </div>
        <h2
          className="font-display text-[22px] font-medium tracking-[-0.01em] text-ink mt-2"
        >
          Kostenlos
        </h2>
        <p className="font-body text-[14px] leading-[1.6] text-ink-dim mt-2">
          Für Selbstständige und Einzelpersonen, die schnell compliant werden wollen.
        </p>
      </div>

      <ul className="flex flex-col gap-3 border-t border-line pt-6">
        {[
          "AVV-Generator (Art. 28 DSGVO)",
          "VVT-Generator (Art. 30 DSGVO)",
          "PDF mit Compliflow-Branding-Footer",
          "Unbegrenzte Nutzung",
          "Daten nur im Browser (kein Server)",
          "10 Branchen-Vorlagen für VVT",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3 text-[14px] text-ink-dim">
            <span className="text-accent mt-0.5" aria-hidden>—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-3">
        <a
          href="/avv"
          className="btn-ghost inline-flex h-12 items-center justify-center px-6 font-mono text-[12px] uppercase tracking-widest w-full"
        >
          Jetzt kostenlos starten
        </a>
        <a
          href="/vvt"
          className="btn-ghost inline-flex h-12 items-center justify-center px-6 font-mono text-[12px] uppercase tracking-widest w-full"
        >
          VVT-Generator öffnen
        </a>
      </div>
    </div>
  );
}

function ProTier() {
  const [avvState, setAvvState] = useState<CheckoutState>("idle");
  const [vvtState, setVvtState] = useState<CheckoutState>("idle");

  const handleCheckout = async (tool: "avv" | "vvt", setState: (s: CheckoutState) => void) => {
    setState("loading");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setState("error");
        setTimeout(() => setState("idle"), 4000);
      }
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 4000);
    }
  };

  return (
    <div className="col-span-12 lg:col-span-4 lg:-mt-6 lg:-mb-6 border-2 border-accent bg-surface shadow-lg p-8 flex flex-col gap-6 relative">
      <div className="absolute -top-px left-8 right-8 h-[2px] bg-accent" aria-hidden />
      <div className="absolute -top-[26px] left-8">
        <span className="bg-accent text-bg font-mono text-[10px] uppercase tracking-widest px-3 py-1">
          Empfohlen
        </span>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
          02 / 03
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[44px] font-medium tracking-[-0.02em] text-ink">
            29 €
          </span>
          <span className="font-body text-[14px] text-ink-faded">einmalig pro Dokument</span>
        </div>
        <h2
          className="font-display text-[22px] font-medium tracking-[-0.01em] text-ink mt-2"
        >
          Pro Dokument
        </h2>
        <p className="font-body text-[14px] leading-[1.6] text-ink-dim mt-2">
          Ein professionelles Dokument ohne Branding — für Mandanten, Geschäftspartner oder behördliche Einreichungen.
        </p>
      </div>

      <ul className="flex flex-col gap-3 border-t border-[rgba(31,61,47,0.2)] pt-6">
        {[
          "Alles aus Kostenlos",
          "PDF ohne Compliflow-Branding",
          "DSGVO-konformes Deckblatt",
          "Sofort-Download nach Zahlung",
          "Einmalige Zahlung — kein Abo",
          "Gültig für ein Dokument (AVV oder VVT)",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3 text-[14px] text-ink-dim">
            <span className="text-accent mt-0.5" aria-hidden>—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-3">
        <button
          type="button"
          onClick={() => handleCheckout("avv", setAvvState)}
          disabled={avvState !== "idle"}
          className="btn-primary inline-flex h-12 items-center justify-center px-6 font-mono text-[12px] uppercase tracking-widest w-full disabled:opacity-60 disabled:cursor-wait"
        >
          {avvState === "loading"
            ? "Weiterleitung …"
            : avvState === "error"
            ? "Fehler — erneut versuchen"
            : "AVV Pro kaufen — 29 €"}
        </button>
        <button
          type="button"
          onClick={() => handleCheckout("vvt", setVvtState)}
          disabled={vvtState !== "idle"}
          className="btn-primary inline-flex h-12 items-center justify-center px-6 font-mono text-[12px] uppercase tracking-widest w-full disabled:opacity-60 disabled:cursor-wait"
        >
          {vvtState === "loading"
            ? "Weiterleitung …"
            : vvtState === "error"
            ? "Fehler — erneut versuchen"
            : "VVT Pro kaufen — 29 €"}
        </button>
      </div>
    </div>
  );
}

function AgencyTier() {
  return (
    <div className="col-span-12 lg:col-span-4 border border-line bg-surface p-8 flex flex-col gap-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded mb-2">
          03 / 03
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[44px] font-medium tracking-[-0.02em] text-ink">
            19 €
          </span>
          <span className="font-body text-[14px] text-ink-faded">/ Monat</span>
        </div>
        <h2
          className="font-display text-[22px] font-medium tracking-[-0.01em] text-ink mt-2"
        >
          Agency
        </h2>
        <p className="font-body text-[14px] leading-[1.6] text-ink-dim mt-2">
          Für Datenschutzberater, Agenturen und alle, die regelmäßig Dokumente für Mandanten erstellen.
        </p>
      </div>

      <ul className="flex flex-col gap-3 border-t border-line pt-6">
        {[
          "Alles aus Pro",
          "Unbegrenzte Dokumente ohne Branding",
          "Multi-Mandanten-Verwaltung",
          "Prioritäts-Support per E-Mail",
          "Jahresrechnung auf Anfrage",
          "Bald: DATEV-Export",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3 text-[14px] text-ink-dim">
            <span className="text-accent mt-0.5" aria-hidden>—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <a
          href="mailto:hello@compliflow.de?subject=Agency-Plan-Anfrage"
          className="btn-ghost inline-flex h-12 items-center justify-center px-6 font-mono text-[12px] uppercase tracking-widest w-full"
        >
          Kontakt aufnehmen
        </a>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-ink-faded text-center">
          Bald buchbar — jetzt per Mail anfragen
        </p>
      </div>
    </div>
  );
}

function FAQ() {
  const items = [
    {
      q: "Was ist der Unterschied zwischen kostenlos und Pro?",
      a: "Die kostenlose Version generiert ein vollständiges, rechtlich korrektes PDF — mit einem kleinen Footer 'Erstellt mit Compliflow'. Pro entfernt dieses Branding. Inhaltlich ist kein Unterschied: beide Versionen erfüllen Art. 28 bzw. Art. 30 DSGVO.",
    },
    {
      q: "Muss ich ein Konto erstellen?",
      a: "Nein. Weder kostenlos noch Pro erfordern ein Konto. Deine Daten bleiben ausschließlich in deinem Browser — wir speichern nichts auf unseren Servern.",
    },
    {
      q: "Was ist, wenn ich sowohl AVV als auch VVT ohne Branding möchte?",
      a: "Du kaufst beide separat für je 29 € (einmalig). Alternativ: beim Agency-Plan (19 €/Monat) sind beide unbegrenzt inklusive.",
    },
    {
      q: "Wie sicher ist die Zahlung?",
      a: "Zahlung läuft über Stripe — PCI-DSS-zertifiziert, DSGVO-konform, SEPA-Lastschrift und alle gängigen Kreditkarten möglich. Wir sehen keine Zahlungsdaten.",
    },
    {
      q: "Sind die Dokumente juristisch geprüft?",
      a: "Ja — die Vorlagen wurden von einem Datenschutzanwalt geprüft und decken die Pflichtinhalte nach Art. 28 Abs. 3 und Art. 30 Abs. 1 DSGVO vollständig ab. Sie ersetzen keine individuelle Rechtsberatung in Sonderfällen.",
    },
  ];

  return (
    <section className="border-t border-line">
      <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-12 gap-y-10 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faded">
              02 · Häufige Fragen
            </p>
            <h2 className="mt-4 font-display text-[32px] font-medium leading-[1.1] tracking-[-0.015em] text-ink md:text-[40px]">
              Fragen zu den Preisen.
            </h2>
            <p className="mt-4 font-body text-[15px] leading-[1.6] text-ink-dim">
              Alle anderen Fragen:{" "}
              <a
                href="mailto:hello@compliflow.de"
                className="link-underline font-medium text-ink"
              >
                hello@compliflow.de
              </a>
            </p>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="border-t border-line">
              {items.map((item) => (
                <details key={item.q} className="group border-b border-line py-6">
                  <summary className="flex cursor-pointer items-start justify-between gap-6">
                    <span className="font-display text-[17px] font-medium leading-snug text-ink md:text-[19px]">
                      {item.q}
                    </span>
                    <span className="faq-icon mt-1 font-display text-[22px] font-medium text-ink-faded group-open:text-accent flex-shrink-0">
                      +
                    </span>
                  </summary>
                  <p className="measure mt-4 font-body text-[15px] leading-[1.65] text-ink-dim">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 py-10">
        <div className="flex flex-col items-start justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faded md:flex-row md:items-center">
          <span>© 2026 Al-Khalil Aoumeur · Compliflow</span>
          <div className="flex gap-5">
            <a href="/impressum" className="hover:text-ink transition">Impressum</a>
            <a href="/datenschutz" className="hover:text-ink transition">Datenschutz</a>
            <a href="/agb" className="hover:text-ink transition">AGB</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
