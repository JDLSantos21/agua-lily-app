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
import { Menu } from "lucide-react";

export default function TripsDropdownMenu() {
  const { open } = useDialogStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer mt-1.5">
        <Menu className="h-6 w-6 text-gray-500 hover:text-gray-700" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Viajes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* <DropdownMenuItem>Registro</DropdownMenuItem> */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Reportes</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => open("trips-report-dialog")}>
                  Control de Camiones
                </DropdownMenuItem>
                <RoleBased allowedRoles={["admin"]}>
                  <DropdownMenuItem onClick={() => open(null)}>
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
