// src/api/materials.ts
import {
  newMaterial,
  outputFormDataType,
  UpdatedMaterial,
} from "@/types/materials/material";
import { fetcher } from "./fetcher";
import { AdjustmentCreate } from "@/types/materials/adjustment";

export const fetchMaterials = async () => {
  return await fetcher("/materials");
};

export const fetchAdjustments = async () => {
  return await fetcher("/materials/adjustments");
};

export const fetchFilteredStock = async (query: string) => {
  return await fetcher(`/materials/filter?query=${query}`);
};

export const fetchFilteredAdjustments = async ({
  material_name,
  start_date,
  end_date,
}: {
  material_name: string;
  start_date: string;
  end_date: string;
}) => {
  return await fetcher(
    `/materials/adjustments/filter?materialName=${material_name}&startDate=${start_date}&endDate=${end_date}`
  );
};

export const setOutputMaterial = async (outputData: outputFormDataType) => {
  try {
    const response = await fetcher("/materials/output", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...outputData,
        reason: outputData.reason || "Salida General",
        type: "salida",
        user_id: outputData.user_id || 1,
      }),
    });

    return await response;
  } catch (error) {
    console.log(error);
    throw new Error(
      "Ocurrió un problema registrando la salida, intenta de nuevo."
    );
  }
};

export const setAdjustment = async (adjustmentData: AdjustmentCreate) => {
  try {
    const response = await fetcher("/materials/adjustment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adjustmentData),
    });

    return await response;
  } catch (error) {
    console.log(error);
    throw new Error(
      "Ocurrió un problema registrando el ajuste, intenta de nuevo."
    );
  }
};

export const setMaterial = async (materialData: newMaterial) => {
  try {
    const response = await fetcher("/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(materialData),
    });

    return await response;
  } catch (error) {
    console.log(error);
    throw new Error(
      "Ocurrió un problema registrando el material, intenta de nuevo."
    );
  }
};

export const editMaterial = async (
  id: number,
  materialData: UpdatedMaterial
) => {
  try {
    const response = await fetcher(`/materials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(materialData),
    });

    return await response;
  } catch (error) {
    console.log(error);
    throw new Error(
      "Ocurrió un problema editando el material, intenta de nuevo."
    );
  }
};
