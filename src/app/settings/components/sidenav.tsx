"use client";
import HandleBack from "@/components/handle-back";
import Link from "next/link";

export default function SettingsSideNav() {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center gap-1">
        <HandleBack />
        <h2 className="text-xl font-bold">Configuración</h2>
      </div>
      <ul className="space-y-2 py-4">
        <li className="p-2 bg-slate-200 rounded-md">
          <Link href="/settings" className="text-blue-500 hover:underline">
            General
          </Link>
        </li>
        <li className="p-2 bg-slate-200 rounded-md">
          <Link
            href="/settings/printers"
            className="text-blue-500 hover:underline"
          >
            Impresoras
          </Link>
        </li>
      </ul>
    </div>
  );
}
