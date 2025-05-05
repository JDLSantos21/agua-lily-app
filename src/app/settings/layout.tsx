import SettingsSideNav from "./components/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64 bg-slate-300">
        <SettingsSideNav />
      </div>
      <div className="flex-grow md:overflow-y-auto mx-auto">
        <div className="mt-5 px-6 md:px-12">{children}</div>
      </div>
    </div>
  );
}
