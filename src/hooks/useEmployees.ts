import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { getAllEmployees } from "@/api/employees";

export const useEmployeesQuery = (
  role?: string,
  options?: Partial<UseQueryOptions<Employee[], Error, any, readonly unknown[]>>
) => {
  return useQuery<Employee[]>({
    queryKey: ["employees", role],
    queryFn: () => getAllEmployees(role),
    staleTime: 1000 * 60 * 60, // 1 Hora
    ...(options ?? {}),
  });
};
