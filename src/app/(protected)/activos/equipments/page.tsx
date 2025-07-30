"use client";
import { CustomTable } from "@/components/ui/custom-table";
import { Equipment } from "@/types/equipments.types";
import { MAIN_COLUMNS } from "./constants";
import { useState } from "react";
import { useEquipmentFilters } from "@/hooks/useEquipmentFilters";
import { EquipmentFilters } from "@/components/equipments/EquipmentFilters";
import EquipmentDetailsModal from "./components/details-modal";
import { LoaderSpin } from "@/components/Loader";
import TablePagination from "@/components/pagination";
import { usePagination } from "@/hooks/usePagination";

export default function EquipmentsPage() {
  const { data, isLoading, isError, updateFilters, hasActiveFilters } =
    useEquipmentFilters();

  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  // Manejar clic en fila
  const handleRowClick = (equipment: Equipment, index: number) => {
    setSelectedEquipment(equipment);
    setIsOpen(true);
  };

  const { currentData, changePage, currentPage, totalPages } = usePagination(
    data?.data,
    8
  );

  return (
    <div className="p-6 relative min-h-[calc(100vh-185px)]">
      {/* Header con acciones */}

      {/* Filtros */}
      <EquipmentFilters onFilterChange={updateFilters} isLoading={isLoading} />

      {isLoading ? (
        <LoaderSpin text="Cargando equipos..." />
      ) : !isLoading && isError ? (
        <div className="text-red-500 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
          <p className="font-medium">Error al cargar los equipos</p>
          <p className="text-sm mt-1">Por favor, intenta nuevamente</p>
        </div>
      ) : (
        <>
          <CustomTable
            data={currentData || []}
            columns={MAIN_COLUMNS}
            onRowClick={handleRowClick}
            isLoading={isLoading}
            emptyMessage={
              hasActiveFilters
                ? "No se encontraron equipos con los filtros aplicados"
                : "No hay equipos registrados"
            }
            className="rounded-lg shadow-sm mb-6"
          />
          {/* Paginación */}
          <div className="absolute bottom-0 w-full">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={changePage}
            />
          </div>
        </>
      )}

      {/* Modal de detalles */}
      <EquipmentDetailsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        equipment={selectedEquipment}
      />
    </div>
  );
}
