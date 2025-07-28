"use client";

import { useState } from "react";
import { VehiclesTable } from "./components/vehicles-table";
import { Vehicle, VehicleFilters } from "@/types/vehicles";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  Truck,
  CheckCircle,
  Filter as FilterIcon,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { VehicleDialog } from "./components/vehicle-dialog";
import { VehicleDetailDialog } from "./components/vehicle-detail-dialog";
import { RoleBased } from "@/components/RoleBased";
import { useVehicles } from "@/shared/hooks/useVehicles";
import { VehicleFiltersComponent } from "./components/vehicle-filters";
import { ErrorState } from "./components/error-state";
import { EmptyState } from "./components/empty-state";

export default function VehiclesPage() {
  const [filters, setFilters] = useState<VehicleFilters>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const {
    data: vehicles = [],
    isLoading,
    error,
    refetch,
  } = useVehicles(filters);

  const handleFiltersChange = (newFilters: VehicleFilters) => {
    setFilters(newFilters);
  };

  const openCreateDialog = () => {
    setCurrentVehicle(null);
    setDialogOpen(true);
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setDialogOpen(true);
  };

  const openDetailDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailDialogOpen(true);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  // Show error state if there's an error
  if (error) {
    return <ErrorState error={error} onRetry={handleRefresh} />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <span className="text-sm text-gray-600">Total Vehículos</span>
              <span className="text-2xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded" />
                ) : (
                  vehicles.length
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <span className="text-sm text-gray-600">Registrados</span>
              <span className="text-2xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded" />
                ) : (
                  vehicles.length
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FilterIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <span className="text-sm text-gray-600">Resultado Filtrado</span>
              <span className="text-2xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded" />
                ) : (
                  vehicles.length
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <span className="text-sm text-gray-600">Promedio Año</span>
              <span className="text-2xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-200 animate-pulse rounded" />
                ) : vehicles.length > 0 ? (
                  Math.round(
                    vehicles.reduce((sum, v) => sum + v.year, 0) /
                      vehicles.length
                  )
                ) : (
                  0
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <VehicleFiltersComponent onFiltersChange={handleFiltersChange} />

      {/* Actions */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Gestión de Vehículos
            </h2>
            <p className="text-sm text-gray-600">
              Administra la flota de vehículos de la empresa
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Actualizar
            </Button>

            <RoleBased allowedRoles={["admin", "administrativo"]}>
              <Button
                onClick={openCreateDialog}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Nuevo Vehículo
              </Button>
            </RoleBased>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        {!isLoading && vehicles.length === 0 ? (
          <EmptyState
            title="No hay vehículos registrados"
            description="Comienza agregando vehículos a la flota de la empresa para poder administrarlos desde aquí."
            showAddButton={true}
            onAddClick={openCreateDialog}
          />
        ) : (
          <VehiclesTable
            vehicles={vehicles}
            isLoading={isLoading}
            onEdit={openEditDialog}
            onRefresh={handleRefresh}
            onViewDetails={openDetailDialog}
          />
        )}
      </div>

      {/* Diálogo de edición/creación */}
      <VehicleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicle={currentVehicle}
        onSuccess={handleRefresh}
      />

      {/* Diálogo de detalles con gráfico de consumo */}
      <VehicleDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        vehicle={selectedVehicle}
      />
    </div>
  );
}
