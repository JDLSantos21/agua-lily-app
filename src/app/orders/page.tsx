// src/app/pedidos/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useOrderStore } from "@/stores/orderStore";
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
  CalendarDays,
  Package,
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

export default function PedidosPage() {
  // Vista activa: list, grid o stats
  const [activeView, setActiveView] = useState<"list" | "grid" | "stats">(
    "grid"
  );
  const [activeStatusFilter, setActiveStatusFilter] = useState<
    OrderStatus | "all"
  >("all");

  // Estado para el formulario de pedidos
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);

  // Obtener estado y acciones del store
  const {
    orders,
    pagination,
    isLoading,
    error,
    filters,
    dialogState,
    fetchOrders,
    fetchOrderStats,
    setFilters,
    openViewDialog,
    openFormDialog,
    openStatusDialog,
    openAssignDialog,
    openDeleteDialog,
    closeViewDialog,
    closeFormDialog,
    closeStatusDialog,
    closeAssignDialog,
    closeDeleteDialog,
    deleteOrder,
  } = useOrderStore();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, [fetchOrders, fetchOrderStats]);

  // Manejar el cambio de filtro de estado
  const handleStatusFilterChange = (status: OrderStatus | "all") => {
    setActiveStatusFilter(status);

    if (status === "all") {
      setFilters({ ...filters, order_status: undefined });
    } else {
      setFilters({ ...filters, order_status: status });
    }
  };

  // Manejadores para el formulario de pedidos
  const handleOpenNewOrderForm = () => {
    setOrderToEdit(null);
    setIsOrderFormOpen(true);
  };

  const handleOpenEditOrderForm = (order: Order) => {
    setOrderToEdit(order);
    setIsOrderFormOpen(true);
    closeFormDialog(); // Cerrar diálogo existente si está abierto
  };

  const handleCloseOrderForm = () => {
    setIsOrderFormOpen(false);
    setOrderToEdit(null);
  };

  // Renderizado basado en estado de carga
  if (error) {
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
            <p className="text-sm text-gray-400 mt-2">Detalles: {error}</p>
            <Button onClick={() => fetchOrders()}>Reintentar</Button>
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

          <Button variant="outline" asChild>
            <Link href="/orders/calendario" className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>Calendario</span>
            </Link>
          </Button>

          <Button onClick={handleOpenNewOrderForm} variant="primary">
            <PlusIcon className="h-4 w-4 mr-1" />
            <span>Nuevo Pedido</span>
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="mb-6">
        <OrderStats simplified />
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
          onChange={setFilters}
          initialFilters={filters}
          compact={true}
        />
      </div>

      {/* Contenido según la vista seleccionada */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoaderSpin text="Cargando pedidos..." />
          </div>
        ) : (
          <>
            {activeView === "stats" ? (
              // Vista de estadísticas
              <div className="space-y-6">
                <OrderStats />

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
                      <Button onClick={handleOpenNewOrderForm}>
                        <FilePlus className="h-4 w-4 mr-1" />
                        Crear Pedido
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-2">
                    {orders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onView={openViewDialog}
                        onEdit={handleOpenEditOrderForm}
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
                      <Button>
                        <FilePlus className="h-4 w-4 mr-1" />
                        Crear Pedido
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
                      {orders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onView={openViewDialog}
                          onEdit={openFormDialog}
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

      {/* Diálogos */}
      <OrderForm
        open={isOrderFormOpen}
        onOpenChange={handleCloseOrderForm}
        initialOrder={orderToEdit}
      />

      <OrderViewDialog
        orderId={dialogState.viewDialog.orderId}
        onClose={closeViewDialog}
        onEdit={openFormDialog}
        onChangeStatus={openStatusDialog}
        onAssignDelivery={openAssignDialog}
        onDelete={openDeleteDialog}
      />

      <OrderStatusDialog
        open={dialogState.statusDialog.isOpen}
        onOpenChange={closeStatusDialog}
        order={dialogState.statusDialog.order}
      />

      <OrderAssignDeliveryDialog
        open={dialogState.assignDialog.isOpen}
        onOpenChange={closeAssignDialog}
        order={dialogState.assignDialog.order}
      />

      <ConfirmDialog
        open={dialogState.deleteDialog.isOpen}
        title="Eliminar pedido"
        description={`¿Está seguro que desea eliminar el pedido ${dialogState.deleteDialog.order?.tracking_code || ""}? Esta acción no se puede deshacer.`}
        onConfirm={() => {
          if (dialogState.deleteDialog.order?.id) {
            deleteOrder(dialogState.deleteDialog.order.id);
          }
        }}
        onCancel={closeDeleteDialog}
      />

      {/* Paginación */}
      {pagination && pagination.total > (pagination.limit || 10) && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-1">
            {/* Aquí iría la paginación */}
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm" className="px-3 bg-primary/5">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Siguiente
            </Button>
          </div>
        </div>
      )}
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
