"use client";

import { useDatenschutzStore } from "@/lib/datenschutz/store";
import { Field } from "@/components/avv/field";
import {
  CHAT_LABELS,
  KI_CHATBOT_LABELS,
  VIDEO_CALL_LABELS,
  type ChatProvider,
  type KiChatbotProvider,
  type VideoCallProvider,
} from "@/lib/datenschutz/types";

const CHAT_ORDER: ChatProvider[] = [
  "crisp",
  "intercom",
  "tawk_to",
  "zendesk_chat",
  "userlike",
  "olark",
  "selbst_gehostet",
];

const KI_ORDER: KiChatbotProvider[] = [
  "openai",
  "anthropic",
  "google_gemini",
  "mistral",
  "azure_openai",
  "selbst_gehostet",
  "andere",
];

const VIDEO_ORDER: VideoCallProvider[] = [
  "zoom",
  "ms_teams",
  "google_meet",
  "webex",
  "jitsi",
  "bigbluebutton",
  "whereby",
  "andere",
];

const PUSH_LABELS: Record<string, string> = {
  eigene_loesung: "Eigene Web-Push-Lösung",
  onesignal: "OneSignal",
  firebase_fcm: "Firebase Cloud Messaging (FCM)",
  pushwoosh: "Pushwoosh",
};

export function StepKommunikation() {
  const data = useDatenschutzStore((s) => s.data);
  const patch = useDatenschutzStore((s) => s.patch);

  const updateK = <K extends keyof typeof data.kommunikation>(
    key: K,
    value: (typeof data.kommunikation)[K],
  ) => {
    patch({ kommunikation: { ...data.kommunikation, [key]: value } });
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Welche Kommunikationskanäle bietet deine Webseite? Bei KI-Chatbots wird automatisch ein
        AI-Act-Touchpoint-Hinweis ergänzt.
      </p>

      {/* Kontaktformular */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={data.kommunikation.kontaktformular}
          onChange={(e) => updateK("kontaktformular", e.target.checked)}
          className="mt-1 h-4 w-4 accent-accent"
        />
        <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
          <strong className="text-ink">Kontaktformular</strong> auf der Webseite
        </span>
      </label>

      {/* Live-Chat */}
      <div className="border-t border-line pt-6">
        <label className="flex items-start gap-3 cursor-pointer group mb-4">
          <input
            type="checkbox"
            checked={data.kommunikation.liveChat}
            onChange={(e) => updateK("liveChat", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Live-Chat</strong> (klassischer Support-Chat mit Operator)
            </span>
          </div>
        </label>

        {data.kommunikation.liveChat && (
          <Field label="Chat-Anbieter" required>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CHAT_ORDER.map((c) => {
                const isActive = data.kommunikation.chatProvider === c;
                const cfg = CHAT_LABELS[c];
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateK("chatProvider", c)}
                    className={
                      "px-3 py-2.5 text-left border transition " +
                      (isActive
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-bg-soft hover:border-accent")
                    }
                  >
                    <div className="font-body text-[14px] leading-[1.6] font-medium text-ink">{cfg.name}</div>
                    <div className="text-[11px] text-ink-faded mt-0.5">
                      {cfg.istEU ? "EU-Anbieter" : "Drittland — SCCs nötig"}
                    </div>
                  </button>
                );
              })}
            </div>
          </Field>
        )}
      </div>

      {/* KI-Chatbot */}
      <div className="border-t border-line pt-6">
        <label className="flex items-start gap-3 cursor-pointer group mb-4">
          <input
            type="checkbox"
            checked={data.kommunikation.kiChatbot}
            onChange={(e) => updateK("kiChatbot", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">KI-Chatbot</strong> (auf LLM basierend — OpenAI, Claude, Gemini, etc.)
            </span>
          </div>
        </label>

        {data.kommunikation.kiChatbot && (
          <div className="flex flex-col gap-4">
            <Field label="KI-Anbieter" required>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {KI_ORDER.map((k) => {
                  const isActive = data.kommunikation.kiChatbotProvider === k;
                  const cfg = KI_CHATBOT_LABELS[k];
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => updateK("kiChatbotProvider", k)}
                      className={
                        "px-3 py-2.5 text-left border transition " +
                        (isActive
                          ? "border-accent bg-accent-soft"
                          : "border-line bg-bg-soft hover:border-accent")
                      }
                    >
                      <div className="font-body text-[14px] leading-[1.6] font-medium text-ink">{cfg.name}</div>
                      <div className="text-[11px] text-ink-faded mt-0.5">
                        {cfg.anbieter}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Field>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={data.kommunikation.kiTrainingAusgeschlossen}
                onChange={(e) => updateK("kiTrainingAusgeschlossen", e.target.checked)}
                className="mt-1 h-4 w-4 accent-accent"
              />
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">AVV schließt Training aus</strong> — der Anbieter darf
                Eingaben nicht zum Modelltraining verwenden (empfohlen!)
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Webinare */}
      <div className="border-t border-line pt-6">
        <label className="flex items-start gap-3 cursor-pointer group mb-4">
          <input
            type="checkbox"
            checked={data.kommunikation.webinare}
            onChange={(e) => updateK("webinare", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Webinare / Video-Calls</strong> (Zoom, Teams, Meet, etc.)
            </span>
          </div>
        </label>

        {data.kommunikation.webinare && (
          <Field label="Video-Call-Anbieter" required>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {VIDEO_ORDER.map((v) => {
                const isActive = data.kommunikation.videoCallProvider === v;
                const cfg = VIDEO_CALL_LABELS[v];
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => updateK("videoCallProvider", v)}
                    className={
                      "px-3 py-2.5 text-left border transition " +
                      (isActive
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-bg-soft hover:border-accent")
                    }
                  >
                    <div className="font-body text-[14px] leading-[1.6] font-medium text-ink">{cfg.name}</div>
                    <div className="text-[11px] text-ink-faded mt-0.5">
                      {cfg.anbieter}
                    </div>
                  </button>
                );
              })}
            </div>
          </Field>
        )}
      </div>

      {/* Push */}
      <div className="border-t border-line pt-6">
        <label className="flex items-start gap-3 cursor-pointer group mb-4">
          <input
            type="checkbox"
            checked={data.kommunikation.pushNotifications}
            onChange={(e) => updateK("pushNotifications", e.target.checked)}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <div>
            <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
              <strong className="text-ink">Push-Notifications</strong> (Browser-Push-Benachrichtigungen)
            </span>
          </div>
        </label>

        {data.kommunikation.pushNotifications && (
          <Field label="Push-Anbieter">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(["eigene_loesung", "onesignal", "firebase_fcm", "pushwoosh"] as const).map((p) => {
                const isActive = data.kommunikation.pushAnbieter === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => updateK("pushAnbieter", p)}
                    className={
                      "px-3 py-2.5 text-left border transition text-sm " +
                      (isActive
                        ? "border-accent bg-accent-soft text-ink"
                        : "border-line bg-bg-soft hover:border-accent")
                    }
                  >
                    {PUSH_LABELS[p]}
                  </button>
                );
              })}
            </div>
          </Field>
        )}
      </div>
    </div>
  );
}
