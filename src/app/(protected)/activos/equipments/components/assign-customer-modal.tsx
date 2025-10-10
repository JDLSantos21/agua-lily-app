import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Users, Package, FileText, Calendar } from "lucide-react";

import { useCustomers } from "@/hooks/useCustomers";
import { useAssignEquipment, useEquipments } from "@/hooks/useEquipments";
import {
  equipmentAssignmentSchema,
  EquipmentAssignmentFormData,
} from "@/schemas/equipment";
import { InputSelect } from "@/shared/components/ui/input-select";

interface AssignCustomerModalProps {
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  equipmentId?: string | number;
  onSuccess?: () => void;
}

export default function AssignCustomerModal({
  onOpenChange,
  open = false,
  equipmentId,
  onSuccess,
}: AssignCustomerModalProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<EquipmentAssignmentFormData>({
    resolver: zodResolver(equipmentAssignmentSchema),
    mode: "onChange",
    defaultValues: {
      equipment_id: equipmentId ? Number(equipmentId) : undefined,
      customer_id: undefined,
      notes: "",
      weekly_commitment: undefined,
    },
  });

  const { data: customers, isLoading: isCustomersLoading } = useCustomers();
  const { data: equipments, isLoading: isEquipmentsLoading } = useEquipments();
  const assignMutation = useAssignEquipment();

  const watchedEquipmentId = watch("equipment_id");

  // Encontrar el equipo seleccionado para mostrar información adicional
  useEffect(() => {
    if (watchedEquipmentId && equipments?.data) {
      const equipment = equipments.data.find(
        (eq) => eq.id === Number(watchedEquipmentId)
      );
      setSelectedEquipment(equipment);
    } else {
      setSelectedEquipment(null);
    }
  }, [watchedEquipmentId, equipments]);

  // Pre-seleccionar equipo si se pasa como prop
  useEffect(() => {
    if (equipmentId && equipments?.data) {
      const equipment = equipments.data.find(
        (eq) => eq.id === Number(equipmentId)
      );
      if (equipment) {
        setValue("equipment_id", Number(equipmentId));
        setSelectedEquipment(equipment);
      }
    }
  }, [equipmentId, equipments, setValue]);

  // Filtrar solo equipos disponibles (sin cliente asignado)
  const availableEquipments =
    equipments?.data?.filter(
      (equipment) =>
        !equipment.current_customer_id || equipment.id === Number(equipmentId)
    ) || [];

  const handleClose = () => {
    reset();
    setSelectedEquipment(null);
    onOpenChange?.(false);
  };

  const onSubmit = async (data: EquipmentAssignmentFormData) => {
    console.log("Submitting assignment:", data);
    try {
      await assignMutation.mutateAsync({
        equipment_id: data.equipment_id,
        customer_id: data.customer_id,
        notes: data.notes || undefined,
        weekly_commitment: data.weekly_commitment || undefined,
      });

      handleClose();
      onSuccess?.();
    } catch (error) {
      // El error ya se maneja en el hook useAssignEquipment
      console.error("Error assigning equipment:", error);
    }
  };

  const isLoading = isCustomersLoading || isEquipmentsLoading;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
          <Users className="h-5 w-5 text-blue-600" />
          Asignar Cliente a Equipo
        </DialogTitle>
        <DialogDescription className="text-gray-600">
          Seleccione un equipo disponible y un cliente para crear la asignación.
        </DialogDescription>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Cargando datos...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Selector de Equipo */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Equipo *
              </Label>
              <Controller
                name="equipment_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(Number(value))}
                    disabled={!!equipmentId} // Deshabilitar si viene pre-seleccionado
                  >
                    <SelectTrigger
                      className={`w-full ${errors.equipment_id ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Seleccione un equipo disponible" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEquipments.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No hay equipos disponibles
                        </div>
                      ) : (
                        availableEquipments.map((equipment) => (
                          <SelectItem
                            key={equipment.id}
                            value={equipment.id.toString()}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {equipment.model} - {equipment.serial_number}
                              </span>
                              <span className="text-xs text-gray-500">
                                {equipment.brand} • Estado: {equipment.status}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.equipment_id && (
                <p className="text-sm text-red-600">
                  {errors.equipment_id.message}
                </p>
              )}

              {/* Información del equipo seleccionado */}
              {selectedEquipment && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                  <div className="font-medium text-blue-800 mb-1">
                    Información del Equipo
                  </div>
                  <div className="text-blue-700 space-y-1">
                    <p>
                      <strong>Tipo:</strong> {selectedEquipment.type}
                    </p>
                    <p>
                      <strong>Capacidad:</strong> {selectedEquipment.capacity}{" "}
                      {selectedEquipment.capacity_unit}
                    </p>
                    <p>
                      <strong>Estado:</strong> {selectedEquipment.status}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Selector de Cliente */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Cliente *
              </Label>
              <Controller
                name="customer_id"
                control={control}
                render={({ field }) => (
                  <InputSelect
                    data={customers?.data || []}
                    selectedValue={field.value}
                    onSelect={(item) => field.onChange(item?.id)}
                    placeholder="Selecciona un cliente"
                    searchPlaceholder="Buscar cliente..."
                    emptyMessage="No se encontró cliente."
                    displayProperty={(item) =>
                      item.business_name || item.name || "Sin nombre"
                    }
                    valueProperty={"id"}
                    allowClear
                    clearText="Quitar selección"
                  />
                )}
              />

              {errors.customer_id && (
                <p className="text-sm text-red-600">
                  {errors.customer_id.message}
                </p>
              )}
            </div>

            {/* Compromiso Semanal */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Compromiso Semanal (días)
              </Label>
              <Controller
                name="weekly_commitment"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    min="0"
                    max="7"
                    placeholder="Ej: 3 (días por semana)"
                    className={
                      errors.weekly_commitment
                        ? "border-red-500 noControls"
                        : "noControls"
                    }
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value
                        ? Number(e.target.value)
                        : undefined;
                      field.onChange(value);
                    }}
                    value={field.value || ""}
                  />
                )}
              />
              {errors.weekly_commitment && (
                <p className="text-sm text-red-600">
                  {errors.weekly_commitment.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Opcional: Número de días por semana que se utilizará el equipo
              </p>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notas Adicionales
              </Label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <Textarea
                    placeholder="Detalles adicionales sobre la asignación..."
                    className="min-h-[80px] resize-none"
                    {...field}
                  />
                )}
              />
              <p className="text-xs text-gray-500">
                Opcional: Detalles sobre condiciones especiales, ubicación, etc.
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={assignMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={
                  !isValid ||
                  assignMutation.isPending ||
                  availableEquipments.length === 0
                }
              >
                {assignMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Asignando...
                  </>
                ) : (
                  "Asignar Cliente"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
