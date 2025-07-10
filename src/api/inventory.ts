// src/api/inventory.ts

import { api } from "@/services/api";
import {
  adjustmentFilter,
  setMovement,
  CreateAdjustment,
} from "@/types/inventory";

export const getInventoryReportData = async ({
  date,
  user_id,
}: {
  date: string;
  user_id?: string;
}) => {
  const params: Record<string, string> = {};

  if (user_id) {
    params.user_id = user_id;
  }
  params.date = date;

  const res = await api.get("/inventory/movements", { params });
  return res.data;
};

export const registerMovement = async (movementData: setMovement) => {
  const res = await api.post("/inventory/movements", movementData);
  return res.data;
};

export const fetchAdjustments = async () => {
  const res = await api.get("/inventory/adjustments");
  return res.data;
};

export const fetchFilterAdjustments = async (filter: adjustmentFilter) => {
  const res = await api.get("/inventory/adjustments", { params: filter });
  return res.data;
};

export const setAdjustment = async (adjustmentData: CreateAdjustment) => {
  const res = await api.post("/inventory/adjustments", adjustmentData);
  return res.data;
};
