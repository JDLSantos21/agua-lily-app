"use client";
import HandleBack from "@/components/handle-back";
import Link from "next/link";
import { BiPrinter } from "react-icons/bi";
import { PiPackageDuotone } from "react-icons/pi";
import { MdLabelOutline } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

export default function SettingsSideNav() {
  const pathname = usePathname();

  const links = [
    { href: "/settings", label: "General", icon: <CiSettings /> },
    { href: "/settings/printers", label: "Impresoras", icon: <BiPrinter /> },
    { href: "/settings/labels", label: "Etiquetas", icon: <MdLabelOutline /> },
    { href: "/settings/orders", label: "Pedidos", icon: <PiPackageDuotone /> },
  ];

  return (
    <div className="flex flex-col h-full p-4 bg-white shadow-sm border-r">
      <div className="flex items-center gap-2">
        <HandleBack customClassName="text-blue-500 hover:text-blue-600" />
        <h2 className="text-xl font-bold">Configuración</h2>
      </div>
      <Separator className="mt-6" />
      <ul className="space-y-2 py-4">
        {links.map((link) => (
          <li key={link.href} className="rounded-md">
            <Link
              href={link.href}
              className={`flex items-center gap-2 p-2 rounded-md ${
                pathname === link.href
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
              } transition-colors`}
            >
              {link.icon}
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
