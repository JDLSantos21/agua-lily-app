import {
  getEquipments,
  getEquipmentModels,
  createEquipment,
} from "@/api/equipments";
import {
  CreateEquipmentParams,
  EquipmentFilter,
} from "@/types/equipments.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useEquipments(filters?: EquipmentFilter) {
  return useQuery({
    queryKey: ["equipments", filters],
    queryFn: () => getEquipments(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: true, // Always enabled, filters are optional
  });
}

export function useEquipmentModels() {
  return useQuery({
    queryKey: ["equipmentModels"],
    queryFn: getEquipmentModels,
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: true, // Always enabled
  });
}

export function useEquipmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEquipmentParams) => createEquipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
  });
}
