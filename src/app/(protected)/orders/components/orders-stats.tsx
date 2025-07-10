// src/app/orders/components/order-stats.tsx
import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
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
        <StatSummaryCard
          label="Total"
          value={stats.total_pedidos}
          icon={Package}
          color="slate"
        />
        <StatSummaryCard
          label="Pendientes"
          value={stats.pedidos_pendientes}
          icon={Clock}
          color="amber"
        />
        <StatSummaryCard
          label="En proceso"
          value={stats.pedidos_preparando + stats.pedidos_despachados}
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

  // Calcular porcentajes
  const totalPedidos = stats.total_pedidos || 1;

  // Versión completa
  return (
    <div className="space-y-6">
      {/* Resumen principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  Total de Pedidos
                </p>
                <p className="text-3xl font-bold mt-1">{stats.total_pedidos}</p>
                <p className="text-blue-100 text-xs mt-2">
                  Pedidos registrados
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  Clientes Únicos
                </p>
                <p className="text-3xl font-bold mt-1">
                  {stats.clientes_unicos}
                </p>
                <p className="text-green-100 text-xs mt-2">Clientes activos</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  Tasa de Entrega
                </p>
                <p className="text-3xl font-bold mt-1">
                  {totalPedidos > 0
                    ? Math.round(
                        (stats.pedidos_entregados / totalPedidos) * 100
                      )
                    : 0}
                  %
                </p>
                <p className="text-purple-100 text-xs mt-2">
                  Pedidos entregados
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
                <TrendingUp className="h-6 w-6" />
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
    slate: "bg-gray-50 border-gray-200 text-gray-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
  };

  const iconClasses = {
    slate: "text-gray-500",
    blue: "text-blue-500",
    amber: "text-amber-500",
    purple: "text-purple-500",
    green: "text-green-500",
    red: "text-red-500",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colorClasses[color]} transition-all hover:shadow-sm`}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white shadow-sm">
        <Icon className={`h-4 w-4 ${iconClasses[color]}`} />
      </div>
      <div>
        <p className="text-xs font-medium opacity-80">{label}</p>
        <p className="text-lg font-bold">{value}</p>
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
    blue: "border-l-blue-500 bg-blue-50/50",
    amber: "border-l-amber-500 bg-amber-50/50",
    purple: "border-l-purple-500 bg-purple-50/50",
    green: "border-l-green-500 bg-green-50/50",
    red: "border-l-red-500 bg-red-50/50",
  };

  const iconClasses = {
    blue: "text-blue-500 bg-blue-100",
    amber: "text-amber-500 bg-amber-100",
    purple: "text-purple-500 bg-purple-100",
    green: "text-green-500 bg-green-100",
    red: "text-red-500 bg-red-100",
  };

  return (
    <Card
      className={`border-l-4 ${colorClasses[color]} hover:shadow-md transition-shadow`}
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
              className={`h-1.5 rounded-full transition-all duration-300 ${
                color === "blue"
                  ? "bg-blue-500"
                  : color === "amber"
                    ? "bg-amber-500"
                    : color === "purple"
                      ? "bg-purple-500"
                      : color === "green"
                        ? "bg-green-500"
                        : "bg-red-500"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderStats;
