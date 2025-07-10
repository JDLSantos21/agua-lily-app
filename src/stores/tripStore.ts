import { create } from "zustand";
import { TripFilters } from "@/hooks/useTripReports";

interface TripState {
  selectedTripId: number | null;
  selectedTrip: any | null;
  // UI states for trip reports
  activeFilters: TripFilters | null;
  showResults: boolean;
  setSelectedTrip: (trip: any) => void;
  setSelectedTripId: (id: number | null) => void;
  setActiveFilters: (filters: TripFilters | null) => void;
  setShowResults: (show: boolean) => void;
  resetSelection: () => void;
  resetReportState: () => void;
}

export const useTripStore = create<TripState>((set) => ({
  selectedTripId: null,
  selectedTrip: null,
  activeFilters: null,
  showResults: false,
  setSelectedTrip: (trip) => set({ selectedTrip: trip }),
  setSelectedTripId: (id) => set({ selectedTripId: id }),
  setActiveFilters: (filters) => set({ activeFilters: filters }),
  setShowResults: (show) => set({ showResults: show }),
  resetSelection: () => set({ selectedTripId: null, selectedTrip: null }),
  resetReportState: () => set({ activeFilters: null, showResults: false }),
}));
