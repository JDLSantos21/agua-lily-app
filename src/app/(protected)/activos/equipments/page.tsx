"use client";
import { CustomTable } from "@/components/ui/custom-table";
import { Equipment, EquipmentFilter } from "@/types/equipments.types";
import { MAIN_COLUMNS } from "./constants";
import { useCallback, useMemo, useState } from "react";
import { EquipmentFilters } from "@/components/equipments/EquipmentFilters";
import EquipmentDetailsModal from "./components/details-modal";
import { LoaderSpin } from "@/components/Loader";
import { useEquipments } from "@/hooks/useEquipments";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Configuración de paginación
const ITEMS_PER_PAGE = 8;

export default function EquipmentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<EquipmentFilter>({});

  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);

  // Calcular offset basado en la página actual
  const offset = useMemo(
    () => (currentPage - 1) * ITEMS_PER_PAGE,
    [currentPage],
  );

  // Filtros con paginación
  const filtersWithPagination = useMemo(
    () => ({
      ...filters,
      limit: ITEMS_PER_PAGE,
      offset: offset,
    }),
    [filters, offset],
  );

  // Consultas de datos con TanStack Query
  const {
    data: equipmentsResponse,
    isLoading,
    isError,
  } = useEquipments(filtersWithPagination);

  // Memoizar la lista de equipos para evitar re-renderizados
  const equipments = useMemo(
    () => equipmentsResponse?.data || [],
    [equipmentsResponse],
  );

  const pagination = useMemo(
    () => equipmentsResponse?.pagination,
    [equipmentsResponse],
  );

  // Calcular información de paginación
  const totalPages = useMemo(
    () => Math.ceil((pagination?.total || 0) / ITEMS_PER_PAGE),
    [pagination?.total],
  );

  // Manejador de cambio de filtros generales
  const handleFiltersChange = useCallback((newFilters: EquipmentFilter) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // Funciones de paginación
  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    const paginationData = equipmentsResponse?.pagination;
    const total = paginationData?.total || 0;
    const maxPages = Math.ceil(total / ITEMS_PER_PAGE);
    if (currentPage < maxPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, equipmentsResponse?.pagination]);

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Generar números de página para mostrar
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (start > 1) {
        pages.unshift(1);
        if (start > 2) {
          pages.splice(1, 0, -1);
        }
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push(-1);
        }
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  // Manejar clic en fila
  const handleRowClick = useCallback((equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setSelectedEquipment(null);
    }, 300);
  }, []);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).some(
      (key) =>
        filters[key as keyof EquipmentFilter] !== undefined &&
        filters[key as keyof EquipmentFilter] !== "",
    );
  }, [filters]);

  return (
    <div className="flex flex-col h-[calc(100vh-186px)]">
      {/* Filtros */}
      <div className="flex-shrink-0">
        <EquipmentFilters
          onFilterChange={handleFiltersChange}
          isLoading={isLoading}
        />
      </div>

      {/* Contenedor con scroll para la tabla */}
      <div className="flex-1 min-h-0 overflow-auto">
        {isLoading ? (
          <LoaderSpin text="Cargando equipos..." />
        ) : !isLoading && isError ? (
          <div className="text-red-500 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
            <p className="font-medium">Error al cargar los equipos</p>
            <p className="text-sm mt-1">Por favor, intenta nuevamente</p>
          </div>
        ) : (
          <CustomTable
            data={equipments}
            columns={MAIN_COLUMNS}
            onRowClick={handleRowClick}
            isLoading={isLoading}
            emptyMessage={
              hasActiveFilters
                ? "No se encontraron equipos con los filtros aplicados"
                : "No hay equipos registrados"
            }
            className="rounded-lg shadow-sm"
          />
        )}
      </div>

      {/* Paginación fija en la parte inferior */}
      {pagination && totalPages > 1 && (
        <div className="flex-shrink-0 flex justify-center pt-3 border-t bg-white">
          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 shadow-sm p-1">
            {/* Botón Anterior */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!canGoPrevious}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Números de página */}
            <div className="flex gap-1 mx-2">
              {pageNumbers.map((pageNum, index) =>
                pageNum === -1 ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-1 text-gray-500"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={pageNum}
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageClick(pageNum)}
                    className={`px-3 ${
                      currentPage === pageNum
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </Button>
                ),
              )}
            </div>

            {/* Botón Siguiente */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPage}
              disabled={!canGoNext}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {isOpen && (
        <EquipmentDetailsModal
          equipment_id={selectedEquipment?.id || null}
          isOpen={isOpen}
          onClose={() => handleClose()}
          equipment={selectedEquipment}
        />
      )}
    </div>
  );
}
