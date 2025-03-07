import { useState, useEffect, useCallback } from "react";
import { fetchDashboardData as fetchData } from "@/api/fuel";
import { fuelAvailability, FuelRecords } from "@/types/fuel.types";

export default function useFetchDashboard() {
  const [fuel_records, setFuelRecords] = useState<FuelRecords | null>();
  const [availability, setAvailability] = useState<fuelAvailability | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchData();
      setFuelRecords(data.fuel_records);
      setAvailability(data.availability);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    fuel_records,
    availability,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}
