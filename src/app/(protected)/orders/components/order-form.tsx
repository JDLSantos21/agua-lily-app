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
import {
  Loader2,
  PlusCircle,
  Users,
  Package,
  Truck,
  FileText,
  CheckCircle,
} from "lucide-react";
import { CreateOrderRequest, OrderItem } from "@/types/orders.types";
import { toast } from "sonner";
import CustomerSelector from "./order-form/customer-selector";
import ProductSelector from "./order-form/product-selector";
import DeliveryDetails from "./order-form/delivery-details";
import OrderSummary from "./order-form/order-summary";
import { cn } from "@/lib/utils";

// Nuevos imports de TanStack Query
import { useProducts, useCreateOrder } from "@/hooks/useOrders";
import { format } from "@formkit/tempo";

interface OrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Estructura de pasos para crear un pedido
const STEPS = [
  {
    id: "customer",
    title: "Cliente",
    icon: Users,
    description: "Información del cliente",
  },
  {
    id: "products",
    title: "Productos",
    icon: Package,
    description: "Seleccionar productos",
  },
  {
    id: "delivery",
    title: "Entrega",
    icon: Truck,
    description: "Detalles de entrega",
  },
  {
    id: "summary",
    title: "Resumen",
    icon: FileText,
    description: "Confirmar pedido",
  },
];

export default function OrderForm({ open, onOpenChange }: OrderFormProps) {
  // Estado del formulario
  const [currentStep, setCurrentStep] = useState(0);

  // Form data
  const [formData, setFormData] = useState<CreateOrderRequest>({
    customer_id: null,
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    customer_has_whatsapp: false, // ← NUEVO
    save_customer: false, // ← NUEVO
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
        customer_has_whatsapp: false, // ← CAMBIO: Agregar esta línea
        save_customer: false, // ← CAMBIO: Agregar esta línea
        items: [],
        scheduled_delivery_date: undefined,
        delivery_time_slot: null,
        notes: null,
        delivery_notes: null,
      });

      // Resetear el paso
      setCurrentStep(0);
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
        hasWhatsapp: boolean; // ← CAMBIO: Agregar este parámetro
      },
      saveCustomer: boolean
    ) => {
      setFormData((prev) => ({
        ...prev,
        customer_id: customerId,
        customer_name: customerData.name,
        customer_phone: customerData.phone,
        customer_address: customerData.address,
        customer_has_whatsapp: customerData.hasWhatsapp, // ← CAMBIO: Agregar esta línea
        save_customer: saveCustomer, // ← CAMBIO: Agregar esta línea
      }));

      // setSaveNewCustomer(saveCustomer);
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
      scheduled_delivery_date?: string | Date;
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

    formData.customer_has_whatsapp == true
      ? (formData.customer_has_whatsapp = true)
      : (formData.customer_has_whatsapp = false);

    if (formData.scheduled_delivery_date) {
      // Convertir la fecha a formato UTC
      formData.scheduled_delivery_date =
        typeof formData.scheduled_delivery_date === "string"
          ? new Date(formData.scheduled_delivery_date)
          : formData.scheduled_delivery_date;

      // Formatear la fecha a "DD-MM-YYYY"
      formData.scheduled_delivery_date = format(
        formData.scheduled_delivery_date,
        "YYYY-MM-DD"
      );
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
      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <PlusCircle className="h-5 w-5 text-white" />
            </div>
            Crear Nuevo Pedido
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Complete la información requerida para crear un nuevo pedido
          </DialogDescription>
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
                <CustomerSelector
                  initialCustomerId={formData.customer_id || null}
                  initialCustomerData={{
                    name: formData.customer_name,
                    phone: formData.customer_phone,
                    address: formData.customer_address,
                    hasWhatsapp: formData.customer_has_whatsapp,
                  }}
                  onCustomerChange={handleCustomerChange}
                  saveCustomer={formData.save_customer ?? false}
                  onSaveCustomerChange={(save) =>
                    setFormData((prev) => ({ ...prev, save_customer: save }))
                  }
                />
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
                <DeliveryDetails
                  initialData={{
                    scheduled_delivery_date: formData.scheduled_delivery_date,
                    delivery_time_slot: formData.delivery_time_slot,
                    notes: formData.notes,
                    delivery_notes: formData.delivery_notes,
                  }}
                  onChange={handleDeliveryChange}
                />
              </div>
            )}

            {/* Paso 4: Resumen */}
            {currentStep === 3 && (
              <div className="animate-in slide-in-from-right-5 duration-300">
                <OrderSummary
                  orderData={formData}
                  products={products}
                  saveCustomer={formData.save_customer ?? false}
                />
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
                  onClick={prevStep}
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
                  onClick={nextStep}
                  disabled={isSubmitting || !canContinue()}
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
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Crear Pedido
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
