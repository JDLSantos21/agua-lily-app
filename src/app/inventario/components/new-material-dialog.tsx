import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NewMaterialForm from "./new-material-form";
import { useDialogStore } from "@/stores/dialogStore";

export default function NewMaterialDialog() {
  const { close, openDialog } = useDialogStore();
  return (
    <Dialog open={openDialog === "new-material"} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Material</DialogTitle>
          <DialogDescription>
            Agregar un nuevo material al inventario.
          </DialogDescription>
        </DialogHeader>
        <NewMaterialForm />
      </DialogContent>
    </Dialog>
  );
}
