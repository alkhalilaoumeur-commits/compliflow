"use client";

import { useState } from "react";
import { useCookieBannerStore } from "@/lib/cookie-banner/store";
import { Field, TextInput, TextArea } from "@/components/avv/field";
import {
  TOOL_TYP_LABELS,
  KATEGORIE_LABELS,
  type TrackingTool,
  type TrackingToolTyp,
  type KategorieId,
} from "@/lib/cookie-banner/types";

const TOOL_ORDER: TrackingToolTyp[] = [
  "ga4",
  "gtm",
  "plausible",
  "matomo",
  "hotjar",
  "microsoft_clarity",
  "meta_pixel",
  "tiktok_pixel",
  "linkedin_insight",
  "google_ads",
  "youtube_iframe",
  "vimeo",
  "google_maps",
  "google_fonts",
  "google_recaptcha",
  "intercom",
  "crisp_chat",
  "custom_script",
];

const KATEGORIE_ORDER: KategorieId[] = ["essential", "funktional", "statistik", "marketing"];

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function configIdHint(typ: TrackingToolTyp): string {
  switch (typ) {
    case "ga4":
      return "GA4 Measurement-ID (Format: G-XXXXXXXXXX)";
    case "gtm":
      return "GTM-Container-ID (Format: GTM-XXXXXX)";
    case "meta_pixel":
      return "Meta Pixel ID (15-stellige Zahl)";
    case "plausible":
      return "Domain wie in Plausible eingetragen (z.B. deine-domain.de)";
    case "hotjar":
      return "Hotjar Site-ID (numerisch)";
    case "microsoft_clarity":
      return "Clarity Project-ID";
    case "tiktok_pixel":
      return "TikTok Pixel ID";
    case "linkedin_insight":
      return "LinkedIn Partner-ID";
    case "google_ads":
      return "Google Ads Conversion-ID (AW-XXXXXXXXX)";
    case "matomo":
      return "Matomo Site-ID";
    default:
      return "";
  }
}

function configIdRequired(typ: TrackingToolTyp): boolean {
  return ["ga4", "gtm", "meta_pixel", "plausible", "hotjar", "microsoft_clarity", "tiktok_pixel", "linkedin_insight", "google_ads", "matomo"].includes(typ);
}

export function StepTracking() {
  const data = useCookieBannerStore((s) => s.data);
  const patch = useCookieBannerStore((s) => s.patch);

  // Lokaler Form-State für "Tool hinzufügen"
  const [newTyp, setNewTyp] = useState<TrackingToolTyp>("ga4");
  const [newName, setNewName] = useState(TOOL_TYP_LABELS.ga4.name);
  const [newKategorie, setNewKategorie] = useState<KategorieId>(TOOL_TYP_LABELS.ga4.kategorie);
  const [newConfigId, setNewConfigId] = useState("");
  const [newInlineScript, setNewInlineScript] = useState("");

  const onTypChange = (typ: TrackingToolTyp) => {
    setNewTyp(typ);
    setNewName(TOOL_TYP_LABELS[typ].name);
    setNewKategorie(TOOL_TYP_LABELS[typ].kategorie);
    setNewConfigId("");
    setNewInlineScript("");
  };

  const canAdd = (() => {
    if (!newName.trim()) return false;
    if (configIdRequired(newTyp) && !newConfigId.trim()) return false;
    if (newTyp === "custom_script" && !newInlineScript.trim()) return false;
    return true;
  })();

  const addTool = () => {
    if (!canAdd) return;
    const tool: TrackingTool = {
      id: genId(),
      typ: newTyp,
      name: newName.trim(),
      kategorie: newKategorie,
      scriptSrc: TOOL_TYP_LABELS[newTyp].defaultSrc,
      configId: newConfigId.trim() || undefined,
      inlineScript: newInlineScript.trim() || undefined,
    };
    patch({ trackingTools: [...data.trackingTools, tool] });
    // Reset Form
    setNewConfigId("");
    setNewInlineScript("");
  };

  const removeTool = (id: string) => {
    patch({ trackingTools: data.trackingTools.filter((t) => t.id !== id) });
  };

  const updateTool = (id: string, changes: Partial<TrackingTool>) => {
    patch({
      trackingTools: data.trackingTools.map((t) => (t.id === id ? { ...t, ...changes } : t)),
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Welche externen Tools setzt deine Webseite ein, die nach Consent geladen werden sollen?
        Compliflow erzeugt den passenden Loader — du musst die Skripte NICHT mehr selbst in
        deine Webseite einbauen.
      </p>

      <div className="border-l-4 border-accent bg-accent-soft p-4">
        <p className="font-body text-[14px] leading-[1.6] text-ink">
          <strong>Tracking-Tools werden NUR nach Consent geladen.</strong> Entferne bestehende
          Script-Tags (Google Analytics, Meta Pixel etc.) aus deiner Webseite, sobald du das
          Snippet eingebaut hast — Compliflow übernimmt das.
        </p>
      </div>

      {/* Bestehende Tools */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Aktive Tools ({data.trackingTools.length})
        </p>

        {data.trackingTools.length === 0 && (
          <div className="border border-dashed border-line bg-bg p-6 text-center">
            <p className="font-body text-[14px] leading-[1.6] text-ink-faded">
              Noch keine Tracking-Tools konfiguriert. Du kannst diesen Schritt auch
              überspringen, wenn du keine externen Tools nutzt.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {data.trackingTools.map((tool) => (
            <div key={tool.id} className="border border-line bg-bg-soft p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-1">
                    {TOOL_TYP_LABELS[tool.typ].name} · {KATEGORIE_LABELS[tool.kategorie].name}
                  </div>
                  <div className="font-body text-[14px] leading-[1.6] font-medium text-ink">{tool.name}</div>
                  {tool.configId && (
                    <div className="font-mono text-[11px] text-ink-faded mt-1">
                      Config: {tool.configId}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeTool(tool.id)}
                  className="font-mono text-[10px] uppercase tracking-widest text-ink-faded hover:text-warn transition"
                  aria-label={`${tool.name} entfernen`}
                >
                  Entfernen
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Name">
                  <TextInput
                    value={tool.name}
                    onChange={(e) => updateTool(tool.id, { name: e.target.value })}
                  />
                </Field>
                <Field label="Kategorie">
                  <select
                    value={tool.kategorie}
                    onChange={(e) =>
                      updateTool(tool.id, { kategorie: e.target.value as KategorieId })
                    }
                    className="w-full bg-bg-soft border border-line px-4 py-3 text-ink font-body text-base outline-none transition focus:border-accent"
                  >
                    {KATEGORIE_ORDER.map((k) => (
                      <option key={k} value={k}>
                        {KATEGORIE_LABELS[k].name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tool hinzufügen */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent mb-3">
          Tool hinzufügen
        </p>

        <div className="flex flex-col gap-4">
          <Field label="Tool-Typ" required>
            <select
              value={newTyp}
              onChange={(e) => onTypChange(e.target.value as TrackingToolTyp)}
              className="w-full bg-bg-soft border border-line px-4 py-3 text-ink font-body text-base outline-none transition focus:border-accent"
            >
              {TOOL_ORDER.map((t) => (
                <option key={t} value={t}>
                  {TOOL_TYP_LABELS[t].name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Anzeige-Name" required>
              <TextInput
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={TOOL_TYP_LABELS[newTyp].name}
              />
            </Field>
            <Field label="Kategorie" required>
              <select
                value={newKategorie}
                onChange={(e) => setNewKategorie(e.target.value as KategorieId)}
                className="w-full bg-bg-soft border border-line px-4 py-3 text-ink font-body text-base outline-none transition focus:border-accent"
              >
                {KATEGORIE_ORDER.map((k) => (
                  <option key={k} value={k}>
                    {KATEGORIE_LABELS[k].name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {configIdRequired(newTyp) && (
            <Field label="Config-ID" required hint={configIdHint(newTyp)}>
              <TextInput
                value={newConfigId}
                onChange={(e) => setNewConfigId(e.target.value)}
                placeholder={configIdHint(newTyp)}
              />
            </Field>
          )}

          {newTyp === "custom_script" && (
            <Field
              label="Inline-Script"
              required
              hint="Wird im <script>-Tag direkt eingefügt — kein <script>-Wrapper nötig"
            >
              <TextArea
                value={newInlineScript}
                onChange={(e) => setNewInlineScript(e.target.value)}
                rows={5}
                placeholder="// JavaScript-Code, der nach Consent ausgeführt wird"
              />
            </Field>
          )}

          <button
            type="button"
            onClick={addTool}
            disabled={!canAdd}
            className="self-start font-mono text-[11px] uppercase tracking-widest px-6 py-2.5 bg-accent text-bg hover:bg-ink transition disabled:bg-bg-soft disabled:text-ink-faded disabled:border disabled:border-line disabled:cursor-not-allowed"
          >
            + Hinzufügen
          </button>
        </div>
      </div>
    </div>
  );
}
