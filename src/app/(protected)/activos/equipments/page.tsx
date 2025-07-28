"use client";
import { CustomTable } from "@/components/ui/custom-table";
import { Equipment } from "@/types/equipments.types";
import { MAIN_COLUMNS } from "./constants";
import { useState } from "react";
import { useEquipmentFilters } from "@/hooks/useEquipmentFilters";
import { EquipmentFilters } from "@/components/equipments/EquipmentFilters";
import EquipmentDetailsModal from "./components/details-modal";
import NewEquipmentModal from "./components/new-equipment-modal";
import NewEquipmentModelModal from "./components/new-equipment-model-modal";
import { LoaderSpin } from "@/components/Loader";
import {
  CreateEquipmentFormData,
  CreateEquipmentModelFormData,
} from "@/schemas/equipment";

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

  // Handlers para crear equipo
  const handleCreateEquipment = (data: CreateEquipmentFormData) => {
    console.log("Crear equipo:", data);
    // Aquí implementarías la lógica para crear el equipo
    // usando una mutación de TanStack Query
  };

  // Handler para crear modelo de equipo
  const handleCreateEquipmentModel = (data: CreateEquipmentModelFormData) => {
    console.log("Crear modelo:", data);
    // Aquí implementarías la lógica para crear el modelo
    // usando una mutación de TanStack Query
  };

  return (
    <div className="p-6 relative">
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
        <CustomTable
          data={data?.data || []}
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

      {/* Modal de detalles */}
      <EquipmentDetailsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        equipment={selectedEquipment}
      />
    </div>
  );
}
