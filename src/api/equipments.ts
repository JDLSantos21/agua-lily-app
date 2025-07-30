import { CreateEquipmentModelFormData } from "@/schemas/equipment";
import { api } from "@/services/api";
import {
  Equipment,
  EquipmentFilter,
  EquipmentModel,
  CreateEquipmentParams,
} from "@/types/equipments.types";

interface EquipmentsResponse {
  success: boolean;
  data: Equipment[];
  total?: number;
  page?: number;
  limit?: number;
}

interface EquipmentsModelsResponse {
  success: boolean;
  data: EquipmentModel[];
}

export const getEquipments = async (
  filters?: EquipmentFilter
): Promise<EquipmentsResponse> => {
  try {
    // Construir parámetros de consulta
    const params: Record<string, any> = {};

    if (filters) {
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.customer_id) params.customer_id = filters.customer_id;
      if (filters.search) params.search = filters.search;
      if (filters.limit) params.limit = filters.limit;
      if (filters.offset) params.offset = filters.offset;
    }

    const res = await api.get("/equipments", { params });
    return res.data;
  } catch (error) {
    console.error("Error fetching equipments:", error);
    throw new Error("Ocurrió un problema al obtener los equipos.");
  }
};

export const getEquipmentModels =
  async (): Promise<EquipmentsModelsResponse> => {
    try {
      const res = await api.get("/equipments/models");
      return res.data;
    } catch (error) {
      console.error("Error fetching equipment models:", error);
      throw new Error("Ocurrió un problema al obtener los modelos de equipos.");
    }
  };

interface CreateEquipmentModelResponse {
  success: boolean;
  data: EquipmentModel;
}

export const createEquipmentModel = async (
  data: CreateEquipmentModelFormData
): Promise<CreateEquipmentModelResponse> => {
  try {
    const res = await api.post("/equipments/models", data);
    return res.data;
  } catch (error) {
    console.error("Error creating equipment model:", error);
    throw new Error("Ocurrió un problema al crear el modelo de equipo.");
  }
};

export const updateEquipmentModel = async (
  id: number,
  data: Partial<CreateEquipmentModelFormData>
): Promise<CreateEquipmentModelResponse> => {
  try {
    const res = await api.patch(`/equipments/models/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating equipment model:", error);
    throw new Error("Ocurrió un problema al actualizar el modelo de equipo.");
  }
};

export const createEquipment = async (
  data: CreateEquipmentParams
): Promise<Equipment> => {
  try {
    const res = await api.post("/equipments", data);
    return res.data;
  } catch (error) {
    console.error("Error creating equipment:", error);
    throw new Error("Ocurrió un problema al crear el equipo.");
  }
};

export const deleteEquipment = async (id: number): Promise<void> => {
  try {
    await api.delete(`/equipments/${id}`);
  } catch (error) {
    throw error;
    // throw new Error("Ocurrió un problema al keliminar el equipo.");
  }
};

export const updateEquipment = async (
  id: number,
  data: Partial<Equipment>
): Promise<{ success: boolean; data: Equipment }> => {
  try {
    const res = await api.put(`/equipments/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error("Ocurrió un problema al actualizar el equipo.");
  }
};
