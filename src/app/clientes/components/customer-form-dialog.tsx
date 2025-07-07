// src/app/clientes/components/customer-form-dialog.tsx - VERSIÓN CON WHATSAPP
"use client";

import { useEffect, useState, memo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Customer, CustomerStatus } from "@/types/customers.types";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/useCustomers";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { IoLogoWhatsapp } from "react-icons/io5";

// Esquema de validación con Zod
const customerFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(100, { message: "El nombre no puede exceder los 100 caracteres" }),
  contact_phone: z
    .string()
    .min(10, { message: "El teléfono debe tener al menos 10 caracteres" })
    .max(20, { message: "El teléfono no puede exceder los 20 caracteres" }),
  has_whatsapp: z.boolean().default(false),
  contact_email: z
    .string()
    .email({ message: "Correo electrónico inválido" })
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(5, { message: "La dirección debe tener al menos 5 caracteres" })
    .max(255, { message: "La dirección no puede exceder los 255 caracteres" }),
  is_business: z.boolean().default(false),
  business_name: z
    .string()
    .max(100, {
      message: "El nombre comercial no puede exceder los 100 caracteres",
    })
    .optional()
    .or(z.literal("")),
  rnc: z
    .string()
    .max(20, { message: "El RNC no puede exceder los 20 caracteres" })
    .optional()
    .or(z.literal("")),
  location_reference: z
    .string()
    .max(500, { message: "La referencia no puede exceder los 500 caracteres" })
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(1000, { message: "Las notas no pueden exceder los 1000 caracteres" })
    .optional()
    .or(z.literal("")),
  status: z
    .enum([CustomerStatus.ACTIVE, CustomerStatus.INACTIVE])
    .default(CustomerStatus.ACTIVE),
});

// Validación condicional para empresas
const businessValidationSchema = customerFormSchema.refine(
  (data) => {
    // Si es una empresa, el nombre comercial es obligatorio
    if (
      data.is_business &&
      (!data.business_name || data.business_name.trim() === "")
    ) {
      return false;
    }
    return true;
  },
  {
    message: "El nombre comercial es obligatorio para clientes tipo empresa",
    path: ["business_name"],
  }
);

type CustomerFormValues = z.infer<typeof customerFormSchema>;

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer | null;
  onSuccess?: () => void;
}

export const CustomerFormDialog = memo(function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
  onSuccess,
}: CustomerFormDialogProps) {
  // Estados
  const [clientType, setClientType] = useState<"individual" | "business">(
    "individual"
  );

  // Mutations para crear y actualizar
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();

  const isEditMode = !!customer?.id;
  const isSubmitting =
    createCustomerMutation.isPending || updateCustomerMutation.isPending;

  // Configuración del formulario con React Hook Form
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(businessValidationSchema),
    defaultValues: {
      name: "",
      contact_phone: "",
      has_whatsapp: false,
      contact_email: "",
      address: "",
      is_business: false,
      business_name: "",
      rnc: "",
      location_reference: "",
      notes: "",
      status: CustomerStatus.ACTIVE,
    },
    mode: "onChange",
  });

  // Observador del campo is_business para sincronizar con el tipo de cliente
  const isBusinessValue = form.watch("is_business");

  // Actualizar formulario cuando se edita un cliente existente
  useEffect(() => {
    if (customer && open) {
      form.reset({
        name: customer.name,
        contact_phone: customer.contact_phone,
        has_whatsapp: customer.has_whatsapp ? true : false,
        contact_email: customer.contact_email || "",
        address: customer.address,
        is_business: customer.is_business || false,
        business_name: customer.business_name || "",
        rnc: customer.rnc || "",
        location_reference: customer.location_reference || "",
        notes: customer.notes || "",
        status: customer.status || CustomerStatus.ACTIVE,
      });

      // Establecer el tipo de cliente
      setClientType(customer.is_business ? "business" : "individual");
    } else if (open) {
      // Resetear formulario para crear nuevo cliente
      form.reset({
        name: "",
        contact_phone: "",
        has_whatsapp: false,
        contact_email: "",
        address: "",
        is_business: false,
        business_name: "",
        rnc: "",
        location_reference: "",
        notes: "",
        status: CustomerStatus.ACTIVE,
      });
      setClientType("individual");
    }
  }, [customer, form, open]);

  // Sincronizar el tipo de cliente con el campo is_business
  useEffect(() => {
    const newIsBusiness = clientType === "business";
    if (isBusinessValue !== newIsBusiness) {
      form.setValue("is_business", newIsBusiness);
    }
  }, [clientType, form, isBusinessValue]);

  // Manejar cambios de tipo de cliente
  const handleClientTypeChange = useCallback(
    (value: string) => {
      const newType = value as "individual" | "business";
      setClientType(newType);
      form.setValue("is_business", newType === "business");

      // Limpiar campos específicos de empresa si cambia a individual
      if (newType === "individual") {
        form.setValue("business_name", "");
        form.setValue("rnc", "");
      }
    },
    [form]
  );

  // Función para enviar el formulario
  const onSubmit = async (data: CustomerFormValues) => {
    try {
      if (isEditMode && customer) {
        // Actualizar cliente existente
        await updateCustomerMutation.mutateAsync({
          id: customer.id as number,
          customer: data,
        });
      } else {
        // Crear nuevo cliente
        await createCustomerMutation.mutateAsync(data);
      }

      // Cerrar el formulario y ejecutar callback de éxito
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      // El error ya está manejado por los hooks de mutación
      console.error("Error en formulario:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isSubmitting) {
          onOpenChange(isOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditMode ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifique los datos del cliente y guarde los cambios."
              : "Complete los datos para crear un nuevo cliente."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Selector de tipo de cliente */}
            {!isEditMode && (
              <Tabs
                value={clientType}
                onValueChange={handleClientTypeChange}
                className="w-full mb-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="individual"
                    className="flex items-center gap-1.5"
                  >
                    <User className="h-4 w-4" />
                    Individual
                  </TabsTrigger>
                  <TabsTrigger
                    value="business"
                    className="flex items-center gap-1.5"
                  >
                    <Building2 className="h-4 w-4" />
                    Empresa
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            {/* Si está en modo edición, mostrar el tipo como un banner informativo */}
            {isEditMode && (
              <div
                className={cn(
                  "w-full p-2.5 rounded-md flex items-center gap-2 mb-4",
                  isBusinessValue
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-slate-50 text-slate-700 border border-slate-200"
                )}
              >
                {isBusinessValue ? (
                  <>
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium">Cliente tipo empresa</span>
                  </>
                ) : (
                  <>
                    <User className="h-5 w-5" />
                    <span className="font-medium">Cliente individual</span>
                  </>
                )}
              </div>
            )}

            {/* Datos básicos */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nombre {!isBusinessValue ? "completo" : "de contacto"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          isBusinessValue
                            ? "Nombre del contacto principal"
                            : "Nombre del cliente"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campos específicos de empresa */}
              {isBusinessValue && (
                <div className="space-y-4 border-l-2 pl-4 py-2 border-blue-200">
                  <FormField
                    control={form.control}
                    name="business_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre comercial</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nombre de la empresa"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rnc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RNC</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Registro Nacional del Contribuyente"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Datos de contacto */}
              <div className="pt-2">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Datos de contacto
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contact_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Teléfono de contacto"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo WhatsApp */}
                  <FormField
                    control={form.control}
                    name="has_whatsapp"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="flex items-center gap-1.5">
                            <IoLogoWhatsapp className="h-4 w-4 text-green-600" />
                            Tiene WhatsApp
                          </FormLabel>
                          <FormDescription>
                            Este número telefónico tiene WhatsApp disponible
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="correo@ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Input placeholder="Dirección completa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Campos adicionales */}
              <div className="pt-2">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Información adicional
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="location_reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Referencia de ubicación (opcional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Punto de referencia u otras indicaciones"
                            className="resize-none"
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas adicionales (opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Información adicional sobre el cliente"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Estado (solo visible en edición) */}
              {isEditMode && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-4">
                      <div className="space-y-0.5">
                        <FormLabel>Cliente activo</FormLabel>
                        <FormDescription>
                          Desactive para marcar este cliente como inactivo
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === CustomerStatus.ACTIVE}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked
                                ? CustomerStatus.ACTIVE
                                : CustomerStatus.INACTIVE
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Guardando..."
                  : isEditMode
                    ? "Actualizar"
                    : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

export default CustomerFormDialog;
