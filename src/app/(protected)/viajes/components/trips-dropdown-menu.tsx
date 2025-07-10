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
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 bg-white/95 backdrop-blur-md shadow-lg border border-gray-200/50 rounded-xl"
      >
        <DropdownMenuLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
          Opciones
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-200/50" />

        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-sm py-2.5 px-3 text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-colors duration-150 rounded-lg mx-1">
              Reportes
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-white/95 backdrop-blur-md shadow-lg border border-gray-200/50 rounded-xl">
                <DropdownMenuItem
                  onClick={() => open("trips-report-dialog")}
                  className="text-sm py-2.5 px-3 text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-colors duration-150 rounded-lg mx-1"
                >
                  Control de Camiones
                </DropdownMenuItem>
                <RoleBased allowedRoles={["admin"]}>
                  <DropdownMenuItem
                    onClick={() => open(null)}
                    className="text-sm py-2.5 px-3 text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 transition-colors duration-150 rounded-lg mx-1"
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
