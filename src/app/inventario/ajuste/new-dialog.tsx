"use client";
import { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAdjustment } from "@/lib/utils";
import { verifyEmployeeCode } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { MaterialCombobox } from "./material-combobox";
import { toast, Toaster } from "sonner";
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
import { AdjustmentCreate } from "@/types/materials/adjustment";
import { fetchMaterials } from "@/lib/data";
import { FileCog } from "lucide-react";

interface Material {
  id: number;
  name: string;
}

export default function NewAjustDialog() {
  const { register, handleSubmit, setValue, watch, reset } =
    useForm<AdjustmentCreate>();
  const [open, setOpen] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [customReason, setCustomReason] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const user_id = useAuthStore((state) => state.user_id);

  useEffect(() => {
    fetchMaterials().then((data) => setMaterials(data));
  }, []);

  const onSubmit: SubmitHandler<AdjustmentCreate> = async (
    data: AdjustmentCreate
  ) => {
    if (data.reason === "custom") {
      data.reason = customReason;
    }

    data.user_id = user_id;

    if (!data.material_id) {
      setIsConfirmOpen(false);
      toast.warning("Selecciona un material");
      return;
    }

    try {
      await setAdjustment(data);
      toast.success("Ajuste registrado correctamente");
      reset();
    } catch (error) {
      console.error("Error registrando ajuste", error);
      toast.error("Error al registrar el ajuste");
      return;
    }

    setOpen(false);
    setIsConfirmOpen(false); // Cerrar el AlertDialog después de confirmar
  };

  const handleConfirm = () => {
    setIsConfirmOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster richColors />
      <DialogTrigger className="px-5 py-2 bg-white border border-gray-200 hover:bg-gray-100 text-sm rounded-md">
        <FileCog className="h-4 w-4 inline-block mr-2" /> Ajustar
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Ajuste</DialogTitle>
          <DialogDescription>
            Registra un nuevo ajuste de inventario
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleConfirm)} className="space-y-4">
          {/* Combobox para seleccionar el material */}
          <div>
            <Label
              htmlFor="material_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Material
            </Label>
            <MaterialCombobox
              materials={materials}
              onSelect={(material) => {
                setValue("material_id", material ? material.id : null);
              }}
            />
          </div>

          {/* Input para el código de empleado con validación */}
          <div>
            <Label
              htmlFor="employee_code"
              className="block text-sm font-medium text-gray-700"
            >
              Código de Empleado
            </Label>
            <Input
              id="employee_code"
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm pr-10 noControls"
              {...register("employee_code", {
                required: true,
                validate: (value) => verifyEmployeeCode(value),
              })}
            />
          </div>

          {/* Input para el nuevo stock */}
          <div>
            <Label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Nuevo Stock
            </Label>
            <Input
              id="quantity"
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm noControls"
              required
              {...register("quantity", { required: true, min: 1 })}
            />
          </div>

          {/* Select para motivo con opción personalizada */}
          <div>
            <Label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700"
            >
              Motivo
            </Label>
            <select
              id="reason"
              className="mt-1 h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none"
              {...register("reason", {
                required: true,
                validate: (value) =>
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
              <div className="mt-2">
                <Label
                  htmlFor="customReason"
                  className="block text-sm font-medium text-gray-700"
                >
                  Motivo Personalizado
                </Label>
                <Input
                  id="customReason"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={customReason}
                  onChange={(e) => {
                    setCustomReason(e.target.value);
                  }}
                  required
                />
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Registrar Ajuste
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* AlertDialog de confirmación */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción registrará el ajuste en el sistema. ¿Deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit(onSubmit)}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
