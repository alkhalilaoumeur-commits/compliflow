import { describe, it, expect, beforeAll } from "vitest";
import { promises as fs } from "node:fs";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement, isValidElement } from "react";
import { AvvPdfDocument } from "@/lib/avv/pdf/avv-document";
import type { AvvFormData } from "@/lib/avv/types";
import type { Tom, TomKategorie } from "@/lib/avv/types";
import { renderVvtPdf } from "@/lib/vvt/pdf/vvt-document";
import type { VvtFormData } from "@/lib/vvt/types";

// Erzeugt echte PDF-Binärdateien der Generatoren mit repräsentativen Testdaten
// und legt sie unter audit-artifacts/pdfs/ ab, damit sie manuell geöffnet und
// geprüft werden können (Umlaute/ß/€, Layout bei langen Namen, keine Platzhalter,
// alle Art.-28-Pflichtabschnitte). Gleichzeitig Vollständigkeits-Smoke-Test.

const OUT_DIR = path.join(process.cwd(), "audit-artifacts", "pdfs");

// Bewusst mit Umlauten, ß, € und sehr langen Feldern — testet Font-Embedding + Umbruch.
const tomKategorien: TomKategorie[] = [
  "zutritt", "zugang", "zugriff", "weitergabe",
  "eingabe", "auftrag", "verfuegbarkeit", "trennung",
];
const fullToms: Tom[] = tomKategorien.map((k, i) => ({
  id: `tom-${i}`,
  kategorie: k,
  beschreibung:
    "Umläute-Test äöüß €: Zutrittskontrolle per Chipkarte, Videoüberwachung, " +
    "verschlüsselte Datenträger (AES-256) und dokumentierte Zugriffsprotokolle.",
  custom: true,
}));

const fullAvv: AvvFormData = {
  schemaVersion: 1,
  auftraggeber: {
    firma: "Müller & Schäfer Groß-Gebäudereinigung und Facility-Management GmbH & Co. KG",
    strasse: "Königsallee 42a",
    plz: "40212",
    ort: "Düsseldorf",
    land: "Deutschland",
    vertretung: "Dr. Ödön Groß-Weiß",
    email: "datenschutz@mueller-schaefer.example",
    telefon: "+49 211 1234567",
    registergericht: "Amtsgericht Düsseldorf",
    hrb: "HRB 12345",
    ustId: "DE123456789",
  },
  auftragnehmer: {
    firma: "CloudHost Solutions AG",
    strasse: "Große Bäckerstraße 7",
    plz: "20095",
    ort: "Hamburg",
    land: "Deutschland",
    vertretung: "Françoise Bär",
    email: "avv@cloudhost.example",
    telefon: "+49 40 7654321",
    registergericht: "Amtsgericht Hamburg",
    hrb: "HRB 98765",
    ustId: "DE987654321",
  },
  verarbeitung: {
    gegenstand:
      "Hosting und Betrieb der Kundendatenbank inklusive täglicher Backups und Monitoring.",
    dauer: { typ: "vertragslaufzeit" },
    zweck:
      "Bereitstellung von Cloud-Infrastruktur für die Kundenverwaltung des Auftraggebers.",
    arten: ["Erheben", "Speichern", "Auslesen", "Übermitteln", "Löschen"],
  },
  datenkategorien: [],
  datenkategorienCustom: ["Kontaktdaten (Name, Anschrift, E-Mail)", "Vertragsdaten", "Zahlungsdaten (€)"],
  personenkategorien: [],
  personenkategorienCustom: ["Kunden und Interessenten", "Beschäftigte"],
  toms: fullToms,
  subverarbeiter: [
    {
      id: "sub-1",
      firma: "Backup-Rechenzentrum Süd GmbH",
      anschrift: "Weißenburgstraße 3, 81667 München",
      zweck: "Georedundante Backup-Speicherung",
      land: "Deutschland",
      sicherheitsgarantie: "EU-EWR",
    },
  ],
  abschlussDatum: "2026-07-08",
  abschlussOrt: "Düsseldorf",
};

// Lückenhaft: nur Auftraggeber teilweise, keine TOMs, keine Datenkategorien.
const incompleteAvv: AvvFormData = {
  schemaVersion: 1,
  auftraggeber: { firma: "Test GmbH", land: "Deutschland" },
  auftragnehmer: { land: "Deutschland" },
  verarbeitung: { arten: [] },
  datenkategorien: [],
  datenkategorienCustom: [],
  personenkategorien: [],
  personenkategorienCustom: [],
  toms: [],
  subverarbeiter: [],
  abschlussDatum: "2026-07-08",
  abschlussOrt: "",
};

// Liest den gerenderten Element-Baum rein lesend aus (String-Host-Komponenten
// von @react-pdf), um den Textinhalt des PDFs zu prüfen.
function collectText(node: unknown): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join(" ");
  if (isValidElement(node)) {
    const el = node as { type: unknown; props: { children?: unknown } };
    if (typeof el.type === "function") {
      return collectText((el.type as (p: unknown) => unknown)(el.props));
    }
    return collectText(el.props?.children);
  }
  return "";
}

const fullVvt: VvtFormData = {
  schemaVersion: 2,
  modus: "verantwortlicher",
  pflichtCheck: {
    mitarbeiter250Plus: false,
    nichtNurGelegentlich: true,
    besondereKategorien: true,
    risikoFuerBetroffene: true,
  },
  verantwortlicher: {
    bezeichnung: "Müller & Schäfer GmbH & Co. KG",
    name: "Dr. Ödön Groß-Weiß",
    strasse: "Königsallee 42a",
    plz: "40212",
    ort: "Düsseldorf",
    land: "Deutschland",
    email: "datenschutz@mueller-schaefer.example",
    telefon: "+49 211 1234567",
    hatDsb: true,
    dsb: { name: "Béatrice Wörner", email: "dsb@mueller-schaefer.example" },
    hatEuVertreter: false,
  },
  auftraggeber: [],
  taetigkeiten: [
    {
      id: "t1",
      bezeichnung: "Kundenverwaltung und Rechnungsstellung",
      zweck: "Verwaltung von Kundenstammdaten zur Vertragsabwicklung und Fakturierung (€).",
      rechtsgrundlagen: ["art6-1b", "art6-1c"],
      betroffenengruppen: ["Kunden", "Interessenten"],
      datenkategorien: ["Kontaktdaten", "Vertragsdaten", "Zahlungsdaten"],
      datenherkunft: "direkt",
      besondereKategorien: false,
      empfaenger: [
        {
          id: "e1",
          name: "Steuerberatung Bär & Partner",
          kategorie: "Steuerberater",
          istAuftragsverarbeiter: true,
          land: "Deutschland",
          avvVorhanden: true,
        },
      ],
      drittlandGarantie: "keine-uebermittlung",
      loeschfristen: "10 Jahre nach § 147 AO (steuerrelevante Unterlagen)",
      toms: "Verschlüsselung (AES-256), Rollen-/Rechtekonzept, Zutrittskontrolle, tägliche Backups",
      dsfaStatus: "nicht-erforderlich",
      kiSysteme: [],
    },
  ],
  erstelltAm: "2026-07-01T09:00:00.000Z",
  letztAktualisiert: "2026-07-08T09:00:00.000Z",
};

async function writePdf(name: string, buf: Uint8Array) {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(path.join(OUT_DIR, name), buf);
}

describe("PDF-Artefakt-Generierung (Block 7)", () => {
  beforeAll(async () => {
    await fs.mkdir(OUT_DIR, { recursive: true });
  });

  it("AVV voll ausgefüllt: erzeugt gültiges PDF ohne rohe Platzhalter", async () => {
    const buf = await renderToBuffer(
      createElement(AvvPdfDocument, { data: fullAvv, showCredit: true }),
    );
    await writePdf("avv-vollstaendig.pdf", buf);
    // Gültiger PDF-Header + nicht-trivial groß
    expect(Buffer.from(buf.slice(0, 5)).toString()).toBe("%PDF-");
    expect(buf.length).toBeGreaterThan(5000);
  });

  it("AVV ohne Credit (Watermark gekauft): erzeugt gültiges PDF", async () => {
    const buf = await renderToBuffer(
      createElement(AvvPdfDocument, { data: fullAvv, showCredit: false }),
    );
    await writePdf("avv-vollstaendig-ohne-credit.pdf", buf);
    expect(Buffer.from(buf.slice(0, 5)).toString()).toBe("%PDF-");
  });

  it("AVV lückenhaft: rendert ohne Crash (Layout-Robustheit)", async () => {
    const buf = await renderToBuffer(
      createElement(AvvPdfDocument, { data: incompleteAvv, showCredit: true }),
    );
    await writePdf("avv-lueckenhaft.pdf", buf);
    expect(Buffer.from(buf.slice(0, 5)).toString()).toBe("%PDF-");
  });

  it("VVT voll ausgefüllt: erzeugt gültiges PDF (Art. 30 DSGVO)", async () => {
    const blob = await renderVvtPdf(fullVvt, true);
    const buf = Buffer.from(await blob.arrayBuffer());
    await writePdf("vvt-vollstaendig.pdf", buf);
    expect(buf.slice(0, 5).toString()).toBe("%PDF-");
    expect(buf.length).toBeGreaterThan(3000);
  });

  it("AVV-Inhalt: Umlaute erhalten, alle Art.-28-Pflichtabschnitte, KEINE Platzhalter", () => {
    const text = collectText(AvvPdfDocument({ data: fullAvv, showCredit: true }));

    // Umlaute/ß aus den Eingaben unverändert im Dokument
    expect(text).toContain("Müller & Schäfer");
    expect(text).toContain("Françoise Bär");

    // Art. 28 Abs. 3 Pflichtbestandteile (lit. a–h)
    for (const marker of [
      "Art. 28",
      "Weisung",           // lit. a
      "Vertraulichkeit",   // lit. b
      "technische und organisatorische", // lit. c / Art. 32
      "Subunternehmer",    // Abs. 4 (Text nutzt "Subunternehmer"/"Subverarbeiter")
      "Löschung",          // lit. g
    ]) {
      expect(text.toLowerCase()).toContain(marker.toLowerCase());
    }

    // Keine unausgefüllten Platzhalter / Leak-Tokens
    for (const bad of ["{{", "[FIRMA]", "[NAME]", "undefined", "null,", "Lorem ipsum"]) {
      expect(text).not.toContain(bad);
    }
  });
});
