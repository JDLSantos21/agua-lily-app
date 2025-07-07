// src/app/orders/components/order-form/customer-selector.tsx - ACTUALIZADO

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Customer } from "@/types/customers.types";
import { useDebounce } from "use-debounce";
import { Search, X, User, Plus } from "lucide-react";
import { LoaderSpin } from "@/components/Loader";

// API para buscar clientes
import { searchCustomers } from "@/api/customers";
import { CustomerCard } from "./customer-card";
import { IoLogoWhatsapp } from "react-icons/io5";
import formatPhoneNumber from "@/shared/utils/formatNumber";

interface CustomerSelectorProps {
  initialCustomerId: number | null;
  initialCustomerData: {
    name: string;
    phone: string;
    address: string;
    hasWhatsapp?: boolean; // ← NUEVO
  };
  onCustomerChange: (
    customerId: number | null,
    customerData: {
      name: string;
      phone: string;
      address: string;
      hasWhatsapp: boolean; // ← NUEVO
    },
    saveCustomer: boolean
  ) => void;
  saveCustomer: boolean;
  onSaveCustomerChange: (save: boolean) => void;
}

export default function CustomerSelector({
  initialCustomerId,
  initialCustomerData,
  onCustomerChange,
  saveCustomer,
  onSaveCustomerChange,
}: CustomerSelectorProps) {
  // Estado activo: registrado o nuevo
  const [activeTab, setActiveTab] = useState<"existing" | "new">(
    initialCustomerId ? "existing" : "new"
  );

  // Estado para búsqueda de clientes
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  // Estado para cliente nuevo
  const [newCustomerName, setNewCustomerName] = useState(
    initialCustomerData.name || ""
  );
  const [newCustomerPhone, setNewCustomerPhone] = useState(
    initialCustomerData.phone || ""
  );
  const [newCustomerAddress, setNewCustomerAddress] = useState(
    initialCustomerData.address || ""
  );
  const [newCustomerHasWhatsapp, setNewCustomerHasWhatsapp] = useState(
    initialCustomerData.hasWhatsapp || false
  ); // ← NUEVO ESTADO

  // Cargar cliente inicial si existe
  useEffect(() => {
    if (initialCustomerId) {
      setActiveTab("existing");
    } else if (
      initialCustomerData.name ||
      initialCustomerData.phone ||
      initialCustomerData.address
    ) {
      setActiveTab("new");
      setNewCustomerName(initialCustomerData.name || "");
      setNewCustomerPhone(initialCustomerData.phone || "");
      setNewCustomerAddress(initialCustomerData.address || "");
      setNewCustomerHasWhatsapp(initialCustomerData.hasWhatsapp || false);
    }
  }, [initialCustomerId, initialCustomerData]);

  // Realizar búsqueda cuando cambia el término debounceado
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
        setIsSearching(true);
        try {
          const response = await searchCustomers(debouncedSearchTerm);
          setSearchResults(response.data);
        } catch (error) {
          console.error("Error al buscar clientes:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    performSearch();
  }, [debouncedSearchTerm]);

  // Manejar selección de cliente existente
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    onCustomerChange(
      customer.id || null,
      {
        name: customer.business_name || customer.name,
        phone: customer.contact_phone,
        address: customer.address,
        hasWhatsapp: customer.has_whatsapp || false, // ← NUEVO
      },
      false
    );
  };

  // Manejar cambios en el formulario de cliente nuevo
  const handleNewCustomerChange = () => {
    onCustomerChange(
      null,
      {
        name: newCustomerName,
        phone: newCustomerPhone,
        address: newCustomerAddress,
        hasWhatsapp: newCustomerHasWhatsapp, // ← NUEVO
      },
      saveCustomer
    );
  };

  // Actualizar datos cuando cambien los campos
  useEffect(() => {
    if (activeTab === "new") {
      handleNewCustomerChange();
    }
  }, [
    activeTab,
    newCustomerName,
    newCustomerPhone,
    newCustomerAddress,
    newCustomerHasWhatsapp, // ← AGREGAR A DEPENDENCIAS
    saveCustomer,
  ]);

  // Cambiar pestaña
  const handleTabChange = (tab: "existing" | "new") => {
    setActiveTab(tab);

    if (tab === "new") {
      setSelectedCustomer(null);
      handleNewCustomerChange();
    } else if (tab === "existing" && selectedCustomer) {
      onCustomerChange(
        selectedCustomer.id || null,
        {
          name: selectedCustomer.name,
          phone: selectedCustomer.contact_phone,
          address: selectedCustomer.address,
          hasWhatsapp: selectedCustomer.has_whatsapp || false, // ← NUEVO
        },
        false
      );
    }
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={(v) => handleTabChange(v as "existing" | "new")}
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="existing" className="flex gap-1 items-center">
            <User className="h-4 w-4" />
            Cliente Registrado
          </TabsTrigger>
          <TabsTrigger value="new" className="flex gap-1 items-center">
            <Plus className="h-4 w-4" />
            Cliente Nuevo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="existing" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar cliente por nombre, teléfono, RNC..."
              className="pl-8 pr-8"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                aria-label="Limpiar búsqueda"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Resultados de búsqueda */}
          <div className="min-h-[200px]">
            {isSearching ? (
              <div className="flex justify-center py-8">
                <LoaderSpin text="Buscando clientes..." />
              </div>
            ) : searchTerm && debouncedSearchTerm.length < 2 ? (
              <p className="text-center py-8 text-gray-500">
                Introduzca al menos 2 caracteres para buscar
              </p>
            ) : searchResults.length === 0 &&
              debouncedSearchTerm.length >= 2 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No se encontraron clientes con ese término</p>
                <Button
                  variant="link"
                  onClick={() => handleTabChange("new")}
                  className="mt-2"
                >
                  Registrar nuevo cliente
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {searchResults.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    isSelected={selectedCustomer?.id === customer.id}
                    onSelect={() => handleSelectCustomer(customer)}
                  />
                ))}
              </div>
            )}
          </div>

          {selectedCustomer && (
            <Card className="mt-4 border-primary bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Cliente Seleccionado</CardTitle>
                <CardDescription>
                  Los datos de este cliente se usarán para el pedido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Nombre:</strong>{" "}
                    {selectedCustomer.business_name || selectedCustomer.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <strong>Teléfono:</strong>{" "}
                    {formatPhoneNumber(selectedCustomer.contact_phone)}
                    {selectedCustomer.has_whatsapp && (
                      <div className="flex items-center gap-1 text-green-600">
                        <IoLogoWhatsapp className="h-4 w-4" />
                        <span className="text-xs">WhatsApp</span>
                      </div>
                    )}
                  </div>
                  <p>
                    <strong>Dirección:</strong> {selectedCustomer.address}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del cliente *</Label>
              <Input
                id="name"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                placeholder="Nombre completo"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono de contacto *</Label>
              <Input
                id="phone"
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
                placeholder="Ej. 8295551234"
                required
              />

              {/* ← NUEVO: Checkbox WhatsApp */}
              {newCustomerPhone && (
                <div className="flex items-center space-x-2 mt-1">
                  <Checkbox
                    id="has-whatsapp"
                    checked={newCustomerHasWhatsapp}
                    onCheckedChange={(checked) =>
                      setNewCustomerHasWhatsapp(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="has-whatsapp"
                    className="text-sm font-normal cursor-pointer flex items-center gap-1"
                  >
                    <IoLogoWhatsapp className="h-4 w-4 text-green-500" />
                    Este número tiene WhatsApp
                  </Label>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Dirección *</Label>
              <Textarea
                id="address"
                value={newCustomerAddress}
                onChange={(e) => setNewCustomerAddress(e.target.value)}
                placeholder="Dirección completa para entrega"
                rows={3}
                required
              />
            </div>

            {/* Checkbox para guardar cliente */}
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="save-customer"
                checked={saveCustomer}
                onCheckedChange={(checked) =>
                  onSaveCustomerChange(checked as boolean)
                }
              />
              <Label
                htmlFor="save-customer"
                className="text-sm font-normal cursor-pointer"
              >
                Guardar como cliente registrado para futuros pedidos
              </Label>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-700">
              <strong>Nota:</strong> Complete todos los campos marcados con *
              para poder continuar al siguiente paso.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
