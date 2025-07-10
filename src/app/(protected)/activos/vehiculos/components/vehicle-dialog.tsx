"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Car, Plus, Edit, Loader } from "lucide-react";

import {
  VehicleFormData,
  VehicleDialogProps,
  defaultFormData,
} from "@/types/vehicles";

export function VehicleDialog({
  open,
  onOpenChange,
  vehicle,
  onSuccess,
}: VehicleDialogProps) {
  const [formData, setFormData] = useState<VehicleFormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!vehicle;

  useEffect(() => {
    if (vehicle) {
      setFormData({
        license_plate: vehicle.license_plate,
        chasis: vehicle.chasis,
        current_tag: vehicle.current_tag,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        description: vehicle.description,
      });
    } else {
      setFormData(defaultFormData);
    }
    setErrors({});
  }, [vehicle, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? parseInt(value, 10) || "" : value,
    }));

    // Clear error for this field when changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.license_plate.trim()) {
      newErrors.license_plate = "La placa es requerida";
    }

    if (!formData.chasis.trim()) {
      newErrors.chasis = "El chasis es requerido";
    }

    if (!formData.current_tag.trim()) {
      newErrors.current_tag = "El tag es requerido";
    }

    if (!formData.brand.trim()) {
      newErrors.brand = "La marca es requerida";
    }

    if (!formData.model.trim()) {
      newErrors.model = "El modelo es requerido";
    }

    if (!formData.year || formData.year < 1900 || formData.year > 2100) {
      newErrors.year = "El año debe ser un número válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    // try {
    //   if (isEditing && vehicle) {
    //     await updateVehicle(vehicle.id, formData);
    //   } else {
    //     await createVehicle(formData);
    //   }
    //   await onSuccess();
    //   onOpenChange(false);
    // } catch (error) {
    //   console.log("Error al guardar vehículo:", error);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  const handleClose = () => {
    // Ensure we're not in the middle of submission
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[600px]"
        onInteractOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit className="h-5 w-5 text-blue-600" />
                Editar Vehículo
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-green-600" />
                Nuevo Vehículo
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información del vehículo seleccionado."
              : "Completa la información para registrar un nuevo vehículo en la flota."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Información básica */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Car className="h-4 w-4 text-gray-600" />
              <h3 className="text-sm font-medium text-gray-900">
                Información Básica
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="license_plate"
                  className="text-sm font-medium text-gray-700"
                >
                  Placa del Vehículo
                </Label>
                <Input
                  id="license_plate"
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={handleChange}
                  placeholder="Ej: ABC-123"
                  className={`h-10 ${errors.license_plate ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                />
                {errors.license_plate && (
                  <p className="text-xs text-red-600">{errors.license_plate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="current_tag"
                  className="text-sm font-medium text-gray-700"
                >
                  Tag de Identificación
                </Label>
                <Input
                  id="current_tag"
                  name="current_tag"
                  value={formData.current_tag}
                  onChange={handleChange}
                  placeholder="Ej: F-01"
                  className={`h-10 ${errors.current_tag ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                />
                {errors.current_tag && (
                  <p className="text-xs text-red-600">{errors.current_tag}</p>
                )}
              </div>
            </div>
          </div>

          {/* Especificaciones */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Car className="h-4 w-4 text-gray-600" />
              <h3 className="text-sm font-medium text-gray-900">
                Especificaciones
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="brand"
                  className="text-sm font-medium text-gray-700"
                >
                  Marca
                </Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Ej: Toyota"
                  className={`h-10 ${errors.brand ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                />
                {errors.brand && (
                  <p className="text-xs text-red-600">{errors.brand}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="model"
                  className="text-sm font-medium text-gray-700"
                >
                  Modelo
                </Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Ej: Corolla"
                  className={`h-10 ${errors.model ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                />
                {errors.model && (
                  <p className="text-xs text-red-600">{errors.model}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="year"
                  className="text-sm font-medium text-gray-700"
                >
                  Año de Fabricación
                </Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Ej: 2020"
                  className={`h-10 ${errors.year ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                  min="1900"
                  max="2100"
                />
                {errors.year && (
                  <p className="text-xs text-red-600">{errors.year}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="chasis"
                  className="text-sm font-medium text-gray-700"
                >
                  Número de Chasis
                </Label>
                <Input
                  id="chasis"
                  name="chasis"
                  value={formData.chasis}
                  onChange={handleChange}
                  placeholder="Ej: 1HGBH41JXMN109186"
                  className={`h-10 ${errors.chasis ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                />
                {errors.chasis && (
                  <p className="text-xs text-red-600">{errors.chasis}</p>
                )}
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Descripción (Opcional)
            </Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Información adicional sobre el vehículo..."
              className={`h-10 ${errors.description ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
            />
            {errors.description && (
              <p className="text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="h-10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  {isEditing ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Actualizar
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Vehículo
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
