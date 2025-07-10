import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewMaterialForm from "./new-material-form";
import { useDialogStore } from "@/stores/dialogStore";
import { Package } from "lucide-react";

export default function NewMaterialDialog() {
  const { close, openDialog } = useDialogStore();
  return (
    <Dialog open={openDialog === "new-material"} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl flex items-center justify-center">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-900">
                Nuevo Material
              </h2>
              <p className="text-sm text-gray-500 font-normal">
                Agregar material al inventario
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          <NewMaterialForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
