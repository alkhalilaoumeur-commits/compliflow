"use client";

import { useDatenschutzStore } from "@/lib/datenschutz/store";
import { MARKETING_LABELS, type MarketingTool } from "@/lib/datenschutz/types";

const MARKETING_ORDER: MarketingTool[] = [
  "meta_pixel",
  "meta_conversion_api",
  "google_ads",
  "google_ads_remarketing",
  "tiktok_pixel",
  "linkedin_insight",
  "pinterest_tag",
  "twitter_pixel",
  "outbrain",
  "taboola",
  "criteo",
  "rtb_house",
];

export function StepMarketing() {
  const data = useDatenschutzStore((s) => s.data);
  const patch = useDatenschutzStore((s) => s.patch);

  const isSelected = (tool: MarketingTool) => data.marketing.includes(tool);

  const toggle = (tool: MarketingTool) => {
    if (isSelected(tool)) {
      patch({ marketing: data.marketing.filter((t) => t !== tool) });
    } else {
      patch({ marketing: [...data.marketing, tool] });
    }
  };

  const hasMetaSelected = data.marketing.some(
    (t) => t === "meta_pixel" || t === "meta_conversion_api",
  );

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Welche Marketing-Pixel oder Tracking-Tools sind eingebunden? Diese brauchen ALLE Consent
        nach § 25 TDDDG. Meta-Tools triggern automatisch eine Joint-Controller-Vereinbarung.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {MARKETING_ORDER.map((tool) => {
          const selected = isSelected(tool);
          const cfg = MARKETING_LABELS[tool];
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
              <div className="text-[10px] text-ink-faded mt-1 flex flex-wrap gap-1">
                {cfg.jointController && (
                  <span className="bg-accent-soft text-accent px-1.5 py-0.5">
                    Joint Controller
                  </span>
                )}
                {cfg.usAnbieter && (
                  <span className="bg-bg border border-line text-ink-dim px-1.5 py-0.5">
                    Drittland (USA)
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {hasMetaSelected && (
        <div className="border-l-4 border-accent bg-accent-soft p-4">
          <p className="font-body text-[14px] leading-[1.6] text-ink">
            <strong>Joint Controller automatisch ergänzt</strong> — durch Meta Pixel /
            Conversion-API wird die "Wesentliches der Vereinbarung" Klausel nach Art. 26 DSGVO
            automatisch im Datenschutz aufgenommen.
          </p>
        </div>
      )}
    </div>
  );
}
