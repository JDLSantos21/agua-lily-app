// src/app/orders/components/order-stats.tsx
import { memo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { type OrderStats } from "@/types/orders.types";
import { LoaderSpin } from "@/components/Loader";

interface OrderStatsComponentProps {
  simplified?: boolean;
  stats?: OrderStats | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const OrderStats = memo(function OrderStatsComponent({
  simplified = false,
  stats,
  isLoading = false,
  error = null,
  onRetry,
}: OrderStatsComponentProps) {
  // Si está cargando, mostrar skeleton
  if (isLoading) {
    return simplified ? (
      <div className="grid grid-cols-3 gap-4">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <Card key={i} className="h-24">
              <CardContent className="p-4">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-6 w-10 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
      </div>
    ) : (
      <LoaderSpin text="Cargando estadísticas..." />
    );
  }

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <Card className="p-4 text-red-600 flex justify-between items-center">
        <div>
          <h3 className="font-medium">Error al cargar las estadísticas</h3>
          <p className="text-sm">{error}</p>
        </div>
        <Button
          variant="outline"
          className="bg-white hover:bg-red-50"
          onClick={onRetry}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Reintentar
        </Button>
      </Card>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (!stats) {
    return (
      <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-md">
        <p>No hay datos de estadísticas disponibles</p>
        <Button variant="ghost" className="mt-2" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Cargar estadísticas
        </Button>
      </div>
    );
  }

  // Si es simplificado, mostrar versión compacta
  if (simplified) {
    const statItems = [
      {
        title: "Pendientes",
        value: stats.pedidos_pendientes,
        icon: <Clock className="h-5 w-5 text-yellow-500" />,
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      },
      {
        title: "En proceso",
        value:
          Number(stats.pedidos_preparando) + Number(stats.pedidos_despachados),
        icon: <Truck className="h-5 w-5 text-blue-500" />,
        color: "bg-blue-100 text-blue-700 border-blue-200",
      },
      {
        title: "Completados",
        value: stats.pedidos_entregados,
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        color: "bg-green-100 text-green-700 border-green-200",
      },
    ];

    return (
      <div className="grid grid-cols-3 gap-4 w-1/2">
        {statItems.map((stat, index) => (
          <Card key={index} className={`border ${stat.color}`}>
            <CardContent className="p-4 flex max-xl:flex-col max-xl:text-center justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <span className="max-xl:hidden">{stat.icon}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calcular porcentajes para barras de progreso
  const totalPedidos = stats.total_pedidos || 1; // Evitar división por cero

  const pctPendientes = Math.round(
    (stats.pedidos_pendientes / totalPedidos) * 100
  );
  const pctPreparando = Math.round(
    (stats.pedidos_preparando / totalPedidos) * 100
  );
  const pctDespachados = Math.round(
    (stats.pedidos_despachados / totalPedidos) * 100
  );
  const pctEntregados = Math.round(
    (stats.pedidos_entregados / totalPedidos) * 100
  );
  const pctCancelados = Math.round(
    (stats.pedidos_cancelados / totalPedidos) * 100
  );

  // Versión completa
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de pedidos */}
      <StatCard
        title="Total de pedidos"
        value={stats.total_pedidos}
        description={`${stats.clientes_unicos} clientes únicos`}
        icon={<Package className="h-5 w-5 text-blue-600" />}
        className="lg:col-span-2"
      />

      {/* Pendientes */}
      <StatCard
        title="Pendientes"
        value={stats.pedidos_pendientes}
        percentage={pctPendientes}
        description={`${pctPendientes}% del total`}
        icon={<Clock className="h-5 w-5 text-yellow-500" />}
        progressColor="bg-yellow-500"
      />

      {/* Preparando */}
      <StatCard
        title="Preparando"
        value={stats.pedidos_preparando}
        percentage={pctPreparando}
        description={`${pctPreparando}% del total`}
        icon={<Package className="h-5 w-5 text-blue-500" />}
        progressColor="bg-blue-500"
      />

      {/* Despachados */}
      <StatCard
        title="Despachados"
        value={stats.pedidos_despachados}
        percentage={pctDespachados}
        description={`${pctDespachados}% del total`}
        icon={<Truck className="h-5 w-5 text-purple-500" />}
        progressColor="bg-purple-500"
      />

      {/* Entregados */}
      <StatCard
        title="Entregados"
        value={stats.pedidos_entregados}
        percentage={pctEntregados}
        description={`${pctEntregados}% del total`}
        icon={<CheckCircle className="h-5 w-5 text-green-500" />}
        progressColor="bg-green-500"
      />

      {/* Cancelados */}
      <StatCard
        title="Cancelados"
        value={stats.pedidos_cancelados}
        percentage={pctCancelados}
        description={`${pctCancelados}% del total`}
        icon={<XCircle className="h-5 w-5 text-red-500" />}
        progressColor="bg-red-500"
      />
    </div>
  );
});

// Componente para las tarjetas de estadísticas
interface StatCardProps {
  title: string;
  value: number;
  percentage?: number;
  description: string;
  icon: React.ReactNode;
  progressColor?: string;
  className?: string;
}

function StatCard({
  title,
  value,
  percentage,
  description,
  icon,
  progressColor = "bg-blue-500",
  className = "",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <Card className="overflow-hidden h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
          <CardDescription>{description}</CardDescription>

          {percentage !== undefined && (
            <div className="mt-3">
              <Progress value={percentage} className={`h-2 ${progressColor}`} />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default OrderStats;
