import { useState, useCallback, useMemo } from "react";
import { useEquipments } from "./useEquipments";
import {
  EquipmentFilter,
  EquipmentFilterFormData,
} from "@/types/equipments.types";

export function useEquipmentFilters() {
  const [filters, setFilters] = useState<EquipmentFilterFormData>({
    type: "",
    status: "",
    search: "",
  });

  // Convertir filtros del formulario a filtros de API
  const apiFilters = useMemo<EquipmentFilter | undefined>(() => {
    const result: EquipmentFilter = {};

    if (filters.type) result.type = filters.type;
    if (filters.status) result.status = filters.status;
    if (filters.search) result.search = filters.search;

    return Object.keys(result).length > 0 ? result : undefined;
  }, [filters]);

  // Hook de datos con filtros
  const equipmentsQuery = useEquipments(apiFilters);

  // Función para actualizar filtros
  const updateFilters = useCallback((newFilters: EquipmentFilterFormData) => {
    setFilters(newFilters);
  }, []);

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({
      type: "",
      status: "",
      search: "",
    });
  }, []);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return !!(filters.type || filters.status || filters.search);
  }, [filters]);

  // Estadísticas de filtros
  const filterStats = useMemo(() => {
    return {
      total: equipmentsQuery.data?.data?.length || 0,
      hasFilters: hasActiveFilters,
      isLoading: equipmentsQuery.isLoading,
      error: equipmentsQuery.error,
    };
  }, [
    equipmentsQuery.data,
    hasActiveFilters,
    equipmentsQuery.isLoading,
    equipmentsQuery.error,
  ]);

  return {
    // Data
    data: equipmentsQuery.data,
    isLoading: equipmentsQuery.isLoading,
    isError: equipmentsQuery.isError,
    error: equipmentsQuery.error,

    // Filters
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,

    // Stats
    filterStats,

    // Refetch
    refetch: equipmentsQuery.refetch,
  };
}
