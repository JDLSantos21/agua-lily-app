// import StockBreadcrumb from "@/components/Stock/breadcrumb";
import SideNav from "@/ui/sidenav/sidenav";
import { FuelMenu } from "./components/nav-menu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64 bg-slate-300">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 mx-auto max-w-7xl">
        {/* <StockBreadcrumb /> */}
        <div className="space-y-6 select-none mt-5 h-12 mb-2">
          <FuelMenu />
        </div>
        {children}
      </div>
    </div>
  );
}
