import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTrips, updateTripDate } from "@/api/trips";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";

export interface TripFilters {
  vehicle_id?: string;
  start_date: string;
  end_date: string;
}

export const useTripReports = (filters?: TripFilters) => {
  return useQuery({
    queryKey: queryKeys.trips.reports(filters),
    queryFn: () => getTrips(filters!),
    enabled: !!filters && !!filters.start_date && !!filters.end_date,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 1,
  });
};

export const useUpdateTripDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, newDate }: { tripId: number; newDate: string }) =>
      updateTripDate(tripId, newDate),
    onSuccess: () => {
      toast.success("Fecha del viaje actualizada correctamente");

      // Invalidar queries relacionadas con trips
      queryClient.invalidateQueries({
        queryKey: queryKeys.trips.all,
      });

      // Refrescar queries de reportes activas
      queryClient.refetchQueries({
        predicate: (query) =>
          query.queryKey[0] === "tripReports" &&
          query.state.status === "success",
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar la fecha del viaje");
    },
  });
};
