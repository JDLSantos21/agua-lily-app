"use client";
import SideNav from "@/ui/sidenav/sidenav";
import { InventoryReportDialog } from "./components/inventory-report-dialog";
import NewAjustDialog from "./components/new-ajusdment-dialog";
import InventoryNav from "./components/inventory-nav";
import { AdjustmentsSearchModal } from "./components/adjustments-search-modal";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <InventoryReportDialog />
      <NewAjustDialog />
      <AdjustmentsSearchModal />
      <div className="w-full flex-none md:w-64 bg-slate-300">
        <SideNav />
      </div>
      <div className="flex-grow md:overflow-y-auto mx-auto">
        <InventoryNav />
        <div className="mt-5 px-6 md:px-12">{children}</div>
      </div>
    </div>
  );
}
