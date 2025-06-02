// src/app/orders/components/order-form.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Loader2, PlusCircle } from "lucide-react";
import { CreateOrderRequest, OrderItem } from "@/types/orders.types";
import { toast } from "sonner";
import CustomerSelector from "./order-form/customer-selector";
import ProductSelector from "./order-form/product-selector";
import DeliveryDetails from "./order-form/delivery-details";
import OrderSummary from "./order-form/order-summary";

// Nuevos imports de TanStack Query
import { useProducts, useCreateOrder } from "@/hooks/useOrders";

interface OrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Estructura de pasos para crear un pedido
const STEPS = ["customer", "products", "delivery", "summary"];

export default function OrderForm({ open, onOpenChange }: OrderFormProps) {
  // Estado del formulario
  const [currentStep, setCurrentStep] = useState(0);
  const [saveNewCustomer, setSaveNewCustomer] = useState(false);

  // Form data
  const [formData, setFormData] = useState<CreateOrderRequest>({
    customer_id: null,
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    items: [],
    scheduled_delivery_date: undefined,
    delivery_time_slot: null,
    notes: null,
    delivery_notes: null,
  });

  // Consultas y mutaciones con TanStack Query
  const { data: productsResponse, isLoading: isLoadingProducts } =
    useProducts();

  const createOrderMutation = useCreateOrder();

  const isSubmitting = createOrderMutation.isPending;
  const products = productsResponse?.data || [];

  // Efecto para resetear el formulario al abrirlo
  useEffect(() => {
    if (open) {
      // Resetear el formulario
      setFormData({
        customer_id: null,
        customer_name: "",
        customer_phone: "",
        customer_address: "",
        items: [],
        scheduled_delivery_date: undefined,
        delivery_time_slot: null,
        notes: null,
        delivery_notes: null,
      });

      // Resetear el paso
      setCurrentStep(0);
      setSaveNewCustomer(false);
    }
  }, [open]);

  // Manejar el cierre del diálogo
  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  }, [isSubmitting, onOpenChange]);

  // Actualizar datos del cliente
  const handleCustomerChange = useCallback(
    (
      customerId: number | null,
      customerData: {
        name: string;
        phone: string;
        address: string;
      },
      saveCustomer: boolean
    ) => {
      setFormData((prev) => ({
        ...prev,
        customer_id: customerId,
        customer_name: customerData.name,
        customer_phone: customerData.phone,
        customer_address: customerData.address,
      }));

      setSaveNewCustomer(saveCustomer);
    },
    []
  );

  // Actualizar items de productos
  const handleProductsChange = useCallback((items: OrderItem[]) => {
    setFormData((prev) => ({
      ...prev,
      items,
    }));
  }, []);

  // Actualizar detalles de entrega
  const handleDeliveryChange = useCallback(
    (deliveryData: {
      scheduled_delivery_date?: string;
      delivery_time_slot?: string | null;
      notes?: string | null;
      delivery_notes?: string | null;
    }) => {
      setFormData((prev) => ({
        ...prev,
        ...deliveryData,
      }));
    },
    []
  );

  // Manejar envío del formulario
  const handleSubmit = useCallback(async () => {
    // Validar datos antes de enviar
    if (!formData.customer_name || formData.customer_name.trim() === "") {
      toast.error("Debe proporcionar el nombre del cliente");
      setCurrentStep(0);
      return;
    }

    if (!formData.customer_phone || formData.customer_phone.trim() === "") {
      toast.error("Debe proporcionar el teléfono del cliente");
      setCurrentStep(0);
      return;
    }

    if (!formData.customer_address || formData.customer_address.trim() === "") {
      toast.error("Debe proporcionar la dirección del cliente");
      setCurrentStep(0);
      return;
    }

    if (!formData.items || formData.items.length === 0) {
      toast.error("Debe agregar al menos un producto al pedido");
      setCurrentStep(1);
      return;
    }

    try {
      // Crear un nuevo pedido
      await createOrderMutation.mutateAsync(formData);

      // Si todo va bien, cerrar el formulario
      handleClose();
    } catch (error) {
      console.error("Error al procesar pedido:", error);
      // El toast ya se maneja en los hooks de mutación
    }
  }, [formData, createOrderMutation, handleClose]);

  // Navegación entre pasos
  const nextStep = useCallback(() => {
    if (
      currentStep === 0 &&
      (!formData.customer_name ||
        !formData.customer_phone ||
        !formData.customer_address)
    ) {
      toast.error("Complete todos los campos del cliente");
      return;
    }

    if (currentStep === 1 && (!formData.items || formData.items.length === 0)) {
      toast.error("Debe agregar al menos un producto al pedido");
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, formData]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Verificar si puede continuar al siguiente paso
  const canContinue = useCallback(() => {
    if (currentStep === 0) {
      return (
        formData.customer_name &&
        formData.customer_phone &&
        formData.customer_address
      );
    }
    if (currentStep === 1) {
      return formData.items && formData.items.length > 0;
    }
    return true;
  }, [currentStep, formData]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-1">
            <PlusCircle className="h-5 w-5 text-green-500" />
            Crear Nuevo Pedido
          </DialogTitle>
          <DialogDescription>
            Complete todos los datos requeridos para crear un nuevo pedido
          </DialogDescription>
        </DialogHeader>

        <Tabs value={STEPS[currentStep]} className="mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger
              value="customer"
              onClick={() => setCurrentStep(0)}
              disabled={isSubmitting}
            >
              Cliente
            </TabsTrigger>
            <TabsTrigger
              value="products"
              onClick={() => setCurrentStep(1)}
              disabled={isSubmitting}
            >
              Productos
            </TabsTrigger>
            <TabsTrigger
              value="delivery"
              onClick={() => setCurrentStep(2)}
              disabled={isSubmitting}
            >
              Entrega
            </TabsTrigger>
            <TabsTrigger
              value="summary"
              onClick={() => setCurrentStep(3)}
              disabled={isSubmitting}
            >
              Resumen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="space-y-4">
            <CustomerSelector
              initialCustomerId={formData.customer_id || null}
              initialCustomerData={{
                name: formData.customer_name,
                phone: formData.customer_phone,
                address: formData.customer_address,
              }}
              onCustomerChange={handleCustomerChange}
              saveCustomer={saveNewCustomer}
              onSaveCustomerChange={setSaveNewCustomer}
            />
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <ProductSelector
              products={products}
              selectedItems={formData.items || []}
              onChange={handleProductsChange}
              isLoading={isLoadingProducts}
            />
          </TabsContent>

          <TabsContent value="delivery" className="space-y-4">
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

          <TabsContent value="summary" className="space-y-4">
            <OrderSummary
              orderData={formData}
              products={products}
              saveCustomer={saveNewCustomer}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center mt-6 gap-2">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="back"
              onClick={prevStep}
              disabled={isSubmitting || currentStep === 0}
            >
              Anterior
            </Button>
          )}
          <div className="flex-grow"></div>

          {currentStep < STEPS.length - 1 ? (
            <Button
              variant="next"
              type="button"
              onClick={nextStep}
              disabled={isSubmitting || !canContinue()}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Crear Pedido"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
