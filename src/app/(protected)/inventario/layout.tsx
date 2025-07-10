"use client";
import SideNav from "@/ui/sidenav/sidenav";
import { InventoryReportDialog } from "./components/inventory-report-dialog";
import NewAjustDialog from "./components/new-ajusdment-dialog";
import InventoryNav from "./components/inventory-nav";
import { AdjustmentsSearchModal } from "./components/adjustments-search-modal";
import NewMaterialDialog from "./components/new-material-dialog";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <InventoryReportDialog />
      <NewAjustDialog />
      <AdjustmentsSearchModal />
      <NewMaterialDialog />
      <div className="w-full flex-none md:w-auto">
        <SideNav />
      </div>
      <div className="flex-grow md:overflow-y-auto mx-auto">
        <InventoryNav />
        <div className="mt-5 px-6">{children}</div>
      </div>
    </div>
  );
}
