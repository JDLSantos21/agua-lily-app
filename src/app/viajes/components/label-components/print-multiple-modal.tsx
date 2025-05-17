import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Printer, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface PrintMultipleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPrint: (quantity: number) => void;
  isPrinting: boolean;
}

export default function PrintMultipleModal({
  isOpen,
  onOpenChange,
  onPrint,
  isPrinting,
}: PrintMultipleModalProps) {
  const [printQuantity, setPrintQuantity] = useState<number>(1);

  const handlePrint = () => {
    if (printQuantity <= 0 || printQuantity > 10) {
      return;
    }
    onPrint(printQuantity);
  };

  const handleEnterPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handlePrint();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reimprimir Múltiples Etiquetas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cantidad a imprimir</label>
            <Input
              type="number"
              min={1}
              max={10}
              value={printQuantity}
              onChange={(e) => setPrintQuantity(Number(e.target.value))}
              onKeyDown={handleEnterPress}
              className="w-full noControls"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
          <Button
            onClick={handlePrint}
            disabled={isPrinting || printQuantity <= 0 || printQuantity > 10}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPrinting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Imprimiendo...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                <span>Imprimir</span>
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
