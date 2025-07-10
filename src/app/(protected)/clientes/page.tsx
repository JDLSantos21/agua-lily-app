// src/app/clientes/page.tsx - VERSIÓN REDISEÑADA
"use client";

import { useMemo, useState } from "react";
import { useCustomerStore } from "@/stores/customerStore";
import { CustomerFilters } from "./components/customer-filters";
import { CustomerCard } from "./components/customer-card";
import CustomerFormDialog from "./components/customer-form-dialog";
import CustomerViewDialog from "./components/customer-view-dialog";
import { CustomerStats } from "./components/customer-stats";
import { Customer, CustomerFilter } from "@/types/customers.types";
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
  Users,
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
import { Empty } from "@/components/Empty";
import { Badge } from "@/components/ui/badge";
import { Building2, Eye, Edit, User } from "lucide-react";
import { memo } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import CustomersPagination from "./components/customers-pagination";
import formatPhoneNumber from "@/shared/utils/formatNumber";
import { IoLogoWhatsapp } from "react-icons/io5";

export default function ClientesPage() {
  // Vista activa: list, grid o stats
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<CustomerFilter>({});
  const [activeView, setActiveView] = useState<"list" | "grid" | "stats">(
    "list"
  );

  // Obtener estado
  const {
    dialogState,
    openViewDialog,
    openFormDialog,
    openDeleteDialog,
    closeViewDialog,
    closeFormDialog,
  } = useCustomerStore();

  const CUSTOMERS_PER_PAGE = 10;

  const offset = useMemo(
    () => (currentPage - 1) * CUSTOMERS_PER_PAGE,
    [currentPage]
  );

  const {
    data: customers,
    isLoading,
    refetch: customersRefetch,
    error,
  } = useCustomers({ ...filters, offset, limit: CUSTOMERS_PER_PAGE });

  const pagination = useMemo(() => customers?.pagination || null, [customers]);

  const totalPages = useMemo(
    () => Math.ceil((pagination?.total || 0) / CUSTOMERS_PER_PAGE),
    [pagination?.total]
  );

  // Renderizado basado en estado de carga
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-sm border-0 bg-white">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Error al cargar clientes
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-2">
              No se pudieron cargar los datos. Verifique su conexión e intente
              nuevamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-gray-400 p-3 bg-gray-50 rounded-lg">
              <strong>Detalles técnicos:</strong> {error.message}
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button
              onClick={() => customersRefetch()}
              className="w-full"
              variant="outline"
            >
              Reintentar
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header moderno y minimalista */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Clientes
                  </h1>
                  <p className="text-sm text-gray-500">
                    {pagination?.total
                      ? `${pagination.total} cliente${pagination.total !== 1 ? "s" : ""}`
                      : "Cargando..."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => openFormDialog()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Cliente
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros en diseño card */}
        <Card className="mb-8 border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            <CustomerFilters onChange={setFilters} initialFilters={filters} />
          </CardContent>
        </Card>

        {/* Vista tabs rediseñada */}
        <div className="flex items-center justify-between mb-6">
          <Tabs
            value={activeView}
            onValueChange={(value) => setActiveView(value as any)}
            className="bg-white rounded-lg p-1 border border-gray-200"
          >
            <TabsList className="grid w-full grid-cols-3 bg-transparent p-0">
              <TabsTrigger
                value="list"
                className="flex items-center space-x-2 px-4 py-2 rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
              >
                <ListIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Lista</span>
              </TabsTrigger>
              <TabsTrigger
                value="grid"
                className="flex items-center space-x-2 px-4 py-2 rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
              >
                <Grid2X2 className="w-4 h-4" />
                <span className="hidden sm:inline">Tarjetas</span>
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="flex items-center space-x-2 px-4 py-2 rounded-md data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
              >
                <BarChart className="w-4 h-4" />
                <span className="hidden sm:inline">Estadísticas</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {/* Contenido principal basado en vista activa */}
        {isLoading ? (
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="flex justify-center py-16">
              <div className="flex flex-col items-center space-y-4">
                <LoaderSpin />
                <p className="text-sm text-gray-500">Cargando clientes...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {activeView === "stats" ? (
              // Vista de estadísticas rediseñada
              <div className="space-y-6">
                <CustomerStats />

                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Análisis Avanzado
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Estadísticas detalladas y reportes de clientes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Accede a reportes detallados, gráficos interactivos y
                        análisis avanzados.
                      </p>
                      <Link href="/clientes/estadisticas">
                        <Button variant="outline" className="shrink-0">
                          Ver Estadísticas
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : activeView === "grid" ? (
              // Vista de cuadrícula rediseñada
              customers?.data.length === 0 ? (
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="py-16">
                    <Empty
                      title="No hay clientes registrados"
                      description="Comience agregando su primer cliente al sistema"
                      icon={<Users className="w-16 h-16 text-gray-300" />}
                      action={
                        <Button
                          onClick={() => openFormDialog()}
                          className="mt-4"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Cliente
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {customers?.data.map((customer) => (
                      <motion.div
                        key={customer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CustomerCard
                          customer={customer}
                          onView={(id: number) => openViewDialog(id)}
                          onEdit={(customer: Customer) =>
                            openFormDialog(customer)
                          }
                          onDelete={openDeleteDialog}
                          equipmentCount={0}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )
            ) : (
              // Vista de tabla rediseñada
              <Card className="border-0 shadow-sm bg-white overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow className="border-gray-200">
                      <TableHead className="font-semibold text-gray-700 py-4">
                        <div className="flex items-center space-x-2">
                          <span>Cliente</span>
                          <ArrowUpDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Contacto
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        <div className="flex items-center space-x-2">
                          <span>Tipo</span>
                          <Filter className="w-4 h-4 text-gray-400" />
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers?.data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32">
                          <div className="flex flex-col items-center justify-center text-center">
                            <Users className="w-8 h-8 text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">
                              No se encontraron clientes
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openFormDialog()}
                              className="mt-2"
                            >
                              Agregar Cliente
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      customers?.data.map((customer) => (
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
              </Card>
            )}
          </>
        )}

        {/* Paginación mejorada */}
        {customers && customers.data.length > 0 && (
          <div className="flex justify-center mt-8">
            <CustomersPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
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
    </div>
  );
}

// Componente para fila de tabla de clientes rediseñado
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
    <TableRow className="hover:bg-gray-50 transition-colors border-gray-100">
      <TableCell className="py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-medium text-sm">
            {customer.is_business ? (
              <Building2 className="w-5 h-5" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {customer.business_name || customer.name}
            </p>
            {customer.business_name && (
              <p className="text-sm text-gray-500">{customer.name}</p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-900">
              {formatPhoneNumber(customer.contact_phone)}
            </span>
            {customer.has_whatsapp && (
              <IoLogoWhatsapp className="w-4 h-4 text-green-500" />
            )}
          </div>
          {customer.contact_email && (
            <p className="text-sm text-gray-500 truncate max-w-[200px]">
              {customer.contact_email}
            </p>
          )}
        </div>
      </TableCell>
      <TableCell className="py-4">
        <Badge
          variant={customer.is_business ? "default" : "secondary"}
          className={
            customer.is_business
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-gray-50 text-gray-700 border-gray-200"
          }
        >
          {customer.is_business ? (
            <>
              <Building2 className="w-3 h-3 mr-1" />
              Empresa
            </>
          ) : (
            <>
              <User className="w-3 h-3 mr-1" />
              Individual
            </>
          )}
        </Badge>
      </TableCell>
      <TableCell className="py-4">
        <div className="flex items-center justify-end space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
            onClick={onView}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
            onClick={onEdit}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

// Componentes adicionales necesarios
