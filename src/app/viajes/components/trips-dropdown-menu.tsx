"use client";
import { RoleBased } from "@/components/RoleBased";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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

export default function TripsDropdownMenu() {
  const { open } = useDialogStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Opciones de viajes"
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

        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-xs py-1.5">
              Reportes
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => open("trips-report-dialog")}
                  className="text-xs py-1.5"
                >
                  Control de Camiones
                </DropdownMenuItem>
                <RoleBased allowedRoles={["admin"]}>
                  <DropdownMenuItem
                    onClick={() => open(null)}
                    className="text-xs py-1.5"
                  >
                    Otro mas...
                  </DropdownMenuItem>
                </RoleBased>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
