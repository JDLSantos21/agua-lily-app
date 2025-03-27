"use client";
import { RoleBased } from "@/components/RoleBased";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialogStore } from "@/stores/dialogStore";
import { Menu } from "lucide-react";

export const InventoryDropdownMenu = () => {
  const { open } = useDialogStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer mt-1.5">
        <Menu className="h-6 w-6 text-gray-500 hover:text-gray-700" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>Inventario</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => open("inventory-report")}>
          Generar reporte
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Materiales</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Nuevo material</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Ajustes</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => open("search-adjustment")}>
                Buscar Ajustes
              </DropdownMenuItem>
              <RoleBased allowedRoles={["admin", "administrativo"]}>
                <DropdownMenuItem onClick={() => open("new-adjustment")}>
                  Ajustar Material
                </DropdownMenuItem>
              </RoleBased>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
