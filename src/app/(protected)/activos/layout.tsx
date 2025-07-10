import SideNav from "@/ui/sidenav/sidenav";
import { Settings } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-auto">
        <SideNav />
      </div>
      <div className="flex-grow md:overflow-y-auto">
        <div className="border-b bg-white px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Activos</h1>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
