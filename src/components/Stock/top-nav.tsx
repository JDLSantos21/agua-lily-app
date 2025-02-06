"use client";
import { RoleBased } from "@/components/RoleBased";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Cog, ArrowLeft, Plus } from "lucide-react";
import { Button } from "../ui/button";

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleBack = () => {
    router.push("/inventario");
  };

  return (
    <div className="flex items-center h-12 mb-2">
      <RoleBased allowedRoles={["admin", "administrativo"]}>
        {pathname !== "/inventario" && (
          <Button
            variant={"outline"}
            className="flex mr-5"
            onClick={handleBack}
          >
            <ArrowLeft />
          </Button>
        )}
        <div className="flex space-x-2 font-semibold uppercase">
          <Link
            href={`/inventario/ajuste`}
            className={`flex items-center text-sm mr-3`}
          >
            <Cog className="w-5 h-5" /> <span className="ml-1">Ajuste</span>
          </Link>

          <Link
            href={`/inventario/material`}
            className="flex items-center text-sm mr-3"
          >
            <Plus className="w-5 h-5" />
            <span className="ml-1">Añadir Material</span>
          </Link>
        </div>
      </RoleBased>
    </div>
  );
}
