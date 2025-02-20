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
import { RoleBased } from "@/components/RoleBased";

export function FuelMenu() {
  return (
    <Menubar>
      <MenubarMenu>
        <Link href={"/combustible"} passHref>
          <MenubarTrigger>Inicio</MenubarTrigger>
        </Link>
      </MenubarMenu>

      <MenubarMenu>
        <Link href={"/combustible/registro"} passHref>
          <MenubarTrigger>Registro</MenubarTrigger>
        </Link>
        <RoleBased allowedRoles={["admin", "administrativo", "operador"]}>
          <MenubarContent>
            <Link href={"/combustible"} passHref>
              <MenubarItem>Menu de registro</MenubarItem>
            </Link>
          </MenubarContent>
        </RoleBased>
      </MenubarMenu>
      <MenubarMenu>
        <Link href={"/combustible/consulta"} passHref>
          <MenubarTrigger>Consulta</MenubarTrigger>
        </Link>
      </MenubarMenu>
      <MenubarMenu>
        <Link href={"/combustible/reabastecimiento"} passHref>
          <MenubarTrigger>Reabastecimiento</MenubarTrigger>
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
