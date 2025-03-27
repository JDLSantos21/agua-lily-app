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
import { Fuel } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function FuelResetDialog() {
  const [password, setPassword] = useState("");
  const { user_id } = useAuthStore();
  const { openDialog, close, open } = useDialogStore();
  const availableFuel = 1000;

  const handleReset = async () => {
    if (!password || !user_id || user_id === 0) {
      return;
    }
    try {
      await resetFuelAvailability({ user_id, password });
      toast.success("Disponibilidad de combustible reseteada exitosamente");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ocurrió un error inesperado"
      );
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
          {/* Highlighted fuel display */}
          <div className="rounded-lg bg-slate-100 p-6 text-center">
            <div className="mb-2 text-sm font-medium text-slate-500">
              Disponible Actualmente
            </div>
            <div className="flex items-center justify-center gap-2">
              <Fuel className="h-6 w-6 text-blue-500" />
              <span className="text-3xl font-bold text-blue-500">
                {availableFuel.toFixed(2)}
              </span>
              <span className="text-lg font-medium text-slate-700">
                Galones
              </span>
            </div>
          </div>

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
            disabled={!password}
            onClick={() => handleReset()}
          >
            Resetear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
