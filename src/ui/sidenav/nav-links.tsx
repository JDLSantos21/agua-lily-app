// nav-links.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Fuel, HandCoins, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";

const links = [
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
    name: "Viajes",
    href: "/viajes",
    icon: Truck,
    accessRoles: ["administrativo", "cajero", "admin"],
  },
];

export default function NavLinks() {
  const { role } = useAuthStore();
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-2 px-2">
      {links.map((link) => {
        if (link.accessRoles && role) {
          if (!link.accessRoles.includes(role)) {
            return null;
          }
        }
        const isActive = pathname.startsWith(link.href);
        return (
          <motion.div key={link.href} className="relative group">
            <Link
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 w-full text-sm transition-all rounded-lg relative text-gray-700 hover:bg-gray-200/50 ${!isActive && "hover:text-gray-600"} ${isActive && "font-bold text-white"} `}
            >
              <div className={`z-10 flex gap-3 `}>
                <link.icon className={`h-5 w-5`} />
                <span>{link.name}</span>
              </div>
            </Link>
            {isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                layoutId="ActiveSection"
                className={`absolute top-0 h-full w-full z-0 rounded  ${
                  isActive
                    ? "bg-blue-600 shadow-md"
                    : "group-hover:bg-gray-300 hover:text-gray-900"
                } `}
              />
            )}
          </motion.div>
        );
      })}
    </nav>
  );
}
