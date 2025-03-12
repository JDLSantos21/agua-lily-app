"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Vehicle, deleteVehicle } from "@/api/vehicles";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Edit, Eye, RefreshCw, Trash } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface VehiclesTableProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  onEdit: (vehicle: Vehicle) => void;
  onViewDetails: (vehicle: Vehicle) => void; // Nueva prop para ver detalles
  onRefresh: () => Promise<void>;
}

export function VehiclesTable({ 
  vehicles, 
  isLoading, 
  onEdit, 
  onViewDetails, // Añadida nueva prop
  onRefresh 
}: VehiclesTableProps) {
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!vehicleToDelete) return;
    
    setDeleting(true);
    try {
      await deleteVehicle(vehicleToDelete.id);
      await onRefresh();
    } catch (error) {
      console.log("Error deleting vehicle:", error);
    } finally {
      setDeleting(false);
      setVehicleToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: es });
    } catch (error) {
      console.log(error)
      return "Fecha inválida";
    }
  };

  const handleContextMenuItemClick = (e: React.MouseEvent, callback: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    setTimeout(() => {
      callback();
    }, 50);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No se encontraron vehículos.
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TAG</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Última actualización</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow 
                  key={vehicle.id} 
                  className="cursor-pointer hover:bg-neutral-100/50"
                  onClick={() => onViewDetails(vehicle)} // Cambiado para abrir el diálogo de detalles
                >
                  <TableCell>
                    <ContextMenu>
                      <ContextMenuTrigger>
                        <Badge variant="outline">{vehicle.current_tag}</Badge>
                      </ContextMenuTrigger>
                      <ContextMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
                        <ContextMenuItem 
                          onClick={(e) => handleContextMenuItemClick(e, () => onEdit(vehicle))} 
                          className="flex gap-2 items-center"
                        >
                          <Edit className="h-4 w-4" /> Editar
                        </ContextMenuItem>
                        <ContextMenuItem 
                          className="flex gap-2 items-center"
                          onClick={(e) => handleContextMenuItemClick(e, () => onViewDetails(vehicle))}
                        >
                          <Eye className="h-4 w-4" /> Ver detalles
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem 
                          onClick={(e) => handleContextMenuItemClick(e, () => setVehicleToDelete(vehicle))} 
                          className="flex gap-2 items-center text-destructive focus:text-destructive"
                        >
                          <Trash className="h-4 w-4" /> Eliminar
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </TableCell>
                  <TableCell>{vehicle.license_plate}</TableCell>
                  <TableCell>{vehicle.brand}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{vehicle.description}</TableCell>
                  <TableCell>{formatDate(vehicle.updated_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog 
        open={!!vehicleToDelete} 
        onOpenChange={(open) => {
          if (!open) setVehicleToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el vehículo 
              {vehicleToDelete && ` ${vehicleToDelete.brand} ${vehicleToDelete.model} (${vehicleToDelete.license_plate})`}
              del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }} 
              className="bg-red-500 hover:bg-red-600"
              disabled={deleting}
            >
              {deleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}