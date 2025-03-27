// src/api/inventory.ts

import { fetcher } from "./fetcher";
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

  return await fetcher(
    `/inventory/movements`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
    params
  );
};

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

export const setAdjustment = async (adjustmentData: CreateAdjustment) => {
  try {
    const response = await fetcher("/inventory/adjustments", {
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
