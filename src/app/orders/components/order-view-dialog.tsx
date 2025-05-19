// src/components/orders/OrderViewDialog.tsx
import { useEffect, useState, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Phone,
  MapPin,
  Package,
  Clock,
  User,
  Truck,
  Edit,
  Trash,
  Clipboard,
  CalendarClock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import {
  Order,
  OrderItem,
  OrderStatusHistoryEntry,
} from "@/types/orders.types";
import { useOrderStore } from "@/stores/orderStore";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import OrderStatusBadge from "./order-status-badge";
import { format } from "@formkit/tempo";

interface OrderViewDialogProps {
  orderId: number | null;
  onClose: () => void;
  onEdit?: (order: Order) => void;
  onChangeStatus?: (order: Order) => void;
  onAssignDelivery?: (order: Order) => void;
  onDelete?: (order: Order) => void;
}

const OrderViewDialog = memo(function OrderViewDialog({
  orderId,
  onClose,
  onEdit,
  onChangeStatus,
  onAssignDelivery,
  onDelete,
}: OrderViewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const { orderDetails, isLoadingDetails, fetchOrderById } = useOrderStore();

  const order = orderId ? orderDetails[orderId] : null;

  // Cargar datos del pedido cuando cambia el ID
  useEffect(() => {
    if (orderId) {
      setIsOpen(true);
      fetchOrderById(orderId);
      setActiveTab("details"); // Reset a la pestaña de detalles
    } else {
      setIsOpen(false);
    }
  }, [orderId, fetchOrderById]);

  // Manejadores de eventos
  const handleClose = () => {
    setIsOpen(false);
    // Permitir que la animación termine antes de cerrar completamente
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleEdit = () => {
    if (order && onEdit) {
      onEdit(order);
      handleClose();
    }
  };

  const handleChangeStatus = () => {
    if (order && onChangeStatus) {
      onChangeStatus(order);
      handleClose();
    }
  };

  const handleAssignDelivery = () => {
    if (order && onAssignDelivery) {
      onAssignDelivery(order);
      handleClose();
    }
  };

  const handleDelete = () => {
    if (order && onDelete) {
      onDelete(order);
      handleClose();
    }
  };

  const copyTrackingCode = () => {
    if (order?.tracking_code) {
      navigator.clipboard.writeText(order.tracking_code);
      toast.success("Código de seguimiento copiado al portapapeles");
    }
  };

  // Si el diálogo no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogTitle hidden />
        {isLoadingDetails ? (
          <OrderViewSkeleton />
        ) : !order ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <DialogDescription className="text-lg">
              No se encontró información del pedido
            </DialogDescription>
            <Button variant="outline" onClick={handleClose} className="mt-4">
              Cerrar
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="space-y-1">
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 mr-1"
                    onClick={handleClose}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  Pedido {order.tracking_code}
                </DialogTitle>
                <OrderStatusBadge
                  status={order.order_status || "pendiente"}
                  size="lg"
                />
              </div>
              <div className="flex justify-between items-center pt-1">
                <DialogDescription className="text-base font-medium">
                  {order.customer_display_name || order.customer_name}
                </DialogDescription>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 gap-1"
                  onClick={copyTrackingCode}
                >
                  <Clipboard className="h-3 w-3" />
                  Copiar código
                </Button>
              </div>
            </DialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-1"
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="details">Información</TabsTrigger>
                <TabsTrigger value="products">
                  Productos ({order.items?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="history">
                  Historial ({order.status_history?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <OrderDetailsTab order={order} />
              </TabsContent>

              <TabsContent value="products">
                <OrderProductsTab items={order.items || []} />
              </TabsContent>

              <TabsContent value="history">
                <OrderHistoryTab history={order.status_history || []} />
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex flex-wrap sm:flex-nowrap gap-2 mt-6 border-t pt-4">
              {onChangeStatus && (
                <Button
                  variant="outline"
                  onClick={handleChangeStatus}
                  className="w-full sm:w-auto gap-1"
                >
                  <Clock className="h-4 w-4" />
                  Cambiar estado
                </Button>
              )}

              {onAssignDelivery && (
                <Button
                  variant="outline"
                  onClick={handleAssignDelivery}
                  className="w-full sm:w-auto gap-1"
                >
                  <Truck className="h-4 w-4" />
                  Asignar entrega
                </Button>
              )}

              {onEdit && (
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="w-full sm:w-auto gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
              )}

              {onDelete && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="w-full sm:w-auto gap-1"
                >
                  <Trash className="h-4 w-4" />
                  Eliminar
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
});

// Componente para la pestaña de detalles
const OrderDetailsTab = memo(function OrderDetailsTab({
  order,
}: {
  order: Order;
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-500">
              Información del pedido
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CalendarClock className="h-4 w-4 text-gray-500" />
                <span>
                  Fecha de pedido: {format(order.order_date || "", "long")}
                </span>
              </div>

              {order.scheduled_delivery_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-gray-500" />
                  <span>
                    Fecha de entrega:{" "}
                    {format(order.scheduled_delivery_date, "long")}
                  </span>
                </div>
              )}

              {order.delivery_time_slot && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Horario de entrega: {order.delivery_time_slot}</span>
                </div>
              )}
            </div>
          </div>

          {(order.driver_name || order.vehicle_tag) && (
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-500">
                Información de entrega
              </h3>
              <div className="space-y-2">
                {order.driver_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>Conductor: {order.driver_name}</span>
                  </div>
                )}

                {order.vehicle_tag && (
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <span>Vehículo: {order.vehicle_tag}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-500">
            Información del cliente
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-500" />
              <span>{order.customer_display_name || order.customer_name}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{order.customer_phone}</span>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <span>{order.customer_address}</span>
            </div>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="bg-gray-50 p-3 rounded-md">
          <h3 className="text-sm font-medium mb-1">Notas adicionales</h3>
          <p className="text-sm text-gray-600">{order.notes}</p>
        </div>
      )}

      {order.delivery_notes && (
        <div className="bg-blue-50 p-3 rounded-md">
          <h3 className="text-sm font-medium mb-1 text-blue-700">
            Notas de entrega
          </h3>
          <p className="text-sm text-blue-600">{order.delivery_notes}</p>
        </div>
      )}
    </div>
  );
});

// Componente para la pestaña de productos
const OrderProductsTab = memo(function OrderProductsTab({
  items,
}: {
  items: OrderItem[];
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
        <p>No hay productos en este pedido</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="border p-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">
                  {item.product_name || `Producto #${item.product_id}`}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {item.unit && item.size && (
                    <span className="mr-3">
                      {item.size} {item.unit}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-lg font-bold">{item.quantity}x</div>
            </div>
            {item.notes && (
              <div className="mt-2 text-sm text-gray-500 border-t pt-2">
                {item.notes}
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="pt-2 border-t flex items-center justify-between text-sm">
        <span className="font-medium">Total de productos:</span>
        <span className="font-bold">{items.length}</span>
      </div>
    </div>
  );
});

// Componente para la pestaña de historial
const OrderHistoryTab = memo(function OrderHistoryTab({
  history,
}: {
  history: OrderStatusHistoryEntry[];
}) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="h-12 w-12 mx-auto text-gray-300 mb-2" />
        <p>No hay historial disponible</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

      <ul className="space-y-4">
        {history.map((entry, index) => (
          <li key={index} className="relative pl-10">
            <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
              {getStatusIcon(entry.status)}
            </div>

            <div className="bg-gray-50 rounded-md p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">
                    {getStatusLabel(entry.status)}
                  </h4>
                  {entry.notes && (
                    <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {format(entry.created_at, { date: "long", time: "short" })}
                </div>
              </div>

              {entry.updated_by_name && (
                <div className="mt-2 text-xs text-gray-500 border-t pt-2">
                  Actualizado por: {entry.updated_by_name}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

// Componente para skeleton loading
const OrderViewSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-start">
      <div>
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-8 w-24 rounded-full" />
    </div>

    <div className="space-y-6 mt-4">
      <Skeleton className="h-10 w-full" />

      <div className="space-y-3">
        <Skeleton className="h-32 w-full rounded-md" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  </div>
);

// Funciones auxiliares
function getStatusIcon(status: string) {
  switch (status) {
    case "pendiente":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "preparando":
      return <Package className="h-4 w-4 text-blue-500" />;
    case "despachado":
      return <Truck className="h-4 w-4 text-purple-500" />;
    case "entregado":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "cancelado":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "pendiente":
      return "Pendiente";
    case "preparando":
      return "Preparando";
    case "despachado":
      return "Despachado";
    case "entregado":
      return "Entregado";
    case "cancelado":
      return "Cancelado";
    default:
      return status;
  }
}

export default OrderViewDialog;
