import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialogStore } from "@/stores/dialogStore";
import ReplenishmentForm from "../../combustible/reabastecimiento/components/replenishment-form";
import { Fuel } from "lucide-react";

export default function ReplenishmentFormDialog() {
  const { close, openDialog } = useDialogStore();
  return (
    <Dialog open={openDialog === "replenishment-dialog"} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl flex items-center justify-center">
              <Fuel className="h-5 w-5 text-teal-600" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-900">
                Reabastecer Combustible
              </h2>
              <p className="text-sm text-gray-500 font-normal">
                Agregar combustible al tanque
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          <ReplenishmentForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
