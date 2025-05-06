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

  return <PageNav navItems={navItems}>{<FuelDropdownMenu />}</PageNav>;
}
