import { useQuery } from "@tanstack/react-query";

import { getTripById } from "@/api/trips";

import { TripRegister } from "@/types/trips.types";

export const useGetTripQuery = (id: string | number | null) => {
  return useQuery<TripRegister>({
    queryKey: ["tripRegister", id],
    queryFn: () => getTripById(id as string),
    enabled: !!id,
  });
};
