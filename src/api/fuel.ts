import { ReplenishmentFormData } from "@/app/(protected)/combustible/reabastecimiento/components/replenishment-form";
import { api } from "@/services/api";
import { AxiosResponse } from "axios";

export const fetchDashboardData = async () => {
  const res = await api.get("/fuel/dashboard");
  return res.data;
};

export const fetchFuelAvailability = async () => {
  const res = await api.get("/fuel/availability");
  return res.data;
};

export const fetchRegisterInitialData = async () => {
  const res = await api.get("/fuel/register-data");
  return res.data;
};

export const registerFuelConsumption = async (data: unknown) => {
  const res = await api.post("/fuel/records", data);
  return res.data;
};

export async function fetchFilteredFuelRecords(filters: {
  current_tag?: string;
  start_date?: string;
  end_date?: string;
}) {
  // Construimos los parámetros solo con los filtros que tienen valor
  const params: Record<string, string> = {};
  if (filters.current_tag) params.current_tag = filters.current_tag;
  if (filters.start_date) params.start_date = `${filters.start_date} 00:00:00`; // Añadimos hora inicial
  if (filters.end_date) params.end_date = `${filters.end_date} 23:59:59`; // Añadimos hora final

  const res = await api.get("/fuel/records/filtered", { params });
  return res.data;
}

export async function registerFuelReplenishment(data: ReplenishmentFormData) {
  const res = await api.post("/fuel/replenishments", data);
  return res.data;
}

export async function fetchRecentReplenishments() {
  const res = await api.get("/fuel/replenishments");
  return res.data;
}

export async function fetchReplenishmentChartData() {
  const res = await api.get("/fuel/replenishments/chart");
  return res.data;
}

export async function resetFuelAvailability({
  user_id,
  password,
}: {
  user_id: number;
  password: string;
}): Promise<AxiosResponse> {
  const res = await api.post("/fuel/reset", { user_id, password });
  return res.data;
}
