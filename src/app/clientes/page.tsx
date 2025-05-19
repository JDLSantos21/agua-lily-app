// src/app/clientes/page.tsx - VERSIÓN MEJORADA
"use client";

import { useState, useEffect } from "react";
import { useCustomerStore } from "@/stores/customerStore";
import { CustomerFilters } from "./components/customer-filters";
import { CustomerCard } from "./components/customer-card";
import CustomerFormDialog from "./components/customer-form-dialog";
import CustomerViewDialog from "./components/customer-view-dialog";
import { CustomerStats } from "./components/customer-stats";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Customer } from "@/types/customers.types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Grid2X2,
  ListIcon,
  Plus,
  BarChart,
  AlertCircle,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { LoaderSpin } from "@/components/Loader";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Empty } from "@/components/Empty";

export default function ClientesPage() {
  // Vista activa: list, grid o stats
  const [activeView, setActiveView] = useState<"list" | "grid" | "stats">(
    "list"
  );

  // Obtener estado y acciones del store
  const {
    customers,
    pagination,
    isLoading,
    error,
    filters,
    dialogState,
    fetchCustomers,
    fetchCustomerStats,
    setFilters,
    openViewDialog,
    openFormDialog,
    openDeleteDialog,
    closeViewDialog,
    closeFormDialog,
    closeDeleteDialog,
    deleteCustomer,
  } = useCustomerStore();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchCustomers();
    fetchCustomerStats();
  }, [fetchCustomers, fetchCustomerStats]);

  // Renderizado basado en estado de carga
  if (error) {
    return (
      <Card className="mx-auto max-w-lg mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle /> Error al cargar los clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Ha ocurrido un error al intentar cargar los datos de clientes. Por
            favor, intente nuevamente.
          </p>
          <p className="text-sm text-gray-400 mt-2">Detalles: {error}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => fetchCustomers()}>Reintentar</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <main className="container p-4 pb-20">
      {/* Header con navegación y acciones principales */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
          <p className="text-gray-500 mt-1">
            Administre clientes, vea estadísticas y realice búsquedas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            value={activeView}
            onValueChange={(value) => setActiveView(value as any)}
            className="mr-2"
          >
            <TabsList>
              <TabsTrigger value="list" aria-label="Vista de lista">
                <ListIcon className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Lista</span>
              </TabsTrigger>
              <TabsTrigger value="grid" aria-label="Vista de cuadrícula">
                <Grid2X2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Cuadrícula</span>
              </TabsTrigger>
              <TabsTrigger value="stats" aria-label="Estadísticas">
                <BarChart className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Estadísticas</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            onClick={() => openFormDialog()}
            variant={"primary"}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Cliente</span>
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <CustomerFilters
        onChange={setFilters}
        initialFilters={filters}
        className="mb-6"
      />

      {/* Contenido según la vista seleccionada */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoaderSpin text="Cargando clientes..." />
          </div>
        ) : (
          <>
            {activeView === "stats" ? (
              // Vista de estadísticas
              <div className="space-y-6">
                <CustomerStats />

                <Card>
                  <CardHeader>
                    <CardTitle>Análisis avanzado</CardTitle>
                    <CardDescription>
                      Revise estadísticas detalladas sobre sus clientes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Para un análisis más detallado y gráficos interactivos,
                      visite la sección de estadísticas.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href="/clientes/estadisticas">
                      <Button variant="outline">Ir a Estadísticas</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            ) : activeView === "grid" ? (
              // Vista de cuadrícula
              customers.length === 0 ? (
                <Empty
                  title="No hay clientes"
                  description="No se encontraron clientes con los filtros aplicados"
                  icon={<User className="h-10 w-10 text-gray-400" />}
                  action={
                    <Button onClick={() => openFormDialog()}>
                      <Plus className="h-4 w-4 mr-1" />
                      Nuevo Cliente
                    </Button>
                  }
                />
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AnimatePresence>
                    {customers.map((customer) => (
                      <CustomerCard
                        key={customer.id}
                        customer={customer}
                        onView={(id: number) => openViewDialog(id)}
                        onEdit={(customer: Customer) =>
                          openFormDialog(customer)
                        }
                        onDelete={openDeleteDialog}
                        equipmentCount={0} // Esto se podría mejorar con datos reales
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )
            ) : (
              // Vista de lista (por defecto)
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30%]">
                          <div className="flex items-center gap-1">
                            Nombre
                            <ArrowUpDown className="h-3 w-3 text-gray-400" />
                          </div>
                        </TableHead>
                        <TableHead className="w-[20%]">Contacto</TableHead>
                        <TableHead className="w-[20%]">
                          <div className="flex items-center gap-1">
                            Tipo
                            <Filter className="h-3 w-3 text-gray-400" />
                          </div>
                        </TableHead>
                        <TableHead className="w-[15%]">
                          <div className="flex items-center gap-1">
                            Estado
                            <Filter className="h-3 w-3 text-gray-400" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right w-[15%]">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No se encontraron clientes
                          </TableCell>
                        </TableRow>
                      ) : (
                        customers.map((customer) => (
                          <CustomerTableRow
                            key={customer.id}
                            customer={customer}
                            onView={() => openViewDialog(customer.id as number)}
                            onEdit={() => openFormDialog(customer)}
                            onDelete={() => openDeleteDialog(customer)}
                          />
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>

                {pagination && pagination.total > 0 && (
                  <CardFooter className="flex items-center justify-between border-t px-6 py-3">
                    <div className="text-sm text-gray-500">
                      Mostrando {customers.length} de {pagination.total}{" "}
                      clientes
                    </div>
                    {/* Aquí se podría agregar paginación */}
                  </CardFooter>
                )}
              </Card>
            )}
          </>
        )}
      </div>

      {/* Diálogos */}
      <CustomerFormDialog
        open={dialogState.formDialog.isOpen}
        onOpenChange={closeFormDialog}
        customer={dialogState.formDialog.customer}
        onSuccess={() => {}} // Manejado por el store
      />

      <CustomerViewDialog
        customerId={dialogState.viewDialog.customerId}
        onClose={closeViewDialog}
        onEdit={(customer) => {
          closeViewDialog();
          openFormDialog(customer);
        }}
        onDelete={openDeleteDialog}
      />

      <ConfirmDialog
        open={dialogState.deleteDialog.isOpen}
        title="Eliminar cliente"
        description={`¿Está seguro que desea eliminar a ${dialogState.deleteDialog.customer?.name || "este cliente"}? Esta acción no se puede deshacer.`}
        onConfirm={() => {
          if (dialogState.deleteDialog.customer?.id) {
            deleteCustomer(dialogState.deleteDialog.customer.id);
          }
        }}
        onCancel={closeDeleteDialog}
      />
    </main>
  );
}

// Componente para fila de tabla de clientes
interface CustomerTableRowProps {
  customer: Customer;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CustomerTableRow = memo(function CustomerTableRow({
  customer,
  onView,
  onEdit,
  onDelete,
}: CustomerTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {customer.business_name || customer.name}
        {customer.business_name && (
          <div className="text-xs text-gray-500">{customer.name}</div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <div className="text-sm">{customer.contact_phone}</div>
          {customer.contact_email && (
            <div className="text-xs text-gray-500 truncate max-w-[200px]">
              {customer.contact_email}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        {customer.is_business ? (
          <div className="flex items-center gap-1 text-blue-600">
            <Building2 className="h-4 w-4" />
            <span>Empresa</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-gray-600">
            <User className="h-4 w-4" />
            <span>Individual</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <Badge
          variant={customer.status === "activo" ? "outline" : "destructive"}
          className="uppercase text-xs"
        >
          {customer.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 mr-1"
          onClick={onView}
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="sr-only md:not-sr-only md:inline-block">Ver</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 mr-1"
          onClick={onEdit}
        >
          <Edit className="h-3.5 w-3.5" />
          <span className="sr-only md:not-sr-only md:inline-block">Editar</span>
        </Button>
        {/* <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 hover:text-red-600 hover:bg-red-50"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only md:not-sr-only md:inline-block">
            Eliminar
          </span>
        </Button> */}
      </TableCell>
    </TableRow>
  );
});

// Componentes adicionales necesarios
import { Building2, Eye, Edit, User } from "lucide-react";
import { memo } from "react";
