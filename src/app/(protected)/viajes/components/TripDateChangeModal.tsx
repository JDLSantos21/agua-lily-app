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
import { ClockIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useUpdateTripDate } from "@/hooks/useTripReports";
import { MdOutlineEditCalendar } from "react-icons/md";

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

  const updateTripDate = useUpdateTripDate();

  const handleDateChange = async () => {
    if (!newDate) {
      toast.error("Por favor, selecciona una fecha válida");
      return;
    }

    updateTripDate.mutate(
      { tripId, newDate },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MdOutlineEditCalendar className="w-5 h-5" /> Cambiar Fecha
          </DialogTitle>
          <DialogDescription className="text-sm">
            La fecha actual del viaje es{" "}
            <span className="font-medium text-foreground">{currentDate}</span>
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
            disabled={updateTripDate.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={handleDateChange}
            disabled={updateTripDate.isPending || !newDate}
            className="min-w-[100px]"
          >
            {updateTripDate.isPending ? "Actualizando..." : "Actualizar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
