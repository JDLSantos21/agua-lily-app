// src/app/pedidos/layout.tsx
"use client";

import SideNav from "@/ui/sidenav/sidenav";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/stores/orderStore";
import {
  Package,
  SearchIcon,
  CalendarDays,
  BarChart,
  ListFilter,
  Clock,
  Truck,
  CheckCircle,
  AlertTriangle,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PedidosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { orderStats, fetchOrderStats } = useOrderStore();

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    fetchOrderStats();

    // Actualizar estadísticas cada 5 minutos
    const interval = setInterval(
      () => {
        fetchOrderStats();
      },
      5 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [fetchOrderStats]);

  // Determinar qué sección está activa
  const isActive = (path: string) => {
    if (path === "/orders" && pathname === "/orders") {
      return true;
    }
    if (path !== "/orders" && pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-auto">
          <SideNav />
        </div>
        <div className="flex-grow md:overflow-y-auto">
          {/* Navegación superior para pedidos */}
          <div className="bg-background border-b sticky bg-white top-0 z-10">
            <div className="container py-2 px-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Tabs value={pathname}>
                    <TabsList>
                      <TabsTrigger value="/orders" asChild>
                        <Link
                          href="/orders"
                          className="flex items-center gap-1"
                        >
                          <Package className="h-4 w-4" />
                          <span>Pedidos</span>
                        </Link>
                      </TabsTrigger>
                      <TabsTrigger value="/orders/buscar" asChild>
                        <Link
                          href="/orders/buscar"
                          className="flex items-center gap-1"
                        >
                          <SearchIcon className="h-4 w-4" />
                          <span>Buscar</span>
                        </Link>
                      </TabsTrigger>
                      <TabsTrigger value="/orders/calendario" asChild>
                        <Link
                          href="/orders/calendario"
                          className="flex items-center gap-1"
                        >
                          <CalendarDays className="h-4 w-4" />
                          <span>Calendario</span>
                        </Link>
                      </TabsTrigger>
                      <TabsTrigger value="/orders/estadisticas" asChild>
                        <Link
                          href="/orders/estadisticas"
                          className="flex items-center gap-1"
                        >
                          <BarChart className="h-4 w-4" />
                          <span>Estadísticas</span>
                        </Link>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="flex items-center gap-2">
                  {orderStats && (
                    <div className="flex items-center space-x-1 text-xs">
                      <StatusBadge
                        count={orderStats.pedidos_pendientes}
                        status="pendiente"
                        icon={<Clock className="h-3 w-3" />}
                      />
                      <StatusBadge
                        count={orderStats.pedidos_preparando}
                        status="preparando"
                        icon={<Package className="h-3 w-3" />}
                      />
                      <StatusBadge
                        count={orderStats.pedidos_despachados}
                        status="despachado"
                        icon={<Truck className="h-3 w-3" />}
                      />
                    </div>
                  )}

                  <Button size="sm" className="gap-1">
                    <PlusIcon className="h-4 w-4" />
                    <span>Nuevo Pedido</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="mt-2 px-2">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Componente de badge para estados
interface StatusBadgeProps {
  count: number;
  status: "pendiente" | "preparando" | "despachado" | "entregado" | "cancelado";
  icon?: React.ReactNode;
}

function StatusBadge({ count, status, icon }: StatusBadgeProps) {
  if (count === 0) return null;

  // Colores según el estado
  const getBadgeStyles = () => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "preparando":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "despachado":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "entregado":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "cancelado":
        return "bg-red-100 text-red-800 hover:bg-red-200";
    }
  };

  return (
    <Link href={`/pedidos?status=${status}`}>
      <Badge
        variant="outline"
        className={`${getBadgeStyles()} cursor-pointer transition-colors px-2 py-1`}
      >
        {icon && <span className="mr-1">{icon}</span>}
        <span>{count}</span>
      </Badge>
    </Link>
  );
}
