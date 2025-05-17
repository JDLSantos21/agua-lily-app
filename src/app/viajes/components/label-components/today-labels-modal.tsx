import { Button } from "@/components/ui/button";
import { Printer, Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface TodayLabelsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  labels: any[] | undefined;
  isLoading: boolean;
  onRefresh: () => void;
  onPrintOne: (label: any, quantity: number) => Promise<void>;
  onPrintMultiple: (label: any) => void;
  isPrinting: boolean;
}

export default function TodayLabelsModal({
  isOpen,
  onOpenChange,
  labels,
  isLoading,
  onRefresh,
  onPrintOne,
  onPrintMultiple,
  isPrinting,
}: TodayLabelsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Etiquetas Generadas Hoy</DialogTitle>
          <DialogDescription>
            Aquí puedes ver las etiquetas generadas hoy y reimprimirlas si es
            necesario.
          </DialogDescription>
        </DialogHeader>

        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2">Cargando etiquetas...</span>
            </div>
          ) : !labels || labels.length === 0 ? (
            <div className="text-gray-500 text-center p-4 bg-gray-50 rounded-lg border">
              No hay etiquetas generadas hoy.
            </div>
          ) : (
            <div>
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  className="flex items-center gap-2 text-blue-500 border-blue-200"
                >
                  <Loader2
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  <span>Actualizar</span>
                </Button>
              </div>

              <div className="max-h-[50vh] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Secuencia</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labels.map((label) => (
                      <TableRow key={label.id}>
                        <TableCell className="font-medium">
                          {label.sequence_number}
                        </TableCell>
                        <TableCell>
                          {format(new Date(label.created_at), "hh:mm a")}
                        </TableCell>
                        <TableCell>{label.quantity}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              label.status === "printed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {label.status === "printed"
                              ? "Impresa"
                              : "Generada"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onPrintOne(label, 1)}
                              disabled={isPrinting}
                              className="flex items-center gap-1"
                            >
                              <Printer className="h-4 w-4" />
                              <span>1</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onPrintMultiple(label)}
                              disabled={isPrinting}
                              className="flex items-center gap-1"
                            >
                              <Plus className="h-4 w-4" />
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
