// src/api/materials.ts
import { newMaterial, UpdatedMaterial } from "@/types/materials/material";
import { fetcher } from "./fetcher";

export const fetchMaterials = async () => {
  return await fetcher("/materials");
};

export const fetchFilteredStock = async (query: string) => {
  return await fetcher(`/materials/filter`, {}, { query });
};

export const deleteMaterial = async (id: number) => {
  try {
    const response = await fetcher(`/materials/${id}`, {
      method: "DELETE",
    });
    return await response;
  } catch (error) {
    console.log(error);
    throw new Error(
      "Ocurrió un problema eliminando el material, intenta de nuevo."
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
