import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CookieBannerData, WizardStep } from "./types";
import { WIZARD_STEPS } from "./types";
import { INITIAL_COOKIE_BANNER } from "./defaults";

type CookieBannerStore = {
  currentStep: WizardStep;
  data: CookieBannerData;
  setStep: (step: WizardStep) => void;
  goNext: () => void;
  goPrev: () => void;
  update: <K extends keyof CookieBannerData>(key: K, value: CookieBannerData[K]) => void;
  patch: (partial: Partial<CookieBannerData>) => void;
  reset: () => void;
};

const todayIso = () => new Date().toISOString().split("T")[0];

export const useCookieBannerStore = create<CookieBannerStore>()(
  persist(
    (set, get) => ({
      currentStep: "anbieter",
      data: INITIAL_COOKIE_BANNER,
      setStep: (step) => set({ currentStep: step }),
      goNext: () => {
        const idx = WIZARD_STEPS.findIndex((s) => s.id === get().currentStep);
        if (idx < WIZARD_STEPS.length - 1) {
          set({ currentStep: WIZARD_STEPS[idx + 1].id });
        }
      },
      goPrev: () => {
        const idx = WIZARD_STEPS.findIndex((s) => s.id === get().currentStep);
        if (idx > 0) {
          set({ currentStep: WIZARD_STEPS[idx - 1].id });
        }
      },
      update: (key, value) =>
        set((state) => ({
          data: { ...state.data, [key]: value, letztAktualisiert: todayIso() },
        })),
      patch: (partial) =>
        set((state) => ({
          data: { ...state.data, ...partial, letztAktualisiert: todayIso() },
        })),
      reset: () => set({ currentStep: "anbieter", data: INITIAL_COOKIE_BANNER }),
    }),
    { name: "compliflow-cookie-banner-v1", version: 1 },
  ),
);

export function getStepIndex(step: WizardStep) {
  return WIZARD_STEPS.findIndex((s) => s.id === step);
}

export function getProgress(step: WizardStep) {
  const idx = getStepIndex(step);
  return ((idx + 1) / WIZARD_STEPS.length) * 100;
}
