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
  BarChartIcon,
  FilePlus,
  Package,
  ChevronLeft,
  ChevronRight,
  Monitor,
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
import { DateRangeSelector } from "./components/date-range-selector";

// Hooks de TanStack Query
import { useOrders, useOrderStats, useDeleteOrder } from "@/hooks/useOrders";
import { format, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { ReceptorWindow } from "@/shared/tauri/windows/receptor";

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
const ITEMS_PER_PAGE = 8;

export default function PedidosPage() {
  const initialView = localStorage.getItem("activeView") as
    | "list"
    | "grid"
    | "stats"
    | null;

  // Vista activa: list, grid o stats
  const [activeView, setActiveView] = useState<"list" | "grid" | "stats">(
    initialView || "grid",
  );

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Estado para rango de fechas - inicializar con el mes actual
  // Nota: end_date se extiende +1 día porque la BD guarda en UTC
  // (un pedido creado a las 11pm local aparece como día siguiente en UTC)
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfThisMonth = startOfMonth(today);
    return {
      start_date: format(startOfThisMonth, "yyyy-MM-dd"),
      end_date: format(tomorrow, "yyyy-MM-dd"),
    };
  });

  // Estado para filtros
  const [filters, setFilters] = useState<{
    order_status?: OrderStatus;
    search?: string;
    scheduled_date?: string;
  }>({});

  // const [activeStatusFilter, setActiveStatusFilter] = useState<
  //   OrderStatus | "all"
  // >("all");

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
    [currentPage],
  );

  // Filtros con paginación y rango de fechas
  const filtersWithPagination = useMemo(
    () => ({
      ...filters,
      ...dateRange,
      limit: ITEMS_PER_PAGE,
      offset: offset,
    }),
    [filters, dateRange, offset],
  );

  // Filtros solo de fecha para estadísticas
  const statsFilters = useMemo(
    () => ({
      start_date: dateRange.start_date,
      end_date: dateRange.end_date,
    }),
    [dateRange],
  );

  // Consultas de datos con TanStack Query
  const {
    data: ordersResponse,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useOrders(filtersWithPagination, {
    refetchOnWindowFocus: false,
    placeholderData: (old) => old,
  });

  // Consultar estadísticas con filtros de fecha
  const { data: statsData, isLoading: isLoadingStats } = useOrderStats(
    statsFilters,
    {
      refetchOnWindowFocus: false,
      placeholderData: (old) => old,
    },
  );

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
  // const handleStatusFilterChange = useCallback(
  //   (status: OrderStatus | "all") => {
  //     setActiveStatusFilter(status);
  //     setFilters((prev) => ({
  //       ...prev,
  //       order_status: status === "all" ? undefined : status,
  //     }));
  //     setCurrentPage(1);
  //   },
  //   []
  // );

  // Manejador de cambio de filtros generales
  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // Manejador de cambio de rango de fechas
  const handleDateRangeChange = useCallback(
    (newRange: { start_date: string; end_date: string }) => {
      setDateRange(newRange);
      setCurrentPage(1);
    },
    [],
  );

  // Manejador de eliminación de pedido
  const handleDeleteOrder = useCallback(() => {
    if (dialogs.deleteOrder.order?.id) {
      deleteOrderMutation.mutate(dialogs.deleteOrder.order.id, {
        onSuccess: () => {
          closeDeleteDialog();
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

  const handleNextPage = useCallback(() => {
    const paginationData = ordersResponse?.pagination;
    const total = paginationData?.total || 0;
    const maxPages = Math.ceil(total / ITEMS_PER_PAGE);
    if (currentPage < maxPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, ordersResponse?.pagination]);

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Memoizar la lista de pedidos para evitar re-renderizados
  const orders = useMemo(() => ordersResponse?.data || [], [ordersResponse]);

  const pagination = useMemo(
    () => ordersResponse?.pagination,
    [ordersResponse],
  );

  // Calcular información de paginación
  const totalPages = useMemo(
    () => Math.ceil((pagination?.total || 0) / ITEMS_PER_PAGE),
    [pagination?.total],
  );

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Generar números de página para mostrar
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (start > 1) {
        pages.unshift(1);
        if (start > 2) {
          pages.splice(1, 0, -1);
        }
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push(-1);
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
    <main className="min-h-screen bg-gray-50/50 p-3 pb-20">
      {/* Header con estadísticas y acciones principales */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-2 xl:p-3 mb-3">
        <div className="flex  xl:flex-row lg:items-center justify-between gap-3 xl:gap-6">
          {/* Estadísticas simplificadas */}
          <div className="flex-1">
            <OrderStats
              simplified
              stats={statsData?.data}
              isLoading={isLoadingStats}
            />
          </div>
          {/* Acciones principales */}
          <div className="flex items-center gap-3">
            <Button
              onClick={ReceptorWindow.open}
              variant="outline"
              className="gap-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-700 shadow-sm"
            >
              <Monitor className="h-4 w-4" />
              <span>Receptor</span>
            </Button>
            <Button
              onClick={openNewOrderDialog}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-4 py-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Nuevo Pedido</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros y controles */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-3 mb-3">
        <div className="flex flex-col gap-4">
          {/* Selector de rango de fechas */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">
                Rango de fechas
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Filtra pedidos y estadísticas por período
              </p>
            </div>
            <DateRangeSelector
              value={dateRange}
              onChange={handleDateRangeChange}
            />
          </div>

          {/* Filtros avanzados y vista */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <OrderFilters
                onChange={handleFiltersChange}
                initialFilters={filters}
                compact={true}
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Información de resultados */}
              {pagination && pagination.total > 0 && (
                <div className="text-sm text-gray-500 hidden sm:block">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, pagination.total)} de{" "}
                  {pagination.total}
                </div>
              )}

              {/* Selector de vista */}
              <Tabs
                value={activeView}
                onValueChange={(value) => setActiveView(value as any)}
              >
                <TabsList className="bg-gray-100">
                  <TabsTrigger
                    value="grid"
                    onClick={() => localStorage.setItem("activeView", "grid")}
                    className="gap-2 data-[state=active]:bg-white"
                  >
                    <Grid2X2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Cuadrícula</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="list"
                    onClick={() => localStorage.setItem("activeView", "list")}
                    className="gap-2 data-[state=active]:bg-white"
                  >
                    <ListIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Lista</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="gap-2 data-[state=active]:bg-white"
                  >
                    <BarChartIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Estadísticas</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido según la vista seleccionada */}
      <div className="mt-3">
        {isLoadingOrders ? (
          <div className="flex justify-center py-12">
            <LoaderSpin text="Cargando pedidos..." />
          </div>
        ) : (
          <>
            {activeView === "stats" ? (
              // Vista de estadísticas
              <div className="space-y-6">
                {/* Estadísticas principales */}
                <OrderStats
                  stats={statsData?.data}
                  isLoading={isLoadingStats}
                />

                {/* Información adicional */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Resumen del período */}
                  <Card className="bg-white border border-gray-200/80 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            Resumen del Período Seleccionado
                          </h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-sm text-gray-600">
                                Fecha de inicio
                              </span>
                              <span className="text-sm font-semibold text-gray-900">
                                {(() => {
                                  const [year, month, day] =
                                    dateRange.start_date.split("-").map(Number);
                                  return format(
                                    new Date(year, month - 1, day),
                                    "dd MMM yyyy",
                                    { locale: es },
                                  );
                                })()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <span className="text-sm text-gray-600">
                                Fecha de fin
                              </span>
                              <span className="text-sm font-semibold text-gray-900">
                                {(() => {
                                  const [year, month, day] = dateRange.end_date
                                    .split("-")
                                    .map(Number);
                                  return format(
                                    new Date(year, month - 1, day),
                                    "dd MMM yyyy",
                                    { locale: es },
                                  );
                                })()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-sm text-gray-600">
                                Días en el rango
                              </span>
                              <span className="text-sm font-semibold text-gray-900">
                                {(() => {
                                  const [startYear, startMonth, startDay] =
                                    dateRange.start_date.split("-").map(Number);
                                  const [endYear, endMonth, endDay] =
                                    dateRange.end_date.split("-").map(Number);
                                  const start = new Date(
                                    startYear,
                                    startMonth - 1,
                                    startDay,
                                  );
                                  const end = new Date(
                                    endYear,
                                    endMonth - 1,
                                    endDay,
                                  );
                                  return (
                                    Math.ceil(
                                      (end.getTime() - start.getTime()) /
                                        (1000 * 60 * 60 * 24),
                                    ) + 1
                                  );
                                })()}{" "}
                                días
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Acciones rápidas */}
                  <Card className="bg-white border border-gray-200/80 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                          Acciones Rápidas
                        </h3>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={openNewOrderDialog}
                          >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Crear Nuevo Pedido
                          </Button>
                          <Link href="/orders/estadisticas" className="block">
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                            >
                              <BarChartIcon className="h-4 w-4 mr-2" />
                              Ver Análisis Detallado
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              // Cambiar a vista de lista para ver todos los pedidos
                              setActiveView("grid");
                            }}
                          >
                            <Grid2X2 className="h-4 w-4 mr-2" />
                            Ver Todos los Pedidos
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                      <Button variant="default" onClick={openNewOrderDialog}>
                        <FilePlus className="h-4 w-4 mr-1" />
                        Crear Pedido
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-3">
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
                      <Button variant="default" onClick={openNewOrderDialog}>
                        <FilePlus className="h-4 w-4 mr-1" />
                        Crear Pedido
                      </Button>
                    }
                  />
                ) : (
                  <motion.div
                    className="grid lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-4"
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
          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 shadow-sm p-1">
            {/* Botón Anterior */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!canGoPrevious}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
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
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageClick(pageNum)}
                    className={`px-3 ${
                      currentPage === pageNum
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </Button>
                ),
              )}
            </div>

            {/* Botón Siguiente */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPage}
              disabled={!canGoNext}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Diálogos */}
      <OrderForm
        open={dialogs.newOrder.isOpen}
        onOpenChange={closeNewOrderDialog}
      />

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
