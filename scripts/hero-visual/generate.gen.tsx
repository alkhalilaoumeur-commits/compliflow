import { it } from "vitest";
import { promises as fs } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { AvvPdfDocument } from "@/lib/avv/pdf/avv-document";
import type { AvvFormData, Tom, TomKategorie } from "@/lib/avv/types";

// Erzeugt aus dem ECHTEN AVV-Generator (lib/avv/pdf/avv-document.tsx) ein Muster-PDF
// und rendert die ersten Seiten als PNG. Zweck: Das Hero-Visual der Startseite zeigt
// echten Produkt-Output statt Stock-Foto oder Nachbau.
//
// Wichtig: Ändert sich das PDF-Layout, einfach "npm run hero:visual" neu laufen lassen —
// das Bild ist ein Build-Artefakt, kein handgeschossener Screenshot, der veraltet.
//
// Ausführen:  npm run hero:visual
// Ausgabe:    scripts/hero-visual/out/

const OUT_DIR = path.join(process.cwd(), "scripts", "hero-visual", "out");

// Fiktive, aber realistische Freelancer-Situation: Eine selbstständige Designerin
// (= Auftraggeberin/Verantwortliche) schließt einen AVV mit ihrem Hoster.
// Bewusst KEINE echten Firmennamen — das Muster darf keine fremde Marke vereinnahmen.
// Bewusst ohne HRB/UStID beim Auftraggeber: Eine Solo-Selbstständige hat keine.
const tomTexte: Record<TomKategorie, string> = {
  zutritt: "Serverstandort mit Zutrittskontrolle, Videoüberwachung und Besucherprotokoll.",
  zugang: "Zugang ausschließlich über personalisierte Konten mit Zwei-Faktor-Authentifizierung.",
  zugriff: "Rollenbasiertes Berechtigungskonzept, Zugriffe werden revisionssicher protokolliert.",
  weitergabe: "Übertragung ausschließlich TLS-verschlüsselt, Datenträger mit AES-256 verschlüsselt.",
  eingabe: "Alle Änderungen an personenbezogenen Daten werden mit Zeitstempel protokolliert.",
  auftrag: "Weisungen werden schriftlich dokumentiert, Unterauftragnehmer vertraglich gebunden.",
  verfuegbarkeit: "Tägliche Backups, georedundante Spiegelung, dokumentiertes Wiederanlaufkonzept.",
  trennung: "Mandantentrennung auf Datenbankebene, getrennte Test- und Produktivumgebung.",
};

const musterToms: Tom[] = (Object.keys(tomTexte) as TomKategorie[]).map((kategorie, i) => ({
  id: `tom-${i}`,
  kategorie,
  beschreibung: tomTexte[kategorie],
  custom: false,
}));

const musterAvv: AvvFormData = {
  schemaVersion: 1,
  auftraggeber: {
    firma: "Studio Halden — Marie Halden",
    strasse: "Hauptstätter Straße 58",
    plz: "70178",
    ort: "Stuttgart",
    land: "Deutschland",
    vertretung: "Marie Halden",
    email: "datenschutz@studio-halden.example",
    telefon: "+49 711 2094418",
  },
  auftragnehmer: {
    firma: "Nordlicht Hosting GmbH",
    strasse: "Am Sandtorkai 12",
    plz: "20457",
    ort: "Hamburg",
    land: "Deutschland",
    vertretung: "Jonas Reimer",
    email: "avv@nordlicht-hosting.example",
    telefon: "+49 40 33445566",
    registergericht: "Amtsgericht Hamburg",
    hrb: "HRB 148223",
    ustId: "DE311204558",
  },
  verarbeitung: {
    gegenstand:
      "Webhosting und Betrieb der Kundenwebsites einschließlich Mailpostfächern, " +
      "täglicher Backups und Server-Monitoring.",
    dauer: { typ: "vertragslaufzeit" },
    zweck:
      "Bereitstellung der technischen Infrastruktur für die vom Auftraggeber betreuten " +
      "Websites und deren Kontaktformulare.",
    arten: ["Erheben", "Speichern", "Auslesen", "Übermitteln", "Löschen"],
  },
  datenkategorien: [],
  datenkategorienCustom: [
    "Kontaktdaten (Name, Anschrift, E-Mail)",
    "Vertrags- und Abrechnungsdaten",
    "Nutzungsdaten (IP-Adresse, Zugriffszeitpunkt)",
  ],
  personenkategorien: [],
  personenkategorienCustom: [
    "Kundinnen und Kunden des Auftraggebers",
    "Interessenten über Kontaktformulare",
  ],
  toms: musterToms,
  subverarbeiter: [
    {
      id: "sub-1",
      firma: "Rechenzentrum Elbe-Süd GmbH",
      anschrift: "Billstraße 214, 20539 Hamburg",
      zweck: "Georedundante Backup-Speicherung",
      land: "Deutschland",
      sicherheitsgarantie: "EU-EWR",
    },
  ],
  // Fest verdrahtet, damit derselbe Lauf immer dasselbe Bild erzeugt (reproduzierbar).
  abschlussDatum: "2026-08-14",
  abschlussOrt: "Stuttgart",
};

it("erzeugt Muster-AVV als PDF und PNG", async () => {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const pdf = await renderToBuffer(<AvvPdfDocument data={musterAvv} />);
  const pdfPfad = path.join(OUT_DIR, "muster-avv.pdf");
  await fs.writeFile(pdfPfad, pdf);
  console.log(`PDF geschrieben: ${pdfPfad} (${Math.round(pdf.length / 1024)} KB)`);

  // pdftoppm (poppler) rendert die ersten 4 Seiten als PNG in 200 dpi.
  // Seite 1 = Deckblatt, 2 = Inhaltsverzeichnis, 3 = Vertragstext, 4 = Hinweis.
  // Alle vier, damit sich beurteilen lässt, welche als Hero-Visual am besten wirkt.
  execFileSync("pdftoppm", [
    "-png", "-r", "200", "-f", "1", "-l", "4",
    pdfPfad,
    path.join(OUT_DIR, "seite"),
  ]);

  const dateien = (await fs.readdir(OUT_DIR)).filter((f) => f.endsWith(".png")).sort();
  console.log(`PNGs erzeugt: ${dateien.join(", ")}`);
});
