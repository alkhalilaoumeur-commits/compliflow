/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { WatermarkRemoveButton } from "@/components/watermark/remove-button";
import { useWatermarkStore } from "@/lib/watermark/store";

// Komponententest in jsdom (simulierter Browser).
// Prüft das ABGESICHERTE Verhalten: Der Watermark-Status wird erst gesetzt,
// nachdem der Kauf serverseitig über /api/stripe/verify-session bestätigt wurde.
// Ein gefälschter URL-Parameter allein reicht NICHT mehr (vgl. APP-AUDIT-CONTEXT.md §6/§8).

function verifyResponse(body: object) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("WatermarkRemoveButton", () => {
  beforeEach(() => {
    useWatermarkStore.getState().reset();
    localStorage.clear();
    window.history.replaceState({}, "", "/avv");
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("zeigt den 0,99-€-Kauf-Button, solange nicht gekauft", () => {
    render(<WatermarkRemoveButton docType="avv" returnPath="/avv" />);
    expect(screen.getByRole("button", { name: /entfernen/i })).toBeDefined();
    expect(screen.queryByText(/Watermark entfernt/i)).toBeNull();
  });

  it("ruft beim Klick /api/stripe/checkout mit docType + returnPath auf", async () => {
    const fetchMock = vi.fn((..._args: unknown[]) =>
      Promise.resolve(verifyResponse({ url: "https://checkout.stripe.test/x" })),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<WatermarkRemoveButton docType="avv" returnPath="/avv" />);
    fireEvent.click(screen.getByRole("button", { name: /entfernen/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/stripe/checkout");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body).toMatchObject({ docType: "avv", returnPath: "/avv" });
  });

  it("schaltet frei, wenn Stripe die Session als bezahlt bestätigt (valid + passender docType)", async () => {
    const fetchMock = vi.fn(async () => verifyResponse({ valid: true, docType: "avv" }));
    vi.stubGlobal("fetch", fetchMock);

    window.history.replaceState(
      {},
      "",
      "/avv?watermark_removed=true&session_id=cs_test_REAL&doc_type=avv",
    );
    render(<WatermarkRemoveButton docType="avv" returnPath="/avv" />);

    await waitFor(() => expect(useWatermarkStore.getState().isBought("avv")).toBe(true));
    expect(await screen.findByText(/Watermark entfernt/i)).toBeDefined();
    // Es wurde serverseitig verifiziert:
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/stripe/verify-session?sessionId=cs_test_REAL"),
    );
  });

  it("ABWEHR: gefälschte/unbezahlte Session (valid:false) schaltet NICHT frei", async () => {
    const fetchMock = vi.fn(async () => verifyResponse({ valid: false }));
    vi.stubGlobal("fetch", fetchMock);

    window.history.replaceState(
      {},
      "",
      "/avv?watermark_removed=true&session_id=cs_test_FAKE&doc_type=avv",
    );
    render(<WatermarkRemoveButton docType="avv" returnPath="/avv" />);

    // Server wird gefragt …
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    // … aber das Flag bleibt aus und der Kauf-Button bleibt sichtbar.
    expect(useWatermarkStore.getState().isBought("avv")).toBe(false);
    expect(screen.getByRole("button", { name: /entfernen/i })).toBeDefined();
  });

  it("ABWEHR: Session für anderen Dokumenttyp schaltet diesen Generator NICHT frei", async () => {
    // Stripe bestätigt bezahlt, aber für "impressum" — nicht für "avv".
    const fetchMock = vi.fn(async () => verifyResponse({ valid: true, docType: "impressum" }));
    vi.stubGlobal("fetch", fetchMock);

    window.history.replaceState(
      {},
      "",
      "/avv?watermark_removed=true&session_id=cs_test_OTHER&doc_type=avv",
    );
    render(<WatermarkRemoveButton docType="avv" returnPath="/avv" />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(useWatermarkStore.getState().isBought("avv")).toBe(false);
  });

  it("ignoriert den Rücksprung, wenn doc_type nicht zum Generator passt (kein Server-Call)", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    window.history.replaceState(
      {},
      "",
      "/avv?watermark_removed=true&session_id=cs_x&doc_type=vvt",
    );
    render(<WatermarkRemoveButton docType="avv" returnPath="/avv" />);

    await new Promise((r) => setTimeout(r, 50));
    expect(useWatermarkStore.getState().isBought("avv")).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /entfernen/i })).toBeDefined();
  });

  it("Dev-Mock (mock=true) schaltet lokal ohne Server-Call frei", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    window.history.replaceState(
      {},
      "",
      "/avv?watermark_removed=true&mock=true&doc_type=avv",
    );
    render(<WatermarkRemoveButton docType="avv" returnPath="/avv" />);

    await waitFor(() => expect(useWatermarkStore.getState().isBought("avv")).toBe(true));
    // Mock-Pfad ruft verify-session NICHT auf (lokal kein echter Stripe-Call).
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
