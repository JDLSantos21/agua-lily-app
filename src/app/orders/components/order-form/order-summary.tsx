// src/app/orders/components/order-form/order-summary.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Phone,
  MapPin,
  Package,
  Calendar,
  Clock,
  FileText,
  Truck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { CreateOrderRequest, Product, OrderItem } from "@/types/orders.types";
import { format } from "date-fns";

interface OrderSummaryProps {
  orderData: CreateOrderRequest;
  products: Product[];
  saveCustomer: boolean;
}

export default function OrderSummary({
  orderData,
  products,
  saveCustomer,
}: OrderSummaryProps) {
  // Encontrar información detallada de cada producto
  const getProductDetails = (item: OrderItem) => {
    return products.find((p) => p.id === item.product_id);
  };

  // Formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No especificada";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Resumen del Pedido</CardTitle>
          <CardDescription>
            Verifique los detalles antes de crear el pedido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cliente */}
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
              <User className="h-4 w-4" />
              Información del Cliente
            </h3>
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                <div className="space-y-1">
                  <div className="text-sm font-medium">
                    {orderData.customer_name}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    <span>{orderData.customer_phone}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-start gap-1 text-sm text-gray-600">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5" />
                    <span>{orderData.customer_address}</span>
                  </div>
                </div>
              </div>

              {!orderData.customer_id && saveCustomer && (
                <div className="mt-2 text-xs flex items-center gap-1 text-green-600 border-t border-gray-200 pt-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>
                    Este cliente será guardado en la base de datos para futuros
                    pedidos
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
              <Package className="h-4 w-4" />
              Productos ({orderData.items.length})
            </h3>
            <div className="bg-slate-50 p-3 rounded-md">
              <ul className="divide-y">
                {orderData.items.map((item, index) => {
                  const productDetails = getProductDetails(item);
                  return (
                    <li key={index} className="py-2 first:pt-0 last:pb-0">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">
                            {item.product_name || productDetails?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {productDetails?.size && `${productDetails.size} `}
                            {productDetails?.unit || item.unit}
                            {item.notes && (
                              <span className="ml-1 italic">
                                - {item.notes}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm font-semibold">
                          {item.quantity}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <Separator className="my-2" />

              <div className="flex justify-between text-sm">
                <span>Total de productos:</span>
                <span className="font-semibold">
                  {orderData.items.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                  )}{" "}
                  unidades
                </span>
              </div>
            </div>
          </div>

          {/* Detalles de Entrega */}
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
              <Truck className="h-4 w-4" />
              Detalles de Entrega
            </h3>
            <div className="bg-slate-50 p-3 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Fecha de entrega:</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <span>{formatDate(orderData.scheduled_delivery_date)}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Franja horaria:</div>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span>
                      {orderData.delivery_time_slot || "No especificada"}
                    </span>
                  </div>
                </div>
              </div>

              {orderData.delivery_notes && (
                <div className="mt-2 border-t border-gray-200 pt-2">
                  <div className="text-xs text-gray-500">
                    Instrucciones de entrega:
                  </div>
                  <div className="text-sm mt-1">{orderData.delivery_notes}</div>
                </div>
              )}
            </div>
          </div>

          {/* Notas Adicionales */}
          {orderData.notes && (
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Notas Adicionales
              </h3>
              <div className="bg-slate-50 p-3 rounded-md text-sm">
                {orderData.notes}
              </div>
            </div>
          )}

          {/* Verificación final */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">
                  Verificación Final
                </h4>
                <p className="text-xs text-yellow-700 mt-1">
                  Revise todos los detalles antes de crear el pedido. Una vez
                  creado, recibirá un código de seguimiento único.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
