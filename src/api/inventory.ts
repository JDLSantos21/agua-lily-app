// src/api/materials.ts
import {
  newMaterial,
  outputFormDataType,
  UpdatedMaterial,
} from "@/types/materials/material";
import { fetcher } from "./fetcher";
import { AdjustmentCreate } from "@/types/materials/adjustment";
import { adjustmentFilter, setMovement } from "@/types/inventory";

export const registerMovement = async (movementData: setMovement) => {
  try {
    const response = await fetcher("/inventory/movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movementData),
    });

    return await response;
  } catch (error) {
    console.log(error);
    throw new Error(
      "Ocurrió un problema registrando el movimiento, intenta de nuevo."
    );
  }
};

export const fetchAdjustments = async () => {
  return await fetcher(`/inventory/adjustments`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};

export const fetchFilterAdjustments = async (filter: adjustmentFilter) => {
  const url = `/inventory/adjustments`;
  return await fetcher(`${url}`, {}, { ...filter });
};

export const fetchFilteredStock = async (query: string) => {
  return await fetcher(`/materials/filter`, {}, { query });
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
    `/materials/adjustments/filter`,
    {},
    { materialName: material_name, startDate: start_date, endDate: end_date }
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
  const formatedData = {
    ...materialData,
    price: Number(materialData.price),
    minimum_stock: Number(materialData.minimum_stock),
  };

  try {
    const response = await fetcher(`/materials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formatedData),
    });

    return await response;
  } catch (error) {
    console.log(error);
    throw new Error(
      "Ocurrió un problema editando el material, intenta de nuevo."
    );
  }
};
