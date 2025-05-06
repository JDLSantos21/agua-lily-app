"use client";
import { RoleBased } from "@/components/RoleBased";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialogStore } from "@/stores/dialogStore";
import { MoreHorizontal } from "lucide-react";

export const InventoryDropdownMenu = () => {
  const { open } = useDialogStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Opciones de inventario"
          className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs font-normal text-gray-500">
          Opciones
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => open("inventory-report")}
          className="text-xs py-1.5"
        >
          Generar reporte
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-xs py-1.5">
            Materiales
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => open("new-material")}
                className="text-xs py-1.5"
              >
                Nuevo material
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-xs py-1.5">
            Ajustes
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => open("search-adjustment")}
                className="text-xs py-1.5"
              >
                Buscar Ajustes
              </DropdownMenuItem>
              <RoleBased allowedRoles={["admin", "administrativo"]}>
                <DropdownMenuItem
                  onClick={() => open("new-adjustment")}
                  className="text-xs py-1.5"
                >
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
