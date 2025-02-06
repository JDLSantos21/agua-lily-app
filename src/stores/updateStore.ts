// src/stores/updateStore.ts
import { create } from "zustand";
import { UpdateInfo } from "@/lib/update";

interface UpdateState {
  updateAvailable: boolean;
  updateInfo: UpdateInfo | null;
  setUpdate: (info: UpdateInfo) => void;
  clearUpdate: () => void;
}

export const useUpdateStore = create<UpdateState>((set) => ({
  updateAvailable: false,
  updateInfo: null,
  setUpdate: (info) => set({ updateAvailable: true, updateInfo: info }),
  clearUpdate: () => set({ updateAvailable: false, updateInfo: null }),
}));
