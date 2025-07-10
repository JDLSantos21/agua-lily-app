"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { motion } from "framer-motion";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Truck, ArrowRight, Package, Activity } from "lucide-react";

export default function AssetsPage() {
  const assetCategories = [
    {
      title: "Vehículos",
      description: "Gestión completa de la flota vehicular de la empresa",
      icon: <Truck className="h-12 w-12 text-blue-600" />,
      href: "/activos/vehiculos",
      color: "bg-blue-50 hover:bg-blue-100",
      borderColor: "border-blue-200",
      stats: "Ir",
      bgIcon: "bg-blue-100",
    },
    // {
    //   title: "Refrigeradores",
    //   description: "Control y mantenimiento de equipos de refrigeración",
    //   icon: <Refrigerator className="h-12 w-12 text-green-600" />,
    //   href: "/activos/refrigeradores",
    //   color: "bg-green-50 hover:bg-green-100",
    //   borderColor: "border-green-200",
    //   stats: "8 equipos operativos",
    //   bgIcon: "bg-green-100",
    // },
    // {
    //   title: "Anaqueles",
    //   description: "Inventario y ubicación de anaqueles en almacén",
    //   icon: <LayoutGrid className="h-12 w-12 text-amber-600" />,
    //   href: "/activos/anaqueles",
    //   color: "bg-amber-50 hover:bg-amber-100",
    //   borderColor: "border-amber-200",
    //   stats: "45 anaqueles registrados",
    //   bgIcon: "bg-amber-100",
    // }
  ];

  return (
    <ProtectedRoute requiredRole="operador">
      <div className="p-6">
        <div className="max-w-7xl">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Activos
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      Desconocido
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Activos Activos
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      Desconocido
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Truck className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Vehículos
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      Desconocido
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Asset Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Categorías de Activos
            </h3>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {assetCategories.map((category, index) => (
              <Link href={category.href} key={index} className="no-underline">
                <Card
                  className={`h-full transition-all duration-300 ${category.color} ${category.borderColor} border-2 shadow-sm hover:shadow-md group`}
                >
                  <CardHeader className="pb-4">
                    <div
                      className={`w-16 h-16 ${category.bgIcon} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {category.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        {category.stats}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
