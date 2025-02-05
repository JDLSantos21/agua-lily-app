import TopNav from "@/components/Stock/top-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6 select-none mt-5">
      <TopNav />
      {children}
    </div>
  );
}
