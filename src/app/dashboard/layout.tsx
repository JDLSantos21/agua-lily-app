import StockBreadcrumb from "@/components/Stock/breadcrumb";
import SideNav from "@/ui/sidenav/sidenav";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64 bg-slate-300">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        <StockBreadcrumb />

        {children}
      </div>
    </div>
  );
}
