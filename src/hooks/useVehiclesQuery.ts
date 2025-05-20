import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { getVehicles } from "@/api/vehicles";

import { Vehicle } from "@/types/vehicles";

export const useVehiclesQuery = (
  options?: Partial<
    UseQueryOptions<Vehicle[], Error, Vehicle[], readonly unknown[]>
  >
) => {
  return useQuery<Vehicle[]>({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
    staleTime: 1000 * 60 * 60, // 1 Hora
    ...(options ?? {}),
  });
};
