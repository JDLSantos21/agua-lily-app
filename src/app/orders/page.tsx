// src/app/orders/page.tsx
"use client";

import { useState, useCallback, useMemo } from "react";
import { Order, OrderStatus } from "@/types/orders.types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Grid2X2,
  ListIcon,
  PlusIcon,
  SearchIcon,
  BarChartIcon,
  FilePlus,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { LoaderSpin } from "@/components/Loader";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Empty } from "@/components/Empty";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { motion, AnimatePresence } from "framer-motion";
import OrderCard from "./components/order-card";
import OrderFilters from "./components/orders-filters";
import OrderViewDialog from "./components/order-view-dialog";
import OrderStatusDialog from "./components/order-status-dialog";
import OrderAssignDeliveryDialog from "./components/order-assign-dialog";
import OrderStats from "./components/orders-stats";
import OrderForm from "./components/order-form";
import OrderEditForm from "./components/order-edit-form";

// Hooks de TanStack Query
import { useOrders, useOrderStats, useDeleteOrder } from "@/hooks/useOrders";

// Type para el estado de diálogos
interface DialogsState {
  viewOrder: { isOpen: boolean; orderId: number | null };
  newOrder: { isOpen: boolean };
  editOrder: { isOpen: boolean; order: Order | null };
  deleteOrder: { isOpen: boolean; order: Order | null };
  statusOrder: { isOpen: boolean; order: Order | null };
  assignOrder: { isOpen: boolean; order: Order | null };
}

// Configuración de paginación
const ITEMS_PER_PAGE = 8; // Número de items por página

export default function PedidosPage() {
  // Vista activa: list, grid o stats
  const [activeView, setActiveView] = useState<"list" | "grid" | "stats">(
    "grid"
  );

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Estado para filtros
  const [filters, setFilters] = useState<{
    order_status?: OrderStatus;
    search?: string;
    start_date?: string;
    end_date?: string;
    scheduled_date?: string;
  }>({});

  const [activeStatusFilter, setActiveStatusFilter] = useState<
    OrderStatus | "all"
  >("all");

  // Estado para diálogos - centralizado y manejado localmente
  const [dialogs, setDialogs] = useState<DialogsState>({
    viewOrder: { isOpen: false, orderId: null },
    newOrder: { isOpen: false },
    editOrder: { isOpen: false, order: null },
    deleteOrder: { isOpen: false, order: null },
    statusOrder: { isOpen: false, order: null },
    assignOrder: { isOpen: false, order: null },
  });

  // Calcular offset basado en la página actual
  const offset = useMemo(
    () => (currentPage - 1) * ITEMS_PER_PAGE,
    [currentPage]
  );

  // Filtros con paginación
  const filtersWithPagination = useMemo(
    () => ({
      ...filters,
      limit: ITEMS_PER_PAGE,
      offset: offset,
    }),
    [filters, offset]
  );

  // Consultas de datos con TanStack Query
  const {
    data: ordersResponse,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useOrders(filtersWithPagination, {
    // No refetching automático en foco para mejorar rendimiento
    refetchOnWindowFocus: false,
    // Mantener data anterior mientras se carga nueva página
    placeholderData: (old) => old,
  });

  // Solo consultar estadísticas cuando se muestra la vista de estadísticas
  const { data: statsData, isLoading: isLoadingStats } = useOrderStats({
    enabled: activeView === "stats" || activeStatusFilter !== "all",
    refetchOnWindowFocus: false,
    // Mantener anterior data mientras se recarga
    placeholderData: (old) => old,
  });

  // Mutación para eliminar pedidos
  const deleteOrderMutation = useDeleteOrder();

  // Funciones para manejar diálogos - optimizadas con useCallback
  const openViewDialog = useCallback((orderId: number) => {
    setDialogs((prev) => ({
      ...prev,
      viewOrder: { isOpen: true, orderId },
    }));
  }, []);

  const closeViewDialog = useCallback(() => {
    setDialogs((prev) => ({
      ...prev,
      viewOrder: { isOpen: false, orderId: null },
    }));
  }, []);

  const openNewOrderDialog = useCallback(() => {
    setDialogs((prev) => ({
      ...prev,
      newOrder: { isOpen: true },
    }));
  }, []);

  const closeNewOrderDialog = useCallback(() => {
    setDialogs((prev) => ({
      ...prev,
      newOrder: { isOpen: false },
    }));
  }, []);

  const openEditDialog = useCallback((order: Order) => {
    setDialogs((prev) => ({
      ...prev,
      editOrder: { isOpen: true, order },
    }));
  }, []);

  const closeEditDialog = useCallback(() => {
    setDialogs((prev) => ({
      ...prev,
      editOrder: { isOpen: false, order: null },
    }));
  }, []);

  const openDeleteDialog = useCallback((order: Order) => {
    setDialogs((prev) => ({
      ...prev,
      deleteOrder: { isOpen: true, order },
    }));
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDialogs((prev) => ({
      ...prev,
      deleteOrder: { isOpen: false, order: null },
    }));
  }, []);

  const openStatusDialog = useCallback((order: Order) => {
    setDialogs((prev) => ({
      ...prev,
      statusOrder: { isOpen: true, order },
    }));
  }, []);

  const closeStatusDialog = useCallback(() => {
    setDialogs((prev) => ({
      ...prev,
      statusOrder: { isOpen: false, order: null },
    }));
  }, []);

  const openAssignDialog = useCallback((order: Order) => {
    setDialogs((prev) => ({
      ...prev,
      assignOrder: { isOpen: true, order },
    }));
  }, []);

  const closeAssignDialog = useCallback(() => {
    setDialogs((prev) => ({
      ...prev,
      assignOrder: { isOpen: false, order: null },
    }));
  }, []);

  // Manejador de cambio de filtro de estado
  const handleStatusFilterChange = useCallback(
    (status: OrderStatus | "all") => {
      setActiveStatusFilter(status);
      setFilters((prev) => ({
        ...prev,
        order_status: status === "all" ? undefined : status,
      }));
      // Resetear a la primera página cuando cambia el filtro
      setCurrentPage(1);
    },
    []
  );

  // Manejador de cambio de filtros generales
  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    // Resetear a la primera página cuando cambian los filtros
    setCurrentPage(1);
  }, []);

  // Manejador de eliminación de pedido
  const handleDeleteOrder = useCallback(() => {
    if (dialogs.deleteOrder.order?.id) {
      deleteOrderMutation.mutate(dialogs.deleteOrder.order.id, {
        onSuccess: () => {
          closeDeleteDialog();
          // Si estamos en una página que se queda vacía, ir a la anterior
          const currentOrders = ordersResponse?.data || [];
          if (currentOrders.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          }
        },
      });
    }
  }, [
    dialogs.deleteOrder.order,
    deleteOrderMutation,
    closeDeleteDialog,
    ordersResponse,
    currentPage,
  ]);

  // Funciones de paginación
  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = () => {
    const total = pagination?.total || 0;
    const maxPages = Math.ceil(total / ITEMS_PER_PAGE);
    if (currentPage < maxPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Memoizar la lista de pedidos para evitar re-renderizados
  const orders = useMemo(() => ordersResponse?.data || [], [ordersResponse]);
  const pagination = useMemo(
    () => ordersResponse?.pagination || null,
    [ordersResponse]
  );

  // Calcular información de paginación
  const totalPages = useMemo(
    () => Math.ceil((pagination?.total || 0) / ITEMS_PER_PAGE),
    [pagination?.total]
  );

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Generar números de página para mostrar
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica más compleja para muchas páginas
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Agregar primera página si no está incluida
      if (start > 1) {
        pages.unshift(1);
        if (start > 2) {
          pages.splice(1, 0, -1); // -1 representa "..."
        }
      }

      // Agregar última página si no está incluida
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push(-1); // -1 representa "..."
        }
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  // Renderizado basado en estado de carga
  if (ordersError) {
    return (
      <Card className="mx-auto max-w-lg mt-10">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <Package className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold text-red-600">
              Error al cargar pedidos
            </h2>
            <p className="text-gray-500">
              Ha ocurrido un error al intentar cargar los datos. Por favor,
              intente nuevamente.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Detalles:{" "}
              {ordersError instanceof Error
                ? ordersError.message
                : "Error desconocido"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <main className="container p-4 pb-20">
      {/* Header con navegación y acciones principales */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>
          <p className="text-gray-500 mt-1">
            Administre pedidos, asigne entregas y controle el estado
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            value={activeView}
            onValueChange={(value) => setActiveView(value as any)}
            className="mr-2"
          >
            <TabsList>
              <TabsTrigger value="grid" aria-label="Vista de cuadrícula">
                <Grid2X2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Cuadrícula</span>
              </TabsTrigger>
              <TabsTrigger value="list" aria-label="Vista de lista">
                <ListIcon className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Lista</span>
              </TabsTrigger>
              <TabsTrigger value="stats" aria-label="Estadísticas">
                <BarChartIcon className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Estadísticas</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" asChild>
            <Link href="/orders/buscar" className="flex items-center gap-1">
              <SearchIcon className="h-4 w-4" />
              <span>Buscar</span>
            </Link>
          </Button>

          <Button onClick={openNewOrderDialog} variant="primary">
            <PlusIcon className="h-4 w-4 mr-1" />
            <span>Nuevo Pedido</span>
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="mb-6">
        <OrderStats
          simplified
          stats={statsData?.data}
          isLoading={isLoadingStats}
        />
      </div>

      {/* Filtros de estado */}
      <div className="mb-4 border-b pb-2">
        <div className="flex flex-wrap gap-2">
          <StatusFilterButton
            status="all"
            active={activeStatusFilter === "all"}
            onClick={() => handleStatusFilterChange("all")}
          >
            Todos
          </StatusFilterButton>
          <StatusFilterButton
            status="pendiente"
            active={activeStatusFilter === "pendiente"}
            onClick={() => handleStatusFilterChange("pendiente")}
          >
            Pendientes
          </StatusFilterButton>
          <StatusFilterButton
            status="preparando"
            active={activeStatusFilter === "preparando"}
            onClick={() => handleStatusFilterChange("preparando")}
          >
            Preparando
          </StatusFilterButton>
          <StatusFilterButton
            status="despachado"
            active={activeStatusFilter === "despachado"}
            onClick={() => handleStatusFilterChange("despachado")}
          >
            Despachados
          </StatusFilterButton>
          <StatusFilterButton
            status="entregado"
            active={activeStatusFilter === "entregado"}
            onClick={() => handleStatusFilterChange("entregado")}
          >
            Entregados
          </StatusFilterButton>
          <StatusFilterButton
            status="cancelado"
            active={activeStatusFilter === "cancelado"}
            onClick={() => handleStatusFilterChange("cancelado")}
          >
            Cancelados
          </StatusFilterButton>
        </div>
      </div>

      {/* Filtros avanzados */}
      <div className="mb-6">
        <OrderFilters
          onChange={handleFiltersChange}
          initialFilters={filters}
          compact={true}
        />
      </div>

      {/* Información de paginación */}
      {pagination && pagination.total > 0 && (
        <div className="mb-4 text-sm text-gray-500">
          Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, pagination.total)} de{" "}
          {pagination.total} pedidos
        </div>
      )}

      {/* Contenido según la vista seleccionada */}
      <div className="mt-6">
        {isLoadingOrders ? (
          <div className="flex justify-center py-12">
            <LoaderSpin text="Cargando pedidos..." />
          </div>
        ) : (
          <>
            {activeView === "stats" ? (
              // Vista de estadísticas
              <div className="space-y-6">
                <OrderStats
                  stats={statsData?.data}
                  isLoading={isLoadingStats}
                />

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-4">
                        Para un análisis más detallado y gráficos interactivos,
                        visite el panel de estadísticas.
                      </p>
                      <Link href="/orders/estadisticas">
                        <Button variant="outline">
                          Ver Estadísticas Completas
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : activeView === "list" ? (
              // Vista de lista
              <div>
                {orders.length === 0 ? (
                  <Empty
                    title="No hay pedidos"
                    description="No se encontraron pedidos con los filtros aplicados"
                    icon={<Package className="h-10 w-10 text-gray-400" />}
                    action={
                      <Button variant="primary" onClick={openNewOrderDialog}>
                        <FilePlus className="h-4 w-4 mr-1" />
                        Crear Pedido
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-2">
                    {orders.map((order: Order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onView={openViewDialog}
                        onEdit={openEditDialog}
                        onChangeStatus={openStatusDialog}
                        onAssignDelivery={openAssignDialog}
                        onDelete={openDeleteDialog}
                        layout="compact"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Vista de cuadrícula (por defecto)
              <div>
                {orders.length === 0 ? (
                  <Empty
                    title="No hay pedidos"
                    description="No se encontraron pedidos con los filtros aplicados"
                    icon={<Package className="h-10 w-10 text-gray-400" />}
                    action={
                      <Button variant="primary" onClick={openNewOrderDialog}>
                        <FilePlus className="h-4 w-4 mr-1" />
                        Crear Pedido
                      </Button>
                    }
                  />
                ) : (
                  <motion.div
                    className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AnimatePresence>
                      {orders.map((order: Order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onView={openViewDialog}
                          onEdit={openEditDialog}
                          onChangeStatus={openStatusDialog}
                          onAssignDelivery={openAssignDialog}
                          onDelete={openDeleteDialog}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Paginación */}
      {pagination && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-1">
            {/* Botón Anterior */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!canGoPrevious}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Anterior</span>
            </Button>

            {/* Números de página */}
            <div className="flex gap-1 mx-2">
              {pageNumbers.map((pageNum, index) =>
                pageNum === -1 ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-1 text-gray-500"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={pageNum}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageClick(pageNum)}
                    className={`px-3 ${
                      currentPage === pageNum
                        ? "bg-blue-600/10 "
                        : "hover:bg-primary/10"
                    }`}
                  >
                    {pageNum}
                  </Button>
                )
              )}
            </div>

            {/* Botón Siguiente */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!canGoNext}
              className="flex items-center gap-1"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Diálogos */}
      {/* Formulario para Nuevo Pedido */}
      <OrderForm
        open={dialogs.newOrder.isOpen}
        onOpenChange={closeNewOrderDialog}
      />

      {/* Formulario para Editar Pedido */}
      <OrderEditForm
        open={dialogs.editOrder.isOpen}
        onOpenChange={closeEditDialog}
        order={dialogs.editOrder.order}
      />

      <OrderViewDialog
        orderId={dialogs.viewOrder.orderId}
        onClose={closeViewDialog}
        onEdit={openEditDialog}
        onChangeStatus={openStatusDialog}
        onAssignDelivery={openAssignDialog}
        onDelete={openDeleteDialog}
      />

      <OrderStatusDialog
        open={dialogs.statusOrder.isOpen}
        onOpenChange={closeStatusDialog}
        order={dialogs.statusOrder.order}
      />

      <OrderAssignDeliveryDialog
        open={dialogs.assignOrder.isOpen}
        onOpenChange={closeAssignDialog}
        order={dialogs.assignOrder.order}
      />

      <ConfirmDialog
        open={dialogs.deleteOrder.isOpen}
        title="Eliminar pedido"
        description={`¿Está seguro que desea eliminar el pedido ${dialogs.deleteOrder.order?.tracking_code || ""}? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteOrder}
        onCancel={closeDeleteDialog}
      />
    </main>
  );
}

// Componente botón de filtro para estados
interface StatusFilterButtonProps {
  status: OrderStatus | "all";
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function StatusFilterButton({
  status,
  active,
  onClick,
  children,
}: StatusFilterButtonProps) {
  // Definir colores según el estado
  const getStatusStyles = () => {
    if (active) {
      switch (status) {
        case "pendiente":
          return "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200";
        case "preparando":
          return "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200";
        case "despachado":
          return "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200";
        case "entregado":
          return "bg-green-100 text-green-800 border-green-300 hover:bg-green-200";
        case "cancelado":
          return "bg-red-100 text-red-800 border-red-300 hover:bg-red-200";
        default:
          return "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20";
      }
    }

    return "bg-white hover:bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <button
      className={`px-3 py-1 rounded-full text-sm border ${getStatusStyles()} transition-colors`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
