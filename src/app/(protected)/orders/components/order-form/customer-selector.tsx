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
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="px-0 pb-6">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Información del Cliente
        </CardTitle>
        <CardDescription className="text-gray-600">
          Seleccione un cliente existente o registre uno nuevo
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 space-y-6">
        <Tabs
          value={activeTab}
          onValueChange={(v) => handleTabChange(v as "existing" | "new")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="existing"
              className="flex gap-2 items-center rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              <User className="h-4 w-4" />
              Cliente Registrado
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="flex gap-2 items-center rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              Cliente Nuevo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-6 mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar cliente por nombre, teléfono, RNC..."
                className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="min-h-[200px]">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <LoaderSpin text="" />
                  <p className="text-gray-500 mt-3">Buscando clientes...</p>
                </div>
              ) : searchTerm && debouncedSearchTerm.length < 2 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Search className="h-8 w-8 mb-3 text-gray-300" />
                  <p>Introduzca al menos 2 caracteres para buscar</p>
                </div>
              ) : searchResults.length === 0 &&
                debouncedSearchTerm.length >= 2 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <User className="h-8 w-8 mb-3 text-gray-300" />
                  <p className="mb-3">No se encontraron clientes</p>
                  <Button
                    variant="outline"
                    onClick={() => handleTabChange("new")}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Registrar nuevo cliente
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Cliente Seleccionado
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Nombre:</span>
                        <span>
                          {selectedCustomer.business_name ||
                            selectedCustomer.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Teléfono:</span>
                        <span>
                          {formatPhoneNumber(selectedCustomer.contact_phone)}
                        </span>
                        {selectedCustomer.has_whatsapp && (
                          <div className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-md">
                            <IoLogoWhatsapp className="h-3 w-3" />
                            <span className="text-xs font-medium">
                              WhatsApp
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium">Dirección:</span>
                        <span className="flex-1">
                          {selectedCustomer.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="new" className="space-y-6 mt-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Nombre del cliente *
                </Label>
                <Input
                  id="name"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="Nombre completo del cliente"
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Teléfono de contacto *
                </Label>
                <Input
                  id="phone"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  placeholder="Ej. 8295551234"
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                {newCustomerPhone && (
                  <div className="flex items-center space-x-3 mt-2">
                    <Checkbox
                      id="has-whatsapp"
                      checked={newCustomerHasWhatsapp}
                      onCheckedChange={(checked) =>
                        setNewCustomerHasWhatsapp(checked as boolean)
                      }
                      className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    />
                    <Label
                      htmlFor="has-whatsapp"
                      className="text-sm font-normal cursor-pointer flex items-center gap-2"
                    >
                      <IoLogoWhatsapp className="h-4 w-4 text-green-500" />
                      Este número tiene WhatsApp
                    </Label>
                  </div>
                )}
              </div>

              <div className="grid gap-3">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700"
                >
                  Dirección de entrega *
                </Label>
                <Textarea
                  id="address"
                  value={newCustomerAddress}
                  onChange={(e) => setNewCustomerAddress(e.target.value)}
                  placeholder="Dirección completa para la entrega del pedido"
                  rows={3}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <Checkbox
                  id="save-customer"
                  checked={saveCustomer}
                  onCheckedChange={(checked) =>
                    onSaveCustomerChange(checked as boolean)
                  }
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <Label
                  htmlFor="save-customer"
                  className="text-sm cursor-pointer flex-1"
                >
                  Guardar como cliente registrado para futuros pedidos
                </Label>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-6 h-6 bg-amber-100 rounded-full flex-shrink-0 mt-0.5">
                  <span className="text-amber-600 text-sm font-bold">!</span>
                </div>
                <div>
                  <p className="text-sm text-amber-800 font-medium">
                    Información requerida
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Complete todos los campos marcados con * para continuar al
                    siguiente paso.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
