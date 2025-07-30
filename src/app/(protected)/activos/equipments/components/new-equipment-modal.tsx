"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useEquipmentModels,
  useEquipmentMutation,
} from "@/hooks/useEquipments";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEquipmentSchema,
  CreateEquipmentFormData,
} from "@/schemas/equipment";
import { EquipmentModel } from "@/types/equipments.types";
import { useState, useEffect } from "react";
import { Plus, X, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InputSelect } from "@/shared/components/ui/input-select";
import { useCustomers } from "@/hooks/useCustomers";

interface NewEquipmentModalProps {
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: CreateEquipmentFormData) => void;
  isLoading?: boolean;
}

export default function NewEquipmentModal({
  onOpenChange,
  onSubmit,
  isLoading = false,
}: NewEquipmentModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<EquipmentModel | null>(
    null
  );
  const { mutateAsync: createEquipment, isPending } = useEquipmentMutation();
  const { data: customers } = useCustomers();

  const {
    data: modelsData,
    isError,
    isPending: modelsLoading,
  } = useEquipmentModels();
  const models = modelsData?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateEquipmentFormData>({
    resolver: zodResolver(createEquipmentSchema),
    defaultValues: {
      current_customer_id: null,
      status: "disponible",
    },
  });

  const watchedModelId = watch("model_id");

  // Actualizar modelo seleccionado cuando cambie el model_id
  useEffect(() => {
    if (watchedModelId && models.length > 0) {
      const model = models.find((m) => m.id === Number(watchedModelId));
      setSelectedModel(model || null);
    } else {
      setSelectedModel(null);
    }
  }, [watchedModelId, models]);

  // actualizar estado al seleccionar un cliente
  const watchedCustomerId = watch("current_customer_id");

  useEffect(() => {
    if (watchedCustomerId) {
      setValue("status", "asignado");
    } else {
      setValue("status", "disponible");
    }
  }, [watchedCustomerId]);

  const handleFormSubmit = async (data: CreateEquipmentFormData) => {
    onSubmit?.(data);
    const response = await createEquipment(data);
    console.log("Equipo creado:", response);
    reset();
    setSelectedModel(null);
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
    if (!newOpen) {
      reset();
      setSelectedModel(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Equipo
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-2xl max-h-[90vh] overflow-hidden p-0 [&>button]:hidden"
      >
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Crear nuevo equipo
              </DialogTitle>
              <p className="text-gray-600 text-sm mt-1">
                Registra un nuevo equipo en el sistema
              </p>
            </div>
            <button
              onClick={() => handleOpenChange(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Modelo Selection */}
            <div className="space-y-3">
              <Label
                htmlFor="model_id"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                Modelo de Equipo
              </Label>

              {modelsLoading ? (
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">
                    Cargando modelos...
                  </span>
                </div>
              ) : isError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">
                    Error al cargar los modelos de equipos
                  </p>
                </div>
              ) : (
                <Select
                  onValueChange={(value) => setValue("model_id", Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar modelo de equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id.toString()}>
                        <div className="flex items-center justify-between w-full">
                          <span>{model.description}</span>
                          <Badge variant="secondary" className="ml-2">
                            {model.brand}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {errors.model_id && (
                <p className="text-red-500 text-sm">
                  {errors.model_id.message}
                </p>
              )}
            </div>
            {/* Selected Model Info */}
            {selectedModel && (
              <div className="bg-gray-50 border border-gray-200 shadow-md rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Info className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Información del Modelo
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Descripción:</span>
                        <p className="font-medium">
                          {selectedModel.description}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Marca:</span>
                        <p className="font-medium">{selectedModel.brand}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tipo:</span>
                        <p className="font-medium">
                          {selectedModel.type.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Capacidad:</span>
                        <p className="font-medium">
                          {selectedModel.capacity} {selectedModel.capacity_unit}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Status */}
            <div className="space-y-3">
              <Label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Estado del Equipo
              </Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponible" disabled={!!watchedCustomerId}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Disponible
                    </div>
                  </SelectItem>
                  <SelectItem value="asignado" disabled={!watchedCustomerId}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Asignado
                    </div>
                  </SelectItem>
                  <SelectItem value="mantenimiento">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Mantenimiento
                    </div>
                  </SelectItem>
                  <SelectItem value="inhabilitado">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      Inhabilitado
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>

            {/* Contract Details */}
            <div className="space-y-3">
              <Label
                htmlFor="current_customer_id"
                className="text-sm font-medium text-gray-700"
              >
                Asignar a Cliente (Opcional)
              </Label>
              <InputSelect
                data={customers?.data || []}
                selectedValue={watch("current_customer_id")}
                onSelect={(item) => setValue("current_customer_id", item?.id)}
                placeholder="Selecciona un cliente..."
                searchPlaceholder="Buscar cliente..."
                emptyMessage="No se encontró cliente."
                displayProperty={"name"}
                valueProperty={"id"}
                allowClear
                clearText="Quitar selección"
              />
              {errors.current_customer_id && (
                <p className="text-red-500 text-sm">
                  {errors.current_customer_id.message}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <Label
                htmlFor="notes"
                className="text-sm font-medium text-gray-700"
              >
                Notas Adicionales (Opcional)
              </Label>
              <Textarea
                {...register("notes")}
                placeholder="Agrega cualquier información adicional..."
                rows={3}
                className="w-full"
              />
              {errors.notes && (
                <p className="text-red-500 text-sm">{errors.notes.message}</p>
              )}
            </div>
            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending || !watchedModelId}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Equipo
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
