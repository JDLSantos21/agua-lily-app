"use client";
import SideNav from "@/ui/sidenav/sidenav";
import FuelNav from "./components/fuel-nav";
import ReplenishmentFormDialog from "../inventario/components/replenishment-form-dialog";
import FuelResetDialog from "./components/fuel-reset-dialog";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <ReplenishmentFormDialog />
      <FuelResetDialog />
      <div className="w-full flex-none md:w-64 bg-slate-300">
        <SideNav />
      </div>
      <div className="flex-grow md:overflow-y-auto mx-auto">
        <FuelNav />
        <div className="mt-5 px-6 md:px-12">{children}</div>
      </div>
    </div>
  );
}
