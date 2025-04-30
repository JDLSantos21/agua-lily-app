"use client";
import { resetFuelAvailability } from "@/api/fuel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import { useDialogStore } from "@/stores/dialogStore";
import { useState } from "react";
import { toast } from "sonner";
import FuelDisplay from "./fuel-display";
import { useFuelStore } from "@/stores/fuelStore";

export default function FuelResetDialog() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const { user_id } = useAuthStore();
  const { openDialog, close, open } = useDialogStore();
  const { setAvailable } = useFuelStore();

  const handleReset = async () => {
    setIsLoading(true);
    if (!password || !user_id || user_id === 0) {
      return;
    }
    try {
      await resetFuelAvailability({ user_id, password });
      toast.success("Combustible reseteado satisfactoriamente");
      setAvailable(0);
      open(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ocurrió un error inesperado"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={openDialog === "fuel-reset-dialog"} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resetear Disponibilidad de Combustible</DialogTitle>
          <DialogDescription>
            Esta acción reseteará la disponibilidad de combustible a 0. Esta
            operación no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-6 py-4">
          <FuelDisplay />
          <div className="flex flex-col space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => open(null)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={!password || isLoading}
            onClick={() => handleReset()}
          >
            Resetear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
