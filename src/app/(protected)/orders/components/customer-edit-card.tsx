// src/app/orders/components/customer-edit-card.tsx
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
import { User, Phone, MapPin, Building } from "lucide-react";
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

  // Ref para controlar si ya se inicializó con datos del cliente registrado
  const isInitializedRef = useRef(false);
  const lastNotifiedDataRef = useRef<string>("");

  // Si hay un customer_id, obtener su información
  const { data: customerData } = useCustomer(customerId || 0);

  // Actualizar estados cuando cambian datos iniciales - SOLO una vez al inicio
  useEffect(() => {
    if (!isInitializedRef.current) {
      setCustomerName(initialCustomerData.name || "");
      setCustomerPhone(initialCustomerData.phone || "");
      setCustomerAddress(initialCustomerData.address || "");
      isInitializedRef.current = true;
    }
  }, [initialCustomerData]);

  // Establecer datos del cliente registrado - SOLO una vez cuando se cargan
  useEffect(() => {
    if (
      customerData?.data &&
      isRegisteredCustomer &&
      !isInitializedRef.current
    ) {
      const customer = customerData.data;

      // Para clientes registrados, usar business_name si existe, sino name
      const displayName = customer.business_name || customer.name;

      setCustomerName(displayName);
      setCustomerPhone(customer.contact_phone);
      setCustomerAddress(customer.address);

      isInitializedRef.current = true;
    }
  }, [customerData, isRegisteredCustomer]);

  // Manejar cambios en los inputs - con debounce implícito
  const handleNameChange = (value: string) => {
    setCustomerName(value);
    // Notificar inmediatamente para inputs de texto
    notifyParentChange(value, customerPhone, customerAddress);
  };

  const handlePhoneChange = (value: string) => {
    setCustomerPhone(value);
    notifyParentChange(customerName, value, customerAddress);
  };

  const handleAddressChange = (value: string) => {
    setCustomerAddress(value);
    notifyParentChange(customerName, customerPhone, value);
  };

  // Función para notificar cambios al padre - con verificación de cambios
  const notifyParentChange = (name: string, phone: string, address: string) => {
    const currentData = JSON.stringify({ name, phone, address });

    // Solo notificar si los datos realmente cambiaron
    if (currentData !== lastNotifiedDataRef.current) {
      lastNotifiedDataRef.current = currentData;
      onCustomerChange({ name, phone, address });
    }
  };

  // Resetear inicialización cuando cambia el customerId
  useEffect(() => {
    isInitializedRef.current = false;
  }, [customerId]);

  return (
    <Card className="border-blue-100">
      <CardContent className="pt-5 space-y-5">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="customer-name" className="flex items-center gap-1 ">
              {isRegisteredCustomer
                ? "Nombre de la empresa/cliente"
                : "Nombre del cliente"}{" "}
              *
            </Label>
            <div className="relative">
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => handleNameChange(e.target.value)}
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
            <Label htmlFor="customer-phone" className="flex items-center">
              Teléfono de contacto *
            </Label>
            <div className="relative">
              <Input
                id="customer-phone"
                value={customerPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="Ej. 8295551234"
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
              Dirección de entrega *
            </Label>
            <div className="relative">
              <Input
                id="customer-address"
                value={customerAddress}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder={
                  isRegisteredCustomer
                    ? "Dirección específica para este pedido (puede ser diferente a la registrada)"
                    : "Dirección completa para entrega"
                }
                className="resize-none pl-10 pt-2"
                required
              />
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            {isRegisteredCustomer && (
              <p className="text-xs text-blue-600">
                Solo se modificará la dirección para este pedido en especifico.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
