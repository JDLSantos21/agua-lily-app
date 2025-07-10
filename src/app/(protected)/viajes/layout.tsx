"use client";
import SideNav from "@/ui/sidenav/sidenav";
import TripsNav from "./components/trips-nav";
import { TripReportDialog } from "./components/trips-report-dialog";
import EditPendingTripDialog from "./components/edit-pending-trip-dialog";

export default function Layout({ children }: { children: React.ReactNode }) {
  console.log("Layout de viajes renderizado");
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <TripReportDialog />
      <EditPendingTripDialog />
      <div className="w-full flex-none md:w-auto">
        <SideNav />
      </div>
      <div className="flex-grow md:overflow-y-auto mx-auto">
        <TripsNav />
        <div className="px-6 md:px-12 pt-2">{children}</div>
      </div>
    </div>
  );
}
