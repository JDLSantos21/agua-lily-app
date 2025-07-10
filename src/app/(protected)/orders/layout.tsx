// src/app/orders/layout.tsx
"use client";

import SideNav from "@/ui/sidenav/sidenav";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { usePathname } from "next/navigation";
import { Package, SearchIcon } from "lucide-react";
import Link from "next/link";
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

  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-auto">
          <SideNav />
        </div>
        <div className="flex-grow md:overflow-y-auto">
          {/* Navegación superior moderna */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Navegación principal */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                      <Package className="h-4 w-4 text-white" />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      Gestión de Pedidos
                    </h1>
                  </div>

                  <nav className="flex items-center">
                    <Tabs value={pathname} className="w-auto">
                      <TabsList className="bg-gray-100 p-1">
                        <TabsTrigger value="/orders" asChild>
                          <Link
                            href="/orders"
                            className="flex items-center gap-2 px-4 py-2 rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
                          >
                            <Package className="h-4 w-4" />
                            <span className="font-medium">Pedidos</span>
                          </Link>
                        </TabsTrigger>
                        <TabsTrigger value="/orders/buscar" asChild>
                          <Link
                            href="/orders/buscar"
                            className="flex items-center gap-2 px-4 py-2 rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm"
                          >
                            <SearchIcon className="h-4 w-4" />
                            <span className="font-medium">Buscar</span>
                          </Link>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </nav>
                </div>

                {/* Área de estadísticas y acciones */}
                <div className="flex items-center gap-4">
                  {/* Estadísticas rápidas */}
                  {orderStats && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">
                          {orderStats.pedidos_pendientes}
                        </span>
                      </div>
                      <div className="w-px h-4 bg-gray-300"></div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">
                          {orderStats.pedidos_preparando}
                        </span>
                      </div>
                      <div className="w-px h-4 bg-gray-300"></div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">
                          {orderStats.pedidos_despachados}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Botón de nuevo pedido para otras páginas */}
                  {pathname !== "/orders" && <NewOrderButton />}
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="bg-gray-50 min-h-screen">
            <div className="">{children}</div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
