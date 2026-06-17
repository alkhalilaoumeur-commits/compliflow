"use client";

import { useAgbStore } from "@/lib/agb/store";
import { Field, TextInput, TextArea } from "@/components/avv/field";

type Gefahruebergang = "ab_uebergabe" | "ab_versand";

const GEFAHR_LABELS: Record<Gefahruebergang, { titel: string; sub: string }> = {
  ab_uebergabe: {
    titel: "Ab Übergabe an Kunden",
    sub: "B2C-Standard nach § 446, 475 Abs. 2 BGB — Risiko geht erst über, wenn die Ware beim Kunden ankommt.",
  },
  ab_versand: {
    titel: "Ab Versand an Spediteur",
    sub: "B2B-Standard — Risiko geht über sobald die Ware den Versanddienstleister erreicht.",
  },
};

const parseInt0 = (raw: string, fallback: number): number => {
  const n = parseInt(raw, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(0, n);
};

export function StepLieferung() {
  const data = useAgbStore((s) => s.data);
  const patch = useAgbStore((s) => s.patch);

  const updateLi = <K extends keyof typeof data.lieferung>(
    key: K,
    value: (typeof data.lieferung)[K],
  ) => {
    patch({ lieferung: { ...data.lieferung, [key]: value } });
  };

  const updateSt = <K extends keyof typeof data.stornierung>(
    key: K,
    value: (typeof data.stornierung)[K],
  ) => {
    patch({ stornierung: { ...data.stornierung, [key]: value } });
  };

  const isShop = data.variante === "b2c_shop";

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Lieferungs- und Stornierungs-Klauseln. Lieferungs-Block nur bei Shop relevant —
        Stornierungs-Block gilt für alle Varianten (z.B. bei Dauerschuldverhältnissen).
      </p>

      {/* Lieferung-Block */}
      {!isShop ? (
        <div className="border-l-4 border-accent bg-accent-soft p-4">
          <p className="font-body text-[14px] leading-[1.6] text-ink">
            <strong>Lieferungs-Klauseln sind nur bei B2C Shop relevant.</strong> Da du{" "}
            {data.variante === "b2c_dienstleistung" ? "Dienstleistungen anbietest" : "B2B-Verträge abschließt"},
            kannst du diesen Block überspringen — generiert wird stattdessen die
            Leistungserbringungs-Klausel aus Schritt „Leistung".
          </p>
        </div>
      ) : (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
            Versand
          </p>

          <label className="flex items-start gap-3 cursor-pointer group mb-3">
            <input
              type="checkbox"
              checked={data.lieferung.versand}
              onChange={(e) => updateLi("versand", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <div>
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">Ich versende physische Ware</strong>
              </span>
              <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                Aktiviert die Lieferungs-Klausel mit Versandgebiet, Lieferzeit, Versandkosten,
                Eigentumsvorbehalt und Gefahrübergang.
              </p>
            </div>
          </label>

          {data.lieferung.versand && (
            <div className="border border-line bg-bg-soft p-5 mt-3 flex flex-col gap-4">
              <Field label="Liefergebiet" hint="z.B. Deutschland oder Deutschland und EU">
                <TextInput
                  value={data.lieferung.liefergebiet}
                  onChange={(e) => updateLi("liefergebiet", e.target.value)}
                  placeholder="Deutschland"
                />
              </Field>

              <Field label="Lieferzeit" required hint="z.B. 3-5 Werktage">
                <TextInput
                  value={data.lieferung.lieferzeitTage}
                  onChange={(e) => updateLi("lieferzeitTage", e.target.value)}
                  placeholder="3-5 Werktage"
                />
              </Field>

              <Field
                label="Versandkosten-Info"
                required
                hint="Beschreibung der Versandkosten (Höhe oder Verweis auf Shop)"
              >
                <TextArea
                  value={data.lieferung.versandkostenInfo}
                  onChange={(e) => updateLi("versandkostenInfo", e.target.value)}
                  placeholder="z.B. Versandkosten innerhalb Deutschlands: 4,90 EUR pro Bestellung, ab 49 EUR Bestellwert versandkostenfrei."
                  rows={3}
                />
              </Field>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={data.lieferung.eigentumsvorbehalt}
                  onChange={(e) => updateLi("eigentumsvorbehalt", e.target.checked)}
                  className="mt-1 h-4 w-4 accent-accent"
                />
                <div>
                  <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                    <strong className="text-ink">Eigentumsvorbehalt</strong> — Ware bleibt bis zur
                    vollständigen Bezahlung mein Eigentum
                  </span>
                  <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                    Standardklausel, empfohlen. Bei B2B wird der verlängerte Eigentumsvorbehalt
                    automatisch verwendet, sobald die B2B-Variante gewählt ist.
                  </p>
                </div>
              </label>

              <Field label="Gefahrübergang">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(GEFAHR_LABELS) as Gefahruebergang[]).map((g) => {
                    const isActive = data.lieferung.gefahruebergang === g;
                    const cfg = GEFAHR_LABELS[g];
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => updateLi("gefahruebergang", g)}
                        className={
                          "px-3 py-3 text-left border transition " +
                          (isActive
                            ? "border-accent bg-accent-soft"
                            : "border-line bg-bg-soft hover:border-accent")
                        }
                      >
                        <div className="font-body text-[14px] leading-[1.6] font-medium text-ink">{cfg.titel}</div>
                        <p className="text-[11px] text-ink-faded mt-1 leading-snug">
                          {cfg.sub}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          )}
        </div>
      )}

      {/* Stornierung-Block (alle Varianten) */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Stornierung & Kündigung
        </p>

        <label className="flex items-start gap-3 cursor-pointer group mb-3">
          <input
            type="checkbox"
            checked={data.ermoeglicheStornierung}
            onChange={(e) => patch({ ermoeglicheStornierung: e.target.checked })}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Stornierungs-Klausel hinzufügen</strong>
            </span>
            <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
              Sinnvoll bei terminbasierten Leistungen (Coaching, Beratung, Workshops) oder
              Dauerverträgen (Abos). Bei Shop-Käufen ist das Widerrufsrecht in der separaten
              Widerrufsbelehrung geregelt.
            </p>
          </div>
        </label>

        {data.ermoeglicheStornierung && (
          <div className="border border-line bg-bg-soft p-5 mt-3 flex flex-col gap-4">
            <Field
              label="Kostenlose Stornierung bis (Tage vor Termin)"
              hint="Standard 14 Tage. Bis dahin keine Stornogebühr."
            >
              <TextInput
                type="number"
                inputMode="numeric"
                min={0}
                max={365}
                value={String(data.stornierung.kostenlosBisTage)}
                onChange={(e) =>
                  updateSt("kostenlosBisTage", parseInt0(e.target.value, 14))
                }
                placeholder="14"
              />
            </Field>

            <Field
              label="Kündigungsfrist bei Dauerverträgen (Tage)"
              hint="Standard 30 Tage zum Monatsende — z.B. Abo, laufendes Coaching."
            >
              <TextInput
                type="number"
                inputMode="numeric"
                min={0}
                max={365}
                value={String(data.stornierung.kuendigungsfristTage)}
                onChange={(e) =>
                  updateSt("kuendigungsfristTage", parseInt0(e.target.value, 30))
                }
                placeholder="30"
              />
            </Field>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={data.stornierung.ausserordentlichesKuendigungsrecht}
                onChange={(e) =>
                  updateSt("ausserordentlichesKuendigungsrecht", e.target.checked)
                }
                className="mt-1 h-4 w-4 accent-accent"
              />
              <div>
                <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                  <strong className="text-ink">Außerordentliches Kündigungsrecht</strong> —
                  Recht zur Kündigung aus wichtigem Grund bleibt unberührt
                </span>
                <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                  Standard und empfohlen — schützt beide Seiten bei schwerwiegenden
                  Vertragsverletzungen.
                </p>
              </div>
            </label>

            <div className="border-l-4 border-accent bg-bg p-4">
              <p className="text-[11px] text-ink-dim leading-relaxed">
                <strong className="text-ink">Stornogebühren-Staffel:</strong> Standard-Staffel
                (50% bis 7 Tage, 100% ab 1 Tag vor Termin) wird automatisch verwendet. Eine
                individuelle Staffel ist im MVP nicht editierbar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
