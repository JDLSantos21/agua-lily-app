"use client";

import { useMemo } from "react";
import TripsDropdownMenu from "./trips-dropdown-menu";
import PageNav, { NavItem } from "@/components/page-nav";
import { ClipboardList, Home } from "lucide-react";
import { GoHistory } from "react-icons/go";

export default function TripsNav() {
  const navItems: NavItem[] = useMemo(
    () => [
      {
        title: "Inicio",
        href: "/viajes",
        icon: <Home className="h-4 w-4" />,
      },
      {
        title: "Reportes",
        href: "/viajes/reporte",
        icon: <ClipboardList className="h-4 w-4" />,
        allowedRoles: ["admin", "supervisor", "administrativo"],
      },
      {
        title: "Historial",
        href: "/viajes/historial",
        icon: <GoHistory className="h-4 w-4" />,
        isDev: true,
      },
    ],
    []
  );

  return (
    <PageNav navItems={navItems}>
      <TripsDropdownMenu />
    </PageNav>
  );
}
