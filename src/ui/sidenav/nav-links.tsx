// nav-links.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package } from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventario", href: "/inventario", icon: Package },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-2 px-2">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-lg
              ${
                isActive
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <link.icon
              className={`h-5 w-5 ${
                isActive ? "text-blue-500" : "text-gray-400"
              }`}
            />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
