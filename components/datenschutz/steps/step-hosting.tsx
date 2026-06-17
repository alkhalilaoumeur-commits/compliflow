"use client";

import { useDatenschutzStore } from "@/lib/datenschutz/store";
import { Field, TextInput } from "@/components/avv/field";
import { HOSTING_LABELS, type HostingProvider } from "@/lib/datenschutz/types";

const HOSTING_ORDER: HostingProvider[] = [
  "hetzner",
  "ionos",
  "strato",
  "all_inkl",
  "netcup",
  "vercel",
  "cloudflare_pages",
  "aws",
  "azure",
  "gcp",
  "andere",
];

export function StepHosting() {
  const data = useDatenschutzStore((s) => s.data);
  const patch = useDatenschutzStore((s) => s.patch);

  const setProvider = (provider: HostingProvider) => {
    patch({
      hosting: {
        ...data.hosting,
        provider,
        istEU: HOSTING_LABELS[provider].istEU,
      },
    });
  };

  const updateEmbed = <K extends keyof typeof data.embedOptionen>(
    key: K,
    value: (typeof data.embedOptionen)[K],
  ) => {
    patch({ embedOptionen: { ...data.embedOptionen, [key]: value } });
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Wer betreibt die Server, auf denen deine Webseite läuft? Bei US-Anbietern (Vercel, AWS,
        Cloudflare) wird automatisch ein Drittland-Hinweis ergänzt.
      </p>

      <Field label="Hosting-Provider" required>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {HOSTING_ORDER.map((h) => {
            const isActive = data.hosting.provider === h;
            const cfg = HOSTING_LABELS[h];
            return (
              <button
                key={h}
                type="button"
                onClick={() => setProvider(h)}
                className={
                  "px-3 py-3 text-left border transition " +
                  (isActive
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-bg-soft hover:border-accent")
                }
              >
                <div className="font-body text-[14px] leading-[1.6] font-medium text-ink">{cfg.name}</div>
                <div className="text-[11px] text-ink-faded mt-0.5">
                  {cfg.istEU ? "EU-Hosting" : "Drittland (USA) — SCCs + Privacy Framework"}
                </div>
              </button>
            );
          })}
        </div>
      </Field>

      {data.hosting.provider === "andere" && (
        <Field label="Name des Anbieters" required>
          <TextInput
            value={data.hosting.customName ?? ""}
            onChange={(e) =>
              patch({
                hosting: { ...data.hosting, customName: e.target.value },
              })
            }
            placeholder="z.B. Mittwald CM Service GmbH"
          />
        </Field>
      )}

      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Embed- und Tracking-Optionen
        </p>
        <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
          Wie sind Drittinhalte (Schriften, Videos) auf deiner Webseite eingebunden?
          Optimale Einstellung reduziert Datenschutz-Risiken erheblich.
        </p>

        <div className="flex flex-col gap-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.embedOptionen.googleFontsLokal}
              onChange={(e) => updateEmbed("googleFontsLokal", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Google Fonts lokal eingebunden</strong> — Schriften
              liegen auf deinem Server (kein USA-Transfer, kein Consent nötig)
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.embedOptionen.youtubeNoCookieMode}
              onChange={(e) => updateEmbed("youtubeNoCookieMode", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">YouTube-NoCookie-Modus</strong> aktiv
              (youtube-nocookie.com statt youtube.com)
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.embedOptionen.serverSideTracking}
              onChange={(e) => updateEmbed("serverSideTracking", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Server-Side Tracking</strong> (GTM Server-Side, Daten
              laufen über deinen Server)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
