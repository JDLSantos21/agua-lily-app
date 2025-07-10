// Centralized query keys for TanStack Query
export const queryKeys = {
  trips: {
    all: ["trips"] as const,
    reports: (filters?: any) => ["tripReports", filters] as const,
    pending: (tripId: string) => ["pendingTrip", tripId] as const,
    defaults: () => ["tripDefaults"] as const,
    history: (date: string) => ["tripHistory", date] as const,
  },
  vehicles: {
    all: ["vehicles"] as const,
    list: () => [...queryKeys.vehicles.all, "list"] as const,
  },
  employees: {
    all: ["employees"] as const,
    list: () => [...queryKeys.employees.all, "list"] as const,
  },
} as const;
