"use client";

import type React from "react";
import TripsDropdownMenu from "./trips-dropdown-menu";
import PageNav from "@/components/page-nav";
import { ClipboardList, Home } from "lucide-react";
import { GoHistory } from "react-icons/go";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  isDev?: boolean;
  allowedRoles?: string[];
}

export default function TripsNav() {
  const navItems: NavItem[] = [
    {
      title: "Inicio",
      href: "/viajes",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Reportes",
      href: "/viajes/reporte",
      icon: <ClipboardList className="h-5 w-5" />,
      allowedRoles: ["admin", "supervisor", "administrativo"],
    },
    {
      title: "Historial",
      href: "/viajes/historial",
      icon: <GoHistory className="h-5 w-5" />,
      isDev: true,
    },
  ];
  return (
    <PageNav navItems={navItems}>
      <TripsDropdownMenu />
    </PageNav>
  );
}
