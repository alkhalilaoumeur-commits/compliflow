import type { Metadata } from "next";
import { WaitlistForm } from "@/components/waitlist-form";

export const metadata: Metadata = {
  title: "Cookie-Banner · Compliflow",
  description:
    "TTDSG- und DSGVO-konformer Cookie-Banner mit Audit-Trail, Google Consent Mode V2 und fünf Banner-Stilen. Launch: 19. August 2026.",
  robots: { index: false, follow: false },
};

const FEATURES = [
  {
    label: "Google Consent Mode V2",
    detail: "Direkte Integration ohne Drittanbieter-Plugin.",
  },
  {
    label: "Audit-Trail",
    detail: "Jede Consent-Entscheidung wird protokolliert und ist exportierbar.",
  },
  {
    label: "5 Banner-Stile",
    detail: "Bar, Modal, Floating Corner, Drawer, Minimal — alle WCAG-konform.",
  },
  {
    label: "Akzeptieren = Ablehnen",
    detail: "Beide Buttons gleich prominent nach DSGVO-Anforderung.",
  },
  {
    label: "Tracking erst nach Consent",
    detail: "Google Analytics, Meta Pixel & Co. erst nach echtem Opt-in aktiv.",
  },
  {
    label: "Ein Snippet pro Domain",
    detail: "Copy-paste. Keine Plugin-Installation, kein Build-Schritt.",
  },
];

export default function CookieBannerPage() {
  return (
    <main className="relative z-10 min-h-screen">
      {/* Header */}
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

      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 py-20 lg:py-28">
          <div className="grid grid-cols-12 gap-y-10 lg:gap-x-16">
            <div className="col-span-12 lg:col-span-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-6 rise">
                03 · Cookie-Banner · TTDSG
              </p>
              <h1
                className="font-display font-bold text-[44px] md:text-[60px] lg:text-[68px] leading-[1.02] rise"
                style={{ letterSpacing: "-0.03em", animationDelay: "40ms" }}
              >
                Kommt im
                <br />
                August 2026.
              </h1>
              <p
                className="mt-6 text-ink-dim text-[17px] leading-[1.65] max-w-lg rise"
                style={{ animationDelay: "80ms" }}
              >
                Modernes Consent-Management mit Audit-Trail, Google Consent
                Mode&nbsp;V2 und fünf anpassbaren Banner-Stilen — TTDSG- und
                DSGVO-konform, kein Plugin, kein Account.
              </p>

              {/* Countdown badge */}
              <div
                className="mt-8 inline-flex items-center gap-3 border border-line bg-bg-soft px-5 py-3 rise"
                style={{ animationDelay: "120ms" }}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-warn/60" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">
                  Launch · 19. August 2026
                </span>
              </div>
            </div>

            {/* Waitlist */}
            <div
              className="col-span-12 lg:col-span-5 rise"
              style={{ animationDelay: "160ms" }}
            >
              <div className="border border-line bg-bg-soft p-7 lg:p-8">
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
                  Frühzugang
                </p>
                <h2 className="font-display font-semibold text-[22px] leading-tight mb-3">
                  Jetzt vormerken lassen
                </h2>
                <p className="font-body text-[14px] text-ink-dim mb-6 leading-[1.6]">
                  Sei dabei wenn wir launchen. Erhalte eine einmalige
                  Benachrichtigung — kein Newsletter, kein Spam.
                </p>
                <WaitlistForm source="cookie-banner" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 py-16 lg:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded mb-10">
            Was der Cookie-Banner können wird
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line">
            {FEATURES.map((f) => (
              <div key={f.label} className="bg-bg p-7 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 bg-accent" />
                  <p className="font-mono text-[11px] uppercase tracking-widest text-ink">
                    {f.label}
                  </p>
                </div>
                <p className="font-body text-[14px] text-ink-dim leading-[1.6]">
                  {f.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — use other tools */}
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 py-16 lg:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faded mb-6">
            Schon heute verfügbar
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <a
              href="/avv"
              className="group flex flex-col gap-3 border border-line p-6 hover:border-accent transition-colors"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                01 / AVV-Generator
              </p>
              <p className="font-display font-semibold text-[18px] leading-tight">
                Auftragsverarbeitungs-Vertrag
              </p>
              <p className="font-body text-[13px] text-ink-dim leading-[1.6]">
                Art. 28 DSGVO · Kostenlos · Live-Vorschau
              </p>
              <span className="font-mono text-[11px] uppercase tracking-widest text-accent group-hover:underline">
                Jetzt starten →
              </span>
            </a>
            <a
              href="/vvt"
              className="group flex flex-col gap-3 border border-line p-6 hover:border-accent transition-colors"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                02 / Verarbeitungsverzeichnis
              </p>
              <p className="font-display font-semibold text-[18px] leading-tight">
                VVT nach Art. 30 DSGVO
              </p>
              <p className="font-body text-[13px] text-ink-dim leading-[1.6]">
                Art. 30 DSGVO · Kostenlos · 10 Branchen-Vorlagen
              </p>
              <span className="font-mono text-[11px] uppercase tracking-widest text-accent group-hover:underline">
                Jetzt starten →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10">
        <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faded">
            © 2026 Compliflow
          </span>
          <nav className="flex items-center gap-5 font-body text-[13px] text-ink-faded">
            <a href="/impressum" className="hover:text-ink transition">Impressum</a>
            <a href="/datenschutz" className="hover:text-ink transition">Datenschutz</a>
            <a href="/agb" className="hover:text-ink transition">AGB</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
