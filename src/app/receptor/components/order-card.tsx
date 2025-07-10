import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Package } from "lucide-react";
import { Order } from "@/types/orders.types";
import { formatDate } from "date-fns";
import { es } from "date-fns/locale";
import { formatDateToUTC } from "@/shared/utils/formatDateToUTC";
import OrderStatusBadge from "@/app/(protected)/orders/components/order-status-badge";
export default function OrderCard({ order }: { order: Partial<Order> }) {
  const hasScheduledDelivery =
    order.scheduled_delivery_date && order.delivery_time_slot;

  const scheduledDateFormatted = formatDateToUTC(order.scheduled_delivery_date);

  return (
    <Card className="h-auto shadow-lg bg-gradient-to-b from-white to-neutral-50">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-3xl 4xl:text-5xl font-bold truncate">
              {order.customer_display_name}
            </CardTitle>
            <p className="text-lg 4xl:text-2xl text-muted-foreground truncate">
              {order.tracking_code}
            </p>
          </div>
          <div className="flex flex-col items-end self-end">
            <OrderStatusBadge
              size="2xl"
              status={order.order_status || "pendiente"}
            />
            <p className="text-lg 4xl:text-2xl uppercase text-muted-foreground mt-1">
              {order.order_date
                ? formatDate(order.order_date, "dd MMMM yyyy hh:MM a", {
                    locale: es,
                  })
                : "Fecha no disponible"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 4xl:space-y-4 pt-0">
        <Separator />

        {/* Productos */}
        <div className="2xl:space-y-1 4xl:space-y-2 h-64 4xl:h-[30rem]">
          <h3 className="font-semibold text-base 4xl:text-3xl text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <Package className="h-7 w-7" />
            Productos
          </h3>
          <div className="space-y-1.5 overflow-y-auto">
            {/* Tabla de lista de productos */}
            <table className="w-full">
              <thead>
                <tr className="text-base 4xl:text-2xl text-muted-foreground">
                  <th className="text-left"></th>
                  <th className="text-right">Cantidad</th>
                  <th className="text-right">Tamaño</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((product, index) => (
                  <tr
                    key={index}
                    className="border-b border-muted/50 hover:bg-muted/50 transition-colors"
                  >
                    <td className="text-left py-2">
                      <p className="text-2xl 4xl:text-4xl font-medium truncate uppercase">
                        {product.product_name}
                      </p>
                      {product.notes && (
                        <p className="text-2xl text-muted-foreground italic truncate">
                          Nota: {product.notes}
                        </p>
                      )}
                    </td>
                    <td className="text-right">
                      <p className="font-semibold text-lg 4xl:text-4xl">
                        {product.quantity}
                      </p>
                    </td>
                    <td className="text-right">
                      <p className="font-semibold text-lg 4xl:text-4xl">
                        {product.size?.toLocaleUpperCase()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Información de Entrega - Solo si existe */}
        {hasScheduledDelivery && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold text-xs 4xl:text-lg text-muted-foreground uppercase tracking-wide">
                Entrega Programada
              </h3>
              <div className="flex items-center justify-between text-lg 4xl:text-2xl">
                <div className="flex items-center gap-1">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>{scheduledDateFormatted || "Fecha no disponible"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{order.delivery_time_slot}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Si no hay entrega programada */}
        {!hasScheduledDelivery && (
          <>
            <Separator />
            <div className="text-center py-2">
              <p className="text-base 4xl:text-xl text-muted-foreground">
                Entrega no asignada
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
