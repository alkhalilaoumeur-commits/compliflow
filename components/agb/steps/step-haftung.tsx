"use client";

import { useAgbStore } from "@/lib/agb/store";
import { Field, TextInput, TextArea } from "@/components/avv/field";
import { isDigitaleArt, isDauerschuldArt } from "@/lib/agb/types";

const parseIntOr = (raw: string, fallback: number): number => {
  const n = parseInt(raw, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(0, n);
};

const parseIntOptional = (raw: string): number | undefined => {
  const trimmed = raw.trim();
  if (trimmed === "") return undefined;
  const n = parseInt(trimmed, 10);
  if (Number.isNaN(n)) return undefined;
  return Math.max(0, n);
};

export function StepHaftung() {
  const data = useAgbStore((s) => s.data);
  const patch = useAgbStore((s) => s.patch);

  const updateG = <K extends keyof typeof data.gewaehrleistung>(
    key: K,
    value: (typeof data.gewaehrleistung)[K],
  ) => {
    patch({ gewaehrleistung: { ...data.gewaehrleistung, [key]: value } });
  };

  const updateH = <K extends keyof typeof data.haftung>(
    key: K,
    value: (typeof data.haftung)[K],
  ) => {
    patch({ haftung: { ...data.haftung, [key]: value } });
  };

  const updateD = <K extends keyof typeof data.dauervertrag>(
    key: K,
    value: (typeof data.dauervertrag)[K],
  ) => {
    patch({ dauervertrag: { ...data.dauervertrag, [key]: value } });
  };

  const updateDig = <K extends keyof typeof data.digital>(
    key: K,
    value: (typeof data.digital)[K],
  ) => {
    patch({ digital: { ...data.digital, [key]: value } });
  };

  const updateVtr = <K extends keyof typeof data.vertraulichkeit>(
    key: K,
    value: (typeof data.vertraulichkeit)[K],
  ) => {
    patch({ vertraulichkeit: { ...data.vertraulichkeit, [key]: value } });
  };

  const isB2B = data.variante === "b2b";
  const isB2C = !isB2B;
  const istDigitalArt = isDigitaleArt(data.leistung.art);
  const istDauerArt = isDauerschuldArt(data.leistung.art);

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Gewährleistung und Haftungsbeschränkungen. Bei B2C streng geregelt — übertriebene
        Klauseln sind nach §§ 308, 309 BGB automatisch unwirksam.
      </p>

      <div className="border-l-4 border-warn bg-bg-soft p-4">
        <p className="font-body text-[14px] leading-[1.6] text-ink">
          <strong className="text-warn">Hinweis:</strong> Haftungsklauseln sind besonders streng
          bei B2C — Übertreibung führt zu Unwirksamkeit (§ 309 BGB). Compliflow nutzt
          standardkonforme Bausteine.
        </p>
      </div>

      {/* Gewährleistung */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Gewährleistung
        </p>

        <Field
          label="Gewährleistungsfrist (Monate)"
          hint={
            isB2C
              ? "B2C: 24 Monate sind Pflicht und können nicht verkürzt werden."
              : "B2B: 12 Monate möglich. Schadensersatz wegen Personenschäden, Vorsatz und Garantieübernahme bleiben unberührt."
          }
        >
          <TextInput
            type="number"
            inputMode="numeric"
            min={isB2C ? 24 : 12}
            max={60}
            value={String(data.gewaehrleistung.fristMonate)}
            onChange={(e) => {
              const min = isB2C ? 24 : 12;
              const n = parseIntOr(e.target.value, min);
              updateG("fristMonate", Math.max(min, Math.min(n, 60)));
            }}
            placeholder={isB2C ? "24" : "12"}
          />
        </Field>

        {isB2B && (
          <div className="mt-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={data.gewaehrleistung.unterlassenRuegepflicht}
                onChange={(e) => updateG("unterlassenRuegepflicht", e.target.checked)}
                className="mt-1 h-4 w-4 accent-accent"
              />
              <div>
                <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                  <strong className="text-ink">Rügepflicht nach § 377 HGB durchsetzen</strong>
                </span>
                <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                  Bei B2B: Auftraggeber muss offensichtliche Mängel innerhalb von 5 Werktagen
                  nach Erhalt schriftlich rügen, andernfalls gilt die Leistung als genehmigt.
                </p>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Haftung */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Haftungsbeschränkungen
        </p>

        <div className="flex flex-col gap-3">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.haftung.beschraenkungAufVorsatzGrobeFL}
              onChange={(e) => updateH("beschraenkungAufVorsatzGrobeFL", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <div>
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">Beschränkung auf Vorsatz & grobe Fahrlässigkeit</strong>
              </span>
              <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                Standard-Klausel. Personenschäden und Produkthaftung bleiben in jedem Fall
                unberührt.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.haftung.beschraenkungVertragstypisch}
              onChange={(e) => updateH("beschraenkungVertragstypisch", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <div>
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">Beschränkung auf vertragstypischen, vorhersehbaren Schaden</strong>
              </span>
              <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                Beschränkt die Haftung bei einfacher Fahrlässigkeit auf Schäden, die zum Zeitpunkt
                des Vertragsschlusses absehbar waren.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.haftung.datenverlustAusgeschlossen}
              onChange={(e) => updateH("datenverlustAusgeschlossen", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <div>
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">Datenverlust-Klausel</strong>
              </span>
              <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                {isB2B
                  ? "B2B: Haftung für Datenverlust nur, wenn nicht durch zumutbare Backups vermeidbar."
                  : "B2C: Hinweis dass Kunden Sicherungskopien anlegen sollten."}
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.haftung.mitverschuldenAnrechnung}
              onChange={(e) => updateH("mitverschuldenAnrechnung", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <div>
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">Mitverschulden anrechnen</strong>
              </span>
              <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                Standard nach § 254 BGB — bei eigenem Mitverschulden des Kunden wird die Haftung
                anteilig reduziert.
              </p>
            </div>
          </label>
        </div>

        {isB2B && (
          <div className="mt-6">
            <Field
              label="Höchstbetrag pro Schadensfall in EUR (optional)"
              hint="Nur B2B-Empfehlung. Bei Vorsatz, grober Fahrlässigkeit und Personenschäden gilt diese Grenze NICHT."
            >
              <TextInput
                type="number"
                inputMode="numeric"
                min={0}
                value={String(data.haftung.hoechstbetragEuro ?? "")}
                onChange={(e) =>
                  updateH("hoechstbetragEuro", parseIntOptional(e.target.value))
                }
                placeholder="z.B. 50000"
              />
            </Field>
          </div>
        )}
      </div>

      {/* Datenschutz & Widerruf Links */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Verweise auf andere Rechtstexte
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="URL Datenschutzerklärung" hint="Relativer Pfad reicht">
            <TextInput
              value={data.datenschutzUrl}
              onChange={(e) => patch({ datenschutzUrl: e.target.value })}
              placeholder="/datenschutz"
            />
          </Field>

          {isB2C && (
            <Field label="URL Widerrufsbelehrung" hint="Pflicht bei B2C">
              <TextInput
                value={data.widerrufUrl}
                onChange={(e) => patch({ widerrufUrl: e.target.value })}
                placeholder="/widerruf"
              />
            </Field>
          )}
        </div>
      </div>

      {/* B2B Gerichtsstand / Erfüllungsort */}
      {isB2B && (
        <div className="border-t border-line pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
            B2B-Klauseln
          </p>
          <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
            Gerichtsstand und Erfüllungsort sind im B2B vereinbar — bei B2C nicht möglich.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Gerichtsstand"
              hint={`Wenn leer: ${data.anbieter.ort || "Sitz des Anbieters"}`}
            >
              <TextInput
                value={data.gerichtsstand}
                onChange={(e) => patch({ gerichtsstand: e.target.value })}
                placeholder={data.anbieter.ort || "Stuttgart"}
              />
            </Field>

            <Field
              label="Erfüllungsort"
              hint={`Wenn leer: ${data.anbieter.ort || "Sitz des Anbieters"}`}
            >
              <TextInput
                value={data.erfuellungsort}
                onChange={(e) => patch({ erfuellungsort: e.target.value })}
                placeholder={data.anbieter.ort || "Stuttgart"}
              />
            </Field>
          </div>

          {/* L1 — Schiedsklausel */}
          <label className="mt-5 flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.schiedsklausel}
              onChange={(e) => patch({ schiedsklausel: e.target.checked })}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <div>
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">Schiedsklausel (DIS) ergänzen</strong>
              </span>
              <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                Streitigkeiten werden vor einem Schiedsgericht nach Schiedsgerichtsordnung der DIS
                entschieden, Schiedsort = Gerichtsstand, Verfahrenssprache Deutsch.
              </p>
            </div>
          </label>
        </div>
      )}

      {/* ─────────── C2 + C3: Dauervertrag B2C (FairKonG + Kündigungsbutton) ─────────── */}
      {isB2C && (
        <div className="border-t border-line pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
            Dauerschuldverhältnis (FairKonG + § 312k Kündigungsbutton)
          </p>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.dauervertrag.istDauervertrag}
              onChange={(e) => updateD("istDauervertrag", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <div>
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">Dies ist ein Dauerschuldverhältnis</strong>
                {istDauerArt && (
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-accent">
                    empfohlen für {data.leistung.art}
                  </span>
                )}
              </span>
              <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                Abo, SaaS, fortlaufendes Coaching o.ä. Aktiviert FairKonG-Klausel (max. 24 Monate
                Erstlaufzeit B2C, max. 1 Monat Verlängerungskündigung) + § 312k BGB
                Kündigungsbutton-Pflicht seit 01.07.2022.
              </p>
            </div>
          </label>

          {data.dauervertrag.istDauervertrag && (
            <div className="border border-line bg-bg-soft p-5 mt-4 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Erstlaufzeit (Monate)"
                  hint="Max. 24 Monate bei B2C (§ 309 Nr. 9 BGB n.F.)"
                >
                  <TextInput
                    type="number"
                    min={1}
                    max={24}
                    value={String(data.dauervertrag.erstlaufzeitMonate)}
                    onChange={(e) =>
                      updateD(
                        "erstlaufzeitMonate",
                        Math.max(1, Math.min(24, parseIntOr(e.target.value, 12))),
                      )
                    }
                  />
                </Field>
                <Field
                  label="Verlängerungs-Kündigungsfrist (Tage)"
                  hint="Max. 30 Tage (= 1 Monat) bei automatischer Verlängerung B2C"
                >
                  <TextInput
                    type="number"
                    min={1}
                    max={30}
                    value={String(data.dauervertrag.verlaengerungsKuendigungsfristTage)}
                    onChange={(e) =>
                      updateD(
                        "verlaengerungsKuendigungsfristTage",
                        Math.max(1, Math.min(30, parseIntOr(e.target.value, 30))),
                      )
                    }
                  />
                </Field>
              </div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={data.dauervertrag.automatischeVerlaengerung}
                  onChange={(e) => updateD("automatischeVerlaengerung", e.target.checked)}
                  className="mt-1 h-4 w-4 accent-accent"
                />
                <div>
                  <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                    <strong className="text-ink">Automatische Verlängerung</strong>
                  </span>
                  <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                    Bei B2C nur auf unbestimmte Zeit mit max. 1-Monats-Kündigungsfrist zulässig.
                  </p>
                </div>
              </label>
              <Field
                label="URL zum Kündigungsbutton (§ 312k BGB) — empfohlen"
                hint="Direktlink zur Kündigungsschaltfläche. Pflicht bei Online-Abschluss seit 01.07.2022."
              >
                <TextInput
                  value={data.dauervertrag.kuendigungsButtonUrl ?? ""}
                  onChange={(e) => updateD("kuendigungsButtonUrl", e.target.value || undefined)}
                  placeholder="z.B. https://example.de/kuendigen"
                />
              </Field>
            </div>
          )}
        </div>
      )}

      {/* ─────────── H1, M2, M3, M5, M7: Digitales Produkt §§ 327 ff. BGB ─────────── */}
      {isB2C && (
        <div className="border-t border-line pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
            Digitales Produkt / Dienstleistung (§§ 327 ff. BGB)
          </p>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.digital.istDigital || istDigitalArt}
              disabled={istDigitalArt}
              onChange={(e) => updateDig("istDigital", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <div>
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">§§ 327 ff. BGB-Klausel aktivieren</strong>
                {istDigitalArt && (
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-accent">
                    automatisch bei {data.leistung.art}
                  </span>
                )}
              </span>
              <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                Pflicht seit 01.01.2022 bei digitalen Produkten/Dienstleistungen an Verbraucher:
                Updates-Pflicht (§ 327f), Sicherheits-Updates (§ 327g), Verjährung 2 Jahre nach
                Ende der Bereitstellungsdauer (§ 475e BGB).
              </p>
            </div>
          </label>

          {(data.digital.istDigital || istDigitalArt) && (
            <div className="border border-line bg-bg-soft p-5 mt-4 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Bereitstellungs-/Updates-Zeitraum (Monate)"
                  hint="Wie lange werden Updates bereitgestellt? Bei Dauer-SaaS = während gesamter Vertragslaufzeit."
                >
                  <TextInput
                    type="number"
                    min={1}
                    value={String(data.digital.bereitstellungsZeitraumMonate)}
                    onChange={(e) =>
                      updateDig(
                        "bereitstellungsZeitraumMonate",
                        Math.max(1, parseIntOr(e.target.value, 24)),
                      )
                    }
                  />
                </Field>
                <Field
                  label="Daten-Export bei Vertragsende (Tage)"
                  hint="Frist, in der Kunden Daten exportieren können (Best-Practice)"
                >
                  <TextInput
                    type="number"
                    min={1}
                    value={String(data.digital.datenExportTage)}
                    onChange={(e) =>
                      updateDig("datenExportTage", Math.max(1, parseIntOr(e.target.value, 30)))
                    }
                  />
                </Field>
              </div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={data.digital.sicherheitsUpdates}
                  onChange={(e) => updateDig("sicherheitsUpdates", e.target.checked)}
                  className="mt-1 h-4 w-4 accent-accent"
                />
                <div>
                  <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                    <strong className="text-ink">Sicherheits-Updates auch nach Bereitstellungsdauer (§ 327g BGB)</strong>
                  </span>
                  <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                    Gilt für die übliche Nutzungsdauer — bei Streit hilft dieser Hinweis.
                  </p>
                </div>
              </label>

              <Field label="Nutzungsrechte" required>
                <select
                  value={data.digital.nutzungsRechte}
                  onChange={(e) =>
                    updateDig(
                      "nutzungsRechte",
                      e.target.value as typeof data.digital.nutzungsRechte,
                    )
                  }
                  className="w-full bg-bg-soft border border-line px-4 py-3 text-ink font-body text-base outline-none focus:border-accent transition"
                >
                  <option value="persoenlich">Nur persönlicher Gebrauch (Standard)</option>
                  <option value="einfach">Einfaches, nicht-übertragbares Nutzungsrecht</option>
                  <option value="kommerziell">Kommerzielle Nutzung erlaubt</option>
                </select>
              </Field>

              <Field
                label="Geräte-Limit (optional)"
                hint="Wie viele Geräte dürfen gleichzeitig genutzt werden? Leer = unbegrenzt"
              >
                <TextInput
                  type="number"
                  min={1}
                  value={String(data.digital.geraeteLimit ?? "")}
                  onChange={(e) =>
                    updateDig("geraeteLimit", parseIntOptional(e.target.value))
                  }
                  placeholder="z.B. 3"
                />
              </Field>

              {data.leistung.art === "saas" && (
                <Field
                  label="Angestrebte Verfügbarkeit (SLA)"
                  hint={'z.B. „98 % im Jahresmittel". Keine harte Zusage = realistisch bleiben.'}
                >
                  <TextInput
                    value={data.digital.verfuegbarkeitsZiel ?? ""}
                    onChange={(e) =>
                      updateDig("verfuegbarkeitsZiel", e.target.value || undefined)
                    }
                    placeholder="z.B. 98 % im Jahresmittel"
                  />
                </Field>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─────────── M4: Vertraulichkeit (Coaching / Beratung) ─────────── */}
      {(data.leistung.art === "coaching" || data.leistung.art === "beratung") && (
        <div className="border-t border-line pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
            Vertraulichkeit (Coaching / Beratung)
          </p>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.vertraulichkeit.vertraulichkeitsKlausel}
              onChange={(e) => updateVtr("vertraulichkeitsKlausel", e.target.checked)}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <div>
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">Vertraulichkeitsklausel aufnehmen</strong>
              </span>
              <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                Beide Seiten verpflichten sich, sensible Informationen aus der Beratung
                vertraulich zu behandeln.
              </p>
            </div>
          </label>
          {data.vertraulichkeit.vertraulichkeitsKlausel && (
            <div className="mt-4">
              <Field
                label="Nachvertragliche Vertraulichkeit (Jahre)"
                hint="Wie lange gilt die Schweigepflicht nach Vertragsende? Typisch 2-5 Jahre."
              >
                <TextInput
                  type="number"
                  min={1}
                  max={10}
                  value={String(data.vertraulichkeit.nachvertraglichJahre)}
                  onChange={(e) =>
                    updateVtr(
                      "nachvertraglichJahre",
                      Math.max(1, Math.min(10, parseIntOr(e.target.value, 3))),
                    )
                  }
                />
              </Field>
            </div>
          )}
        </div>
      )}

      {/* ─────────── M1: Force Majeure ─────────── */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Höhere Gewalt
        </p>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.forceMajeureKlausel}
            onChange={(e) => patch({ forceMajeureKlausel: e.target.checked })}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Force-Majeure-Klausel ergänzen</strong>
            </span>
            <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
              Pandemien, Cyberangriffe, Streiks, Stromausfälle: Befreiung von Leistungspflicht für
              Dauer des Ereignisses, Rücktrittsrecht nach 8 Wochen.
            </p>
          </div>
        </label>
      </div>

      {/* ─────────── H2: VSBG (B2C) ─────────── */}
      {isB2C && (
        <div className="border-t border-line pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
            Verbraucher-Streitbeilegung (§ 36 VSBG)
          </p>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={data.vsbgTeilnahmebereit}
              onChange={(e) => patch({ vsbgTeilnahmebereit: e.target.checked })}
              className="mt-1 h-4 w-4 accent-accent"
            />
            <div>
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">Wir nehmen an Verbraucher-Streitbeilegung teil</strong>
              </span>
              <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1">
                Standard für Solo-Anbieter: <em>nicht</em> teilnahmebereit, das wird in der
                Klausel klar gestellt.
              </p>
            </div>
          </label>
          {data.vsbgTeilnahmebereit && (
            <div className="mt-4">
              <Field
                label="Konkrete Schlichtungsstelle"
                required
                hint="Pflicht nach § 36 Abs. 1 Nr. 2 VSBG — Name + Anschrift + Webseite"
              >
                <TextArea
                  value={data.vsbgSchlichtungsstelle ?? ""}
                  onChange={(e) =>
                    patch({ vsbgSchlichtungsstelle: e.target.value || undefined })
                  }
                  rows={2}
                  placeholder="z.B. Universalschlichtungsstelle des Bundes, Zentrum für Schlichtung e.V., Straßburger Str. 8, 77694 Kehl, www.universalschlichtungsstelle.de"
                />
              </Field>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
