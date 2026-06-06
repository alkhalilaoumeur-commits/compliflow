/**
 * Zod-Schemas für Validation und Type-Sicherheit.
 * Verwendet als Validation-Layer + Type-Inference.
 */

import { z } from "zod";

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PLZ_REGEX = /^\d{4,5}$/;

const vertragsParteiSchema = z.object({
  firma: z.string().min(2, "Firmenname zu kurz (mind. 2 Zeichen)").max(200),
  strasse: z.string().min(3, "Straße + Hausnummer erforderlich").max(200),
  plz: z.string().regex(PLZ_REGEX, "PLZ muss 4–5 Ziffern haben"),
  ort: z.string().min(2, "Ort erforderlich").max(100),
  land: z.string().min(2, "Land erforderlich").max(100),
  vertretung: z.string().min(2, "Vertretungsberechtigte Person erforderlich").max(200),
  email: z.string().regex(EMAIL_REGEX, "Ungültige E-Mail-Adresse"),
  telefon: z.string().optional(),
  registergericht: z.string().optional(),
  hrb: z.string().optional(),
  ustId: z.string().optional(),
});

export { vertragsParteiSchema };

const dauerSchema = z.discriminatedUnion("typ", [
  z.object({
    typ: z.literal("befristet"),
    bis: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Datum im Format YYYY-MM-DD"),
  }),
  z.object({ typ: z.literal("unbefristet") }),
  z.object({ typ: z.literal("vertragslaufzeit") }),
]);

export const verarbeitungSchema = z.object({
  gegenstand: z.string().min(10, "Bitte mindestens 10 Zeichen").max(2000),
  dauer: dauerSchema,
  zweck: z.string().min(10, "Bitte mindestens 10 Zeichen").max(2000),
  arten: z.array(z.string()).min(1, "Mindestens eine Verarbeitungsart wählen"),
});

const tomSchema = z.object({
  id: z.string(),
  kategorie: z.enum([
    "zutritt",
    "zugang",
    "zugriff",
    "weitergabe",
    "eingabe",
    "auftrag",
    "verfuegbarkeit",
    "trennung",
  ]),
  beschreibung: z.string().min(5).max(500),
  custom: z.boolean().optional(),
});

const subverarbeiterSchema = z.object({
  id: z.string(),
  firma: z.string().min(2),
  anschrift: z.string().min(3),
  zweck: z.string().min(3),
  land: z.string().min(2),
  sicherheitsgarantie: z.enum([
    "EU-EWR",
    "Angemessenheitsbeschluss",
    "Standardvertragsklauseln",
    "BindendeUnternehmensregeln",
    "Keine",
  ]),
  schremsIIZusatzmassnahmen: z.string().optional(),
});

export const avvFormSchema = z.object({
  schemaVersion: z.literal(1),
  auftraggeber: vertragsParteiSchema,
  auftragnehmer: vertragsParteiSchema,
  verarbeitung: verarbeitungSchema,
  datenkategorien: z.array(z.string()).min(1, "Mindestens eine Datenkategorie auswählen"),
  datenkategorienCustom: z.array(z.string()),
  personenkategorien: z.array(z.string()).min(1, "Mindestens eine Personenkategorie auswählen"),
  personenkategorienCustom: z.array(z.string()),
  toms: z.array(tomSchema).min(8, "Mindestens 8 TOMs erforderlich (1 pro Kategorie)"),
  subverarbeiter: z.array(subverarbeiterSchema),
  abschlussDatum: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Datum im Format YYYY-MM-DD"),
  abschlussOrt: z.string().min(2, "Ort erforderlich"),
});

export type AvvFormSchema = z.infer<typeof avvFormSchema>;

/* -------------------------------------------------------------------------- */
/*  Live-Validation-Helpers für die UI                                        */
/* -------------------------------------------------------------------------- */

export function validateEmail(email: string): string | null {
  if (!email) return null;
  if (!EMAIL_REGEX.test(email)) return "Ungültige E-Mail-Adresse";
  return null;
}

export function validatePlz(plz: string): string | null {
  if (!plz) return null;
  if (!PLZ_REGEX.test(plz)) return "PLZ muss 4–5 Ziffern sein";
  return null;
}

export function charCount(value: string, min: number): {
  count: number;
  remaining: number;
  ok: boolean;
} {
  const count = (value ?? "").length;
  return { count, remaining: Math.max(0, min - count), ok: count >= min };
}
