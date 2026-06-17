import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DatenschutzData, WizardStep } from "./types";
import { WIZARD_STEPS } from "./types";
import { INITIAL_DATENSCHUTZ } from "./defaults";

type DatenschutzStore = {
  currentStep: WizardStep;
  data: DatenschutzData;
  setStep: (step: WizardStep) => void;
  goNext: () => void;
  goPrev: () => void;
  update: <K extends keyof DatenschutzData>(key: K, value: DatenschutzData[K]) => void;
  patch: (partial: Partial<DatenschutzData>) => void;
  reset: () => void;
};

const todayIso = () => new Date().toISOString().split("T")[0];

export const useDatenschutzStore = create<DatenschutzStore>()(
  persist(
    (set, get) => ({
      currentStep: "verantwortlicher",
      data: INITIAL_DATENSCHUTZ,
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
          data: {
            ...state.data,
            [key]: value,
            letztAktualisiert: todayIso(),
          },
        })),
      patch: (partial) =>
        set((state) => ({
          data: {
            ...state.data,
            ...partial,
            letztAktualisiert: todayIso(),
          },
        })),
      reset: () => set({ currentStep: "verantwortlicher", data: INITIAL_DATENSCHUTZ }),
    }),
    {
      name: "compliflow-datenschutz-v1",
      version: 1,
    },
  ),
);

export function getStepIndex(step: WizardStep) {
  return WIZARD_STEPS.findIndex((s) => s.id === step);
}

export function getProgress(step: WizardStep) {
  const idx = getStepIndex(step);
  return ((idx + 1) / WIZARD_STEPS.length) * 100;
}
