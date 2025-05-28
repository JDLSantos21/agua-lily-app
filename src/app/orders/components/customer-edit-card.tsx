// src/app/orders/components/customer-edit-card.tsx
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Phone, MapPin, Search, InfoIcon, Building } from "lucide-react";
import { useCustomer } from "@/hooks/useCustomers";

interface CustomerEditCardProps {
  initialCustomerData: {
    name: string;
    phone: string;
    address: string;
  };
  customerId: number | null | undefined;
  onCustomerChange: (customerData: {
    name: string;
    phone: string;
    address: string;
  }) => void;
  isRegisteredCustomer?: boolean;
}

export default function CustomerEditCard({
  initialCustomerData,
  customerId,
  onCustomerChange,
  isRegisteredCustomer = false,
}: CustomerEditCardProps) {
  // Estados locales
  const [customerName, setCustomerName] = useState(
    initialCustomerData.name || ""
  );
  const [customerPhone, setCustomerPhone] = useState(
    initialCustomerData.phone || ""
  );
  const [customerAddress, setCustomerAddress] = useState(
    initialCustomerData.address || ""
  );

  // Si hay un customer_id, obtener su información
  const { data: customerData, isLoading: isLoadingCustomer } = useCustomer(
    customerId || 0
  );

  // Actualizar estados cuando cambian datos iniciales
  useEffect(() => {
    setCustomerName(initialCustomerData.name || "");
    setCustomerPhone(initialCustomerData.phone || "");
    setCustomerAddress(initialCustomerData.address || "");
  }, [initialCustomerData]);

  // Establecer datos del cliente si se carga desde la BD
  useEffect(() => {
    if (customerData?.data && isRegisteredCustomer) {
      const customer = customerData.data;

      // Para clientes registrados, usar business_name si existe, sino name
      const displayName = customer.business_name || customer.name;

      setCustomerName(displayName);
      setCustomerPhone(customer.contact_phone);

      // Solo actualizar la dirección si no hay una personalizada
      if (!customerAddress || customerAddress === customer.address) {
        setCustomerAddress(customer.address);
      }
    }
  }, [customerData, isRegisteredCustomer, customerAddress]);

  // Propagar cambios hacia el componente padre
  useEffect(() => {
    onCustomerChange({
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
    });
  }, [customerName, customerPhone, customerAddress, onCustomerChange]);

  return (
    <Card className="border-blue-100">
      <CardContent className="pt-6 space-y-5">
        {isRegisteredCustomer && (
          <div className="bg-blue-50 p-3 rounded-md text-sm mb-2 flex items-start">
            <InfoIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-600 font-medium">Cliente registrado</p>
              <p className="text-blue-500 mt-1">
                Este pedido está asociado a un cliente registrado (ID:{" "}
                {customerId}). Los datos del cliente no se pueden modificar
                desde aquí. Solo puedes cambiar la dirección de entrega para
                este pedido específico.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="customer-name" className="flex items-center gap-1">
              {isRegisteredCustomer ? (
                <Building className="h-4 w-4 text-gray-500" />
              ) : (
                <User className="h-4 w-4 text-gray-500" />
              )}
              {isRegisteredCustomer
                ? "Nombre de la empresa/cliente"
                : "Nombre del cliente"}{" "}
              *
            </Label>
            <div className="relative">
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={
                  isRegisteredCustomer
                    ? "Nombre de la empresa"
                    : "Nombre completo"
                }
                className="pl-10"
                required
                disabled={isRegisteredCustomer}
                readOnly={isRegisteredCustomer}
              />
              {isRegisteredCustomer ? (
                <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              ) : (
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              )}
            </div>
            {isRegisteredCustomer && (
              <p className="text-xs text-gray-500">
                Este campo no se puede editar para clientes registrados
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="customer-phone" className="flex items-center gap-1">
              <Phone className="h-4 w-4 text-gray-500" />
              Teléfono de contacto *
            </Label>
            <div className="relative">
              <Input
                id="customer-phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Ej. 829-555-1234"
                className="pl-10"
                required
                disabled={isRegisteredCustomer}
                readOnly={isRegisteredCustomer}
              />
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {isRegisteredCustomer && (
              <p className="text-xs text-gray-500">
                Este campo no se puede editar para clientes registrados
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="customer-address"
              className="flex items-center gap-1"
            >
              <MapPin className="h-4 w-4 text-gray-500" />
              Dirección de entrega *
            </Label>
            <div className="relative">
              <Textarea
                id="customer-address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder={
                  isRegisteredCustomer
                    ? "Dirección específica para este pedido (puede ser diferente a la registrada)"
                    : "Dirección completa para entrega"
                }
                rows={3}
                className="resize-none pl-10 pt-2"
                required
              />
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {isRegisteredCustomer && (
              <p className="text-xs text-blue-600">
                Puedes modificar la dirección de entrega para este pedido
                específico
              </p>
            )}
          </div>
        </div>

        {isRegisteredCustomer && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full gap-1"
            onClick={() => {
              window.open(`/customers/${customerId}`, "_blank");
            }}
          >
            <Search className="h-3.5 w-3.5" />
            Ver información completa del cliente
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
