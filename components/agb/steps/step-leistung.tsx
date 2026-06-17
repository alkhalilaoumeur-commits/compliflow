"use client";

import { useAgbStore } from "@/lib/agb/store";
import { Field, TextInput, TextArea } from "@/components/avv/field";
import {
  LEISTUNGSART_LABELS,
  VERTRAGSSCHLUSS_LABELS,
  type LeistungsArt,
  type VertragsschlussArt,
} from "@/lib/agb/types";

const LEISTUNGSART_ORDER: LeistungsArt[] = [
  "beratung",
  "coaching",
  "agentur",
  "fortbildung",
  "saas",
  "physisch",
  "digital_download",
  "abo_service",
  "individuell",
];

const VERTRAGSSCHLUSS_ORDER: VertragsschlussArt[] = [
  "angebot_annahme",
  "automatische_buchung",
  "auftragsbestaetigung",
];

const VOR_ORT_ARTEN: LeistungsArt[] = [
  "beratung",
  "coaching",
  "agentur",
  "fortbildung",
];

export function StepLeistung() {
  const data = useAgbStore((s) => s.data);
  const patch = useAgbStore((s) => s.patch);

  const updateL = <K extends keyof typeof data.leistung>(
    key: K,
    value: (typeof data.leistung)[K],
  ) => {
    patch({ leistung: { ...data.leistung, [key]: value } });
  };

  const setArt = (art: LeistungsArt) => updateL("art", art);
  const setVertragsschluss = (v: VertragsschlussArt) => patch({ vertragsschluss: v });

  const showLeistungsort =
    !data.leistung.online && VOR_ORT_ARTEN.includes(data.leistung.art);

  const isShop = data.variante === "b2c_shop";

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Was bietest du an und wie kommt der Vertrag zustande? Die Leistungsart bestimmt die
        Klausel-Bausteine für Leistungserbringung, Gewährleistung und Erfüllungsort.
      </p>

      <Field label="Art der Leistung" required>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LEISTUNGSART_ORDER.map((a) => {
            const isActive = data.leistung.art === a;
            return (
              <button
                key={a}
                type="button"
                onClick={() => setArt(a)}
                className={
                  "px-3 py-3 text-left border transition " +
                  (isActive
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-bg-soft hover:border-accent")
                }
              >
                <div className="font-body text-[14px] leading-[1.6] font-medium text-ink">
                  {LEISTUNGSART_LABELS[a]}
                </div>
              </button>
            );
          })}
        </div>
      </Field>

      <Field
        label="Beschreibung der Leistung"
        required
        hint="Was bietest du genau an? Wird im Geltungsbereich-Kontext verwendet. 1-3 Sätze reichen."
      >
        <TextArea
          value={data.leistung.beschreibung}
          onChange={(e) => updateL("beschreibung", e.target.value)}
          placeholder="z.B. Webdesign- und Marketing-Dienstleistungen für kleine Unternehmen aus dem DACH-Raum, inkl. Beratung, Konzeption und Umsetzung."
          rows={4}
        />
      </Field>

      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Leistungsort
        </p>

        <label className="flex items-start gap-3 cursor-pointer group mb-3">
          <input
            type="checkbox"
            checked={data.leistung.online}
            onChange={(e) => updateL("online", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Leistung wird online erbracht</strong>
            </span>
            <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
              z.B. Remote-Beratung, Online-Kurs, SaaS, digitaler Download. Wenn deaktiviert,
              kannst du den Vor-Ort-Leistungsort eintragen.
            </p>
          </div>
        </label>

        {showLeistungsort && (
          <div className="border border-line bg-bg-soft p-5 mt-3">
            <Field
              label="Leistungsort (Vor-Ort)"
              hint="z.B. Geschäftsadresse des Kunden oder Veranstaltungsort. Bleibt leer = sitz des Anbieters."
            >
              <TextInput
                value={data.leistung.leistungsort ?? ""}
                onChange={(e) => updateL("leistungsort", e.target.value)}
                placeholder="z.B. beim Kunden vor Ort, deutschlandweit"
              />
            </Field>
          </div>
        )}
      </div>

      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Vertragsschluss
        </p>
        <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
          Wie kommt der Vertrag zustande? Bestimmt § 2 der AGB.
        </p>

        {isShop ? (
          <div className="border-l-4 border-accent bg-accent-soft p-4">
            <p className="font-body text-[14px] leading-[1.6] text-ink">
              <strong>Bei B2C-Shop wird automatisch der Shop-Vertragsschluss verwendet</strong> —
              unverbindlicher Online-Katalog, Bestellung als Angebot, separate Annahme per
              Auftragsbestätigung oder Versand (§ 312i BGB).
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {VERTRAGSSCHLUSS_ORDER.map((v) => {
              const isActive = data.vertragsschluss === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVertragsschluss(v)}
                  className={
                    "px-4 py-3 text-left border transition " +
                    (isActive
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-bg-soft hover:border-accent")
                  }
                >
                  <div className="font-body text-[14px] leading-[1.6] font-medium text-ink">
                    {VERTRAGSSCHLUSS_LABELS[v]}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
