// src/app/clientes/components/customer-form-dialog.tsx
"use client";

import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Customer } from "@/types/customers.types";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/useCustomers";
import { toast } from "sonner";

// Esquema de validación con Zod
const customerFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(100, { message: "El nombre no puede exceder los 100 caracteres" }),
  contact_phone: z
    .string()
    .min(10, { message: "El teléfono debe tener al menos 10 caracteres" })
    .max(11, { message: "El teléfono no puede exceder los 11 caracteres" }),
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
  location_reference: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  status: z.enum(["activo", "inactivo"]).default("activo"),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer | null;
  onSuccess?: () => void;
}

export function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
  onSuccess,
}: CustomerFormDialogProps) {
  const [isBusinessExpanded, setIsBusinessExpanded] = useState(false);
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();

  const isEditMode = !!customer?.id;

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      contact_phone: "",
      contact_email: "",
      address: "",
      is_business: false,
      business_name: "",
      rnc: "",
      location_reference: "",
      notes: "",
      status: "activo",
    },
  });

  // Actualizar formulario cuando se edita un cliente existente
  useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name,
        contact_phone: customer.contact_phone,
        contact_email: customer.contact_email || "",
        address: customer.address,
        is_business: customer.is_business || false,
        business_name: customer.business_name || "",
        rnc: customer.rnc || "",
        location_reference: customer.location_reference || "",
        notes: customer.notes || "",
        status: customer.status || "activo",
      });

      // Expandir sección de empresa si es necesario
      setIsBusinessExpanded(customer.is_business || false);
    } else {
      // Resetear formulario para crear nuevo cliente
      form.reset({
        name: "",
        contact_phone: "",
        contact_email: "",
        address: "",
        is_business: false,
        business_name: "",
        rnc: "",
        location_reference: "",
        notes: "",
        status: "activo",
      });
      setIsBusinessExpanded(false);
    }
  }, [customer, form]);

  // Observador para campo is_business
  const watchIsBusinessField = form.watch("is_business");
  useEffect(() => {
    setIsBusinessExpanded(watchIsBusinessField);
  }, [watchIsBusinessField]);

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      if (isEditMode) {
        // Actualizar cliente existente
        await updateCustomerMutation.mutateAsync({
          id: customer!.id as number,
          customer: data,
        });
        toast.success("Cliente actualizado exitosamente");
      } else {
        // Crear nuevo cliente
        await createCustomerMutation.mutateAsync(data);
        toast.success("Cliente creado exitosamente");
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifique los datos del cliente y guarde los cambios."
              : "Complete los datos para crear un nuevo cliente."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Datos básicos */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono de contacto</FormLabel>
                  <FormControl>
                    <Input placeholder="Teléfono" {...field} />
                  </FormControl>
                  <FormMessage />
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

            {/* Datos de empresa */}
            <FormField
              control={form.control}
              name="is_business"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Es una empresa</FormLabel>
                    <FormDescription>
                      Active esta opción si el cliente es una empresa
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {isBusinessExpanded && (
              <div className="space-y-4 border-l-2 pl-4 border-blue-200">
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre comercial</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre de la empresa" {...field} />
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

            {/* Campos adicionales */}
            <FormField
              control={form.control}
              name="location_reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referencia de ubicación (opcional)</FormLabel>
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

            {/* Estado (solo visible en edición) */}
            {isEditMode && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Cliente activo</FormLabel>
                      <FormDescription>
                        Desactive para marcar este cliente como inactivo
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === "activo"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "activo" : "inactivo")
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  createCustomerMutation.isPending ||
                  updateCustomerMutation.isPending
                }
              >
                {createCustomerMutation.isPending ||
                updateCustomerMutation.isPending
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
}
