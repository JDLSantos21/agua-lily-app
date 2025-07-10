"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Fuel, HandCoins, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { PiCashRegisterDuotone } from "react-icons/pi";
import { hasSpecialCashierAccess } from "@/utils/usersPermissions";
import { LuPackagePlus } from "react-icons/lu";

const navLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Inventario",
    href: "/inventario",
    icon: Package,
    accessRoles: ["administrativo", "operador", "admin"],
  },
  {
    name: "Combustible",
    href: "/combustible",
    icon: Fuel,
    accessRoles: ["administrativo", "operador", "admin"],
  },
  {
    name: "Gestión de Activos",
    href: "/activos",
    icon: HandCoins,
    accessRoles: ["administrativo", "operador", "admin"],
  },
  {
    name: "Caja",
    href: "/viajes",
    icon: PiCashRegisterDuotone,
    accessRoles: ["administrativo", "cajero", "admin"],
  },
  {
    name: "Clientes",
    href: "/clientes",
    icon: User,
    accessRoles: ["administrativo", "operador", "admin"],
  },
  {
    name: "Pedidos",
    href: "/orders",
    icon: LuPackagePlus,
    accessRoles: ["administrativo", "operador", "admin"],
  },
];

interface NavLinksProps {
  collapsed?: boolean;
}

export default function NavLinks({ collapsed = false }: NavLinksProps) {
  const { role, user_id } = useAuthStore();
  const pathname = usePathname();

  // Filtramos los enlaces según el rol del usuario
  const filteredLinks = navLinks.filter((link) => {
    // Si no tiene accessRoles definidos, siempre mostrar
    if (!link.accessRoles) return true;

    // Verificar primero por roles directos
    const hasAccess = role && link.accessRoles.includes(role);

    // Para el caso especial de "Caja", verificar si el usuario tiene acceso especial
    if (!hasAccess && link.name === "Caja" && role === "operador") {
      return hasSpecialCashierAccess(user_id);
    }

    return hasAccess;
  });

  return (
    <TooltipProvider delayDuration={300}>
      <nav className="flex flex-col space-y-2 w-full relative">
        {/* Indicador animado mejorado */}
        <div className="relative">
          {filteredLinks.map((link, index) => {
            const isActive = pathname.startsWith(link.href);

            if (isActive) {
              return (
                <motion.div
                  key="active-indicator"
                  className="absolute left-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full z-0 shadow-sm"
                  layoutId="activeIndicator"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 35,
                    mass: 0.8,
                  }}
                  style={{
                    top: `${index * 56 + 12}px`, // 56px = 48px altura del enlace + 8px gap, + 12px centrado
                    height: "24px", // altura centrada dentro del enlace
                  }}
                />
              );
            }
            return null;
          })}
        </div>

        {/* Enlaces de navegación mejorados */}
        {filteredLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);

          return (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative backdrop-blur-sm h-12", // altura fija
                    collapsed ? "justify-center" : "",
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold shadow-sm border border-blue-100/50"
                      : "text-slate-600 hover:bg-white/60 hover:text-slate-800 hover:shadow-sm border border-transparent hover:border-slate-200/60"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <link.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive
                        ? "text-blue-600"
                        : "text-slate-500 group-hover:text-slate-700"
                    )}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium">{link.name}</span>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className={
                  collapsed
                    ? "bg-slate-900 text-white border-slate-700"
                    : "hidden"
                }
              >
                {link.name}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}
