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
import { MoreHorizontal, Fuel, RotateCcw } from "lucide-react";

export default function FuelDropdownMenu() {
  const { open } = useDialogStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Opciones"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 bg-white shadow-lg border border-gray-200 rounded-lg"
      >
        <DropdownMenuLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
          Acciones
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-200" />

        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="text-sm py-2.5 px-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 rounded-md mx-1">
              <Fuel className="h-4 w-4 mr-2" />
              Reabastecimiento
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent className="bg-white shadow-lg border border-gray-200 rounded-lg">
                <DropdownMenuItem
                  onClick={() => open("replenishment-dialog")}
                  className="text-sm py-2.5 px-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 rounded-md mx-1"
                >
                  <Fuel className="h-4 w-4 mr-2" />
                  Reabastecer combustible
                </DropdownMenuItem>

                <RoleBased allowedRoles={["operador", "admin"]}>
                  <DropdownMenuItem
                    onClick={() => open("fuel-reset-dialog")}
                    className="text-sm py-2.5 px-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 rounded-md mx-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Resetear disponibilidad
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
