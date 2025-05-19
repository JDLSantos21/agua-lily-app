// src/app/clientes/components/customer-stats.tsx - VERSIÓN MEJORADA
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
import { Building2, Users, UserCheck, UserX, RefreshCw } from "lucide-react";
import { useCustomerStore } from "@/stores/customerStore";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const CustomerStats = memo(function CustomerStats() {
  const { customerStats, isLoadingStats, error, fetchCustomerStats } =
    useCustomerStore();

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
          total_clientes: Math.floor(progress * customerStats.total_clientes),
          clientes_empresa: Math.floor(
            progress * customerStats.clientes_empresa
          ),
          clientes_individuales: Math.floor(
            progress * customerStats.clientes_individuales
          ),
          clientes_activos: Math.floor(
            progress * customerStats.clientes_activos
          ),
          clientes_inactivos: Math.floor(
            progress * customerStats.clientes_inactivos
          ),
        });

        if (frame === totalFrames) {
          clearInterval(counter);
          setAnimatedStats(customerStats);
        }
      }, frameDuration);

      return () => clearInterval(counter);
    }
  }, [customerStats]);

  // Si está cargando, mostrar skeleton
  if (isLoadingStats) {
    return <StatsSkeletonLoader />;
  }

  // Si hay error, mostrar mensaje con opción de reintentar
  if (error) {
    return (
      <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-600 flex justify-between items-center">
        <div>
          <h3 className="font-medium">Error al cargar las estadísticas</h3>
          <p className="text-sm">{error}</p>
        </div>
        <Button
          variant="outline"
          className="bg-white hover:bg-red-50"
          onClick={() => fetchCustomerStats()}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Reintentar
        </Button>
      </div>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (!customerStats) {
    return (
      <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-md">
        <p>No hay datos de estadísticas disponibles</p>
        <Button
          variant="ghost"
          className="mt-2"
          onClick={() => fetchCustomerStats()}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Cargar estadísticas
        </Button>
      </div>
    );
  }

  // Calcular porcentajes
  const stats = customerStats;

  const pctEmpresas = stats.total_clientes
    ? Math.round((stats.clientes_empresa / stats.total_clientes) * 100)
    : 0;

  const pctIndividuales = stats.total_clientes
    ? Math.round((stats.clientes_individuales / stats.total_clientes) * 100)
    : 0;

  const pctActivos = stats.total_clientes
    ? Math.round((stats.clientes_activos / stats.total_clientes) * 100)
    : 0;

  const pctInactivos = stats.total_clientes
    ? Math.round((stats.clientes_inactivos / stats.total_clientes) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de clientes */}
      <StatCard
        title="Total de clientes"
        value={animatedStats.total_clientes}
        description="Clientes registrados en el sistema"
        icon={<Users className="h-5 w-5 text-blue-600" />}
      />

      {/* Clientes activos */}
      <StatCard
        title="Clientes activos"
        value={animatedStats.clientes_activos}
        percentage={pctActivos}
        description={`${pctActivos}% del total de clientes`}
        icon={<UserCheck className="h-5 w-5 text-green-600" />}
        progressColor="bg-green-500"
      />

      {/* Clientes empresa */}
      <StatCard
        title="Empresas"
        value={animatedStats.clientes_empresa}
        percentage={pctEmpresas}
        description={`${pctEmpresas}% del total de clientes`}
        icon={<Building2 className="h-5 w-5 text-blue-600" />}
        progressColor="bg-blue-500"
      />

      {/* Clientes inactivos */}
      <StatCard
        title="Clientes inactivos"
        value={animatedStats.clientes_inactivos}
        percentage={pctInactivos}
        description={`${pctInactivos}% del total de clientes`}
        icon={<UserX className="h-5 w-5 text-red-600" />}
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
}

function StatCard({
  title,
  value,
  percentage,
  description,
  icon,
  progressColor = "bg-blue-500",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
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

// Componente para mostrar un skeleton loader durante la carga
function StatsSkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array(4)
        .fill(null)
        .map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-2 w-full bg-gray-200 rounded animate-pulse mt-3" />
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

export default CustomerStats;
