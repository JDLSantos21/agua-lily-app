// src/app/orders/components/order-stats.tsx
import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Calendar,
  ShoppingCart,
  BarChart3,
} from "lucide-react";
import { type OrderStats } from "@/types/orders.types";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderStatsComponentProps {
  simplified?: boolean;
  stats?: OrderStats | null;
  isLoading?: boolean;
}

const OrderStats = memo(function OrderStatsComponent({
  simplified = false,
  stats,
  isLoading = false,
}: OrderStatsComponentProps) {
  // Obtener día de la semana con más pedidos (debe estar antes de cualquier return condicional)
  const dayWithMostOrders = useMemo(() => {
    if (!stats?.por_dia_semana || stats.por_dia_semana.length === 0)
      return null;

    const maxDay = stats.por_dia_semana.reduce((prev, current) =>
      current.cantidad > prev.cantidad ? current : prev
    );

    // Backend: 1=Domingo, 2=Lunes, 3=Martes, 4=Miércoles, 5=Jueves, 6=Viernes, 7=Sábado
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    return {
      name: dayNames[maxDay.dia_semana - 1],
      cantidad: maxDay.cantidad,
    };
  }, [stats?.por_dia_semana]);

  // Calcular porcentajes
  const totalPedidos = stats?.total_pedidos || 1;

  // Si está cargando, mostrar skeleton
  if (isLoading) {
    return simplified ? (
      <div className="flex items-center gap-3">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200"
            >
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div>
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-5 w-8" />
              </div>
            </div>
          ))}
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </Card>
          ))}
      </div>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (!stats) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">
          No hay datos de estadísticas disponibles
        </p>
      </div>
    );
  }

  // Si es simplificado, mostrar versión compacta
  if (simplified) {
    return (
      <div className="flex items-center gap-3">
        {/* <StatSummaryCard
          label="Total"
          value={stats.total_pedidos}
          icon={Package}
          color="slate"
        /> */}
        <StatSummaryCard
          label="Pendientes"
          value={stats.pedidos_pendientes}
          icon={Clock}
          color="amber"
        />
        <StatSummaryCard
          label="En proceso"
          value={
            Number(stats.pedidos_preparando) + Number(stats.pedidos_despachados)
          }
          icon={Truck}
          color="blue"
        />
        <StatSummaryCard
          label="Completados"
          value={stats.pedidos_entregados}
          icon={CheckCircle}
          color="green"
        />
      </div>
    );
  }

  // Versión completa
  return (
    <div className="space-y-6">
      {/* Resumen principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total de Pedidos
                </p>
                <p className="text-3xl font-bold mt-1 text-gray-900">
                  {stats.total_pedidos}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Pedidos registrados
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Clientes Únicos
                </p>
                <p className="text-3xl font-bold mt-1 text-gray-900">
                  {stats.clientes_unicos}
                </p>
                <p className="text-gray-400 text-xs mt-2">Clientes activos</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Tasa de Entrega
                </p>
                <p className="text-3xl font-bold mt-1 text-gray-900">
                  {totalPedidos > 0
                    ? Math.round(
                        (stats.pedidos_entregados / totalPedidos) * 100
                      )
                    : 0}
                  %
                </p>
                <p className="text-gray-400 text-xs mt-2">Pedidos entregados</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas detalladas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Pendientes"
          value={stats.pedidos_pendientes}
          percentage={Math.round(
            (stats.pedidos_pendientes / totalPedidos) * 100
          )}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Preparando"
          value={stats.pedidos_preparando}
          percentage={Math.round(
            (stats.pedidos_preparando / totalPedidos) * 100
          )}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Despachados"
          value={stats.pedidos_despachados}
          percentage={Math.round(
            (stats.pedidos_despachados / totalPedidos) * 100
          )}
          icon={Truck}
          color="purple"
        />
        <StatCard
          title="Entregados"
          value={stats.pedidos_entregados}
          percentage={Math.round(
            (stats.pedidos_entregados / totalPedidos) * 100
          )}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Cancelados"
          value={stats.pedidos_cancelados}
          percentage={Math.round(
            (stats.pedidos_cancelados / totalPedidos) * 100
          )}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Gráficos adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pedidos por día de la semana */}
        {stats.por_dia_semana && stats.por_dia_semana.length > 0 && (
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Distribución por Día de la Semana
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-1">
                    Total de pedidos por día
                  </p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(() => {
                  const dayNames = [
                    "Domingo",
                    "Lunes",
                    "Martes",
                    "Miércoles",
                    "Jueves",
                    "Viernes",
                    "Sábado",
                  ];
                  const maxCantidad = Math.max(
                    ...stats.por_dia_semana!.map((d) => d.cantidad)
                  );

                  // Iterar días 1-7
                  return [1, 2, 3, 4, 5, 6, 7].map((backendDayIndex) => {
                    const dayData = stats.por_dia_semana!.find(
                      (d) => d.dia_semana === backendDayIndex
                    );
                    const cantidad = dayData?.cantidad || 0;
                    const percentage =
                      maxCantidad > 0 ? (cantidad / maxCantidad) * 100 : 0;

                    return (
                      <div key={backendDayIndex} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">
                            {dayNames[backendDayIndex - 1]}
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {cantidad} pedidos
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Productos más populares */}
        {stats.productos_populares && stats.productos_populares.length > 0 && (
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Productos Más Vendidos
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-1">
                    Top {stats.productos_populares.length} productos
                  </p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.productos_populares
                  .slice(0, 7)
                  .map((producto, index) => {
                    const maxCantidad = Math.max(
                      ...stats.productos_populares!.map((p) =>
                        Number(p.cantidad_total)
                      )
                    );
                    const percentage =
                      (Number(producto.cantidad_total) / maxCantidad) * 100;

                    return (
                      <div key={producto.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                              {index + 1}
                            </span>
                            <span className="font-medium text-gray-700 truncate max-w-[180px]">
                              {producto.name}
                            </span>
                          </div>
                          <span className="text-gray-900 font-semibold">
                            {Number(producto.cantidad_total).toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Insights adicionales */}
      {(dayWithMostOrders || stats.productos_populares?.length) && (
        <Card className="border-gray-200 shadow-sm bg-gradient-to-br from-slate-50 to-gray-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Insights del Período
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dayWithMostOrders && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    Día con más pedidos
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {dayWithMostOrders.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {dayWithMostOrders.cantidad} pedidos
                  </p>
                </div>
              )}
              {stats.productos_populares &&
                stats.productos_populares.length > 0 && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Producto más vendido
                    </p>
                    <p className="text-lg font-bold text-blue-600 truncate">
                      {stats.productos_populares[0].name}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {Number(
                        stats.productos_populares[0].cantidad_total
                      ).toLocaleString()}{" "}
                      unidades
                    </p>
                  </div>
                )}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Promedio diario
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.por_dia_semana
                    ? Math.round(
                        stats.por_dia_semana.reduce(
                          (acc, day) => acc + day.cantidad,
                          0
                        ) / stats.por_dia_semana.length
                      )
                    : 0}
                </p>
                <p className="text-xs text-gray-600 mt-1">pedidos/día</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

// Componente compacto para el resumen
interface StatSummaryCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: "slate" | "blue" | "amber" | "purple" | "green" | "red";
}

function StatSummaryCard({
  label,
  value,
  icon: Icon,
  color,
}: StatSummaryCardProps) {
  const colorClasses = {
    slate: "bg-white border-gray-200 text-gray-700",
    blue: "bg-white border-blue-200 text-gray-700",
    amber: "bg-white border-amber-200 text-gray-700",
    purple: "bg-white border-purple-200 text-gray-700",
    green: "bg-white border-emerald-200 text-gray-700",
    red: "bg-white border-rose-200 text-gray-700",
  };

  const iconClasses = {
    slate: "text-slate-600 bg-slate-100",
    blue: "text-blue-600 bg-blue-50",
    amber: "text-amber-600 bg-amber-50",
    purple: "text-purple-600 bg-purple-50",
    green: "text-emerald-600 bg-emerald-50",
    red: "text-rose-600 bg-rose-50",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colorClasses[color]} transition-all hover:shadow-sm`}
    >
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-lg ${iconClasses[color]}`}
      >
        <Icon className={`h-4 w-4`} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// Componente para tarjetas de estadísticas detalladas
interface StatCardProps {
  title: string;
  value: number;
  percentage: number;
  icon: React.ElementType;
  color: "blue" | "amber" | "purple" | "green" | "red";
}

function StatCard({
  title,
  value,
  percentage,
  icon: Icon,
  color,
}: StatCardProps) {
  const colorClasses = {
    blue: "border-l-blue-400 bg-white",
    amber: "border-l-amber-400 bg-white",
    purple: "border-l-purple-400 bg-white",
    green: "border-l-emerald-400 bg-white",
    red: "border-l-rose-400 bg-white",
  };

  const iconClasses = {
    blue: "text-blue-600 bg-blue-50",
    amber: "text-amber-600 bg-amber-50",
    purple: "text-purple-600 bg-purple-50",
    green: "text-emerald-600 bg-emerald-50",
    red: "text-rose-600 bg-rose-50",
  };

  const progressClasses = {
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    purple: "bg-purple-500",
    green: "bg-emerald-500",
    red: "bg-rose-500",
  };

  return (
    <Card
      className={`border-l-4 ${colorClasses[color]} hover:shadow-md transition-shadow border border-gray-200`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-700">
            {title}
          </CardTitle>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-lg ${iconClasses[color]}`}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            <span className="text-sm text-gray-500">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${progressClasses[color]}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderStats;
