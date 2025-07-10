// src/components/orders/OrderCard.tsx
import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Truck,
  Eye,
  Clipboard,
  MoreHorizontal,
  Trash,
  Edit,
  Settings,
  AlertTriangle,
  MapPin,
  Clock,
} from "lucide-react";
import { Order } from "@/types/orders.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import OrderStatusBadge from "./order-status-badge";
import { format } from "@formkit/tempo";
import { formatDateToUTC } from "@/shared/utils/formatDateToUTC";
import { cn } from "@/lib/utils";
import { BiComment } from "react-icons/bi";

interface OrderCardProps {
  order: Order;
  onView: (id: number) => void;
  onEdit?: (order: Order) => void;
  onChangeStatus?: (order: Order) => void;
  onAssignDelivery?: (order: Order) => void;
  onDelete?: (order: Order) => void;
  layout?: "compact" | "full";
}

const OrderCard = memo(function OrderCard({
  order,
  onView,
  onEdit,
  onChangeStatus,
  onAssignDelivery,
  onDelete,
  layout = "full",
}: OrderCardProps) {
  // Manejadores de eventos
  const handleView = () => {
    if (order.id) {
      onView(order.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(order);
    }
  };

  const handleChangeStatus = () => {
    if (onChangeStatus) {
      onChangeStatus(order);
    }
  };

  const handleAssignDelivery = () => {
    if (onAssignDelivery) {
      onAssignDelivery(order);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(order);
    }
  };

  const copyTrackingCode = () => {
    if (order.tracking_code) {
      navigator.clipboard.writeText(order.tracking_code);
      toast.success("Código de seguimiento copiado al portapapeles");
    }
  };

  const scheduled_delivery_date = order.scheduled_delivery_date
    ? format(
        new Date(formatDateToUTC(order.scheduled_delivery_date) || new Date()),
        { date: "long" }
      )
    : null;

  // Determinar si es un pedido urgente (menos de 24 horas para entregar)
  const isUrgent = order.scheduled_delivery_date
    ? new Date(order.scheduled_delivery_date).getTime() - new Date().getTime() <
        24 * 60 * 60 * 1000 &&
      order.order_status !== "entregado" &&
      order.order_status !== "cancelado"
    : false;

  // Función para obtener el color del borde según el estado
  const getBorderColor = () => {
    switch (order.order_status) {
      case "pendiente":
        return "border-l-amber-400";
      case "preparando":
        return "border-l-blue-400";
      case "despachado":
        return "border-l-purple-400";
      case "entregado":
        return "border-l-green-400";
      case "cancelado":
        return "border-l-red-400";
      default:
        return "border-l-gray-300";
    }
  };

  // Modo compacto para listados con muchas tarjetas
  if (layout === "compact") {
    return (
      <Card
        className={cn(
          "transition-all duration-200 hover:shadow-lg border-l-4 bg-white",
          getBorderColor(),
          isUrgent && "ring-1 ring-red-200 bg-red-50/30"
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {/* Información principal */}
            <div className="flex items-start gap-4 flex-1">
              {/* Indicador de urgencia */}
              {isUrgent && (
                <div className="flex animate-pulse items-center justify-center w-7 h-7 bg-red-100 rounded-lg flex-shrink-0">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              )}

              {/* Contenido principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 truncate text-base">
                    {order.customer_name || "Cliente sin asignar"}
                  </h3>
                  <OrderStatusBadge
                    status={order.order_status || "pendiente"}
                    size="sm"
                  />
                </div>

                <div className="text-xs text-gray-500 mb-2 font-mono bg-gray-50 px-2 py-1 rounded">
                  #{order.tracking_code}
                </div>

                {/* Fecha de creación con hora */}
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Creado:{" "}
                    {format(order.created_at, { date: "long", time: "short" })}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                  {scheduled_delivery_date && (
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      <span className="text-xs">{scheduled_delivery_date}</span>
                    </div>
                  )}
                  {order.delivery_time_slot && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs">
                        {order.delivery_time_slot}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleView}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Eye className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleView}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalles
                  </DropdownMenuItem>
                  {onEdit && (
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                  )}
                  {onChangeStatus && (
                    <DropdownMenuItem onClick={handleChangeStatus}>
                      <Settings className="mr-2 h-4 w-4" />
                      Cambiar estado
                    </DropdownMenuItem>
                  )}
                  {onAssignDelivery && (
                    <DropdownMenuItem onClick={handleAssignDelivery}>
                      <Truck className="mr-2 h-4 w-4" />
                      Asignar entrega
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={copyTrackingCode}>
                    <Clipboard className="mr-2 h-4 w-4" />
                    Copiar código
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Versión completa para vista de cuadrícula
  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-lg border-l-4 bg-white group h-full",
        getBorderColor(),
        isUrgent && "ring-1 ring-red-200 shadow-red-500/30 shadow-md"
      )}
    >
      <CardContent className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            {isUrgent && (
              <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg flex-shrink-0">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 text-lg truncate leading-tight">
                  {order.customer_name || "Cliente sin asignar"}
                </h3>
                <button
                  onClick={copyTrackingCode}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  title="Copiar código de seguimiento"
                >
                  <Clipboard className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <OrderStatusBadge status={order.order_status || "pendiente"} />
                <span className="text-sm text-gray-500 font-mono">
                  #{order.tracking_code}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información detallada */}
        <div className="space-y-3 mb-4 flex-1">
          {/* Información de fechas */}
          <div
            className={`${isUrgent ? "bg-gray-50" : "bg-gray-50"} rounded-lg p-3 space-y-2`}
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Creado</span>
              </div>
              <div className="text-right">
                <span className="font-medium text-gray-900 block">
                  {format(new Date(order.created_at), {
                    date: "long",
                  })}
                </span>
                <span className="text-xs text-gray-500">
                  {format(new Date(order.created_at), {
                    time: "short",
                  })}
                </span>
              </div>
            </div>

            {scheduled_delivery_date && (
              <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>Entrega</span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-gray-900 block">
                    {scheduled_delivery_date}
                  </span>
                  {order.delivery_time_slot && (
                    <span className="text-xs text-gray-500">
                      {order.delivery_time_slot}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Dirección del cliente */}
          {order.customer_address && (
            <div className="flex items-start gap-2 text-sm bg-blue-50 p-3 rounded-lg">
              <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-blue-600 text-xs font-medium block">
                  Dirección:
                </span>
                <span className="text-gray-700">{order.customer_address}</span>
              </div>
            </div>
          )}

          {/* Información de entrega adicional */}
          {order.scheduled_delivery_date && !scheduled_delivery_date && (
            <div className="flex items-start gap-2 text-sm bg-amber-50 p-3 rounded-lg">
              <Clock className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-amber-600 text-xs font-medium block">
                  Entrega programada:
                </span>
                <span className="text-gray-700 block">
                  {new Date(order.scheduled_delivery_date).toLocaleDateString(
                    "es-ES"
                  )}
                </span>
                {order.delivery_time_slot && (
                  <span className="text-gray-600 text-xs">
                    Franja: {order.delivery_time_slot}
                  </span>
                )}
              </div>
            </div>
          )}

          {order.driver_name && (
            <div className="flex justify-between gap-2 text-sm p-3 rounded-lg">
              <div>
                <span className=" text-xs font-medium block">Conductor</span>
                <span className="text-gray-700">{order.driver_name}</span>
              </div>
              <div>
                <span className=" text-xs font-medium block">Vehículo</span>
                <span className="text-gray-700">{order.vehicle_tag}</span>
              </div>
            </div>
          )}

          {/* Información de notas si existe */}
          {order.notes && (
            <div className="flex items-start gap-2 text-sm">
              <BiComment className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600 line-clamp-2">{order.notes}</span>
            </div>
          )}
        </div>

        {/* Acciones - siempre al fondo */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleView}
            className="gap-2"
          >
            Ver detalles
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onEdit && (
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              )}
              {onChangeStatus && (
                <DropdownMenuItem onClick={handleChangeStatus}>
                  <Settings className="mr-2 h-4 w-4" />
                  Cambiar estado
                </DropdownMenuItem>
              )}
              {onAssignDelivery && order.order_status === "preparando" && (
                <DropdownMenuItem onClick={handleAssignDelivery}>
                  <Truck className="mr-2 h-4 w-4" />
                  Asignar entrega
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={copyTrackingCode}>
                <Clipboard className="mr-2 h-4 w-4" />
                Copiar código
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
});

export default OrderCard;
