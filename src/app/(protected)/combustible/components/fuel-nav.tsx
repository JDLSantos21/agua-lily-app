"use client";

import { useMemo } from "react";
import { FileSearch, Fuel, FilePen, ChartPie } from "lucide-react";
import FuelDropdownMenu from "./fuel-dropdown-menu";
import PageNav, { NavItem } from "@/components/page-nav";

export default function FuelNav() {
  // Usar useMemo para evitar recrear el array en cada renderizado
  const navItems: NavItem[] = useMemo(
    () => [
      {
        title: "Resumen",
        href: "/combustible",
        icon: <ChartPie className="h-4 w-4" />,
      },
      {
        title: "Registro",
        href: "/combustible/registro",
        icon: <FilePen className="h-4 w-4" />,
      },
      {
        title: "Consulta",
        href: "/combustible/consulta",
        icon: <FileSearch className="h-4 w-4" />,
      },
      {
        title: "Reabastecimiento",
        href: "/combustible/reabastecimiento",
        icon: <Fuel className="h-4 w-4" />,
      },
    ],
    []
  );

  return (
    <PageNav navItems={navItems}>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <Fuel className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Combustible</h1>
          </div>
        </div>
        <div className="w-px h-6 bg-gray-200" />
        <FuelDropdownMenu />
      </div>
    </PageNav>
  );
}
