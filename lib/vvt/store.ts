import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { VvtFormData, VvtWizardStep, Verarbeitungstaetigkeit } from "./types";
import { VVT_WIZARD_STEPS } from "./types";

type VvtStore = {
  currentStep: VvtWizardStep;
  data: VvtFormData;
  setStep: (step: VvtWizardStep) => void;
  goNext: () => void;
  goPrev: () => void;
  patchVerantwortlicher: (partial: Partial<VvtFormData["verantwortlicher"]>) => void;
  addTaetigkeit: (t: Verarbeitungstaetigkeit) => void;
  updateTaetigkeit: (id: string, partial: Partial<Verarbeitungstaetigkeit>) => void;
  removeTaetigkeit: (id: string) => void;
  reorderTaetigkeiten: (from: number, to: number) => void;
  reset: () => void;
};

const todayIso = () => new Date().toISOString().split("T")[0];

const initialData: VvtFormData = {
  schemaVersion: 1,
  verantwortlicher: { land: "Deutschland", hatDsb: false },
  taetigkeiten: [],
  erstelltAm: todayIso(),
  letztAktualisiert: todayIso(),
};

export const useVvtStore = create<VvtStore>()(
  persist(
    (set, get) => ({
      currentStep: "unternehmen",
      data: initialData,
      setStep: (step) => set({ currentStep: step }),
      goNext: () => {
        const idx = VVT_WIZARD_STEPS.findIndex((s) => s.id === get().currentStep);
        if (idx < VVT_WIZARD_STEPS.length - 1) {
          set({ currentStep: VVT_WIZARD_STEPS[idx + 1].id });
        }
      },
      goPrev: () => {
        const idx = VVT_WIZARD_STEPS.findIndex((s) => s.id === get().currentStep);
        if (idx > 0) {
          set({ currentStep: VVT_WIZARD_STEPS[idx - 1].id });
        }
      },
      patchVerantwortlicher: (partial) =>
        set((state) => ({
          data: {
            ...state.data,
            verantwortlicher: { ...state.data.verantwortlicher, ...partial },
            letztAktualisiert: todayIso(),
          },
        })),
      addTaetigkeit: (t) =>
        set((state) => ({
          data: {
            ...state.data,
            taetigkeiten: [...state.data.taetigkeiten, t],
            letztAktualisiert: todayIso(),
          },
        })),
      updateTaetigkeit: (id, partial) =>
        set((state) => ({
          data: {
            ...state.data,
            taetigkeiten: state.data.taetigkeiten.map((t) =>
              t.id === id ? { ...t, ...partial } : t
            ),
            letztAktualisiert: todayIso(),
          },
        })),
      removeTaetigkeit: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            taetigkeiten: state.data.taetigkeiten.filter((t) => t.id !== id),
            letztAktualisiert: todayIso(),
          },
        })),
      reorderTaetigkeiten: (from, to) =>
        set((state) => {
          const list = [...state.data.taetigkeiten];
          const [moved] = list.splice(from, 1);
          list.splice(to, 0, moved);
          return { data: { ...state.data, taetigkeiten: list } };
        }),
      reset: () => set({ currentStep: "unternehmen", data: { ...initialData, erstelltAm: todayIso() } }),
    }),
    {
      name: "compliflow-vvt-v1",
      version: 1,
      migrate: (persisted) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = persisted as any;
        if (!p || !p.data) return { currentStep: "unternehmen", data: initialData };
        return {
          currentStep: p.currentStep ?? "unternehmen",
          data: {
            ...initialData,
            ...p.data,
          },
        };
      },
    }
  )
);

export function getVvtStepIndex(step: VvtWizardStep) {
  return VVT_WIZARD_STEPS.findIndex((s) => s.id === step);
}

export function getVvtProgress(step: VvtWizardStep) {
  const idx = getVvtStepIndex(step);
  return ((idx + 1) / VVT_WIZARD_STEPS.length) * 100;
}

export function isUnternehmenValid(data: VvtFormData): boolean {
  const v = data.verantwortlicher;
  return !!(v.bezeichnung && v.name && v.strasse && v.plz && v.ort && v.email);
}

export function isTaetigkeitenValid(data: VvtFormData): boolean {
  return data.taetigkeiten.length >= 1;
}
