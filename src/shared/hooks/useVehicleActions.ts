import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVehicle } from "@/api/vehicles";

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      // Invalidate and refetch vehicles queries
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: (error) => {
      console.error("Error deleting vehicle:", error);
    },
  });
}

export function useVehicleActions() {
  const queryClient = useQueryClient();

  const invalidateVehicles = () => {
    queryClient.invalidateQueries({ queryKey: ["vehicles"] });
  };

  return {
    invalidateVehicles,
  };
}
