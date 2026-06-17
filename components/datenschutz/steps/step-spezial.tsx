"use client";

import { useDatenschutzStore } from "@/lib/datenschutz/store";
import { hasDsfaPflicht, hasJointController } from "@/lib/datenschutz/contract";

export function StepSpezial() {
  const data = useDatenschutzStore((s) => s.data);
  const patch = useDatenschutzStore((s) => s.patch);

  const updateS = <K extends keyof typeof data.spezial>(
    key: K,
    value: (typeof data.spezial)[K],
  ) => {
    patch({ spezial: { ...data.spezial, [key]: value } });
  };

  const dsfaPflicht = hasDsfaPflicht(data);
  const jointAuto = hasJointController(data);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Spezielle Verarbeitungen mit erhöhtem Risiko nach DSGVO. Hier wird ggf. eine DSFA
        (Datenschutz-Folgenabschätzung nach Art. 35 DSGVO) Pflicht.
      </p>

      {dsfaPflicht && (
        <div className="border-l-4 border-warn bg-bg-soft p-4">
          <p className="font-body text-[14px] leading-[1.6] text-ink">
            <strong className="text-warn">DSFA-Pflicht für dich</strong> nach Art. 35 DSGVO! Eine
            Datenschutz-Folgenabschätzung muss vor Beginn der Verarbeitung durchgeführt und
            dokumentiert werden. Der Hinweis dazu wird automatisch im Datenschutztext ergänzt.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.spezial.profiling}
            onChange={(e) => updateS("profiling", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Profiling</strong> — algorithmische Bewertung von
              Personen (z.B. Scoring, Persona-Bildung, Verhaltensprognose)
            </span>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.spezial.automatisierte_entscheidung}
            onChange={(e) => updateS("automatisierte_entscheidung", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Automatisierte Einzelentscheidung</strong> nach Art. 22
              DSGVO (Entscheidung mit Rechtswirkung allein durch Algorithmus)
            </span>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.spezial.jointController || jointAuto}
            onChange={(e) => updateS("jointController", e.target.checked)}
            disabled={jointAuto}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Joint Controller</strong> nach Art. 26 DSGVO (gemeinsame
              Verantwortlichkeit)
            </span>
            {jointAuto && (
              <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                Automatisch aktiv durch Meta Pixel / Conversion-API.
              </p>
            )}
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.spezial.videoueberwachung_live}
            onChange={(e) => updateS("videoueberwachung_live", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Videoüberwachung Live</strong> auf der Webseite
              (Webcam-Stream sichtbar)
            </span>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.spezial.besondere_kategorien_art9}
            onChange={(e) => updateS("besondere_kategorien_art9", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Besondere Datenkategorien</strong> nach Art. 9 DSGVO
              (Gesundheit, Religion, Sexualität, ethn. Herkunft, etc.)
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}
