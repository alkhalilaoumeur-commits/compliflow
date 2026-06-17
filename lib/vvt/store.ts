import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  VvtFormData,
  VvtWizardStep,
  VvtModus,
  PflichtCheck,
  Verarbeitungstaetigkeit,
  AuftraggeberMandant,
} from "./types";
import { VVT_WIZARD_STEPS } from "./types";

type VvtStore = {
  currentStep: VvtWizardStep;
  data: VvtFormData;
  setStep: (step: VvtWizardStep) => void;
  goNext: () => void;
  goPrev: () => void;
  setModus: (modus: VvtModus) => void;
  patchPflichtCheck: (partial: Partial<PflichtCheck>) => void;
  patchVerantwortlicher: (partial: Partial<VvtFormData["verantwortlicher"]>) => void;
  addAuftraggeber: (a: AuftraggeberMandant) => void;
  updateAuftraggeber: (id: string, partial: Partial<AuftraggeberMandant>) => void;
  removeAuftraggeber: (id: string) => void;
  addTaetigkeit: (t: Verarbeitungstaetigkeit) => void;
  updateTaetigkeit: (id: string, partial: Partial<Verarbeitungstaetigkeit>) => void;
  removeTaetigkeit: (id: string) => void;
  reorderTaetigkeiten: (from: number, to: number) => void;
  reset: () => void;
};

const todayIso = () => new Date().toISOString().split("T")[0];

const INITIAL_PFLICHT_CHECK: PflichtCheck = {
  mitarbeiter250Plus: false,
  nichtNurGelegentlich: true,
  besondereKategorien: false,
  risikoFuerBetroffene: false,
};

const initialData: VvtFormData = {
  schemaVersion: 2,
  modus: "verantwortlicher",
  pflichtCheck: INITIAL_PFLICHT_CHECK,
  verantwortlicher: { land: "Deutschland", hatDsb: false, hatEuVertreter: false },
  auftraggeber: [],
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
      setModus: (modus) =>
        set((state) => ({
          data: { ...state.data, modus, letztAktualisiert: todayIso() },
        })),
      patchPflichtCheck: (partial) =>
        set((state) => ({
          data: {
            ...state.data,
            pflichtCheck: { ...state.data.pflichtCheck, ...partial },
            letztAktualisiert: todayIso(),
          },
        })),
      patchVerantwortlicher: (partial) =>
        set((state) => ({
          data: {
            ...state.data,
            verantwortlicher: { ...state.data.verantwortlicher, ...partial },
            letztAktualisiert: todayIso(),
          },
        })),
      addAuftraggeber: (a) =>
        set((state) => ({
          data: {
            ...state.data,
            auftraggeber: [...state.data.auftraggeber, a],
            letztAktualisiert: todayIso(),
          },
        })),
      updateAuftraggeber: (id, partial) =>
        set((state) => ({
          data: {
            ...state.data,
            auftraggeber: state.data.auftraggeber.map((a) =>
              a.id === id ? { ...a, ...partial } : a
            ),
            letztAktualisiert: todayIso(),
          },
        })),
      removeAuftraggeber: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            auftraggeber: state.data.auftraggeber.filter((a) => a.id !== id),
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
      reset: () =>
        set({
          currentStep: "unternehmen",
          data: { ...initialData, erstelltAm: todayIso() },
        }),
    }),
    {
      name: "compliflow-vvt-v2",
      version: 2,
      migrate: (persisted, version) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = persisted as any;
        if (!p || !p.data) return { currentStep: "unternehmen", data: initialData };

        // Migration von v1 → v2: fehlende Pflichtfelder mit Defaults füllen
        const migratedData: VvtFormData = {
          ...initialData,
          ...p.data,
          schemaVersion: 2,
          modus: p.data.modus ?? "verantwortlicher",
          pflichtCheck: { ...INITIAL_PFLICHT_CHECK, ...(p.data.pflichtCheck ?? {}) },
          verantwortlicher: {
            land: "Deutschland",
            hatDsb: false,
            hatEuVertreter: false,
            ...(p.data.verantwortlicher ?? {}),
          },
          auftraggeber: p.data.auftraggeber ?? [],
          // Migration der Tätigkeiten: neue Pflichtfelder mit Defaults
          taetigkeiten: (p.data.taetigkeiten ?? []).map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (t: any): Verarbeitungstaetigkeit => ({
              ...t,
              datenherkunft: t.datenherkunft ?? "direkt",
              dsfaStatus: t.dsfaStatus ?? "nicht-erforderlich",
              kiSysteme: t.kiSysteme ?? [],
            })
          ),
        };
        if (version === undefined) {
          // No-op: hinweise abfangen
        }
        return {
          currentStep: p.currentStep ?? "unternehmen",
          data: migratedData,
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
  const baseValid = !!(v.bezeichnung && v.name && v.strasse && v.plz && v.ort && v.email);
  if (!baseValid) return false;
  // Wenn EU-Vertreter aktiviert: Pflichtfelder prüfen
  if (v.hatEuVertreter) {
    const r = v.euVertreter;
    if (!r || !r.bezeichnung || !r.anschrift || !r.email) return false;
  }
  // Wenn Auftragsverarbeiter-Modus: mind. 1 Auftraggeber-Mandant
  if (data.modus === "auftragsverarbeiter" && data.auftraggeber.length === 0) {
    return false;
  }
  return true;
}

export function isTaetigkeitenValid(data: VvtFormData): boolean {
  return data.taetigkeiten.length >= 1;
}
