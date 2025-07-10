// src/app/orders/components/order-edit-form.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  Loader2,
  Info,
  FileEdit,
  Package,
  Truck,
  Users,
  CheckCircle,
} from "lucide-react";
import { Order, OrderItem } from "@/types/orders.types";
import { toast } from "sonner";
import ProductSelector from "./order-form/product-selector";
import DeliveryDetails from "./order-form/delivery-details";
import OrderStatusBadge from "./order-status-badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Nuevos imports de TanStack Query
import { useProducts, useUpdateOrder } from "@/hooks/useOrders";
import CustomerEditCard from "./customer-edit-card";
import { formatDateForDB } from "@/utils/formatDate";
import { es } from "date-fns/locale";

interface OrderEditFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

// Estructura de pasos para editar un pedido
const STEPS = [
  {
    id: "info",
    title: "Cliente",
    icon: Users,
    description: "Información del cliente",
  },
  {
    id: "products",
    title: "Productos",
    icon: Package,
    description: "Productos del pedido",
  },
  {
    id: "delivery",
    title: "Entrega",
    icon: Truck,
    description: "Detalles de entrega",
  },
];

export default function OrderEditForm({
  open,
  onOpenChange,
  order,
}: OrderEditFormProps) {
  // Estado del formulario
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Order>>({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    items: [],
    scheduled_delivery_date: undefined,
    delivery_time_slot: null,
    notes: null,
    delivery_notes: null,
  });

  // Ref para controlar la inicialización y evitar loops
  const isInitializedRef = useRef(false);

  // Consulta productos
  const { data: productsResponse, isLoading: isLoadingProducts } =
    useProducts();
  const updateOrderMutation = useUpdateOrder();
  const isSubmitting = updateOrderMutation.isPending;
  const products = productsResponse?.data || [];

  // Inicializar el formulario cuando cambia el pedido - SOLO UNA VEZ
  useEffect(() => {
    if (open && order && !isInitializedRef.current) {
      console.log(
        "🔧 Inicializando formulario con datos del pedido:",
        order.id
      );

      // Determinar el nombre correcto del cliente
      const customerDisplayName = order.customer_id
        ? order.customer_name || order.customer_display_name
        : order.customer_name;

      setFormData({
        customer_id: order.customer_id || null,
        customer_name: customerDisplayName || "",
        customer_phone: order.customer_phone || "",
        customer_address: order.customer_address || "",
        items: order.items || [],
        scheduled_delivery_date: order.scheduled_delivery_date,
        delivery_time_slot: order.delivery_time_slot || null,
        notes: order.notes || null,
        delivery_notes: order.delivery_notes || null,
      });

      // Resetear el paso
      setCurrentStep(0);
      isInitializedRef.current = true;
    }
  }, [open, order]);

  // Resetear la inicialización cuando cambia el pedido o se cierra el diálogo
  useEffect(() => {
    if (!open) {
      isInitializedRef.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (order?.id) {
      isInitializedRef.current = false;
    }
  }, [order?.id]);

  // Manejar el cierre del diálogo
  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  }, [isSubmitting, onOpenChange]);

  // Actualizar datos del cliente - con memoización para evitar re-renders
  const handleCustomerChange = useCallback(
    (customerData: { name: string; phone: string; address: string }) => {
      console.log("👤 Actualizando datos del cliente:", customerData);
      setFormData((prev) => ({
        ...prev,
        customer_name: customerData.name,
        customer_phone: customerData.phone,
        customer_address: customerData.address,
      }));
    },
    []
  );

  // Actualizar items de productos - con memoización
  const handleProductsChange = useCallback((items: OrderItem[]) => {
    console.log("📦 Actualizando productos:", items.length);
    setFormData((prev) => ({
      ...prev,
      items,
    }));
  }, []);

  // Actualizar detalles de entrega - con memoización
  const handleDeliveryChange = useCallback(
    (deliveryData: {
      scheduled_delivery_date?: string | Date;
      delivery_time_slot?: string | null;
      notes?: string | null;
      delivery_notes?: string | null;
    }) => {
      console.log("🚚 Actualizando detalles de entrega:", deliveryData);
      setFormData((prev) => ({
        ...prev,
        ...deliveryData,
      }));
    },
    []
  );

  // Validar datos del formulario
  const validateForm = useCallback(() => {
    if (!formData.customer_name || formData.customer_name.trim() === "") {
      toast.error("Debe proporcionar el nombre del cliente");
      setCurrentStep(0);
      return false;
    }

    if (!formData.customer_phone || formData.customer_phone.trim() === "") {
      toast.error("Debe proporcionar el teléfono del cliente");
      setCurrentStep(0);
      return false;
    }

    if (!formData.customer_address || formData.customer_address.trim() === "") {
      toast.error("Debe proporcionar la dirección del cliente");
      setCurrentStep(0);
      return false;
    }

    if (!formData.items || formData.items.length === 0) {
      toast.error("Debe agregar al menos un producto al pedido");
      setCurrentStep(1);
      return false;
    }

    return true;
  }, [formData]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async () => {
    if (!order?.id) {
      toast.error("No se puede actualizar el pedido: ID no disponible");
      return;
    }

    // Validar datos antes de enviar
    if (!validateForm()) return;

    try {
      console.log("💾 Enviando actualización del pedido:", order.id);
      const formattedDate = formatDateForDB(formData.scheduled_delivery_date);

      // Preparar datos para envío
      const dataToUpdate: Partial<Order> = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_address: formData.customer_address,
        items: formData.items?.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          notes: item.notes || null,
        })),
        scheduled_delivery_date: formattedDate,
        delivery_time_slot: formData.delivery_time_slot,
        notes: formData.notes,
        delivery_notes: formData.delivery_notes,
      };

      await updateOrderMutation.mutateAsync({
        id: order.id,
        data: dataToUpdate,
      });

      handleClose();
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
    }
  }, [order, formData, updateOrderMutation, handleClose, validateForm]);

  // Si no hay un pedido, no mostrar nada
  if (!order) return null;

  // Determinar si es un cliente registrado
  const isRegisteredCustomer = !!order.customer_id;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <FileEdit className="h-5 w-5 text-white" />
            </div>
            Actualizar Pedido
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Modifique la información del pedido según sea necesario
          </DialogDescription>

          <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                Código de seguimiento
              </span>
              <span className="font-mono text-lg text-blue-600">
                {order.tracking_code}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-500">
                {format(
                  new Date(order.order_date || ""),
                  "dd 'de' MMMM yyyy, hh:mm a",
                  { locale: es }
                )}
              </span>
              <div className="flex gap-2 mt-1">
                <OrderStatusBadge status={order.order_status || "pendiente"} />
                {isRegisteredCustomer && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                    Cliente Registrado
                  </span>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Stepper compacto */}
        <div className="flex justify-between items-center py-4 px-2 bg-gray-50/50 rounded-xl">
          {STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={() => setCurrentStep(index)}
                    disabled={isSubmitting}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-200",
                      isActive
                        ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                        : isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </button>
                  <div className="hidden sm:block">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isActive
                          ? "text-blue-600"
                          : isCompleted
                            ? "text-green-600"
                            : "text-gray-500"
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

        {/* Contenido del formulario con animaciones */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-1">
            {/* Paso 1: Cliente */}
            {currentStep === 0 && (
              <div className="animate-in slide-in-from-right-5 duration-300">
                <Card className="border-0 shadow-none bg-transparent">
                  <CardHeader className="px-0 pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Información del Cliente
                    </CardTitle>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                      <div className="flex gap-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full flex-shrink-0 mt-0.5">
                          <Info className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-blue-800 font-medium">
                            {isRegisteredCustomer
                              ? "Cliente Registrado"
                              : "Cliente del Pedido"}
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            {isRegisteredCustomer
                              ? "Este pedido pertenece a un cliente registrado. Solo puedes editar la dirección de entrega."
                              : "Estás editando la información del cliente para este pedido específico."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-0">
                    <CustomerEditCard
                      key={`customer-${order.id}-${formData.customer_id}`}
                      initialCustomerData={{
                        name: formData.customer_name || "",
                        phone: formData.customer_phone || "",
                        address: formData.customer_address || "",
                      }}
                      customerId={formData.customer_id}
                      onCustomerChange={handleCustomerChange}
                      isRegisteredCustomer={isRegisteredCustomer}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Paso 2: Productos */}
            {currentStep === 1 && (
              <div className="animate-in slide-in-from-right-5 duration-300">
                <ProductSelector
                  products={products}
                  selectedItems={formData.items || []}
                  onChange={handleProductsChange}
                  isLoading={isLoadingProducts}
                />
              </div>
            )}

            {/* Paso 3: Entrega */}
            {currentStep === 2 && (
              <div className="animate-in slide-in-from-right-5 duration-300">
                <Card className="border-0 shadow-none bg-transparent">
                  <CardHeader className="px-0 pb-6">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Detalles de Entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <DeliveryDetails
                      initialData={{
                        scheduled_delivery_date:
                          formData.scheduled_delivery_date,
                        delivery_time_slot: formData.delivery_time_slot,
                        notes: formData.notes,
                        delivery_notes: formData.delivery_notes,
                      }}
                      onChange={handleDeliveryChange}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Footer con navegación mejorada */}
        <DialogFooter className="pt-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex justify-between items-center w-full gap-4">
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={isSubmitting}
                  className="gap-2 px-6"
                >
                  ← Anterior
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                Paso {currentStep + 1} de {STEPS.length}
              </span>

              {currentStep < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={isSubmitting}
                  className="gap-2 px-6 bg-blue-600 hover:bg-blue-700"
                >
                  Siguiente →
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2 px-8 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-600/25"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
