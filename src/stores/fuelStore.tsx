import { fetchFuelAvailability } from "@/api/fuel";
import { create } from "zustand";

interface FuelState {
  available: number;
  setAvailable: (available: number) => void;
  fetchFuelAvailability: () => Promise<void>;
}

export const useFuelStore = create<FuelState>((set) => ({
  available: 0,
  setAvailable: (available: number) => set({ available }),
  fetchFuelAvailability: async () => {
    const response = await fetchFuelAvailability();
    if (response && response.length > 0) {
      set({ available: Number(response[0].available) });
    } else {
      set({ available: 0 });
    }
  },
}));
