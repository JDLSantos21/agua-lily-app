"use client";

import { useEffect, useState } from "react";
import { VehiclesTable } from "./components/vehicles-table";
import { Vehicle, getVehicles } from "@/api/vehicles";
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
    <div className="container mx-auto p-4 space-y-6">
      <RoleBased allowedRoles={['admin','administrativo']}>
      <div className="flex justify-between items-center">
        <Button variant='outline' onClick={openCreateDialog}>
          <PlusIcon className="mr-2 h-4 w-4" /> Nuevo Vehículo
        </Button>
      </div>
      </RoleBased>
      
      <VehicleSearch onSearch={handleSearch} />
      
      <VehiclesTable 
        vehicles={filteredVehicles}
        isLoading={isLoading}
        onEdit={openEditDialog}
        onRefresh={refreshVehicles}
        onViewDetails={openDetailDialog}
      />

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