"use client";

import { useMemo } from "react";
import { Boxes, Warehouse, Scale } from "lucide-react";
import { InventoryDropdownMenu } from "./inventory-dropdown-menu";
import PageNav, { NavItem } from "@/components/page-nav";

export default function InventoryNav() {
  const navItems: NavItem[] = useMemo(
    () => [
      {
        title: "Inventario",
        href: "/inventario",
        icon: <Warehouse className="h-4 w-4" />,
      },
      {
        title: "Materiales",
        href: "/inventario/material",
        icon: <Boxes className="h-4 w-4" />,
      },
      {
        title: "Ajustes",
        href: "/inventario/ajuste",
        icon: <Scale className="h-4 w-4" />,
      },
    ],
    []
  );

  return <PageNav navItems={navItems} children={<InventoryDropdownMenu />} />;
}
