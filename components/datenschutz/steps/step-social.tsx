"use client";

import { useDatenschutzStore } from "@/lib/datenschutz/store";
import { Field } from "@/components/avv/field";
import {
  SOCIAL_LABELS,
  EMBEDDED_LABELS,
  type SocialEmbed,
  type EmbeddedService,
} from "@/lib/datenschutz/types";

const SOCIAL_ORDER: SocialEmbed[] = [
  "facebook_plugin",
  "instagram_plugin",
  "twitter_x_widget",
  "linkedin_insight",
  "linkedin_share",
  "youtube_embed",
  "vimeo_embed",
  "tiktok_embed",
];

const EMBEDDED_ORDER: EmbeddedService[] = [
  "google_fonts",
  "google_maps",
  "google_recaptcha",
  "calendly",
  "cal_com",
  "intercom",
  "crisp_chat",
  "tawk_to",
  "typeform",
  "youtube_iframe",
  "stripe_elements",
];

export function StepSocial() {
  const data = useDatenschutzStore((s) => s.data);
  const patch = useDatenschutzStore((s) => s.patch);

  const toggleSocial = (s: SocialEmbed) => {
    if (data.social.includes(s)) {
      patch({ social: data.social.filter((x) => x !== s) });
    } else {
      patch({ social: [...data.social, s] });
    }
  };

  const toggleEmbedded = (e: EmbeddedService) => {
    if (data.embedded.includes(e)) {
      patch({ embedded: data.embedded.filter((x) => x !== e) });
    } else {
      patch({ embedded: [...data.embedded, e] });
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Welche Social-Media-Plugins oder Dritt-Inhalte (Google Maps, YouTube, etc.) lädst du auf
        der Webseite? Diese brauchen meistens Consent vor dem Laden.
      </p>

      <Field label="Social Media Plugins" hint="Mehrfach-Auswahl möglich">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SOCIAL_ORDER.map((s) => {
            const selected = data.social.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSocial(s)}
                className={
                  "px-3 py-2.5 text-left border transition flex items-center justify-between " +
                  (selected
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-bg-soft hover:border-accent")
                }
              >
                <span className="font-body text-[14px] leading-[1.6] font-medium text-ink">{SOCIAL_LABELS[s]}</span>
                {selected && <span className="font-mono text-[10px] text-accent">✓</span>}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="border-t border-line pt-6">
        <Field label="Eingebettete Drittdienste" hint="Mehrfach-Auswahl möglich">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {EMBEDDED_ORDER.map((e) => {
              const selected = data.embedded.includes(e);
              return (
                <button
                  key={e}
                  type="button"
                  onClick={() => toggleEmbedded(e)}
                  className={
                    "px-3 py-2.5 text-left border transition flex items-center justify-between " +
                    (selected
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-bg-soft hover:border-accent")
                  }
                >
                  <span className="font-body text-[14px] leading-[1.6] font-medium text-ink">{EMBEDDED_LABELS[e]}</span>
                  {selected && <span className="font-mono text-[10px] text-accent">✓</span>}
                </button>
              );
            })}
          </div>
        </Field>
      </div>

      {data.embedded.includes("google_fonts") && data.embedOptionen.googleFontsLokal && (
        <div className="border-l-4 border-accent bg-accent-soft p-4">
          <p className="font-body text-[14px] leading-[1.6] text-ink">
            <strong>Google Fonts lokal eingebunden</strong> — du hast im Hosting-Schritt
            angegeben, dass die Fonts lokal liegen. Im Datenschutz wird dann nur eine kurze
            Klausel ergänzt (kein USA-Transfer, kein Consent nötig).
          </p>
        </div>
      )}
    </div>
  );
}
