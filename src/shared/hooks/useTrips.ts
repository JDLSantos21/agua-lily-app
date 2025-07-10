import {
  completeTrip,
  getDefaultsData,
  getPendingTripById,
  getTripsReportData,
  registerTrip,
  getTripsHistory,
} from "@/api/trips";
import {
  createCompletedTripInvoice,
  createOutTripInvoice,
} from "@/app/(protected)/viajes/utils/CreateInvoices";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/queryKeys";

export function useTripsReportData(data: {
  user_id?: string;
  date?: string;
}): UseQueryResult<any> {
  return useQuery({
    queryKey: ["tripsReportData", data],
    queryFn: () => getTripsReportData(data),
  });
}

export const useRegisterTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerTrip,
    onSuccess: async (response, variables) => {
      toast.success(`Nuevo viaje registrado satisfactoriamente`, {
        description: `Al camión ${response.trip.vehicle_tag}`,
      });

      // Crear factura de salida
      const printResult = await createOutTripInvoice(response.trip);

      if (!printResult.success) {
        let errorDescription =
          printResult.message ||
          "Ocurrió un error inesperado, intente de nuevo.";
        if (errorDescription.includes("Failed to fetch")) {
          errorDescription = "No se encontró el plugin o no está iniciado";
        }

        toast.warning(
          "El viaje se registró pero hubo un problema al imprimir el conduce",
          {
            description: errorDescription,
          }
        );
      }

      // Invalidar queries relacionadas usando las query keys centralizadas
      queryClient.invalidateQueries({ queryKey: queryKeys.trips.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.trips.defaults() });
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.message || "Ocurrió un error al registrar el viaje.");
    },
  });
};

export const useGetPendingTrip = (tripId: string) => {
  return useQuery({
    queryKey: queryKeys.trips.pending(tripId),
    queryFn: () => getPendingTripById(tripId),
    enabled: !!tripId && tripId !== "",
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useGetTripDefaults = () => {
  return useQuery({
    queryKey: queryKeys.trips.defaults(),
    queryFn: getDefaultsData,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
};

export const useCompleteTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeTrip,
    onSuccess: async (response, variables) => {
      toast.success(`${variables.concept} Registrado Satisfactoriamente`, {
        description: `Al camión ${response.trip.vehicle_tag} por un monto de RD$ ${variables.amount}`,
      });

      // Crear factura
      await createCompletedTripInvoice(response.trip);

      // Invalidar queries relacionadas usando las query keys centralizadas
      queryClient.invalidateQueries({ queryKey: queryKeys.trips.pending("") });
      queryClient.invalidateQueries({ queryKey: queryKeys.trips.all });
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.message || "Ocurrió un error al registrar el viaje.");
    },
  });
};

export const useTripsHistory = (date: string) => {
  return useQuery({
    queryKey: queryKeys.trips.history(date),
    queryFn: () => getTripsHistory({ date }),
    enabled: !!date,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};
