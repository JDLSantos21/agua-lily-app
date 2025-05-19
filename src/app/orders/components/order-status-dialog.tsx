// src/components/orders/OrderStatusDialog.tsx
import { useState, memo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Order, OrderStatus } from "@/types/orders.types";
import { CheckIcon, Loader2 } from "lucide-react";
import { useOrderStore } from "@/stores/orderStore";
import OrderStatusBadge from "./order-status-badge";

interface OrderStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "preparando", label: "Preparando" },
  { value: "despachado", label: "Despachado" },
  { value: "entregado", label: "Entregado" },
  { value: "cancelado", label: "Cancelado" },
];

const OrderStatusDialog = memo(function OrderStatusDialog({
  open,
  onOpenChange,
  order,
}: OrderStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateOrderStatus } = useOrderStore();

  useEffect(() => {
    if (open && order?.order_status) {
      setSelectedStatus(order.order_status);
      setNotes("");
    }
  }, [open, order]);

  const handleSubmit = async () => {
    if (
      !order?.id ||
      !selectedStatus ||
      selectedStatus === order.order_status
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateOrderStatus(order.id, {
        status: selectedStatus,
        notes: notes.trim() || null,
      });

      onOpenChange(false);
    } catch (error) {
      // El error ya está manejado por el store
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentStatus = (status: OrderStatus) =>
    order?.order_status === status;

  const canSubmit =
    selectedStatus && selectedStatus !== order?.order_status && !isSubmitting;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isSubmitting) {
          onOpenChange(isOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cambiar Estado del Pedido</DialogTitle>
          <DialogDescription>Pedido {order?.tracking_code}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-5 space-y-2">
            <Label>Estado actual</Label>
            <div>
              {order?.order_status ? (
                <OrderStatusBadge status={order.order_status} size="lg" />
              ) : (
                <span className="text-gray-500">No disponible</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Seleccionar nuevo estado</Label>
            <RadioGroup
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
            >
              <div className="grid grid-cols-1 gap-3">
                {statusOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`
                      flex items-center space-x-2 rounded-md border p-3 
                      ${selectedStatus === option.value ? "border-primary bg-primary/5" : "border-muted"}
                      ${isCurrentStatus(option.value) ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      disabled={isCurrentStatus(option.value)}
                      className="sr-only"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor={option.value}
                          className={`font-medium ${isCurrentStatus(option.value) ? "cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <div className="flex items-center gap-2">
                            <OrderStatusBadge status={option.value} size="md" />
                          </div>
                        </label>
                        {selectedStatus === option.value && (
                          <CheckIcon className="h-4 w-4 text-primary" />
                        )}
                        {isCurrentStatus(option.value) && (
                          <span className="text-xs text-muted-foreground">
                            Estado actual
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Agregar notas o comentarios sobre el cambio de estado"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="gap-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              "Actualizar Estado"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default OrderStatusDialog;
