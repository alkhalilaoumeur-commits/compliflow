/**
 * Watermark-Removal-Store
 * Persistiert pro Dokument-Typ ob der User den 0,99€-Watermark-Removal gekauft hat.
 * Stripe-Session-IDs werden im localStorage gehalten — keine Server-Session.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DocType = "avv" | "vvt" | "impressum" | "datenschutz" | "widerruf" | "agb" | "cookie_banner";

export type WatermarkEntry = {
  /** Stripe Session-ID */
  sessionId: string;
  /** Timestamp des Kaufs */
  paidAt: number;
};

type WatermarkStore = {
  /** Pro Doc-Type max. eine aktive Session-ID */
  bought: Partial<Record<DocType, WatermarkEntry>>;
  setBought: (docType: DocType, entry: WatermarkEntry) => void;
  isBought: (docType: DocType) => boolean;
  reset: (docType?: DocType) => void;
};

export const useWatermarkStore = create<WatermarkStore>()(
  persist(
    (set, get) => ({
      bought: {},
      setBought: (docType, entry) =>
        set((s) => ({ bought: { ...s.bought, [docType]: entry } })),
      isBought: (docType) => !!get().bought[docType],
      reset: (docType) =>
        set((s) => {
          if (!docType) return { bought: {} };
          const copy = { ...s.bought };
          delete copy[docType];
          return { bought: copy };
        }),
    }),
    { name: "compliflow-watermark-v1", version: 1 },
  ),
);
