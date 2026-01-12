"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, AlertTriangle, BarChart3, Search } from "lucide-react";

const navItems = [
  {
    label: "Clientes",
    href: "/clientes",
    icon: Users,
  },
  {
    label: "Alertas",
    href: "/clientes/alertas",
    icon: AlertTriangle,
  },
  {
    label: "Estadísticas",
    href: "/clientes/estadisticas",
    icon: BarChart3,
  },
  {
    label: "Búsqueda",
    href: "/clientes/busqueda",
    icon: Search,
  },
];

export function ClientesNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-6">
        <div className="flex gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2",
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
