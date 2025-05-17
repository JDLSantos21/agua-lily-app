import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerTrip } from "@/api/trips";

export const useRegisterTripMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => registerTrip(data),
    onSuccess: () => {
      // Invalida las consultas relacionadas para actualizar la UI
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
    onError: (error) => {
      console.error("Error al registrar el viaje:", error);
    },
  });
};

export const useUpdateTripMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => registerTrip(data),
    onSuccess: () => {
      // Invalida las consultas relacionadas para actualizar la UI
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
    onError: (error) => {
      console.error("Error al registrar el viaje:", error);
    },
  });
};
