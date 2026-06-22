import { describe, it, expect } from "vitest";
import { isValidElement } from "react";
import { AvvPdfDocument } from "@/lib/avv/pdf/avv-document";
import type { AvvFormData } from "@/lib/avv/types";

// Die @react-pdf-Primitive (Document/Page/Text/View) sind String-Host-Komponenten.
// Wir können den von AvvPdfDocument zurückgegebenen Element-Baum daher rein lesend
// durchlaufen: bei String-Typen in die Kinder absteigen, Funktions-Komponenten
// (z. B. PageFooter) aufrufen. So prüfen wir, welche Texte im PDF landen — ohne
// echte PDF-Binärausgabe.
function collectText(node: unknown): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join(" ");
  if (isValidElement(node)) {
    const el = node as { type: unknown; props: { children?: unknown } };
    if (typeof el.type === "function") {
      const rendered = (el.type as (p: unknown) => unknown)(el.props);
      return collectText(rendered);
    }
    return collectText(el.props?.children);
  }
  return "";
}

const fixture: AvvFormData = {
  schemaVersion: 1,
  auftraggeber: { land: "Deutschland" },
  auftragnehmer: { land: "Deutschland" },
  verarbeitung: { arten: [] },
  datenkategorien: [],
  datenkategorienCustom: [],
  personenkategorien: [],
  personenkategorienCustom: [],
  toms: [],
  subverarbeiter: [],
  abschlussDatum: "2026-06-22",
  abschlussOrt: "Stuttgart",
};

describe("AvvPdfDocument — Watermark/Credit", () => {
  it("zeigt den Compliflow-Credit standardmäßig (showCredit=true)", () => {
    const text = collectText(AvvPdfDocument({ data: fixture, showCredit: true }));
    expect(text).toContain("Generiert mit Compliflow");
    expect(text).toContain("made by DRVN");
  });

  it("entfernt den Compliflow-Credit nach Kauf (showCredit=false)", () => {
    const text = collectText(AvvPdfDocument({ data: fixture, showCredit: false }));
    expect(text).not.toContain("Generiert mit Compliflow");
    expect(text).not.toContain("made by DRVN");
  });

  it("zeigt den Credit auch bei Default-Aufruf (ohne Prop = Free-Tier)", () => {
    const text = collectText(AvvPdfDocument({ data: fixture }));
    expect(text).toContain("made by DRVN");
  });

  it("behält den rechtlichen Haftungs-Disclaimer in BEIDEN Varianten", () => {
    const withCredit = collectText(AvvPdfDocument({ data: fixture, showCredit: true }));
    const withoutCredit = collectText(AvvPdfDocument({ data: fixture, showCredit: false }));
    const disclaimer = "Der Anbieter Compliflow übernimmt keine Haftung";
    expect(withCredit).toContain(disclaimer);
    expect(withoutCredit).toContain(disclaimer);
  });
});
