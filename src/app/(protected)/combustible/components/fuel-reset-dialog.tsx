"use client";
import { resetFuelAvailability } from "@/api/fuel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { getErrorMessage } from "@/utils/errorHandler";
import { RotateCcw, AlertTriangle, Loader2 } from "lucide-react";

export default function FuelResetDialog() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const { user_id } = useAuthStore();
  const { openDialog, close, open } = useDialogStore();
  const { setAvailable } = useFuelStore();

  const handleReset = async () => {
    setIsLoading(true);
    if (!password || !user_id || user_id === 0) {
      toast.error("Por favor ingresa tu contraseña");
      setIsLoading(false);
      return;
    }

    try {
      await resetFuelAvailability({ user_id, password });
      toast.success("Combustible reseteado satisfactoriamente");
      setAvailable(0);
      open(null);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={openDialog === "fuel-reset-dialog"} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl flex items-center justify-center">
              <RotateCcw className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-900">
                Resetear Combustible
              </h2>
              <p className="text-sm text-gray-500 font-normal">
                Reiniciar disponibilidad a cero
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Acción irreversible
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Esta acción reseteará la disponibilidad de combustible a 0
                  galones. Esta operación no se puede deshacer.
                </p>
              </div>
            </div>
          </div>

          <FuelDisplay />

          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Confirmar con contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingrese su contraseña"
              className="mt-1.5 h-11 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => open(null)}
            className="flex-1 h-11 border-gray-200 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={!password || isLoading}
            onClick={() => handleReset()}
            className="flex-1 h-11 bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Reseteando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Resetear
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
