import { CompletedTrip } from "@/app/viajes/types/trips";
import { fetcher } from "./fetcher";

export const getDefaultsData = async () => {
  try {
    return await fetcher(`/trips/defaults`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
  }
};

export const registerTrip = async (data: any) => {
  try {
    return await fetcher("/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    throw new Error("Error al registrar el viaje: " + error);
  }
};

export const completeTrip = async (data: any) => {
  try {
    return await fetcher(`/trips/${data.trip_id}/complete`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    throw new Error("Error al registrar el viaje: " + error);
  }
};

export type TripsQueryParams = {
  vehicle_id?: string | number;
  start_date?: string;
  end_date?: string;
};

export const getTrips = async ({
  vehicle_id,
  start_date,
  end_date,
}: TripsQueryParams) => {
  const params: Record<string, string> = {};

  if (vehicle_id) params.vehicle_id = vehicle_id.toString();
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;

  console.log(params);

  try {
    const response = await fetcher("/trips", {}, params);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getTripById = async (trip_id: string): Promise<CompletedTrip> => {
  try {
    return await fetcher(`/trips/${trip_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getPendingTripById = async (trip_id: string) => {
  try {
    return await fetcher(`/trips/pending/${trip_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getTripsReportData = async ({
  user_id,
  date,
}: {
  user_id?: string;
  date?: string;
}) => {
  const params: Record<string, string> = {};

  if (user_id) params.user_id = user_id.toString();
  if (date) params.date = date;

  try {
    return await fetcher("/trips/report", {}, params);
  } catch (error) {
    console.log(error);
  }
};

export const getTripsHistory = async (filterData: {
  date: string;
  status?: "pending" | "completed";
}) => {
  const params: Record<string, string> = {};

  if (filterData.date) {
    const date = new Date(filterData.date);
    params.date = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  }
  if (filterData.status) params.status = filterData.status;
  console.log("testeo de params: ", params);
  try {
    return await fetcher("/trips/history", {}, params);
  } catch (error) {
    console.log(error);
  }
};

export const updateTripDate = async (
  trip_id: string | number,
  date: string
) => {
  try {
    return await fetcher(`/trips/${trip_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });
  } catch (error) {
    console.log(error);
  }
};
