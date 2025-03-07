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
import { Card, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";

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

  const onSubmit = (data: ReplenishmentFormData) => {
    console.log("onSubmit ejecutado con datos:", data);
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

    let loadingToastId: string | number = 0;

    try {
      // Mostrar toast de "loading" y asignar su ID
      loadingToastId = toast.loading("Registrando reabastecimiento...");

      // Esperar a que la petición se complete
      await registerFuelReplenishment(data);

      // Dismiss el toast de loading y mostrar éxito
      toast.dismiss(loadingToastId);
      toast.success("Reabastecimiento registrado correctamente");

      // Resetear formulario y cerrar prompt
      reset();
      setShowPasswordPrompt(false);
    } catch (error) {
      // Dismiss el toast de loading y mostrar error
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
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
    <motion.div
      initial={{ opacity: 0, translateY: -50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.5 }}
      className="w-[35%] xl:w-[40%] mt-14"
    >
      <Card className="p-5">
        <CardDescription>Registrar reabastecimiento</CardDescription>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
          <div>
            <Label htmlFor="gallons">Galones</Label>
            <Input
              className="noControls max-w-40"
              id="gallons"
              type="number"
              step="0.01"
              {...register("gallons", { valueAsNumber: true })}
            />
            {errors.gallons && (
              <p className="text-red-500 text-sm">{errors.gallons.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="replenishment_date">Fecha (opcional)</Label>
            <Input
              className="max-w-54"
              id="replenishment_date"
              type="datetime-local"
              {...register("replenishment_date")}
            />
            {errors.replenishment_date && (
              <p className="text-red-500 text-sm">
                {errors.replenishment_date.message}
              </p>
            )}
          </div>

          {showPasswordPrompt && (
            <div>
              <Label htmlFor="user_password">Contraseña</Label>
              <Input
                autoComplete="current-password"
                id="user_password"
                type="password"
                {...register("user_password")}
              />
              {errors.user_password && (
                <p className="text-red-500 text-sm">
                  {errors.user_password.message}
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            className={`${showPasswordPrompt ? "hidden" : "block"}`}
            variant="primary"
            disabled={isSubmitting}
          >
            Registrar
          </Button>

          {showPasswordPrompt && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSubmit(confirmSubmit, onError)}
              className="ml-2 bg-green-500 text-white"
              disabled={isSubmitting}
            >
              Confirmar
            </Button>
          )}
        </form>
      </Card>
    </motion.div>
  );
}
