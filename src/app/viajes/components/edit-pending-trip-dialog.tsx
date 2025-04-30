"use client";
import { useDialogStore } from "@/stores/dialogStore";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPendingTripById } from "@/api/trips";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LoaderSpin } from "@/components/Loader";
import { useTripStore } from "@/stores/tripStore";
import { motion } from "framer-motion";

interface PendingTrip {
  id: number;
  vehicle_id: number;
  vehicle_tag: string;
  date: string;
  driver: string;
  user: string;
}

export default function EditPendingTripDialog() {
  const { selectedTripId } = useTripStore();
  const { openDialog, close } = useDialogStore();
  const [trip, setTrip] = useState<PendingTrip | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize form with empty default values
  const { register, handleSubmit, reset } = useForm<PendingTrip>({
    defaultValues: {
      vehicle_tag: "",
      driver: "",
      user: "",
    },
  });

  useEffect(() => {
    if (!selectedTripId) return;
    setLoading(true);
    if (selectedTripId) {
      getPendingTripById(selectedTripId.toString())
        .then((tripData) => {
          setTrip(tripData);
          // Update form values when trip data is loaded
          reset({
            vehicle_tag: tripData.vehicle_tag,
            driver: tripData.driver,
            user: tripData.user,
          });
        })
        .catch((error) => {
          toast.error("Error al cargar el viaje pendiente.");
          console.log("Error al cargar el viaje pendiente:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedTripId, reset]);

  // Remove or comment out this line in production
  console.log("Trip data:", trip);

  return (
    <Dialog
      open={openDialog === "edit-pending-trip-dialog"}
      onOpenChange={close}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Viaje Pendiente</DialogTitle>
          </DialogHeader>
          {loading ? (
            <LoaderSpin text="Cargando datos del viaje" className="mx-auto" />
          ) : (
            <form onSubmit={handleSubmit((data) => console.log(data))}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="vehicle_tag">Ficha</Label>
                  <Input id="vehicle_tag" {...register("vehicle_tag")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="driver">Conductor</Label>
                  <Input id="driver" {...register("driver")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user">Usuario</Label>
                  <Input id="user" {...register("user")} />
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full mt-4">
                Guardar Cambios
              </Button>
            </form>
          )}
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
