// app/combustible/reabastecimiento/components/replenishment-form.tsx
"use client";
import { useState } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { registerFuelReplenishment } from "@/api/fuel";
import { useAuthStore } from "@/stores/authStore";
import { motion } from "framer-motion";
import { useFuelStore } from "@/stores/fuelStore";
import { useDialogStore } from "@/stores/dialogStore";
import { getErrorMessage } from "@/utils/errorHandler";

const replenishmentSchema = z.object({
  gallons: z.number().min(1, "La cantidad debe ser mayor a 0"),
  replenishment_date: z.string().optional(),
  user_id: z.number(),
  user_password: z.string().optional(),
});

export type ReplenishmentFormData = z.infer<typeof replenishmentSchema>;

export default function ReplenishmentForm() {
  const { user_id } = useAuthStore();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const { setAvailable, available } = useFuelStore();
  const { open } = useDialogStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReplenishmentFormData>({
    resolver: zodResolver(replenishmentSchema),
    defaultValues: {
      gallons: 0,
      user_id: user_id || 0,
      replenishment_date: "",
      user_password: "",
    },
  });

  const onSubmit = () => {
    setShowPasswordPrompt(true); // Mostrar el campo de contraseña
  };

  const confirmSubmit = async (data: ReplenishmentFormData) => {
    if (!data.user_password) {
      toast.error("La contraseña es requerida");
      return;
    }

    if (!user_id || user_id === 0) {
      toast.error("No se ha podido obtener el ID del usuario");
      return;
    }

    data.user_id = user_id;

    if (data.replenishment_date) {
      data.replenishment_date = new Date(data.replenishment_date).toISOString();
    }

    let loadingToastId: string | number = 0;

    try {
      // Mostrar toast de "loading" y asignar su ID
      loadingToastId = toast.loading("Registrando reabastecimiento...");

      // Esperar a que la petición se complete
      await registerFuelReplenishment(data);

      // Dismiss el toast de loading y mostrar éxito
      toast.dismiss(loadingToastId);
      toast.success("Reabastecimiento registrado correctamente");
      setAvailable(available + Number(data.gallons)); // Actualizar disponibilidad de combustible
      open(null);
      // Resetear formulario y cerrar prompt
      reset();
      setShowPasswordPrompt(false);
    } catch (error) {
      // Dismiss el toast de loading y mostrar error
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  };

  // Manejo de errores de validación

  const onError = (errors: FieldErrors<ReplenishmentFormData>) => {
    console.log("Errores de validación:", errors);
    Object.values(errors).forEach((error) => {
      toast.error(error.message);
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
        <div>
          <Label
            htmlFor="gallons"
            className="text-sm font-medium text-gray-700"
          >
            Cantidad de galones
          </Label>
          <Input
            className="mt-1.5 h-11 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 noControls"
            id="gallons"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("gallons", { valueAsNumber: true })}
          />
          {errors.gallons && (
            <p className="text-red-500 text-sm mt-1.5">
              {errors.gallons.message}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="replenishment_date"
            className="text-sm font-medium text-gray-700"
          >
            Fecha y hora (opcional)
          </Label>
          <Input
            className="mt-1.5 h-11 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            id="replenishment_date"
            type="datetime-local"
            {...register("replenishment_date")}
          />
          {errors.replenishment_date && (
            <p className="text-red-500 text-sm mt-1.5">
              {errors.replenishment_date.message}
            </p>
          )}
        </div>

        {showPasswordPrompt && (
          <motion.div
            initial={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Label
              htmlFor="user_password"
              className="text-sm font-medium text-gray-700"
            >
              Confirmar con contraseña
            </Label>
            <Input
              autoComplete="current-password"
              id="user_password"
              type="password"
              className="mt-1.5 h-11 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              placeholder="Ingrese su contraseña"
              {...register("user_password")}
            />
            {errors.user_password && (
              <p className="text-red-500 text-sm mt-1.5">
                {errors.user_password.message}
              </p>
            )}
          </motion.div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          {!showPasswordPrompt ? (
            <Button
              type="submit"
              className="flex-1 h-11 bg-teal-600 hover:bg-teal-700 text-white font-medium"
              disabled={isSubmitting}
            >
              Continuar
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordPrompt(false)}
                className="flex-1 h-11 border-gray-200 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleSubmit(confirmSubmit, onError)}
                className="flex-1 h-11 bg-teal-600 hover:bg-teal-700 text-white font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Registrando...
                  </div>
                ) : (
                  "Confirmar Reabastecimiento"
                )}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
