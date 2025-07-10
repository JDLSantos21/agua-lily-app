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

  return (
    <PageNav navItems={navItems}>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Warehouse className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Inventario</h1>
          </div>
        </div>
        <div className="w-px h-6 bg-gray-200" />
        <InventoryDropdownMenu />
      </div>
    </PageNav>
  );
}
