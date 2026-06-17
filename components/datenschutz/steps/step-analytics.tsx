"use client";

import { useDatenschutzStore } from "@/lib/datenschutz/store";
import { ANALYTICS_LABELS, type AnalyticsTool, type AnalyticsConfig } from "@/lib/datenschutz/types";

const ANALYTICS_ORDER: AnalyticsTool[] = [
  "plausible",
  "matomo",
  "umami",
  "fathom",
  "ga4",
  "hotjar",
  "microsoft_clarity",
];

export function StepAnalytics() {
  const data = useDatenschutzStore((s) => s.data);
  const patch = useDatenschutzStore((s) => s.patch);

  const isSelected = (tool: AnalyticsTool) =>
    data.analytics.some((a) => a.tool === tool);

  const toggle = (tool: AnalyticsTool) => {
    if (isSelected(tool)) {
      patch({ analytics: data.analytics.filter((a) => a.tool !== tool) });
    } else {
      const cfg: AnalyticsConfig = {
        tool,
        istEUHosting: ANALYTICS_LABELS[tool].istEU,
        anonymisiereIp: true,
      };
      patch({ analytics: [...data.analytics, cfg] });
    }
  };

  const updateAnon = (tool: AnalyticsTool, value: boolean) => {
    patch({
      analytics: data.analytics.map((a) =>
        a.tool === tool ? { ...a, anonymisiereIp: value } : a,
      ),
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Welche Analyse-Tools verwendest du auf der Webseite? Cookieless-Tools wie Plausible/Matomo
        brauchen keinen Consent — Google Analytics 4 schon.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ANALYTICS_ORDER.map((tool) => {
          const selected = isSelected(tool);
          const cfg = ANALYTICS_LABELS[tool];
          return (
            <button
              key={tool}
              type="button"
              onClick={() => toggle(tool)}
              className={
                "px-3 py-3 text-left border transition " +
                (selected
                  ? "border-accent bg-accent-soft"
                  : "border-line bg-bg-soft hover:border-accent")
              }
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-body text-[14px] leading-[1.6] font-medium text-ink">{cfg.name}</div>
                {selected && (
                  <span className="font-mono text-[10px] text-accent">✓</span>
                )}
              </div>
              <div className="text-[11px] text-ink-faded mt-0.5">{cfg.anbieter}</div>
              <div className="text-[10px] text-ink-faded mt-0.5">
                {cfg.istEU ? "EU-Anbieter · cookieless möglich" : "Drittland (USA)"}
              </div>
            </button>
          );
        })}
      </div>

      {data.analytics.length > 0 && (
        <div className="border-t border-line pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
            Konfiguration pro Tool
          </p>
          <div className="flex flex-col gap-3">
            {data.analytics.map((a) => (
              <div key={a.tool} className="border border-line bg-bg-soft p-4">
                <p className="font-body text-[14px] leading-[1.6] font-medium text-ink mb-2">
                  {ANALYTICS_LABELS[a.tool].name}
                </p>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={a.anonymisiereIp}
                    onChange={(e) => updateAnon(a.tool, e.target.checked)}
                    className="mt-1 h-4 w-4 accent-accent"
                  />
                  <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                    IP-Anonymisierung aktiv (empfohlen!)
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
