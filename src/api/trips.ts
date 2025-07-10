import { CompletedTrip } from "@/app/(protected)/viajes/types/trips";
import { api } from "@/services/api";

export const getDefaultsData = async () => {
  const res = await api.get("/trips/defaults");
  return res.data;
};

export const registerTrip = async (data: any) => {
  const res = await api.post("/trips", data);
  return res.data;
};

export const completeTrip = async (data: any) => {
  const res = await api.patch(`/trips/${data.trip_id}/complete`, data);
  return res.data;
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

  const res = await api.get("/trips", { params });
  return res.data;
};

export const getTripById = async (trip_id: string): Promise<CompletedTrip> => {
  const res = await api.get(`/trips/${trip_id}`);
  return res.data as CompletedTrip;
};

export const getPendingTripById = async (trip_id: string) => {
  const res = await api.get(`/trips/pending/${trip_id}`);
  return res.data;
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

  const res = await api.get("/trips/report", { params });
  return res.data;
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

  const res = await api.get("/trips/history", { params });
  return res.data;
};

export const updateTripDate = async (
  trip_id: string | number,
  date: string
) => {
  const res = await api.patch(`/trips/${trip_id}`, { date });
  return res.data;
};
