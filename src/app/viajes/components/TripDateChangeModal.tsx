"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckIcon, ClockIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TripDateChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: number;
  currentDate: string;
}

export default function TripDateChangeModal({
  isOpen,
  onClose,
  tripId,
  currentDate,
}: TripDateChangeModalProps) {
  const [newDate, setNewDate] = useState<string>(currentDate);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateChange = async () => {
    if (!newDate) {
      toast.error("Por favor, selecciona una fecha válida");
      return;
    }

    try {
      setIsSubmitting(true);
      // Call your API to update the trip date
      console.log(tripId, newDate);

      toast.success("Fecha actualizada correctamente", {
        description: `El viaje #${tripId} ha sido actualizado a la fecha ${new Date(newDate).toLocaleDateString()}.`,
        icon: <CheckIcon className="h-4 w-4 text-green-500" />,
      });

      onClose();
      // You may want to refresh the data after changing the date
      // This would require passing a refetch function as a prop
    } catch (error) {
      console.error("Error updating trip date:", error);
      toast.error("Error al actualizar la fecha", {
        description: "Por favor, intenta nuevamente más tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-500" />
            Cambiar fecha del viaje #{tripId}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            La fecha actual del viaje es{" "}
            <span className="font-medium text-foreground">
              {new Date(currentDate).toLocaleDateString()}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="trip-date"
              className="text-sm font-medium flex items-center gap-2"
            >
              <ClockIcon className="h-4 w-4 text-blue-500" />
              Nueva fecha
            </Label>
            <div className="grid gap-2">
              <Input
                id="trip-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className={cn("h-10", !newDate && "border-red-500")}
              />
              {!newDate && (
                <p className="text-xs text-red-500">
                  Por favor, selecciona una fecha
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={handleDateChange}
            disabled={isSubmitting || !newDate}
            className="min-w-[100px]"
          >
            {isSubmitting ? "Actualizando..." : "Actualizar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
