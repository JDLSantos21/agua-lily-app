"use client";

import * as React from "react";
import Link from "next/link";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import NewAjustDialog from "@/app/inventario/ajuste/new-dialog";
import { AdjustmentsSearchModal } from "@/app/inventario/ajuste/adjustments-search-modal";
import { RoleBased } from "../RoleBased";

export function InventoryMenu() {
  return (
    <Menubar>
      <MenubarMenu>
        <Link href={"/inventario"} passHref>
          <MenubarTrigger>Inicio</MenubarTrigger>
        </Link>
      </MenubarMenu>
      <MenubarMenu>
        <Link href={"/inventario/material"} passHref>
          <MenubarTrigger>Materiales</MenubarTrigger>
        </Link>
        <RoleBased allowedRoles={["admin", "administrativo"]}>
          <MenubarContent>
            <Link href={"/inventario/material/nuevo"} passHref>
              <MenubarItem>Añadir Material</MenubarItem>
            </Link>
          </MenubarContent>
        </RoleBased>
      </MenubarMenu>
      <MenubarMenu>
        <Link href={"/inventario/ajuste"} passHref>
          <MenubarTrigger>Ajustes</MenubarTrigger>
        </Link>
        <MenubarContent>
          <RoleBased allowedRoles={["admin", "administrativo"]}>
            <NewAjustDialog />
          </RoleBased>
          <AdjustmentsSearchModal />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
