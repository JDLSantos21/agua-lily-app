"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Material } from "@/lib/types";
import { useForm } from "react-hook-form";
import { Package, User, ArrowRightCircle, Loader } from "lucide-react";
import type React from "react"; // Added import for React
import { verifyEmployeeCode } from "@/api/employees";
import { toast } from "sonner";
import { registerMovement } from "@/api/inventory";
import { validateOutput } from "@/schemas/inventory";

interface OutputModalProps {
  material: Material | null;
  closeModal: () => void;
  updateFunc: ({ quantity, id }: { quantity: number; id: number }) => void;
}

interface OutputFormData {
  quantity: number;
  employee_code: string;
  reason?: string;
  reason_checkbox?: boolean;
}

export const OutputModal: React.FC<OutputModalProps> = ({
  material,
  updateFunc,
  closeModal,
}) => {
  const { register, handleSubmit, reset, formState, watch, setFocus } =
    useForm<OutputFormData>({
      mode: "onChange",
    });

  const isSubmitting = formState.isSubmitting;

  const user_id = localStorage.getItem("user_id");

  const onSubmit = async (data: OutputFormData) => {
    try {
      if (!material) return;

      if (!user_id) {
        toast.error("No se encontró al usuario");
        return;
      }

      // ✅ Validamos los datos con Zod
      const outputData = await validateOutput(data);

      if (outputData.error) {
        const issues = outputData.error.issues;
        const firstMessageError = issues[0].message;
        toast.error(firstMessageError);
        return;
      }

      const { employee_code, quantity, reason_checkbox, reason } =
        outputData.data;

      if (material.stock === undefined || material.stock < quantity) {
        toast.error("La cantidad ingresada es mayor al stock actual");
        setFocus("quantity");
        return;
      }

      const isValid = await verifyEmployeeCode(employee_code).catch((error) => {
        toast.error(error.message || "Error de conexión con el servidor");
        throw error;
      });

      if (!isValid) {
        toast.warning("Código de empleado no válido");
        setFocus("employee_code");
        return;
      }

      const formData = {
        employee_code,
        quantity,
        material_id: material.id,
        user_id: Number(user_id),
        type: "salida",
        ...(reason_checkbox && { reason }),
      };

      await registerMovement(formData);
      toast.success("Salida registrada exitosamente");

      updateFunc({ id: material.id, quantity });
      closeModal();
      reset();
    } catch (error) {
      console.log(error, "Error en registro de salida");
      toast.error("Ocurrió un problema, contácte al administrador.");
    }
  };

  return (
    <Dialog open={!!material} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg text-gray-700  font-semibold">
            {material?.name.toLocaleUpperCase()}
          </DialogTitle>
          <DialogDescription>
            Ingrese los detalles de la salida del material.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-medium">
              Cantidad
            </Label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="quantity"
                type="number"
                placeholder="Ingrese la cantidad"
                className="pl-10 noControls focus-visible:outline-gray-300"
                {...register("quantity", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee_code" className="text-sm font-medium">
              Código de empleado
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="employee_code"
                type="text"
                placeholder="Ingrese el código"
                className="pl-10 focus-visible:outline-gray-300"
                {...register("employee_code")}
              />
            </div>
          </div>
          {/* //añadir checkbox para agregar motivo de salida en caso de que este check aparece input para colocar el motivo. */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="reasonCheck"
              className="text-blue-500 rounded focus-visible:ring-2 focus-visible:ring-blue-500"
              {...register("reason_checkbox")}
            />
            <Label htmlFor="reasonCheck" className="text-sm font-medium">
              Agregar motivo de salida
            </Label>
          </div>

          {watch("reason_checkbox") && (
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-medium">
                Motivo
              </Label>
              <Input
                id="reason"
                type="text"
                placeholder="Ingrese el motivo"
                className="focus-visible:outline-gray-300"
                {...register("reason", { required: true })}
              />
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={formState.isSubmitting}
          >
            {isSubmitting ? (
              <Loader className="ml-2 h-5 w-5 text-white animate-spin" />
            ) : (
              <>
                Registrar
                <ArrowRightCircle className="mr-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
