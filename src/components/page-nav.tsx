"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

// const navItems: NavItem[] = [
//   {
//     title: "Resumen",
//     href: "/combustible",
//     icon: <ChartPie className="h-5 w-5" />,
//   },
//   {
//     title: "Registro",
//     href: "/combustible/registro",
//     icon: <FilePen className="h-5 w-5" />,
//   },

//   {
//     title: "Consulta",
//     href: "/combustible/consulta",
//     icon: <FileSearch className="h-5 w-5" />,
//   },
//   {
//     title: "Reabastecimiento",
//     href: "/combustible/reabastecimiento",
//     icon: <Fuel className="h-5 w-5" />,
//   },
// ];

export default function PageNav({
  navItems,
  children,
}: {
  navItems: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <nav className="bg-white z-10 w-full sticky top-0 h-[100px] flex items-center px-6 md:px-12">
      <div className="mx-auto w-full">
        <div className="flex justify-between h-16 w-full">
          <div className="flex overflow-x-auto hide-scrollbar items-center space-x-10 w-full">
            <div className="flex space-x-8 items-center">
              {children}
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative inline-flex items-center px-1 pt-1 h-10 text-sm font-medium transition-colors group"
                  >
                    <span
                      className={cn(
                        "inline-flex items-center transition-colors duration-200",
                        isActive
                          ? "text-black"
                          : "text-gray-600 group-hover:text-gray-300"
                      )}
                    >
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                    </span>

                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600/80"
                        layoutId="activeTab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
