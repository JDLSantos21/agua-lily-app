import { ReplenishmentFormData } from "@/app/combustible/reabastecimiento/components/replenishment-form";
import { fetcher } from "./fetcher";

export const fetchDashboardData = async () => {
  try {
    return await fetcher(`/fuel/dashboard`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
  }
};

export const fetchRegisterInitialData = async () => {
  try {
    return await fetcher(`/fuel/register-data`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
  }
};

export const registerFuelConsumption = async (data: unknown) => {
  try {
    await fetcher(`/fuel/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.log("Consumo registrado correctamente");
  } catch (err) {
    console.log("Error al registrar consumo:", err);
    throw new Error("Error al registrar consumo");
  }
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

  // Usamos fetcher para realizar la petición
  try {
    return fetcher("/fuel/records/filtered", {}, params);
  } catch (error) {
    console.log(error);
  }
}

export async function registerFuelReplenishment(data: ReplenishmentFormData) {
  try {
    return fetcher("/fuel/replenishments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.log(error);
  }
}

export async function fetchRecentReplenishments() {
  try {
    return fetcher("/fuel/replenishments", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function fetchReplenishmentChartData() {
  try {
    return fetcher("/fuel/replenishments/chart", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function resetFuelAvailability({
  user_id,
  password,
}: {
  user_id: number;
  password: string;
}) {
  try {
    return fetcher("/fuel/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, password }),
    });
  } catch (error) {
    console.log(error);
  }
}
