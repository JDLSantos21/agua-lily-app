import { FuelDashboard } from "./components/fuel-dashboard";

export default function Combustible() {
  return (
    <main className="flex-1 overflow-x-hidden max-h-[80%] overflow-y-auto p-6 ">
      <FuelDashboard />
    </main>
  );
}
