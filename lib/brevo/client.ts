/**
 * Brevo API Client (ehemals Sendinblue)
 * Quelle: https://developers.brevo.com/reference
 * Stand: 2026-06-16
 *
 * Compliflow nutzt Brevo als DSGVO-konformen Email-Marketing-Dienst (EU-Server, DPA verfügbar).
 * Double-Opt-In ist Pflicht für deutsche Newsletter (UWG § 7).
 */

const BREVO_API = "https://api.brevo.com/v3";

export type BrevoSubscribeArgs = {
  email: string;
  /** Liste-IDs in Brevo. Standard: Liste 1 (Compliflow Newsletter Master). */
  listIds?: number[];
  /** Double-Opt-In Template-ID (in Brevo angelegt). */
  doiTemplateId?: number;
  /** Redirect-URL nach erfolgreicher Bestätigung. */
  redirectionUrl?: string;
  /** Attributes für Personalisierung. */
  attributes?: Record<string, string | number | boolean>;
  /** Quelle (welcher Generator hat User gefangen) — für Segmentierung. */
  quelle?: string;
};

export type BrevoSubscribeResult =
  | { ok: true; messageId?: string; isNew: boolean }
  | { ok: false; error: string; status: number };

/**
 * Trägt eine Email in Brevo Double-Opt-In-Liste ein.
 * Brevo verschickt automatisch eine Bestätigungs-Email mit Magic-Link.
 */
export async function brevoSubscribeDoi(args: BrevoSubscribeArgs): Promise<BrevoSubscribeResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "BREVO_API_KEY nicht konfiguriert", status: 500 };
  }

  const rawListId = process.env.BREVO_LIST_ID;
  const rawTemplateId = process.env.BREVO_DOI_TEMPLATE_ID;
  const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (process.env.NODE_ENV === "production" && (!rawListId || !rawTemplateId || !rawAppUrl)) {
    const missing = [
      !rawListId && "BREVO_LIST_ID",
      !rawTemplateId && "BREVO_DOI_TEMPLATE_ID",
      !rawAppUrl && "NEXT_PUBLIC_APP_URL",
    ].filter(Boolean).join(", ");
    return { ok: false, error: `[brevo] Missing env vars: ${missing}`, status: 500 };
  }

  const listIds = args.listIds ?? (rawListId ? [parseInt(rawListId, 10)] : [1]);
  const doiTemplateId = args.doiTemplateId ?? (rawTemplateId ? parseInt(rawTemplateId, 10) : 1);
  const redirectionUrl = args.redirectionUrl ?? `${rawAppUrl ?? "http://localhost:3000"}/waitlist/confirmed`;

  const body = {
    email: args.email.toLowerCase().trim(),
    includeListIds: listIds,
    templateId: doiTemplateId,
    redirectionUrl,
    attributes: {
      QUELLE: args.quelle ?? "compliflow_generator",
      ANMELDUNG_DATUM: new Date().toISOString().split("T")[0],
      ...args.attributes,
    },
  };

  try {
    const res = await fetch(`${BREVO_API}/contacts/doubleOptinConfirmation`, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.status === 204 || res.status === 201) {
      // 204 = success (DOI mail sent), 201 = neuer Contact
      return { ok: true, isNew: res.status === 201 };
    }
    // 400 mit "Contact already exists" wenn email schon dabei + bestätigt
    let errorMessage = `Brevo API Fehler (${res.status})`;
    try {
      const errBody = await res.json();
      if (errBody?.message) errorMessage = errBody.message;
      // "Contact already exists" wird oft als 400 mit code: "duplicate_parameter"
      if (errBody?.code === "duplicate_parameter") {
        return { ok: true, isNew: false };
      }
    } catch { /* ignore parse error */ }
    return { ok: false, error: errorMessage, status: res.status };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Netzwerkfehler",
      status: 500,
    };
  }
}

/**
 * Prüft ob eine Email-Adresse plausibel formatiert ist.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  if (email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
