// src/app/orders/components/order-form/customer-edit-card.tsx
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { User, Phone, MapPin, Search, InfoIcon } from "lucide-react";
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
}

export default function CustomerEditCard({
  initialCustomerData,
  customerId,
  onCustomerChange,
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

  // Actualizar estados cuando cambian datos iniciales o el cliente cargado
  useEffect(() => {
    setCustomerName(initialCustomerData.name || "");
    setCustomerPhone(initialCustomerData.phone || "");
    setCustomerAddress(initialCustomerData.address || "");
  }, [initialCustomerData]);

  // Establecer datos del cliente si se carga desde la BD
  useEffect(() => {
    if (customerData?.data) {
      const customer = customerData.data;
      // No sobreescribimos si ya existen datos personalizados
      if (!customerName && customer.business_name) {
        setCustomerName(customer.business_name);
      }
      if (!customerPhone && customer.contact_phone) {
        setCustomerPhone(customer.contact_phone);
      }
      if (!customerAddress && customer.address) {
        setCustomerAddress(customer.address);
      }
    }
  }, [customerData, customerName, customerPhone, customerAddress]);

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
        {customerId && (
          <div className="bg-blue-50 p-3 rounded-md text-sm mb-2 flex items-start">
            <InfoIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-600 font-medium">Cliente registrado</p>
              <p className="text-blue-500 mt-1">
                Este pedido está asociado a un cliente registrado (ID:{" "}
                {customerId}). Modificar los datos aquí no actualizará la
                información del cliente en la base de datos.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="customer-name" className="flex items-center gap-1">
              <User className="h-4 w-4 text-gray-500" />
              Nombre del cliente *
            </Label>
            <div className="relative">
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nombre completo"
                className="pl-10"
                required
              />
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
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
              />
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="customer-address"
              className="flex items-center gap-1"
            >
              <MapPin className="h-4 w-4 text-gray-500" />
              Dirección *
            </Label>
            <div className="relative">
              <Textarea
                id="customer-address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Dirección completa para entrega"
                rows={3}
                className="resize-none pl-10 pt-2"
                required
              />
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {customerId && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full gap-1"
            onClick={() => {
              // Esta es una función ficticia, tú puedes implementarla para buscar clientes
              // o simplemente navegar a la sección correspondiente
              window.open(`/customers/${customerId}`, "_blank");
            }}
          >
            <Search className="h-3.5 w-3.5" />
            Ver cliente completo en la sección Clientes
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
