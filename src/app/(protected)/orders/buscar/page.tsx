// src/app/orders/buscar/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ArrowLeft, QrCode } from "lucide-react";
import { Order } from "@/types/orders.types";
import { LoaderSpin } from "@/components/Loader";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Empty } from "@/components/Empty";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";

// Componentes
import OrderAssignDeliveryDialog from "../components/order-assign-dialog";
import OrderStatusDialog from "../components/order-status-dialog";
import OrderViewDialog from "../components/order-view-dialog";
import OrderCard from "../components/order-card";

// Hooks de TanStack Query
import {
  useSearchOrders,
  useOrderByTracking,
  useDeleteOrder,
} from "@/hooks/useOrders";

export default function BuscarPedidosPage() {
  // Estados para la búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Estados para seguimiento directo de pedido
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingError, setTrackingError] = useState<string | null>(null);

  // Estados para diálogos
  const [dialogs, setDialogs] = useState({
    viewDialog: { isOpen: false, orderId: null as number | null },
    formDialog: { isOpen: false, order: null as Order | null },
    deleteDialog: { isOpen: false, order: null as Order | null },
    statusDialog: { isOpen: false, order: null as Order | null },
    assignDialog: { isOpen: false, order: null as Order | null },
  });

  // Consultas con TanStack Query
  const { data: searchResults, isLoading: isSearching } = useSearchOrders(
    debouncedSearchTerm,
    10,
    {
      enabled: debouncedSearchTerm.length >= 2,
      placeholderData: (old) => old,
    }
  );

  const {
    data: trackingOrderResponse,
    isLoading: isTrackingLoading,
    error: trackingQueryError,
    refetch: refetchTracking,
  } = useOrderByTracking(trackingCode, {
    enabled: false, // No ejecutar automáticamente
  });

  const deleteOrderMutation = useDeleteOrder();

  // Manejar búsqueda por código de seguimiento
  const handleTrackingSearch = async () => {
    if (!trackingCode) return;

    setTrackingError(null);
    try {
      await refetchTracking();
    } catch (err) {
      setTrackingError(
        "Error al buscar el pedido. Verifique el código e intente nuevamente."
      );
    }
  };

  // Efecto para manejar errores de tracking
  useEffect(() => {
    if (trackingQueryError) {
      setTrackingError(
        "No se encontró ningún pedido con ese código de seguimiento"
      );
    }
  }, [trackingQueryError]);

  // Extraer el pedido de tracking de la respuesta
  const trackingOrder = trackingOrderResponse?.data || null;

  // Manejar tecla Enter en input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTrackingSearch();
    }
  };

  // Funciones para diálogos
  const openViewDialog = (orderId: number) => {
    setDialogs((prev) => ({
      ...prev,
      viewDialog: { isOpen: true, orderId },
    }));
  };

  const closeViewDialog = () => {
    setDialogs((prev) => ({
      ...prev,
      viewDialog: { isOpen: false, orderId: null },
    }));
  };

  const openFormDialog = (order: Order) => {
    setDialogs((prev) => ({
      ...prev,
      formDialog: { isOpen: true, order },
    }));
  };

  // const closeFormDialog = () => {
  //   setDialogs((prev) => ({
  //     ...prev,
  //     formDialog: { isOpen: false, order: null },
  //   }));
  // };

  const openStatusDialog = (order: Order) => {
    setDialogs((prev) => ({
      ...prev,
      statusDialog: { isOpen: true, order },
    }));
  };

  const closeStatusDialog = () => {
    setDialogs((prev) => ({
      ...prev,
      statusDialog: { isOpen: false, order: null },
    }));
  };

  const openAssignDialog = (order: Order) => {
    setDialogs((prev) => ({
      ...prev,
      assignDialog: { isOpen: true, order },
    }));
  };

  const closeAssignDialog = () => {
    setDialogs((prev) => ({
      ...prev,
      assignDialog: { isOpen: false, order: null },
    }));
  };

  const openDeleteDialog = (order: Order) => {
    setDialogs((prev) => ({
      ...prev,
      deleteDialog: { isOpen: true, order },
    }));
  };

  const closeDeleteDialog = () => {
    setDialogs((prev) => ({
      ...prev,
      deleteDialog: { isOpen: false, order: null },
    }));
  };

  const handleDeleteOrder = () => {
    if (dialogs.deleteDialog.order?.id) {
      deleteOrderMutation.mutate(dialogs.deleteDialog.order.id, {
        onSuccess: closeDeleteDialog,
      });
    }
  };

  return (
    <div className="container p-4 space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/orders">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Búsqueda de Pedidos</h1>
          <p className="text-gray-500 mt-1">
            Busque pedidos por código de seguimiento o información del cliente
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Búsqueda por código de seguimiento */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <QrCode className="h-5 w-5 text-blue-500" />
              Seguimiento de Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Input
                    value={trackingCode}
                    onChange={(e) =>
                      setTrackingCode(e.target.value.toUpperCase())
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Ingrese código de seguimiento (ej. PD-123456-2024-01)"
                    className="pr-10 font-mono"
                  />
                </div>
                <Button
                  onClick={handleTrackingSearch}
                  disabled={!trackingCode || isTrackingLoading}
                  variant="primary"
                >
                  {isTrackingLoading ? "Buscando..." : "Buscar"}
                </Button>
              </div>

              {isTrackingLoading ? (
                <div className="flex justify-center py-8">
                  <LoaderSpin text="Buscando pedido..." />
                </div>
              ) : trackingError ? (
                <div className="py-6 px-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-center">
                  {trackingError}
                </div>
              ) : trackingOrder ? (
                <div className="pt-2">
                  <OrderCard order={trackingOrder} onView={openViewDialog} />
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500 border border-dashed rounded-md">
                  <QrCode className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>
                    Ingrese un código de seguimiento para rastrear un pedido
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Búsqueda general */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-500" />
              Búsqueda de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por cliente, teléfono, etc..."
                  className="pl-8"
                />
              </div>

              {searchTerm.length < 2 ? (
                <div className="py-8 text-center text-gray-500 border border-dashed rounded-md">
                  <Search className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p>Introduzca al menos 2 caracteres para buscar</p>
                </div>
              ) : isSearching ? (
                <div className="flex justify-center py-8">
                  <LoaderSpin text="Buscando..." />
                </div>
              ) : searchResults?.data.length === 0 ? (
                <Empty
                  title="Sin resultados"
                  description="No se encontraron pedidos que coincidan con su búsqueda"
                  className="py-6"
                />
              ) : (
                <div className="max-h-[500px] overflow-y-auto pr-1 space-y-3">
                  <div className="text-sm text-gray-500 mb-2">
                    Se encontraron {searchResults?.data.length} resultados
                  </div>
                  <AnimatePresence>
                    {searchResults?.data.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <OrderCard
                          order={order}
                          onView={openViewDialog}
                          onEdit={openFormDialog}
                          onChangeStatus={openStatusDialog}
                          onDelete={openDeleteDialog}
                          layout="compact"
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diálogos */}
      <OrderViewDialog
        orderId={dialogs.viewDialog.orderId}
        onClose={closeViewDialog}
        onEdit={openFormDialog}
        onChangeStatus={openStatusDialog}
        onAssignDelivery={openAssignDialog}
        onDelete={openDeleteDialog}
      />

      <OrderStatusDialog
        open={dialogs.statusDialog.isOpen}
        onOpenChange={closeStatusDialog}
        order={dialogs.statusDialog.order}
      />

      <OrderAssignDeliveryDialog
        open={dialogs.assignDialog.isOpen}
        onOpenChange={closeAssignDialog}
        order={dialogs.assignDialog.order}
      />

      <ConfirmDialog
        open={dialogs.deleteDialog.isOpen}
        title="Eliminar pedido"
        description={`¿Está seguro que desea eliminar el pedido ${dialogs.deleteDialog.order?.tracking_code || ""}? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteOrder}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
}
