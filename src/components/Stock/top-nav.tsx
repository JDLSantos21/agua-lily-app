"use client";
import { RoleBased } from "@/components/RoleBased";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Cog, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-between h-12">
      <RoleBased allowedRoles={["admin", "administrativo"]}>
        {pathname !== "/dashboard/stock" && (
          <Button
            variant={"outline"}
            className="flex mr-5"
            onClick={handleBack}
          >
            <ArrowLeft />
          </Button>
        )}
        <div className="flex space-x-2">
          <Link href={`/dashboard/stock/ajust`} className={`flex `}>
            <Cog /> <span className="ml-1">Ajuste</span>
          </Link>
        </div>
      </RoleBased>
    </div>
  );
}
