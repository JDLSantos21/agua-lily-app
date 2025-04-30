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
import { toast } from "sonner";
import { LoaderSpin } from "@/components/Loader";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTripStore } from "@/stores/tripStore";

export default function ChangeTripDateDialog() {
  const { openDialog, close } = useDialogStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { selectedTrip } = useTripStore();

  if (selectedTrip) {
    console.log(selectedTrip);
    setSelectedDate(selectedTrip.date);
  }

  return (
    <Dialog open={openDialog === "edit-trip-date-dialog"} onOpenChange={close}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cambiar Fecha de Corte</DialogTitle>
          </DialogHeader>

          <form>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  value={selectedDate || ""}
                  type="date"
                  id="date"
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" variant="primary" className="w-full mt-4">
              Guardar Cambios
            </Button>
          </form>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
