import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ImpressumData, WizardStep } from "./types";
import { WIZARD_STEPS } from "./types";
import { INITIAL_IMPRESSUM } from "./defaults";

type ImpressumStore = {
  currentStep: WizardStep;
  data: ImpressumData;
  setStep: (step: WizardStep) => void;
  goNext: () => void;
  goPrev: () => void;
  update: <K extends keyof ImpressumData>(key: K, value: ImpressumData[K]) => void;
  patch: (partial: Partial<ImpressumData>) => void;
  reset: () => void;
};

export const useImpressumStore = create<ImpressumStore>()(
  persist(
    (set, get) => ({
      currentStep: "anbieter",
      data: INITIAL_IMPRESSUM,
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
            letztAktualisiert: new Date().toISOString().split("T")[0],
          },
        })),
      patch: (partial) =>
        set((state) => ({
          data: {
            ...state.data,
            ...partial,
            letztAktualisiert: new Date().toISOString().split("T")[0],
          },
        })),
      reset: () => set({ currentStep: "anbieter", data: INITIAL_IMPRESSUM }),
    }),
    {
      name: "compliflow-impressum-v1",
      version: 1,
      // Defensive Migration: alte localStorage-Daten mit aktuellem Initial-State
      // mergen, damit neu hinzugefügte (verschachtelte) Felder nicht undefined sind.
      migrate: (persisted) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = persisted as any;
        if (!p || !p.data) return { currentStep: "anbieter", data: INITIAL_IMPRESSUM };
        return {
          currentStep: p.currentStep ?? "anbieter",
          data: { ...INITIAL_IMPRESSUM, ...p.data },
        };
      },
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
