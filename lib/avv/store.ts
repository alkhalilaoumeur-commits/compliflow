import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AvvFormData, WizardStep } from "./types";
import { WIZARD_STEPS } from "./types";

type AvvStore = {
  currentStep: WizardStep;
  data: AvvFormData;
  setStep: (step: WizardStep) => void;
  goNext: () => void;
  goPrev: () => void;
  update: <K extends keyof AvvFormData>(key: K, value: AvvFormData[K]) => void;
  patch: (partial: Partial<AvvFormData>) => void;
  reset: () => void;
};

const todayIso = () => new Date().toISOString().split("T")[0];

const initialData: AvvFormData = {
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
  abschlussDatum: todayIso(),
  abschlussOrt: "",
};

export const useAvvStore = create<AvvStore>()(
  persist(
    (set, get) => ({
      currentStep: "parteien",
      data: initialData,
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
        set((state) => ({ data: { ...state.data, [key]: value } })),
      patch: (partial) =>
        set((state) => ({ data: { ...state.data, ...partial } })),
      reset: () => set({ currentStep: "parteien", data: initialData }),
    }),
    {
      name: "compliflow-avv-v1",
      version: 2,
      migrate: (persisted) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = persisted as any;
        if (!p || !p.data) return { currentStep: "parteien", data: initialData };
        return {
          currentStep: p.currentStep ?? "parteien",
          data: {
            ...initialData,
            ...p.data,
            abschlussDatum: p.data.abschlussDatum ?? todayIso(),
            abschlussOrt: p.data.abschlussOrt ?? "",
          },
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
