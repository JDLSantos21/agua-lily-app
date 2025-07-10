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
import { Vehicle } from "@/types/vehicles";
import { deleteVehicle } from "@/api/vehicles";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Edit,
  Eye,
  Loader,
  Trash,
  Car,
  Calendar,
  FileText,
} from "lucide-react";

interface VehiclesTableProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  onEdit: (vehicle: Vehicle) => void;
  onViewDetails: (vehicle: Vehicle) => void;
  onRefresh: () => Promise<void>;
}

export function VehiclesTable({
  vehicles,
  isLoading,
  onEdit,
  onViewDetails,
  onRefresh,
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

  const handleContextMenuItemClick = (
    e: React.MouseEvent,
    callback: () => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setTimeout(() => {
      callback();
    }, 50);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Cargando vehículos...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Car className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay vehículos registrados
          </h3>
          <p className="text-gray-500 text-center">
            Comienza agregando el primer vehículo a la flota
          </p>
        </div>
      ) : (
        <div className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-gray-100">
                  <TableHead className="text-gray-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Ficha
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Placa
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Marca
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Modelo
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Año
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-700 font-semibold">
                    Descripción
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow
                    key={vehicle.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => onViewDetails(vehicle)}
                  >
                    <TableCell className="font-medium">
                      <ContextMenu>
                        <ContextMenuTrigger>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 font-medium"
                          >
                            {vehicle.current_tag}
                          </Badge>
                        </ContextMenuTrigger>
                        <ContextMenuContent
                          onCloseAutoFocus={(e) => e.preventDefault()}
                        >
                          <ContextMenuItem
                            onClick={(e) =>
                              handleContextMenuItemClick(e, () =>
                                onEdit(vehicle)
                              )
                            }
                            className="flex gap-2 items-center"
                          >
                            <Edit className="h-4 w-4" /> Editar
                          </ContextMenuItem>
                          <ContextMenuItem
                            className="flex gap-2 items-center"
                            onClick={(e) =>
                              handleContextMenuItemClick(e, () =>
                                onViewDetails(vehicle)
                              )
                            }
                          >
                            <Eye className="h-4 w-4" /> Ver detalles
                          </ContextMenuItem>
                          <ContextMenuSeparator />
                          <ContextMenuItem
                            onClick={(e) =>
                              handleContextMenuItemClick(e, () =>
                                setVehicleToDelete(vehicle)
                              )
                            }
                            className="flex gap-2 items-center text-red-600 focus:text-red-700 focus:bg-red-50"
                          >
                            <Trash className="h-4 w-4" /> Eliminar
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    </TableCell>
                    <TableCell className="text-gray-900 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Car className="h-4 w-4 text-gray-600" />
                        </div>
                        {vehicle.license_plate}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      <span className="font-medium">{vehicle.brand}</span>
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {vehicle.model}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
                        {vehicle.year}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      <div className="max-w-xs truncate">
                        {vehicle.description || "Sin descripción"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash className="h-5 w-5 text-red-600" />
              Confirmar eliminación
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              vehículo
              {vehicleToDelete &&
                ` ${vehicleToDelete.brand} ${vehicleToDelete.model} (${vehicleToDelete.license_plate})`}
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
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4 mr-2" />
                  Eliminar
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
