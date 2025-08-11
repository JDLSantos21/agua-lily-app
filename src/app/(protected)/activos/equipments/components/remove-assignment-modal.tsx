import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectValue,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle, Package, User } from "lucide-react";

import {
  equipmentRemovalSchema,
  EquipmentRemovalFormData,
} from "@/schemas/equipment";
import { Equipment } from "@/types/equipments.types";
import { useRemoveEquipment, useEquipments } from "@/hooks/useEquipments";

interface RemoveCustomerModalProps {
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  equipment?: Equipment | null; // Opcional: equipo pre-seleccionado
  onSuccess?: () => void;
}

export default function RemoveAssignmentModal({
  onOpenChange,
  open = false,
  equipment: preSelectedEquipment,
  onSuccess,
}: RemoveCustomerModalProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<EquipmentRemovalFormData>({
    resolver: zodResolver(equipmentRemovalSchema),
    mode: "onChange",
    defaultValues: {
      removal_reason: "",
    },
  });

  // Obtener lista de equipos solo si no hay equipo pre-seleccionado
  const { data: equipments, isLoading: isEquipmentsLoading } = useEquipments();
  const removeMutation = useRemoveEquipment();

  // Filtrar solo equipos que tienen cliente asignado
  const assignedEquipments =
    equipments?.data?.filter(
      (eq) => eq.current_customer_id && eq.customer_name
    ) || [];

  // Efecto para manejar el equipo pre-seleccionado
  useEffect(() => {
    if (preSelectedEquipment) {
      setSelectedEquipment(preSelectedEquipment);
    } else {
      setSelectedEquipment(null);
    }
  }, [preSelectedEquipment]);

  const handleClose = () => {
    reset();
    setSelectedEquipment(null);
    onOpenChange?.(false);
  };

  const onSubmit = async (data: EquipmentRemovalFormData) => {
    const equipmentToRemove = preSelectedEquipment || selectedEquipment;

    if (!equipmentToRemove?.id) {
      return;
    }

    try {
      await removeMutation.mutateAsync({
        equipmentId: equipmentToRemove.id,
        data: {
          removal_reason: data.removal_reason,
        },
      });

      handleClose();
      onSuccess?.();
    } catch (error) {
      // El error ya se maneja en el hook useRemoveEquipment
      console.error("Error removing equipment:", error);
    }
  };

  const currentEquipment = preSelectedEquipment || selectedEquipment;
  const showEquipmentSelector = !preSelectedEquipment;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-red-700">
          <AlertTriangle className="h-5 w-5" />
          Remover Asignación de Cliente
        </DialogTitle>
        <DialogDescription className="text-gray-600">
          {showEquipmentSelector
            ? "Seleccione un equipo asignado y proporcione la razón para remover la asignación."
            : "Esta acción removerá la asignación actual del equipo y lo marcará como disponible."}
        </DialogDescription>

        {isEquipmentsLoading && showEquipmentSelector ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Cargando equipos...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Selector de Equipo (solo si no hay equipo pre-seleccionado) */}
            {showEquipmentSelector && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Equipo Asignado *
                </Label>
                <Select
                  value={selectedEquipment?.id?.toString() || ""}
                  onValueChange={(value) => {
                    const equipment = assignedEquipments.find(
                      (eq) => eq.id.toString() === value
                    );
                    setSelectedEquipment(equipment || null);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un equipo con cliente asignado" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignedEquipments.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        No hay equipos con clientes asignados
                      </div>
                    ) : (
                      assignedEquipments.map((equipment) => (
                        <SelectItem
                          key={equipment.id}
                          value={equipment.id.toString()}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {equipment.model} - {equipment.serial_number}
                            </span>
                            <span className="text-xs text-gray-500">
                              Cliente: {equipment.customer_name}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {showEquipmentSelector && !selectedEquipment && (
                  <p className="text-sm text-red-600">
                    Debe seleccionar un equipo
                  </p>
                )}
              </div>
            )}

            {/* Información del equipo seleccionado */}
            {currentEquipment && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-amber-800 mb-2">
                      Información de la Asignación Actual
                    </h4>
                    <div className="space-y-2 text-sm text-amber-700">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>
                          <strong>Equipo:</strong> {currentEquipment.model} -{" "}
                          {currentEquipment.serial_number}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>
                          <strong>Cliente:</strong>{" "}
                          {currentEquipment.customer_name || "Cliente asignado"}
                        </span>
                      </div>
                      <div>
                        <strong>Estado actual:</strong>{" "}
                        {currentEquipment.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Razón de Remoción */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Razón de la Remoción *
              </Label>
              <Controller
                name="removal_reason"
                control={control}
                render={({ field }) => (
                  <Textarea
                    placeholder="Describa el motivo por el cual se está removiendo la asignación del equipo..."
                    className={`min-h-[100px] resize-none ${
                      errors.removal_reason ? "border-red-500" : ""
                    }`}
                    {...field}
                  />
                )}
              />
              {errors.removal_reason && (
                <p className="text-sm text-red-600">
                  {errors.removal_reason.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Esta información quedará registrada en el historial del equipo.
              </p>
            </div>

            {/* Información adicional */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
              <h5 className="font-medium mb-2">Después de esta acción:</h5>
              <ul className="space-y-1 text-xs">
                <li>• El equipo quedará disponible para nueva asignación</li>
                <li>• Se guardará un registro del motivo de remoción</li>
                <li>• El estado del equipo se actualizará según corresponda</li>
              </ul>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={removeMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className="flex-1"
                disabled={
                  !isValid ||
                  removeMutation.isPending ||
                  (showEquipmentSelector && !selectedEquipment) ||
                  (!showEquipmentSelector && !preSelectedEquipment)
                }
              >
                {removeMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Removiendo...
                  </>
                ) : (
                  "Confirmar Remoción"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
