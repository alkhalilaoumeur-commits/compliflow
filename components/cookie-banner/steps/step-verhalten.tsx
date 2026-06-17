"use client";

import { useCookieBannerStore } from "@/lib/cookie-banner/store";
import { Field, TextInput } from "@/components/avv/field";
import type { Verhalten } from "@/lib/cookie-banner/types";

export function StepVerhalten() {
  const data = useCookieBannerStore((s) => s.data);
  const patch = useCookieBannerStore((s) => s.patch);
  const update = useCookieBannerStore((s) => s.update);

  const updateV = <K extends keyof Verhalten>(key: K, value: Verhalten[K]) => {
    patch({ verhalten: { ...data.verhalten, [key]: value } });
  };

  const parseInt0 = (raw: string): number => {
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) return 1;
    return Math.max(1, n);
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Wie soll der Banner sich verhalten? Hier legst du fest, wann der Re-Consent abgefragt wird,
        ob das Banner automatisch erscheint und wo der Consent gespeichert wird.
      </p>

      {/* BGH-Pflicht-Schalter (locked) */}
      <div className="border-l-4 border-accent bg-accent-soft p-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={true}
            disabled
            className="mt-1 h-4 w-4 accent-accent cursor-not-allowed"
            aria-label="Reject-All prominent"
          />
          <div>
            <div className="font-body text-[14px] leading-[1.6] font-medium text-ink mb-1">
              Reject-All gleich prominent wie Accept-All{" "}
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent ml-2">
                Pflicht · gesperrt
              </span>
            </div>
            <p className="text-[12px] text-ink-dim leading-relaxed">
              <strong>BGH 2025:</strong> Ein Reject-All-Button muss gleich auffällig sein wie
              Accept-All. Compliflow erzwingt das automatisch. Bewusste Ausschaltung wäre ein
              direkter Verstoß gegen aktuelle Rechtsprechung und ist hier nicht möglich.
            </p>
          </div>
        </div>
      </div>

      {/* Settings-Button */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={data.verhalten.settingsButton}
          onChange={(e) => updateV("settingsButton", e.target.checked)}
          className="mt-1 h-4 w-4 accent-accent"
        />
        <div>
          <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
            <strong className="text-ink">Detail-Einstellungen anbieten</strong>
          </span>
          <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
            Button "Einstellungen" öffnet einen Ausklapp-Bereich mit Toggle pro Kategorie.
            Dringend empfohlen für DSGVO-konforme granulare Einwilligung.
          </p>
        </div>
      </label>

      {/* Consent-Laufzeit */}
      <Field
        label="Consent-Laufzeit (Monate)"
        required
        hint="DSK-Empfehlung 2024: max. 12 Monate. Danach wird der Banner automatisch erneut gezeigt."
      >
        <TextInput
          type="number"
          inputMode="numeric"
          min={1}
          max={24}
          value={String(data.verhalten.consentLaufzeitMonate)}
          onChange={(e) =>
            updateV("consentLaufzeitMonate", Math.min(parseInt0(e.target.value), 24))
          }
          placeholder="12"
        />
      </Field>

      {/* Auto-Öffnen */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={data.verhalten.autoOeffnen}
          onChange={(e) => updateV("autoOeffnen", e.target.checked)}
          className="mt-1 h-4 w-4 accent-accent"
        />
        <div>
          <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
            <strong className="text-ink">Banner beim ersten Besuch automatisch öffnen</strong>
          </span>
          <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
            Standard: an. Aus nur, wenn du den Banner manuell per JS triggern willst
            (z.B. nach Klick auf Footer-Link).
          </p>
        </div>
      </label>

      {/* Weiter ohne Tracking */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={data.verhalten.weiterOhneTracking}
          onChange={(e) => updateV("weiterOhneTracking", e.target.checked)}
          className="mt-1 h-4 w-4 accent-accent"
        />
        <div>
          <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
            <strong className="text-ink">"Weiter ohne Tracking" als 3. Option</strong>
          </span>
          <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
            Zusätzlicher dezenter Button. Reduziert Friktion, wird bei Aufsichtsbehörden aber
            kritisch diskutiert — Standard ist aus.
          </p>
        </div>
      </label>

      {/* Backdrop nur bei Modal */}
      {data.stil === "modal" && (
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.verhalten.blockiertHintergrund}
            onChange={(e) => updateV("blockiertHintergrund", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Hintergrund blockieren (dunkler Overlay)</strong>
            </span>
            <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
              Nur bei Modal-Stil. Besucher muss erst entscheiden, bevor er die Webseite nutzen
              kann. Vorsicht: Aufsichtsbehörden sehen Cookie-Walls kritisch.
            </p>
          </div>
        </label>
      )}

      {/* Storage-Key */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Speicher-Schlüssel (Advanced)
        </p>
        <Field
          label="localStorage-Schlüssel"
          hint="Unter diesem Key wird der Consent gespeichert. Standard belassen, außer du nutzt mehrere Banner parallel."
        >
          <TextInput
            value={data.storageKey}
            onChange={(e) => update("storageKey", e.target.value)}
            placeholder="compliflow-consent"
          />
        </Field>
      </div>
    </div>
  );
}
