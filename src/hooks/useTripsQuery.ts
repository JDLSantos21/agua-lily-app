import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTrips } from "@/api/trips";
import { useState } from "react";

// Exportamos el tipo para que sea accesible desde el componente TripsFilter
export interface TripsQueryParams {
  vehicle_id?: string | number;
  start_date?: string;
  end_date?: string;
}

/**
 * Hook principal para la funcionalidad de filtrado de viajes
 * Combina estado local con la gestión de consultas de React Query
 */
export const useTripsQuery = () => {
  const queryClient = useQueryClient();
  const [filterParams, setFilterParams] = useState<TripsQueryParams>({});
  // Nuevo estado para controlar si se ha iniciado una búsqueda
  const [hasSearched, setHasSearched] = useState(false);

  // Consulta de viajes con los filtros seleccionados
  const {
    data: trips,
    isLoading,
    isError,
    error,
    isPending: queryIsPending,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["trips", filterParams],
    queryFn: () => getTrips(filterParams),
    enabled: false, // No ejecutar automáticamente, esperar a que el usuario haga clic en "Buscar"
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Calcular isPending basado en si se ha iniciado una búsqueda y el estado actual de la consulta
  const isPending = hasSearched && queryIsPending;

  /**
   * Función para filtrar viajes con los parámetros proporcionados
   */
  const filterTrips = async (params: TripsQueryParams) => {
    // Marcar que se ha iniciado una búsqueda
    setHasSearched(true);

    // Actualizar los parámetros de filtro en el estado local
    setFilterParams(params);

    // Invalidar la consulta anterior para forzar una nueva ejecución
    await queryClient.invalidateQueries({ queryKey: ["trips"] });

    // Ejecutar la consulta con los nuevos parámetros
    return refetch();
  };

  return {
    trips,
    isLoading,
    isError,
    error,
    isPending,
    isSuccess,
    filterParams,
    refetch,
    filterTrips,
  };
};
