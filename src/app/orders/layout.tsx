// src/app/orders/layout.tsx
"use client";

import SideNav from "@/ui/sidenav/sidenav";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { usePathname } from "next/navigation";
import {
  Package,
  SearchIcon,
  CalendarDays,
  BarChart,
  Clock,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewOrderButton from "./components/order-menu-button";

// Importar useOrderStats hook
import { useOrderStats } from "@/hooks/useOrders";

export default function PedidosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Usar el hook de TanStack Query con staleTime para evitar peticiones frecuentes
  const { data: statsResponse } = useOrderStats({
    staleTime: 5 * 60 * 1000, // 5 minutos - tiempo suficiente para el layout
    refetchOnWindowFocus: false, // Evitar refetch constante al cambiar el foco
  });

  const orderStats = statsResponse?.data;

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
                          className={`flex items-center gap-1`}
                        >
                          <Package
                            className={`h-4 w-4 ${isActive("/orders") ? "text-blue-500" : ""}`}
                          />
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
                  {pathname !== "/orders" && <NewOrderButton />}
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
  active?: boolean;
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
    <div>
      <Badge
        variant="outline"
        className={`${getBadgeStyles()} cursor-pointer transition-colors px-2 py-1`}
      >
        {icon && <span className="mr-1">{icon}</span>}
        <span>{count}</span>
      </Badge>
    </div>
  );
}
