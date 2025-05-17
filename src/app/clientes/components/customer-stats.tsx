// src/app/clientes/components/customer-stats.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, UserCheck, UserX } from "lucide-react";
import { useCustomerStats } from "@/hooks/useCustomers";
import type { CustomerStats } from "@/types/customers.types";
import { motion } from "framer-motion";

export function CustomerStats() {
  const { data, isLoading, error } = useCustomerStats();
  const stats = data?.data;

  // Estado para animación
  const [animatedStats, setAnimatedStats] = useState<CustomerStats>({
    total_clientes: 0,
    clientes_empresa: 0,
    clientes_individuales: 0,
    clientes_activos: 0,
    clientes_inactivos: 0,
  });

  // Animar números cuando cambian los datos
  useEffect(() => {
    if (stats) {
      // Animar hasta los valores finales
      const duration = 1000; // Duración de la animación en ms
      const frameDuration = 1000 / 60; // Duración de un frame en 60fps
      const totalFrames = Math.round(duration / frameDuration);

      let frame = 0;
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;

        setAnimatedStats({
          total_clientes: Math.floor(progress * stats.total_clientes),
          clientes_empresa: Math.floor(progress * stats.clientes_empresa),
          clientes_individuales: Math.floor(
            progress * stats.clientes_individuales
          ),
          clientes_activos: Math.floor(progress * stats.clientes_activos),
          clientes_inactivos: Math.floor(progress * stats.clientes_inactivos),
        });

        if (frame === totalFrames) {
          clearInterval(counter);
          setAnimatedStats(stats);
        }
      }, frameDuration);

      return () => clearInterval(counter);
    }
  }, [stats]);

  // Si está cargando, mostrar skeleton
  if (isLoading) {
    return <StatsSkeletonLoader />;
  }

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Error al cargar las estadísticas
      </div>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (!stats) {
    return (
      <div className="text-center text-gray-500 py-4">
        No hay datos de estadísticas disponibles
      </div>
    );
  }

  // Calcular porcentajes
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
}

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
      <Card>
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
