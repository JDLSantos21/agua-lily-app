import { create } from "zustand";

type DialogType =
  | "inventory-report"
  | "new-material"
  | "new-adjustment"
  | "search-adjustment"
  | "replenishment-dialog"
  | "fuel-reset-dialog"
  | "trips-report-dialog"
  | "edit-pending-trip-dialog"
  | "edit-trip-date-dialog"
  | null;

interface DialogState {
  openDialog: DialogType;
  open: (dialog: DialogType) => void;
  close: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  openDialog: null,
  open: (dialog: DialogType) => set({ openDialog: dialog }),
  close: () => set({ openDialog: null }),
}));
