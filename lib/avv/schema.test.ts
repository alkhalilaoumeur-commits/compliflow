import { describe, it, expect } from "vitest";
import { validateEmail, validatePlz, charCount } from "@/lib/avv/schema";

describe("validateEmail", () => {
  it("gibt null für leere Eingabe zurück (keine Fehlermeldung wenn noch nichts eingegeben)", () => {
    expect(validateEmail("")).toBeNull();
  });

  it("gibt null für eine gültige E-Mail zurück", () => {
    expect(validateEmail("test@example.com")).toBeNull();
  });

  it("akzeptiert E-Mails mit Plus, Punkt und Bindestrich", () => {
    expect(validateEmail("max.muster+abo@my-firma.de")).toBeNull();
  });

  it("gibt Fehlermeldung für E-Mail ohne @ zurück", () => {
    expect(validateEmail("testexample.com")).toBe("Ungültige E-Mail-Adresse");
  });

  it("gibt Fehlermeldung für E-Mail ohne Domain-TLD zurück", () => {
    expect(validateEmail("test@example")).toBe("Ungültige E-Mail-Adresse");
  });

  it("gibt Fehlermeldung für E-Mail mit zu kurzer TLD zurück", () => {
    expect(validateEmail("test@example.c")).toBe("Ungültige E-Mail-Adresse");
  });
});

describe("validatePlz", () => {
  it("gibt null für leere Eingabe zurück", () => {
    expect(validatePlz("")).toBeNull();
  });

  it("gibt null für eine 5-stellige PLZ zurück", () => {
    expect(validatePlz("70599")).toBeNull();
  });

  it("gibt null für eine 4-stellige PLZ zurück (AT/CH)", () => {
    expect(validatePlz("1010")).toBeNull();
  });

  it("gibt Fehlermeldung für 3-stellige PLZ zurück", () => {
    expect(validatePlz("123")).toBe("PLZ muss 4–5 Ziffern sein");
  });

  it("gibt Fehlermeldung für 6-stellige PLZ zurück", () => {
    expect(validatePlz("123456")).toBe("PLZ muss 4–5 Ziffern sein");
  });

  it("gibt Fehlermeldung für PLZ mit Buchstaben zurück", () => {
    expect(validatePlz("70a99")).toBe("PLZ muss 4–5 Ziffern sein");
  });
});

describe("charCount", () => {
  it("zählt korrekt und meldet ok, wenn min erreicht ist", () => {
    expect(charCount("hello", 5)).toEqual({ count: 5, remaining: 0, ok: true });
  });

  it("berechnet verbleibende Zeichen, wenn min nicht erreicht ist", () => {
    expect(charCount("abc", 10)).toEqual({ count: 3, remaining: 7, ok: false });
  });

  it("liefert ok=true, wenn count das min überschreitet", () => {
    expect(charCount("abcdefghij", 5)).toEqual({ count: 10, remaining: 0, ok: true });
  });

  it("behandelt leeren String", () => {
    expect(charCount("", 5)).toEqual({ count: 0, remaining: 5, ok: false });
  });

  it("clamped remaining nie unter 0", () => {
    expect(charCount("abcdef", 2).remaining).toBe(0);
  });

  it("behandelt min=0 als immer ok", () => {
    expect(charCount("", 0)).toEqual({ count: 0, remaining: 0, ok: true });
  });

  it("behandelt null/undefined-Wert wie leeren String", () => {
    // Funktion nutzt (value ?? ""), daher kein Crash bei null
    expect(charCount(null as unknown as string, 3)).toEqual({
      count: 0,
      remaining: 3,
      ok: false,
    });
  });
});
