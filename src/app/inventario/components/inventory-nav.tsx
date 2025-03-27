"use client";

import type React from "react";

import { Boxes, Warehouse, Scale } from "lucide-react";
import { InventoryDropdownMenu } from "./inventory-dropdown-menu";
import PageNav from "@/components/page-nav";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export default function InventoryNav() {
  const navItems: NavItem[] = [
    {
      title: "Inventario",
      href: "/inventario",
      icon: <Warehouse className="h-5 w-5" />,
    },
    {
      title: "Materiales",
      href: "/inventario/material",
      icon: <Boxes className="h-5 w-5" />,
    },

    {
      title: "Ajustes",
      href: "/inventario/ajuste",
      icon: <Scale className="h-5 w-5" />,
    },
  ];
  return (
    <PageNav navItems={navItems}>
      <InventoryDropdownMenu />
    </PageNav>
  );
}
