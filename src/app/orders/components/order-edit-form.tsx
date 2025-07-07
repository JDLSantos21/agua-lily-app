// src/app/orders/components/order-edit-form.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Info, FileEdit, Package, Truck } from "lucide-react";
import { Order, OrderItem } from "@/types/orders.types";
import { toast } from "sonner";
import ProductSelector from "./order-form/product-selector";
import DeliveryDetails from "./order-form/delivery-details";
import OrderStatusBadge from "./order-status-badge";
import { format } from "date-fns";

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

// Estructura de secciones para editar un pedido
// const TABS = ["info", "products", "delivery"];

export default function OrderEditForm({
  open,
  onOpenChange,
  order,
}: OrderEditFormProps) {
  // Estado del formulario
  const [activeTab, setActiveTab] = useState("info");
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
      setActiveTab("info");
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
      setActiveTab("info");
      return false;
    }

    if (!formData.customer_phone || formData.customer_phone.trim() === "") {
      toast.error("Debe proporcionar el teléfono del cliente");
      setActiveTab("info");
      return false;
    }

    if (!formData.customer_address || formData.customer_address.trim() === "") {
      toast.error("Debe proporcionar la dirección del cliente");
      setActiveTab("info");
      return false;
    }

    if (!formData.items || formData.items.length === 0) {
      toast.error("Debe agregar al menos un producto al pedido");
      setActiveTab("products");
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
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="w-full">
              <DialogTitle className="text-xl flex items-center gap-2">
                <FileEdit className="h-5 w-5 text-blue-500" />
                Actualizar Pedido
              </DialogTitle>
              <div className="w-full flex items-center justify-between gap-2 mt-1 text-sm text-gray-500">
                <div className="text-sm text-gray-500 flex flex-col">
                  <span className="font-mono">{order.tracking_code}</span>
                  {format(
                    new Date(order.order_date || ""),
                    "EEEE dd 'de' MMMM yyyy, hh:mm a",
                    { locale: es }
                  )}
                </div>
                <div className="flex gap-1">
                  <OrderStatusBadge
                    status={order.order_status || "pendiente"}
                  />
                  {isRegisteredCustomer && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-600"
                    >
                      Cliente Registrado
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger
              value="info"
              className="flex items-center gap-1"
              disabled={isSubmitting}
            >
              <Info className="h-4 w-4" />
              Cliente
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center gap-1"
              disabled={isSubmitting}
            >
              <Package className="h-4 w-4" />
              Productos
            </TabsTrigger>
            <TabsTrigger
              value="delivery"
              className="flex items-center gap-1"
              disabled={isSubmitting}
            >
              <Truck className="h-4 w-4" />
              Entrega
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-md mb-4">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800">
                    {isRegisteredCustomer
                      ? "Este pedido pertenece a un cliente registrado. Solo puedes editar la dirección de entrega."
                      : "Estás editando la información del cliente para este pedido. Si deseas cambiar el estado del pedido, usa la opción 'Cambiar estado' desde la vista de detalles."}
                  </p>
                </div>
              </div>
            </div>
            <CustomerEditCard
              key={`customer-${order.id}-${formData.customer_id}`} // Key único para forzar re-mount
              initialCustomerData={{
                name: formData.customer_name || "",
                phone: formData.customer_phone || "",
                address: formData.customer_address || "",
              }}
              customerId={formData.customer_id}
              onCustomerChange={handleCustomerChange}
              isRegisteredCustomer={isRegisteredCustomer}
            />
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-500" />
                Productos del Pedido
              </h3>
              <Badge variant="outline" className="bg-blue-50 text-blue-600">
                {formData.items?.length || 0} productos
              </Badge>
            </div>
            <ProductSelector
              products={products}
              selectedItems={formData.items || []}
              onChange={handleProductsChange}
              isLoading={isLoadingProducts}
            />
          </TabsContent>

          <TabsContent value="delivery" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Truck className="h-5 w-5 text-gray-500" />
                Detalles de Entrega
              </h3>
            </div>
            <DeliveryDetails
              initialData={{
                scheduled_delivery_date: formData.scheduled_delivery_date,
                delivery_time_slot: formData.delivery_time_slot,
                notes: formData.notes,
                delivery_notes: formData.delivery_notes,
              }}
              onChange={handleDeliveryChange}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center mt-6 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando cambios...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
