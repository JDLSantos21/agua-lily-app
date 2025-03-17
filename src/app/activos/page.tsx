"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import {motion} from "framer-motion";

export default function AssetsPage() {
  const assetCategories = [
    {
      title: "Vehículos",
      description: "Gestión de la flota vehicular de la empresa",
      icon:<img src="/truck2.webp" className="w-24 mb-4 text-blue-500" alt="truck" />,
      href: "/activos/vehiculos",
      color: "bg-gray-50 hover:bg-gray-100"
    },
    // {
    //   title: "Refrigeradores",
    //   description: "Control y mantenimiento de equipos de refrigeración",
    //   icon: <Refrigerator className="h-12 w-12 mb-4 text-green-500" />,
    //   href: "/activos/refrigeradores",
    //   color: "bg-green-50 hover:bg-green-100"
    // },
    // {
    //   title: "Anaqueles",
    //   description: "Inventario y ubicación de anaqueles en almacén",
    //   icon: <LayoutGrid className="h-12 w-12 mb-4 text-amber-500" />,
    //   href: "/activos/anaqueles",
    //   color: "bg-amber-50 hover:bg-amber-100"
    // }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold">Gestión de Activos</h1>
        <p className="font-subheading text-gray-600 mt-2">
          Administración y control todos los activos
        </p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }} 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assetCategories.map((category, index) => (
          <Link href={category.href} key={index} className="no-underline text-foreground">
            <Card className={`h-full transition-all duration-300 ${category.color} border-none shadow`}>
              <CardHeader className="flex flex-col items-center text-center">
                {category.icon}
                <CardTitle>{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>{category.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center pt-2">
               Gestionar
              </CardFooter>
            </Card>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
