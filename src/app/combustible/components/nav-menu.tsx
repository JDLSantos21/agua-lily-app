"use client";

import * as React from "react";
import Link from "next/link";

import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Home } from "lucide-react";

export function FuelMenu() {
  return (
    <Menubar className="p-4">
      <MenubarMenu>
        <Link href={"/combustible"} passHref>
          <MenubarTrigger>
            <Home />
          </MenubarTrigger>
        </Link>
      </MenubarMenu>

      <MenubarMenu>
        <Link href={"/combustible/registro"} passHref>
          <MenubarTrigger>Registro</MenubarTrigger>
        </Link>
        {/* <RoleBased allowedRoles={["admin", "administrativo", "operador"]}>
          <MenubarContent>
            <Link href={"/combustible"} passHref>
              <MenubarItem>Menu de registro</MenubarItem>
            </Link>
          </MenubarContent>
        </RoleBased> */}
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
        {/* <MenubarContent>
          <RoleBased allowedRoles={["admin", "administrativo"]}>
            <NewAjustDialog />
          </RoleBased>
          <AdjustmentsSearchModal />
        </MenubarContent> */}
      </MenubarMenu>
    </Menubar>
  );
}
