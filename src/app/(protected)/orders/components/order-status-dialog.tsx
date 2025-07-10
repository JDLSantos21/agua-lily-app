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
import {
  CheckIcon,
  Loader2,
  Settings,
  ArrowLeft,
  Clock,
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
import OrderStatusBadge from "./order-status-badge";
import { useUpdateOrderStatus } from "@/hooks/useOrders";
import { cn } from "@/lib/utils";
import { formatRelative } from "date-fns";
import { es } from "date-fns/locale";

interface OrderStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

const statusOptions: {
  value: OrderStatus;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    value: "pendiente",
    label: "Pendiente",
    description: "Pedido recibido, esperando procesamiento",
    icon: Clock,
    color: "amber",
  },
  {
    value: "preparando",
    label: "Preparando",
    description: "Preparando productos para despacho",
    icon: Package,
    color: "blue",
  },
  {
    value: "despachado",
    label: "Despachado",
    description: "En camino hacia el cliente",
    icon: Truck,
    color: "purple",
  },
  {
    value: "entregado",
    label: "Entregado",
    description: "Pedido completado exitosamente",
    icon: CheckCircle,
    color: "green",
  },
  {
    value: "cancelado",
    label: "Cancelado",
    description: "Pedido cancelado",
    icon: AlertTriangle,
    color: "red",
  },
];

const OrderStatusDialog = memo(function OrderStatusDialog({
  open,
  onOpenChange,
  order,
}: OrderStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [notes, setNotes] = useState("");
  const { mutateAsync: updateOrderStatus, isPending } = useUpdateOrderStatus();

  useEffect(() => {
    if (open && order?.order_status) {
      setSelectedStatus(order.order_status);
      setNotes("");
    }
  }, [open, order]);

  if (!order || !order.id) {
    return null; // No order data available
  }

  const handleSubmit = async () => {
    if (!order?.id || !selectedStatus || selectedStatus === order.order_status)
      return;

    const newStatus = {
      status: selectedStatus,
      notes: notes.trim() || null,
    };

    try {
      await updateOrderStatus({
        id: order.id,
        data: newStatus,
      });

      onOpenChange(false);
    } catch (error) {
      console.log(error);
    }
  };

  const lastStatus = order.status_history?.[0];
  const lastStatusDateFormatted = () => {
    if (!lastStatus || !lastStatus.created_at) {
      return formatRelative(new Date(order.updated_at), new Date(), {
        locale: es,
      });
    }
    return formatRelative(new Date(lastStatus.created_at), new Date(), {
      locale: es,
    });
  };

  console.log("order", order);

  const canSubmit =
    selectedStatus && selectedStatus !== order?.order_status && !isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isPending) {
          onOpenChange(isOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogTitle hidden />

        {/* Header modernizado */}
        <DialogHeader className="pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-semibold">
                Cambiar Estado del Pedido
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                Pedido {order?.tracking_code}
              </DialogDescription>
            </div>
          </div>

          {/* Estado actual destacado */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Estado actual
                </Label>
                {order?.order_status ? (
                  <OrderStatusBadge status={order.order_status} size="lg" />
                ) : (
                  <span className="text-gray-500 text-sm">No disponible</span>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Última actualización</p>
                <p className="text-sm font-medium text-gray-700">
                  {lastStatusDateFormatted()}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto py-6">
          <div className="space-y-6">
            {/* Selector de estado mejorado */}
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-900">
                Seleccionar nuevo estado
              </Label>
              <RadioGroup
                value={selectedStatus}
                onValueChange={(value) =>
                  setSelectedStatus(value as OrderStatus)
                }
                className="space-y-3"
              >
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  const isCurrentStatus = order?.order_status === option.value;
                  const isSelected = selectedStatus === option.value;

                  return (
                    <div
                      key={option.value}
                      className={cn(
                        "relative rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer group",
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : isCurrentStatus
                            ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                      onClick={() =>
                        !isCurrentStatus && setSelectedStatus(option.value)
                      }
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        disabled={isCurrentStatus}
                        className="sr-only"
                      />

                      <div className="flex items-start gap-4">
                        {/* Icono del estado */}
                        <div
                          className={cn(
                            "flex items-center justify-center w-12 h-12 rounded-xl transition-colors",
                            isSelected
                              ? "bg-blue-500 text-white"
                              : isCurrentStatus
                                ? "bg-gray-300 text-gray-500"
                                : `bg-${option.color}-100 text-${option.color}-600`
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>

                        {/* Información del estado */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3
                              className={cn(
                                "font-semibold",
                                isSelected
                                  ? "text-blue-900"
                                  : isCurrentStatus
                                    ? "text-gray-500"
                                    : "text-gray-900"
                              )}
                            >
                              {option.label}
                            </h3>
                            {isSelected && (
                              <CheckIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            )}
                            {isCurrentStatus && (
                              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-md">
                                Estado actual
                              </span>
                            )}
                          </div>
                          <p
                            className={cn(
                              "text-sm",
                              isSelected
                                ? "text-blue-700"
                                : isCurrentStatus
                                  ? "text-gray-400"
                                  : "text-gray-600"
                            )}
                          >
                            {option.description}
                          </p>
                        </div>
                      </div>

                      {/* Indicador visual de selección */}
                      {isSelected && (
                        <div className="absolute inset-0 rounded-xl border-2 border-blue-500 pointer-events-none">
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckIcon className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            {/* Notas con diseño mejorado */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <Label
                  htmlFor="notes"
                  className="text-base font-semibold text-gray-900"
                >
                  Notas adicionales
                </Label>
                <span className="text-sm text-gray-500">(opcional)</span>
              </div>
              <Textarea
                id="notes"
                placeholder="Agregar comentarios sobre el cambio de estado..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Footer con botones mejorados */}
        <DialogFooter className="pt-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex justify-between items-center w-full">
            <div className="text-sm text-gray-500">
              {selectedStatus && selectedStatus !== order?.order_status && (
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Cambio pendiente de confirmar
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="px-6"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={cn(
                  "px-6 gap-2 font-medium",
                  canSubmit
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    Actualizar Estado
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default OrderStatusDialog;
