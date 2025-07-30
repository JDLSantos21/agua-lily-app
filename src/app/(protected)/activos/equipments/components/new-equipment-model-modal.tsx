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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEquipmentModelSchema,
  CreateEquipmentModelFormData,
} from "@/schemas/equipment";
import { useEffect, useState } from "react";
import { Plus, X, Settings } from "lucide-react";
import { useEquipmentModelMutation } from "@/hooks/useEquipments";

interface NewEquipmentModelModalProps {
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: CreateEquipmentModelFormData) => void;
  isLoading?: boolean;
}

export default function NewEquipmentModelModal({
  onOpenChange,
  onSubmit,
}: NewEquipmentModelModalProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateEquipmentModelFormData>({
    resolver: zodResolver(createEquipmentModelSchema),
  });

  const { mutateAsync: createEquipmentModel, isPending } =
    useEquipmentModelMutation();

  const handleFormSubmit = async (data: CreateEquipmentModelFormData) => {
    const response = await createEquipmentModel(data);

    if (response.success) {
      reset();
      setOpen(false);
      return;
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  useEffect(() => {
    if (watch("type") === "nevera") {
      setValue("description", "NVR-");
    } else if (watch("type") === "anaquel") {
      setValue("description", "ANQ-");
    } else if (watch("type") === "otro") {
      setValue("description", "EQP-");
    }
  }, [watch("type")]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Nuevo Modelo
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-lg max-h-[90vh] overflow-hidden p-0 [&>button]:hidden"
      >
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Crear nuevo modelo
              </DialogTitle>
              <p className="text-gray-600 text-sm mt-1">
                Registra un nuevo modelo de equipo
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
            {/* Type */}
            <div className="space-y-1">
              <Label
                htmlFor="type"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                Tipo de Equipo *
              </Label>
              <Select onValueChange={(value) => setValue("type", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nevera">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Nevera
                    </div>
                  </SelectItem>
                  <SelectItem value="anaquel">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Anaquel
                    </div>
                  </SelectItem>
                  <SelectItem value="otro">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      Otro
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Descripción del Modelo *
              </Label>
              <Input
                {...register("description")}
                placeholder="Ej: ANQ-50, NVR-100, EQP-200"
                className="w-full"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Brand */}
            <div className="space-y-1">
              <Label
                htmlFor="brand"
                className="text-sm font-medium text-gray-700"
              >
                Marca *
              </Label>
              <Input
                {...register("brand")}
                placeholder="Ej: Samsung, LG, Whirlpool"
                className="w-full"
              />
              {errors.brand && (
                <p className="text-red-500 text-sm">{errors.brand.message}</p>
              )}
            </div>

            {/* Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label
                  htmlFor="capacity"
                  className="text-sm font-medium text-gray-700"
                >
                  Capacidad *
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("capacity", { valueAsNumber: true })}
                  placeholder="Ej: 25, 50, 100"
                  className="w-full noControls"
                />
                {errors.capacity && (
                  <p className="text-red-500 text-sm">
                    {errors.capacity.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="capacity_unit"
                  className="text-sm font-medium text-gray-700"
                >
                  Unidad *
                </Label>
                <Input
                  {...register("capacity_unit")}
                  placeholder="Hielos, Botellones"
                  className="w-full"
                />
                {errors.capacity_unit && (
                  <p className="text-red-500 text-sm">
                    {errors.capacity_unit.message}
                  </p>
                )}
              </div>
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
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Modelo
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
