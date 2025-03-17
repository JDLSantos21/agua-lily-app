"use client";

import { Vehicle } from "@/api/vehicles";
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

interface VehicleFormData {
  license_plate: string;
  chasis: string;
  current_tag: string;
  brand: string;
  model: string;
  year: number;
  description: string;
}

const defaultFormData: VehicleFormData = {
  license_plate: "",
  chasis: "",
  current_tag: "",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  description: "",
};

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  onSuccess: () => Promise<void>;
}

// onSuccess,

export function VehicleDialog({
  open,
  onOpenChange,
  vehicle,
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
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => {
          // Prevent interaction outside the dialog when submitting
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing with Escape key when submitting
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar vehículo" : "Nuevo vehículo"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza la información del vehículo."
              : "Completa la información para registrar un nuevo vehículo."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="license_plate">Placa</Label>
              <Input
                id="license_plate"
                name="license_plate"
                value={formData.license_plate}
                onChange={handleChange}
                className={errors.license_plate ? "border-red-500" : ""}
              />
              {errors.license_plate && (
                <p className="text-xs text-red-500">{errors.license_plate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_tag">Tag</Label>
              <Input
                id="current_tag"
                name="current_tag"
                value={formData.current_tag}
                onChange={handleChange}
                className={errors.current_tag ? "border-red-500" : ""}
              />
              {errors.current_tag && (
                <p className="text-xs text-red-500">{errors.current_tag}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={errors.brand ? "border-red-500" : ""}
              />
              {errors.brand && (
                <p className="text-xs text-red-500">{errors.brand}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={errors.model ? "border-red-500" : ""}
              />
              {errors.model && (
                <p className="text-xs text-red-500">{errors.model}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                className={errors.year ? "border-red-500" : ""}
                min="1900"
                max="2100"
              />
              {errors.year && (
                <p className="text-xs text-red-500">{errors.year}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="chasis">Chasis</Label>
              <Input
                id="chasis"
                name="chasis"
                value={formData.chasis}
                onChange={handleChange}
                className={errors.chasis ? "border-red-500" : ""}
              />
              {errors.chasis && (
                <p className="text-xs text-red-500">{errors.chasis}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button variant='primary' type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando..."
                : isEditing
                ? "Actualizar"
                : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}