import { getDefaultsData } from "@/api/trips";
import { create } from "zustand";

interface DefaultData {
  amount: number;
  vehicle_id: number;
  vehicle_tag: string;
  driver_id: number;
  driver: string;
  created_at: string;
  updated_at: string;
}

interface TripState {
  trips: any | null;
  selectedTripId: number | null;
  setTrips: (trips: any) => void;
  selectedTrip: any | null;
  resetTrips: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  registerTripDefaults: DefaultData[] | [];
  getRegisterTripDefaults: () => Promise<void>;
}

export const useTripStore = create<TripState>((set) => ({
  trips: null,
  selectedTripId: null,
  loading: false,
  selectedTrip: null,
  setTrips: (trips) => set({ trips }),
  resetTrips: () => set({ trips: null }),
  setLoading: (loading) => set({ loading }),
  registerTripDefaults: [],
  getRegisterTripDefaults: async () => {
    set({ loading: true });
    try {
      const data = await getDefaultsData();
      set({ registerTripDefaults: data });
    } catch (error) {
      console.error("Error fetching default data:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
