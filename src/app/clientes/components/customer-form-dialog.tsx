// src/app/clientes/components/customer-form-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCustomer, useCreateCustomer, useUpdateCustomer } from "@/hooks/useCustomers";
import { Customer } from "@/types/customers.types";
import { LoaderSpin } from "@/components/Loader";

// Define el esquema de validación
const customerSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  contact_phone: z.string().min(10, { message: "El teléfono debe tener al menos 10 caracteres" }),
  contact_email: z.string().email({ message: "Email inválido" }).optional().or(z.literal("")),
  address: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres" }),
  is_business: z.boolean().default(false),
  business_name: z.string().optional().or(z.literal("")),
  rnc: z.string().optional().or(z.literal("")),
  location_reference: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  status: z.enum(["activo", "inactivo"]).default("activo"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormDialogProps {
  customerId?: number; // Optional - if provided, we're editing
  open: boolean;
  onClose: () => void;
}

export function CustomerFormDialog({ 
  customerId, 
  open, 
  onClose 
}: CustomerFormDialogProps) {
  const isEditing = !!customerId;
  
  // Get customer data if editing
  const { data: customerData, isLoading: isLoadingCustomer } = useCustomer(
    customerId || 0, 
    { enabled: isEditing }
  );
  
  // Mutations
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  
  // Business toggle state
  const [isBusinessCustomer, setIsBusinessCustomer] = useState(false);
  
  // Define form
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
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
  
  // Update form when customer data is loaded
  useEffect(() => {
    if (customerData?.data && isEditing) {
      const customer = customerData.data;
      
      form.reset({
        name: customer.name || "",
        contact_phone: customer.contact_phone || "",
        contact_email: customer.contact_email || "",
        address: customer.address || "",
        is_business: customer.is_business || false,
        business_name: customer.business_name || "",
        rnc: customer.rnc || "",
        location_reference: customer.location_reference || "",
        notes: customer.notes || "",
        status: customer.status || "activo",
      });
      
      setIsBusinessCustomer(customer.is_business || false);
    }
  }, [customerData, form, isEditing]);
  
  // Handle form submission
  const onSubmit = (values: CustomerFormValues) => {
    if (isEditing && customerId) {
      updateCustomer.mutate(
        { 
          id: customerId, 
          customer: values 
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createCustomer.mutate(
        values as Customer,
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };
  
  // Watch is_business to update UI
  const watchIsBusiness = form.watch("is_business");
  
  useEffect(() => {
    setIsBusinessCustomer(watchIsBusiness);
  }, [watchIsBusiness]);
  
  const isPending = createCustomer.isPending || updateCustomer.isPending;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Cliente" : "Crear Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Actualiza la información del cliente existente" 
              : "Completa el formulario para crear un nuevo cliente"}
          </DialogDescription>
        </DialogHeader>
        
        {isEditing && isLoadingCustomer ? (
          <div className="py-8 flex justify-center">
            <LoaderSpin text="Cargando datos del cliente" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Switch para tipo de cliente */}
              <FormField
                control={form.control}
                name="is_business"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Tipo de Cliente</FormLabel>
                      <FormDescription>
                        {field.value ? "Cliente Empresarial" : "Cliente Personal"}
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
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Datos personales */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isBusinessCustomer ? "Contacto" : "Nombre"}</FormLabel>
                        <FormControl>
                          <Input placeholder={isBusinessCustomer ? "Nombre de contacto" : "Nombre completo"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Campo de nombre de empresa (solo si es empresa) */}
                  {isBusinessCustomer && (
                    <FormField
                      control={form.control}
                      name="business_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de la Empresa</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre comercial" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contact_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(809) 555-5555" {...field} />
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
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>