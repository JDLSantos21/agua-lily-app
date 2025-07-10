import {
  editMaterial,
  fetchMaterials,
  deleteMaterial,
  setMaterial,
  fetchFilteredStock,
} from "@/api/materials";
import { UpdatedMaterial } from "@/types/materials/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  registerMovement,
  fetchAdjustments,
  setAdjustment,
} from "@/api/inventory";
import { toast } from "sonner";

export const useMaterials = () => {
  return useQuery({
    queryKey: ["materials"],
    queryFn: fetchMaterials,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });
};

export const useFetchFilteredMaterials = (query: { query: string }) => {
  return useQuery({
    queryKey: ["filteredMaterials", query],
    queryFn: () => fetchFilteredStock(query),
  });
};

type EditMaterialParams = {
  id: number;
  material: UpdatedMaterial;
};

export const useEditMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, material }: EditMaterialParams) =>
      editMaterial(id, material),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      queryClient.invalidateQueries({ queryKey: ["filteredMaterials"] });
      toast.success("Material actualizado correctamente");
    },
    onError: (error: any) => {
      console.log("Error al actualizar el material:", error);
      toast.error("Ocurrió un error al actualizar el material");
    },
  });
};

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      queryClient.invalidateQueries({ queryKey: ["filteredMaterials"] });
      toast.success("Material eliminado correctamente");
    },
    onError: (error: any) => {
      console.log("Error al eliminar el material:", error);
      toast.error("Ocurrió un error al eliminar el material");
    },
  });
};

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (materialData: any) => {
      return setMaterial(materialData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      queryClient.invalidateQueries({ queryKey: ["filteredMaterials"] });
      toast.success("Material creado correctamente");
    },
    onError: (error: any) => {
      console.log("Error al crear el material:", error);
      toast.error("Ocurrió un error al crear el material");
    },
  });
};

export const useRegisterOutput = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (outputData: any) => {
      return await registerMovement(outputData);
    },
    onSuccess: () => {
      // Invalidar todas las queries de materiales
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      // Invalidar todas las queries de materiales filtrados
      queryClient.invalidateQueries({ queryKey: ["filteredMaterials"] });
      toast.success("Salida registrada correctamente");
    },
    onError: (error: any) => {
      console.log("Error al registrar la salida:", error);
      toast.error(
        "Ocurrió un problema registrando el movimiento, intenta de nuevo."
      );
    },
  });
};

export const useFetchAdjustments = () => {
  return useQuery({
    queryKey: ["adjustments"],
    queryFn: fetchAdjustments,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useCreateAdjustment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (adjustmentData: any) => {
      return await setAdjustment(adjustmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adjustments"] });
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      queryClient.invalidateQueries({ queryKey: ["filteredMaterials"] });
      toast.success("Ajuste registrado correctamente.");
    },
    onError: (error: any) => {
      console.log("Error al registrar el ajuste:", error);
      toast.error(
        "Ocurrió un problema registrando el ajuste, intenta de nuevo."
      );
    },
  });
};
