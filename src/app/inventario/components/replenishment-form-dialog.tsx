import ReplenishmentForm from "@/app/combustible/reabastecimiento/components/replenishment-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialogStore } from "@/stores/dialogStore";

export default function ReplenishmentFormDialog() {
  const { close, openDialog } = useDialogStore();
  return (
    <Dialog open={openDialog === "replenishment-dialog"} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reabastecer Combustible</DialogTitle>
          <DialogDescription>
            Agregar disponibilidad de combustible al tanque.
          </DialogDescription>
        </DialogHeader>
        <ReplenishmentForm />
      </DialogContent>
    </Dialog>
  );
}
