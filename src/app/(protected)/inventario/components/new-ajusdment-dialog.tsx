"use client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyEmployeeCode } from "@/api/employees";
import { useAuthStore } from "@/stores/authStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { validateAdjustment } from "@/schemas/inventory";
import { toast } from "sonner";
import { MaterialCombobox } from "../ajuste/material-combobox";
import { useDialogStore } from "@/stores/dialogStore";
import { useCreateAdjustment, useMaterials } from "@/hooks/useInventory";
import { CreateAdjustment } from "@/types/inventory";
import { Settings, Save } from "lucide-react";

export default function NewAjustDialog() {
  const { register, handleSubmit, setValue, watch, reset } =
    useForm<CreateAdjustment>();
  const [customReason, setCustomReason] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const user_id = useAuthStore((state) => state.user_id);
  const { close, openDialog, open } = useDialogStore();
  const { data: materials } = useMaterials();

  const { mutateAsync: createAdjustment, isPending } = useCreateAdjustment();

  const onSubmit: SubmitHandler<CreateAdjustment> = async (
    data: CreateAdjustment
  ) => {
    if (data.reason === "custom") {
      data.reason = customReason;
    }

    if (user_id) {
      data.user_id = user_id;
    } else {
      data.user_id = 0;
    }

    data.quantity = parseInt(data.quantity.toString());

    const dataValidated = await validateAdjustment(data);

    if (dataValidated.error) {
      toast.warning("Verifica los datos ingresados.");
      setIsConfirmOpen(false);
      return;
    }

    try {
      await createAdjustment(data);
      reset();
    } catch (error) {
      console.log("Error registrando ajuste", error);
      return;
    } finally {
      open(null);
      setIsConfirmOpen(false);
    }
  };

  const handleConfirm = () => {
    setIsConfirmOpen(true);
  };

  return (
    <Dialog open={openDialog === "new-adjustment"} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl flex items-center justify-center">
              <Settings className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-900">
                Nuevo Ajuste
              </h2>
              <p className="text-sm text-gray-500 font-normal">
                Registrar ajuste de inventario
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleConfirm)} className="space-y-5 mt-6">
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="material_id"
                className="text-sm font-medium text-gray-700"
              >
                Material
              </Label>
              <div className="mt-1.5">
                <MaterialCombobox
                  materials={materials}
                  onSelect={(material) => {
                    setValue("material_id", material ? material.id : 0);
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="employee_code"
                  className="text-sm font-medium text-gray-700"
                >
                  Código de Empleado
                </Label>
                <Input
                  id="employee_code"
                  type="number"
                  className="mt-1.5 h-11 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 noControls"
                  placeholder="Ingresa tu código"
                  {...register("employee_code", {
                    required: true,
                    validate: (value: any) => verifyEmployeeCode(value),
                  })}
                />
              </div>

              <div>
                <Label
                  htmlFor="quantity"
                  className="text-sm font-medium text-gray-700"
                >
                  Nueva Existencia
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  className="mt-1.5 h-11 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 noControls"
                  placeholder="Cantidad"
                  required
                  {...register("quantity", { required: true, min: 1 })}
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="reason"
                className="text-sm font-medium text-gray-700"
              >
                Motivo del Ajuste
              </Label>
              <select
                id="reason"
                className="mt-1.5 w-full h-11 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                {...register("reason", {
                  required: true,
                  validate: (value: any) =>
                    value !== "custom" || customReason.length > 0,
                })}
              >
                <option value="">Selecciona un motivo</option>
                <option value="Ajuste Administrativo">
                  Ajuste Administrativo
                </option>
                <option value="Error de Conteo">Error de Conteo</option>
                <option value="Daño">Daño</option>
                <option value="Robo">Robo</option>
                <option value="custom">Otro (personalizado)</option>
              </select>
              {watch("reason") === "custom" && (
                <div className="mt-3">
                  <Label
                    htmlFor="customReason"
                    className="text-sm font-medium text-gray-700"
                  >
                    Motivo Personalizado
                  </Label>
                  <Input
                    id="customReason"
                    type="text"
                    className="mt-1.5 h-11 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    placeholder="Describe el motivo..."
                    value={customReason}
                    onChange={(e) => {
                      setCustomReason(e.target.value);
                    }}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => open(null)}
              className="flex-1 h-11 border-gray-200 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-11 bg-orange-600 hover:bg-orange-700 text-white font-medium"
            >
              <Save className="mr-2 h-4 w-4" />
              Registrar Ajuste
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* AlertDialog de confirmación */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl flex items-center justify-center">
                <Settings className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-semibold text-gray-900">
                  Confirmar Ajuste
                </h2>
                <p className="text-sm text-gray-500 font-normal">
                  ¿Deseas registrar este ajuste?
                </p>
              </div>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="flex-1 h-11 border-gray-200 hover:bg-gray-50">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit(onSubmit)}
              className="flex-1 h-11 bg-orange-600 hover:bg-orange-700 text-white"
            >
              Confirmar Ajuste
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
