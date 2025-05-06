"use client";
import { useEffect, useState } from "react";
import NavLinks from "./nav-links";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  UserCircle,
  LifeBuoy,
  Moon,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import SidenavClock from "./sidenav-clock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Usar un objeto singleton para mantener el estado entre navegaciones
// Next.js preserva este objeto entre navegaciones de cliente
const globalState = {
  isHydrated: false,
  collapsed: false,
  initialized: false,
};

export default function SideNav() {
  const { logout, name, role } = useAuthStore();
  const router = useRouter();

  // Utilizar el estado global inicializado para evitar pestañeo
  const [collapsed, setCollapsed] = useState(() => globalState.collapsed);
  const [isHydrated, setIsHydrated] = useState(() => globalState.isHydrated);

  // Cargar el estado solo una vez (al inicio de la aplicación)
  useEffect(() => {
    // Si ya está inicializado, simplemente actualiza el estado local
    if (globalState.initialized) {
      setCollapsed(globalState.collapsed);
      setIsHydrated(true);
      return;
    }

    // Si es la primera carga, inicializa desde localStorage
    const savedState = localStorage.getItem("sidebarCollapsed") === "true";
    setCollapsed(savedState);
    setIsHydrated(true);

    // Actualiza el estado global
    globalState.collapsed = savedState;
    globalState.isHydrated = true;
    globalState.initialized = true;
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);

    // Actualiza localStorage y estado global
    localStorage.setItem("sidebarCollapsed", String(newState));
    globalState.collapsed = newState;
  };

  // Usar inline styles para la transición para evitar el flash
  const transitionStyle = isHydrated
    ? { transition: "width 0.3s ease" }
    : { transition: "none" };

  // Determinar la clase del ancho basada en el estado hidratado
  const widthClass = isHydrated
    ? collapsed
      ? "w-16 items-center px-2"
      : "w-64 px-4"
    : "w-64 px-4"; // Valor por defecto para SSR

  return (
    <div
      className={cn(
        "flex h-full flex-col py-5 border-r border-gray-100 bg-white select-none relative",
        widthClass
      )}
      style={transitionStyle}
    >
      {/* Logo y título */}
      <div className="flex items-center justify-center mb-6">
        {(!collapsed || !isHydrated) && (
          <div className="flex items-center gap-2">
            <img src="/logo.png" className="w-10 h-auto" alt="logo" />
            <span className="font-semibold text-lg text-gray-900">Sistema</span>
          </div>
        )}
        {collapsed && isHydrated && (
          <img src="/logo.png" className="w-10 h-auto" alt="logo" />
        )}
      </div>

      {/* Botón para expandir/contraer separado del logo */}
      <div
        className={`absolute top-16 ${isHydrated && collapsed ? "right-1/4" : "right-2"}`}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
        >
          {isHydrated && collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {(!collapsed || !isHydrated) && <SidenavClock />}

      <Separator className="my-4" />

      <div className="flex grow flex-col justify-between space-y-4 w-full">
        <NavLinks collapsed={isHydrated && collapsed} />

        {/* Sección del usuario */}
        <div className="mt-auto">
          <Separator className="mb-4" />

          {isHydrated && collapsed ? (
            <div className="flex flex-col items-center space-y-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="cursor-pointer w-10 h-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {name?.[0]}
                      </AvatarFallback>
                      <AvatarImage src="" alt="Avatar" />
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{name}</p>
                    <p className="text-xs uppercase">{role}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLogout}
                      className="w-10 h-10 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Cerrar Sesión</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {name?.[0]}
                      </AvatarFallback>
                      <AvatarImage src="" alt="Avatar" />
                    </Avatar>

                    <div className="flex-1 text-left flex flex-col overflow-hidden">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {name}
                      </span>
                      <span className="text-xs text-gray-500 uppercase truncate">
                        {role}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>

                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <UserCircle className="h-4 w-4 text-gray-500" />
                    Perfil
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    onClick={() => handleSettings()}
                  >
                    <Settings className="h-4 w-4 text-gray-500" />
                    Configuración
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Moon className="h-4 w-4 text-gray-500" />
                    Apariencia
                  </DropdownMenuItem>

                  <DropdownMenuItem className="gap-2 cursor-pointer">
                    <LifeBuoy className="h-4 w-4 text-gray-500" />
                    Soporte
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="gap-2 text-red-600 focus:text-red-700 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
