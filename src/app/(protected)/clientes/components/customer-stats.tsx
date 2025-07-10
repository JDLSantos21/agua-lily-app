// src/app/clientes/components/customer-stats.tsx - REDISEÑADO
"use client";

import { useEffect, useState, memo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  TrendingUp,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCustomerStats } from "@/hooks/useCustomers";

export const CustomerStats = memo(function CustomerStats() {
  const { data: customerStats, isLoading, error, refetch } = useCustomerStats();

  // Estado para animación de números
  const [animatedStats, setAnimatedStats] = useState({
    total_clientes: 0,
    clientes_empresa: 0,
    clientes_individuales: 0,
    clientes_activos: 0,
    clientes_inactivos: 0,
  });

  // Efecto para animar números cuando cambian los datos
  useEffect(() => {
    if (customerStats) {
      // Animar hasta los valores finales
      const duration = 1000; // Duración de la animación en ms
      const frameDuration = 1000 / 60; // Duración de un frame en 60fps
      const totalFrames = Math.round(duration / frameDuration);

      let frame = 0;
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;

        setAnimatedStats({
          total_clientes: Math.floor(
            progress * customerStats.data.total_clientes
          ),
          clientes_empresa: Math.floor(
            progress * customerStats.data.clientes_empresa
          ),
          clientes_individuales: Math.floor(
            progress * customerStats.data.clientes_individuales
          ),
          clientes_activos: Math.floor(
            progress * customerStats.data.clientes_activos
          ),
          clientes_inactivos: Math.floor(
            progress * customerStats.data.clientes_inactivos
          ),
        });

        if (frame === totalFrames) {
          clearInterval(counter);
          setAnimatedStats(customerStats.data);
        }
      }, frameDuration);

      return () => clearInterval(counter);
    }
  }, [customerStats]);

  // Si está cargando, mostrar skeleton
  if (isLoading) {
    return <StatsSkeletonLoader />;
  }

  // Si hay error, mostrar mensaje con opción de reintentar
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">
                  Error al cargar estadísticas
                </h3>
                <p className="text-sm text-red-600">{error.message}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 hover:bg-red-100"
              onClick={() => refetch()}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (!customerStats) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-600 font-medium">
                No hay datos disponibles
              </p>
              <p className="text-sm text-gray-500">
                Las estadísticas se cargarán automáticamente
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Cargar estadísticas
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcular porcentajes
  const stats = customerStats;
  const total = stats.data.total_clientes;

  const pctEmpresas = total
    ? Math.round((stats.data.clientes_empresa / total) * 100)
    : 0;
  const pctIndividuales = total
    ? Math.round((stats.data.clientes_individuales / total) * 100)
    : 0;
  const pctActivos = total
    ? Math.round((stats.data.clientes_activos / total) * 100)
    : 0;
  const pctInactivos = total
    ? Math.round((stats.data.clientes_inactivos / total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Estadística principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {animatedStats.total_clientes.toLocaleString()}
                  </h2>
                  <p className="text-lg text-gray-600 font-medium">
                    Clientes Totales
                  </p>
                  <p className="text-sm text-gray-500">
                    Registrados en el sistema
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grid de estadísticas secundarias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Clientes activos */}
        <StatCard
          title="Clientes Activos"
          value={animatedStats.clientes_activos}
          percentage={pctActivos}
          description="Actualmente en el sistema"
          icon={<UserCheck className="w-6 h-6 text-green-600" />}
          gradient="from-green-50 to-emerald-50"
          progressColor="bg-green-500"
          delay={0.1}
        />

        {/* Empresas */}
        <StatCard
          title="Empresas"
          value={animatedStats.clientes_empresa}
          percentage={pctEmpresas}
          description="Clientes corporativos"
          icon={<Building2 className="w-6 h-6 text-blue-600" />}
          gradient="from-blue-50 to-cyan-50"
          progressColor="bg-blue-500"
          delay={0.2}
        />

        {/* Clientes individuales */}
        <StatCard
          title="Individuales"
          value={animatedStats.clientes_individuales}
          percentage={pctIndividuales}
          description="Clientes particulares"
          icon={<Users className="w-6 h-6 text-purple-600" />}
          gradient="from-purple-50 to-pink-50"
          progressColor="bg-purple-500"
          delay={0.3}
        />
      </div>

      {/* Estadística de inactivos si hay */}
      {animatedStats.clientes_inactivos > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <UserX className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-orange-900">
                      {animatedStats.clientes_inactivos} Clientes Inactivos
                    </p>
                    <p className="text-sm text-orange-600">
                      {pctInactivos}% del total
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-24 h-2 bg-orange-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 transition-all duration-1000"
                      style={{ width: `${pctInactivos}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
});

// Componente para las tarjetas de estadísticas
interface StatCardProps {
  title: string;
  value: number;
  percentage: number;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  progressColor: string;
  delay?: number;
}

function StatCard({
  title,
  value,
  percentage,
  description,
  icon,
  gradient,
  progressColor,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card
        className={`border-0 shadow-sm bg-gradient-to-br ${gradient} hover:shadow-md transition-all duration-300`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-700">
              {title}
            </CardTitle>
            {icon}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {value.toLocaleString()}
              </div>
              <CardDescription className="text-sm">
                {description}
              </CardDescription>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{percentage}% del total</span>
                <span className="font-medium text-gray-700">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Componente para mostrar un skeleton loader durante la carga
function StatsSkeletonLoader() {
  return (
    <div className="space-y-6">
      {/* Skeleton para estadística principal */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skeleton para grid de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default CustomerStats;
