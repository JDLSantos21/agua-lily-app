"use client";
import SideNav from "@/ui/sidenav/sidenav";
import TripsNav from "./components/trips-nav";
import { TripReportDialog } from "./components/trips-report-dialog";
import EditPendingTripDialog from "./components/edit-pending-trip-dialog";
import ChangeTripDateDialog from "./components/change-trip-date-dialog";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <TripReportDialog />
      <EditPendingTripDialog />
      <ChangeTripDateDialog />
      <div className="w-full flex-none md:w-64 bg-slate-300">
        <SideNav />
      </div>
      <div className="flex-grow md:overflow-y-auto mx-auto">
        <TripsNav />
        <div className="px-6 md:px-12">{children}</div>
      </div>
    </div>
  );
}
