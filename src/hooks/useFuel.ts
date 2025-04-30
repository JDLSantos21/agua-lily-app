import { fetchFuelAvailability } from "@/api/fuel";
import { useState, useEffect } from "react";

interface FuelAvailability {
  available: string;
  used: string;
  id: number;
  updated_at: string;
}

export function useFuel() {
  const [availability, setAvailability] = useState<FuelAvailability | null>(
    null
  );

  useEffect(() => {
    fetchFuelAvailability()
      .then((res) => {
        if (res) {
          setAvailability(res[0]);
        } else {
          setAvailability(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching fuel availability:", err);
        setAvailability(null);
      });
  }, []);

  return { availability };
}
