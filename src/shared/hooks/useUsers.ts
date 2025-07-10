import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getUsers } from "@/api/users";
import { User } from "@/shared/types/users.types";

export function useUsers(): UseQueryResult<User[]> {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    staleTime: 1000 * 60 * 120,
  });
}
