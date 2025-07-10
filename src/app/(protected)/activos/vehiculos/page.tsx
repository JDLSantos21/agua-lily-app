"use client";

import { useEffect, useState } from "react";
import { VehiclesTable } from "./components/vehicles-table";
import { getVehicles } from "@/api/vehicles";
import { Vehicle } from "@/types/vehicles";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { VehicleSearch } from "./components/vehicle-search";
import { VehicleDialog } from "./components/vehicle-dialog";
import { VehicleDetailDialog } from "./components/vehicle-detail-dialog";
import { RoleBased } from "@/components/RoleBased";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
        setFilteredVehicles(data);
      } catch (error) {
        console.log("Error fetching vehicles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredVehicles(vehicles);
      return;
    }

    const filtered = vehicles.filter((vehicle) =>
      vehicle.current_tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVehicles(filtered);
  };

  const refreshVehicles = async () => {
    setIsLoading(true);
    try {
      const data = await getVehicles();
      setVehicles(data);
      setFilteredVehicles(data);
    } catch (error) {
      console.log("Error refreshing vehicles:", error);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <PlusIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Vehículos</p>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <PlusIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Registrados</p>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <PlusIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Resultado Filtrado</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredVehicles.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <PlusIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Promedio Año</p>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles.length > 0
                  ? Math.round(
                      vehicles.reduce((sum, v) => sum + v.year, 0) /
                        vehicles.length
                    )
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions and Search */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 max-w-md">
            <VehicleSearch onSearch={handleSearch} />
          </div>

          <RoleBased allowedRoles={["admin", "administrativo"]}>
            <Button
              onClick={openCreateDialog}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Nuevo Vehículo
            </Button>
          </RoleBased>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <VehiclesTable
          vehicles={filteredVehicles}
          isLoading={isLoading}
          onEdit={openEditDialog}
          onRefresh={refreshVehicles}
          onViewDetails={openDetailDialog}
        />
      </div>

      {/* Diálogo de edición/creación */}
      <VehicleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicle={currentVehicle}
        onSuccess={refreshVehicles}
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
