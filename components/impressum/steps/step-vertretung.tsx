"use client";

import { useImpressumStore } from "@/lib/impressum/store";
import { Field, TextInput } from "@/components/avv/field";
import { rechtsformConfig, BERUF_VORLAGEN } from "@/lib/impressum/defaults";
import type { Person, GewerbeerlaubnisTyp } from "@/lib/impressum/types";
import { GEWO_LABELS } from "@/lib/impressum/types";

export function StepVertretung() {
  const data = useImpressumStore((s) => s.data);
  const patch = useImpressumStore((s) => s.patch);
  const cfg = rechtsformConfig(data.rechtsform);

  const addPerson = () => {
    patch({
      vertretung: [...data.vertretung, { vorname: "", nachname: "", rolle: "" }],
    });
  };

  const updatePerson = (idx: number, key: keyof Person, value: string) => {
    const updated = [...data.vertretung];
    updated[idx] = { ...updated[idx], [key]: value };
    patch({ vertretung: updated });
  };

  const removePerson = (idx: number) => {
    patch({ vertretung: data.vertretung.filter((_, i) => i !== idx) });
  };

  const applyBerufVorlage = (id: string) => {
    const vorlage = BERUF_VORLAGEN.find((v) => v.id === id);
    if (!vorlage) return;
    patch({
      beruf: {
        aktiv: true,
        berufsbezeichnung: vorlage.berufsbezeichnung,
        verleihungsstaat: vorlage.verleihungsstaat,
        kammer: {
          name: vorlage.kammer.name,
          webseite: vorlage.kammer.webseite,
        },
        berufsrechtlicheRegelungen: vorlage.berufsrechtlicheRegelungen,
        zugaenglichUnter: vorlage.zugaenglichUnter,
      },
    });
  };

  const updateBeruf = <K extends keyof typeof data.beruf>(
    key: K,
    value: (typeof data.beruf)[K],
  ) => {
    patch({ beruf: { ...data.beruf, [key]: value } });
  };

  const updateKammer = (
    key: keyof NonNullable<typeof data.beruf.kammer>,
    value: string,
  ) => {
    patch({
      beruf: {
        ...data.beruf,
        kammer: {
          name: data.beruf.kammer?.name ?? "",
          ...data.beruf.kammer,
          [key]: value,
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {cfg.needsVertretung && (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
            Vertretungsberechtigte Personen
          </p>
          <p className="text-ink-dim font-body text-[14px] leading-[1.6] mb-4">
            Wer ist offiziell zur Vertretung berechtigt? Bei der GmbH: Geschäftsführer. Bei der
            GbR: alle Gesellschafter. Bei e.V.: Vorstandsmitglieder.
          </p>

          <div className="flex flex-col gap-3">
            {data.vertretung.map((p, idx) => (
              <div
                key={idx}
                className="border border-line bg-bg-soft p-4 flex flex-col gap-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Vorname" required>
                    <TextInput
                      value={p.vorname}
                      onChange={(e) => updatePerson(idx, "vorname", e.target.value)}
                      placeholder="Max"
                    />
                  </Field>
                  <Field label="Nachname" required>
                    <TextInput
                      value={p.nachname}
                      onChange={(e) => updatePerson(idx, "nachname", e.target.value)}
                      placeholder="Mustermann"
                    />
                  </Field>
                </div>
                <Field label="Rolle (optional)" hint="z. B. 'Geschäftsführer', '1. Vorsitzender'">
                  <TextInput
                    value={p.rolle ?? ""}
                    onChange={(e) => updatePerson(idx, "rolle", e.target.value)}
                    placeholder="Geschäftsführer"
                  />
                </Field>
                <button
                  type="button"
                  onClick={() => removePerson(idx)}
                  className="self-end font-mono text-[10px] uppercase tracking-widest text-ink-faded hover:text-accent transition"
                >
                  Entfernen
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPerson}
              className="px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest border border-line text-ink-dim hover:border-accent hover:text-accent transition self-start"
            >
              + Person hinzufügen
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-line pt-8">
        <label className="flex items-start gap-3 cursor-pointer group mb-5">
          <input
            type="checkbox"
            checked={data.beruf.aktiv}
            onChange={(e) => updateBeruf("aktiv", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
              Reglementierter Beruf
            </span>
            <span className="block font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition mt-1">
              Ich übe einen reglementierten Beruf aus (z. B. Arzt, Anwalt, Architekt,
              Steuerberater, zulassungspflichtiger Handwerker). Dann sind Kammer +
              Berufsbezeichnung + Berufsrecht pflicht.
            </span>
          </div>
        </label>

        {data.beruf.aktiv && (
          <div className="border border-line bg-bg-soft p-5 flex flex-col gap-4">
            <Field
              label="Schnellvorlage wählen"
              hint="Lädt Standardangaben für deinen Beruf — alles danach noch anpassbar"
            >
              <select
                onChange={(e) => applyBerufVorlage(e.target.value)}
                className="w-full bg-bg border border-line px-3 py-2.5 font-body text-[14px] leading-[1.6] text-ink outline-none focus:border-accent"
                defaultValue=""
              >
                <option value="">— Vorlage wählen —</option>
                {BERUF_VORLAGEN.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Berufsbezeichnung" required>
                <TextInput
                  value={data.beruf.berufsbezeichnung ?? ""}
                  onChange={(e) => updateBeruf("berufsbezeichnung", e.target.value)}
                  placeholder="Arzt / Ärztin"
                />
              </Field>
              <Field
                label="Verleihender Staat"
                required
                hint="In welchem Land wurde die Berufsbezeichnung verliehen"
              >
                <TextInput
                  value={data.beruf.verleihungsstaat ?? ""}
                  onChange={(e) => updateBeruf("verleihungsstaat", e.target.value)}
                  placeholder="Deutschland"
                />
              </Field>
            </div>

            <Field label="Zuständige Kammer" required>
              <TextInput
                value={data.beruf.kammer?.name ?? ""}
                onChange={(e) => updateKammer("name", e.target.value)}
                placeholder="Bayerische Landesärztekammer"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Adresse der Kammer (empfohlen)">
                <TextInput
                  value={data.beruf.kammer?.adresse ?? ""}
                  onChange={(e) => updateKammer("adresse", e.target.value)}
                  placeholder="Musterstraße 1, 12345 Musterstadt"
                />
              </Field>
              <Field label="Webseite der Kammer">
                <TextInput
                  value={data.beruf.kammer?.webseite ?? ""}
                  onChange={(e) => updateKammer("webseite", e.target.value)}
                  placeholder="https://www.kammer.de"
                />
              </Field>
            </div>

            <Field
              label="Berufsrechtliche Regelungen"
              required
              hint="z. B. 'Bundesärzteordnung, Berufsordnung der Landesärztekammer'"
            >
              <TextInput
                value={data.beruf.berufsrechtlicheRegelungen ?? ""}
                onChange={(e) => updateBeruf("berufsrechtlicheRegelungen", e.target.value)}
                placeholder="Bundesärzteordnung, Berufsordnung der Landesärztekammer"
              />
            </Field>

            <Field
              label="Einsehbar unter (URL)"
              hint="Wo finden Interessierte die Berufsordnung?"
            >
              <TextInput
                value={data.beruf.zugaenglichUnter ?? ""}
                onChange={(e) => updateBeruf("zugaenglichUnter", e.target.value)}
                placeholder="https://www.bundesaerztekammer.de/recht"
              />
            </Field>

            {/* HIGH FIX #8: Berufshaftpflicht-Versicherung */}
            <div className="border-t border-line pt-6 mt-2">
              <label className="flex items-start gap-3 cursor-pointer group mb-4">
                <input
                  type="checkbox"
                  checked={data.beruf.haftpflicht?.aktiv ?? false}
                  onChange={(e) =>
                    updateBeruf("haftpflicht", {
                      ...(data.beruf.haftpflicht ?? {}),
                      aktiv: e.target.checked,
                    })
                  }
                  className="mt-1 h-4 w-4 accent-accent"
                />
                <div>
                  <span className="font-display text-[15px] font-medium text-ink group-hover:text-accent transition">
                    Berufshaftpflicht-Versicherung angeben
                  </span>
                  <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1 max-w-xl">
                    Pflicht für Anwälte (§ 51 BRAO), Steuerberater (§ 67 StBerG), Ärzte
                    (Berufsordnung § 21), Architekten (Landesgesetze + HOAI). Bei aktiv:
                    Versicherer + Anschrift + geografischer Geltungsbereich pflicht.
                  </p>
                </div>
              </label>

              {data.beruf.haftpflicht?.aktiv && (
                <div className="space-y-4 ml-7">
                  <Field
                    label="Versicherer"
                    required
                    hint="Name der Versicherungsgesellschaft"
                  >
                    <TextInput
                      value={data.beruf.haftpflicht.versicherer ?? ""}
                      onChange={(e) =>
                        updateBeruf("haftpflicht", {
                          ...(data.beruf.haftpflicht ?? { aktiv: true }),
                          versicherer: e.target.value,
                        })
                      }
                      placeholder="HDI Versicherung AG"
                    />
                  </Field>
                  <Field
                    label="Anschrift Versicherer"
                    required
                    hint="Vollständige Geschäftsanschrift"
                  >
                    <TextInput
                      value={data.beruf.haftpflicht.anschrift ?? ""}
                      onChange={(e) =>
                        updateBeruf("haftpflicht", {
                          ...(data.beruf.haftpflicht ?? { aktiv: true }),
                          anschrift: e.target.value,
                        })
                      }
                      placeholder="HDI-Platz 1, 30659 Hannover"
                    />
                  </Field>
                  <Field
                    label="Räumlicher Geltungsbereich"
                    required
                    hint="Wo gilt die Versicherung? z. B. 'Deutschland' oder 'Deutschland und EU/EWR'"
                  >
                    <TextInput
                      value={data.beruf.haftpflicht.geltungsbereich ?? ""}
                      onChange={(e) =>
                        updateBeruf("haftpflicht", {
                          ...(data.beruf.haftpflicht ?? { aktiv: true }),
                          geltungsbereich: e.target.value,
                        })
                      }
                      placeholder="Deutschland und EU/EWR"
                    />
                  </Field>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* HIGH FIX #5: AG-Aufsichtsratsvorsitzender (§ 80 AktG) */}
      {data.rechtsform === "ag" && (
        <div className="border-t border-line pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
            Aufsichtsratsvorsitzender (§ 80 AktG)
          </p>
          <p className="font-body text-[14px] leading-[1.6] text-ink-dim mb-4">
            Bei AG zusätzlich zum Vorstand Pflicht im Impressum: Aufsichtsratsvorsitzender mit
            Vor- und Nachname.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Vorname" required>
              <TextInput
                value={data.aufsichtsratsvorsitzender?.vorname ?? ""}
                onChange={(e) =>
                  patch({
                    aufsichtsratsvorsitzender: {
                      vorname: e.target.value,
                      nachname: data.aufsichtsratsvorsitzender?.nachname ?? "",
                    },
                  })
                }
                placeholder="Maria"
              />
            </Field>
            <Field label="Nachname" required>
              <TextInput
                value={data.aufsichtsratsvorsitzender?.nachname ?? ""}
                onChange={(e) =>
                  patch({
                    aufsichtsratsvorsitzender: {
                      vorname: data.aufsichtsratsvorsitzender?.vorname ?? "",
                      nachname: e.target.value,
                    },
                  })
                }
                placeholder="Schmidt"
              />
            </Field>
          </div>
        </div>
      )}

      {/* HIGH FIX #6: Verein/Stiftung-Zusatz */}
      {(data.rechtsform === "ev" || data.rechtsform === "stiftung") && (
        <div className="border-t border-line pt-8">
          <label className="flex items-start gap-3 cursor-pointer group mb-4">
            <input
              type="checkbox"
              checked={data.vereinszusatz.aktiv}
              onChange={(e) =>
                patch({ vereinszusatz: { ...data.vereinszusatz, aktiv: e.target.checked } })
              }
              className="mt-1 h-4 w-4 accent-accent"
            />
            <div>
              <span className="font-display text-[15px] font-medium text-ink group-hover:text-accent transition">
                {data.rechtsform === "stiftung"
                  ? "Stiftungsangaben ergänzen"
                  : "Vereinsangaben ergänzen"}
              </span>
              <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1 max-w-xl">
                {data.rechtsform === "stiftung"
                  ? "Stiftungsbehörde (Pflicht), Vereinszweck und Gemeinnützigkeit nach § 52 AO."
                  : "Vereinszweck (1-2 Sätze) und Gemeinnützigkeit nach § 52 AO mit Freistellungsbescheid."}
              </p>
            </div>
          </label>

          {data.vereinszusatz.aktiv && (
            <div className="space-y-4 ml-7">
              <Field
                label="Vereins-/Stiftungszweck"
                required
                hint="1–2 Sätze die den Zweck beschreiben"
              >
                <TextInput
                  value={data.vereinszusatz.vereinszweck ?? ""}
                  onChange={(e) =>
                    patch({
                      vereinszusatz: { ...data.vereinszusatz, vereinszweck: e.target.value },
                    })
                  }
                  placeholder="Förderung des Vereinssports und der Jugendarbeit im Stadtteil"
                />
              </Field>

              {data.rechtsform === "stiftung" && (
                <Field
                  label="Stiftungsbehörde"
                  required
                  hint="z. B. 'Regierungspräsidium Stuttgart' — zuständig je nach Bundesland"
                >
                  <TextInput
                    value={data.vereinszusatz.stiftungsbehoerde ?? ""}
                    onChange={(e) =>
                      patch({
                        vereinszusatz: {
                          ...data.vereinszusatz,
                          stiftungsbehoerde: e.target.value,
                        },
                      })
                    }
                    placeholder="Regierungspräsidium Stuttgart"
                  />
                </Field>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.vereinszusatz.gemeinnuetzig ?? false}
                  onChange={(e) =>
                    patch({
                      vereinszusatz: {
                        ...data.vereinszusatz,
                        gemeinnuetzig: e.target.checked,
                      },
                    })
                  }
                  className="mt-1 h-4 w-4 accent-accent"
                />
                <span className="font-body text-[14px] leading-[1.6] text-ink">
                  Steuerlich begünstigt als gemeinnützig nach § 52 AO
                </span>
              </label>

              {data.vereinszusatz.gemeinnuetzig && (
                <Field
                  label="Freistellungsbescheid"
                  required
                  hint="Welches Finanzamt + Datum (z. B. 'Finanzamt Stuttgart vom 15.03.2024')"
                >
                  <TextInput
                    value={data.vereinszusatz.freistellungsbescheidVon ?? ""}
                    onChange={(e) =>
                      patch({
                        vereinszusatz: {
                          ...data.vereinszusatz,
                          freistellungsbescheidVon: e.target.value,
                        },
                      })
                    }
                    placeholder="Finanzamt Stuttgart vom 15.03.2024"
                  />
                </Field>
              )}
            </div>
          )}
        </div>
      )}

      {/* MEDIUM FIX #9: KG/OHG-Rollen-Hinweis */}
      {(data.rechtsform === "kg" || data.rechtsform === "ohg") && data.vertretung.length > 0 && (
        <div className="border-t border-line pt-6">
          <p className="font-body text-[12px] leading-[1.5] text-ink-faded max-w-xl">
            <strong className="text-ink">Tipp für {data.rechtsform === "kg" ? "KG" : "OHG"}:</strong>{" "}
            {data.rechtsform === "kg"
              ? "Nutze das Rollen-Feld bei jeder Person, um Komplementäre (persönlich haftend) von Kommanditisten (Einlage-haftend) zu unterscheiden. Im Impressum sollten Komplementäre klar erkennbar sein."
              : "Bei der OHG haften alle Gesellschafter persönlich. Nutze das Rollen-Feld, um den vertretungsberechtigten Geschäftsführer hervorzuheben."}
          </p>
        </div>
      )}

      {/* MEDIUM FIX #12: Genossenschaft-Hinweis */}
      {data.rechtsform === "andere" && data.rechtsformAndere?.toLowerCase().includes("genossen") && (
        <div className="border-t border-line pt-6">
          <p className="font-body text-[12px] leading-[1.5] text-ink-faded max-w-xl">
            <strong className="text-ink">Hinweis Genossenschaft:</strong> Bei eG zusätzlich Pflicht
            im Impressum: Aufsichtsrats-Vorsitz + Verweis auf Generalversammlung als oberstes Organ
            (§ 43 GenG). Diese Felder ergänzt du am besten in den Rollen der Vertretungs-Personen
            oben.
          </p>
        </div>
      )}

      {/* CRITICAL FIX #1: § 34 GewO-Erlaubnispflichten */}
      <div className="border-t border-line pt-8">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={data.gewerbeerlaubnis.aktiv}
            onChange={(e) =>
              patch({ gewerbeerlaubnis: { ...data.gewerbeerlaubnis, aktiv: e.target.checked } })
            }
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-display text-[15px] font-medium text-ink group-hover:text-accent transition">
              Erlaubnispflichtige Tätigkeit nach § 34 GewO
            </span>
            <p className="font-body text-[12px] leading-[1.5] text-ink-faded mt-1 max-w-xl">
              Pflicht für: Immobilienmakler, Bauträger, Versicherungsvermittler/-berater,
              Finanzanlagenvermittler, Honorar-Finanzanlagenberater, Wohnimmobilien-Kreditvermittler.
              Wenn aktiv: Erlaubnisbehörde + Registernummer Pflichtangaben.
            </p>
          </div>
        </label>

        {data.gewerbeerlaubnis.aktiv && (
          <div className="mt-6 space-y-4 ml-7">
            <Field label="Erlaubnis-Typ" required>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(Object.keys(GEWO_LABELS) as GewerbeerlaubnisTyp[]).map((typ) => {
                  const isActive = data.gewerbeerlaubnis.typ === typ;
                  const info = GEWO_LABELS[typ];
                  return (
                    <button
                      key={typ}
                      type="button"
                      onClick={() => {
                        const next: typeof data.gewerbeerlaubnis = {
                          ...data.gewerbeerlaubnis,
                          typ,
                          erlaubnisbehoerde:
                            data.gewerbeerlaubnis.erlaubnisbehoerde || info.defaultBehoerde,
                          vermittlerregisterUrl:
                            data.gewerbeerlaubnis.vermittlerregisterUrl ||
                            info.defaultRegisterUrl,
                        };
                        patch({ gewerbeerlaubnis: next });
                      }}
                      className={
                        "px-3 py-3 text-left border transition " +
                        (isActive
                          ? "border-accent bg-accent-soft"
                          : "border-line bg-bg-soft hover:border-accent")
                      }
                    >
                      <div className="font-display text-[14px] font-medium text-ink">
                        {info.kurz}
                      </div>
                      <div className="font-body text-[12px] leading-[1.4] text-ink-dim mt-0.5">
                        {info.lang}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field
              label="Erlaubnisbehörde"
              required
              hint="Welche Behörde hat die Erlaubnis erteilt? (z. B. zuständige IHK oder Gewerbeamt)"
            >
              <TextInput
                value={data.gewerbeerlaubnis.erlaubnisbehoerde ?? ""}
                onChange={(e) =>
                  patch({
                    gewerbeerlaubnis: {
                      ...data.gewerbeerlaubnis,
                      erlaubnisbehoerde: e.target.value,
                    },
                  })
                }
                placeholder="Industrie- und Handelskammer Stuttgart"
              />
            </Field>

            <Field
              label="Anschrift der Erlaubnisbehörde (optional)"
              hint="Volle Adresse für besseren Verifizierungs-Anchor"
            >
              <TextInput
                value={data.gewerbeerlaubnis.erlaubnisbehoerdeAdresse ?? ""}
                onChange={(e) =>
                  patch({
                    gewerbeerlaubnis: {
                      ...data.gewerbeerlaubnis,
                      erlaubnisbehoerdeAdresse: e.target.value,
                    },
                  })
                }
                placeholder="Jägerstraße 30, 70174 Stuttgart"
              />
            </Field>

            <Field
              label="Registernummer"
              required={data.gewerbeerlaubnis.typ !== "gewo_34c"}
              hint={
                data.gewerbeerlaubnis.typ === "gewo_34c"
                  ? "Bei § 34c-Erlaubnis nicht zwingend, aber empfohlen"
                  : "Pflicht bei §§ 34d, 34f, 34h, 34i — z. B. 'D-W-104-RAYHJ-67'"
              }
            >
              <TextInput
                value={data.gewerbeerlaubnis.registernummer ?? ""}
                onChange={(e) =>
                  patch({
                    gewerbeerlaubnis: {
                      ...data.gewerbeerlaubnis,
                      registernummer: e.target.value,
                    },
                  })
                }
                placeholder="D-W-104-RAYHJ-67"
              />
            </Field>

            <Field
              label="Vermittlerregister-URL (optional)"
              hint="Standard wird automatisch vorausgefüllt — bei abweichendem Register überschreiben"
            >
              <TextInput
                value={data.gewerbeerlaubnis.vermittlerregisterUrl ?? ""}
                onChange={(e) =>
                  patch({
                    gewerbeerlaubnis: {
                      ...data.gewerbeerlaubnis,
                      vermittlerregisterUrl: e.target.value,
                    },
                  })
                }
                placeholder="https://www.vermittlerregister.info"
              />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}
