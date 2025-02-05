import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmAdjustAlertProps {
  onConfirm: () => void;
}

export default function ConfirmAdjustAlert({
  onConfirm,
}: ConfirmAdjustAlertProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm(); // Llama la función de submit
    setOpen(false); // Cierra el AlertDialog
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Continuar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Una vez confirmes el ajuste, no
            podrás revertirlo ni editarlo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Confirmar Ajuste
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
