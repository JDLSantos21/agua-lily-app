// side-nav.tsx
"use client";
import NavLinks from "./nav-links";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { ChevronDown, UserCircle, LifeBuoy, Moon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SidenavClock from "./sidenav-clock";
export default function SideNav() {
  const { logout, name, role } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  return (
    <div className="flex select-none h-full flex-col px-3 py-6 md:px-2 border-r border-gray-100 bg-white">
      <div className="flex grow flex-col justify-between space-y-6">
        <div className="space-y-2">
          <div className="mb-5 flex items-center gap-2">
            <img src="/logo.png" className="w-16 h-auto" alt="logo" />
            <SidenavClock />
          </div>
          <Separator />
          <NavLinks />
        </div>

        {/* Sección del usuario */}
        <div>
          <Separator className="mb-4" />
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full outline-1 outline-blue-200">
              <div className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {name?.[0]}
                    </AvatarFallback>
                    <AvatarImage src="" alt="Avatar" />
                  </Avatar>
                </div>

                <div className="flex-1 text-left flex flex-col">
                  <span className="text-sm font-comfortaa font-semibold text-gray-900">
                    {name}
                  </span>
                  <span className="text-xs text-gray-600 font-comfortaa uppercase">
                    {role}
                  </span>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-500 transition-transform data-[state=open]:rotate-180" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-full mx-4 mb-2"
              align="start"
              side="top"
            >
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>

              <DropdownMenuItem className="gap-3">
                <UserCircle className="h-4 w-4 text-gray-600" />
                Perfil
              </DropdownMenuItem>

              <DropdownMenuItem
                className="gap-3"
                onClick={() => handleSettings()}
              >
                Configuración
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="gap-3">
                <Moon className="h-4 w-4 text-gray-600" />
                Apariencia
              </DropdownMenuItem>

              <DropdownMenuItem className="gap-3">
                <LifeBuoy className="h-4 w-4 text-gray-600" />
                Soporte
              </DropdownMenuItem>

              <DropdownMenuItem
                className="gap-3"
                onClick={() => handleSettings()}
              >
                <Settings className="h-4 w-4 text-gray-600" />
                Configuración
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="gap-3 text-red-600 hover:bg-red-50 focus:text-red-700"
              >
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
