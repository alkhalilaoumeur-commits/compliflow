import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  sendWaitlistNotification,
  sendWaitlistDoiEmail,
  sendWaitlistConfirmed,
  sendPaymentConfirmation,
} from "@/lib/email";

// lib/email.ts ruft Resend nur auf, wenn RESEND_API_KEY gesetzt ist.
// Ohne Key sind alle Funktionen No-Ops (getResend() → null) und dürfen NICHT werfen.
// Die echte Mail-Zustellung (mit Key) ist eine Netzwerk-Integration und wird hier
// bewusst nicht getestet — siehe APP-AUDIT-CONTEXT.md §10.
describe("lib/email — No-Op-Pfad ohne RESEND_API_KEY", () => {
  const prev = process.env.RESEND_API_KEY;

  beforeEach(() => {
    delete process.env.RESEND_API_KEY;
  });
  afterEach(() => {
    if (prev !== undefined) process.env.RESEND_API_KEY = prev;
  });

  it("sendWaitlistNotification läuft ohne Key fehlerfrei durch", async () => {
    await expect(
      sendWaitlistNotification({ email: "a@b.de", source: "avv" }),
    ).resolves.toBeUndefined();
  });

  it("sendWaitlistDoiEmail läuft ohne Key fehlerfrei durch", async () => {
    await expect(
      sendWaitlistDoiEmail({ email: "a@b.de", source: "avv", confirmUrl: "https://x/y" }),
    ).resolves.toBeUndefined();
  });

  it("sendWaitlistConfirmed läuft ohne Key fehlerfrei durch", async () => {
    await expect(
      sendWaitlistConfirmed({ email: "a@b.de", source: "cookie-banner" }),
    ).resolves.toBeUndefined();
  });

  it("sendPaymentConfirmation läuft ohne Key fehlerfrei durch", async () => {
    await expect(
      sendPaymentConfirmation({ to: "a@b.de", tool: "avv", sessionId: "cs_test_123" }),
    ).resolves.toBeUndefined();
  });
});
