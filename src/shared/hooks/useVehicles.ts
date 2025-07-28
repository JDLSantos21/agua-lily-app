import { getVehicles } from "@/api/vehicles";
import { Vehicle, VehicleFilters } from "@/types/vehicles";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useVehicles(
  filters?: VehicleFilters,
  options?: Partial<
    UseQueryOptions<Vehicle[], Error, Vehicle[], readonly unknown[]>
  >
) {
  return useQuery({
    queryKey: ["vehicles", filters],
    queryFn: () => getVehicles(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...(options ?? {}),
  });
}
