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
import { Button } from "@/components/ui/button";
import SidenavClock from "./sidenav-clock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuth } from "@/shared/hooks/useAuth";

// Usar un objeto singleton para mantener el estado entre navegaciones
// Next.js preserva este objeto entre navegaciones de cliente
const globalState = {
  isHydrated: false,
  collapsed: false,
  initialized: false,
};

export default function SideNav() {
  const { name, role } = useAuthStore();
  const { signOut } = useAuth();
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
    signOut();
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const handleProfile = () => {
    router.push("/profile");
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
        "flex h-full flex-col bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200/60 backdrop-blur-sm select-none relative shadow-lg",
        widthClass
      )}
      style={transitionStyle}
    >
      {/* Header con logo y título */}
      <div className="flex items-center justify-center px-4 py-6 bg-white/80 backdrop-blur-sm border-b border-slate-200/60 relative">
        {(!collapsed || !isHydrated) && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <img
                src="/logo.png"
                className="w-8 h-auto filter brightness-0 invert"
                alt="logo"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-800">
                Agua Lily
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Sistema de Gestión
              </span>
            </div>
          </div>
        )}
        {collapsed && isHydrated && (
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <img
              src="/logo.png"
              className="w-8 h-auto filter brightness-0 invert"
              alt="logo"
            />
          </div>
        )}

        {/* Botón para expandir/contraer integrado en el header */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-8 w-8 p-0 rounded-full hover:bg-slate-100/80 hover:shadow-md transition-all duration-200 border border-slate-200/80 bg-white/60 backdrop-blur-sm"
          >
            {isHydrated && collapsed ? (
              <ChevronRight className="h-4 w-4 text-slate-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            )}
          </Button>
        </div>
      </div>

      {/* Reloj con diseño mejorado */}
      {(!collapsed || !isHydrated) && (
        <div className="px-4 py-3 bg-white/50 backdrop-blur-sm border-b border-slate-200/60">
          <SidenavClock />
        </div>
      )}

      <div className="flex grow flex-col justify-between px-4 py-4 space-y-4">
        {/* Navegación principal */}
        <div className="flex-1 mt-2">
          <NavLinks collapsed={isHydrated && collapsed} />
        </div>

        {/* Sección del usuario con diseño moderno */}
        <div className="mt-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent mb-4" />

          {isHydrated && collapsed ? (
            <div className="flex flex-col items-center space-y-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative group">
                      <Avatar className="cursor-pointer w-12 h-12 ring-2 ring-blue-100 hover:ring-blue-200 transition-all duration-200">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                          {name?.[0]}
                        </AvatarFallback>
                        <AvatarImage src="" alt="Avatar" />
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-slate-900 text-white border-slate-700"
                  >
                    <p className="font-medium">{name}</p>
                    <p className="text-xs text-slate-300 uppercase">{role}</p>
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
                      className="w-10 h-10 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 hover:shadow-md transition-all duration-200 border border-red-200/60"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-slate-900 text-white border-slate-700"
                  >
                    Cerrar Sesión
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-1 border border-slate-200/60 shadow-sm">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 w-full px-3 py-3 hover:bg-white/80 rounded-lg transition-all duration-200 cursor-pointer group">
                    <div className="relative">
                      <Avatar className="w-12 h-12 ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-200">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                          {name?.[0]}
                        </AvatarFallback>
                        <AvatarImage src="" alt="Avatar" />
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>

                    <div className="flex-1 text-left flex flex-col overflow-hidden">
                      <span className="text-sm font-semibold text-slate-800 truncate">
                        {name}
                      </span>
                      <span className="text-xs text-slate-500 uppercase truncate font-medium">
                        {role}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-64 bg-white/95 backdrop-blur-sm border-slate-200/60 shadow-xl"
                  align="end"
                >
                  <DropdownMenuLabel className="font-semibold text-slate-800">
                    Mi Cuenta
                  </DropdownMenuLabel>

                  <DropdownMenuItem
                    onClick={() => handleProfile()}
                    className="gap-3 cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                  >
                    <UserCircle className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Perfil</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="gap-3 cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                    onClick={() => handleSettings()}
                  >
                    <Settings className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Configuración</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-slate-200/60" />

                  <DropdownMenuItem className="gap-3 cursor-pointer hover:bg-slate-50 transition-colors duration-200">
                    <Moon className="h-5 w-5 text-slate-600" />
                    <span className="font-medium">Apariencia</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="gap-3 cursor-pointer hover:bg-slate-50 transition-colors duration-200">
                    <LifeBuoy className="h-5 w-5 text-slate-600" />
                    <span className="font-medium">Soporte</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-slate-200/60" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="gap-3 text-red-600 focus:text-red-700 cursor-pointer hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Cerrar Sesión</span>
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
