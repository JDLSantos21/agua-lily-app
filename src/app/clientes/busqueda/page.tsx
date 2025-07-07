// src/app/clientes/busqueda/page.tsx - VERSIÓN MEJORADA
"use client";

import { useState, useCallback, useEffect } from "react";
import { useCustomerStore } from "@/stores/customerStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Search,
  X,
  Eye,
  Edit,
  AlertCircle,
} from "lucide-react";
import { useSearchCustomers } from "@/hooks/useCustomers";
import CustomerViewDialog from "../components/customer-view-dialog";
import CustomerFormDialog from "../components/customer-form-dialog";
import { Customer } from "@/types/customers.types";
import { LoaderSpin } from "@/components/Loader";
import { Empty } from "@/components/Empty";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";

export default function BusquedaPage() {
  // Estados para la búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<string>("name");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [isSearching, setIsSearching] = useState(false);

  // Obtener estado y acciones del store
  const {
    dialogState,
    openViewDialog,
    openFormDialog,
    openDeleteDialog,
    closeViewDialog,
    closeFormDialog,
  } = useCustomerStore();

  // Consulta de búsqueda
  const { data, isLoading, refetch, error } = useSearchCustomers(
    isSearching ? debouncedSearchTerm : "",
    50 // Limitar a 50 resultados máximo
  );
  const customers = data?.data || [];

  // Efecto para búsqueda automática cuando cambia el término debounced
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
      setIsSearching(true);
      refetch();
    }
  }, [debouncedSearchTerm, refetch]);

  // Manejar búsqueda
  const handleSearch = useCallback(() => {
    if (searchTerm.trim().length > 0) {
      setIsSearching(true);
      refetch();
    }
  }, [searchTerm, refetch]);

  // Manejar tecla Enter en input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  // Limpiar búsqueda
  const handleClear = useCallback(() => {
    setSearchTerm("");
    setSearchType("name");
    setIsSearching(false);
  }, []);

  return (
    <div className="container p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Búsqueda Avanzada de Clientes</h1>
        <Button
          variant="primary"
          onClick={() => openFormDialog()}
          className="flex items-center gap-1"
        >
          <Edit className="h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Formulario de búsqueda */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="search-type">Buscar por</Label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger id="search-type">
                  <SelectValue placeholder="Seleccionar campo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="phone">Teléfono</SelectItem>
                  <SelectItem value="rnc">RNC</SelectItem>
                  <SelectItem value="address">Dirección</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="search-term">Término de búsqueda</Label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Input
                    id="search-term"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      searchType === "name"
                        ? "Nombre del cliente o empresa..."
                        : searchType === "phone"
                          ? "Número de teléfono..."
                          : searchType === "rnc"
                            ? "RNC de la empresa..."
                            : searchType === "address"
                              ? "Dirección..."
                              : "Correo electrónico..."
                    }
                    className="pr-10"
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchTerm("")}
                      type="button"
                      aria-label="Limpiar búsqueda"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={!searchTerm || isLoading}
                  className="flex gap-1"
                  variant="primary"
                >
                  <Search className="h-4 w-4" />
                  Buscar
                </Button>
                {isSearching && (
                  <Button variant="outline" onClick={handleClear}>
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados de búsqueda */}
      {isSearching && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Resultados de búsqueda{" "}
              {!isLoading && (
                <span className="text-sm font-normal text-gray-500">
                  ({customers.length} encontrados)
                </span>
              )}
            </h2>
            {customers.length > 0 && (
              <div className="text-sm text-gray-500">
                Mostrando los primeros 50 resultados
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoaderSpin text="Buscando clientes..." />
            </div>
          ) : error ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="flex items-center gap-3 py-6">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <div>
                  <h3 className="font-medium text-red-600">
                    Error al realizar la búsqueda
                  </h3>
                  <p className="text-sm text-red-500">
                    {error instanceof Error
                      ? error.message
                      : "Ocurrió un error inesperado"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : customers.length === 0 ? (
            <Empty
              title="No se encontraron resultados"
              description="Intente con otros términos de búsqueda o criterios diferentes"
              action={
                <Button variant="outline" onClick={handleClear}>
                  Limpiar búsqueda
                </Button>
              }
            />
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatePresence>
                {customers.map((customer) => (
                  <CustomerSearchCard
                    key={customer.id}
                    customer={customer}
                    onView={() => openViewDialog(customer.id as number)}
                    onEdit={() => openFormDialog(customer)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}

      {/* Diálogos */}
      <CustomerViewDialog
        customerId={dialogState.viewDialog.customerId}
        onClose={closeViewDialog}
        onEdit={(customer) => {
          closeViewDialog();
          openFormDialog(customer);
        }}
        onDelete={openDeleteDialog}
      />

      <CustomerFormDialog
        open={dialogState.formDialog.isOpen}
        onOpenChange={closeFormDialog}
        customer={dialogState.formDialog.customer}
        onSuccess={() => {
          // Si estábamos buscando, refrescar los resultados
          if (isSearching) {
            refetch();
          }
        }}
      />
    </div>
  );
}

// Componente de tarjeta para resultados de búsqueda
interface CustomerSearchCardProps {
  customer: Customer;
  onView: () => void;
  onEdit: () => void;
}

const CustomerSearchCard = ({
  customer,
  onView,
  onEdit,
}: CustomerSearchCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <Card className="overflow-hidden h-full">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="p-4 flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  {customer.business_name || customer.name}
                </h3>
                {customer.business_name && (
                  <p className="text-sm text-gray-500">{customer.name}</p>
                )}
              </div>
              <Badge
                variant={
                  customer.status === "activo" ? "outline" : "destructive"
                }
                className="uppercase text-xs"
              >
                {customer.status}
              </Badge>
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-sm">
                {customer.is_business ? (
                  <>
                    <Building2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-blue-500">Empresa</span>
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600">Individual</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-sm">
                <Phone className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                <span>{customer.contact_phone}</span>
              </div>

              {customer.contact_email && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Mail className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{customer.contact_email}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-sm">
                <MapPin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                <span className="truncate">{customer.address}</span>
              </div>
            </div>
          </div>

          <div className="border-t flex divide-x mt-auto">
            <Button
              variant="ghost"
              className="flex-1 rounded-none h-10 gap-1"
              onClick={onView}
            >
              <Eye className="h-4 w-4" />
              Ver
            </Button>
            <Button
              variant="ghost"
              className="flex-1 rounded-none h-10 gap-1"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
