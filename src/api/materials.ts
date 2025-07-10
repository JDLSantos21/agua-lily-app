// src/api/materials.ts
import { newMaterial, UpdatedMaterial } from "@/types/materials/material";
import { api } from "@/services/api";

export const fetchMaterials = async (): Promise<any> => {
  const res = await api.get("/materials");
  return res.data;
};

export const fetchFilteredStock = async ({ query }: { query: string }) => {
  const res = await api.get("/materials/filter", {
    params: { query },
  });
  return res.data;
};

export const deleteMaterial = async (id: number) => {
  const res = await api.delete(`/materials/${id}`);
  return res.data;
};

export const setMaterial = async (materialData: newMaterial) => {
  const res = await api.post("/materials", materialData);
  return res.data;
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

  const res = await api.patch(`/materials/${id}`, formatedData);
  return res.data;
};
