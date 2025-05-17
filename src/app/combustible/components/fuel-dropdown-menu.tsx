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

export default function FuelDropdownMenu() {
  const { open } = useDialogStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Opciones"
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
              Reabastecimiento
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => open("replenishment-dialog")}
                  className="text-xs py-1.5"
                >
                  Reabastecer combustible
                </DropdownMenuItem>

                <RoleBased allowedRoles={["operador"]}>
                  <DropdownMenuItem
                    onClick={() => open("fuel-reset-dialog")}
                    className="text-xs py-1.5"
                  >
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
