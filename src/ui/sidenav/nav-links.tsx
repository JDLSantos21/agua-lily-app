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
      <nav className="flex flex-col space-y-1 w-full relative">
        {/* Indicador animado que se desplaza entre enlaces activos */}
        <div className="relative">
          {filteredLinks.map((link, index) => {
            const isActive = pathname.startsWith(link.href);

            if (isActive) {
              return (
                <motion.div
                  key="active-indicator"
                  className="absolute left-0 w-1 bg-blue-600 rounded-r-md z-0"
                  layoutId="activeIndicator"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                  style={{
                    top: `${index * 42 + 10}px`, // 42px es aproximadamente el alto de cada enlace (py-2.5 * 16px)
                    height: "20px",
                  }}
                />
              );
            }
            return null;
          })}
        </div>

        {/* Enlaces de navegación */}
        {filteredLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);

          return (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-200 group relative",
                    collapsed ? "justify-center" : "",
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <link.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive
                        ? "text-blue-700"
                        : "text-gray-500 group-hover:text-gray-700"
                    )}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium">{link.name}</span>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className={collapsed ? "bg-gray-800 text-white" : "hidden"}
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
