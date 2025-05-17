"use client";
import SideNav from "@/ui/sidenav/sidenav";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64 bg-slate-300">
        <SideNav />
      </div>
      <div className="flex-grow md:overflow-y-auto">
        <div className="mx-auto">{children}</div>
      </div>
    </div>
  );
}
