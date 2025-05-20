// src/components/orders/OrderCard.tsx
import { memo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Phone,
  MapPin,
  Package,
  Calendar,
  Clock,
  User,
  Truck,
  MoreVertical,
  Eye,
  Edit,
  Clipboard,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { Order } from "@/types/orders.types";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import OrderStatusBadge from "./order-status-badge";
import { format } from "@formkit/tempo";

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

  // Determinar si es un pedido urgente (menos de 24 horas para entregar)
  const isUrgent = order.scheduled_delivery_date
    ? new Date(order.scheduled_delivery_date).getTime() - new Date().getTime() <
        24 * 60 * 60 * 1000 &&
      order.order_status !== "entregado" &&
      order.order_status !== "cancelado"
    : false;

  // Modo compacto para listados con muchas tarjetas
  <motion.div
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className="hover:bg-muted/50 border-b last:border-none"
  >
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <div className="flex items-start gap-3 w-full max-w-[320px]">
        {isUrgent && (
          <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse mt-1" />
        )}
        <div>
          <div className="font-medium truncate max-w-[220px]">
            {order.customer_display_name || order.customer_name}
          </div>
          <div className="text-xs text-muted-foreground">
            {order.tracking_code}
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col gap-0.5 text-muted-foreground text-xs w-[180px]">
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>{format(order.order_date || "", "short")}</span>
        </div>
        {order.scheduled_delivery_date && (
          <div className="flex items-center gap-1">
            <Truck className="h-3.5 w-3.5" />
            <span>{format(order.scheduled_delivery_date, "short")}</span>
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground w-[180px]">
        <Phone className="h-3.5 w-3.5" />
        <span className="truncate">{order.customer_phone}</span>
      </div>

      <div className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground w-[120px]">
        <Package className="h-3 w-3" />
        <span>
          {order.items?.length || 0} producto
          {order.items?.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleView}
        >
          <Eye className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {onEdit && (
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
            )}
            {onChangeStatus && (
              <DropdownMenuItem onClick={handleChangeStatus}>
                <Clock className="mr-2 h-4 w-4" />
                <span>Cambiar estado</span>
              </DropdownMenuItem>
            )}
            {onAssignDelivery && (
              <DropdownMenuItem onClick={handleAssignDelivery}>
                <Truck className="mr-2 h-4 w-4" />
                <span>Asignar entrega</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={copyTrackingCode}>
              <Clipboard className="mr-2 h-4 w-4" />
              <span>Copiar código</span>
            </DropdownMenuItem>
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Eliminar</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </motion.div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="hover:shadow-md transition-shadow"
    >
      <Card className="h-full flex flex-col justify-between">
        <CardHeader className="pb-3 flex flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">
                {order.customer_display_name || order.customer_name}
              </CardTitle>
              {isUrgent && (
                <span
                  className="h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse"
                  title="Entrega urgente"
                />
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p
                className="text-sm text-gray-500 cursor-pointer"
                onClick={copyTrackingCode}
              >
                {order.tracking_code}
                <Clipboard className="h-3.5 w-3.5 inline ml-1 text-gray-400 hover:text-gray-600" />
              </p>
            </div>
          </div>

          <OrderStatusBadge status={order.order_status || "pendiente"} />
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          <div className="grid grid-cols-2 gap-y-2">
            <div className="flex items-center gap-1.5 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Pedido: {format(order.order_date || "", "medium")}</span>
            </div>

            {order.scheduled_delivery_date && (
              <div className="flex items-center gap-1.5 text-sm">
                <Truck className="h-4 w-4 text-gray-500" />
                <span>
                  Entrega: {format(order.scheduled_delivery_date, "medium")}
                </span>
              </div>
            )}

            {order.delivery_time_slot && (
              <div className="flex items-center gap-1.5 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>Horario: {order.delivery_time_slot}</span>
              </div>
            )}

            {order.driver_name && (
              <div className="flex items-center gap-1.5 text-sm">
                <User className="h-4 w-4 text-gray-500" />
                <span>Conductor: {order.driver_name}</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5 pt-1 border-t">
            <div className="flex items-center gap-1.5 text-sm">
              <Phone className="h-3.5 w-3.5 text-gray-500" />
              <span>{order.customer_phone}</span>
            </div>

            <div className="flex items-center gap-1.5 text-sm">
              <MapPin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
              <span className="truncate">{order.customer_address}</span>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="pt-1 border-t">
              <div className="text-sm text-gray-700 font-medium flex items-center gap-1.5">
                <Package className="h-4 w-4 text-gray-500" />
                <span>Productos ({order.items.length})</span>
              </div>
              <ul className="mt-2 space-y-1">
                {order.items.slice(0, 3).map((item, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium">{item.quantity}x</span>{" "}
                    {item.product_name}
                    {item.unit && item.size && (
                      <span className="text-xs text-gray-500 ml-1">
                        ({item.size} {item.unit})
                      </span>
                    )}
                  </li>
                ))}
                {order.items.length > 3 && (
                  <li className="text-sm text-gray-500">
                    + {order.items.length - 3} más...
                  </li>
                )}
              </ul>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-5 flex justify-between gap-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1"
            onClick={handleView}
          >
            <Eye className="h-3.5 w-3.5" />
            Ver detalles
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <MoreVertical className="h-3.5 w-3.5" />
                Acciones
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {onEdit && (
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Editar pedido</span>
                </DropdownMenuItem>
              )}
              {onChangeStatus && (
                <DropdownMenuItem onClick={handleChangeStatus}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Cambiar estado</span>
                </DropdownMenuItem>
              )}
              {onAssignDelivery && (
                <DropdownMenuItem onClick={handleAssignDelivery}>
                  <Truck className="mr-2 h-4 w-4" />
                  <span>Asignar entrega</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={copyTrackingCode}>
                <Clipboard className="mr-2 h-4 w-4" />
                <span>Copiar código de seguimiento</span>
              </DropdownMenuItem>
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600 focus:text-red-700 focus:bg-red-50"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Eliminar pedido</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </motion.div>
  );
});

export default OrderCard;
