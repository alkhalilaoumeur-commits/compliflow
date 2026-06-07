"use client";

import { useAvvStore } from "@/lib/avv/store";
import { Field, TextArea, CharCounter } from "../field";

const ARTEN = [
  "Erheben",
  "Speichern",
  "Anpassen",
  "Übermitteln",
  "Auslesen",
  "Abgleichen",
  "Verknüpfen",
  "Einschränken",
  "Löschen",
  "Vernichten",
] as const;

export function StepVerarbeitung() {
  const data = useAvvStore((s) => s.data.verarbeitung);
  const update = useAvvStore((s) => s.update);

  const set = (patch: Partial<typeof data>) => update("verarbeitung", { ...data, ...patch });

  const toggleArt = (art: string) => {
    const current = data.arten ?? [];
    const next = current.includes(art as never)
      ? current.filter((a) => a !== art)
      : [...current, art];
    set({ arten: next as typeof data.arten });
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <Field
        label="Gegenstand der Verarbeitung"
        required
        hint="Was genau soll der Auftragsverarbeiter mit den Daten tun?"
      >
        <TextArea
          placeholder="z.B. Versand von Transaktions-E-Mails im Rahmen der Bestellabwicklung"
          value={data.gegenstand ?? ""}
          onChange={(e) => set({ gegenstand: e.target.value })}
          invalid={(data.gegenstand?.length ?? 0) > 0 && (data.gegenstand?.length ?? 0) < 10}
        />
        <div className="flex justify-end">
          <CharCounter value={data.gegenstand ?? ""} min={10} max={2000} />
        </div>
      </Field>

      <Field label="Dauer der Verarbeitung" required>
        <div className="flex flex-col gap-2">
          {(["vertragslaufzeit", "unbefristet", "befristet"] as const).map((typ) => {
            const isSelected = data.dauer?.typ === typ;
            return (
              <button
                key={typ}
                type="button"
                onClick={() => set({ dauer: typ === "befristet" ? { typ, bis: "" } : { typ } })}
                className={
                  "flex items-center gap-3 p-4 border text-left transition w-full " +
                  (isSelected
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-bg-soft hover:border-accent")
                }
              >
                <span
                  className={`flex-shrink-0 inline-flex h-4 w-4 rounded-full border items-center justify-center transition ${
                    isSelected ? "border-accent bg-accent" : "border-line"
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && (
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-bg" />
                  )}
                </span>
                <span className="text-sm text-ink">
                  {typ === "vertragslaufzeit" && "Für die Dauer des Hauptvertrags"}
                  {typ === "unbefristet" && "Unbefristet (bis zur Kündigung)"}
                  {typ === "befristet" && "Befristet bis zu einem konkreten Datum"}
                </span>
              </button>
            );
          })}
          {data.dauer?.typ === "befristet" && (
            <input
              type="date"
              value={data.dauer.bis}
              onChange={(e) => set({ dauer: { typ: "befristet", bis: e.target.value } })}
              className="bg-bg-soft border border-line px-4 py-3 text-sm text-ink outline-none focus:border-accent transition"
            />
          )}
        </div>
      </Field>

      <Field label="Zweck der Verarbeitung" required>
        <TextArea
          placeholder="z.B. Versand von Bestätigungs- und Rechnungs-Mails an Kunden"
          value={data.zweck ?? ""}
          onChange={(e) => set({ zweck: e.target.value })}
          invalid={(data.zweck?.length ?? 0) > 0 && (data.zweck?.length ?? 0) < 10}
        />
        <div className="flex justify-end">
          <CharCounter value={data.zweck ?? ""} min={10} max={2000} />
        </div>
      </Field>

      <Field label="Art der Verarbeitung" required hint="Mehrfachauswahl möglich">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ARTEN.map((art) => {
            const active = (data.arten ?? []).includes(art);
            return (
              <button
                key={art}
                type="button"
                onClick={() => toggleArt(art)}
                className={
                  "px-4 py-3 text-sm border transition text-left " +
                  (active
                    ? "bg-accent text-bg border-accent"
                    : "bg-bg-soft border-line text-ink hover:border-accent")
                }
              >
                {art}
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}
