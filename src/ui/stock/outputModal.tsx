"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Material } from "@/lib/types";
import { useForm } from "react-hook-form";
import { Loader, ArrowDown } from "lucide-react";
import type React from "react";
import { verifyEmployeeCode } from "@/api/employees";
import { toast } from "sonner";
import { validateOutput } from "@/schemas/inventory";
import { useAuthStore } from "@/stores/authStore";
import { useRegisterOutput } from "@/hooks/useInventory";

interface OutputModalProps {
  material: Material | null;
  closeModal: () => void;
}

interface OutputFormData {
  quantity: number;
  employee_code: string;
  reason?: string;
  reason_checkbox?: boolean;
}

export const OutputModal: React.FC<OutputModalProps> = ({
  material,
  closeModal,
}) => {
  const { register, handleSubmit, reset, watch, setFocus } =
    useForm<OutputFormData>({
      mode: "onChange",
    });
  const user_id = useAuthStore((state) => state.user_id);

  const {
    mutateAsync: registerOutput,
    isPending,
    isSuccess,
  } = useRegisterOutput();

  const onSubmit = async (data: OutputFormData) => {
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

    try {
      const isValid = await verifyEmployeeCode(employee_code).catch((error) => {
        toast.error(error.message || "Error de conexión con el servidor");
        return;
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

      await registerOutput(formData);

      reset();
    } catch (error) {
      console.log(error, "Error en registro de salida");
      toast.error("Ocurrió un problema, contácte al administrador.");
    } finally {
      if (isSuccess) closeModal();
    }
  };

  return (
    <Dialog open={!!material} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl flex items-center justify-center">
              <ArrowDown className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-900">
                {material?.name}
              </h2>
              <p className="text-sm text-gray-500 font-normal">
                Registrar salida de material
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Stock disponible:
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {material?.stock || 0} {material?.unit || "unidades"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label
                htmlFor="quantity"
                className="text-sm font-medium text-gray-700"
              >
                Cantidad a retirar
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Ingrese la cantidad"
                className="mt-1.5 h-11 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 noControls"
                {...register("quantity", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </div>

            <div>
              <Label
                htmlFor="employee_code"
                className="text-sm font-medium text-gray-700"
              >
                Código de empleado
              </Label>
              <Input
                id="employee_code"
                type="text"
                placeholder="Ingrese el código"
                className="mt-1.5 h-11 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                {...register("employee_code")}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="reasonCheck"
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                {...register("reason_checkbox")}
              />
              <Label htmlFor="reasonCheck" className="text-sm text-gray-700">
                Agregar motivo de salida
              </Label>
            </div>

            {watch("reason_checkbox") && (
              <div>
                <Label
                  htmlFor="reason"
                  className="text-sm font-medium text-gray-700"
                >
                  Motivo
                </Label>
                <Input
                  id="reason"
                  type="text"
                  placeholder="Ingrese el motivo"
                  className="mt-1.5 h-11 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  {...register("reason", { required: true })}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="flex-1 h-11 border-gray-200 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  Registrando...
                </div>
              ) : (
                "Registrar Salida"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
