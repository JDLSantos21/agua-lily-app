// src/app/clientes/page.tsx
"use client";

import { useState } from "react";
import { CustomerList } from "./components/customer-list";
import { CustomerStats } from "./components/customer-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Grid2X2, ListIcon } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { CustomerCard } from "./components/customer-card";
import { CustomerFilters } from "./components/customer-filters";
import { CustomerFilter } from "@/types/customers.types";
import { CustomerFormDialog } from "./components/customer-form-dialog";
import CustomerViewDialog from "./components/customer-view-dialog";
import { LoaderSpin } from "@/components/Loader";
import Link from "next/link";

export default function ClientesPage() {
  // Estados
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filters, setFilters] = useState<CustomerFilter>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [customerToEdit, setCustomerToEdit] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Obtener datos de clientes
  const { data, isLoading, error, refetch } = useCustomers(filters);
  const customers = data?.data || [];

  // Manejar cambio de filtros
  const handleFilterChange = (newFilters: CustomerFilter) => {
    setFilters(newFilters);
  };

  // Manejar visualización de cliente
  const handleViewCustomer = (id: number) => {
    setSelectedCustomerId(id);
  };

  // Manejar edición de cliente
  const handleEditCustomer = (customer: any) => {
    setCustomerToEdit(customer);
    setIsEditDialogOpen(true);
  };

  return (
    <main className="container p-4">
      <div className="space-y-8">
        {/* Sección de estadísticas */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Panel de Clientes</h2>
          <CustomerStats />
          <Link href="/clientes/estadisticas">Estadisticas</Link>
          <Link href="/clientes/busqueda">Busqueda</Link>
        </section>

        {/* Filtros y controles */}
        <section>
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <h2 className="text-xl font-bold">Gestión de Clientes</h2>

            <div className="flex gap-2">
              {/* Botones de vista */}
              <div className="border rounded-md overflow-hidden flex">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Botón de nuevo cliente */}
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Nuevo Cliente
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <div className="mt-4">
            <CustomerFilters onChange={handleFilterChange} />
          </div>
        </section>

        {/* Lista de clientes */}
        <section>
          {isLoading ? (
            <LoaderSpin text="Cargando clientes..." />
          ) : error ? (
            <div className="text-center text-red-500 my-4">
              Error al cargar los clientes. Por favor, intente nuevamente.
            </div>
          ) : viewMode === "list" ? (
            <CustomerList />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {customers.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No se encontraron clientes con los filtros aplicados
                </div>
              ) : (
                customers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onView={handleViewCustomer}
                    onEdit={handleEditCustomer}
                    equipmentCount={0} // Aquí podrías pasar el conteo real de equipos
                  />
                ))
              )}
            </div>
          )}
        </section>
      </div>

      {/* Diálogos */}
      <CustomerFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={refetch}
      />

      <CustomerFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        customer={customerToEdit}
        onSuccess={refetch}
      />

      <CustomerViewDialog
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
        onEdit={handleEditCustomer}
      />
    </main>
  );
}
