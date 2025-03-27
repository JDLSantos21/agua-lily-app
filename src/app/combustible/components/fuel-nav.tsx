"use client";

import type React from "react";
import { FileSearch, Fuel, FilePen, ChartPie } from "lucide-react";
import FuelDropdownMenu from "./fuel-dropdown-menu";
import PageNav from "@/components/page-nav";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export default function FuelNav() {
  const navItems: NavItem[] = [
    {
      title: "Resumen",
      href: "/combustible",
      icon: <ChartPie className="h-5 w-5" />,
    },
    {
      title: "Registro",
      href: "/combustible/registro",
      icon: <FilePen className="h-5 w-5" />,
    },

    {
      title: "Consulta",
      href: "/combustible/consulta",
      icon: <FileSearch className="h-5 w-5" />,
    },
    {
      title: "Reabastecimiento",
      href: "/combustible/reabastecimiento",
      icon: <Fuel className="h-5 w-5" />,
    },
  ];
  return (
    <PageNav navItems={navItems}>
      <FuelDropdownMenu />
    </PageNav>
  );
}
