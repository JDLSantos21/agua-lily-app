// src/app/clientes/busqueda/page.tsx
"use client";

import { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Search,
  Eye,
  Edit,
  Package,
} from "lucide-react";
import { useSearchCustomers } from "@/hooks/useCustomers";
import CustomerViewDialog from "../components/customer-view-dialog";
import { CustomerFormDialog } from "../components/customer-form-dialog";
import { Customer } from "@/types/customers.types";
import { LoaderSpin } from "@/components/Loader";

export default function BusquedaPage() {
  // Estados para la búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<string>("name");
  const [isSearching, setIsSearching] = useState(false);

  // Estados para diálogos
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Consulta de búsqueda
  const { data, isLoading, refetch, error } = useSearchCustomers(
    isSearching ? searchTerm : "",
    50 // Limitar a 50 resultados máximo
  );
  const customers = data?.data || [];

  // Manejar búsqueda
  const handleSearch = () => {
    if (searchTerm.trim().length > 0) {
      setIsSearching(true);
      refetch();
    }
  };

  // Manejar tecla Enter en input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Limpiar búsqueda
  const handleClear = () => {
    setSearchTerm("");
    setSearchType("name");
    setIsSearching(false);
  };

  // Manejar visualización de cliente
  const handleViewCustomer = (id: number) => {
    setSelectedCustomerId(id);
  };

  // Manejar edición de cliente
  const handleEditCustomer = (customer: Customer) => {
    setCustomerToEdit(customer);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container p-4 space-y-6">
      <h1 className="text-2xl font-bold">Búsqueda Avanzada de Clientes</h1>

      {/* Formulario de búsqueda */}
      <Card>
        <CardContent className="pt-6">
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
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm("")}
                    hidden={!searchTerm}
                  >
                    &times;
                  </button>
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={!searchTerm || isLoading}
                  className="flex gap-1"
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
          <h2 className="text-xl font-semibold">
            Resultados de búsqueda{" "}
            {!isLoading && (
              <span className="text-sm font-normal text-gray-500">
                ({customers.length} encontrados)
              </span>
            )}
          </h2>

          {isLoading ? (
            <LoaderSpin text="Buscando clientes..." />
          ) : error ? (
            <div className="text-center text-red-500 py-4">
              Error al realizar la búsqueda
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No se encontraron clientes que coincidan con la búsqueda
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((customer) => (
                <Card key={customer.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {customer.business_name || customer.name}
                          </h3>
                          {customer.business_name && (
                            <p className="text-sm text-gray-500">
                              {customer.name}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={
                            customer.status === "activo"
                              ? "outline"
                              : "destructive"
                          }
                          className="uppercase text-xs"
                        >
                          {customer.status}
                        </Badge>
                      </div>

                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1.5 text-sm">
                          {customer.is_business ? (
                            <>
                              <Building2 className="h-4 w-4 text-blue-500" />
                              <span className="text-blue-500">Empresa</span>
                            </>
                          ) : (
                            <>
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">Individual</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-sm">
                          <Phone className="h-3.5 w-3.5 text-gray-500" />
                          <span>{customer.contact_phone}</span>
                        </div>

                        {customer.contact_email && (
                          <div className="flex items-center gap-1.5 text-sm">
                            <Mail className="h-3.5 w-3.5 text-gray-500" />
                            <span className="truncate">
                              {customer.contact_email}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-gray-500" />
                          <span className="truncate">{customer.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t flex divide-x">
                      <Button
                        variant="ghost"
                        className="flex-1 rounded-none h-10 gap-1"
                        onClick={() =>
                          handleViewCustomer(customer.id as number)
                        }
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex-1 rounded-none h-10 gap-1"
                        onClick={() => handleEditCustomer(customer)}
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Diálogos */}
      <CustomerViewDialog
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
        onEdit={handleEditCustomer}
      />

      <CustomerFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        customer={customerToEdit}
        onSuccess={() => {
          // Refrescar la lista si se modificó un cliente
          if (isSearching) {
            refetch();
          }
        }}
      />
    </div>
  );
}
