import { describe, it, expect } from "vitest";
import { cn, slugify, formatDateDE } from "@/lib/utils";

describe("cn", () => {
  it("verbindet mehrere Klassen zu einem String", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("ignoriert falsy-Werte (false, null, undefined)", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("verarbeitet bedingte Objekt-Syntax (clsx)", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active");
  });

  it("verarbeitet Arrays", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });

  it("merged widersprüchliche Tailwind-Klassen (twMerge gewinnt letzte)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("gibt leeren String ohne Eingabe zurück", () => {
    expect(cn()).toBe("");
  });
});

describe("slugify", () => {
  it("wandelt Text in Kleinbuchstaben mit Bindestrichen um", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("ersetzt deutsche Umlaute und ß", () => {
    expect(slugify("Müller Öl Ärger Straße")).toBe("mueller-oel-aerger-strasse");
  });

  it("entfernt führende und abschließende Bindestriche", () => {
    expect(slugify("  Hallo  ")).toBe("hallo");
  });

  it("kollabiert mehrere Sonderzeichen zu einem Bindestrich", () => {
    expect(slugify("a!!!b@@@c")).toBe("a-b-c");
  });

  it("behält Zahlen bei", () => {
    expect(slugify("Tool 123 Test")).toBe("tool-123-test");
  });

  it("gibt leeren String für Eingabe nur aus Sonderzeichen zurück", () => {
    expect(slugify("!!!")).toBe("");
  });

  it("gibt leeren String für leere Eingabe zurück", () => {
    expect(slugify("")).toBe("");
  });
});

describe("formatDateDE", () => {
  it("formatiert ein Date-Objekt im deutschen Format DD.MM.YYYY", () => {
    expect(formatDateDE(new Date("2026-06-18T12:00:00Z"))).toBe("18.06.2026");
  });

  it("formatiert einen ISO-Date-String", () => {
    expect(formatDateDE("2026-01-05")).toBe("05.01.2026");
  });

  it("nutzt zweistellige Tage und Monate", () => {
    expect(formatDateDE("2026-12-31")).toBe("31.12.2026");
  });

  it("liefert einen String mit Punkt-Trennern zurück", () => {
    const result = formatDateDE("2026-06-18");
    expect(typeof result).toBe("string");
    expect(result).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
  });
});
