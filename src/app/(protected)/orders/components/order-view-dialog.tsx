// src/components/orders/OrderViewDialog.tsx
import React, { useEffect, useState, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  MapPin,
  Package,
  Clock,
  User,
  Truck,
  Trash,
  Clipboard,
  CalendarClock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Eye,
  UserPlus,
  UserPen,
} from "lucide-react";
import {
  Order,
  OrderItem,
  OrderStatusHistoryEntry,
} from "@/types/orders.types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import OrderStatusBadge from "./order-status-badge";
import { format } from "@formkit/tempo";
import { useOrder } from "@/hooks/useOrders";
import formatPhoneNumber from "@/shared/utils/formatNumber";
import { formatDateToUTC } from "@/shared/utils/formatDateToUTC";
import { cn } from "@/lib/utils";
import InfoCard from "./order-view/info-card";
import {
  MdPublishedWithChanges,
  MdProductionQuantityLimits,
} from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";
import { CiBoxList } from "react-icons/ci";
import { TbPointFilled } from "react-icons/tb";
import { FaRegNoteSticky } from "react-icons/fa6";
import { FiInfo } from "react-icons/fi";

interface OrderViewDialogProps {
  orderId: number | null;
  onClose: () => void;
  onEdit?: (order: Order) => void;
  onChangeStatus?: (order: Order) => void;
  onAssignDelivery?: (order: Order) => void;
  onDelete?: (order: Order) => void;
}

// Estructura de pasos para ver un pedido
const STEPS = [
  {
    id: "details",
    title: "Información",
    icon: FiInfo,
    description: "Detalles del pedido",
  },
  {
    id: "products",
    title: "Productos",
    icon: Package,
    description: "Lista de productos",
  },
  {
    id: "history",
    title: "Historial",
    icon: Clock,
    description: "Cambios de estado",
  },
];

const OrderViewDialog = memo(function OrderViewDialog({
  orderId,
  onClose,
  onEdit,
  onChangeStatus,
  onAssignDelivery,
  onDelete,
}: OrderViewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const { isLoading: isLoadingDetails, data: orderDetails } = useOrder(
    orderId || 0
  );

  const order = orderDetails?.data;

  useEffect(() => {
    if (orderId) {
      setIsOpen(true);
      setCurrentStep(0);
    } else {
      setIsOpen(false);
    }
  }, [orderId]);

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
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-4xl max-h-[95vh] overflow-hidden flex flex-col"
      >
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
            <DialogHeader className="border-b border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleClose}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                    {order.tracking_code}
                    <button
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={copyTrackingCode}
                    >
                      <Clipboard className="w-5 h-5" />
                    </button>
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    {order.customer_name}
                  </DialogDescription>
                </div>
                <OrderStatusBadge
                  status={order.order_status || "pendiente"}
                  size="md"
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarClock className="h-4 w-4" />
                      <span>
                        {format(order.order_date || "", {
                          date: "medium",
                          time: "short",
                        })}
                      </span>
                    </div>
                    {order.scheduled_delivery_date && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck className="h-4 w-4" />
                        <span>
                          Entrega:{" "}
                          {formatDateToUTC(order.scheduled_delivery_date)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">
                      {order.items?.length || 0} productos
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Stepper compacto */}
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-xl">
              {STEPS.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const Icon = step.icon;

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex items-center gap-3 w-full">
                      <button
                        onClick={() => setCurrentStep(index)}
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-200 ",
                          isActive
                            ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                            : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                      <div className="hidden sm:block">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            isActive ? "text-blue-600" : "text-gray-500"
                          )}
                        >
                          {step.title}
                        </p>
                      </div>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-px mx-3 transition-colors duration-300",
                          isCompleted ? "bg-green-500" : "bg-gray-200"
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Contenido con animaciones */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 p-1">
                {/* Paso 1: Información */}
                {currentStep === 0 && (
                  <div className="animate-in slide-in-from-right-5 duration-300">
                    <OrderDetailsTab order={order} />
                  </div>
                )}

                {/* Paso 2: Productos */}
                {currentStep === 1 && (
                  <div className="animate-in slide-in-from-right-5 duration-300">
                    <OrderProductsTab items={order.items || []} />
                  </div>
                )}

                {/* Paso 3: Historial */}
                {currentStep === 2 && (
                  <div className="animate-in slide-in-from-right-5 duration-300">
                    <OrderHistoryTab history={order.status_history || []} />
                  </div>
                )}
              </div>
            </div>

            {/* Footer con botones de acción mejorados */}
            <DialogFooter className="pt-6 border-t border-gray-100 flex justify-center items-center">
              <div className="flex justify-between items-center w-full gap-4">
                <div className="flex items-center justify-between gap-3 w-full">
                  <span className="text-sm text-gray-500">
                    Vista {currentStep + 1} de {STEPS.length}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Botones de acción principales */}
                    {onChangeStatus && (
                      <Button
                        variant="outline"
                        onClick={handleChangeStatus}
                        className="gap-2 px-4"
                      >
                        <MdPublishedWithChanges className="h-5 w-5" />
                        Cambiar estado
                      </Button>
                    )}

                    {onAssignDelivery && (
                      <Button
                        variant="outline"
                        onClick={handleAssignDelivery}
                        className="gap-2 px-4"
                      >
                        {order.driver_name ? (
                          <>
                            <UserPen className="h-4 w-4" />
                            Editar conductor
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            Asignar conductor
                          </>
                        )}
                      </Button>
                    )}

                    {onEdit && (
                      <Button
                        onClick={handleEdit}
                        className="gap-2 px-4 bg-blue-600 hover:bg-blue-700"
                      >
                        <RiEditCircleFill className="h-4 w-4" />
                        Editar
                      </Button>
                    )}

                    {onDelete && (
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        className="gap-2 px-4"
                      >
                        <Trash className="h-4 w-4" />
                        Eliminar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
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
  console.log(order);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información del pedido */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              Información del Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <InfoCard
                icon={CalendarClock}
                label="Fecha de pedido"
                value={format(order.order_date, {
                  date: "long",
                  time: "short",
                })}
              />

              {order.scheduled_delivery_date && (
                <InfoCard
                  icon={Truck}
                  label="Fecha de entrega"
                  value={formatDateToUTC(order.scheduled_delivery_date)}
                  valueClassName="text-gray-800"
                />
              )}

              {order.delivery_time_slot && (
                <InfoCard
                  icon={Clock}
                  label="Horario de entrega"
                  value={order.delivery_time_slot}
                  labelClassName="text-gray-600"
                  valueClassName="text-gray-800"
                />
              )}
            </div>

            {(order.driver_name || order.vehicle_tag) && (
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Información de entrega
                </h4>
                <div className="space-y-2">
                  {order.driver_name && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Conductor:</span>
                      <span className="font-medium">{order.driver_name}</span>
                    </div>
                  )}

                  {order.vehicle_tag && (
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Vehículo:</span>
                      <span className="font-medium">{order.vehicle_tag}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información del cliente */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <InfoCard
                icon={User}
                label="Nombre del cliente"
                value={order.customer_name}
                valueClassName="text-gray-800"
              />

              <InfoCard
                icon={Phone}
                label="Teléfono"
                value={formatPhoneNumber(order.customer_phone)}
                valueClassName="text-gray-800"
              />

              <InfoCard
                icon={MapPin}
                label="Dirección de entrega"
                value={order.customer_address}
                valueClassName="text-gray-800"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notas */}
      {(order.notes || order.delivery_notes) && (
        <div className="space-y-4">
          {order.notes && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-gray-700">
                  Notas adicionales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {order.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {order.delivery_notes && (
            <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-blue-700 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Notas de entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-600 leading-relaxed">
                  {order.delivery_notes}
                </p>
              </CardContent>
            </Card>
          )}
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
      <div className="text-center py-12 text-gray-500">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl mx-auto mb-4">
          <MdProductionQuantityLimits className="h-8 w-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          No hay productos
        </h3>
        <p className="text-sm text-gray-500">
          Este pedido no tiene productos asignados
        </p>
      </div>
    );
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-4">
      {/* Header con resumen */}
      <div className="bg-gray-50 rounded-xl p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-500 rounded-lg">
              <CiBoxList className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Lista de Productos
              </h3>
              <p className="text-sm text-gray-600 inline-flex items-center gap-2">
                {items.length} {items.length === 1 ? "producto" : "productos"}{" "}
                <TbPointFilled className="h-4 w-4 text-gray-500" />
                Total {totalQuantity} unidades
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <Card
            key={index}
            className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="px-4 py-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0">
                      <Package className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {item.product_name || `Producto #${item.product_id}`}
                      </h4>

                      {(item.unit || item.size) && (
                        <div className="flex items-center gap-2">
                          {item.size && (
                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                              {item.size}
                            </span>
                          )}
                          {item.unit && (
                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                              {item.unit}
                            </span>
                          )}
                        </div>
                      )}

                      {item.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 leading-relaxed">
                            <span className="font-medium text-gray-700">
                              Nota:
                            </span>{" "}
                            {item.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cantidad destacada */}
                <div className="ml-4 text-right flex-shrink-0">
                  <div className="inline-flex items-center justify-center text-gray-800">
                    <span className="text-lg font-bold">{item.quantity}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {item.quantity === 1 ? "unidad" : "unidades"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumen final */}
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
      <div className="text-center py-12 text-gray-500">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl mx-auto mb-4">
          <Clock className="h-8 w-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Sin historial
        </h3>
        <p className="text-sm text-gray-500">
          No hay cambios de estado registrados para este pedido
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-50 rounded-xl px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-500 rounded-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Historial de estados</h3>
            <p className="text-sm">
              {history.length}{" "}
              {history.length === 1
                ? "cambio registrado"
                : "cambios registrados"}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Línea temporal */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b bg-gray-400" />

        <div className="space-y-6">
          {history.map((entry, index) => {
            const isLatest = index === 0;
            const StatusIcon = getStatusIcon(entry.status);
            const statusColor = getStatusColor(entry.status);

            return (
              <div key={index} className="relative">
                {/* Punto en la timeline */}
                <div
                  className={cn(
                    "absolute left-0 w-12 h-12 rounded-xl shadow-lg flex items-center justify-center",
                    `bg-${statusColor}-500`
                  )}
                >
                  {React.cloneElement(StatusIcon, {
                    className: "h-5 w-5 text-white",
                  })}
                </div>

                {/* Contenido */}
                <div className="ml-16">
                  <Card
                    className={cn(
                      "border-l-4 shadow-sm transition-all duration-200 hover:shadow-md",
                      `border-l-${statusColor}-500 bg-${statusColor}-50/30`
                    )}
                  >
                    <CardContent className="px-4 py-2">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4
                            className={
                              "font-medium text-base flex items-center gap-2"
                            }
                          >
                            {getStatusLabel(entry.status)}
                            {isLatest && (
                              <span className="inline-flex items-center text-blue-700 bg-blue-100 px-5 rounded-sm text-xs font-bold">
                                Actual
                              </span>
                            )}
                          </h4>
                          <p className={"text-sm mt-1"}>
                            {format(entry.created_at, {
                              date: "full",
                              time: "short",
                            })}
                          </p>
                        </div>

                        {/* Indicador de tiempo relativo */}
                        <div className="text-right">
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border">
                            {getRelativeTime(entry.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Notas */}
                      {entry.notes && (
                        <div className="mb-3 px-3 py-1 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                            <FaRegNoteSticky className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            {entry.notes}
                          </p>
                        </div>
                      )}

                      {/* Usuario que hizo el cambio */}
                      {entry.updated_by_name && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 pt-1 border-t border-gray-200">
                          <User className="h-3 w-3" />
                          <span>Actualizado por: </span>
                          <span className="font-medium">
                            {entry.updated_by_name}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estadísticas del historial */}
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

function getStatusColor(status: string) {
  switch (status) {
    case "pendiente":
      return "amber";
    case "preparando":
      return "blue";
    case "despachado":
      return "purple";
    case "entregado":
      return "green";
    case "cancelado":
      return "red";
    default:
      return "gray";
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

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `Hace ${diffMinutes} min`;
  } else if (diffHours < 24) {
    return `Hace ${diffHours}h`;
  } else if (diffDays < 7) {
    return `Hace ${diffDays}d`;
  } else {
    return format(dateString, { date: "short" });
  }
}

export default OrderViewDialog;
