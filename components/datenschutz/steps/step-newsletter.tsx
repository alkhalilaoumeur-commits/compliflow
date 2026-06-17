"use client";

import { useDatenschutzStore } from "@/lib/datenschutz/store";
import { Field } from "@/components/avv/field";
import { NEWSLETTER_LABELS, type NewsletterProvider } from "@/lib/datenschutz/types";

const NEWSLETTER_ORDER: NewsletterProvider[] = [
  "brevo",
  "mailerlite",
  "rapidmail",
  "cleverreach",
  "mailchimp",
  "convertkit",
  "selbst_gehostet",
];

export function StepNewsletter() {
  const data = useDatenschutzStore((s) => s.data);
  const patch = useDatenschutzStore((s) => s.patch);

  const updateN = <K extends keyof typeof data.newsletter>(
    key: K,
    value: (typeof data.newsletter)[K],
  ) => {
    patch({ newsletter: { ...data.newsletter, [key]: value } });
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Versendest du einen Newsletter? Double-Opt-In ist in Deutschland gesetzlich Pflicht (§ 7
        UWG) und kann nicht deaktiviert werden.
      </p>

      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={data.newsletter.aktiv}
          onChange={(e) => updateN("aktiv", e.target.checked)}
          className="mt-1 h-4 w-4 accent-accent"
        />
        <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
          <strong className="text-ink">Wir versenden einen Newsletter</strong>
        </span>
      </label>

      {data.newsletter.aktiv && (
        <div className="border border-line bg-bg-soft p-5 flex flex-col gap-5">
          <Field label="Newsletter-Anbieter" required>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {NEWSLETTER_ORDER.map((n) => {
                const isActive = data.newsletter.provider === n;
                const cfg = NEWSLETTER_LABELS[n];
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => updateN("provider", n)}
                    className={
                      "px-3 py-2.5 text-left border transition " +
                      (isActive
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-bg hover:border-accent")
                    }
                  >
                    <div className="font-body text-[14px] leading-[1.6] font-medium text-ink">{cfg.name}</div>
                    <div className="text-[11px] text-ink-faded mt-0.5">
                      {cfg.istEU ? "EU-Anbieter" : "Drittland (USA) — SCCs nötig"}
                    </div>
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Double-Opt-In (locked) */}
          <div className="border border-line bg-bg p-4">
            <label className="flex items-start gap-3 cursor-not-allowed">
              <input
                type="checkbox"
                checked={data.newsletter.doubleOptIn}
                disabled
                className="mt-1 h-4 w-4 accent-accent"
              />
              <div>
                <span className="font-body text-[14px] leading-[1.6] text-ink">
                  <strong>Double-Opt-In aktiv</strong> (gesetzlich Pflicht — § 7 UWG)
                </span>
                <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                  Newsletter ohne Bestätigungs-Klick ist abmahnfähig. Diese Option ist nicht
                  deaktivierbar.
                </p>
              </div>
            </label>
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.newsletter.trackingAktiv}
              onChange={(e) => updateN("trackingAktiv", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Open/Click-Tracking</strong> aktiv — wir messen ob/welche
              Links geöffnet wurden
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
